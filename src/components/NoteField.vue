<script setup>
// src/components/NoteField.vue
// Daily notes card for a single day.
// Extracted from DailyView — owns note display and editing for a given dateStr.

import { computed } from 'vue'
import { useCalendarStore } from '../stores/calendarStore'
import InputField from './InputField.vue'

const store = useCalendarStore()

const props = defineProps({
  dateStr: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    default: 'dark'
  }
})

const note = computed({
  get: () => store.getNote(props.dateStr),
  set: val => store.setNote(props.dateStr, val)
})
</script>

<template>
  <div :class="['day-notes', theme]">
    <p class="card-label">Daily Notes</p>
    <InputField
      label=""
      type="textarea"
      v-model="note"
      placeholder="Write your notes for the day..."
    />
  </div>
</template>

<style scoped>
.card-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.day-notes {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>