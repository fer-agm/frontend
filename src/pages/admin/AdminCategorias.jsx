import { Link } from 'react-router-dom';
import { categoriesApi } from '../../api/index.js';
import { useApi } from '../../hooks/useApi.js';
import LoadState from '../../components/LoadState.jsx';

export default function AdminCategorias() {
  const { data, loading, error, reload } = useApi(() => categoriesApi.listFull());
  const categories = data || [];

  const handleDelete = async (c) => {
    if (c.cantidadProductos > 0) {
      alert(`No se puede eliminar "${c.nombre}": tiene ${c.cantidadProductos} producto(s) asociados.`);
      return;
    }
    try {
      await categoriesApi.remove(c.id);
      reload();
    } catch (err) {
      alert(err.userMessage || err.message);
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2>Gestión de Categorías</h2>
        <Link to="/admin/categorias/nueva" className="btn-green">+ Nueva Categoría</Link>
      </div>

      <LoadState loading={loading} error={error} onRetry={reload}>
        <div className="card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr><th>Nombre</th><th>Productos</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nombre}</td>
                    <td>{c.cantidadProductos}</td>
                    <td>
                      <Link to={`/admin/categorias/editar?id=${c.id}&name=${encodeURIComponent(c.nombre)}`} className="btn-blue" style={{ fontSize: '0.8rem' }}>Editar</Link>{' '}
                      <button onClick={() => handleDelete(c)} className="btn-danger">Eliminar</button>
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
