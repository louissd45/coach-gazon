import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

const STEPS = ['identite', 'espaces', 'gazon', 'piscine', 'notifications'];

export default function Onboarding({ userId, onComplete }) {
  const [step, setStep] = useState('identite');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Identité
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [city, setCity] = useState('');

  // Espaces
  const [hasGazon, setHasGazon] = useState(false);
  const [hasPiscine, setHasPiscine] = useState(false);

  // Gazon
  const [surfaceM2, setSurfaceM2] = useState('');
  const [typeSol, setTypeSol] = useState('inconnu');
  const [typeGazon, setTypeGazon] = useState('inconnu');
  const [arrosageAuto, setArrosageAuto] = useState(false);

  // Piscine
  const [formeBassin, setFormeBassin] = useState('rectangulaire');
  const [longueur, setLongueur] = useState('');
  const [largeur, setLargeur] = useState('');
  const [profondeur, setProfondeur] = useState('');
  const [diametre, setDiametre] = useState('');
  const [volumeM3, setVolumeM3] = useState('');
  const [typeTraitement, setTypeTraitement] = useState('chlore');
  const [typeBassin, setTypeBassin] = useState('enterree');
  const [typeFiltre, setTypeFiltre] = useState('sable');

  const inputStyle = { width: '100%', padding: '0.85rem', borderRadius: 12, border: '1.5px solid var(--border)', background: 'var(--bg-soft)', fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text)', marginBottom: '1rem', boxSizing: 'border-box' };
  const selectStyle = { ...inputStyle, cursor: 'pointer' };
  const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' };

  const calcVolume = (f, l, la, p, d) => {
    if (f === 'rectangulaire' && l && la && p) return Math.round(parseFloat(l) * parseFloat(la) * parseFloat(p) * 1000);
    if (f === 'ronde' && d && p) { const r = parseFloat(d)/2; return Math.round(Math.PI * r * r * parseFloat(p) * 1000); }
    if (f === 'ovale' && l && la && p) return Math.round(Math.PI * (parseFloat(l)/2) * (parseFloat(la)/2) * parseFloat(p) * 1000);
    return '';
  };

  const handleNext = async () => {
    setError(null);

    if (step === 'identite') {
      if (!prenom.trim() || !nom.trim() || !city.trim()) { setError('Veuillez remplir tous les champs.'); return; }
      if (!hasGazon && !hasPiscine) { setStep('espaces'); return; }
      setStep('espaces');
    } else if (step === 'espaces') {
      if (!hasGazon && !hasPiscine) { setError('Sélectionnez au moins un espace.'); return; }
      if (hasGazon) setStep('gazon');
      else setStep('piscine');
    } else if (step === 'gazon') {
      if (hasPiscine) setStep('piscine');
      else await saveAndFinish();
    } else if (step === 'piscine') {
      await saveAndFinish();
    }
  };

  const saveAndFinish = async () => {
    setSaving(true);
    try {
      let latitude = null, longitude = null;
      if (city) {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=fr`);
        const geoData = await geoRes.json();
        if (geoData.results?.[0]) { latitude = geoData.results[0].latitude; longitude = geoData.results[0].longitude; }
      }

      const vol = calcVolume(formeBassin, longueur, largeur, profondeur, diametre);

      await supabase.from('users_profile').upsert({
        user_id: userId,
        prenom, nom, city, latitude, longitude,
        type_sol: typeSol, type_gazon: typeGazon,
        arrosage_automatique: arrosageAuto,
        surface_m2: surfaceM2 ? parseInt(surfaceM2) : null,
        piscine_forme: formeBassin,
        piscine_longueur_m: longueur ? parseFloat(longueur) : null,
        piscine_largeur_m: largeur ? parseFloat(largeur) : null,
        piscine_profondeur_m: profondeur ? parseFloat(profondeur) : null,
        piscine_diametre_m: diametre ? parseFloat(diametre) : null,
        piscine_volume_m3: vol ? parseInt(vol) : null,
        piscine_type_traitement: typeTraitement,
        piscine_type_bassin: typeBassin,
        piscine_type_filtre: typeFiltre,
      }, { onConflict: 'user_id' });

      setStep('notifications');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleActivateNotif = async () => {
    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const reg = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const VAPID_PUBLIC_KEY = 'BB6DfaZuVwrHlSnzUgVgSgmILGMKPkErn4WektLz7N0-xiKen14gU250zVQnWzaxH17CKxmnD4JXX7Pq03nRtwk';
          const padding = '='.repeat((4 - VAPID_PUBLIC_KEY.length % 4) % 4);
          const b64 = (VAPID_PUBLIC_KEY + padding).replace(/-/g, '+').replace(/_/g, '/');
          const raw = atob(b64);
          const key = Uint8Array.from(raw, c => c.charCodeAt(0));
          const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
          await supabase.from('users_profile').upsert({ user_id: userId, push_subscription: JSON.parse(JSON.stringify(sub)) }, { onConflict: 'user_id' });
        }
      }
    } catch (err) { console.error(err); }
    onComplete();
  };

  const progress = { identite: 20, espaces: 40, gazon: 60, piscine: 80, notifications: 100 }[step];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem 1.5rem 0', background: 'var(--bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🌿</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>Mon Expert Jardin</span>
        </div>
        {/* Barre de progression */}
        <div style={{ background: 'var(--border)', borderRadius: 4, height: 4, marginBottom: '0.5rem' }}>
          <div style={{ background: '#1b4332', height: 4, borderRadius: 4, width: `${progress}%`, transition: 'width 0.4s ease' }} />
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>Étape {STEPS.indexOf(step) + 1} sur {STEPS.length}</p>
      </div>

      {/* Contenu */}
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', paddingBottom: '6rem' }}>

        {/* ÉTAPE 1 — Identité */}
        {step === 'identite' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Bienvenue ! 👋</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Quelques informations pour personnaliser votre expérience.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Prénom *</label>
                <input style={inputStyle} type="text" placeholder="Louis" value={prenom} onChange={e => setPrenom(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Nom *</label>
                <input style={inputStyle} type="text" placeholder="Dupont" value={nom} onChange={e => setNom(e.target.value)} />
              </div>
            </div>
            <label style={labelStyle}>Ville *</label>
            <input style={inputStyle} type="text" placeholder="Lyon" value={city} onChange={e => setCity(e.target.value)} />
          </div>
        )}

        {/* ÉTAPE 2 — Espaces */}
        {step === 'espaces' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Qu'avez-vous ?</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Sélectionnez vos espaces pour accéder aux bons diagnostics.
            </p>
            <button onClick={() => setHasGazon(!hasGazon)} style={{
              display: 'flex', alignItems: 'center', gap: 16, width: '100%',
              padding: '1.25rem', borderRadius: 16, marginBottom: 12,
              border: hasGazon ? '2px solid #1b4332' : '1.5px solid var(--border)',
              background: hasGazon ? '#e8f5e9' : 'var(--surface)',
              cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'left',
            }}>
              <span style={{ fontSize: '2rem' }}>🌿</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: hasGazon ? '#1b4332' : 'var(--text)' }}>J'ai un gazon</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-dim)' }}>Pelouse, jardin, espace vert</p>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: '1.2rem' }}>{hasGazon ? '✅' : '⬜'}</span>
            </button>
            <button onClick={() => setHasPiscine(!hasPiscine)} style={{
              display: 'flex', alignItems: 'center', gap: 16, width: '100%',
              padding: '1.25rem', borderRadius: 16,
              border: hasPiscine ? '2px solid #1a5276' : '1.5px solid var(--border)',
              background: hasPiscine ? '#e3f2fd' : 'var(--surface)',
              cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'left',
            }}>
              <span style={{ fontSize: '2rem' }}>💧</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: hasPiscine ? '#1a5276' : 'var(--text)' }}>J'ai une piscine</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-dim)' }}>Piscine, spa, bassin</p>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: '1.2rem' }}>{hasPiscine ? '✅' : '⬜'}</span>
            </button>
          </div>
        )}

        {/* ÉTAPE 3 — Gazon */}
        {step === 'gazon' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Votre gazon 🌿</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Ces infos permettent à l'IA de personnaliser vos diagnostics.
            </p>
            <label style={labelStyle}>Surface approximative (m²)</label>
            <input style={inputStyle} type="number" placeholder="200" value={surfaceM2} onChange={e => setSurfaceM2(e.target.value)} />
            <label style={labelStyle}>Type de sol</label>
            <select style={selectStyle} value={typeSol} onChange={e => setTypeSol(e.target.value)}>
              <option value="inconnu">Je ne sais pas</option>
              <option value="argileux">Argileux (lourd, retient l'eau)</option>
              <option value="sableux">Sableux (drainant, sèche vite)</option>
              <option value="limoneux">Limoneux (équilibré)</option>
            </select>
            <label style={labelStyle}>Type de gazon</label>
            <select style={selectStyle} value={typeGazon} onChange={e => setTypeGazon(e.target.value)}>
              <option value="inconnu">Je ne sais pas</option>
              <option value="ornemental">Ornemental (esthétique)</option>
              <option value="rustique_familial">Rustique familial (jeux, jardin)</option>
              <option value="sportif">Sportif (passage intensif)</option>
              <option value="ombre">Zone ombragée</option>
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '1rem', background: 'var(--bg-soft)', borderRadius: 12, cursor: 'pointer', marginBottom: '1rem' }} onClick={() => setArrosageAuto(!arrosageAuto)}>
              <input type="checkbox" checked={arrosageAuto} onChange={e => setArrosageAuto(e.target.checked)} style={{ width: 18, height: 18, accentColor: '#1b4332' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>J'ai un arrosage automatique</span>
            </label>
          </div>
        )}

        {/* ÉTAPE 4 — Piscine */}
        {step === 'piscine' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Votre piscine 💧</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Les doses sont calculées selon votre volume exact.
            </p>
            <label style={labelStyle}>Type de bassin</label>
            <select style={selectStyle} value={typeBassin} onChange={e => setTypeBassin(e.target.value)}>
              <option value="enterree">Enterrée</option>
              <option value="semi_enterree">Semi-enterrée</option>
              <option value="hors_sol">Hors-sol</option>
              <option value="spa">Spa / Jacuzzi</option>
            </select>
            <label style={labelStyle}>Forme</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
              {[{ id: 'rectangulaire', icon: '▬', label: 'Rectangulaire' }, { id: 'ronde', icon: '⬤', label: 'Ronde' }, { id: 'ovale', icon: '⬯', label: 'Ovale' }].map(f => (
                <button key={f.id} type="button" onClick={() => { setFormeBassin(f.id); setLongueur(''); setLargeur(''); setProfondeur(''); setDiametre(''); setVolumeM3(''); }}
                  style={{ flex: 1, padding: '10px 6px', borderRadius: 12, border: formeBassin === f.id ? '2px solid #1a5276' : '1.5px solid var(--border)', background: formeBassin === f.id ? '#e3f2fd' : 'var(--bg-soft)', color: formeBassin === f.id ? '#1a5276' : 'var(--text-dim)', fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', marginBottom: 3 }}>{f.icon}</div>{f.label}
                </button>
              ))}
            </div>
            <label style={labelStyle}>Dimensions (en mètres)</label>
            {formeBassin === 'ronde' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1rem' }}>
                <div><label style={{ ...labelStyle, fontSize: '0.7rem' }}>Diamètre</label><input style={inputStyle} type="number" step="0.1" placeholder="5" value={diametre} onChange={e => { setDiametre(e.target.value); setVolumeM3(calcVolume(formeBassin, '', '', profondeur, e.target.value)); }} /></div>
                <div><label style={{ ...labelStyle, fontSize: '0.7rem' }}>Profondeur</label><input style={inputStyle} type="number" step="0.1" placeholder="1.5" value={profondeur} onChange={e => { setProfondeur(e.target.value); setVolumeM3(calcVolume(formeBassin, '', '', e.target.value, diametre)); }} /></div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: '1rem' }}>
                <div><label style={{ ...labelStyle, fontSize: '0.7rem' }}>{formeBassin === 'ovale' ? 'Grand axe' : 'Longueur'}</label><input style={inputStyle} type="number" step="0.1" placeholder="10" value={longueur} onChange={e => { setLongueur(e.target.value); setVolumeM3(calcVolume(formeBassin, e.target.value, largeur, profondeur, '')); }} /></div>
                <div><label style={{ ...labelStyle, fontSize: '0.7rem' }}>{formeBassin === 'ovale' ? 'Petit axe' : 'Largeur'}</label><input style={inputStyle} type="number" step="0.1" placeholder="4" value={largeur} onChange={e => { setLargeur(e.target.value); setVolumeM3(calcVolume(formeBassin, longueur, e.target.value, profondeur, '')); }} /></div>
                <div><label style={{ ...labelStyle, fontSize: '0.7rem' }}>Profondeur</label><input style={inputStyle} type="number" step="0.1" placeholder="1.5" value={profondeur} onChange={e => { setProfondeur(e.target.value); setVolumeM3(calcVolume(formeBassin, longueur, largeur, e.target.value, '')); }} /></div>
              </div>
            )}
            {volumeM3 && <div style={{ background: '#e3f2fd', borderRadius: 10, padding: '10px 14px', marginBottom: '1rem' }}><p style={{ margin: 0, fontSize: '0.82rem', color: '#1a5276', fontWeight: 700 }}>✓ Volume : {parseInt(volumeM3).toLocaleString()} litres</p></div>}
            <label style={labelStyle}>Type de traitement</label>
            <select style={selectStyle} value={typeTraitement} onChange={e => setTypeTraitement(e.target.value)}>
              <option value="chlore">Chlore</option>
              <option value="sel">Électrolyse au sel</option>
              <option value="brome">Brome</option>
              <option value="oxygene_actif">Oxygène actif</option>
              <option value="uv">UV + complément</option>
            </select>
            <label style={labelStyle}>Type de filtre</label>
            <select style={selectStyle} value={typeFiltre} onChange={e => setTypeFiltre(e.target.value)}>
              <option value="sable">Filtre à sable</option>
              <option value="cartouche">Filtre à cartouche</option>
              <option value="diatomees">Filtre à diatomées</option>
            </select>
          </div>
        )}

        {/* ÉTAPE 5 — Notifications */}
        {step === 'notifications' && (
          <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Restez informé</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.7 }}>
              Chaque dimanche à 20h, recevez votre programme jardin personnalisé avec météo, conseils arrosage, tonte et rappels engrais.
            </p>
            <div style={{ background: '#f0faf4', borderRadius: 16, padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span>🌡️</span><span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Météo 7 jours personnalisée</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span>💧</span><span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Conseils arrosage avec durée exacte</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span>✂️</span><span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Meilleur jour pour tondre</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>🌱</span><span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Rappels engrais automatiques</span>
              </div>
            </div>
            <button className="btn-primary" onClick={handleActivateNotif} style={{ width: '100%', fontSize: '1rem', padding: '1rem', marginBottom: '1rem' }}>
              🔔 Activer les notifications
            </button>
            <button onClick={onComplete} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'var(--font-body)', textDecoration: 'underline' }}>
              Passer cette étape
            </button>
          </div>
        )}

        {error && <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</p>}
      </div>

      {/* Bouton suivant fixé en bas */}
      {step !== 'notifications' && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '1rem 1.5rem', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
          <button className="btn-primary" onClick={handleNext} disabled={saving} style={{ width: '100%', fontSize: '1rem', padding: '1rem' }}>
            {saving ? 'Enregistrement...' : step === 'gazon' && !hasPiscine ? 'Terminer' : step === 'piscine' ? 'Terminer' : 'Suivant →'}
          </button>
        </div>
      )}
    </div>
  );
}
