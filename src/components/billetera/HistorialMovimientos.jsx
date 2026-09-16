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
          {movimientos.map((m, index) => {
            const id = m.id || m.Id || index
            const fecha = m.fecha || m.Fecha
            const tipo = m.tipo || m.Tipo
            const monto = m.monto ?? m.Monto ?? 0
            const subastaId = m.subastaId || m.SubastaId

            return (
              <tr key={id}>
                <td className="small">
                  {fecha ? new Date(fecha).toLocaleString('es-AR') : '—'}
                </td>
                <td>
                  <Badge bg={tipoBadge[tipo] || 'secondary'}>
                    {tipo || 'Movimiento'}
                  </Badge>
                </td>
                <td className="fw-semibold">
                  ${Number(monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </td>
                <td className="small text-muted">
                  {subastaId ? `#${subastaId}` : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}

export default HistorialMovimientos