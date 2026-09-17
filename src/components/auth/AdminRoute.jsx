import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../../utils/auth'; // Ajusta la ruta a tu archivo auth

const AdminRoute = () => {
  // Verificamos si está autenticado y si tiene rol de administrador/vendedor
 const authorized = isAuthenticated() && isAdmin();
  return authorized ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;