<script setup>
import { ref, onMounted, watch } from 'vue'
import { getWeather } from '../api/weather'

const props = defineProps({
  dateStr: String, // expects 'YYYY-MM-DD'
  location: { type: String, default: 'Atlanta,GA' },
  mode: { type: String, default: 'monthly'}
})

const weather = ref(null)

async function fetchWeather() {
  weather.value = await getWeather(props.dateStr, props.location)
}

// Fetch when created and when date changes
onMounted(fetchWeather)
watch(() => props.dateStr, fetchWeather)

</script>

<template>
  <div v-if="weather && mode === 'monthly'">
    <span>Avg: {{ Math.round(weather.avgtemp_f) }}°F</span>
    <img :src="weather.icon" alt="" v-if="weather.icon" />
  </div>
  <div v-else-if="weather && mode === 'weekly'">
    <span>{{ weather.condition }}</span>
    <img :src="weather.icon" alt="" v-if="weather.icon" />
    <span v-if="!isNaN(weather.temp_min_f) && !isNaN(weather.temp_max_f)">Temp: {{ Math.round(weather.temp_min_f) }} - {{ Math.round(weather.temp_max_f) }}°F</span>
    <span v-if="!isNaN(weather.humidity)">Humidity: {{ Math.round(weather.humidity) }}%</span>
    <span v-if="!isNaN(weather.daily_chance_of_rain)">Rain Chance: {{ Math.round(weather.daily_chance_of_rain) }}%</span>

  </div>
  <div v-else-if="weather && mode === 'daily'">
    <span v-if="weather.condition">{{ weather.condition }}</span>
    <img :src="weather.icon" alt="" v-if="weather.icon" />
    <span v-if="!isNaN(weather.temp_f)">Current Temp: {{ Math.round(weather.temp_f) }}°F</span>
    <span v-if="!isNaN(weather.feelslike_f)">Feels Like: {{ Math.round(weather.feelslike_f) }}°F</span>
    <span v-if="!isNaN(weather.humidity)">Humidity: {{ Math.round(weather.humidity) }}%</span>
    <span v-if="!isNaN(weather.precip_mm)">Rain (in mm): {{ Math.round(weather.precip_mm) }}mm</span>


  </div>
  <span v-else>Loading weather…</span>
</template>