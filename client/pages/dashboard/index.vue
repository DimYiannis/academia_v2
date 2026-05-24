<template>
  <!-- 3-column CSS grid: always visible, no breakpoint gating -->
  <div class="grid min-h-[calc(100vh-52px)] bg-[#1c1c1e]" style="grid-template-columns: 180px 1fr 200px">

    <!-- ── Col 1: Left nav ─────────────────────────────────── -->
    <aside class="flex flex-col border-r border-gray-800 py-6 px-3 overflow-y-auto bg-[#1c1c1e]">

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
          :key="source"
          class="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-800 cursor-pointer group transition-colors"
        >
          <div class="w-4 h-4 rounded border-2 border-gray-600 group-hover:border-gray-400 shrink-0 transition-colors"></div>
          <span class="text-xs text-gray-300 flex-1">{{ source }}</span>
        </div>
      </div>

      <!-- FILTER BY -->
      <div>
        <p class="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3 px-2">Filter By</p>
        <div
          v-for="filter in filters"
          :key="filter"
          class="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-800 cursor-pointer group transition-colors"
        >
          <div class="w-4 h-4 rounded border-2 border-gray-600 group-hover:border-gray-400 shrink-0 transition-colors"></div>
          <span class="text-xs text-gray-300">{{ filter }}</span>
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

        <!-- User posts -->
        <div v-if="posts && posts.length" class="mb-6">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Community</p>
          <div
            v-for="(i, index) in posts"
            :key="index"
            class="bg-[#242426] border border-gray-700/60 rounded-2xl p-5 mb-3 hover:border-gray-600 transition-colors"
          >
            <div class="mb-3">
              <h2 class="text-sm font-semibold text-white leading-snug mb-1">
                <router-link class="hover:text-teal-400 transition-colors" :to="'/article/' + i.doi">
                  {{ i.title }}
                </router-link>
              </h2>
              <div class="flex flex-wrap gap-x-3 text-xs text-gray-400">
                <span v-if="i.authors">{{ i.authors }}</span>
                <span v-if="i.university">{{ i.university }}</span>
                <span v-if="i.date">{{ i.date }}</span>
              </div>
            </div>
            <p class="text-sm text-gray-400 line-clamp-3 mb-4">{{ i.abstract }}</p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1">
                <button
                  class="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors disabled:cursor-progress"
                  @click="addLike(i._id)"
                  :disabled="likeLoading"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 8.25c0-2.485-2.099-4.5-4.687-4.5-1.936 0-3.598 1.126-4.313 2.733-.715-1.607-2.377-2.733-4.312-2.733C5.098 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </button>
                <button
                  class="p-1.5 rounded-lg text-gray-400 hover:text-teal-500 hover:bg-teal-900/20 transition-colors"
                  @click="modal(i._id)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z" />
                    <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                  </svg>
                </button>
              </div>
              <button
                class="p-1.5 rounded-lg text-gray-400 hover:text-teal-500 hover:bg-teal-900/20 transition-colors disabled:cursor-progress"
                @click="addBookmark(i._id)"
                :disabled="bookmarkLoading"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- arXiv paper cards -->
        <div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Latest papers</p>

          <LoadSpinner v-if="papersPending && papers.length === 0" />

          <div
            v-for="paper in papers"
            :key="paper.id"
            class="bg-[#242426] border border-gray-700/60 rounded-2xl p-5 mb-3 hover:border-gray-600 transition-colors"
          >
            <div class="flex items-center gap-2 mb-3">
              <span class="w-2 h-2 rounded-full shrink-0" :class="topicColor[paper.topic] || 'bg-gray-400'"></span>
              <span class="text-xs text-gray-400">{{ paper.category }}</span>
              <span class="text-gray-600">·</span>
              <span class="text-xs text-gray-400">
                {{ new Date(paper.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }}
              </span>
            </div>

            <h2 class="text-sm font-semibold text-white leading-snug mb-2">
              <a :href="paper.link" target="_blank" rel="noopener" class="hover:text-teal-400 transition-colors">
                {{ paper.title }}
              </a>
            </h2>

            <p class="text-sm text-gray-400 line-clamp-3 mb-3 leading-relaxed">{{ paper.abstract }}</p>

            <p class="text-xs text-gray-400 mb-4 truncate">
              {{ paper.authors.slice(0, 4).join(', ') }}{{ paper.authors.length > 4 ? ` +${paper.authors.length - 4} more` : '' }}
            </p>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 text-xs text-gray-400">
                <span v-if="paper.citedBy" class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                  {{ paper.citedBy.toLocaleString() }}
                </span>
                <span v-if="paper.venue" class="truncate max-w-[120px]">{{ paper.venue }}</span>
              </div>
              <a
                :href="paper.pdf"
                target="_blank"
                rel="noopener"
                class="flex items-center gap-1 text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                PDF
              </a>
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
    <aside class="flex flex-col border-l border-gray-800 py-6 px-4 overflow-y-auto bg-[#1c1c1e]">

      <!-- Section 1: Live sources -->
      <div class="mb-7">
        <p class="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">Live sources</p>
        <ul class="space-y-3">
          <!-- OpenAlex — on -->
          <li class="flex items-center justify-between">
            <span class="text-xs text-gray-300">OpenAlex API</span>
            <button class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-teal-500" aria-label="Toggle OpenAlex">
              <span class="absolute right-0.5 w-4 h-4 rounded-full bg-white shadow-sm"></span>
            </button>
          </li>
          <!-- arXiv — on -->
          <li class="flex items-center justify-between">
            <span class="text-xs text-gray-300">arXiv feed</span>
            <button class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-teal-500" aria-label="Toggle arXiv">
              <span class="absolute right-0.5 w-4 h-4 rounded-full bg-white shadow-sm"></span>
            </button>
          </li>
          <!-- Semantic Scholar — off -->
          <li class="flex items-center justify-between">
            <span class="text-xs text-gray-300">Semantic Scholar</span>
            <button class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-gray-600" aria-label="Toggle Semantic Scholar">
              <span class="absolute left-0.5 w-4 h-4 rounded-full bg-gray-300 shadow-sm"></span>
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
            <span class="text-xs text-gray-200 truncate">{{ cat }}</span>
            <span class="text-xs font-medium text-gray-400 ml-2 shrink-0">{{ i + 1 }}</span>
          </li>
        </ul>
      </div>

      <!-- Section 3: Top venues -->
      <div>
        <p class="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">Top venues</p>
        <ul class="space-y-2.5">
          <li class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full shrink-0 bg-purple-500"></span>
            <span class="text-xs text-gray-200">NeurIPS</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full shrink-0 bg-purple-400"></span>
            <span class="text-xs text-gray-200">ICLR</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full shrink-0 bg-teal-400"></span>
            <span class="text-xs text-gray-200">Annals of Mathematics</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full shrink-0" style="background-color:#FF7F50"></span>
            <span class="text-xs text-gray-200">IEEE Micro</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full shrink-0 bg-blue-400"></span>
            <span class="text-xs text-gray-200">STOC / FOCS</span>
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
definePageMeta({ layout: 'dashboard' });
export default {
  setup() {
    const activeTopic = ref('ai');
    const activeTab   = ref('Latest');

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

    const sources  = ['arXiv', 'OpenAlex', 'Semantic Scholar'];
    const filters  = ['Open access only', 'Last 30 days', 'Most cited'];
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
    const hasMore       = computed(() => topicData[activeTopic.value].hasMore.value);

    function loadMore() {
      topicData[activeTopic.value].loadMore();
    }

    const trendingCategories = computed(() => {
      const counts = {};
      for (const paper of papers.value) {
        if (paper.category) counts[paper.category] = (counts[paper.category] || 0) + 1;
      }
      return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    });

    const topVenues = computed(() =>
      [...new Set(papers.value.map(p => p.venue).filter(Boolean))].slice(0, 4)
    );

    return {
      activeTopic, activeTab,
      topics, sources, filters, feedTabs, topicColor,
      papers, papersPending, papersError, hasMore, loadMore,
      trendingCategories, topVenues,
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
    };
  },

  props: {
    posts:   { type: Object,  required: true },
    user:    { type: Object,  required: true },
    loading: { type: Boolean, required: true },
  },

  methods: {
    async addBookmark(postId) {
      try {
        this.bookmarkLoading = true;
        const response = await axios.post(
          `https://academiav2-backend.onrender.com/api/v1/bookmarks`,
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
          `https://academiav2-backend.onrender.com/api/v1/likes`,
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
          `https://academiav2-backend.onrender.com/api/v1/sharedposts`,
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
          `https://academiav2-backend.onrender.com/api/v1/posts/${input}`,
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
