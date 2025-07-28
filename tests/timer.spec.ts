import { test, expect } from '@playwright/test';
import { PomodoroPage } from './pages/pomodoro.page';

test.describe('Timer controls', () => {
  test('start, pause and reset actions work', async ({ page }) => {
    const pomodoro = new PomodoroPage(page);
    await pomodoro.goto();
    await expect(await pomodoro.isPaused()).toBeTruthy();
    await pomodoro.startButton.click();
    await expect(await pomodoro.isWork()).toBeTruthy();
    await pomodoro.pauseButton.click();
    await expect(await pomodoro.isPaused()).toBeTruthy();
    page.on('dialog', (dialog) => dialog.accept());
    await pomodoro.resetButton.click();
    await expect(await pomodoro.getTimerText()).toContain('25:00');
  });
});

test.describe('Timer 10/5 test preset', () => {
  test.only('should count down 10 seconds work, then 5 seconds break', async ({ page }) => {
    const pomodoro = new PomodoroPage(page);
    await pomodoro.goto();
    await pomodoro.selectPreset('10/5');
    await expect.poll(async () => await pomodoro.getTimerText()).toContain('00:10');
    await pomodoro.startButton.click();
    await page.waitForTimeout(11000);
    await expect(await pomodoro.isPaused()).toBeTruthy();
    await expect.poll(async () => await pomodoro.getTimerText()).toContain('00:05');
    await pomodoro.startButton.click();
    await page.waitForTimeout(6000);
    await expect(await pomodoro.isWork()).toBeFalsy();
    await expect.poll(async () => await pomodoro.getTimerText()).toContain('00:10');
  });
});
