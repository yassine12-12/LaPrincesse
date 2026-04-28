import os

hand_content = r"""import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import type { NailShape, NailLength } from './nail-shared';

// ── Types ─────────────────────────────────────────────────────
export type FingerName = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';
export type GemId = string;
export type GemShapeId = 'round' | 'teardrop' | 'square' | 'heart' | 'pearl' | 'marquise' | 'star';
export type GemZone = 'top' | 'tip' | 'base' | 'left' | 'right';
export type GemPlacement = { id: GemId; shape: GemShapeId; zone: GemZone; x: number; y: number };
export type GemsMap = Partial<Record<string, GemPlacement[]>>;

// ── Bone name map ─────────────────────────────────────────────
const DISTAL_BONES: Record<FingerName, string> = {
  thumb:  'thumb-phalanx-distal',
  index:  'index-finger-phalanx-distal',
  middle: 'middle-finger-phalanx-distal',
  ring:   'ring-finger-phalanx-distal',
  pinky:  'pinky-finger-phalanx-distal',
};
const TIP_BONES: Record<FingerName, string> = {
  thumb:  'thumb-tip',
  index:  'index-finger-tip',
  middle: 'middle-finger-tip',
  ring:   'ring-finger-tip',
  pinky:  'pinky-finger-tip',
};

// ── Material presets ──────────────────────────────────────────
type MProp = {
  color: number; metalness: number; roughness: number;
  clearcoat?: number; clearcoatRoughness?: number;
  transmission?: number; ior?: number; thickness?: number;
  sheen?: number; sheenColor?: number;
  emissive?: number; emissiveIntensity?: number;
  opacity?: number; transparent?: boolean;
};

const MAT: Record<string, MProp> = {
  chrome:    { color:0xdde0e8, metalness:1.00, roughness:0.04, clearcoat:1, clearcoatRoughness:0.01 },
  platinum:  { color:0xe0e4f0, metalness:0.95, roughness:0.08, clearcoat:1, clearcoatRoughness:0.03 },
  silver:    { color:0xc8ccda, metalness:0.96, roughness:0.12, clearcoat:0.9, clearcoatRoughness:0.04 },
  gold:      { color:0xd4a840, metalness:0.98, roughness:0.08, clearcoat:0.8, clearcoatRoughness:0.04 },
  rosegold:  { color:0xd4886a, metalness:0.95, roughness:0.10, clearcoat:0.8, clearcoatRoughness:0.04 },
  bronze:    { color:0xa07840, metalness:0.92, roughness:0.20, clearcoat:0.5, clearcoatRoughness:0.08 },
  copper:    { color:0xb87040, metalness:0.92, roughness:0.18, clearcoat:0.5, clearcoatRoughness:0.06 },
  holo:      { color:0xd0c0e8, metalness:0.92, roughness:0.08, clearcoat:1, clearcoatRoughness:0.02, sheen:1, sheenColor:0xe0d0ff },
  nude:      { color:0xc89078, metalness:0.00, roughness:0.22, clearcoat:0.9, clearcoatRoughness:0.12 },
  french:    { color:0xfff4ee, metalness:0.00, roughness:0.18, clearcoat:1.0, clearcoatRoughness:0.08 },
  red:       { color:0xcc0a10, metalness:0.00, roughness:0.16, clearcoat:1.0, clearcoatRoughness:0.06 },
  cherry:    { color:0x7a0010, metalness:0.00, roughness:0.18, clearcoat:1.0, clearcoatRoughness:0.06 },
  bordeaux:  { color:0x44080c, metalness:0.02, roughness:0.20, clearcoat:1.0, clearcoatRoughness:0.06 },
  navy:      { color:0x101828, metalness:0.02, roughness:0.22, clearcoat:0.9, clearcoatRoughness:0.08 },
  cobalt:    { color:0x1428a0, metalness:0.04, roughness:0.18, clearcoat:1.0, clearcoatRoughness:0.06 },
  forest:    { color:0x143018, metalness:0.02, roughness:0.24, clearcoat:0.8, clearcoatRoughness:0.10 },
  onyx:      { color:0x0e0e10, metalness:0.08, roughness:0.08, clearcoat:1.0, clearcoatRoughness:0.03 },
  matte:     { color:0x0a0a0a, metalness:0.00, roughness:0.96 },
  babypink:  { color:0xf8c8d4, metalness:0.00, roughness:0.18, clearcoat:0.9, clearcoatRoughness:0.08 },
  blush:     { color:0xf4c0c4, metalness:0.00, roughness:0.18, clearcoat:0.9, clearcoatRoughness:0.10 },
  lavender:  { color:0xd4c0f0, metalness:0.00, roughness:0.16, clearcoat:1.0, clearcoatRoughness:0.08 },
  lilac:     { color:0xe8c8ff, metalness:0.00, roughness:0.16, clearcoat:1.0, clearcoatRoughness:0.07 },
  mint:      { color:0x9ae8c0, metalness:0.00, roughness:0.18, clearcoat:0.9, clearcoatRoughness:0.09 },
  peach:     { color:0xf8c090, metalness:0.00, roughness:0.20, clearcoat:0.8, clearcoatRoughness:0.10 },
  sky:       { color:0xb8d8f8, metalness:0.00, roughness:0.16, clearcoat:1.0, clearcoatRoughness:0.08 },
  butter:    { color:0xf8f0a0, metalness:0.00, roughness:0.18, clearcoat:0.9, clearcoatRoughness:0.08 },
  neonpink:   { color:0xff1890, metalness:0.06, roughness:0.10, clearcoat:1.0, clearcoatRoughness:0.04, emissive:0xff0880, emissiveIntensity:0.18 },
  neonlime:   { color:0x78e800, metalness:0.06, roughness:0.10, clearcoat:1.0, clearcoatRoughness:0.04, emissive:0x60c800, emissiveIntensity:0.14 },
  neoncyan:   { color:0x00e8e8, metalness:0.06, roughness:0.10, clearcoat:1.0, clearcoatRoughness:0.04, emissive:0x00c8c8, emissiveIntensity:0.14 },
  neonorange: { color:0xff5800, metalness:0.06, roughness:0.10, clearcoat:1.0, clearcoatRoughness:0.04, emissive:0xd04000, emissiveIntensity:0.14 },
  neonpurple: { color:0x9900ff, metalness:0.06, roughness:0.10, clearcoat:1.0, clearcoatRoughness:0.04, emissive:0x7000c8, emissiveIntensity:0.18 },
  pearl:     { color:0xf8f0e0, metalness:0.10, roughness:0.12, clearcoat:1.0, clearcoatRoughness:0.04, sheen:0.8, sheenColor:0xfff0e8 },
  crystal:   { color:0xdce8f8, metalness:0.05, roughness:0.04, transmission:0.72, ior:1.52, thickness:0.6, clearcoat:1, clearcoatRoughness:0.01 },
  glass:     { color:0xffffff, metalness:0.00, roughness:0.03, transmission:0.92, ior:1.5, thickness:0.4, clearcoat:1, clearcoatRoughness:0.01, opacity:0.65, transparent:true },
  glitter:   { color:0xd0c8ff, metalness:0.85, roughness:0.30, clearcoat:0.8, clearcoatRoughness:0.30 },
  bone:      { color:0xf0e8d8, metalness:0.00, roughness:0.48, clearcoat:0.3, clearcoatRoughness:0.24 },
  jet:       { color:0x080808, metalness:0.00, roughness:0.78 },
  blood:     { color:0x7a0008, metalness:0.04, roughness:0.14, clearcoat:0.9, clearcoatRoughness:0.06 },
};

function makeNailMat(key: string): THREE.MeshPhysicalMaterial {
  const p: MProp = MAT[key] ?? MAT['chrome'];
  return new THREE.MeshPhysicalMaterial({
    color: p.color, metalness: p.metalness, roughness: p.roughness,
    clearcoat: p.clearcoat ?? 0, clearcoatRoughness: p.clearcoatRoughness ?? 0.1,
    transmission: p.transmission ?? 0, ior: p.ior ?? 1.5, thickness: p.thickness ?? 0.5,
    sheen: p.sheen ?? 0, sheenColor: new THREE.Color(p.sheenColor ?? 0xffffff),
    emissive: new THREE.Color(p.emissive ?? 0x000000), emissiveIntensity: p.emissiveIntensity ?? 0,
    opacity: p.opacity ?? 1, transparent: p.transparent ?? (p.transmission ?? 0) > 0,
    envMapIntensity: 2.2, side: THREE.FrontSide,
  });
}

// ── Gem materials ─────────────────────────────────────────────
const GEM_COLORS: Record<string, number> = {
  crystal: 0xd8e8f8, diamond: 0xc0d0f0, pearl: 0xfff8f0,
  ruby: 0xcc1428, sapphire: 0x0828a8, emerald: 0x0a4828,
  amethyst: 0x7828a0, topaz: 0xd4a028, onyx: 0x0a0a0a,
  smoke: 0x7878a0, gold: 0xd4a840, silver: 0xc8c8e0,
};

function makeGemMat(id: string): THREE.MeshPhysicalMaterial {
  const col = GEM_COLORS[id] ?? 0xffffff;
  const isGlass = ['crystal','diamond','ruby','sapphire','emerald','amethyst','topaz','smoke'].includes(id);
  return new THREE.MeshPhysicalMaterial({
    color: col, metalness: isGlass ? 0.02 : 0.85,
    roughness: isGlass ? 0.03 : 0.10,
    transmission: isGlass ? 0.82 : 0,
    ior: 2.1, thickness: 0.25,
    clearcoat: 1.0, clearcoatRoughness: 0.01,
    envMapIntensity: 3.5,
  });
}

// ── Gem geometry ──────────────────────────────────────────────
function makeGemGeom(shape: GemShapeId): THREE.BufferGeometry {
  const r = 0.003;
  switch (shape) {
    case 'teardrop': {
      const s = new THREE.Shape();
      s.moveTo(0, r * 1.5); s.bezierCurveTo(r, r * 0.8, r, -r * 0.5, 0, -r * 0.8);
      s.bezierCurveTo(-r, -r * 0.5, -r, r * 0.8, 0, r * 1.5);
      return new THREE.ExtrudeGeometry(s, { depth: r * 0.7, bevelEnabled: true, bevelSize: r * 0.2, bevelThickness: r * 0.2, bevelSegments: 5 });
    }
    case 'square': {
      const s = new THREE.Shape(); const hr = r * 0.85;
      s.moveTo(-hr,-hr); s.lineTo(hr,-hr); s.lineTo(hr,hr); s.lineTo(-hr,hr); s.closePath();
      return new THREE.ExtrudeGeometry(s, { depth: r * 0.6, bevelEnabled: true, bevelSize: r * 0.12, bevelThickness: r * 0.12, bevelSegments: 3 });
    }
    case 'marquise': {
      const s = new THREE.Shape();
      s.moveTo(0, r * 1.6); s.bezierCurveTo(r * 0.7, r * 0.8, r * 0.7, -r * 0.8, 0, -r * 1.6);
      s.bezierCurveTo(-r * 0.7, -r * 0.8, -r * 0.7, r * 0.8, 0, r * 1.6);
      return new THREE.ExtrudeGeometry(s, { depth: r * 0.5, bevelEnabled: true, bevelSize: r * 0.15, bevelThickness: r * 0.15, bevelSegments: 4 });
    }
    case 'heart': {
      const s = new THREE.Shape();
      s.moveTo(0, -r); s.bezierCurveTo(-r * 1.4, -r * 0.4, -r * 1.4, r * 0.8, 0, r * 1.2);
      s.bezierCurveTo(r * 1.4, r * 0.8, r * 1.4, -r * 0.4, 0, -r);
      return new THREE.ExtrudeGeometry(s, { depth: r * 0.6, bevelEnabled: true, bevelSize: r * 0.15, bevelThickness: r * 0.15, bevelSegments: 4 });
    }
    case 'star': {
      const s = new THREE.Shape();
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const ri = i % 2 === 0 ? r : r * 0.48;
        if (i === 0) s.moveTo(Math.cos(a)*ri, Math.sin(a)*ri); else s.lineTo(Math.cos(a)*ri, Math.sin(a)*ri);
      }
      s.closePath();
      return new THREE.ExtrudeGeometry(s, { depth: r * 0.4, bevelEnabled: true, bevelSize: r * 0.08, bevelThickness: r * 0.08, bevelSegments: 2 });
    }
    case 'pearl': return new THREE.SphereGeometry(r * 1.1, 20, 20);
    default:       return new THREE.SphereGeometry(r, 20, 20);
  }
}

// ── Nail shape ────────────────────────────────────────────────
function getNailShape(shape: NailShape, length: NailLength): THREE.Shape {
  // Sizes scaled to GLB model (hand ~0.12m wide)
  const lenMap: Record<NailLength, number> = { short: 0.011, medium: 0.016, long: 0.022, xlong: 0.030 };
  const ext = lenMap[length];
  const w = 0.008, base = 0.003;
  const s = new THREE.Shape();
  if (shape === 'square') {
    s.moveTo(-w, 0); s.lineTo(-w, base + ext); s.lineTo(w, base + ext); s.lineTo(w, 0);
    s.bezierCurveTo(w, -0.002, -w, -0.002, -w, 0);
  } else if (shape === 'coffin') {
    const tipW = 0.003;
    s.moveTo(-w, 0); s.lineTo(-tipW, base + ext); s.lineTo(tipW, base + ext); s.lineTo(w, 0);
    s.bezierCurveTo(w, -0.002, -w, -0.002, -w, 0);
  } else if (shape === 'stiletto') {
    s.moveTo(-w, 0);
    s.bezierCurveTo(-w * 0.9, base + ext * 0.6, -w * 0.1, base + ext * 0.9, 0, base + ext);
    s.bezierCurveTo(w * 0.1, base + ext * 0.9, w * 0.9, base + ext * 0.6, w, 0);
    s.bezierCurveTo(w, -0.002, -w, -0.002, -w, 0);
  } else if (shape === 'oval') {
    s.moveTo(-w, 0);
    s.bezierCurveTo(-w, base + ext * 0.5, -w * 0.5, base + ext, 0, base + ext);
    s.bezierCurveTo(w * 0.5, base + ext, w, base + ext * 0.5, w, 0);
    s.bezierCurveTo(w, -0.002, -w, -0.002, -w, 0);
  } else { // almond
    s.moveTo(-w, 0);
    s.bezierCurveTo(-w, base + ext * 0.45, -w * 0.35, base + ext * 0.9, 0, base + ext);
    s.bezierCurveTo(w * 0.35, base + ext * 0.9, w, base + ext * 0.45, w, 0);
    s.bezierCurveTo(w, -0.002, -w, -0.002, -w, 0);
  }
  return s;
}

// ── Component ─────────────────────────────────────────────────
interface Props { shape: NailShape; length: NailLength; material: string; gems: GemsMap; autoRotate: boolean }

export default function Hand3D({ shape, length, material, gems, autoRotate }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ shape, length, material, gems, autoRotate });
  stateRef.current = { shape, length, material, gems, autoRotate };

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
    renderer.toneMappingExposure = 1.4;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    // ── Scene
    const scene = new THREE.Scene();

    // ── Camera — framed for a hand ~0.2m tall
    const camera = new THREE.PerspectiveCamera(32, el.clientWidth / el.clientHeight, 0.001, 100);
    camera.position.set(0, 0.04, 0.38);
    camera.lookAt(0, 0.02, 0);

    // ── Lights
    const ambient = new THREE.AmbientLight(0xfff8f0, 0.4);
    scene.add(ambient);

    // Key — warm, top-left, shadows
    const key = new THREE.DirectionalLight(0xfff8e8, 3.5);
    key.position.set(-0.5, 1.2, 0.8);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.01; key.shadow.camera.far = 4;
    key.shadow.camera.left = -0.3; key.shadow.camera.right = 0.3;
    key.shadow.camera.top = 0.3; key.shadow.camera.bottom = -0.3;
    key.shadow.bias = -0.0001; key.shadow.radius = 2.5;
    scene.add(key);

    // Rim — cool, back
    const rim = new THREE.DirectionalLight(0xb8d0ff, 2.0);
    rim.position.set(0.6, 0.4, -0.8);
    scene.add(rim);

    // Fill — warm bounce
    const fill = new THREE.DirectionalLight(0xffe0c8, 0.8);
    fill.position.set(0.3, -0.5, 0.5);
    scene.add(fill);

    // Under — subtle subsurface illusion
    const under = new THREE.DirectionalLight(0xffc8a8, 0.35);
    under.position.set(0, -0.8, 0.2);
    scene.add(under);

    // ── Floor shadow catcher
    const floorGeo = new THREE.PlaneGeometry(2, 2);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.20 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.08;
    floor.receiveShadow = true;
    scene.add(floor);

    // ── HDRI environment (for PBR nail reflections)
    const pmremGen = new THREE.PMREMGenerator(renderer);
    pmremGen.compileEquirectangularShader();
    new RGBELoader().load('/studio.hdr', (hdrTex) => {
      const envMap = pmremGen.fromEquirectangular(hdrTex).texture;
      scene.environment = envMap;
      scene.environmentIntensity = 0.9;
      hdrTex.dispose();
      pmremGen.dispose();
    });

    // ── Root group
    const root = new THREE.Group();
    // Orient to show hand face-forward (tilted slightly)
    root.rotation.x = -0.15;
    root.rotation.z = 0.05;
    scene.add(root);

    // ── Bone lookup
    const boneMap = new Map<string, THREE.Bone>();

    // ── Nail containers keyed by finger (parented to distal bone)
    const nailContainers = new Map<FingerName, THREE.Group>();
    const gemContainers = new Map<FingerName, THREE.Group>();

    // ── Skin material — warm, subsurface-like
    const skinMat = new THREE.MeshPhysicalMaterial({
      color: 0xc8886a,
      metalness: 0.00,
      roughness: 0.58,
      clearcoat: 0.12,
      clearcoatRoughness: 0.6,
      sheen: 0.55,
      sheenColor: new THREE.Color(0xe08060),
      sheenRoughness: 0.7,
      envMapIntensity: 0.3,
    });

    // ── Nail orientation per finger (local to distal bone)
    // Values tuned to match the actual GLB skeleton orientation
    const NAIL_OFFSETS: Record<FingerName, { pos: [number,number,number]; rx: number; ry: number; rz: number }> = {
      thumb:  { pos: [0.000,  0.010,  0.006], rx: -1.45, ry: 0.00, rz:  0.00 },
      index:  { pos: [0.000,  0.010,  0.006], rx: -1.57, ry: 0.00, rz:  0.00 },
      middle: { pos: [0.000,  0.010,  0.006], rx: -1.57, ry: 0.00, rz:  0.00 },
      ring:   { pos: [0.000,  0.010,  0.006], rx: -1.57, ry: 0.00, rz:  0.00 },
      pinky:  { pos: [0.000,  0.008,  0.005], rx: -1.57, ry: 0.00, rz:  0.00 },
    };

    function buildNailMesh(finger: FingerName): THREE.Mesh {
      const { shape: sh, length: len } = stateRef.current;
      const nailShp = getNailShape(sh, len);
      const geo = new THREE.ExtrudeGeometry(nailShp, {
        depth: 0.001, bevelEnabled: true, bevelSize: 0.0005, bevelThickness: 0.0005, bevelSegments: 5,
      });
      // Arch the nail
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        pos.setZ(i, pos.getZ(i) - 18 * x * x);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
      const mat = makeNailMat(stateRef.current.material);
      const mesh = new THREE.Mesh(geo, mat);
      const off = NAIL_OFFSETS[finger];
      mesh.position.set(...off.pos);
      mesh.rotation.set(off.rx, off.ry, off.rz);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    function rebuildNails() {
      nailContainers.forEach((container) => {
        while (container.children.length) {
          const c = container.children[0] as THREE.Mesh;
          c.geometry?.dispose();
          (c.material as THREE.Material)?.dispose();
          container.remove(c);
        }
        container.add(buildNailMesh(container.userData.finger as FingerName));
      });
    }

    function rebuildGems() {
      gemContainers.forEach((container) => {
        while (container.children.length) {
          const c = container.children[0] as THREE.Mesh;
          c.geometry?.dispose();
          (c.material as THREE.Material)?.dispose();
          container.remove(c);
        }
        const finger = container.userData.finger as FingerName;
        const placements = stateRef.current.gems[finger] ?? [];
        const lenMap: Record<NailLength, number> = { short: 0.011, medium: 0.016, long: 0.022, xlong: 0.030 };
        const nailLen = lenMap[stateRef.current.length];
        const off = NAIL_OFFSETS[finger];

        placements.forEach((p, i) => {
          const geo = makeGemGeom(p.shape);
          const mat = makeGemMat(p.id);
          const mesh = new THREE.Mesh(geo, mat);
          mesh.castShadow = true;

          // Position on nail surface (local to distal bone)
          let lx = p.x * 0.007;
          let ly = off.pos[1];
          let lz = off.pos[2] + 0.002;

          const ty = p.y ?? 0.5;
          if (p.zone === 'top') {
            lz = off.pos[2] + nailLen * 0.3 * ty + 0.002;
          } else if (p.zone === 'tip') {
            lz = off.pos[2] + nailLen * 0.28;
            lx = (i % 3 - 1) * 0.005;
          } else if (p.zone === 'base') {
            lz = off.pos[2] + 0.001;
            lx = (i % 3 - 1) * 0.005;
          } else if (p.zone === 'left') {
            lx = -0.007;
            lz = off.pos[2] + nailLen * 0.18 * ty;
          } else if (p.zone === 'right') {
            lx = 0.007;
            lz = off.pos[2] + nailLen * 0.18 * ty;
          }

          mesh.position.set(lx, ly + 0.001, lz);
          mesh.rotation.set(off.rx, off.ry, off.rz);
          container.add(mesh);
        });
      });
    }

    // ── Load GLB hand model
    const loader = new GLTFLoader();
    loader.load('/models/hand_right.glb', (gltf) => {
      const model = gltf.scene;

      // Override skin material + enable shadows
      model.traverse((node) => {
        if ((node as THREE.Mesh).isMesh) {
          const mesh = node as THREE.Mesh;
          mesh.material = skinMat;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
        if ((node as THREE.Bone).isBone) {
          boneMap.set(node.name, node as THREE.Bone);
        }
      });

      // Scale to viewport (~0.18m hand)
      model.scale.setScalar(1.0);
      // Position: center palm in view
      model.position.set(0.02, -0.04, 0);

      root.add(model);

      // ── Attach nail + gem containers to each distal bone
      const fingers: FingerName[] = ['thumb','index','middle','ring','pinky'];
      fingers.forEach((finger) => {
        const bone = boneMap.get(DISTAL_BONES[finger]);
        if (!bone) return;

        const nailContainer = new THREE.Group();
        nailContainer.userData.finger = finger;
        nailContainer.add(buildNailMesh(finger));
        bone.add(nailContainer);
        nailContainers.set(finger, nailContainer);

        const gemContainer = new THREE.Group();
        gemContainer.userData.finger = finger;
        bone.add(gemContainer);
        gemContainers.set(finger, gemContainer);
      });

      rebuildGems();
    });

    // ── Orbit drag
    let isDragging = false;
    let lastX = 0, lastY = 0;
    let rotY = 0, rotX = -0.15;
    const onDown = (e: PointerEvent) => { isDragging = true; lastX = e.clientX; lastY = e.clientY; };
    const onUp   = () => { isDragging = false; };
    const onMove = (e: PointerEvent) => {
      if (!isDragging) return;
      rotY += (e.clientX - lastX) * 0.008;
      rotX += (e.clientY - lastY) * 0.006;
      rotX = Math.max(-0.6, Math.min(0.6, rotX));
      lastX = e.clientX; lastY = e.clientY;
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

    // ── RAF
    let rafId = 0;
    const clock = new THREE.Clock();
    function animate() {
      rafId = requestAnimationFrame(animate);
      const s = stateRef.current;

      if (s.shape !== prevShape || s.length !== prevLength) {
        prevShape = s.shape; prevLength = s.length;
        rebuildNails();
      }
      if (s.material !== prevMaterial) {
        prevMaterial = s.material;
        nailContainers.forEach((c) => {
          c.children.forEach((child) => {
            const mesh = child as THREE.Mesh;
            (mesh.material as THREE.Material)?.dispose();
            mesh.material = makeNailMat(s.material);
          });
        });
      }
      if (s.gems !== prevGems) {
        prevGems = s.gems;
        rebuildGems();
      }

      if (s.autoRotate) rotY += 0.005;
      root.rotation.y = rotY;
      root.rotation.x = rotX;

      const t = clock.getElapsedTime();
      root.position.y = Math.sin(t * 0.45) * 0.006;

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointermove', onMove);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}
"""

path = '/Users/yassinekraiem/Documents/LaPrincesse/frontend/src/components/lab/hand-3d.tsx'
with open(path, 'w') as f:
    f.write(hand_content)
print(f"Written {len(hand_content)} bytes to {path}")
