import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function NotifModal({ userId, onClose }) {
  const [notif, setNotif] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('notifications')
      .select('title, body, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => { setNotif(data); setLoading(false); });
  }, [userId]);

  const date = notif ? new Date(notif.created_at).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : '';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease',
    }} onClick={onClose}>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff',
        borderRadius: '24px 24px 0 0',
        padding: '24px 20px 40px',
        width: '100%',
        maxWidth: 500,
        animation: 'slideUp 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}>
        <div style={{ width: 40, height: 4, background: '#e5e5e3', borderRadius: 2, margin: '0 auto 20px' }} />

        {loading ? (
          <p style={{ textAlign: 'center', color: '#999', fontSize: '0.9rem' }}>Chargement...</p>
        ) : !notif ? (
          <p style={{ textAlign: 'center', color: '#999', fontSize: '0.9rem' }}>Aucun message disponible.</p>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #1a5276, #2e86c1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                🌿
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Programme · {date}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '1rem', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.3 }}>
                  {notif.title}
                </p>
              </div>
            </div>
            <div style={{ background: '#f0faf4', borderRadius: 14, padding: '16px', marginBottom: 20 }}>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#1b4332', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                {notif.body}
              </p>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: '0.72rem', color: '#999', textAlign: 'center' }}>
              Retrouvez ce message sur la page d'accueil toute la semaine
            </p>
          </>
        )}

        <button onClick={onClose} style={{
          display: 'block', width: '100%',
          background: '#1b4332', color: '#fff', border: 'none',
          borderRadius: 14, padding: '14px', fontSize: '0.95rem',
          fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)'
        }}>
          Fermer
        </button>
      </div>
    </div>
  );
}
