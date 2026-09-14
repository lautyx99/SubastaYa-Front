import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'
import { login } from '../api/authApi'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('comprador2@test.com')
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data = await login({ email, password })
      const token = data.token || data.accessToken

      if (!token) {
        setError('El servidor no devolvió un token')
        return
      }

      localStorage.setItem('token', token)
      if (data.email) localStorage.setItem('userEmail', data.email)
      if (data.nombre) localStorage.setItem('userNombre', data.nombre)
      if (data.rol) localStorage.setItem('userRol', data.rol)

      navigate('/')
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.status === 401
          ? 'Email o contraseña incorrectos'
          : err.message || 'No se pudo iniciar sesión'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <Card className="shadow-sm">
          <Card.Body className="p-4">
            <h1 className="h4 mb-3">Iniciar sesión</h1>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </Form>

            <p className="small text-muted mt-3 mb-0">
              <Link to="/">Volver a subastas</Link>
            </p>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage