import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { authApi, ordersApi } from '../api/index.js';
import { computeTotals, clp } from '../utils/pricing.js';
import { DEFAULT_REGION, getCommunes } from '../utils/chile.js';
import OrderItemsTable from '../components/OrderItemsTable.jsx';
import OrderTotals from '../components/OrderTotals.jsx';
import CustomerInfoFields from '../components/CustomerInfoFields.jsx';
import DeliveryAddressFields from '../components/DeliveryAddressFields.jsx';

// Si hay sesión, los datos del cliente se completan solos; si viene de un pago fallido, se reutilizan.
function initialForm(user, prefill) {
  if (prefill) return { ...prefill.customer, ...prefill.address };
  const [nombre = '', ...rest] = (user?.name || '').split(' ');
  return {
    nombre,
    apellidos: rest.join(' '),
    correo: user?.email || '',
    calle: '',
    departamento: '',
    region: DEFAULT_REGION,
    comuna: getCommunes(DEFAULT_REGION)[0],
    indicaciones: '',
  };
}

export default function Checkout() {
  const { items, clear } = useCart();
  const { user, setSessionUser } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState(() => initialForm(user, state?.prefill));
  const [paying, setPaying] = useState(false);

  const totals = computeTotals(items, user);
  const patch = (partial) => setForm((f) => ({ ...f, ...partial }));

  if (items.length === 0 && !paying) {
    return (
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="card text-center">
          <p>No hay productos en el carrito para pagar.</p>
          <Link to="/productos" className="btn-blue mt-2">Ir al catálogo</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaying(true);

    try {
      // El backend recalcula precios, descuento e IVA, procesa el pago y descuenta el stock
      const order = await ordersApi.checkout({
        customer: {
          nombre: form.nombre.trim(),
          apellidos: form.apellidos.trim(),
          correo: form.correo.trim(),
        },
        address: {
          calle: form.calle.trim(),
          departamento: form.departamento.trim(),
          region: form.region,
          comuna: form.comuna,
          indicaciones: form.indicaciones.trim(),
        },
        items,
      });

      if (order.status === 'success') {
        clear();
        authApi.me().then(setSessionUser).catch(() => {}); // puntos actualizados
        navigate(`/pago-correcto/${order.id}`);
      } else {
        navigate(`/pago-error/${order.id}`);
      }
    } catch (err) {
      // 400 datos inválidos, 409 sin stock, 0 sin conexión...
      alert(err.userMessage || err.message);
      setPaying(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div className="card">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
          <div>
            <h2>Checkout</h2>
            <p style={{ color: 'var(--text-sub)' }}>Completa tus datos y la dirección de entrega</p>
          </div>
          <span className="btn-blue">Total a pagar: {clp(totals.total)}</span>
        </div>

        <OrderItemsTable items={items} />
        <OrderTotals subtotal={totals.subtotal} discount={totals.discount} tax={totals.tax} total={totals.total} totalLabel="Total a pagar" />

        <form onSubmit={handleSubmit}>
          <CustomerInfoFields values={form} onPatch={patch} />
          <DeliveryAddressFields values={form} onPatch={patch} />

          <div className="text-end mt-4">
            <button type="submit" className="btn-green" disabled={paying}>
              {paying ? 'Procesando pago...' : `Pagar ahora ${clp(totals.total)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
