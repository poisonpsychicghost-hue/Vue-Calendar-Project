<template>
    <div class=""login-page>
        <div class="login-card">
            <h1>Sign in to Your Calendar</h1>
            <!-- Placeholder For Google Widget/Button-->

            <div id="google-login-widget">
                    
            </div>

            <!-- Placeholder For Google Widget/Button-->
        </div>
        <p class="login-note">For Demo: Real Google Sign-In to Come Later...</p>
    </div>
</template>

<script setup>
import { is } from 'date-fns/locale';
import { ref, onMounted } from 'vue';
import { useCalendarStore } from '../stores/calendarStore';

const store = useCalendarStore();
const isLoggingIn = ref(false); // Change to a prop from App upon wiring

onMounted(() => {
  // Wait until the GIS SDK is loaded
  const waitForGoogle = setInterval(() => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      clearInterval(waitForGoogle);
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
        ux_mode: 'popup',
      })
      window.google.accounts.id.renderButton(
        document.getElementById('google-login-widget'),
        { theme: "outline", size: "large" }
      )
    }
  }, 100)

  // Optionally, add a timeout to fail gracefully if the script never loads
});

function handleGoogleCallback(response) {
    if (!response.credential) return
    const profile = parseJwt(response.credential)

    store.userName = profile.name
    store.userEmail = profile.email
    store.googleSub = profile.sub

    isLoggingIn.value = false
}

function parseJwt(token) {
    if (!token) return {}
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g,'/')
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
       return '%'  + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
}

function logoutGoogle() {
  store.isLoggedIn = false;
  store.googleSub = '';


}

</script>

<style scoped>

</style>
