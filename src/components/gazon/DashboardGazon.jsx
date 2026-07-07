import { useState } from 'react';
import BrandLogo from '../common/BrandLogo';
import BottomNav from '../nav/BottomNav';
import ProfileForm from '../auth/ProfileForm';
import FicheLibrary from '../library/FicheLibrary';
import DiagnosticHistory from '../history/DiagnosticHistory';
import DiagnosticIA from './DiagnosticIA';
import Paywall from '../billing/Paywall';
import Drawer from '../common/Drawer';
import Boutique from '../shop/Boutique';
import { useFreeTrial } from '../../hooks/useFreeTrial';
import LegalPages from '../legal/LegalPages';
import ProfileUnifie from '../auth/ProfileUnifie';
import { useProfile } from '../../hooks/useProfile';
import { useSubscription } from '../../hooks/useSubscription';

export default function DashboardGazon({ user, signOut, onBackToHub }) {
  const { loading: profileLoading, refresh: refreshProfile, isComplete } = useProfile(user.id);
  const { status: subStatus, loading: subLoading, startCheckout } = useSubscription(user.id);
  const { canDiagnose, loading: trialLoading } = useFreeTrial(user.id);
  const [activeTab, setActiveTab] = useState('home');
  const [showLibrary, setShowLibrary] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDiag, setShowDiag] = useState(false);
  const [libraryTab, setLibraryTab] = useState('maladie');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showBoutique, setShowBoutique] = useState(false);
  const [legalPage, setLegalPage] = useState(null);
  const [showProfilUnifie, setShowProfilUnifie] = useState(false);

  if (profileLoading || subStatus === 'loading') return <p className="app__loading">Chargement...</p>;

  if (!isComplete) return (
    <main className="app">
      <header className="app__header"><BrandLogo size={26} /><button onClick={signOut}>Deconnexion</button></header>
      <ProfileForm userId={user.id} mode="onboarding" onSaved={refreshProfile} />
    </main>
  );

  if (subStatus === 'inactive' && !canDiagnose && !trialLoading) return (
    <main className="app">
      <header className="app__header"><BrandLogo size={26} /><button onClick={signOut}>Deconnexion</button></header>
      <Paywall onSubscribe={startCheckout} loading={subLoading} />
    </main>
  );

  const resetAll = () => {
    setShowLibrary(false); setShowProfile(false);
    setShowHistory(false); setShowDiag(false);
    setShowBoutique(false); setLegalPage(null); setShowProfilUnifie(false);
  };

  const handleDrawerNav = (dest) => {
    setDrawerOpen(false);
    resetAll();
    if (dest === 'espaces') { onBackToHub(); return; }
    if (dest === 'profil') { setShowProfilUnifie(true); setActiveTab('profile'); }
    if (dest === 'boutique') setShowBoutique(true);
    if (dest === 'fiches') { setLibraryTab('maladie'); setShowLibrary(true); setActiveTab('fiches'); }
    if (dest === 'agenda') { setLibraryTab('agenda'); setShowLibrary(true); setActiveTab('agenda'); }
    if (dest === 'fiches-piscine') { onBackToHub(); return; }
    if (dest === 'agenda-piscine') { onBackToHub(); return; }
    if (dest === 'abonnement') { resetAll(); setShowProfile(false); }
    if (dest === 'cgv') setLegalPage('cgv');
    if (dest === 'mentions') setLegalPage('mentions');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab); resetAll();
    if (tab === 'diagnostic') { setShowDiag(true); }
    if (tab === 'fiches') { setLibraryTab('maladie'); setShowLibrary(true); }
    if (tab === 'agenda') { setLibraryTab('agenda'); setShowLibrary(true); }
    if (tab === 'profile') setShowProfile(true);
  };

  const handleActionButton = () => {
    resetAll(); setShowDiag(true); setActiveTab('home');
  };

  const renderContent = () => {
    if (showProfilUnifie) return <ProfileUnifie userId={user.id} onClose={() => setShowProfilUnifie(false)} />;
    if (legalPage) return <LegalPages page={legalPage} onBack={() => setLegalPage(null)} />;
    if (showBoutique) return <Boutique onClose={() => setShowBoutique(false)} userId={user.id} />;
    if (showDiag) return <DiagnosticIA user={user} onClose={() => setShowDiag(false)} />;
    if (showProfile) return <ProfileForm userId={user.id} onSaved={() => setShowProfile(false)} />;
    if (showLibrary) return <FicheLibrary initialTab={libraryTab} />;
    if (showHistory) return <DiagnosticHistory userId={user.id} />;
    return (
      <div className="dashboard-home">
        <span className="eyebrow">Mon Expert Gazon</span>
        <h2 className="dashboard-home__title">Bonjour</h2>
        <p className="app__subtitle">Que souhaitez-vous faire ?</p>
        <div className="dashboard-actions">
          <button className="dashboard-action dashboard-action--primary" onClick={handleActionButton}>
            <span className="dashboard-action__icon">🔍</span>
            <div><p className="dashboard-action__label">Diagnostic IA</p><p className="dashboard-action__desc">Analyser une photo de ma pelouse</p></div>
            <span className="dashboard-action__arrow">→</span>
          </button>
          <button className="dashboard-action" onClick={() => { setLibraryTab('maladie'); setShowLibrary(true); setActiveTab('fiches'); }}>
            <span className="dashboard-action__icon">📋</span>
            <div><p className="dashboard-action__label">Fiches maladies</p><p className="dashboard-action__desc">Maladies, mauvaises herbes, entretien</p></div>
            <span className="dashboard-action__arrow">→</span>
          </button>
          <button className="dashboard-action" onClick={() => { setLibraryTab('agenda'); setShowLibrary(true); setActiveTab('agenda'); }}>
            <span className="dashboard-action__icon">📅</span>
            <div><p className="dashboard-action__label">Agenda mensuel</p><p className="dashboard-action__desc">Que faire ce mois-ci ?</p></div>
            <span className="dashboard-action__arrow">→</span>
          </button>
          <button className="dashboard-action" onClick={() => setShowHistory(true)}>
            <span className="dashboard-action__icon">🕐</span>
            <div><p className="dashboard-action__label">Mes diagnostics</p><p className="dashboard-action__desc">Historique de mes analyses</p></div>
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
        <button onClick={onBackToHub} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}><BrandLogo size={24} /></button>
        <button className="hub__hamburger" onClick={() => setDrawerOpen(true)}>
          <span /><span /><span />
        </button>
      </header>
      {renderContent()}
      <BottomNav activeTab={activeTab} onTab={handleTabChange} onAction={handleActionButton} onBackToHub={onBackToHub} />
    </div>
  );
}
