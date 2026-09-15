import { Navigate, Link } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert'
import { isAuthenticated, isVendedor } from '../../utils/auth'

function SoloVendedores({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  if (!isVendedor()) {
    return (
      <Alert variant="warning" className="mt-3">
        Solo los vendedores pueden publicar subastas.{' '}
        <Link to="/">Volver</Link>
      </Alert>
    )
  }

  return children
}

export default SoloVendedores