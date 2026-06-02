const PwC_BASE = 'https://paperswithcode.com/api/v1'

// Lookup code repos for specific arXiv IDs via PwC's filter endpoint
async function fetchCodeForPapers(arxivIds) {
  if (!arxivIds.length) return {}

  const requests = arxivIds.map(async (id) => {
    try {
      const url = `${PwC_BASE}/papers/?arxiv_id=${encodeURIComponent(id)}`
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
      if (!res.ok) return null
      const data = await res.json()
      const paper = data.results?.[0]
      if (!paper) return null
      const repos = paper.repositories || []
      return {
        id,
        hasCode: repos.length > 0,
        codeUrl: repos[0]?.url || null,
      }
    } catch {
      return null
    }
  })

  const results = await Promise.allSettled(requests)
  const map = {}
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value) {
      map[r.value.id] = r.value
    }
  }
  return map
}

const HF_PAPERS_URL = 'https://huggingface.co/api/daily_papers'

// Fetch HuggingFace daily curated ML papers
async function fetchFeaturedPapers() {
  try {
    const res = await fetch(HF_PAPERS_URL, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return []
    const data = await res.json()
    const items = Array.isArray(data) ? data : []

    return items.map(item => {
      const p = item.paper || {}
      const id = p.id || ''
      const authors = (p.authors || []).map(a => a.name).filter(Boolean)
      return {
        id,
        title: (item.title || p.title || '').trim(),
        abstract: (item.summary || p.summary || '').trim(),
        authors,
        date: item.publishedAt || p.publishedAt || '',
        pdf: id ? `https://arxiv.org/pdf/${id}` : null,
        link: id ? `https://arxiv.org/abs/${id}` : null,
        category: 'cs.AI',
        topic: 'ai',
        citedBy: 0,
        venue: null,
        doi: null,
        hasCode: false,
        codeUrl: null,
        upvotes: p.upvotes || 0,
        source: 'hf',
      }
    }).filter(p => p.id)
  } catch {
    return []
  }
}

module.exports = { fetchCodeForPapers, fetchFeaturedPapers }
