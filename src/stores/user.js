import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)
  const loading = ref(false)

  const setUser = (user) => {
    currentUser.value = user
  }

  const clearUser = () => {
    currentUser.value = null
  }

  return {
    currentUser,
    loading,
    setUser,
    clearUser
  }
})
