import { useState, useRef } from 'react';
import BrandLogo from '../common/BrandLogo';

const SPACES = [
  {
    id: 'gazon',
    label: 'MON EXPERT',
    title: 'Gazon',
    sub: 'Analyse & Soins',
    color: 'linear-gradient(145deg, #1b4332, #2d6a4f)',
    photo: '/images/hero-gazon.jpg',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 26C4 26 6 18 12 14C16 11 22 11 26 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M2 26C2 26 8 16 16 14C22 12 28 14 30 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
        <path d="M6 26C10 20 14 18 20 18C24 18 28 20 30 22" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
  },
  {
    id: 'piscine',
    label: 'MON EXPERT',
    title: 'Piscine',
    sub: 'Traitement & Entretien',
    color: 'linear-gradient(145deg, #1a5276, #2e86c1)',
    photo: '/images/hero-piscine.jpg',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 18C6 16 8 14 10 16C12 18 14 16 16 16C18 16 20 18 22 16C24 14 26 16 28 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M4 23C6 21 8 19 10 21C12 23 14 21 16 21C18 21 20 23 22 21C24 19 26 21 28 19" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      </svg>
    ),
  },
];

export default function Hub({ onSelect, onSignOut }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const startX = useRef(null);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < SPACES.length - 1) setActiveIndex(i => i + 1);
      if (diff < 0 && activeIndex > 0) setActiveIndex(i => i - 1);
    }
    startX.current = null;
  };

  const handleMouseDown = (e) => { startX.current = e.clientX; };
  const handleMouseUp = (e) => {
    if (startX.current === null) return;
    const diff = startX.current - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < SPACES.length - 1) setActiveIndex(i => i + 1);
      if (diff < 0 && activeIndex > 0) setActiveIndex(i => i - 1);
    }
    startX.current = null;
  };

  return (
    <div className="hub">
      <header className="hub__header">
        <BrandLogo size={26} />
        <button onClick={onSignOut} className="hub__signout">Déconnexion</button>
      </header>

      <div className="hub__carousel-wrap">
        <div
          className="hub__carousel"
          style={{ transform: `translateX(calc(-${activeIndex * 100}% - ${activeIndex * 1}rem))` }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          {SPACES.map((space) => (
            <button
              key={space.id}
              className="hub__card-full"
              style={{ background: space.color }}
              onClick={() => onSelect(space.id)}
            >
              <div className="hub__card-full-content">
                <div className="hub__card-full-icon">{space.icon}</div>
                <span className="hub__card-full-label">{space.label}</span>
                <span className="hub__card-full-title">{space.title}</span>
                <span className="hub__card-full-sub">{space.sub}</span>
                <div className="hub__card-full-badge">IA</div>
                <div className="hub__card-full-cta">Accéder →</div>
              </div>
            </button>
          ))}
        </div>

        {/* Dots */}
        <div className="hub__dots">
          {SPACES.map((_, i) => (
            <button
              key={i}
              className={`hub__dot ${i === activeIndex ? 'hub__dot--active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Espace ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <p className="hub__hint">Glissez pour changer d'espace</p>
    </div>
  );
}
