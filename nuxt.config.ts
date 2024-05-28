// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@tresjs/nuxt"],
  build: {
    transpile: ["@tresjs/cientos"],
  },
  tres: {
    devtools: true,
    glsl: true,
  },
  css: ["@/assets/main.css", "@/node_modules/bulma/css/bulma.css"],
  devtools: { enabled: true },
});
