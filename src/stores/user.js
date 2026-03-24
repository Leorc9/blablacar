import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, db } from '@/firebase/config'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const register = async (name, email, password) => {
    loading.value = true
    error.value = null
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        createdAt: new Date().toISOString()
      })

      currentUser.value = {
        uid: userCredential.user.uid,
        name,
        email
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
      
      if (userDoc.exists()) {
        currentUser.value = {
          uid: userCredential.user.uid,
          ...userDoc.data()
        }
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    error.value = null
    try {
      await signOut(auth)
      currentUser.value = null
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (profileData) => {
    loading.value = true
    error.value = null
    try {
      if (!currentUser.value) {
        throw new Error('Utilisateur non connecté')
      }

      const userRef = doc(db, 'users', currentUser.value.uid)
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: new Date().toISOString()
      })

      currentUser.value = {
        ...currentUser.value,
        ...profileData
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const initAuth = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          currentUser.value = {
            uid: user.uid,
            ...userDoc.data()
          }
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
    updateProfile,
    initAuth
  }
})
