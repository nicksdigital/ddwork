import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config


export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
 
  modules: [
    '@pinia/nuxt',
    '@nuxt/icon',
   
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    dbUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    public: {
      apiBase: '/api'
    }
  }
})