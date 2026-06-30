import { supabase } from './supabaseClient';

/**
 * Récupère un produit actif pour une catégorie donnée (le premier en stock,
 * vous pouvez complexifier avec un tri par prix/popularité plus tard).
 *
 * @param {string[]} categories - catégories de produits issues du diagnostic
 * @returns {Promise<Record<string, object>>} map categorie -> produit
 */
export async function fetchProductsForCategories(categories) {
  const uniqueCategories = [...new Set(categories.filter(Boolean))];
  if (uniqueCategories.length === 0) return {};

  const { data, error } = await supabase
    .from('produits')
    .select('id, nom, categorie, prix, image_url, lien_externe')
    .in('categorie', uniqueCategories)
    .eq('actif', true);

  if (error || !data) return {};

  // Garde un seul produit par catégorie (le premier trouvé)
  const map = {};
  for (const product of data) {
    if (!map[product.categorie]) map[product.categorie] = product;
  }
  return map;
}
