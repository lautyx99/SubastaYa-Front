import React, { useState, useEffect } from 'react';
import SubastaCard from '../components/subastas/SubastaCard';


function ActividadesPage(){

   const [tabActiva, setTabActiva] = useState('compras'); // 'compras' o 'publicaciones'
  const [compras, setCompras] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMisDatos = async () => {
      setLoading(true);
      try {
        // Recuperamos el token JWT del almacenamiento local (ajusta la clave si usas otra, ej: 'token', 'jwt', etc.)
        const token = localStorage.getItem('token'); 

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        // 1. Petición a Mis Compras / Pujas
        const resPujas = await fetch('http://localhost:55976/api/Subasta/mis-pujas', { headers });
        if (!resPujas.ok) throw new Error('Error al cargar tus pujas.');
        const dataPujas = await resPujas.json();
        setCompras(dataPujas);

        // 2. Petición a Mis Publicaciones
        const resPubs = await fetch('http://localhost:55976/api/Subasta/mis-publicaciones', { headers });
        if (!resPubs.ok) throw new Error('Error al cargar tus publicaciones.');
        const dataPubs = await resPubs.json();
        setPublicaciones(dataPubs);

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMisDatos();
  }, []);

  if (loading) return <div className="text-center my-5"><div className="spinner-border text-primary" role="status"></div><p className="mt-2">Cargando tus actividades...</p></div>;
  if (error) return <div className="alert alert-danger m-4">Error: {error}</div>;

  return (
    <div className="container my-4">
      <h2 className="mb-4 fw-bold">Panel de Usuario: Mis Actividades</h2>

      {/* Pestañas de Navegación */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${tabActiva === 'compras' ? 'active fw-bold' : ''}`}
            onClick={() => setTabActiva('compras')}
          >
            Mis Compras / Pujas ({compras.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${tabActiva === 'publicaciones' ? 'active fw-bold' : ''}`}
            onClick={() => setTabActiva('publicaciones')}
          >
            Mis Publicaciones ({publicaciones.length})
          </button>
        </li>
      </ul>

      {/* Contenido Pestaña 1: Mis Compras / Pujas */}
      {tabActiva === 'compras' && (
        <div>
          <h4 className="mb-3 text-secondary" style={{ fontSize: '1.1rem' }}>Subastas en las que participaste</h4>
          {compras.length === 0 ? (
            <div className="alert alert-light border text-center py-4">No registras ofertas en ninguna subasta todavía.</div>
          ) : (
            <div className="row">
              {compras.map(subasta => (
                <div className="col-md-4 mb-4" key={subasta.id}>
                  <SubastaCard subasta={subasta} />
                  
                  {/* Badge descriptivo de estado para el comprador */}
                  <div className="mt-2 p-2 bg-light border rounded text-center">
                    {subasta.estado === 'Finalizada' && subasta.ganadorId ? (
                      <span className="badge bg-success w-100 py-2">¡Ganaste este producto!</span>
                    ) : subasta.estado === 'Activa' ? (
                      <span className="badge bg-primary w-100 py-2">Subasta en curso</span>
                    ) : (
                      <span className="badge bg-secondary w-100 py-2">Finalizada (Sin adjudicar)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contenido Pestaña 2: Mis Publicaciones */}
      {tabActiva === 'publicaciones' && (
        <div>
          <h4 className="mb-3 text-secondary" style={{ fontSize: '1.1rem' }}>Subastas creadas por ti</h4>
          {publicaciones.length === 0 ? (
            <div className="alert alert-light border text-center py-4">Aún no has publicado ningún producto para subastar.</div>
          ) : (
            <div className="table-responsive bg-white shadow-sm rounded border">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Título</th>
                    <th>Precio Inicial</th>
                    <th>Estado</th>
                    <th>Ofertas Recibidas</th>
                    <th>Resultado / Recaudación</th>
                  </tr>
                </thead>
                <tbody>
                  {publicaciones.map(pub => (
                    <tr key={pub.id}>
                      <td className="fw-semibold">{pub.titulo}</td>
                      <td>${pub.precioInicial}</td>
                      <td>
                        <span className={`badge ${pub.estado === 'Activa' ? 'bg-success' : 'bg-secondary'}`}>
                          {pub.estado}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {pub.cantidadPujas} {pub.cantidadPujas === 1 ? 'oferta' : 'ofertas'}
                        </span>
                      </td>
                      <td>
                        {pub.precioFinal ? (
                          <span className="text-success fw-bold">${pub.precioFinal} (Vendido)</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


export default ActividadesPage;