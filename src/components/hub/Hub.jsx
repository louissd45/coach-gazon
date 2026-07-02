import { useState, useRef } from 'react';
import BrandLogo from '../common/BrandLogo';

const SPACES = [
  {
    id: 'gazon',
    label: 'MON EXPERT',
    title: 'Gazon',
    sub: 'Analyse & Soins',
    desc: 'Votre IA pour un diagnostic précis et des conseils personnalisés.',
    gradient: 'linear-gradient(145deg, #1b4332 0%, #2d6a4f 100%)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 26C6 22 10 18 16 17C20 16 25 17 28 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M2 26C4 21 9 16 16 15C21 14 26 15 29 12" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.6"/>
        <path d="M6 26C9 22 13 20 18 20C22 20 26 22 29 20" stroke="white" strokeWidth="1.1" strokeLinecap="round" opacity="0.35"/>
      </svg>
    ),
  },
  {
    id: 'piscine',
    label: 'MON EXPERT',
    title: 'Piscine',
    sub: 'Traitement & Entretien',
    desc: 'Analyse eau, équilibre chimique et entretien saisonnier de votre bassin.',
    gradient: 'linear-gradient(145deg, #1a5276 0%, #2e86c1 100%)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 16C6 14 8 12 10 14C12 16 14 14 16 14C18 14 20 16 22 14C24 12 26 14 28 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M4 22C6 20 8 18 10 20C12 22 14 20 16 20C18 20 20 22 22 20C24 18 26 20 28 18" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.7"/>
        <path d="M4 27C6 25 8 23 10 25C12 27 14 25 16 25C18 25 20 27 22 25C24 23 26 25 28 23" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
  },
];

export default function Hub({ onSelect, onSignOut }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(null);
  const diffX = useRef(0);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    diffX.current = 0;
  };

  const handleTouchMove = (e) => {
    if (startX.current === null) return;
    diffX.current = startX.current - e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (Math.abs(diffX.current) > 40) {
      if (diffX.current > 0 && activeIndex < SPACES.length - 1) setActiveIndex(i => i + 1);
      if (diffX.current < 0 && activeIndex > 0) setActiveIndex(i => i - 1);
    }
    startX.current = null;
    diffX.current = 0;
  };

  const handleMouseDown = (e) => { startX.current = e.clientX; setDragging(false); };
  const handleMouseMove = (e) => {
    if (startX.current === null) return;
    diffX.current = startX.current - e.clientX;
    if (Math.abs(diffX.current) > 5) setDragging(true);
  };
  const handleMouseUp = () => {
    if (Math.abs(diffX.current) > 40) {
      if (diffX.current > 0 && activeIndex < SPACES.length - 1) setActiveIndex(i => i + 1);
      if (diffX.current < 0 && activeIndex > 0) setActiveIndex(i => i - 1);
    }
    startX.current = null;
    diffX.current = 0;
    setTimeout(() => setDragging(false), 10);
  };

  return (
    <div className="hub">
      <header className="hub__header">
        <BrandLogo size={26} />
        <button onClick={onSignOut} className="hub__signout">Déconnexion</button>
      </header>

      {/* Photo hero en haut */}
      <section className="hub__hero">
        <div className="hub__hero-top">
          <div className="hub__hero-brand-sky">
            <BrandLogo size={36} white />
          </div>
        </div>
        <div className="hub__hero-content">
          <h1 className="hub__title">Votre IA pour une piscine<br />et un gazon parfaits.</h1>
          <p className="hub__hero-sub">Diagnostic intelligent et conseils personnalisés.</p>
        </div>
      </section>

      {/* Carousel */}
      <section className="hub__section">
        <p className="hub__section-label">Choisissez votre espace</p>

        <div
          className="hub__carousel-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {SPACES.map((space, i) => (
            <div
              key={space.id}
              className={`hub__slide ${i === activeIndex ? 'hub__slide--active' : ''} ${i < activeIndex ? 'hub__slide--prev' : ''} ${i > activeIndex ? 'hub__slide--next' : ''}`}
            >
              <button
                className="hub__card-v2"
                style={{ background: space.gradient }}
                onClick={() => !dragging && onSelect(space.id)}
                draggable={false}
              >
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
          ))}
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
