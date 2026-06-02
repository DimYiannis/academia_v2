<template>
  <!-- 3-column CSS grid: always visible, no breakpoint gating -->
  <div class="grid min-h-[calc(100vh-52px)] bg-[#1c1c1e]" style="grid-template-columns: 180px 1fr 200px">

    <!-- ── Col 1: Left nav ─────────────────────────────────── -->
    <aside class="flex flex-col border-r border-gray-800 py-6 px-3 overflow-y-auto bg-[#1c1c1e] sticky top-0 h-[calc(100vh-52px)]">

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
    <main class="min-w-0 px-6 py-6 overflow-x-hidden">

      <!-- Page heading + feed tabs -->
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-base font-semibold text-gray-200">
          {{ topics.find(t => t.id === activeTopic)?.label }} papers
        </h1>
        <div class="flex items-center gap-2">
          <button
            v-for="tab in feedTabs"
            :key="tab"
            @click="activeTab = tab"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors"
            :class="activeTab === tab
              ? 'border-gray-500 text-white bg-gray-800'
              : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Loading posts -->
      <div v-if="loading" class="flex justify-center py-16">
        <LoadSpinner />
      </div>

      <template v-else>
        <!-- Toast -->
        <div
          v-show="showTooltip"
          :class="{
            'bg-red-900/30 border-red-800 text-red-400': message.toLowerCase().includes('removed'),
            'bg-green-900/30 border-green-800 text-green-400': message.toLowerCase().includes('created'),
          }"
          class="fixed top-16 right-4 z-20 text-sm border rounded-lg px-4 py-2 shadow-sm"
        >
          {{ message }}
        </div>

        <!-- HuggingFace featured papers -->
        <div v-if="displayedPosts && displayedPosts.length" class="mb-6">
          <div class="flex items-center gap-2 mb-3">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Today on HuggingFace</p>
            <span class="text-xs text-gray-600">· curated</span>
          </div>
          <div
            v-for="(i, index) in displayedPosts.slice(0, 8)"
            :key="index"
            class="relative bg-[#242426] border border-gray-700/60 rounded-2xl p-5 mb-3 hover:border-gray-600 transition-colors overflow-hidden"
          >
            <img
              v-if="i.thumbnail"
              :src="i.thumbnail"
              :alt="i.title"
              class="absolute top-0 right-0 h-full w-44 object-cover pointer-events-none"
              style="mask-image: linear-gradient(to right, transparent, black 50%); -webkit-mask-image: linear-gradient(to right, transparent, black 50%)"
              
              loading="lazy"
              @load="onThumbLoad" @error="$event.target.style.display='none'"
            />
            <div class="relative pr-44">
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
            <div class="mt-3 pt-3 border-t border-gray-700/40 flex items-center gap-3">
              <a v-if="i.id" :href="'https://arxiv.org/html/' + i.id" target="_blank" rel="noopener"
                class="flex items-center gap-1 text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                Read
              </a>
              <a v-if="i.pdf" :href="i.pdf" target="_blank" rel="noopener" class="text-xs text-gray-600 hover:text-gray-400 transition-colors">PDF</a>
            </div>
          </div>
        </div>

        <!-- arXiv paper cards -->
        <div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {{ activeTab === 'Trending' ? 'Trending papers' : 'Latest papers' }}
          </p>

          <LoadSpinner v-if="papersPending && papers.length === 0" />

          <p v-if="!papersPending && displayedPapers.length === 0 && papers.length > 0" class="text-sm text-gray-500 py-4 text-center">
            No papers match current filters.
          </p>

          <div
            v-for="paper in displayedPapers"
            :key="paper.id"
            class="relative bg-[#242426] border border-gray-700/60 rounded-2xl p-5 mb-3 hover:border-gray-600 transition-colors overflow-hidden"
          >
            <!-- Thumbnail — fades in on hover -->
            <img
              v-if="paper.thumbnail"
              :src="paper.thumbnail"
              :alt="paper.title"
              class="absolute top-0 right-0 h-full w-44 object-cover pointer-events-none"
              style="mask-image: linear-gradient(to right, transparent, black 50%); -webkit-mask-image: linear-gradient(to right, transparent, black 50%)"
              
              loading="lazy"
              @load="onThumbLoad" @error="$event.target.style.display='none'"
            />

            <div class="relative pr-44">
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

            <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/40">
              <div class="flex items-center gap-3 text-xs text-gray-500">
                <span v-if="paper.citedBy" class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                  {{ paper.citedBy.toLocaleString() }} citations
                </span>
              </div>
              <div class="flex items-center gap-2">
                <a
                  v-if="paper.codeUrl"
                  :href="paper.codeUrl"
                  target="_blank"
                  rel="noopener"
                  class="flex items-center gap-1 text-xs font-medium text-green-400 hover:text-green-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Code
                </a>
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
              </div>
            </div>
          </div>

          <p v-if="papersError" class="text-sm text-red-400 text-red-400 py-4 text-center">
            Failed to load papers.
          </p>

          <div v-if="hasMore" class="flex justify-center py-8">
            <button
              @click="loadMore"
              :disabled="papersPending"
              class="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-700 text-sm text-gray-400 hover:border-gray-400 hover:border-gray-500 hover:text-gray-200 transition-colors disabled:opacity-40 disabled:cursor-progress"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
              {{ papersPending ? 'Loading…' : 'Load more' }}
            </button>
          </div>
        </div>
      </template>
    </main>

    <!-- ── Col 3: Right sidebar ────────────────────────────── -->
    <aside class="flex flex-col border-l border-gray-800 py-6 px-4 overflow-y-auto bg-[#1c1c1e] sticky top-0 h-[calc(100vh-52px)]">

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
          <!-- Papers With Code -->
          <li class="flex items-center justify-between">
            <span class="text-xs text-gray-300">Papers With Code</span>
            <button
              class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors"
              :class="sourcePwC ? 'bg-teal-500' : 'bg-gray-600'"
              @click="sourcePwC = !sourcePwC"
              aria-label="Toggle Papers With Code"
            >
              <span
                class="absolute w-4 h-4 rounded-full bg-white shadow-sm transition-all"
                :class="sourcePwC ? 'right-0.5' : 'left-0.5'"
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

        <!-- Live derived from paper categories -->
        <ul v-else class="space-y-0.5">
          <li
            v-for="([cat, count], i) in trendingCategories"
            :key="cat"
            class="flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
          >
            <span class="text-xs text-gray-200 truncate">{{ categoryLabel(cat) }}</span>
            <span class="text-xs font-medium text-gray-400 ml-2 shrink-0">{{ i + 1 }}</span>
          </li>
        </ul>
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

  <Teleport v-if="user" to="body">
    <sharepostmodal
      v-show="showmodal"
      @close-modal="modal"
      :user="user"
      :postId="postId"
      @share-post="sharePost"
    />
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
    const sourcePwC       = ref(true);
    const activeFilters   = reactive({ hasCode: false, last30: false, mostCited: false });

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
      { id: 'pwc',       label: 'Papers With Code' },
    ];
    const filters = [
      { id: 'hasCode',   label: 'Has code' },
      { id: 'last30',    label: 'Last 30 days' },
      { id: 'mostCited', label: 'Most cited' },
    ];
    const feedTabs = ['Latest', 'Trending', 'Saved'];

    const topicColor = {
      ai:   'bg-teal-500',
      math: 'bg-purple-500',
      hw:   'bg-orange-400',
      cs:   'bg-emerald-500',
    };

    const papers        = computed(() => topicData[activeTopic.value].papers.value);
    const papersPending = computed(() => topicData[activeTopic.value].pending.value);
    const papersError   = computed(() => topicData[activeTopic.value].error.value);
    const hasMore       = computed(() => activeTab.value !== 'Saved' && topicData[activeTopic.value].hasMore.value);

    function loadMore() {
      topicData[activeTopic.value].loadMore();
    }

    const displayedPapers = computed(() => {
      if (!sourceArxiv.value || activeTab.value === 'Saved') return [];
      let result = papers.value.filter(p =>
        sourcePwC.value || p.source !== 'pwc'
      );

      const q = searchQuery.value.trim().toLowerCase();
      if (q) {
        result = result.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.authors.some(a => a.toLowerCase().includes(q))
        );
      }

      if (activeFilters.hasCode) {
        result = result.filter(p => p.hasCode);
      }

      if (activeFilters.last30) {
        const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
        result = result.filter(p => new Date(p.date).getTime() >= cutoff);
      }

      if (activeFilters.mostCited || activeTab.value === 'Trending') {
        result = result.slice().sort((a, b) => b.citedBy - a.citedBy);
      }

      return result;
    });

    function isSourceActive(id) {
      if (id === 'arxiv')     return sourceArxiv.value;
      if (id === 'community') return sourceCommunity.value;
      if (id === 'pwc')       return sourcePwC.value;
      return false;
    }
    function toggleSource(id) {
      if (id === 'arxiv')     sourceArxiv.value = !sourceArxiv.value;
      if (id === 'community') sourceCommunity.value = !sourceCommunity.value;
      if (id === 'pwc')       sourcePwC.value = !sourcePwC.value;
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
    };
    function categoryLabel(cat) {
      return CATEGORY_NAMES[cat] || cat;
    }
    function onThumbLoad(e) {
      if (e.target.naturalWidth <= 10) e.target.style.display = 'none';
    }

    return {
      activeTopic, activeTab, searchQuery,
      sourceArxiv, sourceCommunity, sourcePwC, activeFilters,
      topics, sources, filters, feedTabs, topicColor, venueColors,
      papers, papersPending, papersError, hasMore, loadMore,
      displayedPapers, isSourceActive, toggleSource, toggleFilter,
      trendingCategories, topVenues, categoryLabel, onThumbLoad,
    };
  },

  data() {
    return {
      showmodal: false,
      postId: "",
      input: "",
      likeLoading: false,
      bookmarkLoading: false,
      message: "",
      showTooltip: false,
      savedPosts: [],
      savedLoading: false,
    };
  },

  props: {
    posts:   { type: Object,  required: true },
    user:    { type: Object,  required: true },
    loading: { type: Boolean, required: true },
  },

  computed: {
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

  methods: {
    async fetchSaved() {
      this.savedLoading = true;
      try {
        const { data } = await axios.get(
          `${API_BASE}/api/v1/bookmarks`,
          { withCredentials: true }
        );
        this.savedPosts = (data.bookmarks || [])
          .map(b => b.postDetails)
          .filter(Boolean);
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
    async sharePost(sharedPost) {
      try {
        const { postId, content } = sharedPost;
        await axios.post(
          `${API_BASE}/api/v1/sharedposts`,
          { post: postId, title: content },
          { withCredentials: true }
        );
      } catch (error) {
        console.error("Error sharing post:", error);
      }
    },
    async getsinglepost(input) {
      try {
        const response = await axios.get(
          `${API_BASE}/api/v1/posts/${input}`,
          { withCredentials: true }
        );
        this.$emit("update-posts", [response.data.post]);
      } catch (error) {
        console.error("Error fetching single post:", error);
      }
    },
    modal(post_Id) {
      this.postId = post_Id;
      this.showmodal = !this.showmodal;
    },
  },
};
</script>
