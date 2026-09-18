import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../../utils/auth'; 

const AdminRoute = () => {

 const authorized = isAuthenticated() && isAdmin();
  return authorized ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;