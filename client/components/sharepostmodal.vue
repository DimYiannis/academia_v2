<template>
  <div
    class="w-full h-full bg-black/30 left-0 top-0 fixed grid justify-items-center z-10"
    @click.self="closemodal"
  >
    <div
      class="w-full h-full mobile:w-[500px] mobile:h-fit relative mt-10 rounded-md bg-white z-20"
    >
      <div class="grid gap-4 m-5">
        <div>
          <svg
            @click="closemodal"
            class="hover:cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 
            0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 
            1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 
            12L5.47 6.53a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="flex mt-5">
          <div
            class="rounded-full w-10 h-10 mt-2"
            :style="{
              backgroundImage: user.profileImg
                ? `url(http://localhost:5000${user.profileImg})`
                : 'none',
              backgroundColor: user.backgroundImage ? '' : '#B0A8B9',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }"
          ></div>
          <input
            v-model="postContent"
            type="text"
            id="large-input"
            class="block w-full p-4 mb-5 outline-none caret-[#388aef]"
            placeholder="Capture your viewpoint and share with everyone..."
          />
        </div>
        <div class="border-t-2 flex justify-end">
          <button 
          @click="sharePost" 
          class="font-semibold mt-4" 
          :disabled="sharingPost">{{sharingPost ? 'Posting..': 'Post'}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      postContent: "",
      sharingPost: false,
    };
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
  },
  methods: {
    closemodal() {
      this.$emit("close-modal");
    },
    async sharePost() {
      this.sharingPost = true;

      const sharedPost = {
        postId: this.postId,
        content: this.postContent,
      };
      try {
        //  asynchronous operation
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Emit the event when sharing is successful
        this.$emit("share-post", sharedPost);

        // Clear the input field
        this.postContent = "";

      } catch (error) {
        console.error("Error sharing post:", error);
      } finally {
        this.sharingPost = false; 
      }
    },
  },
};
</script>
