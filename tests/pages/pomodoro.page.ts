import { Page, Locator } from '@playwright/test';

export class PomodoroPage {
  readonly page: Page;
  readonly banner: Locator;
  readonly main: Locator;
  readonly tablist: Locator;
  readonly timerPanel: Locator;
  readonly startButton: Locator;
  readonly pauseButton: Locator;
  readonly resetButton: Locator;
  readonly statsHeading: Locator;
  readonly contentInfo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.banner = page.getByRole('banner');
    this.main = page.getByRole('main');
    this.tablist = page.getByRole('tablist');
    this.timerPanel = page.getByRole('tabpanel');
    this.startButton = page.getByRole('button', { name: /start/i });
    // Use exact match for timer pause button to avoid music pause
    this.pauseButton = page.getByRole('button', { name: /^Pause$/, exact: true });
    this.resetButton = page.getByRole('button', { name: /reset/i });
    this.statsHeading = page.getByRole('heading', { name: /today's stats/i });
    this.contentInfo = page.getByRole('contentinfo');
  }

  async goto(query: string = '') {
    // Use relative navigation so Playwright baseURL can include a subpath (e.g., /<repo>/ on CI)
    const path = query
      ? (query.startsWith('/') ? `.${query}` : `./${query}`)
      : './';
    await this.page.goto(path);
  }
  async setCustomWork(value: number) {
    const input = this.page.getByLabel(/Focus Time/i);
    await input.fill(String(value));
  }

  async setCustomBreak(value: number) {
    const input = this.page.getByLabel(/Break Time/i);
    await input.fill(String(value));
  }

  async selectPreset(label: string) {
    await this.tablist.getByRole('tab', { name: new RegExp(label, 'i') }).click();
  }

  async getTimerText() {
    // Zwraca pierwszy tekst w formacie MM:SS
    const match = await this.timerPanel.innerText();
    const found = match.match(/\d{2}:\d{2}/);
    return found ? found[0] : '';
  }

  async isPaused() {
    return this.timerPanel.locator('[aria-label="Status sesji"]', { hasText: 'Paused' }).isVisible();
  }

  async isWork() {
    // Only match the status label, not summary text
    return this.timerPanel.locator('[aria-label="Status sesji"]', { hasText: 'Work' }).isVisible();
  }

  async isBreak() {
    return this.timerPanel.locator('[aria-label="Status sesji"]', { hasText: 'Break' }).isVisible();
  }
}
