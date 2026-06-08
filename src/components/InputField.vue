<script setup>
// src/components/InputField.vue
// Generic labeled input wrapper.
// Supports single-line text inputs and textarea via the `type` prop.
// Used by ToDoList, NoteField, and userPrefs.

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text' // 'text' | 'textarea' | 'date' | 'number'
  },
  min: {
    type: Number,
    default: null
  },
  max: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'enter'])

function onInput(evt) {
  emit('update:modelValue', evt.target.value)
}

function onKeyup(evt) {
  if (evt.key === 'Enter') emit('enter')
}
</script>

<template>
  <label class="input-field">
    <span class="input-label">{{ label }}</span>
    <textarea
      v-if="type === 'textarea'"
      :value="modelValue"
      :placeholder="placeholder"
      class="input-control input-textarea"
      @input="onInput"
    />
    <input
      v-else
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :min="min ?? undefined"
      :max="max ?? undefined"
      class="input-control"
      @input="onInput"
      @keyup="onKeyup"
    />
  </label>
</template>

<style scoped>
.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
}
.input-label {
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0.8;
}
.input-control {
  padding: 0.4rem 0.6rem;
  border-radius: 0.4rem;
  border: 1px solid #aaa;
  background: inherit;
  color: inherit;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
}
.input-textarea {
  min-height: 6rem;
  resize: vertical;
}
</style>