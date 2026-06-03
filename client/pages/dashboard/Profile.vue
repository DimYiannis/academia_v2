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
      <button
        @click="edit"
        class="px-4 py-1.5 rounded-lg border border-gray-700 text-xs text-gray-400 hover:border-gray-500 hover:text-white transition-colors"
      >Edit Profile</button>
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
        @click="SharedPosts"
        class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
        :class="showSharedPosts ? 'bg-[#242426] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'"
      >Shared Posts</button>
      <button
        @click="favorites"
        class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
        :class="showfavorites ? 'bg-[#242426] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'"
      >Favorites</button>
      <button
        @click="notif"
        class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
        :class="shownotif ? 'bg-[#242426] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'"
      >Notifications</button>
    </div>

    <!-- Shared Posts tab -->
    <div v-show="showSharedPosts">
      <div
        v-for="i of sharedposts"
        :key="i._id"
        class="bg-[#242426] border border-gray-700/60 rounded-2xl p-5 mb-3 hover:border-gray-600 transition-colors"
      >
        <p v-if="i.title" class="text-sm text-gray-300 mb-3 italic">"{{ i.title }}"</p>
        <div v-for="j in i.sharedpostdetails" :key="j.doi" class="border border-gray-700/60 rounded-xl p-4 mb-2">
          <h2 class="text-[15px] font-semibold text-white leading-snug mb-1">
            <NuxtLink class="hover:text-teal-400 transition-colors" :to="'/article/' + j.doi">{{ j.title }}</NuxtLink>
          </h2>
          <div class="flex flex-wrap gap-x-3 text-xs text-gray-500 mb-2">
            <span v-if="j.authors">{{ j.authors }}</span>
            <span v-if="j.date">{{ j.date }}</span>
          </div>
          <p class="text-sm text-gray-400 line-clamp-2 leading-relaxed">{{ j.abstract }}</p>
        </div>
        <button
          @click="deletepost(i._id)"
          class="mt-1 px-3 py-1 text-xs rounded-lg border border-red-900/60 text-red-500 hover:bg-red-900/20 transition-colors"
        >Delete</button>
      </div>
      <p v-if="!sharedposts.length" class="text-sm text-gray-600 py-8 text-center">No shared posts yet.</p>
    </div>

    <!-- Favorites tab -->
    <div v-show="showfavorites">
      <div
        v-for="i of likedposts"
        :key="i._id"
        class="bg-[#242426] border border-gray-700/60 rounded-2xl p-5 mb-3 hover:border-gray-600 transition-colors"
      >
        <div v-for="j in [i.postDetails]" :key="j?.doi">
          <div class="flex items-start justify-between mb-1">
            <h2 class="text-[15px] font-semibold text-white leading-snug">
              <NuxtLink class="hover:text-teal-400 transition-colors" :to="'/article/' + j?.doi">{{ j?.title }}</NuxtLink>
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
          <p class="text-sm text-gray-400 line-clamp-2 leading-relaxed">{{ j?.abstract }}</p>
        </div>
      </div>
      <p v-if="!likedposts.length" class="text-sm text-gray-600 py-8 text-center">No favorites yet.</p>
    </div>

    <!-- Notifications tab -->
    <div v-show="shownotif" class="py-10 text-center">
      <p class="text-sm text-gray-600">No notifications yet.</p>
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
      showlikes: false,
      likedposts: [],
      loading: false,
      showedit: false,
      userr: '',
      showSharedPosts: true,
      showfavorites: false,
      shownotif: false,
    };
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
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
    likes() {
      this.showlikes = !this.showlikes;
    },
    favorites() {
      this.showfavorites = true;
      this.showSharedPosts = false;
      this.shownotif = false;
    },
    notif() {
      this.shownotif = true;
      this.showSharedPosts = false;
      this.showfavorites = false;
    },
    edit() {
      this.showedit = !this.showedit;
    },
    SharedPosts() {
      this.showSharedPosts = true;
      this.showfavorites = false;
      this.shownotif = false;
    },
  },
};
</script>
