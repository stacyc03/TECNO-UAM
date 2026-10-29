import { useState } from 'react';
import { login } from '../api/auth';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const auth = await login(username, password);
      setPassword('');
      onLogin(auth, username);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Usuario o contraseña incorrectos.');
      } else if (err.response) {
        setError(`No se pudo iniciar sesión. El servidor respondió HTTP ${err.response.status}.`);
      } else if (err.code === 'ECONNABORTED') {
        setError('La conexión tardó demasiado. Comprueba que Spring Boot siga ejecutándose.');
      } else {
        setError('No se pudo contactar al backend. Comprueba que Spring Boot esté encendido en el puerto 8080.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-layout">
      <section className="login-promo" aria-label="Información del sistema">
        <span className="promo-tag">PLATAFORMA INTERNA</span>
        <div className="promo-content">
          <span className="promo-icon" aria-hidden="true">↗</span>
          <h1>Equipos organizados.<br /><span>Información clara.</span></h1>
          <p>Consulta la disponibilidad de computadoras, proyectores y tabletas del centro de capacitación.</p>
          <div className="promo-detail"><span className="detail-line" /> Control de inventario y préstamos</div>
        </div>
        <span className="promo-corner" aria-hidden="true">01 / ACCESO</span>
      </section>
      <section className="login-panel">
        <span className="section-kicker">ACCESO AL SISTEMA</span>
        <h2>Iniciar sesión</h2>
        <p className="login-description">Ingresa tus credenciales para consultar los equipos disponibles.</p>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="username">Usuario</label>
          <input id="username" name="username" autoComplete="username" placeholder="Escribe tu usuario" required value={username} onChange={(e) => setUsername(e.target.value)} />
          <label htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Escribe tu contraseña" required value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="form-error" role="alert">{error}</div>}
          <button type="submit" className="button button-primary button-full" disabled={loading}>
            {loading ? 'Verificando acceso…' : 'Ingresar al sistema'} <span aria-hidden="true">→</span>
          </button>
        </form>
        <p className="login-note">Acceso para usuarios autorizados del centro.</p>
      </section>
    </div>
  );
}
