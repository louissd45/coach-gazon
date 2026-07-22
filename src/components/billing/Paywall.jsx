import { useState } from 'react';

const PLANS = [
  {
    id: 'both',
    icon: '⭐',
    name: 'Gazon + Piscine',
    color: '#1a1a1a',
    colorLight: '#f5f5f3',
    monthlyPrice: 7.99,
    yearlyPrice: 79,
    badge: 'Meilleure offre',
    features: [
      'Expert Gazon IA inclus',
      'Expert Piscine IA inclus',
      '50+ fiches techniques',
      'Agenda et boutique complets',
      'Satisfait ou remboursé 30 jours',
    ],
  },
  {
    id: 'gazon',
    icon: '🌿',
    name: 'Expert Gazon',
    color: '#1b4332',
    colorLight: '#e8f5e9',
    monthlyPrice: 4.99,
    yearlyPrice: 49,
    features: [
      'Diagnostic IA gazon illimité',
      'Fiches maladies et mauvaises herbes',
      'Agenda mensuel personnalisé',
      'Historique des diagnostics',
      'Boutique produits gazon',
    ],
  },
  {
    id: 'piscine',
    icon: '💧',
    name: 'Expert Piscine',
    color: '#1a5276',
    colorLight: '#e3f2fd',
    monthlyPrice: 3.99,
    yearlyPrice: 39,
    features: [
      'Diagnostic IA piscine illimité',
      'Analyse eau et bandelettes par photo',
      'Doses calculées selon votre volume',
      'Fiches entretien saisonnier',
      'Boutique produits piscine',
    ],
  },
];

export default function Paywall({ onSubscribe, loading }) {
  const [selected, setSelected] = useState('both');
  const [showMonthly, setShowMonthly] = useState(false);

  const selectedPlan = PLANS.find(p => p.id === selected);

  return (
    <div className="paywall">
      <span className="eyebrow">Abonnement</span>
      <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Choisissez votre espace</h2>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
        Diagnostic IA, fiches, conseils personnalisés et programme hebdomadaire
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.5rem' }}>
        {PLANS.map(plan => (
          <button key={plan.id} onClick={() => setSelected(plan.id)}
            style={{
              background: selected === plan.id ? plan.colorLight : 'var(--surface)',
              border: selected === plan.id ? `2px solid ${plan.color}` : '1.5px solid var(--border)',
              borderRadius: 16, padding: '1rem 1.1rem',
              cursor: 'pointer', textAlign: 'left',
              fontFamily: 'var(--font-body)', transition: 'all 0.2s',
              position: 'relative',
            }}>
            {plan.badge && (
              <span style={{ position: 'absolute', top: -10, right: 14, background: plan.color, color: '#fff', fontSize: '0.65rem', fontWeight: 800, borderRadius: 980, padding: '3px 10px' }}>
                {plan.badge}
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.3rem' }}>{plan.icon}</span>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: selected === plan.id ? plan.color : 'var(--text)', fontFamily: 'var(--font-display)' }}>{plan.name}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: 900, fontSize: '1.3rem', color: selected === plan.id ? plan.color : 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  {plan.yearlyPrice}€
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginLeft: 2 }}>/an</span>
              </div>
            </div>
            <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {plan.features.map((f, i) => (
                <li key={i} style={{ fontSize: '0.78rem', color: selected === plan.id ? plan.color : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>✓</span> {f}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <button className="btn-primary" onClick={() => onSubscribe(selected, 'yearly')} disabled={loading}
        style={{ width: '100%', fontSize: '1rem', padding: '1rem', marginBottom: '0.75rem' }}>
        {loading ? 'Redirection...' : `S'abonner — ${selectedPlan.yearlyPrice}€/an`}
      </button>

      <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
        <button onClick={() => setShowMonthly(!showMonthly)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--text-dim)', textDecoration: 'underline', fontFamily: 'var(--font-body)' }}>
          {showMonthly ? 'Masquer' : `Voir l'option mensuelle (${selectedPlan.monthlyPrice}€/mois)`}
        </button>
        {showMonthly && (
          <button onClick={() => onSubscribe(selected, 'monthly')} disabled={loading}
            style={{ display: 'block', width: '100%', marginTop: 8, padding: '0.75rem', borderRadius: 12, border: '1.5px solid var(--border)', background: 'var(--surface)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text)' }}>
            {loading ? 'Redirection...' : `Continuer en mensuel — ${selectedPlan.monthlyPrice}€/mois`}
          </button>
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: '0 0 4px' }}>
          💡 L'annuel vous économise {Math.round((1 - selectedPlan.yearlyPrice / (selectedPlan.monthlyPrice * 12)) * 100)}% — sans surprise en fin d'année
        </p>
        <p className="paywall__hint" style={{ margin: 0 }}>
          Paiement sécurisé par Stripe · Satisfait ou remboursé 30 jours
        </p>
      </div>

      <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-soft)', borderRadius: 12, fontSize: '0.72rem', color: 'var(--text-dim)', textAlign: 'center', lineHeight: 1.6 }}>
        En vous abonnant vous acceptez nos <strong>CGV</strong> et notre <strong>Politique de confidentialité</strong>.
        Les diagnostics IA sont fournis à titre indicatif uniquement.
      </div>
    </div>
  );
}
