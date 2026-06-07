// Persists todosByDate and notesByDate to localStorage, namespaced per user.
// Storage key format: 'calendar-persist-{googleSub}'
// This ensures no data leaks between users on the same browser.

const PERSIST_KEYS = ['todosByDate', 'notesByDate']

function storageKey(sub) {
  return `calendar-persist-${sub}`
}

function loadUserData(sub) {
  if (!sub) return null
  try {
    const raw = localStorage.getItem(storageKey(sub))
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveUserData(sub, state) {
  if (!sub) return
  try {
    const out = {}
    PERSIST_KEYS.forEach(key => out[key] = state[key])
    localStorage.setItem(storageKey(sub), JSON.stringify(out))
  } catch {
    // localStorage unavailable or full — fail silently
  }
}

function clearUserData(sub) {
  if (!sub) return
  try {
    localStorage.removeItem(storageKey(sub))
  } catch {}
}

export function persistPlugin({ store }) {
  // Watch for login: when googleSub is set, load that user's data
  store.$subscribe((mutation, state) => {
    const sub = state.googleSub

    // On logout, wipe the user's localStorage key
    if (!state.isLoggedIn && sub) {
      clearUserData(sub)
      return
    }

    // Only persist when a user is logged in
    if (!state.isLoggedIn || !sub) return

    saveUserData(sub, state)
  })

  // On app load, if a user is already logged in (e.g. store was
  // rehydrated by another mechanism), load their persisted data
  const sub = store.googleSub
  if (sub && store.isLoggedIn) {
    const data = loadUserData(sub)
    if (data) {
      PERSIST_KEYS.forEach(key => {
        if (data[key]) store[key] = data[key]
      })
    }
  }
}

// Called from googleAuth.js after successful login to load the
// newly authenticated user's persisted data into the store
export function loadPersistedUser(store, sub) {
  if (!sub) return
  const data = loadUserData(sub)
  if (data) {
    PERSIST_KEYS.forEach(key => {
      if (data[key]) store[key] = data[key]
    })
  }
}