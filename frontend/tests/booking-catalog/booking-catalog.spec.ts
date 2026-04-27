import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Страница каталога бронирования', () => {
  test.beforeEach(async ({ page }) => {
    // Переходим на страницу каталога перед каждым тестом
    await page.goto(`${BASE_URL}/book`);
  });

  test('должна загружаться корректно', async ({ page }) => {
    // Проверяем наличие заголовка
    await expect(page.getByRole('heading', { name: 'Выберите тип события' })).toBeVisible();
    
    // Проверяем наличие подзаголовка
    await expect(page.getByText('Нажмите на карточку, чтобы открыть календарь и выбрать удобный слот')).toBeVisible();
  });

  test('должна отображать карточки типов событий', async ({ page }) => {
    // Ждем загрузки карточек
    await page.waitForSelector('.event-type-card', { timeout: 10000 });
    
    // Проверяем, что есть хотя бы одна карточка
    const cards = page.locator('.event-type-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
    
    // Проверяем, что у первой карточки есть информация о длительности
    const firstCard = cards.first();
    await expect(firstCard.locator('.event-type-duration-badge')).toBeVisible();
    await expect(firstCard.locator('.event-type-card-title')).toBeVisible();
    await expect(firstCard.locator('.event-type-card-subtitle')).toBeVisible();
  });

  test('должна переходить на страницу выбора слотов при клике на карточку', async ({ page }) => {
    // Ждем загрузки карточек
    await page.waitForSelector('.event-type-card', { timeout: 10000 });
    
    // Кликаем на первую карточку
    const firstCard = page.locator('.event-type-card').first();
    await firstCard.click();
    
    // Проверяем, что произошел переход на страницу с параметром eventTypeId
    await expect(page).toHaveURL(/\/book\/\w+/);
  });

  test('должна отображать состояние загрузки', async ({ page }) => {
    // Мокаем медленный ответ API чтобы увидеть скелетоны
    await page.route('**/event-types', async (route) => {
      // Имитируем задержку в 2 секунды
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', title: 'Быстрая встреча', durationMinutes: 15 },
          { id: '2', title: 'Стандартная встреча', durationMinutes: 30 },
        ]),
      });
    });

    // Перезагружаем страницу чтобы триггерить загрузку
    await page.reload();
    
    // Проверяем, что скелетоны отображаются
    const skeletons = page.locator('.mantine-Skeleton-root');
    await expect(skeletons.first()).toBeVisible({ timeout: 1000 });
    
    // Ждем исчезновения скелетонов
    await expect(skeletons.first()).not.toBeVisible({ timeout: 10000 });
    
    // Проверяем, что карточки отображаются
    await expect(page.locator('.event-type-card').first()).toBeVisible();
  });
});
