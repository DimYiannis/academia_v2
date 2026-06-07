# Academia v2

**Your daily AI research feed.** Academia tracks the latest in AI/ML — pulling live papers from **arXiv**, **HuggingFace Daily Papers**, and **OpenAlex**. Like, save, and take private notes on what matters, then explore it all as a personal knowledge graph.

🔗 Live: https://academiav2.netlify.app

<img width="1316" alt="Academia" src="https://github.com/DimYiannis/academia_v2/assets/107484245/2afc226c-cf6f-46ed-9cf6-28d7f148cf2e">

---

## Features

- **Live AI research** — daily curated ML papers from HuggingFace, latest arXiv submissions, OpenAlex citation counts & venues.
- **Topics** — AI & ML (default), plus Mathematics, Hardware, CS Theory. Each shows topic-relevant papers.
- **Feed modes** — Latest, Most Cited, Trending, Saved.
- **Like / Save / Note** any paper — works on external papers via arXiv-ID upsert.
- **Notes** — write private annotations per paper (no public sharing).
- **Knowledge graph** — force-directed map of the AI papers you've liked; drag nodes, click to read the abstract or your note. Nodes colored by topic, edges link shared topics/authors.
- **Search & filters** — title/author search, category filter (hot topics), last-30-days, has-citations.
- **Resilient pipeline** — timeout-bounded arXiv fetch with a circuit breaker and MongoDB fallback; the feed never hard-fails when an upstream is throttled.
- **Responsive** — mobile / tablet / desktop layouts.
- **Auth** — JWT cookie auth (register / login / demo account).

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Nuxt 3 (Vue 3), Tailwind CSS |
| Backend | Express, MongoDB (Mongoose) |
| Data | arXiv API · HuggingFace Daily Papers · OpenAlex · (Semantic Scholar optional) |
| Caching | node-cache (in-memory) |

---

## Architecture

```
client/                 # Nuxt 3 frontend
  composables/          # usePapers (feed), useSearch
  components/           # PaperGraph (knowledge graph), edit, LoadSpinner
  layouts/dashboard.vue # authed shell (navbar, responsive grid)
  pages/dashboard/      # feed (index), bookmarks, Profile, user/[_id]
  pages/article/[doi]   # single paper detail

server/                 # Express + MongoDB
  lib/                  # arxiv, openalex, paperswithcode (HF), semanticscholar, cache
  controllers/          # papers, notes, likes, bookmarks, auth, user
  routes/  models/  utils/  middleware/
  seed.js               # seed DB with real papers
```

Paper data flows through Express only (never called from the browser). The unified `Paper` shape is consistent across arXiv / HF / OpenAlex sources.

---

## Getting started

### Prerequisites
- Node.js + npm
- A MongoDB connection string

### Environment

```bash
# server/.env
MONGO_URL=mongodb+srv://...
JWT_SECRET=your_secret
JWT_LIFETIME=1d
OPENALEX_EMAIL=you@example.com        # polite-pool access (optional)
# SEMANTIC_SCHOLAR_KEY=...            # optional, higher rate limits
```

The frontend auto-targets `http://localhost:5000` in dev and the production API otherwise (via `import.meta.dev`) — no client env needed for local work.

### Install & run

```bash
# backend
cd server
npm install
npm start                # http://localhost:5000

# frontend (separate terminal)
cd client
npm install
npm run dev              # http://localhost:3000
```

### Seed real papers

```bash
cd server
node seed.js             # full reset: HF daily + arXiv (all topics) + Semantic Scholar
node seed.js --arxiv-only   # append arXiv papers without wiping existing data
```

Papers are deduped by arXiv ID. arXiv rate-limits aggressively — re-run `--arxiv-only` if a topic comes back empty.

---

## API (overview)

```
GET  /api/papers?topic=ai&start=0   # topic feed (arXiv + enrichment, cached, DB fallback)
GET  /api/papers/featured           # HuggingFace daily papers
GET  /api/papers/:id                # single paper

POST /api/v1/auth/login | register | GET logout
GET  /api/v1/posts                  # community / seeded papers
POST/GET/DELETE /api/v1/likes
POST/GET/DELETE /api/v1/bookmarks
POST/GET/DELETE /api/v1/notes       # personal notes (one per user per paper)
```

Likes / bookmarks / notes accept either a Mongo post id or an arXiv-paper payload — external papers are upserted into MongoDB on first interaction.
