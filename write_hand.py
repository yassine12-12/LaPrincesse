content = r"""// hand-3d.tsx — Realistic WebGL hand · Three.js
// Warm skin tone, soft shadows, knuckle bumps, rich material presets,
// gem zone support (top / tip / side-left / side-right / base).

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { NailShape, NailLength, MaterialKey } from './nail-shared';

export type GemId = string;
export type GemShapeId = 'round' | 'teardrop' | 'square' | 'heart' | 'pearl' | 'marquise' | 'star';
export type GemZone  = 'top' | 'tip' | 'base' | 'left' | 'right';
export type FingerName = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';
export type GemPlacement = { id: GemId; shape: GemShapeId; x?: number; y?: number; zone?: GemZone };
export type GemsMap = Partial<Record<FingerName, GemPlacement[]>>;

interface Hand3DProps {
  shape?: NailShape;
  length?: NailLength;
  material?: MaterialKey;
  accent?: string | null;
  gems?: GemsMap;
  autoRotate?: boolean;
}

const NAIL_LENGTHS: Record<NailLength, number> = { short: 0.45, medium: 0.7, long: 1.0, xlong: 1.35 };

// ── Nail geometry ──────────────────────────────────────────────
function buildNailMesh(T: typeof THREE, w: number, shape: NailShape, length: NailLength) {
  const l = NAIL_LENGTHS[length] ?? 1.0;
  const W = w * 1.55;
  const s = new T.Shape();
  s.moveTo(-W, 0);
  switch (shape) {
    case 'square':
      s.lineTo(-W, l); s.lineTo(W, l); break;
    case 'coffin':
      s.lineTo(-W * 0.95, l * 0.82); s.lineTo(-W * 0.52, l);
      s.lineTo(W * 0.52, l); s.lineTo(W * 0.95, l * 0.82); break;
    case 'stiletto':
      s.lineTo(-W * 0.55, l * 0.38); s.lineTo(0, l); s.lineTo(W * 0.55, l * 0.38); break;
    case 'oval':
      s.bezierCurveTo(-W, l * 0.6, -W * 0.65, l, 0, l);
      s.bezierCurveTo(W * 0.65, l, W, l * 0.6, W, 0); break;
    case 'almond':
    default:
      s.bezierCurveTo(-W * 0.92, l * 0.52, -W * 0.42, l, 0, l);
      s.bezierCurveTo(W * 0.42, l, W * 0.92, l * 0.52, W, 0);
  }
  s.lineTo(W, 0); s.lineTo(-W, 0);
  const geo = new T.ExtrudeGeometry(s, {
    steps: 1, depth: 0.06, bevelEnabled: true,
    bevelThickness: 0.04, bevelSize: 0.035, bevelSegments: 6, curveSegments: 22,
  });
  // Apply C-curve curvature
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const nx = x / W;
    const ny = Math.max(0, Math.min(1, y / l));
    const curveZ = -0.22 * Math.sin(Math.PI * (nx * 0.5 + 0.5)) * (0.5 + 0.5 * ny);
    pos.setZ(i, z + curveZ);
  }
  geo.computeVertexNormals();
  const mesh = new T.Mesh(geo);
  (mesh as any).material = new T.MeshStandardMaterial({ color: 0xffffff });
  mesh.castShadow = true;
  return mesh;
}

// ── Nail material presets ──────────────────────────────────────
function makeNailMaterial(T: typeof THREE, key: string, envMap: THREE.Texture): THREE.Material {
  type P = {
    color: number; metalness?: number; roughness?: number; clearcoat?: number;
    transmission?: number; ior?: number; thickness?: number; envI?: number;
    sheen?: number; sheenColor?: number; opacity?: number; transparent?: boolean;
  };
  const presets: Record<string, P> = {
    // ── Metallics
    chrome:     { color: 0xeeeef2, metalness: 1.0, roughness: 0.06, clearcoat: 1, ior: 2.5,  envI: 2.6 },
    silver:     { color: 0xd8d8ee, metalness: 1.0, roughness: 0.10, clearcoat: 1, envI: 2.2 },
    gold:       { color: 0xd4a840, metalness: 1.0, roughness: 0.12, clearcoat: 1, envI: 2.0 },
    rosegold:   { color: 0xd4886a, metalness: 1.0, roughness: 0.10, clearcoat: 1, envI: 2.0 },
    bronze:     { color: 0xa07840, metalness: 1.0, roughness: 0.18, clearcoat: 1, envI: 1.8 },
    platinum:   { color: 0xe8e8f4, metalness: 1.0, roughness: 0.06, clearcoat: 1, envI: 2.4 },
    copper:     { color: 0xb87040, metalness: 1.0, roughness: 0.14, clearcoat: 1, envI: 1.9 },
    // ── Classics
    nude:       { color: 0xd4956a, metalness: 0.0, roughness: 0.35, clearcoat: 0.8, envI: 0.9 },
    french:     { color: 0xfaf0ea, metalness: 0.0, roughness: 0.28, clearcoat: 0.9, sheen: 0.4, sheenColor: 0xfff8f4, envI: 1.0 },
    red:        { color: 0xa00a10, metalness: 0.3, roughness: 0.12, clearcoat: 1,   envI: 1.5 },
    bordeaux:   { color: 0x3a0608, metalness: 0.5, roughness: 0.10, clearcoat: 1,   envI: 1.4 },
    cherry:     { color: 0x6a0010, metalness: 0.4, roughness: 0.10, clearcoat: 1,   envI: 1.5 },
    navy:       { color: 0x08102a, metalness: 0.4, roughness: 0.12, clearcoat: 1,   envI: 1.4 },
    cobalt:     { color: 0x0a28a0, metalness: 0.3, roughness: 0.12, clearcoat: 1,   envI: 1.5 },
    forest:     { color: 0x0a2a10, metalness: 0.4, roughness: 0.12, clearcoat: 1,   envI: 1.4 },
    onyx:       { color: 0x050507, metalness: 0.6, roughness: 0.05, clearcoat: 1,   envI: 1.8 },
    jet:        { color: 0x000000, metalness: 0.2, roughness: 0.7,  envI: 0.4 },
    bone:       { color: 0xe6dbc6, metalness: 0.0, roughness: 0.5,  envI: 0.6 },
    blood:      { color: 0x3a0608, metalness: 0.5, roughness: 0.10, clearcoat: 1,   envI: 1.4 },
    // ── Pastels
    babypink:   { color: 0xf8c8d4, metalness: 0.0, roughness: 0.32, clearcoat: 0.7, sheen: 0.3, sheenColor: 0xfff0f4, envI: 0.9 },
    lavender:   { color: 0xc8b0e4, metalness: 0.0, roughness: 0.32, clearcoat: 0.7, envI: 0.9 },
    mint:       { color: 0x9ae0c4, metalness: 0.0, roughness: 0.32, clearcoat: 0.7, envI: 0.9 },
    peach:      { color: 0xf4c0a0, metalness: 0.0, roughness: 0.32, clearcoat: 0.7, envI: 0.9 },
    sky:        { color: 0xa8c8f4, metalness: 0.0, roughness: 0.32, clearcoat: 0.7, envI: 0.9 },
    butter:     { color: 0xf4e4a0, metalness: 0.0, roughness: 0.32, clearcoat: 0.7, envI: 0.9 },
    lilac:      { color: 0xd4b0f4, metalness: 0.0, roughness: 0.28, clearcoat: 0.8, envI: 1.0 },
    blush:      { color: 0xf4c0c4, metalness: 0.0, roughness: 0.30, clearcoat: 0.7, envI: 0.9 },
    // ── Neons
    neonpink:   { color: 0xff1080, metalness: 0.1, roughness: 0.08, clearcoat: 1,   envI: 1.2 },
    neonlime:   { color: 0x70e800, metalness: 0.1, roughness: 0.08, clearcoat: 1,   envI: 1.2 },
    neoncyan:   { color: 0x00e8e8, metalness: 0.1, roughness: 0.06, clearcoat: 1,   envI: 1.4 },
    neonorange: { color: 0xff5800, metalness: 0.1, roughness: 0.08, clearcoat: 1,   envI: 1.2 },
    neonpurple: { color: 0x8800ff, metalness: 0.1, roughness: 0.08, clearcoat: 1,   envI: 1.3 },
    // ── Special
    pearl:      { color: 0xf3ecdf, metalness: 0.3, roughness: 0.18, clearcoat: 1, sheen: 0.7, sheenColor: 0xfffaf4, envI: 1.3 },
    crystal:    { color: 0xc0d0e0, metalness: 0.0, roughness: 0.02, clearcoat: 1, transmission: 0.88, ior: 1.55, thickness: 0.5, envI: 1.8 },
    glass:      { color: 0xffffff, metalness: 0.0, roughness: 0.00, transmission: 1.0, ior: 1.5, thickness: 0.5, envI: 1.6, opacity: 0.1, transparent: true },
    holo:       { color: 0xe0d0f8, metalness: 0.8, roughness: 0.04, clearcoat: 1,   envI: 2.2 },
    glitter:    { color: 0xb0b0e8, metalness: 0.7, roughness: 0.20, clearcoat: 1,   envI: 1.8 },
    matte:      { color: 0x080808, metalness: 0.0, roughness: 0.92, envI: 0.2 },
  };
  const p: P = presets[key] ?? { color: 0xc0c0c8, metalness: 0.5, roughness: 0.2, clearcoat: 1, envI: 1.5 };
  return new T.MeshPhysicalMaterial({
    color: new T.Color(p.color),
    metalness: p.metalness ?? 0,
    roughness: p.roughness ?? 0.3,
    clearcoat: p.clearcoat ?? 0.4,
    clearcoatRoughness: 0.06,
    transmission: p.transmission ?? 0,
    ior: p.ior ?? 1.45,
    thickness: p.thickness ?? 0,
    envMap,
    envMapIntensity: p.envI ?? 1,
    sheen: p.sheen ?? 0,
    sheenColor: p.sheenColor ? new T.Color(p.sheenColor) : new T.Color(0xffffff),
    opacity: p.opacity ?? 1,
    transparent: p.transparent ?? false,
  });
}

// ── Gem materials ───────────────────────────────────────────────
const GEM_MATS: Record<string, any> = {
  crystal:  { color: 0xffffff, roughness: 0.01, metalness: 0.0, transmission: 0.92, ior: 2.0, thickness: 0.4 },
  pearl:    { color: 0xf8f0e0, roughness: 0.12, metalness: 0.0, sheen: 1.0, sheenColor: 0xffffff },
  onyx:     { color: 0x050507, roughness: 0.04, metalness: 0.6, clearcoat: 1 },
  smoke:    { color: 0x787880, roughness: 0.04, metalness: 0.0, transmission: 0.72, ior: 1.75, thickness: 0.4 },
  ruby:     { color: 0x8a0a12, roughness: 0.04, metalness: 0.0, transmission: 0.65, ior: 1.77, thickness: 0.4 },
  sapphire: { color: 0x08163a, roughness: 0.04, metalness: 0.0, transmission: 0.60, ior: 1.77, thickness: 0.4 },
  emerald:  { color: 0x08402a, roughness: 0.04, metalness: 0.0, transmission: 0.65, ior: 1.58, thickness: 0.4 },
  amethyst: { color: 0x500858, roughness: 0.04, metalness: 0.0, transmission: 0.65, ior: 1.55, thickness: 0.4 },
  topaz:    { color: 0xa07828, roughness: 0.04, metalness: 0.0, transmission: 0.60, ior: 1.62, thickness: 0.4 },
  gold:     { color: 0xd4a840, roughness: 0.12, metalness: 1.0, clearcoat: 0.5 },
  silver:   { color: 0xe8e8f0, roughness: 0.08, metalness: 1.0, clearcoat: 0.5 },
  diamond:  { color: 0xf0f4ff, roughness: 0.00, metalness: 0.0, transmission: 0.95, ior: 2.42, thickness: 0.5 },
  obsidian: { color: 0x020205, roughness: 0.02, metalness: 0.5, clearcoat: 1 },
};

function makeGemGeo(T: typeof THREE, shapeId: GemShapeId): THREE.BufferGeometry {
  switch (shapeId) {
    case 'teardrop': { const g = new T.SphereGeometry(0.08, 24, 24); g.scale(0.85, 1.55, 0.65); return g; }
    case 'square':   return new T.BoxGeometry(0.12, 0.12, 0.065);
    case 'heart':    { const g = new T.SphereGeometry(0.08, 24, 24); g.scale(1.1, 0.95, 0.55); return g; }
    case 'pearl':    return new T.SphereGeometry(0.10, 28, 28);
    case 'marquise': { const g = new T.SphereGeometry(0.07, 24, 24); g.scale(0.6, 1.8, 0.6); return g; }
    case 'star':     return new T.OctahedronGeometry(0.09, 0);
    default:         return new T.SphereGeometry(0.085, 28, 28);
  }
}

// ── Component ──────────────────────────────────────────────────
export default function Hand3D({
  shape = 'almond',
  length = 'long',
  material = 'chrome',
  accent = null,
  gems = {},
  autoRotate = true,
}: Hand3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<any>({});

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const T = THREE;

    const w = el.clientWidth || 600;
    const h = el.clientHeight || 600;

    // ── Renderer ──
    const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);

    // ── Scene ──
    const scene = new T.Scene();
    scene.background = null;

    // ── Camera ──
    const camera = new T.PerspectiveCamera(36, w / h, 0.1, 100);
    camera.position.set(0, 2.2, 17);
    camera.lookAt(0, 0.6, 0);

    // ── Env map (for metallic reflections) ──
    const pmrem = new T.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const envScene = new T.Scene();
    const envBg = new T.Mesh(new T.SphereGeometry(50, 32, 16), new T.MeshBasicMaterial({ color: 0x0a0a0e, side: T.BackSide }));
    envScene.add(envBg);
    [
      { c: 0xfff5e8, p: [0, 14, 6],   s: 10 },
      { c: 0xc0c8e0, p: [-12, 3, -5], s: 8 },
      { c: 0xffffff, p: [12, -4, 4],  s: 6 },
      { c: 0x606068, p: [0, -12, 0],  s: 8 },
      { c: 0xffffff, p: [0, 2, 14],   s: 5 },
      { c: 0xffe0c0, p: [6, 6, 2],    s: 4 },
    ].forEach(({ c, p, s }: any) => {
      const m = new T.Mesh(new T.PlaneGeometry(s, s), new T.MeshBasicMaterial({ color: c }));
      m.position.set(...p as [number,number,number]); m.lookAt(0, 0, 0);
      envScene.add(m);
    });
    const envMap = pmrem.fromScene(envScene, 0.04).texture;
    scene.environment = envMap;

    // ── Lights ──
    // Key light (warm, with shadows)
    const keyLight = new T.DirectionalLight(0xfff8e8, 2.4);
    keyLight.position.set(3, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 40;
    keyLight.shadow.camera.left = -8;
    keyLight.shadow.camera.right = 8;
    keyLight.shadow.camera.top = 8;
    keyLight.shadow.camera.bottom = -8;
    keyLight.shadow.radius = 5;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Rim light (cool blue from behind)
    const rimLight = new T.DirectionalLight(0xc0d0f0, 1.8);
    rimLight.position.set(-4, 3, -5);
    scene.add(rimLight);

    // Fill (warm, soft, from below-front)
    const fillLight = new T.DirectionalLight(0xffe8d0, 0.6);
    fillLight.position.set(1, -2, 4);
    scene.add(fillLight);

    // Ambient (very subtle)
    scene.add(new T.AmbientLight(0xffeedd, 0.18));

    // ── Skin material ──
    const skinMat = new T.MeshPhysicalMaterial({
      color: new T.Color(0xa07050),   // warm medium-dark skin
      roughness: 0.68,
      metalness: 0.0,
      clearcoat: 0.06,
      clearcoatRoughness: 0.85,
      sheen: 0.75,
      sheenRoughness: 0.5,
      sheenColor: new T.Color(0xd06040),  // warm pink subsurface glow
      envMap,
      envMapIntensity: 0.35,
    });
    const skinMatNail = new T.MeshPhysicalMaterial({
      color: new T.Color(0x8a5e40),
      roughness: 0.6, metalness: 0.0, clearcoat: 0.1,
      envMap, envMapIntensity: 0.3,
    });

    const hand = new T.Group();
    hand.rotation.x = -0.12;
    hand.position.y = -0.3;
    scene.add(hand);

    function addSkin(geo: THREE.BufferGeometry, mat = skinMat) {
      const m = new T.Mesh(geo, mat);
      m.castShadow = true; m.receiveShadow = true;
      return m;
    }

    // ── Palm ──
    const palmGeo = new T.BoxGeometry(2.1, 2.5, 0.72, 3, 3, 2);
    const palmPos = palmGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < palmPos.count; i++) {
      const x = palmPos.getX(i), y = palmPos.getY(i);
      const taper = 1 - 0.045 * Math.abs(y);
      palmPos.setX(i, x * taper);
      // Thumb mound
      const thumbMound = Math.exp(-Math.pow((x + 1.0) / 0.4, 2) - Math.pow((y + 0.5) / 0.6, 2)) * 0.12;
      palmPos.setZ(i, palmPos.getZ(i) + thumbMound);
    }
    palmGeo.computeVertexNormals();
    const palm = addSkin(palmGeo);
    palm.position.y = -0.4;
    hand.add(palm);

    // ── Wrist ──
    const wristGeo = new T.CylinderGeometry(1.08, 1.18, 0.65, 28, 1, true);
    const wrist = addSkin(wristGeo);
    wrist.position.y = -1.85; wrist.scale.z = 0.37;
    hand.add(wrist);

    // ── Fingers ──
    const fingerSpecs = [
      { name: 'thumb'  as FingerName, x: -1.08, y: -0.55, len: 1.52, w: 0.35, angle:  0.48, twist:  0.22 },
      { name: 'index'  as FingerName, x: -0.68, y:  0.98, len: 2.0,  w: 0.29, angle:  0.05, twist:  0 },
      { name: 'middle' as FingerName, x: -0.20, y:  1.08, len: 2.2,  w: 0.31, angle:  0,    twist:  0 },
      { name: 'ring'   as FingerName, x:  0.28, y:  1.00, len: 2.05, w: 0.29, angle: -0.04, twist:  0 },
      { name: 'pinky'  as FingerName, x:  0.75, y:  0.76, len: 1.58, w: 0.25, angle: -0.12, twist:  0 },
    ];

    type NailMeshRef = { mesh: THREE.Mesh; holder: THREE.Group; baseW: number; fingerName: FingerName };
    const nailMeshes: NailMeshRef[] = [];

    fingerSpecs.forEach((spec) => {
      const segLen = spec.len / 3;
      const fingerGroup = new T.Group();
      fingerGroup.position.set(spec.x, spec.y, 0);
      fingerGroup.rotation.z = spec.angle;
      fingerGroup.rotation.y = spec.twist;

      let carry = new T.Group();
      fingerGroup.add(carry);

      for (let i = 0; i < 3; i++) {
        const wTaper = spec.w * (1 - i * 0.065);
        const seg = addSkin(new T.CapsuleGeometry(wTaper, segLen * 0.88, 8, 14));
        seg.position.y = segLen * 0.44;
        carry.add(seg);

        // Knuckle bump sphere at joint
        if (i < 2) {
          const knuckleSz = wTaper * 1.08;
          const knuckle = addSkin(new T.SphereGeometry(knuckleSz, 14, 10));
          knuckle.scale.set(1, 0.75, 0.85);
          knuckle.position.y = segLen * 0.9;
          carry.add(knuckle);
        }

        const next = new T.Group();
        next.position.y = segLen;
        next.rotation.x = i === 0 ? -0.05 : -0.07;
        carry.add(next);
        carry = next;
      }

      // Fingertip pad
      const tipPad = addSkin(new T.SphereGeometry(spec.w * 0.9, 14, 10), skinMat);
      tipPad.scale.set(1, 0.6, 0.9);
      tipPad.position.y = segLen * 0.12;
      carry.add(tipPad);

      // Nail bed (thin flat plate under nail)
      const bedGeo = new T.BoxGeometry(spec.w * 3.0, segLen * 0.68, 0.04);
      const bed = addSkin(bedGeo, skinMatNail);
      bed.position.set(0, segLen * 0.3, spec.w * 0.55);
      carry.add(bed);

      // Nail holder
      const nailHolder = new T.Group();
      nailHolder.position.set(0, 0.06, spec.w * 0.58);
      nailHolder.rotation.x = -0.3;
      carry.add(nailHolder);

      const nailMesh = buildNailMesh(T, spec.w, shape, length);
      nailHolder.add(nailMesh);
      nailMeshes.push({ mesh: nailMesh, holder: nailHolder, baseW: spec.w, fingerName: spec.name });
      hand.add(fingerGroup);
    });

    // ── Material application ──
    function applyMaterial(matKey: string) {
      nailMeshes.forEach(({ mesh }) => {
        const old = mesh.material as THREE.Material;
        mesh.material = makeNailMaterial(T, matKey, envMap);
        if (old?.dispose) old.dispose();
      });
    }
    applyMaterial(material);

    // ── Gems ──
    const gemGroup = new T.Group();
    hand.add(gemGroup);

    function applyGems(gemMap: GemsMap) {
      while (gemGroup.children.length) {
        const c = gemGroup.children[0] as THREE.Mesh;
        gemGroup.remove(c);
        (c.geometry as THREE.BufferGeometry)?.dispose?.();
        (c.material as THREE.Material)?.dispose?.();
      }
      if (!gemMap) return;
      const fingerIdx: Record<FingerName, number> = { thumb: 0, index: 1, middle: 2, ring: 3, pinky: 4 };
      (Object.entries(gemMap) as [FingerName, GemPlacement[]][]).forEach(([finger, list]) => {
        const idx = fingerIdx[finger];
        const target = nailMeshes[idx];
        if (!target || !list?.length) return;
        list.forEach((gem) => {
          const matSpec = GEM_MATS[gem.id] ?? GEM_MATS.crystal;
          const gemMat = new T.MeshPhysicalMaterial({
            color: new T.Color(matSpec.color ?? 0xffffff),
            roughness: matSpec.roughness ?? 0.05,
            metalness: matSpec.metalness ?? 0,
            clearcoat: matSpec.clearcoat ?? 0.8,
            clearcoatRoughness: 0.04,
            transmission: matSpec.transmission ?? 0,
            ior: matSpec.ior ?? 1.8,
            thickness: matSpec.thickness ?? 0.3,
            sheen: matSpec.sheen ?? 0,
            sheenColor: matSpec.sheenColor ? new T.Color(matSpec.sheenColor) : undefined,
            envMap,
            envMapIntensity: 2.2,
          });
          gemMat.castShadow = true;
          const geo = makeGemGeo(T, gem.shape ?? 'round');
          const g = new T.Mesh(geo, gemMat);
          g.castShadow = true;

          // Zone-based positioning
          const zone = gem.zone ?? 'top';
          const nailL = NAIL_LENGTHS[length] ?? 1.0;
          const nailW = target.baseW * 1.55;
          let lx = (gem.x ?? 0) * nailW * 0.55;
          let ly = (gem.y ?? 0.5) * nailL * 0.85;
          let lz = 0.10;

          if (zone === 'tip') {
            ly = nailL * 0.90;
            lz = 0.02;
          } else if (zone === 'base') {
            ly = 0.08;
            lz = 0.05;
          } else if (zone === 'left') {
            lx = -nailW * 0.80;
            lz = 0.0;
          } else if (zone === 'right') {
            lx = nailW * 0.80;
            lz = 0.0;
          }

          const v = new T.Vector3(lx, ly, lz);
          target.holder.updateWorldMatrix(true, false);
          target.holder.localToWorld(v);
          hand.worldToLocal(v);
          g.position.copy(v);
          gemGroup.add(g);
        });
      });
    }
    applyGems(gems);

    // ── Shadow receiver plane ──
    const shadowPlane = new T.Mesh(
      new T.PlaneGeometry(12, 12),
      new T.ShadowMaterial({ opacity: 0.45 })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.8;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // ── Drag-to-orbit ──
    let dragging = false, lx = 0, ly = 0, yaw = 0, pitch = 0;
    const onDown = (e: MouseEvent | TouchEvent) => {
      dragging = true;
      const p = (e as TouchEvent).touches?.[0] ?? (e as MouseEvent);
      lx = p.clientX; ly = p.clientY;
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      const p = (e as TouchEvent).touches?.[0] ?? (e as MouseEvent);
      yaw += (p.clientX - lx) * 0.009;
      pitch += (p.clientY - ly) * 0.005;
      pitch = Math.max(-0.55, Math.min(0.55, pitch));
      lx = p.clientX; ly = p.clientY;
    };
    const onUp = () => { dragging = false; };
    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    el.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);

    // ── Render loop ──
    let raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (stateRef.current.autoRotate && !dragging) yaw += 0.003;
      hand.rotation.y = yaw;
      hand.rotation.x = -0.12 + pitch;
      renderer.render(scene, camera);
    };
    tick();

    // ── Resize ──
    const resize = () => {
      const nw = el.clientWidth || w, nh = el.clientHeight || h;
      if (nw < 2 || nh < 2) return;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    setTimeout(resize, 50);

    stateRef.current = {
      setShape: (s: NailShape, l: NailLength) => {
        nailMeshes.forEach(({ mesh, baseW }) => {
          const newGeo = buildNailMesh(T, baseW, s, l).geometry;
          (mesh.geometry as THREE.BufferGeometry).dispose();
          mesh.geometry = newGeo;
        });
      },
      setMaterial: (m: string) => applyMaterial(m),
      setGems: (g: GemsMap) => applyGems(g),
      setAuto: (b: boolean) => { stateRef.current.autoRotate = b; },
      autoRotate,
    };
    stateRef.current.autoRotate = autoRotate;

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      renderer.dispose();
      pmrem.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => { stateRef.current.setShape?.(shape, length); }, [shape, length]);
  useEffect(() => { stateRef.current.setMaterial?.(material); }, [material, accent]);
  useEffect(() => { stateRef.current.setGems?.(gems); }, [JSON.stringify(gems)]);
  useEffect(() => { stateRef.current.setAuto?.(autoRotate); }, [autoRotate]);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', position: 'relative', cursor: 'grab' }}
    />
  );
}
"""

with open('/Users/yassinekraiem/Documents/LaPrincesse/frontend/src/components/lab/hand-3d.tsx', 'w') as f:
    f.write(content)
print("hand-3d.tsx written:", len(content), "bytes")
