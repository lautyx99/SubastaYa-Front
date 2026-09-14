import Card from 'react-bootstrap/Card'

function SubastaGaleria({ titulo, urlImagen }) {
  return (
    <Card className="mb-3 shadow-sm">
      <div
        className="bg-secondary-subtle d-flex align-items-center justify-content-center"
        style={{ height: 280 }}
      >
        {urlImagen ? (
          <img
            src={urlImagen}
            alt={titulo}
            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
          />
        ) : (
          <span className="text-muted">Sin imagen</span>
        )}
      </div>
    </Card>
  )
}

export default SubastaGaleria