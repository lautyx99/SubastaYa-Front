import { Link , useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import { Button } from 'react-bootstrap'

function Header() {
  const saldoDisponible = 105000
  const saldoRetenido = 45000

  const token = localStorage.getItem('token')
  const nombre = localStorage.getItem('userNombre')
  const navigate = useNavigate()

  const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('userNombre')
  localStorage.removeItem('userRol')
  navigate('/login')
}

  return (
    <Navbar bg="white" expand="lg" sticky="top" className="border-bottom shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-dark">
          SubastaYa
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Form className="d-flex mx-lg-3 my-2 my-lg-0 flex-grow-1">
            <Form.Control
              type="search"
              placeholder="Buscar producto..."
              className="me-2"
            />
          </Form>

          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Subastas
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center gap-3">
            <span className="text-success fw-semibold">
              💰 ${saldoDisponible.toLocaleString('es-AR')}
            </span>
            <span className="text-secondary">
              🔒 ${saldoRetenido.toLocaleString('es-AR')}
            </span>
            <Badge bg="danger" pill>
              3
            </Badge>
            {token ? (
  <>
    <span className="fw-semibold">👤 {nombre || 'Usuario'}</span>
    <Button variant="outline-secondary" size="sm" onClick={handleLogout}>
      Salir
    </Button>
  </>
) : (
  <Link to="/login">Ingresar</Link>
)}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header