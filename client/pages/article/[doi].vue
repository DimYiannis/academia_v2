<template>
  <!-- Loading state v-if="loading" -->
  <div v-if="loading" class="grid place-items-center h-full">
    <div class="text-center text-lg font-semibold py-4 animate-bounce">
      <div role="status">
        <svg
          aria-hidden="true"
          class="inline w-10 h-10text-gray-200 animate-spin dark:text-gray-600 fill-[#2c6dbd]"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        Loading...
      </div>
    </div>
  </div>

  <div v-else class="grid mobile:mx-5 mt-12 border-r-2">
    <div class="grid">
      <div class="flex justify-between">
        <h4>Published on: {{ this.post.date }} <br /></h4>
        <h4 class="mr-3">
          doi: {{ post.doi }} <br />
          citations: {{ post.citations }}
        </h4>
      </div>
      <div class="mt-4">
        <h1 class="text-3xl font-bold">{{ post.title }}</h1>
        <h2 class="mt-2">{{ post.university }}</h2>
        <h2>authors: {{ post.authors }}</h2>
      </div>
    </div>
    <div class="grid mt-5 mx-10">
      <h1 class="text-lg font-semibold">Abstract</h1>
      <p :class="{ 'line-clamp-[10]': !abstract }">{{ post.abstract }}</p>
      <p @click="showall" class="text-[#388aef] cursor-pointer underline">
        {{ abstract ? "Hide abstract" : "Continue reading" }}
      </p>
    </div>

    <!--full article-->
    <div class="mt-5 mx-10 grid">
      <div
        class="border-b-2 text-lg font-semibold cursor-pointer"
        :class="{ 'justify-self-end border-[#388aef] w-fit': !showarticle }"
        @click="article"
      >
        Full Access:
      </div>
      <p
        class="mt-4"
        :class="{
          'hide transition-opacity ease-out duration-500 opacity-0':
            !showarticle,
          'transition-opacity ease-in duration-500 opacity-100': showarticle,
        }"
      >
        {{ post.paper }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

definePageMeta({
  layout: 'dashboard'
})

export default {
  data() {
    return {
      post: [],
      abstract: false,
      showarticle: false,
      loading: false,
    };
  },
  props: {
    posts: {
      type: Object,
      required: true,
    },
  },
  created() {
    this.getarticle();
  },
  methods: {
    async getarticle() {
      this.loading = true;
      const postId = this.$route.params.doi;
      try {
        const response = await axios.get(
          `https://academiav2-backend.onrender.com/api/v1/posts/${postId}`,
          {
            withCredentials: true,
          }
        );
        this.post = response.data.post;
      } catch (error) {
        console.error("Error fetching post information:", error);
      } finally {
        this.loading = false;
      }
    },
    showall() {
      this.abstract = !this.abstract;
    },
    article() {
      this.showarticle = !this.showarticle;
    },
  },
};
</script>
