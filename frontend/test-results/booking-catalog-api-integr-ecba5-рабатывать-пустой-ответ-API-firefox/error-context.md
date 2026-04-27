# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking-catalog\api-integration.spec.ts >> Интеграция с API на странице каталога >> должна корректно обрабатывать пустой ответ API
- Location: tests\booking-catalog\api-integration.spec.ts:58:3

# Error details

```
Error: page.goto: NS_ERROR_CONNECTION_REFUSED
Call log:
  - navigating to "http://localhost:5173/book", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - heading [level=1] [ref=e5]
  - paragraph
  - paragraph
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const BASE_URL = 'http://localhost:5173';
  4  | 
  5  | test.describe('Интеграция с API на странице каталога', () => {
  6  |   test.beforeEach(async ({ page }) => {
> 7  |     await page.goto(`${BASE_URL}/book`);
     |                ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  8  |   });
  9  | 
  10 |   test('должна использовать fallback данные при ошибке API', async ({ page }) => {
  11 |     // Мокаем ошибку API
  12 |     await page.route('**/event-types', async (route) => {
  13 |       await route.abort('failed');
  14 |     });
  15 | 
  16 |     // Перезагружаем страницу
  17 |     await page.reload();
  18 |     
  19 |     // Ждем завершения загрузки
  20 |     await page.waitForTimeout(1000);
  21 |     
  22 |     // Проверяем, что отображаются fallback карточки (3 штуки)
  23 |     const cards = page.locator('.event-type-card');
  24 |     await expect(cards).toHaveCount(3);
  25 |     
  26 |     // Проверяем, что есть карточка с текстом "Быстрая встреча"
  27 |     await expect(page.getByText('Быстрая встреча')).toBeVisible();
  28 |   });
  29 | 
  30 |   test('должна отображать данные из API при успешном запросе', async ({ page }) => {
  31 |     // Мокаем успешный ответ API с кастомными данными
  32 |     await page.route('**/event-types', async (route) => {
  33 |       await route.fulfill({
  34 |         status: 200,
  35 |         contentType: 'application/json',
  36 |         body: JSON.stringify([
  37 |           { id: 'api-1', title: 'API Встреча 1', durationMinutes: 45 },
  38 |           { id: 'api-2', title: 'API Встреча 2', durationMinutes: 90 },
  39 |         ]),
  40 |       });
  41 |     });
  42 | 
  43 |     // Перезагружаем страницу
  44 |     await page.reload();
  45 |     
  46 |     // Ждем завершения загрузки
  47 |     await page.waitForSelector('.event-type-card', { timeout: 10000 });
  48 |     
  49 |     // Проверяем, что отображаются данные из API
  50 |     await expect(page.getByText('API Встреча 1')).toBeVisible();
  51 |     await expect(page.getByText('API Встреча 2')).toBeVisible();
  52 |     
  53 |     // Проверяем длительность (exact: true для точного совпадения, чтобы не находить "45 минут")
  54 |     await expect(page.getByText('45 мин', { exact: true })).toBeVisible();
  55 |     await expect(page.getByText('90 мин', { exact: true })).toBeVisible();
  56 |   });
  57 | 
  58 |   test('должна корректно обрабатывать пустой ответ API', async ({ page }) => {
  59 |     // Мокаем пустой массив от API
  60 |     await page.route('**/event-types', async (route) => {
  61 |       await route.fulfill({
  62 |         status: 200,
  63 |         contentType: 'application/json',
  64 |         body: JSON.stringify([]),
  65 |       });
  66 |     });
  67 | 
  68 |     // Перезагружаем страницу
  69 |     await page.reload();
  70 |     
  71 |     // Ждем завершения загрузки
  72 |     await page.waitForTimeout(1000);
  73 |     
  74 |     // Проверяем, что отображаются fallback карточки
  75 |     const cards = page.locator('.event-type-card');
  76 |     await expect(cards).toHaveCount(3);
  77 |   });
  78 | });
  79 | 
```