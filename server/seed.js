require('dotenv').config()
const connectDB = require('./db/connect')
const Post = require('./models/Post')
const Likes = require('./models/Likes')
const Bookmarks = require('./models/Bookmarks')
const Sharedposts = require('./models/Sharedposts')
const { fetchFeaturedPapers } = require('./lib/paperswithcode')
const { fetchPapers } = require('./lib/arxiv')
const { fetchSSPapers } = require('./lib/semanticscholar')

const seed = async () => {
  await connectDB(process.env.MONGO_URL)
  console.log('Connected to MongoDB')

  const arxivOnly = process.argv.includes('--arxiv-only')

  if (!arxivOnly) {
    // Full reset: clear everything and re-seed HF + arXiv
    const [posts, likes, bookmarks, shares] = await Promise.all([
      Post.countDocuments(), Likes.countDocuments(),
      Bookmarks.countDocuments(), Sharedposts.countDocuments(),
    ])
    console.log(`Deleting: ${posts} posts, ${likes} likes, ${bookmarks} bookmarks, ${shares} shared posts`)
    await Promise.all([Post.deleteMany({}), Likes.deleteMany({}), Bookmarks.deleteMany({}), Sharedposts.deleteMany({})])
  } else {
    console.log('--arxiv-only: skipping deletion, appending arXiv papers only')
  }

  let hfPapers = []
  if (!arxivOnly) {
    console.log('Fetching HuggingFace daily papers...')
    hfPapers = await fetchFeaturedPapers()
    console.log(`Got ${hfPapers.length} HF papers`)
  }

  let aiPapers = []
  let mlPapers = []
  let ssPapers = []

  // Try Semantic Scholar first (higher quality, citation counts included)
  try {
    console.log('Fetching Semantic Scholar — LLMs...')
    const ss1 = await fetchSSPapers('large language models', 15, 0)
    console.log(`Got ${ss1.length} SS papers`)
    await new Promise(r => setTimeout(r, 3000))
    console.log('Fetching Semantic Scholar — deep learning...')
    const ss2 = await fetchSSPapers('deep learning transformer', 15, 0)
    console.log(`Got ${ss2.length} SS papers`)
    // Deduplicate by id
    const seen = new Set(ss1.map(p => p.id))
    ssPapers = [...ss1, ...ss2.filter(p => !seen.has(p.id))]
    console.log(`Total unique SS papers: ${ssPapers.length}`)
  } catch (e) {
    console.warn(`Semantic Scholar unavailable (${e.message}) — trying arXiv...`)
  }

  // Seed every topic from arXiv so each has data even when arXiv is later down.
  // Sequential with delay to respect arXiv rate limits.
  let gotAny = false
  for (const topic of ['ai', 'math', 'hw', 'cs']) {
    try {
      const papers = await fetchPapers(topic, 0)
      aiPapers.push(...papers)
      gotAny = true
      console.log(`arXiv ${topic}: ${papers.length} papers`)
      await new Promise(r => setTimeout(r, 4000))
    } catch (e2) {
      console.warn(`arXiv ${topic} failed (${e2.message})`)
    }
  }
  if (arxivOnly && !gotAny && !ssPapers.length) {
    console.warn('No arXiv/SS papers fetched — try again later')
    process.exit(1)
  }

  const allPapers = [...hfPapers, ...ssPapers, ...aiPapers, ...mlPapers]

  // Dedup against papers already in DB (arxiv-only re-runs) and within this batch
  const existing = new Set((await Post.find({}, 'arxivId').lean()).map(d => d.arxivId).filter(Boolean))
  const batchSeen = new Set()

  const posts_to_insert = allPapers
    .filter(p => p.title && p.abstract)
    .filter(p => {
      if (!p.id) return true
      if (existing.has(p.id) || batchSeen.has(p.id)) return false
      batchSeen.add(p.id)
      return true
    })
    .map(p => ({
      title: p.title,
      authors: Array.isArray(p.authors)
        ? p.authors.slice(0, 4).join(', ')
        : (p.authors || 'Unknown'),
      university: p.venue || p.category || 'arXiv',
      abstract: p.abstract,
      arxivId: p.id || null,
      category: p.category || 'cs.AI',
      date: p.date
        ? new Date(p.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : '',
      citations: p.citedBy || 0,
    }))

  await Post.insertMany(posts_to_insert)
  console.log(`✓ Seeded ${posts_to_insert.length} real papers into MongoDB`)
  process.exit(0)
}

seed().catch(e => {
  console.error('Seed failed:', e.message)
  process.exit(1)
})
