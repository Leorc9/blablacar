<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="navbar-logo">
        BlaBlaCar
      </router-link>
      
      <div class="navbar-menu">
        <router-link to="/" class="navbar-link">Accueil</router-link>
        
        <template v-if="userStore.currentUser">
          <router-link to="/create-ride" class="navbar-link">Publier un trajet</router-link>
          <span class="user-name">{{ userStore.currentUser.name }}</span>
          <button @click="handleLogout" class="btn-logout">Déconnexion</button>
        </template>
        
        <template v-else>
          <router-link to="/login" class="navbar-link">Connexion</router-link>
          <router-link to="/register" class="navbar-link">Inscription</router-link>
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
  await userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background-color: #00aff5;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.navbar-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  gap: 20px;
  align-items: center;
}

.navbar-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.navbar-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.navbar-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.3);
}

.user-name {
  color: white;
  font-weight: 500;
}

.btn-logout {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-logout:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
