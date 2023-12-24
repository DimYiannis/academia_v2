<template>
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
  <main v-else class="flex mt-8 h-fit ml-20 w-5/6">
    <section class="h-full max-w-[600px] border-r-2">
      <div class="grid gap-2 w-full">
        <div>
          <h1 class="text-xl font-semibold mt-4 capitalize border-b-2"></h1>
        </div>

        <div
          class="mt-2 h-[250px] bg-cover bg-center mr-1"
          :style="{
            backgroundImage: user.backgroundImg
              ? 'url(https://academia-backend-5d0w.onrender.com' + user.backgroundImg + ')'
              : 'none',
            backgroundColor: user.backgroundImage ? '' : '#B0A8B9',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }"
        ></div>
        <div class="relative">
          <div class="flex justify-between items-start">
            <div
              class="rounded-full ml-4 w-20 h-32 absolute -top-16 left-2"
              :style="{
                backgroundImage: user.profileImg
                  ? 'url(https://academia-backend-5d0w.onrender.com' + user.profileImg + ')'
                  : 'none',
                backgroundColor: user.backgroundImage ? '' : '#B0A8B9',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }"
            ></div>
            <div>
              <!--edit prof-->
              <nav class="flex mt-6 text-lg font-semobold absolute right-0">
                <button class="">Connect</button>
              </nav>
            </div>
          </div>
        </div>

        <div class="mt-20 pb-3">
          <h1 class="text-3xl capitalize">{{ user.name }}</h1>
          <h2 class="text-lg mt-3">{{ user.info }}</h2>
        </div>
      </div>

      <div>
        <!--content-->
        <div class="grid mt-12">
          <div class="border-b-2 flex gap-5">
            <h1
              @click="sharedPosts"
              class="text-base font-semibold cursor-pointer mb-2"
              :class="{
                'underline decoration-4 decoration-sky-500 underline-offset-4':
                  showSharedPosts,
              }"
            >
              Shared Posts
            </h1>
            <h1
              @click="likes"
              class="text-base font-semibold cursor-pointer"
              :class="{
                'underline decoration-4 decoration-sky-500 underline-offset-4':
                  showlikes,
              }"
            >
              Favorites
            </h1>
          </div>

          <main
            class="h-screen mt-5 mr-2 overflow-hidden overflow-y-auto overscroll-auto"
          >
            <div
              :class="{
                'transition-opacity ease-out duration-500 opacity-0 hidden':
                  !showSharedPosts,
                'transition-opacity ease-in duration-500 opacity-100':
                  showSharedPosts,
              }"
              class="border p-4 mb-4 rounded-3xl"
              v-for="i of sharedposts"
            >
              <h1>Post made by: {{ i.user.name }}</h1>
              <p>{{ i.title }}</p>

              <!--the inner v-for loop is based on i.sharedpostdetails-->
              <div
                v-show="showSharedPosts"
                v-for="j in i.sharedpostdetails"
                class="p-2 mx-6 my-4 border border-[#388aef] rounded-3xl"
              >
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
                  <p class="line-clamp-3">Abstract: {{ j.abstract }}</p>
                  <h3>doi: {{ j.doi }}</h3>
                  <!-- You can add other multimedia content (images, videos) here -->
                </div>
              </div>
            </div>

            <section class="mt-5">
              <!--Likes-->
              <div class="mt-34">
                <!--content-->
                <div>
                  <div
                    :class="{
                      'transition-opacity ease-out duration-500 opacity-0 hidden':
                        !showlikes,
                      'transition-opacity ease-in duration-500 opacity-100':
                        showlikes,
                    }"
                  >
                    <main
                      class="h-screen mt-5 mr-2 overflow-hidden overflow-y-auto overscroll-auto"
                    >
                      <div
                        v-show="showlikes"
                        class="border p-4 mb-4 rounded-3xl grid"
                        v-for="i of likedposts"
                      >
                        
                        <div
                          v-for="j in [i.postDetails]"
                          class="p-2 mx-6 my-4 border border-[#388aef] rounded-3xl"
                        >
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
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import axios from "axios";
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
  props: {
    shownotif: {
      type: Boolean,
      required: true,
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
          `https://academia-backend-5d0w.onrender.com/api/v1/users/${userId}`,
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
          `https://academia-backend-5d0w.onrender.com/api/v1/users/${userId}/posts`,
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
          `https://academia-backend-5d0w.onrender.com/api/v1/likes/${userId}/likes`,
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
