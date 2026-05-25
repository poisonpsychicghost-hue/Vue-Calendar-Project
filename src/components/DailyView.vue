<script setup>
import { ref } from 'vue'

const props = defineProps(['theme'])

//PlaceHolder Day data
const day = {name: 'Monday', date: '2026-05-25', todos: [{title: 'Work', details: 'Check Codebase'}, {title: 'Fun', details: 'Dance'}], note: "Type Note Here..."};
const weatherIcon = '💨'
</script>

<template>
    <div :class="['daily-view', theme]">
        <div :class="['daily-card', theme]">
            <header :class="['day-name', theme]"><span>{{ day.name }}</span><span>{{ day.date }}</span></header>
            <div :class="['weather-banner', theme]"><span>Today Has Weather</span><span>{{ weatherIcon }}</span></div>
            <div class="lower-block">
                <div :class="['day-todoCard', theme]"> <!-- Make Expand/Scroll by User for More ToDo View-->
                    <p>TODOs:</p>
                    <ul class="day-todos">
                        <!--add logic to list all todos & make movable-->
                        <li>Test</li>
                    </ul>
                    <div :class="['todo-inputBox', theme]">
                        <p>Add TODOs</p>
                        <textarea > {{  }}</textarea>
                    </div>
                </div>
                <div :class="['day-notes', theme]">
                    <p>Daily Notes</p>
                    <textarea> {{  }}</textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<style scope>
.daily-view.dark {
    display: flex;
    justify-content: center;
    background: var(--main-bg, #30335b);
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 2px 0 1px  #8c3fb668;
}
.daily-view.light {
    display: flex;
    justify-content: center;
    background: var(--main-bg, #5d5f7e);
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 2px 0 1px  #8c3fb668;
}
.daily-card.dark {
    display: inline-flexbox;
    min-width: 100%;
    justify-content: space-evenly;
    border: 5px inset #0002;
    background: #343049;
}
.day-name.dark {
    display: inline-flex;
    justify-content: center;
    gap: 2rem;
    font-size: 1.5rem;
    color: #444;
}
.weather-banner.dark {
    display: flex;
    justify-content: space-evenly;
    max-height: .5rem;
    margin: 1rem;
    padding: 3%;
    border: 3px solid #444;
    background: #272837;

}
.lower-block {
    display: flex;
    justify-content: space-between;
}
.day-todoCard.dark {
    display: table;
    justify-self: left;
    min-height: 2rem;
    min-width: 15rem;
    justify-content: space-between;
    border: 4px ridge #30335b;
    background: #272837;
}
.day-notes.dark {
    display: table;
    justify-self: right;
    min-height: 2rem;
    min-width: 15rem;
    justify-content: space-between;
    border: 4px ridge #30335b;
    background: #272837;
}
</style>
