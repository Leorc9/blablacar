import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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

  const bookedCount = computed(() => bookedRides.value.length)
  const bookedTotalPrice = computed(() => {
    return bookedRides.value.reduce((sum, booking) => sum + Number(booking.price || 0), 0)
  })

  // Helper: Validate ride data
  const validateRideData = (rideData) => {
    if (!rideData.from || !rideData.to) {
      throw new Error('Les villes de départ et d\'arrivée sont obligatoires')
    }
    if (rideData.from === rideData.to) {
      throw new Error('La ville de départ et d\'arrivée doivent être différentes')
    }
    if (rideData.seats < 1 || rideData.seats > 8) {
      throw new Error('Le nombre de places doit être entre 1 et 8')
    }
    if (rideData.price < 1) {
      throw new Error('Le prix doit être d\'au moins 1€')
    }
    if (!rideData.date || !rideData.time) {
      throw new Error('La date et l\'heure sont obligatoires')
    }
  }

  // Create ride
  const createRide = async (rideData) => {
    loading.value = true
    error.value = null
    
    try {
      validateRideData(rideData)
      
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
      error.value = 'Erreur lors du chargement des trajets'
      console.error('Error fetching rides:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get rides by user ID
  const getUserRides = async (userId) => {
    if (!userId) {
      throw new Error('ID utilisateur requis')
    }
    
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
      error.value = 'Erreur lors du chargement de vos trajets'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get ride by ID
  const getRideById = async (rideId) => {
    if (!rideId) {
      throw new Error('ID du trajet requis')
    }
    
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
      error.value = err.message || 'Erreur lors du chargement du trajet'
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
      
      if (rides.value.length === 0 && (from || to)) {
        error.value = 'Aucun trajet trouvé pour cette recherche'
      }
    } catch (err) {
      error.value = 'Erreur lors de la recherche'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Book a ride
  const bookRide = async (rideId, userId) => {
    if (!rideId || !userId) {
      throw new Error('Informations manquantes')
    }
    
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
      
      // Check if user is the driver
      if (rideData.driverId === userId) {
        error.value = 'Vous ne pouvez pas réserver votre propre trajet'
        throw new Error(error.value)
      }
      
      // Check seats availability
      if (rideData.seats <= 0) {
        error.value = 'Ce trajet est complet'
        throw new Error(error.value)
      }

      // Check if already booked
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('rideId', '==', rideId),
        where('passengerId', '==', userId)
      )
      const existingBookings = await getDocs(bookingsQuery)
      
      if (!existingBookings.empty) {
        error.value = 'Vous avez déjà réservé ce trajet'
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
      error.value = err.message || 'Erreur lors de la réservation'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch user's booked rides
  const fetchBookedRides = async (userId) => {
    if (!userId) {
      throw new Error('ID utilisateur requis')
    }
    
    loading.value = true
    error.value = null
    try {
      const q = query(
        collection(db, 'bookings'),
        where('passengerId', '==', userId)
      )
      const querySnapshot = await getDocs(q)
      bookedRides.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => {
        const da = new Date(a.bookedAt || 0).getTime()
        const db = new Date(b.bookedAt || 0).getTime()
        return db - da
      })
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement de vos réservations'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete ride
  const deleteRide = async (rideId) => {
    if (!rideId) {
      throw new Error('ID du trajet requis')
    }
    
    loading.value = true
    error.value = null
    try {
      await deleteDoc(doc(db, 'rides', rideId))
      rides.value = rides.value.filter(ride => ride.id !== rideId)
    } catch (err) {
      error.value = 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Clear errors
  const clearError = () => {
    error.value = null
  }

  return {
    rides,
    currentRide,
    bookedRides,
    loading,
    error,
    bookedCount,
    bookedTotalPrice,
    createRide,
    fetchRides,
    getUserRides,
    getRideById,
    searchRides,
    bookRide,
    fetchBookedRides,
    deleteRide,
    clearError
  }
})
