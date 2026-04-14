import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Button,
  Title,
  Text,
  Stack,
  Card,
  Group,
  Badge,
  TextInput,
  Textarea,
  Grid,
  Divider
} from '@mantine/core'
import { IconArrowLeft, IconCalendar, IconClock, IconUser, IconMail, IconPhone } from '@tabler/icons-react'

const eventTypeDetails: Record<string, { title: string; duration: string; description: string }> = {
  '15-min': {
    title: 'Встреча 15 минут',
    duration: '15 минут',
    description: 'Краткая встреча для быстрых вопросов и обсуждений'
  },
  '30-min': {
    title: 'Встреча 30 минут',
    duration: '30 минут',
    description: 'Стандартная встреча для детального обсуждения тем'
  }
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
]

export default function BookingEventTypePage() {
  const { eventTypeId } = useParams<{ eventTypeId: string }>()
  const navigate = useNavigate()
  
  const eventType = eventTypeId ? eventTypeDetails[eventTypeId] : eventTypeDetails['15-min']
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')

  const handleBackClick = () => {
    navigate('/book')
  }

  const handleSubmit = () => {
    // In a real app, this would submit the booking
    alert(`Бронирование подтверждено!\n\n${eventType?.title}\nДата: ${selectedDate?.toLocaleDateString()}\nВремя: ${selectedTime}\nИмя: ${name}\nEmail: ${email}`)
    navigate('/')
  }

  const isFormValid = selectedDate && selectedTime && name && email

  return (
    <Stack gap="xl">
      {/* Header */}
      <Group>
        <Button 
          variant="subtle" 
          leftSection={<IconArrowLeft size={16} />}
          onClick={handleBackClick}
        >
          Назад к выбору типа
        </Button>
        <Title order={1}>Бронирование встречи</Title>
      </Group>

      {/* Event Type Summary */}
      <Card withBorder padding="lg" radius="md">
        <Stack gap="sm">
          <Group justify="space-between">
            <Title order={3}>{eventType?.title}</Title>
            <Badge color="blue" size="lg">
              {eventType?.duration}
            </Badge>
          </Group>
          <Text>{eventType?.description}</Text>
        </Stack>
      </Card>

      <Grid>
        {/* Left Column: Date/Time Selection */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="lg">
            <Title order={3}>Выберите дату и время</Title>
            
            <Card withBorder padding="lg" radius="md">
              <Stack gap="md">
                <Group gap="xs">
                  <IconCalendar size={20} />
                  <Text fw={500}>Дата</Text>
                </Group>
                <TextInput
                  type="date"
                  value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
                  placeholder="Выберите дату"
                  min={new Date().toISOString().split('T')[0]}
                />
              </Stack>
            </Card>

            <Card withBorder padding="lg" radius="md">
              <Stack gap="md">
                <Group gap="xs">
                  <IconClock size={20} />
                  <Text fw={500}>Время</Text>
                </Group>
                <Text c="dimmed" size="sm">Доступные слоты времени</Text>
                <Group gap="xs">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'filled' : 'outline'}
                      onClick={() => setSelectedTime(time)}
                      size="sm"
                    >
                      {time}
                    </Button>
                  ))}
                </Group>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>

        {/* Right Column: Contact Information */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="lg">
            <Title order={3}>Контактная информация</Title>
            
            <Card withBorder padding="lg" radius="md">
              <Stack gap="md">
                <Group gap="xs">
                  <IconUser size={20} />
                  <Text fw={500}>Ваши данные</Text>
                </Group>
                
                <TextInput
                  label="Имя"
                  placeholder="Введите ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                
                <TextInput
                  label="Email"
                  placeholder="Введите ваш email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  leftSection={<IconMail size={16} />}
                />
                
                <TextInput
                  label="Телефон"
                  placeholder="Введите ваш телефон"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftSection={<IconPhone size={16} />}
                />
                
                <Textarea
                  label="Дополнительные заметки"
                  placeholder="Укажите дополнительную информацию о встрече"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  minRows={3}
                />
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Summary and Submit */}
      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <Title order={3}>Сводка бронирования</Title>
          
          <Group justify="space-between">
            <Text fw={500}>Тип встречи:</Text>
            <Text>{eventType?.title}</Text>
          </Group>
          
          <Group justify="space-between">
            <Text fw={500}>Продолжительность:</Text>
            <Text>{eventType?.duration}</Text>
          </Group>
          
          <Group justify="space-between">
            <Text fw={500}>Дата:</Text>
            <Text>{selectedDate ? selectedDate.toLocaleDateString('ru-RU') : 'Не выбрана'}</Text>
          </Group>
          
          <Group justify="space-between">
            <Text fw={500}>Время:</Text>
            <Text>{selectedTime || 'Не выбрано'}</Text>
          </Group>
          
          <Divider />
          
          <Group justify="space-between">
            <Text fw={500} size="lg">Итого:</Text>
            <Text fw={700} size="xl">Бесплатно</Text>
          </Group>
          
          <Button 
            size="lg" 
            onClick={handleSubmit}
            disabled={!isFormValid}
            fullWidth
            mt="md"
          >
            Подтвердить бронирование
          </Button>
          
          <Text size="sm" c="dimmed" ta="center">
            Нажимая "Подтвердить бронирование", вы соглашаетесь с нашими условиями использования.
          </Text>
        </Stack>
      </Card>
    </Stack>
  )
}