import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { usersApi } from '../api/index.js';
import { useApi } from '../hooks/useApi.js';
import LoadState from '../components/LoadState.jsx';

export default function EditarUsuario() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user: sessionUser, setSessionUser } = useAuth();
  const id = params.get('id');
  const { data: original, loading, error, reload } = useApi(() => usersApi.get(id), [id]);

  const [form, setForm] = useState({ name: '', age: '', role: 'cliente', points: '' });
  useEffect(() => {
    if (original) setForm({ name: original.name, age: original.age ?? '', role: original.role, points: original.points ?? 0 });
  }, [original]);
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await usersApi.update(original.id, {
        ...original,
        name: form.name,
        age: parseInt(form.age),
        role: form.role,
        points: parseInt(form.points),
      });
      // si el admin se edita a sí mismo, mantener la sesión sincronizada
      if (sessionUser && sessionUser.email.toLowerCase() === updated.email.toLowerCase()) setSessionUser(updated);
      alert('Usuario actualizado correctamente.');
      navigate('/admin/usuarios');
    } catch (err) {
      alert(err.userMessage || err.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <div className="card">
        <h2>Editar Usuario</h2>
        <LoadState loading={loading} error={error} onRetry={reload}>
          {original && (
            <form onSubmit={handleSubmit}>
              <label>Correo (No editable):</label>
              <input type="email" value={original.email} readOnly style={{ opacity: 0.6 }} />

              <label>Nombre Completo:</label>
              <input type="text" required value={form.name} onChange={set('name')} />

              <label>Edad:</label>
              <input type="number" required min="18" value={form.age} onChange={set('age')} />

              <label>Rol:</label>
              <select value={form.role} onChange={set('role')}>
                <option value="cliente">Cliente</option>
                <option value="vendedor">Vendedor</option>
                <option value="admin">Administrador</option>
              </select>

              <label>Puntos LevelUp:</label>
              <input type="number" required min="0" value={form.points} onChange={set('points')} />

              <button type="submit" className="btn-blue" style={{ marginTop: '1.5rem', width: '100%' }}>Actualizar Usuario</button>
            </form>
          )}
        </LoadState>
      </div>
    </div>
  );
}
