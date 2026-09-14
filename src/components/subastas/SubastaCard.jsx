import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'

function SubastaCard({ subasta }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge bg={subasta.estado === 'Activa' ? 'success' : 'secondary'}>
            {subasta.estado}
          </Badge>
        </div>

        <Card.Title>
          <Link to={`/subastas/${subasta.id}`} className="text-decoration-none text-dark">
            {subasta.titulo}
          </Link>
        </Card.Title>

        <Card.Text className="text-secondary small">
          {subasta.descripcion}
        </Card.Text>

        <p className="mb-1">
          <strong>Precio inicial:</strong> ${subasta.precioInicial?.toLocaleString('es-AR')}
        </p>
        <p className="mb-0 text-muted small">
          Cierra: {new Date(subasta.fechaFin).toLocaleString('es-AR')}
        </p>
      </Card.Body>
    </Card>
  )
}

export default SubastaCard