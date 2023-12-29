<template>
  <div>
    <!--svg -->
    <div class="grid justify-center mt-10">
      <form class="mb-6 grid gap-5" @submit.prevent="login">
        <h1 class="heading-4 mb-3 text-2xl font-bold">Log in</h1>
        <h2 class="mb-1 font-semibold">
          Log in to access your dashboard.
          <br />
          Don't have an account yet?
          <a class="underline cursor-pointer" href="/register">Sign up</a>
        </h2>

        <!--tooltip-->
        <p
          class="bg-sky-500/40 text-white rounded-lg p-3 mt-3"
          v-show="showError"
        >
          {{ errormsg }}
        </p>

        <label class="">Email:</label>
        <input type="email" required v-model="email" placeholder="Email"/>

        <label>Password:</label>
        <input
          type="password"
          required
          v-model="password"
          placeholder="Password"
        />

        <div v-if="passwordError" class="error">{{ passwordError }}</div>

        <button class="w-full">
          <svg
            v-if="loading"
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
          Log in
        </button>

        <div class="text-center">
          <a class="underline font-semibold"> Forgot Password? </a>
        </div>
        <div>
          <h1>Demo user</h1>
          <h2>Email: leo@email.com</h1>
          <h2>Password: secret</h1>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      showError: false,
      password: "",
      email: "",
      passwordError: "",
      errormsg: "",
      loading: false,
    };
  },
  methods: {
    login() {
      this.loading = true;

      axios
        .post(
          "https://academiav2-backend.onrender.com/api/v1/auth/login",
          {
            email: this.email,
            password: this.password,
          },
          { withCredentials: true }
        ) //Without this option, cookies will not be sent.

        .then((response) => {
          console.log(response);
          console.log(response.data.user);
          alert("Welcome back!");

          //redirect to dashboard page.
          this.$router.push({ name: "dashboard" });
        })
        .catch((error) => {
          console.error("Registration error:", error);
          // Handle the error and provide feedback to the user.
          this.errormsg = error.response.data.msg;

          // show the tooltip
          this.showError = true;
          // hide the tooltip after 5 seconds
          setTimeout(() => {
            this.showError = false;
          }, 5000);
        })
        .finally(() => {
          this.loading = false; // Set loading to false when the request is completed
        });
    },
  },
};
</script>
