import { useState, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { UPLOAD_BUCKET } from '../lib/constants';

/**
 * Upload un fichier vers Supabase Storage et retourne son chemin + URL publique.
 * Séparé de l'analyse IA pour pouvoir réutiliser l'upload seul (ex: galerie de photos).
 */
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const uploadImage = useCallback(async (file, userId) => {
    setUploading(true);
    setUploadError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadErr } = await supabase.storage
        .from(UPLOAD_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadErr) throw uploadErr;

      const { data: publicUrlData } = supabase.storage
        .from(UPLOAD_BUCKET)
        .getPublicUrl(filePath);

      return {
        path: filePath,
        publicUrl: publicUrlData.publicUrl,
      };
    } catch (err) {
      setUploadError(err.message ?? "Erreur lors de l'upload");
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return { uploadImage, uploading, uploadError };
}
