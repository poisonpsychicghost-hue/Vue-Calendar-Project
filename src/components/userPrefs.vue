<script setup>
import { useCalendarStore } from '../stores/calendarStore'
const store = useCalendarStore()

// Adding utility for recurring task input
import { ref } from 'vue'
const newTask = ref({
  type: 'monthly',
  idx: 0,
  recurName: '',
  title: '',
  details: ''
})

function addRecurringTask() {
  if (
    (newTask.value.type === 'monthly' && (newTask.value.idx < 0 || newTask.value.idx > 30)) ||
    (newTask.value.type === 'weekly' && (newTask.value.idx < 0 || newTask.value.idx > 6))
  ) return

  const copy = { ...newTask.value }
  if (newTask.value.type === 'monthly') {
    store.recurringTasks.monthly.push(copy)
  } else {
    store.recurringTasks.weekly.push(copy)
  }
  newTask.value = { type: 'monthly', idx: 0, recurName: '', title: '', details: '' }
}

function removeMonthlyTask(idx) {
  store.recurringTasks.monthly.splice(idx, 1)
}
function removeWeeklyTask(idx) {
  store.recurringTasks.weekly.splice(idx, 1)
}

function addLocation() {
  // Only add if there are no empty location slots
  if (store.preferredLocations.every(loc => loc.trim() !== "")) {
    store.preferredLocations.push('')
  }
}
function removeLocation(idx) {
  store.preferredLocations.splice(idx, 1)
  // Safety: keep activeLocationIdx in range
  if (store.activeLocationIdx >= store.preferredLocations.length) {
    store.activeLocationIdx = 0
  }
}

function clearPrefs() {
  store.displayName = ''
  store.preferredLocations = ['Atlanta']
  store.theme = 'dark'
  store.unit = 'f'
  store.birthday = ''
  store.userEmail = ''
  store.recurringTasks = { monthly: [], weekly: [] }
  store.activeLocationIdx = 0
}

function deleteAccount() {
  clearPrefs()
  // Later: add logic to fully wipe user from storage or log out
}
</script>

<template>
  <div class="prefs-card">
    <h2>User Preferences</h2>
    <form @submit.prevent>
      <label>
        Display Name:
        <input v-model="store.userName" placeholder="Display name" />
      </label>
      <label>
        Preferred Locations:
        <div v-for="(loc, idx) in store.preferredLocations" :key="idx" style="margin-bottom: 0.5em;">
          <input v-model="store.preferredLocations[idx]" placeholder="Location" />
          <button type="button" @click="store.activeLocationIdx = idx">
            Set Active
          </button>
          <span v-if="store.activeLocationIdx === idx">&nbsp;(Current)</span>
          <button type="button" @click="removeLocation(idx)" v-if="store.preferredLocations.length > 1">Remove</button>
        </div>
        <button type="button" @click="addLocation">Add Location</button>
      </label>
      <label>
        Temperature Unit:
        <select v-model="store.unit">
          <option value="f">°F</option>
          <option value="c">°C</option>
        </select>
      </label>
      <label>
        Theme:
        <select v-model="store.theme">
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="ocean">Ocean</option>
          <option value="forest">Forest</option>
        </select>
      </label>
      <label>
        Birthday:
        <input type="date" v-model="store.birthday" />
      </label>
      <!-- Recurring Tasks Input UI -->
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
            :min="0"
            :max="newTask.type === 'monthly' ? 30 : 6"
          />
          <span v-if="newTask.type === 'weekly'">
            {{ ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][newTask.idx] }}
          </span>
        </label>
        <label>
          Name:<input v-model="newTask.recurName" />
        </label>
        <label>
          Title:<input v-model="newTask.title" />
        </label>
        <label>
          Details:<input v-model="newTask.details" />
        </label>
        <button type="button" @click="addRecurringTask">Add Recurring Task</button>
      </fieldset>
      <!-- Show Current Recurring Tasks -->
      <div>
        <h3>Monthly Recurring Tasks</h3>
        <ul>
          <li v-for="(task, idx) in store.recurringTasks.monthly" :key="idx">
            <strong>{{ task.recurName }}</strong>
            — Day {{ task.idx + 1 }} — <i>{{ task.title }}</i>
            <button @click="removeMonthlyTask(idx)">Remove</button>
          </li>
        </ul>
      </div>
      <div>
        <h3>Weekly Recurring Tasks</h3>
        <ul>
          <li v-for="(task, idx) in store.recurringTasks.weekly" :key="idx">
            <strong>{{ task.recurName }}</strong>
            — {{ ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][task.idx] }} — <i>{{ task.title }}</i>
            <button @click="removeWeeklyTask(idx)">Remove</button>
          </li>
        </ul>
      </div>
      <button type="button" @click="clearPrefs">Clear Preferences</button>
      <button type="button" @click="deleteAccount">Delete Account</button>
    </form>
  </div>
</template>

<style scoped>

</style>
