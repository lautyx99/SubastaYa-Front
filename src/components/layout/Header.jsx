import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { getBilletera } from '../../api/billeterasApi'
import { isVendedor } from '../../utils/auth'

function Header() {
  const token = localStorage.getItem('token')
  const nombre = localStorage.getItem('userNombre')
  const usuarioId = Number(localStorage.getItem('userId'))
  const navigate = useNavigate()

  const [saldoDisponible, setSaldoDisponible] = useState(null)
  const [saldoRetenido, setSaldoRetenido] = useState(null)

  const cargarSaldo = () => {
    if (!token || !usuarioId) {
      setSaldoDisponible(null)
      setSaldoRetenido(null)
      return
    }

    getBilletera(usuarioId)
      .then((b) => {
        setSaldoDisponible(Number(b.saldoDisponible) || 0)
        setSaldoRetenido(Number(b.saldoRetenido) || 0)
      })
      .catch(() => {
        setSaldoDisponible(null)
        setSaldoRetenido(null)
      })
  }

  useEffect(() => {
    cargarSaldo()
  }, [token, usuarioId])

  // Opcional: refrescar al volver a la pestaña
  useEffect(() => {
    const onFocus = () => cargarSaldo()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [token, usuarioId])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userNombre')
    localStorage.removeItem('userRol')
    setSaldoDisponible(null)
    setSaldoRetenido(null)
    navigate('/login')
  }

  return (
    <Navbar bg="white" expand="lg" sticky="top" className="border-bottom shadow-sm py-2">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-dark">
          SubastaYa
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Form className="d-flex mx-lg-3 my-2 my-lg-0 flex-grow-1" onSubmit={(e) => e.preventDefault()}>
            <Form.Control type="search" placeholder="Buscar producto..." />
          </Form>

          <Nav className="align-items-lg-center gap-lg-1">
            <Nav.Link as={Link} to="/">
              Subastas
            </Nav.Link>
            {token && (
              <Nav.Link as={Link} to="/billetera">
                Billetera
              </Nav.Link>
            )}
          </Nav>

          <div className="d-flex flex-wrap align-items-center gap-3 ms-lg-3 mt-2 mt-lg-0">
            {token && saldoDisponible != null && (
              <>
                <div className="text-end">
                  <div className="text-secondary small">Disponible</div>
                  <span className="text-success fw-semibold">
                    💰 ${saldoDisponible.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="text-end">
                  <div className="text-secondary small">Retenido</div>
                  <span className="text-secondary fw-semibold">
                    🔒 ${saldoRetenido.toLocaleString('es-AR')}
                  </span>
                </div>
              </>
            )}

            {token ? (
              <>
                <div className="text-end border-start ps-3">
                  <div className="text-secondary small">Usuario</div>
                  <span className="fw-semibold">👤 {nombre || 'Usuario'}</span>
                </div>

                {token && isVendedor() && (
                <Button as={Link} to="/subastas/nueva" variant="primary" size="sm">
                  ➕ Publicar
                </Button>
                )}
                <Button variant="outline-secondary" size="sm" onClick={handleLogout}>
                  Salir
                </Button>
              </>
            ) : (
              <Button as={Link} to="/login" variant="outline-primary" size="sm">
                Ingresar
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header