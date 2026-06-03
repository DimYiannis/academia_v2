<template>
  <div v-if="loading" class="flex justify-center py-16">
    <LoadSpinner />
  </div>

  <main v-else class="px-6 py-8 max-w-2xl">

    <!-- Banner -->
    <div
      class="h-36 rounded-2xl mb-0 overflow-hidden"
      :class="user.backgroundImg ? '' : 'bg-gradient-to-br from-teal-900/50 via-gray-800 to-gray-900'"
      :style="user.backgroundImg ? {
        backgroundImage: `url(${API_BASE}${user.backgroundImg})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      } : {}"
    ></div>

    <!-- Avatar row -->
    <div class="flex items-end justify-between -mt-8 px-1 mb-4">
      <div
        class="w-16 h-16 rounded-2xl border-4 border-[#1c1c1e] flex items-center justify-center text-lg font-bold shrink-0"
        :class="user.profileImg ? '' : 'bg-teal-600 text-white'"
        :style="user.profileImg ? {
          backgroundImage: `url(${API_BASE}${user.profileImg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        } : {}"
      >
        <span v-if="!user.profileImg">{{ initials }}</span>
      </div>
      <button class="px-4 py-1.5 rounded-lg border border-gray-700 text-xs text-gray-400 hover:border-teal-500 hover:text-teal-400 transition-colors">
        Connect
      </button>
    </div>

    <!-- Name + bio -->
    <div class="mb-5">
      <h1 class="text-xl font-bold text-white capitalize">{{ user.name }}</h1>
      <p v-if="user.info" class="text-sm text-gray-400 mt-1">{{ user.info }}</p>
      <div class="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <span>{{ sharedposts.length }} shared</span>
        <span>{{ likedposts.length }} favorites</span>
      </div>
    </div>

    <!-- Pill tabs -->
    <div class="flex gap-1 p-1 bg-gray-800/60 rounded-xl mb-5 w-fit">
      <button
        @click="sharedPosts"
        class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
        :class="showSharedPosts ? 'bg-[#242426] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'"
      >Shared Posts</button>
      <button
        @click="likes"
        class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
        :class="showlikes ? 'bg-[#242426] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'"
      >Favorites</button>
    </div>

    <!-- Shared Posts -->
    <div v-show="showSharedPosts">
      <div
        v-for="i of sharedposts"
        :key="i._id"
        class="bg-[#242426] border border-gray-700/60 rounded-2xl p-5 mb-3 hover:border-gray-600 transition-colors"
      >
        <p v-if="i.title" class="text-sm text-gray-300 mb-3 italic">"{{ i.title }}"</p>
        <div v-for="j in i.sharedpostdetails" :key="j.doi" class="border border-gray-700/60 rounded-xl p-4">
          <h2 class="text-[15px] font-semibold text-white leading-snug mb-1">
            <NuxtLink class="hover:text-teal-400 transition-colors" :to="'/article/' + j.doi">{{ j.title }}</NuxtLink>
          </h2>
          <div class="flex flex-wrap gap-x-3 text-xs text-gray-500 mb-2">
            <span v-if="j.authors">{{ j.authors }}</span>
            <span v-if="j.date">{{ j.date }}</span>
          </div>
          <p class="text-sm text-gray-400 line-clamp-2 leading-relaxed">{{ j.abstract }}</p>
        </div>
      </div>
      <p v-if="!sharedposts.length" class="text-sm text-gray-600 py-8 text-center">No shared posts yet.</p>
    </div>

    <!-- Favorites -->
    <div v-show="showlikes">
      <div
        v-for="i of likedposts"
        :key="i._id"
        class="bg-[#242426] border border-gray-700/60 rounded-2xl p-5 mb-3 hover:border-gray-600 transition-colors"
      >
        <div v-for="j in [i.postDetails]" :key="j?.doi">
          <h2 class="text-[15px] font-semibold text-white leading-snug mb-1">
            <NuxtLink class="hover:text-teal-400 transition-colors" :to="'/article/' + j?.doi">{{ j?.title }}</NuxtLink>
          </h2>
          <div class="flex flex-wrap gap-x-3 text-xs text-gray-500 mb-2">
            <span v-if="j?.authors">{{ j.authors }}</span>
            <span v-if="j?.date">{{ j.date }}</span>
          </div>
          <p class="text-sm text-gray-400 line-clamp-2 leading-relaxed">{{ j?.abstract }}</p>
        </div>
      </div>
      <p v-if="!likedposts.length" class="text-sm text-gray-600 py-8 text-center">No favorites yet.</p>
    </div>

  </main>
</template>

<script>
import axios from "axios";
const API_BASE = import.meta.dev ? 'http://localhost:5000' : 'https://academiav2-backend.onrender.com'

definePageMeta({
  layout: "dashboard",
});
export default {
  data() {
    return {
      user: [],
      sharedposts: [],
      showlikes: false,
      showSharedPosts: true,
      likedposts: [],
      loading: false,
    };
  },
  computed: {
    initials() {
      if (!this.user?.name) return '?'
      const parts = this.user.name.trim().split(' ')
      if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      return this.user.name.slice(0, 2).toUpperCase()
    },
  },
  mounted() {
    // Invoke when the component is mounted
    this.getuser();
    this.getsharedposts();
    this.getlikedposts();
  },
  methods: {
    async getuser() {
      const userId = this.$route.params._id;
      try {
        const response = await axios.get(
          `${API_BASE}/api/v1/users/${userId}`,
          {
            withCredentials: true,
          }
        );
        this.user = response.data.user;
        //console.log(this.user);
      } catch (error) {
        console.error("Error fetching user's information:", error);
      }
    },
    async getsharedposts() {
      this.loading = true;
      const userId = this.$route.params._id;
      try {
        const response = await axios.get(
          `${API_BASE}/api/v1/users/${userId}/posts`,
          {
            withCredentials: true,
          }
        );

        this.sharedposts = response.data.sharedposts;
        //console.log(this.sharedposts);
      } catch (error) {
        console.error("Error fetching user information:", error);
        console.error("Error response data:", error.response.data);
        console.log("Response headers:", error.response.headers);
      } finally {
        this.loading = false;
      }
    },
    async getlikedposts() {
      const userId = this.$route.params._id;
      try {
        const response = await axios.get(
          `${API_BASE}/api/v1/likes/${userId}/likes`,
          {
            withCredentials: true,
          }
        );

        this.likedposts = response.data.likes;
        //console.log(this.likedposts);
      } catch (error) {
        console.error("Error fetching user information:", error);
        console.error("Error response data:", error.response.data);
        console.log("Response headers:", error.response.headers);
      }
    },
    likes() {
      this.showlikes = true;
      this.showSharedPosts = false;
    },
    sharedPosts() {
      this.showlikes = false;
      this.showSharedPosts = true;
    },
  },
};
</script>
