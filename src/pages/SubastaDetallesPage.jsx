import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import { getSubastaById } from '../api/subastasApi'
import { getPujasBySubasta } from '../api/pujasApi'
import SubastaGaleria from '../components/subastas/SubastaGaleria'
import SubastaInfo from '../components/subastas/SubastaInfo'
import ListaPujas from '../components/pujas/ListaPujas'
import PanelPuja from '../components/subastas/PanelPuja'


function SubastaDetallePage() {
  const { id } = useParams()
  const [subasta, setSubasta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pujas, setPujas] = useState([])

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
    setLoading(true)
    getSubastaById(id)
      .then(setSubasta)
      .catch((err) => setError(err.message || 'Error al cargar la subasta'))
      .finally(() => setLoading(false))
  }, [id])

  Promise.all([getSubastaById(id), getPujasBySubasta(id)])
      .then(([subastaData, pujasData]) => {
        setSubasta(subastaData)
        setPujas(pujasData)
      })
      .catch((err) => setError(err.message || 'Error al cargar el detalle'))
      .finally(() => setLoading(false))


      useEffect(() => {
  cargarDetalle()
}, [id])

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2">Cargando subasta...</p>
      </div>
    )
  }

  if (error) return <Alert variant="danger">{error}</Alert>
  if (!subasta) return <Alert variant="warning">No se encontró la subasta</Alert>

  const mejorPuja = pujas.length
    ? Math.max(...pujas.map((p) => Number(p.monto)))
    : null

    // para que el panel use la mejor oferta real
  const subastaConOferta = {
    ...subasta,
    mejorPuja: mejorPuja ?? subasta.mejorPuja ?? subasta.precioInicial,
  }

  return (
   <div>
      <Link to="/" className="d-inline-block mb-3 text-decoration-none">
        ← Volver a Subastas Activas
      </Link>

      <Row className="g-4">
        <Col lg={7}>
          <SubastaInfo subasta={subasta} />
          <SubastaGaleria titulo={subasta.titulo} urlImagen={subasta.urlImagen} />

          <Card className="shadow-sm mt-3">
            <Card.Body>
              <Card.Title className="h5">Historial de pujas</Card.Title>
              <ListaPujas pujas={pujas} />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <PanelPuja subasta={subastaConOferta} onPujaCreada={cargarDetalle}/>
        </Col>
      </Row>
    </div>
  )
}

export default SubastaDetallePage