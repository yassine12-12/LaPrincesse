// hand-3d.jsx — Real WebGL hand using Three.js.
// Renders a stylized hand from primitives (palm + 5 fingers) and 5 nail
// caps that take live material/shape/length params. Auto-rotates, supports
// drag-to-orbit, and exposes setNailParams(params) on the wrapper element.
//
// Required globals: THREE (loaded from cdn before this script).

function Hand3D({ shape = 'almond', length = 'long', material = 'chrome', accent = null, gems = {}, autoRotate = true, height = 480 }) {
  const mountRef = React.useRef(null);
  const stateRef = React.useRef({});

  // Build scene once.
  React.useEffect(() => {
    const el = mountRef.current;
    if (!el || !window.THREE) return;
    const T = window.THREE;

    const w = el.clientWidth || 600;
    const h = el.clientHeight || 600;

    const scene = new T.Scene();
    scene.background = null;

    const camera = new T.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, 0.4, 20);
    camera.lookAt(0, 0.0, 0);

    const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = T.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    // Procedural studio environment for chrome reflections — bright lights
    // on a dark sphere so chrome has things to reflect.
    const pmrem = new T.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const envScene = new T.Scene();
    const envBg = new T.Mesh(
      new T.SphereGeometry(50, 32, 16),
      new T.MeshBasicMaterial({ color: 0x0a0a0e, side: T.BackSide })
    );
    envScene.add(envBg);
    const envLights = [
      { c: 0xffffff, p: [0, 12, 4], s: 8 },
      { c: 0xb8c0d0, p: [-10, 2, -4], s: 6 },
      { c: 0xffffff, p: [10, -3, 2], s: 5 },
      { c: 0x606068, p: [0, -10, 0], s: 6 },
      { c: 0xffffff, p: [0, 0, 12], s: 4 },
    ];
    envLights.forEach((l) => {
      const m = new T.Mesh(
        new T.PlaneGeometry(l.s, l.s),
        new T.MeshBasicMaterial({ color: l.c })
      );
      m.position.set(...l.p);
      m.lookAt(0, 0, 0);
      envScene.add(m);
    });
    const envMap = pmrem.fromScene(envScene, 0.04).texture;
    scene.environment = envMap;

    // Lighting (also direct).
    const key = new T.DirectionalLight(0xffffff, 1.6);
    key.position.set(2, 4, 5);
    scene.add(key);
    const rim = new T.DirectionalLight(0xc8d0e8, 1.2);
    rim.position.set(-3, 2, -2);
    scene.add(rim);
    const fill = new T.DirectionalLight(0xffffff, 0.4);
    fill.position.set(0, -3, 3);
    scene.add(fill);
    scene.add(new T.AmbientLight(0xffffff, 0.15));

    // Hand group — centered around origin (palm+fingers span ~5 units tall).
    const hand = new T.Group();
    hand.rotation.x = -0.15;
    hand.position.y = -0.4;
    hand.scale.setScalar(0.95);
    scene.add(hand);

    // Skin material — soft matte, slightly subsurface-y feel.
    const skinMat = new T.MeshPhysicalMaterial({
      color: 0x1a1a1d,
      roughness: 0.55,
      metalness: 0.0,
      clearcoat: 0.2,
      clearcoatRoughness: 0.6,
      sheen: 0.4,
      sheenColor: new T.Color(0x5a5a64),
    });

    // Palm — rounded box.
    const palmGeo = new T.BoxGeometry(2.0, 2.4, 0.7, 1, 1, 1);
    // Round it with a noise-free taper:
    const palmPos = palmGeo.attributes.position;
    for (let i = 0; i < palmPos.count; i++) {
      const x = palmPos.getX(i), y = palmPos.getY(i), z = palmPos.getZ(i);
      const r = Math.sqrt(x*x + z*z*4);
      const factor = 1 - 0.05 * Math.abs(y);
      palmPos.setX(i, x * factor);
      palmPos.setZ(i, z * (1 - 0.1 * Math.abs(y)));
    }
    palmGeo.computeVertexNormals();
    const palm = new T.Mesh(palmGeo, skinMat);
    palm.position.y = -0.4;
    hand.add(palm);

    // Wrist cuff (decorative gradient plane below palm)
    const cuffGeo = new T.CylinderGeometry(1.05, 1.15, 0.6, 24, 1, true);
    const cuff = new T.Mesh(cuffGeo, skinMat);
    cuff.position.y = -1.85;
    cuff.scale.z = 0.35;
    hand.add(cuff);

    // Finger config: [name, baseX, baseY, length, width]
    const fingerSpecs = [
      { name: 'thumb',   x: -1.05, y: -0.6, len: 1.5,  w: 0.34, angle: 0.5,  twist: 0.25 },
      { name: 'index',   x: -0.7,  y:  0.95, len: 1.95, w: 0.30, angle: 0.05, twist: 0 },
      { name: 'middle',  x: -0.22, y:  1.05, len: 2.15, w: 0.32, angle: 0,    twist: 0 },
      { name: 'ring',    x:  0.27, y:  0.98, len: 2.0,  w: 0.30, angle: -0.04, twist: 0 },
      { name: 'pinky',   x:  0.74, y:  0.75, len: 1.55, w: 0.26, angle: -0.1, twist: 0 },
    ];

    const nailMeshes = [];

    fingerSpecs.forEach((spec) => {
      // Finger as 3 capsule segments (knuckle joints).
      const segLen = spec.len / 3;
      const fingerGroup = new T.Group();
      fingerGroup.position.set(spec.x, spec.y, 0);
      fingerGroup.rotation.z = spec.angle;
      fingerGroup.rotation.y = spec.twist;

      let carry = new T.Group();
      fingerGroup.add(carry);
      for (let i = 0; i < 3; i++) {
        const wTaper = spec.w * (1 - i * 0.07);
        const segGeo = new T.CapsuleGeometry(wTaper, segLen, 6, 12);
        const seg = new T.Mesh(segGeo, skinMat);
        seg.position.y = segLen / 2;
        carry.add(seg);
        // Next joint group
        const next = new T.Group();
        next.position.y = segLen;
        // Slight forward bend on later segments
        next.rotation.x = i === 0 ? -0.05 : -0.08;
        carry.add(next);
        carry = next;
      }

      // Nail at the tip of last segment.
      const nailHolder = new T.Group();
      // Position nail on top (front) of fingertip
      nailHolder.position.set(0, 0.05, spec.w * 0.55);
      nailHolder.rotation.x = -0.35;
      carry.add(nailHolder);

      // Nail mesh — built per spec.
      const nailMesh = buildNailMesh(T, spec.w, shape, length);
      nailHolder.add(nailMesh);
      nailMeshes.push({ mesh: nailMesh, holder: nailHolder, baseW: spec.w, fingerName: spec.name });

      hand.add(fingerGroup);
    });

    // Apply current material.
    function applyMaterial(matKey, accentKey) {
      nailMeshes.forEach(({ mesh }) => {
        const old = mesh.material;
        mesh.material = makeNailMaterial(T, matKey, envMap);
        if (old && old.dispose) old.dispose();
      });
    }
    applyMaterial(material, accent);

    // Gem library — material presets keyed by id.
    const GEM_MATS = {
      crystal:  { color: 0xffffff, roughness: 0.02, metalness: 0.0, transmission: 0.9, ior: 1.9, thickness: 0.4 },
      pearl:    { color: 0xf5ecdc, roughness: 0.15, metalness: 0.0, sheen: 1.0, sheenColor: 0xffffff },
      onyx:     { color: 0x050507, roughness: 0.05, metalness: 0.5, clearcoat: 1 },
      smoke:    { color: 0x6a6a72, roughness: 0.05, metalness: 0.0, transmission: 0.7, ior: 1.7, thickness: 0.4 },
      ruby:     { color: 0x6a0a0e, roughness: 0.05, metalness: 0.0, transmission: 0.6, ior: 1.77, thickness: 0.4 },
      sapphire: { color: 0x0a1838, roughness: 0.05, metalness: 0.0, transmission: 0.55, ior: 1.77, thickness: 0.4 },
      emerald:  { color: 0x0a3a28, roughness: 0.05, metalness: 0.0, transmission: 0.6, ior: 1.58, thickness: 0.4 },
      gold:     { color: 0xc8a050, roughness: 0.18, metalness: 1.0 },
      silver:   { color: 0xe8e8ee, roughness: 0.08, metalness: 1.0 },
    };
    const GEM_SHAPES = {
      round:   () => new T.SphereGeometry(0.09, 24, 24),
      teardrop:() => {
        const g = new T.SphereGeometry(0.09, 24, 24);
        g.scale(1, 1.6, 0.7);
        return g;
      },
      square:  () => new T.BoxGeometry(0.13, 0.13, 0.07),
      heart:   () => {
        const g = new T.SphereGeometry(0.085, 24, 24);
        g.scale(1.1, 1, 0.6);
        return g;
      },
      pearl:   () => new T.SphereGeometry(0.11, 24, 24),
    };

    // Apply gems — gems is { fingerName: [ {id, shape, x, y} ] }
    const gemGroup = new T.Group();
    hand.add(gemGroup);
    function applyGems(gemMap) {
      while (gemGroup.children.length) {
        const c = gemGroup.children.pop();
        c.geometry?.dispose?.();
        c.material?.dispose?.();
      }
      if (!gemMap) return;
      const fingerIdx = { thumb: 0, index: 1, middle: 2, ring: 3, pinky: 4 };
      Object.entries(gemMap).forEach(([finger, list]) => {
        const idx = fingerIdx[finger];
        const target = nailMeshes[idx];
        if (!target || !list || !list.length) return;
        list.forEach((gem) => {
          const matSpec = GEM_MATS[gem.id] || GEM_MATS.crystal;
          const gemMat = new T.MeshPhysicalMaterial({
            ...matSpec,
            envMap, envMapIntensity: 1.8,
            clearcoat: matSpec.clearcoat ?? 0.6,
          });
          const geo = (GEM_SHAPES[gem.shape] || GEM_SHAPES.round)();
          const g = new T.Mesh(geo, gemMat);
          // Place relative to nail holder; nail extends from y=0 to y=length
          const v = new T.Vector3((gem.x ?? 0) * 0.4, (gem.y ?? 0.4) * 1.2, 0.05);
          target.holder.updateWorldMatrix(true, false);
          target.holder.localToWorld(v);
          hand.worldToLocal(v);
          g.position.copy(v);
          gemGroup.add(g);
        });
      });
    }
    applyGems(gems);

    // Floor disc — soft platform shadow
    const floorGeo = new T.CircleGeometry(4, 64);
    const floorMat = new T.MeshBasicMaterial({
      color: 0x000000,
      transparent: true, opacity: 0.55,
    });
    const floor = new T.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.4;
    scene.add(floor);

    // Drag-to-orbit
    let dragging = false;
    let lx = 0, ly = 0;
    let yaw = 0, pitch = 0;
    const onDown = (e) => { dragging = true; const p = e.touches?.[0] || e; lx = p.clientX; ly = p.clientY; };
    const onMove = (e) => {
      if (!dragging) return;
      const p = e.touches?.[0] || e;
      yaw += (p.clientX - lx) * 0.008;
      pitch += (p.clientY - ly) * 0.005;
      pitch = Math.max(-0.6, Math.min(0.6, pitch));
      lx = p.clientX; ly = p.clientY;
    };
    const onUp = () => { dragging = false; };
    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    el.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);

    // Animate.
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const s = stateRef.current;
      if (s.autoRotate !== false && !dragging) yaw += 0.0035;
      hand.rotation.y = yaw;
      hand.rotation.x = -0.15 + pitch;
      renderer.render(scene, camera);
    };
    tick();

    // Resize
    const resize = () => {
      const nw = el.clientWidth || w, nh = el.clientHeight || h;
      if (nw < 2 || nh < 2) return;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    // Also do a delayed resize in case parent height was 0 at mount
    setTimeout(resize, 50);

    // Expose updater.
    stateRef.current = {
      setShape: (s, l) => {
        nailMeshes.forEach(({ mesh, holder, baseW, fingerName }) => {
          const newGeo = buildNailMesh(T, baseW, s, l).geometry;
          mesh.geometry.dispose();
          mesh.geometry = newGeo;
        });
      },
      setMaterial: (m, a) => applyMaterial(m, a),
      setGems: (g) => applyGems(g),
      setAuto: (b) => { stateRef.current.autoRotate = b; },
      autoRotate: true,
    };
    stateRef.current.autoRotate = autoRotate;

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      el.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      renderer.dispose();
      pmrem.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  // React to prop changes.
  React.useEffect(() => { stateRef.current.setShape?.(shape, length); }, [shape, length]);
  React.useEffect(() => { stateRef.current.setMaterial?.(material, accent); }, [material, accent]);
  React.useEffect(() => { stateRef.current.setGems?.(gems); }, [JSON.stringify(gems)]);
  React.useEffect(() => { stateRef.current.setAuto?.(autoRotate); }, [autoRotate]);

  return <div ref={mountRef} style={{ width: '100%', height: height || '100%', position: 'relative' }} />;
}

// Build a nail tip mesh: extruded shape with a slight curve.
function buildNailMesh(T, w, shape, length) {
  const lengths = { short: 0.45, medium: 0.7, long: 1.0, xlong: 1.35 };
  const l = lengths[length] ?? 1.0;
  const W = w * 1.6;

  const s = new T.Shape();
  s.moveTo(-W, 0);
  switch (shape) {
    case 'square':
      s.lineTo(-W, l);
      s.lineTo(W, l);
      break;
    case 'coffin':
      s.lineTo(-W * 0.95, l * 0.85);
      s.lineTo(-W * 0.55, l);
      s.lineTo(W * 0.55, l);
      s.lineTo(W * 0.95, l * 0.85);
      break;
    case 'stiletto':
      s.lineTo(-W * 0.6, l * 0.4);
      s.lineTo(0, l);
      s.lineTo(W * 0.6, l * 0.4);
      break;
    case 'oval':
      s.bezierCurveTo(-W, l * 0.6, -W * 0.7, l, 0, l);
      s.bezierCurveTo(W * 0.7, l, W, l * 0.6, W, 0);
      break;
    case 'almond':
    default:
      s.bezierCurveTo(-W * 0.95, l * 0.55, -W * 0.45, l, 0, l);
      s.bezierCurveTo(W * 0.45, l, W * 0.95, l * 0.55, W, 0);
  }
  s.lineTo(W, 0);
  s.lineTo(-W, 0);

  const geo = new T.ExtrudeGeometry(s, {
    steps: 1,
    depth: 0.05,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.03,
    bevelSegments: 4,
    curveSegments: 18,
  });
  // Curve nail along its length (simulate nail bed curvature).
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const t = y / l;
    const curveZ = -0.18 * Math.sin(Math.PI * (x / W * 0.5 + 0.5)) * (0.6 + 0.4 * t);
    pos.setZ(i, z + curveZ);
  }
  geo.computeVertexNormals();
  geo.translate(0, 0, 0);

  const mesh = new T.Mesh(geo);
  mesh.material = new T.MeshStandardMaterial({ color: 0xffffff });
  return mesh;
}

function makeNailMaterial(T, key, envMap) {
  const presets = {
    chrome:  { color: 0xeeeef2, metalness: 1.0, roughness: 0.08, clearcoat: 1, ior: 2.5, envI: 2.4 },
    onyx:    { color: 0x050507, metalness: 0.6, roughness: 0.05, clearcoat: 1, envI: 1.8 },
    pearl:   { color: 0xf3ecdf, metalness: 0.3, roughness: 0.18, clearcoat: 1, envI: 1.2, sheen: 0.6, sheenColor: 0xffffff },
    crystal: { color: 0xb8c8d8, metalness: 0.0, roughness: 0.02, clearcoat: 1, transmission: 0.9, ior: 1.55, thickness: 0.5, envI: 1.6 },
    bordeaux:{ color: 0x3a0608, metalness: 0.5, roughness: 0.1, clearcoat: 1, envI: 1.4 },
    bone:    { color: 0xe6dbc6, metalness: 0.0, roughness: 0.5, envI: 0.6 },
    jet:     { color: 0x000000, metalness: 0.2, roughness: 0.7, envI: 0.4 },
    glass:   { color: 0xffffff, metalness: 0.0, roughness: 0.0, transmission: 1.0, ior: 1.5, thickness: 0.5, envI: 1.6 },
    blood:   { color: 0x3a0608, metalness: 0.5, roughness: 0.1, clearcoat: 1, envI: 1.4 },
  };
  const p = presets[key] || presets.chrome;
  const m = new T.MeshPhysicalMaterial({
    color: new T.Color(p.color),
    metalness: p.metalness ?? 0,
    roughness: p.roughness ?? 0.3,
    clearcoat: p.clearcoat ?? 0.4,
    clearcoatRoughness: 0.08,
    transmission: p.transmission ?? 0,
    ior: p.ior ?? 1.45,
    thickness: p.thickness ?? 0,
    envMap, envMapIntensity: p.envI ?? 1,
    sheen: p.sheen ?? 0,
    sheenColor: p.sheenColor ? new T.Color(p.sheenColor) : new T.Color(0xffffff),
  });
  return m;
}

Object.assign(window, { Hand3D });
