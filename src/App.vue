<script setup>
import { computed } from 'vue'
import CalendarView from './components/CalendarView.vue'
import GoogleLogin from './components/GoogleLogin.vue'
import UserPrefs from './components/userPrefs.vue'
import { useCalendarStore } from './stores/calendarStore.js'
import { logoutGoogle } from './api/googleAuth'

const store = useCalendarStore()

const prefOpen = computed({
  get: () => store.prefOpen,
  set: val => store.prefOpen = val
})

function openPref() {
  store.prefOpen = !store.prefOpen
}
</script>

<template>
  <div :class="['app-bg', store.theme]">
    <header class="top-bar">
      <div class="top-user-toggles">
        <button @click="store.cycleTheme">
          <span v-if="store.theme === 'dark'">🌙</span>
          <span v-else-if="store.theme === 'light'">🌻</span>
          <span v-else-if="store.theme === 'ocean'">🌊</span>
          <span v-else>🌳</span>
        </button>
        <button @click="store.toggleUnit">🌡️°{{ store.unit.toUpperCase() }}</button>
        <button @click="store.nextLocation">
          {{ store.preferredLocations[store.activeLocationIdx] }}
        </button>
      </div>
      <div class="top-system-tabs">
        <button v-if="store.isLoggedIn" @click="openPref">
          Preferences ⚙
        </button>
        <button @click="store.logout">
          {{ store.isLoggedIn ? 'Logout' : 'Login' }}
        </button>
      </div>
    </header>

    <main class="main-window">
      <transition name="view-fade" mode="out-in">

        <div v-if="!store.isLoggedIn" key="login">
          <GoogleLogin :theme="store.theme" />
        </div>

        <div v-else-if="store.prefOpen" key="prefs">
          <UserPrefs :theme="store.theme" />
        </div>

        <div v-else key="calendar">
          <h1 class="calendar-greeting">
            {{ store.userName || 'User' }}'s Calendar
          </h1>
          <CalendarView
            :theme="store.theme"
            :temp-unit="store.unit"
            :location="store.preferredLocations[store.activeLocationIdx]"
          />
        </div>

      </transition>
      <!-- Auth warning banner — shown after silent retry fails -->
      <transition name="view-fade">
        <div v-if="store.authWarning" class="auth-warning-banner">
          <span>⚠️ Your session could not be verified. Please log out and sign in again.</span>
          <button class="auth-warning-logout" @click="logoutGoogle">
            Log Out
          </button>
        </div>
      </transition>
    </main>

    <footer>
      <p>Calendar App — Built by Sirius | 2026</p>
      <p>
        Weather data provided by
        <a
          href="https://www.weatherapi.com/"
          title="Free Weather API"
          target="_blank"
          rel="noopener noreferrer"
        >
          WeatherAPI.com
        </a>
      </p>
    </footer>
  </div>
</template>