import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Title,
  Text,
  Stack,
  Card,
  Badge,
  Group,
  Button,
  Box,
  Grid,
  Loader,
  Alert
} from '@mantine/core'
import { DatePicker, DatesProvider } from '@mantine/dates'
import { IconAlertCircle, IconCheck } from '@tabler/icons-react'
import 'dayjs/locale/ru'
import './BookingEventTypePage.css'

// В development используем localhost:3000, в production - относительный путь (тот же домен)
const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? 'http://localhost:3000' : '')

interface EventType {
  id: string
  title: string
  durationMinutes: number
  text?: string
}

interface Slot {
  id: string
  eventTypeId: string
  ownerId: string
  guestScenarioId: string
  dateTime: string
  isBooked: boolean
}

interface Booking {
  id: string
  dateTime: string
  eventTypeId: string
  ownerId: string
  guestScenarioId: string
}

export default function BookingEventTypePage() {
  const { eventTypeId } = useParams<{ eventTypeId: string }>()
  const navigate = useNavigate()
  
  const [eventType, setEventType] = useState<EventType | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [loading, setLoading] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hoveredSlotId, setHoveredSlotId] = useState<string | null>(null)
  const [bookingLoading, setBookingLoading] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Загрузка типа события (один раз при монтировании)
  useEffect(() => {
    const fetchEventType = async () => {
      if (!eventTypeId) return
      
      try {
        setLoading(true)
        setError(null)

        const eventTypeResponse = await fetch(`${API_BASE}/event-types/${eventTypeId}`)
        if (!eventTypeResponse.ok) {
          throw new Error('Не удалось загрузить тип события')
        }
        const eventTypeData = await eventTypeResponse.json()
        setEventType(eventTypeData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка')
      } finally {
        setLoading(false)
      }
    }

    fetchEventType()
  }, [eventTypeId])

  // Загрузка слотов (при изменении даты)
  useEffect(() => {
    const fetchSlots = async () => {
      if (!eventTypeId || !selectedDate) return
      
      try {
        setLoadingSlots(true)
        const dateStr = selectedDate.toISOString().split('T')[0]
        const slotsResponse = await fetch(`${API_BASE}/slots?eventTypeId=${eventTypeId}&date=${dateStr}`)
        
        if (!slotsResponse.ok) {
          throw new Error('Не удалось загрузить слоты')
        }
        
        const slotsData = await slotsResponse.json()
        const slotsWithBooking: Slot[] = slotsData.map((slot: Omit<Slot, 'isBooked'> & { isBooked?: boolean }) => ({
          ...slot,
          isBooked: slot.isBooked ?? false
        }))
        setSlots(slotsWithBooking)
      } catch (err) {
        console.error('Ошибка загрузки слотов:', err)
      } finally {
        setLoadingSlots(false)
      }
    }

    fetchSlots()
  }, [eventTypeId, selectedDate])

  // Загрузка бронирований при изменении даты
  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedDate) return
      
      try {
        const dateStr = selectedDate.toISOString().split('T')[0]
        const bookingsResponse = await fetch(`${API_BASE}/bookings?date=${dateStr}`)
        if (!bookingsResponse.ok) {
          throw new Error('Не удалось загрузить бронирования')
        }
        const bookingsData = await bookingsResponse.json()
        setBookings(bookingsData)
      } catch (err) {
        console.error('Ошибка загрузки бронирований:', err)
      }
    }

    fetchBookings()
  }, [selectedDate])


  // Форматирование времени
  const formatTime = (dateTime: string): string => {
    const date = new Date(dateTime)
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  // Формат даты
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ru-RU', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    })
  }

  // Получение слотов на выбранную дату
  const getSlotsForSelectedDate = (): Slot[] => {
    if (!selectedDate) return []
    const selectedDateStr = selectedDate.toISOString().split('T')[0]
    return slots.filter(slot => {
      const slotDateStr = new Date(slot.dateTime).toISOString().split('T')[0]
      return slotDateStr === selectedDateStr
    })
  }

  // Получение бронирований на выбранную дату
  const getBookingsForSelectedDate = (): Booking[] => {
    if (!selectedDate) return []
    const selectedDateStr = selectedDate.toISOString().split('T')[0]
    return bookings.filter(booking => {
      const bookingDateStr = new Date(booking.dateTime).toISOString().split('T')[0]
      return bookingDateStr === selectedDateStr
    })
  }

  // Обработка бронирования слота
  const handleBookSlot = async (slot: Slot) => {
    if (slot.isBooked) {
      setNotification({ type: 'error', message: 'Этот слот уже занят' })
      return
    }

    if (!eventTypeId || !eventType) {
      setNotification({ type: 'error', message: 'Тип события не выбран' })
      return
    }

    setBookingLoading(slot.id)
    setNotification(null)

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
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Ошибка бронирования')
      }

      // Успешное бронирование
      setNotification({ type: 'success', message: 'Слот успешно забронирован' })
      
      // Обновить данные слотов и бронирований
      const dateStr = selectedDate?.toISOString().split('T')[0]
      if (dateStr) {
        // Перезагрузить слоты
        const slotsResponse = await fetch(`${API_BASE}/slots?eventTypeId=${eventTypeId}&date=${dateStr}`)
        if (slotsResponse.ok) {
          const slotsData = await slotsResponse.json()
          const slotsWithBooking: Slot[] = slotsData.map((slot: Omit<Slot, 'isBooked'> & { isBooked?: boolean }) => ({
            ...slot,
            isBooked: slot.isBooked ?? false
          }))
          setSlots(slotsWithBooking)
        }
        
        // Перезагрузить бронирования
        const bookingsResponse = await fetch(`${API_BASE}/bookings?date=${dateStr}`)
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json()
          setBookings(bookingsData)
        }
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Произошла ошибка при бронировании'
      })
    } finally {
      setBookingLoading(null)
    }
  }

  if (loading) {
    return (
      <Container size="xl" mt="xl">
        <Stack align="center" justify="center" style={{ minHeight: '400px' }}>
          <Loader size="lg" />
          <Text>Загрузка...</Text>
        </Stack>
      </Container>
    )
  }

  if (error || !eventType) {
    return (
      <Container size="xl" mt="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Ошибка" color="red">
          {error || 'Тип события не найден'}
        </Alert>
        <Button mt="md" onClick={() => navigate('/book')}>
          Вернуться к каталогу
        </Button>
      </Container>
    )
  }

  const selectedDateSlots = getSlotsForSelectedDate()
  const selectedDateBookings = getBookingsForSelectedDate()

  return (
    <Container size="xl" mt="xl" className="booking-event-type-page">
      <Stack gap="xl">
        {/* Заголовок страницы */}
        <Title order={1} className="page-title">
          Встреча {eventType.durationMinutes} минут
        </Title>

        {/* Уведомления */}
        {notification && (
          <Alert
            icon={notification.type === 'success' ? <IconCheck size={16} /> : <IconAlertCircle size={16} />}
            title={notification.type === 'success' ? 'Успешно' : 'Ошибка'}
            color={notification.type === 'success' ? 'green' : 'red'}
            onClose={() => setNotification(null)}
            withCloseButton
          >
            {notification.message}
          </Alert>
        )}

        {/* Три блока */}
        <Grid>
          {/* Левый блок */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder className="left-card">
              <Stack gap="md">
                {/* Заголовок и бейдж */}
                <Group justify="space-between" align="flex-start">
                  <Title order={3} style={{ flex: 1 }}>
                    Встреча {eventType.durationMinutes} минут
                  </Title>
                  <Badge size="lg" color="blue">
                    {eventType.durationMinutes} мин
                  </Badge>
                </Group>

                {/* Описание */}
                <Text size="sm" c="dimmed">
                  {eventType.text || eventType.title || 'Короткий тип события для быстрого слота.'}
                </Text>

                {/* Выбранная дата */}
                <Box className="selected-date-box">
                  <Text size="sm" c="dimmed" mb={4}>
                    Выбранная дата
                  </Text>
                  <Text fw={500}>
                    {selectedDate ? formatDate(selectedDate) : 'Не выбрана'}
                  </Text>
                </Box>

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
                        const time = formatTime(booking.dateTime)
                        return (
                          <Box key={booking.id} className="booking-item">
                            <Text fw={500}>{time}</Text>
                            <Text size="sm" c="dimmed">
                              Встреча {eventType.durationMinutes} минут
                            </Text>
                          </Box>
                        )
                      })}
                    </Stack>
                  )}
                </Box>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Центральный блок - Календарь */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder className="calendar-card">
              <Stack gap="md">
                <Title order={4}>Календарь</Title>
                
                <DatesProvider settings={{ locale: 'ru' }}>
                  <DatePicker
                    value={selectedDate ? selectedDate.toISOString().split('T')[0] : null}
                    onChange={(value) => {
                      if (value) {
                        setSelectedDate(new Date(value))
                      } else {
                        setSelectedDate(null)
                      }
                    }}
                  />
                </DatesProvider>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Правый блок - Статус слотов */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder className="slots-card">
              <Stack gap="md">
                <Title order={4}>Статус слотов</Title>
                
                {loadingSlots ? (
                  <Stack align="center" justify="center" style={{ minHeight: '200px' }}>
                    <Loader size="sm" />
                    <Text size="sm" c="dimmed">Загрузка слотов...</Text>
                  </Stack>
                ) : selectedDateSlots.length === 0 ? (
                  <Text c="dimmed" size="sm">
                    Нет доступных слотов на выбранную дату
                  </Text>
                ) : (
                  <Stack gap="xs">
                    {selectedDateSlots.map(slot => {
                      const isBooked = slot.isBooked
                      const startTime = formatTime(slot.dateTime)
                      const endDate = new Date(new Date(slot.dateTime).getTime() + eventType.durationMinutes * 60000)
                      const endTime = formatTime(endDate.toISOString())
                      const isHovered = hoveredSlotId === slot.id
                      const isLoading = bookingLoading === slot.id

                      return (
                        <Box
                          key={slot.id}
                          className={`slot-item ${isBooked ? 'slot-booked' : 'slot-free'} ${isHovered ? 'slot-hover' : ''}`}
                          onMouseEnter={() => !isBooked && setHoveredSlotId(slot.id)}
                          onMouseLeave={() => setHoveredSlotId(null)}
                          onClick={() => !isBooked && !isLoading && handleBookSlot(slot)}
                          style={{ cursor: isBooked ? 'default' : 'pointer' }}
                        >
                          <Text fw={500} className="slot-time">
                            {startTime} - {endTime}
                          </Text>
                          <Group gap="xs">
                            <Text size="sm" className="slot-status">
                              {isBooked ? 'Занято' : (isHovered ? 'Забронировать' : 'Свободно')}
                            </Text>
                            {isLoading && <Loader size="xs" />}
                          </Group>
                        </Box>
                      )
                    })}
                  </Stack>
                )}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Кнопки */}
        <Group justify="space-between" mt="lg">
          <Button 
            variant="default" 
            onClick={() => navigate('/book')}
          >
            Назад
          </Button>
          <Button 
            color="orange"
            size="md"
          >
            Продолжить
          </Button>
        </Group>
      </Stack>
    </Container>
  )
}
