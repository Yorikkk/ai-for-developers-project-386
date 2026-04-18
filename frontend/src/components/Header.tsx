import { Group, Text, Anchor, Container } from '@mantine/core'
import { Link } from 'react-router-dom'
import { IconCalendar } from '@tabler/icons-react'
import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <Container size="lg">
        <Group className="header-container">
          {/* Логотип слева */}
          <Group className="header-logo-group">
            <IconCalendar className="header-icon" />
            <Text className="header-title">
              Calendar
            </Text>
          </Group>

          {/* Навигация справа */}
          <Group className="header-nav-group">
            <Anchor
              component={Link}
              to="/book"
              className="nav-link"
            >
              Записаться
            </Anchor>
            <Anchor
              component={Link}
              to="#"
              className="nav-link"
            >
              Админка
            </Anchor>
          </Group>
        </Group>
      </Container>
    </header>
  )
}
