<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="navbar-logo">
        BlaBlaCar
      </router-link>
      
      <div class="navbar-menu">
        <router-link to="/" class="navbar-link">Accueil</router-link>
        <router-link to="/login" class="navbar-link">Connexion</router-link>
        <router-link to="/register" class="navbar-link">Inscription</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
// NavBar basique
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
</style>
