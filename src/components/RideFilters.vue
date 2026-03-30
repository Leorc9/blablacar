<template>
  <form class="filters" @submit.prevent="onSearch">
    <input v-model="from" type="text" placeholder="Départ" />
    <input v-model="to" type="text" placeholder="Arrivée" />

    <button type="submit" :disabled="loading">Rechercher</button>
    <button type="button" class="secondary" @click="onReset" :disabled="loading">
      Réinitialiser
    </button>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  initialFrom: {
    type: String,
    default: ''
  },
  initialTo: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['search', 'reset'])

const from = ref(props.initialFrom)
const to = ref(props.initialTo)

watch(
  () => props.initialFrom,
  (value) => {
    from.value = value
  }
)

watch(
  () => props.initialTo,
  (value) => {
    to.value = value
  }
)

const onSearch = () => {
  emit('search', {
    from: from.value.trim(),
    to: to.value.trim()
  })
}

const onReset = () => {
  from.value = ''
  to.value = ''
  emit('reset')
}
</script>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: 1fr 1fr auto auto;
  gap: 10px;
}

.secondary {
  background: #f2f2f2;
}

@media (max-width: 700px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
