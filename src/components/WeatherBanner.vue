<script setup>
import { ref, onMounted, watch } from 'vue'
import { getWeather } from '../api/weather'

const props = defineProps({
  dateStr: String, // expects 'YYYY-MM-DD'
  location: { type: String, default: 'Atlanta,GA' }
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
  <div class="weather-banner">
    <span v-if="weather">{{ weather.condition }} <img :src="weather.icon" alt="weather" v-if="weather.icon" /></span>
    <span v-else>Loading weather…</span>
  </div>
</template>