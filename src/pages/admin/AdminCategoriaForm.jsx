import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { categoriesApi } from '../../api/index.js';

// Sirve para crear (isEdit = false) y editar (isEdit = true) una categoría
export default function AdminCategoriaForm({ isEdit = false }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const id = params.get('id');
  const [name, setName] = useState(isEdit ? params.get('name') || '' : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clean = name.trim();
    try {
      if (isEdit) {
        await categoriesApi.rename(id, clean);
        alert('Categoría actualizada correctamente. Los productos asociados se actualizaron.');
      } else {
        await categoriesApi.create(clean);
        alert('Categoría creada exitosamente.');
      }
      navigate('/admin/categorias');
    } catch (err) {
      alert(err.userMessage || err.message); // ej: 409 "Ya existe una categoría con ese nombre"
    }
  };

  if (isEdit && !id) {
    return <div className="card"><p>Categoría no encontrada.</p></div>;
  }

  return (
    <div style={{ maxWidth: '500px' }}>
      <div className="card">
        <h2>{isEdit ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          <button type="submit" className={isEdit ? 'btn-blue' : 'btn-green'} style={{ marginTop: '1.5rem', width: '100%' }}>
            {isEdit ? 'Actualizar Categoría' : 'Guardar Categoría'}
          </button>
        </form>
      </div>
    </div>
  );
}
