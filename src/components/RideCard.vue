<template>
  <div class="ride-card">
    <div class="ride-header">
      <div class="ride-route">
        <span class="city from">{{ ride.from }}</span>
        <span class="arrow">→</span>
        <span class="city to">{{ ride.to }}</span>
      </div>
      <div class="ride-price">{{ ride.price }}€</div>
    </div>

    <div class="ride-details">
      <div class="detail-item">
        <strong>Date :</strong> {{ formatDate(ride.date) }}
      </div>
      <div class="detail-item">
        <strong>Heure :</strong> {{ ride.time }}
      </div>
      <div class="detail-item">
        <strong>Places :</strong> {{ ride.seats }} disponibles
      </div>
    </div>

    <div class="ride-driver">
      <strong>Conducteur :</strong> {{ ride.driverName }}
    </div>

    <slot name="actions"></slot>
  </div>
</template>

<script setup>
defineProps({
  ride: {
    type: Object,
    required: true
  }
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.ride-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.ride-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.ride-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.ride-route {
  display: flex;
  align-items: center;
  gap: 12px;
}

.city {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.arrow {
  color: #00aff5;
  font-size: 1.5rem;
}

.ride-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #00aff5;
}

.ride-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.detail-item {
  color: #666;
}

.ride-driver {
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  color: #333;
}
</style>
