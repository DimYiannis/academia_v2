<template>
  <div class="grid">
    <nav class="mb-10 mt-6 flex">
      <div
        class="flex relative w-full laptop:w-1/2 mx-2 rounded-3xl border-2 border-[#388aef] group p-1"
      >
        <input
          class="w-full ml-3 focus:outline-none caret-[#388aef]"
          type="text"
          v-model="input"
          placeholder="Enter doi..."
        />
        <svg
          class="cursor-pointer"
          @click="getsinglepost(input)"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="#388aef"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="m21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>

      <!-- tooltip for sucess message -->
      <div
        :class="{
          'bg-red-500': message.toLowerCase().includes('removed'),
          'bg-green-500': message.toLowerCase().includes('created'),
        }"
        class="w-fit z-10 text-white top-2 left-[45%] rounded-lg p-2 absolute"
        v-show="showTooltip"
      >
        {{ message }}
      </div>
    </nav>

    <main class="h-screen overflow-hidden overflow-y-auto overscroll-auto">
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

      <div
        v-else
        class="post border p-4 mb-4 rounded-3xl"
        v-for="(i, index) of posts"
      >
        <div class="grid post-header items-center mb-2">
          <h1 class="text-lg font-semibold">
            <router-link
              class="underline decoration-sky-500 capitalize"
              :to="'/article/' + i.doi"
              >{{ i.title }}</router-link
            >
          </h1>
          <h2>Author: {{ i.authors }}</h2>
          <h2>Institutions: {{ i.university }}</h2>
          <h3>Year: {{ i.date }}</h3>
        </div>
        <div class="post-content mb-2">
          <p class="line-clamp-3">Abstract: {{ i.abstract }}</p>
          <h3>doi: {{ i.doi }}</h3>
          <!-- You can add other multimedia content (images, videos) here -->
        </div>
        <div class="flex justify-between mt-3">
          <div class="flex items-center">
            <button
              class="disabled:cursor-progress"
              @click="addLike(i._id)"
              :disabled="likeLoading"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M21 8.25c0-2.485-2.099-4.5-4.687-4.5c-1.936 
                  0-3.598 1.126-4.313 2.733c-.715-1.607-2.377-2.733-4.312-2.733C5.098 
                  3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </button>

            <button
              @click="modal(i._id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 20 20"
              >
                <g fill="currentColor">
                  <path
                    d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 
                    3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 
                    0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 
                    4.636v8.614Z"
                  />
                  <path
                    d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 
                    0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 
                    0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 
                    0-1.25-.56-1.25-1.25v-2.5Z"
                  />
                </g>
              </svg>
            </button>
          </div>
          <div>
            <button
              @click="addBookmark(i._id)"
              :disabled="bookmarkLoading"
              class="disabled:cursor-progress"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="26"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25L4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
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
definePageMeta({
  layout: 'dashboard'
})
export default {
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
          `http://localhost:5000/api/v1/bookmarks`,
          { post: postId },
          { withCredentials: true }
        );

        this.message = response.data.message;
        console.log(response.data.message);
      } catch (error) {
        console.error("Error creating bookmark:", error);
      } finally {
        this.bookmarkLoading = false;
        this.showTooltip = true;
        setTimeout(() => {
          this.showTooltip = false;
        }, 5000);
      }
    },
    async addLike(postId) {
      try {
        this.likeLoading = true;

        const response = await axios.post(
          `http://localhost:5000/api/v1/likes`,
          { post: postId },
          { withCredentials: true }
        );

        this.message = response.data.message;
        console.log(this.message);
        // Update the liked state
      } catch (error) {
        console.error("Error creating like:", error);
      } finally {
        this.likeLoading = false;
        this.showTooltip = true;
        setTimeout(() => {
          this.showTooltip = false;
        }, 5000);
      }
    },
    async sharePost(sharedPost) {
      try {
        //console.log("Shared Post:", sharedPost);
        const { postId, content } = sharedPost;
        // console.log(postId);
        //console.log(content);
        await axios.post(
          `http://localhost:5000/api/v1/sharedposts`,
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
          `http://localhost:5000/api/v1/posts/${input}`,
          { withCredentials: true }
        );
        //console.log(response.data.post);
        const searchedpost = response.data.post;
        // notify the parent component to update the posts data
        this.$emit("update-posts", [searchedpost]);
        //enclosed the searched post inside an array.
        //This is because the parent component expects an array of posts (v-for="i of posts").
        //With this change, when i search for a specific post,
        //it will replace the list of posts with an array containing only the searched post, preventing the iteration over its properties.
      } catch (error) {
        console.error("Error fetching single post:", error);
      }
    },
    modal(post_Id) {
      this.postId = post_Id;
      this.showmodal = !this.showmodal;
      //console.log(this.showmodal);
    },
  },
};
</script>
