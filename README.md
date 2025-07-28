# pomodoro with me

Minimalist Pomodoro timer SPA built with React, TypeScript, Vite, and Tailwind CSS. No accounts, no cloud, no tracking—just focus. Choose from several work/break presets, enjoy automatic phase switching, configurable sounds, browser notifications, vibration, and daily stats. Fully accessible (WCAG 2.2 AA), keyboard-friendly, and tested with Playwright.

## Features

- **Accessible**: All UI and ARIA structure meets WCAG 2.2 AA. Keyboard navigation, focus rings, skip link, and screen reader support.
- **Presets**: Quick switch between 10/5 (test), 15/5, 25/5, 35/5, and 45/5 minute Pomodoro cycles.
- **Timer**: Accurate countdown with drift correction, auto-start for work/break (configurable), and clear status indication.
- **Sounds**: Optional ticking and end sounds, with adjustable volume.
- **Notifications**: Browser notifications and vibration support (configurable).
- **Stats**: Tracks completed Pomodoros and total work minutes for today (local only).
- **Settings**: All preferences stored in localStorage, no cloud or account needed.
- **PWA-ready**: Installable, works offline, and mobile-friendly.

## Getting Started

Requires Node.js (>=18).

```bash
git clone https://github.com/your-username/pomodoro-with-me.git
cd pomodoro-with-me
npm install
npm run dev    # start dev server at http://localhost:5173

# End-to-end tests
npx playwright install   # install Playwright browsers (once)
npm run test                 # run all e2e tests
```

## Project Structure

```
pomodoro-with-me/
  index.html               – main HTML file with meta tags and skip link
  package.json             – scripts and dependencies
  vite.config.ts           – Vite config
  tailwind.config.js       – Tailwind theme (muted blue/green palette)
  postcss.config.cjs       – PostCSS config
  tsconfig.json            – TypeScript config
  public/
    favicon.*              – favicon assets
    manifest.webmanifest   – PWA manifest
    logo.png/svg           – logo assets
  src/
    app.css                – Tailwind and accessibility styles
    main.tsx               – React entry point
    components/
      Layout.tsx           – page layout (banner, main, footer)
      Timer.tsx            – circular timer with progress
      Controls.tsx         – start/pause/reset controls
      PresetSelector.tsx   – preset tablist
      Settings.tsx         – settings panel
      StatsToday.tsx       – daily stats
    hooks/
      useTimer.ts          – timer logic with drift correction
      useLocalStorage.ts   – safe localStorage hook
      useAudio.ts          – audio preloading and playback
      useNotifications.ts  – browser notification hook
    lib/
      format.ts            – time formatting helper
    pages/
      Home.tsx             – main page (all components)
  tests/
    pages/pomodoro.page.ts – Playwright Page Object Model
    structure.spec.ts      – structure/landmarks test
    accessibility-aria.spec.ts – ARIA snapshots
    presets.spec.ts        – preset switching test
    timer.spec.ts          – timer controls and transitions
    keyboard.spec.ts       – keyboard navigation test
  playwright.config.ts     – Playwright config
```

## Accessibility

- All interactive elements are reachable and operable by keyboard.
- ARIA roles, labels, and live regions for timer and status.
- Focus-visible outlines for all controls.
- Landmarks: banner, main, contentinfo, tablist, tabpanel.
- Settings and stats are accessible and screen-reader friendly.

## Testing

- **Playwright**: All e2e tests use Playwright with a reusable Page Object Model.
- **Test presets**: Includes a 10s/5s preset for fast timer tests.
- **Coverage**: Structure, ARIA, keyboard, timer, and preset switching are all tested.

## Roadmap / Ideas

- Export/import settings as JSON (no cloud sync, privacy-first).
- More stats and analytics (local only).
- Customizable presets.

---

© 2025 pomodoro with me. MIT License.
