<template>
    <div :class="['monthly-view', theme]">

        <!-- Month Year Nav Controls-->
        <header :class="['month-header', theme]">
            <!-- 
            ***Un-comment out after wiring to Date API***
            <select v-model="selectedYear" class="yearselect">
                <option 
                v-for="optionYear in yearOptions"
                :key="optionYear"
                :value="optionYear">
                {{ optionYear }}
            </option>
            </select>
            -->
            <button @click="prevMonth">⬅️</button>
            <span>{{ monthName }} {{ year }}</span>
            <button @click="nextMonth">➡️</button>
        </header>
        
        <!-- Calendar Grid-->
        <div class="grid">
            <div :class="['weekday', theme]" v-for="day in weekdays" :key="day">{{ day }}</div>
            <div :class="['day-cell', theme, {today: day.isToday}]" v-for="day in days" :key="day.date" >
                {{ day.number }}
                <!--Weather Icon and Color Tags-->
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['theme'])
const monthName = ref('May')
const year = ref(2026)
// const firstDay = new Date(year.value, monthIndex, 1)
// const firstWeekday = firstDay.getDay() // 0 (Sun) to 6 (Sat)
// Add empty slots to `days` before filling real days

//Dummy Placeholders — Replace with API Calendar Logic Later
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const days = [
    //Import from Calendar API to Replace DateBoard
    {date: '2026-05-01', number: 1, isToday: false},
    {date: '2026-05-02', number: 2, isToday: false},
    {date: '2026-05-03', number: 3, isToday: false},
    {date: '2026-05-04', number: 4, isToday: false},
    {date: '2026-05-05', number: 5, isToday: false},
    {date: '2026-05-06', number: 6, isToday: false},
    {date: '2026-05-07', number: 7, isToday: false},
    {date: '2026-05-08', number: 8, isToday: false},
    {date: '2026-05-09', number: 9, isToday: false},
    {date: '2026-05-10', number: 10, isToday: false},
    {date: '2026-05-11', number: 11, isToday: false},
    {date: '2026-05-12', number: 12, isToday: false},
    {date: '2026-05-13', number: 13, isToday: false},
    {date: '2026-05-14', number: 14, isToday: false},
    {date: '2026-05-15', number: 15, isToday: false},
    {date: '2026-05-16', number: 16, isToday: false},
    {date: '2026-05-17', number: 17, isToday: false},
    {date: '2026-05-18', number: 18, isToday: false},
    {date: '2026-05-19', number: 19, isToday: false},
    {date: '2026-05-20', number: 20, isToday: false},
    {date: '2026-05-21', number: 21, isToday: false},
    {date: '2026-05-22', number: 22, isToday: false},
    {date: '2026-05-23', number: 23, isToday: false},
    {date: '2026-05-24', number: 24, isToday: false},
    {date: '2026-05-25', number: 25, isToday: true},
    {date: '2026-05-26', number: 26, isToday: false},
    {date: '2026-05-27', number: 27, isToday: false},
    {date: '2026-05-28', number: 28, isToday: false},
    {date: '2026-05-29', number: 29, isToday: false},
    {date: '2026-05-30', number: 30, isToday: false},
    {date: '2026-05-31', number: 31, isToday: false}
]

function prevMonth() {
    //Fill in with API logic 
}

function nextMonth() {
    //Fill in with API logic
}

</script>

<style scoped>
.monthly-view.dark {
    background: var(--main-bg, #30335b);
    padding: 2rem;
    border-radius: 1rem;
}
.monthly-view.light {
    background: var(--main-bg, #5d5f7e);
    padding: 2rem;
    border-radius: 1rem;
}
.month-header {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.25rem;
    gap: 2rem;
    margin-bottom: 1.5rem;
    border: 20px 2px inset #9b952a;
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
}
.day-cell.light {
    background: #776ea8;
    min-height: 56px;
    border-radius: 0.5rem;
    text-align: right;
    padding: 0.5rem;
    color: #3f0c6c;
    font-size: 1rem;
}
.day-cell.dark.today {
    background: #548a7a;
    min-height: 56px;
    border-radius: 0.5rem;
    text-align: right;
    padding: 0.5rem;
    color: #6640b2;
    font-size: 1rem;
}
.day-cell.light.today {
    background: #548a7a;
    min-height: 56px;
    border-radius: 0.5rem;
    text-align: right;
    padding: 0.5rem;
    color: #3f0c6c;
    font-size: 1rem;
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