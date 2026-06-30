import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function ProfileForm({ userId, onSaved }) {
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);
  const [typeSol, setTypeSol] = useState('inconnu');
  const [typeGazon, setTypeGazon] = useState('inconnu');
  const [arrosageAuto, setArrosageAuto] = useState(false);
  const [surfaceM2, setSurfaceM2] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase
      .from('users_profile')
      .select('phone, city, sms_consent, type_sol, type_gazon, arrosage_automatique, surface_m2')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setPhone(data.phone ?? '');
          setCity(data.city ?? '');
          setSmsConsent(data.sms_consent ?? false);
          setTypeSol(data.type_sol ?? 'inconnu');
          setTypeGazon(data.type_gazon ?? 'inconnu');
          setArrosageAuto(data.arrosage_automatique ?? false);
          setSurfaceM2(data.surface_m2 ?? '');
        }
      });
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let latitude = null;
      let longitude = null;

      if (city) {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            city
          )}&count=1&language=fr&country=FR`
        );
        const geoData = await geoRes.json();
        if (geoData.results?.[0]) {
          latitude = geoData.results[0].latitude;
          longitude = geoData.results[0].longitude;
        }
      }

      const { error: upsertError } = await supabase
        .from('users_profile')
        .upsert(
          {
            user_id: userId,
            phone,
            city,
            latitude,
            longitude,
            sms_consent: smsConsent,
            type_sol: typeSol,
            type_gazon: typeGazon,
            arrosage_automatique: arrosageAuto,
            surface_m2: surfaceM2 ? parseInt(surfaceM2, 10) : null,
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
      <h3>Mon profil</h3>
      <p className="profile-form__hint">
        Ces informations permettent à l'IA d'affiner ses diagnostics et
        recommandations selon votre pelouse.
      </p>

      <label htmlFor="phone">Numéro de téléphone</label>
      <input
        id="phone"
        type="tel"
        placeholder="+33612345678"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <label htmlFor="city">Ville</label>
      <input
        id="city"
        type="text"
        placeholder="Lyon"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <label htmlFor="surface">Surface approximative (m²)</label>
      <input
        id="surface"
        type="number"
        min="0"
        placeholder="200"
        value={surfaceM2}
        onChange={(e) => setSurfaceM2(e.target.value)}
      />

      <label htmlFor="typeSol">Type de sol</label>
      <select id="typeSol" value={typeSol} onChange={(e) => setTypeSol(e.target.value)}>
        <option value="inconnu">Je ne sais pas</option>
        <option value="argileux">Argileux (lourd, retient l'eau)</option>
        <option value="sableux">Sableux (drainant, sèche vite)</option>
        <option value="limoneux">Limoneux (équilibré)</option>
      </select>

      <label htmlFor="typeGazon">Type de gazon</label>
      <select id="typeGazon" value={typeGazon} onChange={(e) => setTypeGazon(e.target.value)}>
        <option value="inconnu">Je ne sais pas</option>
        <option value="ornemental">Ornemental (esthétique, peu de passage)</option>
        <option value="rustique_familial">Rustique familial (jardin, jeux d'enfants)</option>
        <option value="sportif">Sportif (passage intensif)</option>
        <option value="ombre">Zone ombragée</option>
      </select>

      <label className="profile-form__checkbox">
        <input
          type="checkbox"
          checked={arrosageAuto}
          onChange={(e) => setArrosageAuto(e.target.checked)}
        />
        J'ai un système d'arrosage automatique
      </label>

      <label className="profile-form__checkbox">
        <input
          type="checkbox"
          checked={smsConsent}
          onChange={(e) => setSmsConsent(e.target.checked)}
        />
        J'accepte de recevoir des SMS de rappel (vous pourrez vous désinscrire
        à tout moment en répondant STOP)
      </label>

      {error && (
        <p className="profile-form__error" role="alert">
          {error}
        </p>
      )}

      <button className="btn-primary" type="submit" disabled={saving}>
        {saving ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </form>
  );
}
