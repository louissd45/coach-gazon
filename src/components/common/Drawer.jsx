import { useEffect, useState } from 'react';

export default function Drawer({ open, onClose, onNavigate, onSignOut, userName }) {
  const [expanded, setExpanded] = useState(null);

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

  const subBtnStyle = {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    background: 'none', border: 'none',
    padding: '0.6rem 0.75rem 0.6rem 3rem', borderRadius: '10px',
    cursor: 'pointer', fontFamily: 'var(--font-body)',
    fontSize: '0.85rem', fontWeight: 500, color: '#444',
    textAlign: 'left', width: '100%',
  };

  const toggle = (id) => setExpanded(expanded === id ? null : id);

  const plans = [
    { id: 'gazon', icon: '🌿', name: 'Expert Gazon', monthly: '4,99€', yearly: '49€', color: '#1b4332', bg: '#e8f5e9' },
    { id: 'piscine', icon: '💧', name: 'Expert Piscine', monthly: '3,99€', yearly: '39€', color: '#1a5276', bg: '#e3f2fd' },
    { id: 'both', icon: '⭐', name: 'Gazon + Piscine', monthly: '7,99€', yearly: '79€', color: '#1a1a1a', bg: '#f5f5f3', badge: 'Meilleur' },
  ];

  const legalItems = [
    { dest: 'cgv', icon: '📄', label: 'CGV' },
    { dest: 'mentions', icon: '⚖️', label: 'Mentions legales & RGPD' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9998, display: 'flex' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
      <div style={{
        position: 'relative', zIndex: 9999,
        width: '82vw', maxWidth: '320px',
        background: '#fff',
        display: 'flex', flexDirection: 'column',
        boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
        borderRadius: '0 28px 28px 0',
        overflowY: 'auto',
        paddingTop: 'env(safe-area-inset-top)',
        animation: 'slideIn 0.3s ease',
      }}>
        <style>{`@keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.5rem 1.25rem 1.25rem' }}>
          <div style={{ width: 46, height: 46, background: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🌿</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 700, color: '#1a1a1a', fontSize: '0.95rem' }}>Mon Expert Jardin</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</p>
          </div>
          <button onClick={onClose} style={{ background: '#f5f5f5', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: '0.85rem', color: '#666' }}>✕</button>
        </div>

        <div style={{ height: 1, background: '#eee', margin: '0 1.25rem' }} />

        {/* Nav principale */}
        <nav style={{ display: 'flex', flexDirection: 'column', padding: '0.5rem 0.75rem' }}>

          {/* Mes espaces */}
          <button onClick={() => onNavigate('espaces')} style={btnStyle}>
            <span style={{ fontSize: '1.15rem', width: 28, textAlign: 'center' }}>🏠</span>
            <span style={{ flex: 1 }}>Mes espaces</span>
          </button>

          {/* Mon profil */}
          <button onClick={() => onNavigate('profil')} style={btnStyle}>
            <span style={{ fontSize: '1.15rem', width: 28, textAlign: 'center' }}>👤</span>
            <span style={{ flex: 1 }}>Mon profil</span>
          </button>

          {/* Fiches techniques — avec sous-dossiers */}
          <button onClick={() => toggle('fiches')} style={btnStyle}>
            <span style={{ fontSize: '1.15rem', width: 28, textAlign: 'center' }}>📋</span>
            <span style={{ flex: 1 }}>Fiches techniques</span>
            <span style={{ fontSize: '0.75rem', color: '#aaa', transition: 'transform 0.2s', transform: expanded === 'fiches' ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
          </button>
          {expanded === 'fiches' && (
            <div style={{ marginBottom: 4 }}>
              <button onClick={() => { onNavigate('fiches'); onClose(); }} style={{ ...subBtnStyle, color: '#1b4332' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0 }}>🌿</span>
                Fiches Gazon
              </button>
              <button onClick={() => { onNavigate('fiches-piscine'); onClose(); }} style={{ ...subBtnStyle, color: '#1a5276' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0 }}>💧</span>
                Fiches Piscine
              </button>
            </div>
          )}

          {/* Agenda — avec sous-dossiers */}
          <button onClick={() => toggle('agenda')} style={btnStyle}>
            <span style={{ fontSize: '1.15rem', width: 28, textAlign: 'center' }}>📅</span>
            <span style={{ flex: 1 }}>Agenda</span>
            <span style={{ fontSize: '0.75rem', color: '#aaa', transition: 'transform 0.2s', transform: expanded === 'agenda' ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
          </button>
          {expanded === 'agenda' && (
            <div style={{ marginBottom: 4 }}>
              <button onClick={() => { onNavigate('agenda'); onClose(); }} style={{ ...subBtnStyle, color: '#1b4332' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0 }}>🌿</span>
                Agenda Gazon
              </button>
              <button onClick={() => { onNavigate('agenda-piscine'); onClose(); }} style={{ ...subBtnStyle, color: '#1a5276' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0 }}>💧</span>
                Agenda Piscine
              </button>
            </div>
          )}

          {/* Boutique */}
          <button onClick={() => onNavigate('boutique')} style={btnStyle}>
            <span style={{ fontSize: '1.15rem', width: 28, textAlign: 'center' }}>🛒</span>
            <span style={{ flex: 1 }}>Boutique</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, background: '#e8f5e9', color: '#1b4332', borderRadius: 980, padding: '0.15rem 0.5rem' }}>Bientot</span>
          </button>

          {/* Notifications */}
          <button onClick={() => onNavigate('notifications')} style={btnStyle}>
            <span style={{ fontSize: '1.15rem', width: 28, textAlign: 'center' }}>🔔</span>
            <span style={{ flex: 1 }}>Notifications</span>
          </button>
        </nav>

        <div style={{ height: 1, background: '#eee', margin: '0 1.25rem' }} />

        {/* Abonnements */}
        <div style={{ padding: '0.75rem 1.25rem' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Abonnements</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {plans.map(plan => (
              <button key={plan.id} onClick={() => onNavigate('abonnement')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: plan.bg, border: `1px solid ${plan.color}22`, borderRadius: 12, padding: '0.65rem 0.85rem', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)', width: '100%', position: 'relative' }}>
                {plan.badge && (
                  <span style={{ position: 'absolute', top: -8, right: 10, background: plan.color, color: '#fff', fontSize: '0.58rem', fontWeight: 800, borderRadius: 980, padding: '2px 8px' }}>{plan.badge}</span>
                )}
                <span style={{ fontSize: '1.1rem', width: 24, textAlign: 'center' }}>{plan.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.82rem', color: plan.color }}>{plan.name}</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: plan.color, opacity: 0.7 }}>{plan.monthly}/mois · {plan.yearly}/an</p>
                </div>
                <span style={{ fontSize: '0.75rem', color: plan.color, opacity: 0.6 }}>→</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: '#eee', margin: '0 1.25rem' }} />

        {/* Légal */}
        <div style={{ padding: '0.25rem 0.75rem' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.6rem 0.75rem 0.2rem' }}>Documents legaux</p>
          {legalItems.map(item => (
            <button key={item.dest} onClick={() => onNavigate(item.dest)} style={{ ...btnStyle, fontSize: '0.82rem', color: '#555', padding: '0.6rem 0.75rem' }}>
              <span style={{ fontSize: '1rem', width: 28, textAlign: 'center' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
            </button>
          ))}
        </div>

        <div style={{ height: 1, background: '#eee', margin: '0 1.25rem' }} />

        {/* Footer */}
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
