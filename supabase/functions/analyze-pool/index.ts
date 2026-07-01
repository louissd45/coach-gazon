// supabase/functions/analyze-pool/index.ts
//
// Analyse une photo de piscine (eau, bandelette test, parois...) avec GPT-4o.
// Récupère le profil piscine du client pour personnaliser les doses.
//
// Déploiement : supabase functions deploy analyze-pool
// Secrets requis : OPENAI_API_KEY (déjà configuré)

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESPONSE_SCHEMA = `
Réponds UNIQUEMENT avec un JSON valide, sans texte autour, au format exact :
{
  "diagnostic": "string - problème principal identifié (ex: Eau verte - prolifération d'algues)",
  "typeAnalyse": "visuel | bandelette | kit_colorimetrique | numerique | mixte",
  "valeursLues": {
    "pH": "string ou null - valeur lue sur le test si visible",
    "chlore": "string ou null",
    "TAC": "string ou null",
    "TH": "string ou null",
    "stabilisant": "string ou null"
  },
  "etatGeneral": "bon | moyen | mauvais | critique",
  "causesProbables": ["string", "..."],
  "actions": [
    {
      "etape": 1,
      "titre": "string",
      "description": "string - instruction précise avec dose calculée pour le volume du client si applicable",
      "urgence": "immediate | 24h | cette_semaine"
    }
  ],
  "planning": [
    { "periode": "string (ex: Maintenant, Dans 4h, Demain...)", "tache": "string" }
  ],
  "confiance": "haute | moyenne | faible",
  "recommandationTest": "string ou null - si l'IA recommande un test complémentaire"
}`;

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY non configurée');

    const { imageUrl, userId } = await req.json();
    if (!imageUrl) return jsonError('imageUrl manquant', 400);

    const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // 1. Récupère le profil piscine du client pour personnaliser les doses
    const { data: profil } = await supabaseAdmin
      .from('users_profile')
      .select('piscine_volume_m3, piscine_type_traitement, piscine_type_bassin, piscine_type_filtre, piscine_robot, piscine_chauffage')
      .eq('user_id', userId)
      .maybeSingle();

    // 2. Récupère la base de connaissances piscine
    const { data: fiches } = await supabaseAdmin
      .from('fiches_connaissances')
      .select('titre, contenu')
      .in('categorie', ['analyse_eau', 'probleme_eau', 'entretien_piscine', 'equipement_piscine'])
      .limit(30);

    const knowledgeBase = (fiches ?? [])
      .map((f) => `### ${f.titre}\n${f.contenu}`)
      .join('\n\n');

    // 3. Construit le contexte client personnalisé
    const traitement: Record<string, string> = {
      chlore: 'chlore classique',
      sel: 'électrolyse au sel',
      brome: 'brome',
      oxygene_actif: 'oxygène actif',
      uv: 'UV + complément chimique',
    };
    const filtre: Record<string, string> = {
      sable: 'filtre à sable',
      cartouche: 'filtre à cartouche',
      diatomees: 'filtre à diatomées',
    };

    const volumeL = profil?.piscine_volume_m3 ?? null;
    const volumeM3 = volumeL ? Math.round(volumeL / 1000) : null;

    const profilContext = profil ? `
PROFIL DE LA PISCINE DU CLIENT :
• Volume : ${volumeL ? `${volumeL.toLocaleString()} litres (${volumeM3} m³)` : 'non renseigné'}
• Type de traitement : ${traitement[profil.piscine_type_traitement] ?? profil.piscine_type_traitement ?? 'non renseigné'}
• Type de filtre : ${filtre[profil.piscine_type_filtre] ?? profil.piscine_type_filtre ?? 'non renseigné'}
• Type de bassin : ${profil.piscine_type_bassin ?? 'non renseigné'}
• Chauffage : ${profil.piscine_chauffage ?? 'non renseigné'}
• Robot : ${profil.piscine_robot ? 'oui' : 'non'}

IMPORTANT : si le volume est renseigné, CALCULE les doses exactes en grammes ou litres pour ce volume précis.
Exemple : au lieu de "10g/m³", dire "${volumeM3 ? `${10 * volumeM3}g pour votre piscine de ${volumeM3}m³` : '10g/m³'}"
Adapte aussi les conseils au type de traitement : pour l'électrolyse au sel, ne jamais recommander de chlore choc classique mais du chlore non stabilisé.
` : 'Profil piscine non renseigné — donner les doses en g/m³ et recommander de renseigner le profil.';

    // 4. Prompt système complet
    const systemPrompt = `Tu es un expert en traitement et entretien de piscines résidentielles.

Analyse la photo fournie. Il peut s'agir :
- D'une photo de l'eau de la piscine (couleur, transparence, mousse, dépôts...)
- D'une bandelette de test (lis les couleurs et compare aux valeurs de référence imprimées)
- D'un kit colorimétrique (tubes de couleur)
- D'un afficheur numérique de mesure
- Des parois ou équipements de la piscine

Pour une bandelette ou un test : lis attentivement chaque zone colorée et déduis les valeurs de pH, chlore, TAC, TH, stabilisant selon les couleurs visibles.

${profilContext}

BASE DE CONNAISSANCES :
${knowledgeBase}

${RESPONSE_SCHEMA}`;

    // 5. Appel GPT-4o avec vision
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Voici la photo de ma piscine ou de mon test d\'eau à analyser.' },
              { type: 'image_url', image_url: { url: imageUrl } },
            ],
          },
        ],
        max_tokens: 1500,
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      throw new Error(`Erreur OpenAI: ${err}`);
    }

    const openaiData = await openaiRes.json();
    const rawContent = openaiData.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error('Réponse vide de GPT-4o');

    const diagnostic = JSON.parse(rawContent);

    return new Response(JSON.stringify(diagnostic), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('analyze-pool error:', err);
    return jsonError(err.message ?? 'Erreur interne', 500);
  }
});

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  });
}
