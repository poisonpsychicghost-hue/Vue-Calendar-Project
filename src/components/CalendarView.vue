<script setup>
import { ref } from 'vue'
import MonthlyView from './MonthlyView.vue'

const props = defineProps(['theme'])
</script>

<template>
    <div>
        <MonthlyView :theme="theme" />
    </div>
</template>