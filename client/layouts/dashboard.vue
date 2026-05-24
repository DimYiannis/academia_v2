<template>
  <div class="min-h-screen flex flex-col bg-[#1c1c1e]">
    <LoadSpinner v-if="pending" />

    <header class="bg-[#1c1c1e] text-white px-5 py-3 flex items-center gap-3 shrink-0 border-b border-gray-800">
      <NuxtLink to="/dashboard" class="flex items-center gap-2.5 mr-3">
        <div class="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </div>
        <span class="font-semibold text-base">Academia</span>
      </NuxtLink>

      <nav class="flex items-center gap-1.5">
        <NuxtLink
          to="/dashboard"
          class="px-4 py-1.5 rounded-lg border border-white/40 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          active-class="bg-white/10 !text-white border-white/60"
        >Feed</NuxtLink>
        <NuxtLink
          to="/dashboard/bookmarks"
          class="px-4 py-1.5 rounded-lg border border-white/40 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          active-class="bg-white/10 !text-white border-white/60"
        >Saved</NuxtLink>
        <NuxtLink
          to="/dashboard/sharedposts"
          class="px-4 py-1.5 rounded-lg border border-white/40 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          active-class="bg-white/10 !text-white border-white/60"
        >Explore</NuxtLink>
      </nav>

      <div class="flex-1" />

      <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-white/50 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          class="bg-transparent outline-none text-white placeholder-white/40 text-sm w-32"
          placeholder="Search papers"
        />
      </div>

      <div
        class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-800 text-xs font-bold shrink-0 cursor-pointer"
        @click="logout"
      >
        {{ userInitials }}
      </div>
    </header>

    <div class="flex-1">
      <NuxtPage :posts="posts" :loading="postsLoading" :user="user" />
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'

const user = ref<any>(null)
const posts = ref<any[]>([])
const postsLoading = ref(false)
const pending = ref(true)
const router = useRouter()

const userInitials = computed(() => {
  if (!user.value?.name) return 'U'
  const parts = user.value.name.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return user.value.name.slice(0, 2).toUpperCase()
})

async function fetchUser() {
  try {
    const { data } = await axios.get(
      'https://academiav2-backend.onrender.com/api/v1/users/showUser',
      { withCredentials: true }
    )
    user.value = data.user
  } catch {
    router.push('/')
  }
}

async function fetchPosts() {
  postsLoading.value = true
  try {
    const { data } = await axios.get(
      'https://academiav2-backend.onrender.com/api/v1/posts',
      { withCredentials: true }
    )
    posts.value = data.posts
  } catch (e) {
    console.error(e)
  } finally {
    postsLoading.value = false
  }
}

async function logout() {
  try {
    await axios.get(
      'https://academiav2-backend.onrender.com/api/v1/auth/logout',
      { withCredentials: true }
    )
  } finally {
    router.push('/')
  }
}

onMounted(async () => {
  await Promise.all([fetchUser(), fetchPosts()])
  pending.value = false
})
</script>
