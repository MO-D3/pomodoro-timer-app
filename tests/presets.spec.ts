import { test, expect } from '@playwright/test';
import { PomodoroPage } from './pages/pomodoro.page';

test.describe('Preset switching', () => {
  test('selecting presets updates timer duration', async ({ page }) => {
    const pomodoro = new PomodoroPage(page);
    await pomodoro.goto();
    await expect(await pomodoro.getTimerText()).toContain('25:00');
    await pomodoro.selectPreset('15/5');
    await expect(await pomodoro.getTimerText()).toContain('15:00');
    await pomodoro.selectPreset('35/5');
    await expect(await pomodoro.getTimerText()).toContain('35:00');
    await pomodoro.selectPreset('45/5');
    await expect(await pomodoro.getTimerText()).toContain('45:00');
  });
});
