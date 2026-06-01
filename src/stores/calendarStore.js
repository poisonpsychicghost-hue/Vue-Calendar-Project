import { defineStore } from 'pinia';
import { getWeeksOfYear } from '../api/dateController';

export const useCalendarStore = defineStore('calendar', {
    state: () => ({
        currentDate: new Date(), //always "today" at app load
        viewDate: new Date(), //What user is browsing (default to today)
        currentView: 'month', //('month' | 'week'| 'day'),
        todosByDate: {}, // { '2026-05-27': [{title, details}]}
        notesByDate: {}, // { '2026-05-27': "My Daily Notes..."}
        user: null,
        session: null,


        userName: '',
        userEmail: '',
        birthday: '',
        unit: 'f',
        theme: 'dark',
        preferredLocations: ['Atlanta'],
        activeLoactionIdx: 0,

        recurringTasks: {
            monthly: [],
            weekly: []
        }
        }), 
    getters: {
        viewYear: (state) => state.viewDate.getFullYear(),
        viewMonth: (state) => state.viewDate.getMonth(),
        viewDay: (state) => state.viewDate.getDate(),
        getTodos: (state) => (dateStr) => state.todosByDate[dateStr] || [],
        getNote: (state) => (dateStr) => state.notesByDate[dateStr] || '',
        viewDateString: (state) => state.viewDate.toISOString().split('T')[0],
        validLocations: (state) =>
            state.preferredLocations.filter(loc => loc && loc.trim() !== ''),
        currentLocation: (state) =>
            state.preferredLocations[state.activeLoactionIdx] || '',
        
        viewWeekIdx: (state) => { const weeks = getWeeksOfYear(state.viewDate.getFullYear())
            return weeks.findIndex(w =>
                state.viewDate >= w.start && state.viewDate <= w.end
            )},
        viewWeekRange: (state) => { const weeks = getWeeksOfYear(state.viewDate.getFullYear())
            const idx = weeks.findIndex(w =>
                state.viewDate >= w.start && state.viewDate <= w.end
            )
            return idx >= 0 ? weeks[idx] : null },
        isToday: (state) => {
            const d1 = state.currentDate
            const d2 = state.viewDate
            return d1.getFullYear() == d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        }
        
        },
    
    actions: {
        addTodo(dateStr, todo) {
            if (!this.todosByDate[dateStr]) this.todosByDate[dateStr] = []
            this.todosByDate[dateStr].push(todo)
        },
        setTodos(dateStr, todos) {
            this.todosByDate[dateStr] = todos
        },
        removeTodo(dateStr, idx) {
            if (this.todosByDate[dateStr]) this.todosByDate[dateStr].splice(idx, 1)
        },
        setNote(dateStr, note) {
            this.notesByDate[dateStr] = note
        },
        toggleUnit() {
            this.unit = this.unit === 'f' ? 'c' : 'f'
        },
        cycleTheme() {
            const themes = ['dark', 'light', 'ocean', 'forest']
            const idx = themes.indexOf(this.theme)
            this.theme = themes[(idx + 1) % themes.length]
        },
        setTheme(newTheme) {
            this.theme = newTheme
        }, 
        nextLocation() {
            if (!this.preferredLocations.length) return
            this.activeLocationIdx = (this.activeLoactionIdx + 1) % this.preferredLocations.length
        },
        setActiveLocation(idx) {
            const valid = this.validLocations
            if (idx < valid.length) this.activeLoactionIdx = idx
            else this.activeLocationIdx = 0
        },
        addLocation() {
            if (this.preferredLocations.every(loc => loc.trim() !== '')) {
                this.preferredLocations.push('')
            }
        },
        removeLocation(idx) {
            this.preferredLocations.splice(idx, 1)
            if (this.activeLocationIdx >= this.preferredLocations.length) {
                this.activeLoactionIdx = 0
            }
        },
        addRecurringTask(task) {
            if (task.type === 'monthly') {
                this.recurringTasks.monthly.push(task)
            } else {
                this.recurringTasks.weekly.push(task)
            }
        },
        removeMonthlyTask(idx) {
            this.recurringTasks.monthly.splice(idx, 1)
        },
        removeWeeklyTask(idx) {
            this.recurringTasks.weekly.splice(idx, 1)
        },
        clearPrefs() {
            this.userName = ''
            this.userEmail = ''
            this.birthday = ''
            this.theme = ''
            this.unit = 'f'
            this.preferredLocations = ['Atlanta']
            this.activeLoactionIdx = 0
            this.recurringTasks = {montly: [], weekly: []}
        }
    }
})