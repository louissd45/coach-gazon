import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

const MAX_FREE = 2;

export function useFreeTrial(userId) {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from('users_profile')
      .select('diagnostics_gratuits')
      .eq('user_id', userId)
      .maybeSingle();
    setCount(data?.diagnostics_gratuits ?? 0);
    setLoading(false);
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  const increment = useCallback(async () => {
    if (!userId) return;
    const newCount = (count ?? 0) + 1;
    await supabase.from('users_profile')
      .update({ diagnostics_gratuits: newCount })
      .eq('user_id', userId);
    setCount(newCount);
    return newCount;
  }, [userId, count]);

  return {
    count,
    loading,
    canDiagnose: count !== null && count < MAX_FREE,
    remaining: Math.max(0, MAX_FREE - (count ?? 0)),
    isExhausted: count !== null && count >= MAX_FREE,
    increment,
    MAX_FREE,
  };
}
