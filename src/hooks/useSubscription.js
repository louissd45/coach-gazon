import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

export function useSubscription(userId) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'active' | 'inactive'
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    if (!userId) return;
    supabase
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        const isActive =
          data?.status === 'active' &&
          (!data.current_period_end || new Date(data.current_period_end) > new Date());
        setStatus(isActive ? 'active' : 'inactive');
      });
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const startCheckout = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;
      window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }, []);

  return { status, loading, startCheckout, refresh };
}
