import { test, expect } from '@playwright/test';
import { PomodoroPage } from './pages/pomodoro.page';

test.describe('Keyboard interactions', () => {
  test('space/enter toggles and r resets', async ({ page }) => {
    const pomodoro = new PomodoroPage(page);
    await pomodoro.goto();
    await expect(await pomodoro.isPaused()).toBeTruthy();
    await page.keyboard.press('Space');
    await expect(await pomodoro.isWork()).toBeTruthy();
    await page.keyboard.press('Enter');
    await expect(await pomodoro.isPaused()).toBeTruthy();
    page.on('dialog', (dialog) => dialog.accept());
    await page.keyboard.press('r');
    await expect.poll(async () => await pomodoro.getTimerText()).toContain('25:00');
  });
});
