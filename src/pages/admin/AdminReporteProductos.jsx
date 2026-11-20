import { Link } from 'react-router-dom';
import { ordersApi, productsApi } from '../../api/index.js';
import { useApi } from '../../hooks/useApi.js';
import LoadState from '../../components/LoadState.jsx';
import { topProducts, stockByCategory } from '../../utils/reports.js';
import { isCritical } from '../../utils/inventory.js';
import { hasOffer } from '../../utils/pricing.js';
import BarList from '../../components/admin/BarList.jsx';
import StatCard from '../../components/admin/StatCard.jsx';

export default function AdminReporteProductos() {
  const { data, loading, error, reload } = useApi(() => Promise.all([productsApi.list(), ordersApi.list()]));
  const [products, orders] = data || [[], []];
  const top = topProducts(orders, 5);
  const stock = stockByCategory(products, isCritical);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2>Reporte de productos</h2>
        <Link to="/admin/productos" className="btn-blue">Volver a productos</Link>
      </div>

      <LoadState loading={loading} error={error} onRetry={reload}>
      <div className="row row-cols-1 row-cols-md-3 g-3 mb-3">
        <StatCard title="Productos" value={products.length} variant="success" />
        <StatCard title="En oferta" value={products.filter(hasOffer).length} variant="primary" />
        <StatCard title="Stock crítico" value={products.filter(isCritical).length} variant="warning" />
      </div>

      <BarList
        title="Productos más vendidos (unidades)"
        items={top.map((t) => ({ label: t.name, value: t.units, display: `${t.units} u.` }))}
        color="var(--accent-green)"
      />

      <div className="card">
        <h3 style={{ fontSize: '1.1rem' }}>Inventario por categoría</h3>
        <div className="table-responsive">
          <table>
            <thead>
              <tr><th>Categoría</th><th>Productos</th><th>Unidades en stock</th><th>Críticos</th></tr>
            </thead>
            <tbody>
              {stock.map((s) => (
                <tr key={s.category}>
                  <td>{s.category}</td><td>{s.products}</td><td>{s.units}</td><td>{s.critical}</td>
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
