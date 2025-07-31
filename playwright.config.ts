import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
const basePath = isCI && process.env.GITHUB_ACTIONS && repo ? `/${repo}/` : '/';
const port = 5173;
const previewURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
  reporter: 'list',
  fullyParallel: true,
  use: {
    baseURL: previewURL + basePath,
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: `npm run preview -- --port=${port}`,
    url: previewURL + basePath,
    reuseExistingServer: !isCI,
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'safari-desktop',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'iphone-latest',
      use: { ...devices['iPhone 15 Pro'] },
    },
    {
      name: 'samsung-latest',
      use: { ...devices['Galaxy S23 Ultra'] },
    },
  ],
});
