<template>
  <div class="ride-detail-page">
    <LoadingSpinner v-if="ridesStore.loading" message="Chargement du trajet..." />

    <div v-else-if="ride" class="ride-detail-container">
      <h1>Détails du trajet</h1>

      <div class="route-block">
        <p><strong>Départ :</strong> {{ ride.from }}</p>
        <p><strong>Arrivée :</strong> {{ ride.to }}</p>
        <p><strong>Date :</strong> {{ ride.date }} à {{ ride.time }}</p>
        <p><strong>Prix :</strong> {{ ride.price }} €</p>
      </div>

      <section class="weather-grid">
        <CityWeatherCard
          title="Météo au départ"
          :city="ride.from"
          :weather="weatherStore.departureWeather"
          :loading="weatherStore.loading"
          :error="weatherStore.error"
          @refresh="refreshWeather"
        />

        <CityWeatherCard
          title="Météo à l'arrivée"
          :city="ride.to"
          :weather="weatherStore.arrivalWeather"
          :loading="weatherStore.loading"
          :error="weatherStore.error"
          @refresh="refreshWeather"
        />
      </section>

      <p v-if="weatherStore.routeSummary" class="weather-summary">
        {{ weatherStore.routeSummary }}
      </p>

      <div class="actions">
        <button @click="handleBooking" class="btn-primary" :disabled="bookingInProgress || ride.seats === 0">
          {{ bookingInProgress ? 'Réservation...' : 'Réserver ce trajet' }}
        </button>
        <button @click="goBack" class="btn-secondary">Retour</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import CityWeatherCard from '@/components/CityWeatherCard.vue'
import { useRidesStore } from '@/stores/rides'
import { useUserStore } from '@/stores/user'
import { useWeatherStore } from '@/stores/weather'

const route = useRoute()
const router = useRouter()

const ridesStore = useRidesStore()
const userStore = useUserStore()
const weatherStore = useWeatherStore()

const ride = ref(null)
const bookingInProgress = ref(false)

const refreshWeather = async () => {
  if (!ride.value) return
  await weatherStore.fetchRouteWeather(ride.value.from, ride.value.to)
}

const handleBooking = async () => {
  if (!userStore.currentUser) {
    router.push('/login')
    return
  }

  bookingInProgress.value = true
  try {
    await ridesStore.bookRide(ride.value.id, userStore.currentUser.uid)
    ride.value = await ridesStore.getRideById(ride.value.id)
    alert('Réservation confirmée.')
  } catch (err) {
    console.error('Booking error:', err)
    alert(ridesStore.error || 'La réservation a échoué.')
  } finally {
    bookingInProgress.value = false
  }
}

const goBack = () => router.back()

onMounted(async () => {
  const fetched = await ridesStore.getRideById(route.params.id)
  ride.value = fetched

  try {
    await weatherStore.fetchRouteWeather(ride.value.from, ride.value.to)
  } catch (error) {
    console.error('Weather error:', error)
  }
})
</script>

<style scoped>
.ride-detail-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.ride-detail-container {
  display: grid;
  gap: 16px;
}

.route-block {
  background: #fff;
  border-radius: 10px;
  padding: 16px;
}

.weather-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.weather-summary {
  background: #eef6ff;
  padding: 10px 12px;
  border-radius: 8px;
  color: #245;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 14px;
}

@media (max-width: 800px) {
  .weather-grid {
    grid-template-columns: 1fr;
  }
}
</style>
