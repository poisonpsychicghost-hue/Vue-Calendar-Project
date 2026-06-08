<script setup>
import { computed } from 'vue'
import { format, addMonths, subMonths } from 'date-fns'
import { useCalendarStore } from '../stores/calendarStore'
import { getMonthDays } from '../api/dateController'
import WeatherBanner from './WeatherBanner.vue'
import { todoClass, WEEKDAYS_LONG } from '../utils/calendarHelpers'
import './styles/themes.css'


const store = useCalendarStore()

const props = defineProps({
  theme: String
})

const emit = defineEmits(['update:view'])

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const monthDays = computed(() => getMonthDays(store.viewYear, store.viewMonth))

const monthName = computed(() => format(store.viewDate, 'MMMM'))

const yearOptions = Array.from({ length: 31 }, (_, i) => 2020 + i)


function prevMonth() {
  store.viewDate = subMonths(store.viewDate, 1)
}

function nextMonth() {
  store.viewDate = addMonths(store.viewDate, 1)
}

function updateMonth(newMonth) {
  const date = new Date(store.viewDate)
  date.setMonth(newMonth)
  store.viewDate = date
}

function updateYear(newYear) {
  const date = new Date(store.viewDate)
  date.setFullYear(newYear)
  store.viewDate = date
}

function goToDay(date) {
  store.viewDate = new Date(date)
  emit('update:view', 'day')
}
</script>

<template>
  <div :class="['monthly-view', theme]">

    <header :class="['month-header', theme]">
      <button @click="prevMonth">⬅️</button>

      <select :value="store.viewMonth" @change="updateMonth(Number($event.target.value))">
        <option v-for="m in 12" :key="m - 1" :value="m - 1">
            {{ format(new Date(store.viewYear, m - 1, 1), 'MMMM') }}
        </option>
      </select>

      <span>{{ monthName }} {{ store.viewYear }}</span>

      <select :value="store.viewYear" @change="updateYear(Number($event.target.value))">
        <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
      </select>

      <button @click="nextMonth">➡️</button>
    </header>

    <div class="grid">
      <div
        :class="['weekday', theme]"
        v-for="d in weekdays"
        :key="d"
      >
        {{ d }}
      </div>

      <div
        v-for="day in monthDays"
        :key="day.dateStr"
        :class="[
          'day-cell',
          theme,
          { today: day.isToday },
          { 'other-month': day.monthNum !== store.viewMonth },
          todoClass(day.dateStr)
        ]"
        @click="goToDay(day.dateObj)"
      >
        {{ day.dayNum }}
        <WeatherBanner
          v-if="day.monthNum === store.viewMonth"
          :date-str="day.dateStr"
          mode="monthly"
        />
      </div>
    </div>

  </div>
</template>

