import { Button, Title, Text, Stack, Card, SimpleGrid, Group, Badge } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { IconArrowLeft, IconClock } from '@tabler/icons-react'

const eventTypes = [
  {
    id: '15-min',
    title: 'Встреча 15 минут',
    description: 'Краткая встреча для быстрых вопросов и обсуждений',
    duration: '15 минут',
    price: 'Бесплатно',
    color: 'blue'
  },
  {
    id: '30-min',
    title: 'Встреча 30 минут',
    description: 'Стандартная встреча для детального обсуждения тем',
    duration: '30 минут',
    price: 'Бесплатно',
    color: 'green'
  }
]

export default function BookingCatalogPage() {
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate('/')
  }

  const handleEventTypeSelect = (eventTypeId: string) => {
    navigate(`/book/${eventTypeId}`)
  }

  return (
    <Stack gap="xl">
      {/* Header */}
      <Group>
        <Button 
          variant="subtle" 
          leftSection={<IconArrowLeft size={16} />}
          onClick={handleBackClick}
        >
          Назад
        </Button>
        <Title order={1}>Выберите тип встречи</Title>
      </Group>

      <Text size="lg" c="dimmed">
        Выберите подходящий тип встречи для ваших нужд. Каждый тип имеет разную продолжительность и предназначение.
      </Text>

      {/* Event Types Grid */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        {eventTypes.map((eventType) => (
          <Card 
            key={eventType.id} 
            shadow="md" 
            padding="xl" 
            radius="md" 
            withBorder
            style={{ cursor: 'pointer' }}
            onClick={() => handleEventTypeSelect(eventType.id)}
          >
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={3}>{eventType.title}</Title>
                <Badge color={eventType.color} size="lg">
                  {eventType.duration}
                </Badge>
              </Group>
              
              <Group gap="xs">
                <IconClock size={18} />
                <Text>{eventType.duration}</Text>
              </Group>

              <Text>{eventType.description}</Text>

              <Group justify="space-between" mt="md">
                <Text fw={500} size="xl">{eventType.price}</Text>
                <Button 
                  color={eventType.color}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEventTypeSelect(eventType.id)
                  }}
                >
                  Выбрать
                </Button>
              </Group>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      {/* Additional Info */}
      <Card withBorder padding="lg" radius="md">
        <Stack gap="sm">
          <Title order={4}>Как это работает</Title>
          <Text>
            1. Выберите тип встречи и нажмите "Выбрать"<br />
            2. На следующем экране выберите удобную дату и время<br />
            3. Заполните ваши контактные данные<br />
            4. Подтвердите бронирование<br />
          </Text>
          <Text size="sm" c="dimmed">
            После подтверждения вы получите уведомление на email с деталями встречи.
          </Text>
        </Stack>
      </Card>
    </Stack>
  )
}