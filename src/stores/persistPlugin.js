export function persistPlugin({ store }) {
  const STORAGE_KEY = 'calendar-persist'
  const keysToPersist = ['todosByDate', 'notesByDate']

  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const data = JSON.parse(saved)
      keysToPersist.forEach(key => {
        if (data[key]) store[key] = data[key]
      })
    } catch (err) {
      console.warn('Could not parse saved calendar data:', err)
    }
  }

  store.$subscribe((mutation, state) => {
    const out = {}
    keysToPersist.forEach(key => out[key] = state[key])
    localStorage.setItem(STORAGE_KEY, JSON.stringify(out))

  })
}