import tailwindcss from '@tailwindcss/vite'

// Applies the saved or system theme before paint to avoid a flash.
const themeScript = `try {
  const saved = localStorage.getItem('theme');
  const dark = saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', dark);
} catch {}`

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@pinia/nuxt'],
  // Stores are imported explicitly, like components.
  pinia: { storesDirs: [] },
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  // Components are imported explicitly, like the other example projects.
  components: { dirs: [] },
  runtimeConfig: {
    // Shop name shown in the header (override at runtime with NUXT_PUBLIC_STORE_NAME).
    public: { storeName: process.env.PUBLIC_STORE_NAME || 'YesPOS Store' }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: process.env.PUBLIC_STORE_NAME || 'YesPOS Store',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap'
        }
      ],
      script: [{ innerHTML: themeScript, tagPosition: 'head' }]
    }
  }
})
