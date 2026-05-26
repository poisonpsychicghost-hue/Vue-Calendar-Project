<script setup>
import { ref, computed, watch } from 'vue'
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameYear} from 'date-fns';

const props = defineProps(['theme', 'month', 'year']);
console.log('WeeklyView: props.year =', props.year)

const current = ref(new Date());
const selectedWeekIdx = ref(0);
const weekOptions = computed(() => getWeeksOfYear(props.year));
const selectedWeek = computed(() => {
  if (!weekOptions.value.length) return null
  if (selectedWeekIdx.value < 0 || selectedWeekIdx.value >= weekOptions.value.length) return null
  return weekOptions.value[selectedWeekIdx.value]
})

const weekDays = computed(() => {
  if (!selectedWeek.value || !selectedWeek.value.start || isNaN(selectedWeek.value.start)) return []
  const start = selectedWeek.value.start
  const end = selectedWeek.value.end
  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) return []
  const days = eachDayOfInterval({ start, end })
  return days.map(date => ({
      dateObj: date,
      dateStr: format(date, 'yyyy-MM-dd'),
      dayName: format(date, 'E'),
      displayDate: format(date, 'd'),
      isToday: isToday(date),
      todos: []
    }))
})

const weekLabel = computed(() => {
  if (!weekDays.value.length) return ''
  const start = weekDays.value[0]?.dateObj
  const end = weekDays.value[6]?.dateObj
  if (!start || !end) return ''
  const startFmt = format(start, 'MMM d')
  const endFmt = format(end, 'MMM d, yyyy')
  return `${startFmt} - ${endFmt}`
});


function prevWeek() {
  if (selectedWeekIdx.value > 0) {
    selectedWeekIdx.value -= 1
  }
}

function nextWeek() {
  if (selectedWeekIdx.value < weekOptions.value.length - 1) {
    selectedWeekIdx.value += 1
  }
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

function selectWeek(idx) {
  selectedWeekIdx.value = idx
  current.value = weekOptions.value[idx].start
}

watch(() => props.year, () => {
  selectedWeekIdx.value = 0
})

</script>

<template>
    <div :class="['weekly-view', theme]">
        <!-- Week/Month/Year, with nav (add prev/next week buttons as needed) -->
        <header :class="['week-header', theme]">
            <button @click="prevWeek">⬅️</button>
            <select v-model="selectedWeekIdx">
              <option v-for="(week, idx) in weekOptions" :key="idx" :value="idx">
                {{ week.label }}
              </option>
            </select>
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
                    <li v-for="(todo, idx) in day.todos.slice(0, 3)" :key="idx">
                      {{ todo.title }}</li>
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
