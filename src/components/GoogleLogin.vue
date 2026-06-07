<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { waitForGoogleSDK, initGoogleAuth } from '../api/googleAuth'

const props = defineProps({
  theme: String
})

const buttonEl = ref(null)
const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  try {
    await waitForGoogleSDK()
    isLoading.value = false        // renders the buttonEl div into the DOM
    await nextTick()               // waits for Vue to finish that DOM update
    initGoogleAuth(buttonEl.value) // buttonEl now exists and is non-null
  } catch (err) {
    isLoading.value = false
    hasError.value = true
    errorMessage.value = 'Could not load Google Sign-In. Please check your connection and refresh.'
  }
})
</script>

<template>
  <div :class="['login-page', theme]">
    <div class="login-card">
      <h1>Sign in to Your Calendar</h1>

      <div v-if="isLoading" class="login-status">
        Loading sign-in…
      </div>

      <div v-else-if="hasError" class="login-status login-error">
        {{ errorMessage }}
      </div>

      <div v-else ref="buttonEl" id="google-login-widget"></div>
    </div>

    <p class="login-note">
      Sign in with your Google account to access your calendar.
    </p>
  </div>
</template>