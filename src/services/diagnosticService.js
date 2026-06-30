import { supabase } from './supabaseClient';

/**
 * Appelle la Supabase Edge Function "dynamic-worker", qui elle-même
 * interroge GPT-4o côté serveur (clé OpenAI jamais exposée au client).
 *
 * @param {string} imageUrl - URL publique de l'image déjà uploadée
 * @returns {Promise<DiagnosticResult>}
 */
export async function requestDiagnostic(imageUrl) {
  const { data, error } = await supabase.functions.invoke('dynamic-worker', {
    body: { imageUrl },
  });

  if (error) {
    throw new Error(error.message ?? "Échec de l'analyse IA");
  }

  return data; // { diagnostic, causes, actions, planning, ficheReference }
}
