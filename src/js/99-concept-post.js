/* =====================================================================
   INDUSTRISALG 2.0 CONCEPT · After-router layer
   Wraps render() so every page gets the new behaviours, replaces the
   "changes" panel with design notes, and wires the homepage effects.
   ===================================================================== */

const _xRender = render;
render = function(keepScroll){ _xRender(keepScroll); xAfterRender(); };

let xObs=[], xTypeTimer=null, xHeroSugIdx=-1;

function xAfterRender(){
  document.body.classList.toggle('x-home', CURRENT==='home');
  document.body.classList.remove('x-hero-out');
  xObs.forEach(o=>o.disconnect()); xObs=[];
  clearTimeout(xTypeTimer);
  xNotesLayerClear();
  x3dMounts.forEach(m=>m&&m.dispose()); x3dMounts=[];
  if(CURRENT==='home') xInitHome();
  if(CURRENT==='category') x3dCategory();
  if(CURRENT==='product') x3dProduct();
  if(document.body.classList.contains('x-annot')) setTimeout(xNotesLayerDraw,400);
}

/* ---------- Header shadow on scroll ---------- */
window.addEventListener('scroll',()=>{ const h=$('.hdr'); if(h) h.classList.toggle('x-scrolled', window.scrollY>8); },{passive:true});

/* ---------- "/" focuses search ---------- */
document.addEventListener('keydown',e=>{
  if(e.key!=='/' || e.metaKey || e.ctrlKey || e.altKey) return;
  const tg=e.target; if(tg.closest&&tg.closest('input,textarea,select,[contenteditable]')) return;
  e.preventDefault();
  const hq=$('#hq'); if(hq && !document.body.classList.contains('x-hero-out')) hq.focus(); else $('#q').focus();
});

/* ---------- Homepage ---------- */
const xReduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function xInitHome(){
  // reveal on scroll
  const rv=new IntersectionObserver(es=>es.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); rv.unobserve(en.target); } }),{rootMargin:'0px 0px -8% 0px',threshold:.08});
  $$('#main [data-rv], #main .xh-list, #main .xh-dial').forEach(el=>rv.observe(el)); xObs.push(rv);

  // stats count-up
  const co=new IntersectionObserver(es=>es.forEach(en=>{ if(!en.isIntersecting) return; co.unobserve(en.target); xCount(en.target); }),{threshold:.6});
  $$('#main [data-count]').forEach(el=>co.observe(el)); xObs.push(co);

  // header search appears once the hero search leaves the viewport
  const sw=$('.xh-searchwrap');
  if(sw){ const ho=new IntersectionObserver(es=>es.forEach(en=>document.body.classList.toggle('x-hero-out',!en.isIntersecting)),{rootMargin:'-120px 0px 0px 0px'}); ho.observe(sw); xObs.push(ho); }

  xHeroSearch();
  xIndustry();
  xDropZone();
  x3dHome();
  if(typeof XQ!=='undefined'){ const q=XQ.mount($('#tilbud')); if(q) x3dMounts.push(q); }
}

/* ---------- 3D viewers ---------- */
let x3dMounts=[];
function x3dMount(el,std,opts){
  if(typeof X3D==='undefined'||!X3D.ok||!el) return null;
  const m=X3D.mount(el,std,opts); if(!m) return null;
  x3dMounts.push(m);
  const fb=el.querySelector('.xh-3d-fallback'); if(fb) fb.hidden=true;
  return m;
}
function x3dWire(){
  const el=$('#xwire'); if(!el) return;
  const cap=$('#xwirecap');
  x3dMount(el,'933',{ wire:true, cycle:3000, list:['933','934','912','125','985','931','NL'], opacity:.8, color:0x1d4ed8,
    onChange(k){ if(!cap) return; const s=STANDARDS[k]; cap.classList.remove('in'); void cap.offsetWidth; cap.innerHTML=`<b>${esc(s.din)}</b><span>${esc(tr(s.name))}</span>`; cap.classList.add('in'); } });
}
function x3dHome(){
  x3dWire();
  const stage=$('#x3dstage'); if(!stage) return;
  const m=x3dMount(stage,'933');
  $$('#main [data-x3d]').forEach(b=>b.addEventListener('click',()=>{
    const k=b.dataset.x3d;
    $$('#main [data-x3d]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    if(m) m.set(k); else { const fb=stage.querySelector('.xh-3d-fallback'); if(fb) fb.innerHTML=drawing(STANDARDS[k].kind,k,true); }
    const info=$('#x3dinfo'); info.innerHTML=x3dInfo(k); translateDom(info);
    track('view_3d',{standard:k});
  }));
}
function x3dCategory(){
  const art=$('#main .xs-art'); if(!art) return;
  const slug=(location.hash.split('/')[2]||'').split('?')[0]; const std=STD_BY_SLUG[slug];
  if(std && x3dMount(art,std)){ const svg=art.querySelector(':scope > svg'); if(svg) svg.style.display='none'; art.setAttribute('role','img'); art.setAttribute('aria-label',tr('3D-modell')+' '+STANDARDS[std].din); }
}
function x3dProduct(){
  const sku=(location.hash.split('/')[2]||'').split('?')[0]; const p=BY_SKU[sku]; const d=$('#main .drawing');
  if(!p||!d||typeof X3D==='undefined'||!X3D.ok) return;
  const box=document.createElement('div'); box.className='x3d-prod'; box.setAttribute('role','img'); box.setAttribute('aria-label',tr('3D-modell')+' '+p.label);
  box.innerHTML=`<span class="xh-3d-hint">${XI.rotate}<span>${esc(tr('Dra for å rotere'))}</span></span>`;
  d.insertAdjacentElement('afterend',box); x3dMount(box,p.std);
}

function xCount(el){
  const end=+el.dataset.count; if(!end||xReduced()) return;
  const t0=performance.now(), dur=end>100?1600:900;
  const step=t=>{ const k=Math.min(1,(t-t0)/dur); const v=Math.round(end*(1-Math.pow(1-k,3))); el.textContent=fmtInt(v); if(k<1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

/* Hero search: instant results with add-to-quote, keyboard support, typing placeholder */
function xHeroSearch(){
  const inp=$('#hq'), box=$('#hsug'); if(!inp||!box) return;
  const show=()=>{
    const q=inp.value.trim();
    if(q.length<2){ box.hidden=true; box.innerHTML=''; inp.setAttribute('aria-expanded','false'); xHeroSugIdx=-1; return; }
    const res=searchProducts(q), desc=describeQuery(q);
    if(!res.length){
      box.innerHTML=`<div class="xh-sug-empty"><p style="margin:0 0 6px"><b>Ingen treff på «${esc(q)}».</b></p><a href="#/spesialprodukt?spec=${encodeURIComponent(q)}">La en tekniker finne produktet</a></div>`;
    } else {
      box.innerHTML=`<div class="xh-sug-h"><span>${desc?esc(tr('Tolket som:'))+' <b>'+esc(desc)+'</b>':esc(tr('Forslag'))}</span><span>${fmtInt(res.length)} ${esc(tr('treff'))}</span></div>
        <ul role="listbox">${res.slice(0,5).map(p=>`<li role="option">${thumb(p)}<a class="xh-sug-l" href="${productUrl(p)}"><b>${esc(p.label)}</b><small>${p.sku} · ${p.stock?'<span class="stock-in">'+esc(tr('På lager'))+'</span>':'<span class="stock-out">'+esc(tr('Bestillingsvare'))+'</span>'}</small></a><button type="button" class="xh-sug-add" data-act="xadd" data-sku="${p.sku}" aria-label="${esc(tr(primaryLabel()))}: ${esc(p.label)}">${XI.plus}<span>${esc(tr('Legg til'))}</span></button></li>`).join('')}</ul>
        <a class="xh-sug-all" href="#/sok?q=${encodeURIComponent(q)}"><span>${esc(tr('Se alle'))} ${fmtInt(res.length)} ${esc(tr('treff i tabell med filtre'))}</span>${XI.arrS}</a>`;
    }
    translateDom(box);
    box.hidden=false; inp.setAttribute('aria-expanded','true'); xHeroSugIdx=-1;
  };
  let t; inp.addEventListener('input',()=>{ clearTimeout(t); t=setTimeout(show,90); });
  inp.addEventListener('focus',()=>{ xStopTyping(); show(); });
  inp.addEventListener('blur',()=>setTimeout(()=>{ if(!box.contains(document.activeElement)){ box.hidden=true; inp.setAttribute('aria-expanded','false'); } },180));
  box.addEventListener('mousedown',e=>{ if(!e.target.closest('.xh-sug-add')) e.preventDefault(); });
  inp.addEventListener('keydown',e=>{
    const items=$$('li',box);
    if(e.key==='ArrowDown'&&items.length){ e.preventDefault(); xHeroSugIdx=(xHeroSugIdx+1)%items.length; }
    else if(e.key==='ArrowUp'&&items.length){ e.preventDefault(); xHeroSugIdx=(xHeroSugIdx-1+items.length)%items.length; }
    else if(e.key==='Enter'&&xHeroSugIdx>=0&&items[xHeroSugIdx]){ e.preventDefault(); e.stopPropagation(); location.hash=items[xHeroSugIdx].querySelector('a').getAttribute('href'); return; }
    else if(e.key==='Escape'){ box.hidden=true; return; }
    else return;
    items.forEach((li,i)=>li.classList.toggle('active',i===xHeroSugIdx));
  });
  xStartTyping(inp);
}

function xStartTyping(inp){
  const base=inp.getAttribute('placeholder');
  if(xReduced()) return;
  const ex=['DIN 933 M10x30 A4','Nord-Lock M16','DIN 985 M12 A2','ISO 4762 M8x25','04093307100030'];
  let i=0, c=0, dir=1;
  const tick=()=>{
    if(!document.body.contains(inp)) return;
    if(document.activeElement===inp || inp.value){ inp.setAttribute('placeholder',tr(base)); return; }
    const w=ex[i];
    c+=dir; inp.setAttribute('placeholder',w.slice(0,c)+(c<w.length||dir<0?'▍':''));
    let wait=dir>0?55:22;
    if(dir>0&&c>=w.length){ dir=-1; wait=1700; }
    else if(dir<0&&c<=0){ dir=1; i=(i+1)%ex.length; wait=350; }
    xTypeTimer=setTimeout(tick,wait);
  };
  xTypeTimer=setTimeout(tick,2600);
  inp._xBase=base;
}
function xStopTyping(){ clearTimeout(xTypeTimer); const inp=$('#hq'); if(inp&&inp._xBase) inp.setAttribute('placeholder',tr(inp._xBase)); }

/* Industry explorer: hover / focus swaps the detail panel */
function xIndustry(){
  const rows=$$('#main .xh-ind-row'); if(!rows.length) return;
  const pick=i=>{ rows.forEach(r=>r.classList.toggle('on',r.dataset.ind===String(i))); $$('#main .xh-ind-card').forEach(c=>c.hidden=c.dataset.indc!==String(i)); };
  rows.forEach(r=>{ const f=()=>{ if(window.innerWidth>900) pick(r.dataset.ind); }; r.addEventListener('mouseenter',f); r.addEventListener('focus',f); });
}

/* Drop zone: dropped files go straight into the special-product form */
function xDropZone(){
  const z=$('#xdrop'); if(!z) return;
  ['dragenter','dragover'].forEach(ev=>z.addEventListener(ev,e=>{ e.preventDefault(); z.classList.add('over'); }));
  z.addEventListener('dragleave',()=>z.classList.remove('over'));
  z.addEventListener('drop',e=>{
    e.preventDefault(); z.classList.remove('over');
    const ok=ACCEPT.split(','); FILES.f_special=FILES.f_special||[];
    [...(e.dataTransfer&&e.dataTransfer.files||[])].forEach(f=>{ const ext='.'+f.name.split('.').pop().toLowerCase(); if(ok.includes(ext)&&f.size<=20*1048576&&FILES.f_special.length<5) FILES.f_special.push({name:f.name,size:f.size}); });
    track('file_upload',{form:'f_special',count:FILES.f_special.length,source:'home_drop'});
    go('#/spesialprodukt');
    if(FILES.f_special.length) toast(FILES.f_special.length+' '+tr('filer lagt ved'));
  });
}

/* ---------- Design notes panel ---------- */
const XNOTE_PAGES = { home:['N1','N2','N3','N4','N5','N6','N7','N8','N9','N10','N11','N12','N13','N14','N15'],
  category:['C1','C2','C3','C4'], search:['S1','S2','C2','C4'], product:['P1','P2','P3','P4','P5','C4'], basket:['B1','B2','B3'],
  confirm:['F1'], quick:['Q1','Q2'], special:['E1','E2'], contact:['K1','E1'], account:['A1'], industry:['I1','I2'] };
function xNoteEl(k){
  if(k==='N2') return $('.hrow2 .search'); if(k==='N15') return $('.xh-hero');
  const sel=DESIGN_NOTES[k]&&DESIGN_NOTES[k][2];
  const el=sel?$(sel):$(`[data-note="${k}"]`);
  return el && el.getBoundingClientRect().width ? el : null;
}
renderFixPanel = function(){
  const ids=XNOTE_PAGES[CURRENT]||[];
  if(!ids.length){
    $('#fixbody').innerHTML=`<p class="xn-intro">All design notes are collected on one page.</p><p><a href="#/endringer">See all design notes</a></p>`;
    return;
  }
  $('#fixbody').innerHTML=`<p class="xn-intro">Why the page works the way it does. Click a note to jump to it.</p>
    <label class="check" style="margin-bottom:16px;color:var(--x-fg)"><input type="checkbox" id="xannot" ${document.body.classList.contains('x-annot')?'checked':''}> <span>Show markers on the page</span></label>
    ${ids.map(k=>`<button type="button" class="xn-item" data-note-go="${k}"><b><i>${k}</i>${esc(DESIGN_NOTES[k][0])}</b><span>${esc(DESIGN_NOTES[k][1])}</span></button>`).join('')}
    <p style="margin-top:16px"><a href="#/endringer">See all design notes</a></p>`;
};
document.addEventListener('change',e=>{ if(e.target.id==='xannot'){ document.body.classList.toggle('x-annot',e.target.checked); if(e.target.checked) xNotesLayerDraw(); else xNotesLayerClear(); } });
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-note-go]'); if(!b) return;
  const k=b.dataset.noteGo;
  const el=xNoteEl(k);
  if(!el) return;
  if(window.innerWidth<900) closeFixes();
  el.scrollIntoView({behavior:xReduced()?'auto':'smooth',block:'center'});
  el.classList.remove('xn-flash'); void el.offsetWidth; el.classList.add('xn-flash');
});
function xNotesLayerClear(){ const l=$('#xnlayer'); if(l) l.remove(); }
function xNotesLayerDraw(){
  xNotesLayerClear();
  const layer=document.createElement('div'); layer.id='xnlayer'; layer.className='xn-layer';
  (XNOTE_PAGES[CURRENT]||[]).forEach(k=>{
    const el=xNoteEl(k); if(!el||k==='N2'||k==='N15') return; el.dataset.note=k;
    const r=el.getBoundingClientRect(); if(!r.width) return;
    const x=r.left+window.scrollX, y=r.top+window.scrollY;
    const box=document.createElement('div'); box.className='xn-box'; Object.assign(box.style,{left:(x-4)+'px',top:(y-4)+'px',width:(r.width+8)+'px',height:(r.height+8)+'px'});
    const mk=document.createElement('button'); mk.type='button'; mk.className='xn-mk'; mk.textContent=el.dataset.note; mk.dataset.noteGo=el.dataset.note; mk.title=DESIGN_NOTES[el.dataset.note][0]; Object.assign(mk.style,{left:(x-10)+'px',top:(y-14)+'px'});
    mk.addEventListener('click',()=>{ openFixes(); const it=$(`.xn-item[data-note-go="${el.dataset.note}"]`); if(it){ it.scrollIntoView({block:'center'}); it.classList.add('xn-flash'); } });
    layer.append(box,mk);
  });
  document.body.appendChild(layer);
}
let xnT; window.addEventListener('resize',()=>{ if(!document.body.classList.contains('x-annot')) return; clearTimeout(xnT); xnT=setTimeout(xNotesLayerDraw,150); });

(function(){
  const add={'Forslag':'Suggestions','treff':'matches','Se alle':'See all','treff i tabell med filtre':'matches in a table with filters','La en tekniker finne produktet':'Let a technician find the product'};
  for(const [k,v] of Object.entries(add)){ if(!(k in EN)) EN[k]=v; EN_LC[k.toLowerCase()]=EN[k]; }
})();

xAfterRender();
