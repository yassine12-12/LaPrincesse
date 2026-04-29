import { createFileRoute, Link } from '@tanstack/react-router';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export const Route = createFileRoute('/ar')({
  validateSearch: (search: Record<string, unknown>) => ({
    color: typeof search.color === 'string' ? search.color : undefined,
    shape: typeof search.shape === 'string' ? search.shape as NailShape : undefined,
    length: typeof search.length === 'number' ? search.length : undefined,
  }),
  head: () => ({
    meta: [
      { title: 'AR Try-On — LaPrincesse' },
      { name: 'description', content: 'Try on nail colours and shapes in real-time using your camera with MediaPipe hand tracking.' },
    ],
  }),
  component: ARPage,
});

const mono = '"JetBrains Mono", ui-monospace, monospace';
const fraunces = '"Fraunces", "Georgia", serif';
const sans = '"Inter", "Helvetica Neue", sans-serif';

// Landmark indices for each finger (base of distal phalanx, fingertip)
const FINGER_LANDMARKS: Record<string, [number, number]> = {
  thumb:  [3, 4],
  index:  [7, 8],
  middle: [11, 12],
  ring:   [15, 16],
  pinky:  [19, 20],
};

const NAIL_COLORS: { k: string; n: string; color: string; bg: string }[] = [
  { k: 'chrome',   n: 'Chrome',    color: 'rgba(200,208,220,0.90)', bg: 'linear-gradient(180deg,#fafafa,#9aa0a6 40%,#1a1a1c)' },
  { k: 'red',      n: 'Red',       color: 'rgba(200,10,16,0.92)',   bg: 'linear-gradient(180deg,#e02020,#a00a10)' },
  { k: 'rosegold', n: 'Rose Gold', color: 'rgba(212,136,106,0.90)', bg: 'linear-gradient(180deg,#ffd8d0,#d4886a)' },
  { k: 'nude',     n: 'Nude',      color: 'rgba(200,144,120,0.88)', bg: 'linear-gradient(180deg,#eac8a8,#c8a080)' },
  { k: 'babypink', n: 'Pink',      color: 'rgba(248,200,212,0.88)', bg: 'linear-gradient(180deg,#fde8e8,#f8d0d0)' },
  { k: 'gold',     n: 'Gold',      color: 'rgba(212,168,64,0.90)',  bg: 'linear-gradient(180deg,#fff8c0,#d4a840)' },
  { k: 'bordeaux', n: 'Bordeaux',  color: 'rgba(68,8,12,0.92)',     bg: 'linear-gradient(180deg,#601020,#300408)' },
  { k: 'holo',     n: 'Holo',      color: 'rgba(208,192,232,0.88)', bg: 'linear-gradient(135deg,#f0d0f8,#d0e8ff,#d8ffd0,#fff8d0)' },
  { k: 'navy',     n: 'Navy',      color: 'rgba(16,24,40,0.92)',    bg: 'linear-gradient(180deg,#101830,#060c1a)' },
  { k: 'black',    n: 'Black',     color: 'rgba(8,8,10,0.96)',      bg: 'linear-gradient(180deg,#181818,#050505)' },
];

type NailShape = 'oval' | 'square' | 'almond' | 'coffin';

function drawNail(
  ctx: CanvasRenderingContext2D,
  tx: number, ty: number,
  bx: number, by: number,
  color: string,
  shape: NailShape,
  lengthMult: number,
  glossy: boolean,
) {
  const dx = tx - bx;
  const dy = ty - by;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 2) return;

  const angle = Math.atan2(dy, dx);
  const nailLen = dist * (1 + lengthMult * 0.6);
  const nailW = dist * 0.72;

  ctx.save();
  ctx.translate(tx, ty);
  ctx.rotate(angle - Math.PI / 2);

  const path = new Path2D();
  const hw = nailW / 2;

  if (shape === 'square') {
    path.moveTo(-hw, 0);
    path.lineTo(-hw, -nailLen);
    path.lineTo(hw, -nailLen);
    path.lineTo(hw, 0);
    path.closePath();
  } else if (shape === 'coffin') {
    const tw = hw * 0.35;
    path.moveTo(-hw, 0);
    path.lineTo(-tw, -nailLen);
    path.lineTo(tw, -nailLen);
    path.lineTo(hw, 0);
    path.closePath();
  } else if (shape === 'almond') {
    path.moveTo(-hw, 0);
    path.bezierCurveTo(-hw, -nailLen * 0.55, -hw * 0.3, -nailLen * 0.9, 0, -nailLen);
    path.bezierCurveTo(hw * 0.3, -nailLen * 0.9, hw, -nailLen * 0.55, hw, 0);
    path.closePath();
  } else {
    // oval
    path.moveTo(-hw, 0);
    path.bezierCurveTo(-hw, -nailLen * 0.6, -hw * 0.5, -nailLen, 0, -nailLen);
    path.bezierCurveTo(hw * 0.5, -nailLen, hw, -nailLen * 0.6, hw, 0);
    path.closePath();
  }

  // Shadow under nail
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 2;

  ctx.fillStyle = color;
  ctx.fill(path);

  ctx.shadowColor = 'transparent';

  // Gloss highlight
  if (glossy) {
    const gloss = ctx.createLinearGradient(0, -nailLen, 0, 0);
    gloss.addColorStop(0, 'rgba(255,255,255,0.42)');
    gloss.addColorStop(0.35, 'rgba(255,255,255,0.14)');
    gloss.addColorStop(1, 'rgba(255,255,255,0.0)');
    ctx.fillStyle = gloss;
    ctx.fill(path);
  }

  // Rim
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 0.8;
  ctx.stroke(path);

  ctx.restore();
}

export default function ARPage() {
  const search = Route.useSearch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const animRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);

  const [status, setStatus] = useState<'loading' | 'waiting' | 'running' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedColor, setSelectedColor] = useState(() => {
    if (search.color) {
      // Map lab material key → AR color key (best match)
      const matToAr: Record<string, string> = {
        chrome: 'chrome', 'chrome-mirror': 'chrome', gold: 'gold', rosegold: 'rosegold',
        red: 'red', bordeaux: 'bordeaux', navy: 'navy', babypink: 'babypink',
        nude: 'nude', blush: 'nude', french: 'nude', matte: 'black', jet: 'black',
        onyx: 'black', holo: 'holo', glitter: 'holo',
      };
      const arKey = matToAr[search.color] ?? search.color;
      return NAIL_COLORS.find(c => c.k === arKey) ?? NAIL_COLORS[0];
    }
    return NAIL_COLORS[0];
  });
  const [nailShape, setNailShape] = useState<NailShape>(() => {
    if (search.shape) {
      // Map lab shapes → AR shapes (lab has more variants)
      const shapeMap: Record<string, NailShape> = {
        oval: 'oval', square: 'square', almond: 'almond', coffin: 'coffin',
        stiletto: 'almond', ballerina: 'coffin',
      };
      return shapeMap[search.shape] ?? 'oval';
    }
    return 'oval';
  });
  const [lengthMult, setLengthMult] = useState(search.length ?? 0.5);
  const [handsDetected, setHandsDetected] = useState(0);

  // Init MediaPipe
  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm',
        );
        const hl = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 2,
        });
        if (cancelled) { hl.close(); return; }
        landmarkerRef.current = hl;
        setStatus('waiting');
        startCamera();
      } catch (e) {
        if (!cancelled) { setErrorMsg(String(e)); setStatus('error'); }
      }
    }
    init();
    return () => { cancelled = true; };
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current!.play();
        setStatus('running');
        loop();
      };
    } catch (e) {
      setErrorMsg('Camera access denied. Please allow camera permission and reload.');
      setStatus('error');
    }
  }, []);

  const loop = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const hl = landmarkerRef.current;
    if (!video || !canvas || !hl || video.readyState < 2) {
      animRef.current = requestAnimationFrame(loop);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;

    // Mirror transform (selfie mode — flip if front camera)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = performance.now();
    if (video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      const results = hl.detectForVideo(video, now);

      setHandsDetected(results.landmarks.length);

      for (const landmarks of results.landmarks) {
        const w = canvas.width;
        const h = canvas.height;

        for (const [_finger, [baseIdx, tipIdx]] of Object.entries(FINGER_LANDMARKS)) {
          const base = landmarks[baseIdx];
          const tip = landmarks[tipIdx];
          const tx = tip.x * w;
          const ty = tip.y * h;
          const bx = base.x * w;
          const by = base.y * h;

          drawNail(ctx, tx, ty, bx, by, selectedColor.color, nailShape, lengthMult, true);
        }
      }
    }

    animRef.current = requestAnimationFrame(loop);
  }, [selectedColor, nailShape, lengthMult]);

  // Re-attach loop when settings change
  useEffect(() => {
    if (status !== 'running') return;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(loop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [loop, status]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
      landmarkerRef.current?.close();
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', fontFamily: sans }}>
      {/* Top bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }}>
        <Link to="/lab" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: mono }}>
          ← Lab
        </Link>
        <div style={{ fontFamily: fraunces, fontSize: 13, fontStyle: 'italic', color: '#fff', letterSpacing: 1 }}>
          AR Try-On
        </div>
        <div style={{ fontSize: 9, letterSpacing: 1.5, color: handsDetected > 0 ? '#60e090' : 'rgba(255,255,255,0.3)', fontFamily: mono, textTransform: 'uppercase' }}>
          {status === 'loading' && 'Loading model…'}
          {status === 'waiting' && 'Starting camera…'}
          {status === 'running' && (handsDetected > 0 ? `${handsDetected} hand${handsDetected > 1 ? 's' : ''} detected` : 'Show your hand')}
          {status === 'error' && 'Error'}
        </div>
      </div>

      {/* Video + canvas overlay */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video
          ref={videoRef}
          style={{ width: '100%', maxHeight: '100vh', objectFit: 'cover', transform: 'scaleX(-1)' }}
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'scaleX(-1)', pointerEvents: 'none' }}
        />

        {/* Loading overlay */}
        {status === 'loading' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
            <div style={{ fontFamily: fraunces, fontSize: 28, fontStyle: 'italic', color: '#fff', marginBottom: 12 }}>Loading AR…</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: mono, letterSpacing: 1 }}>Downloading hand model (~2 MB)</div>
          </div>
        )}
        {status === 'error' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#080808', padding: 24, textAlign: 'center' }}>
            <div style={{ fontFamily: fraunces, fontSize: 24, fontStyle: 'italic', color: '#fff', marginBottom: 12 }}>Camera unavailable</div>
            <div style={{ fontSize: 12, color: 'rgba(255,100,100,0.8)', fontFamily: sans, maxWidth: 320, lineHeight: 1.6 }}>{errorMsg}</div>
            <button onClick={() => { setStatus('waiting'); startCamera(); }} style={{ marginTop: 24, padding: '12px 28px', borderRadius: 100, background: '#fff', color: '#000', border: 'none', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: mono, cursor: 'pointer' }}>
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Controls panel */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20, padding: '0 0 16px', background: 'linear-gradient(to top, rgba(0,0,0,0.85) 80%, transparent)' }}>
        {/* Shape + Length row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', marginBottom: 12 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: mono, minWidth: 40 }}>Shape</div>
          {(['oval', 'square', 'almond', 'coffin'] as NailShape[]).map(s => (
            <button key={s} onClick={() => setNailShape(s)} style={{
              padding: '6px 12px', borderRadius: 100, border: nailShape === s ? '1px solid #fff' : '1px solid rgba(255,255,255,0.18)',
              background: nailShape === s ? '#fff' : 'transparent', color: nailShape === s ? '#000' : 'rgba(255,255,255,0.6)',
              fontSize: 9, letterSpacing: 1.5, textTransform: 'capitalize', fontFamily: mono, cursor: 'pointer',
            }}>{s}</button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: mono }}>Length</div>
            <input type="range" min={0} max={1} step={0.01} value={lengthMult} onChange={e => setLengthMult(Number(e.target.value))} style={{ width: 80, accentColor: '#fff' }} />
          </div>
        </div>

        {/* Color swatches */}
        <div style={{ display: 'flex', gap: 8, padding: '0 16px', overflowX: 'auto' }}>
          {NAIL_COLORS.map(c => (
            <button key={c.k} onClick={() => setSelectedColor(c)} style={{
              flexShrink: 0, width: 44, height: 56, borderRadius: 8,
              border: selectedColor.k === c.k ? '2px solid #fff' : '2px solid transparent',
              background: c.bg, cursor: 'pointer', outline: 'none', padding: 0,
              boxShadow: selectedColor.k === c.k ? '0 0 0 1px rgba(255,255,255,0.3)' : 'none',
              transition: 'border-color 0.12s',
            }} title={c.n} />
          ))}
        </div>

        {/* Color name */}
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontFamily: mono }}>
          {selectedColor.n}
        </div>
      </div>
    </div>
  );
}
