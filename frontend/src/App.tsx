import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BookingCatalogPage from './pages/BookingEventTypePage'
import BookingEventTypePage from './pages/BookingCatalogPage'
import Header from './components/Header'
import { Container } from '@mantine/core'
import './App.css'

function App() {
  return (
    <>
      <Header />
      {/* Светло-серый фон под хедером — общий фон для всех страниц */}
      <div className="app-content">
        <Container size="lg" py="xl">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* /book — выбор типа события */}
            <Route path="/book" element={<BookingCatalogPage />} />
            {/* /book/:eventTypeId — каталог слотов для выбранного типа */}
            <Route path="/book/:eventTypeId" element={<BookingEventTypePage />} />
          </Routes>
        </Container>
      </div>
    </>
  )
}

export default App
