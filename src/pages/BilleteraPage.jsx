import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'
import { getBilletera, getMovimientos } from '../api/billeterasApi'
import PanelSaldo from '../components/billetera/PanelSaldo'
import FormCargarSaldo from '../components/billetera/FormCargarSaldo'
import HistorialMovimientos from '../components/billetera/HistorialMovimientos'

function BilleteraPage() {
  const token = localStorage.getItem('token')
  const nombre = localStorage.getItem('userNombre')
  const email = localStorage.getItem('userEmail')
  const usuarioId = Number(localStorage.getItem('userId'))
  const [billetera, setBilletera] = useState(null)
  const [movimientos, setMovimientos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)



  const cargar = () => {
    if (!token || !usuarioId) {
      setError('Tenés que iniciar sesión')
      setLoading(false)
      return
    }

    setLoading(true)

    getBilletera(usuarioId)
      .then(async (b) => {
        setBilletera(b)
        if (b?.id) {
          try {
            const movs = await getMovimientos(b.id)
            setMovimientos(Array.isArray(movs) ? movs : [])
          } catch {
            setMovimientos([])
          }
        } else {
          setMovimientos([])
        }
        setError(null)
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setError('Sesión inválida. Volvé a iniciar sesión.')
        } else if (err.response?.status === 404) {
          setError('No se encontró la billetera (revisá la ruta del API).')
        } else {
          setError(err.message || 'Error al cargar la billetera')
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    cargar()
  }, [])

  if (!token) {
    return (
      <Alert variant="warning">
        <Link to="/login">Iniciá sesión</Link> para ver tu billetera.
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    )
  }

  if (error) return <Alert variant="danger">{error}</Alert>

  return (
    <div>
      <h1 className="h3 mb-1">Mi billetera</h1>
      <p className="text-muted mb-4">
        {nombre} {email ? `(${email})` : ''}
      </p>

      <PanelSaldo billetera={billetera} />
      <FormCargarSaldo usuarioId={usuarioId} onDepositado={cargar} />

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Card.Title className="h6">Historial de movimientos</Card.Title>
          <HistorialMovimientos movimientos={movimientos} />
        </Card.Body>
      </Card>
    </div>
  )
}

export default BilleteraPage