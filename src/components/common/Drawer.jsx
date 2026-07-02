export default function Drawer({ open, onClose, onNavigate, onSignOut, userName }) {
  return (
    <>
      {/* Overlay sombre derrière */}
      <div
        className={`drawer-overlay ${open ? 'drawer-overlay--visible' : ''}`}
        onClick={onClose}
      />

      {/* Panneau latéral */}
      <div className={`drawer ${open ? 'drawer--open' : ''}`}>
        {/* En-tête du drawer */}
        <div className="drawer__header">
          <div className="drawer__avatar">
            <span>🌿</span>
          </div>
          <div className="drawer__user">
            <p className="drawer__user-name">Mon compte</p>
            <p className="drawer__user-email">{userName}</p>
          </div>
          <button className="drawer__close" onClick={onClose}>✕</button>
        </div>

        <div className="drawer__divider" />

        {/* Navigation */}
        <nav className="drawer__nav">
          <button className="drawer__item" onClick={() => onNavigate('espaces')}>
            <span className="drawer__item-icon">🏠</span>
            <span>Mes espaces</span>
          </button>

          <button className="drawer__item" onClick={() => onNavigate('profil')}>
            <span className="drawer__item-icon">👤</span>
            <span>Mon profil</span>
          </button>

          <button className="drawer__item" onClick={() => onNavigate('boutique')}>
            <span className="drawer__item-icon">🛒</span>
            <span>Boutique</span>
            <span className="drawer__item-badge">Bientôt</span>
          </button>

          <button className="drawer__item" onClick={() => onNavigate('fiches')}>
            <span className="drawer__item-icon">📋</span>
            <span>Fiches & Conseils</span>
          </button>

          <button className="drawer__item" onClick={() => onNavigate('agenda')}>
            <span className="drawer__item-icon">📅</span>
            <span>Agenda mensuel</span>
          </button>

          <button className="drawer__item" onClick={() => onNavigate('notifications')}>
            <span className="drawer__item-icon">🔔</span>
            <span>Notifications</span>
          </button>
        </nav>

        <div className="drawer__divider" />

        {/* Pied du drawer */}
        <div className="drawer__footer">
          <button className="drawer__item drawer__item--danger" onClick={onSignOut}>
            <span className="drawer__item-icon">🚪</span>
            <span>Déconnexion</span>
          </button>
          <p className="drawer__version">Mon Expert Jardin · v1.0</p>
        </div>
      </div>
    </>
  );
}
