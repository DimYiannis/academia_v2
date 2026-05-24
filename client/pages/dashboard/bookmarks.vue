<template>
  <div class="px-6 py-6 text-gray-100">
    <div class="border-b border-gray-700 mb-4">
      <h1 class="text-base font-semibold mb-2 text-white">Bookmarks</h1>
    </div>
    <main class="overflow-y-auto">
      <div v-if="loading" class="flex justify-center py-16">
        <LoadSpinner />
      </div>

      <div v-else class="border border-gray-700 p-4 mb-4 rounded-2xl hover:border-gray-600 transition-colors" v-for="j of bookmarks" :key="j._id">
        <h1 class="text-sm font-semibold text-white mb-1">
          <NuxtLink class="hover:text-teal-400 transition-colors" :to="'/article/' + j.doi">
            {{ j.postDetails?.title }}
          </NuxtLink>
        </h1>
        <div class="flex flex-wrap gap-x-3 text-xs text-gray-400 mb-2">
          <span v-if="j.postDetails?.authors">{{ j.postDetails.authors }}</span>
          <span v-if="j.postDetails?.university">{{ j.postDetails.university }}</span>
          <span v-if="j.postDetails?.date">{{ j.postDetails.date }}</span>
        </div>
        <p class="line-clamp-3 text-sm text-gray-400 mb-3">{{ j.postDetails?.abstract }}</p>
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-500">{{ j.postDetails?.doi }}</span>
          <button
            @click="deletebookmark(j._id)"
            class="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25L4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from "axios";
definePageMeta({
  layout: 'dashboard'
})

export default {
  data() {
    return {
      bookmarks: [],
      loading:false,
    };
  },
  mounted() {
    this.getBookmarks();
  },
  methods: {
    async getBookmarks() {
      try {
        this.loading = true;
        const response = await axios.get(
          "https://academiav2-backend.onrender.com/api/v1/bookmarks",
          {
            withCredentials: true,
          }
        );

        this.bookmarks = response.data.bookmarks;
        //console.log(this.bookmarks);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        this.loading = false
      }
    },
    async deletebookmark(bookmarkId) {
      try {
        //console.log(this.bookmarks);
        await axios.delete(
          `https://academiav2-backend.onrender.com/api/v1/bookmarks/${bookmarkId}`,
          {
            withCredentials: true,
          }
        );
        // Refresh bookmarks after deletion
        this.getBookmarks();
      } catch (error) {
        console.error("Error deleting bookmark:", error);
      }
    },
  },
};
</script>
