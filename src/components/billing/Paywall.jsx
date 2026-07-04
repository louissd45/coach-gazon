import { useState } from 'react';

const PLANS = [
  {
    id: 'gazon',
    icon: '🌿',
    name: 'Expert Gazon',
    color: '#1b4332',
    colorLight: '#e8f5e9',
    monthlyPrice: 4.99,
    yearlyPrice: 49,
    features: [
      'Diagnostic IA gazon illimite',
      'Fiches maladies et mauvaises herbes',
      'Agenda mensuel personnalise',
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
      'Diagnostic IA piscine illimite',
      'Analyse eau et bandelettes par photo',
      'Doses calculees selon votre volume',
      'Fiches entretien saisonnier',
      'Boutique produits piscine',
    ],
  },
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
      'Satisfait ou rembourse 30 jours',
    ],
  },
];

export default function Paywall({ onSubscribe, loading }) {
  const [billing, setBilling] = useState('yearly');
  const [selected, setSelected] = useState('both');

  const selectedPlan = PLANS.find(p => p.id === selected);
  const price = billing === 'yearly' ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice;
  const period = billing === 'yearly' ? 'an' : 'mois';
  const saving = Math.round((1 - selectedPlan.yearlyPrice / (selectedPlan.monthlyPrice * 12)) * 100);

  return (
    <div className="paywall">
      <span className="eyebrow">Abonnement</span>
      <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Choisissez votre espace</h2>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
        Diagnostic IA, fiches, conseils personnalises
      </p>

      {/* Toggle mensuel / annuel */}
      <div style={{ display: 'flex', background: 'var(--bg-soft)', borderRadius: 980, padding: 4, marginBottom: '1.5rem', gap: 4 }}>
        <button
          onClick={() => setBilling('monthly')}
          style={{ flex: 1, padding: '8px', borderRadius: 980, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, background: billing === 'monthly' ? '#fff' : 'transparent', color: billing === 'monthly' ? 'var(--text)' : 'var(--text-dim)', boxShadow: billing === 'monthly' ? '0 1px 4px rgba(0,0,0,0.12)' : 'none', transition: 'all 0.2s' }}>
          Mensuel
        </button>
        <button
          onClick={() => setBilling('yearly')}
          style={{ flex: 1, padding: '8px', borderRadius: 980, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, background: billing === 'yearly' ? '#fff' : 'transparent', color: billing === 'yearly' ? 'var(--text)' : 'var(--text-dim)', boxShadow: billing === 'yearly' ? '0 1px 4px rgba(0,0,0,0.12)' : 'none', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          Annuel
          <span style={{ background: '#86efac', color: '#0a1f0f', fontSize: '0.65rem', fontWeight: 800, borderRadius: 980, padding: '2px 7px' }}>-18%</span>
        </button>
      </div>

      {/* Plans */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.5rem' }}>
        {PLANS.map(plan => (
          <button
            key={plan.id}
            onClick={() => setSelected(plan.id)}
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
                <span style={{ fontWeight: 900, fontSize: '1.2rem', color: selected === plan.id ? plan.color : 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  {billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}€
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginLeft: 2 }}>/{period}</span>
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

      {/* CTA */}
      <button
        className="btn-primary"
        onClick={() => onSubscribe(selected, billing)}
        disabled={loading}
        style={{ width: '100%', fontSize: '1rem', padding: '1rem', marginBottom: '0.75rem' }}>
        {loading ? 'Redirection...' : `S'abonner — ${price}€/${period}`}
      </button>

      {billing === 'yearly' && (
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
          Economisez {saving}% par rapport au mensuel
        </p>
      )}

      <p className="paywall__hint" style={{ textAlign: 'center' }}>
        Paiement securise par Stripe · Satisfait ou rembourse 30 jours
      </p>

      <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-soft)', borderRadius: 12, fontSize: '0.72rem', color: 'var(--text-dim)', textAlign: 'center', lineHeight: 1.6 }}>
        En vous abonnant vous acceptez nos <strong>CGV</strong> et notre <strong>Politique de confidentialite</strong>.
        Les diagnostics IA sont fournis a titre indicatif uniquement.
      </div>
    </div>
  );
}
