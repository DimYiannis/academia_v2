interface Paper {
  id: string
  title: string
  abstract: string
  authors: string[]
  date: string
  pdf: string
  link: string
  category: string
  topic: string
  citedBy: number
  venue: string | null
  doi: string | null
  hasCode: boolean
  codeUrl: string | null
  thumbnail: string | null
  source: string
}

interface PapersResponse {
  papers: Paper[]
  nextStart: number | null
}

const API_BASE = import.meta.dev ? 'http://localhost:5000' : 'https://academiav2-backend.onrender.com'

export function usePapers(initialTopic = 'ai') {
  const papers = ref<Paper[]>([])
  const pending = ref(false)
  const error = ref<Error | null>(null)
  const nextStart = ref<number | null>(0)
  const loaded = ref(false)

  async function fetchPage(start: number) {
    pending.value = true
    error.value = null
    try {
      const data = await $fetch<PapersResponse>(
        `${API_BASE}/api/papers`,
        { params: { topic: initialTopic, start } }
      )
      if (start === 0) {
        papers.value = data.papers
      } else {
        papers.value.push(...data.papers)
      }
      nextStart.value = data.nextStart
    } catch (e) {
      error.value = e as Error
    } finally {
      pending.value = false
    }
  }

  async function loadMore() {
    if (nextStart.value === null || pending.value) return
    await fetchPage(nextStart.value)
  }

  // Fetch first page once. Safe to call repeatedly — no-op if already loaded/loading.
  function ensureLoaded() {
    if (loaded.value || pending.value) return
    loaded.value = true
    fetchPage(0)
  }

  return {
    papers: readonly(papers),
    pending: readonly(pending),
    error: readonly(error),
    hasMore: computed(() => nextStart.value !== null),
    loadMore,
    ensureLoaded,
  }
}
