import { useEffect, useState } from 'react'
import { getSubastas } from '../api/subastasApi'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import SubastaCard from '../components/subastas/SubastaCard'
import { Button, Card, Container, Dropdown } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import { getCategorias } from '../api/categoriasApi';
import Placeholder from 'react-bootstrap/Placeholder';

function SubastasPage() {
  const [subastas, setSubastas] = useState([])
  const [faseCarga, setFaseCarga] = useState('spinner');
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()
  const [categorias, setCategorias] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Activa') 
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [orden, setOrden] = useState('tiempo-asc') 
  const queryBusqueda = searchParams.get('busqueda')?.toLowerCase() || ''

const subastasFiltradas = subastas
    .filter((s) => {

      if (queryBusqueda) {
        const coincideTitulo = s.titulo?.toLowerCase().includes(queryBusqueda);
        const coincideDesc = s.descripcion?.toLowerCase().includes(queryBusqueda);
        if (!coincideTitulo && !coincideDesc) return false;
      }


      if (filtroEstado) {
        const normalizar = (str) => 
            str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

        if (normalizar(s.estado) !== normalizar(filtroEstado)) {
            return false;
        }
      }
      
      if (filtroCategoria && filtroCategoria !== "" && filtroCategoria !== "todos" && filtroCategoria !== "0") {
       
        const catSubasta = s.categoriaId ?? s.CategoriaId ?? s.categoria?.id ?? s.Categoria?.Id ?? s.categoriaId;

        if (!catSubasta || catSubasta.toString() !== filtroCategoria.toString()) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (orden === 'tiempo-asc') {
        return new Date(a.fechaFin) - new Date(b.fechaFin);
      }
      if (orden === 'precio-desc') {
        const precioA = a.mejorPuja || a.precioInicial || 0;
        const precioB = b.mejorPuja || b.precioInicial || 0;
        return precioB - precioA;
      }
      return 0;
    });


useEffect(() => {

    setFaseCarga('spinner');

    const timerToSkeleton = setTimeout(() => {
      setFaseCarga('skeleton');
    }, 300);

    Promise.all([
      getSubastas(),
      getCategorias() 
    ])
      .then(([dataSubastas, dataCategorias]) => {
        setSubastas(dataSubastas);
        setCategorias(dataCategorias); 
      })
      .catch((err) => {
        console.error("Error al cargar datos iniciales:", err);
      })
      .finally(() => {
        clearTimeout(timerToSkeleton);
        setFaseCarga('listo');
      });

    return () => clearTimeout(timerToSkeleton);
  }, []);

  const categoriaActual = categorias.find(c => String(c.id) === String(filtroCategoria))?.nombre || "Filtrar por categoría";


if (error) return <Alert variant="danger">{error}</Alert>

return (
  <>
    <Container className="py-4">
      {/* Barra de Filtros */}
      <div className="bg-white p-3 rounded-4 border shadow-sm mb-4" style={{ borderColor: '#eaeef2' }}>
        <Row className="g-3 align-items-center">

          
          {/* Filtro por Estado */}
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
          <span>
            {categorias.find(c => String(c.id ?? c.categoriaId ?? c.Id) === String(filtroCategoria))?.nombre || 
             categorias.find(c => String(c.id ?? c.categoriaId ?? c.Id) === String(filtroCategoria))?.descripcion || 
             "Todas las categorías"}
          </span>
        </Dropdown.Toggle>
     
        <Dropdown.Menu className="shadow-sm border-0 rounded-4 p-2 w-100">
          {/* Opción para limpiar el filtro / Todas */}
          <Dropdown.Item 
            onClick={() => setFiltroCategoria("")}
            active={!filtroCategoria}
            className="dropdown-item rounded-pill my-1" 
            style={{ fontSize: '0.85rem' }}
          >
            Todas las categorías
          </Dropdown.Item>

          {/* Validamos y mapeamos las categorías de forma segura */}
          {categorias && categorias.length > 0 ? (
            categorias.map((cat, index) => {
              const catId = cat.id ?? cat.categoriaId ?? cat.Id;
              const catNombre = cat.nombre ?? cat.descripcion ?? cat.Nombre ?? cat.Descripcion ?? `Categoría ${index}`;
              
              return (
                <Dropdown.Item 
                  key={catId || index} 
                  active={String(filtroCategoria) === String(catId)}
                  onClick={() => setFiltroCategoria(catId)}
                  className="dropdown-item rounded-pill my-1" 
                  style={{ fontSize: '0.85rem' }}
                >
                  {catNombre}
                </Dropdown.Item>
              );
            })
          ) : (
            <Dropdown.Item disabled className="text-muted text-center" style={{ fontSize: '0.85rem' }}>
              No hay categorías cargadas
            </Dropdown.Item>
          )}
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

      {/* Grilla de Resultados */}
      <Row className="g-4">
        {faseCarga === 'spinner' ? (
          /* 🌀 FASE 1: SPINNER CENTRADO */
          <Col xs={12} className="text-center py-5">
            <Spinner animation="border" variant="dark" className="mb-2" />
            <p className="text-muted small">Cargando subastas...</p>
          </Col>
        ) : faseCarga === 'skeleton' ? (
          /* 🦴 FASE 2: SKELETONS */
          [1, 2, 3, 4, 5, 6].map((n) => (
            <Col key={n} xs={12} sm={6} lg={4}>
              <Card className="shadow-sm border-0 h-100 p-3">
                <div className="bg-secondary bg-opacity-10 rounded mb-3 w-100" style={{ height: '200px' }} />
                <Card.Body className="p-0">
                  <Placeholder as={Card.Title} animation="glow">
                    <Placeholder xs={8} className="rounded" />
                  </Placeholder>
                  <Placeholder as={Card.Text} animation="glow" className="mt-3">
                    <Placeholder xs={10} className="rounded mb-1" />
                    <Placeholder xs={6} className="rounded" />
                  </Placeholder>
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <Placeholder.Button xs={5} aria-hidden="true" className="rounded-pill" />
                    <Placeholder xs={4} className="rounded" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : subastasFiltradas.length > 0 ? (
          /* ✅ FASE 3: DATOS REALES */
          subastasFiltradas.map((subasta) => (
            <Col key={subasta.id} xs={12} sm={6} lg={4}>
              <SubastaCard subasta={subasta} />
            </Col>
          ))
        ) : (
          /* 📭 SIN RESULTADOS */
          <Col xs={12} className="text-center py-5">
            <p className="text-muted">No se encontraron subastas con los filtros seleccionados.</p>
          </Col>
        )}
      </Row>
    </Container>
  </>
)
}

export default SubastasPage
