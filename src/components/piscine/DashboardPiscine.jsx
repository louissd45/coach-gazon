import { useState, useEffect } from 'react';
import BrandLogo from '../common/BrandLogo';
import BottomNav from '../nav/BottomNav';
import ProfileForm from '../auth/ProfileForm';
import { fetchAllFiches } from '../../services/fichesService';

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

export default function DashboardPiscine({ user, signOut, onBackToHub }) {
  const [activeTab, setActiveTab] = useState('home');
  const [showLibrary, setShowLibrary] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [libraryTab, setLibraryTab] = useState('analyse_eau');

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

  const renderContent = () => {
    if (showProfile) return <ProfileForm userId={user.id} onSaved={() => setShowProfile(false)} />;
    if (showLibrary) return <PiscineLibrary initialTab={libraryTab} />;

    return (
      <>
        <span className="eyebrow">Mon Expert Piscine</span>
        <p className="app__subtitle">
          Toutes les fiches techniques sont disponibles. Le diagnostic photo arrive prochainement.
        </p>
        <div className="pool-quick-access">
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
        onAction={() => { setShowLibrary(false); setShowProfile(false); setActiveTab('home'); }}
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
