const PwC_BASE = 'https://paperswithcode.com/api/v1'

async function fetchPwCPapers(page = 1) {
  const url = `${PwC_BASE}/papers/?ordering=-published&page=${page}`
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return []
    const data = await res.json()

    return (data.results || []).map(p => {
      const repos = p.repositories || []
      const hasCode = repos.length > 0
      const codeUrl = repos[0]?.url || null
      const arxivId = p.arxiv_id || null
      const id = arxivId || String(p.id)

      return {
        id,
        arxivId,
        title: (p.title || '').trim(),
        abstract: (p.abstract || '').trim(),
        authors: Array.isArray(p.authors) ? p.authors : (p.authors ? [p.authors] : []),
        date: p.published || '',
        pdf: p.url_pdf || (arxivId ? `https://arxiv.org/pdf/${arxivId}` : null),
        link: p.url_abs || (arxivId ? `https://arxiv.org/abs/${arxivId}` : null),
        category: (p.tasks && p.tasks[0]?.name) || 'Machine Learning',
        topic: 'ai',
        citedBy: 0,
        venue: null,
        doi: null,
        hasCode,
        codeUrl,
        source: 'pwc',
      }
    })
  } catch {
    return []
  }
}

module.exports = { fetchPwCPapers }
