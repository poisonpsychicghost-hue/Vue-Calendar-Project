<script setup>
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

<style scoped>
.weekly-view.dark {
  background: var(--main-bg, #30335b);
  border-radius: 1rem;
  padding: 1.5rem;
}
.weekly-view.light {
  background: var(--main-bg, #5d5f7e);
  border-radius: 1rem;
  padding: 1.5rem;
}
.week-header {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px inset #242c2e;
  gap: 2rem;
  margin-bottom: 1rem;
}

.week-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: .5rem;
}
.week-day.dark {
  background: #343049;
  color: #dbc9ff;
  min-height: 120px;
  border-radius: 0.7rem;
  padding: 0.8rem;
  box-shadow: 2px 8px #0002;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  word-break: break-word;
  overflow-wrap: anywhere;
}
.week-day.light {
  background: #776ea8;
  color: #3f0c6c;
  min-height: 120px;
  border-radius: 0.7rem;
  padding: 0.8rem;
  box-shadow: 2px 8px #0002;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: larger;
  word-break: break-word;
  overflow-wrap: anywhere;
}
.date-label.dark {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #aa9deb;
}
.date-label.light {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #351bb6;
}
.todo-list {
  margin: 0.25rem 0 0 0;
  padding: 0;
  list-style: none;
  font-size: 0.98rem;
}
.todolist li {
  padding: .1275rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 100%;
}
.weather-banner {
  margin-top: auto;
  font-size: 1.3rem;
}
</style>
