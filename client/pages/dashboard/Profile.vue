<template>
  <div v-if="loading || !user" class="flex justify-center py-16">
    <LoadSpinner />
  </div>

  <main v-else class="px-6 py-6 w-full max-w-4xl">

    <!-- Compact header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 bg-teal-600 text-white">
          {{ initials }}
        </div>
        <div>
          <h1 class="text-base font-semibold text-white capitalize leading-none">{{ user.name }}</h1>
          <p v-if="user.info" class="text-xs text-gray-500 mt-0.5">{{ user.info }}</p>
        </div>
      </div>
    </div>

    <!-- Pill tabs -->
    <div class="flex gap-1 p-1 bg-gray-800/60 rounded-xl mb-6 w-fit">
      <button @click="activeTab = 'graph'" class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
        :class="activeTab === 'graph' ? 'bg-[#242426] text-white' : 'text-gray-400 hover:text-gray-200'">
        Knowledge Graph
      </button>
      <button @click="activeTab = 'papers'" class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
        :class="activeTab === 'papers' ? 'bg-[#242426] text-white' : 'text-gray-400 hover:text-gray-200'">
        Favorites <span v-if="likedposts.length" class="ml-1 text-xs text-gray-600">{{ likedposts.length }}</span>
      </button>
      <button @click="activeTab = 'notes'" class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
        :class="activeTab === 'notes' ? 'bg-[#242426] text-white' : 'text-gray-400 hover:text-gray-200'">
        Notes <span v-if="notes.length" class="ml-1 text-xs text-gray-600">{{ notes.length }}</span>
      </button>
    </div>

    <!-- ── Knowledge Graph tab ── -->
    <div v-show="activeTab === 'graph'">
      <!-- Research areas -->
      <div v-if="researchAreas.length" class="flex flex-wrap gap-2 mb-4">
        <span v-for="area in researchAreas" :key="area.label"
          class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
          :style="{ borderColor: area.color + '60', color: area.color, background: area.color + '15' }"
        >
          {{ area.label }}
          <span class="opacity-60">{{ area.count }}</span>
        </span>
      </div>

      <PaperGraph :papers="likedposts" :height="420" :noted-keys="noteKeys" @select="goToArticle" />

      <p class="text-xs text-gray-600 mt-3 text-center">
        Nodes = liked papers · Amber dot = has note · Scroll to zoom, drag background to pan
      </p>
    </div>

    <!-- ── Favorites tab ── -->
    <div v-show="activeTab === 'papers'">
      <div
        v-for="i of likedposts"
        :key="i._id"
        class="bg-[#242426] border border-gray-700/60 rounded-2xl p-5 mb-3 hover:border-gray-600 transition-colors"
      >
        <div v-for="j in [i.postDetails]" :key="j?.doi">
          <div class="flex items-start justify-between mb-1">
            <h2 class="text-[15px] font-semibold text-white leading-snug">
              <NuxtLink class="hover:text-teal-400 transition-colors" :to="'/article/' + (j?.arxivId || j?.doi)">{{ j?.title }}</NuxtLink>
            </h2>
            <button @click="unlike(i._id)" class="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-900/20 transition-colors shrink-0 ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="flex flex-wrap gap-x-3 text-xs text-gray-500 mb-2 mt-1">
            <span v-if="j?.authors">{{ j.authors }}</span>
            <span v-if="j?.date">{{ j.date }}</span>
          </div>
          <p class="text-sm text-gray-400 line-clamp-3 leading-relaxed">{{ j?.abstract }}</p>
        </div>
      </div>
      <div v-if="!likedposts.length" class="flex flex-col items-center gap-3 py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M21 8.25c0-2.485-2.099-4.5-4.687-4.5-1.936 0-3.598 1.126-4.313 2.733-.715-1.607-2.377-2.733-4.312-2.733C5.098 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
        <p class="text-sm text-gray-600">No favorites yet.</p>
        <NuxtLink to="/dashboard" class="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium transition-colors">
          Browse AI papers →
        </NuxtLink>
      </div>
    </div>

    <!-- ── Notes tab ── -->
    <div v-show="activeTab === 'notes'">
      <div
        v-for="n of notes"
        :key="n._id"
        class="bg-[#242426] border border-gray-700/60 rounded-2xl p-5 mb-3 hover:border-gray-600 transition-colors"
      >
        <h2 class="text-[15px] font-semibold text-white leading-snug mb-1">
          <NuxtLink class="hover:text-teal-400 transition-colors" :to="'/article/' + (n.postDetails.arxivId || n.postDetails.doi)">{{ n.postDetails.title }}</NuxtLink>
        </h2>
        <div class="flex flex-wrap gap-x-3 text-xs text-gray-500 mb-3">
          <span v-if="n.postDetails.authors">{{ n.postDetails.authors }}</span>
          <span v-if="n.postDetails.date">{{ n.postDetails.date }}</span>
        </div>
        <div class="text-sm text-gray-300 leading-relaxed border-l-2 border-teal-700/60 pl-3" v-html="renderNote(n.content)"></div>
        <button @click="deleteNote(n._id)"
          class="mt-3 px-3 py-1 text-xs rounded-lg border border-red-900/60 text-red-500 hover:bg-red-900/20 transition-colors">
          Delete note
        </button>
      </div>
      <div v-if="!notes.length" class="flex flex-col items-center gap-3 py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
        </svg>
        <p class="text-sm text-gray-600">No notes yet.</p>
        <NuxtLink to="/dashboard" class="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium transition-colors">
          Annotate a paper →
        </NuxtLink>
      </div>
    </div>

  </main>
</template>

<script>
import axios from "axios";
import { renderNote } from "~/composables/useNoteRender";
const API_BASE = import.meta.dev ? 'http://localhost:5000' : 'https://academiav2-backend.onrender.com'
definePageMeta({
  layout: 'dashboard'
})
export default {
  data() {
    return {
      notes: [],
      likedposts: [],
      loading: false,
      activeTab: 'graph',
    };
  },
  props: {
    user: { type: Object, required: true },
  },
  computed: {
    noteKeys() {
      return this.notes.map(n => n.postDetails?.arxivId || String(n.post)).filter(Boolean);
    },
    initials() {
      if (!this.user?.name) return '?'
      const parts = this.user.name.trim().split(' ')
      if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      return this.user.name.slice(0, 2).toUpperCase()
    },
    researchAreas() {
      const map = {}
      const colors = {
        'cs.AI': { color: '#14b8a6', label: 'Artificial Intelligence' },
        'cs.LG': { color: '#14b8a6', label: 'Machine Learning' },
        'cs.CV': { color: '#8b5cf6', label: 'Computer Vision' },
        'cs.CL': { color: '#3b82f6', label: 'NLP' },
        'cs.RO': { color: '#f59e0b', label: 'Robotics' },
        'math':  { color: '#a855f7', label: 'Mathematics' },
        'eess':  { color: '#f97316', label: 'Engineering' },
      }
      for (const p of this.likedposts) {
        const cat = p.postDetails?.category || ''
        const key = Object.keys(colors).find(k => cat.startsWith(k.split('.')[0])) || null
        const meta = key ? colors[key] : { color: '#6b7280', label: 'Research' }
        if (!map[meta.label]) map[meta.label] = { ...meta, count: 0 }
        map[meta.label].count++
      }
      return Object.values(map).sort((a, b) => b.count - a.count)
    },
  },
  mounted() {
    this.getNotes();
    this.getlikedposts();
  },
  methods: {
    renderNote,
    async getNotes() {
      this.loading = true;
      try {
        const { data } = await axios.get(`${API_BASE}/api/v1/notes`, { withCredentials: true });
        this.notes = (data.notes || []).filter(n => n.content && n.postDetails);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        this.loading = false;
      }
    },
    async deleteNote(noteId) {
      try {
        await axios.delete(`${API_BASE}/api/v1/notes/${noteId}`, { withCredentials: true });
        this.getNotes();
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    },
    async getlikedposts() {
      try {
        const response = await axios.get(`${API_BASE}/api/v1/likes`, {
          withCredentials: true,
        });

        this.likedposts = response.data.likes;
        //console.log(this.likedposts);
      } catch (error) {
        console.error("Error fetching user information:", error);
        console.error("Error response data:", error.response.data);
        console.log("Response headers:", error.response.headers);
      }
    },
    async unlike(postId) {
      try {
        await axios.delete(`${API_BASE}/api/v1/likes/${postId}`, {
          withCredentials: true,
        });

        this.getlikedposts();
      } catch (error) {
        console.error("Error deleting liked post from your likes:", error);
      }
    },
    goToArticle(paper) {
      const id = paper?.doi || paper?._id
      if (id) this.$router.push('/article/' + id)
    },
  },
};
</script>
