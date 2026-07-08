import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function ProfileUnifie({ userId, onClose }) {
  const [activeTab, setActiveTab] = useState('gazon');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  // Gazon
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);
  const [typeSol, setTypeSol] = useState('inconnu');
  const [typeGazon, setTypeGazon] = useState('inconnu');
  const [arrosageAuto, setArrosageAuto] = useState(false);
  const [surfaceM2, setSurfaceM2] = useState('');

  // Piscine
  const [longueur, setLongueur] = useState('');
  const [largeur, setLargeur] = useState('');
  const [profondeur, setProfondeur] = useState('');
  const [volumeM3, setVolumeM3] = useState('');
  const [typeTraitement, setTypeTraitement] = useState('chlore');
  const [typeBassin, setTypeBassin] = useState('enterree');
  const [typeFiltre, setTypeFiltre] = useState('sable');
  const [formeBassin, setFormeBassin] = useState('rectangulaire');
  const [diametre, setDiametre] = useState('');
  const [robot, setRobot] = useState(false);
  const [chauffage, setChauffage] = useState('aucun');

  useEffect(() => {
    supabase.from('users_profile')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setPhone(data.phone ?? '');
        setCity(data.city ?? '');
        setSmsConsent(data.sms_consent ?? false);
        setTypeSol(data.type_sol ?? 'inconnu');
        setTypeGazon(data.type_gazon ?? 'inconnu');
        setArrosageAuto(data.arrosage_automatique ?? false);
        setSurfaceM2(data.surface_m2 ?? '');
        setLongueur(data.piscine_longueur_m ?? '');
        setLargeur(data.piscine_largeur_m ?? '');
        setProfondeur(data.piscine_profondeur_m ?? '');
        setVolumeM3(data.piscine_volume_m3 ?? '');
        setTypeTraitement(data.piscine_type_traitement ?? 'chlore');
        setTypeBassin(data.piscine_type_bassin ?? 'enterree');
        setTypeFiltre(data.piscine_type_filtre ?? 'sable');
        setRobot(data.piscine_robot ?? false);
        setChauffage(data.piscine_chauffage ?? 'aucun');
      });
  }, [userId]);

  // Reset des champs selon la forme sélectionnée
  useEffect(() => {
    if (formeBassin === 'ronde') {
      setLongueur(''); setLargeur('');
    } else {
      setDiametre('');
    }
    setProfondeur('');
    setVolumeM3('');
  }, [formeBassin]);

  useEffect(() => {
    if (formeBassin === 'rectangulaire' && longueur && largeur && profondeur) {
      const vol = Math.round(parseFloat(longueur) * parseFloat(largeur) * parseFloat(profondeur) * 1000);
      if (!isNaN(vol)) setVolumeM3(vol);
    } else if (formeBassin === 'ronde' && diametre && profondeur) {
      const r = parseFloat(diametre) / 2;
      const vol = Math.round(Math.PI * r * r * parseFloat(profondeur) * 1000);
      if (!isNaN(vol)) setVolumeM3(vol);
    } else if (formeBassin === 'ovale' && longueur && largeur && profondeur) {
      const vol = Math.round(Math.PI * (parseFloat(longueur)/2) * (parseFloat(largeur)/2) * parseFloat(profondeur) * 1000);
      if (!isNaN(vol)) setVolumeM3(vol);
    }
  }, [longueur, largeur, profondeur, diametre, formeBassin]);

  const handleSave = async () => {
    setSaving(true); setError(null); setSaved(false);
    try {
      let latitude = null, longitude = null;
      if (city) {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=fr&country=FR`);
        const geoData = await geoRes.json();
        if (geoData.results?.[0]) { latitude = geoData.results[0].latitude; longitude = geoData.results[0].longitude; }
      }
      const { error: upsertError } = await supabase.from('users_profile').upsert({
        user_id: userId,
        phone, city, latitude, longitude, sms_consent: smsConsent,
        type_sol: typeSol, type_gazon: typeGazon,
        arrosage_automatique: arrosageAuto,
        surface_m2: surfaceM2 ? parseInt(surfaceM2) : null,
        piscine_longueur_m: longueur ? parseFloat(longueur) : null,
        piscine_largeur_m: largeur ? parseFloat(largeur) : null,
        piscine_profondeur_m: profondeur ? parseFloat(profondeur) : null,
        piscine_volume_m3: volumeM3 ? parseInt(volumeM3) : null,
        piscine_type_traitement: typeTraitement,
        piscine_type_bassin: typeBassin,
        piscine_type_filtre: typeFiltre,
        piscine_robot: robot,
        piscine_forme: formeBassin,
        piscine_diametre_m: diametre ? parseFloat(diametre) : null,
        piscine_chauffage: chauffage,
      }, { onConflict: 'user_id' });
      if (upsertError) throw upsertError;
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message ?? 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const tabBtn = (id, icon, label, color) => (
    <button onClick={() => setActiveTab(id)} style={{
      flex: 1, padding: '10px 8px', borderRadius: 12,
      border: activeTab === id ? `2px solid ${color}` : '2px solid transparent',
      background: activeTab === id ? (id === 'gazon' ? '#e8f5e9' : '#e3f2fd') : 'var(--bg-soft)',
      color: activeTab === id ? color : 'var(--text-dim)',
      fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 700,
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      transition: 'all 0.2s',
    }}>{icon} {label}</button>
  );

  const fieldStyle = { marginBottom: '1rem' };
  const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' };
  const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: 12, border: '1.5px solid var(--border)', background: 'var(--bg-soft)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text)' };
  const selectStyle = { ...inputStyle, cursor: 'pointer' };
  const checkStyle = { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem', background: 'var(--bg-soft)', borderRadius: 12, marginBottom: '1rem', cursor: 'pointer' };

  return (
    <div className="fiche-library" style={{ paddingBottom: '6rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <button className="fiche-library__back" onClick={onClose}>← Retour</button>
        <span className="eyebrow">Mon profil</span>
      </div>

      <h2 style={{ marginBottom: '1.25rem' }}>Mon jardin</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
        {tabBtn('gazon', '🌿', 'Gazon', '#1b4332')}
        {tabBtn('piscine', '💧', 'Piscine', '#1a5276')}
      </div>

      {/* GAZON */}
      {activeTab === 'gazon' && (
        <div>
          <div style={{ background: '#e8f5e9', borderRadius: 14, padding: '12px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.3rem' }}>🌿</span>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.88rem', color: '#1b4332' }}>Profil Gazon</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#2d6a4f' }}>Ces infos personnalisent vos diagnostics et packs boutique</p>
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Ville</label>
            <input style={inputStyle} type="text" placeholder="Lyon" value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Téléphone</label>
            <input style={inputStyle} type="tel" placeholder="+33612345678" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Surface de pelouse (m²)</label>
            <input style={inputStyle} type="number" min="0" placeholder="200" value={surfaceM2} onChange={e => setSurfaceM2(e.target.value)} />
            {surfaceM2 && <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 4 }}>Utilisé pour personnaliser vos packs boutique</p>}
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Type de sol</label>
            <select style={selectStyle} value={typeSol} onChange={e => setTypeSol(e.target.value)}>
              <option value="inconnu">Je ne sais pas</option>
              <option value="argileux">Argileux (lourd, retient l'eau)</option>
              <option value="sableux">Sableux (drainant, sèche vite)</option>
              <option value="limoneux">Limoneux (équilibré)</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Type de gazon</label>
            <select style={selectStyle} value={typeGazon} onChange={e => setTypeGazon(e.target.value)}>
              <option value="inconnu">Je ne sais pas</option>
              <option value="ornemental">Ornemental (esthétique, peu de passage)</option>
              <option value="rustique_familial">Rustique familial (jardin, jeux)</option>
              <option value="sportif">Sportif (passage intensif)</option>
              <option value="ombre">Zone ombragée</option>
            </select>
          </div>
          <label style={checkStyle} onClick={() => setArrosageAuto(!arrosageAuto)}>
            <input type="checkbox" checked={arrosageAuto} onChange={e => setArrosageAuto(e.target.checked)} style={{ width: 18, height: 18, accentColor: '#1b4332' }} />
            <span style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500 }}>Arrosage automatique</span>
          </label>
          <label style={checkStyle} onClick={() => setSmsConsent(!smsConsent)}>
            <input type="checkbox" checked={smsConsent} onChange={e => setSmsConsent(e.target.checked)} style={{ width: 18, height: 18, accentColor: '#1b4332' }} />
            <span style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500 }}>Recevoir des rappels SMS (STOP pour arrêter)</span>
          </label>
        </div>
      )}

      {/* PISCINE */}
      {activeTab === 'piscine' && (
        <div>
          <div style={{ background: '#e3f2fd', borderRadius: 14, padding: '12px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.3rem' }}>💧</span>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.88rem', color: '#1a5276' }}>Profil Piscine</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#2e86c1' }}>Les doses sont calculées selon votre volume exact</p>
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Type de bassin</label>
            <select style={selectStyle} value={typeBassin} onChange={e => setTypeBassin(e.target.value)}>
              <option value="enterree">Enterrée</option>
              <option value="semi_enterree">Semi-enterrée</option>
              <option value="hors_sol">Hors-sol</option>
              <option value="spa">Spa / Jacuzzi</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Forme de la piscine</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { id: 'rectangulaire', icon: '▬', label: 'Rectangulaire' },
                { id: 'ronde', icon: '⬤', label: 'Ronde' },
                { id: 'ovale', icon: '⬯', label: 'Ovale' },
              ].map(f => (
                <button key={f.id} onClick={() => setFormeBassin(f.id)} type="button"
                  style={{ flex: 1, padding: '10px 6px', borderRadius: 12, border: formeBassin === f.id ? '2px solid #1a5276' : '1.5px solid var(--border)', background: formeBassin === f.id ? '#e3f2fd' : 'var(--bg-soft)', color: formeBassin === f.id ? '#1a5276' : 'var(--text-dim)', fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', marginBottom: 3 }}>{f.icon}</div>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <label style={{ ...labelStyle, marginBottom: '0.75rem' }}>Dimensions (en mètres)</label>
          {formeBassin === 'ronde' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1rem' }}>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Diamètre</label>
                <input style={inputStyle} type="number" step="0.1" placeholder="5" value={diametre} onChange={e => setDiametre(e.target.value)} />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Profondeur</label>
                <input style={inputStyle} type="number" step="0.1" placeholder="1.5" value={profondeur} onChange={e => setProfondeur(e.target.value)} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: '1rem' }}>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.7rem' }}>{formeBassin === 'ovale' ? 'Grand axe' : 'Longueur'}</label>
                <input style={inputStyle} type="number" step="0.1" placeholder="10" value={longueur} onChange={e => setLongueur(e.target.value)} />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.7rem' }}>{formeBassin === 'ovale' ? 'Petit axe' : 'Largeur'}</label>
                <input style={inputStyle} type="number" step="0.1" placeholder="4" value={largeur} onChange={e => setLargeur(e.target.value)} />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Profondeur</label>
                <input style={inputStyle} type="number" step="0.1" placeholder="1.5" value={profondeur} onChange={e => setProfondeur(e.target.value)} />
              </div>
            </div>
          )}
          <div style={fieldStyle}>
            <label style={labelStyle}>Volume (litres) — calculé automatiquement</label>
            <input style={{ ...inputStyle, background: volumeM3 ? '#e3f2fd' : 'var(--bg-soft)', fontWeight: volumeM3 ? 700 : 400, color: volumeM3 ? '#1a5276' : 'var(--text-dim)' }} type="number" placeholder="60000" value={volumeM3} onChange={e => setVolumeM3(e.target.value)} />
            {volumeM3 && <p style={{ fontSize: '0.72rem', color: '#1a5276', marginTop: 4, fontWeight: 600 }}>✓ Doses calculées pour {parseInt(volumeM3).toLocaleString()} litres</p>}
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Type de traitement</label>
            <select style={selectStyle} value={typeTraitement} onChange={e => setTypeTraitement(e.target.value)}>
              <option value="chlore">Chlore</option>
              <option value="sel">Électrolyse au sel</option>
              <option value="brome">Brome</option>
              <option value="oxygene_actif">Oxygène actif</option>
              <option value="uv">UV + complément</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Type de filtre</label>
            <select style={selectStyle} value={typeFiltre} onChange={e => setTypeFiltre(e.target.value)}>
              <option value="sable">Filtre à sable</option>
              <option value="cartouche">Filtre à cartouche</option>
              <option value="diatomees">Filtre à diatomées</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Chauffage</label>
            <select style={selectStyle} value={chauffage} onChange={e => setChauffage(e.target.value)}>
              <option value="aucun">Aucun</option>
              <option value="pompe_chaleur">Pompe à chaleur</option>
              <option value="solaire">Solaire</option>
              <option value="electrique">Électrique</option>
              <option value="gaz">Gaz</option>
            </select>
          </div>
          <label style={checkStyle} onClick={() => setRobot(!robot)}>
            <input type="checkbox" checked={robot} onChange={e => setRobot(e.target.checked)} style={{ width: 18, height: 18, accentColor: '#1a5276' }} />
            <span style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500 }}>J'ai un robot de piscine</span>
          </label>
        </div>
      )}

      {error && <p className="app__error">{error}</p>}

      {saved && (
        <div style={{ background: '#e8f5e9', border: '1px solid #86efac', borderRadius: 12, padding: '12px 16px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>✅</span>
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1b4332' }}>Profil enregistré avec succès</span>
        </div>
      )}

      <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ width: '100%', fontSize: '1rem', padding: '1rem' }}>
        {saving ? 'Enregistrement...' : 'Enregistrer mon profil'}
      </button>
    </div>
  );
}
