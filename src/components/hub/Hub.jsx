export default function Hub({ onSelect, onSignOut }) {
  return (
    <div className="hub">
      <header className="hub__header">
        <span className="hub__brand">Mon Coach Extérieur</span>
        <button onClick={onSignOut}>Déconnexion</button>
      </header>

      <section className="hub__hero">
        <div className="hub__hero-content">
          <span className="hub__hero-eyebrow">Mon Coach Extérieur</span>
          <h1 className="hub__title">L'expertise terrain,<br />dans votre poche.</h1>
          <p className="hub__hero-sub">
            Diagnostic intelligent, conseils personnalisés et suivi continu
            pour chaque espace extérieur de votre quotidien.
          </p>
        </div>
      </section>

      <section className="hub__section">
        <span className="eyebrow">Choisissez votre espace</span>
        <div className="hub__cards">
          <button className="hub__card" onClick={() => onSelect('gazon')}>
            <span className="hub__card-icon" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                <path
                  d="M16 28C16 28 7 23 7 13.5C7 8 11 4 16 4C21 4 25 8 25 13.5C25 23 16 28 16 28Z"
                  stroke="var(--accent)"
                  strokeWidth="1.4"
                />
                <path
                  d="M16 28C16 22 16 16 16 13C16 9.5 13 6 9.5 5"
                  stroke="var(--accent)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="hub__card-title">Coach Gazon</span>
            <span className="hub__card-desc">
              Diagnostic photo, fiches maladies et entretien, rappels SMS
              personnalisés selon la météo de votre ville.
            </span>
            <span className="hub__card-status hub__card-status--active">Disponible</span>
          </button>

          <button
            className="hub__card hub__card--soon"
            onClick={() => onSelect('piscine')}
          >
            <span className="hub__card-icon" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                <path
                  d="M4 22c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2"
                  stroke="var(--accent)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <path
                  d="M4 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2"
                  stroke="var(--accent)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </svg>
            </span>
            <span className="hub__card-title">Coach Piscine</span>
            <span className="hub__card-desc">
              Analyse de l'eau, équilibre chimique et entretien saisonnier
              de votre bassin.
            </span>
            <span className="hub__card-status">Bientôt disponible</span>
          </button>
        </div>
      </section>
    </div>
  );
}
