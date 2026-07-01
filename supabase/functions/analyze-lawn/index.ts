import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VISUAL_GUIDE = `
FIL ROUGE : taches rose saumon à rouge corail, fins filaments roses entre les brins, cercles 10-50cm.
FUSARIOSE : brun-orangé, taches circulaires nettes, mycélium blanc-rosé en bordure par temps humide.
ROUILLE : poudre orange sur les feuilles, colore les doigts/chaussures, diffus sans cercles nets.
OÏDIUM : feutrage blanc poudreux sur les feuilles, zones ombragées.
PYTHIUM : brun foncé/noir huileux, brins plaqués au sol, expansion très rapide, mycélium blanc cotonneux.
MOUSSE : vert foncé spongieux, filamenteux, entre ou à la place des brins.
PISSENLIT : rosette dents de scie, fleur jaune ou boule blanche.
TRÈFLE : feuilles trifoliées, tiges rampantes.
PÂTURIN : touffes vert clair brillant, épis blancs.
PLANTAIN : larges feuilles plates nervurées au sol.
CHIENDENT : gazon bleu-vert rugueux en touffes denses.
DIGITAIRE/MILLET : tiges en étoile, feuilles velues vert-jaune, épis en doigts.
STRESS HYDRIQUE : jaune-beige uniforme, brins repliés, empreintes persistantes.`;

const RESPONSE_SCHEMA_HINT = `
Réponds UNIQUEMENT avec un JSON valide, sans texte autour :
{
  "diagnostic": "string",
  "ficheReference": "string",
  "signesVisuelsObserves": ["string"],
  "causesProbables": ["string"],
  "actions": [
    { "etape": 1, "titre": "string", "description": "string", "categorieProduit": "string ou null" }
  ],
  "planning": [{ "periode": "string", "tache": "string" }],
  "confiance": "haute | moyenne | faible",
  "diagnosticAlternatif": "string ou null"
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY non configurée');

    const { imageUrl, userId } = await req.json();
    if (!imageUrl) return jsonError('imageUrl manquant', 400);

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: profil } = await supabaseAdmin
      .from('users_profile')
      .select('type_sol, type_gazon, arrosage_automatique, surface_m2, city')
      .eq('user_id', userId)
      .maybeSingle();

    const { data: fiches } = await supabaseAdmin
      .from('fiches_connaissances')
      .select('titre, contenu')
      .in('categorie', ['maladie', 'mauvaises_herbes', 'entretien'])
      .limit(40);

    const knowledgeBase = (fiches ?? []).map((f) => `### ${f.titre}\n${f.contenu}`).join('\n\n');

    const profilContext = profil ? `
PROFIL CLIENT : sol=${profil.type_sol ?? '?'}, gazon=${profil.type_gazon ?? '?'}, surface=${profil.surface_m2 ?? '?'}m², arrosage auto=${profil.arrosage_automatique ? 'oui' : 'non'}, ville=${profil.city ?? '?'}` : '';

    const systemPrompt = `Tu es un expert phytopathologiste spécialisé dans les maladies du gazon.

MÉTHODE OBLIGATOIRE : 1) Observe la couleur dominante 2) Identifie la forme/délimitation 3) Cherche les textures (filaments, poudre, mycélium, aspect huileux) 4) Liste ce que tu VOIS réellement 5) Conclus uniquement sur ce qui est visible.

${VISUAL_GUIDE}

RÈGLE : Ne diagnostique jamais FIL ROUGE sans filaments roses visibles. Ne diagnostique jamais PYTHIUM sans aspect huileux/sombre. En cas de doute → confiance "faible" + diagnosticAlternatif.

Désherbage chimique interdit aux particuliers en France depuis 2019 → solutions mécaniques uniquement pour les mauvaises herbes.

${profilContext}

BASE DE CONNAISSANCES :
${knowledgeBase}

${RESPONSE_SCHEMA_HINT}`;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Analyse cette photo. Décris exactement ce que tu observes avant de conclure.' },
              { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
            ],
          },
        ],
        max_tokens: 2000,
      }),
    });

    if (!openaiRes.ok) throw new Error(`Erreur OpenAI: ${await openaiRes.text()}`);

    const openaiData = await openaiRes.json();
    const rawContent = openaiData.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error('Réponse vide de GPT-4o');

    return new Response(JSON.stringify(JSON.parse(rawContent)), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('analyze-lawn error:', err);
    return jsonError(err.message ?? 'Erreur interne', 500);
  }
});

function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  });
}
