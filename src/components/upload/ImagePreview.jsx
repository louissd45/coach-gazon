import { useEffect, useState } from 'react';

export default function ImagePreview({ file, onRemove }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Libère la mémoire quand le composant se démonte ou que le fichier change
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!previewUrl) return null;

  return (
    <div className="image-preview">
      <img src={previewUrl} alt="Aperçu de la pelouse" className="image-preview__img" />
      <button type="button" className="image-preview__remove" onClick={onRemove}>
        Changer de photo
      </button>
    </div>
  );
}
