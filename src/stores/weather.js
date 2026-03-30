import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchCityWeather } from '@/services/openWeather'

export const useWeatherStore = defineStore('weather', () => {
  const departureWeather = ref(null)
  const arrivalWeather = ref(null)
  const loading = ref(false)
  const error = ref('')

  const hasWeather = computed(() => Boolean(departureWeather.value || arrivalWeather.value))
  const routeSummary = computed(() => {
    if (!departureWeather.value || !arrivalWeather.value) return ''
    return `${departureWeather.value.city}: ${departureWeather.value.temp}°C -> ${arrivalWeather.value.city}: ${arrivalWeather.value.temp}°C`
  })

  const clearWeather = () => {
    departureWeather.value = null
    arrivalWeather.value = null
    error.value = ''
  }

  const fetchRouteWeather = async (fromCity, toCity) => {
    loading.value = true
    error.value = ''

    try {
      const [fromData, toData] = await Promise.all([
        fetchCityWeather(fromCity),
        fetchCityWeather(toCity)
      ])

      departureWeather.value = fromData
      arrivalWeather.value = toData
    } catch (err) {
      error.value = err.message || 'Impossible de recuperer la meteo.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    departureWeather,
    arrivalWeather,
    loading,
    error,
    hasWeather,
    routeSummary,
    clearWeather,
    fetchRouteWeather
  }
})
