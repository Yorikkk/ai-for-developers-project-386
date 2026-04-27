# Многоэтапный Dockerfile для сборки фронтенда и бэкенда в один образ

# Этап 1: Сборка фронтенда
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Копируем package.json и package-lock.json для установки зависимостей
COPY frontend/package*.json ./

# Устанавливаем зависимости фронтенда
RUN npm ci

# Копируем исходный код фронтенда
COPY frontend/ .

# Собираем фронтенд
RUN npm run build

# Этап 2: Сборка бэкенда
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

# Копируем package.json и package-lock.json для установки зависимостей
COPY backend/package*.json ./

# Устанавливаем зависимости бэкенда
RUN npm ci

# Копируем исходный код бэкенда
COPY backend/ .

# Компилируем TypeScript
RUN npm run build

# Этап 3: Финальный образ
FROM node:20-alpine

# Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

# Копируем package.json и зависимости бэкенда
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules

# Копируем скомпилированный бэкенд
COPY --from=backend-builder /app/backend/dist ./backend/dist

# Копируем исходники бэкенда (для init-data и других runtime файлов)
COPY --from=backend-builder /app/backend/src ./backend/src

# Создаем папку для статических файлов
RUN mkdir -p ./backend/public

# Копируем собранный фронтенд в папку public бэкенда
COPY --from=frontend-builder /app/frontend/dist ./backend/public

# Создаем entrypoint скрипт
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'cd /app/backend' >> /app/entrypoint.sh && \
    echo 'exec node dist/server.js' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

# Открываем порт (значение берется из переменной окружения)
EXPOSE $PORT

# Запускаем приложение
CMD ["/app/entrypoint.sh"]
