import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'

function SubastaInfo({ subasta }) {
  return (
    <>
      <div className="d-flex align-items-center gap-2 mb-2">
        <Badge bg={subasta.estado === 'Activa' ? 'success' : 'secondary'}>
          {subasta.estado}
        </Badge>
        {subasta.categoriaNombre && (
          <span className="text-muted small">
            Categoría: {subasta.categoriaNombre}
          </span>
        )}
      </div>

      <h1 className="h3 mb-3">{subasta.titulo}</h1>

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="h5">Descripción</Card.Title>
          <Card.Text className="mb-0">{subasta.descripcion}</Card.Text>
        </Card.Body>
      </Card>
    </>
  )
}

export default SubastaInfo