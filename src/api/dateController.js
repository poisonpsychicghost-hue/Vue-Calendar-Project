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
};

export function getWeeksOfYear(year, weekStartsOn = 0) {
  const weeks = [];
  let start = startOfWeek(new Date(year, 0, 1), { weekStartsOn });
  let weekNum = 1;
  while (isSameYear(start, new Date(year, 6, 1)) || weekNum === 1) {
    const end = endOfWeek(start, { weekStartsOn });
    weeks.push({
      start,
      end,
      label: `Week ${weekNum}: ${format(start, 'MMM d')} - ${format(end, 'MMM d')}`
    });
    start = addWeeks(start, 1);
    weekNum++;
    if (start.getFullYear() > year && weekNum > 2) break;
  }
  return weeks;
};