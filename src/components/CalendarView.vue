<script setup>
import { computed } from 'vue'
import { format } from 'date-fns'
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

const viewDateStr = computed(() => format(store.viewDate, 'yyyy-MM-dd'))

function showMonth() { store.currentView = 'month' }
function showWeek()  { store.currentView = 'week' }
function showDay()   { store.currentView = 'day' }

function goToDay(date) {
  store.viewDate = new Date(date)
  store.currentView = 'day'
}

function importRecurring() {
  store.addRecurringsToTodos(viewDateStr.value)
}
</script>

<template>
  <div>
    <div class="calendar-toolbar">
      <div class="transition-tabs" :class="theme">
        <button
          :class="['tab', theme, { active: store.currentView === 'month' }]"
          @click="showMonth"
        >
          Month
        </button>
        <button
          :class="['tab', theme, { active: store.currentView === 'week' }]"
          @click="showWeek"
        >
          Week
        </button>
        <button
          :class="['tab', theme, { active: store.currentView === 'day' }]"
          @click="showDay"
        >
          Day
        </button>
      </div>

      <button class="import-recurring-btn" @click="importRecurring">
        ↺ Import Recurring
      </button>
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