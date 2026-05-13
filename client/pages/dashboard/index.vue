<template>
  <div>
    <!-- Top search bar -->
    <nav class="mb-6 mt-4 flex items-center gap-3">
      <div class="flex-1 laptop:max-w-lg flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 focus-within:border-[#388aef] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          class="w-full text-sm focus:outline-none caret-[#388aef] bg-transparent"
          type="text"
          v-model="input"
          placeholder="Search by DOI…"
        />
        <button @click="getsinglepost(input)" class="shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#388aef]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Toast -->
      <div
        :class="{
          'bg-red-50 border-red-200 text-red-700': message.toLowerCase().includes('removed'),
          'bg-green-50 border-green-200 text-green-700': message.toLowerCase().includes('created'),
        }"
        class="fixed top-4 right-4 z-20 text-sm border rounded-lg px-4 py-2 shadow-sm"
        v-show="showTooltip"
      >
        {{ message }}
      </div>
    </nav>

    <!-- 3-column layout -->
    <div class="flex gap-6">

      <!-- Left sidebar: topic nav -->
      <aside class="hidden laptop:block w-44 shrink-0">
        <div class="sticky top-4">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Topics</p>
          <nav class="space-y-1">
            <button
              v-for="topic in topics"
              :key="topic.id"
              @click="activeTopic = topic.id"
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left"
              :class="activeTopic === topic.id
                ? 'bg-blue-50 text-[#388aef] font-medium'
                : 'text-gray-600 hover:bg-gray-50'"
            >
              <span class="w-2 h-2 rounded-full shrink-0" :class="topic.color"></span>
              {{ topic.label }}
            </button>
          </nav>
        </div>
      </aside>

      <!-- Center feed -->
      <main class="flex-1 min-w-0">
        <!-- Loading posts -->
        <div v-if="loading" class="flex justify-center py-16">
          <LoadSpinner />
        </div>

        <template v-else>
          <!-- User posts -->
          <div v-if="posts && posts.length" class="mb-8">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Community posts</p>
            <div
              v-for="(i, index) in posts"
              :key="index"
              class="border border-gray-100 rounded-2xl p-5 mb-3 hover:border-gray-200 transition-colors"
            >
              <div class="mb-3">
                <h2 class="text-base font-semibold text-gray-900 leading-snug mb-1">
                  <router-link class="hover:text-[#388aef] transition-colors" :to="'/article/' + i.doi">
                    {{ i.title }}
                  </router-link>
                </h2>
                <div class="flex flex-wrap gap-x-3 text-sm text-gray-400">
                  <span v-if="i.authors">{{ i.authors }}</span>
                  <span v-if="i.university">{{ i.university }}</span>
                  <span v-if="i.date">{{ i.date }}</span>
                </div>
              </div>
              <p class="text-sm text-gray-600 line-clamp-3 mb-4">{{ i.abstract }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1">
                  <button
                    class="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-50 transition-colors disabled:cursor-progress"
                    @click="addLike(i._id)"
                    :disabled="likeLoading"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 8.25c0-2.485-2.099-4.5-4.687-4.5-1.936 0-3.598 1.126-4.313 2.733-.715-1.607-2.377-2.733-4.312-2.733C5.098 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </button>
                  <button
                    class="p-1.5 rounded-lg text-gray-400 hover:text-[#388aef] hover:bg-blue-50 transition-colors"
                    @click="modal(i._id)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="none">
                      <path fill="currentColor" d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z" />
                      <path fill="currentColor" d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                    </svg>
                  </button>
                </div>
                <button
                  class="p-1.5 rounded-lg text-gray-400 hover:text-[#388aef] hover:bg-blue-50 transition-colors disabled:cursor-progress"
                  @click="addBookmark(i._id)"
                  :disabled="bookmarkLoading"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- arXiv paper feed -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Latest papers</p>
              <!-- Mobile topic pills -->
              <div class="flex laptop:hidden gap-1">
                <button
                  v-for="topic in topics"
                  :key="topic.id"
                  @click="activeTopic = topic.id"
                  class="px-2 py-1 rounded-full text-xs transition-colors"
                  :class="activeTopic === topic.id
                    ? 'bg-[#388aef] text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
                >
                  {{ topic.shortLabel }}
                </button>
              </div>
            </div>

            <LoadSpinner v-if="papersPending && papers.length === 0" />

            <div
              v-for="paper in papers"
              :key="paper.id"
              class="border border-gray-100 rounded-2xl p-5 mb-3 hover:border-gray-200 transition-colors"
            >
              <!-- Topic dot + category + date -->
              <div class="flex items-center gap-2 mb-3">
                <span class="w-2 h-2 rounded-full shrink-0" :class="topicColor[paper.topic] || 'bg-gray-400'"></span>
                <span class="text-xs text-gray-400">{{ paper.category }}</span>
                <span class="text-gray-200">·</span>
                <span class="text-xs text-gray-400">{{ new Date(paper.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }}</span>
              </div>

              <!-- Title -->
              <h2 class="text-base font-semibold text-gray-900 leading-snug mb-2">
                <a
                  :href="paper.link"
                  target="_blank"
                  rel="noopener"
                  class="hover:text-[#388aef] transition-colors"
                >{{ paper.title }}</a>
              </h2>

              <!-- Abstract -->
              <p class="text-sm text-gray-500 line-clamp-3 mb-3">{{ paper.abstract }}</p>

              <!-- Authors -->
              <p class="text-xs text-gray-400 mb-4 truncate">
                {{ paper.authors.slice(0, 4).join(', ') }}{{ paper.authors.length > 4 ? ` +${paper.authors.length - 4} more` : '' }}
              </p>

              <!-- Footer -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3 text-xs text-gray-400">
                  <span v-if="paper.citedBy" class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                    </svg>
                    {{ paper.citedBy.toLocaleString() }} citations
                  </span>
                  <span v-if="paper.venue" class="hidden mobile:inline truncate max-w-[120px]">{{ paper.venue }}</span>
                </div>
                <a
                  :href="paper.pdf"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1 text-xs font-medium text-[#388aef] hover:text-blue-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  PDF
                </a>
              </div>
            </div>

            <p v-if="papersError" class="text-sm text-red-500 py-4 text-center">
              Failed to load papers.
            </p>

            <div v-if="hasMore" class="flex justify-center py-6">
              <button
                @click="loadMore"
                :disabled="papersPending"
                class="px-6 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-[#388aef] hover:text-[#388aef] transition-colors disabled:opacity-40 disabled:cursor-progress"
              >
                {{ papersPending ? 'Loading…' : 'Load more papers' }}
              </button>
            </div>
          </div>
        </template>
      </main>

      <!-- Right sidebar: trending -->
      <aside class="hidden laptop:block w-44 shrink-0">
        <div class="sticky top-4 space-y-6">
          <!-- Trending categories -->
          <div v-if="trendingCategories.length">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Trending</p>
            <ul class="space-y-2">
              <li
                v-for="([cat, count]) in trendingCategories"
                :key="cat"
                class="flex items-center justify-between"
              >
                <span class="text-sm text-gray-700 truncate">{{ cat }}</span>
                <span class="text-xs text-gray-400 ml-2 shrink-0">{{ count }}</span>
              </li>
            </ul>
          </div>

          <!-- Top venues -->
          <div v-if="topVenues.length">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Venues</p>
            <ul class="space-y-2">
              <li
                v-for="venue in topVenues"
                :key="venue"
                class="text-sm text-gray-600 leading-snug"
              >
                {{ venue }}
              </li>
            </ul>
          </div>

          <div v-if="!trendingCategories.length && papersPending" class="space-y-2">
            <div class="h-3 bg-gray-100 rounded animate-pulse w-3/4"></div>
            <div class="h-3 bg-gray-100 rounded animate-pulse w-1/2"></div>
            <div class="h-3 bg-gray-100 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </aside>

    </div>
  </div>

  <Teleport to="body">
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

    const topicData = {
      ai:   usePapers('ai'),
      math: usePapers('math'),
      hw:   usePapers('hw'),
      cs:   usePapers('cs'),
    };

    const topics = [
      { id: 'ai',   label: 'AI & ML',      shortLabel: 'AI',   color: 'bg-[#388aef]' },
      { id: 'math', label: 'Mathematics',   shortLabel: 'Math', color: 'bg-purple-500' },
      { id: 'hw',   label: 'Hardware',      shortLabel: 'HW',   color: 'bg-orange-400' },
      { id: 'cs',   label: 'CS Theory',     shortLabel: 'CS',   color: 'bg-emerald-500' },
    ];

    const topicColor = {
      ai:   'bg-[#388aef]',
      math: 'bg-purple-500',
      hw:   'bg-orange-400',
      cs:   'bg-emerald-500',
    };

    const papers      = computed(() => topicData[activeTopic.value].papers.value);
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
      activeTopic,
      topics,
      topicColor,
      papers,
      papersPending,
      papersError,
      hasMore,
      loadMore,
      trendingCategories,
      topVenues,
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
    posts: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
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
        const searchedpost = response.data.post;
        this.$emit("update-posts", [searchedpost]);
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
