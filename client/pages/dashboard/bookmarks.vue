<template>
  <div class="grid mt-12">
    <div class="border-b-2">
      <h1 class="text-base font-semibold mb-2">Bookmarks</h1>
    </div>
    <main class="h-screen mt-4 overflow-hidden overflow-y-auto overscroll-auto">
      
      <!-- Loading state v-if="loading" -->
      <div v-if="loading" class="grid place-items-center h-full">
        <div class="text-center text-lg font-semibold py-4 animate-bounce">
          <div role="status">
            <svg
              aria-hidden="true"
              class="inline w-10 h-10text-gray-200 animate-spin dark:text-gray-600 fill-[#2c6dbd]"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            Loading...
          </div>
        </div>
      </div>

      <div v-else class="post border p-4 mb-4 rounded-3xl" v-for="j of bookmarks">
        <div class="grid post-header items-center mb-2">
          <h1 class="text-lg font-semibold">
            <NuxtLink
              class="underline decoration-sky-500 capitalize text-sm 
              smallscreen:text-base"
              :to="'/article/' + j.doi"
              >{{ j.postDetails?.title }}</NuxtLink
            >
          </h1>
          <h2 class="text-sm smallscreen:text-base">Author: {{ j.postDetails?.authors }}</h2>
          <h2 class="text-sm smallscreen:text-base">Institutions: {{ j.postDetails?.university }}</h2>
          <h3 class="text-sm smallscreen:text-base">Year: {{ j.postDetails?.date }}</h3>
          <p class="line-clamp-3 text-sm smallscreen:text-base">Abstract: {{ j.postDetails?.abstract }}</p>
          <h3 class="text-sm smallscreen:text-base">doi: {{ j.postDetails?.doi }}</h3>

          <div class="flex justify-between mt-4">
            <div>
              <button @click="deletebookmark(j._id)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="26"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="m3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25L4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5"
                  />
                </svg>
              </button>
            </div>
          </div>
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
