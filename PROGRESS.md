# Academia v2 — Progress

## Decisions

These were made deliberately — don't revert without a reason.

- **Dark theme** — bg `#1c1c1e`, card surface `#242426`. Matches macOS dark UI feel. Not a toggle; no light mode planned.
- **Teal accent (`#14b8a6`)** — replaced original blue `#388aef` and indigo. Applied everywhere: links, active states, buttons, toggles.
- **`<NuxtPage>` in layout instead of `<slot>`** — intentional. Layout passes `posts`, `loading`, `user` as props to pages via `<NuxtPage :posts="posts" ...>`. Switching to `<slot>` would break `dashboard/index.vue` which reads these as props. Migrate only if pages are refactored to fetch their own data.
- **`postsContoller.js` typo kept** — live in prod, referenced by imports. Do not rename.
- **Options API kept on most pages** — pages were not migrated to `<script setup>` to avoid large rewrites. Layout (`dashboard.vue`) was migrated. Pages can be migrated incrementally.
- **`usePapers` composable drops `useRuntimeConfig()`** — was causing SSR composable-outside-context warning when called from Options API `setup()`. API base hardcoded to match all other files in the codebase.
- **`user/[_id].vue` module-level `useRoute()` removed** — was crashing SSR with 500. Variable was unused anyway; methods use `this.$route.params._id` directly.
- **`useSearchQuery` composable uses `useState`** — shares search input between layout (input element) and dashboard page (filter logic) without prop drilling.
- **arXiv paper cards link internally to `/article/${paper.id}`** — previously linked externally; now routed through article detail page.
- **`article/[doi].vue` detects arXiv vs MongoDB** — 24-char hex = MongoDB ObjectId; anything else = arXiv ID, fetched via `GET /api/papers/:id`.

---

## Done

### Backend
- [x] Express + MongoDB server setup with JWT auth
- [x] Posts CRUD (`postsContoller.js`)
- [x] Likes, bookmarks, shared posts routes + controllers
- [x] User profile get/update
- [x] arXiv XML fetcher + parser (`server/lib/arxiv.js`)
- [x] OpenAlex citation enrichment (`server/lib/openalex.js`)
- [x] Paper API route — `GET /api/papers?topic=ai&start=0`
- [x] node-cache 5-min caching per topic+start key
- [x] Unified Paper shape (id, title, abstract, authors, date, pdf, link, category, topic, citedBy, venue, doi, hasCode, codeUrl, source)
- [x] Papers With Code enrichment — for `topic=ai`, merges PwC repos into arXiv papers; adds PwC-only papers to feed

### Frontend
- [x] Nuxt 3 setup, file-based routing, Tailwind CSS
- [x] Landing page (`pages/index.vue`)
- [x] Login / Register pages
- [x] Dashboard layout — dark navbar, `<script setup>`, auth redirect on load
- [x] 3-column CSS grid dashboard (left nav, feed, right sidebar)
- [x] `usePapers` composable — fetches arXiv papers, pagination, per-topic caching
- [x] Feed renders both user posts (MongoDB) and arXiv papers
- [x] Topic switching (AI, Math, Hardware, CS Theory) with live paper fetch
- [x] Like, bookmark, share actions on user posts
- [x] Bookmarks page — dark theme, delete bookmark
- [x] Shared posts page — dark theme
- [x] Profile page — dark theme, tabs (Shared/Favorites/Notifications), edit modal
- [x] User public profile page (`user/[_id].vue`) — dark theme, tabs
- [x] `article/[doi].vue` route exists (reads from user posts only)

### Design
- [x] Dark theme — `#1c1c1e` bg, `#242426` card surfaces
- [x] Teal accent (`#14b8a6`) replacing old blue across all files
- [x] Navbar border separator, card depth, no white gutters
- [x] Global button CSS reset (was overriding Tailwind classes)
- [x] Right sidebar — live sources toggles (wired), hot topics (live), top venues (live from OpenAlex venue data)
- [x] Code badges on paper cards — GitHub link shown when paper has PwC repository

### Infra
- [x] `.gitignore` — covers DS_Store, CLAUDE.md, node_modules, .env, build output

---

## To Do

### High priority
- [x] `article/[doi].vue` — wired to arXiv paper fetch (detects arXiv ID vs MongoDB ObjectId); dark theme rewrite
- [x] Feed tabs — Trending sorts by citedBy desc; Saved fetches bookmarks from `/api/v1/bookmarks`
- [x] Search bar in navbar — filters papers + community posts by title/author (shared state via `useSearchQuery`)
- [x] Source toggles in right sidebar — arXiv feed and Community posts toggles wired to `sourceArxiv` / `sourceCommunity`
- [x] Filter By checkboxes — Open access only, Last 30 days, Most cited all wired to `activeFilters`
- [x] `OPENALEX_EMAIL` env var — added to `server/.env`

### Medium priority
- [ ] Dashboard sidebar mobile toggle — no responsive layout below ~1000px
- [ ] `messages.vue` — dark theme only (no backend planned)
- [x] `article/[doi].vue` — dark theme rewrite + arXiv fetch (done)
- [ ] Connect button on user profile — UI only, no follow/connect system
- [ ] Notifications tab in Profile — always shows "No notifications yet", no backend

### Low priority
- [ ] Landing page stats (4 topics / Daily / Free) — hardcoded, could pull live counts
- [ ] Login/register left panel uses `bg-[#14b8a6]` solid — could align with dark theme
- [ ] `definePageMeta` in `<script>` (not `<script setup>`) across several pages — technically valid but non-standard Nuxt 3
- [ ] Pages still using Options API (`export default {}`) — migrate to `<script setup>` over time
- [ ] `postsContoller.js` typo in filename — live in prod, cannot rename without deploy coordination
