<template>
    <div :class="['monthly-view', theme]">

        <!-- Month Year Nav Controls-->
        <header :class="['month-header', theme]">
            <button @click="prevMonth">⬅️</button>
            <select :value="props.month" @change="updateMonth(Number($event.target.value))">
  <option v-for="m in 12" :key="m-1" :value="m-1">{{ monthNameList[m-1] }}</option>
            </select>
            <span>{{ monthName }} {{ props.year }}</span>
            <select :value="props.year" @change="updateYear(Number($event.target.value))">
                <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
            </select>
            <button @click="nextMonth">➡️</button>
        </header>
        
        <!-- Calendar Grid-->
        <div class="grid">
  <div :class="['weekday', theme]" v-for="d in weekdays" :key="d">{{ d }}</div>
  <div
    v-for="day in monthDays"
    :key="day.dateStr"
    :class="['day-cell', theme, {today: day.isToday, 'other-month': day.monthNum !== props.month }]"
  >
    {{ day.dayNum }}
    <!-- Weather icon, ToDo count, etc. -->
  </div>
</div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getMonthDays } from '../api/dateController'
import { addMonths, subMonths } from 'date-fns'


const props = defineProps(['theme', 'month', 'year']);
const emit = defineEmits(['update:month', 'update:year']);
const year = ref(new Date().getFullYear());
const month = ref(new Date().getMonth()); //Jan = 0 - Dec = 11
const monthDays = computed(() => getMonthDays(props.year, props.month));
const monthNameList = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 
    'September', 'October', 'November', 'December'
]
const monthName = computed(() => monthNameList[props.month])
const yearOptions = Array.from({ length: 31}, (_, i) => 2020 + i)

function prevMonth() {
  const date = subMonths(new Date(props.year, props.month, 1), 1)
  props.year = date.getFullYear()
  props.month = date.getMonth()
}

function nextMonth() {
  const date = addMonths(new Date(props.year, props.month, 1), 1)
  props.year = date.getFullYear()
  props.month = date.getMonth()
}

function updateMonth(newMonth) {
    emit('update:month', newMonth)
}

function updateYear(newYear) {
    emit('update:year', newYear)
}

</script>

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
    font-size: 1rem;
    margin-bottom: .5rem;
    padding: 0.5rem 0;
    border:  2px inset #242c2e;
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
}
.day-cell.dark.today {
    background: #548a7a;
    min-height: 56px;
    border-radius: 0.5rem;
    border: 2px solid #dfc241;
    text-align: right;
    padding: 0.5rem;
    color: #6640b2;
    font-size: 1rem;
    font-style: bolder;
}
.day-cell.light.today {
    background: #548a7a;
    min-height: 56px;
    border-radius: 0.5rem;
    border: 2px solid #dfc241;
    text-align: right;
    padding: 0.5rem;
    color: #3f0c6c;
    font-size: 1rem;
    font-style: bolder;
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