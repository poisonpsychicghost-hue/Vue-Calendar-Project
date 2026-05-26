<script setup>
import { ref, computed } from 'vue'
import { format, addWeeks, subWeeks, startOfWeek, eachDayOfInterval, isToday} from 'date-fns';

const props = defineProps(['theme'])
const current = ref(new Date())


//Placeholder weekDays...
const weekLabel = computed(() => {
  const start = weekDays.value[0]?.dateObj
  const end = weekDays.value[6]?.dateObj
  if (!start || !end) return ''
  const startFmt = format(start, 'MMM d')
  const endFmt = format(end, 'MMM d, yyyy')
  return `${startFmt} - ${endFmt}`
});
const weekDays = computed(() => {
  const start = startOfWeek(current.value, {weekStartsOn: 0})
  const days = eachDayOfInterval({
    start, end: new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6)
  })
  return days.map(date => ({
    dateObj: date,
    dateStr: format(date, 'yyyy-MM-dd'),
    dayName: format(date, 'E'),
    displayDate: format(date, 'd'),
    isToday: isToday(date),
    todos: []
  }))
});

function prevWeek() {
  current.value = subWeeks(current.value, 1)
}

function nextWeek() {
    current.value = addWeeks(current.value, 1)
}

</script>

<template>
    <div :class="['weekly-view', theme]">
        <!-- Week/Month/Year, with nav (add prev/next week buttons as needed) -->
        <header :class="['week-header', theme]">
            <button @click="prevWeek">⬅️</button>
            <span>Week of {{ weekLabel }}</span>
            <button @click="nextWeek">➡️</button>
            <!--Add in DropDown Menu with Week Select Choices By Year/Mo-->
        </header>
        <div class="week-grid">

            <div v-for="day in weekDays" :key="day.dateStr" :class="['week-day', theme, { today: day.isToday }]">
                <div :class="['date-label', theme]">
                    <span>{{ day.dayName }}</span>
                    <span>{{ day.displayDate }}</span>
                </div>
                <!--Top Three TODOS-->
                <ul class="todo-list">
                    <<li v-for="(todo, idx) in day.todos.slice(0, 3)" :key="idx">
16                    {{ todo.title }}</li>
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
