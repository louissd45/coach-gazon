import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

/**
 * Vérifie si l'utilisateur a déjà rempli son profil (sol, gazon, ville...).
 * Tant qu'aucune ligne n'existe dans users_profile, l'onboarding est
 * considéré comme incomplet et le profil doit être rempli avant d'accéder
 * au reste de l'application.
 */
export function useProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (!userId) return;
    setLoading(true);
    supabase
      .from('users_profile')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        setProfile(data);
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { profile, loading, refresh, isComplete: !!profile };
}
