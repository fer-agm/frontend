import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm.jsx';
import LoadState from '../components/LoadState.jsx';
import { categoriesApi, productsApi } from '../api/index.js';
import { useApi } from '../hooks/useApi.js';

export default function EditarProducto() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const code = params.get('code');

  const { data, loading, error, reload } = useApi(
    () => Promise.all([productsApi.get(code), categoriesApi.list()]),
    [code]
  );
  const [values, setValues] = useState(null);

  // Cuando llega el producto desde la API se carga el formulario
  useEffect(() => {
    if (data) {
      const prod = data[0];
      setValues({ ...prod, image: prod.image || '', offerPrice: prod.offerPrice ?? '', stock: prod.stock ?? 0 });
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = {
      code: values.code,
      category: values.category,
      name: values.name,
      price: parseInt(values.price),
      stock: parseInt(values.stock),
      origin: values.origin,
      desc: values.desc,
      image: values.image.trim(), // se conserva la imagen al editar
    };
    if (values.offerPrice !== '' && values.offerPrice !== null) updated.offerPrice = parseInt(values.offerPrice);

    if (updated.offerPrice !== undefined && updated.offerPrice >= updated.price) {
      alert('El precio de oferta debe ser menor al precio normal.');
      return;
    }
    try {
      await productsApi.update(updated);
      alert('Producto actualizado correctamente.');
      navigate('/admin/productos');
    } catch (err) {
      alert(err.userMessage || err.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="card">
        <h2>Editar Producto</h2>
        <LoadState loading={loading} error={error} onRetry={reload}>
          {values && (
            <ProductForm
              isEdit
              categories={data[1]}
              values={values}
              onChange={setValues}
              onSubmit={handleSubmit}
              imageLabel="Nombre de la Imagen (assets/img/):"
              imagePlaceholder="Ejemplo: ps5.png"
              submitText="Actualizar Producto"
              submitClass="btn-blue"
            />
          )}
        </LoadState>
      </div>
    </div>
  );
}
