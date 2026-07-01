import { useState, useEffect } from 'react';
import BrandLogo from '../common/BrandLogo';
import BottomNav from '../nav/BottomNav';
import ProfilePiscine from './ProfilePiscine';
import { fetchAllFiches } from '../../services/fichesService';
import { supabase } from '../../services/supabaseClient';

const POOL_TABS = ['analyse_eau', 'probleme_eau', 'entretien_piscine', 'equipement_piscine'];
const POOL_LABELS = {
  analyse_eau: 'Analyse eau',
  probleme_eau: 'Problèmes',
  entretien_piscine: 'Entretien',
  equipement_piscine: 'Équipements',
};

const QUICK_ACCESS = [
  { tab: 'analyse_eau', label: "Analyse de l'eau", icon: '💧', desc: 'pH, chlore, TAC, TH, stabilisant' },
  { tab: 'probleme_eau', label: "Problèmes d'eau", icon: '🔍', desc: 'Eau verte, trouble, mousseuse, taches' },
  { tab: 'entretien_piscine', label: 'Entretien saisonnier', icon: '🗓️', desc: 'Ouverture, hivernage, traitement choc' },
  { tab: 'equipement_piscine', label: 'Équipements', icon: '⚙️', desc: 'Filtration, robot, bâche' },
];

const STATUS = { IDLE: 'idle', UPLOADING: 'uploading', ANALYZING: 'analyzing', SUCCESS: 'success', ERROR: 'error' };

const URGENCE_LABELS = { immediate: '🔴 Immédiat', '24h': '🟠 Sous 24h', cette_semaine: '🟢 Cette semaine' };

export default function DashboardPiscine({ user, signOut, onBackToHub }) {
  const [activeTab, setActiveTab] = useState('home');
  const [showLibrary, setShowLibrary] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [libraryTab, setLibraryTab] = useState('analyse_eau');

  // Diagnostic photo
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const openLibrary = (tab) => {
    setLibraryTab(tab);
    setShowLibrary(true);
    setShowProfile(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') { setShowLibrary(false); setShowProfile(false); }
    if (tab === 'fiches') { openLibrary('analyse_eau'); }
    if (tab === 'agenda') { openLibrary('entretien_piscine'); }
    if (tab === 'profile') { setShowProfile(true); setShowLibrary(false); }
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
    setStatus(STATUS.IDLE);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
    setStatus(STATUS.IDLE);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setStatus(STATUS.UPLOADING);
    setError(null);

    try {
      // Upload image vers Supabase Storage
      const ext = selectedFile.name.split('.').pop();
      const path = `pool/${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('diagnostics')
        .upload(path, selectedFile, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('diagnostics').getPublicUrl(path);

      setStatus(STATUS.ANALYZING);

      // Appel Edge Function analyze-pool
      const { data, error: fnError } = await supabase.functions.invoke('analyze-pool', {
        body: { imageUrl: publicUrl, userId: user.id },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setResult(data);
      setStatus(STATUS.SUCCESS);
    } catch (err) {
      setError(err.message ?? 'Erreur lors du diagnostic');
      setStatus(STATUS.ERROR);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setStatus(STATUS.IDLE);
  };

  const renderContent = () => {
    if (showProfile) return <ProfilePiscine userId={user.id} onSaved={() => setShowProfile(false)} />;
    if (showLibrary) return <PiscineLibrary initialTab={libraryTab} />;

    return (
      <>
        <span className="eyebrow">Diagnostic IA — Piscine</span>
        <p className="app__subtitle">
          Uploadez une photo de votre eau, d'une bandelette de test ou de vos parois pour un diagnostic instantané adapté à votre piscine.
        </p>

        {/* Zone d'upload */}
        {!selectedFile && (
          <div
            className="dropzone"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('pool-upload').click()}
          >
            <p className="dropzone__text">📷 Eau, bandelette ou parois</p>
            <p className="dropzone__hint">Glissez ou cliquez pour sélectionner</p>
            <input
              id="pool-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileSelected}
            />
          </div>
        )}

        {/* Aperçu + actions */}
        {selectedFile && status !== STATUS.SUCCESS && (
          <div className="image-preview">
            <img src={preview} alt="Aperçu" className="image-preview__img" />
            <button className="image-preview__remove" onClick={handleReset}>Changer de photo</button>
          </div>
        )}

        {status === STATUS.IDLE && selectedFile && (
          <button className="btn-primary" onClick={handleAnalyze} style={{ marginTop: '1rem', width: '100%' }}>
            Lancer le diagnostic
          </button>
        )}

        {status === STATUS.UPLOADING && <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginTop: '1rem' }}>Envoi de la photo...</p>}
        {status === STATUS.ANALYZING && <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginTop: '1rem' }}>Analyse par l'IA en cours...</p>}

        {status === STATUS.ERROR && (
          <p className="app__error" style={{ marginTop: '1rem' }}>{error}</p>
        )}

        {/* Résultat diagnostic */}
        {status === STATUS.SUCCESS && result && (
          <div className="diagnostic-result" style={{ marginTop: '1.5rem' }}>
            <span className="eyebrow" style={{ paddingLeft: '1.5rem', paddingTop: '1.5rem', display: 'block' }}>
              Votre diagnostic piscine
            </span>
            <h2 style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: 0 }}>
              {result.diagnostic}
            </h2>

            {/* Valeurs lues sur le test */}
            {result.valeursLues && Object.values(result.valeursLues).some(v => v) && (
              <>
                <h3>Valeurs mesurées</h3>
                <div style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                  {Object.entries(result.valeursLues).map(([key, val]) =>
                    val ? (
                      <div key={key} className="pool-value-row">
                        <span className="pool-value-label">{key}</span>
                        <span className="pool-value-val">{val}</span>
                      </div>
                    ) : null
                  )}
                </div>
              </>
            )}

            <h3>Causes probables</h3>
            <ul style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
              {result.causesProbables?.map((c, i) => <li key={i}>{c}</li>)}
            </ul>

            <h3>Actions à entreprendre</h3>
            <ol style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
              {result.actions?.map((a) => (
                <li key={a.etape} style={{ marginBottom: '0.75rem' }}>
                  <strong>{a.titre}</strong>
                  {a.urgence && (
                    <span style={{ fontSize: '0.72rem', marginLeft: '0.5rem', color: 'var(--text-dim)' }}>
                      {URGENCE_LABELS[a.urgence]}
                    </span>
                  )}
                  <br />{a.description}
                </li>
              ))}
            </ol>

            <h3>Planning</h3>
            <ul style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingBottom: '1.5rem' }}>
              {result.planning?.map((p, i) => (
                <li key={i}><strong>{p.periode}</strong> : {p.tache}</li>
              ))}
            </ul>

            {result.recommandationTest && (
              <p style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingBottom: '1.5rem', color: 'var(--text-dim)', fontSize: '0.88rem', fontStyle: 'italic' }}>
                💡 {result.recommandationTest}
              </p>
            )}

            <div style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingBottom: '1.5rem' }}>
              <button className="btn-primary" onClick={handleReset} style={{ width: '100%' }}>
                Nouveau diagnostic
              </button>
            </div>
          </div>
        )}

        {/* Accès rapide fiches */}
        {status === STATUS.IDLE && !selectedFile && (
          <div className="pool-quick-access" style={{ marginTop: '1.5rem' }}>
            <p className="pool-quick-access__title">Fiches techniques</p>
            {QUICK_ACCESS.map((item) => (
              <button
                key={item.tab}
                className="pool-quick-access__item"
                onClick={() => { openLibrary(item.tab); setActiveTab('fiches'); }}
              >
                <span className="pool-quick-access__icon">{item.icon}</span>
                <div className="pool-quick-access__text">
                  <p className="pool-quick-access__label">{item.label}</p>
                  <p className="pool-quick-access__desc">{item.desc}</p>
                </div>
                <span className="pool-quick-access__arrow">→</span>
              </button>
            ))}
          </div>
        )}
      </>
    );
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
        onAction={handleReset}
      />
    </div>
  );
}

function PiscineLibrary({ initialTab }) {
  const [fiches, setFiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialTab ?? 'analyse_eau');
  const [selectedFiche, setSelectedFiche] = useState(null);

  useEffect(() => {
    fetchAllFiches().then((data) => {
      setFiches(data.filter((f) => POOL_TABS.includes(f.categorie)));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (initialTab) setActiveCategory(initialTab);
  }, [initialTab]);

  if (loading) return <p className="app__loading">Chargement...</p>;

  if (selectedFiche) {
    return (
      <div className="fiche-library">
        <button className="fiche-library__back" onClick={() => setSelectedFiche(null)}>← Retour</button>
        <span className="eyebrow">{POOL_LABELS[selectedFiche.categorie]}</span>
        <h2>{selectedFiche.titre}</h2>
        <div className="gold-divider"><span className="gold-divider__mark" /></div>
        <p className="fiche-library__content">{selectedFiche.contenu}</p>
      </div>
    );
  }

  return (
    <div className="fiche-library">
      <span className="eyebrow">Fiches piscine</span>
      <h2>{POOL_LABELS[activeCategory]}</h2>
      <div className="fiche-library__tabs">
        {POOL_TABS.map((cat) => (
          <button
            key={cat}
            className={`fiche-library__tab ${activeCategory === cat ? 'fiche-library__tab--active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {POOL_LABELS[cat]}
          </button>
        ))}
      </div>
      <ul className="fiche-library__list">
        {fiches.filter((f) => f.categorie === activeCategory).map((fiche) => (
          <li key={fiche.id}>
            <button className="fiche-library__item" onClick={() => setSelectedFiche(fiche)}>
              <span>{fiche.titre}</span>
              <span className="fiche-library__arrow">→</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
