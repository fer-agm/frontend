import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '../api/index.js';

export default function NuevoUsuario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', pass: '', age: '', role: 'cliente' });
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const age = parseInt(form.age);

    if (age < 18) {
      alert('El usuario debe tener al menos 18 años.');
      return;
    }

    try {
      await usersApi.create({ name: form.name, email: form.email, password: form.pass, age, role: form.role, points: 0 });
      alert('Usuario creado exitosamente.');
      navigate('/admin/usuarios');
    } catch (err) {
      alert(err.userMessage || err.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <div className="card">
        <h2>Crear Nuevo Usuario</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre Completo:</label>
          <input type="text" required value={form.name} onChange={set('name')} />

          <label>Correo Electrónico:</label>
          <input type="email" required value={form.email} onChange={set('email')} />

          <label>Contraseña:</label>
          <input type="password" required value={form.pass} onChange={set('pass')} />

          <label>Edad:</label>
          <input type="number" required min="18" value={form.age} onChange={set('age')} />

          <label>Rol:</label>
          <select value={form.role} onChange={set('role')}>
            <option value="cliente">Cliente</option>
            <option value="vendedor">Vendedor</option>
            <option value="admin">Administrador</option>
          </select>

          <button type="submit" className="btn-green" style={{ marginTop: '1.5rem', width: '100%' }}>Guardar Usuario</button>
        </form>
      </div>
    </div>
  );
}
