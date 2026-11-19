/* =====================================================================
   INDUSTRISALG 2.0 CONCEPT · "Tre veier til riktig tilbud" scroll story
   A pinned stage driven by scroll progress (0..1):
     Route 1  search UI: cursor opens search, types, picks a product, adds it
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

  function mount(root){
    const track = root.querySelector('#xqtrack'), host = root.querySelector('#xqcanvas');
    if(!track || !host || !usable()) return null;
    root.classList.add('xq-on');
    const stage = track.querySelector('.xq-stage');
    const steps = [...track.querySelectorAll('.xq-step')], rail = [...track.querySelectorAll('.xq-rail button')];
    const ov = [1, 2, 3].map(i => track.querySelector('.xq-ov' + i));
    const typeEl = track.querySelector('.xq-type'), typeText = typeEl.dataset.text;
    const o1el = ov[0], ui = o1el.querySelector('.xq-ui'), bar = o1el.querySelector('.xq-bar'), opts = [...o1el.querySelectorAll('.xq-opt')];
    const qtyEl = o1el.querySelector('.xq-qty'), plusEl = o1el.querySelector('[data-b="plus"]'), c31 = o1el.querySelector('.xq-c31'), addB = o1el.querySelector('.xq-addb');
    const cursor = o1el.querySelector('.xq-cursor'), rip = o1el.querySelector('.xq-rip'), badge = o1el.querySelector('.xq-badge'), badgeN = badge.querySelector('b');
    // where the cursor goes, as [progress, target]; targets are elements (centre) or [x%, y%] of the stage
    const PATH = [[0.03, [0.86, 0.92]], [0.085, bar], [0.17, bar, 0.32], [0.2, opts[2]], [0.232, opts[2]], [0.252, plusEl], [0.262, plusEl], [0.27, c31], [0.276, c31], [0.284, addB], [0.31, [0.9, 0.95]]];
    const CLICKS = [0.09, 0.224, 0.24, 0.247, 0.255, 0.272, 0.287];
    const ptOf = (t, dx) => { const R = o1el.getBoundingClientRect(); if(Array.isArray(t)) return [t[0] * R.width, t[1] * R.height]; const r = t.getBoundingClientRect(); return [r.left - R.left + r.width * (dx == null ? 0.5 : dx), r.top - R.top + r.height * 0.55]; };
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
      // route 1: search bar pops up, cursor clicks, types, picks, configures, adds
      const pop = easeOut(seg(p, 0.012, 0.06)), out1 = ease(seg(p, 0.295, 0.335));
      o1el.style.opacity = Math.min(1, pop * 1.4) * (1 - out1);
      ui.style.transform = `translate(-50%, ${(1 - pop) * 26 - out1 * 34}px) scale(${0.94 + 0.06 * pop})`;
      const focused = p > 0.092;
      o1el.classList.toggle('s-focus', focused);
      typeEl.textContent = typeText.slice(0, Math.round(typeText.length * seg(p, 0.1, 0.16)));
      o1el.classList.toggle('s-typing', p > 0.1);
      const ddOpen = p > 0.112 && p < 0.226;
      o1el.classList.toggle('s-dd', ddOpen);
      opts.forEach((o, i) => { o.classList.toggle('in', p > 0.118 + i * 0.011); o.classList.toggle('hov', i === 2 && p > 0.196 && p < 0.232); });
      o1el.classList.toggle('s-pick', p > 0.226);
      qtyEl.textContent = Math.max(1, Math.round(200 * ease(seg(p, 0.236, 0.258))));
      c31.classList.toggle('on', p > 0.273);
      const added = p > 0.288;
      addB.classList.toggle('done', added);
      badgeN.textContent = added ? 1 : 0; badge.classList.toggle('on', added);
      // cursor
      let k = 0; while(k < PATH.length - 2 && p > PATH[k + 1][0]) k++;
      const A = PATH[k], B = PATH[k + 1], f = ease(seg(p, A[0], B[0]));
      const pa = ptOf(A[1], A[2]), pb = ptOf(B[1], B[2]);
      const cx = pa[0] + (pb[0] - pa[0]) * f, cy = pa[1] + (pb[1] - pa[1]) * f;
      let press = 0; CLICKS.forEach(c => { press = Math.max(press, 1 - Math.abs(p - c) / 0.0045); });
      press = Math.max(0, press);
      cursor.style.opacity = seg(p, 0.03, 0.045) * (1 - seg(p, 0.3, 0.315));
      cursor.style.transform = `translate(${cx}px, ${cy}px) scale(${1 - press * 0.16})`;
      rip.style.opacity = press * 0.9; rip.style.transform = `scale(${0.4 + (1 - press) * 1.4})`;

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
