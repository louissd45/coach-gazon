import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

const VAPID_PUBLIC_KEY = 'BB6DfaZuVwrHlSnzUgVgSgmILGMKPkErn4WektLz7N0-xiKen14gU250zVQnWzaxH17CKxmnD4JXX7Pq03nRtwk';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export default function PushNotifSetup({ userId }) {
  const [status, setStatus] = useState('idle');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) { setStatus('unsupported'); return; }
    if (Notification.permission === 'granted') setStatus('subscribed');
    else if (Notification.permission === 'denied') setStatus('denied');
  }, []);

  const handleSubscribe = async () => {
    setStatus('asking');
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') { setStatus('denied'); return; }
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      await supabase.from('users_profile').update({
        push_subscription: JSON.parse(JSON.stringify(subscription)),
      }).eq('user_id', userId);
      setStatus('subscribed');
    } catch (err) {
      console.error('Push error:', err);
      setStatus('denied');
    }
  };

  if (status === 'subscribed') return (
    <div style={{ background: '#f0faf4', border: '1px solid #86efac', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
      <span style={{ fontSize: '1.2rem' }}>🔔</span>
      <div>
        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: '#1b4332' }}>Notifications activées ✅</p>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#2d6a4f' }}>Conseils personnalisés chaque soir à 20h</p>
      </div>
    </div>
  );

  if (status === 'denied' || status === 'unsupported' || dismissed) return null;

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e5e3', borderRadius: 16, padding: '16px', marginBottom: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: '1.5rem' }}>🌿</span>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
            Recevez vos conseils chaque soir
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
            Météo du lendemain + recommandations IA — tonte, arrosage, dosage — personnalisées chaque soir à 20h.
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleSubscribe} disabled={status === 'asking'}
          style={{ flex: 1, background: '#1b4332', color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          {status === 'asking' ? 'Activation...' : '🔔 Activer les notifications'}
        </button>
        <button onClick={() => setDismissed(true)}
          style={{ background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-dim)', fontFamily: 'var(--font-body)' }}>
          Plus tard
        </button>
      </div>
    </div>
  );
}
