<template>
  <div v-if="loading" class="flex justify-center py-16">
    <LoadSpinner />
  </div>

  <main v-else class="px-6 py-6 text-gray-100 max-w-3xl">

    <!-- Banner -->
    <div
      class="h-40 rounded-xl mb-4 bg-gray-700"
      :style="user.backgroundImg ? {
        backgroundImage: `url(${API_BASE}` + user.backgroundImg + ')',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      } : {}"
    ></div>

    <!-- Avatar + actions row -->
    <div class="relative flex items-end justify-between mb-4 -mt-10 px-2">
      <div
        class="w-20 h-20 rounded-full border-4 border-[#1c1c1e] bg-gray-600"
        :style="user.profileImg ? {
          backgroundImage: `url(${API_BASE}` + user.profileImg + ')',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        } : {}"
      ></div>
      <button
        @click="edit"
        class="px-4 py-1.5 rounded-lg border border-gray-600 text-sm text-gray-300 hover:border-gray-400 hover:text-white transition-colors bg-transparent"
      >Edit Profile</button>
    </div>

    <!-- Name + bio -->
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-white capitalize">{{ user.name }}</h1>
      <p v-if="user.info" class="text-sm text-gray-400 mt-1">{{ user.info }}</p>
    </div>

    <!-- Tab bar -->
    <div class="flex gap-5 border-b border-gray-700 mb-5">
      <button
        @click="SharedPosts"
        class="text-sm font-medium pb-2 transition-colors"
        :class="showSharedPosts ? 'text-white border-b-2 border-teal-500' : 'text-gray-400 hover:text-gray-200'"
      >Shared Posts</button>
      <button
        @click="favorites"
        class="text-sm font-medium pb-2 transition-colors"
        :class="showfavorites ? 'text-white border-b-2 border-teal-500' : 'text-gray-400 hover:text-gray-200'"
      >Favorites</button>
      <button
        @click="notif"
        class="text-sm font-medium pb-2 transition-colors"
        :class="shownotif ? 'text-white border-b-2 border-teal-500' : 'text-gray-400 hover:text-gray-200'"
      >Notifications</button>
    </div>

    <!-- Shared Posts tab -->
    <div v-show="showSharedPosts">
      <div
        v-for="i of sharedposts"
        :key="i._id"
        class="border border-gray-700 p-4 mb-3 rounded-2xl hover:border-gray-600 transition-colors"
      >
        <p class="text-xs text-gray-400 mb-2">Shared by {{ i.user?.name }}</p>
        <p v-if="i.title" class="text-sm text-gray-300 mb-3">{{ i.title }}</p>
        <div v-for="j in i.sharedpostdetails" :key="j.doi" class="border border-gray-600 rounded-xl p-3 mb-2">
          <h2 class="text-sm font-semibold text-white mb-1">
            <NuxtLink class="hover:text-teal-400 transition-colors" :to="'/article/' + j.doi">{{ j.title }}</NuxtLink>
          </h2>
          <div class="flex flex-wrap gap-x-3 text-xs text-gray-400 mb-1">
            <span v-if="j.authors">{{ j.authors }}</span>
            <span v-if="j.university">{{ j.university }}</span>
            <span v-if="j.date">{{ j.date }}</span>
          </div>
          <p class="text-xs text-gray-500 line-clamp-2">{{ j.abstract }}</p>
        </div>
        <button
          @click="deletepost(i._id)"
          class="mt-2 px-3 py-1 text-xs rounded-lg border border-red-800 text-red-400 hover:bg-red-900/20 transition-colors bg-transparent"
        >Delete</button>
      </div>
      <p v-if="!sharedposts.length" class="text-sm text-gray-500">No shared posts yet.</p>
    </div>

    <!-- Favorites tab -->
    <div v-show="showfavorites">
      <div
        v-for="i of likedposts"
        :key="i._id"
        class="border border-gray-700 p-4 mb-3 rounded-2xl hover:border-gray-600 transition-colors"
      >
        <div v-for="j in [i.postDetails]" :key="j?.doi">
          <div class="flex items-start justify-between mb-1">
            <h2 class="text-sm font-semibold text-white">
              <NuxtLink class="hover:text-teal-400 transition-colors" :to="'/article/' + j?.doi">{{ j?.title }}</NuxtLink>
            </h2>
            <button @click="unlike(i._id)" class="p-1 text-gray-500 hover:text-red-400 transition-colors bg-transparent border-0 ml-2 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12L5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <div class="flex flex-wrap gap-x-3 text-xs text-gray-400 mb-1">
            <span v-if="j?.authors">{{ j.authors }}</span>
            <span v-if="j?.university">{{ j.university }}</span>
            <span v-if="j?.date">{{ j.date }}</span>
          </div>
          <p class="text-xs text-gray-500 line-clamp-2">{{ j?.abstract }}</p>
        </div>
      </div>
      <p v-if="!likedposts.length" class="text-sm text-gray-500">No liked posts yet.</p>
    </div>

    <!-- Notifications tab -->
    <div v-show="shownotif" class="flex flex-col items-center py-10 gap-4">
      <p class="text-sm text-gray-400">No notifications yet.</p>
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
