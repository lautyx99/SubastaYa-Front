import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SubastasPage from './pages/subastasPage'
import SubastaDetallePage from './pages/subastaDetallesPage'
import MainLayout from './components/layout/MainLayout'
import LoginPage from './pages/LoginPage'

function App() {
return (
  <BrowserRouter>
  <MainLayout>
      <Routes>
        <Route path="/" element={<SubastasPage />} />
        <Route path="/subastas/:id" element={<SubastaDetallePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      </MainLayout>
    </BrowserRouter>
)
}

export default App
