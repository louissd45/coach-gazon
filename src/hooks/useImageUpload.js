import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

/**
 * Compresse une image côté client via Canvas avant upload.
 * Accepte n'importe quelle taille en entrée, produit un JPEG ≤ 4Mo.
 */
async function compressImage(file, maxWidthPx = 2048, qualityJpeg = 0.85) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Redimensionne si nécessaire
      if (width > maxWidthPx) {
        height = Math.round((height * maxWidthPx) / width);
        width = maxWidthPx;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Compression échouée'));
          // Crée un File depuis le Blob avec le bon nom
          const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
            type: 'image/jpeg',
          });
          resolve(compressed);
        },
        'image/jpeg',
        qualityJpeg
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Impossible de lire l\'image'));
    };

    img.src = url;
  });
}

export function useImageUpload(folder = 'lawn') {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file, userId) => {
    setUploading(true);
    setError(null);

    try {
      // 1. Compression automatique quelle que soit la taille d'entrée
      let fileToUpload = file;
      if (file.size > 1 * 1024 * 1024) {
        // Compresse si > 1Mo
        fileToUpload = await compressImage(file);
      }

      // 2. Upload vers Supabase Storage
      const ext = 'jpg';
      const path = `${folder}/${userId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('diagnostics')
        .upload(path, fileToUpload, { upsert: true, contentType: 'image/jpeg' });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('diagnostics')
        .getPublicUrl(path);

      return publicUrl;
    } catch (err) {
      setError(err.message ?? 'Erreur lors de l\'upload');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
}
