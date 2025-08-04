import { test, expect } from '@playwright/test';
import { PomodoroPage } from './pages/pomodoro.page';

test.describe('ARIA structure', () => {
  test('default view has correct ARIA structure', async ({ page }) => {
    const pomodoro = new PomodoroPage(page);
    await pomodoro.goto();
    await expect(pomodoro.banner).toBeVisible();
    await expect(pomodoro.banner).toContainText('pomodoro with me');
    await expect(pomodoro.main).toBeVisible();
    await expect(pomodoro.tablist).toBeVisible();
    await expect(pomodoro.tablist.getByRole('tab', { name: /Custom/ })).toBeVisible();
    await expect(pomodoro.tablist.getByRole('tab', { name: /15\/5/ })).toBeVisible();
    await expect(pomodoro.tablist.getByRole('tab', { name: /25\/5/ })).toBeVisible();
    await expect(pomodoro.tablist.getByRole('tab', { name: /35\/5/ })).toBeVisible();
    await expect(pomodoro.tablist.getByRole('tab', { name: /45\/5/ })).toBeVisible();
    await expect(pomodoro.tablist.getByRole('tab', { name: /Settings/i })).toBeVisible();
    await expect(pomodoro.timerPanel).toBeVisible();
    await expect(pomodoro.startButton).toBeVisible();
    await expect(pomodoro.resetButton).toBeVisible();
    await expect(pomodoro.statsHeading).toBeVisible();
    await expect(pomodoro.contentInfo).toBeVisible();
    await expect(pomodoro.contentInfo).toContainText('pomodoro with me');
  });

  test('changing preset updates timer and tabpanel', async ({ page }) => {
    const pomodoro = new PomodoroPage(page);
    await pomodoro.goto();
    await pomodoro.selectPreset('35/5');
    await expect.poll(async () => await pomodoro.getTimerText()).toContain('35:00');
    await pomodoro.selectPreset('Custom');
    await pomodoro.setCustomWork(10);
    await pomodoro.setCustomBreak(5);
    await expect.poll(async () => await pomodoro.getTimerText()).toContain('10:0');
  });

  test('settings view is accessible and visible', async ({ page }) => {
    const pomodoro = new PomodoroPage(page);
    await pomodoro.goto();
    await pomodoro.selectPreset('Settings');
    await expect(pomodoro.timerPanel).toContainText(/Settings/i);
    await expect(page.getByLabel('Sounds')).toBeVisible();
    await expect(page.getByLabel('Volume')).toBeVisible();
    await expect(page.getByLabel('Notifications')).toBeVisible();
    await expect(page.getByLabel('Vibrations')).toBeVisible();
  });
});

test.describe('Music play/pause accessibility', () => {
  test('music play/pause button is accessible and toggles state', async ({ page }) => {
    const pomodoro = new PomodoroPage(page);
    await pomodoro.goto('?test=1');
    await pomodoro.selectPreset('Custom');
    // Play music button should be visible and accessible
    const playButton = page.getByRole('button', { name: /play music/i });
    await expect(playButton).toBeVisible();
    await playButton.click();
    // After click, button should toggle to pause
    const pauseButton = page.getByRole('button', { name: /pause music/i });
    await expect(pauseButton).toBeVisible();
    await pauseButton.click();
    // Should toggle back to play
    await expect(playButton).toBeVisible();
  });
});

test.describe('Custom Focus Time and Break Time inputs', () => {
  test('inputs are accessible and update timer', async ({ page }) => {
    const pomodoro = new PomodoroPage(page);
    await pomodoro.goto('?test=1');
    await pomodoro.selectPreset('Custom');
    const focusInput = page.getByRole('spinbutton', { name: /focus time/i });
    const breakInput = page.getByRole('spinbutton', { name: /break time/i });
    await expect(focusInput).toBeVisible();
    await expect(breakInput).toBeVisible();
    // Set values and check timer updates
    await focusInput.fill('10');
    await breakInput.fill('5');
    await expect.poll(async () => await pomodoro.getTimerText()).toContain('00:10');
    // Start timer, wait for work to finish, check break time
    await pomodoro.startButton.click();
    await page.waitForTimeout(11000);
    await expect(await pomodoro.isPaused()).toBeTruthy();
    await expect.poll(async () => await pomodoro.getTimerText()).toContain('00:05');
  });
  test('inputs have correct ARIA attributes', async ({ page }) => {
    const pomodoro = new PomodoroPage(page);
    await pomodoro.goto('?test=1');
    await pomodoro.selectPreset('Custom');
    const focusInput = page.getByRole('spinbutton', { name: /focus time/i });
    const breakInput = page.getByRole('spinbutton', { name: /break time/i });
    // Check native min/max attributes (since aria-valuemin/aria-valuemax are not present)
    await expect(focusInput).toHaveAttribute('min', '1');
    await expect(focusInput).toHaveAttribute('max', '600');
    await expect(breakInput).toHaveAttribute('min', '1');
    await expect(breakInput).toHaveAttribute('max', '600');
  });
});
