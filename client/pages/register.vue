<template>
  <div class="min-h-screen flex flex-col tablet:flex-row bg-[#1c1c1e]">
    <!-- Left: register form -->
    <div class="flex-1 flex flex-col justify-center px-8 tablet:px-16 py-16">
      <!-- Mobile header -->
      <a href="/" class="tablet:hidden text-xl font-bold text-teal-400 mb-12">Academia</a>

      <div class="max-w-sm w-full mx-auto">
        <h1 class="text-2xl font-bold text-white mb-1">Create account</h1>
        <p class="text-sm text-gray-500 mb-8">
          Already have an account?
          <NuxtLink to="/login" class="text-teal-400 font-medium hover:text-teal-300">Sign in</NuxtLink>
        </p>

        <div
          v-show="showError"
          class="mb-5 px-4 py-3 rounded-lg bg-red-900/30 border border-red-800 text-red-400 text-sm"
          role="alert"
        >
          {{ errormsg }}
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-300 mb-1">Full name</label>
            <input
              id="name"
              type="text"
              required
              v-model="name"
              class="w-full px-3 py-2 bg-[#242426] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              placeholder="Jane Smith"
            />
          </div>

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
            <label for="password" class="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              id="password"
              type="password"
              required
              v-model="password"
              class="w-full px-3 py-2 bg-[#242426] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              placeholder="••••••••"
            />
            <p v-if="passwordError" class="mt-1.5 text-xs text-red-400">{{ passwordError }}</p>
          </div>

          <button
            type="submit"
            @click="register"
            class="w-full py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-500 transition-colors mt-2"
          >
            Create account
          </button>
        </form>
      </div>
    </div>

    <!-- Right: branding panel -->
    <div class="hidden tablet:flex flex-col justify-between bg-gradient-to-bl from-teal-900/60 via-[#1c1c1e] to-[#111113] border-l border-gray-800 text-white px-12 py-12 tablet:w-2/5">
      <a href="/" class="text-xl font-bold tracking-tight text-white">Academia</a>

      <div>
        <h2 class="text-3xl font-bold leading-snug mb-4">
          Join the feed.
        </h2>
        <p class="text-gray-400 mb-8 leading-relaxed">
          Your daily AI research feed. Live papers from arXiv and HuggingFace, citation counts, private notes and a personal knowledge graph.
        </p>
        <ul class="space-y-3 text-sm text-gray-400">
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            AI papers from arXiv & HuggingFace, daily
          </li>
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            Citation counts via OpenAlex
          </li>
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Like, save & annotate — mapped in your knowledge graph
          </li>
        </ul>
      </div>

      <p class="text-gray-600 text-sm">
        Free forever · No credit card required
      </p>
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
      this.passwordError =
        this.password.length >= 4
          ? ""
          : "Password must be at least 12 characters long";
    },

    register() {
      axios
        .post(
          `${API_BASE}/api/v1/auth/register`,
          {
            name: this.name,
            email: this.email,
            password: this.password,
          }
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
              <span>Welcome to Academia! Your journey begins now...</span>
            </div>
          `;
          document.body.appendChild(successMsg);

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
          this.errormsg = error.response.data.msg;
          console.log(error.response.data);
          this.showError = true;
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
