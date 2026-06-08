<script setup>
import './styles/themes.css'
import { computed } from 'vue'
import { format, addDays, subDays } from 'date-fns'
import { useCalendarStore } from '../stores/calendarStore'
import WeatherBanner from './WeatherBanner.vue'
import ToDoList from './ToDoList.vue'
import NoteField from './NoteField.vue'

const store = useCalendarStore()

const props = defineProps({
  theme: String
})

const dateStr = computed(() => format(store.viewDate, 'yyyy-MM-dd'))
const displayDate = computed(() => format(store.viewDate, 'EEEE, MMMM d, yyyy'))

function prevDay() {
  store.viewDate = subDays(store.viewDate, 1)
}

function nextDay() {
  store.viewDate = addDays(store.viewDate, 1)
}
</script>

<template>
  <div :class="['daily-view', theme]">
    <div :class="['daily-card', theme]">

      <header :class="['date-nav', theme]">
        <button @click="prevDay">⬅️</button>
        <span class="date-display">{{ displayDate }}</span>
        <button @click="nextDay">➡️</button>
      </header>

      <WeatherBanner :date-str="dateStr" mode="daily" />

      <div class="lower-block">
        <ToDoList :date-str="dateStr" :theme="theme" />
        <NoteField :date-str="dateStr" :theme="theme" />
      </div>

    </div>
  </div>
</template>

