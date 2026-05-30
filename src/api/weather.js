import { differenceInCalendarDays, parseISO, isBefore } from "date-fns"

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.weatherapi.com/v1'

const weatherCache = {}

function saveToLocalCache(cacheKey, data) {
    try {
        localStorage.setItem(`weather-${cacheKey}`, JSON.stringify({ data, time: Date.now() }))
    } catch {}
}

function loadFromLocalCache(cacheKey, maxAgeMs = 24 * 60 * 60 * 1000) {
    try {
        const raw = localStorage.getItem(`weather-${cacheKey}`)
        if (!raw) return null
        const { data, time } = JSON.parse(raw)
        if (Date.now() - time > maxAgeMs) return null
        return data
    } catch {
        return null
    }
}

export async function getWeather(dateStr = '', location = 'Atlanta,GA') {
    const normalizedDateStr = typeof dateStr === 'string'
      ? dateStr
      : dateStr.toISOString().split('T')[0]

    const requestDate = parseISO(normalizedDateStr)
    const today = new Date()
    const date2020 = new Date('2020-01-01')
    const cacheKey = `${location}:${normalizedDateStr}`

    if (weatherCache[cacheKey]) return weatherCache[cacheKey]
    const localData = loadFromLocalCache(cacheKey)
    if (localData) return localData

    if (isBefore(requestDate, date2020)) {
        return { condition: 'No Data (too old)', icon: '', temp: null }
    }
    const daysAhead = differenceInCalendarDays(requestDate, today)
    if (daysAhead > 14) {
        return { condition: 'Forecast unavailable (too far ahead)', icon: '', temp: null }
    }

    let url = ''
    if (isBefore(requestDate, today)) {
        url = `${BASE_URL}/history.json?key=${API_KEY}&q=${location}&dt=${normalizedDateStr}`
    } else {
        url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&dt=${normalizedDateStr}`
    }

    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`API error ${response.status}`)
        const data = await response.json()
        const result =  {
            condition: data.forecast?.forecastday[0]?.day?.condition?.text || '',
            icon: data.forecast?.forecastday[0]?.day?.condition?.icon || '',
            temp: data.forecast?.forecastday[0]?.day?.avgtemp_f || null,
            temp_c: data.forecast?.forecastday[0]?.day?.avgtemp_c ?? null,
            temp_min: data.forecast?.forecastday[0]?.day?.mintemp_f ?? null,
            temp_max: data.forecast?.forecastday[0]?.day?.maxtemp_f ?? null,
            
            raw: data

        }
        
        weatherCache[cacheKey] = result
        saveToLocalCache(cacheKey, result)
        return result
    } catch (err) {
        console.warn('Weather fetch Failed: ', err)
        return null
    }
}

