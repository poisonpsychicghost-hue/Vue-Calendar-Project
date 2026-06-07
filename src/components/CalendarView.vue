<script setup>
import { computed } from 'vue'
import { useCalendarStore } from '../stores/calendarStore'
import MonthlyView from './MonthlyView.vue'
import WeeklyView from './WeeklyView.vue'
import DailyView from './DailyView.vue'

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

<style scoped>
.transition-tabs.dark {
    display: inline-flex;
    justify-content: space-evenly;
    gap: .25rem;
    border-radius: .7rem;
    background: #343049;
    box-shadow: 5px 0 0 2px blur #000;
}
.transition-tabs.light {
    display: inline-flex;
    justify-content: space-evenly;
    gap: .25rem;
    border-radius: .7rem;
    background: #776ea8;
    box-shadow: 5px 0 0 2px blur #b8abab;
}
.tab.dark {
    color: #dbc9ff;
    min-width: 13rem;
    
}
.tab.light {
    color: #3f0c6c;
    min-width: 13rem;
}
.fade-enter-active, .fade-leave-active {
    opacity: 0.65;
    transition: opacity 0.25s;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0.12575;
    transition: opacity 0.25s;
}
</style>
