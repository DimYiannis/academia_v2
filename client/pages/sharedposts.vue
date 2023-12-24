<template>
  <div class="grid mt-12">
    <div class="border-b-2">
      <h1 class="text-base font-semibold mb-2">Shared Posts</h1>
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
      
      <div v-else class="border p-4 mb-4 rounded-3xl" v-for="i of sharedposts">
        Post made by:
        <NuxtLink class="underline decoration-sky-500 capitalize"
        :to="'/profile/' + i.user._id"> {{ i.user.name }}</NuxtLink>
        <p>{{ i.title }}</p>


        <!--the inner v-for loop is based on i.sharedpostdetails-->
        <div v-for="j in i.sharedpostdetails" class="p-2 mx-6 my-4 border border-[#388aef] rounded-3xl">
          <div class="grid items-center">
            <h1 class="text-lg font-semibold">
              <NuxtLink
                class="underline decoration-[#388aef] capitalize"
                :to="'/article/' + j.doi"
                >{{ j.title }}</NuxtLink
              >
            </h1>
            <h2>Author: {{ j.authors }}</h2>
            <h2>Institutions: {{ j.university }}</h2>
            <h3>Year: {{ j.date }}</h3>
          </div>
          <div class="post-content mb-2">
            <p class="line-clamp-3">
              Abstract: {{ j.abstract }}
            </p>
            <h3>doi: {{ j.doi }}</h3>
          </div>
        </div>
    
      </div>
    </main>
  </div>
</template>

<script>
import axios from "axios";

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
          "https://academia-backend-5d0w.onrender.com/api/v1/sharedposts",
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
