import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm.jsx';
import LoadState from '../components/LoadState.jsx';
import { categoriesApi, productsApi } from '../api/index.js';
import { useApi } from '../hooks/useApi.js';

export default function NuevoProducto() {
  const navigate = useNavigate();
  const { data: categories, loading, error, reload } = useApi(() => categoriesApi.list());
  const [values, setValues] = useState({
    code: '', category: '', name: '', price: '', offerPrice: '', stock: '', origin: '', desc: '', image: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const product = {
      code: values.code.trim(),
      category: values.category || categories[0],
      name: values.name,
      price: parseInt(values.price),
      stock: parseInt(values.stock),
      origin: values.origin,
      desc: values.desc,
      image: values.image.trim() || 'default.png',
    };
    if (values.offerPrice !== '') product.offerPrice = parseInt(values.offerPrice);

    if (product.offerPrice !== undefined && product.offerPrice >= product.price) {
      alert('El precio de oferta debe ser menor al precio normal.');
      return;
    }

    try {
      await productsApi.create(product);
      alert('Producto guardado exitosamente. Ahora es visible en la página de productos.');
      navigate('/admin/productos');
    } catch (err) {
      alert(err.userMessage || err.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="card">
        <h2>Agregar Nuevo Producto</h2>
        <LoadState loading={loading} error={error} onRetry={reload}>
          <ProductForm
            categories={categories || []}
            values={{ ...values, category: values.category || (categories || [])[0] || '' }}
            onChange={setValues}
            onSubmit={handleSubmit}
            codePlaceholder="Ej: AC003"
            originPlaceholder="Ej: Sony / Japón"
            imageLabel="Nombre de la Imagen (Guardada en assets/img/):"
            imagePlaceholder="Ejemplo: ps5.png o auricular.jpg"
            submitText="Guardar Producto"
            submitClass="btn-green"
          />
        </LoadState>
      </div>
    </div>
  );
}
