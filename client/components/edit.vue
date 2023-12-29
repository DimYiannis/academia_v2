<template>
  <div
    v-if="userr"
    class="w-full h-full bg-black/30 left-0 top-0 fixed grid justify-items-center z-30"
    @click.self="closemodal"
  >
    <div
      class="w-full h-full mobile:w-[500px] mobile:h-[550px] relative mobile:mt-10 rounded-lg bg-white z-40"
    >
      <div class="h-full m-5">
        <div class="flex h-fit">
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

        <div class="grid gap-5 mobile:gap-0">
          <!-- photos -->
          <div class=" ">
            <!-- background -->
            <div
              class="w-full h-[250px] grid place-items-center border-2 mt-10 mobile:mt-0"
              :style="{
                backgroundImage: this.userr.backgroundImg
                  ? 'url(https://academiav2-backend.onrender.com' + userr.backgroundImg + ')'
                  : 'none',
                backgroundColor: userr.backgroundImg ? '' : '#B0A8B9',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }"
            >
              <div>
                <div class="bg-black/40 hover:bg-black/70 rounded-full p-1">
                  <label for="background" class="cursor-pointer">
                    <input
                      ref="backInput"
                      type="file"
                      name="image"
                      id="background"
                      accept="image/png, image/jpeg"
                      style="display: none"
                      @change="handleFileChange2"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                      fill="white"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path
                        d="M18 20H4V6h9V4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9h-2v9zm-7.79-3.17l-1.96-2.36L5.5 18h11l-3.54-4.71zM20 4V1h-2v3h-3c.01.01 0 2 0 2h3v2.99c.01.01 2 0 2 0V6h3V4h-3z"
                      />
                    </svg>
                  </label>
                </div>
              </div>
            </div>
            <!-- profile -->
            <div class="relative h-0">
              <div
                class="absolute -top-24 left-2 rounded-full w-16 h-28 ml-3 border-2"
                :style="{
                  backgroundImage: userr.profileImg
                    ? 'url(https://academiav2-backend.onrender.com' + userr.profileImg + ')'
                    : 'none',
                  backgroundColor: userr.profileImg ? '' : '#B0A8B9',
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }"
              >
                <!-- had to place a label to enclose input and svg in 
              order for the method to work -->
                <div
                  class="absolute top-[40%] left-[25%] bg-black/40 hover:bg-black/70 rounded-full p-1"
                >
                  <label for="profile" class="cursor-pointer">
                    <input
                      ref="profInput"
                      type="file"
                      name="image"
                      id="profile"
                      accept="image/png, image/jpeg"
                      style="display: none"
                      @change="handleFileChange"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                      fill="white"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path
                        d="M18 20H4V6h9V4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9h-2v9zm-7.79-3.17l-1.96-2.36L5.5 18h11l-3.54-4.71zM20 4V1h-2v3h-3c.01.01 0 2 0 2h3v2.99c.01.01 2 0 2 0V6h3V4h-3z"
                      />
                    </svg>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="h-fit grid gap-5 mobile:gap-0">
            <!-- name -->
            <div class="mt-5 border-2 h-[70px]" @click="focusInput">
              <label for="large-input" class="m-3">Name</label>
              <input
                v-model="userName"
                ref="nameInput"
                type="text"
                class="block w-max m-2 outline-none caret-[#388aef]"
                placeholder=""
              />
            </div>
            <!-- info -->
            <div class="mt-5 border-2 mb-2" @click="focusInput2">
              <label for="large-input" class="m-3">Info</label>
              <input
                v-model="userInfo"
                ref="infoInput"
                type="text"
                class="block w-max m-2 outline-none caret-[#388aef]"
                placeholder=""
              />
            </div>
            <div class="border-t-2 flex justify-end">
              <button @click="update" class="font-semibold mt-4">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- upload state -->
    <div
      v-show="loading || uploadMessage"
      class="z-50 fixed mobile:top-10 top-14 left-1/2 text-white"
    >
      <div
        id="loader"
        v-show="loading"
        class="relative transform -translate-x-1/2 -translate-y-1/2 bg-[#388aef] p-4 rounded shadow"
      >
        <svg
          aria-hidden="true"
          role="status"
          class="inline w-4 h-4 me-3 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
        Uploading...
      </div>
      <div
        id="message"
        v-show="uploadMessage"
        class="relative transform -translate-x-1/2 -translate-y-1/2 bg-[#388aef] p-4 rounded shadow"
      >
        {{ uploadMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      userName: "",
      userInfo: "",
      backgroundPic: "",
      profilePic: "",
      loading: false,
      uploadMessage: "",
    };
  },
  props: {
    userr: {
      type: Object,
      required: true,
    },
  },
  computed: {},
  methods: {
    closemodal() {
      this.$emit("close-modal");
    },
    async updatedetails() {
      try {
        this.loading = true;

        await axios.patch(
          `http://localhost:5000/api/v1/users/updateUser`,
          { name: this.userName, info: this.userInfo },
          { withCredentials: true }
        );

        //message
        if (response && response.status === 200) {
          this.uploadMessage = " Uploaded successfully!";
        } else {
          this.uploadMessage = "Failed to upload";
        }

        if (this.userr) {
          window.location.reload();
        }

      } catch (error) {
        console.error("Error updating name and info:", error);
      } finally {
        this.loading = false;
      }
      setTimeout(() => {
        this.uploadMessage = "";
      }, 3000);
    },

    focusInput() {
      // Focus on the name input when the div with ref nameInput is clicked
      this.$refs.nameInput.focus();
    },
    focusInput2() {
      this.$refs.infoInput.focus();
      console.log(this.userr);
    },

    handleFileChange(event) {
      this.$refs.profInput.focus();
      const file = event.target.files[0];
      if (file) {
        this.profilePic = file;
      }
      console.log(file);
    },
    handleFileChange2(event) {
      this.$refs.backInput.focus();

      const file = event.target.files[0];
      if (file) {
        this.backgroundPic = file;
      }
      console.log(file);
    },

    async uploadBackgroundImg() {
      try {
        console.log(this.backgroundPic);
        this.loading = true;

        const response = await axios.post(
          "http://localhost:5000/api/v1/users/uploadbackimage",
          { image: this.backgroundPic },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        //message
        if (response && response.status === 200) {
          this.uploadMessage = "Background image uploaded successfully!";
        } else {
          this.uploadMessage = "Failed to upload background image.";
        }

        if (this.userr) {
          window.location.reload();
        }
      } catch (error) {
        console.error("Error uploading file:", error.response.data);
        this.uploadMessage = error.response.data.error;
      } finally {
        this.loading = false;
      }
      setTimeout(() => {
        this.uploadMessage = "";
      }, 3000);
    },

    async uploadProfileImg() {
      try {
        this.loading = true;
        console.log(this.profilePic);

        const response = await axios.post(
          "http://localhost:5000/api/v1/users/uploadprofimage",
          { image: this.profilePic },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // message
        if (response.status === 200) {
          this.uploadMessage = "Profile image uploaded successfully!";
        } else {
          this.uploadMessage = "Failed to upload profile image.";
        }
        if (this.userr) {
          window.location.reload();
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        this.uploadMessage = error.response.data.error;
      } finally {
        this.loading = false;
      }
      setTimeout(() => {
        this.uploadMessage = "";
      }, 3000);
      window.location.reload();
    },

    update() {
      if (this.userName || this.userInfo) {
        this.updatedetails();
      }

      if (this.backgroundPic) {
        this.uploadBackgroundImg();
      }
      if (this.profilePic) {
        this.uploadProfileImg();
      }
      console.log(this.userr);
      if (
        !this.userName &&
        !this.userInfo &&
        !this.backgroundPic &&
        !this.profilePic
      ) {
        this.uploadMessage = "No new modifications detected.";
      }
      setTimeout(() => {
        this.uploadMessage = "";
      }, 3000);
    },
  },
};
</script>
