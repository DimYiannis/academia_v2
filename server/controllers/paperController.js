const { fetchPapers, fetchPaperById } = require('../lib/arxiv')
const { fetchCodeForPapers, fetchFeaturedPapers } = require('../lib/paperswithcode')
const { fetchCitations } = require('../lib/openalex')
const cache = require('../lib/cache')

const getPapers = async (req, res, next) => {
  try {
    const topic = req.query.topic || 'ai'
    const start = parseInt(req.query.start, 10) || 0
    const key = `papers:${topic}:${start}`

    const cached = cache.get(key)
    if (cached) return res.json(cached)

    const arxivPapers = await fetchPapers(topic, start)
    let papers = arxivPapers.map(p => ({ ...p, hasCode: false, codeUrl: null, source: 'arxiv' }))

    if (topic === 'ai') {
      const ids = papers.map(p => p.id)
      const codeMap = await fetchCodeForPapers(ids)

      for (const paper of papers) {
        const pwc = codeMap[paper.id]
        if (pwc) {
          paper.hasCode = pwc.hasCode
          paper.codeUrl = pwc.codeUrl
          if (pwc.hasCode) paper.source = 'arxiv+pwc'
        }
      }
    }

    const ids = papers.map(p => p.id).filter(Boolean)
    const citationMap = await fetchCitations(ids)

    const enriched = papers.map(paper => ({
      ...paper,
      citedBy: citationMap[paper.id]?.citedBy ?? 0,
      venue: citationMap[paper.id]?.venue ?? paper.venue ?? null,
      doi: citationMap[paper.id]?.doi ?? paper.doi ?? null,
    }))

    const nextStart = arxivPapers.length === 10 ? start + 10 : null
    const payload = { papers: enriched, nextStart }

    cache.set(key, payload)
    res.json(payload)
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

    // Check if paper is already in a topic feed cache — skip arXiv fetch if so
    let paper = null
    const topics = ['ai', 'math', 'hw', 'cs']
    for (const topic of topics) {
      for (let start = 0; start <= 30; start += 10) {
        const feed = cache.get(`papers:${topic}:${start}`)
        if (feed?.papers) {
          const found = feed.papers.find(p => p.id === id)
          if (found) { paper = found; break }
        }
      }
      if (paper) break
    }

    if (!paper) paper = await fetchPaperById(id)
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
