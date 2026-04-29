import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { getArtists, createAppointment, getUserDesigns } from '@/lib/supabase';
import type { Artist, Design } from '@/lib/supabase';

export const Route = createFileRoute('/book')({
  head: () => ({
    meta: [
      { title: 'Book an Appointment — LaPrincesse' },
      { name: 'description', content: 'Book a luxury nail appointment with our Paris-based artists. Choose your service, artist, and time.' },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    designId: typeof s.designId === 'string' ? s.designId : undefined,
  }),
  component: BookPage,
});

const fraunces = '"Fraunces", "Georgia", serif';
const mono = '"JetBrains Mono", ui-monospace, monospace';
const sans = '"Inter", "Helvetica Neue", sans-serif';

const SERVICES = [
  { id: 'full-set',     name: 'Full Set',      desc: 'All 10 nails · shape + colour + finish',     price: 85,  duration: '1h 30m' },
  { id: 'gel-overlay',  name: 'Gel Overlay',   desc: 'Gel on natural nails',                        price: 65,  duration: '1h' },
  { id: 'extensions',   name: 'Extensions',    desc: 'Acrylic or hard gel length extensions',       price: 110, duration: '2h' },
  { id: 'nail-art',     name: 'Nail Art',       desc: 'Custom design execution from your Lab file', price: 140, duration: '2h 30m' },
  { id: 'manicure',     name: 'Luxury Manicure', desc: 'Classic manicure with premium polish',      price: 45,  duration: '45m' },
];

const TIME_SLOTS = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00'];

const DAYS_AHEAD = 14;
function getAvailableDates() {
  const dates: Date[] = [];
  const today = new Date();
  for (let i = 1; i <= DAYS_AHEAD; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) dates.push(d); // no Sundays
  }
  return dates;
}

function pad(n: number) { return n < 10 ? '0' + n : n; }
function fmtDate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}
function fmtDateDisplay(d: Date) {
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

type Step = 'service' | 'artist' | 'datetime' | 'confirm' | 'done';

function BookPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { designId } = useSearch({ from: '/book' });

  const [step, setStep] = useState<Step>('service');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [selectedService, setSelectedService] = useState(SERVICES[3]);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(designId ?? null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getArtists().then(({ data }) => setArtists(data ?? []));
    if (user) getUserDesigns(user.id).then(({ data }) => setDesigns(data ?? []));
  }, [user]);

  const availableDates = getAvailableDates();
  const totalPrice = selectedService.price + (selectedArtist && selectedArtist.rating > 4.95 ? 20 : 0);

  const handleConfirm = async () => {
    if (!user) { navigate({ to: '/auth' }); return; }
    if (!selectedArtist || !selectedDate || !selectedSlot) return;
    setSubmitting(true);
    setError(null);
    const { data, error: err } = await createAppointment({
      user_id: user.id,
      artist_id: selectedArtist.id,
      design_id: selectedDesignId,
      date: fmtDate(selectedDate),
      time_slot: selectedSlot,
      status: 'pending',
      price: totalPrice,
      notes: notes || null,
    });
    setSubmitting(false);
    if (err) { setError(err.message); return; }
    setConfirmId(data?.id ?? 'new');
    setStep('done');
  };

  const STEPS: Step[] = ['service','artist','datetime','confirm'];
  const stepIdx = STEPS.indexOf(step);

  if (step === 'done') {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: sans, padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✦</div>
          <h2 style={{ fontFamily: fraunces, fontSize: 32, fontStyle: 'italic', fontWeight: 300, color: '#fff', margin: '0 0 12px' }}>Booking confirmed.</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.6, marginBottom: 6 }}>
            <strong style={{ color: '#fff' }}>{selectedArtist?.name}</strong> · {selectedService.name}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
            {selectedDate && fmtDateDisplay(selectedDate)} at {selectedSlot}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: mono, letterSpacing: 1, marginTop: 8 }}>
            REF · {confirmId?.slice(0,8).toUpperCase() ?? 'LP-NEW'}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 32 }}>
            <Link to="/profile" style={{ padding: '12px 24px', borderRadius: 100, background: '#fff', color: '#000', textDecoration: 'none', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: mono, fontWeight: 700 }}>
              My Appointments
            </Link>
            <Link to="/lab" style={{ padding: '12px 24px', borderRadius: 100, background: 'transparent', color: '#fff', textDecoration: 'none', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: mono, border: '1px solid rgba(255,255,255,0.18)' }}>
              Back to Lab
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', fontFamily: sans }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/lab" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: mono }}>
          ← Lab
        </Link>
        <span style={{ fontFamily: fraunces, fontSize: 16, fontStyle: 'italic', color: '#fff' }}>Book Appointment</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ width: 20, height: 3, borderRadius: 2, background: i <= stepIdx ? '#fff' : 'rgba(255,255,255,0.15)' }} />
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px' }}>

        {/* Step: Service */}
        {step === 'service' && (
          <div>
            <h2 style={{ fontFamily: fraunces, fontSize: 26, fontStyle: 'italic', fontWeight: 300, color: '#fff', marginBottom: 6 }}>Choose service</h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginBottom: 28, fontFamily: sans }}>Select what you'd like to have done.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SERVICES.map(svc => (
                <button key={svc.id} onClick={() => setSelectedService(svc)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 18px', borderRadius: 12,
                  border: selectedService.id === svc.id ? '1px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.10)',
                  background: selectedService.id === svc.id ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer', textAlign: 'left',
                }}>
                  <div>
                    <div style={{ color: '#fff', fontSize: 14, fontWeight: 500, fontFamily: sans, marginBottom: 3 }}>{svc.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{svc.desc}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                    <div style={{ color: '#fff', fontSize: 16, fontFamily: fraunces, fontStyle: 'italic' }}>{svc.price} EUR</div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontFamily: mono }}>{svc.duration}</div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep('artist')} style={nextBtnStyle}>
              Continue →
            </button>
          </div>
        )}

        {/* Step: Artist */}
        {step === 'artist' && (
          <div>
            <h2 style={{ fontFamily: fraunces, fontSize: 26, fontStyle: 'italic', fontWeight: 300, color: '#fff', marginBottom: 6 }}>Choose your artist</h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginBottom: 28 }}>All artists are certified and trained in LaPrincesse techniques.</p>

            {/* Optional: attach saved design */}
            {designs.length > 0 && (
              <div style={{ marginBottom: 24, padding: '14px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: mono, marginBottom: 8 }}>Attach saved design</div>
                <select value={selectedDesignId ?? ''} onChange={e => setSelectedDesignId(e.target.value || null)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontFamily: sans, width: '100%' }}>
                  <option value="">No design attached</option>
                  {designs.map(d => <option key={d.id} value={d.id}>{d.name} · {d.shape}, {d.length}</option>)}
                </select>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {artists.map(a => (
                <button key={a.id} onClick={() => setSelectedArtist(a)} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 12,
                  border: selectedArtist?.id === a.id ? '1px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.10)',
                  background: selectedArtist?.id === a.id ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer', textAlign: 'left',
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fraunces, fontSize: 16, color: '#fff', flexShrink: 0 }}>
                    {a.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{a.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{a.studio} · {a.location}</div>
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginTop: 3 }}>{a.specialties.join(' · ')}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ color: '#fff', fontSize: 13, fontFamily: mono }}>★ {a.rating.toFixed(2)}</div>
                    {a.rating > 4.95 && <div style={{ color: 'rgba(255,200,80,0.7)', fontSize: 9, fontFamily: mono, marginTop: 2 }}>+20 EUR</div>}
                  </div>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => setStep('service')} style={backBtnStyle}>← Back</button>
              <button onClick={() => selectedArtist && setStep('datetime')} style={{ ...nextBtnStyle, flex: 1, opacity: selectedArtist ? 1 : 0.4 }}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step: Date + Time */}
        {step === 'datetime' && (
          <div>
            <h2 style={{ fontFamily: fraunces, fontSize: 26, fontStyle: 'italic', fontWeight: 300, color: '#fff', marginBottom: 6 }}>Choose date & time</h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginBottom: 24 }}>With {selectedArtist?.name} at {selectedArtist?.studio}</p>

            {/* Date picker */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: mono, marginBottom: 10 }}>Date</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {availableDates.map(d => (
                  <button key={fmtDate(d)} onClick={() => setSelectedDate(d)} style={{
                    padding: '8px 14px', borderRadius: 8, fontSize: 11, fontFamily: sans, cursor: 'pointer',
                    border: selectedDate && fmtDate(selectedDate) === fmtDate(d) ? '1px solid #fff' : '1px solid rgba(255,255,255,0.12)',
                    background: selectedDate && fmtDate(selectedDate) === fmtDate(d) ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                    color: '#fff',
                  }}>
                    {fmtDateDisplay(d)}
                  </button>
                ))}
              </div>
            </div>

            {/* Time slots */}
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: mono, marginBottom: 10 }}>Time</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {TIME_SLOTS.map(t => (
                  <button key={t} onClick={() => setSelectedSlot(t)} style={{
                    padding: '8px 16px', borderRadius: 8, fontSize: 12, fontFamily: mono, cursor: 'pointer',
                    border: selectedSlot === t ? '1px solid #fff' : '1px solid rgba(255,255,255,0.12)',
                    background: selectedSlot === t ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                    color: '#fff',
                  }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
              <button onClick={() => setStep('artist')} style={backBtnStyle}>← Back</button>
              <button onClick={() => (selectedDate && selectedSlot) && setStep('confirm')} style={{ ...nextBtnStyle, flex: 1, opacity: (selectedDate && selectedSlot) ? 1 : 0.4 }}>Review →</button>
            </div>
          </div>
        )}

        {/* Step: Confirm */}
        {step === 'confirm' && (
          <div>
            <h2 style={{ fontFamily: fraunces, fontSize: 26, fontStyle: 'italic', fontWeight: 300, color: '#fff', marginBottom: 6 }}>Review & confirm</h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginBottom: 28 }}>Check your booking details before confirming.</p>

            <div style={{ padding: '20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.02)', marginBottom: 20 }}>
              {([
                ['Service', selectedService.name],
                ['Artist', `${selectedArtist?.name} · ${selectedArtist?.studio}`],
                ['Location', selectedArtist?.location ?? ''],
                ['Date', selectedDate ? fmtDateDisplay(selectedDate) : ''],
                ['Time', selectedSlot ?? ''],
                ['Duration', selectedService.duration],
                ['Price', `${totalPrice} EUR`],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: mono, letterSpacing: 1 }}>{label.toUpperCase()}</div>
                  <div style={{ color: '#fff', fontSize: 12, fontFamily: sans }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: mono, marginBottom: 6 }}>Notes (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any details for your artist…" rows={3} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: '#fff', fontSize: 12, fontFamily: sans, resize: 'vertical', boxSizing: 'border-box' }} />
            </div>

            {/* Auth warning */}
            {!user && (
              <div style={{ padding: '12px 14px', borderRadius: 8, background: 'rgba(255,200,80,0.10)', border: '1px solid rgba(255,200,80,0.20)', color: 'rgba(255,200,80,0.9)', fontSize: 11, fontFamily: sans, marginBottom: 16 }}>
                You need to sign in to confirm a booking.{' '}
                <Link to="/auth" style={{ color: '#ffd060', textDecoration: 'underline' }}>Sign in →</Link>
              </div>
            )}

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(255,60,60,0.10)', border: '1px solid rgba(255,60,60,0.22)', color: '#ff7070', fontSize: 11, marginBottom: 14 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep('datetime')} style={backBtnStyle}>← Back</button>
              <button onClick={handleConfirm} disabled={submitting} style={{ ...nextBtnStyle, flex: 1, opacity: submitting ? 0.6 : 1 }}>
                {submitting ? 'Confirming…' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const nextBtnStyle: React.CSSProperties = {
  display: 'block', width: '100%', marginTop: 24,
  padding: '14px 0', borderRadius: 100, background: '#fff', color: '#000',
  border: 'none', fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase',
  fontFamily: mono, fontWeight: 700, cursor: 'pointer',
};
const backBtnStyle: React.CSSProperties = {
  padding: '14px 18px', borderRadius: 100, background: 'transparent', color: 'rgba(255,255,255,0.5)',
  border: '1px solid rgba(255,255,255,0.12)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
  fontFamily: mono, cursor: 'pointer', marginTop: 24, whiteSpace: 'nowrap',
};
