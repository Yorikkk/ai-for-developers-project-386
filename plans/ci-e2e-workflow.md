# План настройки CI/CD для E2E тестов (Playwright) через GitHub Actions

## Текущее состояние
- **Фронтенд**: React + Vite, порт 5173
- **Бэкенд**: Express, порт 3000
- **Тесты**: Playwright E2E тесты в директории `frontend/tests/`
- **Конфигурация Playwright**: `frontend/playwright.config.ts` с webServer для фронтенда
- **Скрипты тестирования**: `npm run test:e2e` в frontend/package.json

## Требования для запуска тестов в CI
1. Запуск бэкенд-сервера на порту 3000
2. Запуск фронтенд-сервера на порту 5173
3. Установка браузеров Playwright (Chromium, Firefox, WebKit)
4. Выполнение тестов с учетом окружения CI

## Проектирование workflow GitHub Actions

### Основные шаги
1. **Checkout** репозитория
2. **Установка Node.js** (версия 20)
3. **Установка зависимостей** для бэкенда и фронтенда
4. **Установка браузеров Playwright**
5. **Запуск бэкенд-сервера** в фоне
6. **Проверка доступности бэкенда**
7. **Запуск тестов Playwright** (фронтенд сервер запустится автоматически через webServer)
8. **Сохранение артефактов** (отчеты, скриншоты)

### Конфигурация workflow
Создать файл: `.github/workflows/e2e-tests.yml`

```yaml
name: E2E Tests (Playwright)

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:  # Allow manual trigger

jobs:
  e2e-tests:
    timeout-minutes: 15
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: |
            frontend/package-lock.json
            backend/package-lock.json

      - name: Install backend dependencies
        run: |
          cd backend
          npm ci

      - name: Install frontend dependencies
        run: |
          cd frontend
          npm ci

      - name: Install Playwright browsers
        run: |
          cd frontend
          npx playwright install --with-deps chromium

      - name: Start backend server
        run: |
          cd backend
          npm run dev &
          sleep 5  # Wait for server to start
        env:
          PORT: 3000
          NODE_ENV: test

      - name: Verify backend is running
        run: |
          curl -f http://localhost:3000/event-types || exit 1

      - name: Run Playwright tests
        run: |
          cd frontend
          npm run test:e2e
        env:
          CI: true

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: frontend/playwright-report/
          retention-days: 7

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: frontend/test-results/
          retention-days: 7
```

## Дополнительные улучшения

### 1. Кэширование браузеров Playwright
Для ускорения workflow можно кэшировать браузеры Playwright:

```yaml
      - name: Cache Playwright browsers
        uses: actions/cache@v4
        id: playwright-cache
        with:
          path: ~/.cache/ms-playwright
          key: ${{ runner.os }}-playwright-${{ hashFiles('frontend/package-lock.json') }}
```

### 2. Запуск на нескольких браузерах
Текущая конфигурация Playwright включает Chromium, Firefox, WebKit. Можно запускать тесты на всех браузерах, установив их:

```yaml
      - name: Install Playwright browsers (all)
        run: |
          cd frontend
          npx playwright install --with-deps
```

### 3. Использование сервисов GitHub Actions
Вместо ручного запуска бэкенда можно использовать services, но проще оставить как есть.

### 4. Матрица ОС
Можно добавить тестирование на разных ОС:

```yaml
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
```

## Проверка работоспособности

### Локальный тест
Перед коммитом можно проверить workflow локально с помощью [act](https://github.com/nektos/act) или вручную:

1. Запустить бэкенд: `cd backend && npm run dev`
2. Запустить фронтенд: `cd frontend && npm run dev`
3. Запустить тесты: `cd frontend && npm run test:e2e`

### Первый запуск в CI
После создания файла `.github/workflows/e2e-tests.yml` и пуша в репозиторий, workflow автоматически запустится на push или PR.

## Возможные проблемы и решения

### 1. Бэкенд не успевает запуститься
Увеличить sleep или добавить проверку через curl в цикле.

### 2. Конфликт портов
Убедиться, что порты 3000 и 5173 свободны в CI-окружении.

### 3. Отсутствие переменных окружения
Бэкенд использует in-memory storage, поэтому дополнительные переменные не требуются.

### 4. Playwright не может подключиться к фронтенду
Проверить, что фронтенд сервер запускается (webServer в конфиге Playwright). В CI может потребоваться явно указать `reuseExistingServer: false`.

## Следующие шаги

1. Создать файл `.github/workflows/e2e-tests.yml` с приведенной конфигурацией
2. Запушить изменения в репозиторий
3. Проверить выполнение workflow в Actions
4. При необходимости отладить шаги
5. Добавить бейджи статуса в README.md

## Альтернативные варианты

### Использование Docker
Можно создать Docker Compose для запуска всего стека, но для простоты текущий подход достаточен.

### Интеграция с TypeSpec
Если потребуется компиляция TypeSpec перед тестами, добавить шаг:
```yaml
      - name: Compile TypeSpec
        run: npx tsp compile .
```

## Заключение
Предложенный workflow обеспечит автоматический запуск E2E тестов при каждом пуше и PR, что повысит надежность проекта и предотвратит регрессии.