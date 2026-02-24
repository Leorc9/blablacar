<template>
  <div class="home">
    <div class="hero">
      <h1>Voyagez moins cher avec BlaBlaCar</h1>
      <p>Trouvez des trajets en covoiturage partout en France</p>
      
      <div v-if="!userStore.currentUser" class="cta-buttons">
        <router-link to="/register" class="btn btn-primary">S'inscrire</router-link>
        <router-link to="/login" class="btn btn-secondary">Se connecter</router-link>
      </div>
      
      <div v-else class="welcome-message">
        <h2>Bonjour {{ userStore.currentUser.name }} !</h2>
        <p>Prêt à partir en voyage ?</p>
      </div>
    </div>

    <div class="features">
      <div class="feature-card">
        <h3>🚗 Trouvez un trajet</h3>
        <p>Des milliers de trajets disponibles chaque jour</p>
      </div>
      
      <div class="feature-card">
        <h3>💰 Économisez</h3>
        <p>Partagez les frais de route avec d'autres voyageurs</p>
      </div>
      
      <div class="feature-card">
        <h3>🌍 Écologique</h3>
        <p>Réduisez votre empreinte carbone</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #00aff5 0%, #0099dd 100%);
  border-radius: 12px;
  color: white;
  margin-bottom: 60px;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 32px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background-color: white;
  color: #00aff5;
}

.btn-secondary {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.welcome-message {
  padding: 20px;
}

.welcome-message h2 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  padding: 20px 0;
}

.feature-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.feature-card h3 {
  color: #00aff5;
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}
</style>
