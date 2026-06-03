const SS_BASE = 'https://api.semanticscholar.org/graph/v1'
const FIELDS = 'title,abstract,authors,year,citationCount,externalIds,openAccessPdf,publicationDate,venue'

// Fetch high-citation ML/AI papers from Semantic Scholar
async function fetchSSPapers(query = 'large language models', limit = 20, offset = 0) {
  const apiKey = process.env.SEMANTIC_SCHOLAR_KEY || ''
  const headers = { 'User-Agent': `Academia/2.0 (research app; ${process.env.OPENALEX_EMAIL || ''})` }
  if (apiKey) headers['x-api-key'] = apiKey

  const url = `${SS_BASE}/paper/search?query=${encodeURIComponent(query)}&fields=${FIELDS}&limit=${limit}&offset=${offset}`

  try {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(10000) })
    if (res.status === 429) throw new Error('Semantic Scholar rate limited (429)')
    if (!res.ok) throw new Error(`Semantic Scholar fetch failed: ${res.status}`)
    const data = await res.json()

    return (data.data || []).map(p => {
      const arxivId = p.externalIds?.ArXiv || null
      const authors = (p.authors || []).map(a => a.name)
      return {
        id: arxivId || p.paperId,
        title: (p.title || '').trim(),
        abstract: (p.abstract || '').trim(),
        authors,
        date: p.publicationDate || (p.year ? `${p.year}-01-01` : ''),
        pdf: p.openAccessPdf?.url || (arxivId ? `https://arxiv.org/pdf/${arxivId}` : null),
        link: arxivId ? `https://arxiv.org/abs/${arxivId}` : `https://www.semanticscholar.org/paper/${p.paperId}`,
        thumbnail: arxivId ? `https://arxiv.org/html/${arxivId}/x1.png` : null,
        category: 'cs.AI',
        topic: 'ai',
        citedBy: p.citationCount || 0,
        venue: p.venue || null,
        doi: p.externalIds?.DOI || null,
        hasCode: false,
        codeUrl: null,
        source: 'semantic-scholar',
      }
    }).filter(p => p.title && p.abstract)
  } catch (e) {
    throw e
  }
}

module.exports = { fetchSSPapers }
