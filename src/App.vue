<template>
  <div id="app">
    <NavBar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
</script>

<style>
#app {
  min-height: 100vh;
}

.main-content {
  padding: 20px;
}
</style>
