import { useState, useEffect } from 'react';
import ImageUploader from './components/upload/ImageUploader';
import ImagePreview from './components/upload/ImagePreview';
import AuthForm from './components/auth/AuthForm';
import ProfileForm from './components/auth/ProfileForm';
import DiagnosticHistory from './components/history/DiagnosticHistory';
import Paywall from './components/billing/Paywall';
import ProductSuggestion from './components/products/ProductSuggestion';
import BrandLogo from './components/common/BrandLogo';
import FicheLibrary from './components/library/FicheLibrary';
import Hub from './components/hub/Hub';
import ComingSoon from './components/hub/ComingSoon';
import BottomNav from './components/nav/BottomNav';
import DashboardPiscine from './components/piscine/DashboardPiscine';
import { useDiagnostic } from './hooks/useDiagnostic';
import { useSubscription } from './hooks/useSubscription';
import { useProfile } from './hooks/useProfile';
import { useAuth } from './context/AuthContext';
import { fetchProductsForCategories } from './services/productService';
import { STATUS } from './lib/constants';
import './App.css';

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [space, setSpace] = useState(null); // null | 'gazon' | 'piscine'

  if (loading) return <p className="app__loading">Chargement...</p>;
  if (!user) {
    return (
      <main className="app app--auth">
        <BrandLogo size={32} />
        <AuthForm />
      </main>
    );
  }

  if (space === 'gazon') {
    return <Dashboard user={user} signOut={signOut} onBackToHub={() => setSpace(null)} />;
  }

  if (space === 'piscine') {
    return <DashboardPiscine user={user} signOut={signOut} onBackToHub={() => setSpace(null)} />;
  }

  return <Hub onSelect={setSpace} onSignOut={signOut} />;
}

function Dashboard({ user, signOut, onBackToHub }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryInitialTitre, setLibraryInitialTitre] = useState(null);
  const [activeTab, setActiveTab] = useState('diagnostic');
  const [showLibraryTab, setShowLibraryTab] = useState('maladie');
  const { runDiagnostic, reset, status, result, error } = useDiagnostic();
  const { profile, loading: profileLoading, refresh: refreshProfile, isComplete } =
    useProfile(user.id);
  const { status: subStatus, loading: subLoading, startCheckout, refresh } =
    useSubscription(user.id);
  const [products, setProducts] = useState({});

  useEffect(() => {
    if (status === STATUS.SUCCESS && result?.actions) {
      const categories = result.actions.map((a) => a.categorieProduit);
      fetchProductsForCategories(categories).then(setProducts);
    }
  }, [status, result]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('checkout') === 'success') {
      setTimeout(refresh, 2000);
    }
  }, [refresh]);

  if (profileLoading) {
    return <p className="app__loading">Chargement...</p>;
  }

  if (!isComplete) {
    return (
      <main className="app">
        <header className="app__header">
          <BrandLogo size={28} />
          <button onClick={signOut}>Déconnexion</button>
        </header>
        <ProfileForm userId={user.id} mode="onboarding" onSaved={refreshProfile} />
      </main>
    );
  }

  if (subStatus === 'loading') {
    return <p className="app__loading">Chargement...</p>;
  }

  if (subStatus === 'inactive') {
    return (
      <main className="app">
        <header className="app__header">
          <BrandLogo size={28} />
          <button onClick={signOut}>Déconnexion</button>
        </header>
        <span className="eyebrow" style={{ textAlign: 'center', display: 'block', marginTop: '2rem' }}>Adhésion annuelle</span>
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

  const renderContent = () => {
    if (showLibrary) return <FicheLibrary initialTitre={libraryInitialTitre} initialTab={showLibraryTab} onClose={() => setShowLibrary(false)} />;
    if (showProfile) return <ProfileForm userId={user.id} onSaved={() => setShowProfile(false)} />;
    if (showHistory) return <DiagnosticHistory userId={user.id} />;

    return (
      <>
        <span className="eyebrow">Diagnostic IA — Gazon</span>
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
              <p role="alert" className="app__error">{error}</p>
            )}

            {status === STATUS.SUCCESS && result && (
              <section className="diagnostic-result">
                <span className="eyebrow" style={{ paddingLeft: '1.5rem', paddingTop: '1.6rem', display: 'block' }}>Votre diagnostic</span>
                <h2 style={{ paddingTop: 0 }}>{result.diagnostic}</h2>
                <p className="diagnostic-result__source">
                  Fiche de référence :{' '}
                  <button
                    className="diagnostic-result__fiche-link"
                    onClick={() => { setLibraryInitialTitre(result.ficheReference); setShowLibrary(true); }}
                  >
                    {result.ficheReference}
                  </button>
                </p>

                {result.signesVisuelsObserves?.length > 0 && (
                  <>
                    <h3>Signes observés sur la photo</h3>
                    <ul>
                      {result.signesVisuelsObserves.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </>
                )}

                {result.diagnosticAlternatif && (
                  <p style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', fontSize: '0.88rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                    💡 Diagnostic alternatif possible : {result.diagnosticAlternatif}
                  </p>
                )}

                <h3>Causes probables</h3>
                <ul>
                  {result.causesProbables?.map((c, i) => <li key={i}>{c}</li>)}
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
                    <li key={i}><strong>{p.periode}</strong> : {p.tache}</li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </>
    );
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'diagnostic') {
      setShowHistory(false);
      setShowProfile(false);
      setShowLibrary(false);
    }
    if (tab === 'fiches') {
      setLibraryInitialTitre(null);
      setShowLibrary(true);
      setShowLibraryTab('maladie');
      setShowHistory(false);
      setShowProfile(false);
    }
    if (tab === 'agenda') {
      setLibraryInitialTitre(null);
      setShowLibrary(true);
      setShowLibraryTab('agenda');
      setShowHistory(false);
      setShowProfile(false);
    }
    if (tab === 'profile') {
      setShowProfile(true);
      setShowHistory(false);
      setShowLibrary(false);
    }
  };

  const handleActionButton = () => {
    setActiveTab('diagnostic');
    setShowHistory(false);
    setShowProfile(false);
    setShowLibrary(false);
    setSelectedFile(null);
    reset();
  };

  return (
    <div className="app app-with-nav">
      <header className="app__header">
        <BrandLogo size={26} />
        <button className="app__nav-back" onClick={onBackToHub}>← Espaces</button>
      </header>

      {renderContent()}

      <BottomNav
        activeTab={activeTab}
        onTab={handleTabChange}
        onAction={handleActionButton}
      />
    </div>
  );
}
