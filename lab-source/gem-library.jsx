// gem-library.jsx — gem catalog + per-finger placement panel.
// Renders nice CSS gem swatches and produces a `gems` map for the 3D hand:
// { thumb: [...], index: [{ id: 'crystal', shape: 'round', x: 0, y: 0.4 }] }

const GEM_LIBRARY = [
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

const GEM_SHAPES_LIB = [
  { id: 'round',    name: 'Round' },
  { id: 'teardrop', name: 'Teardrop' },
  { id: 'square',   name: 'Square' },
  { id: 'heart',    name: 'Heart' },
  { id: 'pearl',    name: 'Pearl' },
];

const GEM_BG = {
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

// Visual gem dot
function GemSwatch({ gem, size = 36, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'center', lineHeight: 1,
    }}>
      <div style={{
        width: size, height: size, borderRadius: '50%', margin: '0 auto',
        background: GEM_BG[gem.tint],
        border: active ? '1.5px solid #fff' : '1px solid rgba(255,255,255,0.12)',
        boxShadow: active ? '0 0 0 4px rgba(255,255,255,0.06)' : '0 6px 12px -6px rgba(0,0,0,0.5)',
      }} />
      <div style={{ marginTop: 6, fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 12, color: active ? '#fff' : 'rgba(255,255,255,0.6)' }}>{gem.name}</div>
    </button>
  );
}

// FingerSelector — 5-finger picker. Shows which finger is currently being designed.
function FingerSelector({ active, onPick, gems }) {
  const fingers = [
    { id: 'thumb',  label: 'Thumb',  short: 'T' },
    { id: 'index',  label: 'Index',  short: 'I' },
    { id: 'middle', label: 'Middle', short: 'M' },
    { id: 'ring',   label: 'Ring',   short: 'R' },
    { id: 'pinky',  label: 'Pinky',  short: 'P' },
  ];
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between' }}>
      {fingers.map((f) => {
        const count = (gems[f.id] || []).length;
        const isActive = f.id === active;
        return (
          <button key={f.id} onClick={() => onPick(f.id)} style={{
            flex: 1, padding: '12px 0', borderRadius: 12,
            background: isActive ? '#fff' : 'rgba(255,255,255,0.04)',
            border: isActive ? '1px solid #fff' : '1px solid rgba(255,255,255,0.1)',
            color: isActive ? '#000' : '#fff',
            cursor: 'pointer', position: 'relative',
            fontFamily: 'Inter, sans-serif',
          }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 18, lineHeight: 1 }}>{f.short}</div>
            <div style={{ fontSize: 8, letterSpacing: 1.4, textTransform: 'uppercase', marginTop: 4, opacity: 0.6 }}>{f.label}</div>
            {count > 0 && (
              <div style={{
                position: 'absolute', top: 4, right: 4,
                fontSize: 9, padding: '1px 5px', borderRadius: 100,
                background: isActive ? '#000' : '#fff', color: isActive ? '#fff' : '#000', fontWeight: 600,
              }}>{count}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, { GEM_LIBRARY, GEM_SHAPES_LIB, GEM_BG, GemSwatch, FingerSelector });
