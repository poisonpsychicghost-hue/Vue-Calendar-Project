// src/api/googleAuth.js
// Handles all Google Identity Services auth logic.
// GoogleLogin.vue imports from here and stays as a thin template only.

import { useCalendarStore } from '../stores/calendarStore'
import { loadPersistedUser } from '../stores/persistPlugin'

const SDK_TIMEOUT_MS = 10000 // 10 seconds before giving up on SDK load

// --- JWT utility ---

function parseJwt(token) {
  if (!token) return {}
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return {}
  }
}

// --- SDK loader ---
// Polls for the Google SDK with a timeout.
// Returns a promise that resolves when the SDK is ready,
// or rejects after SDK_TIMEOUT_MS milliseconds.

export function waitForGoogleSDK() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve()
      return
    }

    const start = Date.now()
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(interval)
        resolve()
      } else if (Date.now() - start >= SDK_TIMEOUT_MS) {
        clearInterval(interval)
        reject(new Error('Google SDK failed to load within the timeout period.'))
      }
    }, 100)
  })
}

// --- Initialize and render the Google Sign-In button ---
// Call this after waitForGoogleSDK() resolves.
// buttonEl: the DOM element to render the button into.

export function initGoogleAuth(buttonEl) {
  window.google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: handleGoogleCallback,
    ux_mode: 'popup'
  })

  window.google.accounts.id.renderButton(buttonEl, {
    theme: 'outline',
    size: 'large'
  })
}

// --- Auth callback ---
// Called by Google SDK after the user completes sign-in.

function handleGoogleCallback(response) {
  if (!response.credential) return

  const profile = parseJwt(response.credential)
  if (!profile.sub) return

  const store = useCalendarStore()

  store.googleSub = profile.sub
  store.userName = profile.name || ''
  store.userEmail = profile.email || ''
  store.isLoggedIn = true

  // Load this user's persisted todos and notes from localStorage
  loadPersistedUser(store, profile.sub)
}

// --- Logout ---
// Clears all auth and user state from the store.
// localStorage wipe is handled by persistPlugin's $subscribe.

export function logoutGoogle() {
  const store = useCalendarStore()

  // Revoke Google session if SDK is still available
  if (window.google?.accounts?.id) {
    window.google.accounts.id.disableAutoSelect()
  }

  store.logout()
}