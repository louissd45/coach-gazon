import BrandLogo from '../common/BrandLogo';

export default function Hub({ onSelect, onSignOut }) {
  return (
    <div className="hub">
      <header className="hub__header">
        <BrandLogo size={28} />
        <button onClick={onSignOut} className="hub__signout">Déconnexion</button>
      </header>

      <section className="hub__hero">
        <div className="hub__hero-content">
          <BrandLogo size={44} white />
          <h1 className="hub__title">Votre IA pour un jardin<br />et une piscine parfaits.</h1>
          <p className="hub__hero-sub">
            Diagnostic intelligent, conseils personnalisés et suivi
            continu pour chaque espace extérieur.
          </p>
        </div>
      </section>

      <section className="hub__section">
        <p className="hub__section-label">Choisissez votre espace</p>
        <div className="hub__cards">
          <button className="hub__card hub__card--gazon" onClick={() => onSelect('gazon')}>
            <div className="hub__card-icon hub__card-icon--gazon">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M4 26C4 26 6 18 12 14C16 11 22 11 26 8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M2 26C2 26 8 16 16 14C22 12 28 14 30 10" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.6"/>
                <path d="M6 26C10 20 14 18 20 18C24 18 28 20 30 22" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
              </svg>
            </div>
            <span className="hub__card-label">MON EXPERT</span>
            <span className="hub__card-title">Gazon</span>
            <span className="hub__card-sub">Analyse & Soins</span>
            <span className="hub__card-badge">IA</span>
          </button>

          <button className="hub__card hub__card--piscine" onClick={() => onSelect('piscine')}>
            <div className="hub__card-icon hub__card-icon--piscine">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M4 20C6 18 8 16 10 18C12 20 14 18 16 18C18 18 20 20 22 18C24 16 26 18 28 16" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M4 25C6 23 8 21 10 23C12 25 14 23 16 23C18 23 20 25 22 23C24 21 26 23 28 21" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.6"/>
              </svg>
            </div>
            <span className="hub__card-label">MON EXPERT</span>
            <span className="hub__card-title">Piscine</span>
            <span className="hub__card-sub">Traitement & Entretien</span>
            <span className="hub__card-badge">IA</span>
          </button>
        </div>
      </section>
    </div>
  );
}
