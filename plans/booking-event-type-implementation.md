# План реализации изменений для BookingEventTypePage

## Цель
Внести изменения в файл `frontend/src/pages/BookingEventTypePage.tsx`:
1. Правый блок: при наведении на карточку слота подпись "Свободно" заменяется на оранжевую "Забронировать".
2. При нажатии на карточку слота происходит бронирование - отправка запроса `createBooking` на сервер.
3. После бронирования обновляется левый блок со списком бронирований и правый блок со списком слотов.

## Требования
- Убрать блок с информацией о хосте в левом блоке.
- В левом блоке вместо "Выбранное время" отображать список бронирований на выбранную дату.
- Если список бронирований пустой, показывать "Время не выбрано".
- Использовать `ownerId: 'owner-1'` и `guestScenarioId: 'guest-scenario-1'` для создания бронирования.
- Проверять, свободен ли слот перед бронированием.
- Показывать уведомления об успехе/ошибке.
- Оранжевый текст "Забронировать" при наведении, с тенью или бордером.

## Изменения в BookingEventTypePage.tsx

### 1. Добавить новые состояния
```typescript
const [hoveredSlotId, setHoveredSlotId] = useState<string | null>(null);
const [bookingLoading, setBookingLoading] = useState<string | null>(null); // id слота в процессе бронирования
const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
```

### 2. Функция для получения бронирований на выбранную дату
Добавить функцию `getBookingsForSelectedDate`:
```typescript
const getBookingsForSelectedDate = (): Booking[] => {
  if (!selectedDate) return [];
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  return bookings.filter(booking => {
    const bookingDateStr = new Date(booking.dateTime).toISOString().split('T')[0];
    return bookingDateStr === selectedDateStr;
  });
};
```

### 3. Функция бронирования слота
```typescript
const handleBookSlot = async (slot: Slot) => {
  if (slot.isBooked) {
    setNotification({ type: 'error', message: 'Этот слот уже занят' });
    return;
  }

  if (!eventTypeId || !eventType) {
    setNotification({ type: 'error', message: 'Тип события не выбран' });
    return;
  }

  setBookingLoading(slot.id);
  setNotification(null);

  try {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dateTime: slot.dateTime,
        eventTypeId: eventTypeId,
        ownerId: 'owner-1',
        guestScenarioId: 'guest-scenario-1',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка бронирования');
    }

    // Успешное бронирование
    setNotification({ type: 'success', message: 'Слот успешно забронирован' });
    
    // Обновить данные слотов и бронирований
    const dateStr = selectedDate?.toISOString().split('T')[0];
    if (dateStr) {
      // Перезагрузить слоты
      const slotsResponse = await fetch(`${API_BASE}/slots?eventTypeId=${eventTypeId}&date=${dateStr}`);
      if (slotsResponse.ok) {
        const slotsData = await slotsResponse.json();
        const slotsWithBooking: Slot[] = slotsData.map((slot: Omit<Slot, 'isBooked'> & { isBooked?: boolean }) => ({
          ...slot,
          isBooked: slot.isBooked ?? false
        }));
        setSlots(slotsWithBooking);
      }
      
      // Перезагрузить бронирования
      const bookingsResponse = await fetch(`${API_BASE}/bookings?date=${dateStr}`);
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      }
    }
  } catch (err) {
    setNotification({ 
      type: 'error', 
      message: err instanceof Error ? err.message : 'Произошла ошибка при бронировании' 
    });
  } finally {
    setBookingLoading(null);
  }
};
```

### 4. Обновить левый блок
Заменить блок с информацией о хосте и "Выбранное время" на:
```tsx
{/* Список бронирований */}
<Box className="bookings-list-box">
  <Text size="sm" c="dimmed" mb={4}>
    Бронирования на выбранную дату
  </Text>
  {selectedDateBookings.length === 0 ? (
    <Text fw={500}>Время не выбрано</Text>
  ) : (
    <Stack gap="xs">
      {selectedDateBookings.map(booking => {
        const time = formatTime(booking.dateTime);
        return (
          <Box key={booking.id} className="booking-item">
            <Text fw={500}>{time}</Text>
            <Text size="sm" c="dimmed">
              Встреча {eventType.durationMinutes} минут
            </Text>
          </Box>
        );
      })}
    </Stack>
  )}
</Box>
```

Предварительно нужно вычислить `selectedDateBookings`:
```typescript
const selectedDateBookings = getBookingsForSelectedDate();
```

### 5. Обновить правый блок (слоты)
Добавить обработчики hover и клика:
```tsx
<Box
  key={slot.id}
  className={`slot-item ${isBooked ? 'slot-booked' : 'slot-free'} ${hoveredSlotId === slot.id ? 'slot-hover' : ''}`}
  onMouseEnter={() => !isBooked && setHoveredSlotId(slot.id)}
  onMouseLeave={() => setHoveredSlotId(null)}
  onClick={() => !isBooked && handleBookSlot(slot)}
  style={{ cursor: isBooked ? 'default' : 'pointer' }}
>
  <Text fw={500} className="slot-time">
    {startTime} - {endTime}
  </Text>
  <Text size="sm" className="slot-status">
    {isBooked ? 'Занято' : (hoveredSlotId === slot.id ? 'Забронировать' : 'Свободно')}
  </Text>
  {bookingLoading === slot.id && <Loader size="xs" ml="sm" />}
</Box>
```

### 6. Добавить уведомления
После заголовка страницы добавить:
```tsx
{notification && (
  <Alert 
    icon={notification.type === 'success' ? <IconCheck size={16} /> : <IconAlertCircle size={16} />}
    title={notification.type === 'success' ? 'Успешно' : 'Ошибка'}
    color={notification.type === 'success' ? 'green' : 'red'}
    onClose={() => setNotification(null)}
    withCloseButton
    mb="md"
  >
    {notification.message}
  </Alert>
)}
```

Нужно импортировать `IconCheck` из `@tabler/icons-react`.

### 7. Импорты
Добавить необходимые импорты:
```typescript
import { IconCheck } from '@tabler/icons-react';
```

## Изменения в BookingEventTypePage.css

### 1. Удалить стили для хоста (опционально)
Можно удалить `.host-avatar` или оставить, если используется где-то еще.

### 2. Добавить стили для списка бронирований
```css
.bookings-list-box {
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.booking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}
```

### 3. Добавить стили для hover состояния слотов
```css
.slot-hover {
  border-color: #fd7e14;
  box-shadow: 0 2px 8px rgba(253, 126, 20, 0.2);
}

.slot-hover .slot-status {
  color: #fd7e14 !important;
  font-weight: 600;
}

.slot-item {
  transition: all 0.2s ease;
}

.slot-item:hover:not(.slot-booked) {
  transform: translateY(-1px);
}
```

### 4. Обновить стили для оранжевого текста
```css
.slot-free .slot-status {
  color: #51cf66;
  font-weight: 500;
}

/* Переопределить для hover */
.slot-hover.slot-free .slot-status {
  color: #fd7e14 !important;
}
```

## Последовательность реализации
1. Добавить новые состояния
2. Добавить функцию `getBookingsForSelectedDate`
3. Реализовать функцию `handleBookSlot`
4. Обновить левый блок (убрать хост, добавить список бронирований)
5. Обновить правый блок (добавить hover и клик)
6. Добавить уведомления
7. Обновить CSS
8. Протестировать

## Тестирование
- Проверить, что при наведении на свободный слот текст меняется на "Забронировать" оранжевым цветом.
- Проверить, что при клике на свободный слот отправляется запрос на бронирование.
- Проверить, что после успешного бронирования обновляются списки слотов и бронирований.
- Проверить, что занятые слоты не реагируют на hover и клик.
- Проверить, что уведомления отображаются корректно.
- Проверить, что в левом блоке отображаются бронирования на выбранную дату.