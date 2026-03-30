import axios from 'axios'

const API_URL = 'https://api.openweathermap.org/data/2.5/weather'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct'
const OPEN_METEO_GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const OPEN_METEO_WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const mapWeather = (data) => ({
  city: data.name,
  temp: Math.round(data.main.temp),
  summary: data.weather?.[0]?.description || 'n/a',
  wind: Math.round(data.wind?.speed ? data.wind.speed * 3.6 : 0)
})

const weatherCodeToFrench = (code) => {
  const map = {
    0: 'ensoleillé',
    1: 'principalement ensoleillé',
    2: 'partiellement nuageux',
    3: 'couvert',
    45: 'brouillard',
    48: 'brouillard givrant',
    51: 'bruine légère',
    53: 'bruine',
    55: 'bruine dense',
    61: 'pluie faible',
    63: 'pluie',
    65: 'pluie forte',
    71: 'neige faible',
    73: 'neige',
    75: 'neige forte',
    80: 'averses faibles',
    81: 'averses',
    82: 'averses fortes',
    95: 'orage',
    96: 'orage avec grêle',
    99: 'orage violent avec grêle'
  }

  return map[code] || 'conditions variables'
}

const fetchCityWeatherFromOpenMeteo = async (cityName) => {
  const geoResp = await axios.get(OPEN_METEO_GEO_URL, {
    params: {
      name: cityName,
      count: 1,
      language: 'fr',
      format: 'json'
    }
  })

  const first = geoResp.data?.results?.[0]
  if (!first) {
    throw new Error(`Ville introuvable: ${cityName}`)
  }

  const weatherResp = await axios.get(OPEN_METEO_WEATHER_URL, {
    params: {
      latitude: first.latitude,
      longitude: first.longitude,
      current: 'temperature_2m,weather_code,wind_speed_10m',
      wind_speed_unit: 'kmh',
      timezone: 'auto'
    }
  })

  const current = weatherResp.data?.current
  if (!current) {
    throw new Error('Météo indisponible pour le moment.')
  }

  return {
    city: first.name,
    temp: Math.round(current.temperature_2m),
    summary: weatherCodeToFrench(current.weather_code),
    wind: Math.round(current.wind_speed_10m || 0)
  }
}

const mapOpenWeatherError = (err) => {
  const status = err?.response?.status

  if (status === 401) {
    return 'Clé OpenWeather invalide ou non activée (erreur 401).'
  }

  if (status === 404) {
    return 'Ville introuvable sur OpenWeather.'
  }

  if (status === 429) {
    return 'Limite OpenWeather atteinte. Réessaie plus tard.'
  }

  return err?.message || 'Erreur OpenWeather.'
}

export const fetchCityWeather = async (cityName) => {
  if (!cityName) {
    throw new Error('Ville manquante.')
  }

  if (!API_KEY) {
    return fetchCityWeatherFromOpenMeteo(cityName)
  }

  try {
    const geoResp = await axios.get(GEO_URL, {
      params: {
        q: cityName,
        limit: 1,
        appid: API_KEY
      }
    })

    if (!geoResp.data?.length) {
      throw new Error(`Ville introuvable: ${cityName}`)
    }

    const { lat, lon } = geoResp.data[0]

    const weatherResp = await axios.get(API_URL, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'fr'
      }
    })

    return mapWeather(weatherResp.data)
  } catch (err) {
    const status = err?.response?.status

    if (status === 401) {
      return fetchCityWeatherFromOpenMeteo(cityName)
    }

    throw new Error(mapOpenWeatherError(err))
  }
}
