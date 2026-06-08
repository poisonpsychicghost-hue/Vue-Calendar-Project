<script setup>
import { computed } from 'vue'
import { format, addMonths, subMonths } from 'date-fns'
import { useCalendarStore } from '../stores/calendarStore'
import { getMonthDays } from '../api/dateController'
import WeatherBanner from './WeatherBanner.vue'
import { todoClass, WEEKDAYS_LONG } from '../utils/calendarHelpers'



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

<style scoped>
.monthly-view.dark {
  background: var(--main-bg, #30335b);
  padding: 1rem;
  border-radius: 1rem;
}
.monthly-view.light {
  background: var(--main-bg, #5d5f7e);
  padding: 1rem;
  border-radius: 1rem;
}
.month-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0;
  border: 2px inset #242c2e;
}
.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}
.weekday.dark {
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
  color: #aa9deb;
  padding-bottom: 0.5rem;
}
.weekday.light {
  font-weight: bolder;
  font-size: 1.5rem;
  text-align: center;
  color: #351bb6;
  padding-bottom: 0.5rem;
}
.day-cell.dark {
  background: #343049;
  min-height: 56px;
  border-radius: 0.5rem;
  text-align: right;
  padding: 0.5rem;
  color: #dbc9ff;
  font-size: 1rem;
  box-shadow: 2px 4px #0002;
  cursor: pointer;
}
.day-cell.light {
  background: #776ea8;
  min-height: 56px;
  border-radius: 0.5rem;
  text-align: right;
  padding: 0.5rem;
  color: #3f0c6c;
  font-size: 1rem;
  box-shadow: 2px 4px #0002;
  cursor: pointer;
}
.day-cell.dark.today {
  background: #548a7a;
  border-radius: 0.25rem;
  border: 2px solid #aa7224;
  text-align: right;
  padding: 0.5rem;
  color: #dbc9ff;
  font-size: 1rem;
  font-weight: bold;
}
.day-cell.light.today {
  background: #548a7a;
  border-radius: 0.25rem;
  border: 2px solid #aa7224;
  text-align: right;
  padding: 0.5rem;
  color: #3f0c6c;
  font-size: 1rem;
  font-weight: bold;
}
.day-cell.other-month {
  opacity: 0.35;
}
.todo-low {
  border: 2px solid #27d217;
}
.todo-medium {
  border: 2px solid #dfc241;
}
.todo-high {
  border: 2px solid #db2a2a;
}
.year-select {
  margin-left: 1rem;
  padding: 0.2rem 0.5rem;
  font-size: 1rem;
  border-radius: 0.4rem;
  border: 1px solid #aaa;
  background: #232249;
  color: #f9f9f9;
}
</style>
