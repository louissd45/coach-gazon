import { useRef, useState, useCallback } from 'react';
import { ACCEPTED_IMAGE_TYPES } from '../../lib/constants';

/**
 * Composant de sélection/drag-drop d'une photo.
 * Accepte toutes les tailles — la compression se fait dans useImageUpload.
 */
export default function ImageUploader({ onFileSelected, disabled }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const validateAndEmit = useCallback(
    (file) => {
      setError(null);
      if (!file) return;

      // Vérifie uniquement le type (plus de limite de taille — compression automatique)
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setError('Format non supporté. Utilisez JPEG, PNG ou WebP.');
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
        className={`dropzone ${dragActive ? 'dropzone--active' : ''} ${disabled ? 'dropzone--disabled' : ''}`}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={disabled ? undefined : handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <p className="dropzone__text">
          Glissez une photo de votre pelouse ici, ou cliquez pour en choisir une
        </p>
        <p className="dropzone__hint">
          JPEG, PNG ou WebP — toutes tailles acceptées
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
        <p className="image-uploader__error" role="alert">{error}</p>
      )}
    </div>
  );
}
