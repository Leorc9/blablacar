import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/firebase/config'
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  deleteDoc,
  doc
} from 'firebase/firestore'

export const useRidesStore = defineStore('rides', () => {
  const rides = ref([])
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
    loading,
    error,
    createRide,
    fetchRides,
    searchRides,
    deleteRide
  }
})
