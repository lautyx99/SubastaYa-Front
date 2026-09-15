import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SubastasPage from './pages/SubastasPage'
import SubastaDetallePage from './pages/SubastaDetallesPage'
import MainLayout from './components/layout/MainLayout'
import LoginPage from './pages/LoginPage'
import CrearSubastaPage from './pages/CrearSubastaPage'
import { ToastProvider } from './context/ToastContext'
import BilleteraPage from './pages/BilleteraPage'
import SoloVendedores from './components/auth/SoloVendedores'

function App() {
return (
  <ToastProvider>
  <BrowserRouter>
  <MainLayout>
      <Routes>
        <Route path="/" element={<SubastasPage />} />
        <Route path="/subastas/:id" element={<SubastaDetallePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/billetera" element={<BilleteraPage />} />
         <Route
            path="/subastas/nueva"
            element={
            <SoloVendedores>
              <CrearSubastaPage />
            </SoloVendedores>
          }/>
      </Routes>
      </MainLayout>
    </BrowserRouter>
    </ToastProvider>
)
}

export default App
