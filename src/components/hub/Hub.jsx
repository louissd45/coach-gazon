import { useState, useRef } from 'react';
import BrandLogo from '../common/BrandLogo';
import Drawer from '../common/Drawer';
import Boutique from '../shop/Boutique';

const SPACES = [
  { id: 'gazon', title: 'Gazon', sub: 'Analyse et Soins', color: 'linear-gradient(145deg,#1b4332,#2d6a4f)' },
  { id: 'piscine', title: 'Piscine', sub: 'Traitement et Entretien', color: 'linear-gradient(145deg,#1a5276,#2e86c1)' },
];

export default function Hub({ onSelect, onSignOut, user }) {
  const [active, setActive] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showBoutique, setShowBoutique] = useState(false);
  const t0 = useRef(null);

  const handleDrawerNav = (dest) => {
    setDrawerOpen(false);
    if (dest === 'gazon') onSelect('gazon');
    if (dest === 'piscine') onSelect('piscine');
    if (dest === 'boutique') setShowBoutique(true);
  };

  if (showBoutique) return (
    <div className="app">
      <header className="app__header">
        <BrandLogo size={26} />
        <button className="app__nav-back" onClick={() => setShowBoutique(false)}>← Accueil</button>
      </header>
      <Boutique onClose={() => setShowBoutique(false)} initialTab="gazon" userId={user?.id} />
    </div>
  );

  return (
    <div className="hub">
      {drawerOpen && (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onNavigate={handleDrawerNav}
          onSignOut={onSignOut}
          userName={user?.email ?? ''}
        />
      )}

      <header className="hub__header">
        <BrandLogo size={26} />
        <button className="hub__hamburger" onClick={() => setDrawerOpen(true)}>
          <span /><span /><span />
        </button>
      </header>

      <section className="hub__hero">
        <div className="hub__hero-top">
          <div className="hub__hero-brand-sky"><BrandLogo size={36} white /></div>
        </div>
        <div className="hub__hero-content">
          <h1 className="hub__title">Votre IA pour une piscine et un gazon parfaits.</h1>
          <p className="hub__hero-sub">Diagnostic intelligent et conseils personnalises.</p>
        </div>
      </section>

      <section className="hub__section">
        <p className="hub__section-label">Choisissez votre espace</p>

        <div
          style={{ overflow: 'hidden', borderRadius: '24px' }}
          onTouchStart={e => { t0.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            if (!t0.current) return;
            const diff = t0.current - e.changedTouches[0].clientX;
            if (diff > 50 && active < 1) setActive(1);
            if (diff < -50 && active > 0) setActive(0);
            t0.current = null;
          }}
        >
          <div style={{
            display: 'flex', gap: '0.75rem',
            transform: `translateX(calc(-${active * 85}% - ${active * 0.75}rem))`,
            transition: 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
            padding: '0.25rem 0 0.5rem',
          }}>
            {SPACES.map((s, i) => (
              <button key={s.id}
                onClick={() => i === active ? onSelect(s.id) : setActive(i)}
                style={{
                  flex: '0 0 85%', height: '280px',
                  background: s.color, border: 'none', borderRadius: '24px',
                  padding: '1.75rem', display: 'flex', flexDirection: 'column',
                  justifyContent: 'space-between', alignItems: 'flex-start',
                  cursor: 'pointer', textAlign: 'left',
                  opacity: i === active ? 1 : 0.6, transition: 'opacity 0.3s',
                  boxShadow: '0 10px 36px rgba(0,0,0,0.2)', position: 'relative',
                }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>MON EXPERT</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{s.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', marginTop: '0.2rem' }}>{s.sub}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>Acceder a espace</span>
                  <span style={{ color: 'white' }}>→</span>
                </div>
                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.65rem', fontWeight: 700, borderRadius: '8px', padding: '0.2rem 0.55rem' }}>IA</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          {SPACES.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              width: i === active ? '20px' : '8px', height: '8px',
              borderRadius: '4px',
              background: i === active ? 'var(--accent)' : 'var(--border)',
              border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s',
            }} />
          ))}
        </div>

        <button
          onClick={() => setShowBoutique(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.85rem',
            width: '100%', marginTop: '1.25rem',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1rem 1.1rem',
            cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)',
          }}>
          <span style={{ fontSize: '1.3rem', width: 44, height: 44, background: 'var(--bg-soft)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛒</span>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: '0.97rem' }}>Boutique</p>
            <p style={{ margin: '0.1rem 0 0', fontSize: '0.78rem', color: 'var(--text-dim)' }}>Produits gazon et piscine</p>
          </div>
          <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}>→</span>
        </button>
      </section>
    </div>
  );
}
