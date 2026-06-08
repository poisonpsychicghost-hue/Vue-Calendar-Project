<script setup>
import { ref } from 'vue'
import { useCalendarStore } from '../stores/calendarStore'
import { logoutGoogle } from '../api/googleAuth'
import { WEEKDAYS_SHORT } from '../utils/calendarHelpers'

const store = useCalendarStore()

const props = defineProps({
  theme: String
})

// Recurring task input state
const newTask = ref({
  type: 'monthly',
  idx: 0,
  recurName: '',
  title: '',
  details: ''
})

// idx convention (mirrors store):
// Monthly: 0 = 1st of month, 30 = 31st of month (stored 0-indexed, displayed as idx + 1)
// Weekly:  0 = Sunday, 6 = Saturday

function addRecurringTask() {
  const { type, idx, title } = newTask.value
  if (!title.trim()) return

  if (type === 'monthly' && (idx < 0 || idx > 30)) return
  if (type === 'weekly' && (idx < 0 || idx > 6)) return

  store.addRecurringTask({ ...newTask.value })
  newTask.value = { type: 'monthly', idx: 0, recurName: '', title: '', details: '' }
}

function deleteAccount() {
  store.clearPrefs()
  logoutGoogle()
}
</script>

<template>
  <div :class="['prefs-card', theme]">
    <h2>User Preferences</h2>

    <form @submit.prevent>

      <!-- Display name -->
      <label>
        Display Name:
        <input v-model="store.userName" placeholder="Display name" />
      </label>

      <!-- Preferred locations -->
      <label>Preferred Locations:</label>
      <div
        v-for="(loc, idx) in store.preferredLocations"
        :key="idx"
        class="location-row"
      >
        <input v-model="store.preferredLocations[idx]" placeholder="City, State" />
        <button type="button" @click="store.setActiveLocation(idx)">
          Set Active
        </button>
        <span v-if="store.activeLocationIdx === idx">(Current)</span>
        <button
          type="button"
          @click="store.removeLocation(idx)"
          v-if="store.preferredLocations.length > 1"
        >
          Remove
        </button>
      </div>
      <button type="button" @click="store.addLocation">Add Location</button>

      <!-- Temperature unit -->
      <label>
        Temperature Unit:
        <select v-model="store.unit">
          <option value="f">°F</option>
          <option value="c">°C</option>
        </select>
      </label>

      <!-- Theme -->
      <label>
        Theme:
        <select v-model="store.theme">
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="ocean">Ocean</option>
          <option value="forest">Forest</option>
        </select>
      </label>

      <!-- Birthday -->
      <label>
        Birthday:
        <input type="date" v-model="store.birthday" />
      </label>

      <!-- Recurring tasks input -->
      <fieldset>
        <legend>Add Recurring Task</legend>

        <label>
          Type:
          <select v-model="newTask.type">
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>

        <label>
          {{ newTask.type === 'monthly' ? 'Day of Month (1–31)' : 'Day of Week' }}
          <input
            type="number"
            v-model.number="newTask.idx"
            :min="newTask.type === 'monthly' ? 1 : 0"
            :max="newTask.type === 'monthly' ? 31 : 6"
          />
          <span v-if="newTask.type === 'monthly'">
            {{ newTask.idx >= 1 && newTask.idx <= 31 ? `Day ${newTask.idx}` : '' }}
          </span>
          <span v-else>
            {{ ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][newTask.idx] }}
          </span>
        </label>

        <label>
          Name:
          <input v-model="newTask.recurName" placeholder="e.g. Rent" />
        </label>

        <label>
          Title:
          <input v-model="newTask.title" placeholder="Task title" />
        </label>

        <label>
          Details:
          <input v-model="newTask.details" placeholder="Optional details" />
        </label>

        <button type="button" @click="addRecurringTask">Add Recurring Task</button>
      </fieldset>

      <!-- Current recurring tasks -->
      <div>
        <h3>Monthly Recurring Tasks</h3>
        <ul>
          <li
            v-for="(task, idx) in store.recurringTasks.monthly"
            :key="task.recurName + idx"
          >
            <strong>{{ task.recurName }}</strong>
            — Day {{ task.idx + 1 }} —
            <i>{{ task.title }}</i>
            <button type="button" @click="store.removeMonthlyTask(idx)">Remove</button>
          </li>
        </ul>
        <p v-if="!store.recurringTasks.monthly.length">No monthly tasks set.</p>
      </div>

      <div>
        <h3>Weekly Recurring Tasks</h3>
        <ul>
          <li
            v-for="(task, idx) in store.recurringTasks.weekly"
            :key="task.recurName + idx"
          >
            <strong>{{ task.recurName }}</strong>
            — {{ ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][task.idx] }} —
            <i>{{ task.title }}</i>
            <button type="button" @click="store.removeWeeklyTask(idx)">Remove</button>
          </li>
        </ul>
        <p v-if="!store.recurringTasks.weekly.length">No weekly tasks set.</p>
      </div>

      <!-- Preference actions -->
      <div class="prefs-actions">
        <button type="button" @click="store.clearPrefs">Clear Preferences</button>
        <button type="button" @click="deleteAccount">Delete Account</button>
      </div>

    </form>
  </div>
</template>

<style scoped>

</style>
