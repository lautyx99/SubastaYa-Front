import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const RegistroPage = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('1'); // 1 = Comprador, 2 = Vendedor por defecto
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Ajusta la URL según el endpoint de registro de tu backend
      const response = await fetch('http://localhost:55976/api/v1/auth/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
         nombre: nombre,  
          email: email,     
          password: password,
          rol: Number(rol) 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'No se pudo completar el registro.');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login'); // Redirige al login tras unos segundos
      }, 2000);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }} className="p-4 shadow-sm">
        <h2 className="text-center mb-4">Registro de Usuario</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">¡Registro exitoso! Redirigiendo al login...</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRol">
            <Form.Label>Tipo de Cuenta</Form.Label>
            <Form.Select value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="1">Comprador</option>
              <option value="2">Vendedor</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-3">
            Registrarse
          </Button>

          <div className="text-center">
            <small className="text-muted">
              ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </small>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default RegistroPage;