import { Link, useParams } from 'react-router-dom';
import { ordersApi } from '../../api/index.js';
import { useApi } from '../../hooks/useApi.js';
import LoadState from '../../components/LoadState.jsx';
import OrderDetails from '../../components/OrderDetails.jsx';
import OrderItemsTable from '../../components/OrderItemsTable.jsx';
import OrderTotals from '../../components/OrderTotals.jsx';
import OrderStatusBadge from '../../components/admin/OrderStatusBadge.jsx';

export default function AdminBoleta() {
  const { id } = useParams();
  const { data: order, loading, error, reload } = useApi(() => ordersApi.get(id), [id]);

  if (loading || (error && error.status !== 404)) {
    return <LoadState loading={loading} error={error} onRetry={reload} />;
  }

  if (!order) { // 404
    return (
      <div className="card text-center">
        <p>Orden no encontrada.</p>
        <Link to="/admin/ordenes" className="btn-blue mt-2">Volver a órdenes</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      <div className="card">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
          <div>
            <h2>Boleta #{order.id}</h2>
            <p style={{ color: 'var(--text-sub)' }}>
              Código orden: {order.code} · {new Date(order.date).toLocaleString('es-CL')}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <OrderDetails order={order} />
        <div className="mt-4"><OrderItemsTable items={order.items} /></div>
        <OrderTotals
          subtotal={order.subtotal ?? order.total}
          discount={order.discount ?? 0}
          tax={order.tax}
          total={order.total}
          totalLabel={order.status === 'success' ? 'Total pagado' : 'Total a pagar'}
        />

        <div className="d-flex flex-wrap gap-2 mt-3 d-print-none">
          <button className="btn btn-danger btn-sm" onClick={() => window.print()}>Imprimir boleta en PDF</button>
          <Link to="/admin/ordenes" className="btn btn-secondary btn-sm">Volver a órdenes</Link>
        </div>
      </div>
    </div>
  );
}
