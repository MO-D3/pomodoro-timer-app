
# Pomodoro With Me

Pomodoro With Me is a minimalist, accessible Pomodoro timer app for focused work and breaks. Choose from presets or set custom times, track your daily stats, and enjoy optional lofi music, sounds, and notifications. All preferences are private and stored locally—no accounts or tracking. The app is fully keyboard-accessible, responsive, and tested end-to-end.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Playwright, ESLint, Prettier.

**Main scripts (package.json):**
- `dev`: Start the Vite development server
- `build`: Build the app for production
- `preview`: Preview the production build
- `regression`: Run all Playwright end-to-end tests
- `lint`: Run ESLint on all source files
- `format`: Format code with Prettier

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
