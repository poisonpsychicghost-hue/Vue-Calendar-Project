<template>
    
</template>


<script setup>
import { ref } from 'vue';

const prefs = ref({
    displayNmae: '',
    preferredLocations: [''],
    theme: 'dark',
    unit: 'f'
    //add fields as preferences build
})

function addLocations() {
    prefs.value.preferedLocations.push('')
}

function clearPrefs() {
    prefs.value = {
        displayName: '',
        perferredLocations: [''],
        theme: 'dark',
        unit: 'f'
        //add fields to reset as preferences build
    }
}

function deleteAccount() {
    //later build out to delete account
    clearPrefs()

}

</script>


<style scoped>

</style>
