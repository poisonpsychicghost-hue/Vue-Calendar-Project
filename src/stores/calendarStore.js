import { defineStore } from 'pinia'
import { format } from 'date-fns'
import { getWeeksOfYear } from '../api/dateController'

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    // Date navigation
    currentDate: new Date(),
    viewDate: new Date(),
    currentView: 'month', // 'month' | 'week' | 'day'

    // User data
    todosByDate: {}, // { 'yyyy-MM-dd': [{ title, details }] }
    notesByDate: {}, // { 'yyyy-MM-dd': 'My Daily Notes...' }

    // Auth state
    isLoggedIn: false,
    googleSub: '',
    userName: '',
    userEmail: '',

    // Session (reserved for future Google session data)
    user: null,
    session: null,

    // Preferences
    birthday: '',
    unit: 'f',
    theme: 'dark',
    preferredLocations: ['Atlanta'],
    activeLocationIdx: 0,

    // UI state
    prefOpen: false,
    authWarning: false, // true when session retry failed

    // Recurring tasks — idx is 0-indexed
    // Monthly: idx 0 = 1st of month, idx 30 = 31st of month
    // Weekly:  idx 0 = Sunday, idx 6 = Saturday
    recurringTasks: {
      monthly: [],
      weekly: []
    }
  }),

  getters: {
    viewYear: (state) => state.viewDate.getFullYear(),
    viewMonth: (state) => state.viewDate.getMonth(),
    viewDay: (state) => state.viewDate.getDate(),

    viewDateString: (state) => format(state.viewDate, 'yyyy-MM-dd'),

    getTodos: (state) => (dateStr) => state.todosByDate[dateStr] || [],
    getNote: (state) => (dateStr) => state.notesByDate[dateStr] || '',

    validLocations: (state) =>
      state.preferredLocations.filter(loc => loc && loc.trim() !== ''),

    currentLocation: (state) =>
      state.preferredLocations[state.activeLocationIdx] || '',

    viewWeekIdx: (state) => {
      const weeks = getWeeksOfYear(state.viewDate.getFullYear())
      return weeks.findIndex(
        w => state.viewDate >= w.start && state.viewDate <= w.end
      )
    },

    viewWeekRange: (state) => {
      const weeks = getWeeksOfYear(state.viewDate.getFullYear())
      const idx = weeks.findIndex(
        w => state.viewDate >= w.start && state.viewDate <= w.end
      )
      return idx >= 0 ? weeks[idx] : null
    },

    isToday: (state) => {
      const d1 = state.currentDate
      const d2 = state.viewDate
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      )
    }
  },

  actions: {
    // --- Todo actions ---
    addTodo(dateStr, todo) {
      if (!this.todosByDate[dateStr]) this.todosByDate[dateStr] = []
      this.todosByDate[dateStr].push(todo)
    },

    setTodos(dateStr, todos) {
      this.todosByDate[dateStr] = todos
    },

    removeTodo(dateStr, idx) {
      if (this.todosByDate[dateStr]) {
        this.todosByDate[dateStr].splice(idx, 1)
      }
    },

    // --- Note actions ---
    setNote(dateStr, note) {
      this.notesByDate[dateStr] = note
    },

    // --- Preference actions ---
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

    // --- Location actions ---
    nextLocation() {
      if (!this.preferredLocations.length) return
      this.activeLocationIdx =
        (this.activeLocationIdx + 1) % this.preferredLocations.length
    },

    setActiveLocation(idx) {
      const valid = this.validLocations
      this.activeLocationIdx = idx < valid.length ? idx : 0
    },

    addLocation() {
      if (this.preferredLocations.every(loc => loc.trim() !== '')) {
        this.preferredLocations.push('')
      }
    },

    removeLocation(idx) {
      this.preferredLocations.splice(idx, 1)
      if (this.activeLocationIdx >= this.preferredLocations.length) {
        this.activeLocationIdx = 0
      }
    },

    // --- Recurring task actions ---
    // idx convention: 0-indexed for both monthly and weekly
    // Monthly: store as 0–30 (display as idx + 1)
    // Weekly:  store as 0–6  (0 = Sunday)
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

    addRecurringsToTodos(forDate) {
      const date = new Date(forDate)
      const dayOfMonth = date.getDate() - 1 // 0-indexed: Jan 1 = 0
      const dayOfWeek = date.getDay()       // 0 = Sunday, 6 = Saturday

      for (const recur of this.recurringTasks.monthly) {
        if (recur.idx === dayOfMonth) {
          const todos = this.todosByDate[forDate] || []
          const already = todos.some(
            td =>
              td.title === recur.title &&
              td.details === recur.details &&
              td.recurName === recur.recurName
          )
          if (!already) this.addTodo(forDate, { ...recur })
        }
      }

      for (const recur of this.recurringTasks.weekly) {
        if (recur.idx === dayOfWeek) {
          const todos = this.todosByDate[forDate] || []
          const already = todos.some(
            td =>
              td.title === recur.title &&
              td.details === recur.details &&
              td.recurName === recur.recurName
          )
          if (!already) this.addTodo(forDate, { ...recur })
        }
      }
    },

    // --- Auth actions ---
    logout() {
      this.isLoggedIn = false
      this.googleSub = ''
      this.userName = ''
      this.userEmail = ''
      this.user = null
      this.session = null
      this.todosByDate = {}
      this.notesByDate = {}
      this.prefOpen = false
    },

    // --- Preferences actions ---
    clearPrefs() {
      this.userName = ''
      this.userEmail = ''
      this.birthday = ''
      this.theme = 'dark'
      this.unit = 'f'
      this.preferredLocations = ['Atlanta']
      this.activeLocationIdx = 0
      this.recurringTasks = { monthly: [], weekly: [] }
    }
  }
})