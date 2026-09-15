import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

function PanelSaldo({ billetera }) {
  const total = Number(billetera?.saldoTotal) || 0
  const retenido = Number(billetera?.saldoRetenido) || 0
  const disponible = Number(billetera?.saldoDisponible) || total - retenido

  const cards = [
    {
      titulo: 'Saldo Total',
      valor: total,
      color: 'primary',
      hint: 'Fondos totales en la cuenta',
    },
    {
      titulo: 'Saldo Retenido',
      valor: retenido,
      color: 'secondary',
      hint: 'Bloqueado en pujas líderes',
      icon: '🔒',
    },
    {
      titulo: 'Saldo Disponible',
      valor: disponible,
      color: 'success',
      hint: 'Para nuevas pujas o retiros',
    },
  ]

  return (
    <Row className="g-3 mb-4">
      {cards.map((c) => (
        <Col md={4} key={c.titulo}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <p className="text-muted small mb-1">
                {c.icon ? `${c.icon} ` : ''}
                {c.titulo}
              </p>
              <p className={`fs-4 fw-bold text-${c.color} mb-1`}>
                ${c.valor.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </p>
              <p className="small text-muted mb-0">{c.hint}</p>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default PanelSaldo