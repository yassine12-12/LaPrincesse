import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { getAllAppointments, updateAppointmentStatus, getArtists, supabase } from '@/lib/supabase';
import type { Appointment, Artist } from '@/lib/supabase';

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [
      { title: 'Admin — LaPrincesse' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminPage,
});

const fraunces = '"Fraunces", "Georgia", serif';
const mono = '"JetBrains Mono", ui-monospace, monospace';
const sans = '"Inter", "Helvetica Neue", sans-serif';

const STATUS_COLORS: Record<string, string> = {
  pending:   '#ffc840',
  confirmed: '#50dc78',
  completed: '#78a0ff',
  cancelled: '#ff5050',
};

// Admin route is protected by Cloudflare Access at the edge.
// Configure a Cloudflare Access policy in the Zero Trust dashboard:
//   Application → Self-hosted → Path: /admin* → Policy: email matches allowed list.
// This component does a secondary check to ensure users who somehow bypass edge protection
// are still rejected at the app level.
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? 'admin@laprincesse.com,contact@laprincesse.com')
  .split(',')
  .map((e: string) => e.trim())
  .filter(Boolean);

function AdminPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'overview' | 'appointments' | 'artists'>('overview');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [fetching, setFetching] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Auth guard
  useEffect(() => {
    if (!loading && (!user || !ADMIN_EMAILS.includes(user.email ?? ''))) {
      navigate({ to: '/' });
    }
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    Promise.all([
      getAllAppointments(),
      getArtists(),
    ]).then(([a, ar]) => {
      setAppointments(a.data ?? []);
      setArtists(ar.data ?? []);
      setFetching(false);
    });
    // User count (admin only endpoint)
    if (supabase) {
      supabase.from('profiles').select('id', { count: 'exact', head: true })
        .then(({ count }) => setUserCount(count));
    }
  }, [user]);

  if (loading || !user) return null;

  const totalRevenue = appointments.filter(a => a.status !== 'cancelled').reduce((s, a) => s + (a.price ?? 0), 0);
  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const filteredAppts = statusFilter === 'all' ? appointments : appointments.filter(a => a.status === statusFilter);

  const handleStatusChange = async (id: string, status: Appointment['status']) => {
    await updateAppointmentStatus(id, status);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080808', fontFamily: sans }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: mono }}>← Site</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#50dc78' }} />
          <span style={{ fontFamily: fraunces, fontSize: 16, fontStyle: 'italic', color: '#fff' }}>Admin</span>
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: mono }}>{user.email}</div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 28px' }}>
        {(['overview', 'appointments', 'artists'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '14px 20px', border: 'none', cursor: 'pointer',
            background: 'transparent', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: mono,
            color: tab === t ? '#fff' : 'rgba(255,255,255,0.35)',
            borderBottom: tab === t ? '2px solid #fff' : '2px solid transparent',
          }}>
            {t}
            {t === 'appointments' && pendingCount > 0 && (
              <span style={{ marginLeft: 6, background: '#ffc840', color: '#000', borderRadius: '50%', width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
        {fetching && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: mono }}>Loading…</div>}

        {/* Overview */}
        {!fetching && tab === 'overview' && (
          <div>
            <h2 style={{ fontFamily: fraunces, fontSize: 26, fontStyle: 'italic', fontWeight: 300, color: '#fff', marginBottom: 28 }}>Dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 36 }}>
              {[
                { label: 'Total Bookings',   value: appointments.length },
                { label: 'Pending',          value: pendingCount, warn: pendingCount > 0 },
                { label: 'Revenue (EUR)',     value: `${totalRevenue.toLocaleString()}` },
                { label: 'Registered Users', value: userCount ?? '—' },
                { label: 'Artists',          value: artists.length },
                { label: 'Completed',        value: appointments.filter(a => a.status === 'completed').length },
              ].map(s => (
                <div key={s.label} style={{ padding: '18px', borderRadius: 10, border: `1px solid ${(s as { warn?: boolean }).warn ? 'rgba(255,200,64,0.3)' : 'rgba(255,255,255,0.08)'}`, background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontFamily: fraunces, fontSize: 30, fontStyle: 'italic', color: (s as { warn?: boolean }).warn ? '#ffc840' : '#fff', marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: mono }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent appointments */}
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: mono, marginBottom: 12 }}>Recent · Pending</div>
              {appointments.filter(a => a.status === 'pending').slice(0, 5).map(a => (
                <AppointmentRow key={a.id} appt={a} onStatusChange={handleStatusChange} />
              ))}
              {appointments.filter(a => a.status === 'pending').length === 0 && (
                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, padding: '16px 0' }}>No pending appointments.</div>
              )}
            </div>
          </div>
        )}

        {/* Appointments */}
        {!fetching && tab === 'appointments' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontFamily: fraunces, fontSize: 26, fontStyle: 'italic', fontWeight: 300, color: '#fff', margin: 0 }}>Appointments</h2>
              <div style={{ display: 'flex', gap: 6 }}>
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)} style={{
                    padding: '6px 12px', borderRadius: 100, fontSize: 9, letterSpacing: 1.5, textTransform: 'capitalize',
                    fontFamily: mono, cursor: 'pointer',
                    border: statusFilter === s ? '1px solid #fff' : '1px solid rgba(255,255,255,0.12)',
                    background: statusFilter === s ? '#fff' : 'transparent',
                    color: statusFilter === s ? '#000' : 'rgba(255,255,255,0.45)',
                  }}>{s}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredAppts.length === 0 && <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, padding: '16px 0' }}>No appointments found.</div>}
              {filteredAppts.map(a => (
                <AppointmentRow key={a.id} appt={a} onStatusChange={handleStatusChange} showUserId />
              ))}
            </div>
          </div>
        )}

        {/* Artists */}
        {!fetching && tab === 'artists' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontFamily: fraunces, fontSize: 26, fontStyle: 'italic', fontWeight: 300, color: '#fff', margin: 0 }}>Artists</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {artists.map(a => (
                <div key={a.id} style={{ padding: '18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fraunces, fontSize: 16, color: '#fff' }}>
                      {a.name[0]}
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{a.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{a.studio} · {a.location}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: 12, color: '#fff', fontFamily: mono }}>★ {a.rating.toFixed(2)}</div>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, lineHeight: 1.5, marginBottom: 10 }}>{a.bio}</div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {a.specialties.map(s => (
                      <span key={s} style={{ padding: '3px 8px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.5)', fontSize: 9, fontFamily: mono, letterSpacing: 1 }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 9, letterSpacing: 1, fontFamily: mono, color: a.available ? '#50dc78' : 'rgba(255,80,80,0.6)', textTransform: 'uppercase' }}>
                      {a.available ? '● Available' : '● Unavailable'}
                    </span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: mono }}>
                      {appointments.filter(ap => ap.artist_id === a.id).length} bookings
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AppointmentRow({ appt, onStatusChange, showUserId }: {
  appt: Appointment;
  onStatusChange: (id: string, status: Appointment['status']) => void;
  showUserId?: boolean;
}) {
  const artistName = (appt.artist as unknown as { name?: string })?.name ?? appt.artist_id.slice(0, 8);

  return (
    <div style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 160 }}>
        <div style={{ fontSize: 13, color: '#fff', marginBottom: 2 }}>{artistName} · {appt.time_slot}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: mono }}>{appt.date}{showUserId ? ` · ${appt.user_id.slice(0,8)}…` : ''}</div>
      </div>
      <div style={{ fontSize: 14, color: '#fff', fontFamily: '"Fraunces", serif', fontStyle: 'italic', flexShrink: 0 }}>{appt.price} EUR</div>
      <select
        value={appt.status}
        onChange={e => onStatusChange(appt.id, e.target.value as Appointment['status'])}
        style={{ padding: '6px 10px', borderRadius: 8, background: `${STATUS_COLORS[appt.status]}18`, border: `1px solid ${STATUS_COLORS[appt.status]}55`, color: STATUS_COLORS[appt.status], fontSize: 10, fontFamily: '"JetBrains Mono", monospace', cursor: 'pointer' }}>
        {(['pending','confirmed','completed','cancelled'] as const).map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}
