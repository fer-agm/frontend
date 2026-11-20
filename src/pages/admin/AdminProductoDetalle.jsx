import { Link, useSearchParams } from 'react-router-dom';
import { productsApi } from '../../api/index.js';
import { useApi } from '../../hooks/useApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { clp, hasOffer, discountPercent } from '../../utils/pricing.js';
import { isCritical } from '../../utils/inventory.js';
import LoadState from '../../components/LoadState.jsx';
import ProductImage from '../../components/ProductImage.jsx';

// Detalle de solo lectura de un producto (lo ven ADMIN y VENDEDOR)
function Row({ label, children }) {
  return (
    <tr>
      <th style={{ width: '35%' }}>{label}</th>
      <td>{children}</td>
    </tr>
  );
}

export default function AdminProductoDetalle() {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const code = params.get('code');
  const { data: p, loading, error, reload } = useApi(() => productsApi.get(code), [code]);

  if (loading || (error && error.status !== 404)) return <LoadState loading={loading} error={error} onRetry={reload} />;
  if (!p) {
    return (
      <div className="card text-center">
        <p>Producto no encontrado.</p>
        <Link to="/admin/productos" className="btn-blue mt-2">Volver a productos</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2>Detalle del producto</h2>
        <div className="d-flex gap-2">
          {user?.role === 'admin' && <Link to={`/admin/productos/editar?code=${encodeURIComponent(p.code)}`} className="btn-blue">Editar</Link>}
          <Link to="/admin/productos" className="btn-green">Volver a productos</Link>
        </div>
      </div>

      <div className="card">
        <div className="row g-4">
          <div className="col-md-4">
            <ProductImage product={p} style={{ width: '100%', maxHeight: '220px', objectFit: 'contain', background: '#080808', borderRadius: '8px' }} />
          </div>
          <div className="col-md-8">
            <h3>{p.name}</h3>
            <div className="table-responsive">
              <table>
                <tbody>
                  <Row label="Código">{p.code}</Row>
                  <Row label="Categoría">{p.category}</Row>
                  <Row label="Origen / Fabricante">{p.origin || '—'}</Row>
                  <Row label="Precio normal (neto)">{clp(p.price)}</Row>
                  <Row label="Precio oferta">{hasOffer(p) ? `${clp(p.offerPrice)} (-${discountPercent(p)}%)` : 'Sin oferta'}</Row>
                  <Row label="Stock">
                    {p.stock}{' '}
                    {isCritical(p) && <span className="badge text-bg-warning">{p.stock === 0 ? 'Agotado' : 'Crítico'}</span>}
                  </Row>
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-12">
            <div style={{ background: '#181818', padding: '1rem', borderRadius: '6px' }}>
              <strong>Descripción:</strong>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-sub)' }}>{p.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
