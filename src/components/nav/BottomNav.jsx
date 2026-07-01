export default function BottomNav({ activeTab, onTab, onAction }) {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Navigation principale">
      <button
        className={`bottom-nav__item ${activeTab === 'home' ? 'bottom-nav__item--active' : ''}`}
        onClick={() => onTab('home')}
        aria-label="Accueil"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 12L12 3L21 12V20C21 20.6 20.6 21 20 21H15V16H9V21H4C3.4 21 3 20.6 3 20V12Z"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Accueil</span>
      </button>

      <button
        className={`bottom-nav__item ${activeTab === 'calendar' ? 'bottom-nav__item--active' : ''}`}
        onClick={() => onTab('calendar')}
        aria-label="Agenda"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M8 2V6M16 2V6M3 10H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        <span>Agenda</span>
      </button>

      {/* Bouton central d'action */}
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
        className={`bottom-nav__item ${activeTab === 'history' ? 'bottom-nav__item--active' : ''}`}
        onClick={() => onTab('history')}
        aria-label="Historique"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M21 15C21 15.6 20.6 16 20 16H8L3 21V5C3 4.4 3.4 4 4 4H20C20.6 4 21 4.4 21 5V15Z"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Historique</span>
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
