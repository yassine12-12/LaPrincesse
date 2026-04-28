// gem-library.tsx — Gem catalog + per-finger placement panel.

import React from 'react';
import type { GemId, GemShapeId, FingerName, GemsMap, GemPlacement } from './hand-3d';

export const GEM_LIBRARY: { id: GemId; name: string; group: string; tint: string }[] = [
  { id: 'crystal',  name: 'Crystal',  group: 'Clear', tint: 'rad-clear' },
  { id: 'pearl',    name: 'Pearl',    group: 'Pearl', tint: 'rad-pearl' },
  { id: 'onyx',     name: 'Onyx',     group: 'Dark',  tint: 'rad-onyx' },
  { id: 'smoke',    name: 'Smoke',    group: 'Dark',  tint: 'rad-smoke' },
  { id: 'ruby',     name: 'Ruby',     group: 'Color', tint: 'rad-ruby' },
  { id: 'sapphire', name: 'Sapphire', group: 'Color', tint: 'rad-sapphire' },
  { id: 'emerald',  name: 'Emerald',  group: 'Color', tint: 'rad-emerald' },
  { id: 'gold',     name: 'Gold',     group: 'Metal', tint: 'rad-gold' },
  { id: 'silver',   name: 'Silver',   group: 'Metal', tint: 'rad-silver' },
];

export const GEM_SHAPES_LIB: { id: GemShapeId; name: string }[] = [
  { id: 'round',    name: 'Round' },
  { id: 'teardrop', name: 'Drop' },
  { id: 'square',   name: 'Square' },
  { id: 'heart',    name: 'Heart' },
  { id: 'pearl',    name: 'Pearl' },
];

const GEM_BG: Record<string, string> = {
  'rad-clear':    'radial-gradient(circle at 35% 28%, #fff 0%, #d8d8de 30%, #6a6a72 70%, #fff 100%)',
  'rad-pearl':    'radial-gradient(circle at 30% 24%, #fff 0%, #f3ecdf 50%, #c8b8a0 100%)',
  'rad-onyx':     'radial-gradient(circle at 35% 28%, #4a4a4e 0%, #0a0a0a 60%, #2a2a2e 100%)',
  'rad-smoke':    'radial-gradient(circle at 35% 28%, #c8c8d0 0%, #5a5a64 50%, #8a8a94 100%)',
  'rad-ruby':     'radial-gradient(circle at 35% 28%, #ffaaaa 0%, #5a0a0e 60%, #aa3a3e 100%)',
  'rad-sapphire': 'radial-gradient(circle at 35% 28%, #b0c0ff 0%, #0a1838 60%, #3050a0 100%)',
  'rad-emerald':  'radial-gradient(circle at 35% 28%, #c8ffd8 0%, #0a3a28 60%, #1a8050 100%)',
  'rad-gold':     'radial-gradient(circle at 35% 28%, #fff8d0 0%, #c8a050 50%, #8a6020 100%)',
  'rad-silver':   'radial-gradient(circle at 35% 28%, #fff 0%, #d8d8e0 40%, #888 100%)',
};

const mono = '"JetBrains Mono","IBM Plex Mono",ui-monospace,monospace';
const sans = '"Inter","Helvetica Neue",sans-serif';

function GemSwatch({ gem, size = 32, active, onClick }: {
  gem: typeof GEM_LIBRARY[0]; size?: number; active?: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'center', lineHeight: 1 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%', margin: '0 auto',
        background: GEM_BG[gem.tint],
        border: active ? '1.5px solid #fff' : '1px solid rgba(255,255,255,0.12)',
        boxShadow: active ? '0 0 0 4px rgba(255,255,255,0.1)' : '0 4px 10px -4px rgba(0,0,0,0.6)',
        transition: 'all .15s',
      }} />
      <div style={{ marginTop: 5, fontFamily: sans, fontSize: 9, letterSpacing: 1, color: active ? '#fff' : 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>{gem.name}</div>
    </button>
  );
}

export function FingerSelector({ active, onPick, gems }: {
  active: FingerName;
  onPick: (f: FingerName) => void;
  gems: GemsMap;
}) {
  const fingers: { id: FingerName; short: string }[] = [
    { id: 'thumb',  short: 'T' },
    { id: 'index',  short: 'I' },
    { id: 'middle', short: 'M' },
    { id: 'ring',   short: 'R' },
    { id: 'pinky',  short: 'P' },
  ];
  return (
    <div style={{ display: 'flex', gap: 5 }}>
      {fingers.map((f) => {
        const count = (gems[f.id] ?? []).length;
        const isActive = f.id === active;
        return (
          <button key={f.id} onClick={() => onPick(f.id)} style={{
            flex: 1, padding: '10px 0', borderRadius: 8,
            background: isActive ? '#fff' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isActive ? '#fff' : 'rgba(255,255,255,0.1)'}`,
            color: isActive ? '#000' : '#fff',
            cursor: 'pointer', position: 'relative', fontFamily: sans, transition: 'all .15s',
          }}>
            <div style={{ fontFamily: '"Cormorant Garamond","Times New Roman",serif', fontStyle: 'italic', fontSize: 17, lineHeight: 1 }}>{f.short}</div>
            {count > 0 && (
              <div style={{
                position: 'absolute', top: 3, right: 3, fontSize: 8, padding: '1px 4px', borderRadius: 100,
                background: isActive ? '#000' : '#fff', color: isActive ? '#fff' : '#000', fontWeight: 600,
              }}>{count}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function GemPanel({ gems, onChange }: {
  gems: GemsMap;
  onChange: (gems: GemsMap) => void;
}) {
  const [activeFinger, setActiveFinger] = React.useState<FingerName>('index');
  const [activeGem, setActiveGem] = React.useState<GemId>('crystal');
  const [activeShape, setActiveShape] = React.useState<GemShapeId>('round');

  const addGem = () => {
    const existing = gems[activeFinger] ?? [];
    if (existing.length >= 3) return;
    onChange({ ...gems, [activeFinger]: [...existing, { id: activeGem, shape: activeShape, zone: 'top' as const, x: 0, y: 0.4 }] });
  };

  const clearFinger = () => {
    const next = { ...gems };
    delete next[activeFinger];
    onChange(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* finger selector */}
      <div>
        <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: 1.6, color: 'rgba(244,244,246,0.5)', marginBottom: 8 }}>// FINGER</div>
        <FingerSelector active={activeFinger} onPick={setActiveFinger} gems={gems} />
      </div>

      {/* gem type */}
      <div>
        <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: 1.6, color: 'rgba(244,244,246,0.5)', marginBottom: 8 }}>// GEM TYPE</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {GEM_LIBRARY.slice(0, 5).map((g) => (
            <GemSwatch key={g.id} gem={g} size={28} active={activeGem === g.id} onClick={() => setActiveGem(g.id)} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 8 }}>
          {GEM_LIBRARY.slice(5).map((g) => (
            <GemSwatch key={g.id} gem={g} size={28} active={activeGem === g.id} onClick={() => setActiveGem(g.id)} />
          ))}
        </div>
      </div>

      {/* shape */}
      <div>
        <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: 1.6, color: 'rgba(244,244,246,0.5)', marginBottom: 8 }}>// SHAPE</div>
        <div style={{ display: 'flex', gap: 5 }}>
          {GEM_SHAPES_LIB.map((s) => (
            <button key={s.id} onClick={() => setActiveShape(s.id)} style={{
              flex: 1, padding: '7px 0', borderRadius: 4, cursor: 'pointer',
              background: activeShape === s.id ? '#fff' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeShape === s.id ? '#fff' : 'rgba(255,255,255,0.1)'}`,
              color: activeShape === s.id ? '#000' : 'rgba(255,255,255,0.6)',
              fontFamily: mono, fontSize: 9, letterSpacing: 1, transition: 'all .15s',
            }}>{s.name}</button>
          ))}
        </div>
      </div>

      {/* actions */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={addGem} style={{
          flex: 2, padding: '12px 0', borderRadius: 4, cursor: 'pointer',
          background: '#fff', color: '#000', border: 'none',
          fontFamily: mono, fontSize: 10, letterSpacing: 1.4, fontWeight: 600,
        }}>+ ADD GEM</button>
        <button onClick={clearFinger} style={{
          flex: 1, padding: '12px 0', borderRadius: 4, cursor: 'pointer',
          background: 'transparent', color: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(255,255,255,0.12)',
          fontFamily: mono, fontSize: 10, letterSpacing: 1.4,
        }}>CLEAR</button>
      </div>
    </div>
  );
}
