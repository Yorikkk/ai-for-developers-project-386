import { defineConfig, devices } from '@playwright/test';

/**
 * Конфигурация Playwright для E2E тестов
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Запуск тестов параллельно */
  fullyParallel: true,
  /* Запрет на использование .only в CI */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use */
  reporter: 'html',

  /* Настройки для всех тестов */
  use: {
    /* Базовый URL приложения */
    baseURL: 'http://localhost:5173',

    /* Собирать трассировку при первом повторе (retry) */
    trace: 'on-first-retry',

    /* Делать скриншот при падении теста */
    screenshot: 'only-on-failure',
  },

  /* Конфигурация для разных браузеров */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
