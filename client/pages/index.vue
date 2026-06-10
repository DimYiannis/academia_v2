<template>
  <div class="min-h-screen bg-[#1c1c1e] flex flex-col items-center justify-center px-6 py-24 text-center">
    <span class="inline-block mb-6 px-3 py-1 rounded-full bg-teal-900/40 border border-teal-800/60 text-teal-300 text-sm font-medium">
      arXiv · HuggingFace · OpenAlex
    </span>

    <h1 class="text-4xl tablet:text-5xl laptop:text-6xl font-bold text-white max-w-3xl leading-tight tracking-tight">
      Your daily <span class="text-teal-400">AI research</span> feed.
    </h1>

    <p class="mt-6 text-lg text-gray-400 max-w-lg">
      Live papers from arXiv and HuggingFace. Citation counts from OpenAlex.
      Like, save, take notes — and map it all in your knowledge graph.
    </p>

    <div class="mt-12 flex gap-10 text-center">
      <div>
        <div class="text-3xl font-bold text-white">{{ paperCount || '—' }}</div>
        <div class="mt-1 text-sm text-gray-500">papers today</div>
      </div>
      <div class="w-px bg-gray-800"></div>
      <div>
        <div class="text-3xl font-bold text-white">4</div>
        <div class="mt-1 text-sm text-gray-500">research topics</div>
      </div>
      <div class="w-px bg-gray-800"></div>
      <div>
        <div class="text-3xl font-bold text-white">Free</div>
        <div class="mt-1 text-sm text-gray-500">forever</div>
      </div>
    </div>

    <div class="mt-12 flex gap-3">
      <NuxtLink
        to="/register"
        class="px-6 py-3 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-500 transition-colors"
      >
        Get started
      </NuxtLink>
      <NuxtLink
        to="/login"
        class="px-6 py-3 border border-gray-700 text-gray-300 rounded-xl text-sm font-medium hover:border-gray-500 hover:text-white transition-colors"
      >
        Sign in
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const API_BASE = import.meta.dev ? 'http://localhost:5000' : 'https://academiav2-backend.onrender.com'

// Live count of today's curated papers (public endpoint)
const paperCount = ref(null)
onMounted(async () => {
  try {
    const data = await $fetch(`${API_BASE}/api/papers/featured`)
    paperCount.value = (data.papers || []).length
  } catch { /* keep placeholder */ }
})
</script>
