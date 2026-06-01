<template>
    
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
