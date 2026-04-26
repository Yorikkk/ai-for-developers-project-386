import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Title,
  Text,
  Card,
  Badge,
  Stack,
  Box,
  Skeleton,
} from '@mantine/core'
import { IconClock, IconArrowRight } from '@tabler/icons-react'
import './BookingEventTypePage.css'

interface EventType {
  id: string
  title: string
  durationMinutes: number
}

const FALLBACK_EVENT_TYPES: EventType[] = [
  { id: '1', title: 'Быстрая встреча', durationMinutes: 15 },
  { id: '2', title: 'Стандартная встреча', durationMinutes: 30 },
  { id: '3', title: 'Расширенная встреча', durationMinutes: 60 },
]

export default function BookingEventTypePage() {
  const navigate = useNavigate()
  const [eventTypes, setEventTypes] = useState<EventType[]>(FALLBACK_EVENT_TYPES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:4010/event-types')
      .then((res) => {
        if (!res.ok) throw new Error('API error')
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setEventTypes(data)
        }
      })
      .catch(() => {
        // Keep fallback data already set in initial state
      })
      .finally(() => setLoading(false))
  }, [])

  const handleCardClick = (eventTypeId: string) => {
    navigate(`/book/${eventTypeId}`)
  }

  return (
    <Box className="event-type-page">
      {/* Hero section */}
      <Box className="event-type-hero">
        <Title order={1} className="event-type-hero-title">
          Выберите тип события
        </Title>
        <Text className="event-type-hero-subtitle">
          Нажмите на карточку, чтобы открыть календарь и выбрать удобный слот
        </Text>
      </Box>

      {/* Cards grid — max 2 в ряд */}
      {loading ? (
        <Box className="event-type-grid">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} height={160} radius="md" />
          ))}
        </Box>
      ) : (
        <Box className="event-type-grid">
          {eventTypes.map((eventType) => (
            <Card
              key={eventType.id}
              className="event-type-card"
              withBorder
              padding="xl"
              radius="md"
              onClick={() => handleCardClick(eventType.id)}
            >
              {/* Тег с длительностью — правый верхний угол */}
              <Badge className="event-type-duration-badge">
                {eventType.durationMinutes} мин
              </Badge>

              <Stack gap="xs" mt={4}>
                <Title order={3} className="event-type-card-title">
                  Встреча {eventType.durationMinutes} минут
                </Title>

                <Text className="event-type-card-subtitle">
                  {eventType.title}
                </Text>

                <Box className="event-type-card-footer">
                  <Box className="event-type-duration-row">
                    <IconClock size={15} className="event-type-clock-icon" />
                    <Text size="sm" c="dimmed">
                      {eventType.durationMinutes} минут
                    </Text>
                  </Box>

                  <Box className="event-type-arrow">
                    <IconArrowRight size={18} />
                  </Box>
                </Box>
              </Stack>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  )
}
