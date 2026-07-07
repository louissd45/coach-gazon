export default function BottomNav({ activeTab, onTab, onAction, onBackToHub }) {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Navigation principale">
      <button
        className={`bottom-nav__item ${activeTab === 'home' ? 'bottom-nav__item--active' : ''}`}
        onClick={onBackToHub}
        aria-label="Accueil"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Accueil</span>
      </button>

      <button
        className={`bottom-nav__item ${activeTab === 'home' || activeTab === 'diagnostic' ? 'bottom-nav__item--active' : ''}`}
        onClick={() => onTab('home')}
        aria-label="Diagnostic"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M11 8V14M8 11H14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <span>Diagnostic</span>
      </button>

      <button
        className="bottom-nav__action"
        onClick={onAction}
        aria-label="Lancer un diagnostic"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
      </button>

      <button
        className={`bottom-nav__item ${activeTab === 'agenda' ? 'bottom-nav__item--active' : ''}`}
        onClick={() => onTab('agenda')}
        aria-label="Agenda"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M8 2V6M16 2V6M3 10H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        <span>Agenda</span>
      </button>

      <button
        className={`bottom-nav__item ${activeTab === 'profile' ? 'bottom-nav__item--active' : ''}`}
        onClick={() => onTab('profile')}
        aria-label="Profil"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M4 20C4 17 7.6 15 12 15C16.4 15 20 17 20 20"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        <span>Profil</span>
      </button>
    </nav>
  );
}
