<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { format, addDays, subDays, getDay } from 'date-fns';
import { useCalendarStore } from '../stores/calendarStore';

const props = defineProps(['theme', 'currentDate'])
const store = useCalendarStore();

const current = ref(props.currentDate);
const dateStr = computed(() => props.currentDate.value ? props.currentDate.value.toISOString().split('T')[0] : '');
const newTodoTitle = ref('');
const newTodoDetails = ref('');
const todos = computed(() => store.getTodos(dateStr.value));
const note = computed({
    get: () => store.getNote(dateStr.value),
    set: val => store.setNote(dateStr.value, val)
});
const weatherIcon = ref('⛅️'); // Wire to Weather API
const draggingIdx = ref(null)

function addTodo(title, details) {
  store.addTodo(dateStr.value, { title, details })
}

function removeTodo(idx) {
  store.removeTodo(dateStr.value, idx)
}

function setTodos(newList) {
  store.setTodos(dateStr.value, newList)
}

function handleDragStart(idx) {
    draggingIdx.value = idx
}

function handleDragOver(idx) {
    if (draggingIdx.value !== null && draggingIdx.value !== idx) {
        const movedList = [...todos.value]
        const [moved] = movedList.splice(draggingIdx.value, 1)
        movedList.splice(idx, 0, moved)
        setTodos(movedList)
        draggingIdx.value = idx
    }
}

function handleDrop(idx) {
    draggingIdx.value = null
}

function prevDay() {
    props.currentDate.value = subDays(current.value, 1);
}

function nextDay() {
    props.currentDate.value = addDays(current.value, 1);
}

</script>

<template>
    <div :class="['daily-view', theme]">
        <div :class="['daily-card', theme]">
            <header :class="['date-nav', theme]">
                <button @click="prevDay">⬅️</button>
                <!-- <select> for dropdown menu with date select-->
                <p>Day Select</p>
                <button @click="nextDay">➡️</button>
            </header>
            <div :class="['day-name', theme]"><span>{{ current.value }}</span><span>{{ current }}</span></div>
            <div :class="['weather-banner', theme]"><span>Today Has Weather</span><span>{{ weatherIcon }}</span></div>
            <div class="lower-block">
                <div :class="['day-todoCard', theme]"> <!-- Make Expand/Scroll by User for More ToDo View-->
                    <p>TODOs:</p>
                    <ul class="day-todos">
                        <li v-for="(todo, idx) in todos" :key="idx"
                            draggable="true"
                            @dragstart="handleDragStart(idx)"
                            @dragover.prevent="handleDragOver(idx)"
                            @drop="handleDrop">
                                {{ todo.title }} <span v-if="todo.details">: {{ todo.details }}</span>
                            <button @click="removeTodo(idx)">Remove</button>
                        </li>
                    </ul>
                    <div class="todo-inputBox">
                        <label>
                            Title:
                            <input v-model="newTodoTitle" placeholder="Title"/>
                        </label>
                        <label>
                            Details:
                            <input v-model="newTodoDetails" placeholder="Details"/>
                        </label>
                        <button @click="addTodo(newTodoTitle, newTodoDetails)">Add ToDo</button>
                    </div>
                </div>
                <div :class="['day-notes', theme]">
                    <p>Daily Notes</p>
                    <textarea v-model="note"></textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
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
    gap: .5rem;
    flex-wrap: wrap;
    justify-content: space-between;
}
.day-todoCard.dark {
    display: table;
    flex: 1 1 45%;
    justify-self: left;
    min-height: 2rem;
    max-width: 280px;
    min-width: 170px;
    margin: 0.2rem 0;
    padding: .5rem;
    justify-content: space-between;
    box-shadow: 2px 2px #272837;
    border: 4px ridge #30335b;
    background: #30335b;
    color: #dbc9ff;
}
.day-todoCard.light {
    display: table;
    flex: 1 1 45%;
    justify-self: left;
    min-height: 2rem;
    max-width: 280px;
    min-width: 170px;
    margin: .2rem 0;
    padding: .5rem;
    justify-content: space-between;
    box-shadow: 2px 2px #272837;
    border: 4px ridge #30335b;
    background: #6658b4;
    color: #351bb6;
}
.todo-inputBox {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-top: .3rem;
}
.todo-inputBox.dark textarea {
    min-height: 1.4rem;
    resize: vertical;
    font-size: 1rem;
}
.day-notes.dark {
    display: table;
    justify-self: right;
    transform: translateX(-10px);
    min-height: 2rem;
    max-height: 8.68rem;
    min-width: 170px;
    max-width: 280px;
    flex: 1 1 45%;
    margin: .2rem 0;
    padding: .5rem;
    justify-content: space-between;
    box-shadow: 2px 2px #272837;
    border: 4px ridge #30335b;
    background: #30335b;
    color: #dbc9ff;
}
.day-notes.light {
    display: table;
    transform: translateX(-10px);
    justify-self: right;
    min-height: 2rem;
    max-height: 8.68rem;
    min-width: 170px;
    max-width: 280px;
    flex: 1 1 45%;
    margin: .2rem 0;
    padding: .5rem;
    justify-content: space-between;
    box-shadow: 2px 2px #272837;
    border: 4px ridge #30335b;
    background: #6658b4;;
    color: #351bb6;
}
</style>
