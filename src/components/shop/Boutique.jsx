import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

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

// Calcule les items et prix du pack gazon selon la surface
function buildGazonPacks(surface) {
  const s = surface || 0;
  let label = '';
  let coeff = 1;

  if (s <= 0) { label = 'Surface non renseignee'; coeff = 1; }
  else if (s < 100) { label = `Adapte pour ${s}m² (petite pelouse)`; coeff = 1; }
  else if (s < 300) { label = `Adapte pour ${s}m² (pelouse moyenne)`; coeff = 1.8; }
  else if (s < 600) { label = `Adapte pour ${s}m² (grande pelouse)`; coeff = 2.8; }
  else { label = `Adapte pour ${s}m² (tres grande pelouse)`; coeff = 4; }

  const baseMid = 69.90;
  const basePro = 139.90;

  return [
    {
      id: 'pack-gazon-mid',
      gamme: 'Milieu de gamme',
      name: 'Mon Annee Gazon',
      label,
      desc: surface ? `Pack dimensionne pour ${s}m² de pelouse` : 'Renseignez votre surface dans le profil pour personnaliser les quantites',
      price: Math.round(baseMid * coeff * 10) / 10,
      priceOriginal: Math.round(baseMid * coeff * 1.15 * 10) / 10,
      color: '#1b4332',
      colorLight: '#e8f5e9',
      items: [
        `🌿 Engrais printemps — ${s > 0 ? `${Math.round(30 * s / 1000 * 10) / 10}kg` : 'quantite standard'}`,
        `🍂 Engrais automne — ${s > 0 ? `${Math.round(25 * s / 1000 * 10) / 10}kg` : 'quantite standard'}`,
        `💧 Agent mouillant — ${s > 0 ? `${Math.round(10 * s / 1000 * 10) / 10}L` : 'quantite standard'}`,
        '🦠 Fongicide preventif (1 traitement)',
        `🌱 Semences reparation — ${s > 0 ? `${Math.round(30 * s / 1000 * 10) / 10}kg` : 'quantite standard'}`,
        '🪴 Anti-mousse sulfate (1 traitement)',
      ],
    },
    {
      id: 'pack-gazon-pro',
      gamme: 'Pro',
      name: 'Mon Annee Gazon Pro',
      label,
      desc: surface ? `Pack Pro dimensionne pour ${s}m² de pelouse` : 'Renseignez votre surface dans le profil pour personnaliser les quantites',
      price: Math.round(basePro * coeff * 10) / 10,
      priceOriginal: Math.round(basePro * coeff * 1.12 * 10) / 10,
      color: '#1a3a6b',
      colorLight: '#e3f2fd',
      items: [
        `🌿 Osmocote printemps — ${s > 0 ? `${Math.round(35 * s / 1000 * 10) / 10}kg` : 'quantite standard'}`,
        `🍂 Twin Turf automne — ${s > 0 ? `${Math.round(30 * s / 1000 * 10) / 10}kg` : 'quantite standard'}`,
        `💧 Bionex agent mouillant — ${s > 0 ? `${Math.round(8 * s / 1000 * 10) / 10}L` : 'quantite standard'}`,
        '🦠 Bayleton fongicide Pro (2 traitements)',
        `🌱 Barenbrug semences Pro — ${s > 0 ? `${Math.round(35 * s / 1000 * 10) / 10}kg` : 'quantite standard'}`,
        '🪴 Compo Expert anti-mousse (2 traitements)',
      ],
    },
  ];
}

// Calcule les items et prix du pack piscine selon le volume en litres
function buildPiscinePacks(volumeL) {
  const v = volumeL || 0;
  const vm3 = Math.round(v / 1000);
  let label = '';
  let coeff = 1;

  if (v <= 0) { label = 'Volume non renseigne'; coeff = 1; }
  else if (v < 20000) { label = `Adapte pour votre piscine de ${v.toLocaleString()}L (${vm3}m³)`; coeff = 0.7; }
  else if (v < 50000) { label = `Adapte pour votre piscine de ${v.toLocaleString()}L (${vm3}m³)`; coeff = 1; }
  else if (v < 100000) { label = `Adapte pour votre piscine de ${v.toLocaleString()}L (${vm3}m³)`; coeff = 1.8; }
  else { label = `Adapte pour votre piscine de ${v.toLocaleString()}L (${vm3}m³)`; coeff = 2.8; }

  const baseMid = 54.90;
  const basePro = 109.90;

  // Doses chlore : 10g/m³ par traitement, ~12 traitements/an
  const chloreKg = v > 0 ? Math.round(10 * vm3 * 12 / 1000 * 10) / 10 : null;
  // pH : 10g/m³ par correction, ~6 corrections/an
  const phKg = v > 0 ? Math.round(10 * vm3 * 6 / 1000 * 10) / 10 : null;
  // Algicide : 0.5L/100m³ par semaine, 20 semaines
  const algicideL = v > 0 ? Math.round(0.5 * vm3 / 100 * 20 * 10) / 10 : null;

  return [
    {
      id: 'pack-piscine-mid',
      gamme: 'Milieu de gamme',
      name: 'Mon Annee Piscine',
      label,
      desc: v > 0 ? `Pack dimensionne pour ${v.toLocaleString()} litres` : 'Renseignez le volume dans le profil piscine pour personnaliser',
      price: Math.round(baseMid * coeff * 10) / 10,
      priceOriginal: Math.round(baseMid * coeff * 1.18 * 10) / 10,
      color: '#1a5276',
      colorLight: '#e3f2fd',
      items: [
        `🧪 Chlore choc — ${chloreKg ? `${chloreKg}kg pour la saison` : 'quantite standard'}`,
        `⬆️ pH Plus — ${phKg ? `${phKg}kg` : 'quantite standard'}`,
        `⬇️ pH Moins — ${phKg ? `${phKg}kg` : 'quantite standard'}`,
        `🟢 Algicide — ${algicideL ? `${algicideL}L` : 'quantite standard'}`,
        '📊 Bandelettes test 5 en 1 (x50)',
        '🧂 Anti-calcaire saison complete',
      ],
    },
    {
      id: 'pack-piscine-pro',
      gamme: 'Pro',
      name: 'Mon Annee Piscine Pro',
      label,
      desc: v > 0 ? `Pack Pro Bayrol dimensionne pour ${v.toLocaleString()} litres` : 'Renseignez le volume dans le profil piscine pour personnaliser',
      price: Math.round(basePro * coeff * 10) / 10,
      priceOriginal: Math.round(basePro * coeff * 1.15 * 10) / 10,
      color: '#0d3b6e',
      colorLight: '#dce8f8',
      items: [
        `🧪 Bayrol Chloriklar — ${chloreKg ? `${chloreKg}kg` : 'quantite standard'}`,
        `⬆️ Bayrol pH-Plus — ${phKg ? `${phKg}kg` : 'quantite standard'}`,
        `⬇️ Bayrol pH-Minus — ${phKg ? `${phKg}kg` : 'quantite standard'}`,
        `🟢 Bayrol Super Algicid — ${algicideL ? `${algicideL}L` : 'quantite standard'}`,
        '📊 AquaChek 7 en 1 (x50)',
        '🧂 Bayrol Calcinex Pro saison',
      ],
    },
  ];
}

export default function Boutique({ onClose, initialTab = 'gazon', userId }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeSection, setActiveSection] = useState('packs');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [surface, setSurface] = useState(null);
  const [volumeL, setVolumeL] = useState(null);
  const [profilLoaded, setProfilLoaded] = useState(false);

  useEffect(() => {
    if (!userId) { setProfilLoaded(true); return; }
    supabase.from('users_profile')
      .select('surface_m2, piscine_volume_m3')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setSurface(data.surface_m2 || null);
          setVolumeL(data.piscine_volume_m3 || null);
        }
        setProfilLoaded(true);
      });
  }, [userId]);

  const gazonPacks = buildGazonPacks(surface);
  const piscinePacks = buildPiscinePacks(volumeL);
  const allPacks = [...gazonPacks, ...piscinePacks];
  const allProducts = [...PRODUCTS.gazon, ...PRODUCTS.piscine];

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

  const currentPacks = activeTab === 'gazon' ? gazonPacks : piscinePacks;

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

      <div className="boutique__tabs">
        <button className={`boutique__tab ${activeTab === 'gazon' ? 'boutique__tab--active' : ''}`} onClick={() => setActiveTab('gazon')}>🌿 Gazon</button>
        <button className={`boutique__tab ${activeTab === 'piscine' ? 'boutique__tab--active boutique__tab--piscine' : ''}`} onClick={() => setActiveTab('piscine')}>💧 Piscine</button>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '1.25rem' }}>
        <button onClick={() => setActiveSection('packs')}
          style={{ flex: 1, padding: '8px', borderRadius: '10px', border: `1px solid ${activeSection === 'packs' ? 'var(--accent)' : 'var(--border)'}`, background: activeSection === 'packs' ? 'var(--accent-soft)' : 'var(--surface)', color: activeSection === 'packs' ? 'var(--accent)' : 'var(--text-dim)', fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
          📦 Packs annuels
        </button>
        <button onClick={() => setActiveSection('produits')}
          style={{ flex: 1, padding: '8px', borderRadius: '10px', border: `1px solid ${activeSection === 'produits' ? 'var(--accent)' : 'var(--border)'}`, background: activeSection === 'produits' ? 'var(--accent-soft)' : 'var(--surface)', color: activeSection === 'produits' ? 'var(--accent)' : 'var(--text-dim)', fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
          🧴 Produits
        </button>
      </div>

      {activeSection === 'packs' && !profilLoaded && (
        <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>Chargement de votre profil...</p>
      )}

      {activeSection === 'packs' && profilLoaded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {currentPacks.map(pack => (
            <div key={pack.id} style={{ background: pack.colorLight, border: `1.5px solid ${pack.color}22`, borderRadius: '20px', padding: '1.25rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ flex: 1, marginRight: '0.75rem' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: pack.color, opacity: 0.8 }}>Pack annuel — {pack.gamme}</span>
                  <p style={{ margin: '0.2rem 0 0.15rem', fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: pack.color }}>📦 {pack.name}</p>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: pack.color, opacity: 0.75, fontStyle: 'italic' }}>✓ {pack.label}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: pack.color, opacity: 0.6, textDecoration: 'line-through' }}>{pack.priceOriginal.toFixed(2)} €</p>
                  <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: pack.color }}>{pack.price.toFixed(2)} €</p>
                </div>
              </div>
              <p style={{ margin: '0.5rem 0 0.75rem', fontSize: '0.8rem', color: pack.color, opacity: 0.75 }}>{pack.desc}</p>
              <ul style={{ margin: '0 0 1rem', paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {pack.items.map((item, i) => (
                  <li key={i} style={{ fontSize: '0.82rem', color: pack.color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ opacity: 0.5 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, background: pack.color + '22', color: pack.color, borderRadius: '980px', padding: '3px 10px' }}>
                  Economisez {(pack.priceOriginal - pack.price).toFixed(2)} €
                </span>
                <button onClick={() => togglePack(pack.id)}
                  style={{ padding: '8px 16px', borderRadius: '10px', border: `1.5px solid ${pack.color}`, background: inCart(pack.id) ? pack.color : 'transparent', color: inCart(pack.id) ? 'white' : pack.color, fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                  {inCart(pack.id) ? '✓ Dans le panier' : '+ Ajouter au panier'}
                </button>
              </div>
            </div>
          ))}
          {(activeTab === 'gazon' && !surface) && (
            <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-dim)', padding: '0.5rem 0' }}>
              Renseignez votre surface dans Mon profil pour personnaliser les quantites
            </p>
          )}
          {(activeTab === 'piscine' && !volumeL) && (
            <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-dim)', padding: '0.5rem 0' }}>
              Renseignez le volume dans Profil piscine pour personnaliser les quantites
            </p>
          )}
        </div>
      )}

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
