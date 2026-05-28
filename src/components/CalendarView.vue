<script setup>
import { ref, computed } from 'vue';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameYear, isSameWeek } from 'date-fns';
import MonthlyView from './MonthlyView.vue';
import WeeklyView from './WeeklyView.vue';
import DailyView from './DailyView.vue';

const props = defineProps(['theme']);
const currentView = ref('month'); // 'month', 'week', 'day'
const year = ref(new Date().getFullYear());
const month = ref(new Date().getMonth());

const weekOptions = computed(() => getWeeksOfYear(year.value))
const currentDate = ref(new Date());
const initialWeekIdx = computed(() => 
    weekOptions.value.findIndex(
        week => isSameWeek(currentDate.value, week.start, { weekStartsOn: 0 })
    )
) 
const selectedWeekIdx = ref(initialWeekIdx.value >= 0 ? initialWeekIdx.value: 0)


const getViewComponent = computed(() => {
    if (currentView.value === 'month') return MonthlyView
    if (currentView.value === 'week') return WeeklyView
    return DailyView
} 
);

const monthYearProps = computed(() => ({
  month: month.value,
  year: year.value,
  selectedWeekIdx: selectedWeekIdx.value,
  weekOptions: weekOptions.value,
  'onUpdate:month': val => month.value = val,
  'onUpdate:year': val => year.value = val,
  'onUpdate:selectedWeekIdx': idx => selectedWeekIdx.value = idx,
  currentDate: currentDate.value,
  onUpdateCurrentDate: date => currentDate.value = new Date(date)

  
}));



function showMonth() { currentView.value = 'month' };
function showWeek() { currentView.value = 'week'}
function showDay() { currentView.value = 'day'}


function goToDay(date) {
  currentDate.value = new Date(date)
  currentView.value = 'date'
}

function getWeeksOfYear(year) {
  const weeks = []
  let start = startOfWeek(new Date(Number(year), 0, 1), { weekStartsOn: 0 })
  let weekNum = 1
  while (isSameYear(start, new Date(year, 6, 1)) || (weekNum === 1)) {
    const end = endOfWeek(start, { weekStartsOn: 0 })
    weeks.push({
      start,
      end,
      label: `Week ${weekNum}: ${format(start, 'MMM d')} - ${format(end, 'MMM d')}`
    })
    start = addWeeks(start, 1)
    weekNum++
    // If we pass Dec 31, we're done
    if (start.getFullYear() > year && weekNum > 2) break
  }
  return weeks
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
            :key="currentView"
            v-bind="monthYearProps"
            :current-date="currentDate.value"
            :onUpdateCurrentDate="date => currentDate.value = new Date(date)"
            @updateCurrentDate="goToDay"
            @update:view="showDay"
            />
        </transition>
        <!-- <MonthlyView :theme="theme" /> 
       <WeeklyView :theme="theme" /> -->
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
