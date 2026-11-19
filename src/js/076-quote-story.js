/* =====================================================================
   INDUSTRISALG 2.0 CONCEPT · "Tre veier til riktig tilbud" scroll story
   A pinned stage driven by scroll progress (0..1):
     Route 1  question mark "idea" + search card that finds the part
     Route 2  wireframe bolt sketches itself, gets dimensions, turns solid
     Route 3  purchase list ticks off while washer and nut thread on
   Falls back to the plain three cards on small screens, without WebGL
   or with reduced motion.
   ===================================================================== */
const XQ = (function(){
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const back = t => { const c = 1.6; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

  function usable(){
    return typeof X3D !== 'undefined' && X3D.ok && !X3D.reduced() && window.matchMedia('(min-width: 901px)').matches;
  }

  function questionMark(){
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.35, roughness: 0.22, envMapIntensity: 1.3, transparent: true });
    const pts = [[-0.78, 0.95], [-0.62, 1.55], [0, 1.85], [0.66, 1.56], [0.8, 0.98], [0.45, 0.45], [0.06, 0.12], [0, -0.42]].map(([x, y]) => new THREE.Vector3(x, y, 0));
    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 120, 0.21, 24, false), mat));
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.21, 24, 16), mat); cap.position.copy(pts[0]); g.add(cap);
    const cap2 = cap.clone(); cap2.position.copy(pts[pts.length - 1]); g.add(cap2);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.27, 32, 20), mat); dot.position.set(0, -1.08, 0); g.add(dot);
    g.position.y = -0.35;
    return { g, mat };
  }

  function mount(root){
    const track = root.querySelector('#xqtrack'), host = root.querySelector('#xqcanvas');
    if(!track || !host || !usable()) return null;
    root.classList.add('xq-on');
    const stage = track.querySelector('.xq-stage');
    const steps = [...track.querySelectorAll('.xq-step')], rail = [...track.querySelectorAll('.xq-rail button')];
    const ov = [1, 2, 3].map(i => track.querySelector('.xq-ov' + i));
    const typeEl = track.querySelector('.xq-type'), typeText = typeEl.dataset.text;
    const listItems = [...track.querySelectorAll('.xq-list li')], foundEl = track.querySelector('[data-found]');
    const lblLen = track.querySelector('[data-dim="len"]'), lblDia = track.querySelector('[data-dim="dia"]');

    // ---- renderer / scene
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.18;
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene(); scene.environment = X3D.envFor(renderer);
    const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(3, 5, 4); scene.add(key);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xc9d3e6, 1.1));
    const fill = new THREE.DirectionalLight(0xeef3ff, 0.9); fill.position.set(-4, 2, 3); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 1.1); rim.position.set(-2, 3, -5); scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

    // ---- route 1: the idea
    const idea = new THREE.Group(); scene.add(idea);
    const qm = questionMark(); idea.add(qm.g);
    const haloMat = new THREE.LineBasicMaterial({ color: 0x3b6cf0, transparent: true, opacity: 0.22, depthWrite: false });
    const halo = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.25, 1)), haloMat); idea.add(halo);
    const sparkMat = new THREE.PointsMaterial({ color: 0x2563eb, size: 0.07, transparent: true, opacity: 0.6, depthWrite: false });
    const sp = new Float32Array(90 * 3); for(let i = 0; i < 90; i++){ const r = 2.6 + Math.random() * 0.9, a = Math.random() * Math.PI * 2, b = Math.acos(2 * Math.random() - 1); sp.set([r * Math.sin(b) * Math.cos(a), r * Math.cos(b), r * Math.sin(b) * Math.sin(a)], i * 3); }
    const sparkGeo = new THREE.BufferGeometry(); sparkGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    const sparks = new THREE.Points(sparkGeo, sparkMat); idea.add(sparks);

    // ---- route 2 + 3: the part (axis along Y, head on top)
    const part = new THREE.Group(); scene.add(part);
    const axis = new THREE.Group(); axis.rotation.z = Math.PI / 2.35; part.add(axis);
    const centre = new THREE.Group(); centre.position.y = 1.65; axis.add(centre); // bolt spans y 0.75 .. -4; centre it
    const mkBolt = () => { const b = X3D.BUILD.hexbolt(false); b.g.rotation.set(0, 0, 0); return b.g; };
    // wire sketch
    const wireMat = new THREE.LineBasicMaterial({ color: 0x1d4ed8, transparent: true, opacity: 0.9, depthWrite: false, depthTest: false });
    const sketch = mkBolt();
    // fewer facets on round parts so the sketch shows clean longitudinal lines
    sketch.traverse(o => { if(o.isMesh && o.geometry.type === 'CylinderGeometry'){ const q = o.geometry.parameters; o.geometry.dispose(); o.geometry = new THREE.CylinderGeometry(q.radiusTop, q.radiusBottom, q.height, 14, 1); } });
    const wire = X3D.toWire(sketch, wireMat); centre.add(wire); wire.traverse(o => { o.renderOrder = 2; });
    const strokes = []; let total = 0;
    wire.traverse(o => { if(o.isLine){ const n = o.geometry.attributes.position.count; strokes.push({ o, n, seg: o.isLineSegments }); total += n; } });
    // dimension lines
    const dimMat = new THREE.LineBasicMaterial({ color: 0x5b7fd6, transparent: true, opacity: 0, depthWrite: false });
    const V = (x, y) => new THREE.Vector3(x, y, 0);
    const dimPts = [
      V(0.95, 0), V(1.95, 0), V(0.66, -4), V(1.95, -4), V(1.75, 0), V(1.75, -4),          // length + extension lines
      V(1.65, -0.15), V(1.75, 0), V(1.85, -0.15), V(1.75, 0), V(1.65, -3.85), V(1.75, -4), V(1.85, -3.85), V(1.75, -4),
      V(-0.6, -4.1), V(-0.6, -4.75), V(0.6, -4.1), V(0.6, -4.75), V(-0.6, -4.6), V(0.6, -4.6),   // diameter
      V(-0.45, -4.5), V(-0.6, -4.6), V(-0.45, -4.7), V(-0.6, -4.6), V(0.45, -4.5), V(0.6, -4.6), V(0.45, -4.7), V(0.6, -4.6)
    ];
    const dims = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(dimPts), dimMat); centre.add(dims);
    const anchorLen = V(1.95, -2), anchorDia = V(0, -4.95);
    // solid bolt
    const solid = mkBolt(); centre.add(solid);
    const solidMats = new Set(); solid.traverse(o => { if(o.isMesh){ o.material.transparent = true; solidMats.add(o.material); } });
    // washer + nut that thread on in route 3
    const washer = X3D.BUILD.washer().g; washer.rotation.set(0, 0, 0);
    const nut = X3D.BUILD.nut(false).g; nut.rotation.set(0, 0, 0);
    const wHold = new THREE.Group(), nHold = new THREE.Group(); wHold.add(washer); nHold.add(nut); centre.add(wHold); centre.add(nHold);
    const fadeMats = []; [washer, nut].forEach(g => g.traverse(o => { if(o.isMesh){ o.material.transparent = true; fadeMats.push(o.material); } }));
    // soft floor shadow
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: X3D.shadowTex(), transparent: true, depthWrite: false, opacity: 0 }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = -2.55; shadow.scale.set(7, 2.6, 1); scene.add(shadow);

    // ---- layout
    function frame(){
      const w = host.clientWidth || 600, h = host.clientHeight || 500;
      renderer.setSize(w, h, false); cam.aspect = w / h;
      const size = 6.4, fit = size / (2 * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)));
      cam.position.set(0, 1.1, Math.max(fit, fit / cam.aspect) * 1.08); cam.lookAt(0, 0, 0); cam.updateProjectionMatrix();
      const hd = document.querySelector('.hdr'); const top = hd ? Math.round(hd.getBoundingClientRect().height) : 72;
      track.style.setProperty('--xq-top', top + 'px');
    }

    // ---- scroll progress
    let p = 0, pt = 0, visible = true, raf = 0, t0 = performance.now(), lastStep = -1;
    function target(){
      const r = track.getBoundingClientRect(), span = track.offsetHeight - stage.offsetHeight;
      return span > 0 ? clamp(-r.top / span, 0, 1) : 0;
    }
    function setOpacity(set, v){ set.forEach(m => { m.opacity = v; m.visible = v > 0.002; }); }
    const project = (v3, obj) => { const v = v3.clone(); obj.localToWorld(v); v.project(cam); return [(v.x + 1) / 2 * host.clientWidth, (1 - v.y) / 2 * host.clientHeight]; };

    function apply(time){
      const T = (time - t0) / 1000;
      // ---------- route 1: idea (0 .. 0.36)
      const inA = easeOut(seg(p, 0, 0.06)), outA = ease(seg(p, 0.28, 0.37));
      const ideaV = inA * (1 - outA);
      idea.visible = ideaV > 0.01;
      idea.scale.setScalar((0.75 + 0.25 * inA) * (1 - 0.55 * outA));
      idea.position.set(0.75, 0.25 + Math.sin(T * 1.3) * 0.08 + outA * 0.6, 0);
      qm.g.rotation.y = Math.sin(T * 0.7) * 0.4 + Math.sin(p * 9) * 0.25;
      halo.rotation.set(T * 0.08, -T * 0.12 - p * 2, 0);
      sparks.rotation.y = T * 0.05 + p * 1.5;
      qm.mat.opacity = ideaV; haloMat.opacity = 0.22 * ideaV; sparkMat.opacity = 0.55 * ideaV * (1 + outA * 1.5);
      sparkMat.size = 0.07 + outA * 0.08;

      // ---------- route 2: sketch draws, dimensions, turns solid (0.33 .. 0.66)
      const draw = ease(seg(p, 0.34, 0.52));
      let budget = draw * total;
      strokes.forEach(s => { let n = Math.max(0, Math.min(s.n, Math.floor(budget))); if(s.seg) n -= n % 2; s.o.geometry.setDrawRange(0, n); budget -= s.n; s.o.visible = n > 1; });
      const dimIn = seg(p, 0.48, 0.54), toSolid = ease(seg(p, 0.56, 0.65));
      dimMat.opacity = 0.85 * dimIn * (1 - seg(p, 0.6, 0.65));
      dims.geometry.setDrawRange(0, Math.floor(dimPts.length * dimIn / 2) * 2);
      wireMat.opacity = 0.9 * (1 - toSolid * 0.92);
      wire.visible = draw > 0 && toSolid < 0.999;
      setOpacity(solidMats, toSolid); solidMats.forEach(m => { m.depthWrite = toSolid > 0.85; });
      solid.visible = toSolid > 0.002;
      shadow.material.opacity = toSolid * 0.85;
      const partIn = seg(p, 0.32, 0.4);
      part.visible = partIn > 0;
      part.scale.setScalar(0.92 + 0.08 * easeOut(partIn));
      // calm while sketching, turns once it is a real part
      const s3 = ease(seg(p, 0.64, 1));
      part.rotation.y = 0.32 + Math.sin(T * 0.6) * 0.04 * (1 - toSolid) - s3 * 0.55;
      part.rotation.x = s3 * 0.18;
      centre.rotation.y = ease(seg(p, 0.58, 1)) * Math.PI * 2.2;   // spins on its own axis, like being screwed in
      part.position.set(s3 * 0.55, 0.8 * s3 + Math.sin(T * 1.1) * 0.05, 0);

      // ---------- route 3: washer + nut thread on (0.68 .. 0.95)
      const wIn = seg(p, 0.71, 0.8), nIn = seg(p, 0.8, 0.91);
      wHold.visible = wIn > 0; nHold.visible = nIn > 0;
      wHold.position.y = -2.37 - (1 - back(wIn)) * 4.2; wHold.rotation.y = (1 - wIn) * 6;
      nHold.position.y = -3.0 - (1 - easeOut(nIn)) * 4.6; nHold.rotation.y = (1 - nIn) * 14;
      fadeMats.forEach((m, i) => { m.opacity = clamp((i < 1 ? wIn : nIn) * 3, 0, 1); });

      // ---------- HTML overlays
      const o1 = seg(p, 0.03, 0.08) * (1 - seg(p, 0.28, 0.33));
      ov[0].style.opacity = o1; ov[0].style.transform = `translateY(${(1 - o1) * 16}px)`;
      const typed = Math.round(typeText.length * seg(p, 0.07, 0.17));
      typeEl.textContent = typeText.slice(0, typed);
      ov[0].classList.toggle('s-res', p > 0.18); ov[0].classList.toggle('s-opt', p > 0.22); ov[0].classList.toggle('s-add', p > 0.26);

      const o2 = seg(p, 0.4, 0.45) * (1 - seg(p, 0.63, 0.67));
      ov[1].style.opacity = o2;
      ov[1].classList.toggle('s-dim', dimIn > 0.9 && toSolid < 0.5);
      ov[1].classList.toggle('s-tech', p > 0.55);
      if(o2 > 0){
        const [lx, ly] = project(anchorLen, centre), [dx, dy] = project(anchorDia, centre);
        lblLen.style.transform = `translate(${lx}px, ${ly}px)`; lblDia.style.transform = `translate(${dx}px, ${dy}px)`;
      }

      const o3 = seg(p, 0.68, 0.73);
      ov[2].style.opacity = o3; ov[2].style.transform = `translateY(${(1 - o3) * 16}px)`;
      const found = [p > 0.72, p > 0.8, p > 0.9];
      listItems.forEach((li, i) => li.classList.toggle('ok', found[i]));
      foundEl.textContent = found.filter(Boolean).length;

      // ---------- left column + rail
      const step = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
      if(step !== lastStep){ steps.forEach((s, i) => s.classList.toggle('on', i === step)); rail.forEach((b, i) => { b.classList.toggle('on', i === step); b.classList.toggle('done', i < step); }); lastStep = step; }
      rail.forEach((b, i) => b.style.setProperty('--f', clamp((p - i / 3) * 3, 0, 1)));
      track.style.setProperty('--grid', (seg(p, 0.34, 0.42) * (1 - seg(p, 0.6, 0.68))).toFixed(3));
      track.classList.toggle('xq-started', p > 0.02);
    }

    function tick(time){
      raf = 0; if(!visible) return;
      pt = target(); p += (pt - p) * 0.12; if(Math.abs(pt - p) < 0.0004) p = pt;
      apply(time || performance.now());
      renderer.render(scene, cam);
      raf = requestAnimationFrame(tick);
    }
    const start = () => { if(!raf) raf = requestAnimationFrame(tick); };
    rail.forEach((b, i) => b.addEventListener('click', () => {
      const span = track.offsetHeight - stage.offsetHeight, y = window.scrollY + track.getBoundingClientRect().top + span * [0.2, 0.5, 0.94][i];
      window.scrollTo({ top: y, behavior: 'smooth' });
    }));
    const ro = new ResizeObserver(frame); ro.observe(host);
    const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; if(visible) start(); }, { rootMargin: '200px 0px' }); io.observe(track);
    const mq = window.matchMedia('(min-width: 901px)');
    const onMq = () => { if(!mq.matches){ api.dispose(); } };
    mq.addEventListener && mq.addEventListener('change', onMq);
    frame(); p = pt = target(); start();

    const api = { dispose(){
      cancelAnimationFrame(raf); visible = false; ro.disconnect(); io.disconnect(); mq.removeEventListener && mq.removeEventListener('change', onMq);
      scene.traverse(o => { if(o.geometry) o.geometry.dispose(); if(o.material) o.material.dispose(); });
      renderer.dispose(); renderer.domElement.remove(); root.classList.remove('xq-on');
    } };
    return api;
  }
  return { mount };
})();
