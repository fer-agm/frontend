import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminDashboard from './AdminDashboard.jsx';

// /admin: el administrador ve el dashboard; el vendedor (sin dashboard) va directo a las órdenes.
export default function AdminIndex() {
  const { user } = useAuth();
  if (user?.role === 'vendedor') return <Navigate to="/admin/ordenes" replace />;
  return <AdminDashboard />;
}
