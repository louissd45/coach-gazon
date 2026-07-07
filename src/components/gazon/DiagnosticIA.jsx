import { useState, useEffect } from 'react';
import ImageUploader from '../upload/ImageUploader';
import ImagePreview from '../upload/ImagePreview';
import ProductSuggestion from '../products/ProductSuggestion';
import { useDiagnostic } from '../../hooks/useDiagnostic';
import { useFreeTrial } from '../../hooks/useFreeTrial';
import { useSubscription } from '../../hooks/useSubscription';
import { fetchProductsForCategories } from '../../services/productService';
import { STATUS } from '../../lib/constants';

export default function DiagnosticIA({ user, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const { runDiagnostic, reset, status, result, error } = useDiagnostic('gazon');
  const { count, canDiagnose, remaining, isExhausted, increment, loading: trialLoading } = useFreeTrial(user.id);
  const { status: subStatus, startCheckout, loading: subLoading } = useSubscription(user.id);
  const [products, setProducts] = useState({});

  const isPaid = subStatus === 'active';
  const canUse = isPaid || canDiagnose;

  useEffect(() => {
    if (status === STATUS.SUCCESS && result?.actions) {
      const categories = result.actions.map((a) => a.categorieProduit);
      fetchProductsForCategories(categories).then(setProducts);
      if (!isPaid) increment();
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

      {/* Bandeau essai gratuit */}
      {!isPaid && !trialLoading && !isExhausted && (
        <div style={{ margin: '0 0 1rem', background: remaining === 1 ? '#fef9c3' : '#f0faf4', border: `1px solid ${remaining === 1 ? '#fbbf24' : '#86efac'}`, borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.1rem' }}>{remaining === 1 ? '⚠️' : '🎁'}</span>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: remaining === 1 ? '#92400e' : '#1b4332' }}>
              {remaining === 1 ? 'Dernière analyse gratuite' : `${remaining} analyses gratuites restantes`}
            </p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: remaining === 1 ? '#92400e' : '#2d6a4f', opacity: 0.8 }}>
              Ensuite, abonnez-vous pour continuer — à partir de 3,99€/mois
            </p>
          </div>
        </div>
      )}

      {/* Paywall si essai épuisé */}
      {!isPaid && isExhausted && (
        <div style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
            Vos 2 analyses gratuites sont utilisées
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Abonnez-vous pour accéder à des diagnostics illimités, les fiches techniques, l'agenda mensuel et la boutique.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn-primary" onClick={() => startCheckout('both', 'yearly')} disabled={subLoading} style={{ width: '100%' }}>
              {subLoading ? 'Redirection...' : '🌿💧 Gazon + Piscine — 79€/an'}
            </button>
            <button onClick={() => startCheckout('gazon', 'yearly')} disabled={subLoading}
              style={{ width: '100%', padding: '0.85rem', borderRadius: 12, border: '1.5px solid var(--border)', background: 'var(--surface)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text)' }}>
              🌿 Expert Gazon seul — 49€/an
            </button>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '0.25rem' }}>
              Satisfait ou remboursé 30 jours · Paiement sécurisé Stripe
            </p>
          </div>
        </div>
      )}

      {/* Interface diagnostic normale */}
      {canUse && (
        <>
          {!selectedFile && <ImageUploader onFileSelected={handleFileSelected} disabled={isBusy} />}
          {selectedFile && status !== STATUS.SUCCESS && <ImagePreview file={selectedFile} onRemove={handleRemove} />}
          {status === STATUS.IDLE && selectedFile && (
            <button className="btn-primary" onClick={handleAnalyze} style={{ width: '100%', marginTop: '1rem' }}>
              Lancer le diagnostic
            </button>
          )}
          {status === STATUS.UPLOADING && <p className="diag-ia-status">Envoi de la photo...</p>}
          {status === STATUS.ANALYZING && <p className="diag-ia-status">Analyse par l'IA en cours...</p>}
          {status === STATUS.ERROR && (
            <div className="diag-ia-error">
              <p>{error}</p>
              <button className="btn-primary" onClick={reset} style={{ marginTop: '0.75rem' }}>Réessayer</button>
            </div>
          )}
          {status === STATUS.SUCCESS && result && (
            <section className="diagnostic-result">
              <span className="eyebrow" style={{ paddingLeft: '1.5rem', paddingTop: '1.5rem', display: 'block' }}>Résultat</span>
              <h2>{result.diagnostic}</h2>
              {result.signesVisuelsObserves?.length > 0 && (
                <><h3>Signes observés</h3><ul>{result.signesVisuelsObserves.map((s, i) => <li key={i}>{s}</li>)}</ul></>
              )}
              <h3>Causes probables</h3>
              <ul>{result.causesProbables?.map((c, i) => <li key={i}>{c}</li>)}</ul>
              <h3>Actions recommandées</h3>
              <ol>{result.actions?.map((a) => (
                <li key={a.etape} style={{ marginBottom: '0.75rem' }}>
                  <strong>{a.titre}</strong> — {a.description}
                  {a.categorieProduit && products[a.categorieProduit] && (
                    <ProductSuggestion product={products[a.categorieProduit]} />
                  )}
                </li>
              ))}</ol>
              {result.planning?.length > 0 && (
                <><h3>Planning</h3><ul>{result.planning.map((p, i) => <li key={i}><strong>{p.periode}</strong> : {p.tache}</li>)}</ul></>
              )}
              {result.diagnosticAlternatif && (
                <p style={{ padding: '0 1.5rem', fontSize: '0.85rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                  💡 Alternative possible : {result.diagnosticAlternatif}
                </p>
              )}
              <div className="diag-disclaimer">
                <p>⚠️ Diagnostic généré par IA à titre indicatif. Ne remplace pas l'avis d'un professionnel. Mon Expert Jardin décline toute responsabilité.</p>
              </div>
              <div style={{ padding: '0 1.5rem 1.5rem' }}>
                <button className="btn-primary" onClick={() => { reset(); setSelectedFile(null); }} style={{ width: '100%' }}>
                  Nouveau diagnostic
                </button>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
