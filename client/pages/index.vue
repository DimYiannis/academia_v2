<template>
  <div class="min-h-[calc(100vh-57px)] flex flex-col items-center justify-center px-6 py-24 text-center">
    <span class="inline-block mb-6 px-3 py-1 rounded-full bg-blue-50 text-[#388aef] text-sm font-medium">
      arXiv · OpenAlex · open access
    </span>

    <h1 class="text-4xl tablet:text-5xl laptop:text-6xl font-bold text-gray-900 max-w-3xl leading-tight">
      The research feed for AI, maths and hardware.
    </h1>

    <p class="mt-6 text-lg text-gray-500 max-w-lg">
      Daily papers from arXiv. Citation counts from OpenAlex. Share insights with researchers who care.
    </p>

    <div class="mt-12 flex gap-10 text-center">
      <div>
        <div class="text-3xl font-bold text-gray-900">4</div>
        <div class="mt-1 text-sm text-gray-400">research topics</div>
      </div>
      <div class="w-px bg-gray-200"></div>
      <div>
        <div class="text-3xl font-bold text-gray-900">Daily</div>
        <div class="mt-1 text-sm text-gray-400">arXiv updates</div>
      </div>
      <div class="w-px bg-gray-200"></div>
      <div>
        <div class="text-3xl font-bold text-gray-900">Free</div>
        <div class="mt-1 text-sm text-gray-400">forever</div>
      </div>
    </div>

    <div class="mt-12 flex gap-3">
      <NuxtLink
        to="/register"
        class="px-6 py-3 bg-[#388aef] text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
      >
        Get started
      </NuxtLink>
      <NuxtLink
        to="/login"
        class="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:border-gray-400 transition-colors"
      >
        Sign in
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {};
</script>
