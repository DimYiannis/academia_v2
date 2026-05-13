<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Loading overlay -->
    <LoadSpinner v-if="showHideSpinner" />

    <!-- Dark top navbar -->
    <header class="bg-[#1c1c1e] text-white px-5 py-3 flex items-center gap-3 shrink-0">
      <!-- Logo -->
      <NuxtLink to="/dashboard" class="flex items-center gap-2.5 mr-3">
        <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </div>
        <span class="font-semibold text-base">Academia</span>
      </NuxtLink>

      <!-- Nav pills -->
      <nav class="flex items-center gap-1.5">
        <NuxtLink
          to="/dashboard"
          class="px-4 py-1.5 rounded-lg border border-white/20 text-sm hover:bg-white/10 transition-colors"
          active-class="bg-white/10"
        >Feed</NuxtLink>
        <NuxtLink
          to="/dashboard/bookmarks"
          class="px-4 py-1.5 rounded-lg border border-white/20 text-sm hover:bg-white/10 transition-colors"
          active-class="bg-white/10"
        >Saved</NuxtLink>
        <NuxtLink
          to="/dashboard/sharedposts"
          class="px-4 py-1.5 rounded-lg border border-white/20 text-sm hover:bg-white/10 transition-colors"
          active-class="bg-white/10"
        >Explore</NuxtLink>
      </nav>

      <div class="flex-1"></div>

      <!-- Search -->
      <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-white/50 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          class="bg-transparent outline-none text-white placeholder-white/40 text-sm w-28 laptop:w-36"
          placeholder="Search papers"
        />
      </div>

      <!-- User avatar -->
      <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-800 text-xs font-bold shrink-0 cursor-pointer" @click="logout">
        {{ userInitials }}
      </div>
    </header>

    <!-- Page content -->
    <div class="flex-1">
      <NuxtPage
        :posts="posts"
        :loading="loading"
        :user="user"
        @update-posts="getsinglepost"
        @show-notif="notif"
        :shownotif="shownotif"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: "",
      postId: "",
      loading: false,
      showHideSpinner: true,
      posts: [{ liked: false, bookmarked: false }],
      shownotif: false,
    };
  },
  computed: {
    userInitials() {
      if (!this.user?.name) return 'U';
      const parts = this.user.name.trim().split(' ');
      if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      return this.user.name.slice(0, 2).toUpperCase();
    },
  },
  beforeCreate() {
    this.showHideSpinner = true;
  },
  beforeMount() {
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
          { withCredentials: true }
        );
        this.user = response.data.user;
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    },
    async logout() {
      try {
        await axios.get("https://academiav2-backend.onrender.com/api/v1/auth/logout", {
          withCredentials: true,
        });
        this.$router.push({ name: "index" });
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async getposts() {
      this.loading = true;
      try {
        const response = await axios.get(
          "https://academiav2-backend.onrender.com/api/v1/posts",
          { withCredentials: true }
        );
        this.posts = response.data.posts;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    notif() {
      this.shownotif = !this.shownotif;
    },
    getsinglepost(searchedpost) {
      this.posts = searchedpost;
    },
  },
};
</script>
