import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'

function SubastaCard({ subasta }) {
  const precioActual = subasta.mejorPuja || subasta.precioInicial || 0
  const cantidadPujas = subasta?.cantidadPujas || subasta?.pujas?.length || 0;

  return (
    <Card className="h-100 border rounded-4 overflow-hidden shadow-sm transition-all hover-shadow" style={{ borderColor: '#eaeef2' }}>
      <div style={{ height: '280px', backgroundColor: '#f4f6f8' }} className="position-relative overflow-hidden d-flex align-items-center justify-content-center p-3">
    <Card.Img 
      variant="top" 
      src={subasta.urlImagen || subasta.UrlImagen || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'} 
      alt={subasta.titulo}
      className={`card-img-zoom img-fluid`}
      style={{ 
        maxHeight: '100%', 
        maxWidth: '100%',
        objectFit: 'contain', 
        objectPosition: 'center'
      }}
    />
        {/* Badge de Estado flotante estilo pill */}
        <div className="position-absolute top-0 end-0 m-3">
          <Badge 
            bg={subasta.estado === 'Activa' ? 'success' : 'secondary'} 
            className="px-3 py-2 rounded-pill shadow-sm"
            style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.5px' }}
          >
            {subasta.estado || 'Activa'}
          </Badge>
        </div>
      </div>

      <Card.Body className="d-flex flex-column p-4">
        {/* Categoría tipo etiqueta corporativa */}
        <div className="mb-2">
          <span 
            className="d-inline-block px-2 py-1 rounded text-uppercase fw-bold" 
            style={{ fontSize: '0.65rem', backgroundColor: '#eef2f6', color: '#596780', letterSpacing: '0.5px' }}
          >
            {subasta.categoriaNombre || 'General'}
          </span>
        </div>

        {/* Título principal */}
        <Card.Title className="fw-bold mb-2" style={{ fontSize: '1rem', color: '#1a202c' }}>
          <Link to={`/subastas/${subasta.id}`} className="text-decoration-none text-dark stretched-link">
            {subasta.titulo}
          </Link>
        </Card.Title>

        {/* Descripción corta */}
        <Card.Text className="text-muted small mb-4 text-truncate" style={{ fontSize: '0.85rem' }}>
          {subasta.descripcion}
        </Card.Text>

        <div className="mt-auto">
          {/* Bloque de Oferta Actual / Pujas minimalista */}
          <div className="p-3 rounded-3 mb-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f8fafc', border: '1px solid #edf2f7' }}>
            <div>
              <span className="d-block text-muted" style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>Oferta actual</span>
              <strong style={{ color: '#0d9488', fontSize: '1.1rem' }}>${precioActual.toLocaleString('es-AR')}</strong>
            </div>
            <div className="text-end">
              <span className="d-block text-muted" style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>Pujas</span>
              <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                {cantidadPujas} {cantidadPujas === 1 ? 'oferta' : 'ofertas'}
              </span>
            </div>
          </div>

          {/* Fecha de cierre */}
          <div className="d-flex align-items-center justify-content-between pt-2 border-top text-muted" style={{ fontSize: '0.75rem', borderColor: '#edf2f7 !important' }}>
            <span className="d-flex align-items-center gap-1">⏱️ Cierra:</span>
            <span className="fw-semibold text-dark">
              {new Date(subasta.fechaFin).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default SubastaCard