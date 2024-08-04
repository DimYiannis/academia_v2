/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],

  theme: {
    // customized breakpoints //
    screens: {
      smallscreen: "300px",

      mobile: "600px",

      tablet: "760px",
      // => @media (min-width: 760px) { ... }

      laptop: "1024px",
      // => @media (min-width: 1024px) { ... }

      desktop: "1280px",
      // => @media (min-width: 1280px) { ... }

      lgdesk: "1600px",
    },
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")],
};
