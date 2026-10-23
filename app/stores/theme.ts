import { defineStore } from 'pinia'

/** Light/dark theme; the head script in nuxt.config applies the saved one before paint. */
export const useThemeStore = defineStore('theme', {
  state: () => ({ dark: false }),
  actions: {
    /** Reads the theme the head script applied; call once mounted. */
    sync() {
      this.dark = document.documentElement.classList.contains('dark')
    },
    toggle() {
      this.dark = !this.dark
      document.documentElement.classList.toggle('dark', this.dark)
      try {
        localStorage.setItem('theme', this.dark ? 'dark' : 'light')
      } catch {
        // The theme then resets on reload.
      }
    }
  }
})
