// https://nuxt.com/docs/api/configuration/nuxt-config
import {resolve} from "path";
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://academiav2-backend.onrender.com',
    },
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Academia — your daily AI research feed',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' },
      ],
      meta: [
        { name: 'description', content: 'Track the latest in AI/ML research — live papers from arXiv, HuggingFace & OpenAlex. Like, save, take notes, and explore them as a knowledge graph.' },
        { property: 'og:title', content: 'Academia — your daily AI research feed' },
        { property: 'og:description', content: 'Live AI papers from arXiv, HuggingFace & OpenAlex with notes, citations and a personal knowledge graph.' },
        { property: 'og:image', content: 'https://raw.githubusercontent.com/DimYiannis/academia_v2/main/docs/screenshot.png' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
    },
  },
  devtools: { enabled: true },
  alias: {
    "@": resolve(__dirname, "/"),
  },
  css: ['~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
