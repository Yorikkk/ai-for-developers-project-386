import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BookingCatalogPage from './pages/BookingCatalogPage'
import BookingEventTypePage from './pages/BookingEventTypePage'
import Header from './components/Header'
import { Container } from '@mantine/core'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <Container size="lg" py="xl">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<BookingCatalogPage />} />
          <Route path="/book/:eventTypeId" element={<BookingEventTypePage />} />
        </Routes>
      </Container>
    </>
  )
}

export default App