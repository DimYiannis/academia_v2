const { fetchPapers } = require('../lib/arxiv')
const { fetchCitations } = require('../lib/openalex')
const cache = require('../lib/cache')

const getPapers = async (req, res, next) => {
  try {
    const topic = req.query.topic || 'ai'
    const start = parseInt(req.query.start, 10) || 0
    const key = `papers:${topic}:${start}`

    const cached = cache.get(key)
    if (cached) return res.json(cached)

    const papers = await fetchPapers(topic, start)

    const ids = papers.map(p => p.id).filter(Boolean)
    const citationMap = await fetchCitations(ids)

    const enriched = papers.map(paper => ({
      ...paper,
      citedBy: citationMap[paper.id]?.citedBy ?? 0,
      venue: citationMap[paper.id]?.venue ?? null,
      doi: citationMap[paper.id]?.doi ?? null,
    }))

    const nextStart = papers.length === 10 ? start + 10 : null
    const payload = { papers: enriched, nextStart }

    cache.set(key, payload)
    res.json(payload)
  } catch (error) {
    next(error)
  }
}

module.exports = { getPapers }
