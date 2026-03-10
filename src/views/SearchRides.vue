<template>
  <div class="search-rides-page">
    <div class="search-container">
      <h1>Rechercher un trajet</h1>

      <form @submit.prevent="handleSearch" class="search-form">
        <div class="form-row">
          <div class="form-group">
            <label for="from">Départ</label>
            <input 
              type="text" 
              id="from" 
              v-model="searchForm.from" 
              placeholder="Ville de départ"
            />
          </div>

          <div class="form-group">
            <label for="to">Arrivée</label>
            <input 
              type="text" 
              id="to" 
              v-model="searchForm.to" 
              placeholder="Ville d'arrivée"
            />
          </div>
        </div>

        <button type="submit" class="btn-primary" :disabled="ridesStore.loading">
          {{ ridesStore.loading ? 'Recherche...' : 'Rechercher' }}
        </button>
      </form>
    </div>

    <div v-if="ridesStore.loading" class="loading">
      <LoadingSpinner message="Recherche en cours..." />
    </div>

    <div v-else-if="ridesStore.rides.length === 0" class="no-results">
      <p>Aucun trajet trouvé. Essayez une autre recherche.</p>
    </div>

    <div v-else class="rides-list">
      <h2>{{ ridesStore.rides.length }} trajet(s) trouvé(s)</h2>
      <RideCard 
        v-for="ride in ridesStore.rides" 
        :key="ride.id" 
        :ride="ride"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRidesStore } from '@/stores/rides'
import RideCard from '@/components/RideCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const ridesStore = useRidesStore()

const searchForm = ref({
  from: '',
  to: ''
})

const handleSearch = async () => {
  if (searchForm.value.from || searchForm.value.to) {
    await ridesStore.searchRides(searchForm.value.from, searchForm.value.to)
  } else {
    await ridesStore.fetchRides()
  }
}

onMounted(() => {
  ridesStore.fetchRides()
})
</script>

<style scoped>
.search-rides-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.search-container {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

h1 {
  color: #00aff5;
  margin-bottom: 30px;
  text-align: center;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 500;
  color: #333;
}

input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #00aff5;
}

.btn-primary {
  background-color: #00aff5;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0099dd;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.no-results p {
  color: #666;
  font-size: 1.1rem;
}

.rides-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.rides-list h2 {
  color: #333;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
