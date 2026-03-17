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
          🔍 {{ ridesStore.loading ? 'Recherche...' : 'Rechercher' }}
        </button>
      </form>

      <div class="search-tips">
        <p>Astuce : Laissez un champ vide pour voir tous les trajets disponibles</p>
      </div>
    </div>

    <div v-if="ridesStore.loading" class="loading">
      <LoadingSpinner message="Recherche en cours..." />
    </div>

    <div v-else-if="ridesStore.rides.length === 0 && searched" class="no-results">
      <div class="no-results-icon"></div>
      <p>Aucun trajet trouvé pour cette recherche.</p>
      <p class="suggestion">Essayez d'élargir votre recherche ou vérifiez l'orthographe des villes.</p>
    </div>

    <div v-else-if="ridesStore.rides.length > 0" class="rides-list">
      <div class="results-header">
        <h2>{{ ridesStore.rides.length }} trajet(s) trouvé(s)</h2>
        <p>Sélectionnez un trajet pour voir les détails</p>
      </div>
      <RideCard 
        v-for="ride in ridesStore.rides" 
        :key="ride.id" 
        :ride="ride"
      >
        <template #actions>
          <button class="btn-details">Voir les détails</button>
        </template>
      </RideCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRidesStore } from '@/stores/rides'
import RideCard from '@/components/RideCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const ridesStore = useRidesStore()
const searched = ref(false)

const searchForm = ref({
  from: '',
  to: ''
})

const handleSearch = async () => {
  searched.value = true
  if (searchForm.value.from || searchForm.value.to) {
    await ridesStore.searchRides(searchForm.value.from, searchForm.value.to)
  } else {
    await ridesStore.fetchRides()
  }
}

onMounted(() => {
  ridesStore.fetchRides()
  searched.value = true
})
</script>

<style scoped>
.search-rides-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.search-container {
  background: linear-gradient(135deg, #00aff5 0%, #0099dd 100%);
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 175, 245, 0.2);
  margin-bottom: 40px;
  color: white;
}

h1 {
  color: white;
  margin-bottom: 30px;
  text-align: center;
  font-size: 2rem;
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
  font-weight: 600;
  color: white;
  font-size: 1.1rem;
}

input {
  padding: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.95);
}

input:focus {
  outline: none;
  border-color: white;
  background: white;
}

.btn-primary {
  background-color: white;
  color: #00aff5;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.search-tips {
  margin-top: 20px;
  text-align: center;
  opacity: 0.9;
}

.search-tips p {
  font-size: 0.95rem;
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.no-results {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.no-results p {
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.suggestion {
  color: #666;
  font-size: 1rem;
}

.rides-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.results-header {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

.results-header h2 {
  color: #00aff5;
  margin-bottom: 5px;
  font-size: 1.5rem;
}

.results-header p {
  color: #666;
  font-size: 0.95rem;
}

.btn-details {
  background-color: #00aff5;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
  margin-top: 12px;
}

.btn-details:hover {
  background-color: #0099dd;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  h1 {
    font-size: 1.5rem;
  }
}
</style>