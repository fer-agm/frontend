import { clp, IVA_RATE } from '../utils/pricing.js';

// Desglose de una compra: subtotal, descuento Duoc, IVA y total.
// `tax` es opcional para poder mostrar boletas antiguas que no lo guardaron.
export default function OrderTotals({ subtotal, discount, tax, total, totalLabel = 'Total' }) {
  return (
    <div className="text-end mt-3">
      <p className="mb-1">Subtotal: {clp(subtotal)} CLP</p>
      {discount > 0 && (
        <p className="mb-1" style={{ color: 'var(--accent-green)' }}>Descuento Duoc (20%): -{clp(discount)} CLP</p>
      )}
      {tax !== undefined && tax !== null && (
        <p className="mb-1">IVA ({Math.round(IVA_RATE * 100)}%): {clp(tax)} CLP</p>
      )}
      <h3 style={{ color: 'var(--accent-blue)' }}>{totalLabel}: {clp(total)} CLP</h3>
    </div>
  );
}
