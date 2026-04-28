// nail-shared.tsx — CSS-based nail renders, shared across the Lab.

import React from 'react';

export type NailShape = 'almond' | 'coffin' | 'square' | 'stiletto' | 'oval';
export type NailLength = 'short' | 'medium' | 'long' | 'xlong';
export type MaterialKey = 'chrome' | 'onyx' | 'pearl' | 'crystal' | 'blood' | 'bone' | 'glass' | 'jet' | 'bordeaux';

function nailPath(shape: NailShape, w: number, h: number): string {
  const r = w / 2;
  switch (shape) {
    case 'square':
      return `M0,${h * 0.15} Q0,0 ${r},0 Q${w},0 ${w},${h * 0.15} L${w},${h} L0,${h} Z`;
    case 'coffin':
      return `M0,${h * 0.18} Q0,0 ${r},0 Q${w},0 ${w},${h * 0.18} L${w * 0.78},${h} L${w * 0.22},${h} Z`;
    case 'stiletto':
      return `M0,${h * 0.22} Q0,0 ${r},0 Q${w},0 ${w},${h * 0.22} L${r},${h} Z`;
    case 'oval':
      return `M0,${h * 0.25} Q0,0 ${r},0 Q${w},0 ${w},${h * 0.25} Q${w},${h} ${r},${h} Q0,${h} 0,${h * 0.25} Z`;
    case 'almond':
    default:
      return `M0,${h * 0.22} Q0,0 ${r},0 Q${w},0 ${w},${h * 0.22} Q${w * 0.95},${h * 0.92} ${r},${h} Q${w * 0.05},${h * 0.92} 0,${h * 0.22} Z`;
  }
}

export const MATERIALS: Record<MaterialKey, { bg: string; spec: string; rim: string }> = {
  chrome: {
    bg: 'linear-gradient(180deg,#fafafa 0%,#9aa0a6 28%,#1a1a1c 55%,#6e7177 78%,#e8e9ec 100%)',
    spec: 'radial-gradient(ellipse 60% 25% at 50% 18%, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%)',
    rim: 'rgba(255,255,255,0.5)',
  },
  onyx: {
    bg: 'linear-gradient(180deg,#2b2b2e 0%,#0a0a0b 50%,#1a1a1d 100%)',
    spec: 'radial-gradient(ellipse 55% 18% at 50% 12%, rgba(255,255,255,0.55), rgba(255,255,255,0) 70%)',
    rim: 'rgba(255,255,255,0.18)',
  },
  pearl: {
    bg: 'linear-gradient(180deg,#fff 0%,#f3ecdf 45%,#e0d4c3 100%)',
    spec: 'radial-gradient(ellipse 55% 22% at 45% 18%, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%)',
    rim: 'rgba(255,255,255,0.7)',
  },
  crystal: {
    bg: 'linear-gradient(180deg,rgba(220,230,240,0.7) 0%,rgba(160,180,200,0.5) 50%,rgba(220,230,240,0.7) 100%)',
    spec: 'radial-gradient(ellipse 55% 25% at 50% 18%, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%)',
    rim: 'rgba(255,255,255,0.6)',
  },
  blood: {
    bg: 'linear-gradient(180deg,#5a0a0e 0%,#1a0204 55%,#3a0608 100%)',
    spec: 'radial-gradient(ellipse 50% 18% at 50% 14%, rgba(255,200,200,0.6), rgba(255,200,200,0) 70%)',
    rim: 'rgba(255,180,180,0.25)',
  },
  bone: {
    bg: 'linear-gradient(180deg,#f5efe2 0%,#e6dbc6 100%)',
    spec: 'radial-gradient(ellipse 50% 18% at 50% 14%, rgba(255,255,255,0.7), rgba(255,255,255,0) 70%)',
    rim: 'rgba(255,255,255,0.6)',
  },
  glass: {
    bg: 'linear-gradient(180deg,rgba(255,255,255,0.15) 0%,rgba(255,255,255,0.05) 100%)',
    spec: 'radial-gradient(ellipse 60% 28% at 50% 18%, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%)',
    rim: 'rgba(255,255,255,0.4)',
  },
  jet: {
    bg: 'linear-gradient(180deg,#3a3a3e 0%,#000 50%,#1a1a1c 100%)',
    spec: 'radial-gradient(ellipse 50% 18% at 50% 14%, rgba(255,255,255,0.4), rgba(255,255,255,0) 70%)',
    rim: 'rgba(255,255,255,0.15)',
  },
  bordeaux: {
    bg: 'linear-gradient(180deg,#5a0a0e 0%,#1a0204 55%,#3a0608 100%)',
    spec: 'radial-gradient(ellipse 50% 18% at 50% 14%, rgba(255,200,200,0.5), rgba(255,200,200,0) 70%)',
    rim: 'rgba(255,180,180,0.2)',
  },
};

const LENGTH_MAP: Record<NailLength, number> = { short: 0.9, medium: 1.25, long: 1.65, xlong: 2.0 };

let idCounter = 0;

export function NailRender({
  shape = 'almond',
  length = 'long',
  material = 'chrome',
  width = 64,
  accent = null,
  gem = false,
  chromeStripe = false,
  style = {},
}: {
  shape?: NailShape;
  length?: NailLength;
  material?: MaterialKey;
  width?: number;
  accent?: string | null;
  gem?: boolean;
  chromeStripe?: boolean;
  style?: React.CSSProperties;
}) {
  const id = React.useId().replace(/:/g, '');
  const baseH = width * 1.4 * LENGTH_MAP[length];
  const path = nailPath(shape, width, baseH);
  const m = MATERIALS[material] ?? MATERIALS.chrome;

  return (
    <div style={{ position: 'relative', width, height: baseH, ...style }}>
      <svg width={width} height={baseH} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <clipPath id={`clip-${id}`}><path d={path} /></clipPath>
        </defs>
        {/* base material */}
        <foreignObject width={width} height={baseH} clipPath={`url(#clip-${id})`}>
          <div style={{ width: '100%', height: '100%', background: m.bg }} />
        </foreignObject>
        {/* specular highlight */}
        <foreignObject width={width} height={baseH} clipPath={`url(#clip-${id})`}>
          <div style={{ width: '100%', height: '100%', background: m.spec, mixBlendMode: 'screen' }} />
        </foreignObject>
        {/* french / accent tip */}
        {accent && (
          <foreignObject width={width} height={baseH} clipPath={`url(#clip-${id})`}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '38%', background: accent, opacity: 0.95 }} />
          </foreignObject>
        )}
        {/* chrome stripe */}
        {chromeStripe && (
          <foreignObject width={width} height={baseH} clipPath={`url(#clip-${id})`}>
            <div style={{ position: 'absolute', left: '40%', top: 0, width: '20%', height: '100%', background: 'linear-gradient(180deg,#fff,#aaa,#fff)', mixBlendMode: 'screen', opacity: 0.7 }} />
          </foreignObject>
        )}
        <path d={path} fill="none" stroke={m.rim} strokeWidth="0.8" />
        <path d={path} fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="0.4" />
      </svg>
      {gem && (
        <div style={{
          position: 'absolute',
          left: '50%', top: '60%', transform: 'translate(-50%,-50%)',
          width: width * 0.18, height: width * 0.18, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #fff 0%, #d8d8de 30%, #6a6a72 70%, #fff 100%)',
          boxShadow: '0 0 4px rgba(255,255,255,0.6), inset 0 0 2px rgba(0,0,0,0.4)',
        }} />
      )}
    </div>
  );
}

export function HandLayout({
  shape,
  material,
  length = 'long',
  accent,
  gem = [false, false, false, false, false],
  chromeStripe = [false, false, false, false, false],
  scale = 1,
  style = {},
}: {
  shape: NailShape;
  material: MaterialKey;
  length?: NailLength;
  accent?: string;
  gem?: boolean[];
  chromeStripe?: boolean[];
  scale?: number;
  style?: React.CSSProperties;
}) {
  const fingers = [
    { w: 38 * scale, len: 0.9, x: 0, y: 30 },
    { w: 36 * scale, len: 1.0, x: 56, y: 8 },
    { w: 38 * scale, len: 1.1, x: 110, y: 0 },
    { w: 36 * scale, len: 1.0, x: 166, y: 12 },
    { w: 32 * scale, len: 0.85, x: 218, y: 30 },
  ];
  return (
    <div style={{ position: 'relative', width: 256 * scale, height: 220 * scale, ...style }}>
      {fingers.map((f, i) => (
        <div key={i} style={{ position: 'absolute', left: f.x * scale, bottom: -f.y * scale }}>
          <NailRender
            shape={shape}
            material={material}
            length={length}
            accent={accent}
            gem={gem[i]}
            chromeStripe={chromeStripe[i]}
            width={f.w}
          />
        </div>
      ))}
    </div>
  );
}
