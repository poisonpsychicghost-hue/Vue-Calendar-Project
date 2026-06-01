<template>
    
</template>


<script setup>
import { ref } from 'vue';

const prefs = ref({
    displayNmae: '',
    preferredLocations: [''],
    theme: 'dark',
    unit: 'f',
    birthday: '', //YYYY-MM-DD
        userEmail: '', //xxx@yy.zzz
        recurringTasks: [{
            monthly: [
                {//idx is 0-30 (each day of Mo.)
                 //{ recurName: '', recurIdx: 0, title: '', details: ''}   

                }],
            weekly: [{
                //idx is 0-6 (Sun-Sat)
                 //{ recurName: '', recurIdx: 0, title: '', details: ''}   
            }]
        }] 
})

function addLocations() {
    prefs.value.preferedLocations.push('')
}

function clearPrefs() {
    prefs.value = {
        displayName: '',
        perferredLocations: [''],
        theme: 'dark',
        unit: 'f',
        birthday: '', 
        userEmail: '', 
        recurringTasks: [{
            monthly: [
                {}],
            weekly: [
                {}]
        }] 
    }
}

function deleteAccount() {
    //later build out to delete account
    clearPrefs()

}

</script>


<style scoped>

</style>
