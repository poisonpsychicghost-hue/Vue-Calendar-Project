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
  <div :class="['weekday', theme]" v-for="d in weekdays" :key="d">{{ d }}</div>
  <div
    v-for="day in monthDays"
    :key="day.dateStr"
    :class="['day-cell', theme, {today: day.isToday, 'other-month': day.monthNum !== month.value }]"
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


const props = defineProps(['theme']);
const year = ref(new Date().getFullYear());
const month = ref(new Date().getMonth()); //Jan = 0 - Dec = 11
const monthDays = computed(() => getMonthDays(year.value, month.value));
const monthNameList = [
    {index: 0, name: 'January'}, 
    {index: 1, name: 'February'}, 
    {index: 2, name: 'March'}, 
    {index: 3, name: 'April'}, 
    {index: 4, name: 'May'},
    {index: 5, name: 'June'},
    {index: 6, name: 'July'},
    {index: 7, name: 'August'},
    {index: 8, name: 'September'},
    {index: 9, name: 'October'},
    {index: 10, name: 'November'},
    {index: 11, name: 'December'}

]
const monthName = computed(() => monthNameList[month.value].name)


function prevMonth() {
  const date = subMonths(new Date(year.value, month.value, 1), 1)
  year.value = date.getFullYear()
  month.value = date.getMonth()
}

function nextMonth() {
  const date = addMonths(new Date(year.value, month.value, 1), 1)
  year.value = date.getFullYear()
  month.value = date.getMonth()
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