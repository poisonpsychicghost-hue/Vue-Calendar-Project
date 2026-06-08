<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { isToday as isTodayFn, parseISO } from 'date-fns'
import { getWeather } from '../api/weather'
import { useCalendarStore } from '../stores/calendarStore'

const store = useCalendarStore()

const props = defineProps({
  dateStr: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    default: 'monthly' // 'monthly' | 'weekly' | 'daily'
  }
})

const weather = ref(null)
const isLoading = ref(false)
const hasError = ref(false)

const isToday = computed(() => isTodayFn(parseISO(props.dateStr)))

async function fetchWeather() {
  isLoading.value = true
  hasError.value = false
  weather.value = null

  const result = await getWeather(props.dateStr, store.currentLocation)

  if (result === null) {
    hasError.value = true
  } else {
    weather.value = result
  }

  isLoading.value = false
}

// Refetch when date or active location changes
onMounted(fetchWeather)
watch(() => [props.dateStr, store.currentLocation], fetchWeather)

// --- Display helpers ---
// All temperature and data checks use !== null rather than isNaN,
// because weather.js uses null as the sentinel for missing data.

function tempDisplay(c, f) {
  if (store.unit === 'f') return f !== null ? `${Math.round(f)}°F` : null
  return c !== null ? `${Math.round(c)}°C` : null
}
</script>

<template>
  <div class="weather-banner">

    <!-- Loading state -->
    <span v-if="isLoading" class="weather-loading">...</span>

    <!-- Error state -->
    <span v-else-if="hasError" class="weather-error">Weather unavailable</span>

    <!-- No data (boundary date) -->
    <span v-else-if="weather && !weather.icon && weather.text" class="weather-note">
      {{ weather.text }}
    </span>

    <!-- Monthly mode -->
    <template v-else-if="weather && mode === 'monthly'">
      <span v-if="isToday && weather.temp_f !== null">
        {{ tempDisplay(weather.temp_c, weather.temp_f) }}
      </span>
      <span v-else-if="weather.avgtemp_f !== null">
        Avg: {{ tempDisplay(weather.avgtemp_c, weather.avgtemp_f) }}
      </span>
      <img
        v-if="weather.icon"
        :src="weather.icon"
        :alt="weather.text"
        class="weather-icon"
      />
    </template>

    <!-- Weekly mode -->
    <template v-else-if="weather && mode === 'weekly'">
      <img
        v-if="weather.icon"
        :src="weather.icon"
        :alt="weather.text"
        class="weather-icon"
      />
      <span v-if="isToday && weather.temp_f !== null">
        {{ tempDisplay(weather.temp_c, weather.temp_f) }}
      </span>
      <span v-else-if="weather.temp_min_f !== null && weather.temp_max_f !== null">
        {{ tempDisplay(weather.temp_min_c, weather.temp_min_f) }}
        –
        {{ tempDisplay(weather.temp_max_c, weather.temp_max_f) }}
      </span>
      <span v-if="weather.humidity !== null">
        {{ Math.round(weather.humidity) }}% humidity
      </span>
      <span v-if="isToday && weather.precip_mm !== null">
        {{ weather.precip_mm }}mm rain
      </span>
      <span v-else-if="weather.daily_chance_of_rain !== null">
        {{ Math.round(weather.daily_chance_of_rain) }}% chance of rain
      </span>
    </template>

    <!-- Daily mode -->
    <template v-else-if="weather && mode === 'daily'">
      <img
        v-if="weather.icon"
        :src="weather.icon"
        :alt="weather.text"
        class="weather-icon"
      />
      <span v-if="weather.text">{{ weather.text }}</span>
      <span v-if="isToday && weather.temp_f !== null">
        Current: {{ tempDisplay(weather.temp_c, weather.temp_f) }}
      </span>
      <span v-else-if="weather.avgtemp_f !== null">
        Avg: {{ tempDisplay(weather.avgtemp_c, weather.avgtemp_f) }}
      </span>
      <span v-if="isToday && weather.feelslike_f !== null">
        Feels like: {{ tempDisplay(weather.feelslike_c, weather.feelslike_f) }}
      </span>
      <span v-else-if="weather.temp_min_f !== null && weather.temp_max_f !== null">
        {{ tempDisplay(weather.temp_min_c, weather.temp_min_f) }}
        –
        {{ tempDisplay(weather.temp_max_c, weather.temp_max_f) }}
      </span>
      <span v-if="isToday && weather.humidity !== null">
        {{ Math.round(weather.humidity) }}% humidity
      </span>
      <span v-if="isToday && weather.precip_mm !== null">
        {{ weather.precip_mm }}mm rain
      </span>
    </template>

  </div>
</template>