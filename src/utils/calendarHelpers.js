// src/utils/calendarHelpers.js
// Shared constants and helper functions used across calendar components.
// Import from here instead of redefining locally in each component.

// --- Constants ---

export const WEEKDAYS_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

export const WEEKDAYS_SHORT = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
]

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

// --- Todo density class helper ---
// Returns a CSS class string based on the number of todos for a given date.
// Used by MonthlyView to apply border color to day cells.
// count: number of todos (store.getTodos(dateStr).length)

export function todoClass(count) {
  if (count >= 5) return 'todo-high'
  if (count > 1) return 'todo-medium'
  if (count === 1) return 'todo-low'
  return ''
}

// --- Date string helper ---
// Safe alternative to toISOString().split('T')[0].
// Uses date-fns format to avoid UTC offset stripping the wrong day
// for users west of UTC.

import { format } from 'date-fns'

export function toDateStr(date) {
  return format(date, 'yyyy-MM-dd')
}