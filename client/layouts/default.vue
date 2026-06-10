<template>
  <div class="min-h-screen bg-[#1c1c1e]">
    <header class="border-b border-gray-800 px-6 py-4">
      <nav>
        <a href="/" class="flex items-center gap-2.5 w-fit text-xl font-bold text-white tracking-tight">
          <span class="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </span>
          Academia
        </a>
      </nav>
    </header>
    <slot />
  </div>
</template>
