import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'

function SubastaCard({ subasta }) {

  // Lógica para determinar la oferta actual (si hay mejorPuja, se muestra, sino el precioInicial)
  const precioActual = subasta.mejorPuja || subasta.precioInicial || 0
  const cantidadPujas = subasta.pujas?.length || 0


  return (
    <Card className="h-100 shadow-sm border-0 overflow-hidden">
      {/* Imagen Referencial */}
      <div style={{ height: '180px', backgroundColor: '#f8f9fa' }} className="position-relative">
        <Card.Img 
        variant="top" 
        src={subasta.urlImagen || subasta.UrlImagen || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'} 
        alt={subasta.titulo}
        style={{ height: '180px', objectFit: 'cover' }}
        />
        {/* Badge de Estado flotante */}
        <div className="position-absolute top-0 end-0 m-2">
          <Badge bg={subasta.estado === 'Activa' ? 'success' : 'secondary'}>
            {subasta.estado || 'Activa'}
          </Badge>
        </div>
      </div>

      <Card.Body className="d-flex flex-column">
        {/* Categoría */}
        <div className="mb-1">
          <span className="text-muted small text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>
            {subasta.categoriaNombre || 'General'}
          </span>
        </div>

        {/* Título */}
        <Card.Title className="fs-6 fw-bold mb-2">
          <Link to={`/subastas/${subasta.id}`} className="text-decoration-none text-dark stretched-link">
            {subasta.titulo}
          </Link>
        </Card.Title>

        {/* Descripción corta */}
        <Card.Text className="text-secondary small text-truncate mb-3">
          {subasta.descripcion}
        </Card.Text>

        <div className="mt-auto">
          {/* Oferta más alta y Cantidad de ofertas */}
          <div className="bg-light p-2 rounded mb-2 d-flex justify-content-between align-items-center">
            <div>
              <span className="d-block text-secondary" style={{ fontSize: '0.7rem' }}>Oferta actual</span>
              <strong className="text-success fs-6">${precioActual.toLocaleString('es-AR')}</strong>
            </div>
            <div className="text-end">
              <span className="d-block text-secondary" style={{ fontSize: '0.7rem' }}>Pujas</span>
              <Badge bg="light" text="dark" className="border">
                {cantidadPujas} {cantidadPujas === 1 ? 'oferta' : 'ofertas'}
              </Badge>
            </div>
          </div>

          {/* Contador regresivo visible / Fecha de cierre */}
          <div className="d-flex align-items-center justify-content-between pt-2 border-top text-muted small">
            <span>⏱️ Cierra:</span>
            <span className="fw-semibold text-dark">
              {new Date(subasta.fechaFin).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })} hs
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default SubastaCard