import { useEffect } from 'react';

export default function Drawer({ open, onClose, onNavigate, onSignOut, userName }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const btnStyle = {
    display: 'flex', alignItems: 'center', gap: '0.85rem',
    background: 'none', border: 'none',
    padding: '0.85rem 0.75rem', borderRadius: '14px',
    cursor: 'pointer', fontFamily: 'var(--font-body)',
    fontSize: '0.95rem', fontWeight: 500, color: '#1a1a1a',
    textAlign: 'left', width: '100%',
  };

  const items = [
    { dest: 'espaces', icon: '🏠', label: 'Mes espaces' },
    { dest: 'profil', icon: '👤', label: 'Mon profil' },
    { dest: 'boutique', icon: '🛒', label: 'Boutique', badge: 'Bientot' },
    { dest: 'fiches', icon: '📋', label: 'Fiches et Conseils' },
    { dest: 'agenda', icon: '📅', label: 'Agenda mensuel' },
    { dest: 'notifications', icon: '🔔', label: 'Notifications' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9998, display: 'flex' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
      <div style={{
        position: 'relative', zIndex: 9999,
        width: '78vw', maxWidth: '300px',
        background: '#fff',
        display: 'flex', flexDirection: 'column',
        boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
        borderRadius: '0 28px 28px 0',
        overflowY: 'auto',
        paddingTop: 'env(safe-area-inset-top)',
        animation: 'slideIn 0.3s ease',
      }}>
        <style>{`@keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.5rem 1.25rem 1.25rem' }}>
          <div style={{ width: 46, height: 46, background: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🌿</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 700, color: '#1a1a1a', fontSize: '0.95rem' }}>Mon compte</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</p>
          </div>
          <button onClick={onClose} style={{ background: '#f5f5f5', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: '0.85rem', color: '#666' }}>✕</button>
        </div>

        <div style={{ height: 1, background: '#eee', margin: '0 1.25rem' }} />

        <nav style={{ display: 'flex', flexDirection: 'column', padding: '0.5rem 0.75rem', flex: 1 }}>
          {items.map(item => (
            <button key={item.dest} onClick={() => onNavigate(item.dest)} style={btnStyle}>
              <span style={{ fontSize: '1.15rem', width: 28, textAlign: 'center' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && <span style={{ fontSize: '0.65rem', fontWeight: 600, background: '#e8f5e9', color: '#1b4332', borderRadius: 980, padding: '0.15rem 0.5rem' }}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div style={{ height: 1, background: '#eee', margin: '0 1.25rem' }} />

        <div style={{ padding: '0.5rem 0.75rem 1.5rem' }}>
          <button onClick={onSignOut} style={{ ...btnStyle, color: '#c0392b' }}>
            <span style={{ fontSize: '1.15rem', width: 28, textAlign: 'center' }}>🚪</span>
            <span>Deconnexion</span>
          </button>
          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#999', margin: '0.75rem 0 0' }}>Mon Expert Jardin v1.0</p>
        </div>
      </div>
    </div>
  );
}
