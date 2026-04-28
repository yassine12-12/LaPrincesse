// Direction 3 — VITRINE
// Gallery vitrine. The nail object is the hero, framed like a sculpture
// in a glass case. Big serif italic, soft chrome platforms, sparse UI.

const vitrineStyles = {
  display: '"Cormorant Garamond", "Times New Roman", serif',
  sans: '"Inter", "Helvetica Neue", sans-serif',
  bg: '#0c0c0e',
  case: 'linear-gradient(180deg, #14141a 0%, #08080a 100%)',
  ink: '#f5f5f7',
  muted: 'rgba(245,245,247,0.45)',
  hair: 'rgba(245,245,247,0.1)',
};

function VStatus() {
  return (
    <div style={{
      height: 50, padding: '0 26px',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 8,
      color: '#fff', fontFamily: vitrineStyles.sans, fontSize: 14, fontWeight: 600,
    }}>
      <span>9:41</span>
      <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ display: 'inline-flex', gap: 2 }}>{[3,5,7,9].map((h, i) => <span key={i} style={{ width: 3, height: h, background: '#fff', borderRadius: 1 }} />)}</span>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 4 a6 6 0 0 1 12 0" stroke="#fff" strokeWidth="1.2" /><path d="M3 6 a3.5 3.5 0 0 1 8 0" stroke="#fff" strokeWidth="1.2" /><circle cx="7" cy="8.5" r="0.8" fill="#fff" /></svg>
        <span style={{ display: 'inline-block', width: 22, height: 10, border: '1px solid #fff', borderRadius: 2, padding: 1 }}>
          <span style={{ display: 'block', width: '78%', height: '100%', background: '#fff' }} />
        </span>
      </span>
    </div>
  );
}

function VHome() {
  return <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 134, height: 5, borderRadius: 3, background: '#fff' }} />;
}

// ─────────────────────────────────────────────────────────────
// SCREEN A · Vitrine — single-finger sculpture in a case
// ─────────────────────────────────────────────────────────────
function VitrineLab() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: vitrineStyles.bg, color: vitrineStyles.ink, fontFamily: vitrineStyles.sans, overflow: 'hidden' }}>
      <VStatus />

      {/* minimal top */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 26px 12px' }}>
        <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 16 }}>×</button>
        <div style={{ fontFamily: vitrineStyles.display, fontStyle: 'italic', fontSize: 18, letterSpacing: 0.5 }}>la<span style={{ fontWeight: 500 }}>P</span>rincesse</div>
        <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 16 }}>⋯</button>
      </div>

      {/* the vitrine */}
      <div style={{ position: 'relative', margin: '12px 22px 0', height: 460, background: vitrineStyles.case, borderRadius: 2, overflow: 'hidden', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }}>
        {/* ambient lights */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 70, background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(255,255,255,0.18), transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: 100, left: '50%', transform: 'translateX(-50%)', width: 220, height: 50, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.18), transparent 70%)' }} />

        {/* tag, top left */}
        <div style={{ position: 'absolute', top: 18, left: 18, fontSize: 9, letterSpacing: 2.4, textTransform: 'uppercase', color: vitrineStyles.muted }}>
          <div>N° 04 · LP-04</div>
          <div style={{ marginTop: 2 }}>Almond · Long</div>
        </div>
        <div style={{ position: 'absolute', top: 18, right: 18, textAlign: 'right', fontSize: 9, letterSpacing: 2.4, textTransform: 'uppercase', color: vitrineStyles.muted }}>
          <div>Onyx</div>
          <div style={{ marginTop: 2 }}>Mirror finish</div>
        </div>

        {/* the object — single nail, very large */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -55%)' }}>
          <NailRender shape="almond" length="xlong" material="onyx" width={130} chromeStripe={false} />
          {/* shadow on plinth */}
          <div style={{ position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%)', width: 110, height: 14, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,0.7), transparent 70%)', filter: 'blur(2px)' }} />
        </div>

        {/* plinth */}
        <div style={{ position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)', width: 180, height: 4, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />
        <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', width: 220, height: 30, background: 'linear-gradient(180deg, rgba(255,255,255,0.04), transparent)' }} />

        {/* tactile dots — rotation hint */}
        <div style={{ position: 'absolute', bottom: 18, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5 }}>
          {[0,1,2,3,4].map((i) => (
            <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: i === 2 ? '#fff' : 'rgba(255,255,255,0.25)' }} />
          ))}
        </div>
      </div>

      {/* caption */}
      <div style={{ padding: '20px 26px 0', textAlign: 'center' }}>
        <div style={{ fontFamily: vitrineStyles.display, fontStyle: 'italic', fontSize: 30, lineHeight: 1, fontWeight: 300 }}>
          Onyx, undressed.
        </div>
      </div>

      {/* bottom dock */}
      <div style={{ position: 'absolute', bottom: 24, left: 22, right: 22, display: 'flex', gap: 8, alignItems: 'center', padding: 6, background: 'rgba(20,20,24,0.8)', backdropFilter: 'blur(20px)', border: `1px solid ${vitrineStyles.hair}`, borderRadius: 100 }}>
        {[
          { l: 'Shape', v: 'Almond' },
          { l: 'Length', v: 'Long' },
          { l: 'Finish', v: 'Onyx', sel: true },
          { l: 'Detail', v: '—' },
        ].map((c, i) => (
          <div key={i} style={{
            flex: 1, padding: '8px 0', textAlign: 'center', borderRadius: 100,
            background: c.sel ? '#fff' : 'transparent', color: c.sel ? '#000' : '#fff',
          }}>
            <div style={{ fontSize: 7.5, letterSpacing: 1.6, textTransform: 'uppercase', opacity: c.sel ? 0.6 : 0.5 }}>{c.l}</div>
            <div style={{ fontFamily: vitrineStyles.display, fontStyle: 'italic', fontSize: 14, marginTop: 1 }}>{c.v}</div>
          </div>
        ))}
      </div>

      <VHome />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN B · Detail editor — gem placement, slow & focused
// ─────────────────────────────────────────────────────────────
function VitrineDetail() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: vitrineStyles.bg, color: '#fff', fontFamily: vitrineStyles.sans, overflow: 'hidden' }}>
      <VStatus />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 26px 12px' }}>
        <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 14 }}>‹</button>
        <div style={{ fontFamily: vitrineStyles.display, fontStyle: 'italic', fontSize: 18 }}>Detail</div>
        <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 11, fontFamily: vitrineStyles.sans, letterSpacing: 1.6, textTransform: 'uppercase' }}>Apply</button>
      </div>

      {/* focused single nail with hot-spots */}
      <div style={{ position: 'relative', margin: '0 22px', height: 320, background: vitrineStyles.case, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 70, background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(255,255,255,0.16), transparent 70%)' }} />

        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div style={{ position: 'relative' }}>
            <NailRender shape="almond" length="xlong" material="onyx" width={120} gem={true} />
            {/* annotation lines */}
            <svg width="220" height="220" style={{ position: 'absolute', top: -50, left: -50, pointerEvents: 'none' }}>
              <line x1="110" y1="130" x2="190" y2="60" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <circle cx="190" cy="60" r="3" fill="#fff" />
            </svg>
            <div style={{ position: 'absolute', top: -50, right: -120, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: '#fff', fontFamily: vitrineStyles.sans }}>
              <div style={{ opacity: 0.5 }}>Gem · 01</div>
              <div style={{ fontFamily: vitrineStyles.display, fontStyle: 'italic', fontSize: 14, textTransform: 'none', letterSpacing: 0, marginTop: 2 }}>Crystal 2.0</div>
            </div>
          </div>
        </div>
      </div>

      {/* gem palette */}
      <div style={{ padding: '24px 26px 0' }}>
        <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: vitrineStyles.muted, marginBottom: 12 }}>Stones</div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
          {[
            { n: 'Crystal', sel: true },
            { n: 'Pearl' },
            { n: 'Onyx' },
            { n: 'Smoke' },
            { n: 'Ruby' },
          ].map((s, i) => (
            <div key={s.n} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                width: 38, height: 38, margin: '0 auto', borderRadius: '50%',
                background: ['radial-gradient(circle at 35% 30%, #fff 0%, #d8d8de 30%, #6a6a72 70%, #fff 100%)',
                             'radial-gradient(circle at 35% 30%, #fff 0%, #f3ecdf 50%, #c8b8a0 100%)',
                             'radial-gradient(circle at 35% 30%, #4a4a4e 0%, #0a0a0a 60%, #2a2a2e 100%)',
                             'radial-gradient(circle at 35% 30%, #aaa 0%, #444 60%, #888 100%)',
                             'radial-gradient(circle at 35% 30%, #ffaaaa 0%, #5a0a0e 60%, #aa3a3e 100%)'][i],
                border: s.sel ? '1px solid #fff' : `1px solid ${vitrineStyles.hair}`,
                boxShadow: s.sel ? '0 0 0 4px rgba(255,255,255,0.05)' : 'none',
              }} />
              <div style={{ fontFamily: vitrineStyles.display, fontStyle: 'italic', fontSize: 13, marginTop: 8, opacity: s.sel ? 1 : 0.6 }}>{s.n}</div>
            </div>
          ))}
        </div>
      </div>

      {/* size scrubber */}
      <div style={{ padding: '24px 26px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: vitrineStyles.muted }}>
          <span>Size</span><span style={{ color: '#fff', fontFamily: vitrineStyles.display, fontStyle: 'italic', textTransform: 'none', fontSize: 13, letterSpacing: 0 }}>2.0 mm</span>
        </div>
        <div style={{ marginTop: 10, height: 1, background: vitrineStyles.hair, position: 'relative' }}>
          <div style={{ position: 'absolute', left: '36%', top: -5, width: 1, height: 11, background: '#fff' }} />
          {[0,1,2,3,4,5,6,7,8,9].map((i) => (
            <div key={i} style={{ position: 'absolute', left: `${i*11}%`, top: -3, width: 1, height: 7, background: i === 3 ? '#fff' : vitrineStyles.muted, opacity: i === 3 ? 1 : 0.4 }} />
          ))}
        </div>
      </div>

      <VHome />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN C · Archive (the user's saved designs as a vitrine grid)
// ─────────────────────────────────────────────────────────────
function VitrineArchive() {
  const designs = [
    { mat: 'onyx', name: 'Onyx', shape: 'almond', date: '04 · 26' },
    { mat: 'chrome', name: 'Chrome', shape: 'coffin', date: '03 · 26' },
    { mat: 'pearl', name: 'Pearl', shape: 'oval', date: '02 · 26' },
    { mat: 'blood', name: 'Bordeaux', shape: 'almond', date: '01 · 26' },
    { mat: 'crystal', name: 'Crystal', shape: 'stiletto', date: '12 · 25' },
    { mat: 'bone', name: 'Bone', shape: 'square', date: '11 · 25' },
  ];
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: vitrineStyles.bg, color: '#fff', fontFamily: vitrineStyles.sans, overflow: 'hidden' }}>
      <VStatus />
      <div style={{ padding: '8px 26px 0' }}>
        <div style={{ fontSize: 9, letterSpacing: 2.4, textTransform: 'uppercase', color: vitrineStyles.muted }}>—  Camille R.</div>
        <div style={{ fontFamily: vitrineStyles.display, fontStyle: 'italic', fontSize: 38, lineHeight: 1, marginTop: 8, fontWeight: 300 }}>
          Archive.
        </div>
        <div style={{ fontSize: 11, color: vitrineStyles.muted, marginTop: 8, fontFamily: vitrineStyles.display, fontStyle: 'italic' }}>
          24 designs · 6 worn · private
        </div>
      </div>

      {/* filter row */}
      <div style={{ display: 'flex', gap: 14, padding: '20px 26px 12px', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>
        {['All','Worn','Saved','Remixed'].map((t, i) => (
          <span key={t} style={{ color: i === 0 ? '#fff' : vitrineStyles.muted, borderBottom: i === 0 ? '1px solid #fff' : 'none', paddingBottom: 4 }}>{t}</span>
        ))}
      </div>

      {/* grid of vitrines */}
      <div style={{ padding: '0 22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {designs.map((d, i) => (
          <div key={i} style={{ aspectRatio: '0.78', background: vitrineStyles.case, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 40, background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(255,255,255,0.14), transparent 70%)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -55%)' }}>
              <NailRender shape={d.shape} length="long" material={d.mat} width={48} />
            </div>
            <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontFamily: vitrineStyles.display, fontStyle: 'italic', fontSize: 14 }}>{d.name}</div>
                <div style={{ fontSize: 8, letterSpacing: 1.6, textTransform: 'uppercase', color: vitrineStyles.muted, marginTop: 1 }}>{d.shape}</div>
              </div>
              <div style={{ fontSize: 8, letterSpacing: 1.6, color: vitrineStyles.muted }}>{d.date}</div>
            </div>
            {i === 1 && <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 7, letterSpacing: 1.6, textTransform: 'uppercase', padding: '2px 6px', border: `1px solid ${vitrineStyles.hair}`, color: vitrineStyles.muted }}>Worn</div>}
          </div>
        ))}
      </div>

      <VHome />
    </div>
  );
}

Object.assign(window, { VitrineLab, VitrineDetail, VitrineArchive });
