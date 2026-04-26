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
      {/* Светло-серый фон под хедером — общий фон для всех страниц */}
      <div className="app-content">
        <Container size="lg" py="xl">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* /book — выбор типа события */}
            <Route path="/book" element={<BookingEventTypePage />} />
            {/* /book/:eventTypeId — каталог слотов для выбранного типа */}
            <Route path="/book/:eventTypeId" element={<BookingCatalogPage />} />
          </Routes>
        </Container>
      </div>
    </>
  )
}

export default App
