require('dotenv').config()
const connectDB = require('./db/connect')
const Post = require('./models/Post')
const Likes = require('./models/Likes')
const Bookmarks = require('./models/Bookmarks')
const Sharedposts = require('./models/Sharedposts')
const { fetchFeaturedPapers } = require('./lib/paperswithcode')
const { fetchPapers } = require('./lib/arxiv')

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

  try {
    console.log('Fetching arXiv AI papers (page 1)...')
    aiPapers = await fetchPapers('ai', 0)
    console.log(`Got ${aiPapers.length} arXiv AI papers`)
    await new Promise(r => setTimeout(r, 5000))
    console.log('Fetching arXiv AI papers (page 2)...')
    mlPapers = await fetchPapers('ai', 10)
    console.log(`Got ${mlPapers.length} more arXiv papers`)
  } catch (e) {
    console.warn(`arXiv unavailable (${e.message})${arxivOnly ? ' — try again in a few minutes' : ' — seeding with HF only'}`)
    if (arxivOnly) { process.exit(1) }
  }

  const allPapers = [...hfPapers, ...aiPapers, ...mlPapers]

  const posts_to_insert = allPapers
    .filter(p => p.title && p.abstract)
    .map(p => ({
      title: p.title,
      authors: Array.isArray(p.authors)
        ? p.authors.slice(0, 4).join(', ')
        : (p.authors || 'Unknown'),
      university: p.venue || p.category || 'arXiv',
      abstract: p.abstract,
      arxivId: p.id || null,
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
