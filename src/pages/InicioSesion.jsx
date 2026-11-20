import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { homeFor } from '../utils/roles.js';

export default function InicioSesion() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await signIn(email.trim(), pass);
      alert(`¡Bienvenido ${user.name}!`);
      // Cliente: vuelve a donde estaba (ej. checkout). Administrador/Vendedor: a su panel.
      const back = state?.from && user.role === 'cliente' ? state.from : homeFor(user);
      navigate(back);
    } catch (err) {
      alert(err.status === 401 ? 'Correo o contraseña incorrectos.' : err.userMessage || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <div className="card">
        <h2>Iniciar Sesión</h2>

        <div style={{ background: '#1e1e1e', padding: '0.8rem', borderLeft: '3px solid var(--accent-green)', margin: '1rem 0', fontSize: '0.85rem' }}>
          <strong>Credenciales de prueba:</strong><br />
          • <strong>Administrador:</strong> admin@levelup.cl | clave: admin<br />
          • <strong>Vendedor:</strong> vendedor@levelup.cl | clave: vendedor<br />
          • <strong>Cliente:</strong> cliente@levelup.cl | clave: cliente<br />
          • <strong>Cliente Duoc:</strong> estudiante@duoc.cl | clave: 123
        </div>

        <form onSubmit={handleSubmit}>
          <label>Correo Electrónico:</label>
          <input type="email" required placeholder="admin@levelup.cl" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Contraseña:</label>
          <input type="password" required placeholder="admin" value={pass} onChange={(e) => setPass(e.target.value)} />

          <button type="submit" className="btn-blue" disabled={loading} style={{ marginTop: '1.5rem', width: '100%' }}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
          ¿No tienes cuenta? <Link to="/registro" style={{ color: 'var(--accent-green)' }}>Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}
