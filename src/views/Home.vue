<template>
  <div class="home-page gradient-bg">
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            Voyagez ensemble,<br>
            <span class="text-primary">économisez plus</span>
          </h1>
          <p class="hero-subtitle">
            La plateforme de covoiturage qui connecte conducteurs et passagers pour des trajets économiques et écologiques
          </p>
          <div class="hero-actions">
            <router-link to="/search-rides" class="btn btn-primary btn-lg">
              Rechercher un trajet
            </router-link>
            <router-link to="/create-ride" class="btn btn-secondary btn-lg">
              + Proposer un trajet
            </router-link>
          </div>
        </div>

        <div class="hero-image">
          <div class="car-icon">🚗</div>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2 class="text-center mb-xl">Pourquoi choisir BlaBlaCar ?</h2>
        
        <div class="features-grid">
          <div class="feature-card card">
            <div class="feature-icon"></div>
            <h3>Économique</h3>
            <p>Partagez les frais de route et réduisez vos dépenses de transport</p>
          </div>

          <div class="feature-card card">
            <div class="feature-icon"></div>
            <h3>Écologique</h3>
            <p>Réduisez votre empreinte carbone en partageant votre véhicule</p>
          </div>

          <div class="feature-card card">
            <div class="feature-icon"></div>
            <h3>Convivial</h3>
            <p>Rencontrez de nouvelles personnes et voyagez ensemble</p>
          </div>

          <div class="feature-card card">
            <div class="feature-icon"></div>
            <h3>Simple</h3>
            <p>Trouvez ou proposez un trajet en quelques clics</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-card card gradient-primary">
          <h2>Prêt à partir ?</h2>
          <p>Rejoignez des milliers de covoitureurs et commencez à voyager autrement</p>
          <div class="cta-buttons">
            <router-link v-if="!userStore.currentUser" to="/register" class="btn btn-light btn-lg">
              S'inscrire gratuitement
            </router-link>
            <router-link v-else to="/search-rides" class="btn btn-light btn-lg">
              Explorer les trajets
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.hero {
  padding: var(--spacing-3xl) 0;
}

.hero .container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--spacing-2xl);
  align-items: center;
}

.hero-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-2xl);
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.btn-lg {
  padding: var(--spacing-lg) var(--spacing-2xl);
  font-size: var(--font-size-lg);
}

.hero-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.car-icon {
  font-size: 15rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.features {
  padding: var(--spacing-3xl) 0;
  background: var(--bg-primary);
}

.features h2 {
  font-size: var(--font-size-3xl);
  color: var(--text-primary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-xl);
}

.feature-card {
  text-align: center;
  padding: var(--spacing-2xl);
}

.feature-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

.feature-card h3 {
  color: var(--primary);
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.cta-section {
  padding: var(--spacing-3xl) 0;
}

.cta-card {
  text-align: center;
  padding: var(--spacing-3xl);
}

.cta-card h2 {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-md);
}

.cta-card p {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-2xl);
  opacity: 0.95;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}

.btn-light {
  background: white;
  color: var(--primary);
}

.btn-light:hover {
  background: var(--bg-secondary);
  transform: translateY(-2px);
}

@media (max-width: 968px) {
  .hero .container {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: var(--font-size-3xl);
  }

  .car-icon {
    font-size: 8rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
