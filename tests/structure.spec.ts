import { test, expect } from '@playwright/test';
import { PomodoroPage } from './pages/pomodoro.page';

test.describe('Structure and semantics', () => {
  test('page contains semantic landmarks and accessible elements', async ({ page }) => {
    const pomodoro = new PomodoroPage(page);
    await pomodoro.goto();
    await expect(pomodoro.banner).toBeVisible();
    await expect(pomodoro.main).toBeVisible();
    await expect(pomodoro.contentInfo).toBeVisible();
    await expect(pomodoro.startButton).toBeVisible();
    await expect(pomodoro.resetButton).toBeVisible();
    await expect(pomodoro.statsHeading).toBeVisible();
  });
});
