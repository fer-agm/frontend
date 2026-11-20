import { Link } from 'react-router-dom';
import { productsApi } from '../../api/index.js';
import { useApi } from '../../hooks/useApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { isCritical } from '../../utils/inventory.js';
import { clp, hasOffer } from '../../utils/pricing.js';
import LoadState from '../../components/LoadState.jsx';

// ADMIN: gestión completa. VENDEDOR: solo ve la lista y el detalle (sin crear, editar ni eliminar).
export default function AdminProductos() {
  const { user } = useAuth();
  const canEdit = user?.role === 'admin';
  const { data, loading, error, reload } = useApi(() => productsApi.list());
  const products = data || [];

  const handleDelete = async (code) => {
    if (!window.confirm(`¿Eliminar el producto ${code}?`)) return;
    try {
      await productsApi.remove(code);
      reload();
    } catch (err) {
      alert(err.userMessage || err.message);
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2>{canEdit ? 'Gestión de Productos' : 'Productos'}</h2>
        {canEdit && (
          <div className="d-flex flex-wrap gap-2">
            <Link to="/admin/productos/criticos" className="btn-blue">⚠ Stock crítico</Link>
            <Link to="/admin/productos/reportes" className="btn-blue">Reportes</Link>
            <Link to="/admin/productos/nuevo" className="btn-green">+ Nuevo Producto</Link>
          </div>
        )}
      </div>

      <LoadState loading={loading} error={error} onRetry={reload}>
        <div className="card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.code}>
                    <td>{p.code}</td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>
                      {hasOffer(p) ? <>{clp(p.offerPrice)} <span className="badge text-bg-danger">Oferta</span></> : clp(p.price)}
                    </td>
                    <td>
                      {p.stock ?? 0}{' '}
                      {isCritical(p) && <span className="badge text-bg-warning">{(p.stock ?? 0) === 0 ? 'Agotado' : 'Crítico'}</span>}
                    </td>
                    <td>
                      <Link to={`/admin/productos/detalle?code=${encodeURIComponent(p.code)}`} className="btn-green" style={{ fontSize: '0.8rem' }}>Ver detalle</Link>
                      {canEdit && (
                        <>
                          {' '}
                          <Link to={`/admin/productos/editar?code=${encodeURIComponent(p.code)}`} className="btn-blue" style={{ fontSize: '0.8rem' }}>Editar</Link>{' '}
                          <button onClick={() => handleDelete(p.code)} className="btn-danger">Eliminar</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </LoadState>
    </div>
  );
}
