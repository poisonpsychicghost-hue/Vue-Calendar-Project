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
    <span>Avg: {{ Math.round(weather.temp) }}°F</span>
    <img :src="weather.icon" alt="" v-if="weather.icon" />
  </div>
  <div v-else-if="weather && mode === 'weekly'">
    <span>Avg: {{ Math.round(weather.temp) }}°F</span>
    <span>{{ weather.condition }}</span>
    <img :src="weather.icon" alt="" v-if="weather.icon" />
  </div>
  <div v-else-if="weather && mode === 'daily'">
    <span v-if="!isNaN(weather.temp_current)">Current Temp: {{ Math.round(weather.temp_current) }}°F</span>
    <span v-if="!isNaN(weather.temp_feels)">Feels Like: {{ Math.round(weather.temp_feels) }}°F</span>
    <span>{{ weather.condition }}</span>
    <img :src="weather.icon" alt="" v-if="weather.icon" />
  </div>
  <span v-else>Loading weather…</span>
</template>