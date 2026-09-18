import React, { useEffect, useState } from 'react';
import { Container, Table, Spinner, Alert, Badge, Form, Row, Col, Button } from 'react-bootstrap';
import { fetchWithAuth } from '../utils/auth'; 

const AuditoriaPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entidadInput, setEntidadInput] = useState('');
  const [entidadIdInput, setEntidadIdInput] = useState('');

  useEffect(() => {
    const fetchAuditoria = async () => {
      try {
        const response = await fetchWithAuth('http://localhost:55976/api/Auditoria');
        
        if (!response.ok) {
          throw new Error('No se pudo cargar la información de auditoría.');
        }

        const data = await response.json();
        setLogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditoria();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  

  const fetchLogsFiltrados = async (entidadNombre, id) => {
  try {

    let url = 'http://localhost:55976/api/Auditoria';
    if (entidadNombre && id) {
      url += `?entidad=${encodeURIComponent(entidadNombre)}&entidadId=${id}`;
    }

    const response = await fetchWithAuth(url);
    if (!response.ok) throw new Error('Error al filtrar los logs.');
    
    const data = await response.json();
    setLogs(data);
  } catch (err) {
    setError(err.message);
  }
};


  const handleFiltrar = (e) => {
    e.preventDefault();
    fetchLogsFiltrados(entidadInput, entidadIdInput);
  };


  const handleLimpiar = () => {
    setEntidadInput('');
    setEntidadIdInput('');
    fetchLogsFiltrados('', '');
  };

 return (
    <Container className="mt-4">
      <h2>Panel de Auditoría del Sistema</h2>
      <p className="text-muted">Registro de actividades y transacciones críticas de la plataforma.</p>

      {/* --- FORMULARIO DE FILTROS --- */}
      <Form onSubmit={handleFiltrar} className="mb-4 p-3 bg-light rounded shadow-sm">
        <Row className="align-items-end">
         <Col md={4} className="mb-2 mb-md-0">
            <Form.Group>
              <Form.Label>Entidad</Form.Label>
              <Form.Select 
                value={entidadInput} 
                onChange={(e) => setEntidadInput(e.target.value)}
              >
                <option value="">Todas las entidades</option>
                <option value="Usuario">Usuario</option>
                <option value="Producto">Producto</option>
                <option value="Rol">Rol</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4} className="mb-2 mb-md-0">
            <Form.Group>
              <Form.Label>ID de Entidad</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Ej. 12" 
                value={entidadIdInput} 
                onChange={(e) => setEntidadIdInput(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={4} className="d-flex gap-2">
            <Button variant="primary" type="submit" className="w-100">
              Filtrar
            </Button>
            <Button variant="secondary" type="button" onClick={handleLimpiar} className="w-100">
              Limpiar
            </Button>
          </Col>
        </Row>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      {!error && logs.length === 0 && (
        <Alert variant="info">No hay registros de auditoría disponibles.</Alert>
      )}

      {logs.length > 0 && (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Acción / Evento</th>
              <th>Detalles</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.usuarioEmail || log.usuarioId}</td>
                <td>
                  <Badge bg="secondary">{log.accion || log.tipo}</Badge>
                </td>
                <td>{log.detalles || log.descripcion}</td>
                <td>{new Date(log.fecha || log.creadoEn).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AuditoriaPage;