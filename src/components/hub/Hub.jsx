import { useState } from 'react';
import BrandLogo from '../common/BrandLogo';
import Drawer from '../common/Drawer';

export default function Hub({ onSelect, onSignOut, user }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="hub">
      {drawerOpen && (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onNavigate={(dest) => {
            setDrawerOpen(false);
            if (dest === 'gazon') onSelect('gazon');
            if (dest === 'piscine') onSelect('piscine');
          }}
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
        </div>
      </section>

      <section className="hub__section">
        <p className="hub__section-label">Choisissez votre espace</p>
        <div className="hub__cards">
          <button className="hub__card hub__card--gazon" onClick={() => onSelect('gazon')}>
            <span className="hub__card-label">MON EXPERT</span>
            <span className="hub__card-title">Gazon</span>
            <span className="hub__card-sub">Analyse et Soins</span>
            <span className="hub__card-badge">IA</span>
          </button>
          <button className="hub__card hub__card--piscine" onClick={() => onSelect('piscine')}>
            <span className="hub__card-label">MON EXPERT</span>
            <span className="hub__card-title">Piscine</span>
            <span className="hub__card-sub">Traitement et Entretien</span>
            <span className="hub__card-badge">IA</span>
          </button>
        </div>
      </section>
    </div>
  );
}
