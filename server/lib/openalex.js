const OPENALEX_BASE = 'https://api.openalex.org/works'

async function fetchCitations(arxivIds) {
  if (!arxivIds.length) return {}

  const email = process.env.OPENALEX_EMAIL || ''
  const filter = `ids.arxiv:${arxivIds.join('|')}`
  const mailtoParam = email ? `&mailto=${encodeURIComponent(email)}` : ''
  const url = `${OPENALEX_BASE}?filter=${encodeURIComponent(filter)}&per_page=50${mailtoParam}`

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return {}
    const data = await res.json()

    const map = {}
    for (const work of (data.results || [])) {
      const rawArxiv = work.ids?.arxiv || ''
      const arxivId = rawArxiv
        .replace('https://arxiv.org/abs/', '')
        .replace('http://arxiv.org/abs/', '')
        .replace(/v\d+$/, '')
      if (arxivId) {
        map[arxivId] = {
          citedBy: work.cited_by_count || 0,
          venue: work.primary_location?.source?.display_name || null,
          doi: work.doi ? work.doi.replace('https://doi.org/', '') : null,
        }
      }
    }
    return map
  } catch {
    return {}
  }
}

module.exports = { fetchCitations }
