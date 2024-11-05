// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: "Trekking Trails",
    },
  },
  tailwindcss: {
    cssPath: "globals.css",
  },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@nuxtjs/google-fonts",
    "@nuxtjs/device",
    "@nuxthub/core",
  ],
  googleFonts: {
    families: {
      Roboto: true,
      Inter: [400, 700],
      "Josefin+Sans": true,
      Lato: [100, 300],
      Raleway: {
        wght: [100, 400],
        ital: [100],
      },
      "Dancing Script": true,
    },
  },
  compatibilityDate: "2024-11-05",
  nitro: {
    experimental: {
      openAPI: true,
    },
  },
  hub: {
    cache: true,
  },
});