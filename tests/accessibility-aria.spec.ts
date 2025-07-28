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
    await expect(pomodoro.tablist.getByRole('tab', { name: /10\/5/ })).toBeVisible();
    await expect(pomodoro.tablist.getByRole('tab', { name: /15\/5/ })).toBeVisible();
    await expect(pomodoro.tablist.getByRole('tab', { name: /25\/5/ })).toBeVisible();
    await expect(pomodoro.tablist.getByRole('tab', { name: /35\/5/ })).toBeVisible();
    await expect(pomodoro.tablist.getByRole('tab', { name: /45\/5/ })).toBeVisible();
    await expect(pomodoro.tablist.getByRole('tab', { name: /ustawienia/i })).toBeVisible();
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
    await pomodoro.selectPreset('10/5');
    await expect.poll(async () => await pomodoro.getTimerText()).toContain('00:10');
  });

  test('settings view is accessible and visible', async ({ page }) => {
    const pomodoro = new PomodoroPage(page);
    await pomodoro.goto();
    await pomodoro.selectPreset('Ustawienia');
    await expect(pomodoro.timerPanel).toContainText(/ustawienia/i);
    await expect(page.getByLabel('Dźwięki')).toBeVisible();
    await expect(page.getByLabel('Głośność')).toBeVisible();
    await expect(page.getByLabel('Powiadomienia')).toBeVisible();
    await expect(page.getByLabel('Wibracje')).toBeVisible();
  });
});
