<template>
  <div class="min-h-screen bg-[#1c1c1e] px-6 py-8 max-w-2xl mx-auto">

    <!-- Skeleton -->
    <div v-if="loading" class="animate-pulse">
      <div class="bg-[#242426] border border-gray-700/60 rounded-2xl p-6 mb-3">
        <div class="flex gap-2 mb-4">
          <div class="h-5 w-20 bg-gray-700 rounded-full"></div>
          <div class="h-5 w-24 bg-gray-700 rounded-full"></div>
        </div>
        <div class="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div class="h-6 bg-gray-700 rounded w-1/2 mb-5"></div>
        <div class="h-4 bg-gray-700 rounded w-2/3 mb-5"></div>
        <div class="space-y-2 mb-5">
          <div class="h-3 bg-gray-700 rounded"></div>
          <div class="h-3 bg-gray-700 rounded w-5/6"></div>
          <div class="h-3 bg-gray-700 rounded w-4/6"></div>
          <div class="h-3 bg-gray-700 rounded"></div>
          <div class="h-3 bg-gray-700 rounded w-5/6"></div>
        </div>
        <div class="flex gap-2 pt-3 border-t border-gray-700/60">
          <div class="h-7 w-16 bg-gray-700 rounded-lg"></div>
          <div class="h-7 w-10 bg-gray-700 rounded-lg"></div>
        </div>
      </div>
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
              v-if="rawId && isArxivId(rawId)"
              :href="'https://arxiv.org/html/' + rawId"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-1 text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              Read
            </a>
            <a v-if="post.pdf" :href="post.pdf" target="_blank" rel="noopener"
              class="text-xs text-gray-500 hover:text-gray-400 transition-colors">PDF</a>
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

      <!-- My note — read → annotate inline -->
      <div class="bg-[#242426] border border-gray-700/60 rounded-2xl p-5 mb-3">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-semibold text-teal-400 uppercase tracking-wider">My note</p>
          <button
            v-if="!noteEditing && note"
            @click="startEditNote"
            class="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >Edit</button>
        </div>

        <p v-if="noteLoading" class="text-xs text-gray-600">Loading…</p>

        <!-- View -->
        <template v-else-if="!noteEditing">
          <p v-if="note" class="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap border-l-2 border-teal-700/60 pl-3">{{ note }}</p>
          <button
            v-else
            @click="startEditNote"
            class="flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
            </svg>
            Add a note about this paper…
          </button>
        </template>

        <!-- Edit -->
        <template v-else>
          <textarea
            v-model="noteDraft"
            rows="5"
            placeholder="Your thoughts, summary, key takeaways…"
            class="w-full bg-[#1c1c1e] border border-gray-700 rounded-xl p-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-teal-600 resize-none"
          ></textarea>
          <div class="flex items-center justify-end gap-2 mt-2">
            <button @click="noteEditing = false" class="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button @click="saveNote" :disabled="noteSaving"
              class="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium transition-colors disabled:opacity-50">
              {{ noteSaving ? 'Saving…' : 'Save note' }}
            </button>
          </div>
        </template>
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

// arXiv IDs: new "2405.12345" / "2405.12345v2", old "cs/0501001". MongoDB _id is 24-hex.
const isArxivId = (id: string) =>
  /^\d{4}\.\d{4,5}(v\d+)?$/.test(id) || /^[a-z-]+\/\d{7}(v\d+)?$/i.test(id)

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

// ── Personal note ────────────────────────────────────────
const note = ref('')
const noteDraft = ref('')
const noteLoading = ref(true)
const noteSaving = ref(false)
const noteEditing = ref(false)

function startEditNote() {
  noteDraft.value = note.value
  noteEditing.value = true
}

async function fetchNote() {
  try {
    const data = await $fetch<{ note: any }>(`${API_BASE}/api/v1/notes/${encodeURIComponent(rawId)}`, { credentials: 'include' } as any)
    note.value = data.note?.content || ''
  } catch { /* not logged in or no note */ }
  finally { noteLoading.value = false }
}

async function saveNote() {
  noteSaving.value = true
  try {
    const p = post.value || {}
    const body = isArxivId(rawId)
      ? {
          arxivId: rawId,
          title: p.title, authors: p.authors, abstract: p.abstract,
          category: p.category, date: p.date, venue: p.venue, citedBy: p.citedBy,
          content: noteDraft.value,
        }
      : { post: rawId, content: noteDraft.value }
    await $fetch(`${API_BASE}/api/v1/notes`, { method: 'POST', body, credentials: 'include' } as any)
    note.value = noteDraft.value
    noteEditing.value = false
  } catch (e) {
    console.error('Error saving note:', e)
  } finally {
    noteSaving.value = false
  }
}

onMounted(async () => {
  fetchNote()
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
