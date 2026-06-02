<template>
  <div class="min-h-screen bg-[#1c1c1e] px-6 py-8 max-w-2xl mx-auto">

    <div v-if="loading" class="flex justify-center py-24">
      <LoadSpinner />
    </div>

    <div v-else-if="error" class="text-center py-24 text-sm text-red-400">
      Failed to load paper.
    </div>

    <template v-else-if="post">

      <NuxtLink to="/dashboard" class="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-teal-400 transition-colors mb-5">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to feed
      </NuxtLink>

      <!-- Main card — matches feed card style -->
      <div class="bg-[#242426] border border-gray-700/60 rounded-2xl p-6 mb-3">

        <!-- Meta row: pill + date + venue -->
        <div class="flex items-center gap-2 mb-4 flex-wrap">
          <span
            v-if="post.category"
            class="px-2 py-0.5 rounded-full text-xs font-medium shrink-0"
            :class="topicPill"
          >{{ post.category }}</span>
          <span v-if="post.date" class="text-xs text-gray-500">{{ formatDate(post.date) }}</span>
          <span v-if="post.venue" class="text-xs text-gray-600 truncate max-w-[200px]">· {{ post.venue }}</span>
        </div>

        <!-- Thumbnail -->
        <img
          v-if="post.thumbnail"
          :src="post.thumbnail"
          :alt="post.title"
          class="w-full h-48 object-cover rounded-xl mb-4 bg-gray-800"
          loading="lazy"
          @error="$event.target.style.display='none'"
        />

        <!-- Title — prominent -->
        <h1 class="text-xl font-bold text-white leading-snug mb-2">{{ post.title }}</h1>

        <!-- Authors -->
        <p v-if="authors.length" class="text-xs text-gray-500 mb-5">
          {{ authors.slice(0, 6).join(', ') }}{{ authors.length > 6 ? ` +${authors.length - 6} more` : '' }}
        </p>

        <!-- Full abstract — no line-clamp -->
        <p class="text-sm text-gray-400 leading-relaxed mb-5">{{ post.abstract }}</p>

        <!-- Bottom row: citations + doi | code + pdf + arxiv -->
        <div class="flex items-center justify-between pt-3 border-t border-gray-700/60">
          <div class="flex items-center gap-3 text-xs text-gray-400">
            <span v-if="post.citedBy" class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              {{ post.citedBy.toLocaleString() }}
            </span>
            <span v-if="post.doi" class="truncate max-w-[180px] text-gray-500">{{ post.doi }}</span>
          </div>
          <div class="flex items-center gap-2">
            <a
              v-if="post.codeUrl"
              :href="post.codeUrl"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-1 text-xs font-medium text-green-400 hover:text-green-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              Code
            </a>
            <a
              v-if="post.pdf"
              :href="post.pdf"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-1 text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              PDF
            </a>
            <a
              v-if="post.link"
              :href="post.link"
              target="_blank"
              rel="noopener"
              class="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >arXiv ↗</a>
          </div>
        </div>
      </div>

      <!-- Full paper text (user posts only) -->
      <div v-if="post.paper" class="bg-[#242426] border border-gray-700/60 rounded-2xl p-5">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Full text</p>
        <p class="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{{ post.paper }}</p>
      </div>

    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const API_BASE = import.meta.dev ? 'http://localhost:5000' : 'https://academiav2-backend.onrender.com'

const route = useRoute()
const rawId = route.params.doi as string

const post = ref<any>(null)
const loading = ref(true)
const error = ref(false)

const isArxivId = (id: string) => !/^[0-9a-f]{24}$/i.test(id)

const authors = computed(() => {
  if (!post.value?.authors) return []
  return Array.isArray(post.value.authors) ? post.value.authors : [post.value.authors]
})

const topicPill = computed(() => {
  const map: Record<string, string> = {
    ai:   'bg-teal-900/50 text-teal-300',
    math: 'bg-purple-900/50 text-purple-300',
    hw:   'bg-orange-900/50 text-orange-300',
    cs:   'bg-emerald-900/50 text-emerald-300',
  }
  return map[post.value?.topic] || 'bg-gray-700 text-gray-300'
})

function formatDate(d: string) {
  try { return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }
  catch { return d }
}

onMounted(async () => {
  try {
    if (isArxivId(rawId)) {
      const data = await $fetch<{ paper: any }>(`${API_BASE}/api/papers/${encodeURIComponent(rawId)}`)
      post.value = data.paper
    } else {
      const data = await $fetch<{ post: any }>(`${API_BASE}/api/v1/posts/${rawId}`, { credentials: 'include' } as any)
      post.value = data.post
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>
