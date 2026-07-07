import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!;
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!;
const VAPID_CONTACT = Deno.env.get('VAPID_CONTACT')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Convertir base64url en Uint8Array
function base64urlToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - base64.length % 4) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(b64);
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}

// Créer JWT VAPID
async function createVapidJWT(audience: string): Promise<string> {
  const header = { typ: 'JWT', alg: 'ES256' };
  const payload = {
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600,
    sub: VAPID_CONTACT,
  };
  const encode = (obj: object) => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const signingInput = `${encode(header)}.${encode(payload)}`;

  const keyData = base64urlToUint8Array(VAPID_PRIVATE_KEY);
  const privateKey = await crypto.subtle.importKey(
    'raw', keyData,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false, ['sign']
  );

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    privateKey,
    new TextEncoder().encode(signingInput)
  );

  const sigBase64 = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${signingInput}.${sigBase64}`;
}

// Envoyer une push notification
async function sendPushNotification(subscription: any, payload: { title: string; body: string }) {
  const endpoint = subscription.endpoint;
  const origin = new URL(endpoint).origin;
  const jwt = await createVapidJWT(origin);

  const body = JSON.stringify(payload);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `vapid t=${jwt},k=${VAPID_PUBLIC_KEY}`,
    'TTL': '86400',
  };

  if (subscription.keys?.auth && subscription.keys?.p256dh) {
    // Chiffrement basique (les navigateurs modernes l'exigent)
    headers['Content-Encoding'] = 'aes128gcm';
  }

  const res = await fetch(endpoint, { method: 'POST', headers, body });
  return res.status;
}

// Générer conseil IA selon météo
async function genererConseil(profil: any, meteo: any): Promise<{ title: string; body: string }> {
  const prompt = `Tu es un expert jardinier. Génère un conseil court et actionnable pour ce soir/demain.

PROFIL CLIENT :
- Ville : ${profil.city || 'non renseignée'}
- Surface gazon : ${profil.surface_m2 ? profil.surface_m2 + 'm²' : 'non renseignée'}
- Arrosage automatique : ${profil.arrosage_automatique ? 'oui' : 'non'}
- Type de sol : ${profil.type_sol || 'inconnu'}

M�TÉO DEMAIN :
- Température max : ${meteo.tmax}°C
- Température min : ${meteo.tmin}°C
- Précipitations : ${meteo.pluie}mm
- Code météo : ${meteo.code}

CONSIGNE :
Génère un JSON avec :
- "title" : titre court de la notification (max 40 caractères, commence par un emoji)
- "body" : conseil actionnable en 1-2 phrases max (max 100 caractères)

Exemples de title : "🌿 Tondez ce matin !", "💧 Arrosage ce soir", "⚠️ Pluie demain — pas d'arrosage"
Exemples de body : "Météo idéale pour tondre avant 10h. Surface 200m² en 30min." ou "Pluie prévue — skip l'arrosage ce soir, économisez l'eau."

Réponds UNIQUEMENT avec le JSON, sans texte autour.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
    }),
  });

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content;
  try {
    return JSON.parse(raw);
  } catch {
    return { title: '🌿 Votre conseil jardin', body: 'Consultez l\'app pour vos recommandations personnalisées.' };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Récupérer tous les utilisateurs avec une subscription push et une ville
    const { data: profils, error } = await supabase
      .from('users_profile')
      .select('user_id, city, latitude, longitude, surface_m2, arrosage_automatique, type_sol, push_subscription')
      .not('push_subscription', 'is', null)
      .not('latitude', 'is', null);

    if (error) throw error;
    if (!profils || profils.length === 0) {
      return new Response(JSON.stringify({ message: 'Aucun abonné push', count: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let sent = 0;
    let errors = 0;

    for (const profil of profils) {
      try {
        // Récupérer la météo de demain
        const meteoRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${profil.latitude}&longitude=${profil.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto&forecast_days=2`
        );
        const meteoData = await meteoRes.json();
        const demain = {
          tmax: Math.round(meteoData.daily?.temperature_2m_max?.[1] ?? 20),
          tmin: Math.round(meteoData.daily?.temperature_2m_min?.[1] ?? 12),
          pluie: Math.round(meteoData.daily?.precipitation_sum?.[1] ?? 0),
          code: meteoData.daily?.weather_code?.[1] ?? 0,
        };

        // Générer le conseil IA
        const notification = await genererConseil(profil, demain);

        // Envoyer la push notification
        const status = await sendPushNotification(profil.push_subscription, notification);

        if (status >= 200 && status < 300) sent++;
        else errors++;

      } catch (err) {
        console.error(`Erreur pour user ${profil.user_id}:`, err);
        errors++;
      }
    }

    return new Response(JSON.stringify({ success: true, sent, errors, total: profils.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('daily-check error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
