<template>
    <div :class="['monthly-view', theme]">

        <!-- Month Year Nav Controls-->
        <header :class="['month-header', theme]">
            <button @click="prevMonth">⬅️</button>
            <select :value="store.viewMonth" @change="updateMonth(Number($event.target.value))">
  <option v-for="m in 12" :key="m-1" :value="m-1">{{ monthNameList[m-1] }}</option>
            </select>
            <span>{{ monthName }} {{ store.viewYear }}</span>
            <select :value="store.viewYear" @change="updateYear(Number($event.target.value))">
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
                    :class="[
                        'day-cell',
                        theme,
                        { today: day.isToday, 'other-month': day.monthNum !== store.viewMonth },
                        { 'todo-low': store.getTodos(day.dateStr).length === 1 },
                        { 'todo-medium': store.getTodos(day.dateStr).length > 1 && store.getTodos(day.dateStr).length < 5 },
                        { 'todo-high': store.getTodos(day.dateStr).length >= 5 }
                        ]"
                    @click="goToDay(day.dateObj)"
                    >
                    {{ day.dayNum }}
                </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getMonthDays } from '../api/dateController'
import { addMonths, subMonths } from 'date-fns'
import { useCalendarStore } from '../stores/calendarStore'

const store = useCalendarStore()
const props = defineProps(['theme']);
const emit = defineEmits(['update:view']);
const weekdays = ['Sunday', 'Monday', 'Teusday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const monthDays = computed(() => getMonthDays(store.viewYear, store.viewMonth));
const monthNameList = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 
    'September', 'October', 'November', 'December'
]
const monthName = computed(() => monthNameList[store.viewMonth])
const yearOptions = Array.from({ length: 31}, (_, i) => 2020 + i)

function prevMonth() {
    let date = new Date(store.viewDate)
    date.setMonth(date.getMonth() - 1)
    store.viewDate = date
}

function nextMonth() {
    let date = new Date(store.viewDate)
    date.setMonth(date.getMonth() + 1)
    store.viewDate = date
}

function updateMonth(newMonth) {
    let date = new Date(store.viewDate)
    date.setMonth(newMonth)
    store.viewDate = date
}

function updateYear(newYear) {
    let date = new Date(store.viewDate)
    date.setFullYear(newYear)
    store.viewDate = date
}


function goToDay(date) {
    store.viewDate = new Date(date)
    emit('update:view', 'day')
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
    border-radius: 0.25rem;
    border: 2px solid #aa7224;
    text-align: right;
    padding: 0.5rem;
    color: #6640b2;
    font-size: 1rem;
    font-style: bolder;
}
.day-cell.light.today {
    background: #548a7a;
    min-height: 56px;
    border-radius: 0.25rem;
    border: 2px solid #aa7224;
    text-align: right;
    padding: 0.5rem;
    color: #3f0c6c;
    font-size: 1rem;
    font-style: bolder;
}
.todo-low {
    border-radius: 0.5rem;
    border: 2px solid #27d217;
}
.todo-medium {
    border-radius: 0.5rem;
    border: 2px solid #dfc241;
}
.todo-high {
    border-radius: 0.5rem;
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