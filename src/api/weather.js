const API_Key = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.weatherapi.com/v1'

const weatherCache = {}

function saveToLocalCache(dateStr, data) {
    try {
        localStorage.setItem(`weather-${dateStr}`, JSON.stringify( {data, time: Date.now() }))
    } catch {}
}

function loadFromLocalCache(dateStr, maxAgems = 24 * 60 * 60 * 1000) {
    try {
        const raw = localStorage.getItem(`weather-${dateStr}`)
        if (!raw) return null
        const { data, time } = JSON.parse(raw)
        if (Date.now() - time > maxAgeMS) return null
        return data
    } catch {
        return null
    }
}

export async function getWeather(dateStr = '', location = 'Atlanta,GA') {
    const cacheKey = `${location}:${dateStr}`
    if (weatherCache[cacheKey]) return weatherCache[cacheKey]

    const localData = loadFromLocalCache(cacheKey)
    if (localData) return localData


    const url = `${BASE_URL}/history.json?key=${API_Key}&q=${location}&dt=${dateStr}`;

    try {
        const response = await fetch(url)
        if(!response.ok) throw new Error(`API error ${response.status}`)
        const data = await response.json()
        const result =  {
            condition: data.forecast?.forecastday[0]?.day?.condition?.text || '',
            icon: data.forecast?.forecastday[0]?.day?.condition?.icon || '',
            temp: data.forecast?.forecastday[0]?.day?.avgtemp_f || null,
        }
        weatherCache[cacheKey] = result
        saveToLocalCache(cacheKey, result)
        return result
    } catch (err) {
        console.warn('Weather fetch Failed: ', err)
        return null
    }
}
