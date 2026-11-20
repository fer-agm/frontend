import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLE_LABELS, isStaff } from '../../utils/roles.js';

// `roles`: quién ve cada opción. El vendedor solo ve Órdenes y Productos.
const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true, roles: ['admin'] },
  { to: '/admin/ordenes', label: 'Órdenes', icon: '🧾', roles: ['admin', 'vendedor'] },
  { to: '/admin/productos', label: 'Productos', icon: '📦', roles: ['admin', 'vendedor'] },
  { to: '/admin/categorias', label: 'Categorías', icon: '🏷️', roles: ['admin'] },
  { to: '/admin/usuarios', label: 'Usuarios', icon: '👥', roles: ['admin'] },
  { to: '/admin/reportes', label: 'Reportes', icon: '📈', roles: ['admin'] },
  { to: '/admin/perfil', label: 'Perfil', icon: '👤', roles: ['admin'] },
];

// Layout del panel: barra superior + menú lateral. Acceden ADMIN (todo) y VENDEDOR (solo órdenes y productos, lectura).
export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const alerted = useRef(false);
  const allowed = isStaff(user);

  useEffect(() => {
    if (!allowed && !alerted.current) {
      alerted.current = true;
      alert('Acceso restringido al personal autorizado.');
      navigate(user ? '/' : '/login');
    }
  }, [allowed, user, navigate]);

  if (!allowed) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <header className="navbar navbar-dark d-print-none">
        <span className="brand-logo">LEVEL-UP GAMER <small style={{ fontSize: '0.7rem', color: 'var(--accent-blue)' }}>{user.role === 'admin' ? 'ADMIN' : 'VENDEDOR'}</small></span>
        <div className="d-flex align-items-center gap-2">
          <span className="user-badge d-none d-sm-inline">👤 {user.name} ({ROLE_LABELS[user.role]})</span>
          <button className="btn btn-outline-light btn-sm d-lg-none" onClick={() => setOpen(!open)}>☰ Menú</button>
        </div>
      </header>

      <div className="container-fluid flex-grow-1">
        <div className="row">
          <aside className={`col-lg-2 py-3 admin-sidebar d-lg-block d-print-none ${open ? 'd-block' : 'd-none'}`}>
            <div className="d-flex flex-column gap-1" onClick={() => setOpen(false)}>
              {LINKS.filter((l) => l.roles.includes(user.role)).map((l) => (
                <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `admin-link${isActive ? ' active' : ''}`}>
                  {l.icon} {l.label}
                </NavLink>
              ))}
            </div>
            <hr />
            <div className="d-grid gap-2">
              <Link to="/" className="btn btn-dark btn-sm">🏪 Tienda</Link>
              <button className="btn btn-danger btn-sm" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          </aside>

          <main className="col-lg-10 py-3">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
