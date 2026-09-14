import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'

function ListaPujas({ pujas }) {
  if (!pujas?.length) {
    return <p className="text-muted mb-0">Todavía no hay pujas en esta subasta.</p>
  }

  // la más alta primero (por si el backend no ordena)
  const ordenadas = [...pujas].sort((a, b) => Number(b.monto) - Number(a.monto))

  return (
    <ListGroup variant="flush">
      {ordenadas.map((p, index) => (
        <ListGroup.Item
          key={p.id}
          className="d-flex justify-content-between align-items-center px-0"
        >
          <div>
            <span className="fw-semibold">
              ${Number(p.monto).toLocaleString('es-AR')}
            </span>
            {index === 0 && (
              <Badge bg="success" className="ms-2">
                Mejor oferta
              </Badge>
            )}
            <div className="small text-muted">
              {p.compradorNombre || `Usuario #${p.compradorId}`}
            </div>
          </div>
          <small className="text-muted">
            {new Date(p.fechaPuja || p.fecha_Puja).toLocaleString('es-AR')}
          </small>
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}

export default ListaPujas