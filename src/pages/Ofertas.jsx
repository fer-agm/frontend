import { Link } from 'react-router-dom';
import { productsApi } from '../api/index.js';
import { useApi } from '../hooks/useApi.js';
import { hasOffer, discountPercent } from '../utils/pricing.js';
import LoadState from '../components/LoadState.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductGrid from '../components/ProductGrid.jsx';

export default function Ofertas() {
  const { data, loading, error, reload } = useApi(() => productsApi.list());
  // Mayor descuento primero
  const offers = (data || []).filter(hasOffer).sort((a, b) => discountPercent(b) - discountPercent(a));

  return (
    <div className="container">
      <h2>Ofertas</h2>

      <div className="card">
        <LoadState loading={loading} error={error} onRetry={reload}>
          {offers.length === 0 ? (
            <p style={{ color: 'var(--text-sub)' }}>
              Por ahora no hay productos en oferta. <Link to="/productos" className="btn-blue">Ver catálogo</Link>
            </p>
          ) : (
            <ProductGrid>
              {offers.map((p) => (
                <ProductCard key={p.code} product={p} buyNow />
              ))}
            </ProductGrid>
          )}
        </LoadState>
      </div>
    </div>
  );
}
