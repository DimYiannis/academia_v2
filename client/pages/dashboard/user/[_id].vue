<template>
  <div v-if="loading" class="flex justify-center py-16">
    <LoadSpinner />
  </div>

  <main v-else class="px-6 py-6 text-gray-100 max-w-3xl">

    <!-- Banner -->
    <div
      class="h-40 rounded-xl mb-4 bg-gray-700"
      :style="user.backgroundImg ? {
        backgroundImage: 'url(https://academiav2-backend.onrender.com' + user.backgroundImg + ')',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      } : {}"
    ></div>

    <!-- Avatar + Connect -->
    <div class="relative flex items-end justify-between mb-4 -mt-10 px-2">
      <div
        class="w-20 h-20 rounded-full border-4 border-[#1c1c1e] bg-gray-600"
        :style="user.profileImg ? {
          backgroundImage: 'url(https://academiav2-backend.onrender.com' + user.profileImg + ')',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        } : {}"
      ></div>
      <button class="px-4 py-1.5 rounded-lg border border-gray-600 text-sm text-gray-300 hover:border-teal-500 hover:text-teal-400 transition-colors bg-transparent">
        Connect
      </button>
    </div>

    <!-- Name + bio -->
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-white capitalize">{{ user.name }}</h1>
      <p v-if="user.info" class="text-sm text-gray-400 mt-1">{{ user.info }}</p>
    </div>

    <!-- Tab bar -->
    <div class="flex gap-5 border-b border-gray-700 mb-5">
      <button
        @click="sharedPosts"
        class="text-sm font-medium pb-2 transition-colors"
        :class="showSharedPosts ? 'text-white border-b-2 border-teal-500' : 'text-gray-400 hover:text-gray-200'"
      >Shared Posts</button>
      <button
        @click="likes"
        class="text-sm font-medium pb-2 transition-colors"
        :class="showlikes ? 'text-white border-b-2 border-teal-500' : 'text-gray-400 hover:text-gray-200'"
      >Favorites</button>
    </div>

    <!-- Shared Posts -->
    <div v-show="showSharedPosts">
      <div
        v-for="i of sharedposts"
        :key="i._id"
        class="border border-gray-700 p-4 mb-3 rounded-2xl hover:border-gray-600 transition-colors"
      >
        <p class="text-xs text-gray-400 mb-2">by {{ i.user?.name }}</p>
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
      </div>
      <p v-if="!sharedposts.length" class="text-sm text-gray-500">No shared posts yet.</p>
    </div>

    <!-- Favorites -->
    <div v-show="showlikes">
      <div
        v-for="i of likedposts"
        :key="i._id"
        class="border border-gray-700 p-4 mb-3 rounded-2xl hover:border-gray-600 transition-colors"
      >
        <div v-for="j in [i.postDetails]" :key="j?.doi">
          <h2 class="text-sm font-semibold text-white mb-1">
            <NuxtLink class="hover:text-teal-400 transition-colors" :to="'/article/' + j?.doi">{{ j?.title }}</NuxtLink>
          </h2>
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

  </main>
</template>

<script>
import axios from "axios";

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
          `https://academiav2-backend.onrender.com/api/v1/users/${userId}`,
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
          `https://academiav2-backend.onrender.com/api/v1/users/${userId}/posts`,
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
          `https://academiav2-backend.onrender.com/api/v1/likes/${userId}/likes`,
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
