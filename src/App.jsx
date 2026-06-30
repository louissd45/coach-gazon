import { useState, useEffect } from 'react';
import ImageUploader from './components/upload/ImageUploader';
import ImagePreview from './components/upload/ImagePreview';
import AuthForm from './components/auth/AuthForm';
import ProfileForm from './components/auth/ProfileForm';
import DiagnosticHistory from './components/history/DiagnosticHistory';
import Paywall from './components/billing/Paywall';
import ProductSuggestion from './components/products/ProductSuggestion';
import { useDiagnostic } from './hooks/useDiagnostic';
import { useSubscription } from './hooks/useSubscription';
import { useAuth } from './context/AuthContext';
import { fetchProductsForCategories } from './services/productService';
import { STATUS } from './lib/constants';
import './App.css';

export default function App() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <p className="app__loading">Chargement...</p>;
  if (!user) {
    return (
      <main className="app app--auth">
        <h1>🌱 Coach Gazon</h1>
        <AuthForm />
      </main>
    );
  }

  return <Dashboard user={user} signOut={signOut} />;
}

function Dashboard({ user, signOut }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { runDiagnostic, reset, status, result, error } = useDiagnostic();
  const { status: subStatus, loading: subLoading, startCheckout, refresh } =
    useSubscription(user.id);
  const [products, setProducts] = useState({});

  useEffect(() => {
    if (status === STATUS.SUCCESS && result?.actions) {
      const categories = result.actions.map((a) => a.categorieProduit);
      fetchProductsForCategories(categories).then(setProducts);
    }
  }, [status, result]);

  // Si on revient d'un paiement Stripe réussi, on revérifie le statut
  // (le webhook met généralement à jour la base en quelques secondes).
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('checkout') === 'success') {
      setTimeout(refresh, 2000);
    }
  }, [refresh]);

  if (subStatus === 'loading') {
    return <p className="app__loading">Chargement...</p>;
  }

  if (subStatus === 'inactive') {
    return (
      <main className="app">
        <header className="app__header">
          <h1>🌱 Coach Gazon</h1>
          <button onClick={signOut}>Déconnexion</button>
        </header>
        <Paywall onSubscribe={startCheckout} loading={subLoading} />
      </main>
    );
  }

  const handleFileSelected = (file) => setSelectedFile(file);

  const handleAnalyze = () => {
    if (selectedFile) runDiagnostic(selectedFile, user.id);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    reset();
  };

  const isBusy = status === STATUS.UPLOADING || status === STATUS.ANALYZING;

  return (
    <main className="app">
      <header className="app__header">
        <h1>🌱 Coach Gazon</h1>
        <div className="app__nav">
          <button onClick={() => setShowHistory((v) => !v)}>Historique</button>
          <button onClick={() => setShowProfile((v) => !v)}>Mon profil</button>
          <button onClick={signOut}>Déconnexion</button>
        </div>
      </header>

      {showProfile && (
        <ProfileForm userId={user.id} onSaved={() => setShowProfile(false)} />
      )}

      {showHistory && <DiagnosticHistory userId={user.id} />}

      {!showProfile && !showHistory && (
        <>
          <p className="app__subtitle">
            Uploadez une photo de votre pelouse pour un diagnostic instantané
          </p>

          {!selectedFile && (
            <ImageUploader onFileSelected={handleFileSelected} disabled={isBusy} />
          )}

          {selectedFile && (
            <>
              <ImagePreview file={selectedFile} onRemove={handleRemove} />

              {status === STATUS.IDLE && (
                <button className="btn-primary" onClick={handleAnalyze}>
                  Lancer le diagnostic
                </button>
              )}

              {status === STATUS.UPLOADING && <p>Envoi de la photo...</p>}
              {status === STATUS.ANALYZING && <p>Analyse par l'IA en cours...</p>}

              {status === STATUS.ERROR && (
                <p role="alert" className="app__error">
                  {error}
                </p>
              )}

              {status === STATUS.SUCCESS && result && (
                <section className="diagnostic-result">
                  <h2>{result.diagnostic}</h2>
                  <p className="diagnostic-result__source">
                    Fiche de référence : {result.ficheReference}
                  </p>

                  <h3>Causes probables</h3>
                  <ul>
                    {result.causesProbables?.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>

                  <h3>Actions à entreprendre</h3>
                  <ol>
                    {result.actions?.map((a) => (
                      <li key={a.etape}>
                        <strong>{a.titre}</strong> — {a.description}
                        <ProductSuggestion product={products[a.categorieProduit]} />
                      </li>
                    ))}
                  </ol>

                  <h3>Planning</h3>
                  <ul>
                    {result.planning?.map((p, i) => (
                      <li key={i}>
                        <strong>{p.periode}</strong> : {p.tache}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
