export default function Hub({ onSelect, onSignOut }) {
  return (
    <div className="hub">
      <header className="hub__header">
        <span className="hub__brand">Mon Coach Extérieur</span>
        <button onClick={onSignOut}>Déconnexion</button>
      </header>

      <span className="eyebrow" style={{ textAlign: 'center', display: 'block' }}>
        Choisissez votre espace
      </span>
      <h2 className="hub__title">Mon Coach Extérieur</h2>

      <div className="hub__cards">
        <button className="hub__card" onClick={() => onSelect('gazon')}>
          <span className="hub__card-icon" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 28C16 28 7 23 7 13.5C7 8 11 4 16 4C21 4 25 8 25 13.5C25 23 16 28 16 28Z"
                stroke="var(--accent)"
                strokeWidth="1.2"
              />
              <path
                d="M16 28C16 22 16 16 16 13C16 9.5 13 6 9.5 5"
                stroke="var(--accent)"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="hub__card-title">Coach Gazon</span>
          <span className="hub__card-desc">
            Diagnostic photo, fiches maladies et entretien, rappels SMS
          </span>
          <span className="hub__card-status hub__card-status--active">Disponible</span>
        </button>

        <button
          className="hub__card hub__card--soon"
          onClick={() => onSelect('piscine')}
        >
          <span className="hub__card-icon" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
              <path
                d="M4 22c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2"
                stroke="var(--accent)"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <path
                d="M4 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2"
                stroke="var(--accent)"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="hub__card-title">Coach Piscine</span>
          <span className="hub__card-desc">
            Analyse de l'eau, équilibre chimique, entretien saisonnier
          </span>
          <span className="hub__card-status">Bientôt disponible</span>
        </button>
      </div>
    </div>
  );
}
