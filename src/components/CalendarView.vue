<script setup>
import { computed } from 'vue'
import { useCalendarStore } from '../stores/calendarStore'
import MonthlyView from './MonthlyView.vue'
import WeeklyView from './WeeklyView.vue'
import DailyView from './DailyView.vue'
import './styles/themes.css'

const store = useCalendarStore()

const props = defineProps({
  theme: String,
  tempUnit: String,
  location: String
})

const getViewComponent = computed(() => {
  if (store.currentView === 'month') return MonthlyView
  if (store.currentView === 'week') return WeeklyView
  return DailyView
})

function showMonth() { store.currentView = 'month' }
function showWeek() { store.currentView = 'week' }
function showDay() { store.currentView = 'day' }

function goToDay(date) {
  store.viewDate = new Date(date)
  store.currentView = 'day'
}
</script>

<template>
  <div>
    <div :class="['transition-tabs', theme]">
      <button :class="['tab', theme]" @click="showMonth">Month</button>
      <button :class="['tab', theme]" @click="showWeek">Week</button>
      <button :class="['tab', theme]" @click="showDay">Day</button>
    </div>

    <transition name="fade" mode="out-in">
      <component
        :is="getViewComponent"
        :theme="theme"
        :key="store.currentView"
        @update:view="showDay"
        @updateCurrentDate="goToDay"
      />
    </transition>
  </div>
</template>
