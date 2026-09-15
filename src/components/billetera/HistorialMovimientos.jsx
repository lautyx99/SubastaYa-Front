import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'

const tipoBadge = {
  Deposito: 'success',
  Retencion: 'warning',
  Liberacion: 'info',
  Debito: 'danger',
}

function HistorialMovimientos({ movimientos }) {
  if (!movimientos?.length) {
    return <p className="text-muted">No hay movimientos todavía.</p>
  }

  return (
    <div className="table-responsive">
      <Table hover className="align-middle">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Monto</th>
            <th>Subasta</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((m) => (
            <tr key={m.id}>
              <td className="small">
                {new Date(m.fecha).toLocaleString('es-AR')}
              </td>
              <td>
                <Badge bg={tipoBadge[m.tipo] || 'secondary'}>{m.tipo}</Badge>
              </td>
              <td className="fw-semibold">
                ${Number(m.monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </td>
              <td className="small text-muted">
                {m.subastaId ? `#${m.subastaId}` : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default HistorialMovimientos