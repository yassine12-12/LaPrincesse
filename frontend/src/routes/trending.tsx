import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/trending')({
  head: () => ({
    meta: [
      { title: 'Trending Nails — LaPrincesse' },
      { name: 'description', content: 'Explore the most popular nail designs. Try any look instantly in the 3D Lab or book an appointment.' },
    ],
  }),
  component: TrendingPage,
});

const fraunces = '"Fraunces", "Georgia", serif';
const mono = '"JetBrains Mono", ui-monospace, monospace';
const sans = '"Inter", "Helvetica Neue", sans-serif';

const TRENDING_DESIGNS = [
  {
    id: 1, rank: 1, name: 'Chrome Mirror', sub: 'The #1 Viral Look',
    material: 'chrome-mirror', mat: 'chrome', shape: 'oval', length: 'medium',
    bg: 'linear-gradient(135deg,#e8edf2 0%,#9aa0a8 40%,#1a1a1e 100%)',
    tags: ['#chromenails', '#viral', '#silvermirror'],
    description: 'Liquid metal finish, blindingly reflective. The look that took over the internet.',
    saves: 12840,
  },
  {
    id: 2, rank: 2, name: 'Ballet Pink', sub: 'Quiet Luxury',
    material: 'essie-ballet', mat: 'babypink', shape: 'almond', length: 'long',
    bg: 'linear-gradient(135deg,#fde8e8 0%,#f8d0d0 60%,#e8b8b8 100%)',
    tags: ['#quietluxury', '#balletpink', '#essie'],
    description: 'Essie Ballet Slippers, the nail colour royals have worn for decades.',
    saves: 9220,
  },
  {
    id: 3, rank: 3, name: 'Bordeaux Vamp', sub: 'After Dark',
    material: 'chanel-vamp', mat: 'cherry', shape: 'coffin', length: 'long',
    bg: 'linear-gradient(135deg,#500818 0%,#280408 60%,#120204 100%)',
    tags: ['#chanel', '#vamp', '#vampire'],
    description: 'Chanel Vamp — the original dark nail that redefined fashion in 1994.',
    saves: 8310,
  },
  {
    id: 4, rank: 4, name: 'Gold Chrome', sub: 'Power Luxe',
    material: 'gold-chrome', mat: 'gold', shape: 'coffin', length: 'medium',
    bg: 'linear-gradient(135deg,#fff8c0 0%,#d4a840 50%,#7a5a10 100%)',
    tags: ['#goldnails', '#chrome', '#luxe'],
    description: 'Intense 24K gold mirror powder over a gel base. Stops traffic.',
    saves: 7640,
  },
  {
    id: 5, rank: 5, name: 'Rose Gold Shimmer', sub: 'Soft Power',
    material: 'rosegold-chrome', mat: 'rosegold', shape: 'almond', length: 'medium',
    bg: 'linear-gradient(135deg,#ffd8d0 0%,#d4886a 60%,#8a4830 100%)',
    tags: ['#rosegold', '#shimmer', '#millennial'],
    description: 'Warm rose gold dust for nails that catch light from every angle.',
    saves: 6980,
  },
  {
    id: 6, rank: 6, name: 'Red Lip Nails', sub: 'Eternal Classic',
    material: 'opi-waitress', mat: 'red', shape: 'oval', length: 'medium',
    bg: 'linear-gradient(135deg,#e02020 0%,#a00a10 60%,#600008 100%)',
    tags: ['#rednails', '#classic', '#OPI'],
    description: 'OPI Not A Waitress. There are no rules, just perfection.',
    saves: 6750,
  },
  {
    id: 7, rank: 7, name: 'Glass Nails', sub: 'Invisible Strength',
    material: 'crystal-glass', mat: 'crystal', shape: 'square', length: 'medium',
    bg: 'linear-gradient(135deg,rgba(220,234,248,0.8) 0%,rgba(155,180,210,0.6) 50%,rgba(220,234,248,0.8) 100%)',
    tags: ['#glassnails', '#transparent', '#minimalist'],
    description: 'Crystal-clear UV gel. No colour, all texture. Seoul-coded.',
    saves: 5910,
  },
  {
    id: 8, rank: 8, name: 'Aurora Borealis', sub: 'Holo Statement',
    material: 'aurora-borealis', mat: 'aurora', shape: 'stiletto', length: 'xlong',
    bg: 'linear-gradient(135deg,#d0e8ff 0%,#e8c8ff 33%,#c8ffd8 66%,#fff0c8 100%)',
    tags: ['#holo', '#aurora', '#rainbow'],
    description: 'Swarovski Aurora Borealis powder shifting from blue to pink to gold.',
    saves: 5540,
  },
  {
    id: 9, rank: 9, name: 'French Porcelaine', sub: 'Elevated Classic',
    material: 'dior-rose-porc', mat: 'blush', shape: 'almond', length: 'long',
    bg: 'linear-gradient(135deg,#f8d8d0 0%,#e8b8a8 60%,#d09888 100%)',
    tags: ['#french', '#dior', '#porcelaine'],
    description: 'Dior Rose Porcelaine — the ultimate elevated French manicure base.',
    saves: 4990,
  },
  {
    id: 10, rank: 10, name: 'Onyx Stiletto', sub: 'Maximum Edge',
    material: 'essie-limo', mat: 'jet', shape: 'stiletto', length: 'xlong',
    bg: 'linear-gradient(135deg,#3a3a3e 0%,#080808 60%,#0a0a0c 100%)',
    tags: ['#blacknails', '#stiletto', '#edge'],
    description: 'Essie Limo-Scene deep black on extreme stiletto length. No compromise.',
    saves: 4420,
  },
  {
    id: 11, rank: 11, name: 'Lilac Dreams', sub: 'Soft Season',
    material: 'essie-lilacism', mat: 'lilac', shape: 'oval', length: 'short',
    bg: 'linear-gradient(135deg,#ecdcf8 0%,#c8a8e8 60%,#a888c8 100%)',
    tags: ['#lilac', '#pastels', '#essie'],
    description: 'Essie Lilacism. Powdery lilac that pairs with everything.',
    saves: 3880,
  },
  {
    id: 12, rank: 12, name: 'Navy Riviera', sub: 'French Côte',
    material: 'dior-minuit', mat: 'navy', shape: 'coffin', length: 'medium',
    bg: 'linear-gradient(135deg,#101830 0%,#060c1a 60%,#02040e 100%)',
    tags: ['#navy', '#dior', '#riviera'],
    description: 'Dior Minuit — deep midnight navy, impossibly chic.',
    saves: 3440,
  },
];

function TrendingCard({ design }: { design: typeof TRENDING_DESIGNS[0] }) {
  const navigate = useNavigate();
  const isTop3 = design.rank <= 3;

  return (
    <div style={{
      borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      transition: 'transform 0.2s ease, border-color 0.2s ease',
      cursor: 'default',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.16)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
    >
      {/* Nail preview */}
      <div style={{ height: 160, background: design.bg, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 40% at 50% 20%, rgba(255,255,255,0.25), transparent 65%)', mixBlendMode: 'screen' }} />
        {isTop3 && (
          <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', borderRadius: 100, padding: '4px 10px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: 1.5, color: '#fff' }}>#{design.rank} Trending</span>
          </div>
        )}
        <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', borderRadius: 100, padding: '4px 10px', border: '1px solid rgba(255,255,255,0.12)' }}>
          <span style={{ fontFamily: mono, fontSize: 9, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 }}>{(design.saves / 1000).toFixed(1)}k saves</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '16px 18px 20px' }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontFamily: fraunces, fontSize: 17, fontStyle: 'italic', color: '#fff', lineHeight: 1.2 }}>{design.name}</div>
          <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: mono, marginTop: 3 }}>{design.sub}</div>
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontFamily: sans, lineHeight: 1.6, marginBottom: 12, margin: '0 0 12px' }}>
          {design.description}
        </p>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const, marginBottom: 14 }}>
          {design.tags.map(t => (
            <span key={t} style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: mono, background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.07)' }}>{t}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => navigate({ to: '/lab', search: { material: design.material, shape: design.shape, length: design.length } as Record<string, string> })}
            style={{ flex: 1, padding: '10px 0', borderRadius: 100, background: '#fff', color: '#000', border: 'none', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', fontFamily: mono, fontWeight: 700, cursor: 'pointer' }}
          >
            Try in Lab
          </button>
          <button
            onClick={() => navigate({ to: '/ar', search: { color: design.mat, shape: design.shape as 'oval' | 'square' | 'almond' | 'coffin', length: design.length === 'short' ? 0.2 : design.length === 'medium' ? 0.5 : 0.75 } })}
            style={{ padding: '10px 14px', borderRadius: 100, background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.14)', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: mono, cursor: 'pointer' }}
          >
            AR
          </button>
        </div>
      </div>
    </div>
  );
}

function TrendingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#080808', fontFamily: sans }}>
      {/* Nav */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
        <Link to="/" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: mono }}>← Home</Link>
        <span style={{ fontFamily: fraunces, fontSize: 16, fontStyle: 'italic', color: '#fff' }}>Trending</span>
        <Link to="/lab" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: mono }}>Lab →</Link>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: mono, marginBottom: 12 }}>Right Now</div>
          <h1 style={{ fontFamily: fraunces, fontSize: 52, fontStyle: 'italic', fontWeight: 300, color: '#fff', margin: '0 0 16px', lineHeight: 1.05 }}>
            Trending Nails
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: sans, maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>
            The nail designs our community is saving, trying and booking this season.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {TRENDING_DESIGNS.map(d => (
            <TrendingCard key={d.id} design={d} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 64, paddingTop: 48, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontFamily: fraunces, fontSize: 28, fontStyle: 'italic', color: '#fff', marginBottom: 8 }}>Don't see your vibe?</div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, fontFamily: sans, marginBottom: 24 }}>Build something entirely custom in the Lab.</p>
          <Link to="/lab" style={{
            display: 'inline-block', padding: '13px 36px', borderRadius: 100, background: '#fff', color: '#000',
            textDecoration: 'none', fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', fontFamily: mono, fontWeight: 700,
          }}>
            Open Lab
          </Link>
        </div>
      </div>
    </div>
  );
}
