import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'

function anonimizar(nombre, id) {
  if (!nombre) return `Postor #${id}`
  const parts = nombre.trim().split(/\s+/)
  if (parts.length === 1) return parts[0]
  return `${parts[0]} ${parts[1][0]}.`
}

function ListaPujas({ pujas, usuarioActualId }) {
  if (!pujas?.length) {
    return <p className="text-muted mb-0">Todavía no hay pujas en esta subasta.</p>
  }

  const maxMonto = Math.max(...pujas.map((p) => Number(p.monto)))

  // Más reciente primero (historial en vivo)
  const ordenadas = [...pujas].sort(
    (a, b) =>
      new Date(b.fechaPuja || b.fecha_Puja) - new Date(a.fechaPuja || a.fecha_Puja)
  )

  return (
    <ListGroup variant="flush">
      {ordenadas.map((p) => {
        const esMejor = Number(p.monto) === maxMonto
        const esMia = usuarioActualId != null && p.compradorId === usuarioActualId

        return (
          <ListGroup.Item
            key={p.id}
            className="d-flex justify-content-between align-items-center px-0"
          >
            <div>
              <span className="fw-semibold">
                ${Number(p.monto).toLocaleString('es-AR')}
              </span>
              {esMejor && (
                <Badge bg="success" className="ms-2">
                  Líder
                </Badge>
              )}
              {esMia && (
                <Badge bg="primary" className="ms-2">
                  Vos
                </Badge>
              )}
              <div className="small text-muted">
                {anonimizar(p.compradorNombre, p.compradorId)}
              </div>
            </div>
            <small className="text-muted">
              {new Date(p.fechaPuja || p.fecha_Puja).toLocaleTimeString('es-AR')}
            </small>
          </ListGroup.Item>
        )
      })}
    </ListGroup>
  )
}

export default ListaPujas