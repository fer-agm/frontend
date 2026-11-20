import { Link, useSearchParams } from 'react-router-dom';
import { ordersApi, usersApi } from '../../api/index.js';
import { useApi } from '../../hooks/useApi.js';
import { clp } from '../../utils/pricing.js';
import LoadState from '../../components/LoadState.jsx';
import OrderStatusBadge from '../../components/admin/OrderStatusBadge.jsx';

export default function AdminHistorialCompras() {
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const { data, loading, error, reload } = useApi(
    () => Promise.all([usersApi.list(), ordersApi.list(email)]),
    [email]
  );

  if (loading || error) return <LoadState loading={loading} error={error} onRetry={reload} />;

  const [users, orders] = data;
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return (
      <div className="card text-center">
        <p>Usuario no encontrado.</p>
        <Link to="/admin/usuarios" className="btn-blue mt-2">Volver a usuarios</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2>Historial de compras</h2>
          <p style={{ color: 'var(--text-sub)' }}>{user.name} · {user.email} · 💎 {user.points} pts</p>
        </div>
        <Link to="/admin/usuarios" className="btn-blue">Volver a usuarios</Link>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table>
            <thead>
              <tr><th>N°</th><th>Fecha</th><th>Productos</th><th>Total</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Este usuario aún no tiene compras.</td></tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{new Date(o.date).toLocaleString('es-CL')}</td>
                    <td>{o.items.reduce((acc, i) => acc + i.qty, 0)}</td>
                    <td>{clp(o.total)}</td>
                    <td><OrderStatusBadge status={o.status} /></td>
                    <td><Link to={`/admin/ordenes/${o.id}`} className="btn-blue" style={{ fontSize: '0.8rem' }}>Ver boleta</Link></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
