<template>
  <div class="min-h-screen bg-[#1c1c1e] text-white px-6 py-8 max-w-3xl mx-auto">

    <div v-if="loading" class="flex justify-center py-24">
      <LoadSpinner />
    </div>

    <div v-else-if="error" class="text-center py-24 text-red-400">
      Failed to load paper.
    </div>

    <template v-else-if="post">
      <!-- Back link -->
      <NuxtLink to="/dashboard" class="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-teal-400 transition-colors mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to feed
      </NuxtLink>

      <!-- Header card -->
      <div class="bg-[#242426] border border-gray-700/60 rounded-2xl p-7 mb-4">
        <!-- Meta row -->
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 mb-4">
          <span v-if="post.category" class="px-2 py-0.5 rounded-full bg-teal-900/40 text-teal-300 font-medium">{{ post.category }}</span>
          <span v-if="post.date">{{ formatDate(post.date) }}</span>
          <span v-if="post.venue" class="text-gray-500">· {{ post.venue }}</span>
        </div>

        <h1 class="text-xl font-bold text-white leading-snug mb-3">{{ post.title }}</h1>

        <!-- Authors -->
        <p v-if="post.authors && post.authors.length" class="text-sm text-gray-300 mb-1">
          {{ Array.isArray(post.authors) ? post.authors.join(', ') : post.authors }}
        </p>
        <p v-if="post.university" class="text-sm text-gray-400">{{ post.university }}</p>

        <!-- Stats row -->
        <div class="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-700/60">
          <span v-if="post.citedBy" class="flex items-center gap-1.5 text-xs text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
            {{ post.citedBy.toLocaleString() }} citations
          </span>
          <span v-if="post.doi" class="text-xs text-gray-400">DOI: {{ post.doi }}</span>
          <div class="flex items-center gap-2 ml-auto">
            <a
              v-if="post.pdf || post.link"
              :href="post.pdf || post.link"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium transition-colors"
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
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-600 hover:border-gray-400 text-gray-300 text-xs transition-colors"
            >
              arXiv
            </a>
          </div>
        </div>
      </div>

      <!-- Abstract card -->
      <div class="bg-[#242426] border border-gray-700/60 rounded-2xl p-7 mb-4">
        <h2 class="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Abstract</h2>
        <p
          class="text-sm text-gray-300 leading-relaxed"
          :class="{ 'line-clamp-6': !showFullAbstract }"
        >{{ post.abstract }}</p>
        <button
          v-if="post.abstract && post.abstract.length > 400"
          @click="showFullAbstract = !showFullAbstract"
          class="mt-2 text-xs text-teal-400 hover:text-teal-300 transition-colors"
        >
          {{ showFullAbstract ? 'Show less' : 'Read more' }}
        </button>
      </div>

      <!-- Full paper text (user posts only) -->
      <div v-if="post.paper" class="bg-[#242426] border border-gray-700/60 rounded-2xl p-7">
        <h2 class="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Full text</h2>
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
const showFullAbstract = ref(false)

const isArxivId = (id: string) => !/^[0-9a-f]{24}$/i.test(id)

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return d
  }
}

onMounted(async () => {
  try {
    if (isArxivId(rawId)) {
      const data = await $fetch<{ paper: any }>(
        `${API_BASE}/api/papers/${encodeURIComponent(rawId)}`
      )
      post.value = data.paper
    } else {
      const data = await $fetch<{ post: any }>(
        `${API_BASE}/api/v1/posts/${rawId}`,
        { credentials: 'include' } as any
      )
      post.value = data.post
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>
