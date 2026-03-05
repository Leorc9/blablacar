<template>
  <div class="create-ride-page">
    <div class="create-ride-container">
      <h1>Publier un trajet</h1>

      <form @submit.prevent="handleSubmit" class="ride-form">
        <div class="form-row">
          <div class="form-group">
            <label for="from">Départ</label>
            <input 
              type="text" 
              id="from" 
              v-model="formData.from" 
              required 
              placeholder="Ville de départ"
            />
          </div>

          <div class="form-group">
            <label for="to">Arrivée</label>
            <input 
              type="text" 
              id="to" 
              v-model="formData.to" 
              required 
              placeholder="Ville d'arrivée"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="date">Date</label>
            <input 
              type="date" 
              id="date" 
              v-model="formData.date" 
              required
              :min="minDate"
            />
          </div>

          <div class="form-group">
            <label for="time">Heure</label>
            <input 
              type="time" 
              id="time" 
              v-model="formData.time" 
              required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="seats">Places disponibles</label>
            <input 
              type="number" 
              id="seats" 
              v-model.number="formData.seats" 
              required
              min="1"
              max="8"
            />
          </div>

          <div class="form-group">
            <label for="price">Prix par passager (€)</label>
            <input 
              type="number" 
              id="price" 
              v-model.number="formData.price" 
              required
              min="1"
              step="0.5"
            />
          </div>
        </div>

        <button type="submit" class="btn-primary" :disabled="ridesStore.loading">
          {{ ridesStore.loading ? 'Publication...' : 'Publier le trajet' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRidesStore } from '@/stores/rides'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const ridesStore = useRidesStore()
const userStore = useUserStore()

const formData = ref({
  from: '',
  to: '',
  date: '',
  time: '',
  seats: 3,
  price: 10
})

const minDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const handleSubmit = async () => {
  try {
    await ridesStore.createRide({
      ...formData.value,
      driverId: userStore.currentUser.uid,
      driverName: userStore.currentUser.name
    })
    alert('Trajet publié avec succès !')
    router.push('/')
  } catch (err) {
    console.error('Error creating ride:', err)
    alert('Erreur lors de la publication')
  }
}
</script>

<style scoped>
.create-ride-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.create-ride-container {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #00aff5;
  margin-bottom: 30px;
  text-align: center;
}

.ride-form {
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
  margin-top: 10px;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0099dd;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
