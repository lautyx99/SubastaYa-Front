import { useEffect, useState } from 'react'
import { getSubastas } from '../api/subastasApi'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import SubastaCard from '../components/subastas/SubastaCard'
import { Button, Container, Dropdown, Form } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'

function SubastasPage() {
  const [subastas, setSubastas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()

  const [filtroEstado, setFiltroEstado] = useState('Activa') // Por defecto Activas
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [orden, setOrden] = useState('tiempo-asc') // 'tiempo-asc' o 'precio-desc'
  const queryBusqueda = searchParams.get('busqueda')?.toLowerCase() || ''


  const categorias = [
  { id: "", nombre: "Todas las categorías" },
  { id: "1", nombre: "Tecnología" },
  { id: "2", nombre: "Coleccionables" },
  { id: "3", nombre: "Vehículos" },
  { id: "4", nombre: "Arte" }
];

const categoriaActual = categorias.find(c => c.id === filtroCategoria)?.nombre || "Filtrar por categoría";

  const subastasFiltradas = subastas
    .filter((s) => {
      // Filtro por Barra de Búsqueda (busca en título o descripción)
      if (queryBusqueda) {
        const coincideTitulo = s.titulo?.toLowerCase().includes(queryBusqueda)
        const coincideDesc = s.descripcion?.toLowerCase().includes(queryBusqueda)
        if (!coincideTitulo && !coincideDesc) return false
      }

      // Filtro por Estado
      if (filtroEstado && s.estado !== filtroEstado) return false

      // Filtro por Categoría
      if (filtroCategoria && s.categoriaId.toString() !== filtroCategoria) return false

      return true
    })
    .sort((a, b) => {
      if (orden === 'tiempo-asc') {
        return new Date(a.fechaFin) - new Date(b.fechaFin)
      }
      if (orden === 'precio-desc') {
        const precioA = a.mejorPuja || a.precioInicial || 0
        const precioB = b.mejorPuja || b.precioInicial || 0
        return precioB - precioA
      }
      return 0
    })

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
    <Container className="py-4">
      {/* 🎛️ Barra de Filtros Minimalista */}
      <div className="bg-white p-3 rounded-4 border shadow-sm mb-4" style={{ borderColor: '#eaeef2' }}>
        <Row className="g-3 align-items-center">
          {/* Filtro por Estado (Tabs / Botones estilo pill) */}
          <Col md={4}>
            <div className="d-flex gap-2">
              {['Activa', 'Próxima', 'Finalizada'].map((est) => (
                <Button
                  key={est}
                  variant={filtroEstado === est ? 'dark' : 'outline-light text-dark border'}
                  size="sm"
                  className="rounded-pill px-3 py-1"
                  onClick={() => setFiltroEstado(est)}
                  style={{ fontSize: '0.8rem' }}
                >
                  {est}s
                </Button>
              ))}
            </div>
          </Col>

          {/* Filtro por Categoría */}
          <Col md={4}>
          <Dropdown>
     
          <Dropdown.Toggle 
            size="sm"
            variant="light"
            className="w-100 bg-light border-0 rounded-pill py-2 px-3 shadow-sm d-flex justify-content-between align-items-center text-start text-secondary fw-medium"
            style={{ fontSize: '0.85rem' }}
           >
          <span>{categoriaActual}</span>
          </Dropdown.Toggle>

     
        <Dropdown.Menu className="shadow-sm border-0 rounded-4 p-2 w-100">
          {categorias.map((cat) => (
          <Dropdown.Item 
            key={cat.id} 
            active={filtroCategoria === cat.id}
            onClick={() => setFiltroCategoria(cat.id)}
            className="dropdown-item rounded-pill my-1" // 👈 Aquí aplicamos tu clase de token.css
            style={{ fontSize: '0.85rem' }}
          >
            {cat.nombre}
          </Dropdown.Item>
        ))}
        </Dropdown.Menu>
        </Dropdown>
        </Col>
          {/* Ordenamiento */}
          <Col md={4}>
          <Dropdown>
          <Dropdown.Toggle 
            size="sm"
            variant="light"
            className="w-100 bg-light border-0 rounded-pill py-2 px-3 shadow-sm d-flex justify-content-between align-items-center text-start text-secondary fw-medium"
            style={{ fontSize: '0.85rem' }}
          >
          <span>
            {orden === "tiempo-asc" && "⏳ Menor tiempo restante (Cierra pronto)"}
            {orden === "precio-desc" && "💰 Mayor puja actual"}
            {!orden && "Ordenar por"}
          </span>
          </Dropdown.Toggle>

          <Dropdown.Menu className="shadow-sm border-0 rounded-4 p-2 w-100">
          <Dropdown.Item 
           active={orden === "tiempo-asc"}
          onClick={() => setOrden("tiempo-asc")}
          className="dropdown-item rounded-pill my-1"
          style={{ fontSize: '0.85rem' }}
            >
          Menor tiempo restante (Cierra pronto)
          </Dropdown.Item>

          <Dropdown.Item 
            active={orden === "precio-desc"}
            onClick={() => setOrden("precio-desc")}
            className="dropdown-item rounded-pill my-1"
            style={{ fontSize: '0.85rem' }}
          >
         Mayor puja actual
          </Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
        </Col>
        </Row>
      </div>

      {/* 📦 Grilla de Resultados */}
      <Row className="g-4">
        {subastasFiltradas.length > 0 ? (
          subastasFiltradas.map((subasta) => (
            <Col key={subasta.id} xs={12} sm={6} lg={4}>
              <SubastaCard subasta={subasta} />
            </Col>
          ))
        ) : (
          <Col xs={12} className="text-center py-5">
            <p className="text-muted">No se encontraron subastas con los filtros seleccionados.</p>
          </Col>
        )}
      </Row>
    </Container>

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
