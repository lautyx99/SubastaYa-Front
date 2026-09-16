import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { getBilletera } from '../../api/billeterasApi'
import { isVendedor } from '../../utils/auth'
import { Dropdown } from 'react-bootstrap'

function Header() {
  const token = localStorage.getItem('token')
  const nombre = localStorage.getItem('userNombre')
  const usuarioId = Number(localStorage.getItem('userId'))
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams();
  const [terminoBusqueda, setTerminoBusqueda] = useState(searchParams.get('busqueda') || '')
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

  useEffect(() => {
    const onFocus = () => cargarSaldo()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [token, usuarioId])


  useEffect(() => {
    const handleActualizacion = () => cargarSaldo()

    window.addEventListener('focus', handleActualizacion)
    window.addEventListener('billeteraActualizada', handleActualizacion)

    return () => {
      window.removeEventListener('focus', handleActualizacion)
      window.removeEventListener('billeteraActualizada', handleActualizacion)
    }
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

  const handleSearchChange = (e) => {
    const valor = e.target.value
    setTerminoBusqueda(valor)

    // Actualiza los parámetros de la URL en tiempo real
    if (valor.trim() !== '') {
      setSearchParams({ busqueda: valor })
    } else {
      setSearchParams({})
    }
  }

  return (
    <Navbar bg="white" expand="lg" sticky="top" className="border-bottom py-3 shadow-sm" style={{ borderColor: '#eaeef2' }}>
      <Container fluid className="px-4">
        {/* Brand */}
        <Navbar.Brand as={Link} to="/" className="fw-bold text-dark fs-5 d-flex align-items-center gap-2">

        <div 
        className="d-flex align-items-center justify-content-center rounded-3 text-white fw-bold shadow-sm"
        style={{ 
          width: '36px', 
          height: '36px', 
          backgroundColor: '#0F172A', /* Color oscuro principal de tus tokens */
          fontSize: '0.95rem',
          letterSpacing: '-0.5px'
          }}>
          SY
          </div>

          <span style={{ fontWeight: 800, letterSpacing: '-0.5px', color: '#0F172A', fontSize: '1.2rem' }}>
           Subasta<span style={{ color: '#0d9488' }}>Ya</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" className="border-0 shadow-none" />
        
        <Navbar.Collapse id="main-nav">
          {/* Barra de búsqueda central limpia */}
          <Form className="d-flex mx-lg-4 my-2 my-lg-0 flex-grow-1" style={{ maxWidth: '400px' }} onSubmit={(e) => e.preventDefault()}>
            <Form.Control 
              type="search" 
              placeholder="Buscar productos o lotes..." 
              className="bg-light border-0 py-2 px-3 rounded-pill"
              style={{ fontSize: '0.85rem' }}
              value={terminoBusqueda}
              onChange={handleSearchChange}
            />
          </Form>

          {/* Enlaces de navegación */}
          <Nav className="me-auto align-items-lg-center gap-lg-2">
            <Nav.Link as={Link} to="/" className={`custom-nav-link ${location.pathname === '/' || location.pathname.startsWith('/subastas') ? 'active-page' : ''}`}>
              Subastas
            </Nav.Link>
          </Nav>

         {/* Sección Derecha: Saldos y Menú de Usuario */}
          <div className="d-flex flex-wrap align-items-center gap-3 mt-3 mt-lg-0">
            {token && saldoDisponible != null && (
              <div className="d-flex align-items-center gap-3 px-3 py-1 rounded-pill bg-light border" style={{ borderColor: '#edf2f7' }}>
                <div>
                  <span className="text-muted d-block" style={{ fontSize: '0.6rem', textTransform: 'uppercase', fontWeight: 600 }}>Disponible</span>
                  <span className="text-success fw-bold" style={{ fontSize: '0.85rem' }}>
                    ${saldoDisponible.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="border-start ps-2">
                  <span className="text-muted d-block" style={{ fontSize: '0.6rem', textTransform: 'uppercase', fontWeight: 600 }}>Retenido</span>
                  <span className="text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>
                    ${saldoRetenido.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            )}

            {token ? (
              <div className="d-flex align-items-center gap-3">
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    variant="light" 
                    id="dropdown-usuario" 
                    className="d-flex align-items-center gap-2 border-0 bg-transparent py-1 px-2 shadow-none"
                  >
                    <div className="text-end d-none d-xl-block">
                      <span className="text-muted d-block" style={{ fontSize: '0.6rem', textTransform: 'uppercase' }}>Bienvenido</span>
                      <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{nombre || 'Usuario'}</span>
                    </div>
                    <div 
                      className="rounded-circle bg-light border d-flex align-items-center justify-content-center text-dark fw-bold"
                      style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}
                    >
                      {nombre ? nombre.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </Dropdown.Toggle>

                 <Dropdown.Menu className="shadow-sm border-0 py-2 mt-2" style={{ borderRadius: '12px', minWidth: '200px' }}>
                <div className="px-3 py-2 d-xl-none border-bottom mb-1">
                <span className="text-muted d-block" style={{ fontSize: '0.6rem', textTransform: 'uppercase' }}>Conectado como</span>
                <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{nombre || 'Usuario'}</span>
                </div>

                <Dropdown.Item as={Link} to="/billetera" className="py-2 px-3 d-flex align-items-center gap-2 text-dark fw-semibold" style={{ fontSize: '0.85rem' }}>
                Mi Billetera
                </Dropdown.Item>

                <Dropdown.Item as={Link} to="/mis-actividades" className="py-2 px-3 d-flex align-items-center gap-2 text-dark fw-semibold" style={{ fontSize: '0.85rem' }}>
                Mis Actividades
                </Dropdown.Item>

                {isVendedor() && (
                <Dropdown.Item as={Link} to="/subastas/nueva" className="py-2 px-3 d-flex align-items-center gap-2 text-dark fw-semibold" style={{ fontSize: '0.85rem' }}>
               Publicar Subasta
                </Dropdown.Item>
              )}

              <Dropdown.Divider className="my-1" />

              {/* Opción de Cerrar Sesión en Rojo con letras blancas */}
              <Dropdown.Item onClick={handleLogout} className="py-2 px-3 dropdown-logout d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
               Cerrar Sesión
              </Dropdown.Item>
              </Dropdown.Menu>
                </Dropdown>
              </div>
            ) : (
              <Button as={Link} to="/login" variant="primary" size="sm" className="rounded-pill px-4 py-2 fw-semibold" style={{ fontSize: '0.85rem' }}>
                Iniciar Sesión
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header