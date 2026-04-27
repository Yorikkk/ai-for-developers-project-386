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
import { IconAlertCircle } from '@tabler/icons-react'
import 'dayjs/locale/ru'
import './BookingEventTypePage.css'

const API_BASE = 'http://localhost:3000'

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [loading, setLoading] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <Container size="xl" mt="xl" className="booking-event-type-page">
      <Stack gap="xl">
        {/* Заголовок страницы */}
        <Title order={1} className="page-title">
          Встреча {eventType.durationMinutes} минут
        </Title>

        {/* Три блока */}
        <Grid>
          {/* Левый блок */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder className="left-card">
              <Stack gap="md">
                {/* Информация о хосте */}
                <Group gap="sm">
                  <div className="host-avatar">
                    <Text size="lg" fw={600} c="white">T</Text>
                  </div>
                  <div>
                    <Text fw={500}>Tota</Text>
                    <Text size="sm" c="dimmed">Host</Text>
                  </div>
                </Group>

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

                {/* Выбранное время */}
                <Box className="selected-time-box">
                  <Text size="sm" c="dimmed" mb={4}>
                    Выбранное время
                  </Text>
                  <Text fw={500}>Время не выбрано</Text>
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

                      return (
                        <Box
                          key={slot.id}
                          className={`slot-item ${isBooked ? 'slot-booked' : 'slot-free'}`}
                        >
                          <Text fw={500} className="slot-time">
                            {startTime} - {endTime}
                          </Text>
                          <Text size="sm" className="slot-status">
                            {isBooked ? 'Занято' : 'Свободно'}
                          </Text>
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
