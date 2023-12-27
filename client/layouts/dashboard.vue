<template>
  <!-- loading state -->
  <LoadSpinner v-if="showHideSpinner" />
  
  <header class="">
    <nav class="text-3xl text-sky-600 font-bold border-b-2">
      <a href="/" class="">Academia</a>
    </nav>
  </header>

  <div class="flex gap-10">
    <!--SideBar-->
    <aside class="mobile:grid gap-2 mt-12 border-r-2 hidden">
      <div class="grid gap-1 mr-12">
        <NuxtLink to="/dashboard/Profile" class="flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0a3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          <h1 class="hidden tablet:contents">Profile</h1>
        </NuxtLink>

        <NuxtLink
          to="/dashboard/"
          class="flex gap-2 items-center"
          @click="getposts"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="m21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <h1 class="hidden tablet:contents">Explore</h1>
        </NuxtLink>

        <NuxtLink to="/dashboard/messages" class="flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
          <h1 class="hidden tablet:contents">Messages</h1>
        </NuxtLink>

        <NuxtLink to="/dashboard/bookmarks" class="flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25L4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
            />
          </svg>
          <h1 class="hidden tablet:contents">Bookmarks</h1>
        </NuxtLink>

        <NuxtLink to="/dashboard/sharedposts" class="flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75l3 3m0 0l3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
            />
          </svg>
          <h1 class="hidden tablet:contents">Shared Posts</h1>
        </NuxtLink>
      </div>

      <button class="m-0" @click="logout()">logout</button>
    </aside>
    <!-- Main content -->
    <main class="w-full">
      <div class="h-screen overflow-auto no-scrollbar">
        <NuxtPage
          :posts="posts"
          :loading="loading"
          @update-posts="getsinglepost"
          :user="user"
          @show-notif="notif"
          :shownotif="shownotif"
        />
      </div>
    </main>
  </div>
  <!--mobile sidebar -->
  <footer
    class="fixed bottom-0 left-0 z-20 w-full h-fit bg-white gap-2 mobile:hidden p-1 overflow-y"
  >
    <div class="flex w-full h-full justify-evenly">
      <NuxtLink to="/dashboard/profile" class="block">
        <svg
          class="h-5 w-5 smallscreen:h-8 smallscreen:w-8"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0a3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </NuxtLink>

      <NuxtLink to="/dashboard/" class="block" @click="getposts">
        <svg
          class="h-5 w-5 smallscreen:h-8 smallscreen:w-8"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="m21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <h1 class="hidden tablet:contents">Explore</h1>
      </NuxtLink>

      <NuxtLink to="/dashboard/messages" class="block">
        <svg
          class="h-5 w-5 smallscreen:h-8 smallscreen:w-8"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
          />
        </svg>
      </NuxtLink>

      <NuxtLink to="/dashboard/bookmarks" class="block">
        <svg
          class="h-5 w-5 smallscreen:h-8 smallscreen:w-8"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25L4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
          />
        </svg>
      </NuxtLink>

      <NuxtLink to="/dashboard/sharedposts" class="block">
        <svg
          class="h-5 w-5 smallscreen:h-8 smallscreen:w-8"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75l3 3m0 0l3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
          />
        </svg>
      </NuxtLink>

      <button class="m-0 text-xs smallscreen:text-lg" @click="logout()">
        logout
      </button>
    </div>
  </footer>
</template>

<script>
import axios from "axios";

export default {
  async asyncData({ $axios }) {
    try {
      const userResponse = await $axios.get(
        "https://academiav2-backend.onrender.com/api/v1/users/showUser",
        {
          withCredentials: true,
        }
      );

      const postsResponse = await $axios.get(
        "https://academiav2-backend.onrender.com/api/v1/posts",
        {
          withCredentials: true,
        }
      );

      return {
        user: userResponse.data.user,
        posts: postsResponse.data.posts,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      console.error("Error response data:", error.response.data);
      console.log("Response headers:", error.response.headers);
      return {
        user: null,
        posts: [],
      };
    }
  },
  data() {
    return {
      name: "",
      role: "",
      userId: "",
      user: "",
      postId: "",
      loading: false,
      showHideSpinner: true,
      posts: [
        {
          liked: false,
          bookmarked: false,
        },
      ],
      shownotif: false,
    };
  },
  beforeCreate() {
    this.showHideSpinner = true;
  },
  beforeMount() {
    // Invoke getuser method when the component is mounted
    this.getuser();
    this.getposts();
  },
  mounted() {
    this.showHideSpinner = false;
  },
  methods: {
    async getuser() {
      try {
        const response = await axios.get(
          "https://academiav2-backend.onrender.com/api/v1/users/showUser",
          {
            withCredentials: true,
          }
        );

        this.user = response.data.user;
        console.log(this.user);
      } catch (error) {
        console.error("Error fetching user information:", error);
        console.error("Error response data:", error.response.data);
        console.log("Response headers:", error.response.headers);
      }
    },
    logout() {
      try {
        axios
          .get("https://academiav2-backend.onrender.com/api/v1/auth/logout", {
            withCredentials: true,
          })
          .then((response) => {
            console.log(response);
          });
        this.$router.push({ name: "index" });
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async getposts() {
      this.loading = true;
      try {
        const response = await axios.get("https://academiav2-backend.onrender.com/api/v1/posts", {
          withCredentials: true,
        });

        this.posts = response.data.posts;
      } catch (error) {
        console.error(error.response.data);
      } finally {
        this.loading = false;
      }
    },
    notif() {
      this.shownotif = !this.shownotif;
      //console.log(this.shownotif);
    },
    getsinglepost(searchedpost) {
      this.posts = searchedpost;
      //console.log(searchedpost);
    },
  },
};
</script>
