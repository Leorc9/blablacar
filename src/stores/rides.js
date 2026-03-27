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
  const bookedRides = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Create ride
  const createRide = async (rideData) => {
    loading.value = true
    error.value = null
    
    if (!rideData.from || !rideData.to) {
      error.value = 'Les villes de départ et d\'arrivée sont obligatoires'
      loading.value = false
      throw new Error(error.value)
    }

    if (rideData.seats < 1 || rideData.seats > 8) {
      error.value = 'Le nombre de places doit être entre 1 et 8'
      loading.value = false
      throw new Error(error.value)
    }

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
      console.error('Error fetching rides:', err)
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
        error.value = 'Trajet introuvable'
        throw new Error(error.value)
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

  // Book a ride - now creates booking document
  const bookRide = async (rideId, userId) => {
    loading.value = true
    error.value = null
    
    try {
      const rideRef = doc(db, 'rides', rideId)
      const rideSnap = await getDoc(rideRef)
      
      if (!rideSnap.exists()) {
        error.value = 'Trajet introuvable'
        throw new Error(error.value)
      }

      const rideData = rideSnap.data()
      if (rideData.seats <= 0) {
        error.value = 'Ce trajet est complet'
        throw new Error(error.value)
      }

      // Create booking document
      await addDoc(collection(db, 'bookings'), {
        rideId,
        passengerId: userId,
        driverId: rideData.driverId,
        from: rideData.from,
        to: rideData.to,
        date: rideData.date,
        time: rideData.time,
        price: rideData.price,
        status: 'confirmed',
        bookedAt: new Date().toISOString()
      })

      // Decrement seats
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

  // Fetch user's booked rides
  const fetchBookedRides = async (userId) => {
    loading.value = true
    error.value = null
    try {
      const q = query(
        collection(db, 'bookings'),
        where('passengerId', '==', userId),
        orderBy('bookedAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      bookedRides.value = querySnapshot.docs.map(doc => ({
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
    currentRide,
    bookedRides,
    loading,
    error,
    createRide,
    fetchRides,
    getUserRides,
    getRideById,
    searchRides,
    bookRide,
    fetchBookedRides,
    deleteRide
  }
})
