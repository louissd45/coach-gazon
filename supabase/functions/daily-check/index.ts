// supabase/functions/daily-check/index.ts
//
// Tâche quotidienne (déclenchée par pg_cron, voir migration 002) qui :
// 1. Vérifie l'agenda du mois pour chaque utilisateur consentant
//    -> envoie un rappel SMS si une action clé (engrais, scarification...)
//       est due et n'a pas encore été envoyée ce mois-ci
// 2. Interroge la météo de la ville de chaque utilisateur
//    -> envoie une alerte arrosage si canicule prévue
// 3. Journalise chaque envoi dans sms_log pour éviter les doublons
//
// Déploiement : supabase functions deploy daily-check
// Secrets requis :
//   supabase secrets set TWILIO_ACCOUNT_SID=...
//   supabase secrets set TWILIO_AUTH_TOKEN=...
//   supabase secrets set TWILIO_FROM_NUMBER=...

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')!;
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')!;
const TWILIO_FROM_NUMBER = Deno.env.get('TWILIO_FROM_NUMBER')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Seuil de température (°C) déclenchant une alerte arrosage.
const HEATWAVE_THRESHOLD_C = 30;

// Mots-clés d'action par mois (0 = janvier), utilisés pour déclencher
// un rappel SMS court et actionnable. À étendre librement en suivant
// le contenu de base_connaissances.txt (PARTIE 1 — Agenda mensuel).
const MONTHLY_ACTION_KEYWORDS: Record<number, { type: string; sms: string }[]> = {
  2: [{ type: 'engrais', sms: "C'est le moment d'apporter votre premier engrais de printemps (riche en azote) à votre pelouse." }],
  4: [{ type: 'engrais', sms: "Pensez à votre deuxième apport d'engrais équilibré ce mois-ci pour accompagner le pic de croissance." }],
  8: [{ type: 'engrais', sms: "Septembre est le meilleur mois pour scarifier, aérer et apporter votre engrais d'automne. Le moment idéal pour agir." }],
};

Deno.serve(async (_req: Request) => {
  const results: string[] = [];

  const { data: profiles, error } = await supabase
    .from('users_profile')
    .select('user_id, phone, city, latitude, longitude, sms_consent')
    .eq('sms_consent', true)
    .not('phone', 'is', null);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  for (const profile of profiles ?? []) {
    try {
      await checkMonthlyReminder(profile, results);
      await checkHeatwave(profile, results);
    } catch (err) {
      console.error(`Erreur pour l'utilisateur ${profile.user_id}:`, err);
    }
  }

  return new Response(JSON.stringify({ processed: profiles?.length ?? 0, results }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

async function checkMonthlyReminder(profile: any, results: string[]) {
  const month = new Date().getMonth(); // 0-indexed
  const actions = MONTHLY_ACTION_KEYWORDS[month];
  if (!actions) return;

  for (const action of actions) {
    const alreadySent = await wasAlreadySentThisMonth(profile.user_id, action.type);
    if (alreadySent) continue;

    await sendSms(profile.user_id, profile.phone, action.sms, action.type);
    results.push(`engrais -> ${profile.user_id}`);
  }
}

async function checkHeatwave(profile: any, results: string[]) {
  if (!profile.latitude || !profile.longitude) return;

  const weather = await fetchWeather(profile.latitude, profile.longitude);
  if (!weather) return;

  const maxTempNext3Days = Math.max(...weather.daily.temperature_2m_max.slice(0, 3));
  if (maxTempNext3Days < HEATWAVE_THRESHOLD_C) return;

  const alreadySent = await wasAlreadySentThisMonth(profile.user_id, 'canicule', 3);
  if (alreadySent) return;

  const advice = computeWateringAdvice(maxTempNext3Days);
  const message = `Alerte chaleur : jusqu'à ${Math.round(maxTempNext3Days)}°C prévus ces prochains jours. ${advice}`;

  await sendSms(profile.user_id, profile.phone, message, 'canicule');
  results.push(`canicule -> ${profile.user_id}`);
}

function computeWateringAdvice(maxTemp: number): string {
  if (maxTemp >= 35) {
    return 'Arrosez en profondeur tôt le matin, 3 fois cette semaine (environ 15-20mm à chaque fois), et relevez la hauteur de tonte.';
  }
  if (maxTemp >= 30) {
    return 'Arrosez en profondeur tôt le matin, 2 à 3 fois cette semaine (environ 15-20mm à chaque fois).';
  }
  return 'Surveillez la couleur de votre pelouse, un arrosage ponctuel pourra être utile.';
}

async function fetchWeather(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max&timezone=Europe%2FParis`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

async function wasAlreadySentThisMonth(
  userId: string,
  type: string,
  withinDays = 30
): Promise<boolean> {
  const since = new Date();
  since.setDate(since.getDate() - withinDays);

  const { data } = await supabase
    .from('sms_log')
    .select('id')
    .eq('user_id', userId)
    .eq('type', type)
    .gte('sent_at', since.toISOString())
    .limit(1);

  return (data?.length ?? 0) > 0;
}

async function sendSms(userId: string, to: string, message: string, type: string) {
  const credentials = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: TWILIO_FROM_NUMBER,
        To: to,
        Body: `🌱 Coach Gazon : ${message}`,
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Échec envoi SMS Twilio: ${errText}`);
  }

  await supabase.from('sms_log').insert({ user_id: userId, type, message });
}
