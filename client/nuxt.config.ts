// https://nuxt.com/docs/api/configuration/nuxt-config
import {resolve} from "path";
export default defineNuxtConfig({
  app: {
    head: {
        link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
    }
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
