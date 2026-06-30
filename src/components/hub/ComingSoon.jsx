export default function ComingSoon({ title, description, onBack }) {
  return (
    <div className="coming-soon">
      <button className="fiche-library__back" onClick={onBack}>
        ← Retour à l'accueil
      </button>
      <span className="eyebrow">Bientôt disponible</span>
      <h2>{title}</h2>
      <p className="coming-soon__text">{description}</p>
      <div className="gold-divider">
        <span className="gold-divider__mark" />
      </div>
      <p className="coming-soon__hint">
        Vous serez prévenu dès l'ouverture de cet espace.
      </p>
    </div>
  );
}
