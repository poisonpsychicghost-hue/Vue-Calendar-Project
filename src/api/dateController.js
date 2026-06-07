// src/api/dateController.js
import {
  format,
  addWeeks,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  getYear,
  getMonth,
  getDate,
} from 'date-fns'

// Returns an array of day objects for the full display grid of a given month.
// Includes padding days from the previous and next month to fill the week rows.
// month is 0-indexed (0 = January)
export function getMonthDays(year, month, weekStartsOn = 0) {
  const start = startOfWeek(startOfMonth(new Date(year, month, 1)), { weekStartsOn })
  const end = endOfWeek(endOfMonth(new Date(year, month, 1)), { weekStartsOn })
  return eachDayOfInterval({ start, end }).map(date => ({
    dateObj: date,
    dateStr: format(date, 'yyyy-MM-dd'),
    isToday: isToday(date),
    dayNum: getDate(date),
    monthNum: getMonth(date),
    yearNum: getYear(date),
  }))
}

// Returns an array of week objects for a given year.
// Each week has a start date, end date, and a display label.
// Weeks are 0-indexed — week at index 0 is the first week of the year.
export function getWeeksOfYear(year, weekStartsOn = 0) {
  const weeks = []
  let start = startOfWeek(new Date(year, 0, 1), { weekStartsOn })
  let weekNum = 1

  while (start.getFullYear() <= year) {
    const end = endOfWeek(start, { weekStartsOn })
    weeks.push({
      start,
      end,
      label: `Week ${weekNum}: ${format(start, 'MMM d')} - ${format(end, 'MMM d')}`
    })
    start = addWeeks(start, 1)
    weekNum++
  }

  return weeks
}