<template>
  <div class="create-ride-page">
    <div class="create-ride-container">
      <h1>Publier un trajet</h1>
      <p class="subtitle">Partagez votre trajet et réduisez vos frais de route</p>

      <div v-if="ridesStore.error" class="error-message">
        {{ ridesStore.error }}
      </div>

      <form @submit.prevent="handleSubmit" class="ride-form">
        <div class="form-row">
          <div class="form-group">
            <label for="from">Départ *</label>
            <input 
              type="text" 
              id="from" 
              v-model="formData.from" 
              required 
              placeholder="Ville de départ"
            />
          </div>

          <div class="form-group">
            <label for="to">Arrivée *</label>
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
            <label for="date">Date *</label>
            <input 
              type="date" 
              id="date" 
              v-model="formData.date" 
              required
              :min="minDate"
            />
          </div>

          <div class="form-group">
            <label for="time">Heure *</label>
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
            <label for="seats">Places disponibles *</label>
            <input 
              type="number" 
              id="seats" 
              v-model.number="formData.seats" 
              required
              min="1"
              max="8"
            />
            <small>Entre 1 et 8 places</small>
          </div>

          <div class="form-group">
            <label for="price">Prix par passager (€) *</label>
            <input 
              type="number" 
              id="price" 
              v-model.number="formData.price" 
              required
              min="1"
              step="0.5"
            />
            <small>Prix suggéré basé sur le carburant</small>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="ridesStore.loading">
            {{ ridesStore.loading ? 'Publication...' : 'Publier le trajet' }}
          </button>
          <button type="button" @click="goBack" class="btn-secondary">
            Annuler
          </button>
        </div>
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
  // Client-side validation
  if (formData.value.seats < 1 || formData.value.seats > 8) {
    alert('Le nombre de places doit être entre 1 et 8')
    return
  }

  if (formData.value.price < 1) {
    alert('Le prix doit être d\'au moins 1€')
    return
  }

  const confirmed = confirm(
    `Publier ce trajet ?\n\n` +
    `Trajet : ${formData.value.from} → ${formData.value.to}\n` +
    `Date : ${formData.value.date} à ${formData.value.time}\n` +
    `Places : ${formData.value.seats}\n` +
    `Prix : ${formData.value.price}€ par personne\n\n` +
    `Confirmer la publication ?`
  )

  if (!confirmed) return

  try {
    await ridesStore.createRide({
      ...formData.value,
      driverId: userStore.currentUser.uid,
      driverName: userStore.currentUser.name
    })
    alert('Trajet publié avec succès.')
    router.push('/my-rides')
  } catch (err) {
    console.error('Error creating ride:', err)
    alert(`Erreur lors de la publication :\n${ridesStore.error || err.message}`)
  }
}

const goBack = () => {
  if (confirm('Êtes-vous sûr de vouloir annuler ?\n\nLes informations saisies seront perdues.')) {
    router.back()
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
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #00aff5;
  margin-bottom: 10px;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
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
  font-weight: 600;
  color: #333;
}

input {
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #00aff5;
}

small {
  color: #666;
  font-size: 0.85rem;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.btn-primary {
  flex: 1;
  background-color: #00aff5;
  color: white;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0099dd;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 175, 245, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  flex: 0 0 auto;
  background-color: #f0f0f0;
  color: #333;
  padding: 16px 32px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
