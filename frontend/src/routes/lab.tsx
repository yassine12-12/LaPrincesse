import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import React, { useState } from 'react';
import Hand3D from '@/components/lab/hand-3d';
import type { NailShape, NailLength } from '@/components/lab/nail-shared';
import type { GemsMap, GemId, GemShapeId, GemZone } from '@/components/lab/hand-3d';
import { useAuth } from '@/context/auth-context';
import { saveDesign } from '@/lib/supabase';

export const Route = createFileRoute('/lab')({
  head: () => ({
    meta: [
      { title: 'Lab — Design Your Nails · LaPrincesse' },
      { name: 'description', content: 'Design your perfect nail set in 3D. Choose shape, length, finish, and gemstone placement.' },
    ],
  }),
  component: LabPage,
});

const fraunces = '"Fraunces", "Georgia", serif';
const mono = '"JetBrains Mono", ui-monospace, monospace';
const sans = '"Inter", "Helvetica Neue", sans-serif';

// ── Nail options ──────────────────────────────────────────────
const SHAPES: NailShape[] = ['almond', 'oval', 'coffin', 'square', 'stiletto'];
const LENGTHS: NailLength[] = ['short', 'medium', 'long', 'xlong'];
type FingerName = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';
type HandSide = 'left' | 'right';

// ── Color palette ─────────────────────────────────────────────
// mat = THREE.js PBR material key; k = unique display ID
type ColorEntry = { k: string; mat?: string; n: string; sub: string; bg: string };
const COLOR_CATEGORIES: { label: string; colors: ColorEntry[] }[] = [
  {
    label: 'Metallics',
    colors: [
      { k: 'chrome-mirror',   mat: 'chrome',   n: 'Chrome',        sub: 'Mirror',     bg: 'linear-gradient(180deg,#fafafa 0%,#9aa0a6 28%,#1a1a1c 55%,#6e7177 78%,#e8e9ec 100%)' },
      { k: 'chrome-platinum', mat: 'platinum', n: 'Platinum',      sub: 'Icy',        bg: 'linear-gradient(180deg,#f8f8ff 0%,#d0d0e8 40%,#a0a0c0 100%)' },
      { k: 'chanel-mirage',   mat: 'silver',   n: 'Silver',        sub: 'Cool',       bg: 'linear-gradient(180deg,#e0e0e8 0%,#a8a8b8 50%,#707080 100%)' },
      { k: 'dior-or-diamant', mat: 'gold',     n: 'Gold',          sub: 'Yellow',     bg: 'linear-gradient(180deg,#fff8c0 0%,#d4a840 40%,#8a6010 100%)' },
      { k: 'chrome-rosegold', mat: 'rosegold', n: 'Rose Gold',     sub: 'Warm',       bg: 'linear-gradient(180deg,#ffd8d0 0%,#d4886a 40%,#8a4030 100%)' },
      { k: 'bronze',          mat: 'bronze',   n: 'Bronze',        sub: 'Antique',    bg: 'linear-gradient(180deg,#e8c890 0%,#a07840 40%,#604818 100%)' },
      { k: 'copper',          mat: 'copper',   n: 'Copper',        sub: 'Warm Mtpl',  bg: 'linear-gradient(180deg,#f0c080 0%,#b87040 40%,#703018 100%)' },
      { k: 'chrome-holo',     mat: 'holo',     n: 'Holo',          sub: 'Rainbow',    bg: 'linear-gradient(135deg,#f0d0f8 0%,#d0e8ff 25%,#d8ffd0 50%,#fff8d0 75%,#ffd0e8 100%)' },
    ],
  },
  {
    label: 'Classics',
    colors: [
      { k: 'opi-mademoiselle',  mat: 'nude',     n: 'Mademoiselle',  sub: 'OPI',        bg: 'linear-gradient(180deg,#eac8a8 0%,#c8a080 50%,#a07858 100%)' },
      { k: 'opi-bubble-bath',   mat: 'french',   n: 'Bubble Bath',   sub: 'OPI',        bg: 'linear-gradient(180deg,#fff4f0 0%,#fce4d8 50%,#f0cfc0 100%)' },
      { k: 'opi-waitress',      mat: 'red',      n: "Not A Waitress", sub: 'OPI',       bg: 'linear-gradient(180deg,#e02020 0%,#a00a10 50%,#600008 100%)' },
      { k: 'chanel-pirate',     mat: 'red',      n: 'Pirate',        sub: 'Chanel',     bg: 'linear-gradient(180deg,#d81020 0%,#920010 50%,#500008 100%)' },
      { k: 'dior-999',          mat: 'red',      n: '999',           sub: 'Dior',       bg: 'linear-gradient(180deg,#cc0010 0%,#8c0008 50%,#480004 100%)' },
      { k: 'chanel-vamp',       mat: 'cherry',   n: 'Vamp',          sub: 'Chanel',     bg: 'linear-gradient(180deg,#500818 0%,#280408 50%,#120204 100%)' },
      { k: 'chanel-rouge-noir', mat: 'bordeaux', n: 'Rouge Noir',    sub: 'Chanel',     bg: 'linear-gradient(180deg,#300408 0%,#180204 50%,#0a0102 100%)' },
      { k: 'opi-malaga-wine',   mat: 'bordeaux', n: 'Malaga Wine',   sub: 'OPI',        bg: 'linear-gradient(180deg,#601020 0%,#3a080e 50%,#180406 100%)' },
      { k: 'dior-minuit',       mat: 'navy',     n: 'Minuit',        sub: 'Dior',       bg: 'linear-gradient(180deg,#101830 0%,#060c1a 50%,#02040e 100%)' },
      { k: 'chanel-jade',       mat: 'forest',   n: 'Jade',          sub: 'Chanel',     bg: 'linear-gradient(180deg,#1a5028 0%,#0a2a10 50%,#041008 100%)' },
      { k: 'opi-lincoln-park',  mat: 'onyx',     n: 'Lincoln Park',  sub: 'OPI',        bg: 'linear-gradient(180deg,#200828 0%,#0a0410 50%,#050208 100%)' },
      { k: 'chanel-black-satin',mat: 'matte',    n: 'Black Satin',   sub: 'Chanel',     bg: 'linear-gradient(180deg,#181818 0%,#0a0a0a 50%,#050505 100%)' },
    ],
  },
  {
    label: 'Pastels',
    colors: [
      { k: 'essie-ballet',    mat: 'babypink', n: 'Ballet Slippers', sub: 'Essie',   bg: 'linear-gradient(180deg,#fde8e8 0%,#f8d0d0 50%,#e8b8b8 100%)' },
      { k: 'dior-new-look',   mat: 'babypink', n: 'New Look',        sub: 'Dior',    bg: 'linear-gradient(180deg,#fce8f0 0%,#f4d0e0 50%,#e8b8c8 100%)' },
      { k: 'dior-rose-porc',  mat: 'blush',    n: 'Rose Porcelaine', sub: 'Dior',    bg: 'linear-gradient(180deg,#f8d8d0 0%,#e8b8a8 50%,#d09888 100%)' },
      { k: 'opi-my-vampire',  mat: 'blush',    n: 'Vampire Is Buff', sub: 'OPI',     bg: 'linear-gradient(180deg,#dab8a8 0%,#c09888 50%,#a07868 100%)' },
      { k: 'essie-lilacism',  mat: 'lilac',    n: 'Lilacism',        sub: 'Essie',   bg: 'linear-gradient(180deg,#ecdcf8 0%,#c8a8e8 50%,#a888c8 100%)' },
      { k: 'essie-perennial', mat: 'lavender', n: 'Perennial Chic',  sub: 'Essie',   bg: 'linear-gradient(180deg,#d0c8e8 0%,#a8a0c8 50%,#8880a8 100%)' },
      { k: 'chanel-june',     mat: 'lavender', n: 'June',            sub: 'Chanel',  bg: 'linear-gradient(180deg,#e4d4f4 0%,#c0a8dc 50%,#9888b8 100%)' },
      { k: 'essie-mint-candy',mat: 'mint',     n: 'Mint Candy',      sub: 'Essie',   bg: 'linear-gradient(180deg,#c8f0d8 0%,#90d8b0 50%,#60b888 100%)' },
      { k: 'dior-riviera',    mat: 'sky',      n: 'Riviera',         sub: 'Dior',    bg: 'linear-gradient(180deg,#c8e4f8 0%,#98c8f0 50%,#68a8d8 100%)' },
      { k: 'essie-geisha',    mat: 'peach',    n: 'Go Go Geisha',    sub: 'Essie',   bg: 'linear-gradient(180deg,#f8d0a0 0%,#e8a870 50%,#d08848 100%)' },
      { k: 'butter',          mat: 'butter',   n: 'Butter',          sub: 'Pastel',  bg: 'linear-gradient(180deg,#fefce0 0%,#f4e4a0 50%,#d8c870 100%)' },
    ],
  },
  {
    label: 'Neons',
    colors: [
      { k: 'neonpink',   mat: 'neonpink',   n: 'El. Pink',    sub: 'Electric', bg: 'linear-gradient(180deg,#ff80c0 0%,#ff1080 50%,#c00060 100%)' },
      { k: 'neonlime',   mat: 'neonlime',   n: 'Acid Lime',   sub: 'Acid',     bg: 'linear-gradient(180deg,#b0ff40 0%,#70e800 50%,#40a000 100%)' },
      { k: 'neoncyan',   mat: 'neoncyan',   n: 'Laser Cyan',  sub: 'Laser',    bg: 'linear-gradient(180deg,#80ffff 0%,#00e8e8 50%,#00a0a0 100%)' },
      { k: 'neonorange', mat: 'neonorange', n: 'Fire',        sub: 'Blaze',    bg: 'linear-gradient(180deg,#ffa060 0%,#ff5800 50%,#c03000 100%)' },
      { k: 'neonpurple', mat: 'neonpurple', n: 'UV Purple',   sub: 'UV',       bg: 'linear-gradient(180deg,#c080ff 0%,#8800ff 50%,#5000b0 100%)' },
    ],
  },
  {
    label: 'Special',
    colors: [
      { k: 'pearl-effect',  mat: 'pearl',   n: 'Pearl',       sub: 'Iridescent',  bg: 'linear-gradient(180deg,#fff 0%,#f3ecdf 45%,#e0d4c3 100%)' },
      { k: 'crystal-glass', mat: 'crystal', n: 'Crystal',     sub: 'Optical',     bg: 'linear-gradient(180deg,rgba(220,234,248,0.75) 0%,rgba(155,180,210,0.55) 50%,rgba(220,234,248,0.75) 100%)' },
      { k: 'glass',         mat: 'glass',   n: 'Glass',       sub: 'Transparent', bg: 'linear-gradient(180deg,rgba(255,255,255,0.18) 0%,rgba(255,255,255,0.06) 100%)' },
      { k: 'glitter-coat',  mat: 'glitter', n: 'Glitter',     sub: 'Sparkle',     bg: 'linear-gradient(135deg,#d0d0ff 0%,#e0c0ff 33%,#d0e0ff 66%,#ffe0d0 100%)' },
      { k: 'opi-funny-bunny',mat: 'bone',   n: 'Funny Bunny', sub: 'OPI',         bg: 'linear-gradient(180deg,#fdfaf8 0%,#f4ede8 50%,#e8e0d8 100%)' },
      { k: 'essie-limo',    mat: 'jet',     n: 'Limo-Scene',  sub: 'Essie',       bg: 'linear-gradient(180deg,#3a3a3e 0%,#080808 50%,#0a0a0c 100%)' },
    ],
  },
];

// Flat list for lookup
const ALL_COLORS = COLOR_CATEGORIES.flatMap((c) => c.colors);

// ── Gem data — Swarovski & real nail art stones ───────────────
const GEM_LIBRARY: { id: string; name: string; brand: string; tint: string }[] = [
  { id: 'crystal',  name: 'Crystal SS5',      brand: 'Swarovski', tint: 'radial-gradient(circle at 35% 28%, #fff 0%, #d8d8de 30%, #6a6a72 70%, #fff 100%)' },
  { id: 'diamond',  name: 'White Diamond',    brand: 'Swarovski', tint: 'radial-gradient(circle at 35% 28%, #f8fcff 0%, #c0d0e8 40%, #8090b0 80%)' },
  { id: 'aurora',   name: 'Aurora Borealis',  brand: 'Swarovski', tint: 'radial-gradient(circle at 30% 25%, #fff 0%, #d0e8ff 22%, #e8c8ff 44%, #c8ffd8 66%, #fff0c8 88%, #fff 100%)' },
  { id: 'pearl',    name: 'Crystal Pearl',    brand: 'Swarovski', tint: 'radial-gradient(circle at 30% 24%, #fff 0%, #f3ecdf 50%, #c8b8a0 100%)' },
  { id: 'ruby',     name: 'Siam Red',         brand: 'Swarovski', tint: 'radial-gradient(circle at 35% 28%, #ff8888 0%, #8a0a12 60%, #aa2030 100%)' },
  { id: 'sapphire', name: 'Sapphire Blue',    brand: 'Swarovski', tint: 'radial-gradient(circle at 35% 28%, #8090ff 0%, #08163a 60%, #2040a0 100%)' },
  { id: 'emerald',  name: 'Emerald Green',    brand: 'Swarovski', tint: 'radial-gradient(circle at 35% 28%, #88ffb0 0%, #08402a 60%, #1a7050 100%)' },
  { id: 'amethyst', name: 'Amethyst',         brand: 'Swarovski', tint: 'radial-gradient(circle at 35% 28%, #e0a0ff 0%, #500858 60%, #9030a0 100%)' },
  { id: 'rose',     name: 'Rose Pink',        brand: 'Swarovski', tint: 'radial-gradient(circle at 35% 28%, #ffb8d0 0%, #e85888 60%, #c03060 100%)' },
  { id: 'topaz',    name: 'Golden Topaz',     brand: 'Swarovski', tint: 'radial-gradient(circle at 35% 28%, #ffe080 0%, #a07828 60%, #806020 100%)' },
  { id: 'smoke',    name: 'Smoke Topaz',      brand: 'Swarovski', tint: 'radial-gradient(circle at 35% 28%, #c8c8d0 0%, #5a5a64 50%, #8a8a94 100%)' },
  { id: 'onyx',     name: 'Jet Flatback',     brand: 'Preciosa',  tint: 'radial-gradient(circle at 35% 28%, #4a4a4e 0%, #0a0a0a 60%, #2a2a2e 100%)' },
  { id: 'gold',     name: '24K Gold Foil',    brand: 'Nail Art',  tint: 'radial-gradient(circle at 35% 28%, #fff8d0 0%, #c8a050 50%, #8a6020 100%)' },
  { id: 'silver',   name: 'Silver Foil',      brand: 'Nail Art',  tint: 'radial-gradient(circle at 35% 28%, #fff 0%, #d8d8e0 40%, #888 100%)' },
];
const GEM_SHAPES: { id: GemShapeId; name: string }[] = [
  { id: 'round',    name: 'Round' },
  { id: 'teardrop', name: 'Drop' },
  { id: 'marquise', name: 'Marquise' },
  { id: 'square',   name: 'Square' },
  { id: 'heart',    name: 'Heart' },
  { id: 'pearl',    name: 'Pearl' },
  { id: 'star',     name: 'Star' },
];
const GEM_ZONES: { id: GemZone; name: string; icon: string }[] = [
  { id: 'top',   name: 'Top',   icon: '▣' },
  { id: 'tip',   name: 'Tip',   icon: '▽' },
  { id: 'base',  name: 'Base',  icon: '△' },
  { id: 'left',  name: 'Left',  icon: '◁' },
  { id: 'right', name: 'Right', icon: '▷' },
];

// ── Sub-components ────────────────────────────────────────────
function Wordmark() {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
      <span style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: 22, fontWeight: 300, letterSpacing: -0.3 }}>la</span>
      <span style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: 22, fontWeight: 500, letterSpacing: -0.3 }}>Princesse</span>
    </div>
  );
}

function Pill({ active, children, onClick, small }: { active: boolean; children: React.ReactNode; onClick: () => void; small?: boolean }) {
  return (
    <button onClick={onClick} style={{
      padding: small ? '5px 10px' : '9px 16px', borderRadius: 100,
      background: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.04)',
      color: active ? '#000' : 'rgba(255,255,255,0.85)',
      border: active ? '1px solid #fff' : '1px solid rgba(255,255,255,0.1)',
      fontSize: small ? 9 : 12, letterSpacing: small ? 1.2 : 0.4, fontWeight: 500, fontFamily: sans,
      cursor: 'pointer', textTransform: small ? 'uppercase' : 'capitalize' as const,
      transition: 'all 180ms ease', whiteSpace: 'nowrap',
    }}>{children}</button>
  );
}

function ColorSwatch({ entry, active, onClick }: { entry: ColorEntry; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
      <div style={{
        width: 48, height: 60, borderRadius: 8,
        background: entry.bg,
        border: active ? '2px solid #fff' : '1px solid rgba(255,255,255,0.14)',
        boxShadow: active ? '0 0 0 3px rgba(255,255,255,0.08), 0 8px 20px -8px rgba(0,0,0,0.7)' : '0 6px 14px -8px rgba(0,0,0,0.6)',
        position: 'relative' as const, overflow: 'hidden', transition: 'all .18s',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 65% 28% at 50% 16%, rgba(255,255,255,0.38), transparent 65%)', mixBlendMode: 'screen' as const }} />
      </div>
      <div style={{ marginTop: 5, fontSize: 10, color: active ? '#fff' : 'rgba(255,255,255,0.55)', fontWeight: active ? 500 : 400, fontFamily: sans, letterSpacing: 0.1, lineHeight: 1.2 }}>{entry.n}</div>
      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.32)', letterSpacing: 1.0, textTransform: 'uppercase' as const, marginTop: 1, fontFamily: sans }}>{entry.sub}</div>
    </button>
  );
}

function FingerSelector({ active, onPick, gems }: { active: FingerName; onPick: (f: FingerName) => void; gems: GemsMap }) {
  const fingers: { id: FingerName; short: string }[] = [
    { id: 'thumb',  short: 'T' },
    { id: 'index',  short: 'I' },
    { id: 'middle', short: 'M' },
    { id: 'ring',   short: 'R' },
    { id: 'pinky',  short: 'P' },
  ];
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {fingers.map((f) => {
        const count = (gems[f.id] ?? []).length;
        const isActive = f.id === active;
        return (
          <button key={f.id} onClick={() => onPick(f.id)} style={{
            flex: 1, padding: '9px 0', borderRadius: 9,
            background: isActive ? '#fff' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isActive ? '#fff' : 'rgba(255,255,255,0.1)'}`,
            color: isActive ? '#000' : '#fff', cursor: 'pointer',
            position: 'relative' as const, fontFamily: sans, transition: 'all .14s',
          }}>
            <div style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: 17, lineHeight: 1 }}>{f.short}</div>
            {count > 0 && (
              <div style={{ position: 'absolute' as const, top: 3, right: 3, fontSize: 8, padding: '1px 4px', borderRadius: 100, background: isActive ? '#000' : '#fff', color: isActive ? '#fff' : '#000', fontWeight: 700, fontFamily: sans }}>{count}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function LabPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shape, setShape] = useState<NailShape>('almond');
  const [length, setLength] = useState<NailLength>('long');
  const [material, setMaterial] = useState<string>('chrome-mirror');
  const [auto, setAuto] = useState(false);
  const [activeFinger, setActiveFinger] = useState<FingerName>('ring');
  const [activeGemShape, setActiveGemShape] = useState<GemShapeId>('round');
  const [activeGemZone, setActiveGemZone] = useState<GemZone>('top');
  const [activeColorCat, setActiveColorCat] = useState(0);
  const [activeHand, setActiveHand] = useState<HandSide>('right');
  const [allGems, setAllGems] = useState<Record<HandSide, GemsMap>>({
    left: {},
    right: { ring: [{ id: 'crystal' as GemId, shape: 'round' as GemShapeId, zone: 'top', x: 0, y: 0.5 }] },
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const handleSave = async () => {
    if (!user) { navigate({ to: '/auth' }); return; }
    setSaving(true);
    const colorName = ALL_COLORS.find(c => c.k === material)?.n ?? material;
    const { error } = await saveDesign({
      user_id: user.id,
      name: `${colorName}, ${length}`,
      shape, length, material,
      gems: allGems as unknown as Record<string, unknown>,
    });
    setSaving(false);
    setSaveMsg(error ? 'Error saving.' : 'Design saved!');
    setTimeout(() => setSaveMsg(null), 2500);
  };

  const handleReserve = () => {
    navigate({ to: '/book', search: { designId: undefined } });
  };

  function addGem(gemId: string) {
    setAllGems((prev) => {
      const handGems = prev[activeHand];
      const list = [...(handGems[activeFinger] ?? [])];
      const n = list.length;
      // Multiple gem positions on nail for zone 'top'
      const topPositions = [
        { x: 0,     y: 0.55 },
        { x: -0.35, y: 0.68 },
        { x:  0.35, y: 0.68 },
        { x: 0,     y: 0.38 },
        { x: -0.35, y: 0.45 },
        { x:  0.35, y: 0.45 },
      ];
      const sidePositions = [
        { x: 0, y: 0.5 },
        { x: 0, y: 0.65 },
        { x: 0, y: 0.35 },
      ];
      let pos;
      if (activeGemZone === 'top') {
        pos = topPositions[n % topPositions.length];
      } else if (activeGemZone === 'tip' || activeGemZone === 'base') {
        pos = { x: (n % 3 - 1) * 0.35, y: 0.5 };
      } else {
        pos = sidePositions[n % sidePositions.length];
      }
      list.push({ id: gemId as GemId, shape: activeGemShape, zone: activeGemZone, ...pos });
      return { ...prev, [activeHand]: { ...handGems, [activeFinger]: list } };
    });
  }

  function clearFinger() { setAllGems((prev) => ({ ...prev, [activeHand]: { ...prev[activeHand], [activeFinger]: [] } })); }
  function clearAll() { setAllGems((prev) => ({ ...prev, [activeHand]: {} })); }

  const gems = allGems[activeHand];
  const totalGems = Object.values(gems).reduce((s, l) => s + (l?.length ?? 0), 0);
  const totalGemsAll = Object.values(allGems).flatMap((hg) => Object.values(hg)).reduce((s, l) => s + (l?.length ?? 0), 0);
  const matName = ALL_COLORS.find((c) => c.k === material)?.n ?? material;

  return (
    <div style={{ minHeight: '100vh', background: '#050507', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: sans, color: '#fff', boxSizing: 'border-box' }}>
      <div style={{
        width: 'min(1360px, calc(100vw - 32px))',
        height: 'min(840px, calc(100vh - 32px))',
        background: 'linear-gradient(180deg, #0a0a0d 0%, #050507 100%)',
        borderRadius: 24,
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 60px 120px -40px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.04)',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '290px 1fr 320px',
      }}>

        {/* ── LEFT RAIL ── */}
        <div style={{ padding: '26px 22px', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Wordmark />
            <Link to="/" style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 14, textDecoration: 'none', flexShrink: 0 }}>x</Link>
          </div>
          <div style={{ marginTop: 24, fontSize: 9, letterSpacing: 2.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: sans }}>Studio · Lab</div>
          <div style={{ marginTop: 14, fontFamily: fraunces, fontStyle: 'italic', fontWeight: 300, fontSize: 50, lineHeight: 0.92, letterSpacing: -1 }}>Design<br/>your hand.</div>
          <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, fontFamily: fraunces, fontStyle: 'italic' }}>Speak in shapes, not words.</div>
          <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Link to="/tooth-gems" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 9, letterSpacing: 1.8, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: sans, textDecoration: 'none', padding: '6px 12px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', width: 'fit-content', transition: 'all .15s' }}>
              <span>✦</span> Tooth Gems
            </Link>
            <Link to="/trending" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 9, letterSpacing: 1.8, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: sans, textDecoration: 'none', padding: '6px 12px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', width: 'fit-content', transition: 'all .15s' }}>
              Trending ↑
            </Link>
          </div>

          {/* Shape */}
          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 10, fontFamily: sans }}>Shape</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>{SHAPES.map((s) => <Pill key={s} active={s === shape} onClick={() => setShape(s)}>{s}</Pill>)}</div>
          </div>

          {/* Length */}
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 10, fontFamily: sans }}>Length</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>{LENGTHS.map((l) => <Pill key={l} active={l === length} onClick={() => setLength(l)}>{l}</Pill>)}</div>
          </div>

          {/* Hand selector */}
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 10, fontFamily: sans }}>Hand</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['left', 'right'] as HandSide[]).map((side) => {
                const isActive = activeHand === side;
                const hc = Object.values(allGems[side]).reduce((s, l) => s + (l?.length ?? 0), 0);
                return (
                  <button key={side} onClick={() => setActiveHand(side)} style={{
                    flex: 1, padding: '10px 0', borderRadius: 9, cursor: 'pointer', fontFamily: sans,
                    background: isActive ? '#fff' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isActive ? '#fff' : 'rgba(255,255,255,0.1)'}`,
                    color: isActive ? '#000' : '#fff', transition: 'all .14s',
                    display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 2,
                    position: 'relative' as const,
                  }}>
                    <div style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: 20, lineHeight: 1 }}>{side === 'left' ? 'L' : 'R'}</div>
                    <div style={{ fontSize: 8, letterSpacing: 1.4, textTransform: 'uppercase' as const }}>{side}</div>
                    {hc > 0 && (
                      <div style={{ position: 'absolute', top: 4, right: 6, fontSize: 8, fontFamily: sans, fontStyle: 'normal', opacity: 0.6 }}>{hc}g</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Per nail */}
            <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 10, fontFamily: sans, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Per nail · <span style={{ color: 'rgba(255,255,255,0.7)' }}>{activeHand}</span></span>
              <button onClick={clearFinger} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase', cursor: 'pointer', padding: 0, fontFamily: sans }}>Clear</button>
            </div>
            <FingerSelector active={activeFinger} onPick={setActiveFinger} gems={gems} />
          </div>

          <div style={{ flex: 1 }} />

          {/* Spec readout */}
          <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', fontFamily: mono, fontSize: 10, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>hand</span><span style={{ color: '#fff' }}>{activeHand}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>shape</span><span style={{ color: '#fff' }}>{shape}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>length</span><span style={{ color: '#fff' }}>{length}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>finish</span><span style={{ color: '#fff' }}>{matName}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>gems</span><span style={{ color: '#fff' }}>{totalGemsAll}</span></div>
          </div>
        </div>

        {/* ── CENTER VIEWPORT ── */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Top chrome */}
          <div style={{ position: 'absolute', top: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <div style={{ fontSize: 9, letterSpacing: 1.6, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: sans, marginRight: 2 }}>Editing</div>
              {(['left', 'right'] as HandSide[]).map((side) => (
                <button key={side} onClick={() => setActiveHand(side)} style={{
                  padding: '5px 12px', borderRadius: 100, cursor: 'pointer', fontFamily: sans,
                  background: activeHand === side ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: activeHand === side ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.1)',
                  color: activeHand === side ? '#fff' : 'rgba(255,255,255,0.4)',
                  fontSize: 9, letterSpacing: 1.6, textTransform: 'uppercase' as const,
                  backdropFilter: 'blur(20px)', transition: 'all .15s',
                }}>{side}</button>
              ))}
            </div>
            <button onClick={() => setAuto(!auto)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '5px 10px', fontSize: 9, letterSpacing: 1.6, textTransform: 'uppercase', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(20px)', fontFamily: sans }}>
              {auto ? 'Pause' : 'Rotate'}
            </button>
          </div>

          {/* Dual-hand viewport */}
          <div style={{ position: 'absolute', top: 56, bottom: 72, left: 0, right: 0, display: 'flex' }}>
            {(['left', 'right'] as HandSide[]).map((side) => {
              const isActive = activeHand === side;
              const handGemCount = Object.values(allGems[side]).reduce((s, l) => s + (l?.length ?? 0), 0);
              return (
                <div key={side} style={{
                  flex: 1, position: 'relative',
                  borderRight: side === 'left' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  transition: 'box-shadow .25s',
                  boxShadow: isActive ? 'inset 0 0 0 1px rgba(255,255,255,0.08)' : 'none',
                }}>
                  <Hand3D shape={shape} length={length} material={ALL_COLORS.find(c => c.k === material)?.mat ?? material} gems={allGems[side]} autoRotate={auto} side={side} />
                  {/* Hand selector pill */}
                  <button
                    onClick={() => setActiveHand(side)}
                    style={{
                      position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
                      background: isActive ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.45)',
                      border: isActive ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 100, padding: '5px 14px', cursor: 'pointer',
                      backdropFilter: 'blur(24px)', zIndex: 5,
                      display: 'flex', alignItems: 'center', gap: 7,
                    }}
                  >
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: isActive ? '#fff' : 'rgba(255,255,255,0.28)', flexShrink: 0 }} />
                    <span style={{ fontFamily: sans, fontSize: 9, letterSpacing: 1.8, textTransform: 'uppercase' as const, color: isActive ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                      {side}{isActive ? ' · editing' : ''}
                    </span>
                    {handGemCount > 0 && (
                      <span style={{ fontFamily: sans, fontSize: 8, color: isActive ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>{handGemCount}g</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom caption */}
          <div style={{ position: 'absolute', bottom: 0, left: 22, right: 22, height: 72, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, pointerEvents: 'none' }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: sans }}>Edition n04 - LP-0407</div>
              <div style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: 22, fontWeight: 300, marginTop: 4, letterSpacing: -0.5 }}>{matName}, {length}.</div>
            </div>
            <div style={{ fontFamily: mono, fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, textAlign: 'right' }}>
              <div>drag to orbit</div>
              <div style={{ marginTop: 2 }}>both hands · live</div>
            </div>
          </div>
        </div>

        {/* ── RIGHT RAIL ── */}
        <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>

          {/* Color section */}
          <div style={{ padding: '22px 20px 0', flexShrink: 0 }}>
            <div style={{ fontSize: 9, letterSpacing: 2.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 12, fontFamily: sans }}>Finish</div>
            {/* Category tabs */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 14 }}>
              {COLOR_CATEGORIES.map((cat, i) => (
                <button key={cat.label} onClick={() => setActiveColorCat(i)} style={{
                  padding: '4px 9px', borderRadius: 100, cursor: 'pointer', fontFamily: sans,
                  fontSize: 8, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 500,
                  background: i === activeColorCat ? '#fff' : 'rgba(255,255,255,0.04)',
                  color: i === activeColorCat ? '#000' : 'rgba(255,255,255,0.55)',
                  border: i === activeColorCat ? '1px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                  transition: 'all .15s',
                }}>{cat.label}</button>
              ))}
            </div>
          </div>

          {/* Color grid - scrollable */}
          <div style={{ padding: '0 20px', overflowY: 'auto', flexShrink: 0, maxHeight: 210 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, paddingBottom: 4 }}>
              {COLOR_CATEGORIES[activeColorCat].colors.map((c) => (
                <ColorSwatch key={c.k} entry={c} active={c.k === material} onClick={() => setMaterial(c.k)} />
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 20px 0', flexShrink: 0 }} />

          {/* Gem section */}
          <div style={{ padding: '14px 20px 0', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <div style={{ fontSize: 9, letterSpacing: 2.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: sans }}>Gems</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: 11, color: 'rgba(255,255,255,0.6)' }}><span style={{ color: '#fff' }}>{activeHand}</span> · <span style={{ color: '#fff' }}>{activeFinger}</span></div>
                <button onClick={clearAll} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 8, letterSpacing: 1.4, textTransform: 'uppercase', cursor: 'pointer', padding: 0, fontFamily: sans }}>Clear all</button>
              </div>
            </div>

            {/* Zone picker */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 8, letterSpacing: 1.6, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 6, fontFamily: sans }}>Placement zone</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {GEM_ZONES.map((z) => (
                  <button key={z.id} onClick={() => setActiveGemZone(z.id)} style={{
                    flex: 1, padding: '6px 2px', borderRadius: 8, cursor: 'pointer', fontFamily: sans,
                    background: z.id === activeGemZone ? '#fff' : 'rgba(255,255,255,0.04)',
                    color: z.id === activeGemZone ? '#000' : 'rgba(255,255,255,0.55)',
                    border: z.id === activeGemZone ? '1px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                    fontSize: 14, lineHeight: 1, transition: 'all .14s',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                  }}>
                    <span style={{ fontSize: 12 }}>{z.icon}</span>
                    <span style={{ fontSize: 7, letterSpacing: 0.8, textTransform: 'uppercase' }}>{z.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Shape picker */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 8, letterSpacing: 1.6, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 6, fontFamily: sans }}>Cut</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {GEM_SHAPES.map((s) => (
                  <button key={s.id} onClick={() => setActiveGemShape(s.id)} style={{ padding: '4px 8px', borderRadius: 100, background: s.id === activeGemShape ? '#fff' : 'transparent', border: s.id === activeGemShape ? '1px solid #fff' : '1px solid rgba(255,255,255,0.12)', color: s.id === activeGemShape ? '#000' : 'rgba(255,255,255,0.55)', fontSize: 8, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer', fontFamily: sans, transition: 'all .14s' }}>{s.name}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Gem grid - scrollable */}
          <div style={{ padding: '0 20px', overflowY: 'auto', flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, rowGap: 12, paddingBottom: 12 }}>
              {GEM_LIBRARY.map((g) => (
                <button key={g.id} onClick={() => addGem(g.id)} title={`Add ${g.name} gem`} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', margin: '0 auto', background: g.tint, border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 3px 8px -3px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.3)' }} />
                  <div style={{ marginTop: 4, fontFamily: fraunces, fontStyle: 'italic', fontSize: 9, color: 'rgba(255,255,255,0.55)', lineHeight: 1.2 }}>{g.name}</div>
                  <div style={{ marginTop: 2, fontFamily: sans, fontSize: 7, letterSpacing: 1, textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.28)' }}>{g.brand}</div>
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 6, fontFamily: fraunces, fontStyle: 'italic', fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>
              {(gems[activeFinger] ?? []).length} gem{(gems[activeFinger] ?? []).length !== 1 ? 's' : ''} on {activeHand} · {activeFinger} — {totalGemsAll} total
            </div>
          </div>

          {/* Booking ticket */}
          <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <div style={{ padding: '16px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', fontFamily: sans }}>Time</div>
                  <div style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: 20, marginTop: 1 }}>{totalGemsAll > 3 ? '2h 40m' : totalGemsAll > 0 ? '2h 10m' : '1h 20m'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', fontFamily: sans }}>Tier</div>
                  <div style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: 20, marginTop: 1 }}>{totalGemsAll > 3 ? 'III' : totalGemsAll > 0 ? 'II' : 'I'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', fontFamily: sans }}>Price</div>
                  <div style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: 20, marginTop: 1 }}>{totalGemsAll > 3 ? '165 EUR' : totalGemsAll > 0 ? '140 EUR' : '80 EUR'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#3a3a3e,#0a0a0a)', border: '1px solid rgba(255,255,255,0.16)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, fontFamily: sans }}>Ines M.</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: sans }}>Studio Marais - 4.96 stars</div>
                </div>
                <div style={{ fontSize: 8, letterSpacing: 1.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: sans }}>Match</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={handleReserve} style={{ flex: 1, padding: '13px 0', borderRadius: 100, background: '#fff', color: '#000', border: 'none', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', fontFamily: sans }}>Reserve</button>
              <button onClick={() => navigate({ to: '/ar', search: { color: material, shape: (shape === 'stiletto' ? 'almond' : shape) as 'oval' | 'square' | 'almond' | 'coffin', length: length === 'short' ? 0.2 : length === 'medium' ? 0.5 : length === 'long' ? 0.75 : 1.0 } })} style={{ padding: '13px 14px', borderRadius: 100, background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.14)', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer', fontFamily: sans, whiteSpace: 'nowrap' }}>AR ↗</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: '13px 16px', borderRadius: 100, background: 'transparent', color: saveMsg === 'Design saved!' ? '#60e090' : '#fff', border: `1px solid ${saveMsg === 'Design saved!' ? 'rgba(96,224,144,0.4)' : 'rgba(255,255,255,0.18)'}`, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer', fontFamily: sans, opacity: saving ? 0.6 : 1 }}>{saving ? '…' : saveMsg ?? 'Save'}</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
