<template>
  <article class="weather-card">
    <header class="weather-header">
      <h3>{{ title }}</h3>
      <button class="refresh-btn" @click="$emit('refresh')" :disabled="loading">
        {{ loading ? '...' : '↻' }}
      </button>
    </header>

    <p class="city-name">{{ city || 'Ville inconnue' }}</p>

    <p v-if="loading" class="weather-muted">Chargement météo...</p>
    <p v-else-if="error" class="weather-error">{{ error }}</p>

    <div v-else-if="weather" class="weather-content">
      <p class="weather-main">{{ weather.summary }}</p>
      <p class="weather-temp">{{ weather.temp }}°C</p>
      <p class="weather-wind">Vent: {{ weather.wind }} km/h</p>
    </div>

    <p v-else class="weather-muted">Aucune donnée météo.</p>
  </article>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Météo'
  },
  city: {
    type: String,
    default: ''
  },
  weather: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['refresh'])
</script>

<style scoped>
.weather-card {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e9ecef;
  padding: 14px;
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.refresh-btn {
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
}

.city-name {
  font-weight: 600;
  margin-bottom: 6px;
}

.weather-main {
  margin-bottom: 4px;
}

.weather-temp {
  font-size: 1.1rem;
  font-weight: 700;
}

.weather-wind {
  color: #555;
}

.weather-muted {
  color: #6c757d;
}

.weather-error {
  color: #d93025;
}
</style>
