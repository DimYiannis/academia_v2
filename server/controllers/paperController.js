const { fetchPapers, fetchPaperById } = require('../lib/arxiv')
const { fetchPwCPapers } = require('../lib/paperswithcode')
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
      const page = Math.floor(start / 10) + 1
      const pwcPapers = await fetchPwCPapers(page)

      // Index arXiv papers by ID for O(1) enrichment lookup
      const arxivMap = {}
      for (const p of papers) arxivMap[p.id] = p

      for (const pwc of pwcPapers) {
        if (pwc.arxivId && arxivMap[pwc.arxivId]) {
          // Enrich matching arXiv paper with code info
          arxivMap[pwc.arxivId].hasCode = pwc.hasCode
          arxivMap[pwc.arxivId].codeUrl = pwc.codeUrl
          if (pwc.hasCode) arxivMap[pwc.arxivId].source = 'arxiv+pwc'
        } else if (pwc.id && !arxivMap[pwc.id]) {
          // PwC-only paper — not on arXiv
          papers.push(pwc)
          arxivMap[pwc.id] = pwc
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

    const paper = await fetchPaperById(id)
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

module.exports = { getPapers, getPaper }
