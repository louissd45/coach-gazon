import { supabase } from './supabaseClient';

/**
 * Récupère toutes les fiches, triées par catégorie puis titre.
 */
export async function fetchAllFiches() {
  const { data, error } = await supabase
    .from('fiches_connaissances')
    .select('id, titre, categorie, contenu')
    .order('categorie')
    .order('titre');

  if (error) throw error;
  return data ?? [];
}

/**
 * Récupère une fiche précise par son titre exact (utilisé pour ouvrir
 * la fiche référencée dans un résultat de diagnostic).
 */
export async function fetchFicheByTitre(titre) {
  const { data, error } = await supabase
    .from('fiches_connaissances')
    .select('id, titre, categorie, contenu')
    .eq('titre', titre)
    .maybeSingle();

  if (error) throw error;
  return data;
}
