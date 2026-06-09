# Vue Calendar App

A full-featured personal calendar built with Vue 3 — featuring Google OAuth, live weather data, drag-and-drop todos, recurring tasks, four themes, and localStorage persistence.

> Built from scratch in under one month as a self-directed project to demonstrate full frontend stack coverage with the Vue ecosystem.

---

## Live Demo

🔗 [View on Netlify](#) *(link coming soon)*

Sign in with any Google account to access your personal calendar. All data is isolated per user.

---

## Features

**Calendar Views**
- Month, Week, and Day views with smooth fade transitions
- Navigate by prev/next buttons or dropdown selectors
- Click any day cell to drill down to the daily view

**Todos**
- Add, remove, and drag-to-reorder todos per day
- Todo density coloring on the month grid (green → yellow → red)
- Recurring tasks — set monthly (by day of month) or weekly (by day of week)
- Import recurring tasks to any date with one click

**Notes**
- Free-form daily notes field, persisted per day per user

**Weather**
- Live weather data via [WeatherAPI.com](https://www.weatherapi.com/)
- Current conditions, forecasts (up to 14 days ahead), and history (from 2020)
- Displays on month grid, week cells, and daily banner
- Supports °F / °C toggle
- Per-location weather with multiple saved locations
- 24-hour localStorage cache to minimize API calls

**Authentication**
- Google Sign-In via Google Identity Services (OAuth 2.0)
- User data (todos, notes) namespaced per Google account in localStorage
- Full data wipe on logout — no data leaks between users

**Themes**
- Four themes: Dark, Light, Ocean, Forest
- Each has a distinct visual personality
- Light mode designed as an accessibility/high-contrast mode
- Fully variable-driven CSS theme system

**Responsive**
- Mobile, tablet, and desktop layouts
- Week view scrolls horizontally on small screens
- Month grid compresses gracefully on mobile

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| State | Pinia with custom localStorage persist plugin |
| Auth | Google Identity Services (OAuth 2.0) |
| Weather | WeatherAPI.com REST API |
| Dates | date-fns |
| Styling | CSS custom properties (four-theme variable system) |
| Build | Vite |
| Deploy | Netlify |

---

## Running Locally

**1. Clone the repo**
```bash
git clone https://github.com/poisonpsychicghost-hue/Vue-Calendar-Project.git
cd Vue-Calendar-Project
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the project root:
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_WEATHER_API_KEY=your_weatherapi_key_here
```

See setup guides below for obtaining these keys.

**4. Start the dev server**
```bash
npm run dev
```

**5. Open in browser**
```
http://localhost:5173
```

---

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Set application type to **Web application**
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (local dev)
   - `https://your-netlify-url.netlify.app` (production)
7. Copy the **Client ID** into your `.env` as `VITE_GOOGLE_CLIENT_ID`
8. Add the Google Identity Services script to your `index.html`:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

---

## WeatherAPI Setup

1. Sign up for a free account at [weatherapi.com](https://www.weatherapi.com/)
2. Copy your API key from the dashboard
3. Add it to your `.env` as `VITE_WEATHER_API_KEY`

Free tier includes:
- Current weather
- 3-day forecast (this app uses up to 14 days on paid tier — free tier will return errors beyond 3 days)
- Weather history from 2020 onwards

---

## Netlify Deployment

**Option A — Netlify CLI**
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

**Option B — Netlify Dashboard**
1. Push your repo to GitHub
2. Log in to [netlify.com](https://netlify.com) and click **Add new site → Import from Git**
3. Select your repository
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Click **Show advanced** and add your environment variables:
   - `VITE_GOOGLE_CLIENT_ID`
   - `VITE_WEATHER_API_KEY`
7. Click **Deploy site**

**After deploying:**
- Copy your Netlify URL (e.g. `https://your-app.netlify.app`)
- Add it to your Google OAuth authorized origins in the Cloud Console

---

## Known Limitations

- **WeatherAPI free tier** — forecast limited to 3 days ahead (app supports up to 14 days on paid tier). History available from 2020.
- **Google OAuth** — requires an approved OAuth client ID. The consent screen may show "unverified app" warning for non-published projects — this is expected for portfolio/demo use.
- **localStorage only** — user data is stored in the browser. Clearing browser data will erase todos and notes. No cloud sync.
- **Single browser** — data does not sync across devices or browsers.
- **No offline support** — weather fetches require an active network connection.

---

## Project Structure

```
src/
├── api/
│   ├── dateController.js   # date-fns helpers for month/week generation
│   ├── googleAuth.js       # Google Identity Services auth layer
│   └── weather.js          # WeatherAPI fetch with two-layer cache
├── components/
│   ├── CalendarView.vue    # View router + toolbar
│   ├── DailyView.vue       # Day layout
│   ├── WeeklyView.vue      # Week grid
│   ├── MonthlyView.vue     # Month grid with todo density
│   ├── WeatherBanner.vue   # Weather display (monthly/weekly/daily modes)
│   ├── GoogleLogin.vue     # Login page
│   ├── userPrefs.vue       # Preferences panel
│   ├── ToDoList.vue        # Todo card with drag-to-reorder
│   ├── NoteField.vue       # Daily notes card
│   └── InputField.vue      # Reusable labeled input component
├── stores/
│   ├── calendarStore.js    # Pinia store — all app state
│   └── persistPlugin.js    # Per-user localStorage persistence plugin
├── styles/
│   └── themes.css          # Four-theme CSS variable system + global styles
├── utils/
│   └── calendarHelpers.js  # Shared constants and helpers
├── App.vue                 # Root component + view transitions
└── main.js                 # App entry point
```

---

## What This Demonstrates

This project was built to cover the full surface area of modern frontend development in a single, cohesive application:

- **State management** — Pinia store with getters, actions, and a custom persistence plugin
- **Third-party OAuth** — Google Identity Services integration with JWT parsing and session handling
- **REST API integration** — WeatherAPI with multi-layer caching strategy (in-memory + localStorage)
- **Component architecture** — modular, store-driven components with clear separation of concerns
- **CSS architecture** — four-theme variable system with responsive breakpoints and accessibility considerations
- **Native browser APIs** — HTML5 drag-and-drop for todo reordering
- **Date handling** — date-fns throughout with timezone-safe formatting
- **Security** — per-user data namespacing, PII wipe on logout, environment variable management

---

Weather data provided by [WeatherAPI.com](https://www.weatherapi.com/)

---

## Development Notes

**AI-Assisted Polish Phase**

The core application — architecture, store design, component logic, API integration, authentication flow, and initial styling — was written independently as a self-directed learning project.

A structured polish phase was completed with the assistance of Claude (Anthropic) covering:

- Codebase audit and bug identification (29 tracked issues resolved)
- Code modularization — extraction of auth logic, shared utilities, and reusable components
- CSS theme system design and implementation (four themes, CSS custom properties, responsive breakpoints)
- Error handling patterns for weather fetch failures and auth session management
- Security review — per-user localStorage namespacing, PII wipe on logout, environment variable audit
- README and documentation

The AI served as a senior code reviewer and pair programmer — identifying issues, proposing solutions, and producing corrected files — while all architectural and design decisions were made collaboratively with explicit approval at each step. No code was accepted without review and in-browser testing.

This workflow reflects real-world professional practice: using available tools deliberately and transparently, maintaining ownership of the codebase, and validating every change before shipping.