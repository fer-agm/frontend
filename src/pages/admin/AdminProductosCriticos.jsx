import { Link } from 'react-router-dom';
import { productsApi } from '../../api/index.js';
import { useApi } from '../../hooks/useApi.js';
import { CRITICAL_STOCK } from '../../utils/inventory.js';
import LoadState from '../../components/LoadState.jsx';

export default function AdminProductosCriticos() {
  const { data, loading, error, reload } = useApi(() => productsApi.critical()); // el backend ya los entrega de menor a mayor stock
  const critical = data || [];

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2>Productos con stock crítico</h2>
        <Link to="/admin/productos" className="btn-blue">Volver a productos</Link>
      </div>
      <p style={{ color: 'var(--text-sub)' }}>Se considera crítico un stock de {CRITICAL_STOCK} unidades o menos.</p>

      <LoadState loading={loading} error={error} onRetry={reload}>
        <div className="card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {critical.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>No hay productos con stock crítico.</td></tr>
                ) : (
                  critical.map((p) => (
                    <tr key={p.code}>
                      <td>{p.code}</td>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>
                        {p.stock ?? 0}{' '}
                        <span className={`badge ${(p.stock ?? 0) === 0 ? 'text-bg-danger' : 'text-bg-warning'}`}>
                          {(p.stock ?? 0) === 0 ? 'Agotado' : 'Crítico'}
                        </span>
                      </td>
                      <td><Link to={`/admin/productos/editar?code=${encodeURIComponent(p.code)}`} className="btn-blue" style={{ fontSize: '0.8rem' }}>Reponer stock</Link></td>
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
