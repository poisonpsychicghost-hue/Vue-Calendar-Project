<script setup>
import { ref } from 'vue'
import MonthlyView from './MonthlyView.vue'
import WeeklyView from './WeeklyView.vue';

const props = defineProps(['theme'])
</script>

<template>
    <div>
       <!-- <MonthlyView :theme="theme" /> -->
        <WeeklyView  />
    </div>
</template>