import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function DiagnosticHistory({ userId }) {
  const [diagnostics, setDiagnostics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase
      .from('diagnostics')
      .select('id, image_url, diagnostic, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!mounted) return;
        if (!error) setDiagnostics(data ?? []);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [userId]);

  if (loading) return <p>Chargement de l'historique...</p>;
  if (diagnostics.length === 0) {
    return <p className="history__empty">Aucun diagnostic pour le moment.</p>;
  }

  return (
    <div className="history">
      <h3>Historique</h3>
      <ul className="history__list">
        {diagnostics.map((d) => (
          <li key={d.id} className="history__item">
            <img src={d.image_url} alt="" className="history__thumb" />
            <div>
              <p className="history__title">{d.diagnostic?.diagnostic}</p>
              <p className="history__date">
                {new Date(d.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
