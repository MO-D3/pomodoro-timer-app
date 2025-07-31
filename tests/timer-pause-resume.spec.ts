import { test, expect } from '@playwright/test';
import { PomodoroPage } from './pages/pomodoro.page';

test.describe('Timer pause/resume regression', () => {
  test('should not blink/reset timer when resuming after pause', async ({ page }) => {
    const pomodoro = new PomodoroPage(page);
    await pomodoro.goto('?test=1');
    await pomodoro.selectPreset('Custom');
    await pomodoro.setCustomWork(10);
    await pomodoro.setCustomBreak(5);
    await pomodoro.startButton.click();
    await page.waitForTimeout(2000);
    await pomodoro.pauseButton.click();
    const pausedValue = await pomodoro.getTimerText();
    await pomodoro.startButton.click();
    await page.waitForTimeout(200);
    const afterResumeValue = await pomodoro.getTimerText();
    expect(afterResumeValue).toBe(pausedValue);
  });
});
