# SafeSpace Client

React (Vite) frontend for the SafeSpace platform — an anonymous peer support and counselor-connect app themed around a warm "Coffee & Comfort" look and feel.

## Setup

```bash
npm install
npm run dev
```

The dev server proxies `/api` to `http://localhost:5000` (see `vite.config.js`). To point at a different backend, set `VITE_API_URL` in a `.env` file in this directory.

To enable Web Push (booking-status notifications), also set
`VITE_VAPID_PUBLIC_KEY` in that `.env` — it must match the public half of
the backend's VAPID key pair (see `backend/README.md`). Without it, the
push-notification toggle in Profile simply doesn't appear.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |
| `npm test` | Run the Vitest suite |

## Structure

- `src/` — components, pages, and app logic
- `src/components/Icon.jsx` — hand-built line-icon set used throughout the UI (no emoji, no icon font)
- `src/utils/pushNotifications.js` — Web Push subscribe/unsubscribe helpers
- `public/sw.js` — service worker; handles incoming Web Push events and notification clicks
- `public/` — static assets

See the [root README](../README.md) for the full product feature list, API routes, and the design theme, and [BUILDPLAN.md](../BUILDPLAN.md) for the original subsystem design.


## Performance and accessibility verification

Run `npm run build` then `npm run test:e2e` (install Chromium once with
`npx playwright install chromium` if needed). The browser suite uses the
production preview and mocked API responses. It covers skip navigation,
mobile drawer keyboard focus and Escape, login submission and error alerts,
the welcome cards and reduced-motion support, and verifies the intro has no
media player or playback controls. `npm test` runs the unit tests.

Pages load by route. The welcome section uses native HTML and a short CSS
animation that settles in under five seconds. It has no player controls or
Remotion download and respects reduced-motion preferences. All three steps
remain available as text. Chunk sizes are build measurements, not Lighthouse scores.
The previously recorded performance and accessibility scores must be rerun
against the final deployed build before reporting updated numbers.

A real screen-reader review remains manual. With NVDA + Firefox/Chrome or
VoiceOver + Safari, verify the following on home, threads, counselors, calm,
inspiration, login, register, and forgot-password:

- Landmarks and heading navigation follow the page order; skip navigation moves to main.
- Links, form fields, and buttons have useful spoken names.
- Opening the mobile menu announces its dialog; focus stays inside and Escape returns to its toggle.
- Login validation errors are announced; passwords and nicknames support autofill.
- All three intro steps are available in reading order; reduced motion disables their entrance animation.
- At 200% zoom, and with reduced motion enabled, content and controls remain usable.

Record browser/assistive-technology versions and observed results. Automated
browser and Lighthouse checks do not establish completion of this review.
