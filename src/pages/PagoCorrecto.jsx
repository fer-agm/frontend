import { useParams } from 'react-router-dom';
import { ordersApi } from '../api/index.js';
import { useApi } from '../hooks/useApi.js';
import LoadState from '../components/LoadState.jsx';
import OrderDetails from '../components/OrderDetails.jsx';
import OrderItemsTable from '../components/OrderItemsTable.jsx';
import OrderNotFound from '../components/OrderNotFound.jsx';
import OrderTotals from '../components/OrderTotals.jsx';

// Vista "Compra exitosa"
export default function PagoCorrecto() {
  const { orderId } = useParams();
  const { data: order, loading, error } = useApi(() => ordersApi.get(orderId), [orderId]);

  if (loading || error) {
    return error ? <OrderNotFound /> : <div className="container"><LoadState loading /></div>;
  }
  if (!order || order.status !== 'success') return <OrderNotFound />;

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div className="card">
        <div className="text-end" style={{ color: 'var(--text-sub)', fontSize: '0.8rem' }}>
          Código orden: {order.code}
        </div>
        <h2 style={{ color: 'var(--accent-green)' }}>✔ Se ha realizado la compra. nro #{order.id}</h2>
        <p style={{ color: 'var(--text-sub)' }}>Resumen de tu compra</p>

        <OrderDetails order={order} />

        <div className="mt-4">
          <OrderItemsTable items={order.items} />
        </div>

        <OrderTotals subtotal={order.subtotal} discount={order.discount} tax={order.tax} total={order.total} totalLabel="Total pagado" />

        <div className="d-flex flex-wrap justify-content-center gap-2 mt-3 d-print-none">
          <button className="btn btn-danger btn-sm" onClick={() => window.print()}>Imprimir boleta en PDF</button>
          <button
            className="btn btn-success btn-sm"
            onClick={() => alert(`Boleta enviada a ${order.customer.correo}`)}
          >
            Enviar boleta por email
          </button>
        </div>
      </div>
    </div>
  );
}
