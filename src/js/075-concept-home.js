/* =====================================================================
   INDUSTRISALG 2.0 CONCEPT · Homepage
   Loaded after the original modules and before the router, so this
   viewHome() replaces the original one. All data comes from the same
   catalogue (PRODUCTS, STANDARDS, CATEGORIES, INDUSTRIES, CATNAV).
   Media (film, photos, badges) is the client's own, from industrisalg.no.
   ===================================================================== */

document.documentElement.classList.add('x-anim');

const XMEDIA = 'https://industrisalg.no';
const XM = {
  video: XMEDIA + '/images/uploaded/Industrisalg_01.mp4',
  poster: XMEDIA + '/images/uploaded/homepage-hero-poster.png',
  iso: XMEDIA + '/images/iso-verify-badge.png',
  magnet: XMEDIA + '/uploaded/Magnet-Registered-badge-Grey.png',
  special: XMEDIA + '/Themes/IndsutrySalg/Content/images/special-requirements.webp',
  cats: {
    'skruer-bolter': '/images/thumbs/0030822_screws-bolts_450.png',
    'skiver': '/images/thumbs/0030818_washers_450.png',
    'muttere': '/images/thumbs/0030819_nuts_450.png',
    'tommegjenger': '/images/thumbs/0030824_imperial-pitch_450.png',
    'gjengestag': '/images/thumbs/0042599_hot-dip-galvanized-stud-bolt-with-2-nuts-m-12-x-90_450.webp',
    'innfesting': '/images/thumbs/0041546_fixings_450.png',
    'nagler': '/images/thumbs/0042756_rivets_450.png',
    'annet': '/images/thumbs/0030820_others_450.png'
  },
  articles: [
    ['/uploaded/_S1A0895.jpg', 'Klemkraft, friksjon og moment: derfor holder ikke alltid momenttabellen', 'Montering'],
    ['/uploaded/_S1A0824.jpg', 'Hvorfor bolter løsner: setting og rotasjonsløsning (eksempler fra praksis)', 'Sikring'],
    ['/uploaded/_S1A0849.jpg', 'ANSI/ASME vs ISO/DIN: hva betyr forskjellen for vedlikehold, lager og nedetidsrisiko?', 'Standarder']
  ]
};

const XI = {
  arr: '<svg class="x-arr" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg>',
  arrS: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg>',
  check: '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  cross: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M7 7l10 10M17 7 7 17"/></svg>',
  search: '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M10.5 3.5a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM16 16l4.5 4.5"/></svg>',
  plus: '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>',
  table: '<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9.5h18M3 14.5h18M9 9.5V20"/></g></svg>',
  draw: '<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/></g></svg>',
  list: '<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M9 6h11M9 12h11M9 18h6"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/></g></svg>',
  upload: '<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 18v-6M9.5 14.5 12 12l2.5 2.5"/></g></svg>',
  rotate: '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4"/></svg>'
};

/* Opening hours: Mon to Fri 07:00 to 16:00, Norwegian time */
function xOpenNow(){
  try{
    const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Oslo',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
    const g=t=>(parts.find(p=>p.type===t)||{}).value;
    const wd=g('weekday'), h=+g('hour'), m=+g('minute');
    return !['Sat','Sun'].includes(wd) && (h*60+m)>=420 && (h*60+m)<960;
  }catch(e){ return true; }
}
function xStatusHtml(cls){
  return xOpenNow()
    ? `<p class="xh-status ${cls||''}"><span class="xh-dot" aria-hidden="true"></span><span>Åpent nå · svar innen 20 minutter</span></p>`
    : `<a class="xh-status off ${cls||''}" href="tel:47709806"><span class="xh-dot" aria-hidden="true"></span><span>Stengt nå · vakttelefon 477 09 806</span></a>`;
}
function xCatCount(slug){ const g=(typeof CATNAV!=='undefined'&&CATNAV[slug])||[]; return g.reduce((a,x)=>a+(+x[2]||0),0); }
function xImg(src,alt,cls){ return `<img src="${src}" alt="${esc(alt||'')}" ${cls?`class="${cls}"`:''} loading="lazy" decoding="async" onerror="this.parentNode.classList.add('noimg');this.remove()">`; }

const X3D_STDS=['933','931','912','934','985','125','NL'];
function x3dInfo(k){
  const s=STANDARDS[k], items=PRODUCTS.filter(p=>p.std===k), stock=items.filter(p=>p.stock>0).length;
  return `<div><h3>${esc(s.din)} · ${esc(s.name)}</h3><p>${esc(s.desc)}</p>
    <ul class="xh-3d-chips">${s.iso?`<li>${esc(s.iso)}</li>`:''}<li>${items.length} varianter</li><li class="ok">${stock} på lager nå</li><li>${s.mats.map(m=>MATERIALS[m].code).join(' · ')}</li></ul></div>
    <a class="x-btn x-btn-blue" href="#/kategori/${s.slug}">Se alle størrelser ${XI.arr}</a>`;
}

function viewHome(){
  const lg=S.loggedIn;
  const stdBtns=X3D_STDS.map((k,i)=>{ const s=STANDARDS[k]; const n=PRODUCTS.filter(p=>p.std===k).length;
    return `<li><button type="button" data-x3d="${k}" aria-pressed="${i===0}"><b>${esc(s.din)}</b><span>${esc(s.name)}</span><small>${n}</small></button></li>`; }).join('');

  const cats=CATEGORIES.map((c,i)=>{ const n=xCatCount(c.slug); const src=XM.cats[c.slug];
    return `<a class="xh-cat" href="#/kategori/${c.slug}" data-rv style="--rv:${i%4}">
      <span class="xh-cat-img">${CAT_EMBED[c.slug]?`<img class="xh-cat-emb" src="${CAT_EMBED[c.slug]}" alt="${esc(c.name)}" loading="lazy">`:src?xImg(XMEDIA+src,c.name):''}${catIcon(c)}</span>
      <span class="xh-cat-meta"><span><strong>${esc(c.name)}</strong>${n?`<small>${fmtInt(n)} artikler</small>`:''}</span><span class="x-arrow-c">${XI.arrS}</span></span></a>`; }).join('');

  const qo=parseOrderLines(QO_EXAMPLE);
  const qoOk=qo.filter(r=>r.total===1).length, qoMulti=qo.filter(r=>r.total>1).length, qoNone=qo.filter(r=>!r.total).length;
  const qoRows=qo.map((r,i)=>{
    let cls,res;
    if(r.total===1){ cls='ok'; res=`<b>Funnet</b><em>${esc(BY_SKU[r.pick].label)}</em>`; }
    else if(r.total>1){ cls='multi'; res=`<b>${r.total} treff</b><em>Velg variant</em>`; }
    else { cls='none'; res=`<b>Tekniker</b><em>Sendes til tekniker</em>`; }
    return `<li style="--i:${i}"><code>${esc(r.line)}</code><span class="res ${cls}">${res}</span></li>`; }).join('');

  const last=ORDERS[0];
  const welcome = lg ? `<div class="xh-welcome" data-note="N9"><h3>Velkommen tilbake, Eksempel Verksted AS</h3><p class="muted" style="margin:0;font-size:.9rem">Siste ordre ${esc(last.id)} · ${esc(last.date)} · ${esc(last.ref)}</p>
      <ul>${last.lines.map(([p,q])=>`<li>${fmtInt(q)} × ${esc(p.label)}</li>`).join('')}</ul>
      <button type="button" class="x-btn x-btn-blue x-btn-sm" data-act="reorder" data-id="${last.id}">Bestill på nytt ${XI.arrS}</button></div>` : '';

  const inds=INDUSTRIES.map((x,i)=>`<li><a class="xh-ind-row ${i===0?'on':''}" href="#/bransje/${x.slug}" data-ind="${i}"><i>${String(i+1).padStart(2,'0')}</i><span><strong>${esc(x.name)}</strong><small>${esc(x.intro)}</small></span>${XI.arrS}</a></li>`).join('');
  const indCards=INDUSTRIES.map((x,i)=>{ const s0=STANDARDS[x.stds[0]];
    return `<div class="xh-ind-card" data-indc="${i}" ${i?'hidden':''}>
      ${IND_PHOTO[x.slug]?`<figure class="xh-ind-photo"><img src="${IND_PHOTO[x.slug]}" alt="${esc(x.name)}" loading="lazy" decoding="async" width="480" height="360"></figure>`:`<div class="xh-ind-art" aria-hidden="true">${drawing(s0.kind,x.stds[0],true)}</div>`}
      <p class="x-eyebrow">Bransje ${String(i+1).padStart(2,'0')} / ${INDUSTRIES.length}</p>
      <h3>${esc(x.name)}</h3><p>${esc(x.intro)}</p>
      <dl class="xh-ind-spec"><dt>Fokus</dt><dd>${esc(x.focus)}</dd><dt>Materiale</dt><dd>${esc(MATERIALS[x.mat].name)}</dd></dl>
      <p class="xh-ind-plbl">Mest brukt</p>
      <ul class="xh-ind-prods">${x.stds.map(k=>{ const st=STANDARDS[k], ph=STD_PHOTO[k]||(st.kind==='bolt'?'bolt_black':''); return `<li><a href="#/kategori/${st.slug}"><span class="xh-ind-pimg">${STD_RENDER[k]?`<img src="${STD_RENDER[k]}" alt="" loading="lazy">`:ph?photo(ph):drawing(st.kind,k,false)}</span><span class="xh-ind-pt"><b>${esc(st.din)}</b><small>${esc(st.name)}</small></span></a></li>`; }).join('')}</ul>
      <div class="xh-ind-acts"><a class="x-btn x-btn-blue" href="#/bransje/${x.slug}">Se bransjeløsningen ${XI.arr}</a><a class="x-btn x-btn-line" href="#/spesialprodukt">Send forespørsel</a></div></div>`; }).join('');

  const cmp=[
    ['Etablert og erfaren','Familiedrevet siden 1953, 70+ år med festemateriell','Ofte generalister uten samme dybdekunnskap'],
    ['Lager på hylla','13 000+ artikler på lager i Sandnes','Venter på bestilling fra grossist eller utlandet'],
    ['Kjøp akkurat det du trenger','Vi bryter pakker, kjøp ned til enkeltskruen','Tvunget til minimumskvanta og fulle esker'],
    ['Tilgjengelighet','Vakttelefon utenom kontortid','Stengt etter 16:00'],
    ['Hurtig respons','Svar innen 20 minutter i åpningstiden, fullstendig tilbud innen 24 timer','Svar innen 48 timer'],
    ['Kvalitetssystem','ISO 9001:2015-sertifisert og Magnet JQS-registrert','Ofte ad hoc-kontroll uten sporbarhet'],
    ['Materialsertifikater','2.1 per ordre, 3.1 på det meste av lageret','Ikke alltid mulig å fremskaffe']
  ].map(r=>`<div class="xh-cmp-row"><div class="k">${esc(r[0])}</div><div class="us">${XI.check}<span>${esc(r[1])}</span></div><div class="them">${XI.cross}<span>${esc(r[2])}</span></div></div>`).join('');

  const arts=XM.articles.map(([src,title,tag],i)=>`<a class="xh-art" href="#/" data-rv style="--rv:${i}"><span class="xh-art-img">${xImg(XMEDIA+src,title)}</span><small>${esc(tag)}</small><h3>${esc(title)}</h3><span class="x-link">Les artikkelen ${XI.arrS}</span></a>`).join('');

  return `<div class="xh">
  <section class="xh-hero">
    <div class="xh-hero-media" aria-hidden="true">
      <video autoplay muted loop playsinline preload="metadata" poster="${XM.poster}"><source src="${XM.video}" type="video/mp4"></video>
    </div>
    <div class="x-wrap xh-hero-in">
      ${xStatusHtml()}
      <h1 class="xh-h1">Norges fremste spesialist på festemateriell</h1>
      <p class="xh-sub">Det som er spesial hos andre, kan gjerne være standard hos INDUSTRISALG.</p>
      <div class="xh-searchwrap" data-note="N1">
        <div class="xh-search" role="search">
          ${XI.search}
          <label for="hq" class="sr">Søk etter produkt, standard eller artikkelnummer</label>
          <input id="hq" type="text" autocomplete="off" spellcheck="false" placeholder="Søk etter DIN, mål, materiale eller artikkelnr." aria-autocomplete="list" aria-controls="hsug" aria-expanded="false">
          <kbd aria-hidden="true">/</kbd>
          <button type="button" class="x-btn x-btn-blue" data-act="herosearch">${XI.search}<span>Søk</span></button>
        </div>
        <div class="xh-sug" id="hsug" hidden></div>
      </div>
      <div class="xh-pop"><span>Populært</span>
        ${['DIN 933 A4 M10','DIN 912 M8','DIN 985 M12','Nord-Lock M16'].map(q=>`<a href="#/sok?q=${encodeURIComponent(q)}">${esc(q)}</a>`).join('')}
      </div>
      <div class="xh-ctas" data-note="N10">
        <a class="x-btn x-btn-white" href="#/kurv">Be om tilbud ${XI.arr}</a>
        <a class="x-btn x-btn-glass" href="#/hurtigordre">Last opp innkjøpsliste</a>
      </div>
    </div>
    <div class="x-wrap xh-hero-foot">
      <ul class="xh-proof">
        <li>${XI.check}<span>Kjøp ned til enkeltstykk</span></li>
        <li>${XI.check}<span>Sendes samme dag fra Sandnes</span></li>
        <li>${XI.check}<span>2.1 og 3.1 materialsertifikat</span></li>
      </ul>
      <div class="xh-badges">${xImg(XM.iso,'ISO 9001:2015')}${xImg(XM.magnet,'Magnet JQS')}</div>
    </div>
  </section>

  <div class="xh-stats" data-note="N5"><div class="x-wrap"><ul>
    <li><b><span data-count="70">70</span><i>+</i></b><span>års erfaring med festemateriell</span></li>
    <li><b><span data-count="13000">13 000</span><i>+</i></b><span>artikler på lager i Sandnes</span></li>
    <li><b><span data-count="20">20</span> <i>min</i></b><span>svartid i åpningstiden</span></li>
    <li><b><span data-count="24">24</span> <i>t</i></b><span>til fullstendig tilbud</span></li>
    <li><b><span data-count="1">1</span> <i>stk</i></b><span>minste kjøp, ingen minstekvantum</span></li>
  </ul></div></div>

  <section class="x-sec x-soft">
    <div class="x-wrap xh-3d">
      <div data-rv>
        <p class="x-eyebrow">Mest brukte standarder</p>
        <h2 class="x-h2">Rett til standarden du trenger.</h2>
        <p class="x-lead">Velg en standard og se delen i 3D. Ett klikk videre får du alle størrelser, materialer og lagerstatus i én tabell.</p>
        <ul class="xh-3d-list" data-note="N6">${stdBtns}</ul>
      </div>
      <div class="xh-3d-stage" data-note="N3" data-rv>
        <div class="xh-3d-canvas" id="x3dstage" role="img" aria-label="3D-modell av valgt standard">
          <div class="xh-3d-fallback" aria-hidden="true">${drawing('bolt','933',true)}</div>
          <span class="xh-3d-hint">${XI.rotate}<span>Dra for å rotere</span></span>
        </div>
        <div class="xh-3d-info" id="x3dinfo">${x3dInfo('933')}</div>
      </div>
    </div>
  </section>

  <section class="x-sec">
    <div class="x-wrap">
      <div class="x-head" data-rv>
        <div><p class="x-eyebrow">Produktkategorier</p><h2 class="x-h2">Hele sortimentet, på hylla i Sandnes.</h2></div>
        <a class="x-link" href="#/kategori/skruer-bolter">Se alle kategorier ${XI.arrS}</a>
      </div>
      <div class="xh-cats" data-note="N7">${cats}</div>
    </div>
  </section>

  <section class="x-sec x-soft">
    <div class="x-wrap xh-qo">
      <div data-rv>
        <p class="x-eyebrow">Hurtigordre</p>
        <h2 class="x-h2">Bestiller du de samme varene ofte?</h2>
        <p class="x-lead">Lim inn artikkelnumre eller last opp innkjøpslisten. Vi matcher hver linje mot lageret på sekunder, og det vi ikke finner går rett til en tekniker.</p>
        <div class="xh-ctas"><button type="button" class="x-btn x-btn-blue" data-act="xqoexample">Prøv med en eksempelliste ${XI.arr}</button><a class="x-btn x-btn-line" href="#/konto">${lg?'Min konto':'Logg inn'}</a></div>
        ${welcome}
      </div>
      <div class="xh-list" data-note="N8" data-rv>
        <div class="xh-list-bar"><b>innkjopsliste.csv</b><span>${qo.length} linjer</span></div>
        <ol>${qoRows}</ol>
        <div class="xh-list-foot"><span>${qoOk} funnet · ${qoMulti} med flere treff · ${qoNone} til tekniker</span></div>
      </div>
    </div>
  </section>

  <section class="x-sec" id="tilbud">
    <div class="x-wrap">
      <div class="x-head" data-rv>
        <div><p class="x-eyebrow">Tilbud</p><h2 class="x-h2">Tre veier til riktig tilbud.</h2><p class="x-lead">Velg det som passer det du har i hånden: et produkt, en tegning eller en liste.</p></div>
        <div class="xh-dial" data-note="N4">
          <svg width="88" height="88" viewBox="0 0 92 92" aria-hidden="true"><circle cx="46" cy="46" r="40" fill="none" stroke="#e6ebf3" stroke-width="7"/><circle class="arc" cx="46" cy="46" r="40" fill="none" stroke="#1d4ed8" stroke-width="7" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset=".667" transform="rotate(-90 46 46)"/></svg>
          <div><b>20 min</b><span>Svar i åpningstiden.<br>Fullstendig tilbud innen 24 t.</span></div>
        </div>
      </div>
      <div class="xq-track" id="xqtrack">
        <div class="xq-stage">
          <div class="xq-left">
            <ol class="xq-rail" aria-label="Tre veier">
              <li><button type="button" data-xq="0"><i><b></b></i><span>01</span>Produkt</button></li>
              <li><button type="button" data-xq="1"><i><b></b></i><span>02</span>Tegning</button></li>
              <li><button type="button" data-xq="2"><i><b></b></i><span>03</span>Liste</button></li>
            </ol>
            <div class="xq-steps">
              <article class="xq-step on" data-step="0"><p class="xq-k">Vei 01 · Fra idé til forespørsel</p><h3>Jeg vet hva jeg trenger</h3><p>Finn produktene, velg antall og sertifikat, og send alt i én forespørsel.</p><a class="x-btn x-btn-blue" href="#/kategori/skruer-bolter">Finn produkter ${XI.arr}</a></article>
              <article class="xq-step" data-step="1"><p class="xq-k">Vei 02 · Fra skisse til riktig del</p><h3>Jeg har en tegning eller en gammel del</h3><p>Send tegning, bilde eller mål. En teknisk selger finner riktig produkt.</p><a class="x-btn x-btn-blue" href="#/spesialprodukt">Send spesifikasjon ${XI.arr}</a></article>
              <article class="xq-step" data-step="2"><p class="xq-k">Vei 03 · Fra liste til ferdig pakke</p><h3>Jeg har en innkjøpsliste</h3><p>Lange lister fra innkjøp eller stykkliste (BOM). Vi matcher linjene mot lageret.</p><a class="x-btn x-btn-blue" href="#/hurtigordre">Last opp liste ${XI.arr}</a></article>
            </div>
            <p class="xq-hint" aria-hidden="true"><span></span>Scroll for å se hvordan</p>
          </div>
          <div class="xq-view">
            <div class="xq-grid" aria-hidden="true"></div>
            <div class="xq-canvas" id="xqcanvas" aria-hidden="true"></div>
            <div class="xq-ov xq-ov1" aria-hidden="true">
              <div class="xq-card xq-search">
                <div class="xq-in"><svg width="16" height="16" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span class="xq-type" data-text="DIN 931 M12×40 A4"></span><i class="xq-caret"></i></div>
                <div class="xq-res"><span class="xq-thumb ph ph-bolt_zinc"></span><span><b>Sekskantbolt DIN 931</b><small>M12×40 · A4 syrefast · 1 240 stk på lager</small></span></div>
                <div class="xq-opts"><span>200 stk</span><span>3.1-sertifikat</span><span class="xq-added">${XI.check} Lagt i forespørsel</span></div>
              </div>
            </div>
            <div class="xq-ov xq-ov2" aria-hidden="true">
              <span class="xq-lbl" data-dim="len">L 40</span><span class="xq-lbl" data-dim="dia">M12</span>
              <div class="xq-chip xq-file"><span class="xq-fic">PDF</span><span><b>tegning_flens.pdf</b><small>Mottatt</small></span></div>
              <div class="xq-chip xq-tech"><span class="xq-dot"></span><span><b>Teknisk selger</b><small>Forslag klart innen 20 min</small></span></div>
            </div>
            <div class="xq-ov xq-ov3" aria-hidden="true">
              <div class="xq-card xq-list">
                <p class="xq-lt"><span class="xq-fic xls">XLS</span>innkjøpsliste.xlsx</p>
                <ul>
                  <li data-li="0"><span>DIN 931 M12×40 A4</span><em>200</em><i>${XI.check}</i></li>
                  <li data-li="1"><span>DIN 125 M12 A4</span><em>200</em><i>${XI.check}</i></li>
                  <li data-li="2"><span>DIN 934 M12 A4</span><em>200</em><i>${XI.check}</i></li>
                </ul>
                <p class="xq-lf"><b data-found>0</b> av 3 linjer matchet mot lager</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="xh-routes">
        <a class="xh-route prime" href="#/kategori/skruer-bolter" data-rv style="--rv:0"><span class="xh-route-ic">${XI.table}</span><h3>Jeg vet hva jeg trenger</h3><p>Finn produktene, velg antall og sertifikat, og send alt i én forespørsel.</p><span class="x-link">Finn produkter ${XI.arrS}</span></a>
        <a class="xh-route" href="#/spesialprodukt" data-rv style="--rv:1"><span class="xh-route-ic">${XI.draw}</span><h3>Jeg har en tegning eller en gammel del</h3><p>Send tegning, bilde eller mål. En teknisk selger finner riktig produkt.</p><span class="x-link">Send spesifikasjon ${XI.arrS}</span></a>
        <a class="xh-route" href="#/hurtigordre" data-rv style="--rv:2"><span class="xh-route-ic">${XI.list}</span><h3>Jeg har en innkjøpsliste</h3><p>Lange lister fra innkjøp eller stykkliste (BOM). Vi matcher linjene mot lageret.</p><span class="x-link">Last opp liste ${XI.arrS}</span></a>
      </div>
    </div>
  </section>

  <section class="x-sec x-soft">
    <div class="x-wrap">
      <div class="x-head" data-rv>
        <div><p class="x-eyebrow">Bransjeløsninger</p><h2 class="x-h2">Bygget for bransjen din.</h2></div>
        <p class="x-lead">Tolv bransjer, hver med sine krav til materiale, sertifikat og leveringstid.</p>
      </div>
      <div class="xh-ind" data-note="N11">
        <ul class="xh-ind-list">${inds}</ul>
        <div class="xh-ind-panel" aria-live="polite">${indCards}</div>
      </div>
    </div>
  </section>

  <section class="x-sec">
    <div class="x-wrap xh-sp">
      <div data-rv>
        <p class="x-eyebrow">Spesialprodukter</p>
        <h2 class="x-h2">Spesielle krav? Det håndterer vi.</h2>
        <p class="x-lead">Våre spesialister håndterer komplekse, store volumer og spesialtilpassede feste- eller materialforespørsler med prioritet.</p>
        <ul class="xh-checks">
          <li>${XI.check}<span>Tegninger (PDF, DWG, DXF, STEP)</span></li>
          <li>${XI.check}<span>Bilde av delen du skal erstatte</span></li>
          <li>${XI.check}<span>Innkjøpsliste eller stykkliste (XLSX, CSV)</span></li>
          <li>${XI.check}<span>Krav til materiale og sertifikat</span></li>
        </ul>
        <a class="x-btn x-btn-blue" href="#/spesialprodukt">Send forespørsel om spesialprodukt ${XI.arr}</a>
      </div>
      <div class="xh-sp-media" data-rv>
        <div class="xh-wire" id="xwire" role="img" aria-label="3D-modell">
          <span class="xh-wire-cap" id="xwirecap" aria-live="polite"><b>DIN 933</b><span>Sekskantbolt helgjenget</span></span>
        </div>
        <a class="xh-drop" href="#/spesialprodukt" id="xdrop" data-note="N12">
          <span class="xh-drop-ic">${XI.upload}</span>
          <span><strong>Slipp tegningen her</strong><p>PDF, DWG, DXF, STEP, JPG, XLSX eller CSV</p></span>
        </a>
      </div>
    </div>
  </section>

  <section class="x-sec x-soft">
    <div class="x-wrap">
      <div class="x-head" data-rv>
        <div><p class="x-eyebrow">Hvorfor Industrisalg</p><h2 class="x-h2">Det som er spesial hos andre, er standard hos oss.</h2></div>
        <p class="x-lead">I over 70 år har vi levert slitesterke festemidler, tydelige spesifikasjoner og leveranser du kan stole på.</p>
      </div>
      <div class="xh-cmp" data-note="N13" data-rv>
        <div class="xh-cmp-row xh-cmp-head"><div></div><div class="us">Industrisalg</div><div class="them">Andre leverandører</div></div>
        ${cmp}
      </div>
    </div>
  </section>

  <section class="x-sec">
    <div class="x-wrap">
      <div class="x-head" data-rv>
        <div><p class="x-eyebrow">Fagartikler</p><h2 class="x-h2">Kunnskap fra 70 år med festemateriell.</h2></div>
        <a class="x-link" href="#/">Alle artikler ${XI.arrS}</a>
      </div>
      <div class="xh-arts">${arts}</div>
    </div>
  </section>

  <section class="x-sec x-soft">
    <div class="x-wrap">
      <div class="x-head" data-rv><div><p class="x-eyebrow">Kundene våre</p><h2 class="x-h2">«Vi kan ikke huske å ha fått nei.»</h2></div></div>
      <div class="xh-tms">${TESTIMONIALS.map((t,i)=>`<figure class="xh-tm" data-rv style="--rv:${i}"><div><span class="qm" aria-hidden="true">“</span><blockquote>${esc(t.q)}</blockquote></div><figcaption>${TM_FACE[i]?`<img class="xh-tm-face" src="${TM_FACE[i]}" alt="" width="52" height="52">`:''}<span><b>${esc(t.name||t.who)}</b><span class="xh-tm-role">${esc(t.who)}</span><span class="xh-tm-co">${esc(t.co)}</span></span></figcaption></figure>`).join('')}</div>
    </div>
  </section>

  <section class="x-sec" id="faq">
    <div class="x-wrap xh-fc">
      <div data-rv>
        <p class="x-eyebrow">Ofte stilte spørsmål</p>
        <h2 class="x-h2">Svar før du spør.</h2>
        <details class="faq"><summary>Kan jeg få et tilbud på flere produkter samtidig?</summary><p>Ja. Legg produktene i forespørselen, eller lim inn hele listen i hurtigordre.</p></details>
        <details class="faq"><summary>Hva om jeg ikke finner produktet jeg leter etter?</summary><p>Sortimentet vårt er bredere enn nettbutikken. <a href="#/spesialprodukt">Send oss spesifikasjon, tegning eller bilde</a>, eller ring 51 63 78 00.</p></details>
        <details class="faq"><summary>Kan jeg kjøpe enkeltstykker?</summary><p>Ja. Vi bryter pakker og selger ned til enkeltskruen. Ingen minstekjøp.</p></details>
        <details class="faq"><summary>Kan jeg få materialsertifikat?</summary><p>2.1-sertifikat følger hver ordre. 3.1 er tilgjengelig på det meste av lageret og velges per produkt.</p></details>
        <details class="faq"><summary>Hvor raskt leverer dere?</summary><p>Lagervarer sendes eller hentes samme dag. Lagerstatus vises per produkt. Ved akutte behov utenom kontortid: vakttelefon 477 09 806.</p></details>
        <details class="faq"><summary>Er nettbutikken kun for bedriftskunder?</summary><p>Vi er en B2B-grossist og fokuserer på bedriftsmarkedet, men hjelper også privatkunder ved spesielle behov.</p></details>
      </div>
      <div class="xh-form" data-note="N14" data-rv>
        ${xStatusHtml()}
        <h3>Kontakt oss i dag</h3>
        <p>Fortell oss hva du trenger. Legg gjerne ved tegning eller liste.</p>
        ${enquiryForm('contact',{compact:true})}
      </div>
    </div>
  </section>
</div>`;
}

/* ---------- Extra actions ---------- */
var ACT_EXTRA = Object.assign(typeof ACT_EXTRA!=='undefined'?ACT_EXTRA:{}, {
  focussearch(){
    const h=$('#hq');
    if(h){ const rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches; h.scrollIntoView({block:'center',behavior:rm?'auto':'smooth'}); setTimeout(()=>h.focus({preventScroll:true}),rm?0:380); return; }
    window.scrollTo(0,0); $('#q').focus();
  },
  xqoexample(){ UI.qoText=QO_EXAMPLE; UI.qo=parseOrderLines(QO_EXAMPLE); track('quick_order_parsed',{lines:UI.qo.length,matched:UI.qo.filter(r=>r.pick).length,source:'home_demo'}); go('#/hurtigordre'); },
  xadd(t){ addLines([{sku:t.dataset.sku,qty:1,cert:'2.1'}],'hero_search'); t.classList.add('done'); t.innerHTML=XI.check.replace(/18/g,'14')+'<span>'+tr('Lagt til')+'</span>'; }
});

/* ---------- Design notes ---------- */
const DESIGN_NOTES = {
  N1:['Search is the hero','Most B2B buyers arrive knowing the standard, size or item number. A large white search bar sits on the company film, results appear while typing, and every result can be added to the quote straight from the dropdown.'],
  N2:['One search box at a time','The header search stays hidden while the hero search is on screen and fades in once it scrolls away. Two identical search fields on one screen split attention.'],
  N3:['The product in 3D','Real-time 3D models of each standard (bolt, socket screw, nut, lock nut, washer, Nord-Lock). Buyers rotate the part, check they have the right one, and go straight to all sizes in stock.'],
  N4:['Honest, live response promise','The status line follows real opening hours (Mon to Fri 07 to 16, Norwegian time). Outside hours it switches to the on-call phone instead of promising a 20-minute reply.'],
  N5:['Proof in numbers','Five facts buyers care about, in one calm band: experience, stock, response time, quote time and no minimum order.'],
  N6:['Standards first','Repeat buyers think in DIN numbers. The seven most used standards are one click from the homepage, each with live variant and stock counts.'],
  N7:['Categories with real photos and counts','Product photography from the current site, with article counts from the live category menu, so buyers see the depth of the range before clicking.'],
  N8:['Quick order, demonstrated','The list is matched against the real catalogue on page load. "Try with an example list" runs the full quick-order flow with it.'],
  N9:['Returning-customer mode','Switch "Vis som" to logged-in customer: the quick-order block greets the company and offers a one-click reorder of the last order.'],
  N10:['Three quote paths','Buyers arrive with a product, a drawing or a list. Each has its own entry point, so nobody has to translate their need into the site\'s structure.'],
  N11:['Industry explorer','Twelve industries in one compact panel instead of twelve tiles. Hover or tab through to see focus, material and the standards each industry uses most.'],
  N12:['Drop a drawing anywhere','Dropping a file on this card opens the special-product form with the file already attached. One gesture instead of four steps.'],
  N13:['Comparison framed as standard vs special','The brand line "special elsewhere, standard here" becomes the argument, with Industrisalg\'s column highlighted.'],
  N14:['Contact without friction','Short form, files allowed, live opening status above it, and a phone band in the footer on every page.'],
  N15:['Design system','White canvas, Industrisalg blue for actions, navy for depth. Google Sans Flex for all text. Real media: the company film, product photography and blog photos from the current site. Motion respects reduced-motion settings.'],

  C1:['The standard as a product, not a folder','The header reads like a data sheet with a rotatable 3D model: DIN and ISO equivalent, sizes in stock right now, materials, single-piece buying and certificates.'],
  C2:['Filters that match how buyers narrow down','Material, diameter, length range and grade, each with live counts. Active filters show as removable chips above the table, with an in-stock-only switch.','.filters'],
  C3:['Order straight from the table','Every row has diameter, length, pitch, grade, live stock, a quantity field and an add button. Buyers who know the size never need to open a product page.','#results'],
  C4:['Persistent basket rail','After the first add, a slim basket column stays on screen with every line, so buyers keep browsing while seeing what they have collected.','#minicart'],
  S1:['Search that reads buyer shorthand','DIN or ISO numbers, M10x30, 10x30, A4, A2 and product words are understood. The line under the title shows how the query was interpreted.','#main h1'],
  S2:['Results as a buyable table','Same table and filters as the standard pages, so search results can be ordered directly.','#results'],
  P1:['One clear primary action','Visitors add to the quote request, logged-in customers add to their order with their own price. Stock, same-day dispatch and certificate sit right above the button.','.buybox'],
  P2:['Certificate chosen on the product','2.1 is included, 3.1 can be selected per line. The choice follows the line into the quote or order.','.certopts'],
  P3:['Complete the joint','Matching nut, washer and Nord-Lock in the same material and size, added in one click with quantities matched to the bolt. Raises order value while saving the buyer time.','.joint'],
  P4:['Photo, drawing and 3D','A product photo, a dimensioned schematic and a rotatable 3D model, so every size has a clear image.','.drawing'],
  P5:['Specs a technician would ask for','Standard, diameter, length, pitch, material, grade and pack size in a compact table.','.specs'],
  B1:['Progress in three steps','Products, contact details, reply. Buyers see how short the rest of the process is.'],
  B2:['Edit lines without reloading','Quantity and certificate can be changed directly in each line. Nothing refreshes while typing.','.btable'],
  B3:['A short form with files allowed','Email or phone, not both. Drawings and lists can be attached to the same request.','form[data-form]'],
  F1:['Reference and next steps','Clear reference number, what happens next, and the response promise, plus the after-hours phone for anything urgent.'],
  Q1:['Paste a list, get a basket','Item numbers or descriptions with quantities, one per line, or a CSV export. Each line is matched against stock; unmatched lines go to a technician.','#qotext'],
  Q2:['Explained in three steps','The method is shown next to the input, so first-time users understand what will happen.','.steps'],
  E1:['Engineering files accepted','DWG, DXF, STEP, XLSX and CSV as well as PDF and images, up to 5 files of 20 MB.','.drop'],
  E2:['Only what is needed to reply','Name, company and either email or phone. Everything else is optional.','.grid2'],
  A1:['Account built for repeat buying','Orders, quotes, saved lists and certificates in one place, with reorder and quote acceptance one click away.','.acctnav'],
  I1:['Industry landing pages','Each industry gets its own page with relevant products, documentation requirements, a customer quote and an enquiry form.','#main .hero'],
  I2:['Products already filtered for the industry','The most used items in the right material, orderable from the table.','.ptable'],
  K1:['Contact without friction','Short form, files allowed, response promise and direct phone numbers next to it.','form[data-form]']
};

/* ---------- Design notes overview (#/endringer) ---------- */
const XNOTE_GROUPS=[['Forside',['N1','N2','N3','N4','N5','N6','N7','N8','N9','N10','N11','N12','N13','N14','N15']],
  ['Standard og kategori',['C1','C2','C3','C4']],['Søk',['S1','S2']],['Produkt',['P1','P2','P3','P4','P5']],
  ['Forespørsel og bestilling',['B1','B2','B3','F1']],['Hurtigordre',['Q1','Q2']],['Spesialprodukt og kontakt',['E1','E2','K1']],
  ['Konto',['A1']],['Bransjesider',['I1','I2']]];
function viewFixes(){
  document.title='Designtanker | Industrisalg 2.0';
  return `<div class="wrap section"><div class="kicker">Industrisalg 2.0</div><h1>Designtanker</h1>
    <p class="muted" style="max-width:62ch">Why each part of the concept works the way it does. Open a page and use the Designtanker button to see the notes in place.</p>
    ${XNOTE_GROUPS.map(([no,ids])=>`<h2 style="margin-top:48px">${esc(no)}</h2><div class="xn-grid">${ids.map(k=>`<div class="xn-card"><b><i>${k}</i>${esc(DESIGN_NOTES[k][0])}</b><p>${esc(DESIGN_NOTES[k][1])}</p></div>`).join('')}</div>`).join('')}</div>`;
}

/* ---------- English for the new copy ---------- */
(function(){
  const add={
    'Konsept':'Concept','Snarveier':'Shortcuts','Designtanker':'Design notes',
    'Åpent nå · svar innen 20 minutter':'Open now · reply within 20 minutes',
    'Stengt nå · vakttelefon 477 09 806':'Closed now · on-call phone 477 09 806',
    'Norges fremste spesialist på festemateriell':"Norway's leading fastener specialist",
    'Søk etter DIN, mål, materiale eller artikkelnr.':'Search by DIN, size, material or item no.',
    'Søk':'Search','Populært':'Popular',
    'Be om tilbud':'Request a quote','Last opp innkjøpsliste':'Upload a purchase list',
    'Kjøp ned til enkeltstykk':'Buy down to a single piece','Sendes samme dag fra Sandnes':'Ships same day from Sandnes','2.1 og 3.1 materialsertifikat':'2.1 and 3.1 material certificates',
    'Lagt til':'Added',
    'års erfaring med festemateriell':'years of fastener experience','artikler på lager i Sandnes':'items in stock in Sandnes','svartid i åpningstiden':'response time in opening hours','til fullstendig tilbud':'to a complete quote','minste kjøp, ingen minstekvantum':'minimum purchase, no minimum quantity',
    'min':'min','t':'h',
    'Mest brukte standarder':'Most used standards','Rett til standarden du trenger.':'Straight to the standard you need.',
    'Velg en standard og se delen i 3D. Ett klikk videre får du alle størrelser, materialer og lagerstatus i én tabell.':'Pick a standard and see the part in 3D. One more click gives you every size, material and stock status in one table.',
    'Dra for å rotere':'Drag to rotate','3D-modell av valgt standard':'3D model of the selected standard','Se alle størrelser':'See all sizes','på lager nå':'in stock now',
    'Produktkategorier':'Product categories','Hele sortimentet, på hylla i Sandnes.':'The full range, on the shelf in Sandnes.','Se alle kategorier':'See all categories',
    'Hurtigordre':'Quick order','Bestiller du de samme varene ofte?':'Do you often order the same items?',
    'Lim inn artikkelnumre eller last opp innkjøpslisten. Vi matcher hver linje mot lageret på sekunder, og det vi ikke finner går rett til en tekniker.':'Paste item numbers or upload your purchase list. We match every line against stock in seconds, and anything we cannot find goes straight to a technician.',
    'Prøv med en eksempelliste':'Try with an example list','Min konto':'My account','Logg inn':'Log in',
    'Funnet':'Found','Velg variant':'Choose variant','Tekniker':'Technician','Sendes til tekniker':'Sent to a technician',
    'Velkommen tilbake, Eksempel Verksted AS':'Welcome back, Eksempel Verksted AS','Bestill på nytt':'Reorder',
    'Tre veier':'Three ways','Produkt':'Product','Tegning':'Drawing','Liste':'List',
    'Vei 01 · Fra idé til forespørsel':'Route 01 · From idea to request','Vei 02 · Fra skisse til riktig del':'Route 02 · From sketch to the right part','Vei 03 · Fra liste til ferdig pakke':'Route 03 · From list to a complete order',
    'Scroll for å se hvordan':'Scroll to see how','Sekskantbolt DIN 931':'Hex bolt DIN 931','M12×40 · A4 syrefast · 1 240 stk på lager':'M12×40 · A4 stainless · 1,240 in stock',
    '200 stk':'200 pcs','3.1-sertifikat':'3.1 certificate','Lagt i forespørsel':'Added to request','Mottatt':'Received','Teknisk selger':'Technical sales','Forslag klart innen 20 min':'Proposal ready within 20 min',
    'av 3 linjer matchet mot lager':'of 3 lines matched to stock',
    'Tilbud':'Quotes','Tre veier til riktig tilbud.':'Three ways to the right quote.',
    'Velg det som passer det du har i hånden: et produkt, en tegning eller en liste.':'Pick the one that fits what you have: a product, a drawing or a list.',
    '20 min':'20 min','Svar i åpningstiden.':'Reply in opening hours.','Fullstendig tilbud innen 24 t.':'Complete quote within 24 h.',
    'Jeg vet hva jeg trenger':'I know what I need','Finn produktene, velg antall og sertifikat, og send alt i én forespørsel.':'Find the products, choose quantity and certificate, and send it all in one request.','Finn produkter':'Find products',
    'Jeg har en tegning eller en gammel del':'I have a drawing or an old part','Send tegning, bilde eller mål. En teknisk selger finner riktig produkt.':'Send a drawing, photo or measurements. A technical salesperson finds the right product.','Send spesifikasjon':'Send specification',
    'Jeg har en innkjøpsliste':'I have a purchase list','Lange lister fra innkjøp eller stykkliste (BOM). Vi matcher linjene mot lageret.':'Long lists from purchasing or a bill of materials (BOM). We match the lines against stock.','Last opp liste':'Upload list',
    'Bransjeløsninger':'Industry solutions','Bygget for bransjen din.':'Built for your industry.','Tolv bransjer, hver med sine krav til materiale, sertifikat og leveringstid.':'Twelve industries, each with its own requirements for material, certificates and delivery time.',
    'Fokus':'Focus','Materiale':'Material','Mest brukt':'Most used','Se bransjeløsningen':'See the industry solution','Send forespørsel':'Send request',
    'Spesialprodukter':'Special products','Spesielle krav? Det håndterer vi.':'Special requirements? We handle them.',
    'Våre spesialister håndterer komplekse, store volumer og spesialtilpassede feste- eller materialforespørsler med prioritet.':'Our specialists handle complex, high-volume and custom fastener or material requests with priority.',
    'Slipp tegningen her':'Drop your drawing here','PDF, DWG, DXF, STEP, JPG, XLSX eller CSV':'PDF, DWG, DXF, STEP, JPG, XLSX or CSV',
    'Hvorfor Industrisalg':'Why Industrisalg','Det som er spesial hos andre, er standard hos oss.':'What is special elsewhere is standard with us.',
    'I over 70 år har vi levert slitesterke festemidler, tydelige spesifikasjoner og leveranser du kan stole på.':'For more than 70 years we have delivered durable fasteners, clear specifications and deliveries you can rely on.',
    'Industrisalg':'Industrisalg','Andre leverandører':'Other suppliers',
    'Fagartikler':'Articles','Kunnskap fra 70 år med festemateriell.':'Knowledge from 70 years of fasteners.','Alle artikler':'All articles','Les artikkelen':'Read the article',
    'Montering':'Assembly','Sikring':'Locking','Standarder':'Standards',
    'Klemkraft, friksjon og moment: derfor holder ikke alltid momenttabellen':'Clamp force, friction and torque: why the torque table does not always hold',
    'Hvorfor bolter løsner: setting og rotasjonsløsning (eksempler fra praksis)':'Why bolts come loose: settling and rotational loosening (practical examples)',
    'ANSI/ASME vs ISO/DIN: hva betyr forskjellen for vedlikehold, lager og nedetidsrisiko?':'ANSI/ASME vs ISO/DIN: what the difference means for maintenance, stock and downtime risk',
    'Kundene våre':'Our customers','«Vi kan ikke huske å ha fått nei.»':'“We cannot remember ever being told no.”',
    'Ofte stilte spørsmål':'Frequently asked questions','Svar før du spør.':'Answers before you ask.',
    'Kontakt oss i dag':'Contact us today','Fortell oss hva du trenger. Legg gjerne ved tegning eller liste.':'Tell us what you need. Feel free to attach a drawing or list.',
    'Trenger du hjelp nå?':'Need help now?','Snakk med en spesialist på festemateriell.':'Talk to a fastener specialist.',
    'Mandag til fredag 07:00 til 16:00. Akutt utenom kontortid: vakttelefon.':'Monday to Friday 07:00 to 16:00. Urgent outside office hours: on-call phone.',
    'Sentralbord':'Switchboard','Vakttelefon':'On-call phone','Konsept av Kilowott':'Concept by Kilowott',
    'filer lagt ved':'files attached',
    'Steg':'Steps','Produkter':'Products','Kontaktinfo':'Contact details','Levering':'Delivery','Bekreftelse':'Confirmation','Svar innen 20 min':'Reply within 20 min',
    'Referanse':'Reference','Oppgi referansen hvis du kontakter oss.':'Quote this reference if you contact us.',
    'materialer':'materials','Tilsvarer':'Equivalent to','Ned til':'Down to','sertifikat':'certificate','3D-modell':'3D model'
  };
  for(const [k,v] of Object.entries(add)){ if(!(k in EN)) EN[k]=v; EN_LC[k.toLowerCase()]=EN[k]; }
  RULES.unshift([/^(\d[\d\s ]*) artikler$/,(m,a)=>`${a.trim()} items`]);
  RULES.unshift([/^Siste ordre (.+)$/,(m,a)=>`Last order ${a}`]);
  RULES.unshift([/^(\d+) funnet · (\d+) med flere treff · (\d+) til tekniker$/,(m,a,b,c)=>`${a} found · ${b} with several matches · ${c} to a technician`]);
  RULES.unshift([/^(\d+) linjer$/,(m,a)=>`${a} lines`]);
  RULES.unshift([/^(\d+) treff$/,(m,a)=>`${a} matches`]);
  RULES.unshift([/^(\d+) på lager nå$/,(m,a)=>`${a} in stock now`]);
  RULES.unshift([/^Bransje (\d+) \/ (\d+)$/,(m,a,b)=>`Industry ${a} / ${b}`]);
})();
