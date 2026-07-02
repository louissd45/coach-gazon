import { useState, useRef } from 'react';
import BrandLogo from '../common/BrandLogo';
import Drawer from '../common/Drawer';

const SPACES = [
  {
    id: 'gazon',
    title: 'Gazon',
    sub: 'Analyse & Soins',
    desc: 'Diagnostic photo IA, fiches maladies et conseils personnalisés.',
    gradient: 'linear-gradient(145deg, #1b4332, #2d6a4f)',
    icon: '🌿',
  },
  {
    id: 'piscine',
    title: 'Piscine',
    sub: 'Traitement & Entretien',
    desc: 'Analyse eau, pH, chlore et entretien saisonnier.',
    gradient: 'linear-gradient(145deg, #1a5276, #2e86c1)',
    icon: '💧',
  },
];

export default function Hub({ onSelect, onSignOut, user }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const touchStart = useRef(null);

  return (
    <div className="hub">
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={(dest) => { setDrawerOpen(false); if (dest === 'gazon' || dest === 'piscine') onSelect(dest); }}
        onSignOut={onSignOut}
        userName={user?.email ?? ''}
      />

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
          <h1 className="hub__title">Votre IA pour une piscine<br />et un gazon parfaits.</h1>
          <p className="hub__hero-sub">Diagnostic intelligent et conseils personnalisés.</p>
        </div>
      </section>

      <section className="hub__section">
        <p className="hub__section-label">Choisissez votre espace</p>

        {/* Carousel simple */}
        <div
          style={{ overflow: 'hidden', borderRadius: '24px' }}
          onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (!touchStart.current) return;
            const diff = touchStart.current - e.changedTouches[0].clientX;
            if (diff > 50 && activeIndex < SPACES.length - 1) setActiveIndex(i => i + 1);
            if (diff < -50 && activeIndex > 0) setActiveIndex(i => i - 1);
            touchStart.current = null;
          }}
        >
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            transform: `translateX(calc(-${activeIndex * 85}% - ${activeIndex * 0.75}rem))`,
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            padding: '0.25rem 0 0.5rem',
          }}>
            {SPACES.map((space, i) => (
              <button
                key={space.id}
                onClick={() => i === activeIndex ? onSelect(space.id) : setActiveIndex(i)}
                style={{
                  flex: '0 0 85%',
                  height: '300px',
                  background: space.gradient,
                  border: 'none',
                  borderRadius: '24px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  textAlign: 'left',
                  opacity: i === activeIndex ? 1 : 0.6,
                  transition: 'opacity 0.3s ease',
                  boxShadow: '0 10px 36px rgba(0,0,0,0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{space.icon}</div>
                <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '0.2rem' }}>
                    MON EXPERT
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'white', lineHeight: 1, letterSpacing: '-0.02em' }}>
                    {space.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.2rem' }}>
                    {space.sub}
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: '0.75rem 0 0' }}>
                    {space.desc}
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>Accéder à l'espace</span>
                  <span style={{ color: 'white' }}>→</span>
                </div>
                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.65rem', fontWeight: 700, borderRadius: '8px', padding: '0.2rem 0.55rem' }}>
                  IA
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          {SPACES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              style={{
                width: i === activeIndex ? '20px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === activeIndex ? 'var(--accent)' : 'var(--border)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
