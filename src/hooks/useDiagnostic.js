import { useState, useCallback } from 'react';
import { useImageUpload } from './useImageUpload';
import { requestDiagnostic } from '../services/diagnosticService';
import { supabase } from '../services/supabaseClient';
import { STATUS } from '../lib/constants';

export function useDiagnostic() {
  const { uploadImage } = useImageUpload();
  const [status, setStatus] = useState(STATUS.IDLE);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runDiagnostic = useCallback(
    async (file, userId) => {
      setError(null);
      setResult(null);

      try {
        setStatus(STATUS.UPLOADING);
        const { publicUrl } = await uploadImage(file, userId);

        setStatus(STATUS.ANALYZING);
        const diagnostic = await requestDiagnostic(publicUrl);

        // Persiste le diagnostic pour l'historique + pour le coach SMS
        // (référence utilisée par daily-check pour les rappels de suivi)
        await supabase.from('diagnostics').insert({
          user_id: userId,
          image_path: '',
          image_url: publicUrl,
          diagnostic,
        });

        setResult(diagnostic);
        setStatus(STATUS.SUCCESS);
      } catch (err) {
        setError(err.message ?? 'Une erreur est survenue');
        setStatus(STATUS.ERROR);
      }
    },
    [uploadImage]
  );

  const reset = useCallback(() => {
    setStatus(STATUS.IDLE);
    setResult(null);
    setError(null);
  }, []);

  return { runDiagnostic, reset, status, result, error };
}
