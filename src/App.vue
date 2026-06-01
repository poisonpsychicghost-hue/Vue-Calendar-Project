<script setup>
import { ref } from 'vue'
import CalendarView from './components/CalendarView.vue'
import GoogleLogin from './components/GoogleLogin.vue';
import UserPrefs from './components/userPrefs.vue';


const userName = 'Sirius'; //Import Name from Google Auth.
const theme = ref('dark');
function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'

};

const isLoggedIn = ref(false);
function handleAuth() {
    isLoggedIn.value = !isLoggedIn.value //PlaceHolder for Google Auth Hook
};

const prefOpen = ref(false)
function openPref() {
    prefOpen.value = !prefOpen.value
}

</script>

<template>
    <div :class="['app-bg', theme]">
        <header class="top-bar">
            <button @click="openPref">
                Preferences ⚙
            </button>
            <button @click="toggleTheme">
                {{ theme === 'dark' ? '🌙' : '🌻' }}
            </button>
            <button @click="handleAuth">
                {{ isLoggedIn ? 'Logout 🐶' : 'Login 🫖' }}
            </button>
        </header>
        <main class="main-window">
            <div v-if="!isLoggedIn">
                <GoogleLogin :theme="theme"/>
            </div>
            <div v-if="isLoggedIn && prefOpen">
                <UserPrefs :theme="theme"/>
            </div>  
            <div v-if="isLoggedIn && !prefOpen">
                <h1>{{ userName }}'s Calendar</h1>
                <CalendarView :theme="theme" />
            </div>
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
    background: #1b1522;
    color: #c6d7e7;
    transition: background 0.2s, color 0.2s;

}
.app-bg.light {
    background: #8d8e92f5;
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
    margin: 2rem auto;
    max-width: 900px;
    min-width: 320px;
    width: 90vw;
    padding: 2rem 1rem;
    border-radius: 1.2rem; 
    box-shadow: 0 4px 24px rgba(151, 75, 218, 0.16); /* softer shadow for less pop */
    background: inherit;
    overflow-x: auto;
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
    justify-content: center;
    align-items: center;
    font-size: 0.88rem;
    padding: 0.5rem 0;
    min-height: 2rem;
}
</style>
