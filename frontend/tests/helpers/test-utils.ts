import { Page } from '@playwright/test';

/**
 * Мокирование API для типов событий
 * @param page - страница Playwright
 * @param data - данные для мока
 * @param delay - задержка в миллисекундах (опционально)
 */
export async function mockEventTypesAPI(
  page: Page,
  data: Array<{ id: string; title: string; durationMinutes: number }>,
  delay = 0
) {
  await page.route('**/event-types', async (route) => {
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(data),
    });
  });
}

/**
 * Мокирование ошибки API
 * @param page - страница Playwright
 */
export async function mockAPIError(page: Page) {
  await page.route('**/event-types', async (route) => {
    await route.abort('failed');
  });
}

/**
 * Навигация на страницу каталога бронирования
 * @param page - страница Playwright
 */
export async function navigateToBookingCatalog(page: Page) {
  await page.goto('/book');
  await page.waitForLoadState('networkidle');
}
