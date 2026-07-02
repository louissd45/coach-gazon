import { useState } from 'react';

const PRODUCTS = {
  gazon: [
    { id: 'g1', emoji: '🌿', name: 'Engrais printemps', sub: 'Riche en azote', price: 14.90, gamme: 'Milieu de gamme' },
    { id: 'g2', emoji: '🌿', name: 'Engrais printemps Pro', sub: 'Osmocote longue duree', price: 28.50, gamme: 'Pro' },
    { id: 'g3', emoji: '🍂', name: 'Engrais automne', sub: 'Riche en potasse', price: 13.90, gamme: 'Milieu de gamme' },
    { id: 'g4', emoji: '🍂', name: 'Engrais automne Pro', sub: 'Compo Expert Twin Turf', price: 26.90, gamme: 'Pro' },
    { id: 'g5', emoji: '💧', name: 'Agent mouillant', sub: 'Penetration eau optimale', price: 12.50, gamme: 'Milieu de gamme' },
    { id: 'g6', emoji: '💧', name: 'Agent mouillant Pro', sub: 'Headland Bionex', price: 24.90, gamme: 'Pro' },
    { id: 'g7', emoji: '🦠', name: 'Fongicide gazon', sub: 'Contre maladies fongiques', price: 16.90, gamme: 'Milieu de gamme' },
    { id: 'g8', emoji: '🦠', name: 'Fongicide Pro', sub: 'Bayleton concentration', price: 34.90, gamme: 'Pro' },
    { id: 'g9', emoji: '🌱', name: 'Semences reparation', sub: 'Germination rapide', price: 11.90, gamme: 'Milieu de gamme' },
    { id: 'g10', emoji: '🌱', name: 'Semences Pro', sub: 'Barenbrug Bar Repair', price: 22.90, gamme: 'Pro' },
    { id: 'g11', emoji: '🪴', name: 'Anti-mousse sulfate', sub: 'Elimine la mousse', price: 9.90, gamme: 'Milieu de gamme' },
    { id: 'g12', emoji: '🪴', name: 'Anti-mousse Pro', sub: 'Compo Expert concentre', price: 19.90, gamme: 'Pro' },
  ],
  piscine: [
    { id: 'p1', emoji: '🧪', name: 'Chlore choc', sub: 'Action rapide', price: 9.90, gamme: 'Milieu de gamme' },
    { id: 'p2', emoji: '🧪', name: 'Chlore choc Pro', sub: 'Bayrol Chloriklar', price: 19.90, gamme: 'Pro' },
    { id: 'p3', emoji: '⬆️', name: 'pH Plus', sub: 'Augmente le pH', price: 7.90, gamme: 'Milieu de gamme' },
    { id: 'p4', emoji: '⬆️', name: 'pH Plus Pro', sub: 'Bayrol pH-Plus', price: 14.90, gamme: 'Pro' },
    { id: 'p5', emoji: '⬇️', name: 'pH Moins', sub: 'Baisse le pH', price: 7.90, gamme: 'Milieu de gamme' },
    { id: 'p6', emoji: '⬇️', name: 'pH Moins Pro', sub: 'Bayrol pH-Minus', price: 14.90, gamme: 'Pro' },
    { id: 'p7', emoji: '🟢', name: 'Algicide', sub: 'Prevention des algues', price: 11.90, gamme: 'Milieu de gamme' },
    { id: 'p8', emoji: '🟢', name: 'Algicide Pro', sub: 'Bayrol Super Algicid', price: 22.90, gamme: 'Pro' },
    { id: 'p9', emoji: '📊', name: 'Bandelettes test', sub: '5 parametres', price: 8.90, gamme: 'Milieu de gamme' },
    { id: 'p10', emoji: '📊', name: 'Bandelettes Pro', sub: 'AquaChek 7 en 1', price: 16.90, gamme: 'Pro' },
    { id: 'p11', emoji: '🧂', name: 'Anti-calcaire', sub: 'Contre le tartre', price: 10.90, gamme: 'Milieu de gamme' },
    { id: 'p12', emoji: '🧂', name: 'Anti-calcaire Pro', sub: 'Bayrol Calcinex', price: 21.90, gamme: 'Pro' },
  ],
};

const PACKS = {
  gazon: [
    {
      id: 'pack-gazon-mid',
      gamme: 'Milieu de gamme',
      name: 'Mon Annee Gazon',
      desc: 'Tout le necessaire pour une pelouse saine toute annee',
      price: 69.90,
      priceOriginal: 79.50,
      color: '#1b4332',
      colorLight: '#e8f5e9',
      items: [
        '🌿 Engrais printemps (azote)',
        '🍂 Engrais automne (potasse)',
        '💧 Agent mouillant ete',
        '🦠 Fongicide preventif',
        '🌱 Semences reparation',
        '🪴 Anti-mousse sulfate',
      ],
    },
    {
      id: 'pack-gazon-pro',
      gamme: 'Pro',
      name: 'Mon Annee Gazon Pro',
      desc: 'Gamme professionnelle pour un gazon parfait en toutes saisons',
      price: 139.90,
      priceOriginal: 157.00,
      color: '#1a3a6b',
      colorLight: '#e3f2fd',
      items: [
        '🌿 Engrais printemps Pro (Osmocote)',
        '🍂 Engrais automne Pro (Twin Turf)',
        '💧 Agent mouillant Pro (Bionex)',
        '🦠 Fongicide Pro (Bayleton)',
        '🌱 Semences Pro (Barenbrug)',
        '🪴 Anti-mousse Pro concentre',
      ],
    },
  ],
  piscine: [
    {
      id: 'pack-piscine-mid',
      gamme: 'Milieu de gamme',
      name: 'Mon Annee Piscine',
      desc: 'Kit complet ouverture, saison et hivernage pour votre piscine',
      price: 54.90,
      priceOriginal: 65.40,
      color: '#1a5276',
      colorLight: '#e3f2fd',
      items: [
        '🧪 Chlore choc x2 (ouverture + saison)',
        '⬆️ pH Plus',
        '⬇️ pH Moins',
        '🟢 Algicide preventif',
        '📊 Bandelettes test 5 en 1',
        '🧂 Anti-calcaire saison',
      ],
    },
    {
      id: 'pack-piscine-pro',
      gamme: 'Pro',
      name: 'Mon Annee Piscine Pro',
      desc: 'Gamme Bayrol professionnelle pour une eau toujours parfaite',
      price: 109.90,
      priceOriginal: 131.30,
      color: '#0d3b6e',
      colorLight: '#dce8f8',
      items: [
        '🧪 Bayrol Chloriklar x2',
        '⬆️ Bayrol pH-Plus',
        '⬇️ Bayrol pH-Minus',
        '🟢 Bayrol Super Algicid',
        '📊 AquaChek 7 en 1',
        '🧂 Bayrol Calcinex Pro',
      ],
    },
  ],
};

export default function Boutique({ onClose, initialTab = 'gazon' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeSection, setActiveSection] = useState('produits');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const allProducts = [...PRODUCTS.gazon, ...PRODUCTS.piscine];
  const allPacks = [...PACKS.gazon, ...PACKS.piscine];

  const toggleProduct = (id) => {
    const product = allProducts.find(p => p.id === id);
    setCart(prev => prev.find(p => p.id === id) ? prev.filter(p => p.id !== id) : [...prev, product]);
  };

  const togglePack = (id) => {
    const pack = allPacks.find(p => p.id === id);
    const item = { ...pack, emoji: '📦', sub: pack.gamme };
    setCart(prev => prev.find(p => p.id === id) ? prev.filter(p => p.id !== id) : [...prev, item]);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(p => p.id !== id));
  const inCart = (id) => cart.some(p => p.id === id);
  const total = cart.reduce((s, p) => s + p.price, 0);

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
            <button className="btn-primary" onClick={() => setShowCart(false)} style={{ marginTop: '1rem', width: '100%' }}>Voir les produits</button>
          </div>
        ) : (
          <>
            <div style={{ padding: '0 1.5rem' }}>
              {cart.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '1.5rem', width: 36, textAlign: 'center' }}>{p.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{p.name}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-dim)' }}>{p.sub}</p>
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
              <button className="btn-primary" style={{ width: '100%', marginBottom: '0.75rem' }}>Commander sur Amazon</button>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)', textAlign: 'center' }}>Liens affilies Amazon — Livraison rapide incluse</p>
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
            <button className="boutique__cart-btn" onClick={() => setShowCart(true)}>🛒 {cart.length}</button>
          )}
        </div>
      </div>

      {/* Onglets Gazon / Piscine */}
      <div className="boutique__tabs">
        <button className={`boutique__tab ${activeTab === 'gazon' ? 'boutique__tab--active' : ''}`} onClick={() => setActiveTab('gazon')}>🌿 Gazon</button>
        <button className={`boutique__tab ${activeTab === 'piscine' ? 'boutique__tab--active boutique__tab--piscine' : ''}`} onClick={() => setActiveTab('piscine')}>💧 Piscine</button>
      </div>

      {/* Sections Packs / Produits */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1.25rem' }}>
        <button
          onClick={() => setActiveSection('packs')}
          style={{ flex: 1, padding: '8px', borderRadius: '10px', border: `1px solid ${activeSection === 'packs' ? 'var(--accent)' : 'var(--border)'}`, background: activeSection === 'packs' ? 'var(--accent-soft)' : 'var(--surface)', color: activeSection === 'packs' ? 'var(--accent)' : 'var(--text-dim)', fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
          📦 Packs annuels
        </button>
        <button
          onClick={() => setActiveSection('produits')}
          style={{ flex: 1, padding: '8px', borderRadius: '10px', border: `1px solid ${activeSection === 'produits' ? 'var(--accent)' : 'var(--border)'}`, background: activeSection === 'produits' ? 'var(--accent-soft)' : 'var(--surface)', color: activeSection === 'produits' ? 'var(--accent)' : 'var(--text-dim)', fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
          🧴 Produits
        </button>
      </div>

      {/* Packs annuels */}
      {activeSection === 'packs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {PACKS[activeTab].map(pack => (
            <div key={pack.id} style={{ background: pack.colorLight, border: `1.5px solid ${pack.color}22`, borderRadius: '20px', padding: '1.25rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: pack.color, opacity: 0.8 }}>Pack annuel — {pack.gamme}</span>
                  <p style={{ margin: '0.2rem 0 0', fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, color: pack.color }}>📦 {pack.name}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: pack.color, opacity: 0.6, textDecoration: 'line-through' }}>{pack.priceOriginal.toFixed(2)} €</p>
                  <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: pack.color }}>{pack.price.toFixed(2)} €</p>
                </div>
              </div>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: pack.color, opacity: 0.75 }}>{pack.desc}</p>
              <ul style={{ margin: '0 0 1rem', paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {pack.items.map((item, i) => (
                  <li key={i} style={{ fontSize: '0.82rem', color: pack.color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ opacity: 0.5 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, background: pack.color + '22', color: pack.color, borderRadius: '980px', padding: '3px 10px' }}>
                  Economisez {(pack.priceOriginal - pack.price).toFixed(2)} €
                </span>
                <button
                  onClick={() => togglePack(pack.id)}
                  style={{ padding: '8px 16px', borderRadius: '10px', border: `1.5px solid ${pack.color}`, background: inCart(pack.id) ? pack.color : 'transparent', color: inCart(pack.id) ? 'white' : pack.color, fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                  {inCart(pack.id) ? '✓ Dans le panier' : '+ Ajouter au panier'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Produits individuels */}
      {activeSection === 'produits' && (
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
              <button className={`boutique__add ${inCart(p.id) ? 'boutique__add--added' : ''}`} onClick={() => toggleProduct(p.id)}>
                {inCart(p.id) ? '✓ Dans le panier' : '+ Ajouter'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
