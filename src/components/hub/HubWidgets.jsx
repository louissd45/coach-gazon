import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

const CONSEILS_MOIS = {
  1: { emoji: '❄️', titre: 'Janvier', conseil: 'Pelouse en sommeil — ne marchez pas dessus si le sol est gelé. Profitez-en pour affûter vos outils.' },
  2: { emoji: '🌱', titre: 'Février', conseil: 'Premiers signes de réveil. Si le sol est > 5°C, vous pouvez faire une tonte légère à 6cm.' },
  3: { emoji: '✂️', titre: 'Mars', conseil: 'Le mois le plus important ! Scarifiez, aérez et regarnissez les zones dégarnies dès maintenant.' },
  4: { emoji: '🌧️', titre: 'Avril', conseil: 'Reprenez les tontes hebdomadaires. Désherbage des mauvaises herbes annuelles avant qu\'elles fleurissent.' },
  5: { emoji: '💪', titre: 'Mai', conseil: 'Pic de croissance. Deuxième engrais équilibré NPK. Ne tondez jamais une pelouse mouillée.' },
  6: { emoji: '☀️', titre: 'Juin', conseil: 'Relevez la tonte à 6-8cm. Arrosez tôt le matin, 15L/m² — jamais le soir.' },
  7: { emoji: '🔥', titre: 'Juillet', conseil: 'Arrosez profondément 2-3x/semaine tôt le matin (15L/m²). Tondez à 7-8cm — plus haut conserve l\'humidité et protège les racines. Mulching activé.' },
  8: { emoji: '⛈️', titre: 'Août', conseil: 'Après l\'été, préparez vos semences et engrais d\'automne. Commandez dès maintenant pour septembre.' },
  9: { emoji: '🍂', titre: 'Septembre', conseil: 'La meilleure période de l\'année ! Scarifiez, aérez, regarnissez. Engrais potasse. Votre gazon vous remerciera.' },
  10: { emoji: '🍁', titre: 'Octobre', conseil: 'Ramassez les feuilles régulièrement — elles étouffent le gazon. Dernier engrais d\'automne.' },
  11: { emoji: '🌧️', titre: 'Novembre', conseil: 'Dernière tonte de l\'année à 5-6cm. Rangez et entretenez votre matériel pour l\'hiver.' },
  12: { emoji: '❄️', titre: 'Décembre', conseil: 'Repos total. Planifiez votre programme 2025. Vérifiez votre stock de produits pour le printemps.' },
};

function WidgetMeteo({ city, lat, lon }) {
  const [meteo, setMeteo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lat || !lon) { setLoading(false); return; }
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`)
      .then(r => r.json())
      .then(data => {
        const code = data.current?.weather_code;
        const temp = Math.round(data.current?.temperature_2m);
        const emoji = code <= 1 ? '☀️' : code <= 3 ? '⛅' : code <= 48 ? '🌫️' : code <= 67 ? '🌧️' : code <= 77 ? '❄️' : code <= 82 ? '🌦️' : '⛈️';
        const desc = code <= 1 ? 'Ensoleillé' : code <= 3 ? 'Nuageux' : code <= 48 ? 'Brouillard' : code <= 67 ? 'Pluie' : code <= 77 ? 'Neige' : code <= 82 ? 'Averses' : 'Orages';
        setMeteo({ temp, emoji, desc });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lat, lon]);

  if (!lat || !lon || (!loading && !meteo)) return null;

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
      <div style={{ fontSize: '2rem' }}>{loading ? '🌡️' : meteo?.emoji}</div>
      <div>
        <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
          {loading ? '...' : `${meteo?.temp}°C`}
        </p>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          {loading ? 'Chargement...' : `${meteo?.desc} · ${city || 'Votre ville'}`}
        </p>
      </div>
    </div>
  );
}

function WidgetConseil() {
  const mois = new Date().getMonth() + 1;
  const c = CONSEILS_MOIS[mois];
  return (
    <div style={{ background: 'linear-gradient(135deg, #1b4332, #2d6a4f)', borderRadius: 16, padding: '16px 18px' }}>
      <p style={{ margin: '0 0 6px', fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Conseil du mois — {c.titre}
      </p>
      <p style={{ margin: 0, fontSize: '0.88rem', color: '#fff', lineHeight: 1.6 }}>
        {c.emoji} {c.conseil}
      </p>
    </div>
  );
}

function WidgetConseilSemaine({ userId, autoOpen }) {
  const [notif, setNotif] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('notifications')
      .select('title, body, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setNotif(data);
        setLoading(false);
        // Auto-ouvrir si vient d'un clic sur notification
        if (data && autoOpen) setExpanded(true);
      });
  }, [userId, autoOpen]);

  if (loading || !notif) return null;

  const date = new Date(notif.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      style={{ background: 'linear-gradient(135deg, #1a5276, #2e86c1)', borderRadius: 16, padding: '16px 18px', width: '100%', border: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: expanded ? 10 : 0 }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Programme semaine du {date}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '0.92rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>
            {notif.title}
          </p>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0, marginLeft: 8 }}>▼</span>
      </div>
      {expanded && (
        <p style={{ margin: 0, fontSize: '0.83rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.65, whiteSpace: 'pre-line', marginTop: 8 }}>
          {notif.body}
        </p>
      )}
    </button>
  );
}

function WidgetDernierDiag({ userId, onSelect }) {
  const [diag, setDiag] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('diagnostics')
      .select('id, diagnostic, created_at, type, image_url')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => { setDiag(data); setLoading(false); });
  }, [userId]);

  if (loading || !diag) return null;

  const isGazon = diag.type === 'gazon';
  const date = new Date(diag.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

  return (
    <button
      onClick={() => onSelect(diag.type || 'gazon')}
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: isGazon ? '#e8f5e9' : '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
        {isGazon ? '🌿' : '💧'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dernier diagnostic · {date}</p>
        <p style={{ margin: '2px 0 0', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {diag.diagnostic?.diagnostic || 'Voir le résultat'}
        </p>
      </div>
      <span style={{ color: 'var(--accent)', fontSize: '0.9rem', flexShrink: 0 }}>→</span>
    </button>
  );
}

export default function HubWidgets({ userId, user, onSelect }) {
  const [profil, setProfil] = useState(null);
  const autoOpen = new URLSearchParams(window.location.search).get('notif') === '1';

  useEffect(() => {
    if (!userId) return;
    supabase.from('users_profile')
      .select('city, latitude, longitude')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => setProfil(data));
  }, [userId]);

  // Nettoyer le paramètre notif de l'URL après ouverture
  useEffect(() => {
    if (autoOpen) {
      const url = new URL(window.location.href);
      url.searchParams.delete('notif');
      window.history.replaceState({}, '', url.toString());
    }
  }, [autoOpen]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: '1.25rem' }}>
      {profil?.latitude && (
        <WidgetMeteo city={profil.city} lat={profil.latitude} lon={profil.longitude} />
      )}
      <WidgetConseilSemaine userId={userId} autoOpen={autoOpen} />
      <WidgetConseil />
      <WidgetDernierDiag userId={userId} onSelect={onSelect} />
    </div>
  );
}
