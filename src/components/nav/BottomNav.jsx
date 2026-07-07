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
        className={`bottom-nav__item ${activeTab === 'fiches' ? 'bottom-nav__item--active' : ''}`}
        onClick={() => onTab('fiches')}
        aria-label="Fiches maladies"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M4 4C4 3.4 4.4 3 5 3H15L20 8V20C20 20.6 19.6 21 19 21H5C4.4 21 4 20.6 4 20V4Z"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 3V8H20M8 12H16M8 16H13"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <span>Fiches</span>
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
