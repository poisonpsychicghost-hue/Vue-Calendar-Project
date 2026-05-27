import { defineStore } from 'pinia';

export const useCalendarStore = defineStore('calendar', {
    state: () => ({
        todosByDate: {}, // { '2026-05-27': [{title, details}]}
        notesByDate: {}, // { '2026-05-27': "My Daily Notes..."}
        user: null,
        session: null
        }), 
    getters: {
        getTodos: (state) => (dateStr) => state.todosByDate[dateStr] || [],
        getNote: (state) => (dateStr) => state.notesByDate[dateStr] || ''
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