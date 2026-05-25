<template>
    <div class="weekly-view">
        <!-- Week/Month/Year, with nav (add prev/next week buttons as needed) -->
        <header class="week-header">
            <button @click="prevWeek">⬅️</button>
            <span>Week of {{ weekLabel }}</span>
            <button @click="nextWeek">➡️</button>
            <!--Add in DropDown Menu with Week Select Choices By Year/Mo-->
        </header>
        <div class="week-grid">

            <div class="week-day" v-for="day in weekDays" :key="day.date">

                <div class="date-label">
                    <span>{{ day.dayName }}</span>
                </div>
                <!--Top Three TODOS-->
                <ul class="todo-list">
                    <li v-for="todo in day.todos.slice(0,3)" :key="todo.id">{{ todo.title }}</li>
                </ul>
                <!-- Weather Banner/Icons -->
                 <div class="weather-banner">⛅️</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

//Placeholder Weekdays...
const weekLabel = ref('May 19 - May 25, 2026');
const weekDays = [
    {dayName: 'Sun', displayDate: '19', date: '2026-05-19', todos: [{title: 'Watch Ivy'}, {title: 'Code Calendar'}], weather: null},
    {dayName: 'Mon', displayDate: '20', date: '2026-05-20', todos: [{title: 'Giant Fur Party While Carri is Gone'}], weather: null},
    {dayName: 'Teu', displayDate: '21', date: '2026-05-21', todos: [{title:'Nothing'}], weather: null},
    {dayName: 'Wed', displayDate: '22', date: '2026-05-22', todos: [{title: "Bang Carri's FoxBrains Out"}], weather: null},
    {dayName: 'Thu', displayDate: '23', date: '2026-05-23', todos: [], weather: null},
    {dayName: 'Fri', displayDate: '24', date: '2026-05-24', todos: [], weather: null},
    {dayName: 'Sat', displayDate: '25', date: '2026-05-25', todos: [], weather: null}
];


//Dummy Functions for Now
function prevWeek() {

}

function nextWeek() {

}

</script>

<style scoped>
.weekly-view {
  background: var(--main-bg, #284c60);
  border-radius: 1rem;
  padding: 1.5rem;
}
.week-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1rem;
}
.week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
}
.week-day {
  background: #282046;
  color: #c0a3f9;
  min-height: 120px;
  border-radius: 0.7rem;
  padding: 0.8rem;
  box-shadow: 0 2px 8px #0002;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.date-label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #f9f1be;
}
.todo-list {
  margin: 0.25rem 0 0 0;
  padding: 0;
  list-style: none;
  font-size: 0.98rem;
}
li {
    max-width: 50%;
    padding: .1275rem;
    text-overflow: clip;

}
.weather-banner {
  margin-top: auto;
  font-size: 1.3rem;
}
</style>
