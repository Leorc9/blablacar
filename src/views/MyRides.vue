<template>
  <div class="my-rides-page">
    <div class="page-header">
      <div class="header-content">
        <h1>Mes trajets publiés</h1>
        <p class="subtitle">Gérez vos annonces de covoiturage</p>
      </div>
      <router-link to="/create-ride" class="btn-create">
        <span class="plus-icon">+</span>
        Publier un nouveau trajet
      </router-link>
    </div>

    <LoadingSpinner v-if="ridesStore.loading" message="Chargement de vos trajets..." />

    <div v-else-if="myRides.length === 0" class="no-rides">
      <div class="no-rides-icon" aria-hidden="true"></div>
      <h2>Aucun trajet publié</h2>
      <p>Commencez à partager vos trajets et gagnez de l'argent !</p>
      <router-link to="/create-ride" class="btn-primary">
        <span class="plus-icon">+</span>
        Publier mon premier trajet
      </router-link>
    </div>

    <div v-else class="rides-container">
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-number">{{ myRides.length }}</span>
          <span class="stat-label">Trajet(s) publié(s)</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ totalSeats }}</span>
          <span class="stat-label">Place(s) disponible(s)</span>
        </div>
      </div>

      <div class="rides-grid">
        <div v-for="ride in myRides" :key="ride.id" class="ride-card-wrapper">
          <RideCard :ride="ride">
            <template #actions>
              <div class="ride-actions">
                <router-link :to="`/ride/${ride.id}`" class="btn-view">
                  Voir
                </router-link>
                <button @click="handleDelete(ride.id)" class="btn-delete">
                  Supprimer
                </button>
              </div>
            </template>
          </RideCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRidesStore } from '@/stores/rides'
import { useUserStore } from '@/stores/user'
import RideCard from '@/components/RideCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const ridesStore = useRidesStore()
const userStore = useUserStore()

const myRides = computed(() => {
  return ridesStore.rides.filter(
    ride => ride.driverId === userStore.currentUser?.uid
  )
})

const totalSeats = computed(() => {
  return myRides.value.reduce((sum, ride) => sum + ride.seats, 0)
})

const handleDelete = async (rideId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?\n\nCette action est irréversible.')) {
    try {
      await ridesStore.deleteRide(rideId)
      alert('Trajet supprimé avec succès.')
    } catch (err) {
      console.error('Delete error:', err)
      alert('Erreur lors de la suppression.')
    }
  }
}

onMounted(() => {
  ridesStore.fetchRides()
})
</script>

<style scoped>
.my-rides-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(135deg, #00aff5 0%, #0099dd 100%);
  border-radius: 16px;
  color: white;
  flex-wrap: wrap;
  gap: 20px;
}

.header-content h1 {
  color: white;
  font-size: 2rem;
  margin-bottom: 8px;
}

.subtitle {
  opacity: 0.95;
  font-size: 1.1rem;
}

.btn-create {
  background-color: white;
  color: #00aff5;
  padding: 14px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.plus-icon {
  font-size: 1.3rem;
  font-weight: bold;
}

.no-rides {
  text-align: center;
  padding: 100px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.no-rides-icon {
  width: 84px;
  height: 84px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00aff5 0%, #0099dd 100%);
  opacity: 0.85;
  margin-bottom: 20px;
}

.no-rides h2 {
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.no-rides p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 40px;
}

.btn-primary {
  background-color: #00aff5;
  color: white;
  padding: 16px 36px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-primary:hover {
  background-color: #0099dd;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 175, 245, 0.3);
}

.rides-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.stats-bar {
  display: flex;
  gap: 20px;
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px 20px;
  border-left: 3px solid #00aff5;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #00aff5;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.rides-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 25px;
}

.ride-card-wrapper {
  transition: transform 0.2s;
}

.ride-card-wrapper:hover {
  transform: translateY(-4px);
}

.ride-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.btn-view {
  flex: 1;
  background-color: #00aff5;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-view:hover {
  background-color: #0099dd;
}

.btn-delete {
  flex: 1;
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn-delete:hover {
  background-color: #c82333;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .rides-grid {
    grid-template-columns: 1fr;
  }

  .stats-bar {
    flex-direction: column;
  }
}
</style>
