export default function Header({ auth, username, onLogout }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand" aria-label="TecnoUAM, Centro de Capacitación">
          <span className="brand-mark">TU</span>
          <span className="brand-copy">
            <strong>TecnoUAM</strong>
            <small>Gestión de préstamos</small>
          </span>
        </div>
        <div className="header-right">
          <span className="header-indicator"><span className="indicator-dot" /> Sistema de equipos</span>
          {auth && (
            <div className="user-tools">
              <span className="user-avatar" aria-hidden="true">{username?.charAt(0).toUpperCase()}</span>
              <div className="user-info"><strong>{username}</strong><small>{auth.rol}</small></div>
              <button type="button" className="button button-ghost" onClick={onLogout}>Salir</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
