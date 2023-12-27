<template>
  <div class="grid h-fit mt-10 justify-center">
    <p class="bg-sky-500/40 text-white rounded-lg p-3 mt-3" v-show="showError">
      {{ errormsg }}
    </p>
    <form class="grid gap-5 mx-10 w-fit" @submit.prevent="handleSubmit">
      <h1 class="text-center font-semibold text-lg">
        Sign up now and start Connecting
      </h1>

      <label class="">Full Name:</label>
      <input type="name" required v-model="name" placeholder="Full Name" />

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

      <div class="">
        <button @click="register" class=" ">Join Now</button>
        <div class="place-self-start text-[10px] flex gap-1">
          <p>Already have an account?</p>
          <a class="cursor-pointer underline underline-offset-1" @click="login"
            >log in</a
          >
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      showError: false,
      passwordError: "",
      errormsg: "",
    };
  },
  methods: {
    handleSubmit() {
      //validate password
      this.passwordError =
        this.password.length >= 4
          ? ""
          : "Password must be at least 12 characters long";
      // if (!this.passwordError) {
      //   console.log("email: ", this.email);
      //   console.log("password: ", this.password);
      //   console.log("terms accepted: ", this.terms);
      // }
    },

    register() {
      axios
        .post(
          "https://academiav2-backend.onrender.com/api/v1/auth/register",
          {
            name: this.name,
            email: this.email,
            password: this.password,
          }
        )
        .then((response) => {
          console.log("Redirecting to login page");
          console.log(response.data);
          alert("Welcome to Academia!");
          // redirect to another page or show a success message.
          this.$router.push({ name: "login" });
        })
        .catch((error) => {
          console.error("Registration error:", error.response);
          // Handle the error and provide feedback to the user.
          this.errormsg = error.response.data.msg;
          console.log(error.response.data);

          // show the tooltip
          this.showError = true;
          // hide the tooltip after 5 seconds
          setTimeout(() => {
            this.showError = false;
          }, 5000);
        });
    },
    login() { 
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style>
/* Tooltip styles */
[v-show] {
  opacity: 0;
  transition: opacity 1s ease;
}
[v-show].active {
  opacity: 1;
}
</style>
