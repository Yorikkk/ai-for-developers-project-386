# Тесты для страницы каталога бронирования

## Обзор
Этот документ содержит подробное описание E2E тестов для страницы каталога бронирования (`/book`), которые должны быть реализованы с использованием Playwright.

## Структура тестов

### Файлы
```
frontend/
  tests/
    booking-catalog/
      booking-catalog.spec.ts      # Основные тесты
      api-integration.spec.ts      # Тесты интеграции с API
    helpers/
      test-utils.ts                # Вспомогательные функции
  playwright.config.ts             # Конфигурация Playwright
```

## Зависимости
Необходимо установить Playwright:
```bash
cd frontend
npm install --save-dev @playwright/test
npx playwright install
```

## Конфигурация Playwright

### `frontend/playwright.config.ts`
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
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
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

## Тестовые сценарии

### 1. Базовая загрузка страницы (`booking-catalog.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Страница каталога бронирования', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/book`);
  });

  test('должна загружаться корректно', async ({ page }) => {
    // Проверяем наличие заголовка
    await expect(page.getByRole('heading', { name: 'Выберите тип события' })).toBeVisible();
    
    // Проверяем наличие подзаголовка
    await expect(page.getByText('Нажмите на карточку, чтобы открыть календарь и выбрать удобный слот')).toBeVisible();
  });
});
```

### 2. Отображение карточек типов событий

```typescript
test('должна отображать карточки типов событий', async ({ page }) => {
  // Проверяем, что есть хотя бы одна карточка
  const cards = page.locator('.event-type-card');
  await expect(cards).toHaveCount(3); // По умолчанию 3 fallback карточки
  
  // Проверяем, что у каждой карточки есть информация о длительности
  for (let i = 0; i < 3; i++) {
    const card = cards.nth(i);
    await expect(card.locator('.event-type-duration-badge')).toBeVisible();
    await expect(card.locator('.event-type-card-title')).toBeVisible();
    await expect(card.locator('.event-type-card-subtitle')).toBeVisible();
  }
});
```

### 3. Навигация при клике на карточку

```typescript
test('должна переходить на страницу выбора слотов при клике на карточку', async ({ page }) => {
  // Кликаем на первую карточку
  const firstCard = page.locator('.event-type-card').first();
  await firstCard.click();
  
  // Проверяем, что произошел переход на страницу с параметром eventTypeId
  await expect(page).toHaveURL(/\/book\/\w+/);
  
  // Проверяем, что загрузилась страница выбора слотов
  await expect(page.getByText('Выберите дату и время')).toBeVisible();
});
```

### 4. Состояние загрузки

```typescript
test('должна отображать состояние загрузки', async ({ page }) => {
  // Мокаем медленный ответ API чтобы увидеть скелетоны
  await page.route('**/event-types', async route => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: '1', title: 'Быстрая встреча', durationMinutes: 15 },
        { id: '2', title: 'Стандартная встреча', durationMinutes: 30 },
      ])
    });
  });

  await page.reload();
  
  // Проверяем, что скелетоны отображаются
  const skeletons = page.locator('.mantine-Skeleton-root');
  await expect(skeletons.first()).toBeVisible();
  
  // Ждем исчезновения скелетонов
  await expect(skeletons.first()).not.toBeVisible({ timeout: 10000 });
});
```

### 5. Работа с API (`api-integration.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Интеграция с API на странице каталога', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/book`);
  });

  test('должна использовать fallback данные при ошибке API', async ({ page }) => {
    await page.route('**/event-types', async route => {
      await route.abort('failed');
    });

    await page.reload();
    await page.waitForTimeout(1000);
    
    const cards = page.locator('.event-type-card');
    await expect(cards).toHaveCount(3);
    await expect(page.getByText('Быстрая встреча')).toBeVisible();
  });

  test('должна отображать данные из API при успешном запросе', async ({ page }) => {
    await page.route('**/event-types', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'api-1', title: 'API Встреча 1', durationMinutes: 45 },
          { id: 'api-2', title: 'API Встреча 2', durationMinutes: 90 },
        ])
      });
    });

    await page.reload();
    await page.waitForTimeout(1000);
    
    await expect(page.getByText('API Встреча 1')).toBeVisible();
    await expect(page.getByText('API Встреча 2')).toBeVisible();
    await expect(page.getByText('45 мин')).toBeVisible();
    await expect(page.getByText('90 мин')).toBeVisible();
  });
});
```

## Вспомогательные функции (`test-utils.ts`)

```typescript
import { Page } from '@playwright/test';

export async function mockEventTypesAPI(
  page: Page, 
  data: Array<{id: string, title: string, durationMinutes: number}>,
  delay = 0
) {
  await page.route('**/event-types', async route => {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(data)
    });
  });
}

export async function mockAPIError(page: Page) {
  await page.route('**/event-types', async route => {
    await route.abort('failed');
  });
}

export async function navigateToBookingCatalog(page: Page) {
  await page.goto('/book');
  await page.waitForLoadState('networkidle');
}
```

## Скрипты для package.json

Добавить в `frontend/package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:chromium": "playwright test --project=chromium"
  }
}
```

## Запуск тестов

1. Убедиться, что фронтенд и бэкенд запущены:
   ```bash
   # Терминал 1
   cd backend && npm run dev
   
   # Терминал 2  
   cd frontend && npm run dev
   ```

2. Запустить тесты:
   ```bash
   cd frontend
   npm run test:e2e
   ```

3. Для отладки с UI:
   ```bash
   npm run test:e2e:ui
   ```

## Ожидаемые результаты

Все тесты должны проходить успешно при:
- Работающем бэкенде на localhost:3000
- Работающем фронтенде на localhost:5173
- Доступности API endpoint `/event-types`

## Примечания

1. Тесты используют мокирование API для изоляции от реального бэкенда
2. Для тестирования с реальным API нужно запустить бэкенд
3. Селекторы основаны на текущей структуре классов в `BookingCatalogPage.tsx`
4. При изменении UI нужно обновить селекторы в тестах