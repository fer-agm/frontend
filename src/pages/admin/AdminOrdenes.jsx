import { Link } from 'react-router-dom';
import { ordersApi } from '../../api/index.js';
import { useApi } from '../../hooks/useApi.js';
import { clp } from '../../utils/pricing.js';
import LoadState from '../../components/LoadState.jsx';
import OrderStatusBadge from '../../components/admin/OrderStatusBadge.jsx';

// Lista de órdenes: ADMIN y VENDEDOR (solo lectura). El backend ya las entrega de la más reciente a la más antigua.
export default function AdminOrdenes() {
  const { data, loading, error, reload } = useApi(() => ordersApi.list());
  const orders = data || [];

  return (
    <div>
      <h2>Órdenes / Boletas</h2>
      <LoadState loading={loading} error={error} onRetry={reload}>
        <div className="card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Correo</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center' }}>Aún no hay órdenes.</td></tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>{new Date(o.date).toLocaleString('es-CL')}</td>
                      <td>{o.customer.nombre} {o.customer.apellidos}</td>
                      <td>{o.customer.correo}</td>
                      <td>{clp(o.total)}</td>
                      <td><OrderStatusBadge status={o.status} /></td>
                      <td><Link to={`/admin/ordenes/${o.id}`} className="btn-blue" style={{ fontSize: '0.8rem' }}>Ver detalle</Link></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </LoadState>
    </div>
  );
}
