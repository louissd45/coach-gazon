import { useState, useRef } from 'react';
import BrandLogo from '../common/BrandLogo';
import Drawer from '../common/Drawer';

const SPACES = [
  {
    id: 'gazon',
    label: 'MON EXPERT',
    title: 'Gazon',
    sub: 'Analyse & Soins',
    desc: 'Diagnostic photo IA, fiches maladies et conseils personnalisés pour votre pelouse.',
    gradient: 'linear-gradient(145deg, #1b4332 0%, #2d6a4f 100%)',
    accentColor: 'rgba(82, 183, 136, 0.4)',
    icon: (
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
        <path d="M4 26C6 22 10 18 16 17C20 16 25 17 28 15" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M2 26C4 21 9 16 16 15C21 14 26 15 29 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <path d="M6 26C9 22 13 20 18 20C22 20 26 22 29 20" stroke="white" strokeWidth="1.1" strokeLinecap="round" opacity="0.3"/>
      </svg>
    ),
  },
  {
    id: 'piscine',
    label: 'MON EXPERT',
    title: 'Piscine',
    sub: 'Traitement & Entretien',
    desc: 'Analyse eau, pH, chlore et entretien saisonnier de votre bassin.',
    gradient: 'linear-gradient(145deg, #1a5276 0%, #2e86c1 100%)',
    accentColor: 'rgba(46, 134, 193, 0.4)',
    icon: (
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
        <path d="M4 14C6 12 8 10 10 12C12 14 14 12 16 12C18 12 20 14 22 12C24 10 26 12 28 10" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M4 20C6 18 8 16 10 18C12 20 14 18 16 18C18 18 20 20 22 18C24 16 26 18 28 16" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.7"/>
        <path d="M4 26C6 24 8 22 10 24C12 26 14 24 16 24C18 24 20 26 22 24C24 22 26 24 28 22" stroke="white" strokeWidth="1.1" strokeLinecap="round" opacity="0.35"/>
      </svg>
    ),
  },
];

export default function Hub({ onSelect, onSignOut, user }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const startX = useRef(null);
  const diffX = useRef(0);

  const handleNavigate = (dest) => {
    setDrawerOpen(false);
    if (dest === 'gazon') onSelect('gazon');
    if (dest === 'piscine') onSelect('piscine');
    // Les autres destinations (profil, boutique...) seront gérées depuis les dashboards
  };

  const prev = () => { if (activeIndex > 0) setActiveIndex(i => i - 1); };
  const next = () => { if (activeIndex < SPACES.length - 1) setActiveIndex(i => i + 1); };

  const wasDragging = useRef(false);

  const handleTouchStart = (e) => { startX.current = e.touches[0].clientX; diffX.current = 0; wasDragging.current = false; };
  const handleTouchMove = (e) => {
    if (startX.current !== null) {
      diffX.current = startX.current - e.touches[0].clientX;
      if (Math.abs(diffX.current) > 10) wasDragging.current = true;
    }
  };
  const handleTouchEnd = () => {
    if (diffX.current > 45) next();
    else if (diffX.current < -45) prev();
    startX.current = null; diffX.current = 0;
    setTimeout(() => { wasDragging.current = false; }, 100);
  };

  const handleMouseDown = (e) => { startX.current = e.clientX; diffX.current = 0; wasDragging.current = false; };
  const handleMouseMove = (e) => {
    if (startX.current === null) return;
    diffX.current = startX.current - e.clientX;
    if (Math.abs(diffX.current) > 10) wasDragging.current = true;
  };
  const handleMouseUp = () => {
    if (diffX.current > 45) next();
    else if (diffX.current < -45) prev();
    startX.current = null; diffX.current = 0;
  };

  return (
    <div className="hub">
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={handleNavigate}
        onSignOut={onSignOut}
        userName={user?.email ?? ''}
      />

      <header className="hub__header">
        <BrandLogo size={26} />
        <button className="hub__hamburger" onClick={() => setDrawerOpen(true)} aria-label="Menu">
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

        {/* Carousel avec peek */}
        <div
          className="hub__peek-wrap"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="hub__peek-track"
            style={{ transform: `translateX(calc(-${activeIndex * 80}% - ${activeIndex * 0.75}rem))` }}
          >
            {SPACES.map((space, i) => {
              const isActive = i === activeIndex;
              return (
                <div
                  key={space.id}
                  className={`hub__peek-item ${isActive ? 'hub__peek-item--active' : ''}`}
                  style={{ opacity: isActive ? 1 : 0.6 }}
                >
                  <button
                    className="hub__card-v2"
                    style={{ background: space.gradient }}
                    onClick={() => { if (!wasDragging.current) { isActive ? onSelect(space.id) : setActiveIndex(i); } }}
                    draggable={false}
                  >
                    <div className="hub__card-glow" style={{ background: space.accentColor }} />
                    <div className="hub__card-v2-badge">IA</div>
                    <div className="hub__card-v2-icon">{space.icon}</div>
                    <div className="hub__card-v2-body">
                      <span className="hub__card-v2-label">{space.label}</span>
                      <span className="hub__card-v2-title">{space.title}</span>
                      <span className="hub__card-v2-sub">{space.sub}</span>
                      <p className="hub__card-v2-desc">{space.desc}</p>
                    </div>
                    <div className="hub__card-v2-footer">
                      <span className="hub__card-v2-cta">Accéder à l'espace</span>
                      <span className="hub__card-v2-arrow">→</span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div className="hub__dots">
          {SPACES.map((_, i) => (
            <button
              key={i}
              className={`hub__dot ${i === activeIndex ? 'hub__dot--active' : ''}`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
