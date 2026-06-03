const { fetchPapers, fetchPaperById } = require('../lib/arxiv')
const { fetchFeaturedPapers } = require('../lib/paperswithcode')
const { fetchCitations } = require('../lib/openalex')
const cache = require('../lib/cache')
const Post = require('../models/Post')

// Last successful arXiv payload per topic:start — served when arXiv is throttled/down
const lastGood = {}

// Circuit breaker: after an arXiv failure, skip arXiv for this long and serve fallback instantly
let arxivDownUntil = 0
const ARXIV_COOLDOWN_MS = 60000

// Category prefixes per topic — used to filter DB fallback by topic
const TOPIC_CATEGORY_RE = {
  ai:   /^cs\.(AI|LG|NE)/,
  math: /^math\./,
  hw:   /^(cs\.AR|eess\.)/,
  cs:   /^cs\.(DS|CC|DC)/,
}

// Map seeded DB posts to the Paper shape — final fallback when arXiv is unreachable
async function dbFallback(topic, start) {
  const re = TOPIC_CATEGORY_RE[topic]
  const query = re ? { category: { $regex: re } } : {}
  const docs = await Post.find(query)
    .sort({ createdAt: -1 })
    .skip(start)
    .limit(10)
    .lean()

  return docs.map(d => ({
    id: d.arxivId || String(d._id),
    title: d.title,
    abstract: d.abstract || '',
    authors: d.authors ? String(d.authors).split(',').map(s => s.trim()) : [],
    date: d.date || '',
    pdf: d.arxivId ? `https://arxiv.org/pdf/${d.arxivId}` : null,
    link: d.arxivId ? `https://arxiv.org/abs/${d.arxivId}` : null,
    thumbnail: d.arxivId ? `https://arxiv.org/html/${d.arxivId}/x1.png` : null,
    category: d.category || 'cs.AI',
    topic,
    citedBy: d.citations || 0,
    venue: null,
    doi: null,
    hasCode: false,
    codeUrl: null,
    source: 'db',
  }))
}

const getPapers = async (req, res, next) => {
  try {
    const topic = req.query.topic || 'ai'
    const start = parseInt(req.query.start, 10) || 0
    const key = `papers:${topic}:${start}`

    const cached = cache.get(key)
    if (cached) return res.json(cached)

    // Circuit open: arXiv recently failed — serve fallback immediately, don't wait on it
    if (Date.now() < arxivDownUntil) {
      if (lastGood[key]) return res.json(lastGood[key])
      const fallback = await dbFallback(topic, start)
      const payload = { papers: fallback, nextStart: fallback.length === 10 ? start + 10 : null }
      cache.set(key, payload, 120)
      return res.json(payload)
    }

    try {
      const arxivPapers = await fetchPapers(topic, start)
      let papers = arxivPapers.map(p => ({ ...p, hasCode: false, codeUrl: null, source: 'arxiv' }))

      const ids = papers.map(p => p.id).filter(Boolean)
      const citationMap = await fetchCitations(ids)
      papers = papers.map(paper => ({
        ...paper,
        citedBy: citationMap[paper.id]?.citedBy ?? 0,
        venue: citationMap[paper.id]?.venue ?? paper.venue ?? null,
        doi: citationMap[paper.id]?.doi ?? paper.doi ?? null,
      }))

      const nextStart = arxivPapers.length === 10 ? start + 10 : null
      const payload = { papers, nextStart }
      lastGood[key] = payload
      cache.set(key, payload)
      return res.json(payload)
    } catch (arxivErr) {
      // arXiv throttled/down — trip the breaker, serve last-good snapshot, else seeded DB papers
      arxivDownUntil = Date.now() + ARXIV_COOLDOWN_MS
      if (lastGood[key]) return res.json(lastGood[key])
      const fallback = await dbFallback(topic, start)
      const payload = { papers: fallback, nextStart: fallback.length === 10 ? start + 10 : null }
      cache.set(key, payload, 120) // short TTL — retry arXiv after cooldown
      return res.json(payload)
    }
  } catch (error) {
    next(error)
  }
}

const getPaper = async (req, res, next) => {
  try {
    const { id } = req.params
    const key = `paper:${id}`

    const cached = cache.get(key)
    if (cached) return res.json(cached)

    // If paper is already in a topic feed cache, it's fully enriched — return as-is.
    const topics = ['ai', 'math', 'hw', 'cs']
    for (const topic of topics) {
      for (let start = 0; start <= 30; start += 10) {
        const feed = cache.get(`papers:${topic}:${start}`)
        const found = feed?.papers?.find(p => p.id === id)
        if (found) {
          const payload = { paper: found }
          cache.set(key, payload)
          return res.json(payload)
        }
      }
    }

    // Not cached — fetch fresh from arXiv. Fall back to DB if arXiv is down.
    let paper
    try {
      paper = await fetchPaperById(id)
    } catch (arxivErr) {
      const doc = await Post.findOne({ arxivId: id }).lean()
      if (doc) {
        const fb = {
          id: doc.arxivId, title: doc.title, abstract: doc.abstract || '',
          authors: doc.authors ? String(doc.authors).split(',').map(s => s.trim()) : [],
          date: doc.date || '', pdf: `https://arxiv.org/pdf/${doc.arxivId}`,
          link: `https://arxiv.org/abs/${doc.arxivId}`,
          thumbnail: `https://arxiv.org/html/${doc.arxivId}/x1.png`,
          category: doc.category || 'cs.AI', topic: 'ai',
          citedBy: doc.citations || 0, venue: null, doi: null,
          hasCode: false, codeUrl: null, source: 'db',
        }
        const payload = { paper: fb }
        cache.set(key, payload, 120)
        return res.json(payload)
      }
      return res.status(503).json({ message: 'Paper source temporarily unavailable' })
    }
    if (!paper) return res.status(404).json({ message: 'Paper not found' })

    const citationMap = await fetchCitations([paper.id])
    const enriched = {
      ...paper,
      hasCode: false,
      codeUrl: null,
      source: 'arxiv',
      citedBy: citationMap[paper.id]?.citedBy ?? 0,
      venue: citationMap[paper.id]?.venue ?? null,
      doi: citationMap[paper.id]?.doi ?? null,
    }

    cache.set(key, { paper: enriched })
    res.json({ paper: enriched })
  } catch (error) {
    next(error)
  }
}

const getFeatured = async (req, res, next) => {
  try {
    const key = 'papers:featured'
    const cached = cache.get(key)
    if (cached) return res.json(cached)

    const papers = await fetchFeaturedPapers()
    const payload = { papers }
    cache.set(key, payload, 3600) // 1hr — changes slowly
    res.json(payload)
  } catch (error) {
    next(error)
  }
}

module.exports = { getPapers, getPaper, getFeatured }
