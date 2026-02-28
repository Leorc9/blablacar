import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, db } from '@/firebase/config'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Register
  const register = async (email, password, name) => {
    loading.value = true
    error.value = null
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Save user to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        createdAt: new Date().toISOString()
      })
      
      currentUser.value = { uid: user.uid, email, name }
      return user
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Login
  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        currentUser.value = { uid: user.uid, ...userDoc.data() }
      }
      
      return user
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = async () => {
    try {
      await signOut(auth)
      currentUser.value = null
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // Init auth state
  const initAuth = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          currentUser.value = { uid: user.uid, ...userDoc.data() }
        }
      } else {
        currentUser.value = null
      }
    })
  }

  return {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    initAuth
  }
})
