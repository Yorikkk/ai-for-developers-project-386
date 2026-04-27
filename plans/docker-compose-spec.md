# Спецификация docker-compose.yml

## Файл docker-compose.yml
```yaml
version: '3.8'

services:
  booking-app:
    build: .
    container_name: booking-app
    ports:
      - "${PORT:-3000}:${PORT:-3000}"
    environment:
      - PORT=${PORT:-3000}
      - NODE_ENV=${NODE_ENV:-production}
    restart: unless-stopped
    networks:
      - booking-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:${PORT:-3000}/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  booking-network:
    driver: bridge
```

## Файл .env.example для docker-compose
```
# Порт приложения
PORT=3000

# Окружение
NODE_ENV=production
```

## Makefile дополнения
```makefile
# Docker команды
docker-build:
	docker build -t booking-app:latest .

docker-run:
	docker run -p 3000:3000 --env-file .env booking-app:latest

docker-compose-up:
	docker-compose up -d

docker-compose-down:
	docker-compose down

docker-compose-logs:
	docker-compose logs -f

docker-compose-restart:
	docker-compose restart

# Полная сборка и запуск
docker-full: docker-build docker-run
```

## Команды для работы с Docker

### Сборка и запуск с docker-compose
```bash
# Копировать пример .env файла
cp .env.example .env

# Запустить приложение
docker-compose up -d

# Остановить приложение
docker-compose down

# Просмотр логов
docker-compose logs -f

# Пересборка и запуск
docker-compose up -d --build
```

### Прямая работа с Docker
```bash
# Сборка образа
docker build -t booking-app .

# Запуск контейнера
docker run -p 3000:3000 -e PORT=3000 booking-app

# Запуск с переменными окружения из файла
docker run -p 3000:3000 --env-file .env booking-app
```

## Health check endpoint
Для healthcheck нужно добавить endpoint в бэкенд:

```typescript
// В routes/index.ts или отдельный health route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

## Порты
- Приложение запускается на порту, указанном в переменной PORT (по умолчанию 3000)
- Порт мапится на хост: `host_port:container_port`
- Можно изменить порт хоста: `8080:3000`

## Сеть
- Создается отдельная сеть `booking-network`
- Позволяет в будущем добавлять другие сервисы (базу данных, кэш и т.д.)

## Переменные окружения
Переменные можно задавать:
1. Через файл `.env` в корне проекта
2. Через `environment` в docker-compose.yml
3. Через флаг `-e` в docker run