import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { homeFor } from '../../utils/roles.js';

// Protege una ruta: sin sesión -> /login; con sesión pero sin el rol -> a su página de inicio.
// (El backend también valida los permisos con Spring Security; esto solo evita mostrar vistas inaccesibles.)
export default function RequireRole({ roles, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!roles.includes(user.role)) return <Navigate to={homeFor(user)} replace />;
  return children;
}
