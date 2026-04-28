content = r"""import { createFileRoute, Link } from '@tanstack/react-router';
import React, { useState } from 'react';
import Hand3D from '@/components/lab/hand-3d';
import type { NailShape, NailLength, MaterialKey } from '@/components/lab/nail-shared';
import type { GemsMap, GemId, GemShapeId } from '@/components/lab/hand-3d';

export const Route = createFileRoute('/lab')({
  component: LabPage,
});

const fraunces = '"Fraunces", "Georgia", serif';
const mono = '"JetBrains Mono", ui-monospace, monospace';
const sans = '"Inter", "Helvetica Neue", sans-serif';

const SHAPES: NailShape[] = ['almond', 'oval', 'coffin', 'square', 'stiletto'];
const LENGTHS: NailLength[] = ['short', 'medium', 'long', 'xlong'];
const MATERIALS: { k: MaterialKey; n: string; sub: string }[] = [
  { k: 'chrome',   n: 'Chrome',   sub: 'Mirror' },
  { k: 'onyx',     n: 'Onyx',     sub: 'Liquid black' },
  { k: 'pearl',    n: 'Pearl',    sub: 'Cream' },
  { k: 'crystal',  n: 'Crystal',  sub: 'Optical glass' },
  { k: 'bordeaux', n: 'Bordeaux', sub: 'Dark rouge' },
  { k: 'bone',     n: 'Bone',     sub: 'Matte' },
  { k: 'jet',      n: 'Jet',      sub: 'Ultra-matte' },
  { k: 'glass',    n: 'Glass',    sub: 'Transparent' },
];
const MATERIAL_BG: Record<string, string> = {
  chrome:   'linear-gradient(180deg,#fafafa 0%,#9aa0a6 28%,#1a1a1c 55%,#6e7177 78%,#e8e9ec 100%)',
  onyx:     'linear-gradient(180deg,#2b2b2e 0%,#0a0a0b 50%,#1a1a1d 100%)',
  pearl:    'linear-gradient(180deg,#fff 0%,#f3ecdf 45%,#e0d4c3 100%)',
  crystal:  'linear-gradient(180deg,rgba(220,230,240,0.7) 0%,rgba(160,180,200,0.5) 50%,rgba(220,230,240,0.7) 100%)',
  bordeaux: 'linear-gradient(180deg,#5a0a0e 0%,#1a0204 55%,#3a0608 100%)',
  bone:     'linear-gradient(180deg,#f5efe2 0%,#e6dbc6 100%)',
  jet:      'linear-gradient(180deg,#3a3a3e 0%,#000 50%,#1a1a1c 100%)',
  glass:    'linear-gradient(180deg,rgba(255,255,255,0.18) 0%,rgba(255,255,255,0.06) 100%)',
};

type FingerName = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';

const GEM_LIBRARY: { id: string; name: string; tint: string }[] = [
  { id: 'crystal',  name: 'Crystal',  tint: 'radial-gradient(circle at 35% 28%, #fff 0%, #d8d8de 30%, #6a6a72 70%, #fff 100%)' },
  { id: 'pearl',    name: 'Pearl',    tint: 'radial-gradient(circle at 30% 24%, #fff 0%, #f3ecdf 50%, #c8b8a0 100%)' },
  { id: 'onyx',     name: 'Onyx',     tint: 'radial-gradient(circle at 35% 28%, #4a4a4e 0%, #0a0a0a 60%, #2a2a2e 100%)' },
  { id: 'smoke',    name: 'Smoke',    tint: 'radial-gradient(circle at 35% 28%, #c8c8d0 0%, #5a5a64 50%, #8a8a94 100%)' },
  { id: 'ruby',     name: 'Ruby',     tint: 'radial-gradient(circle at 35% 28%, #ffaaaa 0%, #5a0a0e 60%, #aa3a3e 100%)' },
  { id: 'sapphire', name: 'Sapphire', tint: 'radial-gradient(circle at 35% 28%, #b0c0ff 0%, #0a1838 60%, #3050a0 100%)' },
  { id: 'emerald',  name: 'Emerald',  tint: 'radial-gradient(circle at 35% 28%, #c8ffd8 0%, #0a3a28 60%, #1a8050 100%)' },
  { id: 'gold',     name: 'Gold',     tint: 'radial-gradient(circle at 35% 28%, #fff8d0 0%, #c8a050 50%, #8a6020 100%)' },
];
const GEM_SHAPES: { id: string; name: string }[] = [
  { id: 'round',    name: 'Round' },
  { id: 'teardrop', name: 'Drop' },
  { id: 'square',   name: 'Square' },
  { id: 'heart',    name: 'Heart' },
  { id: 'pearl',    name: 'Pearl' },
];

function Wordmark() {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
      <span style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: 22, fontWeight: 300, letterSpacing: -0.3 }}>la</span>
      <span style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: 22, fontWeight: 500, letterSpacing: -0.3 }}>Princesse</span>
    </div>
  );
}

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: '9px 16px', borderRadius: 100,
      background: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.04)',
      color: active ? '#000' : 'rgba(255,255,255,0.85)',
      border: active ? '1px solid #fff' : '1px solid rgba(255,255,255,0.1)',
      fontSize: 12, letterSpacing: 0.4, fontWeight: 500, fontFamily: sans,
      cursor: 'pointer', textTransform: 'capitalize' as const,
      transition: 'all 200ms ease',
    }}>{children}</button>
  );
}

function MaterialSwatch({ m, active, onClick }: { m: typeof MATERIALS[0]; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
      <div style={{
        width: 56, height: 70, borderRadius: 10,
        background: MATERIAL_BG[m.k] ?? '#333',
        border: active ? '1.5px solid #fff' : '1px solid rgba(255,255,255,0.14)',
        boxShadow: active ? '0 0 0 4px rgba(255,255,255,0.06)' : '0 8px 16px -10px rgba(0,0,0,0.5)',
        position: 'relative' as const, overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 30% at 50% 18%, rgba(255,255,255,0.35), transparent 60%)', mixBlendMode: 'screen' as const }} />
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: active ? '#fff' : 'rgba(255,255,255,0.55)', letterSpacing: 0.2, fontWeight: active ? 500 : 400, fontFamily: sans }}>{m.n}</div>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.2, textTransform: 'uppercase' as const, marginTop: 2, fontFamily: sans }}>{m.sub}</div>
    </button>
  );
}

function FingerSelector({ active, onPick, gems }: { active: FingerName; onPick: (f: FingerName) => void; gems: GemsMap }) {
  const fingers: { id: FingerName; short: string; label: string }[] = [
    { id: 'thumb',  short: 'T', label: 'Thumb' },
    { id: 'index',  short: 'I', label: 'Index' },
    { id: 'middle', short: 'M', label: 'Middle' },
    { id: 'ring',   short: 'R', label: 'Ring' },
    { id: 'pinky',  short: 'P', label: 'Pinky' },
  ];
  return (
    <div style={{ display: 'flex', gap: 5 }}>
      {fingers.map((f) => {
        const count = (gems[f.id] ?? []).length;
        const isActive = f.id === active;
        return (
          <button key={f.id} onClick={() => onPick(f.id)} style={{
            flex: 1, padding: '10px 0', borderRadius: 10,
            background: isActive ? '#fff' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isActive ? '#fff' : 'rgba(255,255,255,0.1)'}`,
            color: isActive ? '#000' : '#fff',
            cursor: 'pointer', position: 'relative' as const, fontFamily: sans,
            transition: 'all .15s',
          }}>
            <div style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: 18, lineHeight: 1 }}>{f.short}</div>
            <div style={{ fontSize: 8, letterSpacing: 1.4, textTransform: 'uppercase' as const, marginTop: 4, opacity: 0.6, fontFamily: sans }}>{f.label}</div>
            {count > 0 && (
              <div style={{
                position: 'absolute' as const, top: 4, right: 4,
                fontSize: 9, padding: '1px 5px', borderRadius: 100,
                background: isActive ? '#000' : '#fff',
                color: isActive ? '#fff' : '#000',
                fontWeight: 600, fontFamily: sans,
              }}>{count}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function LabPage() {
  const [shape, setShape] = useState<NailShape>('almond');
  const [length, setLength] = useState<NailLength>('long');
  const [material, setMaterial] = useState<MaterialKey>('chrome');
  const [auto, setAuto] = useState(true);
  const [activeFinger, setActiveFinger] = useState<FingerName>('ring');
  const [activeShape, setActiveShape] = useState<string>('round');
  const [gems, setGems] = useState<GemsMap>({
    ring: [{ id: 'crystal' as GemId, shape: 'round' as GemShapeId, x: 0, y: 0.45 }],
  });

  function addGem(gemId: string) {
    setGems((prev) => {
      const list = [...(prev[activeFinger] ?? [])];
      const n = list.length;
      const yPos = [0.45, 0.65, 0.25, 0.55];
      const xPos = [0, -0.25, 0.25, 0];
      list.push({ id: gemId as GemId, shape: activeShape as GemShapeId, x: xPos[n % 4], y: yPos[n % 4] });
      return { ...prev, [activeFinger]: list };
    });
  }

  function clearFinger() {
    setGems((prev) => ({ ...prev, [activeFinger]: [] }));
  }

  const totalGems = Object.values(gems).reduce((s, l) => s + (l?.length ?? 0), 0);
  const matName = MATERIALS.find((m) => m.k === material)?.n ?? 'Chrome';

  return (
    <div style={{ minHeight: '100vh', background: '#050507', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: sans, color: '#fff', boxSizing: 'border-box' }}>
      <div style={{
        width: 'min(1320px, calc(100vw - 32px))',
        height: 'min(820px, calc(100vh - 32px))',
        background: 'linear-gradient(180deg, #0a0a0d 0%, #050507 100%)',
        borderRadius: 24,
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 60px 120px -40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '300px 1fr 300px',
      }}>

        {/* LEFT RAIL */}
        <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Wordmark />
            <Link to="/" style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#2a2a2e,#0a0a0a)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 14, textDecoration: 'none', flexShrink: 0 }}>x</Link>
          </div>
          <div style={{ marginTop: 28, fontSize: 9, letterSpacing: 2.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: sans }}>Studio · Lab</div>
          <div style={{ marginTop: 16, fontFamily: fraunces, fontStyle: 'italic', fontWeight: 300, fontSize: 56, lineHeight: 0.92, letterSpacing: -1 }}>Design<br/>your hand.</div>
          <div style={{ marginTop: 14, fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, fontFamily: fraunces, fontStyle: 'italic' }}>Speak in shapes, not words.<br/>Your artist sees exactly what you see.</div>

          <div style={{ marginTop: 36 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 12, fontFamily: sans }}>Shape</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{SHAPES.map((s) => <Pill key={s} active={s === shape} onClick={() => setShape(s)}>{s}</Pill>)}</div>
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 12, fontFamily: sans }}>Length</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{LENGTHS.map((l) => <Pill key={l} active={l === length} onClick={() => setLength(l)}>{l}</Pill>)}</div>
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 12, fontFamily: sans, display: 'flex', justifyContent: 'space-between' }}>
              <span>Per nail</span>
              <button onClick={clearFinger} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 9, letterSpacing: 1.6, textTransform: 'uppercase', cursor: 'pointer', padding: 0, fontFamily: sans }}>Clear</button>
            </div>
            <FingerSelector active={activeFinger} onPick={setActiveFinger} gems={gems} />
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.06)', fontFamily: mono, fontSize: 10, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>shape</span><span style={{ color: '#fff' }}>{shape}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>length</span><span style={{ color: '#fff' }}>{length}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>finish</span><span style={{ color: '#fff' }}>{matName.toLowerCase()}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>gems</span><span style={{ color: '#fff' }}>{totalGems}</span></div>
          </div>
        </div>

        {/* CENTER VIEWPORT */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 24, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['Perspective', 'Top', 'Side'] as const).map((v, i) => (
                <div key={v} style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', padding: '6px 11px', borderRadius: 100, background: i === 0 ? 'rgba(255,255,255,0.08)' : 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: i === 0 ? '#fff' : 'rgba(255,255,255,0.4)', backdropFilter: 'blur(20px)', fontFamily: sans }}>{v}</div>
              ))}
            </div>
            <button onClick={() => setAuto(!auto)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '6px 11px', fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(20px)', fontFamily: sans }}>
              {auto ? 'Pause' : 'Auto-spin'}
            </button>
          </div>

          <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,200,230,0.15), transparent 60%)', pointerEvents: 'none' }} />

          <div style={{ position: 'absolute', inset: 0 }}>
            <Hand3D shape={shape} length={length} material={material} gems={gems} autoRotate={auto} />
          </div>

          <div style={{ position: 'absolute', bottom: 28, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10, pointerEvents: 'none' }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: sans }}>Edition n04 - LP-0407</div>
              <div style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: 32, fontWeight: 300, marginTop: 4, letterSpacing: -0.5 }}>{matName}, {length}.</div>
            </div>
            <div style={{ fontFamily: mono, fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textAlign: 'right' }}>
              <div>drag to orbit</div>
              <div style={{ marginTop: 2 }}>render - live</div>
            </div>
          </div>
        </div>

        {/* RIGHT RAIL */}
        <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: 9, letterSpacing: 2.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: sans }}>Finish</div>
            <div style={{ fontSize: 9, letterSpacing: 1.6, color: 'rgba(255,255,255,0.4)', fontFamily: sans }}>{MATERIALS.length}</div>
          </div>

          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {MATERIALS.map((m) => <MaterialSwatch key={m.k} m={m} active={m.k === material} onClick={() => setMaterial(m.k)} />)}
          </div>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: 9, letterSpacing: 2.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: sans }}>Gems</div>
              <div style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>add to <span style={{ color: '#fff' }}>{activeFinger}</span></div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {GEM_SHAPES.map((s) => (
                <button key={s.id} onClick={() => setActiveShape(s.id)} style={{ padding: '5px 9px', borderRadius: 100, background: s.id === activeShape ? '#fff' : 'transparent', border: s.id === activeShape ? '1px solid #fff' : '1px solid rgba(255,255,255,0.12)', color: s.id === activeShape ? '#000' : 'rgba(255,255,255,0.6)', fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer', fontFamily: sans }}>{s.name}</button>
              ))}
            </div>

            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, rowGap: 14 }}>
              {GEM_LIBRARY.map((g) => (
                <button key={g.id} onClick={() => addGem(g.id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', margin: '0 auto', background: g.tint, border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 4px 10px -4px rgba(0,0,0,0.6)' }} />
                  <div style={{ marginTop: 5, fontFamily: fraunces, fontStyle: 'italic', fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>{g.name}</div>
                </button>
              ))}
            </div>

            <div style={{ marginTop: 10, fontFamily: fraunces, fontStyle: 'italic', fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
              Tap a gem to add. {(gems[activeFinger] ?? []).length} on {activeFinger}.
            </div>
          </div>

          <div style={{ marginTop: 24, padding: '20px 18px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 9, letterSpacing: 2.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: sans }}>Estimate</div>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontFamily: sans }}>Time</div>
                <div style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: 22, marginTop: 2 }}>{totalGems > 3 ? '2h 40m' : totalGems > 0 ? '2h 10m' : '1h 20m'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontFamily: sans }}>Tier</div>
                <div style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: 22, marginTop: 2 }}>{totalGems > 3 ? 'III' : totalGems > 0 ? 'II' : 'I'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontFamily: sans }}>Price</div>
                <div style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: 22, marginTop: 2 }}>{totalGems > 3 ? '165 EUR' : totalGems > 0 ? '140 EUR' : '80 EUR'}</div>
              </div>
            </div>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#3a3a3e,#0a0a0a)', border: '1px solid rgba(255,255,255,0.18)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, fontFamily: sans }}>Ines M.</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontFamily: sans }}>Studio Marais - 4.96 stars</div>
              </div>
              <div style={{ fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontFamily: sans }}>Match</div>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button style={{ flex: 1, padding: '14px 0', borderRadius: 100, background: '#fff', color: '#000', border: 'none', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer', fontFamily: sans }}>Reserve</button>
            <button style={{ padding: '14px 18px', borderRadius: 100, background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.18)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer', fontFamily: sans }}>Save</button>
          </div>
        </div>

      </div>
    </div>
  );
}
"""

with open('/Users/yassinekraiem/Documents/LaPrincesse/frontend/src/routes/lab.tsx', 'w') as f:
    f.write(content)

print("Done - wrote", len(content), "bytes")
