# Academia v2 — Progress

## Decisions

These were made deliberately — don't revert without a reason.

- **Dark theme** — bg `#1c1c1e`, card surface `#242426`. Matches macOS dark UI feel. Not a toggle; no light mode planned.
- **Teal accent (`#14b8a6`)** — replaced original blue `#388aef` and indigo. Applied everywhere: links, active states, buttons, toggles.
- **`<NuxtPage>` in layout instead of `<slot>`** — intentional. Layout passes `posts`, `loading`, `user` as props. `posts` is now HF featured papers, not MongoDB posts.
- **`postsContoller.js` typo kept** — live in prod, referenced by imports. Do not rename.
- **Options API kept on most pages** — not migrated to `<script setup>` to avoid large rewrites. Layout migrated. Pages can migrate incrementally.
- **`useSearchQuery` uses module-level `ref`** — `useState` caused `warnRuntimeUsage` when called from Options API `setup()`. Module-level ref is shared across imports as singleton.
- **`API_BASE` uses `import.meta.dev`** — `import.meta.env.NUXT_PUBLIC_API_BASE` doesn't work in browser (Nuxt only uses it server-side). `import.meta.dev` is compile-time: `localhost:5000` in dev, Render URL in prod.
- **arXiv paper cards link internally to `/article/${paper.id}`** — routed through article detail page, not external arXiv.
- **`article/[doi].vue` detects arXiv vs MongoDB** — 24-char hex = MongoDB ObjectId; else = arXiv ID → `GET /api/papers/:id`.
- **Community section shows HF daily papers** — MongoDB demo posts replaced with HuggingFace curated daily ML papers (50/day). MongoDB posts were lorem ipsum placeholders.
- **Paper thumbnails from `arxiv.org/html/{id}/x1.png`** — zero extra requests; browser fetches directly. Papers with external figure files show thumbnails; others fall back gracefully via `@error`.
- **`Read` button links to `arxiv.org/html/{id}`** — HTML version opens in browser. `PDF` is secondary link for direct download.
- **HF featured papers cached 1hr** — changes slowly; arXiv papers cached 5min.
- **CORS allows any `localhost:*`** — regex match instead of fixed port list, since Nuxt dev server port varies (3000 or 3001).
- **`sameSite: Lax` in dev, `None` in prod** — `None` requires `secure: true`; browsers drop cookies when `secure: false` locally.

---

## Done

### Backend
- [x] Express + MongoDB server setup with JWT auth
- [x] Posts CRUD (`postsContoller.js`)
- [x] Likes, bookmarks, shared posts routes + controllers
- [x] User profile get/update
- [x] arXiv XML fetcher + parser (`server/lib/arxiv.js`) — `fetchPapers`, `fetchPaperById`, paper thumbnails
- [x] OpenAlex citation enrichment (`server/lib/openalex.js`)
- [x] Papers With Code code-repo lookup per arXiv ID (`server/lib/paperswithcode.js`)
- [x] HuggingFace daily papers fetcher (`fetchFeaturedPapers`)
- [x] `GET /api/papers?topic=ai&start=0` — arXiv + PwC enrichment
- [x] `GET /api/papers/featured` — HF curated papers, 1hr cache
- [x] `GET /api/papers/:id` — single arXiv paper fetch with citation enrichment
- [x] node-cache: 5min for topic feeds, 1hr for featured
- [x] Unified Paper shape: id, title, abstract, authors, date, pdf, link, thumbnail, category, topic, citedBy, venue, doi, hasCode, codeUrl, source
- [x] Fixed `server/.env` JWT_LIFETIME newline corruption
- [x] OPENALEX_EMAIL in `.env`

### Frontend
- [x] Nuxt 3 setup, file-based routing, Tailwind CSS
- [x] Landing page (`pages/index.vue`)
- [x] Login / Register pages
- [x] Dashboard layout — dark navbar, `<script setup>`, auth redirect, sticky sidebars
- [x] 3-column CSS grid dashboard (left nav, feed, right sidebar)
- [x] `usePapers` composable — fetches arXiv papers, pagination, per-topic caching
- [x] `useSearch.ts` — module-level ref shared between layout search input and dashboard filter
- [x] HF daily papers as "Today on HuggingFace" section in feed
- [x] arXiv papers feed — Latest / Trending (sort by citedBy) / Saved (fetch bookmarks) tabs
- [x] Topic switching (AI, Math, Hardware, CS Theory) with live paper fetch
- [x] Source toggles (arXiv, Community, Papers With Code) — fully wired
- [x] Filter By: Has code, Last 30 days, Most cited — all wired to `activeFilters`
- [x] Navbar search — filters both HF papers and arXiv papers by title/author
- [x] Paper thumbnails — `x1.png` from arXiv HTML, shown as right-side gradient strip on cards
- [x] Category pill badges with full names (cs.AI → Artificial Intelligence, q-fin.GN → Quant Finance, etc.)
- [x] `Read` button → opens `arxiv.org/html/{id}` (HTML, no download). `PDF` secondary.
- [x] `article/[doi].vue` — card-style dark theme, detects arXiv vs MongoDB, thumbnail banner, full abstract
- [x] Like, bookmark, share actions on user posts
- [x] Bookmarks page — dark theme, delete bookmark
- [x] Shared posts page — dark theme
- [x] Profile page — dark theme, tabs (Shared/Favorites/Notifications), edit modal
- [x] User public profile page (`user/[_id].vue`) — dark theme, tabs
- [x] All API URLs use `import.meta.dev` — dev hits `localhost:5000`, prod hits Render

### Design
- [x] Dark theme — `#1c1c1e` bg, `#242426` card surfaces
- [x] Teal accent replacing old blue across all files
- [x] Category pill badges — `bg-teal-900/50 text-teal-300` etc., color-coded by topic
- [x] Card thumbnails — right-side gradient strip, fades from transparent to image
- [x] Card titles `text-[15px]`, authors `text-gray-500`, bottom row with divider
- [x] Right sidebar — live sources toggles, hot topics (full names), top venues (live)
- [x] Sticky left + right sidebars — `sticky top-0 h-[calc(100vh-52px)]`
- [x] Article page — full-width thumbnail banner, prominent `text-xl` title, card-style layout

### Infra
- [x] `.gitignore` — covers DS_Store, CLAUDE.md, node_modules, .env, build output
- [x] `client/.env` — `NUXT_PUBLIC_API_BASE=http://localhost:5000` for local dev reference

---

## To Do

### Medium priority
- [ ] Dashboard sidebar mobile toggle — no responsive layout below ~1000px
- [ ] `messages.vue` — dark theme only (no backend planned)
- [ ] Connect button on user profile — UI only, no follow/connect system
- [ ] Notifications tab in Profile — no backend
- [ ] Paper thumbnails: ~50% of arXiv papers use base64 inline figures, not `x1.png`. Backend scraping endpoint needed for full coverage.

### Low priority
- [ ] Landing page stats (4 topics / Daily / Free) — hardcoded
- [ ] Login/register left panel — `bg-[#14b8a6]` solid, could align with dark theme
- [ ] `definePageMeta` in `<script>` (not `<script setup>`) across several pages
- [ ] Pages still using Options API — migrate to `<script setup>` over time
- [ ] `postsContoller.js` typo — live in prod, cannot rename without deploy coordination
