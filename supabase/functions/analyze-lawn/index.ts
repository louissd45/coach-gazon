// supabase/functions/analyze-lawn/index.ts
//
// Edge Function appelée depuis le frontend via supabase.functions.invoke().
// Récupère la base de connaissances en BDD, construit le prompt, appelle
// GPT-4o avec l'image, et renvoie une réponse JSON structurée.
//
// Déploiement : supabase functions deploy analyze-lawn
// Secret requis : supabase secrets set OPENAI_API_KEY=sk-...

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

// Schéma de sortie attendu de GPT-4o : on force du JSON structuré
// pour pouvoir l'afficher proprement côté frontend (Diagnostic/Causes/Actions/Planning).
const RESPONSE_SCHEMA_HINT = `
Réponds UNIQUEMENT avec un JSON valide, sans texte autour, au format exact :
{
  "diagnostic": "string - nom du problème identifié",
  "ficheReference": "string - titre de la fiche de la base de connaissances utilisée",
  "causesProbables": ["string", "..."],
  "actions": [
    {
      "etape": 1,
      "titre": "string",
      "description": "string",
      "categorieProduit": "string ou null - une seule valeur parmi : engrais_azote, engrais_equilibre, engrais_automne, fongicide, scarificateur, aerateur, semences, arrosage, chaux, desherbant. Mets null si l'étape ne nécessite aucun produit (ex: une étape uniquement manuelle)."
    }
  ],
  "planning": [
    { "periode": "string (ex: Semaine 1)", "tache": "string" }
  ],
  "confiance": "haute | moyenne | faible"
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY non configurée côté serveur');
    }

    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return jsonError('imageUrl manquant', 400);
    }

    // 1. Récupère la base de connaissances (fiches maladies/entretien) en BDD
    const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const { data: fiches, error: fichesError } = await supabaseAdmin
      .from('fiches_connaissances')
      .select('titre, contenu')
      .limit(50);

    if (fichesError) throw fichesError;

    const knowledgeBase = (fiches ?? [])
      .map((f) => `### ${f.titre}\n${f.contenu}`)
      .join('\n\n');

    // 2. Construit le prompt système avec la base injectée
    const systemPrompt = `Tu es un expert agronome spécialisé dans le gazon.
Analyse la photo, identifie le problème, cite la fiche de référence parmi
la base de connaissances ci-dessous, et propose une solution étape par étape.

BASE DE CONNAISSANCES :
${knowledgeBase}

${RESPONSE_SCHEMA_HINT}`;

    // 3. Appel GPT-4o avec l'image
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
              {
                type: 'text',
                text: 'Voici la photo de ma pelouse à diagnostiquer.',
              },
              { type: 'image_url', image_url: { url: imageUrl } },
            ],
          },
        ],
        max_tokens: 1500,
      }),
    });

    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text();
      throw new Error(`Erreur OpenAI: ${errText}`);
    }

    const openaiData = await openaiResponse.json();
    const rawContent = openaiData.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error('Réponse vide de GPT-4o');
    }

    const diagnostic = JSON.parse(rawContent);

    return new Response(JSON.stringify(diagnostic), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('analyze-lawn error:', err);
    return jsonError(err.message ?? 'Erreur interne', 500);
  }
});

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  });
}
