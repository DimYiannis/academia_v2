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

function mapEntry(entry, defaultTopic = 'ai') {
  const rawId = String(entry.id || '')
  const id = rawId.replace(/^https?:\/\/arxiv\.org\/abs\//, '').replace(/v\d+$/, '')

  const authorRaw = entry.author || []
  const authorList = Array.isArray(authorRaw) ? authorRaw : [authorRaw]
  const authors = authorList.map(a => a.name).filter(Boolean)

  const category = entry['arxiv:primary_category']?.['@_term'] || ''

  let topic = defaultTopic
  if (/^cs\.(AI|LG|NE)/.test(category)) topic = 'ai'
  else if (/^math\./.test(category)) topic = 'math'
  else if (/^(cs\.AR|eess\.)/.test(category)) topic = 'hw'
  else if (/^cs\.(DS|CC|DC)/.test(category)) topic = 'cs'

  return {
    id,
    title: String(entry.title || '').replace(/\s+/g, ' ').trim(),
    abstract: String(entry.summary || '').replace(/\s+/g, ' ').trim(),
    authors,
    date: entry.published || '',
    pdf: `https://arxiv.org/pdf/${id}`,
    link: `https://arxiv.org/abs/${id}`,
    thumbnail: `https://arxiv.org/html/${id}/x1.png`,
    category,
    topic,
    citedBy: 0,
    venue: null,
    doi: null,
  }
}

async function arxivFetch(url, attempt = 0) {
  const MAX_ATTEMPTS = 2
  let res
  try {
    res = await fetch(url, {
      headers: { 'User-Agent': 'AcademiaV2/1.0 (research feed)' },
      signal: AbortSignal.timeout(6000),
    })
  } catch (e) {
    // Network error / timeout — retry once, then bubble up so caller can fall back
    if (attempt < MAX_ATTEMPTS - 1) {
      await new Promise(r => setTimeout(r, 1000))
      return arxivFetch(url, attempt + 1)
    }
    throw new Error(`arXiv fetch failed: ${e.name === 'TimeoutError' ? 'timeout' : e.message}`)
  }
  if ((res.status === 429 || res.status === 503) && attempt < MAX_ATTEMPTS - 1) {
    await new Promise(r => setTimeout(r, 1500))
    return arxivFetch(url, attempt + 1)
  }
  if (!res.ok) throw new Error(`arXiv fetch failed: ${res.status}`)
  return res
}

async function fetchPapers(topic = 'ai', start = 0) {
  const search_query = ARXIV_CATEGORIES[topic] || ARXIV_CATEGORIES.ai
  const url = `${ARXIV_BASE}?search_query=${encodeURIComponent(search_query)}&start=${start}&max_results=${RESULTS_PER_PAGE}&sortBy=submittedDate&sortOrder=descending`

  const res = await arxivFetch(url)
  const xml = await res.text()

  const parsed = parser.parse(xml)
  const entries = parsed.feed?.entry
  if (!entries) return []

  const list = Array.isArray(entries) ? entries : [entries]
  return list.map(entry => mapEntry(entry, topic))
}

async function fetchPaperById(id) {
  const url = `${ARXIV_BASE}?id_list=${encodeURIComponent(id)}`
  const res = await arxivFetch(url)
  const xml = await res.text()

  const parsed = parser.parse(xml)
  const entries = parsed.feed?.entry
  if (!entries) return null

  const list = Array.isArray(entries) ? entries : [entries]
  return mapEntry(list[0], 'ai')
}

module.exports = { fetchPapers, fetchPaperById, ARXIV_CATEGORIES }
