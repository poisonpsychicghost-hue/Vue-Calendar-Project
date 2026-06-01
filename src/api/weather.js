import { differenceInCalendarDays, parseISO, isBefore, isSameDay } from "date-fns"
import { useCalendarStore } from '../stores/calendarStore'



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

export async function getWeather(dateStr = '', location = 'Atlanta, GA') {
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

    let url = '', endpointType = '';
    if (isSameDay(requestDate, today)) {
        url = `${BASE_URL}/current.json?key=${API_KEY}&q=${location}`
        endpointType = 'current'
    } else if (isBefore(requestDate, today)) {
        url = `${BASE_URL}/history.json?key=${API_KEY}&q=${location}&dt=${normalizedDateStr}`
        endpointType = 'history'
    } else {
        url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&dt=${normalizedDateStr}`
        endpointType = 'forecast'
    }
    console.log(`URL is: ${url}`);

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
                text: c.condition.text || '',
                icon: c.condition.icon || '',
            }
        } else {
            const dayBlock = data.forecast?.forecastday?.[0] || {}
            const d = dayBlock.day || {}
            result = {
                ...result,
                avgtemp_c: d.avgtemp_c ?? null,
                avgtemp_f: d.avgtemp_f ?? null, 
                feelslike_c: d.feelslike_c ?? null,
                feelslike_f: d.feelslike_f ?? null, 
                humidity: d.avghumidity ?? null,
                temp_min_c: d.mintemp_c ?? null,
                temp_max_c: d.maxtemp_c ?? null,
                temp_min_f: d.mintemp_f ?? null,
                temp_max_f: d.maxtemp_f ?? null,
                totalprecip_mm: d.totalprecip_mm ?? null,
                daily_chance_of_rain: d.daily_chance_of_rain ?? null,
                text: d.condition.text || '',
                icon: d.condition.icon || '',
            }
        }
        
        weatherCache[cacheKey] = result
        saveToLocalCache(cacheKey, result)
        return result
    } catch (err) {
        console.warn('Weather fetch Failed: ', err)
        return null
    }
}

