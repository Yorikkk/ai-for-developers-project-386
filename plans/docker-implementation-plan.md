# План реализации Docker-образа для фронтенда и бэкенда

## Требования
1. Фронтенд и бэкенд должны собираться в один Docker-образ
2. При запуске контейнера приложение должно стартовать автоматически
3. Приложение должно запускаться на порту из переменной окружения PORT

## Текущая архитектура
- **Фронтенд**: React + Vite, запускается на порту 5173 в dev режиме
- **Бэкенд**: Express + TypeScript, запускается на порту 3000
- **Взаимодействие**: Фронтенд обращается к бэкенду по `http://localhost:3000`

## Необходимые изменения

### 1. Изменения в бэкенде
#### 1.1. Добавление обслуживания статичных файлов
В `backend/src/app.ts` нужно добавить middleware для статичных файлов:

```typescript
import path from 'path';

// После middleware и перед API routes добавить:
app.use(express.static(path.join(__dirname, '../public')));
```

#### 1.2. Обработка клиентских маршрутов
Добавить fallback для SPA (Single Page Application):

```typescript
// После API routes и перед 404 handler добавить:
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
```

#### 1.3. Настройка CORS для production
В production CORS можно ограничить или настроить для работы с тем же доменом.

### 2. Изменения во фронтенде
#### 2.1. Динамическое определение API_BASE
Заменить хардкод `http://localhost:3000` на относительный путь или переменную окружения:

```typescript
const API_BASE = import.meta.env.VITE_API_BASE || '';
```

#### 2.2. Настройка Vite для production
Добавить в `vite.config.ts` настройку base path:

```typescript
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
});
```

### 3. Dockerfile
#### 3.1. Многоэтапная сборка
```dockerfile
# Многоэтапный Dockerfile для сборки фронтенда и бэкенда в один образ

# Этап 1: Сборка фронтенда
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ .
RUN npm run build

# Этап 2: Сборка бэкенда  
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
RUN npm run build

# Этап 3: Финальный образ
FROM node:20-alpine
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app

# Копируем зависимости и скомпилированный бэкенд
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/src ./backend/src

# Копируем собранный фронтенд в папку public
COPY --from=frontend-builder /app/frontend/dist ./backend/public

# Создаем entrypoint скрипт
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'cd /app/backend' >> /app/entrypoint.sh && \
    echo 'node dist/server.js' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

EXPOSE $PORT
CMD ["/app/entrypoint.sh"]
```

### 4. Дополнительные файлы
#### 4.1. .dockerignore
```
node_modules
dist
*.log
.env
.DS_Store
.git
```

#### 4.2. docker-compose.yml (опционально)
```yaml
version: '3.8'
services:
  booking-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - NODE_ENV=production
    restart: unless-stopped
```

#### 4.3. Makefile targets (дополнение)
```makefile
docker-build:
	docker build -t booking-app:latest .

docker-run:
	docker run -p 3000:3000 booking-app:latest

docker-compose-up:
	docker-compose up -d
```

## Порядок реализации
1. Создать Dockerfile в корне проекта
2. Создать .dockerignore
3. Внести изменения в бэкенд для обслуживания статичных файлов
4. Внести изменения во фронтенд для использования относительных путей
5. Протестировать сборку локально
6. Создать docker-compose.yml для удобства
7. Обновить документацию

## Тестирование
1. Сборка образа: `docker build -t booking-app .`
2. Запуск контейнера: `docker run -p 3000:3000 booking-app`
3. Проверка работы: открыть `http://localhost:3000`
4. Проверка API: `curl http://localhost:3000/event-types`

## Переменные окружения
- `PORT`: порт для запуска приложения (по умолчанию 3000)
- `NODE_ENV`: окружение (production/development)

## Примечания
- В production режиме фронтенд будет обращаться к API по относительному пути (`/api/...`)
- Бэкенд будет обслуживать и API, и статичные файлы фронтенда
- При необходимости можно разделить на два контейнера (frontend + nginx, backend)