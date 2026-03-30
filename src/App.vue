<template>
  <div id="app">
    <NavBar />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()

onMounted(() => {
  // Initialize auth state
  userStore.initAuth()
})
</script>

<style>
@import './assets/base.css';
@import './assets/main.css';
@import './assets/modern.css';

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  width: 100%;
}

/* Page Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
}

::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-dark);
}

/* Print Styles */
@media print {
  .navbar {
    display: none;
  }
  
  .main-content {
    margin: 0;
    padding: 0;
  }
}

/* Dark Mode Support (future enhancement) */
@media (prefers-color-scheme: dark) {
  /* Ready for dark mode implementation */
}

/* Responsive Typography */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

@media (min-width: 1200px) {
  html {
    font-size: 16px;
  }
}

/* Performance Optimization */
* {
  -webkit-tap-highlight-color: transparent;
}

img {
  max-width: 100%;
  height: auto;
}

/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Focus Visible */
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

</style>
