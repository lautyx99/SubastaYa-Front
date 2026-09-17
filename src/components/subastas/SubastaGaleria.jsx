import Card from 'react-bootstrap/Card'

function SubastaGaleria({ titulo, urlImagen }) {
  return (
    <Card className="border rounded-4 overflow-hidden shadow-sm border-0 mt-3" style={{ borderColor: '#eaeef2' }}>
      <div
        className="position-relative overflow-hidden d-flex align-items-center justify-content-center p-3"
        style={{ height: '380px', backgroundColor: '#f4f6f8' }}
      >
        {urlImagen ? (
          <img
            src={urlImagen}
            alt={titulo || 'Imagen de la subasta'}
            className="img-fluid"
            style={{ 
              maxHeight: '100%', 
              maxWidth: '100%', 
              objectFit: 'contain',
              objectPosition: 'center'
            }}
          />
        ) : (
          <span className="text-muted fw-semibold" style={{ fontSize: '0.9rem' }}>Sin imagen disponible</span>
        )}
      </div>
    </Card>
  )
}

export default SubastaGaleria