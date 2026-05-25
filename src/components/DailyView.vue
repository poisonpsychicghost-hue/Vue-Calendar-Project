<script setup>
import { ref } from 'vue'

const props = defineProps(['theme'])

//PlaceHolder Day data
const day = {name: 'Monday', date: '2026-05-25', todos: [{title: 'Work', details: 'Check Codebase'}, {title: 'Fun', details: 'Dance'}], note: "Type Note Here..."};
const weatherIcon = '💨'

function prevDay() {

}

function nextDay() {

}

</script>

<template>
    <div :class="['daily-view', theme]">
        <div :class="['daily-card', theme]">
            <header :class="['date-nav', theme]">
                <button onclick="prevDay">⬅️</button>
                <!-- <select> for dropdown menu with date select-->
                <p>Day Select</p>
                <button onclick="nextDay">➡️</button>
            </header>
            <div :class="['day-name', theme]"><span>{{ day.name }}</span><span>{{ day.date }}</span></div>
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

    justify-content: center;
    background: var(--main-bg, #30335b);
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 2px 0 1px  #8c3fb668;
}
.daily-view.light {

    justify-content: center;
    background: var(--main-bg, #5d5f7e);
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 2px 0 1px  #8c3fb668;
}
.date-nav.dark {
    display: flex;
    justify-content: center;
    gap: 2rem;
    border: 1px inset #242c2e;
}
.date-nav.light {
    display: flex;
    justify-content: center;
    gap: 2rem;
    border: 1px inset #242c2e;
}
.daily-card.dark {
    display: inline-flexbox;
    min-width: 100%;
    justify-content: space-evenly;

    border: 5px inset #0002;
    background: #343049;
}
.daily-card.light {
    display: inline-flexbox;
    min-width: 100%;
    justify-content: space-evenly;

    border: 5px inset #0002;
    background: #776ea8;
}
.day-name.dark {
    display: inline-flex;
    justify-content: center;
    padding: .5%;
    gap: 2rem;
    font-size: 1.5rem;
    color: #aa9deb;
}
.day-name.light {
    display: inline-flex;
    justify-content: center;
    padding: .5%;
    gap: 2rem;
    font-size: 1.5rem;
    color: #aa9deb;
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
.weather-banner.light {
    display: flex;
    justify-content: space-evenly;
    max-height: .5rem;
    margin: 1rem;
    padding: 3%;
    border: 3px solid #444;
    background: #878de4;
    color: #351bb6;
    font-size: 20px;
    font-style: bolder;

}
.lower-block {
    display: flex;
    justify-content: space-between;
    gap: .25rem;
}
.day-todoCard.dark {
    display: table;
    justify-self: left;
    min-height: 2rem;
    min-width: 15rem;
    margin: 2px;
    justify-content: space-between;
    box-shadow: 2px 2px #272837;
    border: 4px ridge #30335b;
    background: #30335b;
    color: #dbc9ff;
}
.day-todoCard.light {
    display: table;
    justify-self: left;
    min-height: 2rem;
    min-width: 15rem;
    margin: 2px;
    justify-content: space-between;
    box-shadow: 2px 2px #272837;
    border: 4px ridge #30335b;
    background: #6658b4;
    color: #351bb6;
}
.day-notes.dark {
    display: table;
    justify-self: right;
    transform: translateX(-4px);
    min-height: 2rem;
    max-height: 8.68rem;
    min-width: 15rem;
    margin: 2px;
    justify-content: space-between;
    box-shadow: 2px 2px #272837;
    border: 4px ridge #30335b;
    background: #30335b;
    color: #dbc9ff;
}
.day-notes.light {
    display: table;
    justify-self: right;
    transform: translateX(-4px);
    min-height: 2rem;
    max-height: 8.68rem;
    min-width: 15rem;
    margin: 2px;
    justify-content: space-between;
    box-shadow: 2px 2px #272837;
    border: 4px ridge #30335b;
    background: #6658b4;;
    color: #351bb6;
}
</style>
