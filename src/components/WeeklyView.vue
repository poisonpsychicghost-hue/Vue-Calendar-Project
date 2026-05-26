<script setup>
import { ref } from 'vue'


const props = defineProps(['theme'])

//Placeholder weekDays...
const weekLabel = ref('May 19 - May 25, 2026');
const weekDays = [
    {dayName: 'Sun', displayDate: '19', date: '2026-05-19', todos: [{title: 'Watch Ivy'}, {title: 'Code Calendar'}], weather: null},
    {dayName: 'Mon', displayDate: '20', date: '2026-05-20', todos: [{title: 'Party W Carri'}], weather: null},
    {dayName: 'Teu', displayDate: '21', date: '2026-05-21', todos: [{title:'Nothing'}], weather: null},
    {dayName: 'Wed', displayDate: '22', date: '2026-05-22', todos: [{title: "Hang W/ Carri"}], weather: null},
    {dayName: 'Thu', displayDate: '23', date: '2026-05-23', todos: [{title: "Disco Party "}], weather: null},
    {dayName: 'Fri', displayDate: '24', date: '2026-05-24', todos: [], weather: null},
    {dayName: 'Sat', displayDate: '25', date: '2026-05-25', todos: [], weather: null}
];


//Dummy Functions for Now
function prevWeek() {

}

function nextWeek() {

}

</script>

<template>
    <div :class="['weekly-view', theme]">
        <!-- Week/Month/Year, with nav (add prev/next week buttons as needed) -->
        <header class="week-header">
            <button @click="prevWeek">⬅️</button>
            <span>Week of {{ weekLabel }}</span>
            <button @click="nextWeek">➡️</button>
            <!--Add in DropDown Menu with Week Select Choices By Year/Mo-->
        </header>
        <div class="week-grid">

            <div :class="['week-day', theme]" v-for="day in weekDays" :key="day.date">

                <div :class="['date-label', theme]">
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

<style scoped>
.weekly-view.dark {
  background: var(--main-bg, #30335b);
  border-radius: 1rem;
  padding: 1.5rem;
}
.weekly-view.light {
  background: var(--main-bg, #5d5f7e);
  border-radius: 1rem;
  padding: 1.5rem;
}
.week-header {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px inset #242c2e;
  gap: 2rem;
  margin-bottom: 1rem;
}

.week-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: .5rem;
}
.week-day.dark {
  background: #343049;
  color: #dbc9ff;
  min-height: 120px;
  border-radius: 0.7rem;
  padding: 0.8rem;
  box-shadow: 2px 8px #0002;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  word-break: break-word;
  overflow-wrap: anywhere;
}
.week-day.light {
  background: #776ea8;
  color: #3f0c6c;
  min-height: 120px;
  border-radius: 0.7rem;
  padding: 0.8rem;
  box-shadow: 2px 8px #0002;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: larger;
  word-break: break-word;
  overflow-wrap: anywhere;
}
.date-label.dark {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #aa9deb;
}
.date-label.light {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #351bb6;
}
.todo-list {
  margin: 0.25rem 0 0 0;
  padding: 0;
  list-style: none;
  font-size: 0.98rem;
}
.todolist li {
  padding: .1275rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 100%;
}
.weather-banner {
  margin-top: auto;
  font-size: 1.3rem;
}
</style>
