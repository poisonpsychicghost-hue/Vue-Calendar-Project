<script setup>
// src/components/ToDoList.vue
// Todo card for a single day.
// Extracted from DailyView — owns todo display, input, drag-to-reorder, and removal.

import { ref, computed } from 'vue'
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

const newTodoTitle = ref('')
const newTodoDetails = ref('')
const draggingIdx = ref(null)

const todos = computed(() => store.getTodos(props.dateStr))

function addTodo() {
  if (!newTodoTitle.value.trim()) return
  store.addTodo(props.dateStr, {
    title: newTodoTitle.value.trim(),
    details: newTodoDetails.value.trim()
  })
  newTodoTitle.value = ''
  newTodoDetails.value = ''
}

function removeTodo(idx) {
  store.removeTodo(props.dateStr, idx)
}

function handleDragStart(idx) {
  draggingIdx.value = idx
}

function handleDragOver(idx) {
  if (draggingIdx.value !== null && draggingIdx.value !== idx) {
    const movedList = [...todos.value]
    const [moved] = movedList.splice(draggingIdx.value, 1)
    movedList.splice(idx, 0, moved)
    store.setTodos(props.dateStr, movedList)
    draggingIdx.value = idx
  }
}

function handleDrop() {
  draggingIdx.value = null
}
</script>

<template>
  <div :class="['day-todoCard', theme]">
    <p class="card-label">TODOs</p>

    <ul class="day-todos">
      <li
        v-for="(todo, idx) in todos"
        :key="todo.title + idx"
        draggable="true"
        class="todo-item"
        @dragstart="handleDragStart(idx)"
        @dragover.prevent="handleDragOver(idx)"
        @drop="handleDrop"
      >
        <span class="todo-title">{{ todo.title }}</span>
        <span v-if="todo.details" class="todo-details">: {{ todo.details }}</span>
        <button class="todo-remove" @click="removeTodo(idx)">✕</button>
      </li>
      <li v-if="!todos.length" class="todo-empty">No todos for this day.</li>
    </ul>

    <div class="todo-inputBox">
      <InputField
        label="Title"
        v-model="newTodoTitle"
        placeholder="Todo title"
        @enter="addTodo"
      />
      <InputField
        label="Details"
        v-model="newTodoDetails"
        placeholder="Optional details"
        @enter="addTodo"
      />
      <button class="todo-add" @click="addTodo">Add ToDo</button>
    </div>
  </div>
</template>

<style scoped>
.card-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.day-todos {
  list-style: none;
  padding: 0;
  margin: 0 0 0.75rem 0;
}
.todo-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.4rem;
  border-radius: 0.3rem;
  cursor: grab;
}
.todo-item:active {
  cursor: grabbing;
}
.todo-title {
  font-weight: 500;
  flex: 1;
}
.todo-details {
  opacity: 0.75;
  font-size: 0.9rem;
}
.todo-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  font-size: 0.85rem;
  padding: 0 0.2rem;
}
.todo-remove:hover {
  opacity: 1;
}
.todo-empty {
  opacity: 0.5;
  font-style: italic;
  font-size: 0.9rem;
  padding: 0.3rem 0;
}
.todo-inputBox {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.todo-add {
  margin-top: 0.25rem;
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;
  border: 1px solid currentColor;
  background: none;
  color: inherit;
  cursor: pointer;
  font-size: 0.95rem;
  align-self: flex-start;
}
</style>