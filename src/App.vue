<script setup>
import { ref } from 'vue'
import CalendarView from './components/CalendarView.vue'


const userName = 'Sirius'; //Import Name from Google Auth.
const theme = ref('dark');
function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'

};

const isLoggedIn = ref(false);
function handleAuth() {
    isLoggedIn.value = !isLoggedIn.value //PlaceHolder for Google Auth Hook
};

</script>

<template>
    <div :class="['app-bg', theme]">
        <header class="top-bar">
            <button @click="toggleTheme">
                {{ theme === 'dark' ? '🌙' : '🌻' }}
            </button>
            <button @click="handleAuth">
                {{ isLoggedIn ? 'Logout 🐶' : 'Login 🫖' }}
            </button>
        </header>
        <main class="main-window">
            <h1>{{ userName }}'s Calendar</h1>
            <!--Fill Out with Components with Transitions During Build-->
            <CalendarView :theme="theme" />
        </main>
        <footer>
            <p></p>
            <p>🐶🐶🐶Site Built By Sirius|2026🐶🐶🐶</p>
            <p></p>
        </footer>
    </div>
</template>

<style scoped>
.app-bg.dark {
    min-height: 100vh;
    min-width: 100vw;
    background: #1b1522;
    color: #c6d7e7;
    transition: background 0.2s, color 0.2s;

}
.app-bg.light {
    min-height: 100vh;
    min-width: 100vw;
    background: #8d8e92;
    color: #15192e;
    transition: background 0.2s, color 0.2s;
}
.top-bar{
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1rem 2rem 0 0;
}
.main-window {
    margin: 0 auto;
    max-width: 100vw;
    min-width: 100vw;
    max-height: 120vh;
    padding: 2rem;
    border-radius: 1.2rem; 
    box-shadow: 0 4px 24px rgba(111, 70, 146, 0.416);
    background: var(--main-bg, rgba(25, 17, 65, 0.215));
}
.main-window h1,
.main-window h2,
.main-window h3,
.main-window h4,
.main-window h5,
.main-window h6 {
  color: inherit;
}
button {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: inherit;
}
footer {
    display: flex;
    align-self: bottom;
    justify-content: space-between;
    font-size: x-small;
}
</style>
