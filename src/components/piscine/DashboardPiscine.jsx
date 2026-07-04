import { useState, useEffect } from 'react';
import BrandLogo from '../common/BrandLogo';
import BottomNav from '../nav/BottomNav';
import ProfilePiscine from './ProfilePiscine';
import Drawer from '../common/Drawer';
import Boutique from '../shop/Boutique';
import LegalPages from '../legal/LegalPages';
import { fetchAllFiches } from '../../services/fichesService';
import { supabase } from '../../services/supabaseClient';
import { STATUS } from '../../lib/constants';
import ImageUploader from '../upload/ImageUploader';

const POOL_TABS = ['analyse_eau', 'probleme_eau', 'entretien_piscine', 'equipement_piscine'];
const POOL_LABELS = { analyse_eau: 'Analyse eau', probleme_eau: 'Problemes', entretien_piscine: 'Entretien', equipement_piscine: 'Equipements' };

export default function DashboardPiscine({ user, signOut, onBackToHub }) {
  const [activeTab, setActiveTab] = useState('home');
  const [showLibrary, setShowLibrary] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDiag, setShowDiag] = useState(false);
  const [showBoutique, setShowBoutique] = useState(false);
  const [legalPage, setLegalPage] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [libraryTab, setLibraryTab] = useState('analyse_eau');

  const resetAll = () => {
    setShowLibrary(false); setShowProfile(false);
    setShowDiag(false); setShowBoutique(false); setLegalPage(null);
  };

  const handleDrawerNav = (dest) => {
    setDrawerOpen(false);
    resetAll();
    if (dest === 'espaces') { onBackToHub(); return; }
    if (dest === 'profil') { setShowProfile(true); }
    if (dest === 'boutique') setShowBoutique(true);
    if (dest === 'fiches') { setLibraryTab('analyse_eau'); setShowLibrary(true); setActiveTab('fiches'); }
    if (dest === 'agenda') { setLibraryTab('entretien_piscine'); setShowLibrary(true); setActiveTab('agenda'); }
    if (dest === 'cgv') setLegalPage('cgv');
    if (dest === 'mentions') setLegalPage('mentions');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab); resetAll();
    if (tab === 'fiches') { setLibraryTab('analyse_eau'); setShowLibrary(true); }
    if (tab === 'agenda') { setLibraryTab('entretien_piscine'); setShowLibrary(true); }
    if (tab === 'profile') setShowProfile(true);
  };

  const handleActionButton = () => {
    resetAll(); setShowDiag(true); setActiveTab('home');
  };

  const renderContent = () => {
    if (legalPage) return <LegalPages page={legalPage} onBack={() => setLegalPage(null)} />;
    if (showBoutique) return <Boutique onClose={() => setShowBoutique(false)} initialTab="piscine" userId={user.id} />;
    if (showDiag) return <DiagnosticPiscine user={user} onClose={() => setShowDiag(false)} />;
    if (showProfile) return <ProfilePiscine userId={user.id} onSaved={() => setShowProfile(false)} />;
    if (showLibrary) return <PiscineLibrary initialTab={libraryTab} />;
    return (
      <div className="dashboard-home">
        <span className="eyebrow">Mon Expert Piscine</span>
        <h2 className="dashboard-home__title">Bonjour</h2>
        <p className="app__subtitle">Que souhaitez-vous faire ?</p>
        <div className="dashboard-actions">
          <button className="dashboard-action dashboard-action--primary" onClick={handleActionButton}>
            <span className="dashboard-action__icon">🔍</span>
            <div><p className="dashboard-action__label">Diagnostic IA</p><p className="dashboard-action__desc">Analyser eau, bandelette ou parois</p></div>
            <span className="dashboard-action__arrow">→</span>
          </button>
          <button className="dashboard-action" onClick={() => { setLibraryTab('analyse_eau'); setShowLibrary(true); setActiveTab('fiches'); }}>
            <span className="dashboard-action__icon">💧</span>
            <div><p className="dashboard-action__label">Analyse de l'eau</p><p className="dashboard-action__desc">pH, chlore, TAC, TH, stabilisant</p></div>
            <span className="dashboard-action__arrow">→</span>
          </button>
          <button className="dashboard-action" onClick={() => { setLibraryTab('probleme_eau'); setShowLibrary(true); setActiveTab('fiches'); }}>
            <span className="dashboard-action__icon">🔎</span>
            <div><p className="dashboard-action__label">Problemes eau</p><p className="dashboard-action__desc">Eau verte, trouble, mousseuse</p></div>
            <span className="dashboard-action__arrow">→</span>
          </button>
          <button className="dashboard-action" onClick={() => setShowBoutique(true)}>
            <span className="dashboard-action__icon">🛒</span>
            <div><p className="dashboard-action__label">Boutique piscine</p><p className="dashboard-action__desc">Chlore, pH, algicide, bandelettes</p></div>
            <span className="dashboard-action__arrow">→</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="app app-with-nav">
      {drawerOpen && (
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={handleDrawerNav} onSignOut={signOut} userName={user?.email ?? ''} />
      )}
      <header className="app__header">
        <BrandLogo size={24} />
        <button className="hub__hamburger" onClick={() => setDrawerOpen(true)}>
          <span /><span /><span />
        </button>
      </header>
      {renderContent()}
      <BottomNav activeTab={activeTab} onTab={handleTabChange} onAction={handleActionButton} />
    </div>
  );
}

function DiagnosticPiscine({ user, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelected = (file) => { setSelectedFile(file); setPreview(URL.createObjectURL(file)); setResult(null); setError(null); setStatus(STATUS.IDLE); };
  const handleReset = () => { setSelectedFile(null); setPreview(null); setResult(null); setError(null); setStatus(STATUS.IDLE); };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setStatus(STATUS.UPLOADING);
    try {
      const path = `pool/${user.id}/${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage.from('diagnostics').upload(path, selectedFile, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('diagnostics').getPublicUrl(path);
      setStatus(STATUS.ANALYZING);
      const { data, error: fnError } = await supabase.functions.invoke('analyze-pool', { body: { imageUrl: publicUrl, userId: user.id } });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setResult(data);
      setStatus(STATUS.SUCCESS);
    } catch (err) {
      setError(err.message ?? 'Erreur diagnostic');
      setStatus(STATUS.ERROR);
    }
  };

  return (
    <div className="diag-ia-screen">
      <div className="diag-ia-header">
        <button className="fiche-library__back" onClick={onClose}>← Retour</button>
        <span className="eyebrow">Diagnostic IA Piscine</span>
      </div>
      {!selectedFile && <ImageUploader onFileSelected={handleFileSelected} disabled={status === STATUS.UPLOADING || status === STATUS.ANALYZING} />}
      {selectedFile && status !== STATUS.SUCCESS && (
        <div className="image-preview">
          <img src={preview} alt="Apercu" className="image-preview__img" />
          <button className="image-preview__remove" onClick={handleReset}>Changer</button>
        </div>
      )}
      {status === STATUS.IDLE && selectedFile && <button className="btn-primary" onClick={handleAnalyze} style={{ width: '100%', marginTop: '1rem' }}>Lancer le diagnostic</button>}
      {status === STATUS.UPLOADING && <p className="diag-ia-status">Envoi de la photo...</p>}
      {status === STATUS.ANALYZING && <p className="diag-ia-status">Analyse en cours...</p>}
      {status === STATUS.ERROR && <p className="app__error">{error}</p>}
      {status === STATUS.SUCCESS && result && (
        <section className="diagnostic-result">
          <span className="eyebrow" style={{ paddingLeft: '1.5rem', paddingTop: '1.5rem', display: 'block' }}>Resultat</span>
          <h2 style={{ paddingTop: 0 }}>{result.diagnostic}</h2>
          {result.valeursLues && Object.values(result.valeursLues).some(v => v) && (
            <><h3>Valeurs mesurees</h3><div style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>{Object.entries(result.valeursLues).map(([k, v]) => v ? <div key={k} className="pool-value-row"><span className="pool-value-label">{k}</span><span className="pool-value-val">{v}</span></div> : null)}</div></>
          )}
          <h3>Causes probables</h3>
          <ul>{result.causesProbables?.map((c, i) => <li key={i}>{c}</li>)}</ul>
          <h3>Actions</h3>
          <ol>{result.actions?.map((a) => <li key={a.etape} style={{ marginBottom: '0.75rem' }}><strong>{a.titre}</strong> — {a.description}</li>)}</ol>
          <h3>Planning</h3>
          <ul>{result.planning?.map((p, i) => <li key={i}><strong>{p.periode}</strong> : {p.tache}</li>)}</ul>
          <div className="diag-disclaimer"><p>Diagnostic genere par IA a titre indicatif. Ne remplace pas un professionnel.</p></div>
          <div style={{ padding: '0 1.5rem 1.5rem' }}><button className="btn-primary" onClick={handleReset} style={{ width: '100%' }}>Nouveau diagnostic</button></div>
        </section>
      )}
    </div>
  );
}

function PiscineLibrary({ initialTab }) {
  const [fiches, setFiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialTab ?? 'analyse_eau');
  const [selectedFiche, setSelectedFiche] = useState(null);

  useEffect(() => { fetchAllFiches().then((data) => { setFiches(data.filter((f) => POOL_TABS.includes(f.categorie))); setLoading(false); }); }, []);
  useEffect(() => { if (initialTab) setActiveCategory(initialTab); }, [initialTab]);

  if (loading) return <p className="app__loading">Chargement...</p>;
  if (selectedFiche) return (
    <div className="fiche-library">
      <button className="fiche-library__back" onClick={() => setSelectedFiche(null)}>← Retour</button>
      <span className="eyebrow">{POOL_LABELS[selectedFiche.categorie]}</span>
      <h2>{selectedFiche.titre}</h2>
      <p className="fiche-library__content">{selectedFiche.contenu}</p>
    </div>
  );
  return (
    <div className="fiche-library">
      <span className="eyebrow">Fiches piscine</span>
      <h2>{POOL_LABELS[activeCategory]}</h2>
      <div className="fiche-library__tabs">
        {POOL_TABS.map((cat) => <button key={cat} className={`fiche-library__tab ${activeCategory === cat ? 'fiche-library__tab--active' : ''}`} onClick={() => setActiveCategory(cat)}>{POOL_LABELS[cat]}</button>)}
      </div>
      <ul className="fiche-library__list">
        {fiches.filter((f) => f.categorie === activeCategory).map((fiche) => <li key={fiche.id}><button className="fiche-library__item" onClick={() => setSelectedFiche(fiche)}><span>{fiche.titre}</span><span className="fiche-library__arrow">→</span></button></li>)}
      </ul>
    </div>
  );
}
