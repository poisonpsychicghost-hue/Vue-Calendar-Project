// src/api/weather.js
import { differenceInCalendarDays, parseISO, isBefore, isSameDay } from 'date-fns'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.weatherapi.com/v1'

// In-memory cache — lives for the duration of the session
const weatherCache = {}

// Normalize location strings to safe cache key segments.
// e.g. 'Atlanta, GA' → 'atlanta_ga'
function normalizeLocation(location) {
  return location.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')
}

function cacheKey(location, dateStr) {
  return `${normalizeLocation(location)}:${dateStr}`
}

// --- localStorage cache ---
// Weather data is not user-sensitive — cache is shared across sessions.
// Max age defaults to 24 hours.

function saveToLocalCache(key, data) {
  try {
    localStorage.setItem(`weather-${key}`, JSON.stringify({ data, time: Date.now() }))
  } catch {}
}

function loadFromLocalCache(key, maxAgeMs = 24 * 60 * 60 * 1000) {
  try {
    const raw = localStorage.getItem(`weather-${key}`)
    if (!raw) return null
    const { data, time } = JSON.parse(raw)
    if (Date.now() - time > maxAgeMs) return null
    return data
  } catch {
    return null
  }
}

// --- Main fetch function ---
// Returns a weather result object, or null on failure.
// Callers must handle null as a failed/unavailable state.
//
// Result shape varies by endpoint type:
//   current:          { date, last_updated, temp_c, temp_f, feelslike_c, feelslike_f,
//                       humidity, precip_mm, text, icon }
//   forecast/history: { date, avgtemp_c, avgtemp_f, humidity, temp_min_c, temp_max_c,
//                       temp_min_f, temp_max_f, totalprecip_mm, daily_chance_of_rain,
//                       text, icon }

export async function getWeather(dateStr = '', location = 'Atlanta, GA') {
  const normalizedDateStr = typeof dateStr === 'string'
    ? dateStr
    : dateStr.toISOString().split('T')[0]

  const requestDate = parseISO(normalizedDateStr)
  const today = new Date()
  const key = cacheKey(location, normalizedDateStr)

  // Check in-memory cache first, then localStorage
  if (weatherCache[key]) return weatherCache[key]
  const localData = loadFromLocalCache(key)
  if (localData) {
    weatherCache[key] = localData
    return localData
  }

  // WeatherAPI free tier: history available from 2020-01-01,
  // forecast available up to 14 days ahead
  if (isBefore(requestDate, new Date('2020-01-01'))) {
    return { condition: 'No data available for this date', icon: '', temp: null }
  }

  const daysAhead = differenceInCalendarDays(requestDate, today)
  if (daysAhead > 14) {
    return { condition: 'Forecast unavailable — more than 14 days ahead', icon: '', temp: null }
  }

  // Select correct endpoint based on date relationship to today
  let url = ''
  let endpointType = ''

  if (isSameDay(requestDate, today)) {
    url = `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}`
    endpointType = 'current'
  } else if (isBefore(requestDate, today)) {
    url = `${BASE_URL}/history.json?key=${API_KEY}&q=${encodeURIComponent(location)}&dt=${normalizedDateStr}`
    endpointType = 'history'
  } else {
    url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&dt=${normalizedDateStr}`
    endpointType = 'forecast'
  }

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`API error ${response.status}`)
    const data = await response.json()

    let result = { date: normalizedDateStr }

    if (endpointType === 'current') {
      const c = data.current || {}
      result = {
        ...result,
        last_updated: c.last_updated || '',
        temp_c: c.temp_c ?? null,
        temp_f: c.temp_f ?? null,
        feelslike_c: c.feelslike_c ?? null,
        feelslike_f: c.feelslike_f ?? null,
        humidity: c.humidity ?? null,
        precip_mm: c.precip_mm ?? null,
        text: c.condition?.text || '',
        icon: c.condition?.icon || '',
      }
    } else {
      const dayBlock = data.forecast?.forecastday?.[0] || {}
      const d = dayBlock.day || {}
      result = {
        ...result,
        avgtemp_c: d.avgtemp_c ?? null,
        avgtemp_f: d.avgtemp_f ?? null,
        humidity: d.avghumidity ?? null,
        temp_min_c: d.mintemp_c ?? null,
        temp_max_c: d.maxtemp_c ?? null,
        temp_min_f: d.mintemp_f ?? null,
        temp_max_f: d.maxtemp_f ?? null,
        totalprecip_mm: d.totalprecip_mm ?? null,
        daily_chance_of_rain: d.daily_chance_of_rain ?? null,
        text: d.condition?.text || '',
        icon: d.condition?.icon || '',
      }
    }

    weatherCache[key] = result
    saveToLocalCache(key, result)
    return result

  } catch {
    return null
  }
}