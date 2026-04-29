import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';

export const Route = createFileRoute('/auth')({
  head: () => ({
    meta: [
      { title: 'Sign In — LaPrincesse' },
      { name: 'description', content: 'Sign in to your LaPrincesse account with Google or email.' },
    ],
  }),
  component: AuthPage,
});

const fraunces = '"Fraunces", "Georgia", serif';
const mono = '"JetBrains Mono", ui-monospace, monospace';
const sans = '"Inter", "Helvetica Neue", sans-serif';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.10)', color: '#fff', fontSize: 13, fontFamily: sans,
  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { signInWithGoogle, signIn, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: '/profile' });
  }, [user, navigate]);

  if (authLoading) return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: fraunces, fontSize: 16, fontStyle: 'italic', color: 'rgba(255,255,255,0.3)' }}>...</div>
    </div>
  );
  if (user) return null;

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) { setError(error); setGoogleLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null); setSubmitting(true);
    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) { setError(error); setSubmitting(false); return; }
      navigate({ to: '/profile' });
    } else {
      if (!name.trim()) { setError('Please enter your name.'); setSubmitting(false); return; }
      if (password.length < 8) { setError('Password must be at least 8 characters.'); setSubmitting(false); return; }
      const { error } = await signUp(email, password, name);
      if (error) { setError(error); setSubmitting(false); return; }
      setSuccess('Account created! Check your email to confirm, then sign in.');
      setMode('login');
    }
    setSubmitting(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: sans, padding: '24px' }}>
      <Link to="/" style={{ position: 'fixed', top: 24, left: 28, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontFamily: mono }}>Back</Link>

      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: fraunces, fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>la Princesse</div>
          <h1 style={{ fontFamily: fraunces, fontSize: 36, fontStyle: 'italic', fontWeight: 300, color: '#fff', margin: 0, lineHeight: 1.1 }}>
            {mode === 'login' ? 'Welcome back.' : 'Join us.'}
          </h1>
        </div>

        <button onClick={handleGoogle} disabled={googleLoading} style={{
          width: '100%', padding: '13px 0', borderRadius: 100, border: '1px solid rgba(255,255,255,0.14)',
          background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 12, letterSpacing: 1, fontFamily: sans,
          fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10, opacity: googleLoading ? 0.6 : 1,
        }}>
          <GoogleIcon />
          {googleLoading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: mono, letterSpacing: 1.5 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </div>

        <div style={{ display: 'flex', gap: 0, marginBottom: 20, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, overflow: 'hidden' }}>
          {(['login', 'signup'] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(null); setSuccess(null); }} style={{
              flex: 1, padding: '9px 0', border: 'none', cursor: 'pointer', fontSize: 9,
              letterSpacing: 2, textTransform: 'uppercase', fontFamily: mono,
              background: mode === m ? 'rgba(255,255,255,0.10)' : 'transparent',
              color: mode === m ? '#fff' : 'rgba(255,255,255,0.35)', transition: 'all 0.15s',
            }}>
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'signup' && (
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Your name" required autoComplete="name" style={inputStyle} />
          )}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email address" required autoComplete="email" style={inputStyle} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder={mode === 'signup' ? 'Password (min. 8 characters)' : 'Password'} required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'} style={inputStyle} />

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(255,60,60,0.10)', border: '1px solid rgba(255,60,60,0.20)', color: '#ff7070', fontSize: 11, fontFamily: sans }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(60,220,120,0.10)', border: '1px solid rgba(60,220,120,0.20)', color: '#50dc78', fontSize: 11, fontFamily: sans }}>
              {success}
            </div>
          )}

          <button type="submit" disabled={submitting} style={{
            marginTop: 4, padding: '13px 0', borderRadius: 100, background: '#fff', color: '#000', border: 'none',
            fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', fontFamily: mono, fontWeight: 700,
            cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1,
          }}>
            {submitting ? '...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <Link to="/lab" style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, letterSpacing: 1.5, fontFamily: mono, textDecoration: 'none' }}>
            Continue without account
          </Link>
        </div>
      </div>
    </div>
  );
}
