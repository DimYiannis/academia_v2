<template>
  <div class="min-h-screen flex flex-col tablet:flex-row bg-[#1c1c1e]">
    <!-- Left: branding panel -->
    <div class="hidden tablet:flex flex-col justify-between bg-gradient-to-br from-teal-900/60 via-[#1c1c1e] to-[#111113] border-r border-gray-800 text-white px-12 py-12 tablet:w-2/5">
      <a href="/" class="flex items-center gap-2.5 text-xl font-bold tracking-tight">
        <span class="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </span>
        Academia
      </a>

      <div>
        <h2 class="text-3xl font-bold leading-snug mb-4">
          New to Academia?
        </h2>
        <p class="text-gray-400 mb-8 leading-relaxed">
          Your daily AI research feed. Live papers from arXiv and HuggingFace, citation counts, private notes and a personal knowledge graph.
        </p>
        <NuxtLink
          to="/register"
          class="inline-block px-6 py-3 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-500 transition-colors"
        >
          Create account
        </NuxtLink>
      </div>

      <p class="text-gray-600 text-sm">
        arXiv · HuggingFace · OpenAlex
      </p>
    </div>

    <!-- Right: login form -->
    <div class="flex-1 flex flex-col justify-center px-8 tablet:px-16 py-16">
      <!-- Mobile header -->
      <a href="/" class="tablet:hidden text-xl font-bold text-teal-400 mb-12">Academia</a>

      <div class="max-w-sm w-full mx-auto">
        <h1 class="text-2xl font-bold text-white mb-1">Welcome back</h1>
        <p class="text-sm text-gray-500 mb-8">
          No account?
          <NuxtLink to="/register" class="text-teal-400 font-medium hover:text-teal-300">Sign up</NuxtLink>
        </p>

        <div
          v-show="showError"
          class="mb-5 px-4 py-3 rounded-lg bg-red-900/30 border border-red-800 text-red-400 text-sm"
          role="alert"
        >
          {{ errormsg }}
        </div>

        <form class="space-y-4" @submit.prevent="login">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              id="email"
              type="email"
              required
              v-model="email"
              class="w-full px-3 py-2 bg-[#242426] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div class="flex justify-between mb-1">
              <label for="password" class="block text-sm font-medium text-gray-300">Password</label>
              <a href="#" class="text-sm text-teal-400">Forgot?</a>
            </div>
            <input
              id="password"
              type="password"
              required
              v-model="password"
              class="w-full px-3 py-2 bg-[#242426] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            class="w-full py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-500 transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <svg
              v-if="loading"
              class="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Sign in
          </button>

          <button
            type="button"
            @click="demoLogin"
            class="w-full py-2.5 border border-gray-700 text-gray-400 rounded-lg text-sm hover:border-gray-500 hover:text-gray-200 transition-colors"
          >
            Use demo account
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
const API_BASE = import.meta.dev ? 'http://localhost:5000' : 'https://academiav2-backend.onrender.com'
definePageMeta({ layout: false });
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
    demoLogin() {
      this.email = "leo@email.com";
      this.password = "secret";
      this.login();
    },
    login() {
      this.loading = true;

      axios
        .post(
          `${API_BASE}/api/v1/auth/login`,
          {
            email: this.email,
            password: this.password,
          },
          { withCredentials: true }
        )
        .then((response) => {
          this.showError = false;
          this.errormsg = "";

          const successMsg = document.createElement('div');
          successMsg.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded';
          successMsg.innerHTML = `
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span>Great to see you again! Preparing your workspace...</span>
            </div>
          `;
          document.body.appendChild(successMsg);

          setTimeout(() => {
            successMsg.style.transition = 'opacity 0.5s ease-out';
            successMsg.style.opacity = '0';
            setTimeout(() => {
              document.body.removeChild(successMsg);
              this.$router.push({ name: "dashboard" });
            }, 500);
          }, 1500);
        })
        .catch((error) => {
          console.error("Registration error:", error);
          this.errormsg = error.response.data.msg;
          this.showError = true;
          setTimeout(() => {
            this.showError = false;
          }, 5000);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
