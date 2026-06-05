const Post = require('../models/Post')

// Resolve a Post from a request body. Either:
//   { post: <mongoId> }        → existing seeded/user post
//   { arxivId, title, ... }    → external paper (arXiv/HF); upsert a Post for it
// Returns the Post document, or null if nothing usable was provided.
async function resolvePost(body) {
  if (body.post) {
    return Post.findById(body.post)
  }

  if (body.arxivId) {
    // Upsert by arxivId so the same paper maps to one Post
    return Post.findOneAndUpdate(
      { arxivId: body.arxivId },
      {
        $setOnInsert: {
          arxivId: body.arxivId,
          title: body.title || 'Untitled',
          authors: Array.isArray(body.authors) ? body.authors.slice(0, 6).join(', ') : (body.authors || 'Unknown'),
          university: body.venue || body.category || 'arXiv',
          abstract: body.abstract || '',
          category: body.category || 'cs.AI',
          date: body.date || '',
          citations: body.citedBy || 0,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
  }

  return null
}

module.exports = resolvePost
