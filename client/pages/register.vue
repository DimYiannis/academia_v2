<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-gray-50 p-8 rounded-xl shadow-lg">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p class="text-gray-600">
          Sign up now and start connecting.
          <br />
          Already have an account?
          <a @click="login" class="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
            Log in
          </a>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <!-- Error Message -->
        <div
          v-show="showError"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span class="block sm:inline">{{ errormsg }}</span>
        </div>

        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div class="mt-1">
              <input
                id="name"
                type="text"
                required
                v-model="name"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                type="email"
                required
                v-model="email"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                type="password"
                required
                v-model="password"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Create a password"
              />
            </div>
            <div v-if="passwordError" class="mt-2 text-sm text-red-600">{{ passwordError }}</div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            @click="register"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Account
          </button>
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
          // Remove console.logs and alert
          this.showError = false;
          this.errormsg = "";
          
          // Add success message
          const successMsg = document.createElement('div');
          successMsg.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded';
          successMsg.innerHTML = `
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span>Welcome to Academia! Your journey begins now...</span>
            </div>
          `;
          document.body.appendChild(successMsg);

          // Remove the message after transition and redirect
          setTimeout(() => {
            successMsg.style.transition = 'opacity 0.5s ease-out';
            successMsg.style.opacity = '0';
            setTimeout(() => {
              document.body.removeChild(successMsg);
              this.$router.push({ name: "login" });
            }, 500);
          }, 1500);
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
/* Remove the existing styles as they're no longer needed */
</style>
