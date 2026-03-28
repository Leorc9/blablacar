<template>
  <div class="booked-rides-page gradient-bg">
    <div class="container">
      <div class="page-header card gradient-primary">
        <div class="header-content">
          <h1>🎫 Mes réservations</h1>
          <p class="subtitle">Consultez vos trajets réservés</p>
        </div>
      </div>

      <LoadingSpinner v-if="ridesStore.loading" message="Chargement de vos réservations..." />

      <div v-else-if="ridesStore.bookedRides.length === 0" class="no-bookings card">
        <div class="no-bookings-icon">🎫</div>
        <h2>Aucune réservation</h2>
        <p>Vous n'avez pas encore réservé de trajet</p>
        <router-link to="/search-rides" class="btn btn-primary btn-lg">
          🔍 Rechercher un trajet
        </router-link>
      </div>

      <div v-else class="bookings-container">
        <div class="stats-card card">
          <div class="stat-item">
            <span class="stat-icon">🎫</span>
            <div class="stat-info">
              <span class="stat-value">{{ ridesStore.bookedRides.length }}</span>
              <span class="stat-label">Réservation(s)</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-icon">💰</span>
            <div class="stat-info">
              <span class="stat-value">{{ totalSpent }}€</span>
              <span class="stat-label">Total dépensé</span>
            </div>
          </div>
        </div>

        <div class="bookings-grid">
          <div v-for="booking in ridesStore.bookedRides" :key="booking.id" class="booking-card card">
            <div class="booking-header">
              <span class="status-badge">✅ {{ booking.status }}</span>
              <span class="booking-date">{{ formatDate(booking.bookedAt) }}</span>
            </div>

            <div class="route-info">
              <div class="city">
                <span class="city-label">Départ</span>
                <h3>{{ booking.from }}</h3>
              </div>
              <div class="arrow">→</div>
              <div class="city">
                <span class="city-label">Arrivée</span>
                <h3>{{ booking.to }}</h3>
              </div>
            </div>

            <div class="booking-details">
              <div class="detail-item">
                <span class="detail-icon">📅</span>
                <span>{{ formatDate(booking.date) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">🕐</span>
                <span>{{ booking.time }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">💰</span>
                <span>{{ booking.price }}€</span>
              </div>
            </div>

            <div class="booking-actions">
              <router-link :to="`/ride/${booking.rideId}`" class="btn btn-secondary">
                👁️ Voir le trajet
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRidesStore } from '@/stores/rides'
import { useUserStore } from '@/stores/user'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const ridesStore = useRidesStore()
const userStore = useUserStore()

const totalSpent = computed(() => {
  return ridesStore.bookedRides.reduce((sum, booking) => sum + (booking.price || 0), 0)
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(() => {
  if (userStore.currentUser) {
    ridesStore.fetchBookedRides(userStore.currentUser.uid)
  }
})
</script>

<style scoped>
.booked-rides-page {
  min-height: 100vh;
  padding: var(--spacing-2xl) 0;
}

.page-header {
  text-align: center;
  padding: var(--spacing-2xl);
  margin-bottom: var(--spacing-2xl);
}

.page-header h1 {
  color: white;
  font-size: var(--font-size-4xl);
  margin-bottom: var(--spacing-sm);
}

.subtitle {
  color: white;
  font-size: var(--font-size-lg);
  opacity: 0.95;
}

.no-bookings {
  text-align: center;
  padding: var(--spacing-3xl);
}

.no-bookings-icon {
  font-size: 6rem;
  margin-bottom: var(--spacing-lg);
}

.no-bookings h2 {
  color: var(--text-primary);
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-md);
}

.no-bookings p {
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-2xl);
}

.bookings-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.stats-card {
  display: flex;
  gap: var(--spacing-2xl);
  padding: var(--spacing-xl);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  flex: 1;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.bookings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: var(--spacing-xl);
}

.booking-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  background: var(--success-light);
  color: var(--success);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  text-transform: capitalize;
}

.booking-date {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.route-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
}

.city {
  flex: 1;
  text-align: center;
}

.city-label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.city h3 {
  color: var(--primary);
  font-size: var(--font-size-xl);
}

.arrow {
  font-size: var(--font-size-3xl);
  color: var(--primary);
  padding: 0 var(--spacing-lg);
}

.booking-details {
  display: flex;
  justify-content: space-around;
  gap: var(--spacing-md);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

.detail-icon {
  font-size: var(--font-size-lg);
}

.booking-actions {
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-light);
}

@media (max-width: 768px) {
  .bookings-grid {
    grid-template-columns: 1fr;
  }

  .stats-card {
    flex-direction: column;
  }

  .route-info {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .arrow {
    transform: rotate(90deg);
  }

  .booking-details {
    flex-direction: column;
  }
}
</style>
