// scripts/import_fiches.mjs
//
// Parse base_connaissances.txt et insère chaque fiche dans la table
// fiches_connaissances. Idempotent : supprime les fiches existantes
// du même titre avant de réinsérer (permet de relancer après édition
// du fichier source).
//
// Usage :
//   SUPABASE_URL=https://xxx.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
//   node scripts/import_fiches.mjs

import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    'Variables manquantes : SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requises.'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function parseFiches(rawText) {
  const blocks = rawText.split(/^---$/m).map((b) => b.trim()).filter(Boolean);
  const fiches = [];

  for (const block of blocks) {
    const titreMatch = block.match(/TITRE:\s*(.+)/);
    const categorieMatch = block.match(/CATEGORIE:\s*(.+)/);
    const contenuMatch = block.match(/CONTENU:\s*([\s\S]+)/);

    if (titreMatch && categorieMatch && contenuMatch) {
      fiches.push({
        titre: titreMatch[1].trim(),
        categorie: categorieMatch[1].trim(),
        contenu: contenuMatch[1].trim(),
      });
    }
  }

  return fiches;
}

async function main() {
  const rawText = readFileSync('./base_connaissances.txt', 'utf-8');
  const fiches = parseFiches(rawText);

  console.log(`${fiches.length} fiches trouvées dans le fichier source.`);

  for (const fiche of fiches) {
    await supabase.from('fiches_connaissances').delete().eq('titre', fiche.titre);
    const { error } = await supabase.from('fiches_connaissances').insert(fiche);

    if (error) {
      console.error(`Échec pour "${fiche.titre}":`, error.message);
    } else {
      console.log(`Importée : ${fiche.titre} (${fiche.categorie})`);
    }
  }

  console.log('Import terminé.');
}

main();
