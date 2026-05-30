<script setup>
import { ref, computed, watch } from 'vue'
import { format, eachDayOfInterval, isToday} from 'date-fns';
import { useCalendarStore } from '../stores/calendarStore'
import { getWeeksOfYear } from '../api/dateController'
import WeatherBanner from './WeatherBanner.vue'

const store = useCalendarStore();
const props = defineProps(['theme']);
const emit = defineEmits(['update:view']);
const weeks = computed(() => getWeeksOfYear(store.viewYear));
const selectedWeekIdx = computed(() => store.viewWeekIdx);
const selectedWeek = computed(() => 
  weeks.value[selectedWeekIdx.value] || null
)
const monthNameList = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 
    'September', 'October', 'November', 'December'
]
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
      todos: store.getTodos(format(date, 'yyy-MM-dd'))
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
  let date = new Date(store.viewDate)
  date.setDate(date.getDate() -7)
  store.viewDate = date
}
function nextWeek() {
  let date = new Date(store.viewDate)
  date.setDate(date.getDate() +7)
  store.viewDate = date
}

function selectWeek(evt) {
  const idx = Number(evt.target.value)
  const week =weeks.value[idx]
  store.viewDate = week.start
}

function goToDay(date) {
  store.veiwDay = new Date(date)
  emit('update:view', 'day')
}

</script>

<template>
    <div :class="['weekly-view', theme]">
        <!-- Week/Month/Year, with nav (add prev/next week buttons as needed) -->
        <header :class="['week-header', theme]">
            <button @click="prevWeek">⬅️</button>
            <select :value="selectedWeekIdx" @change="selectWeek">
              <option v-for="(week, idx) in weekOptions" :key="idx" :value="idx">
                {{ week.label }}
              </option>
            </select>
            <button @click="nextWeek">➡️</button>
            <!--Add in DropDown Menu with Week Select Choices By Year/Mo-->
        </header>
        <div><h2> {{ monthNameList[store.viewMonth] }} </h2></div>
        <div class="week-grid">
            <div 
            v-for="day in weekDays" 
            :key="day.dateStr" 
            :class="['week-day', theme, { today: day.isToday }]"
            @click="goToDay(day.dateObj)"
            >
                <div :class="['date-label', theme]">
                    <span>{{ day.dayName }} - </span>
                    <span>{{ day.displayDate }}</span>
                </div>
                <!--Top Three TODOS-->
                <ul class="todo-list">
                    <li v-for="(todo, idx) in day.todos.slice(0, 3)" :key="idx">
                      {{ todo.title }}</li>
                </ul>
                <!-- Weather Banner/Icons -->
                 <div class="weather-banner"><WeatherBanner :date-str="day.dateStr" mode="weekly" /></div>
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
