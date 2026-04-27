# Booking API Backend

Backend приложение для системы бронирования событий. Реализовано на Node.js с использованием Express.js и TypeScript.

## Технологии

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Language
- **In-memory storage** - Хранение данных в памяти приложения

## Требования

- Node.js 18+ 
- npm 9+

## Установка

```bash
# Установить зависимости
npm install
```

## Запуск

### Режим разработки (с hot-reload)
```bash
npm run dev
```

### Сборка для продакшена
```bash
npm run build
npm start
```

## API Endpoints

### Event Types

#### Создать тип события
```http
POST /event-types
Content-Type: application/json

{
  "title": "Название события",
  "durationMinutes": 30,
  "text": "Описание (опционально)"
}
```

#### Получить список всех типов событий
```http
GET /event-types
```

#### Получить тип события по ID
```http
GET /event-types/:eventTypeId
```

### Slots

#### Получить список слотов
```http
GET /slots
```

#### Получить слоты по типу события
```http
GET /slots?eventTypeId=xxx
```

### Bookings

#### Создать бронирование
```http
POST /bookings
Content-Type: application/json

{
  "dateTime": "2024-01-15T10:00:00Z",
  "eventTypeId": "event-type-1",
  "ownerId": "owner-1",
  "guestScenarioId": "guest-scenario-1"
}
```

#### Получить список бронирований
```http
GET /bookings
```

#### Получить бронирования по дате
```http
GET /bookings?date=2024-01-15
```

## Предзаполненные данные

При запуске сервера автоматически создаются:

### Типы событий:
1. **Короткий тип событий для быстрого слота** (15 минут)
2. **Базовый тип события для бронирования** (30 минут)

### Владельцы:
- Иван Иванов
- Мария Петрова

### Сценарии гостей:
- Первая встреча
- Повторная консультация

## Структура проекта

```
backend/
├── src/
│   ├── models/           # TypeScript интерфейсы
│   ├── storage/          # In-memory хранилища
│   ├── controllers/      # Обработчики бизнес-логики
│   ├── routes/           # Express маршруты
│   ├── middleware/       # Промежуточное ПО
│   ├── utils/           # Вспомогательные функции
│   ├── app.ts           # Конфигурация Express
│   └── server.ts        # Точка входа
├── dist/                # Скомпилированные файлы
├── package.json
├── tsconfig.json
└── README.md
```

## Особенности

- Все данные хранятся в памяти приложения
- При перезапуске сервера данные сбрасываются
- CORS включен для всех источников
- Валидация входных данных
- Обработка ошибок
- Логирование запросов

## Разработка

### Тестирование API

Можно использовать curl, Postman или любой другой HTTP клиент:

```bash
# Получить список типов событий
curl http://localhost:3000/event-types

# Создать тип события
curl -X POST http://localhost:3000/event-types \
  -H "Content-Type: application/json" \
  -d '{"title":"Новое событие","durationMinutes":45}'

# Получить бронирования за конкретную дату
curl "http://localhost:3000/bookings?date=2024-01-15"
```

## Лицензия

MIT
