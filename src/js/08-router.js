
/* ===================== ROUTER ===================== */
let CURRENT='home', CURRENT_PATH='';
function resolve(){
  const h=decodeURIComponent(location.hash.slice(1))||'/';
  const [path,qs]=h.split('?'); const params=new URLSearchParams(qs||'');
  const parts=path.split('/').filter(Boolean);
  const a=parts[0]||'';
  if(!a) return ['home',viewHome(),params];
  if(a==='kategori') return ['category',viewCategory(parts[1]||'skruer-bolter'),params];
  if(a==='sok') return ['search',viewSearch(params.get('q')||''),params];
  if(a==='produkt') return ['product',viewProduct(parts[1]),params];
  if(a==='kurv') return ['basket',viewBasket(),params];
  if(a==='bekreftelse') return ['confirm',viewConfirm(),params];
  if(a==='spesialprodukt') return ['special',viewSpecial(params.get('spec')||''),params];
  if(a==='hurtigordre') return ['quick',viewQuick(),params];
  if(a==='konto') return ['account',viewAccount(parts[1]||''),params];
  if(a==='bransje') return ['industry',viewIndustry(parts[1]),params];
  if(a==='kontakt') return ['contact',viewContact(),params];
  if(a==='endringer') return ['fixes',viewFixes(),params];
  return ['home',viewHome(),params];
}
function render(keepScroll){
  const y=window.scrollY;
  const [page,html,params]=resolve();
  const pathNow=location.hash;
  CURRENT=page;
  if(page==='home') document.title='Industrisalg AS Sandnes | Festemateriell på lager siden 1953';
  $('#main').innerHTML=html;
  // mobile bar on product
  const mbar=$('#mbar');
  if(page==='product'){ const sku=location.hash.split('/')[2]; const p=BY_SKU[(sku||'').split('?')[0]]; if(p){ mbar.innerHTML=mobileBarFor(p); mbar.hidden=false; mbar.setAttribute('data-fix','P7'); document.body.classList.add('has-mbar'); } }
  else { mbar.hidden=true; mbar.innerHTML=''; document.body.classList.remove('has-mbar'); }
  updateHeader();
  translateDom(document.body); setTitle();
  if(keepScroll && pathNow===CURRENT_PATH) window.scrollTo(0,y);
  else { window.scrollTo(0,0); $('#main').focus({preventScroll:true}); }
  CURRENT_PATH=pathNow;
  const s=params&&params.get('s'); if(s){ const el=document.getElementById(s); if(el) el.scrollIntoView(); }
  $('#mainnav').classList.remove('open'); $('#menuToggle').setAttribute('aria-expanded','false');
  if($('#fixpanel').classList.contains('open')) renderFixPanel();
}
function go(hash){ if(location.hash===hash) render(); else location.hash=hash; }
window.addEventListener('hashchange',()=>render());

/* ===================== HEADER / NAV ===================== */
function renderNav(){
  $('#navlist').innerHTML = CATEGORIES.map(c=>`<li class="has-dd" ${c.slug==='muttere'?'data-fix="T4"':''}><a href="#/kategori/${c.slug}">${esc(c.name)}</a>${megaMenu(c)}</li>`).join('');
}
function fitNav(){
  const h=$('.hdr'), nav=$('#mainnav'), ul=$('#navlist'); if(!h||!ul) return;
  const levels=[[],['c1'],['c1','c2'],['c1','c2','c3'],['c1','c2','c3','stack']];
  for(const lv of levels){
    h.classList.remove('c1','c2','c3','stack','collapsed'); lv.forEach(c=>h.classList.add(c));
    if(lv.includes('stack')) break;
    if(window.innerWidth>=900 && ul.scrollWidth<=nav.clientWidth+1) break;
  }
}
let fitT; window.addEventListener('resize',()=>{ clearTimeout(fitT); fitT=setTimeout(fitNav,80); });
function updateHeader(){
  $('#basketLbl').textContent=basketName();
  $('#basketCount').textContent=basketCount();
  $('#basketBtn').setAttribute('aria-label',basketName()+', '+basketCount()+' linjer');
  $('#acctLbl').textContent=S.loggedIn?'Min konto':'Logg inn';
  $('#asGuest').setAttribute('aria-pressed',String(!S.loggedIn));
  $('#asCustomer').setAttribute('aria-pressed',String(S.loggedIn));
  if(typeof translateDom==='function') translateDom($('.hdr'));
  if(typeof renderMini==='function') renderMini();
}
function setLogin(v){ S.loggedIn=v; UI.forceQuote=false; save(); track(v?'login':'logout'); render(true); toast(v?'Innlogget som Eksempel Verksted AS':'Du er logget ut'); }

/* ===================== FIX PANEL ===================== */
function renderFixPanel(){
  const ids=PAGE_FIXES[CURRENT]||[];
  $('#fixbody').innerHTML = `<label class="check" style="margin-bottom:14px"><input type="checkbox" id="annot" ${document.body.classList.contains('annotate')?'checked':''}> <span>Mark the changes on the page</span></label>
    ${ids.length?ids.map(k=>`<div class="fixitem"><b>${k} ${esc(FIXES[k][0])}</b>${FIXES[k][1]?'<div class="small">'+esc(FIXES[k][1])+'</div>':''}</div>`).join(''):'<p class="muted">This page lists all fixes.</p>'}
    <p style="margin-top:16px"><a href="#/endringer">See all fixes</a></p>
    <h3 style="font-size:1rem;margin-top:20px">dataLayer events (M1)</h3><div class="evlog">${EVENTS.length?EVENTS.map(esc).join('<br>'):'No events yet. Search, filter or add a product.'}</div>`;
}
function openFixes(){ renderFixPanel(); const p=$('#fixpanel'); p.classList.add('open'); p.setAttribute('aria-hidden','false'); }
function closeFixes(){ const p=$('#fixpanel'); p.classList.remove('open'); p.setAttribute('aria-hidden','true'); }

/* ===================== DRAWER & BASKET OPS ===================== */
function openDrawer(html){ const d=$('#drawer'); d.innerHTML=html; translateDom(d); d.classList.add('open'); d.setAttribute('aria-hidden','false'); $('#scrim').classList.add('on'); const f=d.querySelector('button,a'); if(f) f.focus(); }
function closeDrawer(){ const d=$('#drawer'); d.classList.remove('open'); d.setAttribute('aria-hidden','true'); $('#scrim').classList.remove('on'); }
function addLines(lines, source){
  lines=lines.filter(l=>BY_SKU[l.sku]&&l.qty>0);
  if(!lines.length) return;
  lines.forEach(l=>{ const cert=l.cert||'2.1'; const ex=S.basket.find(b=>b.sku===l.sku&&b.cert===cert); if(ex) ex.qty+=l.qty; else S.basket.push({sku:l.sku,qty:l.qty,cert}); });
  save(); updateHeader();
  track(S.loggedIn?'add_to_cart':'add_to_quote',{source:source||'product',items:lines.map(l=>({item_id:l.sku,quantity:l.qty,cert:l.cert||'2.1'}))});
  const into=S.loggedIn?'bestillingen':'forespørselen';
  const skus=lines.map(l=>l.sku);
  if(document.body.classList.contains('has-mc')){
    $$('#minicart .mc-item').forEach((li,i)=>{ if(skus.includes(S.basket[i]&&S.basket[i].sku)){ li.classList.remove('mc-flash'); void li.offsetWidth; li.classList.add('mc-flash'); } });
    const first=$$('#minicart .mc-item.mc-flash')[0]; if(first) first.scrollIntoView({block:'nearest',behavior:'smooth'});
    toast(lines.length===1?`Lagt til i ${into}: ${BY_SKU[lines[0].sku].label}, ${fmtInt(lines[0].qty)} stk`:`${lines.length} varer lagt til i ${into}`);
  } else {
    toastLink(lines.length===1?`Lagt til i ${into}: ${fmtInt(lines[0].qty)} stk`:`${lines.length} varer lagt til i ${into}`, '#/kurv', S.loggedIn?'Gå til bestilling':'Gå til forespørsel');
  }
}
function basketTotalsInPlace(i){
  const l=S.basket[i], p=BY_SKU[l.sku], el=$('#bs'+i); if(el) el.textContent=fmtNOK(p.price*l.qty);
  const t=$('#bsum'); if(t) t.textContent=fmtNOK(S.basket.reduce((a,x)=>a+BY_SKU[x.sku].price*x.qty,0));
}
function readQty(sel){ const el=sel?$(sel):null; const v=el?parseInt(el.value,10):1; return v>0?v:1; }
function readCert(name){ const r=name?$(`input[name="${name}"]:checked`):null; return r?r.value:'2.1'; }
function newRef(prefix){ return prefix+'-26-'+String(Math.floor(10000+Math.random()*89999)); }

/* ===================== FORMS ===================== */
function fieldErr(el,msg){ const f=el.closest('.field')||el.parentElement; const e=document.createElement('div'); e.className='err'; e.textContent=tr(msg); f.appendChild(e); el.setAttribute('aria-invalid','true'); }
function validateContact(form){
  const v=n=>(form.elements[n]&&form.elements[n].value||'').trim();
  const errs=[];
  if(form.elements.name&&!v('name')) errs.push([form.elements.name,'Skriv inn navnet ditt.']);
  if(form.elements.company&&!v('company')) errs.push([form.elements.company,'Skriv inn firmanavn.']);
  if(form.elements.email&&form.elements.phone){
    if(!v('email')&&!v('phone')) errs.push([form.elements.email,'Oppgi e-post eller telefon.']);
    else if(v('email')&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('email'))) errs.push([form.elements.email,'E-postadressen ser ikke riktig ut.']);
  }
  if(form.elements.msg&&form.dataset.form==='technician'&&!v('msg')) errs.push([form.elements.msg,'Skriv spørsmålet ditt.']);
  if(form.elements.what&&!v('what')) errs.push([form.elements.what,'Beskriv hva du trenger.']);
  if(form.elements.consent&&!form.elements.consent.checked) errs.push([form.elements.consent,'Du må godta personvernerklæringen.']);
  return errs;
}
document.addEventListener('submit',e=>{
  const form=e.target.closest('form[data-form]'); if(!form) return;
  e.preventDefault();
  $$('.err',form).forEach(x=>x.remove()); $$('[aria-invalid]',form).forEach(x=>x.removeAttribute('aria-invalid'));
  const type=form.dataset.form;
  if(type==='newlist'){ const n=form.elements.name.value.trim(); if(!n){fieldErr(form.elements.name,'Gi listen et navn.');return;} S.lists.push({id:'l'+Date.now(),name:n,items:[]}); save(); render(true); toast('Listen «'+n+'» er opprettet'); return; }
  if(type==='notify'){ const m=form.elements.email.value.trim(); if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)){fieldErr(form.elements.email,'Skriv inn en gyldig e-postadresse.');return;} track('back_in_stock_signup',{item_id:form.dataset.sku}); form.outerHTML='<p class="ok" id="notifyok"><b>Takk.</b> Vi sender e-post når varen er på lager igjen.</p>'; translateDom($('#notifyok')); return; }
  if(type!=='order'){ const errs=validateContact(form); if(errs.length){ errs.forEach(([el,m])=>fieldErr(el,m)); errs[0][0].focus(); track('form_error',{form:type,errors:errs.length}); return; } }
  const files=(FILES[form.id]||[]).length;
  const prefix={quote:'T',order:'O',special:'S',technician:'S',contact:'K'}[type]||'K';
  S.last={type,ref:newRef(prefix)};
  if(type==='quote'||type==='order'){ track(type==='order'?'purchase':'generate_lead',{form:type,lines:S.basket.length,files,transaction_id:S.last.ref}); S.basket=[]; UI.forceQuote=false; }
  else track('generate_lead',{form:type,files,item_id:form.dataset.sku||undefined});
  FILES[form.id]=[]; save(); go('#/bekreftelse');
});

/* ===================== CLICK ACTIONS ===================== */
const ACT = {
  focussearch(){ const h=$('#hq'); if(h){ h.focus(); return; } window.scrollTo(0,0); $('#q').focus(); },
  herosearch(){ const q=$('#hq').value.trim(); if(!q){ $('#hq').focus(); return; } track('search',{search_term:q,source:'hero'}); go('#/sok?q='+encodeURIComponent(q)); },
  inc(t){ const i=t.parentElement.querySelector('input'); i.value=(parseInt(i.value,10)||0)+1; i.dispatchEvent(new Event('input',{bubbles:true})); },
  dec(t){ const i=t.parentElement.querySelector('input'); i.value=Math.max(1,(parseInt(i.value,10)||1)-1); i.dispatchEvent(new Event('input',{bubbles:true})); },
  add(t){ addLines([{sku:t.dataset.sku,qty:readQty(t.dataset.qty),cert:readCert(t.dataset.cert)}], CURRENT); },
  addjoint(t){
    const lines=$$('.joint .jrow').map(r=>{const c=r.querySelector('[data-jsku]'); return c.checked?{sku:c.dataset.jsku,qty:parseInt(r.querySelector('.qty input').value,10)||1,cert:readCert('cert')}:null;}).filter(Boolean);
    if(!lines.length){ toast('Velg minst én del'); return; }
    addLines(lines,'complete_the_joint');
  },
  quoteinstead(t){ ACT.add(t); UI.forceQuote=true; },
  scrollto(t,e){ e.preventDefault(); const el=$(t.dataset.target); if(el){ el.scrollIntoView({behavior:'smooth'}); const f=el.querySelector('textarea,input'); if(f) setTimeout(()=>f.focus({preventScroll:true}),400);} },
  savetolist(t){
    const sku=t.dataset.sku, qty=readQty(t.dataset.qty);
    if(!S.loggedIn){ openDrawer(`<header><strong>Lagre i liste</strong><button type="button" class="btn btn-sm btn-ghost" data-act="closedrawer">Lukk</button></header><div class="body" data-fix="R6"><p>Lister lagres på bedriftskontoen, slik at hele teamet kan bestille fra dem.</p><button type="button" class="btn btn-primary" data-act="login">Logg inn (demo)</button></div>`); return; }
    openDrawer(`<header data-fix="P6"><strong>Lagre i liste</strong><button type="button" class="btn btn-sm btn-ghost" data-act="closedrawer">Lukk</button></header><div class="body"><p><b>${esc(BY_SKU[sku].label)}</b>, ${fmtInt(qty)} stk</p>${S.lists.map(l=>`<button type="button" class="btn btn-ghost" style="width:100%;margin-bottom:8px;justify-content:space-between" data-act="pickList" data-id="${l.id}" data-sku="${sku}" data-q="${qty}">${esc(l.name)} <span class="small">${l.items.length} varer</span></button>`).join('')}
      <label for="dl_new" style="margin-top:12px">Eller ny liste</label><div class="buyrow"><input type="text" id="dl_new" placeholder="Navn på liste" style="flex:1"><button type="button" class="btn btn-brand" data-act="pickList" data-id="new" data-sku="${sku}" data-q="${qty}">Lagre</button></div></div>`);
  },
  pickList(t){
    let l; if(t.dataset.id==='new'){ const n=$('#dl_new').value.trim(); if(!n){ $('#dl_new').focus(); return; } l={id:'l'+Date.now(),name:n,items:[]}; S.lists.push(l); } else l=S.lists.find(x=>x.id===t.dataset.id);
    const ex=l.items.find(i=>i.sku===t.dataset.sku); if(ex) ex.qty+= +t.dataset.q; else l.items.push({sku:t.dataset.sku,qty:+t.dataset.q});
    save(); closeDrawer(); track('add_to_list',{list:l.name,item_id:t.dataset.sku}); toast('Lagret i «'+l.name+'»');
  },
  closedrawer(){ closeDrawer(); },
  'closedrawer-go'(){ closeDrawer(); },
  openfilters(){ UI.sheet=true; $('#filters').classList.add('open'); $('#scrim').classList.add('on'); },
  closefilters(){ UI.sheet=false; $('#filters').classList.remove('open'); $('#scrim').classList.remove('on'); },
  resetfilters(){ UI.f=freshFilters(); render(true); },
  clrf(t){ const k=t.dataset.k, v=t.dataset.v; const f=UI.f;
    if(k==='stock') f.stock=false; else if(k==='len'){f.lmin='';f.lmax='';} else f[k]=f[k].filter(x=>String(x)!==v);
    f.page=1; render(true); },
  page(t){ UI.f.page=+t.dataset.p; render(true); const r=$('#results'); if(r) r.scrollIntoView(); },
  pickfile(t){ const inp=$(`input[data-filefor="${t.dataset.formId}"]`); if(inp) inp.click(); },
  rmfile(t){ FILES[t.dataset.formId].splice(+t.dataset.i,1); $('#fl_'+t.dataset.formId).innerHTML=fileListHtml(t.dataset.formId); translateDom($('#fl_'+t.dataset.formId)); },
  rmline(t){ S.basket.splice(+t.dataset.i,1); save(); render(true); },
  clearbasket(){ S.basket=[]; save(); render(true); },
  basket2list(){
    if(!S.loggedIn){ toast('Logg inn for å lagre lister'); return; }
    const name='Kurv '+new Date().toLocaleDateString('nb-NO'); S.lists.push({id:'l'+Date.now(),name,items:S.basket.map(b=>({sku:b.sku,qty:b.qty}))}); save(); toast('Lagret som «'+name+'» under Mine lister');
  },
  basketquote(){ UI.forceQuote=true; render(true); },
  backtoorder(){ UI.forceQuote=false; render(true); },
  login(){ setLogin(true); if(CURRENT!=='account') closeDrawer(); },
  logout(t,e){ e.preventDefault(); setLogin(false); },
  reorder(t){ const o=ORDERS.find(x=>x.id===t.dataset.id); addLines(o.lines.map(([p,q])=>({sku:p.sku,qty:q})),'reorder'); },
  certdl(t){ track('certificate_download',{order:t.dataset.id}); toast('Sertifikat for ordre '+t.dataset.id+' lastes ned (eksempel)'); },
  acceptquote(t){ S.quotes[t.dataset.id]='accepted'; S.last={type:'quoteaccept',ref:newRef('O')}; save(); track('quote_accepted',{quote:t.dataset.id}); go('#/bekreftelse'); },
  quote2basket(t){ const q=QUOTES.find(x=>x.id===t.dataset.id); addLines(q.lines.map(([p,n])=>({sku:p.sku,qty:n})),'quote'); },
  listadd(t){ const l=S.lists.find(x=>x.id===t.dataset.id); addLines(l.items.map(i=>({sku:i.sku,qty:i.qty})),'list'); },
  listrm(t){ const l=S.lists.find(x=>x.id===t.dataset.id); l.items.splice(+t.dataset.i,1); save(); render(true); },
  listdel(t){ S.lists=S.lists.filter(x=>x.id!==t.dataset.id); save(); render(true); },
  qoexample(){ UI.qoText=QO_EXAMPLE; $('#qotext').value=QO_EXAMPLE; ACT.qoparse(); },
  qoparse(){ UI.qoText=$('#qotext').value; if(!UI.qoText.trim()){ toast('Lim inn minst én linje'); return; } UI.qo=parseOrderLines(UI.qoText); track('quick_order_parsed',{lines:UI.qo.length,matched:UI.qo.filter(r=>r.pick).length}); render(true); },
  qofile(){ $('#qoFile').click(); },
  qoadd(){ const lines=UI.qo.filter(r=>r.pick).map(r=>({sku:r.pick,qty:r.qty})); addLines(lines,'quick_order'); UI.qo=null; UI.qoText=''; }
};
if(typeof ACT_EXTRA!=='undefined') Object.assign(ACT, ACT_EXTRA);
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-act]'); if(!t) return;
  const fn=ACT[t.dataset.act]; if(!fn) return;
  if(t.tagName==='A' && t.dataset.act!=='closedrawer-go' && t.dataset.act!=='scrollto' && t.dataset.act!=='logout') e.preventDefault();
  fn(t,e);
});
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&e.target.id==='hq'){ e.preventDefault(); ACT.herosearch(); return; }
  if((e.key==='Enter'||e.key===' ')&&e.target.matches('.drop')){ e.preventDefault(); ACT.pickfile(e.target); }
  if(e.key==='Escape'){ closeDrawer(); closeFixes(); if(UI.sheet) ACT.closefilters(); hideSuggest(); }
});
$('#scrim').addEventListener('click',()=>{ closeDrawer(); if(UI.sheet) ACT.closefilters(); });

/* ===================== CHANGE / INPUT ===================== */
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.matches('[data-filter]')){
    const k=t.dataset.filter, f=UI.f;
    if(k==='stock') f.stock=t.checked;
    else if(k==='sort') f.sort=t.value;
    else if(k==='size') f.size=+t.value;
    else if(k==='lmin'||k==='lmax') f[k]=t.value;
    else { const val = k==='d'?+t.value:t.value; f[k]=t.checked?[...f[k],val]:f[k].filter(x=>x!==val); }
    f.page=1; track('filter_used',{filter:k,value:t.type==='checkbox'?(t.checked?t.value:'off'):t.value}); render(true);
    if(UI.sheet){ const fl=$('#filters'); if(fl){ fl.classList.add('open'); $('#scrim').classList.add('on'); } }
    return;
  }
  if(t.matches('[data-bqty]')){ const i=+t.dataset.bqty, v=parseInt(t.value,10); if(v>0){ S.basket[i].qty=v; save(); basketTotalsInPlace(i); updateHeader(); track('basket_qty_change',{line:i,qty:v}); } else t.value=S.basket[i].qty; return; }
  if(t.matches('[data-bcert]')){ S.basket[+t.dataset.bcert].cert=t.value; save(); return; }
  if(t.matches('[data-qopick]')){ UI.qo[+t.dataset.qopick].pick=t.value||null; render(true); return; }
  if(t.matches('[data-qoqty]')){ UI.qo[+t.dataset.qoqty].qty=parseInt(t.value,10)||1; return; }
  if(t.id==='annot'){ document.body.classList.toggle('annotate',t.checked); return; }
  if(t.id==='qoFile'&&t.files[0]){ const r=new FileReader(); r.onload=()=>{ $('#qotext').value=String(r.result).replace(/,/g,';'); ACT.qoparse(); }; r.readAsText(t.files[0]); return; }
  if(t.matches('input[type=file][data-filefor]')){
    const id=t.dataset.filefor; FILES[id]=FILES[id]||[];
    const ok=ACCEPT.split(','); const rejected=[];
    [...t.files].forEach(f=>{ const ext='.'+f.name.split('.').pop().toLowerCase();
      if(!ok.includes(ext)) rejected.push(f.name+' (filtypen støttes ikke)');
      else if(f.size>20*1048576) rejected.push(f.name+' (større enn 20 MB)');
      else if(FILES[id].length>=5) rejected.push(f.name+' (maks 5 filer)');
      else FILES[id].push({name:f.name,size:f.size}); });
    $('#fl_'+id).innerHTML=fileListHtml(id); translateDom($('#fl_'+id));
    if(rejected.length) toast('Ikke lagt ved: '+rejected.join(', '));
    else track('file_upload',{form:id,count:FILES[id].length});
    t.value='';
  }
});
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.id==='pq'||t.id==='mq'){ const v=t.value; const other=$(t.id==='pq'?'#mq':'#pq'); if(other) other.value=v; $$('.joint .jrow .qty input').forEach(i=>i.value=v); }
});
document.addEventListener('dragover',e=>{ const d=e.target.closest&&e.target.closest('.drop'); if(d){ e.preventDefault(); d.classList.add('over'); } });
document.addEventListener('dragleave',e=>{ const d=e.target.closest&&e.target.closest('.drop'); if(d) d.classList.remove('over'); });
document.addEventListener('drop',e=>{ const d=e.target.closest&&e.target.closest('.drop'); if(!d) return; e.preventDefault(); d.classList.remove('over');
  const inp=$(`input[data-filefor="${d.dataset.formId}"]`); if(!inp) return;
  try{ inp.files=e.dataTransfer.files; inp.dispatchEvent(new Event('change',{bubbles:true})); }catch(err){ toast('Bruk «klikk for å velge» i denne nettleseren'); } });

/* ===================== SEARCH BOX ===================== */
let sugIndex=-1;
function hideSuggest(){ const s=$('#suggest'); s.hidden=true; s.innerHTML=''; sugIndex=-1; }
function showSuggest(){
  const q=$('#q').value.trim(); const box=$('#suggest');
  if(q.length<2){ hideSuggest(); return; }
  const res=searchProducts(q); const desc=describeQuery(q);
  if(!res.length){ box.innerHTML=`<div class="hint">Ingen treff på «${esc(q)}».</div><a href="#/spesialprodukt?spec=${encodeURIComponent(q)}" data-sug><span>La en tekniker finne produktet</span><span class="muted small">Send spesifikasjon</span></a>`; translateDom(box); box.hidden=false; return; }
  box.innerHTML=(desc?`<div class="hint">Tolket som: ${esc(desc)}</div>`:'')+res.slice(0,6).map(p=>`<a href="${productUrl(p)}" data-sug><span class="pn">${thumb(p)}<span>${esc(p.label)}<br><span class="small muted">${p.sku}</span></span></span><span class="small">${p.stock?'<span class="stock-in">På lager</span>':'<span class="stock-out">Bestillingsvare</span>'}</span></a>`).join('')
    +`<a href="#/sok?q=${encodeURIComponent(q)}" data-sug><b>Se alle ${fmtInt(res.length)} treff</b><span class="small muted">i tabell med filtre</span></a>`;
  translateDom(box); box.hidden=false;
}
let sugT;
$('#q').addEventListener('input',()=>{ clearTimeout(sugT); sugT=setTimeout(showSuggest,120); });
$('#q').addEventListener('focus',showSuggest);
$('#q').addEventListener('blur',()=>setTimeout(hideSuggest,180));
$('#q').addEventListener('keydown',e=>{
  const items=$$('#suggest [data-sug]');
  if(e.key==='ArrowDown'&&items.length){ e.preventDefault(); sugIndex=(sugIndex+1)%items.length; items.forEach((a,i)=>a.classList.toggle('active',i===sugIndex)); }
  else if(e.key==='ArrowUp'&&items.length){ e.preventDefault(); sugIndex=(sugIndex-1+items.length)%items.length; items.forEach((a,i)=>a.classList.toggle('active',i===sugIndex)); }
  else if(e.key==='Enter'){ e.preventDefault(); if(sugIndex>=0&&items[sugIndex]){ location.hash=items[sugIndex].getAttribute('href'); } else doSearch(); hideSuggest(); $('#q').blur(); }
});
function doSearch(){ const q=$('#q').value.trim(); if(!q) return; track('search',{search_term:q}); go('#/sok?q='+encodeURIComponent(q)); }
$('#qgo').addEventListener('click',()=>{ doSearch(); hideSuggest(); });
$('#suggest').addEventListener('mousedown',e=>e.preventDefault());
$('#suggest').addEventListener('click',e=>{ if(e.target.closest('[data-sug]')) setTimeout(hideSuggest,0); });

/* ===================== INIT ===================== */
$('#asGuest').addEventListener('click',()=>{ if(S.loggedIn) setLogin(false); });
$('#asCustomer').addEventListener('click',()=>{ if(!S.loggedIn) setLogin(true); });
$('#openFixes').addEventListener('click',openFixes);
$('#closeFixes').addEventListener('click',closeFixes);
$('#menuToggle').addEventListener('click',()=>{ const n=$('#mainnav'); const o=!n.classList.contains('open'); n.classList.toggle('open',o); $('#menuToggle').setAttribute('aria-expanded',String(o)); });
document.addEventListener('click',e=>{ const a=e.target.closest('a[href^="tel:"]'); if(a) track('phone_click',{number:a.getAttribute('href').slice(4)}); });
$$('[data-lang]').forEach(b=>b.addEventListener('click',()=>{ if(LANG!==b.dataset.lang) setLang(b.dataset.lang); }));
renderNav();
render();
fitNav(); if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fitNav);
if(LANG==='en') setLang('en');
