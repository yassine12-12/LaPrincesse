// Direction 2 — CHROME LAB
// Technical luxury. Monospace data, precision instrument feel.
// Like a CAD tool that happens to make nails. Brushed metal accents.

const chromeStyles = {
  mono: '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
  sans: '"Inter", "Helvetica Neue", sans-serif',
  display: '"Cormorant Garamond", "Times New Roman", serif',
  bg: '#08080a',
  panel: '#101013',
  ink: '#f4f4f6',
  muted: 'rgba(244,244,246,0.5)',
  faint: 'rgba(244,244,246,0.08)',
  hair: 'rgba(244,244,246,0.14)',
  accent: '#d8d8de',
};

function ChromeStatusBar() {
  return (
    <div style={{
      height: 50, padding: '0 24px',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 8,
      color: '#fff', fontFamily: chromeStyles.mono, fontSize: 13, fontWeight: 500,
    }}>
      <span>09:41</span>
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

function ChromeHomeIndicator() {
  return <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 134, height: 5, borderRadius: 3, background: '#fff' }} />;
}

// Brushed-metal divider
function MetalRule() {
  return <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 20%, rgba(255,255,255,0.18) 80%, transparent)' }} />;
}

// ─────────────────────────────────────────────────────────────
// SCREEN A · Lab — instrument view with 3D viewport + parameter rail
// ─────────────────────────────────────────────────────────────
function ChromeLab() {
  const params = [
    ['SHAPE', 'ALMOND', 0.62],
    ['LENGTH', '+18.0 mm', 0.78],
    ['CURVE_C', '0.42', 0.42],
    ['BED_W', '11.2 mm', 0.55],
  ];
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: chromeStyles.bg, color: chromeStyles.ink, fontFamily: chromeStyles.sans, overflow: 'hidden' }}>
      <ChromeStatusBar />

      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 16px 10px' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ width: 18, height: 18, border: `1px solid ${chromeStyles.hair}`, position: 'relative' }}>
            <span style={{ position: 'absolute', inset: 3, background: 'linear-gradient(135deg,#fff,#5a5a5e)' }} />
          </span>
          <span style={{ fontFamily: chromeStyles.mono, fontSize: 10, letterSpacing: 1.4 }}>LAB · v0.42</span>
        </div>
        <div style={{ fontFamily: chromeStyles.mono, fontSize: 10, color: chromeStyles.muted, letterSpacing: 1.2 }}>UNTITLED · DRAFT</div>
        <div style={{ fontFamily: chromeStyles.mono, fontSize: 10, color: chromeStyles.muted }}>⌘S</div>
      </div>
      <MetalRule />

      {/* viewport */}
      <div style={{ position: 'relative', height: 320, background: 'radial-gradient(circle at 50% 40%, #1a1a1d 0%, #08080a 70%)', overflow: 'hidden' }}>
        {/* grid floor */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
          <defs>
            <pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" stroke="rgba(255,255,255,0.05)" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g)" />
        </svg>

        {/* axis indicator */}
        <div style={{ position: 'absolute', top: 12, left: 12, fontFamily: chromeStyles.mono, fontSize: 9, color: chromeStyles.muted, letterSpacing: 1 }}>
          <div>X · 0.000</div>
          <div>Y · 12.40</div>
          <div>Z · −2.80</div>
        </div>
        {/* viewport modes */}
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 4 }}>
          {['PERSP','TOP','SIDE'].map((m, i) => (
            <div key={m} style={{
              fontFamily: chromeStyles.mono, fontSize: 9, padding: '4px 7px', letterSpacing: 1,
              border: `1px solid ${i === 0 ? chromeStyles.hair : 'transparent'}`,
              color: i === 0 ? '#fff' : chromeStyles.muted,
              background: i === 0 ? 'rgba(255,255,255,0.04)' : 'transparent',
            }}>{m}</div>
          ))}
        </div>

        {/* central single-finger render */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative' }}>
            {/* measurement lines */}
            <div style={{ position: 'absolute', left: -42, top: 0, height: '100%', borderLeft: `1px dashed ${chromeStyles.hair}`, paddingLeft: 4, fontFamily: chromeStyles.mono, fontSize: 8, color: chromeStyles.muted, display: 'flex', alignItems: 'center' }}>
              <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>L · 18.0 mm</span>
            </div>
            <NailRender shape="almond" length="long" material="chrome" width={92} />
            {/* dimension callout */}
            <div style={{ position: 'absolute', right: -56, top: '40%', fontFamily: chromeStyles.mono, fontSize: 8, color: chromeStyles.muted }}>
              <div>⌀ 11.2</div>
              <div style={{ marginTop: 2 }}>R 0.42</div>
            </div>
          </div>
        </div>

        {/* zoom indicator */}
        <div style={{ position: 'absolute', bottom: 12, left: 12, fontFamily: chromeStyles.mono, fontSize: 9, color: chromeStyles.muted }}>118%</div>
        <div style={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', gap: 4 }}>
          {['◐','◑','◓'].map((g, i) => (
            <div key={i} style={{ width: 22, height: 22, border: `1px solid ${chromeStyles.hair}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: chromeStyles.muted }}>{g}</div>
          ))}
        </div>
      </div>

      <MetalRule />

      {/* parameter rail */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: chromeStyles.mono, fontSize: 9, letterSpacing: 1.6, color: chromeStyles.muted }}>// PARAMETERS · INDEX</span>
          <span style={{ fontFamily: chromeStyles.mono, fontSize: 9, color: chromeStyles.muted }}>4 / 12</span>
        </div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {params.map(([k, v, p]) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 70px', gap: 10, alignItems: 'center', fontFamily: chromeStyles.mono, fontSize: 10 }}>
              <span style={{ color: chromeStyles.muted, letterSpacing: 1 }}>{k}</span>
              <div style={{ height: 6, background: chromeStyles.faint, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, width: `${p*100}%`, background: 'linear-gradient(90deg,#5a5a5e,#fff)' }} />
                <div style={{ position: 'absolute', top: -3, left: `calc(${p*100}% - 6px)`, width: 12, height: 12, background: '#fff', boxShadow: '0 0 0 1px #000' }} />
              </div>
              <span style={{ textAlign: 'right' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* bottom toolbar */}
      <div style={{ position: 'absolute', bottom: 22, left: 16, right: 16, display: 'flex', gap: 6 }}>
        {['SHAPE','LEN','MAT','GEM','SET'].map((t, i) => (
          <div key={t} style={{
            flex: 1, padding: '12px 0', textAlign: 'center', fontFamily: chromeStyles.mono, fontSize: 9, letterSpacing: 1.4,
            border: `1px solid ${i === 2 ? '#fff' : chromeStyles.hair}`,
            background: i === 2 ? '#fff' : 'transparent',
            color: i === 2 ? '#000' : '#fff',
          }}>{t}</div>
        ))}
      </div>

      <ChromeHomeIndicator />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN B · Material library
// ─────────────────────────────────────────────────────────────
function ChromeMaterials() {
  const mats = [
    ['CHRM_01','CHROME','MIRROR','#'],
    ['ONYX_03','ONYX','GLOSS','#'],
    ['PRL_07','PEARL','SATIN','#'],
    ['CRYS_02','CRYSTAL','CLEAR','#'],
    ['BORD_04','BORDEAUX','GLOSS','*'],
    ['BONE_01','BONE','MATTE','#'],
    ['JET_05','JET','ULTRA-MATTE','#'],
    ['GLAS_02','GLASS','TRANSL','#'],
  ];
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: chromeStyles.bg, color: '#fff', fontFamily: chromeStyles.sans, overflow: 'hidden' }}>
      <ChromeStatusBar />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 16px 10px' }}>
        <span style={{ fontFamily: chromeStyles.mono, fontSize: 10, letterSpacing: 1.4 }}>← LAB / MAT</span>
        <span style={{ fontFamily: chromeStyles.mono, fontSize: 10, letterSpacing: 1.4, color: chromeStyles.muted }}>LIBRARY · 24</span>
        <span style={{ fontFamily: chromeStyles.mono, fontSize: 10 }}>⌃F</span>
      </div>
      <MetalRule />

      {/* search */}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', border: `1px solid ${chromeStyles.hair}`, fontFamily: chromeStyles.mono, fontSize: 11 }}>
          <span style={{ color: chromeStyles.muted }}>›</span>
          <span>filter:gloss</span>
          <span style={{ marginLeft: 'auto', color: chromeStyles.muted, fontSize: 9 }}>8 / 24</span>
        </div>
      </div>

      {/* grid */}
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {mats.map(([code, name, fin, mark], i) => (
          <div key={code} style={{
            border: `1px solid ${i === 0 ? '#fff' : chromeStyles.hair}`,
            padding: 10, position: 'relative',
            background: i === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
          }}>
            <div style={{ height: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', position: 'relative' }}>
              <NailRender shape="almond" length="medium" material={['chrome','onyx','pearl','crystal','blood','bone','jet','glass'][i]} width={42} />
              {i === 0 && <div style={{ position: 'absolute', top: 0, right: 0, fontFamily: chromeStyles.mono, fontSize: 8, padding: '2px 4px', background: '#fff', color: '#000' }}>ACTIVE</div>}
            </div>
            <div style={{ fontFamily: chromeStyles.mono, fontSize: 10, letterSpacing: 1, marginTop: 8 }}>{name}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontFamily: chromeStyles.mono, fontSize: 8, color: chromeStyles.muted }}>{code}</span>
              <span style={{ fontFamily: chromeStyles.mono, fontSize: 8, color: chromeStyles.muted }}>{fin}{mark === '*' ? ' ◆' : ''}</span>
            </div>
          </div>
        ))}
      </div>

      <ChromeHomeIndicator />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN C · Build summary / commit
// ─────────────────────────────────────────────────────────────
function ChromeCommit() {
  const lines = [
    ['shape', 'almond'],
    ['length_mm', '18.0'],
    ['material.base', 'chrome.mirror'],
    ['material.tip', '—'],
    ['gems[]', '[index: 1×crystal_2.0]'],
    ['stripes[]', '[]'],
    ['hand', 'mirror_LR'],
    ['complexity', 'tier_II'],
    ['est_minutes', '128'],
    ['est_eur', '140.00'],
  ];
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: chromeStyles.bg, color: '#fff', fontFamily: chromeStyles.sans, overflow: 'hidden' }}>
      <ChromeStatusBar />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 16px 10px' }}>
        <span style={{ fontFamily: chromeStyles.mono, fontSize: 10, letterSpacing: 1.4 }}>← LAB</span>
        <span style={{ fontFamily: chromeStyles.mono, fontSize: 10, letterSpacing: 1.4 }}>BUILD · #LP-0407</span>
        <span style={{ width: 30 }} />
      </div>
      <MetalRule />

      {/* hero render with crops */}
      <div style={{ position: 'relative', height: 220, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', background: 'linear-gradient(180deg, #0d0d10, #08080a)' }}>
        <HandLayout shape="almond" material="chrome" length="long" gem={[false, true, false, false, false]} scale={0.72} />
        <div style={{ position: 'absolute', top: 12, left: 16, fontFamily: chromeStyles.mono, fontSize: 9, color: chromeStyles.muted, letterSpacing: 1 }}>RENDER · 1024 SAMPLES</div>
        <div style={{ position: 'absolute', top: 12, right: 16, fontFamily: chromeStyles.mono, fontSize: 9, color: chromeStyles.muted, letterSpacing: 1 }}>● VALID</div>
      </div>
      <MetalRule />

      {/* spec sheet */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ fontFamily: chromeStyles.mono, fontSize: 9, color: chromeStyles.muted, letterSpacing: 1.6 }}>// SPEC SHEET</div>
        <div style={{ marginTop: 8, fontFamily: chromeStyles.mono, fontSize: 10, lineHeight: 1.7 }}>
          {lines.map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px dashed ${chromeStyles.hair}`, padding: '2px 0' }}>
              <span style={{ color: chromeStyles.muted }}>{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 22, left: 16, right: 16, display: 'flex', gap: 6 }}>
        <div style={{ flex: 1, padding: '14px 0', textAlign: 'center', border: `1px solid ${chromeStyles.hair}`, fontFamily: chromeStyles.mono, fontSize: 10, letterSpacing: 1.4 }}>SAVE_DRAFT</div>
        <div style={{ flex: 1.4, padding: '14px 0', textAlign: 'center', background: '#fff', color: '#000', fontFamily: chromeStyles.mono, fontSize: 10, letterSpacing: 1.4, fontWeight: 600 }}>COMMIT → BOOK</div>
      </div>

      <ChromeHomeIndicator />
    </div>
  );
}

Object.assign(window, { ChromeLab, ChromeMaterials, ChromeCommit });
