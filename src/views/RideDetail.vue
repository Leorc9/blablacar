<template>
  <div class="ride-detail-page">
    <LoadingSpinner v-if="ridesStore.loading" message="Chargement..." />
    
    <div v-else-if="ride" class="ride-detail-container">
      <h1>Détails du trajet</h1>

      <div class="ride-main-info">
        <div class="route">
          <div class="city-info">
            <span class="label">Départ</span>
            <h2>{{ ride.from }}</h2>
          </div>
          <div class="arrow-container">
            <span class="arrow">→</span>
          </div>
          <div class="city-info">
            <span class="label">Arrivée</span>
            <h2>{{ ride.to }}</h2>
          </div>
        </div>

        <div class="price-box">
          <span class="price">{{ ride.price }}€</span>
          <span class="per-person">par personne</span>
        </div>
      </div>

      <div class="ride-info-grid">
        <div class="info-card">
          <strong>Date</strong>
          <p>{{ formatDate(ride.date) }}</p>
        </div>

        <div class="info-card">
          <strong>Heure</strong>
          <p>{{ ride.time }}</p>
        </div>

        <div class="info-card">
          <strong>Places</strong>
          <p>{{ ride.seats }} disponibles</p>
        </div>
      </div>

      <div class="driver-section">
        <h3>Conducteur</h3>
        <div class="driver-info">
          <div class="driver-avatar">{{ ride.driverName.charAt(0) }}</div>
          <div>
            <p class="driver-name">{{ ride.driverName }}</p>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="btn-book">Réserver ce trajet</button>
        <button @click="goBack" class="btn-secondary">Retour</button>
      </div>
    </div>

    <div v-else class="error-message">
      <p>Trajet introuvable</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRidesStore } from '@/stores/rides'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const ridesStore = useRidesStore()
const ride = ref(null)

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const goBack = () => {
  router.back()
}

onMounted(async () => {
  const rideId = route.params.id
  const fetchedRide = await ridesStore.getRideById(rideId)
  ride.value = fetchedRide
})
</script>

<style scoped>
.ride-detail-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.ride-detail-container {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #00aff5;
  margin-bottom: 30px;
  text-align: center;
}

.ride-main-info {
  background: linear-gradient(135deg, #00aff5 0%, #0099dd 100%);
  padding: 40px;
  border-radius: 12px;
  margin-bottom: 30px;
  color: white;
}

.route {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.city-info {
  flex: 1;
  text-align: center;
}

.label {
  font-size: 0.9rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.city-info h2 {
  font-size: 2rem;
  margin-top: 8px;
  color: white;
}

.arrow-container {
  flex: 0 0 auto;
  padding: 0 20px;
}

.arrow {
  font-size: 3rem;
}

.price-box {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.price {
  font-size: 3rem;
  font-weight: bold;
  display: block;
}

.per-person {
  font-size: 1rem;
  opacity: 0.9;
}

.ride-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.info-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.info-card strong {
  display: block;
  margin-bottom: 10px;
  color: #333;
  font-size: 1.1rem;
}

.info-card p {
  color: #666;
  font-size: 1.1rem;
}

.driver-section {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.driver-section h3 {
  color: #333;
  margin-bottom: 20px;
}

.driver-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.driver-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #00aff5;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
}

.driver-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn-book {
  background-color: #00aff5;
  color: white;
  padding: 14px 40px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-book:hover {
  background-color: #0099dd;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
  padding: 14px 40px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.error-message {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 12px;
}

@media (max-width: 768px) {
  .route {
    flex-direction: column;
    gap: 20px;
  }

  .arrow-container {
    transform: rotate(90deg);
  }

  .ride-info-grid {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
