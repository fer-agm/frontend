import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { usersApi } from '../../api/index.js';

export default function AdminPerfil() {
  const { user, setSessionUser } = useAuth();

  const [form, setForm] = useState({ name: user.name, age: user.age, currentPass: '', newPass: '', confirmPass: '' });
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const changingPass = form.newPass || form.currentPass || form.confirmPass;

    if (changingPass) {
      if (form.newPass.length < 4) {
        alert('La nueva contraseña debe tener al menos 4 caracteres.');
        return;
      }
      if (form.newPass !== form.confirmPass) {
        alert('La confirmación no coincide con la nueva contraseña.');
        return;
      }
    }

    try {
      // La contraseña actual la valida el backend
      const updated = await usersApi.updateProfile({
        name: form.name.trim(),
        age: parseInt(form.age),
        currentPass: form.currentPass,
        newPass: form.newPass,
      });
      setSessionUser(updated); // mantiene la sesión sincronizada
      setForm({ ...form, currentPass: '', newPass: '', confirmPass: '' });
      alert('Perfil actualizado correctamente.');
    } catch (err) {
      alert(err.userMessage || err.message);
    }
  };

  return (
    <div style={{ maxWidth: '500px' }}>
      <div className="card">
        <h2>Mi Perfil</h2>
        <form onSubmit={handleSubmit}>
          <label>Correo (No editable):</label>
          <input type="email" value={user.email} readOnly style={{ opacity: 0.6 }} />

          <label>Nombre Completo:</label>
          <input type="text" required value={form.name} onChange={set('name')} />

          <label>Edad:</label>
          <input type="number" required min="18" value={form.age} onChange={set('age')} />

          <h5 className="mt-4">Cambiar contraseña (opcional)</h5>
          <label>Contraseña actual:</label>
          <input type="password" value={form.currentPass} onChange={set('currentPass')} />
          <label>Nueva contraseña:</label>
          <input type="password" value={form.newPass} onChange={set('newPass')} />
          <label>Confirmar nueva contraseña:</label>
          <input type="password" value={form.confirmPass} onChange={set('confirmPass')} />

          <button type="submit" className="btn-blue" style={{ marginTop: '1.5rem', width: '100%' }}>Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
}
