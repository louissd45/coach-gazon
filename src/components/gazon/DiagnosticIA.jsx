import { useState, useEffect } from 'react';
import ImageUploader from '../upload/ImageUploader';
import ImagePreview from '../upload/ImagePreview';
import ProductSuggestion from '../products/ProductSuggestion';
import { useDiagnostic } from '../../hooks/useDiagnostic';
import { fetchProductsForCategories } from '../../services/productService';
import { STATUS } from '../../lib/constants';

export default function DiagnosticIA({ user, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const { runDiagnostic, reset, status, result, error } = useDiagnostic();
  const [products, setProducts] = useState({});

  useEffect(() => {
    if (status === STATUS.SUCCESS && result?.actions) {
      const categories = result.actions.map((a) => a.categorieProduit);
      fetchProductsForCategories(categories).then(setProducts);
    }
  }, [status, result]);

  const handleFileSelected = (file) => { setSelectedFile(file); reset(); };
  const handleRemove = () => { setSelectedFile(null); reset(); };
  const handleAnalyze = () => { if (selectedFile) runDiagnostic(selectedFile, user.id); };
  const isBusy = status === STATUS.UPLOADING || status === STATUS.ANALYZING;

  return (
    <div className="diag-ia-screen">
      <div className="diag-ia-header">
        <button className="fiche-library__back" onClick={onClose}>← Retour</button>
        <span className="eyebrow">Diagnostic IA</span>
      </div>

      {!selectedFile && (
        <ImageUploader onFileSelected={handleFileSelected} disabled={isBusy} />
      )}

      {selectedFile && status !== STATUS.SUCCESS && (
        <ImagePreview file={selectedFile} onRemove={handleRemove} />
      )}

      {status === STATUS.IDLE && selectedFile && (
        <button className="btn-primary" onClick={handleAnalyze} style={{ width: '100%', marginTop: '1rem' }}>
          Lancer le diagnostic
        </button>
      )}

      {status === STATUS.UPLOADING && <p className="diag-ia-status">Envoi de la photo...</p>}
      {status === STATUS.ANALYZING && <p className="diag-ia-status">Analyse par l'IA en cours...</p>}

      {status === STATUS.ERROR && (
        <p className="app__error" style={{ marginTop: '1rem' }}>{error}</p>
      )}

      {status === STATUS.SUCCESS && result && (
        <section className="diagnostic-result">
          {result.categorie && (
            <div style={{ paddingLeft: '1.5rem', paddingTop: '1.5rem' }}>
              <span className={`diag-badge diag-badge--${result.categorie}`}>
                {result.categorie === 'champignon' && '🍄 Champignon'}
                {result.categorie === 'maladie_fongique' && '🦠 Maladie fongique'}
                {result.categorie === 'mauvaise_herbe' && '🌿 Mauvaise herbe'}
                {result.categorie === 'secheresse' && '☀️ Sécheresse / Gazon grillé'}
                {result.categorie === 'urine_animal' && '🐕 Brûlure d\'urine'}
                {result.categorie === 'carence' && '🌱 Carence'}
                {result.categorie === 'mousse' && '🌱 Mousse'}
                {!['champignon','maladie_fongique','mauvaise_herbe','secheresse','urine_animal','carence','mousse'].includes(result.categorie) && '🔍 Diagnostic'}
              </span>
            </div>
          )}

          <span className="eyebrow" style={{ paddingLeft: '1.5rem', paddingTop: '0.75rem', display: 'block' }}>Résultat</span>
          <h2 style={{ paddingTop: 0 }}>{result.diagnostic}</h2>

          <p style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', fontSize: '0.82rem', color: 'var(--text-dim)', margin: '0 0 0.5rem' }}>
            Confiance IA : <strong style={{ color: result.confiance === 'haute' ? 'var(--accent)' : result.confiance === 'moyenne' ? '#c2410c' : 'var(--error)' }}>
              {result.confiance === 'haute' ? '● Haute' : result.confiance === 'moyenne' ? '● Moyenne' : '● Faible'}
            </strong>
          </p>

          {result.signesVisuelsObserves?.length > 0 && (
            <>
              <h3>Ce que l'IA a observé</h3>
              <ul>{result.signesVisuelsObserves.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </>
          )}

          {result.criteresIdentification && (
            <p style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', fontSize: '0.86rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
              🔍 {result.criteresIdentification}
            </p>
          )}

          {result.diagnosticAlternatif && (
            <p style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', fontSize: '0.86rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
              💡 Diagnostic alternatif : {result.diagnosticAlternatif}
            </p>
          )}

          <h3>Causes probables</h3>
          <ul>{result.causesProbables?.map((c, i) => <li key={i}>{c}</li>)}</ul>

          <h3>Actions à entreprendre</h3>
          <ol>
            {result.actions?.map((a) => (
              <li key={a.etape} style={{ marginBottom: '0.75rem' }}>
                <strong>{a.titre}</strong> — {a.description}
                {a.categorieProduit && (
                  <div className="diag-produit-slot">
                    <span className="diag-produit-slot__label">Produit</span>
                    <span className="diag-produit-slot__type">{a.categorieProduit.replace(/_/g, ' ')}</span>
                    <span className="diag-produit-slot__soon">Boutique bientôt</span>
                  </div>
                )}
              </li>
            ))}
          </ol>

          <h3>Planning</h3>
          <ul>{result.planning?.map((p, i) => <li key={i}><strong>{p.periode}</strong> : {p.tache}</li>)}</ul>

          <div className="diag-disclaimer">
            <p>⚠️ Diagnostic généré par IA à titre indicatif. Ne remplace pas l'avis d'un professionnel. Mon Expert Jardin décline toute responsabilité sur les décisions prises.</p>
          </div>

          <div style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingBottom: '1.5rem' }}>
            <button className="btn-primary" onClick={() => { setSelectedFile(null); reset(); }} style={{ width: '100%' }}>
              Nouveau diagnostic
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
