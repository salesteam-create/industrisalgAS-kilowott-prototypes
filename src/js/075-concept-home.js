/* =====================================================================
   INDUSTRISALG 2.0 CONCEPT · Homepage
   Loaded after the original modules and before the router, so this
   viewHome() replaces the original one. All data comes from the same
   catalogue (PRODUCTS, STANDARDS, CATEGORIES, INDUSTRIES, CATNAV).
   ===================================================================== */

document.documentElement.classList.add('x-anim');

const XI = {
  arr: '<svg class="x-arr" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg>',
  arrS: '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg>',
  check: '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  cross: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M7 7l10 10M17 7 7 17"/></svg>',
  search: '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M10.5 3.5a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM16 16l4.5 4.5"/></svg>',
  plus: '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>',
  table: '<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 14h18M9 9v11"/></g></svg>',
  draw: '<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 20 15 9l3 3L7 23H4z" transform="translate(0 -3)"/><path d="M13 8l3-3 3 3-3 3"/><path d="M3 4h7M3 4v7" stroke-dasharray="2 2"/></g></svg>',
  list: '<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M9 6h11M9 12h11M9 18h6"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/><path d="M19 15v6M16.5 18.5 19 21l2.5-2.5"/></g></svg>',
  upload: '<svg width="38" height="38" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 18v-6M9.5 14.5 12 12l2.5 2.5"/></g></svg>'
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

/* Live article counts per category, from the category menu data */
function xCatCount(slug){
  const g=(typeof CATNAV!=='undefined'&&CATNAV[slug])||[];
  return g.reduce((a,x)=>a+(+x[2]||0),0);
}
function xCatGroups(slug,n){
  const g=(typeof CATNAV!=='undefined'&&CATNAV[slug])||[];
  return g.slice(0,n).map(x=>x[0]);
}

/* Section-view engineering drawing of a bolted joint (M12 x 40, A4-80) */
function xBlueprint(){
  let threads=''; for(let y=116;y<=336;y+=8) threads+=`M264 ${y}L336 ${y+5}`;
  const d=(n)=>`style="--d:${n}"`;
  return `<svg class="bp" viewBox="0 0 600 500" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Teknisk tegning av en bolteforbindelse M12">
  <defs>
    <pattern id="xh1" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="9" class="hatch"/></pattern>
    <pattern id="xh2" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><line x1="0" y1="0" x2="0" y2="9" class="hatch"/></pattern>
  </defs>
  <g class="fade" ${d(4)}><rect x="120" y="105" width="141" height="72" fill="url(#xh1)"/><rect x="339" y="105" width="141" height="72" fill="url(#xh1)"/><rect x="120" y="177" width="141" height="72" fill="url(#xh2)"/><rect x="339" y="177" width="141" height="72" fill="url(#xh2)"/></g>
  <g class="ln">
    <rect class="draw" pathLength="1" ${d(3)} x="120" y="105" width="141" height="72"/>
    <rect class="draw" pathLength="1" ${d(3)} x="339" y="105" width="141" height="72"/>
    <rect class="draw" pathLength="1" ${d(4)} x="120" y="177" width="141" height="72"/>
    <rect class="draw" pathLength="1" ${d(4)} x="339" y="177" width="141" height="72"/>
    <path class="draw acc" pathLength="1" ${d(0)} d="M243 60H357L362.5 66V99L357 105H243L237.5 99V66Z"/>
    <path class="draw thin" pathLength="1" ${d(1)} d="M279 60V105M321 60V105"/>
    <path class="draw acc" pathLength="1" ${d(1)} d="M264 105V339L270 345H330L336 339V105"/>
    <path class="draw thin" pathLength="1" ${d(5)} d="${threads}"/>
    <path class="draw acc" pathLength="1" ${d(6)} d="M228 249H372V264H228Z"/>
    <path class="draw acc" pathLength="1" ${d(7)} d="M243 264H357L362.5 270V323L357 329H243L237.5 323V270Z"/>
    <path class="draw thin" pathLength="1" ${d(8)} d="M279 264V329M321 264V329"/>
  </g>
  <g class="fade" ${d(8)}>
    <path class="ln thin hid" d="M269 110V340M331 110V340"/>
    <path class="ln cl" d="M300 34V372"/>
  </g>
  <g class="fade" ${d(10)}>
    <path class="ln thin" d="M368 105H542M342 345H542M528 105V345"/>
    <path class="dot" d="M528 105l-4 10h8zM528 345l-4-10h8z"/>
    <text class="t-or" transform="rotate(-90 546 225)" x="546" y="225" text-anchor="middle">L = 40</text>
    <path class="ln thin" d="M264 352V398M336 352V398M264 390H336"/>
    <path class="dot" d="M264 390l10-4v8zM336 390l-10-4v8z"/>
    <text class="t-or" x="300" y="414" text-anchor="middle">M12</text>
    <path class="ln thin" d="M230 60H196M230 105H196M204 60V105"/>
    <text x="190" y="87" text-anchor="end">k 7,5</text>
  </g>
  <g class="fade" ${d(12)}>
    <circle class="dot" cx="252" cy="80" r="3.5"/><path class="ln thin" d="M252 80 210 32H40"/>
    <text class="t-b" x="40" y="24">DIN 933 · A4-80</text>
    <circle class="dot" cx="236" cy="256" r="3.5"/><path class="ln thin" d="M236 256H40"/>
    <text class="t-b" x="40" y="276">DIN 125 · A4</text>
    <circle class="dot" cx="248" cy="318" r="3.5"/><path class="ln thin" d="M248 318H40"/>
    <text class="t-b" x="40" y="338">DIN 934 · A4-80</text>
  </g>
  <text class="fade" ${d(2)} x="572" y="24" text-anchor="end">DWG IS-0933-A4 · REV 26</text>
  <g class="fade" ${d(14)}>
    <rect class="ln thin" x="336" y="432" width="236" height="66" rx="3"/>
    <path class="ln thin" d="M336 454H572M336 476H572M470 476V498"/>
    <text x="346" y="447">INDUSTRISALG AS · SANDNES</text>
    <text class="t-b" x="346" y="470" style="font-size:11px">BOLTEFORBINDELSE M12×40</text>
    <text x="346" y="491">A4-80</text><text x="480" y="491">SKALA 1:1</text>
  </g>
</svg>`;
}

function xHeroProduct(){ return fp('933','A4',12,40) || PRODUCTS.find(p=>p.stock>0); }

function viewHome(){
  const lg=S.loggedIn;
  const hp=xHeroProduct();
  const stdKeys=['933','931','912','934','985','125','NL'];
  const stdCards=stdKeys.map((k,i)=>{ const s=STANDARDS[k]; const n=PRODUCTS.filter(p=>p.std===k).length;
    return `<a class="xh-sc" href="#/kategori/${s.slug}" data-rv style="--rv:${i}">
      <div class="xh-sc-top"><span class="xh-sc-din">${esc(s.din)}</span>${s.iso?`<span class="xh-sc-iso">${esc(s.iso)}</span>`:''}</div>
      <div class="xh-sc-art">${drawing(s.kind,k,false)}</div>
      <p class="xh-sc-name">${esc(s.name)}</p>
      <div class="xh-sc-foot"><span>${n} varianter</span><span class="x-arrow-c">${XI.arrS}</span></div></a>`; }).join('');

  const cats=CATEGORIES.map((c,i)=>{ const n=xCatCount(c.slug); const cls=i===0?'big':(i===CATEGORIES.length-1?'wide':'');
    const subs=i===0?`<div class="xh-cat-sub">${xCatGroups(c.slug,5).map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:'';
    return `<a class="xh-cat ${cls}" href="#/kategori/${c.slug}" data-rv style="--rv:${i%4}">
      <span class="xh-cat-plate">${catIcon(c)}</span>
      <span class="xh-cat-meta"><span><strong>${esc(c.name)}</strong>${n?`<small>${fmtInt(n)} artikler</small>`:''}</span><span class="x-arrow-c">${XI.arrS}</span></span>${subs}</a>`; }).join('');

  const qo=parseOrderLines(QO_EXAMPLE);
  const qoOk=qo.filter(r=>r.total===1).length, qoMulti=qo.filter(r=>r.total>1).length, qoNone=qo.filter(r=>!r.total).length;
  const qoRows=qo.map((r,i)=>{
    let cls,res;
    if(r.total===1){ cls='ok'; res=`<b>Funnet</b><em>${esc(BY_SKU[r.pick].label)}</em>`; }
    else if(r.total>1){ cls='multi'; res=`<b>${r.total} treff</b><em>Velg variant</em>`; }
    else { cls='none'; res=`<b>Tekniker</b><em>Sendes til tekniker</em>`; }
    return `<li style="--i:${i}"><code>${esc(r.line)}</code><span class="res ${cls}">${res}</span></li>`; }).join('');

  const last=ORDERS[0];
  const welcome = lg ? `<div class="xh-welcome" data-note="N9"><h3>Velkommen tilbake, Eksempel Verksted AS</h3><p class="small muted" style="margin:0">Siste ordre ${esc(last.id)} · ${esc(last.date)} · ${esc(last.ref)}</p>
      <ul>${last.lines.map(([p,q])=>`<li>${fmtInt(q)} × ${esc(p.label)}</li>`).join('')}</ul>
      <button type="button" class="x-btn x-btn-or x-btn-sm" data-act="reorder" data-id="${last.id}">Bestill på nytt ${XI.arrS}</button></div>` : '';

  const inds=INDUSTRIES.map((x,i)=>`<li><a class="xh-ind-row ${i===0?'on':''}" href="#/bransje/${x.slug}" data-ind="${i}"><i>${String(i+1).padStart(2,'0')}</i><span><strong>${esc(x.name)}</strong><small>${esc(x.intro)}</small></span>${XI.arrS}</a></li>`).join('');
  const indCards=INDUSTRIES.map((x,i)=>{ const s0=STANDARDS[x.stds[0]];
    return `<div class="xh-ind-card" data-indc="${i}" ${i?'hidden':''}>
      <div class="xh-ind-art" aria-hidden="true">${drawing(s0.kind,x.stds[0],true)}</div>
      <p class="x-eyebrow">Bransje ${String(i+1).padStart(2,'0')} / ${INDUSTRIES.length}</p>
      <h3>${esc(x.name)}</h3><p>${esc(x.intro)}</p>
      <dl class="xh-ind-spec"><dt>Fokus</dt><dd>${esc(x.focus)}</dd><dt>Materiale</dt><dd>${esc(MATERIALS[x.mat].name)}</dd><dt>Mest brukt</dt><dd><span class="xh-ind-chips">${x.stds.map(k=>`<a href="#/kategori/${STANDARDS[k].slug}">${esc(STANDARDS[k].din)}</a>`).join('')}</span></dd></dl>
      <div class="xh-ind-acts"><a class="x-btn x-btn-or" href="#/bransje/${x.slug}">Se bransjeløsningen ${XI.arr}</a><a class="x-btn x-btn-ghost" href="#/spesialprodukt">Send forespørsel</a></div></div>`; }).join('');

  const cmp=[
    ['Etablert og erfaren','Familiedrevet siden 1953, 70+ år med festemateriell','Ofte generalister uten samme dybdekunnskap'],
    ['Lager på hylla','13 000+ artikler på lager i Sandnes','Venter på bestilling fra grossist eller utlandet'],
    ['Kjøp akkurat det du trenger','Vi bryter pakker, kjøp ned til enkeltskruen','Tvunget til minimumskvanta og fulle esker'],
    ['Tilgjengelighet','Vakttelefon utenom kontortid','Stengt etter 16:00'],
    ['Hurtig respons','Svar innen 20 minutter i åpningstiden, fullstendig tilbud innen 24 timer','Svar innen 48 timer'],
    ['Kvalitetssystem','ISO 9001:2015-sertifisert og Magnet JQS-registrert','Ofte ad hoc-kontroll uten sporbarhet'],
    ['Materialsertifikater','2.1 per ordre, 3.1 på det meste av lageret','Ikke alltid mulig å fremskaffe']
  ].map(r=>`<div class="xh-cmp-row"><div class="k">${esc(r[0])}</div><div class="us">${XI.check}<span>${esc(r[1])}</span></div><div class="them">${XI.cross}<span>${esc(r[2])}</span></div></div>`).join('');

  return `<div class="xh">
  <section class="xh-hero x-grid-bg">
    <div class="x-wrap xh-hero-grid">
      <div>
        ${xStatusHtml()}
        <h1 class="xh-h1">Norges fremste spesialist på <span>festemateriell.</span></h1>
        <p class="xh-sub">Det som er spesial hos andre, kan gjerne være standard hos INDUSTRISALG.</p>
        <div class="xh-searchwrap" data-note="N1">
          <div class="xh-search" role="search">
            ${XI.search}
            <label for="hq" class="sr">Søk etter produkt, standard eller artikkelnummer</label>
            <input id="hq" type="text" autocomplete="off" spellcheck="false" placeholder="Søk etter DIN, mål, materiale eller artikkelnr." aria-autocomplete="list" aria-controls="hsug" aria-expanded="false">
            <kbd aria-hidden="true">/</kbd>
            <button type="button" class="x-btn x-btn-or" data-act="herosearch">${XI.search}<span>Søk</span></button>
          </div>
          <div class="xh-sug" id="hsug" hidden></div>
        </div>
        <div class="xh-pop"><span>Populært</span>
          ${['DIN 933 A4 M10','DIN 912 M8','DIN 985 M12','Nord-Lock M16','ISO 4017'].map(q=>`<a href="#/sok?q=${encodeURIComponent(q)}">${esc(q)}</a>`).join('')}
        </div>
        <div class="xh-ctas" data-note="N10">
          <a class="x-btn x-btn-ghost" href="#/kurv">Be om tilbud ${XI.arr}</a>
          <a class="x-btn x-btn-ghost" href="#/hurtigordre">Last opp innkjøpsliste</a>
        </div>
        <ul class="xh-proof">
          <li>${XI.check}<span>Kjøp ned til enkeltstykk</span></li>
          <li>${XI.check}<span>Sendes samme dag fra Sandnes</span></li>
          <li>${XI.check}<span>2.1 og 3.1 materialsertifikat</span></li>
        </ul>
      </div>
      <div class="xh-bp" data-note="N3">
        ${xBlueprint()}
        ${hp?`<div class="xh-pcard">
          ${photo('bolt_zinc','',hp.label)}
          <div class="xh-pcard-t"><small>DIN 933 · ISO 4017</small><a href="${productUrl(hp)}">${esc(hp.label)}</a>${stockHtml(hp,true)}</div>
          <button type="button" class="x-btn x-btn-or x-btn-sm" data-act="add" data-sku="${hp.sku}" aria-label="${esc(primaryLabel())}">${XI.plus}<span>${lg?'Legg i bestilling':'Legg i forespørsel'}</span></button>
        </div>`:''}
      </div>
    </div>
  </section>

  <div class="xh-stats" data-note="N5"><div class="x-wrap"><ul>
    <li><b><span data-count="70">70</span><i>+</i></b><span>års erfaring</span></li>
    <li><b><span data-count="13000">13 000</span><i>+</i></b><span>artikler på lager i Sandnes</span></li>
    <li><b><span data-count="20">20</span> <i>min</i></b><span>svartid i åpningstiden</span></li>
    <li><b><span data-count="24">24</span> <i>t</i></b><span>til fullstendig tilbud</span></li>
    <li><b><span data-count="1">1</span> <i>stk</i></b><span>minste kjøp, ingen minstekvantum</span></li>
  </ul></div></div>

  <section class="x-sec">
    <div class="x-wrap">
      <div class="x-head" data-rv>
        <div><p class="x-eyebrow">Mest brukte standarder</p><h2 class="x-h2">Rett til standarden du trenger.</h2></div>
        <p class="x-lead">Alle størrelser, materialer og lagerstatus i én tabell. Ett klikk fra forsiden til riktig bolt.</p>
      </div>
      <div class="xh-stdgrid" data-note="N6">${stdCards}
        <button type="button" class="xh-sc xh-sc-more" data-act="focussearch" data-rv style="--rv:7">
          <div><span class="xh-sc-din">Finner du ikke standarden?</span><p>Søk i hele sortimentet, eller send oss en spesifikasjon.</p></div>
          <div class="xh-sc-foot"><span>13 000+ artikler</span><span class="x-arrow-c">${XI.arrS}</span></div>
        </button>
      </div>
    </div>
  </section>

  <section class="x-sec x-alt">
    <div class="x-wrap">
      <div class="x-head" data-rv>
        <div><p class="x-eyebrow">Produktkategorier</p><h2 class="x-h2">Hele sortimentet, <em>på hylla</em> i Sandnes.</h2></div>
        <a class="x-link" href="#/kategori/skruer-bolter">Se alle kategorier ${XI.arrS}</a>
      </div>
      <div class="xh-cats" data-note="N7">${cats}</div>
    </div>
  </section>

  <section class="x-sec">
    <div class="x-wrap xh-qo">
      <div data-rv>
        <p class="x-eyebrow">Hurtigordre</p>
        <h2 class="x-h2">Bestiller du de samme varene ofte?</h2>
        <p class="x-lead">Lim inn artikkelnumre eller last opp innkjøpslisten. Vi matcher hver linje mot lageret på sekunder, og det vi ikke finner går rett til en tekniker.</p>
        <div class="xh-ctas"><button type="button" class="x-btn x-btn-or" data-act="xqoexample">Prøv med en eksempelliste ${XI.arr}</button><a class="x-btn x-btn-ghost" href="#/konto">${lg?'Min konto':'Logg inn'}</a></div>
        ${welcome}
      </div>
      <div class="xh-term" data-note="N8" data-rv>
        <div class="xh-term-bar"><i></i><i></i><i></i><span>innkjopsliste.csv</span></div>
        <ol>${qoRows}</ol>
        <div class="xh-term-foot"><span>${qoOk} funnet · ${qoMulti} med flere treff · ${qoNone} til tekniker</span><span>${qo.length} linjer</span></div>
      </div>
    </div>
  </section>

  <section class="x-sec x-alt" id="tilbud">
    <div class="x-wrap">
      <div class="x-head" data-rv>
        <div><p class="x-eyebrow">Tilbud</p><h2 class="x-h2">Tre veier til riktig tilbud.</h2><p class="x-lead">Velg det som passer det du har i hånden: et produkt, en tegning eller en liste.</p></div>
        <div class="xh-dial" data-note="N4">
          <svg width="92" height="92" viewBox="0 0 92 92" aria-hidden="true"><circle cx="46" cy="46" r="40" fill="none" stroke="rgba(150,175,230,.18)" stroke-width="6"/><circle class="arc" cx="46" cy="46" r="40" fill="none" stroke="#ff6b1a" stroke-width="6" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset=".667" transform="rotate(-90 46 46)"/></svg>
          <div><b>20 min</b><span>Svar i åpningstiden.<br>Fullstendig tilbud innen 24 t.</span></div>
        </div>
      </div>
      <div class="xh-routes">
        <a class="xh-route prime" href="#/kategori/skruer-bolter" data-rv style="--rv:0"><span class="xh-route-n"><span>01</span><span>Mest brukt</span></span><span class="xh-route-ic">${XI.table}</span><h3>Jeg vet hva jeg trenger</h3><p>Finn produktene, velg antall og sertifikat, og send alt i én forespørsel.</p><span class="x-link">Finn produkter ${XI.arrS}</span></a>
        <a class="xh-route" href="#/spesialprodukt" data-rv style="--rv:1"><span class="xh-route-n"><span>02</span><span></span></span><span class="xh-route-ic">${XI.draw}</span><h3>Jeg har en tegning eller en gammel del</h3><p>Send tegning, bilde eller mål. En teknisk selger finner riktig produkt.</p><span class="x-link">Send spesifikasjon ${XI.arrS}</span></a>
        <a class="xh-route" href="#/hurtigordre" data-rv style="--rv:2"><span class="xh-route-n"><span>03</span><span></span></span><span class="xh-route-ic">${XI.list}</span><h3>Jeg har en innkjøpsliste</h3><p>Lange lister fra innkjøp eller stykkliste (BOM). Vi matcher linjene mot lageret.</p><span class="x-link">Last opp liste ${XI.arrS}</span></a>
      </div>
    </div>
  </section>

  <section class="x-sec">
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

  <section class="x-sec x-alt">
    <div class="x-wrap xh-sp">
      <div data-rv>
        <p class="x-eyebrow">Spesialprodukter</p>
        <h2 class="x-h2">Spesielle krav? <em>Det håndterer vi.</em></h2>
        <p class="x-lead">Våre spesialister håndterer komplekse, store volumer og spesialtilpassede feste- eller materialforespørsler med prioritet.</p>
        <ul class="xh-checks">
          <li>${XI.check}<span>Tegninger (PDF, DWG, DXF, STEP)</span></li>
          <li>${XI.check}<span>Bilde av delen du skal erstatte</span></li>
          <li>${XI.check}<span>Innkjøpsliste eller stykkliste (XLSX, CSV)</span></li>
          <li>${XI.check}<span>Krav til materiale og sertifikat</span></li>
        </ul>
        <a class="x-btn x-btn-or" href="#/spesialprodukt">Send forespørsel om spesialprodukt ${XI.arr}</a>
      </div>
      <a class="xh-drop" href="#/spesialprodukt" id="xdrop" data-note="N12" data-rv>
        <span class="xh-drop-ic">${XI.upload}</span>
        <strong>Slipp tegningen her</strong>
        <p>Eller klikk for å beskrive det du trenger.</p>
        <span class="xh-ftypes"><span>PDF</span><span>DWG</span><span>DXF</span><span>STEP</span><span>JPG</span><span>XLSX</span><span>CSV</span></span>
      </a>
    </div>
  </section>

  <section class="x-sec">
    <div class="x-wrap">
      <div class="x-head" data-rv>
        <div><p class="x-eyebrow">Hvorfor Industrisalg</p><h2 class="x-h2">Det som er spesial hos andre, er <em>standard hos oss.</em></h2></div>
        <p class="x-lead">I over 70 år har vi levert slitesterke festemidler, tydelige spesifikasjoner og leveranser du kan stole på.</p>
      </div>
      <div class="xh-cmp" data-note="N13" data-rv>
        <div class="xh-cmp-row xh-cmp-head"><div></div><div class="us">Industrisalg</div><div class="them">Andre leverandører</div></div>
        ${cmp}
      </div>
    </div>
  </section>

  <section class="x-sec x-alt">
    <div class="x-wrap">
      <div class="x-head" data-rv><div><p class="x-eyebrow">Kundene våre</p><h2 class="x-h2">«Vi kan ikke huske å ha fått nei.»</h2></div></div>
      <div class="xh-tms">${TESTIMONIALS.map((t,i)=>`<figure class="xh-tm" data-rv style="--rv:${i}"><div><span class="qm" aria-hidden="true">“</span><blockquote>${esc(t.q)}</blockquote></div><figcaption><b>${esc(t.who)}</b>${esc(t.co)}</figcaption></figure>`).join('')}</div>
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
  xadd(t){ addLines([{sku:t.dataset.sku,qty:1,cert:'2.1'}],'hero_search'); t.classList.add('done'); t.innerHTML=XI.check.replace('18','14').replace('18','14')+'<span>'+tr('Lagt til')+'</span>'; }
});

/* ---------- Design notes (shown in the prototype panel) ---------- */
const DESIGN_NOTES = {
  N1:['Search is the hero','Most B2B buyers arrive knowing the standard, size or item number. The search bar is the brightest element on a dark page, so the eye lands there first. Results appear while typing, with stock status and add-to-quote straight from the dropdown.'],
  N2:['One search box at a time','The header search stays hidden while the hero search is on screen and fades in once it scrolls away. Two identical search fields on one screen split attention.'],
  N3:['The buying flow in the first screen','A real product (DIN 933 A4-80 M12x40) sits on the engineering drawing with live stock and a one-click add. Visitors see how ordering works before they scroll.'],
  N4:['Honest, live response promise','The status line follows real opening hours (Mon to Fri 07 to 16, Norwegian time). Outside hours it switches to the on-call phone instead of promising a 20-minute reply.'],
  N5:['Proof in numbers','Five facts buyers care about, in one band: experience, stock, response time, quote time and no minimum order.'],
  N6:['Standards as data-sheet cards','Repeat buyers think in DIN numbers. Each card goes straight to a filterable size table, one click from the homepage.'],
  N7:['Category bento with real counts','Article counts come from the live category menu, so buyers see the depth of the range before clicking.'],
  N8:['Quick order, demonstrated','The list on the right is matched against the real catalogue on page load. "Try with an example list" runs the full quick-order flow with it.'],
  N9:['Returning-customer mode','Switch "Vis som" to logged-in customer: the quick-order block greets the company and offers a one-click reorder of the last order.'],
  N10:['Three quote paths','Buyers arrive with a product, a drawing or a list. Each has its own entry point, so nobody has to translate their need into the site\'s structure.'],
  N11:['Industry explorer','Twelve industries in one compact panel instead of twelve tiles. Hover or tab through to see focus, material and the standards each industry uses most.'],
  N12:['Drop a drawing anywhere','Dropping a file on this zone opens the special-product form with the file already attached. One gesture instead of four steps.'],
  N13:['Comparison framed as standard vs special','The brand line "special elsewhere, standard here" becomes the argument, with Industrisalg\'s column visually highlighted.'],
  N14:['Contact without friction','Short form, files allowed, live opening status above it, and a phone band in the footer on every page.'],
  N15:['Design system','Dark steel palette with the signature orange used only for actions and highlights. Archivo for display, DM Sans for reading, IBM Plex Mono for specs. Motion respects reduced-motion settings.'],

  C1:['The standard as a product, not a folder','The header reads like a data sheet: DIN and ISO equivalent, how many sizes are in stock right now, materials, single-piece buying and certificates. Buyers know they are in the right place before they scroll.'],
  C2:['Filters that match how buyers narrow down','Material, diameter, length range and grade, each with live counts. Active filters show as removable chips above the table, with an in-stock-only switch.','.filters'],
  C3:['Order straight from the table','Every row has diameter, length, pitch, grade, live stock, a quantity field and an add button. Buyers who know the size never need to open a product page.','#results'],
  C4:['Persistent basket rail','After the first add, a slim basket column stays on screen with every line, so buyers keep browsing while seeing what they have collected.','#minicart'],

  S1:['Search that reads buyer shorthand','DIN or ISO numbers, M10x30, 10x30, A4, A2 and product words are understood. The line under the title shows how the query was interpreted.','#main h1'],
  S2:['Results as a buyable table','Same data-sheet table and filters as the standard pages, so search results can be ordered directly.','#results'],

  P1:['One clear primary action','Visitors add to the quote request, logged-in customers add to their order with their own price. Stock, same-day dispatch and certificate sit right above the button.','.buybox'],
  P2:['Certificate chosen on the product','2.1 is included, 3.1 can be selected per line. The choice follows the line into the quote or order.','.certopts'],
  P3:['Complete the joint','Matching nut, washer and Nord-Lock in the same material and size, added in one click with quantities matched to the bolt. Raises order value while saving the buyer time.','.joint'],
  P4:['Photo plus technical drawing','A real photo and a dimensioned schematic per standard, so every size has a clear image.','.drawing'],
  P5:['Specs a technician would ask for','Standard, diameter, length, pitch, material, grade and pack size in a compact data-sheet table.','.specs'],

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

/* ---------- English for the new copy ---------- */
(function(){
  const add={
    'Konsept':'Concept','Snarveier':'Shortcuts','Designtanker':'Design notes',
    'Åpent nå · svar innen 20 minutter':'Open now · reply within 20 minutes',
    'Stengt nå · vakttelefon 477 09 806':'Closed now · on-call phone 477 09 806',
    'Norges fremste spesialist på':"Norway's leading specialist in",'festemateriell.':'fasteners.',
    'Søk etter DIN, mål, materiale eller artikkelnr.':'Search by DIN, size, material or item no.',
    'Søk':'Search','Populært':'Popular',
    'Be om tilbud':'Request a quote','Last opp innkjøpsliste':'Upload a purchase list',
    'Kjøp ned til enkeltstykk':'Buy down to a single piece','Sendes samme dag fra Sandnes':'Ships same day from Sandnes','2.1 og 3.1 materialsertifikat':'2.1 and 3.1 material certificates',
    'Legg i forespørsel':'Add to quote','Legg i bestilling':'Add to order','Lagt til':'Added',
    'Teknisk tegning av en bolteforbindelse M12':'Technical drawing of an M12 bolted joint',
    'BOLTEFORBINDELSE M12×40':'BOLTED JOINT M12×40','SKALA 1:1':'SCALE 1:1',
    'års erfaring':'years of experience','artikler på lager i Sandnes':'items in stock in Sandnes','svartid i åpningstiden':'response time in opening hours','til fullstendig tilbud':'to a complete quote','minste kjøp, ingen minstekvantum':'minimum purchase, no minimum quantity',
    'min':'min','t':'h','stk':'pcs',
    'Mest brukte standarder':'Most used standards','Rett til standarden du trenger.':'Straight to the standard you need.',
    'Alle størrelser, materialer og lagerstatus i én tabell. Ett klikk fra forsiden til riktig bolt.':'Every size, material and stock status in one table. One click from the homepage to the right bolt.',
    'Finner du ikke standarden?':"Can't find the standard?",'Søk i hele sortimentet, eller send oss en spesifikasjon.':'Search the full range, or send us a specification.','13 000+ artikler':'13,000+ items',
    'Produktkategorier':'Product categories','Hele sortimentet,':'The full range,','på hylla':'on the shelf','i Sandnes.':'in Sandnes.','Se alle kategorier':'See all categories',
    'Hurtigordre':'Quick order','Bestiller du de samme varene ofte?':'Do you often order the same items?',
    'Lim inn artikkelnumre eller last opp innkjøpslisten. Vi matcher hver linje mot lageret på sekunder, og det vi ikke finner går rett til en tekniker.':'Paste item numbers or upload your purchase list. We match every line against stock in seconds, and anything we cannot find goes straight to a technician.',
    'Prøv med en eksempelliste':'Try with an example list','Min konto':'My account','Logg inn':'Log in',
    'Funnet':'Found','Velg variant':'Choose variant','Tekniker':'Technician','Sendes til tekniker':'Sent to a technician',
    'Velkommen tilbake, Eksempel Verksted AS':'Welcome back, Eksempel Verksted AS','Bestill på nytt':'Reorder',
    'Tilbud':'Quotes','Tre veier til riktig tilbud.':'Three ways to the right quote.',
    'Velg det som passer det du har i hånden: et produkt, en tegning eller en liste.':'Pick the one that fits what you have: a product, a drawing or a list.',
    '20 min':'20 min','Svar i åpningstiden.':'Reply in opening hours.','Fullstendig tilbud innen 24 t.':'Complete quote within 24 h.',
    'Mest brukt':'Most used','Jeg vet hva jeg trenger':'I know what I need','Finn produktene, velg antall og sertifikat, og send alt i én forespørsel.':'Find the products, choose quantity and certificate, and send it all in one request.','Finn produkter':'Find products',
    'Jeg har en tegning eller en gammel del':'I have a drawing or an old part','Send tegning, bilde eller mål. En teknisk selger finner riktig produkt.':'Send a drawing, photo or measurements. A technical salesperson finds the right product.','Send spesifikasjon':'Send specification',
    'Jeg har en innkjøpsliste':'I have a purchase list','Lange lister fra innkjøp eller stykkliste (BOM). Vi matcher linjene mot lageret.':'Long lists from purchasing or a bill of materials (BOM). We match the lines against stock.','Last opp liste':'Upload list',
    'Bransjeløsninger':'Industry solutions','Bygget for bransjen din.':'Built for your industry.','Tolv bransjer, hver med sine krav til materiale, sertifikat og leveringstid.':'Twelve industries, each with its own requirements for material, certificates and delivery time.',
    'Bransje':'Industry','Fokus':'Focus','Materiale':'Material','Mest brukt':'Most used','Se bransjeløsningen':'See the industry solution','Send forespørsel':'Send request',
    'Spesialprodukter':'Special products','Spesielle krav?':'Special requirements?','Det håndterer vi.':'We handle it.',
    'Våre spesialister håndterer komplekse, store volumer og spesialtilpassede feste- eller materialforespørsler med prioritet.':'Our specialists handle complex, high-volume and custom fastener or material requests with priority.',
    'Slipp tegningen her':'Drop your drawing here','Eller klikk for å beskrive det du trenger.':'Or click to describe what you need.',
    'Hvorfor Industrisalg':'Why Industrisalg','Det som er spesial hos andre, er':'What is special elsewhere is','standard hos oss.':'standard with us.',
    'I over 70 år har vi levert slitesterke festemidler, tydelige spesifikasjoner og leveranser du kan stole på.':'For more than 70 years we have delivered durable fasteners, clear specifications and deliveries you can rely on.',
    'Industrisalg':'Industrisalg','Andre leverandører':'Other suppliers',
    'Kundene våre':'Our customers','«Vi kan ikke huske å ha fått nei.»':'“We cannot remember ever being told no.”',
    'Ofte stilte spørsmål':'Frequently asked questions','Svar før du spør.':'Answers before you ask.',
    'Kontakt oss i dag':'Contact us today','Fortell oss hva du trenger. Legg gjerne ved tegning eller liste.':'Tell us what you need. Feel free to attach a drawing or list.',
    'Trenger du hjelp nå?':'Need help now?','Snakk med en spesialist på festemateriell.':'Talk to a fastener specialist.',
    'Mandag til fredag 07:00 til 16:00. Akutt utenom kontortid: vakttelefon.':'Monday to Friday 07:00 to 16:00. Urgent outside office hours: on-call phone.',
    'Sentralbord':'Switchboard','Vakttelefon':'On-call phone','Siden 1953':'Since 1953','Konsept av Kilowott':'Concept by Kilowott',
    'filer lagt ved':'files attached',
    'Steg':'Steps','Produkter':'Products','Kontaktinfo':'Contact details','Levering':'Delivery','Bekreftelse':'Confirmation','Svar innen 20 min':'Reply within 20 min',
    'Referanse':'Reference','Oppgi referansen hvis du kontakter oss.':'Quote this reference if you contact us.',
    'på lager nå':'in stock now','materialer':'materials','Tilsvarer':'Equivalent to','Ned til':'Down to','sertifikat':'certificate',
    'Designtanker':'Design notes'
  };
  for(const [k,v] of Object.entries(add)){ if(!(k in EN)) EN[k]=v; EN_LC[k.toLowerCase()]=EN[k]; }
  RULES.unshift([/^(\d[\d\s ]*) artikler$/,(m,a)=>`${a.trim()} items`]);
  RULES.unshift([/^Siste ordre (.+)$/,(m,a)=>`Last order ${a}`]);
  RULES.unshift([/^(\d+) funnet · (\d+) med flere treff · (\d+) til tekniker$/,(m,a,b,c)=>`${a} found · ${b} with several matches · ${c} to a technician`]);
  RULES.unshift([/^(\d+) linjer$/,(m,a)=>`${a} lines`]);
  RULES.unshift([/^(\d+) treff$/,(m,a)=>`${a} matches`]);
  RULES.unshift([/^Bransje (\d+) \/ (\d+)$/,(m,a,b)=>`Industry ${a} / ${b}`]);
})();

/* ---------- Design notes overview (#/endringer) ---------- */
const XNOTE_GROUPS=[['Forside',['N1','N2','N3','N4','N5','N6','N7','N8','N9','N10','N11','N12','N13','N14','N15']],
  ['Standard og kategori',['C1','C2','C3','C4']],['Søk',['S1','S2']],['Produkt',['P1','P2','P3','P4','P5']],
  ['Forespørsel og bestilling',['B1','B2','B3','F1']],['Hurtigordre',['Q1','Q2']],['Spesialprodukt og kontakt',['E1','E2','K1']],
  ['Konto',['A1']],['Bransjesider',['I1','I2']]];
function viewFixes(){
  document.title='Designtanker | Industrisalg 2.0';
  return `<div class="wrap section"><div class="kicker">Industrisalg 2.0</div><h1>Designtanker</h1>
    <p class="muted" style="max-width:62ch">Why each part of the concept works the way it does. Open a page and use the Designtanker button to see the notes in place.</p>
    ${XNOTE_GROUPS.map(([no,ids])=>`<h2 style="margin-top:40px">${esc(no)}</h2><div class="xn-grid">${ids.map(k=>`<div class="xn-card"><b><i>${k}</i>${esc(DESIGN_NOTES[k][0])}</b><p>${esc(DESIGN_NOTES[k][1])}</p></div>`).join('')}</div>`).join('')}</div>`;
}
