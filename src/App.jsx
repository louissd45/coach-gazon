import { useState } from 'react';
import AuthForm from './components/auth/AuthForm';
import BrandLogo from './components/common/BrandLogo';
import Hub from './components/hub/Hub';
import DashboardPiscine from './components/piscine/DashboardPiscine';
import DashboardGazon from './components/gazon/DashboardGazon';
import { useAuth } from './context/AuthContext';
import './App.css';

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [space, setSpace] = useState(null);

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
    return <DashboardGazon user={user} signOut={signOut} onBackToHub={() => setSpace(null)} />;
  }

  if (space === 'piscine') {
    return <DashboardPiscine user={user} signOut={signOut} onBackToHub={() => setSpace(null)} />;
  }

  return <Hub onSelect={setSpace} onSignOut={signOut} />;
}
