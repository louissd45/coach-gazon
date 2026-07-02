import BrandLogo from '../common/BrandLogo';

export default function Hub({ onSelect, onSignOut, user }) {
  return (
    <div className="hub">
      <header className="hub__header">
        <BrandLogo size={26} />
        <button onClick={onSignOut} className="hub__signout">Deconnexion</button>
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
