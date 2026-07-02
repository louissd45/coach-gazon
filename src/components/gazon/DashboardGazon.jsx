import { useState } from 'react';
import BrandLogo from '../common/BrandLogo';
import BottomNav from '../nav/BottomNav';
import ProfileForm from '../auth/ProfileForm';
import FicheLibrary from '../library/FicheLibrary';
import DiagnosticHistory from '../history/DiagnosticHistory';
import DiagnosticIA from './DiagnosticIA';

export default function DashboardGazon({ user, signOut, onBackToHub }) {
  const [activeTab, setActiveTab] = useState('home');
  const [showLibrary, setShowLibrary] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDiag, setShowDiag] = useState(false);
  const [libraryTab, setLibraryTab] = useState('maladie');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowDiag(false);
    if (tab === 'home') { setShowLibrary(false); setShowProfile(false); setShowHistory(false); }
    if (tab === 'fiches') { setLibraryTab('maladie'); setShowLibrary(true); setShowProfile(false); setShowHistory(false); }
    if (tab === 'agenda') { setLibraryTab('agenda'); setShowLibrary(true); setShowProfile(false); setShowHistory(false); }
    if (tab === 'profile') { setShowProfile(true); setShowLibrary(false); setShowHistory(false); }
  };

  const handleActionButton = () => {
    setShowDiag(true);
    setShowLibrary(false);
    setShowProfile(false);
    setShowHistory(false);
    setActiveTab('home');
  };

  const renderContent = () => {
    if (showDiag) return <DiagnosticIA user={user} onClose={() => setShowDiag(false)} />;
    if (showProfile) return <ProfileForm userId={user.id} onSaved={() => setShowProfile(false)} />;
    if (showLibrary) return <FicheLibrary initialTab={libraryTab} />;
    if (showHistory) return <DiagnosticHistory userId={user.id} />;

    return (
      <div className="dashboard-home">
        <span className="eyebrow">Mon Expert Gazon</span>
        <h2 className="dashboard-home__title">Bonjour</h2>
        <p className="app__subtitle">Que souhaitez-vous faire aujourd'hui ?</p>

        <div className="dashboard-actions">
          <button className="dashboard-action dashboard-action--primary" onClick={handleActionButton}>
            <span className="dashboard-action__icon">🔍</span>
            <div>
              <p className="dashboard-action__label">Diagnostic IA</p>
              <p className="dashboard-action__desc">Analyser une photo de ma pelouse</p>
            </div>
            <span className="dashboard-action__arrow">→</span>
          </button>

          <button className="dashboard-action" onClick={() => { setLibraryTab('maladie'); setShowLibrary(true); setActiveTab('fiches'); }}>
            <span className="dashboard-action__icon">📋</span>
            <div>
              <p className="dashboard-action__label">Fiches maladies</p>
              <p className="dashboard-action__desc">Maladies, mauvaises herbes, entretien</p>
            </div>
            <span className="dashboard-action__arrow">→</span>
          </button>

          <button className="dashboard-action" onClick={() => { setLibraryTab('agenda'); setShowLibrary(true); setActiveTab('agenda'); }}>
            <span className="dashboard-action__icon">📅</span>
            <div>
              <p className="dashboard-action__label">Agenda mensuel</p>
              <p className="dashboard-action__desc">Que faire ce mois-ci ?</p>
            </div>
            <span className="dashboard-action__arrow">→</span>
          </button>

          <button className="dashboard-action" onClick={() => setShowHistory(true)}>
            <span className="dashboard-action__icon">🕐</span>
            <div>
              <p className="dashboard-action__label">Mes diagnostics</p>
              <p className="dashboard-action__desc">Historique de mes analyses</p>
            </div>
            <span className="dashboard-action__arrow">→</span>
          </button>
        </div>

        <div className="dashboard-notifs">
          <p className="dashboard-notifs__title">🔔 Notifications</p>
          <div className="dashboard-notif__empty">
            <p>Activez les notifications pour recevoir vos rappels d'entretien personnalisés</p>
            <button className="btn-notif-enable" onClick={requestNotificationPermission}>
              Activer les notifications
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app app-with-nav">
      <header className="app__header">
        <BrandLogo size={24} />
        <button className="app__nav-back" onClick={onBackToHub}>← Espaces</button>
      </header>
      {renderContent()}
      <BottomNav activeTab={activeTab} onTab={handleTabChange} onAction={handleActionButton} />
    </div>
  );
}

async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    alert('Les notifications ne sont pas supportées par votre navigateur.');
    return;
  }
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    new Notification('Mon Expert Jardin', {
      body: 'Notifications activées ! Vous recevrez vos rappels d\'entretien.',
      icon: '/icon-192.png',
    });
  }
}
