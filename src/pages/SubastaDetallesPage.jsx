import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Alert from 'react-bootstrap/Alert'
import { getSubastaById } from '../api/subastasApi'
import { getPujasBySubasta } from '../api/pujasApi'
import SubastaGaleria from '../components/subastas/SubastaGaleria'
import SubastaInfo from '../components/subastas/SubastaInfo'
import ListaPujas from '../components/pujas/ListaPujas'
import PanelPuja from '../components/subastas/PanelPuja'
import Countdown from '../components/subastas/Countdown'

function SubastaDetallesPage() {
  const { id } = useParams()
  const [subasta, setSubasta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pujas, setPujas] = useState([])
  const [fechaFinPrev, setFechaFinPrev] = useState(null)
  const usuarioActualId = Number(localStorage.getItem('userId')) || null

  useEffect(() => {
    if (!subasta?.fechaFin) return
    if (fechaFinPrev && new Date(subasta.fechaFin) > new Date(fechaFinPrev)) {
      // Nota: Asegúrate de tener tu función de notificación si la usas aquí
    }
    setFechaFinPrev(subasta.fechaFin)
  }, [subasta?.fechaFin])

  const cargarDetalle = () => {
    setLoading(true)
    Promise.all([getSubastaById(id), getPujasBySubasta(id)])
      .then(([subastaData, pujasData]) => {
        setSubasta(subastaData)
        setPujas(pujasData)
      })
      .catch((err) => setError(err.message || 'Error al cargar el detalle'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let cancelado = false

    const cargar = (mostrarSpinner = false) => {
      if (mostrarSpinner) setLoading(true)

      Promise.all([getSubastaById(id), getPujasBySubasta(id)])
        .then(([subastaData, pujasData]) => {
          if (cancelado) return
          setSubasta(subastaData)
          setPujas(pujasData)
          setError(null)
        })
        .catch((err) => {
          if (cancelado) return
          setError(err.message || 'Error al cargar el detalle')
        })
        .finally(() => {
          if (!cancelado && mostrarSpinner) setLoading(false)
        })
    }

    // Primera carga (con spinner)
    cargar(true)

    // Actualización en vivo cada 4s (sin spinner)
    const intervalId = setInterval(() => cargar(false), 4000)

    return () => {
      cancelado = true
      clearInterval(intervalId)
    }
  }, [id])

  if (error) return <Alert variant="danger">{error}</Alert>
  if (!subasta) return <Alert variant="warning">No se encontró la subasta</Alert>

  const mejorPuja = pujas.length
    ? Math.max(...pujas.map((p) => Number(p.monto)))
    : null

  const subastaConOferta = {
    ...subasta,
    mejorPuja: mejorPuja ?? subasta.mejorPuja ?? subasta.precioInicial,
  }

  return (
    <div>
      <Link to="/" className="d-inline-block mb-3 text-decoration-none text-muted fw-semibold" style={{ fontSize: '0.9rem' }}>
        ← Volver a Subastas Activas
      </Link>

      <Row className="g-4">
        <Col lg={7}>
          <SubastaInfo subasta={subasta} />
          
          {/* Aquí se renderiza la galería optimizada con contain y fondo limpio */}
          <SubastaGaleria titulo={subasta.titulo} urlImagen={subasta.urlImagen} />

          <Card className="shadow-sm mt-3 border-0 rounded-4" style={{ borderColor: '#eaeef2' }}>
            <Card.Body className="p-4">
              <Card.Title className="h5 fw-bold text-dark mb-3">Historial de ofertas</Card.Title>
              <ListaPujas pujas={pujas} usuarioActualId={usuarioActualId} />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Countdown fechaFin={subasta.fechaFin} />
          <PanelPuja
            subasta={subastaConOferta}
            pujas={pujas}
            usuarioActualId={usuarioActualId}
            onPujaCreada={cargarDetalle}
          />
        </Col>
      </Row>
    </div>
  )
}

export default SubastaDetallesPage