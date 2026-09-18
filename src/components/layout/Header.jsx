import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { getBilletera } from '../../api/billeterasApi'
import { isAdmin, isVendedor } from '../../utils/auth'
import { Dropdown, Popover } from 'react-bootstrap'

function Header() {
  const token = localStorage.getItem('token')
  const nombre = localStorage.getItem('userNombre')
  const usuarioId = Number(localStorage.getItem('userId'))
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [terminoBusqueda, setTerminoBusqueda] = useState(searchParams.get('busqueda') || '')
  const [saldoDisponible, setSaldoDisponible] = useState(null)
  const [saldoRetenido, setSaldoRetenido] = useState(null)
  const [showPopover, setShowPopover] = useState(false)

useEffect(() => {
    const debeMostrar = sessionStorage.getItem('mostrarOnboarding')
    
    if (debeMostrar === 'true') {
      sessionStorage.removeItem('mostrarOnboarding') // Lo borramos de inmediato para que no se repita
      
      // Esperamos 5 segundos (5000 ms) antes de mostrar el popover
      const timer = setTimeout(() => {
        setShowPopover(true)
      }, 5000)

      // Limpiamos el temporizador si el componente se desmonta antes de tiempo
      return () => clearTimeout(timer)
    }
  }, [location.pathname])
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
              backgroundColor: '#0F172A', 
              fontSize: '0.95rem',
              letterSpacing: '-0.5px'
            }}
          >
            SY
          </div>

          <span style={{ fontWeight: 800, letterSpacing: '-0.5px', color: '#0F172A', fontSize: '1.2rem' }}>
            Subasta<span style={{ color: '#0d9488' }}>Ya</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" className="border-0 shadow-none" />
        
        <Navbar.Collapse id="main-nav">
          {/* Barra de búsqueda */}
          <Form className="d-flex mx-lg-4 my-2 my-lg-0 me-lg-auto" style={{ maxWidth: '400px', width: '100%' }} onSubmit={(e) => e.preventDefault()}>
            <Form.Control 
              type="search" 
              placeholder="Buscar productos o lotes..." 
              className="bg-light border-0 py-2 px-3 rounded-pill"
              style={{ fontSize: '0.85rem' }}
              value={terminoBusqueda}
              onChange={handleSearchChange}
            />
          </Form>

          {/* Sección Derecha */}
          <div className="d-flex flex-wrap align-items-center gap-3 mt-3 mt-lg-0 ms-lg-auto">
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
              <div className="d-flex align-items-center gap-3 position-relative">
                {/* Menú Desplegable */}
                <Dropdown 
                  align="end" 
                  onToggle={(isOpen) => {
                    if (isOpen && showPopover) setShowPopover(false)
                  }}
                >
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

                    {isAdmin() && (
                      <Dropdown.Item as={Link} to="/admin/auditoria" className="py-2 px-3 d-flex align-items-center gap-2 text-dark fw-semibold" style={{ fontSize: '0.85rem' }}>
                        Auditoría
                      </Dropdown.Item>
                    )}

                    {isVendedor() && (
                      <Dropdown.Item as={Link} to="/subastas/nueva" className="py-2 px-3 d-flex align-items-center gap-2 text-dark fw-semibold" style={{ fontSize: '0.85rem' }}>
                        Publicar Subasta
                      </Dropdown.Item>
                    )}

                    <Dropdown.Divider className="my-1" />

                    <Dropdown.Item onClick={handleLogout} className="py-2 px-3 dropdown-logout d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
                      Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                {/* Cartel flotante de bienvenida */}
                {showPopover && (
                  <div 
                    className="position-absolute shadow-lg bg-white border-0 rounded-4 p-3 text-center"
                    style={{ 
                      top: 'calc(100% + 10px)', 
                      right: '0', 
                      minWidth: '230px', 
                      zIndex: 9999,
                      border: '1px solid var(--color-border)',
                      boxShadow: 'var(--shadow)',
                      animation: 'fadeInSlow 0.6s ease-in-out',
                      opacity: 1
                    }}
                  ><style>
                  {`
                  @keyframes fadeInSlow {
                  from {
                  opacity: 0;
                  transform: translateY(-4px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                  }
                  `}
                    </style>
                    <p className="mb-2 fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>
                      ¡Bienvenido! 👋
                    </p>
                    <p className="mb-2 text-muted" style={{ fontSize: '0.80rem', lineHeight: '1.3' }}>
                      Haz clic aquí para publicar subastas, cargar saldo o ver tus actividades.
                    </p>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="w-100 rounded-pill py-1" 
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setShowPopover(false)}
                    >
                      Entendido
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Button as={Link} to="/login" variant="outline-primary" size="sm" className="rounded-pill px-4 py-2 fw-semibold" style={{ fontSize: '0.85rem' }}>
                  Iniciar Sesión
                </Button>
                <Button as={Link} to="/register" variant="primary" size="sm" className="rounded-pill px-4 py-2 fw-semibold" style={{ fontSize: '0.85rem' }}>
                  Registrarse
                </Button>
              </div>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header