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
        <input type="email" required v-model="email" placeholder="Email" />

        <label>Password:</label>
        <input
          type="password"
          required
          v-model="password"
          placeholder="Password"
        />

        <div v-if="passwordError" class="error">{{ passwordError }}</div>

        <button class="w-full">Log in</button>

        <div class="text-center">
          <a class="underline font-semibold"> Forgot Password? </a>
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
    };
  },
  methods: {
    login() {
      axios
        .post("https://academiav2-backend.onrender.com/api/v1/auth/login", {
          email: this.email,
          password: this.password,
        },
        {withCredentials: true,})//Without this option, cookies will not be sent.
   
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
        });
    },
  },
};
</script>
