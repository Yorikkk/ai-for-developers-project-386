# TODO List для реализации бэкенд приложения

## Этап 1: Настройка проекта
- [ ] Создать папку `backend/` в корне проекта
- [ ] Инициализировать `package.json` с базовыми настройками
- [ ] Установить зависимости: express, cors, uuid, joi
- [ ] Установить dev-зависимости: @types/express, @types/cors, @types/node, typescript, ts-node, nodemon
- [ ] Настроить `tsconfig.json` для TypeScript
- [ ] Создать структуру папок согласно архитектуре

## Этап 2: Модели данных
- [ ] Создать файл `src/models/index.ts` с экспортом всех моделей
- [ ] Создать `src/models/event-type.model.ts` с интерфейсом EventType
- [ ] Создать `src/models/slot.model.ts` с интерфейсом Slot
- [ ] Создать `src/models/booking.model.ts` с интерфейсом Booking
- [ ] Создать `src/models/owner.model.ts` с интерфейсом Owner
- [ ] Создать `src/models/guest-scenario.model.ts` с интерфейсом GuestScenario
- [ ] Создать типы для запросов (CreateEventTypeRequest и т.д.)

## Этап 3: Хранилище в памяти
- [ ] Создать `src/storage/index.ts` с экспортом хранилищ
- [ ] Создать `src/storage/event-type.storage.ts` с:
  - Массивом eventTypes
  - Функциями: findAll, findById, create, update, delete
  - Генерацией уникальных ID
- [ ] Создать `src/storage/slot.storage.ts` с аналогичными функциями
- [ ] Создать `src/storage/booking.storage.ts` с аналогичными функциями
- [ ] Создать `src/storage/owner.storage.ts` с предопределенными владельцами
- [ ] Создать `src/storage/guest-scenario.storage.ts` с предопределенными сценариями

## Этап 4: Контроллеры
- [ ] Создать `src/controllers/event-type.controller.ts` с:
  - createEventType (POST /event-types)
  - getEventTypeById (GET /event-types/:id)
  - listEventTypes (GET /event-types)
- [ ] Создать `src/controllers/slot.controller.ts` с:
  - listSlots (GET /slots) с фильтрацией по eventTypeId
- [ ] Создать `src/controllers/booking.controller.ts` с:
  - createBooking (POST /bookings)
  - listBookings (GET /bookings) с фильтрацией по date
- [ ] Добавить валидацию входных данных в каждом контроллере

## Этап 5: Маршруты
- [ ] Создать `src/routes/event-type.routes.ts` с маршрутами для EventTypes
- [ ] Создать `src/routes/slot.routes.ts` с маршрутами для Slots
- [ ] Создать `src/routes/booking.routes.ts` с маршрутами для Bookings
- [ ] Создать `src/routes/index.ts` для объединения всех маршрутов

## Этап 6: Middleware
- [ ] Создать `src/middleware/error-handler.ts` для обработки ошибок
- [ ] Создать `src/middleware/validation.ts` для валидации запросов
- [ ] Создать `src/middleware/cors.ts` для настройки CORS
- [ ] Настроить логирование запросов

## Этап 7: Основное приложение
- [ ] Создать `src/app.ts` с:
  - Инициализацией Express
  - Подключением middleware
  - Подключением маршрутов
  - Инициализацией предзаполненных данных
  - Обработкой ошибок
- [ ] Создать `src/server.ts` или `src/index.ts` для запуска сервера

## Этап 8: Предзаполнение данных
- [ ] Создать функцию инициализации в `src/storage/init-data.ts`
- [ ] Добавить два предопределенных типа событий:
  1. ID: `event-type-1`, title: "Короткий тип событий для быстрого слота", durationMinutes: 15
  2. ID: `event-type-2`, title: "Базовый тип события для бронирования", durationMinutes: 30
- [ ] Добавить предопределенных владельцев (2-3 примера)
- [ ] Добавить предопределенные сценарии гостей (2-3 примера)
- [ ] Вызывать инициализацию при запуске приложения

## Этап 9: Утилиты
- [ ] Создать `src/utils/id-generator.ts` для генерации уникальных ID
- [ ] Создать `src/utils/date-utils.ts` для работы с датами
- [ ] Создать `src/utils/validation-schemas.ts` с схемами Joi

## Этап 10: Конфигурация
- [ ] Создать `.env.example` с переменными окружения
- [ ] Создать `src/config/index.ts` для конфигурации приложения
- [ ] Настроить порт (по умолчанию 3000)

## Этап 11: Тестирование
- [ ] Создать базовые тесты для API endpoints (позже)
- [ ] Настроить тестовое окружение

## Этап 12: Интеграция
- [ ] Проверить CORS настройки для работы с фронтендом
- [ ] Протестировать endpoints с фронтендом
- [ ] Настроить прокси в dev-сервере фронтенда (если нужно)

## Этап 13: Документация и запуск
- [ ] Создать `README.md` для бэкенда
- [ ] Добавить скрипты в package.json:
  - `dev`: запуск с nodemon и ts-node
  - `build`: компиляция TypeScript
  - `start`: запуск скомпилированного приложения
- [ ] Протестировать полный цикл работы

## Примечания
1. Все данные хранятся в памяти - при перезапуске сервера данные сбрасываются
2. API соответствует спецификации TypeSpec из `main.tsp`
3. Используется TypeScript для типизации
4. Код должен быть чистым, модульным и хорошо документированным
5. Обработка ошибок должна возвращать соответствующие HTTP статусы