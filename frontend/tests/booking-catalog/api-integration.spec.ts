import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Интеграция с API на странице каталога', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/book`);
  });

  test('должна использовать fallback данные при ошибке API', async ({ page }) => {
    // Мокаем ошибку API
    await page.route('**/event-types', async (route) => {
      await route.abort('failed');
    });

    // Перезагружаем страницу
    await page.reload();
    
    // Ждем завершения загрузки
    await page.waitForTimeout(1000);
    
    // Проверяем, что отображаются fallback карточки (3 штуки)
    const cards = page.locator('.event-type-card');
    await expect(cards).toHaveCount(3);
    
    // Проверяем, что есть карточка с текстом "Быстрая встреча"
    await expect(page.getByText('Быстрая встреча')).toBeVisible();
  });

  test('должна отображать данные из API при успешном запросе', async ({ page }) => {
    // Мокаем успешный ответ API с кастомными данными
    await page.route('**/event-types', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'api-1', title: 'API Встреча 1', durationMinutes: 45 },
          { id: 'api-2', title: 'API Встреча 2', durationMinutes: 90 },
        ]),
      });
    });

    // Перезагружаем страницу
    await page.reload();
    
    // Ждем завершения загрузки
    await page.waitForSelector('.event-type-card', { timeout: 10000 });
    
    // Проверяем, что отображаются данные из API
    await expect(page.getByText('API Встреча 1')).toBeVisible();
    await expect(page.getByText('API Встреча 2')).toBeVisible();
    
    // Проверяем длительность (exact: true для точного совпадения, чтобы не находить "45 минут")
    await expect(page.getByText('45 мин', { exact: true })).toBeVisible();
    await expect(page.getByText('90 мин', { exact: true })).toBeVisible();
  });

  test('должна корректно обрабатывать пустой ответ API', async ({ page }) => {
    // Мокаем пустой массив от API
    await page.route('**/event-types', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    // Перезагружаем страницу
    await page.reload();
    
    // Ждем завершения загрузки
    await page.waitForTimeout(1000);
    
    // Проверяем, что отображаются fallback карточки
    const cards = page.locator('.event-type-card');
    await expect(cards).toHaveCount(3);
  });
});
