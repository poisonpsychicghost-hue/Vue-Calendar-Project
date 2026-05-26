// src/utils/dateController.js
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
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

export function getMonthDays(year, month, weekStartsOn = 0) {
  // month is 0-indexed (0 = January)
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