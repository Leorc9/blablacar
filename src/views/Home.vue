<template>
  <div class="home-page gradient-bg">
    <section class="hero">
      <div class="hero-content card">
        <h1>Voyagez ensemble, économisez mieux</h1>
        <p>
          Plateforme de covoiturage pour publier, réserver et gérer vos trajets facilement.
        </p>

        <div class="hero-actions">
          <router-link to="/search-rides" class="btn btn-primary">Rechercher un trajet</router-link>
          <router-link to="/create-ride" class="btn btn-secondary">Publier un trajet</router-link>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="feature card">
        <h3>Météo au départ et à l'arrivée</h3>
        <p>Sur le détail d'un trajet, la météo OpenWeather vous aide à anticiper le déplacement.</p>
      </div>
      <div class="feature card">
        <h3>Réservations centralisées</h3>
        <p>Suivez vos réservations et vos publications dans des pages dédiées et lisibles.</p>
      </div>
      <div class="feature card">
        <h3>Interface claire et moderne</h3>
        <p>Navigation simple, responsive, et feedback utilisateur cohérent.</p>
      </div>
    </section>

    <section class="contact card">
      <h2>Contact rapide</h2>
      <form @submit.prevent="submitContact">
        <input v-model="contact.name" type="text" placeholder="Nom" required />
        <input v-model="contact.email" type="email" placeholder="Email" required />
        <textarea v-model="contact.message" placeholder="Message" required />

        <button class="btn btn-primary" type="submit" :disabled="sending">
          {{ sending ? 'Envoi en cours...' : 'Envoyer' }}
        </button>
      </form>

      <p v-if="success" class="success">Votre message a été envoyé.</p>
      <p v-if="error" class="error">{{ error }}</p>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { sendContactMessage } from '@/services/restApi'

const sending = ref(false)
const success = ref(false)
const error = ref('')

const contact = ref({
  name: '',
  email: '',
  message: ''
})

const submitContact = async () => {
  sending.value = true
  success.value = false
  error.value = ''

  try {
    await sendContactMessage(contact.value)
    success.value = true
    contact.value = { name: '', email: '', message: '' }
  } catch (err) {
    console.error(err)
    error.value = err?.message || 'Impossible d’envoyer le message pour le moment.'
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.home-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 20px;
  display: grid;
  gap: 24px;
}

.card {
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
}

.hero-content h1 {
  margin-bottom: 10px;
  color: #0f172a;
  font-size: clamp(1.8rem, 3vw, 2.5rem);
}

.hero-content p {
  color: #475569;
  font-size: 1.05rem;
}

.hero-actions {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.features {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.feature h3 {
  color: #0f172a;
  margin-bottom: 6px;
  font-size: 1.05rem;
}

.feature p {
  color: #64748b;
}

form {
  display: grid;
  gap: 10px;
}

input,
textarea,
button {
  padding: 10px;
}

.success {
  color: #2e7d32;
}

.error {
  color: #d93025;
}

@media (max-width: 900px) {
  .features {
    grid-template-columns: 1fr;
  }
}
</style>
