hand_content = r"""import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { NailShape, NailLength } from './nail-shared';

// ── Types ─────────────────────────────────────────────────────
export type GemId = string;
export type GemShapeId = 'round' | 'teardrop' | 'square' | 'heart' | 'pearl' | 'marquise' | 'star';
export type GemZone = 'top' | 'tip' | 'base' | 'left' | 'right';
export type GemPlacement = { id: GemId; shape: GemShapeId; zone: GemZone; x: number; y: number };
export type GemsMap = Partial<Record<string, GemPlacement[]>>;

// ── Material presets ──────────────────────────────────────────
type MProp = { color: number; metalness: number; roughness: number; clearcoat?: number; clearcoatRoughness?: number; transmission?: number; ior?: number; thickness?: number; sheen?: number; sheenColor?: number; emissive?: number; emissiveIntensity?: number; opacity?: number; transparent?: boolean };

const MAT: Record<string, MProp> = {
  // Metallics
  chrome:    { color:0xdde0e8, metalness:1.00, roughness:0.04, clearcoat:1, clearcoatRoughness:0.01 },
  platinum:  { color:0xe0e4f0, metalness:0.95, roughness:0.08, clearcoat:1, clearcoatRoughness:0.03 },
  silver:    { color:0xc8ccda, metalness:0.96, roughness:0.12, clearcoat:0.9, clearcoatRoughness:0.04 },
  gold:      { color:0xd4a840, metalness:0.98, roughness:0.08, clearcoat:0.8, clearcoatRoughness:0.04 },
  rosegold:  { color:0xd4886a, metalness:0.95, roughness:0.10, clearcoat:0.8, clearcoatRoughness:0.04 },
  bronze:    { color:0xa07840, metalness:0.92, roughness:0.20, clearcoat:0.5, clearcoatRoughness:0.08 },
  copper:    { color:0xb87040, metalness:0.92, roughness:0.18, clearcoat:0.5, clearcoatRoughness:0.06 },
  holo:      { color:0xd0c0e8, metalness:0.92, roughness:0.08, clearcoat:1, clearcoatRoughness:0.02, sheen:1, sheenColor:0xe0d0ff },
  // Classics
  nude:      { color:0xc89078, metalness:0.00, roughness:0.22, clearcoat:0.9, clearcoatRoughness:0.12 },
  french:    { color:0xfff4ee, metalness:0.00, roughness:0.18, clearcoat:1.0, clearcoatRoughness:0.08 },
  red:       { color:0xcc0a10, metalness:0.00, roughness:0.16, clearcoat:1.0, clearcoatRoughness:0.06 },
  cherry:    { color:0x7a0010, metalness:0.00, roughness:0.18, clearcoat:1.0, clearcoatRoughness:0.06 },
  bordeaux:  { color:0x44080c, metalness:0.02, roughness:0.20, clearcoat:1.0, clearcoatRoughness:0.06 },
  navy:      { color:0x101828, metalness:0.02, roughness:0.22, clearcoat:0.9, clearcoatRoughness:0.08 },
  cobalt:    { color:0x1428a0, metalness:0.04, roughness:0.18, clearcoat:1.0, clearcoatRoughness:0.06 },
  forest:    { color:0x143018, metalness:0.02, roughness:0.24, clearcoat:0.8, clearcoatRoughness:0.10 },
  onyx:      { color:0x0e0e10, metalness:0.08, roughness:0.08, clearcoat:1.0, clearcoatRoughness:0.03 },
  matte:     { color:0x0a0a0a, metalness:0.00, roughness:0.96, clearcoat:0.0 },
  // Pastels
  babypink:  { color:0xf8c8d4, metalness:0.00, roughness:0.18, clearcoat:0.9, clearcoatRoughness:0.08 },
  blush:     { color:0xf4c0c4, metalness:0.00, roughness:0.18, clearcoat:0.9, clearcoatRoughness:0.10 },
  lavender:  { color:0xd4c0f0, metalness:0.00, roughness:0.16, clearcoat:1.0, clearcoatRoughness:0.08 },
  lilac:     { color:0xe8c8ff, metalness:0.00, roughness:0.16, clearcoat:1.0, clearcoatRoughness:0.07 },
  mint:      { color:0x9ae8c0, metalness:0.00, roughness:0.18, clearcoat:0.9, clearcoatRoughness:0.09 },
  peach:     { color:0xf8c090, metalness:0.00, roughness:0.20, clearcoat:0.8, clearcoatRoughness:0.10 },
  sky:       { color:0xb8d8f8, metalness:0.00, roughness:0.16, clearcoat:1.0, clearcoatRoughness:0.08 },
  butter:    { color:0xf8f0a0, metalness:0.00, roughness:0.18, clearcoat:0.9, clearcoatRoughness:0.08 },
  // Neons
  neonpink:   { color:0xff1890, metalness:0.06, roughness:0.10, clearcoat:1.0, clearcoatRoughness:0.04, emissive:0xff0880, emissiveIntensity:0.15 },
  neonlime:   { color:0x78e800, metalness:0.06, roughness:0.10, clearcoat:1.0, clearcoatRoughness:0.04, emissive:0x60c800, emissiveIntensity:0.12 },
  neoncyan:   { color:0x00e8e8, metalness:0.06, roughness:0.10, clearcoat:1.0, clearcoatRoughness:0.04, emissive:0x00c8c8, emissiveIntensity:0.12 },
  neonorange: { color:0xff5800, metalness:0.06, roughness:0.10, clearcoat:1.0, clearcoatRoughness:0.04, emissive:0xd04000, emissiveIntensity:0.12 },
  neonpurple: { color:0x9900ff, metalness:0.06, roughness:0.10, clearcoat:1.0, clearcoatRoughness:0.04, emissive:0x7000c8, emissiveIntensity:0.15 },
  // Special
  pearl:     { color:0xf8f0e0, metalness:0.10, roughness:0.12, clearcoat:1.0, clearcoatRoughness:0.04, sheen:0.8, sheenColor:0xfff0e8 },
  crystal:   { color:0xdce8f8, metalness:0.05, roughness:0.04, transmission:0.72, ior:1.52, thickness:0.6, clearcoat:1, clearcoatRoughness:0.01 },
  glass:     { color:0xffffff, metalness:0.00, roughness:0.03, transmission:0.92, ior:1.5, thickness:0.4, clearcoat:1, clearcoatRoughness:0.01, opacity:0.65, transparent:true },
  glitter:   { color:0xd0c8ff, metalness:0.85, roughness:0.30, clearcoat:0.8, clearcoatRoughness:0.30 },
  bone:      { color:0xf0e8d8, metalness:0.00, roughness:0.48, clearcoat:0.3, clearcoatRoughness:0.24 },
  jet:       { color:0x080808, metalness:0.00, roughness:0.78, clearcoat:0.0 },
  blood:     { color:0x7a0008, metalness:0.04, roughness:0.14, clearcoat:0.9, clearcoatRoughness:0.06 },
};

function makeNailMat(key: string, renderer: THREE.WebGLRenderer) {
  const p: MProp = MAT[key] ?? MAT['chrome'];
  const m = new THREE.MeshPhysicalMaterial({
    color: p.color,
    metalness: p.metalness,
    roughness: p.roughness,
    clearcoat: p.clearcoat ?? 0,
    clearcoatRoughness: p.clearcoatRoughness ?? 0.1,
    transmission: p.transmission ?? 0,
    ior: p.ior ?? 1.5,
    thickness: p.thickness ?? 0.5,
    sheen: p.sheen ?? 0,
    sheenColor: new THREE.Color(p.sheenColor ?? 0xffffff),
    emissive: new THREE.Color(p.emissive ?? 0x000000),
    emissiveIntensity: p.emissiveIntensity ?? 0,
    opacity: p.opacity ?? 1,
    transparent: p.transparent ?? (p.transmission ?? 0) > 0,
    envMapIntensity: 1.8,
  });
  return m;
}

// ── Gem materials ─────────────────────────────────────────────
const GEM_COLORS: Record<string, number> = {
  crystal: 0xd8e8f8, diamond: 0xc0d0f0, pearl: 0xfff8f0,
  ruby: 0xcc1428, sapphire: 0x0828a8, emerald: 0x0a4828,
  amethyst: 0x7828a0, topaz: 0xd4a028, onyx: 0x0a0a0a,
  smoke: 0x7878a0, gold: 0xd4a840, silver: 0xc8c8e0,
  obsidian: 0x101014,
};

function makeGemMat(id: string) {
  const col = GEM_COLORS[id] ?? 0xffffff;
  const isTransmissive = ['crystal','diamond','glass','ruby','sapphire','emerald','amethyst','topaz','smoke'].includes(id);
  return new THREE.MeshPhysicalMaterial({
    color: col, metalness: isTransmissive ? 0.02 : 0.8,
    roughness: isTransmissive ? 0.04 : 0.12,
    transmission: isTransmissive ? 0.78 : 0,
    ior: 2.1, thickness: 0.3,
    clearcoat: 1.0, clearcoatRoughness: 0.01,
    envMapIntensity: 3.0,
  });
}

// ── Gem geometries ────────────────────────────────────────────
function makeGemGeom(shape: GemShapeId): THREE.BufferGeometry {
  const r = 0.11;
  switch (shape) {
    case 'teardrop': {
      const s = new THREE.Shape();
      s.moveTo(0, r * 1.5);
      s.bezierCurveTo(r, r * 0.8, r, -r * 0.5, 0, -r * 0.8);
      s.bezierCurveTo(-r, -r * 0.5, -r, r * 0.8, 0, r * 1.5);
      return new THREE.ExtrudeGeometry(s, { depth: r * 0.7, bevelEnabled: true, bevelSize: r * 0.2, bevelThickness: r * 0.2, bevelSegments: 5 });
    }
    case 'square': {
      const s = new THREE.Shape();
      const hr = r * 0.85;
      s.moveTo(-hr, -hr); s.lineTo(hr, -hr); s.lineTo(hr, hr); s.lineTo(-hr, hr); s.lineTo(-hr, -hr);
      return new THREE.ExtrudeGeometry(s, { depth: r * 0.6, bevelEnabled: true, bevelSize: r * 0.12, bevelThickness: r * 0.12, bevelSegments: 3 });
    }
    case 'marquise': {
      const s = new THREE.Shape();
      s.moveTo(0, r * 1.6);
      s.bezierCurveTo(r * 0.7, r * 0.8, r * 0.7, -r * 0.8, 0, -r * 1.6);
      s.bezierCurveTo(-r * 0.7, -r * 0.8, -r * 0.7, r * 0.8, 0, r * 1.6);
      return new THREE.ExtrudeGeometry(s, { depth: r * 0.5, bevelEnabled: true, bevelSize: r * 0.15, bevelThickness: r * 0.15, bevelSegments: 4 });
    }
    case 'heart': {
      const s = new THREE.Shape();
      s.moveTo(0, -r * 1.0);
      s.bezierCurveTo(-r * 1.4, -r * 0.4, -r * 1.4, r * 0.8, 0, r * 1.2);
      s.bezierCurveTo(r * 1.4, r * 0.8, r * 1.4, -r * 0.4, 0, -r * 1.0);
      return new THREE.ExtrudeGeometry(s, { depth: r * 0.6, bevelEnabled: true, bevelSize: r * 0.15, bevelThickness: r * 0.15, bevelSegments: 4 });
    }
    case 'pearl':
      return new THREE.SphereGeometry(r * 1.1, 24, 24);
    case 'star': {
      const s = new THREE.Shape();
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const ri = i % 2 === 0 ? r : r * 0.48;
        const x = Math.cos(a) * ri, y = Math.sin(a) * ri;
        if (i === 0) s.moveTo(x, y); else s.lineTo(x, y);
      }
      s.closePath();
      return new THREE.ExtrudeGeometry(s, { depth: r * 0.4, bevelEnabled: true, bevelSize: r * 0.08, bevelThickness: r * 0.08, bevelSegments: 2 });
    }
    default:
      return new THREE.SphereGeometry(r, 24, 24);
  }
}

// ── Nail shape helper ─────────────────────────────────────────
function getNailShape(shape: NailShape, length: NailLength): THREE.Shape {
  const lenMap: Record<NailLength, number> = { short: 0.55, medium: 0.80, long: 1.10, xlong: 1.45 };
  const ext = lenMap[length];
  const w = 0.44, base = 0.14;
  const s = new THREE.Shape();

  if (shape === 'square') {
    s.moveTo(-w, 0);
    s.lineTo(-w, base + ext);
    s.lineTo( w, base + ext);
    s.lineTo( w, 0);
    s.bezierCurveTo(w, -0.12, -w, -0.12, -w, 0);
  } else if (shape === 'coffin') {
    const tipW = 0.16;
    s.moveTo(-w, 0);
    s.lineTo(-tipW, base + ext);
    s.lineTo( tipW, base + ext);
    s.lineTo( w, 0);
    s.bezierCurveTo(w, -0.12, -w, -0.12, -w, 0);
  } else if (shape === 'stiletto') {
    s.moveTo(-w, 0);
    s.bezierCurveTo(-w * 0.9, base + ext * 0.6, -w * 0.1, base + ext * 0.9, 0, base + ext);
    s.bezierCurveTo(w * 0.1, base + ext * 0.9, w * 0.9, base + ext * 0.6, w, 0);
    s.bezierCurveTo(w, -0.12, -w, -0.12, -w, 0);
  } else if (shape === 'oval') {
    s.moveTo(-w, 0);
    s.bezierCurveTo(-w, base + ext * 0.5, -w * 0.5, base + ext, 0, base + ext);
    s.bezierCurveTo(w * 0.5, base + ext, w, base + ext * 0.5, w, 0);
    s.bezierCurveTo(w, -0.12, -w, -0.12, -w, 0);
  } else { // almond
    s.moveTo(-w, 0);
    s.bezierCurveTo(-w, base + ext * 0.45, -w * 0.35, base + ext * 0.9, 0, base + ext);
    s.bezierCurveTo(w * 0.35, base + ext * 0.9, w, base + ext * 0.45, w, 0);
    s.bezierCurveTo(w, -0.12, -w, -0.12, -w, 0);
  }
  return s;
}

// ── Main component ────────────────────────────────────────────
interface Props { shape: NailShape; length: NailLength; material: string; gems: GemsMap; autoRotate: boolean }

export default function Hand3D({ shape, length, material, gems, autoRotate }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ shape, length, material, gems, autoRotate });
  stateRef.current = { shape, length, material, gems, autoRotate };
  const sceneRef = useRef<{ dispose: () => void } | null>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // ── Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    // ── Scene
    const scene = new THREE.Scene();
    scene.background = null;

    // ── Camera
    const camera = new THREE.PerspectiveCamera(34, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.set(0, 2.2, 13.5);
    camera.lookAt(0, 0.5, 0);

    // ── Environment (PMREMGenerator with neutral equirect)
    const pmremGen = new THREE.PMREMGenerator(renderer);
    pmremGen.compileEquirectangularShader();
    const envTex = pmremGen.fromScene(new THREE.RoomEnvironment(), 0.05).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.55;

    // ── Lights
    const ambient = new THREE.AmbientLight(0xffeedd, 0.28);
    scene.add(ambient);

    // Key light (warm, top-left, casts shadows)
    const keyLight = new THREE.DirectionalLight(0xfff8e8, 2.8);
    keyLight.position.set(-4, 10, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 40;
    keyLight.shadow.camera.left = -8;
    keyLight.shadow.camera.right = 8;
    keyLight.shadow.camera.top = 8;
    keyLight.shadow.camera.bottom = -8;
    keyLight.shadow.bias = -0.0003;
    keyLight.shadow.radius = 3;
    scene.add(keyLight);

    // Rim light (cool, back-right)
    const rimLight = new THREE.DirectionalLight(0xb8c8f8, 2.0);
    rimLight.position.set(5, 3, -6);
    scene.add(rimLight);

    // Fill (warm, bottom-front)
    const fillLight = new THREE.DirectionalLight(0xffe8d0, 0.7);
    fillLight.position.set(2, -3, 5);
    scene.add(fillLight);

    // Under light (subtle)
    const underLight = new THREE.DirectionalLight(0xd0d8f0, 0.25);
    underLight.position.set(0, -6, 2);
    scene.add(underLight);

    // ── Skin material (warm, subsurface-like sheen)
    const skinMat = new THREE.MeshPhysicalMaterial({
      color: 0xb8805c,
      metalness: 0.00,
      roughness: 0.65,
      clearcoat: 0.18,
      clearcoatRoughness: 0.55,
      sheen: 0.45,
      sheenColor: new THREE.Color(0xd06840),
      envMapIntensity: 0.4,
    });

    // ── Floor / shadow catcher
    const floorGeo = new THREE.PlaneGeometry(14, 14);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.28 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -3.2;
    floor.receiveShadow = true;
    scene.add(floor);

    // ── Root group (rotates for auto-spin)
    const root = new THREE.Group();
    root.rotation.x = 0.10;
    scene.add(root);

    // ── Hand geometry
    const FINGERS = [
      { name: 'thumb',  tx: -2.2, ty: -0.6, tz: 0.10, rot: 0.55,  segs: [{ r: 0.40, l: 1.10 }, { r: 0.36, l: 1.0 }] },
      { name: 'index',  tx: -1.1, ty:  0.2, tz: 0.05, rot: 0.08,  segs: [{ r: 0.35, l: 1.20 }, { r: 0.31, l: 1.0 }, { r: 0.27, l: 0.88 }] },
      { name: 'middle', tx:  0.0, ty:  0.5, tz: 0.00, rot: 0.00,  segs: [{ r: 0.36, l: 1.30 }, { r: 0.32, l: 1.1 }, { r: 0.28, l: 0.92 }] },
      { name: 'ring',   tx:  1.1, ty:  0.2, tz: 0.05, rot:-0.08,  segs: [{ r: 0.34, l: 1.18 }, { r: 0.30, l: 1.0 }, { r: 0.26, l: 0.85 }] },
      { name: 'pinky',  tx:  2.1, ty: -0.6, tz: 0.10, rot:-0.22,  segs: [{ r: 0.28, l: 0.90 }, { r: 0.24, l: 0.82 }, { r: 0.22, l: 0.72 }] },
    ];

    // Palm
    const palmGeo = new THREE.BoxGeometry(4.8, 3.2, 1.0, 4, 4, 2);
    // Round the palm vertices slightly
    const pa = palmGeo.attributes.position;
    for (let i = 0; i < pa.count; i++) {
      const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i);
      const d = Math.sqrt(x * x + y * y);
      const bulge = 0.12 * Math.cos(d * 0.3);
      pa.setZ(i, z + bulge * (z > 0 ? 1 : 0.3));
    }
    pa.needsUpdate = true;
    palmGeo.computeVertexNormals();
    const palm = new THREE.Mesh(palmGeo, skinMat);
    palm.position.set(0, -1.8, 0);
    palm.castShadow = true;
    palm.receiveShadow = true;
    root.add(palm);

    // Wrist
    const wristGeo = new THREE.CylinderGeometry(1.3, 1.6, 1.4, 28, 3, false);
    const wrist = new THREE.Mesh(wristGeo, skinMat);
    wrist.position.set(0, -3.2, 0);
    wrist.castShadow = true;
    wrist.receiveShadow = true;
    root.add(wrist);

    // Thumb mount (fleshy mound)
    const thumbMoundGeo = new THREE.SphereGeometry(0.85, 20, 16);
    const thumbMound = new THREE.Mesh(thumbMoundGeo, skinMat);
    thumbMound.scale.set(1.0, 0.85, 0.7);
    thumbMound.position.set(-2.1, -1.6, 0.1);
    thumbMound.castShadow = true;
    root.add(thumbMound);

    // ── Nail mesh cache
    const nailMeshes: { mesh: THREE.Mesh; finger: string; nailLen: number }[] = [];
    const gemMeshes: THREE.Mesh[] = [];

    function buildNailMat() { return makeNailMat(stateRef.current.material, renderer); }

    // ── Build each finger
    FINGERS.forEach(({ name, tx, ty, tz, rot, segs }) => {
      const fGroup = new THREE.Group();
      fGroup.position.set(tx, ty, tz);
      fGroup.rotation.z = rot;
      root.add(fGroup);

      let yOff = 0;
      segs.forEach((seg, si) => {
        const capsGeo = new THREE.CapsuleGeometry(seg.r, seg.l, 12, 20);
        const cap = new THREE.Mesh(capsGeo, skinMat);
        cap.position.y = yOff + seg.r + seg.l / 2;
        cap.castShadow = true;
        cap.receiveShadow = true;
        fGroup.add(cap);

        // Knuckle bump at joint (except first segment base)
        if (si > 0) {
          const knuckleGeo = new THREE.SphereGeometry(seg.r * 1.08, 18, 14);
          const knuckle = new THREE.Mesh(knuckleGeo, skinMat);
          knuckle.scale.set(1.0, 0.78, 1.05);
          knuckle.position.y = yOff + seg.r;
          knuckle.castShadow = true;
          fGroup.add(knuckle);
        }

        yOff += seg.l + seg.r * 1.6;
      });

      // Fingertip pad
      const tipPadGeo = new THREE.SphereGeometry(segs[segs.length - 1].r * 0.9, 16, 12);
      const tipPad = new THREE.Mesh(tipPadGeo, skinMat);
      tipPad.scale.set(1.0, 0.65, 1.15);
      tipPad.position.y = yOff - segs[segs.length - 1].l * 0.08;
      tipPad.castShadow = true;
      fGroup.add(tipPad);

      // Nail placement
      const lastSeg = segs[segs.length - 1];
      const nailYBase = yOff - lastSeg.l * 0.42;
      const nailLen = stateRef.current.length;

      function buildNail() {
        const ns = stateRef.current;
        const nailShp = getNailShape(ns.shape, ns.length);
        const extSettings: THREE.ExtrudeGeometryOptions = {
          depth: 0.055, bevelEnabled: true,
          bevelSize: 0.022, bevelThickness: 0.022, bevelSegments: 6,
        };
        const nailGeo = new THREE.ExtrudeGeometry(nailShp, extSettings);
        // Curve nail geometry (arch)
        const pos = nailGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
          const arch = -0.55 * x * x;
          pos.setZ(i, z + arch);
        }
        pos.needsUpdate = true;
        nailGeo.computeVertexNormals();
        const nailMesh = new THREE.Mesh(nailGeo, buildNailMat());
        nailMesh.rotation.x = -Math.PI / 2 - 0.15;
        nailMesh.position.set(0, nailYBase + 0.02, lastSeg.r * 0.82);
        nailMesh.castShadow = true;
        nailMesh.receiveShadow = true;
        nailMeshes.push({ mesh: nailMesh, finger: name, nailLen: 0 });
        fGroup.add(nailMesh);
        return nailMesh;
      }

      buildNail();
    });

    // ── Build gems
    function rebuildGems() {
      gemMeshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
        m.parent?.remove(m);
      });
      gemMeshes.length = 0;

      const { gems: g, length: l } = stateRef.current;
      const lenMap: Record<NailLength, number> = { short: 0.55, medium: 0.80, long: 1.10, xlong: 1.45 };
      const nailExtent = lenMap[l];

      FINGERS.forEach(({ name, segs }) => {
        const placements = g[name] ?? [];
        const lastSeg = segs[segs.length - 1];
        const fGroup = root.children.find((c) => {
          const nc = c as THREE.Group;
          return nc.position && Math.abs(nc.position.x - (FINGERS.find((f) => f.name === name)?.tx ?? 999)) < 0.01;
        }) as THREE.Group | undefined;
        if (!fGroup) return;

        let yOff = 0;
        segs.forEach((seg) => { yOff += seg.l + seg.r * 1.6; });
        const nailYBase = yOff - lastSeg.l * 0.42;

        placements.forEach((p) => {
          const geo = makeGemGeom(p.shape);
          const mat = makeGemMat(p.id);
          const mesh = new THREE.Mesh(geo, mat);
          mesh.castShadow = true;

          // Zone-based positioning
          const nailZ = lastSeg.r * 0.82;
          let gx = p.x * 0.38;
          let gy = nailYBase;
          let gz = nailZ + 0.08;

          const ty = p.y ?? 0.5;
          if (p.zone === 'top') {
            gy = nailYBase + ty * nailExtent * 0.9;
            gz = nailZ + 0.12;
          } else if (p.zone === 'tip') {
            gy = nailYBase + nailExtent * 1.0;
            gz = nailZ + 0.05;
            gx = p.x * 0.32;
          } else if (p.zone === 'base') {
            gy = nailYBase + 0.04;
            gz = nailZ + 0.06;
            gx = p.x * 0.36;
          } else if (p.zone === 'left') {
            gx = -lastSeg.r * 0.88;
            gy = nailYBase + ty * nailExtent * 0.7;
            gz = nailZ - 0.02;
          } else if (p.zone === 'right') {
            gx = lastSeg.r * 0.88;
            gy = nailYBase + ty * nailExtent * 0.7;
            gz = nailZ - 0.02;
          }

          mesh.position.set(gx, gy, gz);
          fGroup.add(mesh);
          gemMeshes.push(mesh);
        });
      });
    }

    rebuildGems();

    // ── Rebuild nails on prop change
    function rebuildNails() {
      nailMeshes.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
        mesh.parent?.remove(mesh);
      });
      nailMeshes.length = 0;

      FINGERS.forEach(({ name, tx, ty, tz, rot, segs }) => {
        const fGroup = root.children.find((c) => {
          const nc = c as THREE.Group;
          return nc.position && Math.abs(nc.position.x - tx) < 0.01 && Math.abs(nc.position.y - ty) < 0.01;
        }) as THREE.Group | undefined;
        if (!fGroup) return;

        let yOff = 0;
        segs.forEach((seg) => { yOff += seg.l + seg.r * 1.6; });
        const lastSeg = segs[segs.length - 1];
        const nailYBase = yOff - lastSeg.l * 0.42;

        const ns = stateRef.current;
        const nailShp = getNailShape(ns.shape, ns.length);
        const extSettings: THREE.ExtrudeGeometryOptions = {
          depth: 0.055, bevelEnabled: true,
          bevelSize: 0.022, bevelThickness: 0.022, bevelSegments: 6,
        };
        const nailGeo = new THREE.ExtrudeGeometry(nailShp, extSettings);
        const pos = nailGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          pos.setZ(i, pos.getZ(i) - 0.55 * x * x);
        }
        pos.needsUpdate = true;
        nailGeo.computeVertexNormals();
        const nailMesh = new THREE.Mesh(nailGeo, buildNailMat());
        nailMesh.rotation.x = -Math.PI / 2 - 0.15;
        nailMesh.position.set(0, nailYBase + 0.02, lastSeg.r * 0.82);
        nailMesh.castShadow = true;
        nailMesh.receiveShadow = true;
        nailMeshes.push({ mesh: nailMesh, finger: name, nailLen: 0 });
        fGroup.add(nailMesh);
      });
    }

    // ── Orbit (drag)
    let isDragging = false;
    let lastX = 0;
    let rotY = 0;
    const onDown = (e: PointerEvent) => { isDragging = true; lastX = e.clientX; };
    const onUp = () => { isDragging = false; };
    const onMove = (e: PointerEvent) => {
      if (!isDragging) return;
      rotY += (e.clientX - lastX) * 0.012;
      lastX = e.clientX;
    };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointermove', onMove);

    // ── Resize
    const ro = new ResizeObserver(() => {
      renderer.setSize(el.clientWidth, el.clientHeight);
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
    });
    ro.observe(el);

    // ── Prop tracking
    let prevShape = stateRef.current.shape;
    let prevLength = stateRef.current.length;
    let prevMaterial = stateRef.current.material;
    let prevGems = stateRef.current.gems;

    // ── RAF loop
    let rafId = 0;
    const clock = new THREE.Clock();
    function animate() {
      rafId = requestAnimationFrame(animate);
      const s = stateRef.current;

      // Rebuild if needed
      if (s.shape !== prevShape || s.length !== prevLength || s.material !== prevMaterial) {
        prevShape = s.shape;
        prevLength = s.length;
        prevMaterial = s.material;
        rebuildNails();
      }
      if (s.gems !== prevGems) {
        prevGems = s.gems;
        rebuildGems();
      }

      // Auto-rotate
      if (s.autoRotate) {
        rotY += 0.004;
      }
      root.rotation.y = rotY;

      // Subtle floating
      const t = clock.getElapsedTime();
      root.position.y = Math.sin(t * 0.5) * 0.06;

      renderer.render(scene, camera);
    }
    animate();

    sceneRef.current = {
      dispose() {
        cancelAnimationFrame(rafId);
        ro.disconnect();
        el.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointermove', onMove);
        renderer.dispose();
        pmremGen.dispose();
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      },
    };

    return () => sceneRef.current?.dispose();
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}
"""

with open('/Users/yassinekraiem/Documents/LaPrincesse/frontend/src/components/lab/hand-3d.tsx', 'w') as f:
    f.write(hand_content)
print("hand-3d.tsx written:", len(hand_content), "bytes")
