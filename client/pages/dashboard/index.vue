<template>
  <!-- Responsive grid: 1col (mobile) → 2col (laptop) → 3col (desktop) -->
  <div class="grid min-h-[calc(100vh-52px)] bg-[#1c1c1e] grid-cols-1 laptop:grid-cols-[180px_1fr] desktop:grid-cols-[180px_1fr_200px]">

    <!-- ── Col 1: Left nav (hidden below laptop) ───────────── -->
    <aside class="hidden laptop:flex flex-col border-r border-gray-800 py-6 px-3 overflow-y-auto bg-[#1c1c1e] sticky top-0 h-[calc(100vh-52px)]">

      <!-- TOPICS -->
      <div class="mb-6">
        <p class="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3 px-2">Topics</p>
        <div
          v-for="topic in topics"
          :key="topic.id"
          @click="activeTopic = topic.id"
          class="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer group transition-colors"
          :class="activeTopic === topic.id
            ? 'bg-teal-900/30'
            : 'hover:bg-gray-800'"
        >
          <div
            class="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors"
            :class="activeTopic === topic.id
              ? 'border-teal-500 bg-teal-500'
              : 'border-gray-600 group-hover:border-gray-400'"
          >
            <svg v-if="activeTopic === topic.id" xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span
            class="text-xs flex-1 transition-colors"
            :class="activeTopic === topic.id
              ? 'text-teal-300 font-medium'
              : 'text-gray-300'"
          >{{ topic.label }}</span>
        </div>
      </div>

      <!-- SOURCES -->
      <div class="mb-6">
        <p class="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3 px-2">Sources</p>
        <div
          v-for="source in sources"
          :key="source.id"
          @click="!source.disabled && toggleSource(source.id)"
          class="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer group transition-colors"
          :class="isSourceActive(source.id) ? 'bg-teal-900/30' : source.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-800'"
        >
          <div
            class="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors"
            :class="isSourceActive(source.id) ? 'border-teal-500 bg-teal-500' : 'border-gray-600 group-hover:border-gray-400'"
          >
            <svg v-if="isSourceActive(source.id)" xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span class="text-xs flex-1 transition-colors" :class="isSourceActive(source.id) ? 'text-teal-300 font-medium' : 'text-gray-300'">{{ source.label }}</span>
        </div>
      </div>

      <!-- FILTER BY -->
      <div>
        <p class="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3 px-2">Filter By</p>
        <div
          v-for="filter in filters"
          :key="filter.id"
          @click="toggleFilter(filter.id)"
          class="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer group transition-colors"
          :class="activeFilters[filter.id] ? 'bg-teal-900/30' : 'hover:bg-gray-800'"
        >
          <div
            class="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors"
            :class="activeFilters[filter.id] ? 'border-teal-500 bg-teal-500' : 'border-gray-600 group-hover:border-gray-400'"
          >
            <svg v-if="activeFilters[filter.id]" xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span class="text-xs transition-colors" :class="activeFilters[filter.id] ? 'text-teal-300 font-medium' : 'text-gray-300'">{{ filter.label }}</span>
        </div>
      </div>
    </aside>

    <!-- ── Col 2: Center feed ──────────────────────────────── -->
    <main class="min-w-0 px-4 tablet:px-6 py-6 overflow-x-hidden">

      <!-- Mobile topic selector (left sidebar hidden below laptop) -->
      <div class="laptop:hidden -mx-4 px-4 mb-4 flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="topic in topics"
          :key="topic.id"
          @click="activeTopic = topic.id"
          class="px-3 py-1.5 rounded-lg text-sm whitespace-nowrap shrink-0 transition-colors"
          :class="activeTopic === topic.id ? 'bg-teal-900/40 text-teal-300 font-medium' : 'bg-gray-800 text-gray-400'"
        >{{ topic.label }}</button>
      </div>

      <!-- Page heading + feed tabs -->
      <div class="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <h1 class="text-base font-semibold text-gray-200">
          {{ topics.find(t => t.id === activeTopic)?.label }} papers
        </h1>
        <div class="flex items-center gap-1.5 overflow-x-auto">
          <button
            v-for="tab in feedTabs"
            :key="tab"
            @click="activeTab = tab"
            class="flex items-center gap-1.5 px-2.5 tablet:px-3 py-1.5 rounded-lg border text-sm whitespace-nowrap shrink-0 transition-colors"
            :class="activeTab === tab
              ? 'border-gray-500 text-white bg-gray-800'
              : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 hidden tablet:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Loading posts -->
      <div v-if="loading">
        <SkeletonCard v-for="n in 3" :key="n" />
      </div>

      <template v-else>
        <!-- Toast -->
        <Transition name="toast">
          <div
            v-if="showTooltip"
            :class="isRemovalMsg
              ? 'bg-[#2a1c1e] border-red-800/60 text-red-300'
              : 'bg-[#1c2a26] border-teal-700/60 text-teal-200'"
            class="fixed top-16 right-4 z-30 flex items-center gap-2.5 text-sm border rounded-xl px-4 py-2.5 shadow-xl shadow-black/40 backdrop-blur"
          >
            <svg v-if="!isRemovalMsg" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-teal-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            {{ message }}
          </div>
        </Transition>

        <!-- HuggingFace featured (AI topic only — HF daily is all ML/AI) OR saved bookmarks (any topic) -->
        <div v-if="(activeTab === 'Saved' || activeTopic === 'ai') && displayedPosts && displayedPosts.length" class="mb-6">
          <div class="flex items-center gap-2 mb-3">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {{ activeTab === 'Saved' ? 'Saved papers' : 'Today on HuggingFace' }}
            </p>
            <span v-if="activeTab !== 'Saved'" class="text-xs text-gray-600">· curated</span>
          </div>
          <div
            v-for="(i, index) in displayedPosts.slice(0, 8)"
            :key="index"
            class="relative bg-[#242426] border border-gray-700/60 rounded-2xl p-5 mb-3 hover:border-gray-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 transition-all duration-200 overflow-hidden"
          >
            <img
              v-if="i.thumbnail"
              :src="i.thumbnail"
              :alt="i.title"
              class="hidden tablet:block absolute top-0 right-0 h-full w-44 object-cover pointer-events-none rounded-r-2xl"
              style="mask-image: linear-gradient(to right, transparent, black 50%); -webkit-mask-image: linear-gradient(to right, transparent, black 50%)"
              
              loading="lazy"
              @load="onThumbLoad" @error="$event.target.style.display='none'"
            />
            <div class="relative tablet:pr-44">
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-900/40 text-orange-300 shrink-0">HuggingFace</span>
                <span v-if="i.date" class="text-xs text-gray-500">{{ new Date(i.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }}</span>
                <span v-if="i.upvotes" class="flex items-center gap-1 text-xs text-gray-600 ml-auto shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l8 8H4z"/></svg>
                  {{ i.upvotes }}
                </span>
              </div>
              <h2 class="text-[15px] font-semibold text-white leading-snug mb-1.5">
                <NuxtLink :to="'/article/' + i.id" class="hover:text-teal-400 transition-colors">
                  {{ i.title }}
                </NuxtLink>
              </h2>
              <p v-if="i.authors && i.authors.length" class="text-xs text-gray-500 mb-2 truncate">
                {{ i.authors.slice(0, 4).join(', ') }}{{ i.authors.length > 4 ? ` +${i.authors.length - 4} more` : '' }}
              </p>
              <p class="text-sm text-gray-400 line-clamp-3 leading-relaxed">{{ i.abstract }}</p>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-700/40 flex items-center gap-3 tablet:pr-44">
              <a v-if="i.id" :href="'https://arxiv.org/html/' + i.id" target="_blank" rel="noopener"
                class="flex items-center gap-1 text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                Read
              </a>
              <a v-if="i.pdf" :href="i.pdf" target="_blank" rel="noopener" class="text-xs text-gray-600 hover:text-gray-400 transition-colors">PDF</a>

              <template v-if="activeTab !== 'Saved'">
                <button @click="likePaper(i)" :disabled="likeLoading"
                  class="ml-auto p-1.5 rounded-lg transition-colors disabled:cursor-progress"
                  :class="isLiked(i) ? 'text-red-400 like-pop' : 'text-gray-500 hover:text-red-400 hover:bg-red-900/20'"
                  :title="isLiked(i) ? 'Unlike' : 'Like'">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" :fill="isLiked(i) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 8.25c0-2.485-2.099-4.5-4.687-4.5-1.936 0-3.598 1.126-4.313 2.733-.715-1.607-2.377-2.733-4.312-2.733C5.098 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </button>
                <button @click="savePaper(i)" :disabled="bookmarkLoading"
                  class="p-1.5 rounded-lg transition-colors disabled:cursor-progress"
                  :class="isSaved(i) ? 'text-teal-400' : 'text-gray-500 hover:text-teal-400 hover:bg-teal-900/20'"
                  :title="isSaved(i) ? 'Remove from saved' : 'Save'">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" :fill="isSaved(i) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                  </svg>
                </button>
                <button @click="openNote(i)"
                  class="p-1.5 rounded-lg transition-colors"
                  :class="hasNote(i) ? 'text-teal-400' : 'text-gray-500 hover:text-teal-400 hover:bg-teal-900/20'"
                  :title="hasNote(i) ? 'Edit note' : 'Add note'">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                  </svg>
                </button>
              </template>
            </div>
          </div>
        </div>

        <!-- arXiv paper cards -->
        <div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {{ activeTab === 'Trending' ? 'Trending papers' : activeTab === 'Most Cited' ? 'Most cited papers' : 'Latest papers' }}
          </p>

          <template v-if="papersPending && papers.length === 0"><SkeletonCard v-for="n in 3" :key="'sk'+n" /></template>

          <p v-else-if="displayedPapers.length === 0" class="text-sm text-gray-500 py-8 text-center">
            {{ papers.length > 0 ? 'No papers match current filters.' : 'No papers available for this topic right now.' }}
          </p>

          <div
            v-for="paper in displayedPapers"
            :key="paper.id"
            class="relative bg-[#242426] border border-gray-700/60 rounded-2xl p-5 mb-3 hover:border-gray-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 transition-all duration-200 overflow-hidden"
          >
            <!-- Thumbnail — fades in on hover -->
            <img
              v-if="paper.thumbnail"
              :src="paper.thumbnail"
              :alt="paper.title"
              class="hidden tablet:block absolute top-0 right-0 h-full w-44 object-cover pointer-events-none rounded-r-2xl"
              style="mask-image: linear-gradient(to right, transparent, black 50%); -webkit-mask-image: linear-gradient(to right, transparent, black 50%)"
              
              loading="lazy"
              @load="onThumbLoad" @error="$event.target.style.display='none'"
            />

            <div class="relative tablet:pr-44">
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  class="px-2 py-0.5 rounded-full text-xs font-medium shrink-0"
                  :class="{
                    'bg-teal-900/50 text-teal-300':     paper.topic === 'ai',
                    'bg-purple-900/50 text-purple-300':  paper.topic === 'math',
                    'bg-orange-900/50 text-orange-300':  paper.topic === 'hw',
                    'bg-emerald-900/50 text-emerald-300':paper.topic === 'cs',
                    'bg-gray-700 text-gray-300':         !paper.topic,
                  }"
                >{{ categoryLabel(paper.category) }}</span>
                <span class="text-xs text-gray-500">
                  {{ new Date(paper.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }}
                </span>
                <span v-if="paper.venue" class="text-xs text-gray-600 truncate max-w-[120px]">· {{ paper.venue }}</span>
              </div>

              <h2 class="text-[15px] font-semibold text-white leading-snug mb-1.5">
                <NuxtLink :to="'/article/' + paper.id" class="hover:text-teal-400 transition-colors">
                  {{ paper.title }}
                </NuxtLink>
              </h2>

              <p v-if="paper.authors.length" class="text-xs text-gray-500 mb-2 truncate">
                {{ paper.authors.slice(0, 4).join(', ') }}{{ paper.authors.length > 4 ? ` +${paper.authors.length - 4} more` : '' }}
              </p>

              <p class="text-sm text-gray-400 line-clamp-3 leading-relaxed">{{ paper.abstract }}</p>
            </div>

            <div class="flex items-center gap-4 mt-3 pt-3 border-t border-gray-700/40 tablet:pr-44">
              <a
                :href="'https://arxiv.org/html/' + paper.id"
                target="_blank"
                rel="noopener"
                class="flex items-center gap-1 text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                Read
              </a>
              <a :href="paper.pdf" target="_blank" rel="noopener" class="text-xs text-gray-600 hover:text-gray-400 transition-colors">PDF</a>
              <span v-if="paper.citedBy" class="flex items-center gap-1 text-xs text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
                {{ paper.citedBy.toLocaleString() }}
              </span>

              <!-- Like + Save + Note -->
              <button
                @click="likePaper(paper)"
                :disabled="likeLoading"
                class="ml-auto p-1.5 rounded-lg transition-colors disabled:cursor-progress"
                :class="isLiked(paper) ? 'text-red-400 like-pop' : 'text-gray-500 hover:text-red-400 hover:bg-red-900/20'"
                :title="isLiked(paper) ? 'Unlike' : 'Like'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" :fill="isLiked(paper) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 8.25c0-2.485-2.099-4.5-4.687-4.5-1.936 0-3.598 1.126-4.313 2.733-.715-1.607-2.377-2.733-4.312-2.733C5.098 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </button>
              <button
                @click="savePaper(paper)"
                :disabled="bookmarkLoading"
                class="p-1.5 rounded-lg transition-colors disabled:cursor-progress"
                :class="isSaved(paper) ? 'text-teal-400' : 'text-gray-500 hover:text-teal-400 hover:bg-teal-900/20'"
                :title="isSaved(paper) ? 'Remove from saved' : 'Save'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" :fill="isSaved(paper) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
              </button>
              <button
                @click="openNote(paper)"
                class="p-1.5 rounded-lg transition-colors"
                :class="hasNote(paper) ? 'text-teal-400' : 'text-gray-500 hover:text-teal-400 hover:bg-teal-900/20'"
                :title="hasNote(paper) ? 'Edit note' : 'Add note'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                </svg>
              </button>
            </div>
          </div>

          <p v-if="papersError" class="text-sm text-red-400 text-red-400 py-4 text-center">
            Failed to load papers.
          </p>

          <!-- Infinite scroll sentinel — auto-loads next page; button kept as fallback -->
          <div v-if="hasMore" ref="loadMoreSentinel" class="flex justify-center py-8">
            <button
              @click="loadMore"
              :disabled="papersPending"
              class="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-700 text-sm text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-colors disabled:opacity-40 disabled:cursor-progress"
            >
              <svg v-if="papersPending" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              {{ papersPending ? 'Loading…' : 'Load more' }}
            </button>
          </div>
        </div>
      </template>
    </main>

    <!-- ── Col 3: Right sidebar (hidden below desktop) ─────── -->
    <aside class="hidden desktop:flex flex-col border-l border-gray-800 py-6 px-4 overflow-y-auto bg-[#1c1c1e] sticky top-0 h-[calc(100vh-52px)]">

      <!-- Section 1: Live sources -->
      <div class="mb-7">
        <p class="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">Live sources</p>
        <ul class="space-y-3">
          <!-- Community posts -->
          <li class="flex items-center justify-between">
            <span class="text-xs text-gray-300">Community posts</span>
            <button
              class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors"
              :class="sourceCommunity ? 'bg-teal-500' : 'bg-gray-600'"
              @click="sourceCommunity = !sourceCommunity"
              aria-label="Toggle Community posts"
            >
              <span
                class="absolute w-4 h-4 rounded-full bg-white shadow-sm transition-all"
                :class="sourceCommunity ? 'right-0.5' : 'left-0.5'"
              ></span>
            </button>
          </li>
          <!-- arXiv feed -->
          <li class="flex items-center justify-between">
            <span class="text-xs text-gray-300">arXiv feed</span>
            <button
              class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors"
              :class="sourceArxiv ? 'bg-teal-500' : 'bg-gray-600'"
              @click="sourceArxiv = !sourceArxiv"
              aria-label="Toggle arXiv"
            >
              <span
                class="absolute w-4 h-4 rounded-full bg-white shadow-sm transition-all"
                :class="sourceArxiv ? 'right-0.5' : 'left-0.5'"
              ></span>
            </button>
          </li>
        </ul>
      </div>

      <!-- Section 2: Hot topics this week -->
      <div class="mb-7">
        <p class="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">Hot topics this week</p>

        <!-- Skeleton while papers load -->
        <template v-if="!trendingCategories.length">
          <div v-for="n in 5" :key="n" class="flex items-center justify-between py-1.5">
            <div class="h-2.5 bg-gray-700 rounded animate-pulse w-3/4"></div>
            <div class="h-2.5 bg-gray-700 rounded animate-pulse w-4 ml-2"></div>
          </div>
        </template>

        <!-- Live derived from paper categories — click to filter feed -->
        <ul v-else class="space-y-0.5">
          <li
            v-for="([cat, count], i) in trendingCategories"
            :key="cat"
            @click="categoryFilter = categoryFilter === cat ? null : cat"
            class="flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-colors"
            :class="categoryFilter === cat ? 'bg-teal-900/40' : 'hover:bg-gray-800'"
          >
            <span class="text-xs truncate" :class="categoryFilter === cat ? 'text-teal-300 font-medium' : 'text-gray-200'">{{ categoryLabel(cat) }}</span>
            <span class="text-xs font-medium ml-2 shrink-0" :class="categoryFilter === cat ? 'text-teal-400' : 'text-gray-400'">{{ count }}</span>
          </li>
        </ul>
        <button v-if="categoryFilter" @click="categoryFilter = null" class="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">
          ✕ Clear filter
        </button>
      </div>

      <!-- Section 3: Top venues -->
      <div>
        <p class="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">Top venues</p>
        <template v-if="!topVenues.length">
          <div v-for="n in 4" :key="n" class="flex items-center gap-2 py-1.5">
            <div class="w-2 h-2 rounded-full bg-gray-700 animate-pulse shrink-0"></div>
            <div class="h-2.5 bg-gray-700 rounded animate-pulse flex-1"></div>
          </div>
        </template>
        <ul v-else class="space-y-2.5">
          <li v-for="(venue, i) in topVenues" :key="venue" class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full shrink-0" :class="venueColors[i % venueColors.length]"></span>
            <span class="text-xs text-gray-200 truncate">{{ venue }}</span>
          </li>
        </ul>
      </div>

    </aside>

  </div>

  <!-- Note modal -->
  <Teleport to="body">
    <div
      v-if="noteModal"
      class="fixed inset-0 z-30 bg-black/50 flex items-center justify-center p-4"
      @click.self="closeNote"
    >
      <div class="w-full max-w-lg bg-[#242426] border border-gray-700 rounded-2xl p-6">
        <div class="flex items-start justify-between mb-1">
          <p class="text-xs font-semibold text-teal-400 uppercase tracking-wider">My note</p>
          <button @click="closeNote" class="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-gray-700/50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <h3 class="text-sm font-semibold text-white leading-snug mb-4">{{ notePaper?.title }}</h3>
        <textarea
          v-model="noteContent"
          rows="6"
          placeholder="Write your thoughts, summary, key takeaways…"
          class="w-full bg-[#1c1c1e] border border-gray-700 rounded-xl p-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-teal-600 resize-none"
        ></textarea>
        <div class="flex items-center justify-end gap-2 mt-4">
          <button @click="closeNote" class="px-4 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
          <button @click="saveNote" :disabled="noteSaving" class="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium transition-colors disabled:opacity-50">
            {{ noteSaving ? 'Saving…' : 'Save note' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import axios from "axios";
import { usePapers } from '~/composables/usePapers';
const API_BASE = import.meta.dev ? 'http://localhost:5000' : 'https://academiav2-backend.onrender.com'
definePageMeta({ layout: 'dashboard' });
export default {
  setup() {
    const activeTopic = ref('ai');
    const activeTab   = ref('Latest');
    const searchQuery = useSearchQuery();

    const sourceArxiv     = ref(true);
    const sourceCommunity = ref(true);
    const activeFilters   = reactive({ last30: false, hasCitations: false });
    const categoryFilter  = ref(null);

    const topicData = {
      ai:   usePapers('ai'),
      math: usePapers('math'),
      hw:   usePapers('hw'),
      cs:   usePapers('cs'),
    };

    const topics = [
      { id: 'ai',   label: 'AI & ML' },
      { id: 'math', label: 'Mathematics' },
      { id: 'hw',   label: 'Hardware' },
      { id: 'cs',   label: 'CS Theory' },
    ];

    const sources = [
      { id: 'arxiv',     label: 'arXiv' },
      { id: 'community', label: 'Community' },
    ];
    const filters = [
      { id: 'last30',     label: 'Last 30 days' },
      { id: 'hasCitations', label: 'Has citations' },
    ];
    const feedTabs = ['Latest', 'Most Cited', 'Trending', 'Saved'];

    const topicColor = {
      ai:   'bg-teal-500',
      math: 'bg-purple-500',
      hw:   'bg-orange-400',
      cs:   'bg-emerald-500',
    };

    const papers        = computed(() => topicData[activeTopic.value].papers.value);
    const papersPending = computed(() => topicData[activeTopic.value].pending.value);
    const papersError   = computed(() => topicData[activeTopic.value].error.value);
    const hasMore       = computed(() => !['Saved','Most Cited','Trending'].includes(activeTab.value) && topicData[activeTopic.value].hasMore.value);

    function loadMore() {
      topicData[activeTopic.value].loadMore();
    }

    // Infinite scroll: auto-load next page when sentinel becomes visible
    const loadMoreSentinel = ref(null);
    let io = null;
    onMounted(() => {
      io = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      }, { rootMargin: '400px' });
      watch(loadMoreSentinel, (el, prev) => {
        if (prev) io.unobserve(prev);
        if (el) io.observe(el);
      }, { immediate: true, flush: 'post' });
    });
    onUnmounted(() => io?.disconnect());

    // Lazy-load: only fetch the active topic. Fetch others when user switches to them.
    onMounted(() => topicData[activeTopic.value].ensureLoaded());
    watch(activeTopic, (t) => {
      topicData[t].ensureLoaded();
      categoryFilter.value = null; // categories differ per topic
    });

    const displayedPapers = computed(() => {
      if (!sourceArxiv.value || activeTab.value === 'Saved') return [];
      let result = papers.value.slice();

      if (categoryFilter.value) {
        result = result.filter(p => p.category === categoryFilter.value);
      }

      const q = searchQuery.value.trim().toLowerCase();
      if (q) {
        result = result.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.authors.some(a => a.toLowerCase().includes(q))
        );
      }

      if (activeFilters.last30) {
        const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
        result = result.filter(p => {
          const t = new Date(p.date).getTime();
          // keep papers within 30 days; drop only those with a valid older date
          return isNaN(t) ? true : t >= cutoff;
        });
      }

      if (activeFilters.hasCitations) {
        result = result.filter(p => (p.citedBy || 0) > 0);
      }

      if (activeTab.value === 'Most Cited') {
        result = result.slice().sort((a, b) => b.citedBy - a.citedBy);
      } else if (activeTab.value === 'Trending') {
        // Trending: score = citedBy + (upvotes * 5) weighted by recency (last 14 days = 2x)
        const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
        result = result.slice().sort((a, b) => {
          const aScore = (a.citedBy || 0) + (a.upvotes || 0) * 5;
          const bScore = (b.citedBy || 0) + (b.upvotes || 0) * 5;
          const aBoost = new Date(a.date).getTime() > twoWeeksAgo ? 2 : 1;
          const bBoost = new Date(b.date).getTime() > twoWeeksAgo ? 2 : 1;
          return bScore * bBoost - aScore * aBoost;
        });
      } else {
        // Latest: sort by date desc
        result = result.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }

      return result;
    });

    function isSourceActive(id) {
      if (id === 'arxiv')     return sourceArxiv.value;
      if (id === 'community') return sourceCommunity.value;
      return false;
    }
    function toggleSource(id) {
      if (id === 'arxiv')     sourceArxiv.value = !sourceArxiv.value;
      if (id === 'community') sourceCommunity.value = !sourceCommunity.value;
    }
    function toggleFilter(id) {
      activeFilters[id] = !activeFilters[id];
    }

    const trendingCategories = computed(() => {
      const counts = {};
      for (const paper of papers.value) {
        if (paper.category) counts[paper.category] = (counts[paper.category] || 0) + 1;
      }
      return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    });

    const topVenues = computed(() =>
      [...new Set(papers.value.map(p => p.venue).filter(Boolean))].slice(0, 5)
    );

    const venueColors = ['bg-purple-500', 'bg-teal-400', 'bg-orange-400', 'bg-blue-400', 'bg-pink-400'];

    const CATEGORY_NAMES = {
      'cs.AI': 'Artificial Intelligence', 'cs.LG': 'Machine Learning',
      'cs.NE': 'Neural Computing',        'cs.CV': 'Computer Vision',
      'cs.CL': 'NLP',                     'cs.RO': 'Robotics',
      'cs.IR': 'Information Retrieval',   'cs.DS': 'Algorithms',
      'cs.CC': 'Complexity Theory',       'cs.DC': 'Distributed Computing',
      'cs.AR': 'Hardware Architecture',   'eess.SP': 'Signal Processing',
      'math.NT': 'Number Theory',         'math.CO': 'Combinatorics',
      'math.AG': 'Algebraic Geometry',    'cs.CR': 'Cryptography',
      'cs.SE': 'Software Engineering',    'cs.PL': 'Programming Languages',
      'cs.GT': 'Game Theory',             'cs.SY': 'Systems & Control',
      'eess.SY': 'Systems & Control',     'eess.AS': 'Audio & Speech',
      'eess.IV': 'Image & Video',
      'stat.ML': 'Statistical ML',        'stat.AP': 'Applied Statistics',
      'q-fin.GN': 'Quant Finance',        'q-fin.CP': 'Computational Finance',
      'q-fin.ST': 'Statistical Finance',  'q-fin.RM': 'Risk Management',
      'q-fin.MF': 'Mathematical Finance', 'q-fin.PM': 'Portfolio Management',
      'q-fin.TR': 'Trading',              'q-fin.PR': 'Pricing',
      'q-bio.NC': 'Neuroscience',         'physics.comp-ph': 'Computational Physics',
      'math.RT': 'Representation Theory', 'math.GR': 'Group Theory',
      'math.PR': 'Probability',          'math.OC': 'Optimization & Control',
      'math.AP': 'Analysis of PDEs',     'math.DG': 'Differential Geometry',
      'math.LO': 'Logic',                'math.ST': 'Statistics Theory',
      'cs.CG': 'Computational Geometry',  'cs.DM': 'Discrete Mathematics',
      'cs.FL': 'Formal Languages',        'cs.LO': 'Logic in CS',
      'cs.MA': 'Multiagent Systems',      'cs.HC': 'Human-Computer Interaction',
      'cs.SD': 'Sound',                   'cs.MM': 'Multimedia',
    };
    // Prefix → friendly family name, used when an exact subcat isn't mapped
    const CATEGORY_FAMILY = {
      'math.': 'Mathematics', 'cs.': 'Computer Science', 'eess.': 'Engineering',
      'stat.': 'Statistics', 'q-fin.': 'Quant Finance', 'q-bio.': 'Quant Biology',
      'physics.': 'Physics', 'astro-ph': 'Astrophysics', 'cond-mat': 'Condensed Matter',
    };
    function categoryLabel(cat) {
      if (CATEGORY_NAMES[cat]) return CATEGORY_NAMES[cat];
      for (const [prefix, name] of Object.entries(CATEGORY_FAMILY)) {
        if (cat && cat.startsWith(prefix)) return name;
      }
      return cat;
    }
    function onThumbLoad(e) {
      if (e.target.naturalWidth <= 10) e.target.style.display = 'none';
    }

    return {
      activeTopic, activeTab, searchQuery,
      sourceArxiv, sourceCommunity, activeFilters, categoryFilter,
      topics, sources, filters, feedTabs, topicColor, venueColors,
      papers, papersPending, papersError, hasMore, loadMore,
      displayedPapers, isSourceActive, toggleSource, toggleFilter,
      trendingCategories, topVenues, categoryLabel, onThumbLoad,
      loadMoreSentinel,
    };
  },

  data() {
    return {
      noteModal: false,
      notePaper: null,
      noteContent: "",
      noteSaving: false,
      input: "",
      likeLoading: false,
      bookmarkLoading: false,
      message: "",
      showTooltip: false,
      savedPosts: [],
      savedLoading: false,
      likedIds: [],   // arxivIds + post _ids the user has liked
      savedIds: [],   // same for bookmarks
      notedIds: [],   // papers with a note
    };
  },

  props: {
    posts:   { type: Object,  required: true },
    user:    { type: Object,  required: true },
    loading: { type: Boolean, required: true },
  },

  computed: {
    isRemovalMsg() {
      const m = (this.message || '').toLowerCase();
      return m.includes('removed') || m.includes('deleted');
    },
    displayedPosts() {
      if (this.activeTab === 'Saved') return this.savedPosts;
      if (!this.sourceCommunity) return [];
      const all = this.posts || [];
      const q = (this.searchQuery || '').trim().toLowerCase();
      if (!q) return all;
      return all.filter(p => {
        const authors = Array.isArray(p.authors) ? p.authors.join(' ') : (p.authors || '');
        return (p.title || '').toLowerCase().includes(q) || authors.toLowerCase().includes(q);
      });
    },
  },

  watch: {
    activeTab(tab) {
      if (tab === 'Saved') this.fetchSaved();
    },
  },

  mounted() {
    this.fetchMyActivity();
  },

  methods: {
    // Identity key for a feed paper or DB post
    paperKey(p) {
      return p.arxivId || p.id || p._id;
    },
    isLiked(p) { return this.likedIds.includes(this.paperKey(p)); },
    isSaved(p) { return this.savedIds.includes(this.paperKey(p)); },
    hasNote(p) { return this.notedIds.includes(this.paperKey(p)); },

    // Load the user's likes/bookmarks/notes once so card icons reflect state
    async fetchMyActivity() {
      const keyOf = (pd, fallbackId) => pd?.arxivId || fallbackId;
      try {
        const [likes, bookmarks, notes] = await Promise.all([
          axios.get(`${API_BASE}/api/v1/likes`, { withCredentials: true }),
          axios.get(`${API_BASE}/api/v1/bookmarks`, { withCredentials: true }),
          axios.get(`${API_BASE}/api/v1/notes`, { withCredentials: true }),
        ]);
        this.likedIds = (likes.data.likes || []).map(l => keyOf(l.postDetails, String(l.post))).filter(Boolean);
        this.savedIds = (bookmarks.data.bookmarks || []).map(b => keyOf(b.postDetails, String(b.post))).filter(Boolean);
        this.notedIds = (notes.data.notes || []).filter(n => n.content).map(n => keyOf(n.postDetails, String(n.post))).filter(Boolean);
      } catch (e) {
        console.error("Error loading activity:", e);
      }
    },

    async fetchSaved() {
      this.savedLoading = true;
      try {
        const { data } = await axios.get(
          `${API_BASE}/api/v1/bookmarks`,
          { withCredentials: true }
        );
        this.savedPosts = (data.bookmarks || [])
          .map(b => b.postDetails)
          .filter(Boolean)
          .map(pd => ({
            ...pd,
            // normalize to card shape (saved postDetails have arxivId, not id/pdf/thumbnail)
            id: pd.arxivId || pd._id,
            pdf: pd.arxivId ? `https://arxiv.org/pdf/${pd.arxivId}` : null,
            thumbnail: pd.arxivId ? `https://arxiv.org/html/${pd.arxivId}/x1.png` : null,
            authors: pd.authors ? String(pd.authors).split(',').map(s => s.trim()) : [],
          }));
      } catch (e) {
        console.error(e);
      } finally {
        this.savedLoading = false;
      }
    },
    async addBookmark(postId) {
      try {
        this.bookmarkLoading = true;
        const response = await axios.post(
          `${API_BASE}/api/v1/bookmarks`,
          { post: postId },
          { withCredentials: true }
        );
        this.message = response.data.message;
      } catch (error) {
        console.error("Error creating bookmark:", error);
      } finally {
        this.bookmarkLoading = false;
        this.showTooltip = true;
        setTimeout(() => { this.showTooltip = false; }, 5000);
      }
    },
    async addLike(postId) {
      try {
        this.likeLoading = true;
        const response = await axios.post(
          `${API_BASE}/api/v1/likes`,
          { post: postId },
          { withCredentials: true }
        );
        this.message = response.data.message;
      } catch (error) {
        console.error("Error creating like:", error);
      } finally {
        this.likeLoading = false;
        this.showTooltip = true;
        setTimeout(() => { this.showTooltip = false; }, 5000);
      }
    },
    // Notes — open modal, load existing note for this paper
    async openNote(p) {
      this.notePaper = p;
      this.noteContent = "";
      this.noteModal = true;
      try {
        const id = p.id || p.arxivId || p._id;
        const { data } = await axios.get(`${API_BASE}/api/v1/notes/${id}`, { withCredentials: true });
        if (data.note) this.noteContent = data.note.content || "";
      } catch (e) {
        console.error("Error loading note:", e);
      }
    },
    async saveNote() {
      try {
        this.noteSaving = true;
        await axios.post(
          `${API_BASE}/api/v1/notes`,
          { ...this.paperBody(this.notePaper), content: this.noteContent },
          { withCredentials: true }
        );
        this.message = "Note saved";
        const nk = this.paperKey(this.notePaper);
        if (this.noteContent.trim() && !this.notedIds.includes(nk)) this.notedIds.push(nk);
        if (!this.noteContent.trim()) this.notedIds = this.notedIds.filter(k => k !== nk);
        this.noteModal = false;
        this.notePaper = null;
      } catch (error) {
        console.error("Error saving note:", error);
      } finally {
        this.noteSaving = false;
        this.showTooltip = true;
        setTimeout(() => { this.showTooltip = false; }, 5000);
      }
    },
    closeNote() {
      this.noteModal = false;
      this.notePaper = null;
    },
    // Build a bookmark/note body from a feed paper (arXiv/HF) or DB post
    paperBody(p) {
      if (p._id) return { post: p._id };
      return {
        arxivId: p.id || p.arxivId,
        title: p.title,
        authors: p.authors,
        abstract: p.abstract,
        category: p.category,
        date: p.date,
        venue: p.venue,
        citedBy: p.citedBy,
      };
    },
    async savePaper(p) {
      try {
        this.bookmarkLoading = true;
        const response = await axios.post(
          `${API_BASE}/api/v1/bookmarks`,
          this.paperBody(p),
          { withCredentials: true }
        );
        this.message = response.data.message;
        // toggle local saved state
        const sk = this.paperKey(p);
        if (response.data.message.toLowerCase().includes('removed')) {
          this.savedIds = this.savedIds.filter(k => k !== sk);
        } else if (!this.savedIds.includes(sk)) {
          this.savedIds.push(sk);
        }
        await this.fetchSaved(); // keep Saved tab current
      } catch (error) {
        console.error("Error saving paper:", error);
      } finally {
        this.bookmarkLoading = false;
        this.showTooltip = true;
        setTimeout(() => { this.showTooltip = false; }, 5000);
      }
    },
    async likePaper(p) {
      try {
        this.likeLoading = true;
        const response = await axios.post(
          `${API_BASE}/api/v1/likes`,
          this.paperBody(p),
          { withCredentials: true }
        );
        this.message = response.data.message;
        // toggle local liked state
        const lk = this.paperKey(p);
        if (response.data.message.toLowerCase().includes('removed')) {
          this.likedIds = this.likedIds.filter(k => k !== lk);
        } else if (!this.likedIds.includes(lk)) {
          this.likedIds.push(lk);
        }
      } catch (error) {
        console.error("Error liking paper:", error);
      } finally {
        this.likeLoading = false;
        this.showTooltip = true;
        setTimeout(() => { this.showTooltip = false; }, 5000);
      }
    },
  },
};
</script>

<style scoped>
@keyframes like-pop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.35); }
  100% { transform: scale(1); }
}
.like-pop svg { animation: like-pop 0.3s ease; }

.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(16px); }
</style>
