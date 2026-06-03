<template>
  <div v-if="loading" class="flex justify-center py-16">
    <LoadSpinner />
  </div>

  <main v-else class="px-6 py-6 w-full max-w-4xl">

    <!-- Compact header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
          :class="user.profileImg ? '' : 'bg-teal-600 text-white'"
          :style="user.profileImg ? { backgroundImage: `url(${API_BASE}${user.profileImg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}"
        >
          <span v-if="!user.profileImg">{{ initials }}</span>
        </div>
        <div>
          <h1 class="text-base font-semibold text-white capitalize leading-none">{{ user.name }}</h1>
          <p v-if="user.info" class="text-xs text-gray-500 mt-0.5">{{ user.info }}</p>
        </div>
      </div>
      <button @click="edit" class="px-3 py-1.5 rounded-lg border border-gray-700 text-xs text-gray-400 hover:border-gray-500 hover:text-white transition-colors">
        Edit Profile
      </button>
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
      <button @click="activeTab = 'shared'" class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
        :class="activeTab === 'shared' ? 'bg-[#242426] text-white' : 'text-gray-400 hover:text-gray-200'">
        Shared <span v-if="sharedposts.length" class="ml-1 text-xs text-gray-600">{{ sharedposts.length }}</span>
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

      <PaperGraph :papers="likedposts" :height="420" @select="goToArticle" />

      <p class="text-xs text-gray-600 mt-3 text-center">
        Nodes = liked papers · Edges = shared topic or author · Click to open
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
      <p v-if="!likedposts.length" class="text-sm text-gray-600 py-10 text-center">
        Like papers from the feed to add them here.
      </p>
    </div>

    <!-- ── Shared tab ── -->
    <div v-show="activeTab === 'shared'">
      <div
        v-for="i of sharedposts"
        :key="i._id"
        class="bg-[#242426] border border-gray-700/60 rounded-2xl p-5 mb-3 hover:border-gray-600 transition-colors"
      >
        <p v-if="i.title" class="text-sm text-gray-300 mb-3 italic">"{{ i.title }}"</p>
        <div v-for="j in i.sharedpostdetails" :key="j.doi" class="border border-gray-700/60 rounded-xl p-4 mb-2">
          <h2 class="text-[15px] font-semibold text-white leading-snug mb-1">
            <NuxtLink class="hover:text-teal-400 transition-colors" :to="'/article/' + (j.arxivId || j.doi)">{{ j.title }}</NuxtLink>
          </h2>
          <div class="flex flex-wrap gap-x-3 text-xs text-gray-500 mb-2">
            <span v-if="j.authors">{{ j.authors }}</span>
            <span v-if="j.date">{{ j.date }}</span>
          </div>
          <p class="text-sm text-gray-400 line-clamp-2 leading-relaxed">{{ j.abstract }}</p>
        </div>
        <button @click="deletepost(i._id)"
          class="mt-1 px-3 py-1 text-xs rounded-lg border border-red-900/60 text-red-500 hover:bg-red-900/20 transition-colors">
          Delete
        </button>
      </div>
      <p v-if="!sharedposts.length" class="text-sm text-gray-600 py-10 text-center">No shared posts yet.</p>
    </div>

  </main>

  <Teleport to="body">
    <Edit :userr="userr" v-show="showedit" @close-modal="edit" />
  </Teleport>
</template>

<script>
import axios from "axios";
const API_BASE = import.meta.dev ? 'http://localhost:5000' : 'https://academiav2-backend.onrender.com'
definePageMeta({
  layout: 'dashboard'
})
export default {
  data() {
    return {
      sharedposts: [],
      likedposts: [],
      loading: false,
      showedit: false,
      userr: '',
      activeTab: 'graph',
    };
  },
  props: {
    user: { type: Object, required: true },
  },
  computed: {
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
    this.getsharedposts();
    this.getlikedposts();
  },
  methods: {
    async getsharedposts() {
      this.loading = true;
      try {
        const response = await axios.get(
          `${API_BASE}/api/v1/sharedposts/mysharedposts`,
          {
            withCredentials: true,
          }
        );

        this.sharedposts = response.data.sharedposts;
        
        console.log(this.userr);
       // console.log(this.sharedposts);
      } catch (error) {
        console.error("Error fetching user information:", error);
        console.error("Error response data:", error.response.data);
        console.log("Response headers:", error.response.headers);
      } finally {
        this.loading = false;
      }
      this.userr = this.user 
      console.log(this.userr);
    },
    async deletepost(postId) {
      try {
        await axios.delete(
          `${API_BASE}/api/v1/sharedposts/${postId}`,
          {
            withCredentials: true,
          }
        );

        this.getsharedposts();
      } catch (error) {
        console.error("Error deleting shared post:", error);
      }
      this.user = userr;
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
    edit() {
      this.showedit = !this.showedit;
    },
    goToArticle(paper) {
      const id = paper?.doi || paper?._id
      if (id) this.$router.push('/article/' + id)
    },
  },
};
</script>
