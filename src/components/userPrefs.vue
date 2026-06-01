<template>

  <div class="prefs-card">
    <h2>User Preferences</h2>
    <form @submit.prevent>
      <label>
        Display Name:
        <input v-model="prefs.displayName" placeholder="Display name" />
      </label>

      <label>
        Preferred Locations:
        <div v-for="(loc, idx) in prefs.preferredLocations" :key="idx">
          <input v-model="prefs.preferredLocations[idx]" placeholder="Location" />
          <button type="button" @click="prefs.preferredLocations.splice(idx, 1)" v-if="prefs.preferredLocations.length > 1">Remove</button>
        </div>
        <button type="button" @click="addLocations">Add Location</button>
      </label>

      <label>
        Temperature Unit:
        <select v-model="prefs.unit">
          <option value="f">°F</option>
          <option value="c">°C</option>
        </select>
      </label>

      <label>
        Theme:
        <select v-model="prefs.theme">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="alt1">Alt 1</option>
          <option value="alt2">Alt 2</option>
        </select>
      </label>

      <label>
        Birthday:
        <input type="date" v-model="prefs.birthday" />
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
          <li v-for="(task, idx) in prefs.recurringTasks.monthly" :key="idx">
            <strong>{{ task.recurName }}</strong>
            — Day {{ task.idx + 1 }} — <i>{{ task.title }}</i>
            <button @click="removeMonthlyTask(idx)">Remove</button>
          </li>
        </ul>
      </div>
      <div>
        <h3>Weekly Recurring Tasks</h3>
        <ul>
          <li v-for="(task, idx) in prefs.recurringTasks.weekly" :key="idx">
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


<script setup>
import { ref } from 'vue'

const prefs = ref({
  displayName: '',
  preferredLocations: [''],
  theme: 'dark',
  unit: 'f',
  birthday: '', // YYYY-MM-DD
  userEmail: '',
  recurringTasks: {
    monthly: [],
    weekly: []
  }
})

function addLocations() {
  prefs.value.preferredLocations.push('')
}

function clearPrefs() {
  prefs.value = {
    displayName: '',
    preferredLocations: [''],
    theme: 'dark',
    unit: 'f',
    birthday: '',
    userEmail: '',
    recurringTasks: {
      monthly: [],
      weekly: []
    }
  }
}

function deleteAccount() {
  // later build out to delete account, for now:
  clearPrefs()
}

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

  if (newTask.value.type === 'monthly') {
    prefs.value.recurringTasks.monthly.push({ ...newTask.value })
  } else {
    prefs.value.recurringTasks.weekly.push({ ...newTask.value })
  }
  newTask.value = { type: 'monthly', idx: 0, recurName: '', title: '', details: '' }
}

function removeMonthlyTask(idx) {
  prefs.value.recurringTasks.monthly.splice(idx, 1)
}
function removeWeeklyTask(idx) {
  prefs.value.recurringTasks.weekly.splice(idx, 1)
}
</script>


<style scoped>

</style>
