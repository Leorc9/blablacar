<template>
  <section class="booked-page">
    <h1>Mes réservations</h1>

    <p v-if="ridesStore.loading">Chargement...</p>
    <p v-if="ridesStore.error" class="error">{{ ridesStore.error }}</p>

    <div class="stats" v-if="!ridesStore.loading">
      <div class="card">
        <strong>Total réservations</strong>
        <p>{{ ridesStore.bookedCount }}</p>
      </div>
      <div class="card">
        <strong>Montant total</strong>
        <p>{{ ridesStore.bookedTotalPrice }} €</p>
      </div>
    </div>

    <ul class="list" v-if="ridesStore.bookedRides.length">
      <li v-for="booking in ridesStore.bookedRides" :key="booking.id" class="item">
        <strong>{{ booking.from }} → {{ booking.to }}</strong>
        <span>{{ booking.date }} à {{ booking.time }}</span>
        <span>{{ booking.price }} €</span>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRidesStore } from '@/stores/rides'
import { useUserStore } from '@/stores/user'

const ridesStore = useRidesStore()
const userStore = useUserStore()

onMounted(async () => {
  if (userStore.currentUser?.uid) {
    await ridesStore.fetchBookedRides(userStore.currentUser.uid)
  }
})
</script>

<style scoped>
.booked-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 16px 0;
}

.card {
  background: white;
  padding: 12px;
  border-radius: 8px;
}

.list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 10px;
}

.item {
  background: white;
  border-radius: 8px;
  padding: 12px;
  display: grid;
  gap: 4px;
}

.error {
  color: #c62828;
}
</style>
