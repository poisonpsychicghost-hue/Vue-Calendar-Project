const API_Key = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.weatherapi.com/v1'

export async function getWeather(dateStr = '', location = 'Atlanta,GA') {
    const url = `${BASE_URL}/history.json?key=${API_Key}&q=${location}&dt=${dateStr}`;

    try {
        const response = await fetch(url)
        if(!response.ok) throw new Error(`API error ${response.status}`)
        const data = await response.json()

        return {
            condition: data.forecast?.forecastday[0]?.day?.condition?.text || '',
            icon: data.forecast?.forecastday[0]?.day?.condition?.icon || '',
            temp: data.forecast?.forecastday[0]?.day?.avgtemp_f || null,
            raw: data 
        }
    } catch (err) {
        console.warn('Weather fetch Failed: ', err)
        return null
    }
}
