import { useEffect } from 'react';

export default function Drawer({ open, onClose, onNavigate, onSignOut, userName }) {
  // Empêche le scroll du body quand le drawer est ouvert
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: open ? 'rgba(0,0,0,0.45)' : 'transparent',
          zIndex: 9998,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'background 0.3s ease',
        }}
        onClick={onClose}
      />

      {/* Panneau */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '78vw',
          maxWidth: '300px',
          background: 'var(--bg)',
          zIndex: 9999,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
          borderRadius: '0 28px 28px 0',
          overflowY: 'auto',
          paddingTop: 'env(safe-area-inset-top)',
        }}
      >
        {/* Header */}
        <div className="drawer__header">
          <div className="drawer__avatar">🌿</div>
          <div className="drawer__user">
            <p className="drawer__user-name">Mon compte</p>
            <p className="drawer__user-email">{userName}</p>
          </div>
          <button className="drawer__close" onClick={onClose}>✕</button>
        </div>

        <div className="drawer__divider" />

        {/* Navigation */}
        <nav className="drawer__nav">
          {[
            { dest: 'espaces', icon: '🏠', label: 'Mes espaces' },
            { dest: 'profil', icon: '👤', label: 'Mon profil' },
            { dest: 'boutique', icon: '🛒', label: 'Boutique', badge: 'Bientôt' },
            { dest: 'fiches', icon: '📋', label: 'Fiches & Conseils' },
            { dest: 'agenda', icon: '📅', label: 'Agenda mensuel' },
            { dest: 'notifications', icon: '🔔', label: 'Notifications' },
          ].map((item) => (
            <button key={item.dest} className="drawer__item" onClick={() => onNavigate(item.dest)}>
              <span className="drawer__item-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span className="drawer__item-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="drawer__divider" />

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
