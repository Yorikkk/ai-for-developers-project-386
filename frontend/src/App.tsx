import { Container, Title, Text, Card, Code, Stack, Button, Group } from '@mantine/core'
import './App.css'
import 'prismjs/themes/prism-tomorrow.css'

function App() {
  const exampleCode = `import { Button } from '@mantine/core'

function Demo() {
  return <Button>Click me</Button>
}`

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Title order={1}>Booking API Frontend</Title>
        <Text size="lg">
          This frontend is built with TypeScript, Vite, Mantine, and Prism.
        </Text>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={2}>Mantine Components</Title>
          <Text mt="sm">
            Below is an example of a Mantine button and a code block rendered with Prism.
          </Text>
          <Group mt="md">
            <Button variant="filled">Primary</Button>
            <Button variant="outline">Secondary</Button>
            <Button variant="light">Light</Button>
            <Button variant="subtle">Subtle</Button>
          </Group>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={2}>Prism Code Highlighting</Title>
          <Text mt="sm">Example TypeScript code:</Text>
          <pre className="language-tsx" style={{ marginTop: '1rem', padding: '1rem', background: '#2d2d2d', color: '#ccc', borderRadius: '0.5rem', overflow: 'auto' }}>
            <code>{exampleCode}</code>
          </pre>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={2}>API Integration</Title>
          <Text mt="sm">
            The backend provides the following endpoints:
          </Text>
          <Code block mt="sm">
            POST /event-types – Create event type
            GET /event-types – List event types
            GET /slots – List slots
            POST /bookings – Create booking
            GET /bookings – List bookings
          </Code>
          <Button mt="md" component="a" href="/generated/openapi.json" target="_blank">
            View OpenAPI Spec
          </Button>
        </Card>
      </Stack>
    </Container>
  )
}

export default App
