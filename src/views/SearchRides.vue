<template>
  <div class="search-page">
    <section class="search-header card">
      <h1>Rechercher un trajet</h1>
      <p>Trouvez rapidement un covoiturage adapté à votre itinéraire.</p>

      <RideFilters
        :initial-from="search.from"
        :initial-to="search.to"
        :loading="ridesStore.loading"
        @search="handleSearch"
        @reset="handleReset"
      />
    </section>

    <p v-if="ridesStore.error" class="feedback error">{{ ridesStore.error }}</p>

    <div v-if="ridesStore.loading" class="state-card card">Chargement des trajets...</div>
    <div v-else-if="searched && ridesStore.rides.length === 0" class="state-card card">
      Aucun trajet trouvé pour cette recherche.
    </div>

    <div v-else class="results">
      <div class="results-meta" v-if="ridesStore.rides.length">
        {{ ridesStore.rides.length }} résultat(s)
      </div>

      <RideCard v-for="ride in ridesStore.rides" :key="ride.id" :ride="ride">
        <template #actions>
          <router-link :to="`/ride/${ride.id}`" class="btn-details">Voir le détail</router-link>
        </template>
      </RideCard>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import RideCard from '@/components/RideCard.vue'
import RideFilters from '@/components/RideFilters.vue'
import { useRidesStore } from '@/stores/rides'

const ridesStore = useRidesStore()
const searched = ref(false)

const search = ref({
  from: '',
  to: ''
})

const handleSearch = async (payload) => {
  searched.value = true
  search.value = payload

  if (!payload.from && !payload.to) {
    await ridesStore.fetchRides()
    return
  }

  await ridesStore.searchRides(payload.from, payload.to)
}

const handleReset = async () => {
  searched.value = false
  search.value = { from: '', to: '' }
  ridesStore.clearError()
  await ridesStore.fetchRides()
}

onMounted(async () => {
  await ridesStore.fetchRides()
})
</script>

<style scoped>
.search-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 20px;
}

.card {
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
}

.search-header {
  display: grid;
  gap: 12px;
}

.search-header h1 {
  color: #0f172a;
  font-size: clamp(1.6rem, 2.8vw, 2.1rem);
}

.search-header p {
  color: #64748b;
  margin-bottom: 6px;
}

.feedback {
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 8px;
}

.results {
  margin-top: 18px;
  display: grid;
  gap: 14px;
}

.results-meta {
  color: #334155;
  font-weight: 600;
  margin: 2px 2px 6px;
}

.state-card {
  margin-top: 16px;
  color: #334155;
}

.error {
  color: #c62828;
  background: #fdecea;
  border: 1px solid #f5c2c7;
}

.btn-details {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  background: linear-gradient(135deg, #00aff5 0%, #0099dd 100%);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-details:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(0, 175, 245, 0.25);
}
</style>
