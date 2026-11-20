import { useNavigate, useParams } from 'react-router-dom';
import { ordersApi } from '../api/index.js';
import { useApi } from '../hooks/useApi.js';
import LoadState from '../components/LoadState.jsx';
import OrderDetails from '../components/OrderDetails.jsx';
import OrderItemsTable from '../components/OrderItemsTable.jsx';
import OrderNotFound from '../components/OrderNotFound.jsx';
import OrderTotals from '../components/OrderTotals.jsx';
import Button from '../components/Button.jsx';

// Vista "Compra fallida" (no se pudo realizar el pago). El carrito se conserva para reintentar.
export default function PagoError() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data: order, loading, error } = useApi(() => ordersApi.get(orderId), [orderId]);

  if (loading || error) {
    return error ? <OrderNotFound /> : <div className="container"><LoadState loading /></div>;
  }
  if (!order || order.status !== 'failed') return <OrderNotFound />;

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div className="card">
        <h2 style={{ color: '#ff3333' }}>✖ No se pudo realizar el pago. nro #{order.id}</h2>
        <p style={{ color: 'var(--text-sub)' }}>Detalle de compra</p>

        <div className="text-center my-3">
          <Button onClick={() => navigate('/checkout', { state: { prefill: order } })}>
            VOLVER A REALIZAR EL PAGO
          </Button>
        </div>

        <OrderDetails order={order} />

        <div className="mt-4">
          <OrderItemsTable items={order.items} />
        </div>

        <OrderTotals subtotal={order.subtotal} discount={order.discount} tax={order.tax} total={order.total} totalLabel="Total a pagar" />
      </div>
    </div>
  );
}
