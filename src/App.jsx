import { useState, useEffect } from 'react';
import AuthForm from './components/auth/AuthForm';
import BrandLogo from './components/common/BrandLogo';
import Hub from './components/hub/Hub';
import DashboardPiscine from './components/piscine/DashboardPiscine';
import DashboardGazon from './components/gazon/DashboardGazon';
import NotifModal from './components/push/NotifModal';
import Onboarding from './components/auth/Onboarding';
import { useAuth } from './context/AuthContext';
import { supabase } from './services/supabaseClient';
import './App.css';

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [space, setSpace] = useState(null);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('notif') === '1') {
      setShowNotifModal(true);
      const url = new URL(window.location.href);
      url.searchParams.delete('notif');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  useEffect(() => {
    if (!user) { setOnboardingDone(null); return; }
    supabase.from('users_profile')
      .select('prenom')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setOnboardingDone(!!(data?.prenom));
      });
  }, [user]);

  if (loading || (user && onboardingDone === null)) return <p className="app__loading">Chargement...</p>;

  if (!user) {
    return (
      <main className="app app--auth">
        <BrandLogo size={32} />
        <AuthForm />
      </main>
    );
  }

  if (!onboardingDone) {
    return <Onboarding userId={user.id} onComplete={() => setOnboardingDone(true)} />;
  }

  return (
    <>
      {showNotifModal && (
        <NotifModal userId={user.id} onClose={() => setShowNotifModal(false)} />
      )}
      {space === 'gazon' && (
        <DashboardGazon user={user} signOut={signOut} onBackToHub={() => setSpace(null)} />
      )}
      {space === 'piscine' && (
        <DashboardPiscine user={user} signOut={signOut} onBackToHub={() => setSpace(null)} />
      )}
      {!space && (
        <Hub onSelect={setSpace} onSignOut={signOut} user={user} />
      )}
    </>
  );
}
