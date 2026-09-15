import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'
import { depositarSaldo } from '../../api/billeterasApi'

function FormCargarSaldo({ usuarioId, onDepositado }) {
  const [monto, setMonto] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [ok, setOk] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setOk(null)

    const valor = Number(monto)
    if (!valor || valor <= 0) {
      setError('Ingresá un monto válido mayor a 0')
      return
    }

    setLoading(true)
    try {
      await depositarSaldo({usuarioId, monto: valor })
      setOk(`Se acreditaron $${valor.toLocaleString('es-AR')}`)
      setMonto('')
      onDepositado?.()
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'No se pudo cargar el saldo'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-sm border-0 mb-4">
      <Card.Body>
        <Card.Title className="h6">Cargar saldo (simulado)</Card.Title>
        {error && <Alert variant="danger" className="py-2">{error}</Alert>}
        {ok && <Alert variant="success" className="py-2">{ok}</Alert>}

        <Form onSubmit={handleSubmit} className="d-flex gap-2 flex-wrap align-items-end">
          <Form.Group className="flex-grow-1">
            <Form.Label>Monto</Form.Label>
            <Form.Control
              type="number"
              min="1"
              step="100"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="Ej: 10000"
            />
          </Form.Group>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Procesando...' : '+ Cargar saldo'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default FormCargarSaldo