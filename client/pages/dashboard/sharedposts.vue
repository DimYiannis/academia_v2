<template>
  <div class="px-6 py-6 text-gray-100">
    <div class="border-b border-gray-700 mb-4">
      <h1 class="text-base font-semibold mb-2 text-white">Shared Posts</h1>
    </div>

    <main class="overflow-y-auto">
      <div v-if="loading" class="flex justify-center py-16">
        <LoadSpinner />
      </div>

      <div v-else class="border border-gray-700 p-4 mb-4 rounded-2xl hover:border-gray-600 transition-colors" v-for="i of sharedposts" :key="i._id">
        <p class="text-xs text-gray-400 mb-2">
          Post by
          <NuxtLink class="text-teal-400 hover:text-teal-300 transition-colors" :to="'/dashboard/user/' + i.user._id">{{ i.user.name }}</NuxtLink>
        </p>
        <p v-if="i.title" class="text-sm text-gray-300 mb-3">{{ i.title }}</p>

        <div v-for="j in i.sharedpostdetails" :key="j.doi" class="p-3 my-3 border border-gray-600 rounded-xl">
          <h1 class="text-sm font-semibold text-white mb-1">
            <NuxtLink class="hover:text-teal-400 transition-colors" :to="'/article/' + (j.arxivId || j.doi)">{{ j.title }}</NuxtLink>
          </h1>
          <div class="flex flex-wrap gap-x-3 text-xs text-gray-400 mb-2">
            <span v-if="j.authors">{{ j.authors }}</span>
            <span v-if="j.university">{{ j.university }}</span>
            <span v-if="j.date">{{ j.date }}</span>
          </div>
          <p class="line-clamp-3 text-sm text-gray-400">{{ j.abstract }}</p>
          <p v-if="j.doi" class="text-xs text-gray-500 mt-1">{{ j.doi }}</p>
        </div>
      </div>
    </main>
  </div>
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
      loading: false,
    };
  },
  mounted() {
    // Invoke when the component is mounted
    this.getsharedposts();
  },
  methods: {
    async getsharedposts() {
      try {
        this.loading = true;
        const response = await axios.get(
          `${API_BASE}/api/v1/sharedposts`,
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
        this.loading = false
      }
    },
  },
};
</script>
