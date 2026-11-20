import { useState } from 'react';
import { productsApi, categoriesApi } from '../api/index.js';
import { useApi } from '../hooks/useApi.js';
import LoadState from '../components/LoadState.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductGrid from '../components/ProductGrid.jsx';

export default function Productos() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('ALL');
  const { data, loading, error, reload } = useApi(() => Promise.all([productsApi.list(), categoriesApi.list()]));
  const [products, categories] = data || [[], []];

  const q = query.toLowerCase();
  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
    const matchesCat = cat === 'ALL' || p.category === cat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="container">
      <h2>Catálogo Gamer</h2>

      <div className="card">
        <div className="row g-2">
          <div className="col-12 col-md-8">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <select value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="ALL">Todas las Categorías</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <LoadState loading={loading} error={error} onRetry={reload}>
        <ProductGrid>
          {filtered.map((p) => (
            <ProductCard key={p.code} product={p} />
          ))}
        </ProductGrid>
      </LoadState>
    </div>
  );
}
