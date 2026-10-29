import { useState } from 'react';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import EquiposPage from './pages/EquiposPage';

export default function App() {
  const [session, setSession] = useState(null);

  return (
    <div className="app-shell">
      <Header
        auth={session?.auth}
        username={session?.username}
        onLogout={() => setSession(null)}
      />
      <main className={session ? 'main-content' : 'main-login'}>
        {session ? (
          <EquiposPage token={session.auth.token} role={session.auth.rol} />
        ) : (
          <LoginPage onLogin={(auth, username) => setSession({ auth, username })} />
        )}
      </main>
      <footer className="site-footer">
        <span>TecnoUAM · Gestión de equipos</span>
        <span>Centro de Capacitación</span>
      </footer>
    </div>
  );
}
