import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { usersApi } from '../../api/index.js';
import { useApi } from '../../hooks/useApi.js';
import { ROLE_LABELS } from '../../utils/roles.js';
import LoadState from '../../components/LoadState.jsx';

export default function AdminUsuarios() {
  const { user: session } = useAuth();
  const { data, loading, error, reload } = useApi(() => usersApi.list());
  const users = data || [];

  const handleDelete = async (u) => {
    if (session && session.email.toLowerCase() === u.email.toLowerCase()) {
      alert('No puedes eliminar tu propia cuenta mientras tienes la sesión iniciada.');
      return;
    }
    if (!window.confirm(`¿Eliminar al usuario ${u.email}?`)) return;
    try {
      await usersApi.remove(u.id);
      reload();
    } catch (err) {
      alert(err.userMessage || err.message);
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2>Gestión de Usuarios</h2>
        <Link to="/admin/usuarios/nuevo" className="btn-blue">+ Nuevo Usuario</Link>
      </div>

      <LoadState loading={loading} error={error} onRetry={reload}>
        <div className="card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Edad</th>
                  <th>Rol</th>
                  <th>Puntos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.age}</td>
                    <td>{ROLE_LABELS[u.role]}</td>
                    <td>{u.points}</td>
                    <td>
                      <Link to={`/admin/usuarios/editar?id=${u.id}`} className="btn-blue" style={{ fontSize: '0.8rem' }}>Editar</Link>{' '}
                      <Link to={`/admin/usuarios/historial?email=${encodeURIComponent(u.email)}`} className="btn-green" style={{ fontSize: '0.8rem' }}>Historial</Link>{' '}
                      <button onClick={() => handleDelete(u)} className="btn-danger">Eliminar</button>
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
