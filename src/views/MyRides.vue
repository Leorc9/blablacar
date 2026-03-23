<template>
  <div class="my-rides-page">
    <div class="page-header">
      <h1>Mes trajets publiés</h1>
      <router-link to="/create-ride" class="btn-create">
        + Publier un nouveau trajet
      </router-link>
    </div>

    <LoadingSpinner v-if="ridesStore.loading" message="Chargement..." />

    <div v-else-if="myRides.length === 0" class="no-rides">
      <p>Vous n'avez pas encore publié de trajet.</p>
      <router-link to="/create-ride" class="btn-primary">
        Publier mon premier trajet
      </router-link>
    </div>

    <div v-else class="rides-grid">
      <RideCard 
        v-for="ride in myRides" 
        :key="ride.id" 
        :ride="ride"
      >
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

const handleDelete = async (rideId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) {
    try {
      await ridesStore.deleteRide(rideId)
      alert('Trajet supprimé avec succès')
    } catch (err) {
      console.error('Delete error:', err)
      alert('Erreur lors de la suppression')
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
  flex-wrap: wrap;
  gap: 20px;
}

h1 {
  color: #00aff5;
  font-size: 2rem;
}

.btn-create {
  background-color: #00aff5;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn-create:hover {
  background-color: #0099dd;
}

.no-rides {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.no-rides p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

.btn-primary {
  background-color: #00aff5;
  color: white;
  padding: 14px 32px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  display: inline-block;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #0099dd;
}

.rides-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.ride-actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.btn-view {
  background-color: #00aff5;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
  text-decoration: none;
  display: inline-block;
}

.btn-view:hover {
  background-color: #0099dd;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
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
}
</style>
