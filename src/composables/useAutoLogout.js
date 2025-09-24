import { onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { App_Route_Names } from '@/constants/RouteNames'

export function useAutoLogout(timeout = 600000) {
  // 10 minutes
  const authStore = useAuthStore()
  const router = useRouter()
  let timer

  const resetTimer = () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      if (authStore.isAuthenticated) {
        authStore.signOutUser()
        router.push({ name: App_Route_Names.HOME })
        alert('You have been logged out due to inactivity.')
      }
    }, timeout)
  }

  const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']

  const startListening = () => {
    events.forEach((event) => window.addEventListener(event, resetTimer))
    resetTimer()
  }

  const stopListening = () => {
    events.forEach((event) => window.removeEventListener(event, resetTimer))
    if (timer) clearTimeout(timer)
  }

  onMounted(startListening)
  onBeforeUnmount(stopListening)
}
