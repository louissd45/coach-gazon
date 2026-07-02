import { useState } from 'react';

const PRODUCTS = {
  gazon: [
    { id: 'g1', emoji: '🌿', name: 'Engrais printemps', sub: 'Riche en azote', price: 14.90, gamme: 'Milieu de gamme', lien: '#' },
    { id: 'g2', emoji: '🌿', name: 'Engrais printemps Pro', sub: 'Osmocote longue duree', price: 28.50, gamme: 'Pro', lien: '#' },
    { id: 'g3', emoji: '🍂', name: 'Engrais automne', sub: 'Riche en potasse', price: 13.90, gamme: 'Milieu de gamme', lien: '#' },
    { id: 'g4', emoji: '🍂', name: 'Engrais automne Pro', sub: 'Compo Expert Twin Turf', price: 26.90, gamme: 'Pro', lien: '#' },
    { id: 'g5', emoji: '💧', name: 'Agent mouillant', sub: 'Penetration eau optimale', price: 12.50, gamme: 'Milieu de gamme', lien: '#' },
    { id: 'g6', emoji: '💧', name: 'Agent mouillant Pro', sub: 'Headland Bionex', price: 24.90, gamme: 'Pro', lien: '#' },
    { id: 'g7', emoji: '🦠', name: 'Fongicide gazon', sub: 'Contre maladies fongiques', price: 16.90, gamme: 'Milieu de gamme', lien: '#' },
    { id: 'g8', emoji: '🦠', name: 'Fongicide Pro', sub: 'Bayleton concentration', price: 34.90, gamme: 'Pro', lien: '#' },
    { id: 'g9', emoji: '🌱', name: 'Semences reparation', sub: 'Germination rapide', price: 11.90, gamme: 'Milieu de gamme', lien: '#' },
    { id: 'g10', emoji: '🌱', name: 'Semences Pro', sub: 'Barenbrug Bar Repair', price: 22.90, gamme: 'Pro', lien: '#' },
    { id: 'g11', emoji: '🪴', name: 'Anti-mousse sulfate', sub: 'Elimine la mousse', price: 9.90, gamme: 'Milieu de gamme', lien: '#' },
    { id: 'g12', emoji: '🪴', name: 'Anti-mousse Pro', sub: 'Compo Expert concentre', price: 19.90, gamme: 'Pro', lien: '#' },
  ],
  piscine: [
    { id: 'p1', emoji: '🧪', name: 'Chlore choc', sub: 'Action rapide', price: 9.90, gamme: 'Milieu de gamme', lien: '#' },
    { id: 'p2', emoji: '🧪', name: 'Chlore choc Pro', sub: 'Bayrol Chloriklar', price: 19.90, gamme: 'Pro', lien: '#' },
    { id: 'p3', emoji: '⬆️', name: 'pH Plus', sub: 'Augmente le pH', price: 7.90, gamme: 'Milieu de gamme', lien: '#' },
    { id: 'p4', emoji: '⬆️', name: 'pH Plus Pro', sub: 'Bayrol pH-Plus', price: 14.90, gamme: 'Pro', lien: '#' },
    { id: 'p5', emoji: '⬇️', name: 'pH Moins', sub: 'Baisse le pH', price: 7.90, gamme: 'Milieu de gamme', lien: '#' },
    { id: 'p6', emoji: '⬇️', name: 'pH Moins Pro', sub: 'Bayrol pH-Minus', price: 14.90, gamme: 'Pro', lien: '#' },
    { id: 'p7', emoji: '🟢', name: 'Algicide', sub: 'Prevention des algues', price: 11.90, gamme: 'Milieu de gamme', lien: '#' },
    { id: 'p8', emoji: '🟢', name: 'Algicide Pro', sub: 'Bayrol Super Algicid', price: 22.90, gamme: 'Pro', lien: '#' },
    { id: 'p9', emoji: '📊', name: 'Bandelettes test', sub: '5 parametres', price: 8.90, gamme: 'Milieu de gamme', lien: '#' },
    { id: 'p10', emoji: '📊', name: 'Bandelettes Pro', sub: 'AquaChek 7 en 1', price: 16.90, gamme: 'Pro', lien: '#' },
    { id: 'p11', emoji: '🧂', name: 'Anti-calcaire', sub: 'Contre le tartre', price: 10.90, gamme: 'Milieu de gamme', lien: '#' },
    { id: 'p12', emoji: '🧂', name: 'Anti-calcaire Pro', sub: 'Bayrol Calcinex', price: 21.90, gamme: 'Pro', lien: '#' },
  ],
};

export default function Boutique({ onClose, initialTab = 'gazon' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const allProducts = [...PRODUCTS.gazon, ...PRODUCTS.piscine];

  const toggleCart = (id) => {
    const product = allProducts.find(p => p.id === id);
    setCart(prev => {
      const exists = prev.find(p => p.id === id);
      if (exists) return prev.filter(p => p.id !== id);
      return [...prev, product];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(p => p.id !== id));
  const total = cart.reduce((s, p) => s + p.price, 0);
  const inCart = (id) => cart.some(p => p.id === id);

  if (showCart) {
    return (
      <div className="boutique">
        <div className="boutique__header">
          <button className="fiche-library__back" onClick={() => setShowCart(false)}>← Boutique</button>
          <span className="eyebrow">Mon panier</span>
        </div>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-dim)' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🛒</p>
            <p>Votre panier est vide</p>
            <button className="btn-primary" onClick={() => setShowCart(false)} style={{ marginTop: '1rem', width: '100%' }}>
              Voir les produits
            </button>
          </div>
        ) : (
          <>
            <div style={{ padding: '0 1.5rem' }}>
              {cart.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '1.5rem', width: 36, textAlign: 'center' }}>{p.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{p.name}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-dim)' }}>{p.gamme}</p>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{p.price.toFixed(2)} €</span>
                  <button onClick={() => removeFromCart(p.id)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1.1rem', padding: '0 4px' }}>×</button>
                </div>
              ))}
            </div>

            <div style={{ padding: '1.25rem 1.5rem', borderTop: '2px solid var(--border)', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)' }}>{total.toFixed(2)} €</span>
              </div>
              <button className="btn-primary" style={{ width: '100%', marginBottom: '0.75rem' }}>
                Commander sur Amazon
              </button>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)', textAlign: 'center' }}>
                Liens affilies Amazon — Livraison rapide incluse
              </p>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="boutique">
      <div className="boutique__header">
        <button className="fiche-library__back" onClick={onClose}>← Retour</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="eyebrow">Boutique</span>
          {cart.length > 0 && (
            <button className="boutique__cart-btn" onClick={() => setShowCart(true)}>
              🛒 {cart.length}
            </button>
          )}
        </div>
      </div>

      <div className="boutique__tabs">
        <button className={`boutique__tab ${activeTab === 'gazon' ? 'boutique__tab--active' : ''}`} onClick={() => setActiveTab('gazon')}>
          🌿 Gazon
        </button>
        <button className={`boutique__tab ${activeTab === 'piscine' ? 'boutique__tab--active boutique__tab--piscine' : ''}`} onClick={() => setActiveTab('piscine')}>
          💧 Piscine
        </button>
      </div>

      <div className="boutique__grid">
        {PRODUCTS[activeTab].map(p => (
          <div key={p.id} className="boutique__card">
            <div className="boutique__card-top">
              <span style={{ fontSize: '1.75rem' }}>{p.emoji}</span>
              <span className={`boutique__badge ${p.gamme === 'Pro' ? 'boutique__badge--pro' : ''}`}>{p.gamme}</span>
            </div>
            <p className="boutique__card-name">{p.name}</p>
            <p className="boutique__card-sub">{p.sub}</p>
            <p className="boutique__card-price">{p.price.toFixed(2)} €</p>
            <button
              className={`boutique__add ${inCart(p.id) ? 'boutique__add--added' : ''}`}
              onClick={() => toggleCart(p.id)}
            >
              {inCart(p.id) ? '✓ Dans le panier' : '+ Ajouter'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
