import { Button, Title, Text, Stack, Box, List } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { IconArrowRight } from '@tabler/icons-react'
import './HomePage.css'

export default function HomePage() {
  const navigate = useNavigate()

  const handleBookClick = () => {
    navigate('/book')
  }

  return (
    <Box className="home-container">
      <Box className="home-grid">
        {/* Левый блок */}
        <Stack gap="lg">
          {/* 1. Плашка с белым фоном */}
          <Box className="home-badge">
            Быстрая запись на звонок
          </Box>

          {/* 2. Заголовок Calendar */}
          <Title order={1} className="home-title">
            Calendar
          </Title>

          {/* 3. Описание */}
          <Text size="lg" className="home-description">
            Забронируйте встречу за минуту: выберите тип события и удобное время
          </Text>

          {/* 4. Кнопка Записаться */}
          <Button
            size="lg"
            onClick={handleBookClick}
            rightSection={<IconArrowRight size={20} />}
            className="home-button"
          >
            Записаться
          </Button>
        </Stack>

        {/* Правый блок - Возможности */}
        <Box className="home-features-box">
          <Title order={2} className="home-features-title">
            Возможности
          </Title>

          <List
            spacing="md"
            size="md"
            style={{ color: '#374151' }}
            styles={{
              itemWrapper: {
                alignItems: 'flex-start',
              },
              itemLabel: {
                fontSize: '16px',
                lineHeight: 1.6,
              },
            }}
          >
            <List.Item>
              Выбор типа события и удобного времени для встречи
            </List.Item>
            <List.Item>
              Быстрое бронирование с подтверждением и дополнительными заметками
            </List.Item>
            <List.Item>
              Управление типами встреч и просмотр предстоящих записей в админке
            </List.Item>
          </List>
        </Box>
      </Box>
    </Box>
  )
}
