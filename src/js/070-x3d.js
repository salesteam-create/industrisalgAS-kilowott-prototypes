/* =====================================================================
   INDUSTRISALG 2.0 CONCEPT · 3D fasteners (three.js r158, bundled)
   Procedural, dimensionally plausible models per standard (M12):
   DIN 933/931 hex bolt, DIN 912 socket cap screw, DIN 934 nut,
   DIN 985 nylon lock nut, DIN 125 washer, Nord-Lock washer pair.
   Drag to rotate; auto-rotates when idle; pauses off-screen.
   ===================================================================== */
const X3D = (function(){
  const ok = typeof THREE !== 'undefined' && (()=>{ try{ const c=document.createElement('canvas'); return !!(c.getContext('webgl2')||c.getContext('webgl')); }catch(e){ return false; } })();
  const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let envTex = null;

  function envFor(renderer){
    if(envTex) return envTex;
    // Small studio: soft grey room with bright panels, baked to a PMREM map
    const pm = new THREE.PMREMGenerator(renderer);
    const sc = new THREE.Scene();
    const room = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({ color: 0x9aa4b6, side: THREE.BackSide }));
    sc.add(room);
    const panel = (w, h, x, y, z, ry, rx, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 1, 1).multiplyScalar(k), side: THREE.DoubleSide })); m.position.set(x, y, z); m.rotation.set(rx || 0, ry || 0, 0); sc.add(m); };
    panel(6, 2.2, 0, 4.9, 0, 0, Math.PI / 2, 9);   // ceiling softbox
    panel(3, 5, -4.9, 0.5, 0, Math.PI / 2, 0, 5);  // left strip
    panel(2, 4, 4.9, 0.8, -1, -Math.PI / 2, 0, 3); // right fill
    panel(5, 1.2, 0, 1.2, -4.9, 0, 0, 4);          // back strip
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({ color: 0xdfe5ef })); floor.rotation.x = -Math.PI / 2; floor.position.y = -4.9; sc.add(floor);
    envTex = pm.fromScene(sc, 0.03).texture; pm.dispose();
    return envTex;
  }

  const MATS = {
    steel: () => new THREE.MeshStandardMaterial({ color: 0xb9bfc8, metalness: 0.7, roughness: 0.3, envMapIntensity: 1.2 }),
    zinc: () => new THREE.MeshStandardMaterial({ color: 0xbcc4d0, metalness: 0.7, roughness: 0.34, envMapIntensity: 1.2 }),
    dark: () => new THREE.MeshStandardMaterial({ color: 0x9aa1ac, metalness: 0.7, roughness: 0.36, envMapIntensity: 1.2 }),
    nylon: () => new THREE.MeshStandardMaterial({ color: 0xf2f5fa, metalness: 0, roughness: 0.55 })
  };

  function hexShape(R){ const s = new THREE.Shape(); for(let i = 0; i < 6; i++){ const a = Math.PI / 6 + i * Math.PI / 3; const x = R * Math.cos(a), y = R * Math.sin(a); i ? s.lineTo(x, y) : s.moveTo(x, y); } s.closePath(); return s; }
  function circleShape(r){ const s = new THREE.Shape(); s.absarc(0, 0, r, 0, Math.PI * 2, false); return s; }
  function holePath(r){ const p = new THREE.Path(); p.absarc(0, 0, r, 0, Math.PI * 2, true); return p; }
  function hexHole(R){ const p = new THREE.Path(); for(let i = 0; i < 6; i++){ const a = -(i * Math.PI / 3); const x = R * Math.cos(a), y = R * Math.sin(a); i ? p.lineTo(x, y) : p.moveTo(x, y); } p.closePath(); return p; }
  // Extrude along +Y from y0 to y0+h with a small chamfer
  function extrudeY(shape, h, y0, bevel){
    const b = bevel == null ? 0.05 : bevel;
    const g = new THREE.ExtrudeGeometry(shape, { depth: Math.max(0.001, h - 2 * b), bevelEnabled: b > 0, bevelThickness: b, bevelSize: b, bevelSegments: 3, curveSegments: 48 });
    g.rotateX(-Math.PI / 2); g.translate(0, y0 + b, 0); return g;
  }
  class Helix extends THREE.Curve {
    constructor(r, y0, len, pitch){ super(); this.r = r; this.y0 = y0; this.len = len; this.turns = len / pitch; }
    getPoint(t, v = new THREE.Vector3()){ const a = t * this.turns * Math.PI * 2; return v.set(this.r * Math.cos(a), this.y0 + t * this.len, this.r * Math.sin(a)); }
  }
  function threaded(r, y0, len, pitch, mat){
    const g = new THREE.Group();
    const core = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.84, r * 0.84, len, 48), mat); core.position.y = y0 + len / 2; g.add(core);
    const turns = len / pitch;
    const tube = new THREE.Mesh(new THREE.TubeGeometry(new Helix(r * 0.84, y0 + pitch * 0.5, len - pitch, pitch), Math.ceil(turns * 28), r * 0.17, 8, false), mat); g.add(tube);
    return g;
  }

  // Unit: 1 = 10 mm. All models are M12.
  const BUILD = {
    hexbolt(full){
      const g = new THREE.Group(), m = MATS.steel();
      const R = 1.04, k = 0.75, L = 4.0, r = 0.6, p = 0.175;
      g.add(new THREE.Mesh(extrudeY(hexShape(R), k, 0, 0.06), m));
      const washerFace = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.86, 0.04, 48), m); washerFace.position.y = -0.02; g.add(washerFace);
      const tl = full ? L - 0.1 : 1.6;
      if(!full){ const sh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, L - tl, 48), m); sh.position.y = -(L - tl) / 2; g.add(sh); }
      const th = threaded(r, -L, tl, p, m); g.add(th);
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.72, r * 0.84, 0.08, 48), m); tip.position.y = -L - 0.04; g.add(tip);
      g.rotation.z = Math.PI / 2.3; return { g, size: 6.2 };
    },
    socket(){
      const g = new THREE.Group(), m = MATS.dark();
      const Rh = 0.9, k = 1.2, L = 4.0, r = 0.6, p = 0.175;
      const base = new THREE.Mesh(extrudeY(circleShape(Rh), 0.55, 0, 0.04), m); g.add(base);
      const sh = circleShape(Rh); sh.holes.push(hexHole(0.58));
      g.add(new THREE.Mesh(extrudeY(sh, k - 0.5, 0.5, 0.07), m));
      g.add(threaded(r, -L, L - 0.05, p, m));
      g.rotation.z = Math.PI / 2.3; return { g, size: 6.2 };
    },
    nut(lock){
      const g = new THREE.Group(), m = MATS.steel();
      const sh = hexShape(1.04); sh.holes.push(holePath(0.52));
      g.add(new THREE.Mesh(extrudeY(sh, lock ? 0.85 : 1.0, -0.5, 0.06), m));
      if(lock){ const cap = circleShape(0.92); cap.holes.push(holePath(0.55)); g.add(new THREE.Mesh(extrudeY(cap, 0.38, 0.33, 0.05), m)); const ny = circleShape(0.62); ny.holes.push(holePath(0.5)); g.add(new THREE.Mesh(extrudeY(ny, 0.08, 0.66, 0.02), MATS.nylon())); }
      g.rotation.x = 0.95; return { g, size: 2.6 };
    },
    washer(){
      const g = new THREE.Group(), m = MATS.zinc();
      const sh = circleShape(1.2); sh.holes.push(holePath(0.65));
      g.add(new THREE.Mesh(extrudeY(sh, 0.25, -0.12, 0.04), m));
      g.rotation.x = 1.05; return { g, size: 2.6 };
    },
    nordlock(){
      const g = new THREE.Group(), m = MATS.zinc();
      const mk = (y, flip) => {
        const w = new THREE.Group();
        const sh = circleShape(1.0); sh.holes.push(holePath(0.66));
        w.add(new THREE.Mesh(extrudeY(sh, 0.16, 0, 0.03), m));
        // radial cams on the inner face
        for(let i = 0; i < 18; i++){
          const cam = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.07, 0.11), m);
          const a = i / 18 * Math.PI * 2; cam.position.set(Math.cos(a) * 0.83, 0.17, Math.sin(a) * 0.83); cam.rotation.set(0, -a, 0.35); w.add(cam);
        }
        if(flip){ w.rotation.x = Math.PI; } w.position.y = y; return w;
      };
      g.add(mk(-0.32, false)); g.add(mk(0.32, true));
      g.rotation.x = 0.9; return { g, size: 2.8 };
    }
  };
  const MODEL_FOR = { '933': () => BUILD.hexbolt(true), '931': () => BUILD.hexbolt(false), '912': () => BUILD.socket(), '934': () => BUILD.nut(false), '985': () => BUILD.nut(true), '125': () => BUILD.washer(), 'NL': () => BUILD.nordlock() };

  function shadowTex(){
    const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
    const gr = x.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, 'rgba(11,27,63,.32)'); gr.addColorStop(1, 'rgba(11,27,63,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
  }

  // Wire-mesh look: every mesh becomes thin blue lines on a light background
  function toWire(g, mat){
    const swaps = [];
    g.traverse(o => { if(o.isMesh) swaps.push(o); });
    swaps.forEach(o => {
      const geo = o.geometry; let line;
      if(geo.type === 'TubeGeometry'){
        // thread: one clean helix line instead of a dense tube mesh
        line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(geo.parameters.path.getPoints(Math.ceil(geo.parameters.tubularSegments * 1.2))), mat);
      } else {
        line = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 24), mat);
      }
      line.position.copy(o.position); line.rotation.copy(o.rotation); line.scale.copy(o.scale);
      o.parent.add(line); o.parent.remove(o); o.geometry.dispose(); if(o.material) o.material.dispose();
    });
    return g;
  }

  function mount(el, std, opts){
    opts = opts || {};
    if(!ok || !el) return null;
    if(el._x3d){ el._x3d.set(std); return el._x3d; }
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene(); scene.environment = envFor(renderer);
    const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(3, 5, 4); scene.add(key);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xc9d3e6, 1.1));
    const fill = new THREE.DirectionalLight(0xeef3ff, 0.9); fill.position.set(-4, 2, 3); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 1.1); rim.position.set(-2, 3, -5); scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    const pivot = new THREE.Group(); scene.add(pivot);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: shadowTex(), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; scene.add(shadow);
    if(opts.wire) shadow.visible = false;
    let model = null, size = 4, rotY = 0.6, rotX = 0, vY = 0, dragging = false, lastX = 0, lastY = 0, idle = 0, visible = true, raf = 0;
    let wireMat = null, fade = 1, fadeTo = 1, pending = null, cycleT = null;

    function set(s){
      if(model){ pivot.remove(model); model.traverse(o => { if(o.geometry) o.geometry.dispose(); if(o.material && o.material !== wireMat) o.material.dispose(); }); }
      const b = (MODEL_FOR[s] || MODEL_FOR['933'])();
      if(opts.wire){
        if(!wireMat) wireMat = new THREE.LineBasicMaterial({ color: opts.color || 0x1d4ed8, transparent: true, opacity: 0, depthWrite: false });
        toWire(b.g, wireMat); fade = 0; fadeTo = 1;
        if(opts.onChange) opts.onChange(s);
      }
      // centre the model on its bounding box
      const box = new THREE.Box3().setFromObject(b.g); const c = box.getCenter(new THREE.Vector3()); b.g.position.sub(c);
      const holder = new THREE.Group(); holder.add(b.g); model = holder; pivot.add(model);
      size = b.size * (opts.wire ? (b.size < 4 ? 1.75 : 1.2) : 1); frame();
      model.scale.setScalar(0.88); requestAnimationFrame(() => { if(model) model.scale.setScalar(1); });
      el.dataset.std = s;
    }
    function frame(){
      const w = el.clientWidth || 600, h = el.clientHeight || 400;
      renderer.setSize(w, h, false); cam.aspect = w / h;
      const fit = size / (2 * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)));
      cam.position.set(0, size * 0.28, Math.max(fit, fit / cam.aspect) * 1.12); cam.lookAt(0, 0, 0); cam.updateProjectionMatrix();
      shadow.position.y = -size * 0.3; shadow.scale.set(size * 1.1, size * 0.55, 1);
    }
    function tick(){
      raf = 0; if(!visible) return;
      if(!dragging){ vY *= 0.94; idle++; if(idle > 40 && !reduced()) rotY += opts.wire ? 0.006 : 0.0045; rotY += vY; rotX *= 0.96; }
      pivot.rotation.set(rotX, rotY, 0);
      if(wireMat){
        fade += (fadeTo - fade) * 0.12;
        wireMat.opacity = fade * (opts.opacity || 0.42);
        if(pending && fade < 0.03){ const s = pending; pending = null; set(s); }
      }
      renderer.render(scene, cam);
      raf = requestAnimationFrame(tick);
    }
    const start = () => { if(!raf) raf = requestAnimationFrame(tick); };
    el.addEventListener('pointerdown', e => { dragging = true; idle = 0; lastX = e.clientX; lastY = e.clientY; el.setPointerCapture && el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove', e => { if(!dragging) return; const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY; vY = dx * 0.006; rotY += vY; rotX = Math.max(-0.6, Math.min(0.6, rotX + dy * 0.005)); });
    const end = () => { dragging = false; idle = 0; };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    const ro = new ResizeObserver(frame); ro.observe(el);
    const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; if(visible) start(); }); io.observe(el);
    set(std); start();
    // Optional cycling through a list of standards (wire-mesh showcase)
    if(opts.cycle && opts.list && opts.list.length > 1 && !reduced()){
      let i = Math.max(0, opts.list.indexOf(std));
      cycleT = setInterval(() => { if(!visible || dragging) return; i = (i + 1) % opts.list.length; pending = opts.list[i]; fadeTo = 0; }, opts.cycle);
    }
    const api = { set, dispose(){ cancelAnimationFrame(raf); clearInterval(cycleT); ro.disconnect(); io.disconnect(); if(wireMat) wireMat.dispose(); renderer.dispose(); el._x3d = null; } };
    el._x3d = api; el.classList.add('x3d-on');
    return api;
  }
  return { ok, mount, BUILD, MATS, envFor, toWire, shadowTex, reduced };
})();
