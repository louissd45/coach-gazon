import { useRef, useState, useCallback } from 'react';
import {
  MAX_FILE_SIZE_MB,
  ACCEPTED_IMAGE_TYPES,
} from '../../lib/constants';

/**
 * Composant de sélection/drag-drop d'une photo de pelouse.
 * Ne fait QUE la validation + remonte le File brut au parent
 * via onFileSelected. Aucune logique réseau ici (séparation des
 * responsabilités : voir useImageUpload pour l'upload réel).
 */
export default function ImageUploader({ onFileSelected, disabled }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const validateAndEmit = useCallback(
    (file) => {
      setError(null);

      if (!file) return;

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setError('Format non supporté. Utilisez JPEG, PNG ou WebP.');
        return;
      }

      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > MAX_FILE_SIZE_MB) {
        setError(`Fichier trop lourd (max ${MAX_FILE_SIZE_MB} Mo).`);
        return;
      }

      onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    validateAndEmit(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    validateAndEmit(file);
  };

  return (
    <div className="image-uploader">
      <div
        className={`dropzone ${dragActive ? 'dropzone--active' : ''} ${
          disabled ? 'dropzone--disabled' : ''
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={disabled ? undefined : handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <p className="dropzone__text">
          Glissez une photo de votre pelouse ici, ou cliquez pour en choisir
          une
        </p>
        <p className="dropzone__hint">
          JPEG, PNG ou WebP — {MAX_FILE_SIZE_MB} Mo max
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          onChange={handleInputChange}
          disabled={disabled}
          style={{ display: 'none' }}
        />
      </div>

      {error && (
        <p className="image-uploader__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
