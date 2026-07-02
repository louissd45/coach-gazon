import { useEffect } from 'react';

export default function Drawer({ open, onClose, onNavigate, onSignOut, userName }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          zIndex: 9998,
        }}
      />
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: '78vw', maxWidth: '300px',
        background: 'var(--bg)',
        zIndex: 9999,
        display: 'flex', flexDirection: 'column',
        boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
        borderRadius: '0 28px 28px 0',
        overflowY: 'auto',
        paddingTop: 'env(safe-area-inset-top)',
        animation: 'slideInLeft 0.3s ease',
      }}>
        <style>{`@keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>

        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'1.5rem 1.25rem 1.25rem' }}>
          <div style={{ width:46, height:46, background:'var(--accent-soft)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>🌿</div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ margin:0, fontWeight:700, fontFamily:'var(--font-display)', color:'var(--text)', fontSize:'0.95rem' }}>Mon compte</p>
            <p style={{ margin:0, fontSize:'0.75rem', color:'var(--text-dim)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{userName}</p>
          </div>
          <button onClick={onClose} style={{ background:'var(--bg-soft)', border:'none', width:32, height:32, borderRadius:'50%', cursor:'pointer', fontSize:'0.85rem', color:'var(--text-dim)' }}>✕</button>
        </div>

        <div style={{ height:1, background:'var(--border)', margin:'0 1.25rem' }} />

        <nav style={{ display:'flex', flexDirection:'column', padding:'0.5rem 0.75rem', flex:1 }}>
          {[
            { dest:'espaces', icon:'🏠', label:'Mes espaces' },
            { dest:'profil', icon:'👤', label:'Mon profil' },
            { dest:'boutique', icon:'🛒', label:'Boutique', badge:'Bientot' },
            { dest:'fiches', icon:'📋', label:'Fiches et Conseils' },
            { dest:'agenda', icon:'📅', label:'Agenda mensuel' },
            { dest:'notifications', icon:'🔔', label:'Notifications' },
          ].map((item) => (
            <button key={item.dest} onClick={() => onNavigate(item.dest)}
              style={{ display:'flex', alignItems:'center', gap:'0.85rem', background:'none', border:'none', padding:'0.85rem 0.75rem', borderRadius:14, cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'0.95rem', fontWeight:500, color:'var(--text)', textAlign:'left', width:'100%' }}>
              <span style={{ fontSize:'1.15rem', width:28, textAlign:'center' }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {item.badge && <span style={{ fontSize:'0.65rem', fontWeight:600, background:'var(--accent-soft)', color:'var(--accent)', borderRadius:980, padding:'0.15rem 0.5rem' }}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div style={{ height:1, background:'var(--border)', margin:'0 1.25rem' }} />

        <div style={{ padding:'0.5rem 0.75rem 1.5rem' }}>
          <button onClick={onSignOut}
            style={{ display:'flex', alignItems:'center', gap:'0.85rem', background:'none', border:'none', padding:'0.85rem 0.75rem', borderRadius:14, cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'0.95rem', fontWeight:500, color:'#c0392b', textAlign:'left', width:'100%' }}>
            <span style={{ fontSize:'1.15rem', width:28, textAlign:'center' }}>🚪</span>
            <span>Deconnexion</span>
          </button>
          <p style={{ textAlign:'center', fontSize:'0.72rem', color:'var(--text-faint)', margin:'0.75rem 0 0' }}>Mon Expert Jardin · v1.0</p>
        </div>
      </div>
    </>
  );
}
