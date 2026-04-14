import { Button, Title, Text, Stack, Group, Card, SimpleGrid } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { IconCalendar, IconClock, IconUsers } from '@tabler/icons-react'

export default function HomePage() {
  const navigate = useNavigate()

  const handleBookClick = () => {
    navigate('/book')
  }

  const features = [
    {
      icon: <IconCalendar size={32} />,
      title: 'Быстрая запись',
      description: 'Выберите удобное время и дату для встречи за несколько кликов'
    },
    {
      icon: <IconClock size={32} />,
      title: 'Гибкое расписание',
      description: 'Доступны встречи на 15 или 30 минут в удобное для вас время'
    },
    {
      icon: <IconUsers size={32} />,
      title: 'Простое управление',
      description: 'Отслеживайте свои бронирования и получайте напоминания'
    }
  ]

  return (
    <Stack gap="xl">
      {/* Hero Section */}
      <Stack align="center" gap="md" py="xl">
        <Title order={1} size="h1" ta="center">
          Сервис бронирования встреч
        </Title>
        <Text size="xl" c="dimmed" ta="center" maw={600}>
          Легко планируйте встречи с коллегами, клиентами и партнерами. 
          Выбирайте удобное время и тип встречи — мы позаботимся об остальном.
        </Text>
        <Button 
          size="lg" 
          onClick={handleBookClick}
          mt="md"
        >
          Записаться
        </Button>
      </Stack>

      {/* Features Section */}
      <Title order={2} ta="center">Почему выбирают нас</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {features.map((feature, index) => (
          <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
            <Stack align="center" gap="md">
              <div style={{ color: 'var(--mantine-color-blue-6)' }}>
                {feature.icon}
              </div>
              <Title order={3} ta="center">{feature.title}</Title>
              <Text ta="center" c="dimmed">{feature.description}</Text>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      {/* Call to Action */}
      <Card shadow="md" padding="xl" radius="md" withBorder mt="xl">
        <Stack align="center" gap="md">
          <Title order={2} ta="center">Готовы начать?</Title>
          <Text size="lg" ta="center" c="dimmed" maw={500}>
            Забронируйте свою первую встречу прямо сейчас. Это займет всего пару минут.
          </Text>
          <Group justify="center" mt="md">
            <Button size="lg" onClick={handleBookClick}>
              Записаться на встречу
            </Button>
            <Button size="lg" variant="outline">
              Узнать больше
            </Button>
          </Group>
        </Stack>
      </Card>
    </Stack>
  )
}