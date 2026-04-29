import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { getUserDesigns, getUserAppointments, deleteDesign } from '@/lib/supabase';
import type { Design, Appointment } from '@/lib/supabase';

export const Route = createFileRoute('/profile')({
  head: () => ({
    meta: [
      { title: 'My Account — LaPrincesse' },
      { name: 'description', content: 'View your saved nail designs, appointments, and account details.' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: ProfilePage,
});

const fraunces = '"Fraunces", "Georgia", serif';
const mono = '"JetBrains Mono", ui-monospace, monospace';
const sans = '"Inter", "Helvetica Neue", sans-serif';

const STATUS_COLORS: Record<string, string> = {
  pending:   'rgba(255,200,80,0.75)',
  confirmed: 'rgba(80,220,120,0.75)',
  completed: 'rgba(120,160,255,0.75)',
  cancelled: 'rgba(255,80,80,0.65)',
};

function ProfilePage() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'designs' | 'appointments'>('designs');
  const [designs, setDesigns] = useState<Design[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) { navigate({ to: '/auth' }); }
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    Promise.all([
      getUserDesigns(user.id),
      getUserAppointments(user.id),
    ]).then(([d, a]) => {
      setDesigns(d.data ?? []);
      setAppointments(a.data ?? []);
      setFetching(false);
    });
  }, [user]);

  if (loading || !user) return null;

  const name = user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'User';
  const initials = name.split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase();

  const handleDeleteDesign = async (id: string) => {
    if (!window.confirm('Delete this design? This cannot be undone.')) return;
    await deleteDesign(id);
    setDesigns(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080808', fontFamily: sans }}>
      {/* Nav */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: mono }}>← Home</Link>
        <span style={{ fontFamily: fraunces, fontSize: 16, fontStyle: 'italic', color: '#fff' }}>My Account</span>
        <button onClick={signOut} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: mono, cursor: 'pointer' }}>
          Sign Out
        </button>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '36px 24px' }}>
        {/* Profile header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fraunces, fontSize: 22, color: '#fff' }}>
            {initials}
          </div>
          <div>
            <div style={{ fontFamily: fraunces, fontSize: 22, fontStyle: 'italic', color: '#fff', marginBottom: 2 }}>{name}</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{user.email}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <Link to="/lab" style={{ padding: '10px 18px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', textDecoration: 'none', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: mono }}>
              Open Lab
            </Link>
            <Link to="/ar" search={{ color: undefined, shape: undefined, length: undefined }} style={{ padding: '10px 18px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', textDecoration: 'none', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: mono }}>
              AR Try-On
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 36 }}>
          {[
            { label: 'Saved Designs', value: designs.length },
            { label: 'Appointments', value: appointments.length },
            { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length },
          ].map(s => (
            <div key={s.label} style={{ padding: '16px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
              <div style={{ fontFamily: fraunces, fontSize: 28, fontStyle: 'italic', color: '#fff', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: mono }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, overflow: 'hidden', width: 'fit-content' }}>
          {(['designs', 'appointments'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '9px 22px', border: 'none', cursor: 'pointer', fontSize: 9,
              letterSpacing: 2, textTransform: 'uppercase', fontFamily: mono,
              background: tab === t ? '#fff' : 'transparent',
              color: tab === t ? '#000' : 'rgba(255,255,255,0.4)',
            }}>
              {t === 'designs' ? `Designs (${designs.length})` : `Appointments (${appointments.length})`}
            </button>
          ))}
        </div>

        {fetching && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: mono, padding: '20px 0' }}>Loading…</div>}

        {/* Designs */}
        {!fetching && tab === 'designs' && (
          <div>
            {designs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
                <div style={{ fontFamily: fraunces, fontSize: 20, fontStyle: 'italic', marginBottom: 8 }}>No saved designs yet.</div>
                <Link to="/lab" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: mono }}>Open Lab →</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {designs.map(d => (
                  <div key={d.id} style={{ padding: '16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                    <div style={{ fontFamily: fraunces, fontSize: 15, fontStyle: 'italic', color: '#fff', marginBottom: 6 }}>{d.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: mono, letterSpacing: 1 }}>{d.shape} · {d.length}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: mono, marginTop: 3 }}>{d.material}</div>
                    <div style={{ marginTop: 14, display: 'flex', gap: 6 }}>
                      <Link
                        to="/book"
                        search={{ designId: d.id }}
                        style={{ flex: 1, padding: '7px 0', borderRadius: 100, background: '#fff', color: '#000', textDecoration: 'none', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: mono, fontWeight: 700, textAlign: 'center', display: 'block' }}>
                        Book
                      </Link>
                      <button onClick={() => handleDeleteDesign(d.id)} aria-label="Delete design" style={{ padding: '7px 10px', borderRadius: 100, background: 'transparent', border: '1px solid rgba(255,80,80,0.25)', color: 'rgba(255,80,80,0.6)', fontSize: 9, fontFamily: mono, cursor: 'pointer' }}>
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Appointments */}
        {!fetching && tab === 'appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
                <div style={{ fontFamily: fraunces, fontSize: 20, fontStyle: 'italic', marginBottom: 8 }}>No appointments yet.</div>
                <Link to="/book" search={{ designId: undefined }} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: mono }}>Book Now →</Link>
              </div>
            ) : appointments.map(a => (
              <div key={a.id} style={{ padding: '16px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 13, color: '#fff', fontWeight: 500, marginBottom: 3 }}>
                    {(a.artist as unknown as { name?: string })?.name ?? 'Artist'} · {a.time_slot}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: mono }}>{a.date}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 13, color: '#fff', fontFamily: fraunces, fontStyle: 'italic' }}>{a.price} EUR</div>
                  <div style={{ padding: '4px 10px', borderRadius: 100, background: `${STATUS_COLORS[a.status]}22`, border: `1px solid ${STATUS_COLORS[a.status]}`, color: STATUS_COLORS[a.status], fontSize: 9, fontFamily: mono, letterSpacing: 1, textTransform: 'uppercase' }}>
                    {a.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
