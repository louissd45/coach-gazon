import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function ProfileForm({ userId, onSaved }) {
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase
      .from('users_profile')
      .select('phone, city, sms_consent')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setPhone(data.phone ?? '');
          setCity(data.city ?? '');
          setSmsConsent(data.sms_consent ?? false);
        }
      });
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Géocodage simple de la ville pour obtenir lat/lon (nécessaire à l'alerte météo).
      // Utilise l'API gratuite Open-Meteo (pas de clé requise).
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
        Renseignez ces informations pour recevoir des rappels SMS personnalisés
        (engrais, arrosage en cas de canicule).
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
