
/* ===================== SHARED SNIPPETS ===================== */
const TESTIMONIALS = [
  {q:'Bredt sortiment og korte leveringstider. Vi kan ikke huske å ha fått nei på en forespørsel.', name:'Thomas Berg', who:'Prosjektleder, ship service', co:'Vestvik Skipsservice AS'},
  {q:'Hver eneste skrue følges opp til den er i havn hos oss. Presisjon, leveringssikkerhet og kvalitet.', name:'Ingrid Solheim', who:'Innkjøpsleder, oppdrett', co:'Nordhav Oppdrett AS'},
  {q:'Løsningsorienterte, kort responstid og alltid hjelpsomme. Det som ikke lagerføres, skaffes raskt.', name:'Arne Lunde', who:'Salg og innkjøp, olje og energi', co:'Kystlinje Energi AS'}
];
function testimonialCard(t){ return `<figure class="quote" data-fix="T3"><blockquote>«${esc(t.q)}»</blockquote><figcaption class="who"><b>${esc(t.who)}</b><br>${esc(t.co)}</figcaption></figure>`; }
const ICON_CHECK = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>';

/* ===================== HOME ===================== */
function viewHome(){
  const stdKeys=['931','933','912','934','985','125','NL'];
  const stdChips = stdKeys.map(k=>{const s=STANDARDS[k]; const n=PRODUCTS.filter(p=>p.std===k).length;
    return `<a class="stdchip" href="#/kategori/${s.slug}"><b>${s.din}</b><span>${esc(s.name)}</span><span class="small muted">${n} varianter${s.iso?' · '+s.iso:''}</span></a>`;}).join('');
  return `
  <section class="hero">
    <div class="wrap">
      <h1>Norges fremste spesialist på festemateriell</h1>
      <p class="lead">Det som er spesial hos andre, kan gjerne være standard hos INDUSTRISALG.</p>
      <div class="herosearch" data-fix="D6" role="search">
        <label for="hq" class="sr">Søk etter produkt, standard eller artikkelnummer</label>
        <input id="hq" type="text" autocomplete="off" placeholder="Søk: DIN 933 M10x30, A4, artikkelnr.">
        <button type="button" data-act="herosearch" aria-label="Søk"><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M10.5 3a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15zM16 16l5 5"/></svg></button>
      </div>
      <div class="actions" data-fix="H1">
        <button type="button" class="btn btn-primary" data-act="herosearch">Finn produkt</button>
        <a class="btn btn-light" href="#/kurv">Be om tilbud</a>
      </div>
      <p class="note">Bakgrunnsvideoen fra dagens forside beholdes her.</p>
    </div>
  </section>
  <div class="truststrip" data-fix="H2"><ul class="trust wrap">
    <li>${ICON_CHECK}70+ års erfaring</li>
    <li data-fix="T2">${ICON_CHECK}13 000+ artikler på lager i Sandnes</li>
    <li>${ICON_CHECK}Kjøp ned til enkeltstykk</li>
    <li>${ICON_CHECK}ISO 9001:2015 og Magnet JQS</li>
    <li>${ICON_CHECK}Vakttelefon utenom kontortid</li>
  </ul></div>

  <section class="section">
    <div class="wrap">
      <h2>Mest brukte standarder</h2>
      <p class="muted">Gå rett til standarden du trenger. Alle størrelser, materialer og lagerstatus i én tabell.</p>
      <div class="stdchips" data-fix="H3">${stdChips}</div>
    </div>
  </section>

  <section class="section alt">
    <div class="wrap">
      <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px"><h2>Produktkategorier</h2><a href="#/kategori/skruer-bolter">Se alle kategorier</a></div>
      <div class="tiles cattiles">${CATEGORIES.map(c=>`<a class="tile" href="#/kategori/${c.slug}" ${c.slug==='muttere'?'data-fix="T4"':''}><span class="art ${CAT_PHOTO[c.slug]?'photo':''}">${catIcon(c)}</span><strong>${esc(c.name)}</strong></a>`).join('')}</div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="strip" data-fix="H6">
        <div><h3 style="margin:0 0 4px;color:#fff">Bestiller du de samme varene ofte?</h3><p>Lim inn artikkelnumre eller last opp innkjøpslisten, eller bestill på nytt fra ordrehistorikken.</p></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn-primary" href="#/hurtigordre">Hurtigordre</a><a class="btn btn-light" href="#/konto">${S.loggedIn?'Min konto':'Logg inn'}</a></div>
      </div>
    </div>
  </section>

  <section class="section alt" id="tilbud">
    <div class="wrap">
      <h2>Trenger du et tilpasset tilbud?</h2>
      <p class="muted" data-fix="T1">Vi svarer innen 20 minutter i åpningstiden og sender fullstendig tilbud innen 24 timer.</p>
      <div class="routes" data-fix="E3">
        <div class="route"><h3>Tilbud på produkter</h3><p>Du vet hva du trenger. Legg produktene i forespørselen og velg antall og sertifikat.</p><a class="btn btn-brand" href="#/kategori/skruer-bolter">Finn produkter</a></div>
        <div class="route"><h3>Finn et spesialprodukt</h3><p>Har du en tegning, et bilde eller en gammel del? Send det til vår tekniske selger.</p><a class="btn btn-brand" href="#/spesialprodukt">Send spesifikasjon</a></div>
        <div class="route"><h3>Last opp innkjøpsliste</h3><p>Lange lister fra innkjøp eller stykkliste (BOM). Vi matcher linjene mot lageret.</p><a class="btn btn-brand" href="#/hurtigordre">Last opp liste</a></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <h2>Bransjeløsninger</h2>
      <div class="tiles" data-fix="H4">${INDUSTRIES.map(i=>`<a class="tile" href="#/bransje/${i.slug}"><strong>${esc(i.name)}</strong><span class="small muted">${esc(i.intro)}</span></a>`).join('')}</div>
    </div>
  </section>

  <section class="section alt">
    <div class="wrap two">
      <div>
        <h2>Spesielle krav? Det håndterer vi.</h2>
        <p>Vi leverer mer enn standardbestillinger fra lager. Våre spesialister håndterer komplekse, store volumer og spesialtilpassede feste- eller materialforespørsler med prioritet. Fortell oss hva du trenger, så følger teamet opp med et skreddersydd tilbud.</p>
        <a class="btn btn-brand" href="#/spesialprodukt">Send forespørsel om spesialprodukt</a>
      </div>
      <div class="card"><h3>Dette kan du sende oss</h3><ul><li>Tegninger (PDF, DWG, DXF, STEP)</li><li>Bilde av delen du skal erstatte</li><li>Innkjøpsliste eller stykkliste (XLSX, CSV)</li><li>Krav til materiale og sertifikat</li></ul></div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <h2>Hvorfor velge Industrisalg?</h2>
      <p class="muted">I over 70 år har vi levert slitesterke festemidler, tydelige spesifikasjoner og leveranser du kan stole på, støttet av ISO 9001 kvalitetsstyring.</p>
      <div class="scrollx"><table class="cmp">
        <thead><tr><th></th><th>INDUSTRISALG</th><th>Andre leverandører</th></tr></thead>
        <tbody>
          <tr><td>Etablert og erfaren</td><td>Familiedrevet siden 1953, 70+ år med festemateriell</td><td>Ofte generalister uten samme dybdekunnskap</td></tr>
          <tr data-fix="T2"><td>Lager på hylla</td><td>13 000+ artikler på lager i Sandnes</td><td>Venter på bestilling fra grossist eller utlandet</td></tr>
          <tr><td>Kjøp akkurat det du trenger</td><td>Vi bryter pakker, kjøp ned til enkeltskruen</td><td>Tvunget til minimumskvanta og fulle esker</td></tr>
          <tr><td>Tilgjengelighet</td><td>Vakttelefon utenom kontortid</td><td>Stengt etter 16:00</td></tr>
          <tr data-fix="T1"><td>Hurtig respons</td><td>Svar innen 20 minutter i åpningstiden, fullstendig tilbud innen 24 timer</td><td>Svar innen 48 timer</td></tr>
          <tr><td>Kvalitetssystem</td><td>ISO 9001:2015-sertifisert og Magnet JQS-registrert</td><td>Ofte ad hoc-kontroll uten sporbarhet</td></tr>
          <tr><td>Materialsertifikater</td><td>2.1 per ordre, 3.1 på det meste av lageret</td><td>Ikke alltid mulig å fremskaffe</td></tr>
        </tbody></table></div>
    </div>
  </section>

  <section class="section alt">
    <div class="wrap">
      <h2>Dette sier kundene våre</h2>
      <div class="quotes">${TESTIMONIALS.map(testimonialCard).join('')}</div>
    </div>
  </section>

  <section class="section" id="faq">
    <div class="wrap two">
      <div>
        <h2>Ofte stilte spørsmål</h2>
        <details class="faq"><summary>Kan jeg få et tilbud på flere produkter samtidig?</summary><p>Ja. Legg produktene i forespørselen, eller lim inn hele listen i hurtigordre.</p></details>
        <details class="faq"><summary>Hva om jeg ikke finner produktet jeg leter etter?</summary><p>Sortimentet vårt er bredere enn nettbutikken. <a href="#/spesialprodukt">Send oss spesifikasjon, tegning eller bilde</a>, eller ring 51 63 78 00.</p></details>
        <details class="faq"><summary>Kan jeg kjøpe enkeltstykker?</summary><p>Ja. Vi bryter pakker og selger ned til enkeltskruen. Ingen minstekjøp.</p></details>
        <details class="faq"><summary>Kan jeg få materialsertifikat?</summary><p>2.1-sertifikat følger hver ordre. 3.1 er tilgjengelig på det meste av lageret og velges per produkt.</p></details>
        <details class="faq"><summary>Hvor raskt leverer dere?</summary><p>Lagervarer sendes eller hentes samme dag. Lagerstatus vises per produkt. Ved akutte behov utenom kontortid: vakttelefon 477 09 806.</p></details>
        <details class="faq" data-fix="T4"><summary>Er nettbutikken kun for bedriftskunder?</summary><p>Vi er en B2B-grossist og fokuserer på bedriftsmarkedet, men hjelper også privatkunder ved spesielle behov.</p></details>
      </div>
      <div class="card"><h2 style="font-size:1.4rem">Kontakt oss i dag</h2>${enquiryForm('contact',{compact:true})}</div>
    </div>
  </section>`;
}

/* ===================== CATEGORY / SEARCH ===================== */
let UI = {fkey:null, f:null, sheet:false};
function freshFilters(){ return {mat:[], d:[], g:[], lmin:'', lmax:'', stock:false, sort:'dim', size:50, page:1}; }
function applyFilters(items,f,skip){
  return items.filter(p=>(skip==='mat'||!f.mat.length||f.mat.includes(p.mat))
    &&(skip==='d'||!f.d.length||f.d.includes(p.d))
    &&(skip==='g'||!f.g.length||f.g.includes(p.grade))
    &&(!f.lmin||p.L==null||p.L>=+f.lmin)&&(!f.lmax||p.L==null||p.L<=+f.lmax)
    &&(!f.stock||p.stock>0));
}
function sortItems(items,sort){
  const a=[...items];
  const dim=(x,y)=>x.std.localeCompare(y.std)||x.mat.localeCompare(y.mat)||x.d-y.d||(x.L||0)-(y.L||0);
  if(sort==='stock') a.sort((x,y)=>y.stock-x.stock||dim(x,y));
  else if(sort==='art') a.sort((x,y)=>x.sku.localeCompare(y.sku));
  else if(sort==='plh') a.sort((x,y)=>x.price-y.price);
  else if(sort==='phl') a.sort((x,y)=>y.price-x.price);
  else a.sort(dim);
  return a;
}
function facet(items,f,key,getter,labeler,name){
  const base=applyFilters(items,f,key); const counts={};
  base.forEach(p=>{const v=getter(p); counts[v]=(counts[v]||0)+1;});
  const all=[...new Set(items.map(getter))].sort((a,b)=>typeof a==='number'?a-b:String(a).localeCompare(String(b)));
  return `<h3>${name}</h3><ul class="optlist">${all.map(v=>`<li><label><span><input type="checkbox" data-filter="${key}" value="${esc(v)}" ${f[key].includes(v)?'checked':''}>${esc(labeler(v))}</span><span class="muted small">${counts[v]||0}</span></label></li>`).join('')}</ul>`;
}
function filterPanel(items,f){
  const hasLen=items.some(p=>p.L);
  return `<aside class="filters ${UI.sheet?'open':''}" id="filters" data-fix="X1" aria-label="Filtre">
    <div class="sheetbar"><strong>Filtre</strong><button type="button" class="btn btn-sm btn-ghost" data-act="closefilters">Vis treff</button></div>
    <label class="switch" data-fix="D8"><input type="checkbox" data-filter="stock" ${f.stock?'checked':''}> Kun varer på lager</label>
    <div data-fix="D1">
    ${facet(items,f,'mat',p=>p.mat,v=>MATERIALS[v].name,'Materiale')}
    ${facet(items,f,'d',p=>p.d,v=>'M'+v,'Diameter')}
    </div>
    ${hasLen?`<div data-fix="D2"><h3>Lengde (mm)</h3><div class="range"><input type="number" inputmode="numeric" placeholder="Fra" aria-label="Lengde fra" data-filter="lmin" value="${esc(f.lmin)}"><span>til</span><input type="number" inputmode="numeric" placeholder="Til" aria-label="Lengde til" data-filter="lmax" value="${esc(f.lmax)}"></div></div>`:''}
    ${facet(items,f,'g',p=>p.grade,v=>v,'Fasthetsklasse')}
    <p style="margin-top:14px"><button type="button" class="linkbtn" data-act="resetfilters">Nullstill filtre</button></p>
  </aside>`;
}
function productRows(list){
  return list.map(p=>`<tr>
    <td class="name"><div class="pn">${thumb(p)}<div><a href="${productUrl(p)}">${esc(p.label)}</a><div class="small muted">${p.sku}</div></div></div></td>
    <td class="c-key" data-fix="K3"><b>M${p.d}</b></td>
    <td class="c-key">${p.L?p.L+' mm':'–'}</td>
    <td class="c-hide">${pitchOf(p)}</td>
    <td class="c-hide">${esc(matOf(p).name)}</td>
    <td class="c-hide">${esc(p.grade)}</td>
    <td>${stockHtml(p)}</td>
    ${S.loggedIn?`<td><b>${fmtNOK(p.price)}</b><div class="small muted">per stk</div></td>`:''}
    <td>${qtyBox('q_'+p.sku,1,'Antall '+p.label)}</td>
    <td><button type="button" class="btn btn-primary btn-sm" data-act="add" data-sku="${p.sku}" data-qty="#q_${p.sku}" aria-label="${esc(primaryLabel()+': '+p.label)}">${S.loggedIn?'Legg til':'Legg til'}</button></td>
  </tr>`).join('');
}
function resultsBlock(items,f,ctx){
  const filtered=sortItems(applyFilters(items,f),f.sort);
  const pages=Math.max(1,Math.ceil(filtered.length/f.size)); if(f.page>pages) f.page=pages;
  const pageItems=filtered.slice((f.page-1)*f.size, f.page*f.size);
  const chips=[];
  if(f.stock) chips.push(['stock','','Kun på lager']);
  f.mat.forEach(v=>chips.push(['mat',v,MATERIALS[v].name]));
  f.d.forEach(v=>chips.push(['d',v,'M'+v]));
  f.g.forEach(v=>chips.push(['g',v,v]));
  if(f.lmin||f.lmax) chips.push(['len','','Lengde '+(f.lmin||'0')+' til '+(f.lmax||'maks')+' mm']);
  const sortOpts=[['dim','Dimensjon'],['stock','Lagerbeholdning'],['art','Artikkelnummer']].concat(S.loggedIn?[['plh','Pris: lav til høy'],['phl','Pris: høy til lav']]:[]);
  return `
  <div class="toolbar">
    <div><b>${fmtInt(filtered.length)}</b> produkter <button type="button" class="btn btn-sm btn-ghost mfilter" data-act="openfilters">Filtre${chips.length?' ('+chips.length+')':''}</button></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap" >
      <label class="small" style="display:flex;gap:6px;align-items:center;margin:0" data-fix="D4">Sorter <select data-filter="sort">${sortOpts.map(([v,l])=>`<option value="${v}" ${f.sort===v?'selected':''}>${l}</option>`).join('')}</select></label>
      <label class="small" style="display:flex;gap:6px;align-items:center;margin:0" data-fix="D3">Vis <select data-filter="size">${[25,50,100].map(n=>`<option ${f.size===n?'selected':''}>${n}</option>`).join('')}</select> per side</label>
    </div>
  </div>
  ${chips.length?`<div class="chips" data-fix="D8">${chips.map(([k,v,l])=>`<button type="button" class="fchip" data-act="clrf" data-k="${k}" data-v="${esc(v)}" aria-label="Fjern filter ${esc(l)}">${esc(l)} ✕</button>`).join('')}</div>`:''}
  ${filtered.length? `<div class="scrollx" data-fix="D3"><table class="ptable"><thead><tr><th>Produkt</th><th>Diameter</th><th>Lengde</th><th>Stigning</th><th>Materiale</th><th>Kvalitet</th><th>Lager</th>${S.loggedIn?'<th>Din pris</th>':''}<th>Antall (stk)</th><th></th></tr></thead><tbody>${productRows(pageItems)}</tbody></table></div>
    ${pages>1?`<nav class="pager" aria-label="Sider">${Array.from({length:pages},(_,i)=>`<button type="button" data-act="page" data-p="${i+1}" ${f.page===i+1?'aria-current="page"':''}>${i+1}</button>`).join('')}</nav>`:''}`
   : emptyState(ctx)}`;
}
function emptyState(ctx){
  return `<div class="empty" data-fix="D7"><h3>${ctx&&ctx.q?'Ingen treff på «'+esc(ctx.q)+'»':'Ingen produkter matcher filtrene'}</h3>
    <p class="muted">${ctx&&ctx.q?'Sjekk skrivemåten, eller søk på standard og dimensjon, for eksempel «DIN 933 M10x30».':'Fjern ett eller flere filtre for å se flere produkter.'}</p>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      ${ctx&&ctx.q?'':'<button type="button" class="btn btn-ghost" data-act="resetfilters">Nullstill filtre</button>'}
      <a class="btn btn-ghost" href="#/">Se standarder</a>
      <a class="btn btn-brand" href="#/spesialprodukt${ctx&&ctx.q?'?spec='+encodeURIComponent(ctx.q):''}">La en tekniker finne produktet</a>
    </div></div>`;
}
function viewCategory(slug){
  let title, items, crumbs=[['#/','Hjem']], intro='', subs='', std=STD_BY_SLUG[slug], cat;
  if(std){
    const s=STANDARDS[std]; cat=CATEGORIES.find(c=>c.slug===s.cat);
    title=`${s.din} ${s.iso?'('+s.iso+') ':''}${s.name}`; items=PRODUCTS.filter(p=>p.std===std);
    crumbs.push(['#/kategori/'+cat.slug,cat.name]); intro=s.desc;
    document.title=`${s.din} ${s.name.toLowerCase()} | Industrisalg`;
  } else {
    cat=CATEGORIES.find(c=>c.slug===slug)||CATEGORIES[0];
    title=cat.name; items=PRODUCTS.filter(p=>cat.subs.includes(p.std));
    subs=cat.subs.length?`<div class="tiles" style="margin:0 0 24px">${cat.subs.map(k=>{const s=STANDARDS[k];return `<a class="tile" href="#/kategori/${s.slug}"><span class="art ${STD_PHOTO[k]?'photo':''}">${STD_PHOTO[k]?photo(STD_PHOTO[k],'',s.din+' '+s.name):drawing(s.kind,k,false)}</span><strong>${s.din}</strong><span class="small muted">${esc(s.name)}</span><span class="tilecta" data-fix="K4">Se produkt · ${PRODUCTS.filter(p=>p.std===k).length} varianter</span></a>`;}).join('')}</div>`:'';
    document.title=`${cat.name} | Industrisalg`;
  }
  const key='cat:'+slug; if(UI.fkey!==key){UI.fkey=key; UI.f=freshFilters(); UI.sheet=false;}
  const crumbHtml=crumbs.map(([h,l])=>`<a href="${h}">${esc(l)}</a> / `).join('')+esc(title);
  if(!items.length) return `<div class="wrap"><div class="crumbs">${crumbHtml}</div><h1>${esc(title)}</h1>${emptyStateNoData(cat)}</div>`;
  return `<div class="wrap">
    <div class="crumbs">${crumbHtml}</div>
    ${std?`<div class="xs-head" data-note="C1"><div><div class="kicker" data-fix="K4">Produkt · ${items.length} varianter</div><h1>${esc(title)}</h1>${intro?`<p class="muted" style="max-width:70ch;margin:0">${esc(intro)}</p>`:''}
      <ul class="xs-facts"><li class="ok"><b>${fmtInt(items.filter(p=>p.stock>0).length)}</b> på lager nå</li><li><b>${STANDARDS[std].mats.length}</b> materialer</li>${STANDARDS[std].iso?`<li>Tilsvarer <b>${esc(STANDARDS[std].iso)}</b></li>`:''}<li>Ned til <b>1 stk</b></li><li><b>2.1</b> / <b>3.1</b> sertifikat</li></ul></div>
      <div class="xs-art" aria-hidden="true">${drawing(STANDARDS[std].kind,std,true)}</div></div>`
    :`<h1>${esc(title)}</h1>${intro?`<p class="muted" style="max-width:70ch">${esc(intro)}</p>`:''}`}
    ${subs}
    <div class="catlayout" id="catlayout">${filterPanel(items,UI.f)}<div id="results">${resultsBlock(items,UI.f)}</div></div>
  </div>`;
}
function emptyStateNoData(cat){
  return `<div class="empty"><h3>${esc(cat.name)}</h3><p class="muted">Denne kategorien har ikke eksempeldata i prototypen. Kategorisidene bruker samme tabell og filtre som Skruer / Bolter, Skiver og Muttere.</p><a class="btn btn-brand" href="#/kategori/skruer-bolter">Se Skruer / Bolter</a></div>`;
}
function viewSearch(q){
  const items=searchProducts(q); const desc=describeQuery(q);
  const key='search:'+q; if(UI.fkey!==key){UI.fkey=key; UI.f=freshFilters(); UI.sheet=false;}
  document.title=`Søk: ${q} | Industrisalg`;
  if(!items.length) track('search_zero_results',{search_term:q});
  else track('view_search_results',{search_term:q, results:items.length});
  return `<div class="wrap"><div class="crumbs"><a href="#/">Hjem</a> / Søk</div>
    <h1>Søk: «${esc(q)}»</h1>${desc?`<p class="muted" data-fix="D6">Vi tolket søket som: <b>${esc(desc)}</b></p>`:''}
    ${items.length?`<div class="catlayout">${filterPanel(items,UI.f)}<div id="results">${resultsBlock(items,UI.f,{q})}</div></div>`:emptyState({q})}
  </div>`;
}
