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
        session: null
        }), 
    getters: {
        viewYear: (state) => state.viewDate.getFullYear(),
        viewMonth: (state) => state.viewDate.getMonth(),
        viewDay: (state) => state.viewDate.getDate(),
        getTodos: (state) => (dateStr) => state.todosByDate[dateStr] || [],
        getNote: (state) => (dateStr) => state.notesByDate[dateStr] || '',
        viewDateString: (state) => state.viewDate.toISOString().split('T')[0],
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
        }
    }
})