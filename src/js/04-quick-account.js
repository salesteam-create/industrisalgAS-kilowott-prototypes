
/* ===================== QUICK ORDER ===================== */
const QO_EXAMPLE = [
  fp('933','A4',10,30).sku+';200',
  'DIN 934 A4 M10 200',
  'din 125 a4 m10 400',
  'ISO 4014 ELF M16x80 50',
  'Nordlock M16 50',
  'DIN 912 M8x25 100',
  'Gjengestang M24 trapes 4'
].join('\n');
UI.qo = UI.qo || null; UI.qoText = UI.qoText || '';
function parseOrderLines(text){
  return text.split(/\r?\n/).map(l=>l.trim()).filter(l=>l && !/^(art|vare|sku|item|produkt)/i.test(l)).map(line=>{
    let desc=line, qty=1;
    const m=line.match(/^(.*?)[\s;,\t]+(\d{1,6})\s*(stk)?$/i);
    if(m && m[1].trim()){ desc=m[1].trim(); qty=+m[2]; }
    desc=desc.replace(/[;\t]+/g,' ');
    const matches=searchProducts(desc);
    return {line, desc, qty, matches:matches.slice(0,12).map(p=>p.sku), total:matches.length, pick: matches.length===1?matches[0].sku:null};
  });
}
function viewQuick(){
  document.title='Hurtigordre | Industrisalg';
  const rows = UI.qo ? UI.qo.map((r,i)=>{
    let status, interp;
    if(r.total===1){ const p=BY_SKU[r.pick]; interp=`<a href="${productUrl(p)}">${esc(p.label)}</a><div class="small">${stockHtml(p)}</div>`; status='<span class="badge ok">Funnet</span>'; }
    else if(r.total>1){ interp=`<label class="sr" for="qp${i}">Velg variant</label><select id="qp${i}" data-qopick="${i}"><option value="">Velg blant ${r.total} treff${r.total>12?' (viser 12)':''}</option>${r.matches.map(s=>`<option value="${s}" ${r.pick===s?'selected':''}>${esc(BY_SKU[s].label)}${BY_SKU[s].stock?'':' (bestillingsvare)'}</option>`).join('')}</select>`; status= r.pick?'<span class="badge ok">Valgt</span>':'<span class="badge warn">Velg variant</span>'; }
    else { interp=`<span class="muted">Ingen match i katalogen</span>`; status='<span class="badge warn">Sendes til tekniker</span>'; }
    return `<tr><td><code>${esc(r.line)}</code></td><td>${interp}</td><td><input type="number" min="1" value="${r.qty}" data-qoqty="${i}" style="width:90px;min-height:38px" aria-label="Antall"></td><td>${status}</td></tr>`;
  }).join('') : '';
  const ready = UI.qo ? UI.qo.filter(r=>r.pick).length : 0;
  const unmatched = UI.qo ? UI.qo.filter(r=>!r.total).length : 0;
  return `<div class="wrap"><div class="crumbs"><a href="#/">Hjem</a> / Hurtigordre</div>
  <h1>Hurtigordre</h1>
  <p class="muted" style="max-width:70ch">Lim inn én linje per produkt: artikkelnummer eller beskrivelse, fulgt av antall. Du kan også laste opp en CSV- eller Excel-eksport fra innkjøpssystemet.</p>
  <div class="two" data-fix="R1">
    <div class="card">
      <label for="qotext">Linjer</label>
      <textarea id="qotext" style="min-height:200px;font-family:ui-monospace,Menlo,Consolas,monospace" placeholder="04093307100030;200&#10;DIN 934 A4 M10 200&#10;DIN 125 A4 M10 400">${esc(UI.qoText)}</textarea>
      <p style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
        <button type="button" class="btn btn-primary" data-act="qoparse">Finn produktene</button>
        <button type="button" class="btn btn-ghost" data-act="qofile">Last opp CSV</button>
        <button type="button" class="linkbtn" data-act="qoexample">Lim inn eksempel</button>
      </p>
      <input type="file" id="qoFile" accept=".csv,.txt" hidden>
    </div>
    <div>
      <h2 style="font-size:1.25rem">Slik fungerer det</h2>
      <ol class="steps"><li>Lim inn eller last opp listen.</li><li>Vi matcher hver linje mot katalogen. Ved flere treff velger du variant.</li><li>Legg alt i ${S.loggedIn?'bestillingen':'forespørselen'} med ett klikk. Linjer vi ikke finner, sendes til teknisk selger.</li></ol>
      ${S.loggedIn?'<p><a href="#/konto/ordre">Eller bestill på nytt fra en tidligere ordre</a></p>':'<p class="small muted" data-fix="R6">Innloggede kunder ser avtalepris på hver linje og kan bestille på nytt fra ordrehistorikken.</p>'}
    </div>
  </div>
  ${UI.qo?`<section class="section" style="padding-top:28px"><h2 style="font-size:1.3rem">Resultat: ${ready} av ${UI.qo.length} linjer klare</h2>
    <div class="scrollx"><table class="btable qoresult"><thead><tr><th>Din linje</th><th>Tolket som</th><th>Antall</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px"><button type="button" class="btn btn-primary" data-act="qoadd" ${ready?'':'disabled'}>Legg ${ready} linjer i ${S.loggedIn?'bestillingen':'forespørselen'}</button>
    ${unmatched?`<a class="btn btn-ghost" href="#/spesialprodukt?spec=${encodeURIComponent(UI.qo.filter(r=>!r.total).map(r=>r.line).join(' | '))}">Send ${unmatched} ukjente linjer til tekniker</a>`:''}</p></section>`:''}
  </div>`;
}

/* ===================== ACCOUNT ===================== */
function viewLogin(){
  document.title='Logg inn | Industrisalg';
  return `<div class="wrap section"><div class="two">
    <div data-fix="R6"><h1>Bedriftskonto hos Industrisalg</h1>
      <p>Med konto handler du raskere og har full oversikt:</p>
      <ul class="trust" style="flex-direction:column;border:0;padding:0;gap:10px">
        <li>${ICON_CHECK}Se dine avtalepriser og bestill direkte</li>
        <li>${ICON_CHECK}Bestill på nytt fra ordrehistorikken med ett klikk</li>
        <li>${ICON_CHECK}Godta tilbud på nett</li>
        <li>${ICON_CHECK}Lagre faste innkjøpslister</li>
        <li>${ICON_CHECK}Last ned 2.1- og 3.1-sertifikater per ordre</li>
        <li>${ICON_CHECK}Direkte linje til din kontaktperson</li>
      </ul></div>
    <div class="card"><h2 style="font-size:1.3rem">Logg inn</h2>
      <div class="field"><label for="lg_mail">E-post</label><input type="email" id="lg_mail" value="innkjop@eksempel.no"></div>
      <div class="field"><label for="lg_pw">Passord</label><input type="password" id="lg_pw" value="demo-passord"></div>
      <button type="button" class="btn btn-primary" data-act="login">Logg inn</button>
      <p class="small muted" style="margin-top:12px">Ny kunde? <button type="button" class="linkbtn" data-act="login">Opprett bedriftskonto</button>. Vi aktiverer avtalepriser etter kort verifisering.</p>
    </div></div></div>`;
}
function acctShell(sub, inner){
  const items=[['','Oversikt'],['ordre','Ordre'],['tilbud','Tilbud'],['lister','Mine lister'],['sertifikater','Sertifikater']];
  return `<div class="wrap"><div class="crumbs"><a href="#/">Hjem</a> / Min konto</div>
  <div class="acct"><nav aria-label="Konto"><ul class="acctnav">${items.map(([k,l])=>`<li><a href="#/konto${k?'/'+k:''}" ${sub===k?'aria-current="page"':''}>${l}</a></li>`).join('')}<li><a href="#/konto" data-act="logout">Logg ut</a></li></ul></nav>
  <div>${inner}</div></div></div>`;
}
function orderCard(o){
  const sum=o.lines.reduce((a,[p,q])=>a+p.price*q,0);
  return `<article class="order"><header><div><b>Ordre ${o.id}</b> · ${o.date} · ${esc(o.ref)} <span class="badge ok">${o.status}</span></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn btn-primary btn-sm" data-act="reorder" data-id="${o.id}" data-fix="R2">Bestill på nytt</button><button type="button" class="btn btn-ghost btn-sm" data-act="certdl" data-id="${o.id}" data-fix="R7">Sertifikater</button></div></header>
    <ul>${o.lines.map(([p,q])=>`<li><span><a href="${productUrl(p)}">${esc(p.label)}</a> <span class="muted small">${p.sku}</span></span><span>${fmtInt(q)} stk · ${fmtNOK(p.price*q)}</span></li>`).join('')}</ul>
    <p class="small muted" style="padding:0 16px 10px;margin:0">Sum eks. mva: ${fmtNOK(sum)}</p></article>`;
}
function viewAccount(sub){
  if(!S.loggedIn) return viewLogin();
  document.title='Min konto | Industrisalg';
  if(sub==='ordre') return acctShell(sub,`<h1>Ordre</h1>${ORDERS.map(orderCard).join('')}`);
  if(sub==='tilbud') return acctShell(sub,`<h1>Tilbud</h1>${QUOTES.map(q=>{const acc=S.quotes[q.id]==='accepted'; const sum=q.lines.reduce((a,[p,n,pr])=>a+n*pr,0);
    return `<article class="order" data-fix="R3"><header><div><b>Tilbud ${q.id}</b> · sendt ${q.date} · gyldig til ${q.valid} ${acc?'<span class="badge ok">Godtatt</span>':'<span class="badge warn">Venter på svar</span>'}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">${acc?'':`<button type="button" class="btn btn-primary btn-sm" data-act="acceptquote" data-id="${q.id}">Godta og bestill</button>`}<button type="button" class="btn btn-ghost btn-sm" data-act="quote2basket" data-id="${q.id}">Endre i kurven</button></div></header>
    <ul>${q.lines.map(([p,n,pr])=>`<li><span>${esc(p.label)}</span><span>${fmtInt(n)} stk à ${fmtNOK(pr)}</span></li>`).join('')}</ul><p class="small" style="padding:0 16px 10px;margin:0">Tilbudssum eks. mva: <b>${fmtNOK(sum)}</b></p></article>`;}).join('')}`);
  if(sub==='lister') return acctShell(sub,`<h1>Mine lister</h1><p class="muted">Faste innkjøpslister for verksted, prosjekt eller anlegg. Legg hele listen i ${basketName().toLowerCase()} med ett klikk.</p>
    <div data-fix="R4">${S.lists.map(l=>`<article class="order"><header><div><b>${esc(l.name)}</b> · ${l.items.length} varer</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn btn-primary btn-sm" data-act="listadd" data-id="${l.id}" ${l.items.length?'':'disabled'}>Legg hele listen i ${basketName().toLowerCase()}</button><button type="button" class="btn btn-ghost btn-sm" data-act="listdel" data-id="${l.id}">Slett liste</button></div></header>
      <ul>${l.items.length?l.items.map((it,i)=>{const p=BY_SKU[it.sku];return `<li><span><a href="${productUrl(p)}">${esc(p.label)}</a> ${p.stock?'':'<span class="stock-out small">bestillingsvare</span>'}</span><span>${fmtInt(it.qty)} stk · <button type="button" class="linkbtn" data-act="listrm" data-id="${l.id}" data-i="${i}">Fjern</button></span></li>`;}).join(''):'<li class="muted">Listen er tom. Legg til varer fra produktsidene med «Lagre i liste».</li>'}</ul></article>`).join('')}</div>
    <form data-form="newlist" class="card" style="margin-top:10px" novalidate><label for="nl_name">Ny liste</label><div class="buyrow"><input type="text" id="nl_name" name="name" placeholder="For eksempel Prosjekt Forus" style="flex:1;min-width:200px"><button class="btn btn-brand" type="submit">Opprett</button></div></form>`);
  if(sub==='sertifikater') return acctShell(sub,`<h1>Sertifikater</h1><p class="muted">Alle materialsertifikater knyttet til dine ordre.</p><div class="scrollx" data-fix="R7"><table class="btable"><thead><tr><th>Ordre</th><th>Produkt</th><th>Type</th><th></th></tr></thead><tbody>${ORDERS.flatMap(o=>o.lines.map(([p],i)=>`<tr><td>${o.id}</td><td>${esc(p.label)}</td><td>${i===0&&p.mat==='A4'?'3.1':'2.1'}</td><td><button type="button" class="linkbtn" data-act="certdl" data-id="${o.id}">Last ned PDF</button></td></tr>`)).join('')}</tbody></table></div>`);
  return acctShell('',`<h1>Velkommen, Eksempel Verksted AS</h1>
    <div class="kpis"><div class="kpi"><span class="muted small">Åpne tilbud</span><b>${QUOTES.filter(q=>S.quotes[q.id]!=='accepted').length}</b><a href="#/konto/tilbud">Se tilbud</a></div><div class="kpi"><span class="muted small">Ordre siste 90 dager</span><b>${ORDERS.length}</b><a href="#/konto/ordre">Se ordre</a></div><div class="kpi"><span class="muted small">Mine lister</span><b>${S.lists.length}</b><a href="#/konto/lister">Se lister</a></div></div>
    <div class="two"><div><h2 style="font-size:1.25rem">Siste ordre</h2>${orderCard(ORDERS[0])}<p><a class="btn btn-ghost" href="#/hurtigordre">Hurtigordre</a></p></div>
    <div class="card" data-fix="R5"><h2 style="font-size:1.25rem">Din kontaktperson</h2><p><b>[Navn på distriktssjef]</b><br>Distriktssjef Sørvestlandet</p><p>Telefon <a href="tel:00000000">[direktenummer]</a><br><a href="mailto:post@industrisalg.no">[e-post]</a></p><p class="small muted">Hentes fra kundens tildelte selger i nopCommerce.</p></div></div>`);
}

/* ===================== INDUSTRY ===================== */
function viewIndustry(slug){
  const i=INDUSTRIES.find(x=>x.slug===slug)||INDUSTRIES[0];
  document.title=`Festemateriell for ${i.name.toLowerCase()} | Industrisalg`;
  const picks=i.stds.map(k=>PRODUCTS.find(p=>p.std===k&&STANDARDS[k].mats.includes(i.mat)&&p.mat===i.mat&&p.stock>0&&(p.d===12||p.d===16))||PRODUCTS.find(p=>p.std===k&&p.stock>0)).filter(Boolean);
  const t=TESTIMONIALS[hash(slug)%3];
  return `<div data-fix="H5"><section class="hero"><div class="wrap" style="padding-bottom:48px"><div class="small" style="color:#b9c8da"><a href="#/" style="color:#b9c8da">Hjem</a> / Bransjeløsninger</div><h1>Festemateriell for ${esc(i.name.toLowerCase())}</h1><p class="lead">${esc(i.intro)}</p><div class="actions" style="margin-bottom:0"><a class="btn btn-primary" href="#f_special" data-act="scrollto" data-target="#indform">Be om tilbud</a><a class="btn btn-light" href="#/hurtigordre">Hurtigordre</a></div></div></section>
  <section class="section"><div class="wrap two"><div><h2>Ofte brukt i ${esc(i.name.toLowerCase())}</h2><p class="muted">Utvalg i ${esc(MATERIALS[i.mat].name.toLowerCase())}. Alle dimensjoner finnes under hver standard.</p>
    <div class="scrollx"><table class="ptable"><thead><tr><th>Produkt</th><th>Diameter</th><th>Lengde</th><th>Stigning</th><th>Materiale</th><th>Kvalitet</th><th>Lager</th>${S.loggedIn?'<th>Din pris</th>':''}<th>Antall</th><th></th></tr></thead><tbody>${productRows(picks)}</tbody></table></div>
    <p style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px">${i.stds.map(k=>`<a href="#/kategori/${STANDARDS[k].slug}">Alle ${STANDARDS[k].din}</a>`).join('')}</p></div>
    <div><div class="card"><h3>Dokumentasjon og krav</h3><p>${esc(i.focus)}.</p><p class="small muted">2.1-sertifikat følger hver ordre. 3.1 på det meste av lageret. ISO 9001:2015 og Magnet JQS.</p></div><div style="margin-top:16px">${testimonialCard(t)}</div></div></div></section>
  <section class="section alt" id="indform"><div class="wrap two"><div><h2>Fortell oss hva prosjektet trenger</h2><p>Send liste, tegning eller spesifikasjon. Vi svarer innen 20 minutter i åpningstiden.</p></div><div class="card">${enquiryForm('special')}</div></div></section></div>`;
}

/* ===================== FIXES OVERVIEW ===================== */
function viewFixes(){
  document.title='Endringer i prototypen | Industrisalg';
  const outOfStock=PRODUCTS.find(p=>p.stock===0&&p.std==='933');
  const where={home:'#/',category:'#/kategori/din-933',search:'#/sok?q='+encodeURIComponent('din 933 a4 m10'),product:productUrl(fp('933','A4',10,30)),basket:'#/kurv',confirm:'#/bekreftelse',special:'#/spesialprodukt',quick:'#/hurtigordre',account:'#/konto',industry:'#/bransje/akvakultur',contact:'#/kontakt'};
  const names={home:'Forside',category:'Kategori',search:'Søk',product:'Produkt',basket:'Kurv',confirm:'Bekreftelse',special:'Spesialprodukt',quick:'Hurtigordre',account:'Konto',industry:'Bransjeside',contact:'Kontakt'};
  const groups=[['B','Buying model'],['D','Product discovery'],['P','Product page'],['E','Enquiry and forms'],['R','Repeat orders'],['H','Homepage'],['T','Trust and content'],['M','Measurement'],['X','Mobile'],['K','From the 6 Oct internal site review']];
  return `<div class="wrap section"><h1>Endringer i prototypen</h1>
  <p class="muted" style="max-width:75ch">Every fix from the audit, mapped to where it appears. Turn on "Endringer på denne siden" in the grey bar to see them marked on each page. Switch between "Besøkende" and "Innlogget kunde" to see both buying models.</p>
  ${groups.map(([g,n])=>`<h2 style="font-size:1.3rem;margin-top:28px">${n}</h2><div class="scrollx"><table class="btable"><thead><tr><th style="width:60px">ID</th><th>Change</th><th style="width:220px">See it on</th></tr></thead><tbody>${Object.entries(FIXES).filter(([k])=>k[0]===g).map(([k,[t,d]])=>{
    const pages=Object.entries(PAGE_FIXES).filter(([,ids])=>ids.includes(k)).map(([pg])=>pg);
    const links=pages.map(pg=>`<a href="${k==='P1'&&pg==='product'?productUrl(outOfStock):where[pg]}">${names[pg]}</a>`).join(', ')||'<span class="muted">Theme/back end</span>';
    return `<tr><td><b>${k}</b></td><td><b>${esc(t)}</b>${d?'<br><span class="small muted">'+esc(d)+'</span>':''}</td><td class="small">${links}</td></tr>`;}).join('')}</tbody></table></div>`).join('')}
  <h2 style="font-size:1.3rem;margin-top:28px">Not shown in the prototype</h2>
  <p class="small">Catalogue data clean-up in nopCommerce (D1) must be done on the real attribute values. Real technical drawings per standard (D5) need to be produced. Company names on testimonials (T3) need permission. Response times (T1) must be confirmed with sales. GTM events (M1) need configuring in the live container; the prototype only pushes them to dataLayer.</p></div>`;
}
