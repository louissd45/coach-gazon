import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function ProfilePiscine({ userId, onSaved, mode = 'edit' }) {
  const [formeBassin, setFormeBassin] = useState('rectangulaire');
  const [longueur, setLongueur] = useState('');
  const [largeur, setLargeur] = useState('');
  const [profondeur, setProfondeur] = useState('');
  const [diametre, setDiametre] = useState('');
  const [volumeM3, setVolumeM3] = useState('');
  const [typeTraitement, setTypeTraitement] = useState('chlore');
  const [typeBassin, setTypeBassin] = useState('enterree');
  const [typeFiltre, setTypeFiltre] = useState('sable');
  const [robot, setRobot] = useState(false);
  const [chauffage, setChauffage] = useState('aucun');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.from('users_profile')
      .select('piscine_volume_m3, piscine_longueur_m, piscine_largeur_m, piscine_profondeur_m, piscine_type_traitement, piscine_type_bassin, piscine_type_filtre, piscine_robot, piscine_chauffage, piscine_forme, piscine_diametre_m')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setLongueur(data.piscine_longueur_m ?? '');
          setLargeur(data.piscine_largeur_m ?? '');
          setProfondeur(data.piscine_profondeur_m ?? '');
          setDiametre(data.piscine_diametre_m ?? '');
          setVolumeM3(data.piscine_volume_m3 ?? '');
          setTypeTraitement(data.piscine_type_traitement ?? 'chlore');
          setTypeBassin(data.piscine_type_bassin ?? 'enterree');
          setTypeFiltre(data.piscine_type_filtre ?? 'sable');
          setRobot(data.piscine_robot ?? false);
          setChauffage(data.piscine_chauffage ?? 'aucun');
          setFormeBassin(data.piscine_forme ?? 'rectangulaire');
        }
      });
  }, [userId]);

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
      const vol = Math.round(Math.PI * (parseFloat(longueur) / 2) * (parseFloat(largeur) / 2) * parseFloat(profondeur) * 1000);
      if (!isNaN(vol)) setVolumeM3(vol);
    }
  }, [longueur, largeur, profondeur, diametre, formeBassin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      const { error: upsertError } = await supabase.from('users_profile').upsert({
        user_id: userId,
        piscine_longueur_m: longueur ? parseFloat(longueur) : null,
        piscine_largeur_m: largeur ? parseFloat(largeur) : null,
        piscine_profondeur_m: profondeur ? parseFloat(profondeur) : null,
        piscine_diametre_m: diametre ? parseFloat(diametre) : null,
        piscine_volume_m3: volumeM3 ? parseInt(volumeM3) : null,
        piscine_type_traitement: typeTraitement,
        piscine_type_bassin: typeBassin,
        piscine_type_filtre: typeFiltre,
        piscine_robot: robot,
        piscine_chauffage: chauffage,
        piscine_forme: formeBassin,
      }, { onConflict: 'user_id' });
      if (upsertError) throw upsertError;
      onSaved?.();
    } catch (err) {
      setError(err.message ?? 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: 12, border: '1.5px solid var(--border)', background: 'var(--bg-soft)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text)', marginBottom: '1rem' };
  const selectStyle = { ...inputStyle, cursor: 'pointer' };
  const labelStyle = { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.4rem' };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h3>{mode === 'onboarding' ? 'Votre piscine' : 'Profil piscine'}</h3>
      <p className="profile-form__hint">Ces informations permettent de calculer les bonnes doses de produits et d'adapter les conseils.</p>

      <label style={labelStyle}>Type de bassin</label>
      <select style={selectStyle} value={typeBassin} onChange={e => setTypeBassin(e.target.value)}>
        <option value="enterree">Enterrée</option>
        <option value="semi_enterree">Semi-enterrée</option>
        <option value="hors_sol">Hors-sol</option>
        <option value="spa">Spa / Jacuzzi</option>
      </select>

      <label style={labelStyle}>Forme de la piscine</label>
      <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
        {[
          { id: 'rectangulaire', icon: '▬', label: 'Rectangulaire' },
          { id: 'ronde', icon: '⬤', label: 'Ronde' },
          { id: 'ovale', icon: '⬯', label: 'Ovale' },
        ].map(f => (
          <button key={f.id} type="button" onClick={() => setFormeBassin(f.id)}
            style={{ flex: 1, padding: '10px 6px', borderRadius: 12, border: formeBassin === f.id ? '2px solid #1a5276' : '1.5px solid var(--border)', background: formeBassin === f.id ? '#e3f2fd' : 'var(--bg-soft)', color: formeBassin === f.id ? '#1a5276' : 'var(--text-dim)', fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', marginBottom: 3 }}>{f.icon}</div>
            {f.label}
          </button>
        ))}
      </div>

      <label style={labelStyle}>Dimensions (en mètres)</label>
      {formeBassin === 'ronde' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '0.5rem' }}>
          <div>
            <label style={{ ...labelStyle, fontSize: '0.75rem', color: 'var(--text-dim)' }}>Diamètre (m)</label>
            <input style={inputStyle} type="number" step="0.1" placeholder="5" value={diametre} onChange={e => setDiametre(e.target.value)} />
          </div>
          <div>
            <label style={{ ...labelStyle, fontSize: '0.75rem', color: 'var(--text-dim)' }}>Profondeur (m)</label>
            <input style={inputStyle} type="number" step="0.1" placeholder="1.5" value={profondeur} onChange={e => setProfondeur(e.target.value)} />
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: '0.5rem' }}>
          <div>
            <label style={{ ...labelStyle, fontSize: '0.75rem', color: 'var(--text-dim)' }}>{formeBassin === 'ovale' ? 'Grand axe' : 'Longueur'}</label>
            <input style={inputStyle} type="number" step="0.1" placeholder="10" value={longueur} onChange={e => setLongueur(e.target.value)} />
          </div>
          <div>
            <label style={{ ...labelStyle, fontSize: '0.75rem', color: 'var(--text-dim)' }}>{formeBassin === 'ovale' ? 'Petit axe' : 'Largeur'}</label>
            <input style={inputStyle} type="number" step="0.1" placeholder="4" value={largeur} onChange={e => setLargeur(e.target.value)} />
          </div>
          <div>
            <label style={{ ...labelStyle, fontSize: '0.75rem', color: 'var(--text-dim)' }}>Profondeur</label>
            <input style={inputStyle} type="number" step="0.1" placeholder="1.5" value={profondeur} onChange={e => setProfondeur(e.target.value)} />
          </div>
        </div>
      )}

      <label style={labelStyle}>Volume (litres) — calculé automatiquement</label>
      <input style={{ ...inputStyle, background: volumeM3 ? '#e3f2fd' : 'var(--bg-soft)', fontWeight: volumeM3 ? 700 : 400, color: volumeM3 ? '#1a5276' : 'var(--text-dim)' }} type="number" placeholder="60000" value={volumeM3} onChange={e => setVolumeM3(e.target.value)} />
      {volumeM3 && <p style={{ fontSize: '0.75rem', color: '#1a5276', marginTop: -8, marginBottom: '1rem', fontWeight: 600 }}>✓ Doses calculées pour {parseInt(volumeM3).toLocaleString()} litres</p>}

      <label style={labelStyle}>Type de traitement</label>
      <select style={selectStyle} value={typeTraitement} onChange={e => setTypeTraitement(e.target.value)}>
        <option value="chlore">Chlore</option>
        <option value="sel">Électrolyse au sel</option>
        <option value="brome">Brome</option>
        <option value="oxygene_actif">Oxygène actif</option>
        <option value="uv">UV + complément</option>
        <option value="autre">Autre</option>
      </select>

      <label style={labelStyle}>Type de filtre</label>
      <select style={selectStyle} value={typeFiltre} onChange={e => setTypeFiltre(e.target.value)}>
        <option value="sable">Filtre à sable</option>
        <option value="cartouche">Filtre à cartouche</option>
        <option value="diatomees">Filtre à diatomées</option>
      </select>

      <label style={labelStyle}>Chauffage</label>
      <select style={selectStyle} value={chauffage} onChange={e => setChauffage(e.target.value)}>
        <option value="aucun">Aucun</option>
        <option value="pompe_chaleur">Pompe à chaleur</option>
        <option value="solaire">Solaire</option>
        <option value="electrique">Électrique</option>
        <option value="gaz">Gaz</option>
      </select>

      <label className="profile-form__checkbox">
        <input type="checkbox" checked={robot} onChange={e => setRobot(e.target.checked)} />
        J'ai un robot de piscine
      </label>

      {error && <p className="profile-form__error" role="alert">{error}</p>}

      <button className="btn-primary" type="submit" disabled={saving}>
        {saving ? 'Enregistrement...' : mode === 'onboarding' ? 'Continuer' : 'Enregistrer'}
      </button>
    </form>
  );
}
