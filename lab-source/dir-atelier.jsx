// Direction 1 — ATELIER
// Vogue-coded editorial. Serif wordmark, generous white-on-black,
// nail object centered like a museum piece.

const atelierStyles = {
  font: '"Cormorant Garamond", "Times New Roman", serif',
  sans: '"Inter", "Helvetica Neue", sans-serif',
  bg: '#0a0a0a',
  ink: '#fff',
  muted: 'rgba(255,255,255,0.42)',
  hair: 'rgba(255,255,255,0.12)',
};

function AtelierStatusBar() {
  return (
    <div style={{
      height: 50, padding: '0 28px',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      paddingBottom: 8,
      color: '#fff', fontFamily: atelierStyles.sans, fontSize: 14, fontWeight: 600,
    }}>
      <span>9:41</span>
      <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ display: 'inline-flex', gap: 2 }}>
          {[3,5,7,9].map((h, i) => <span key={i} style={{ width: 3, height: h, background: '#fff', borderRadius: 1 }} />)}
        </span>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 4 a6 6 0 0 1 12 0" stroke="#fff" strokeWidth="1.2" /><path d="M3 6 a3.5 3.5 0 0 1 8 0" stroke="#fff" strokeWidth="1.2" /><circle cx="7" cy="8.5" r="0.8" fill="#fff" /></svg>
        <span style={{ display: 'inline-block', width: 22, height: 10, border: '1px solid #fff', borderRadius: 2, padding: 1, position: 'relative' }}>
          <span style={{ display: 'block', width: '78%', height: '100%', background: '#fff' }} />
        </span>
      </span>
    </div>
  );
}

function AtelierHomeIndicator() {
  return <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 134, height: 5, borderRadius: 3, background: '#fff' }} />;
}

// ─────────────────────────────────────────────────────────────
// SCREEN A · Lab home — the canvas
// ─────────────────────────────────────────────────────────────
function AtelierLab() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: atelierStyles.bg, color: atelierStyles.ink, fontFamily: atelierStyles.sans, overflow: 'hidden' }}>
      <AtelierStatusBar />

      {/* top chrome */}
      <div style={{ padding: '6px 24px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button style={{ background: 'none', border: 'none', color: '#fff', fontFamily: atelierStyles.sans, fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', opacity: 0.7 }}>← Inspire</button>
        <span style={{ fontFamily: atelierStyles.font, fontStyle: 'italic', fontSize: 15, letterSpacing: 0.5 }}>Lab</span>
        <button style={{ background: 'none', border: 'none', color: '#fff', fontFamily: atelierStyles.sans, fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', opacity: 0.7 }}>Save</button>
      </div>

      {/* hairline */}
      <div style={{ height: 1, background: atelierStyles.hair, margin: '0 24px' }} />

      {/* editorial title */}
      <div style={{ padding: '32px 28px 8px' }}>
        <div style={{ fontFamily: atelierStyles.sans, fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: atelierStyles.muted }}>Édition n°04 · Spring 2026</div>
        <div style={{ fontFamily: atelierStyles.font, fontStyle: 'italic', fontSize: 44, lineHeight: 0.95, fontWeight: 300, marginTop: 14, textWrap: 'balance' }}>
          The Onyx<br/>Almond.
        </div>
        <div style={{ fontFamily: atelierStyles.font, fontSize: 13, color: atelierStyles.muted, marginTop: 10, fontStyle: 'italic' }}>
          A study in length, finished in liquid black.
        </div>
      </div>

      {/* hero render — single hand-of-five floating in space */}
      <div style={{ position: 'relative', height: 290, margin: '12px 0 4px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
        {/* soft platform */}
        <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', width: 280, height: 24, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.08), transparent 70%)' }} />
        <div style={{ transform: 'scale(1.05)', transformOrigin: 'bottom center' }}>
          <HandLayout shape="almond" material="onyx" length="long" />
        </div>
        {/* corner crops */}
        {['tl','tr','bl','br'].map((c) => (
          <div key={c} style={{
            position: 'absolute',
            ...(c.includes('t') ? { top: 14 } : { bottom: 14 }),
            ...(c.includes('l') ? { left: 24 } : { right: 24 }),
            width: 14, height: 14,
            borderTop: c.includes('t') ? `1px solid ${atelierStyles.hair}` : 'none',
            borderBottom: c.includes('b') ? `1px solid ${atelierStyles.hair}` : 'none',
            borderLeft: c.includes('l') ? `1px solid ${atelierStyles.hair}` : 'none',
            borderRight: c.includes('r') ? `1px solid ${atelierStyles.hair}` : 'none',
          }} />
        ))}
      </div>

      {/* spec readout — editorial caption block */}
      <div style={{ margin: '8px 28px', borderTop: `1px solid ${atelierStyles.hair}`, paddingTop: 14, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        {[
          ['Shape', 'Almond'],
          ['Length', 'Long'],
          ['Finish', 'Onyx'],
          ['Detail', '— None'],
        ].map(([k,v], i) => (
          <div key={i}>
            <div style={{ fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: atelierStyles.muted }}>{k}</div>
            <div style={{ fontFamily: atelierStyles.font, fontSize: 16, fontStyle: 'italic', marginTop: 4 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* tabs */}
      <div style={{ position: 'absolute', bottom: 70, left: 24, right: 24 }}>
        <div style={{ display: 'flex', gap: 0, fontSize: 9, letterSpacing: 2.4, textTransform: 'uppercase' }}>
          {['Shape', 'Length', 'Finish', 'Detail', 'Set'].map((t, i) => (
            <div key={t} style={{
              flex: 1, textAlign: 'center', padding: '12px 0',
              borderTop: i === 2 ? '1px solid #fff' : `1px solid ${atelierStyles.hair}`,
              color: i === 2 ? '#fff' : atelierStyles.muted,
              fontWeight: i === 2 ? 600 : 400,
            }}>{t}</div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: 'absolute', bottom: 22, left: 24, right: 24, display: 'flex', gap: 10 }}>
        <button style={{
          flex: 1, padding: '14px 0', background: '#fff', color: '#000',
          border: 'none', fontFamily: atelierStyles.sans, fontSize: 11, letterSpacing: 2.4, textTransform: 'uppercase', fontWeight: 600,
        }}>Book this</button>
        <button style={{
          width: 50, padding: '14px 0', background: 'transparent', color: '#fff',
          border: `1px solid ${atelierStyles.hair}`, fontFamily: atelierStyles.font, fontStyle: 'italic', fontSize: 16,
        }}>♡</button>
      </div>

      <AtelierHomeIndicator />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN B · Finish picker (active "Finish" tab)
// ─────────────────────────────────────────────────────────────
function AtelierFinish() {
  const finishes = [
    { name: 'Onyx', sub: 'Liquid black', mat: 'onyx', sel: false },
    { name: 'Chrome', sub: 'Mirror polish', mat: 'chrome', sel: true },
    { name: 'Pearl', sub: 'Cream lacquer', mat: 'pearl', sel: false },
    { name: 'Crystal', sub: 'Optical glass', mat: 'crystal', sel: false },
    { name: 'Bordeaux', sub: 'Dark rouge', mat: 'blood', sel: false },
    { name: 'Bone', sub: 'Matte ivory', mat: 'bone', sel: false },
  ];
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: atelierStyles.bg, color: '#fff', fontFamily: atelierStyles.sans, overflow: 'hidden' }}>
      <AtelierStatusBar />
      <div style={{ padding: '6px 24px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', opacity: 0.7 }}>← Lab</button>
        <span style={{ fontFamily: atelierStyles.font, fontStyle: 'italic', fontSize: 15 }}>Finish</span>
        <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', opacity: 0.7 }}>Done</button>
      </div>
      <div style={{ height: 1, background: atelierStyles.hair, margin: '0 24px' }} />

      {/* mini hero with current selection */}
      <div style={{ height: 180, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 18, left: 28, fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: atelierStyles.muted }}>Preview · Index</div>
        <NailRender shape="almond" length="long" material="chrome" width={68} />
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <div style={{ fontFamily: atelierStyles.font, fontStyle: 'italic', fontSize: 22 }}>Chrome</div>
          <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: atelierStyles.muted, marginTop: 2 }}>Mirror polish</div>
        </div>
      </div>

      {/* finish list — editorial table */}
      <div style={{ margin: '20px 24px 0', borderTop: `1px solid ${atelierStyles.hair}` }}>
        {finishes.map((f, i) => (
          <div key={f.name} style={{
            display: 'grid', gridTemplateColumns: '40px 1fr auto', alignItems: 'center',
            padding: '14px 0', borderBottom: `1px solid ${atelierStyles.hair}`,
          }}>
            <NailRender shape="almond" length="short" material={f.mat} width={22} />
            <div style={{ paddingLeft: 14 }}>
              <div style={{ fontFamily: atelierStyles.font, fontSize: 18, fontStyle: f.sel ? 'italic' : 'normal' }}>{f.name}</div>
              <div style={{ fontSize: 9, letterSpacing: 1.6, textTransform: 'uppercase', color: atelierStyles.muted, marginTop: 2 }}>{f.sub}</div>
            </div>
            <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: f.sel ? '#fff' : atelierStyles.muted }}>
              {f.sel ? 'Selected' : '—'}
            </div>
          </div>
        ))}
      </div>

      <AtelierHomeIndicator />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN C · Booking — design-aware
// ─────────────────────────────────────────────────────────────
function AtelierBooking() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: atelierStyles.bg, color: '#fff', fontFamily: atelierStyles.sans, overflow: 'hidden' }}>
      <AtelierStatusBar />
      <div style={{ padding: '6px 24px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', opacity: 0.7 }}>← Edit</button>
        <span style={{ fontFamily: atelierStyles.font, fontStyle: 'italic', fontSize: 15 }}>Reserve</span>
        <span style={{ width: 30 }} />
      </div>
      <div style={{ height: 1, background: atelierStyles.hair, margin: '0 24px' }} />

      {/* design ticket */}
      <div style={{ margin: '22px 24px', padding: '18px 18px 16px', border: `1px solid ${atelierStyles.hair}`, position: 'relative' }}>
        <div style={{ position: 'absolute', top: -8, left: 14, background: atelierStyles.bg, padding: '0 8px', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: atelierStyles.muted }}>Your Design</div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end' }}>
          <div style={{ width: 90, height: 100, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
            <HandLayout shape="almond" material="chrome" length="long" scale={0.42} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: atelierStyles.font, fontStyle: 'italic', fontSize: 22, lineHeight: 1 }}>Onyx<br/>Almond, Long</div>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: atelierStyles.muted, marginTop: 8 }}>Ref · LP-0407</div>
          </div>
        </div>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, paddingTop: 12, borderTop: `1px solid ${atelierStyles.hair}` }}>
          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: atelierStyles.muted }}>Time</div>
            <div style={{ fontFamily: atelierStyles.font, fontSize: 16, fontStyle: 'italic' }}>2h 10m</div>
          </div>
          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: atelierStyles.muted }}>Tier</div>
            <div style={{ fontFamily: atelierStyles.font, fontSize: 16, fontStyle: 'italic' }}>II · Studio</div>
          </div>
          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: atelierStyles.muted }}>Price</div>
            <div style={{ fontFamily: atelierStyles.font, fontSize: 16, fontStyle: 'italic' }}>€140</div>
          </div>
        </div>
      </div>

      {/* artist row */}
      <div style={{ padding: '0 24px' }}>
        <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: atelierStyles.muted, marginBottom: 10 }}>Suggested artist</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderTop: `1px solid ${atelierStyles.hair}`, borderBottom: `1px solid ${atelierStyles.hair}` }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#3a3a3e,#0a0a0a)', border: '1px solid rgba(255,255,255,0.2)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: atelierStyles.font, fontStyle: 'italic', fontSize: 17 }}>Inès M.</div>
            <div style={{ fontSize: 9, letterSpacing: 1.6, textTransform: 'uppercase', color: atelierStyles.muted }}>Studio Marais · 142 designs</div>
          </div>
          <div style={{ fontFamily: atelierStyles.font, fontStyle: 'italic', fontSize: 14 }}>4.96</div>
        </div>
      </div>

      {/* slots */}
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: atelierStyles.muted, marginBottom: 12 }}>Thursday · 7 May</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
          {['10:00','11:30','14:00','15:30','17:00','18:30'].map((t, i) => (
            <div key={t} style={{
              padding: '10px 0', textAlign: 'center', fontFamily: atelierStyles.font, fontSize: 14, fontStyle: 'italic',
              border: `1px solid ${i === 2 ? '#fff' : atelierStyles.hair}`,
              background: i === 2 ? '#fff' : 'transparent', color: i === 2 ? '#000' : '#fff',
            }}>{t}</div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 22, left: 24, right: 24 }}>
        <button style={{
          width: '100%', padding: '14px 0', background: '#fff', color: '#000',
          border: 'none', fontFamily: atelierStyles.sans, fontSize: 11, letterSpacing: 2.4, textTransform: 'uppercase', fontWeight: 600,
        }}>Reserve · 14:00</button>
      </div>

      <AtelierHomeIndicator />
    </div>
  );
}

Object.assign(window, { AtelierLab, AtelierFinish, AtelierBooking });
