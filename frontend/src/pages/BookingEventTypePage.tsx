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
  Alert,
  SimpleGrid
} from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import Header from '../components/Header'
import './BookingEventTypePage.css'

const API_BASE = 'http://localhost:4010'

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Загрузка данных типа события и слотов
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

        // Получаем слоты для этого типа события
        const slotsResponse = await fetch(`${API_BASE}/slots?eventTypeId=${eventTypeId}`)
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
  }, [eventTypeId])

  // Загрузка бронирований при изменении даты
  useEffect(() => {
    const fetchBookings = async () => {
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
    const selectedDateStr = selectedDate.toISOString().split('T')[0]
    return slots.filter(slot => {
      const slotDateStr = new Date(slot.dateTime).toISOString().split('T')[0]
      return slotDateStr === selectedDateStr
    })
  }

  // Функции для календаря
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay() === 0 ? 7 : firstDay.getDay()
    
    const days: (number | null)[] = []
    
    // Добавляем пустые дни в начале
    for (let i = 1; i < startDayOfWeek; i++) {
      days.push(null)
    }
    
    // Добавляем дни месяца
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    
    return days
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(newDate)
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  if (loading) {
    return (
      <>
        <Header />
        <Container size="xl" mt="xl">
          <Stack align="center" justify="center" style={{ minHeight: '400px' }}>
            <Loader size="lg" />
            <Text>Загрузка...</Text>
          </Stack>
        </Container>
      </>
    )
  }

  if (error || !eventType) {
    return (
      <>
        <Header />
        <Container size="xl" mt="xl">
          <Alert icon={<IconAlertCircle size={16} />} title="Ошибка" color="red">
            {error || 'Тип события не найден'}
          </Alert>
          <Button mt="md" onClick={() => navigate('/book')}>
            Вернуться к каталогу
          </Button>
        </Container>
      </>
    )
  }

  const selectedDateSlots = getSlotsForSelectedDate()
  const days = getDaysInMonth(currentMonth)
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  const monthName = currentMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })

  return (
    <>
      <Header />
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
                      {formatDate(selectedDate)}
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
                  
                  {/* Заголовок календаря с навигацией */}
                  <Group justify="space-between">
                    <Button variant="subtle" size="sm" onClick={handlePrevMonth}>←</Button>
                    <Text fw={500}>{monthName}</Text>
                    <Button variant="subtle" size="sm" onClick={handleNextMonth}>→</Button>
                  </Group>

                  {/* Дни недели */}
                  <SimpleGrid cols={7} spacing="xs">
                    {weekDays.map(day => (
                      <Text key={day} size="xs" ta="center" c="dimmed">{day}</Text>
                    ))}
                  </SimpleGrid>

                  {/* Дни месяца */}
                  <SimpleGrid cols={7} spacing="xs">
                    {days.map((day, index) => (
                      <Box
                        key={index}
                        className={`calendar-day ${
                          day && 
                          selectedDate.getDate() === day && 
                          selectedDate.getMonth() === currentMonth.getMonth() &&
                          selectedDate.getFullYear() === currentMonth.getFullYear()
                            ? 'calendar-day-selected' 
                            : ''
                        }`}
                        onClick={() => day && handleDateClick(day)}
                        style={{
                          cursor: day ? 'pointer' : 'default',
                          padding: '8px',
                          textAlign: 'center',
                          borderRadius: '4px'
                        }}
                      >
                        {day && <Text size="sm">{day}</Text>}
                      </Box>
                    ))}
                  </SimpleGrid>
                </Stack>
              </Card>
            </Grid.Col>

            {/* Правый блок - Статус слотов */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder className="slots-card">
                <Stack gap="md">
                  <Title order={4}>Статус слотов</Title>
                  
                  {selectedDateSlots.length === 0 ? (
                    <Text c="dimmed" size="sm">
                      Нет доступных слотов на выбранную дату
                    </Text>
                  ) : (
                    <Stack gap="xs">
                      {selectedDateSlots.map(slot => {
                        const isBooked = isSlotBooked(slot)
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
    </>
  )
}
