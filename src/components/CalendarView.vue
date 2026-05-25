<script setup>
import { ref } from 'vue'
import MonthlyView from './MonthlyView.vue'
import WeeklyView from './WeeklyView.vue';

const props = defineProps(['theme'])
</script>

<template>
    <div>
        <div :class="['transition-tabs', theme]">
            <button :class="['tab', theme]">Test1</button>
            <button :class="['tab', theme]">Test2</button>
            <button :class="['tab', theme]">Test3</button>
        </div>
        <!-- <MonthlyView :theme="theme" /> 
       <WeeklyView :theme="theme" /> -->
    </div>
</template>

<style scoped>
.transition-tabs.dark {
    display: inline flex;
    justify-content: space-evenly;
    gap: 1.5rem;
    border-radius: 5%;
    background: #343049;
    box-shadow: 5px 0 0 2px blur #000;
}
.transition-tabs.light {
    display: inline flex;
    justify-content: space-evenly;
    gap: 1.5rem;
    border-radius: 5%;
    background: #776ea8;
    box-shadow: 5px 0 0 2px blur #b8abab;
}
.tab.dark {
    color: #dbc9ff;
    min-width: 8rem;
    
}
.tab.light {
    color: #3f0c6c;
    min-width: 8rem;
}
</style>
