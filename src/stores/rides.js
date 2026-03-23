import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/firebase/config'
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc,
  query, 
  where,
  orderBy,
  deleteDoc,
  updateDoc,
  increment
} from 'firebase/firestore'

export const useRidesStore = defineStore('rides', () => {
  const rides = ref([])
  const currentRide = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Create ride
  const createRide = async (rideData) => {
    loading.value = true
    error.value = null
    try {
      const docRef = await addDoc(collection(db, 'rides'), {
        ...rideData,
        createdAt: new Date().toISOString()
      })
      return docRef.id
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch all rides
  const fetchRides = async () => {
    loading.value = true
    error.value = null
    try {
      const q = query(
        collection(db, 'rides'),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      rides.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get rides by user ID
  const getUserRides = async (userId) => {
    loading.value = true
    error.value = null
    try {
      const q = query(
        collection(db, 'rides'),
        where('driverId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      rides.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get ride by ID
  const getRideById = async (rideId) => {
    loading.value = true
    error.value = null
    try {
      const docRef = doc(db, 'rides', rideId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        currentRide.value = {
          id: docSnap.id,
          ...docSnap.data()
        }
        return currentRide.value
      } else {
        throw new Error('Ride not found')
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Search rides
  const searchRides = async (from, to) => {
    loading.value = true
    error.value = null
    try {
      let q = query(collection(db, 'rides'))
      
      if (from) {
        q = query(q, where('from', '==', from))
      }
      if (to) {
        q = query(q, where('to', '==', to))
      }
      
      const querySnapshot = await getDocs(q)
      rides.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Book a ride
  const bookRide = async (rideId, userId) => {
    loading.value = true
    error.value = null
    try {
      const rideRef = doc(db, 'rides', rideId)
      await updateDoc(rideRef, {
        seats: increment(-1)
      })
      
      // Refresh current ride
      if (currentRide.value && currentRide.value.id === rideId) {
        currentRide.value.seats -= 1
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete ride
  const deleteRide = async (rideId) => {
    loading.value = true
    error.value = null
    try {
      await deleteDoc(doc(db, 'rides', rideId))
      rides.value = rides.value.filter(ride => ride.id !== rideId)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    rides,
    currentRide,
    loading,
    error,
    createRide,
    fetchRides,
    getUserRides,
    getRideById,
    searchRides,
    bookRide,
    deleteRide
  }
})
