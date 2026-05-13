const { XMLParser } = require('fast-xml-parser')

const ARXIV_BASE = 'https://export.arxiv.org/api/query'
const RESULTS_PER_PAGE = 10

const ARXIV_CATEGORIES = {
  ai:   'cat:cs.AI OR cat:cs.LG OR cat:cs.NE',
  math: 'cat:math.NT OR cat:math.CO OR cat:math.AG',
  hw:   'cat:cs.AR OR cat:eess.SP',
  cs:   'cat:cs.DS OR cat:cs.CC OR cat:cs.DC',
}

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })

async function fetchPapers(topic = 'ai', start = 0) {
  const search_query = ARXIV_CATEGORIES[topic] || ARXIV_CATEGORIES.ai
  const url = `${ARXIV_BASE}?search_query=${encodeURIComponent(search_query)}&start=${start}&max_results=${RESULTS_PER_PAGE}&sortBy=submittedDate&sortOrder=descending`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`arXiv fetch failed: ${res.status}`)
  const xml = await res.text()

  const parsed = parser.parse(xml)
  const entries = parsed.feed?.entry
  if (!entries) return []

  const list = Array.isArray(entries) ? entries : [entries]

  return list.map(entry => {
    const rawId = String(entry.id || '')
    const id = rawId.replace('http://arxiv.org/abs/', '').replace(/v\d+$/, '')

    const authorRaw = entry.author || []
    const authorList = Array.isArray(authorRaw) ? authorRaw : [authorRaw]
    const authors = authorList.map(a => a.name).filter(Boolean)

    const category = entry['arxiv:primary_category']?.['@_term'] || ''

    return {
      id,
      title: String(entry.title || '').replace(/\s+/g, ' ').trim(),
      abstract: String(entry.summary || '').replace(/\s+/g, ' ').trim(),
      authors,
      date: entry.published || '',
      pdf: `https://arxiv.org/pdf/${id}`,
      link: `https://arxiv.org/abs/${id}`,
      category,
      topic,
      citedBy: 0,
      venue: null,
      doi: null,
    }
  })
}

module.exports = { fetchPapers, ARXIV_CATEGORIES }
