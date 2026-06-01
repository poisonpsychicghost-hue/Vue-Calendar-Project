<template>
    <div class=""login-page>
        <div class="login-card">
            <h1>Sign in to Your Calendar</h1>
            <!-- Placeholder For Google Widget/Button-->

            <div id="google-login-widget">
                <button @click="handleDummyLogin" :disabled="isLoggingIn">
                    <span v-if="!isLoggingIn">Sign In To Google</span>
                    <span v-else>Signing In..</span>
                </button>
            </div>

            <!-- Placeholder For Google Widget/Button-->
        </div>
        <p class="login-note">For Demo: Real Google Sign-In to Come Later...</p>
    </div>
</template>

<script setup>
import { is } from 'date-fns/locale';
import { ref} from 'vue';

const isLoggingIn = ref(false); // Change to a prop from App upon wiring

function handleDummyLogin() { // Make sure to adjust to prop
    isLoggingIn.value = true
    // Remove when Google Controller Built + Wired
}

</script>

<style scoped>

</style>
