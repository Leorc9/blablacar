<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="logo">
        <span class="logo-icon">🚗</span>
        <span class="logo-text">BlaBlaCar</span>
      </router-link>

      <div class="nav-links">
        <template v-if="userStore.currentUser">
          <router-link to="/search-rides" class="nav-link">Rechercher</router-link>
          <router-link to="/create-ride" class="nav-link">Publier</router-link>
          <router-link to="/my-rides" class="nav-link">Mes trajets</router-link>
          <router-link to="/booked-rides" class="nav-link">Mes réservations</router-link>
          <router-link to="/profile" class="nav-link">Profil</router-link>
          <button @click="handleLogout" class="btn-logout">Déconnexion</button>
        </template>
        <template v-else>
          <router-link to="/search-rides" class="nav-link">Rechercher</router-link>
          <router-link to="/login" class="btn-login">Connexion</router-link>
          <router-link to="/register" class="btn-register">Inscription</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = async () => {
  try {
    await userStore.logout()
    router.push('/')
  } catch (err) {
    console.error('Logout error:', err)
  }
}
</script>

<style scoped>
.navbar {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  font-size: 24px;
  font-weight: bold;
  color: #00aff5;
}

.logo-icon {
  font-size: 28px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #00aff5;
}

.btn-login,
.btn-logout {
  padding: 8px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  border: 2px solid #00aff5;
  background-color: white;
  color: #00aff5;
  cursor: pointer;
}

.btn-login:hover,
.btn-logout:hover {
  background-color: #00aff5;
  color: white;
}

.btn-register {
  padding: 8px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  background-color: #00aff5;
  color: white;
}

.btn-register:hover {
  background-color: #0099dd;
}
</style>
