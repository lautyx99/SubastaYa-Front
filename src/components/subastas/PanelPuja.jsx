import { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import { crearPuja } from '../../api/pujasApi'
import {useToast} from '../../context/ToastContext'
import { Link } from 'react-router-dom'
import { getToken , getUserId, getUserRol} from '../../utils/auth'

function PanelPuja({ subasta, pujas = [], usuarioActualId, onPujaCreada}) {
  const incremento = Number(subasta.incrementoMinimo) || 0
  const ofertaActual = Number(subasta.mejorPuja ?? subasta.precioInicial) || 0

  const [monto, setMonto] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(null)

   const { push } = useToast()

   const userId = usuarioActualId ?? getUserId()
   const rol = getUserRol().toLowerCase()

   const esMiSubasta = userId != null && subasta.vendedorId === userId
   const esVendedor = rol === 'vendedor'
   const esComprador = rol === 'comprador'

   

  const mejor = pujas?.length
  ? pujas.reduce((a, b) => (Number(b.monto) > Number(a.monto) ? b : a))
  : null

const voyLiderando =
  usuarioActualId && mejor && mejor.compradorId === usuarioActualId

const fuiSuperado =
  usuarioActualId && mejor && mejor.compradorId !== usuarioActualId

  useEffect(() => {
    setMonto(String(ofertaActual + incremento))
    setError(null)
    setExito(null)
  }, [ofertaActual, incremento, subasta.id])

  const sumarIncremento = () => {
    const actual = Number(monto) || ofertaActual
    setMonto(String(actual + incremento))
  }

  const handlePujar = async () => {
    setError(null)
    setExito(null)

    const montoNumero = Number(monto)
    if (!montoNumero || montoNumero < ofertaActual + incremento) {
      setError(`El monto mínimo es $${(ofertaActual + incremento).toLocaleString('es-AR')}`)
      return
    }

    setLoading(true)
      try {
      await crearPuja({
        subastaId: subasta.id,
        monto: montoNumero,
      })

      window.dispatchEvent(new Event('billeteraActualizada'));

      // Solo si salió bien
      push(`¡Puja registrada por $${montoNumero.toLocaleString('es-AR')}!`, 'success')
      setExito(`¡Puja registrada por $${montoNumero.toLocaleString('es-AR')}!`)
      onPujaCreada?.()
      } catch (err) {
      const msg =
      err.response?.data?.message ||
      err.response?.data?.title ||
      (typeof err.response?.data === 'string' ? err.response.data : null) ||
      err.message ||
      'No se pudo realizar la puja'

      // Error (400 saldo, validación, etc.)
      if (err.response?.status === 400) {
      push(msg || 'Fondos insuficientes o monto inválido', 'danger')
      } else {
      push(msg, 'danger')
      }

      setError(msg)
      } finally {
      setLoading(false)
      }
  }

  
  const puedePujar =
  !loading &&
  String(subasta?.estado || '').trim().toLowerCase() === 'activa' &&
  Boolean(getToken()) &&
  !esMiSubasta

  return (
    

    <div className="sticky-top" style={{ top: 88 }}>
      <Card className="shadow-sm border-0">
        <Card.Body>
          <p className="text-muted small mb-1">Vendedor</p>
          <p className="fw-semibold">
            {subasta.vendedorNombre || `Usuario #${subasta.vendedorId}`}
          </p>
          <hr />

          <p className="text-muted small mb-1">Oferta actual</p>
          <p className="fs-3 fw-bold text-primary mb-1">
            ${ofertaActual.toLocaleString('es-AR')}
          </p>
          <p className="small text-muted">
            Incremento mínimo: ${incremento.toLocaleString('es-AR')}
          </p>
          <p className="small mb-3">
            <strong>Cierra:</strong>{' '}
            {new Date(subasta.fechaFin).toLocaleString('es-AR')}
          </p>

          {voyLiderando && (
          <Alert variant="success" className="py-2 small">
            ✅ Vas liderando esta subasta
          </Alert>
          )}
          {fuiSuperado && (
          <Alert variant="warning" className="py-2 small">
            ⚠️ Te han superado. Nueva oferta: ${Number(mejor.monto).toLocaleString('es-AR')}
          </Alert>
          )}

          {!getToken() && (
          <Alert variant="info" className="py-2 small">
          <Link to="/login">Iniciá sesión</Link> para pujar.
          </Alert>
          )}

          {esMiSubasta && (
          <Alert variant="secondary" className="py-2 small">
          No podés pujar en tu propia subasta.
          </Alert>
          )}

          <Form.Group className="mb-2">
            <Form.Label>Tu oferta</Form.Label>
            <Form.Control
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              disabled={!puedePujar}
            />
          </Form.Group>

          <div className="d-flex gap-2 mb-3">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={sumarIncremento}
              disabled={!puedePujar}
            >
              +${incremento.toLocaleString('es-AR')}
            </Button>
          </div>

          <Button
            variant="primary"
            className="w-100"
            disabled={!puedePujar}
            onClick={handlePujar}
          >
            {loading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Procesando oferta...
              </>
            ) : (
              'Realizar puja'
            )}
          </Button>

          {error && (
            <Alert variant="danger" className="mt-3 mb-0 py-2 small">
              {error}
            </Alert>
          )}
          {exito && (
            <Alert variant="success" className="mt-3 mb-0 py-2 small">
              {exito}
            </Alert>
          )}
          {subasta.estado !== 'Activa' && (
            <Alert variant="secondary" className="mt-3 mb-0 py-2 small">
              Esta subasta no acepta pujas ({subasta.estado})
            </Alert>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default PanelPuja