<script setup>
import { isToday as isTodayfn, parseISO } from 'date-fns'
import { computed, onMounted, ref, watch } from 'vue'
import { getWeather } from '../api/weather'
import { useCalendarStore } from '../stores/calendarStore.js'


const store = useCalendarStore()

const props = defineProps({
  dateStr: String, // expects 'YYYY-MM-DD'
  location: { type: String, default: 'Atlanta,GA' },
  mode: { type: String, default: 'monthly'}
})

const weather = ref(null)
const isToday = computed(() => isTodayfn(parseISO(props.dateStr)))

async function fetchWeather() {
  weather.value = await getWeather(props.dateStr, props.location)
}

// Fetch when created and when date changes
onMounted(fetchWeather)
watch(() => props.dateStr, fetchWeather)

</script>

<template>
  <div v-if="weather && mode === 'monthly'">
    <span v-if="!isNaN(weather.avgtemp_f)">Avg: {{ store.unit === 'f' ? Math.round(weather.avgtemp_f) + '°F' : Math.round(weather.avgtemp_c) + '°C' }}</span>
    
    <span v-else-if="isToday && weather.feelslike !== null">
      Currently: {{ store.unit === 'f' ? Math.round(weather.temp_f) + '°F' : Math.round(weather.temp_c) + '°C' }}
    </span>
    <img :src="weather.icon" alt="" v-if="weather.icon" />
  </div>
  <div v-else-if="weather && mode === 'weekly'">
    <span>{{ weather.condition }}</span>
    <img :src="weather.icon" alt="" v-if="weather.icon" />

    <span v-if="isToday && weather.temp_f !== null">
      Current: {{ store.unit === 'f' ? Math.round(weather.temp_f) + '°F' : Math.round(weather.temp_c) + '°C' }}
    </span>

    <span v-else-if="!isNaN(weather.temp_min_f) && !isNaN(weather.temp_max_f)">
      Temp: {{ store.unit === 'f' ? Math.round(weather.temp_min_f) + '°F' : Math.round(weather.temp_min_c) + '°C' }} - {{ store.unit === 'f' ? Math.round(weather.temp_max_f) + '°F' : Math.round(weather.temp_max_c) + '°C' }}
    </span>

    <span v-if="isToday && weather.humidity !== null">
      Humidity: {{ weather.humidity }}%
    </span>

    <span v-else-if="!isNaN(weather.humidity)">
      Humidity: {{ Math.round(weather.humidity) }}%
    </span>

    <span v-if="isToday && weather.precip_mm !== null">
      Rain (In mm): {{ weather.precip_mm }}mm
    </span>

    <span v-else-if="!isNaN(weather.daily_chance_of_rain)">
      Rain Chance: {{ Math.round(weather.daily_chance_of_rain) }}%
    </span>

  </div>
  <div v-else-if="weather && mode === 'daily'">
    <span v-if="weather.condition">{{ weather.condition }}</span>
    <img :src="weather.icon" alt="" v-if="weather.icon" />
    <span v-if="!isNaN(weather.temp_f)">Current Temp: {{ store.unit === 'f' ? Math.round(weather.temp_f) + '°F' : Math.round(weather.temp_c) + '°C' }}</span>
    <span v-else-if="weather.temp_f !== null">
      Avg Temp: {{ store.unit === 'f' ? Math.round(weather.avgtemp_f) + '°F' : Math.round(weather.avgtemp_c) + '°C' }}
    </span>
    
    <span v-if=" isToday && !isNaN(weather.feelslike_f)">
      Feels Like: {{ Math.round(weather.feelslike_f) }}°F

    </span>
    <span v-else-if="weather.temp_min_f !== null && weather.temp_max_f !== null">
      Min-Max: {{ store.unit === 'f' ? Math.round(weather.temp_min_f) + '°F' : Math.round(weather.temp_min_c) + '°C' }} - {{ store.unit === 'f' ? Math.round(weather.temp_max_f) + '°F' : Math.round(weather.temp_max_c) + '°C' }}
    </span>
    <span v-if="isToday && !isNaN(weather.humidity)">Humidity: {{ Math.round(weather.humidity) }}%</span>
    <span v-if="isToday && !isNaN(weather.precip_mm)">Rain (in mm): {{ Math.round(weather.precip_mm) }}mm</span>


  </div>
  <span v-else>Loading weather…</span>
</template>