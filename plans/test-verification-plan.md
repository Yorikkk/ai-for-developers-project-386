# План проверки работы тестов

## Цель
Проверить, что созданные E2E тесты для страницы каталога бронирования работают корректно.

## Шаги проверки

### 1. Установка зависимостей
```bash
cd frontend
npm install --save-dev @playwright/test
npx playwright install
```

### 2. Создание структуры тестовых файлов
Создать следующие файлы на основе плана `plans/booking-catalog-tests.md`:
- `frontend/playwright.config.ts`
- `frontend/tests/booking-catalog/booking-catalog.spec.ts`
- `frontend/tests/booking-catalog/api-integration.spec.ts`
- `frontend/tests/helpers/test-utils.ts`

### 3. Обновление package.json
Добавить скрипты для запуска тестов в `frontend/package.json`:
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

### 4. Запуск тестов в различных режимах

#### Режим 1: Быстрый запуск (headless)
```bash
cd frontend
npm run test:e2e
```
**Ожидаемый результат:** Все 6 тестов должны пройти успешно.

#### Режим 2: Запуск с UI для отладки
```bash
npm run test:e2e:ui
```
**Ожидаемый результат:** Открывается Playwright UI с возможностью просмотра и запуска тестов.

#### Режим 3: Запуск в headed режиме (с браузером)
```bash
npm run test:e2e:headed
```
**Ожидаемый результат:** Тесты запускаются в видимом браузере Chrome.

#### Режим 4: Запуск только для Chromium
```bash
npm run test:e2e:chromium
```
**Ожидаемый результат:** Тесты запускаются только в Chrome.

### 5. Проверка отдельных тестовых сценариев

#### Сценарий 1: Базовая загрузка страницы
- Открыть страницу `/book`
- Проверить наличие заголовка "Выберите тип события"
- Проверить наличие подзаголовка

#### Сценарий 2: Отображение карточек
- Проверить наличие 3 карточек (fallback данные)
- Проверить информацию на каждой карточке (длительность, название)

#### Сценарий 3: Навигация
- Кликнуть на первую карточку
- Проверить переход на `/book/{eventTypeId}`
- Проверить загрузку страницы выбора слотов

#### Сценарий 4: Состояние загрузки
- Замокать медленный API
- Проверить отображение скелетонов
- Проверить исчезновение скелетонов после загрузки

#### Сценарий 5: Fallback при ошибке API
- Замокать ошибку API
- Проверить отображение fallback данных (3 карточки)

#### Сценарий 6: Успешный запрос к API
- Замокать успешный ответ API с кастомными данными
- Проверить отображение данных из API

### 6. Проверка в CI окружении
Создать GitHub Actions workflow для автоматического запуска тестов:
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: cd frontend && npm ci
      - run: cd frontend && npx playwright install --with-deps
      - run: cd backend && npm ci
      - run: cd backend && npm run build
      - run: cd frontend && npm run build
      - run: |
          cd backend && npm start &
          cd frontend && npm run dev &
          sleep 10
          cd frontend && npm run test:e2e
```

### 7. Анализ результатов

#### Успешный результат
- Все тесты проходят без ошибок
- Отчеты генерируются в `frontend/playwright-report/`
- Скриншоты создаются только при падении тестов

#### Возможные проблемы и решения

1. **Тесты падают из-за timing issues**
   - Увеличить timeout в конфигурации
   - Добавить `await page.waitForLoadState('networkidle')`

2. **Селекторы не находят элементы**
   - Проверить актуальные CSS классы в `BookingCatalogPage.tsx`
   - Использовать более устойчивые селекторы (data-testid)

3. **API моки не работают**
   - Проверить правильность URL в route моках
   - Убедиться, что моки применяются до навигации

4. **Браузер не запускается**
   - Проверить установку Playwright: `npx playwright install`
   - Проверить наличие зависимостей

### 8. Документирование результатов
Создать отчет о проверке:
- Количество успешных/неуспешных тестов
- Время выполнения тестов
- Проблемы и их решения
- Рекомендации по улучшению

### 9. Оптимизация тестов
После успешной проверки:
- Добавить retry для flaky тестов
- Оптимизировать время выполнения
- Добавить параллельный запуск
- Настроить кэширование зависимостей в CI

## Критерии успеха
1. Все 6 тестовых сценариев проходят успешно
2. Тесты выполняются за разумное время (< 2 минут)
3. Отчеты генерируются корректно
4. Тесты стабильны (не flaky)
5. CI pipeline успешно проходит