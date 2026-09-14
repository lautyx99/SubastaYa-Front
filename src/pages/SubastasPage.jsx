import { useEffect, useState } from 'react'
import { getSubastas } from '../api/subastasApi'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import SubastaCard from '../components/subastas/SubastaCard'

function SubastasPage() {
  const [subastas, setSubastas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getSubastas()
      .then((data) => setSubastas(data))
      .catch((err) => setError(err.message || 'Error al cargar subastas'))
      .finally(() => setLoading(false))
  }, [])

if (loading) {
  return (
    <div className="text-center py-5">
      <Spinner animation="border" />
      <p className="mt-2">Cargando subastas...</p>
    </div>
  )
}

if (error) return <Alert variant="danger">{error}</Alert>

return (
  <>
    <h1 className="mb-4">Subastas</h1>
    <Row xs={1} md={2} lg={3} className="g-3">
      {subastas.map((s) => (
        <Col key={s.id}>
          <SubastaCard subasta={s} />
        </Col>
      ))}
    </Row>
  </>
)
}

export default SubastasPage
