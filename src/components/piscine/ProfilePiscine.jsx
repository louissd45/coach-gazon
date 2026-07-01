import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function ProfilePiscine({ userId, onSaved, mode = 'edit' }) {
  const [longueur, setLongueur] = useState('');
  const [largeur, setLargeur] = useState('');
  const [profondeur, setProfondeur] = useState('');
  const [volumeM3, setVolumeM3] = useState('');
  const [typeTraitement, setTypeTraitement] = useState('chlore');
  const [typeBassin, setTypeBassin] = useState('enterree');
  const [typeFiltre, setTypeFiltre] = useState('sable');
  const [robot, setRobot] = useState(false);
  const [chauffage, setChauffage] = useState('aucun');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase
      .from('users_profile')
      .select('piscine_volume_m3, piscine_longueur_m, piscine_largeur_m, piscine_profondeur_m, piscine_type_traitement, piscine_type_bassin, piscine_type_filtre, piscine_robot, piscine_chauffage')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setLongueur(data.piscine_longueur_m ?? '');
          setLargeur(data.piscine_largeur_m ?? '');
          setProfondeur(data.piscine_profondeur_m ?? '');
          setVolumeM3(data.piscine_volume_m3 ?? '');
          setTypeTraitement(data.piscine_type_traitement ?? 'chlore');
          setTypeBassin(data.piscine_type_bassin ?? 'enterree');
          setTypeFiltre(data.piscine_type_filtre ?? 'sable');
          setRobot(data.piscine_robot ?? false);
          setChauffage(data.piscine_chauffage ?? 'aucun');
        }
      });
  }, [userId]);

  // Calcul automatique du volume si L/l/p sont renseignés
  useEffect(() => {
    if (longueur && largeur && profondeur) {
      const vol = Math.round(parseFloat(longueur) * parseFloat(largeur) * parseFloat(profondeur) * 1000);
      if (!isNaN(vol)) setVolumeM3(vol);
    }
  }, [longueur, largeur, profondeur]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const { error: upsertError } = await supabase
        .from('users_profile')
        .upsert(
          {
            user_id: userId,
            piscine_longueur_m: longueur ? parseFloat(longueur) : null,
            piscine_largeur_m: largeur ? parseFloat(largeur) : null,
            piscine_profondeur_m: profondeur ? parseFloat(profondeur) : null,
            piscine_volume_m3: volumeM3 ? parseInt(volumeM3) : null,
            piscine_type_traitement: typeTraitement,
            piscine_type_bassin: typeBassin,
            piscine_type_filtre: typeFiltre,
            piscine_robot: robot,
            piscine_chauffage: chauffage,
          },
          { onConflict: 'user_id' }
        );

      if (upsertError) throw upsertError;
      onSaved?.();
    } catch (err) {
      setError(err.message ?? 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h3>{mode === 'onboarding' ? 'Votre piscine' : 'Profil piscine'}</h3>
      <p className="profile-form__hint">
        Ces informations permettent de calculer les bonnes doses de produits et d'adapter les conseils.
      </p>

      <label htmlFor="typeBassin">Type de bassin</label>
      <select id="typeBassin" value={typeBassin} onChange={(e) => setTypeBassin(e.target.value)}>
        <option value="enterree">Enterrée</option>
        <option value="semi_enterree">Semi-enterrée</option>
        <option value="hors_sol">Hors-sol</option>
        <option value="spa">Spa / Jacuzzi</option>
      </select>

      <label>Dimensions (en mètres)</label>
      <label htmlFor="longueur">Longueur (m)</label>
      <input id="longueur" type="number" step="0.1" placeholder="10" value={longueur} onChange={(e) => setLongueur(e.target.value)} />

      <label htmlFor="largeur">Largeur (m)</label>
      <input id="largeur" type="number" step="0.1" placeholder="4" value={largeur} onChange={(e) => setLargeur(e.target.value)} />

      <label htmlFor="profondeur">Profondeur moyenne (m)</label>
      <input id="profondeur" type="number" step="0.1" placeholder="1.5" value={profondeur} onChange={(e) => setProfondeur(e.target.value)} />

      <label htmlFor="volume">Volume (litres) — calculé automatiquement</label>
      <input
        id="volume"
        type="number"
        placeholder="60000"
        value={volumeM3}
        onChange={(e) => setVolumeM3(e.target.value)}
      />

      <label htmlFor="typeTraitement">Type de traitement</label>
      <select id="typeTraitement" value={typeTraitement} onChange={(e) => setTypeTraitement(e.target.value)}>
        <option value="chlore">Chlore</option>
        <option value="sel">Électrolyse au sel</option>
        <option value="brome">Brome</option>
        <option value="oxygene_actif">Oxygène actif</option>
        <option value="uv">UV + complément</option>
        <option value="autre">Autre</option>
      </select>

      <label htmlFor="typeFiltre">Type de filtre</label>
      <select id="typeFiltre" value={typeFiltre} onChange={(e) => setTypeFiltre(e.target.value)}>
        <option value="sable">Filtre à sable</option>
        <option value="cartouche">Filtre à cartouche</option>
        <option value="diatomees">Filtre à diatomées</option>
      </select>

      <label htmlFor="chauffage">Chauffage</label>
      <select id="chauffage" value={chauffage} onChange={(e) => setChauffage(e.target.value)}>
        <option value="aucun">Aucun</option>
        <option value="pompe_chaleur">Pompe à chaleur</option>
        <option value="solaire">Solaire</option>
        <option value="electrique">Électrique</option>
        <option value="gaz">Gaz</option>
      </select>

      <label className="profile-form__checkbox">
        <input type="checkbox" checked={robot} onChange={(e) => setRobot(e.target.checked)} />
        J'ai un robot de piscine
      </label>

      {error && <p className="profile-form__error" role="alert">{error}</p>}

      <button className="btn-primary" type="submit" disabled={saving}>
        {saving ? 'Enregistrement...' : mode === 'onboarding' ? 'Continuer' : 'Enregistrer'}
      </button>
    </form>
  );
}
