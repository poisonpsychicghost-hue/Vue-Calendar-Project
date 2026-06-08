<script setup>
import './styles/themes.css'
import { computed } from 'vue'
import { format, eachDayOfInterval, isToday, addWeeks, subWeeks } from 'date-fns'
import { useCalendarStore } from '../stores/calendarStore'
import { getWeeksOfYear } from '../api/dateController'
import WeatherBanner from './WeatherBanner.vue'

const store = useCalendarStore()

const props = defineProps({
  theme: String
})

const emit = defineEmits(['update:view'])

const weeks = computed(() => getWeeksOfYear(store.viewYear))
const selectedWeekIdx = computed(() => store.viewWeekIdx)
const selectedWeek = computed(() => weeks.value[selectedWeekIdx.value] || null)

const weekDays = computed(() => {
  if (!selectedWeek.value) return []
  const { start, end } = selectedWeek.value
  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) return []

  return eachDayOfInterval({ start, end }).map(date => ({
    dateObj: date,
    dateStr: format(date, 'yyyy-MM-dd'),
    dayName: format(date, 'EEE'),
    displayDate: format(date, 'd'),
    isToday: isToday(date),
    todos: store.getTodos(format(date, 'yyyy-MM-dd'))
  }))
})

const weekLabel = computed(() => {
  if (!weekDays.value.length) return ''
  const start = weekDays.value[0]?.dateObj
  const end = weekDays.value[6]?.dateObj
  if (!start || !end) return ''
  return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`
})

function prevWeek() {
  store.viewDate = subWeeks(store.viewDate, 1)
}

function nextWeek() {
  store.viewDate = addWeeks(store.viewDate, 1)
}

function selectWeek(evt) {
  const idx = Number(evt.target.value)
  const week = weeks.value[idx]
  if (week) store.viewDate = week.start
}

function goToDay(date) {
  store.viewDate = new Date(date)
  emit('update:view', 'day')
}
</script>

<template>
  <div :class="['weekly-view', theme]">

    <header :class="['week-header', theme]">
      <button @click="prevWeek">⬅️</button>
      <select :value="selectedWeekIdx" @change="selectWeek">
        <option v-for="(week, idx) in weeks" :key="idx" :value="idx">
          {{ week.label }}
        </option>
      </select>
      <button @click="nextWeek">➡️</button>
    </header>

    <div class="week-month-label">
      <h2>{{ format(store.viewDate, 'MMMM yyyy') }}</h2>
    </div>

    <div class="week-label">
      <span>{{ weekLabel }}</span>
    </div>

    <div class="week-grid">
      <div
        v-for="day in weekDays"
        :key="day.dateStr"
        :class="['week-day', theme, { today: day.isToday }]"
        @click="goToDay(day.dateObj)"
      >
        <div :class="['date-label', theme]">
          <span>{{ day.dayName }}</span>
          <span>{{ day.displayDate }}</span>
        </div>

        <ul class="todo-list" v-if="day.todos.length">
          <li v-for="(todo, idx) in day.todos.slice(0, 3)" :key="todo.title + idx">
            {{ todo.title }}
          </li>
        </ul>
        <p v-else class="todo-empty">—</p>

        <div class="weather-banner">
          <WeatherBanner :date-str="day.dateStr" mode="weekly" />
        </div>
      </div>
    </div>

  </div>
</template>

