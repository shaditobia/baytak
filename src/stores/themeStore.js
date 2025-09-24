// stores/themeStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('themeStore', () => {
  // State
  const savedTheme = localStorage.getItem('theme') || 'dark'
  const theme = ref(savedTheme)

  // Action
  const setTheme = (newTheme) => {
    theme.value = newTheme
    const bodyElement = document.body
    bodyElement.setAttribute('data-bs-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  // Return state and actions
  return {
    theme,
    setTheme,
  }
})
