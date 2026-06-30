export default function Paywall({ onSubscribe, loading }) {
  return (
    <div className="paywall">
      <h2>Débloquez Coach Gazon</h2>
      <p className="paywall__price">
        49€ <span>/ an</span>
      </p>
      <ul className="paywall__features">
        <li>Diagnostics illimités par photo</li>
        <li>Historique complet de votre pelouse</li>
        <li>Rappels SMS personnalisés (engrais, canicule)</li>
      </ul>
      <button className="btn-primary" onClick={onSubscribe} disabled={loading}>
        {loading ? 'Redirection...' : "S'abonner — 49€/an"}
      </button>
      <p className="paywall__hint">
        Paiement sécurisé par Stripe. Annulable à tout moment.
      </p>
    </div>
  );
}
