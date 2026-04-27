# План исправлений для BookingEventTypePage.tsx

## Цель
Внести исправления в файл `frontend/src/pages/BookingEventTypePage.tsx` согласно требованиям:
1. Для получения списка слотов дополнительно передавать в API текущую дату.
2. Изменить логику расчета занятости слота: теперь этот параметр не рассчитывается, а просто забирается из API получения списка слотов.

## Анализ текущего состояния

### Интерфейсы
- **Slot** (текущий):
  ```ts
  interface Slot {
    id: string
    eventTypeId: string
    ownerId: string
    guestScenarioId: string
    dateTime: string
  }
  ```
- **Slot** (бэкенд):
  ```ts
  interface Slot {
    id: string;
    eventTypeId: string;
    ownerId: string;
    guestScenarioId: string;
    dateTime: string;
    isBooked?: boolean;
  }
  ```

### API эндпоинты
- `GET /slots?eventTypeId=xxx&date=YYYY-MM-DD` – ожидает два обязательных параметра.
- Возвращает массив слотов с полем `isBooked`, рассчитанным на сервере.

### Текущая логика фронтенда
1. Загрузка слотов: `fetch(/slots?eventTypeId=${eventTypeId})` – **без даты**.
2. Загрузка бронирований: `fetch(/bookings?date=${dateStr})` – для выбранной даты.
3. Функция `isSlotBooked` – рассчитывает занятость, сравнивая слоты с бронированиями.
4. Отображение слотов фильтруется по выбранной дате (`getSlotsForSelectedDate`).

## План изменений

### 1. Обновить интерфейс Slot
Добавить обязательное поле `isBooked` (по умолчанию `false`).
```ts
interface Slot {
  id: string
  eventTypeId: string
  ownerId: string
  guestScenarioId: string
  dateTime: string
  isBooked: boolean  // обязательное поле
}
```

### 2. Изменить запрос слотов
- Добавить параметр `date` в формате `YYYY-MM-DD`.
- Использовать `selectedDate` (текущая выбранная дата) для формирования запроса.
- Обновить useEffect, чтобы он зависел от `selectedDate` и перезагружал слоты при изменении даты.

**Текущий запрос:**
```ts
const slotsResponse = await fetch(`${API_BASE}/slots?eventTypeId=${eventTypeId}`)
```

**Новый запрос:**
```ts
const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : ''
const slotsResponse = await fetch(`${API_BASE}/slots?eventTypeId=${eventTypeId}&date=${dateStr}`)
```

**Зависимости useEffect:** `[eventTypeId, selectedDate]`

### 3. Убрать расчет занятости
- Удалить функцию `isSlotBooked`.
- Вместо вызова `isSlotBooked(slot)` использовать `slot.isBooked` напрямую.
- Обновить отображение статуса слота.

**Текущий код:**
```ts
const isBooked = isSlotBooked(slot)
```

**Новый код:**
```ts
const isBooked = slot.isBooked
```

### 4. Оставить загрузку бронирований
- Бронирования нужны для отображения в левом блоке (возможно, будущее использование).
- Второй useEffect оставить без изменений.

### 5. Обновить фильтрацию слотов по дате
- Поскольку API теперь возвращает слоты только для запрошенной даты, функция `getSlotsForSelectedDate` может стать избыточной.
- Однако оставим её для безопасности на случай, если API вернёт слоты за другие даты.

### 6. Обработка краевых случаев
- Если `selectedDate === null`, не делать запрос слотов (или использовать текущую дату по умолчанию).
- Если API не вернул поле `isBooked`, установить значение `false` по умолчанию.

## Детальный список изменений в файле

### 1. Интерфейс Slot (строки 31-37)
```diff
 interface Slot {
   id: string
   eventTypeId: string
   ownerId: string
   guestScenarioId: string
   dateTime: string
+  isBooked: boolean
 }
```

### 2. useEffect для загрузки слотов (строки 58-91)
```diff
 useEffect(() => {
   const fetchData = async () => {
     try {
       setLoading(true)
       setError(null)

       // Получаем тип события
       const eventTypeResponse = await fetch(`${API_BASE}/event-types/${eventTypeId}`)
       if (!eventTypeResponse.ok) {
         throw new Error('Не удалось загрузить тип события')
       }
       const eventTypeData = await eventTypeResponse.json()
       setEventType(eventTypeData)

+      // Формируем дату для запроса
+      const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : ''
       // Получаем слоты для этого типа события
-      const slotsResponse = await fetch(`${API_BASE}/slots?eventTypeId=${eventTypeId}`)
+      const slotsResponse = await fetch(`${API_BASE}/slots?eventTypeId=${eventTypeId}&date=${dateStr}`)
       if (!slotsResponse.ok) {
         throw new Error('Не удалось загрузить слоты')
       }
       const slotsData = await slotsResponse.json()
       setSlots(slotsData)

     } catch (err) {
       setError(err instanceof Error ? err.message : 'Произошла ошибка')
     } finally {
       setLoading(false)
     }
   }

   if (eventTypeId) {
     fetchData()
   }
- }, [eventTypeId])
+ }, [eventTypeId, selectedDate])
```

### 3. Удаление функции isSlotBooked (строки 114-125)
Удалить весь блок:
```ts
// Функция для проверки, занят ли слот
const isSlotBooked = (slot: Slot): boolean => {
  if (!eventType) return false

  const slotStart = new Date(slot.dateTime)
  const slotEnd = new Date(slotStart.getTime() + eventType.durationMinutes * 60000)

  return bookings.some(booking => {
    const bookingTime = new Date(booking.dateTime)
    return bookingTime >= slotStart && bookingTime < slotEnd
  })
}
```

### 4. Обновление отображения слотов (строки 274)
```diff
 {selectedDateSlots.map(slot => {
-  const isBooked = isSlotBooked(slot)
+  const isBooked = slot.isBooked
   const startTime = formatTime(slot.dateTime)
   const endDate = new Date(new Date(slot.dateTime).getTime() + eventType.durationMinutes * 60000)
   const endTime = formatTime(endDate.toISOString())
```

### 5. Обработка отсутствия isBooked в ответе API
Можно добавить проверку при маппинге:
```ts
const slotsData = await slotsResponse.json()
const slotsWithBooking = slotsData.map((slot: any) => ({
  ...slot,
  isBooked: slot.isBooked ?? false
}))
setSlots(slotsWithBooking)
```

## Проверка корректности
После внесения изменений необходимо:
1. Убедиться, что бэкенд запущен и возвращает слоты с полем `isBooked`.
2. Проверить, что при выборе даты в календаре слоты обновляются.
3. Убедиться, что статус "Занято"/"Свободно" отображается корректно.
4. Проверить, что загрузка бронирований продолжает работать (для будущего использования).

## Следующие шаги
После утверждения плана переключиться в режим **Code** для реализации изменений.