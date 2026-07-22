import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function AuthForm() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [prenom, setPrenom] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;

        // Envoyer email de bienvenue
        if (data?.user) {
          supabase.functions.invoke('send-welcome-email', {
            body: { email, prenom }
          }).catch(err => console.error('Welcome email error:', err));
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
    } catch (err) {
      setError(err.message ?? 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{mode === 'signin' ? 'Connexion' : 'Créer un compte'}</h2>

      {mode === 'signup' && (
        <>
          <label htmlFor="prenom">Prénom</label>
          <input
            id="prenom"
            type="text"
            placeholder="Louis"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
        </>
      )}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <label htmlFor="password">Mot de passe</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={6}
        required
      />
      {error && <p className="auth-form__error" role="alert">{error}</p>}
      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? 'Chargement...' : mode === 'signin' ? 'Se connecter' : "S'inscrire"}
      </button>
      <button type="button" className="auth-form__switch" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
        {mode === 'signin' ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
      </button>
    </form>
  );
}
