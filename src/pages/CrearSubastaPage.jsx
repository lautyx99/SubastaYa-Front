import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import Col from 'react-bootstrap/Col'
import { subirImagenACloudinary } from '../api/uploadService'
import { createSubasta } from '../api/subastasApi' // Asegúrate de tener tu función de API configurada
import { Dropdown } from 'react-bootstrap'

function CrearSubastaPage() {
  const navigate = useNavigate()

  // Estados del formulario
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categoriaId, setCategoriaId] = useState('1')
  const [precioInicial, setPrecioInicial] = useState('')
  const [incrementoMinimo, setIncrementoMinimo] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  
  // Archivo e imagen
  const [imagenFile, setImagenFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  // Estados de control de UI
  const [cargando, setCargando] = useState(false)
  const [errorValidacion, setErrorValidacion] = useState('')


  // Manejar previsualización local de la imagen seleccionada
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagenFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  // Lógica principal de envío con validaciones en pantalla
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorValidacion('')

    // 1. Validaciones coherentes y de fechas
    const precioNum = parseFloat(precioInicial)
    const incrementoNum = parseFloat(incrementoMinimo)
    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)
    const ahora = new Date()

    if (precioNum <= 0 || isNaN(precioNum)) {
      setErrorValidacion('El precio base inicial debe ser un valor positivo mayor a 0.')
      return
    }

    if (incrementoNum <= 0 || isNaN(incrementoNum)) {
      setErrorValidacion('El incremento mínimo por puja debe ser un valor positivo mayor a 0.')
      return
    }

    // ⬇️ Agregamos esta validación aquí ⬇️
    if (inicio < ahora) {
      setErrorValidacion('La fecha y hora de inicio no puede ser una fecha u hora que ya pasó.')
      return
    }

    if (fin <= inicio) {
      setErrorValidacion('La fecha y hora de finalización debe ser estrictamente posterior a la fecha de inicio.')
      return
    }
    try {
      setCargando(true)
      let urlImagenFinal = ''

      // 2. Subir imagen a Cloudinary (si seleccionó archivo)
      if (imagenFile) {
        urlImagenFinal = await subirImagenACloudinary(imagenFile)
      }

      // 3. Construir DTO que espera tu backend (CrearSubastaDto)
      const nuevaSubastaDto = {
       titulo: titulo.trim(),
       descripcion: descripcion.trim(),
       urlImagen: urlImagenFinal, // La URL que te devolvió Cloudinary
       precioInicial: precioNum,
       incrementoMinimo: incrementoNum,
       categoriaId: parseInt(categoriaId),
       fechaInicio: inicio.toISOString(),
       fechaFin: fin.toISOString()
      }

      console.log("JSON exacto que se va por Axios:", JSON.stringify(nuevaSubastaDto, null, 2));

      console.log("Lo que se envía al backend:", nuevaSubastaDto);

     await createSubasta(nuevaSubastaDto);

      alert('¡Subasta publicada con éxito!')
      navigate('/') // Redirige al catálogo

    } catch (err) {
      setErrorValidacion(err.message || 'Ocurrió un error al procesar la publicación.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Publicar Nueva Subasta</h2>
        <Button variant="outline-secondary" size="sm" onClick={() => navigate('/')}>
          Volver al catálogo
        </Button>
      </div>

      {errorValidacion && <Alert variant="danger">{errorValidacion}</Alert>}

      <Card className="shadow-sm border-0 p-4">
        <Form onSubmit={handleSubmit}>
          
          {/* TÍTULO Y CATEGORÍA */}
          <div className="row mb-3">
            <Form.Group as={Col} md={8}>
              <Form.Label className="fw-semibold">Título del Producto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej. Consola PlayStation 5 Edición Digital"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group as={Col} md={4}>
            <Dropdown>
    <Dropdown.Toggle 
      size="sm"
      variant="light"
      className="w-100 bg-light border-0 rounded-pill py-2 px-3 shadow-sm d-flex justify-content-between align-items-center text-start text-secondary fw-medium"
      style={{ fontSize: '0.85rem' }}
    >
      <span>
        {categoriaId === "1" && "Tecnología"}
        {categoriaId === "2" && "Coleccionables"}
        {categoriaId === "3" && "Vehículos"}
        {categoriaId === "4" && "Arte y Decoración"}
        {categoriaId === "5" && "Hogar y Textiles"}
        {!categoriaId && "Seleccionar categoría"}
      </span>
    </Dropdown.Toggle>

    <Dropdown.Menu className="shadow-sm border-0 rounded-4 p-2 w-100">
      <Dropdown.Item 
        active={categoriaId === "1"}
        onClick={() => setCategoriaId("1")}
        className="dropdown-item rounded-pill my-1"
        style={{ fontSize: '0.85rem' }}
      >
         Tecnología
      </Dropdown.Item>

      <Dropdown.Item 
        active={categoriaId === "2"}
        onClick={() => setCategoriaId("2")}
        className="dropdown-item rounded-pill my-1"
        style={{ fontSize: '0.85rem' }}
      >
        Coleccionables
      </Dropdown.Item>

      <Dropdown.Item 
        active={categoriaId === "3"}
        onClick={() => setCategoriaId("3")}
        className="dropdown-item rounded-pill my-1"
        style={{ fontSize: '0.85rem' }}
      >
        Vehículos
      </Dropdown.Item>

      <Dropdown.Item 
        active={categoriaId === "4"}
        onClick={() => setCategoriaId("4")}
        className="dropdown-item rounded-pill my-1"
        style={{ fontSize: '0.85rem' }}
      >
        Arte y Decoración
      </Dropdown.Item>

      <Dropdown.Item 
        active={categoriaId === "5"}
        onClick={() => setCategoriaId("5")}
        className="dropdown-item rounded-pill my-1"
        style={{ fontSize: '0.85rem' }}
      >
        Hogar y Textiles
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
            </Form.Group>
          </div>

          {/* DESCRIPCIÓN */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Descripción Detallada</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Detalla el estado del producto, características, accesorios incluidos, etc."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </Form.Group>

          {/* IMAGEN Y PREVIEW */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Imagen Referencial del Producto</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {previewUrl && (
              <div className="mt-2 text-center bg-light p-2 rounded border" style={{ maxHeight: '150px' }}>
                <img src={previewUrl} alt="Vista previa" style={{ maxHeight: '130px', objectFit: 'contain' }} />
              </div>
            )}
          </Form.Group>

          {/* CONFIGURACIÓN ECONÓMICA */}
          <div className="row mb-3">
            <Form.Group as={Col} md={6}>
              <Form.Label className="fw-semibold">Precio Base Inicial ($)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                step="any"
                placeholder="Ej. 50000"
                value={precioInicial}
                onChange={(e) => setPrecioInicial(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group as={Col} md={6}>
              <Form.Label className="fw-semibold">Incremento Mínimo por Puja ($)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                step="any"
                placeholder="Ej. 2000"
                value={incrementoMinimo}
                onChange={(e) => setIncrementoMinimo(e.target.value)}
                required
              />
            </Form.Group>
          </div>

          {/* VENTANA TEMPORAL */}
          <div className="row mb-4">
            <Form.Group as={Col} md={6}>
              <Form.Label className="fw-semibold">Fecha y Hora de Inicio</Form.Label>
              <Form.Control
                type="datetime-local"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group as={Col} md={6}>
              <Form.Label className="fw-semibold">Fecha y Hora de Finalización</Form.Label>
              <Form.Control
                type="datetime-local"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                required
              />
            </Form.Group>
          </div>

          {/* BOTÓN DE ACCIÓN */}
          <div className="d-grid">
            <Button className="btn-dark-modern rounded-pill py-2 px-4 shadow-sm" type="submit" size="lg" disabled={cargando}>
              {cargando ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Subiendo imagen y publicando...
                </>
              ) : (
                'Crear y Publicar Subasta'
              )}
            </Button>
          </div>

        </Form>
      </Card>
    </Container>
  )
}

export default CrearSubastaPage