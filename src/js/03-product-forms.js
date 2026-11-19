
/* ===================== PRODUCT ===================== */
function jointParts(p){
  const s=stdOf(p); if(s.kind!=='bolt') return [];
  const out=[];
  const nut=fp('934',p.mat,p.d)||fp('934','ELF',p.d); if(nut) out.push([nut,'Mutter']);
  const lock=fp('985',p.mat,p.d); if(lock) out.push([lock,'Låsemutter (alternativ)']);
  const w=fp('125',p.mat,p.d); if(w) out.push([w,'Skive']);
  const nl=fp('NL',p.mat==='A4'||p.mat==='A2'?'A4':'VG',p.d); if(nl) out.push([nl,'Nord-Lock']);
  return out;
}
function viewProduct(sku){
  const p=BY_SKU[sku]; if(!p) return `<div class="wrap section"><h1>Fant ikke produktet</h1>${emptyState({q:sku})}</div>`;
  const s=stdOf(p), cat=CATEGORIES.find(c=>c.slug===s.cat);
  document.title=`${p.label} (${s.iso||s.din}) | Industrisalg`;
  track('view_item',{item_id:p.sku,item_name:p.label,in_stock:p.stock>0});
  const alts = p.stock>0?[]:PRODUCTS.filter(x=>x.std===p.std&&x.mat===p.mat&&x.d===p.d&&x.stock>0&&x.sku!==p.sku).sort((a,b)=>Math.abs((a.L||0)-(p.L||0))-Math.abs((b.L||0)-(p.L||0))).slice(0,3);
  const altsSameL = p.stock>0?[]:PRODUCTS.filter(x=>x.std===p.std&&x.d===p.d&&x.L===p.L&&x.mat!==p.mat&&x.stock>0).slice(0,2);
  const joint=jointParts(p);
  const t=TESTIMONIALS[(hash(p.sku)%3)];
  const priceBlock = S.loggedIn
    ? `<div class="price">${fmtNOK(p.price)} <span class="small muted" style="font-family:var(--font)">per stk eks. mva, din avtalepris</span></div>`
    : `<p class="small" data-fix="R6" style="margin:0 0 10px"><b>Pris:</b> legg varen i forespørselen for tilbud, eller <a href="#/konto">logg inn</a> for å se din avtalepris og bestille direkte.</p>`;
  return `<div class="wrap">
  <div class="crumbs"><a href="#/">Hjem</a> / <a href="#/kategori/${cat.slug}">${esc(cat.name)}</a> / <a href="#/kategori/${s.slug}">${s.din} ${esc(s.name)}</a> / ${esc(p.label)}</div>
  <div class="pgrid">
    <div>
      ${STD_PHOTO[p.std]?`<div class="drawing photo" data-fix="D5">${photo(STD_PHOTO[p.std],'big',p.label)}<div class="mini">${drawing(s.kind,p.std,false)}<span class="small">Prinsippskisse ${s.din}${s.iso?' / '+s.iso:''}. Mål etter standard.</span></div><span class="small" style="padding:0 16px">Illustrasjonsbilde. Materiale og overflate kan avvike fra bildet.</span></div>`
      :`<div class="drawing" data-fix="D5">${drawing(s.kind,p.std,true)}<span class="small muted">Prinsippskisse ${s.din}${s.iso?' / '+s.iso:''}. Mål etter standard.</span></div>`}
      <h2 style="margin-top:24px;font-size:1.3rem">Produktspesifikasjoner</h2>
      <table class="specs">
        <tr><th>Standard</th><td>${s.din}${s.iso?' / '+s.iso:''}</td></tr>
        <tr data-fix="K3"><th>Diameter</th><td><b>M${p.d}</b></td></tr>
        <tr><th>Gjengestigning</th><td>${pitchOf(p)}${stdOf(p).kind==='washer'?'':' (grovgjenget)'}</td></tr>
        ${p.L?`<tr><th>Lengde</th><td>${p.L} mm</td></tr>`:''}
        <tr><th>Materiale</th><td>${esc(matOf(p).name)}</td></tr>
        <tr><th>Fasthetsklasse</th><td>${esc(p.grade)}</td></tr>
        <tr data-fix="P2"><th>Standard pakning</th><td>${p.pack} stk (vi selger også enkeltvis)</td></tr>
        <tr data-fix="P3"><th>Sertifikat</th><td>2.1 følger ordren. 3.1 tilgjengelig.</td></tr>
        <tr><th>Artikkelnr.</th><td>${p.sku}</td></tr>
      </table>
      <p>${esc(s.desc)} ${p.mat==='A4'?'A4 gir høy korrosjonsbestandighet og egner seg i fuktige og marine miljøer.':p.mat==='VG'?'Varmgalvanisert for utendørs bruk.':''}</p>
    </div>
    <div>
      <h1 style="margin-bottom:4px">${esc(p.label)}</h1>
      <p class="muted">${s.iso?'('+s.iso+') ':''}${esc(s.name)} · Art.nr. ${p.sku}</p>
      <div class="buybox" data-fix="B1">
        <div class="stockline">
          ${p.stock>0?`<span class="stock-in">På lager: ${fmtInt(p.stock)} stk</span><span class="small">Kan sendes eller hentes i Sandnes samme dag</span>`
            :`<span class="stock-out" data-fix="P1">Bestillingsvare, normalt 5 til 10 arbeidsdager</span><span class="small">Du kan fortsatt legge varen i ${S.loggedIn?'bestillingen':'forespørselen'}. Vi bekrefter leveringstid.</span>`}
        </div>
        ${priceBlock}
        <div data-fix="P3"><label>Materialsertifikat</label>
          <div class="certopts" role="radiogroup" aria-label="Materialsertifikat">
            <label><input type="radio" name="cert" value="2.1" checked> 2.1 (inkludert)</label>
            <label><input type="radio" name="cert" value="3.1"> 3.1 inspeksjonssertifikat</label>
          </div></div>
        <label for="pq" data-fix="P2">Antall (stk)</label>
        <p class="small muted" style="margin:-2px 0 6px">Eksakt antall stykk, ikke esker. Ingen minstekjøp.</p>
        <div class="buyrow">
          ${qtyBox('pq',1)}
          <button type="button" class="btn btn-primary" data-act="add" data-sku="${p.sku}" data-qty="#pq" data-cert="cert">${primaryLabel()}</button>
        </div>
        <p style="margin:12px 0 0;display:flex;gap:18px;flex-wrap:wrap">
          <button type="button" class="linkbtn" data-act="savetolist" data-sku="${p.sku}" data-qty="#pq" data-fix="P6">Lagre i liste</button>
          <a href="#tekniker" data-act="scrollto" data-target="#tekniker" data-fix="P5">Spør en tekniker</a>
          ${S.loggedIn?`<button type="button" class="linkbtn" data-act="quoteinstead" data-sku="${p.sku}" data-qty="#pq">Be om tilbud på stort kvantum</button>`:''}
        </p>
      </div>
      ${p.stock>0?'':`<div class="notice warnbox" style="margin-top:14px" data-fix="P1">
        ${alts.length||altsSameL.length?`<b>På lager nå:</b><div class="alts">${alts.concat(altsSameL).map(a=>`<a href="${productUrl(a)}"><span>${esc(a.label)}</span><span class="stock-in">${fmtInt(a.stock)} stk</span></a>`).join('')}</div>`:''}
        <form data-form="notify" data-sku="${p.sku}" style="margin-top:12px" novalidate><label for="nmail">Varsle meg når varen er på lager</label><div class="buyrow"><input type="email" id="nmail" name="email" placeholder="E-postadresse" style="flex:1;min-width:200px" required><button class="btn btn-ghost" type="submit">Varsle meg</button></div></form>
      </div>`}
      ${joint.length?`<section class="joint" data-fix="P4" aria-labelledby="jh">
        <header><div><h3 id="jh" style="margin:0">Fullfør forbindelsen</h3><span class="small muted">Samme materiale og dimensjon. Antall følger bolten.</span></div><button type="button" class="btn btn-brand btn-sm" data-act="addjoint" data-sku="${p.sku}">Legg til valgte</button></header>
        ${joint.map(([j,role],i)=>`<div class="jrow"><input type="checkbox" id="j${i}" data-jsku="${j.sku}" ${i!==1?'checked':''} aria-label="Velg ${esc(j.label)}"><label for="j${i}" style="margin:0;font-weight:400;display:flex;gap:10px;align-items:center">${thumb(j)}<span><b>${role}:</b> <a href="${productUrl(j)}">${esc(j.label)}</a><br>${stockHtml(j)}${S.loggedIn?' · '+fmtNOK(j.price)+' /stk':''}</span></label>${qtyBox('jq'+i,1,'Antall '+j.label)}<span></span></div>`).join('')}
      </section>`:''}
      <div style="margin-top:24px">${testimonialCard(t)}</div>
    </div>
  </div>
  <section class="section" id="tekniker" data-fix="P5">
    <div class="two">
      <div><h2>Spør en tekniker om dette produktet</h2><p>Usikker på materiale, fasthetsklasse eller om varen passer? Legg ved tegning eller bilde, så svarer vår tekniske selger.</p></div>
      <div class="card">${enquiryForm('technician',{sku:p.sku})}</div>
    </div>
  </section>
  </div>`;
}
function mobileBarFor(p){
  return `<div style="flex:none">${qtyBox('mq',1)}</div><button type="button" class="btn btn-primary" data-act="add" data-sku="${p.sku}" data-qty="#mq" data-cert="cert">${S.loggedIn?'Legg i bestilling':'Legg i forespørsel'}</button>`;
}

/* ===================== FORMS ===================== */
const FILES = {};
const ACCEPT='.pdf,.jpg,.jpeg,.png,.docx,.dwg,.dxf,.step,.stp,.xlsx,.csv';
function fileField(formId, label){
  FILES[formId]=FILES[formId]||[];
  return `<div class="field" data-fix="E1"><label>${label||'Last opp tegninger, bilder eller lister'}</label>
    <div class="drop" data-act="pickfile" data-form-id="${formId}" tabindex="0" role="button" aria-label="Velg filer">
      <b>Dra filer hit eller klikk for å velge</b><br><span class="small muted">PDF, DWG, DXF, STEP, JPG, PNG, DOCX, XLSX eller CSV. Inntil 5 filer, maks 20 MB per fil.</span>
    </div>
    <input type="file" multiple accept="${ACCEPT}" hidden data-filefor="${formId}">
    <ul class="filelist" id="fl_${formId}">${fileListHtml(formId)}</ul></div>`;
}
function fileListHtml(formId){ return (FILES[formId]||[]).map((f,i)=>`<li><span>${esc(f.name)} <span class="muted small">${(f.size/1048576).toFixed(1)} MB</span></span><button type="button" class="linkbtn" data-act="rmfile" data-form-id="${formId}" data-i="${i}">Fjern</button></li>`).join(''); }
function contactFields(formId,opts){
  const lg=S.loggedIn;
  return `
  <div class="grid2">
    <div class="field"><label for="${formId}_name">Navn *</label><input type="text" id="${formId}_name" name="name" autocomplete="name" value="${lg?'Kari Eksempel':''}"></div>
    <div class="field"><label for="${formId}_co">Firma *</label><input type="text" id="${formId}_co" name="company" autocomplete="organization" value="${lg?'Eksempel Verksted AS':''}"></div>
    <div class="field"><label for="${formId}_mail">E-post</label><input type="email" id="${formId}_mail" name="email" autocomplete="email" value="${lg?'innkjop@eksempel.no':''}"></div>
    <div class="field"><label for="${formId}_tel">Telefon</label><input type="tel" id="${formId}_tel" name="phone" autocomplete="tel"></div>
  </div>
  <p class="small muted" style="margin:-6px 0 12px" data-fix="E2">Oppgi e-post eller telefon, så kontakter vi deg der.</p>
  ${opts&&opts.compact?'':`<details style="margin:0 0 14px"><summary class="small">Flere detaljer (valgfritt)</summary><div class="grid2" style="margin-top:10px"><div class="field"><label for="${formId}_dep">Avdeling</label><input type="text" id="${formId}_dep" name="dept"></div><div class="field"><label for="${formId}_org">Organisasjonsnummer</label><input type="text" id="${formId}_org" name="org" inputmode="numeric"></div></div></details>`}`;
}
function consent(formId){ return `<div class="field"><label class="check"><input type="checkbox" name="consent" id="${formId}_ok"> <span>Jeg godtar <a href="#/">personvernerklæringen</a></span></label></div>`; }
function enquiryForm(type,opts={}){
  const id='f_'+type;
  const promise=`<p class="small muted" data-fix="T1">Vi svarer innen 20 minutter i åpningstiden og sender fullstendig tilbud innen 24 timer. Akutt utenom kontortid: <a href="tel:47709806">477 09 806</a>.</p>`;
  if(type==='contact') return `<form data-form="contact" id="${id}" novalidate>${contactFields(id,{compact:true})}<div class="field"><label for="${id}_msg">Hva kan vi hjelpe med?</label><textarea id="${id}_msg" name="msg"></textarea></div>${fileField(id)}${consent(id)}<button class="btn btn-primary" type="submit">Send henvendelse</button>${promise}</form>`;
  if(type==='technician') return `<form data-form="technician" data-sku="${opts.sku}" id="${id}" novalidate><div class="field"><label for="${id}_msg">Spørsmål *</label><textarea id="${id}_msg" name="msg" placeholder="For eksempel: tåler denne sjøvann, eller finnes den i duplex?"></textarea></div>${contactFields(id,{compact:true})}${fileField(id,'Legg ved tegning eller bilde (valgfritt)')}${consent(id)}<button class="btn btn-brand" type="submit">Send spørsmål til tekniker</button>${promise}</form>`;
  if(type==='quote') return `<form data-form="quote" id="${id}" novalidate>${contactFields(id)}<div class="field"><label for="${id}_date">Ønsket leveringsdato</label><input type="date" id="${id}_date" name="date"></div><div class="field"><label for="${id}_msg">Melding</label><textarea id="${id}_msg" name="msg" placeholder="Leveringsadresse, krav til dokumentasjon eller annet vi bør vite"></textarea></div>${fileField(id)}${consent(id)}<button class="btn btn-primary" type="submit">Send tilbudsforespørsel</button>${promise}</form>`;
  if(type==='special') return `<form data-form="special" id="${id}" novalidate>
      <div class="field"><label for="${id}_what">Hva trenger du? *</label><textarea id="${id}_what" name="what" placeholder="Beskriv delen eller bruksområdet">${esc(opts.spec?'Fant ikke: '+opts.spec:'')}</textarea></div>
      <div class="grid2">
        <div class="field"><label for="${id}_spec">Kjent spesifikasjon</label><input type="text" id="${id}_spec" name="spec" placeholder="Standard, dimensjon, gjenge" value="${esc(opts.spec||'')}"></div>
        <div class="field"><label for="${id}_mat">Materiale</label><select id="${id}_mat" name="mat"><option>Vet ikke</option><option>A4 syrefast</option><option>A2 rustfri</option><option>Duplex / 254 SMO</option><option>Elforsinket</option><option>Varmgalvanisert</option><option>L7 / A320</option><option>Annet</option></select></div>
        <div class="field"><label for="${id}_qty">Antall</label><input type="number" id="${id}_qty" name="qty" inputmode="numeric"></div>
        <div class="field"><label for="${id}_date">Trenger det innen</label><input type="date" id="${id}_date" name="date"></div>
      </div>
      <div class="field"><label class="check"><input type="checkbox" name="cert31"> <span>Jeg trenger 3.1-sertifikat</span></label></div>
      ${fileField(id,'Tegning, bilde eller spesifikasjon')}
      ${contactFields(id)}${consent(id)}
      <button class="btn btn-primary" type="submit">Send til teknisk selger</button>${promise}</form>`;
  if(type==='order') return `<form data-form="order" id="${id}" novalidate>
      <div class="grid2"><div class="field"><label for="${id}_po">Deres referanse / PO-nummer</label><input type="text" id="${id}_po" name="po"></div>
      <div class="field"><label for="${id}_by">Bestilt av</label><input type="text" id="${id}_by" name="by" value="Kari Eksempel"></div></div>
      <fieldset class="field" style="border:0;padding:0"><legend style="font-weight:600;margin-bottom:6px">Levering</legend>
        <label class="check"><input type="radio" name="ship" value="send" checked> <span>Send til Eksempel Verksted AS, Industriveien 1, 4313 Sandnes</span></label>
        <label class="check"><input type="radio" name="ship" value="pickup"> <span>Hentes hos Industrisalg, Gamleveien 85, Sandnes</span></label></fieldset>
      <div class="field"><label for="${id}_msg">Kommentar til ordren</label><textarea id="${id}_msg" name="msg" style="min-height:70px"></textarea></div>
      <button class="btn btn-primary" type="submit">Send bestilling</button>
      <p class="small muted" style="margin-top:8px">Fakturering etter avtale. Ordrebekreftelse sendes til innkjop@eksempel.no.</p></form>`;
  return '';
}

/* ===================== BASKET ===================== */
function viewBasket(){
  document.title=`${basketName()} | Industrisalg`;
  if(!S.basket.length) return `<div class="wrap section"><h1>${S.loggedIn?'Bestillingen':'Tilbudsforespørselen'} er tom</h1>
    <p class="muted">Finn produkter i katalogen, lim inn en innkjøpsliste, eller send oss en spesifikasjon.</p>
    <div class="routes" data-fix="E3"><div class="route"><h3>Søk i katalogen</h3><p>Søk på standard og dimensjon, for eksempel DIN 933 M10x30.</p><button type="button" class="btn btn-brand" data-act="focussearch">Søk</button></div>
    <div class="route"><h3>Hurtigordre</h3><p>Lim inn artikkelnumre eller last opp CSV.</p><a class="btn btn-brand" href="#/hurtigordre">Åpne hurtigordre</a></div>
    <div class="route"><h3>Spesialprodukt</h3><p>Send tegning, bilde eller spesifikasjon.</p><a class="btn btn-brand" href="#/spesialprodukt">Send spesifikasjon</a></div></div></div>`;
  const rows=S.basket.map((l,i)=>{const p=BY_SKU[l.sku]; return `<tr>
    <td><div class="pn">${thumb(p)}<div><a href="${productUrl(p)}"><b>${esc(p.label)}</b></a><div class="small muted">${p.sku} · ${stockHtml(p)}</div></div></div></td>
    <td data-fix="P3"><label class="sr" for="bc${i}">Sertifikat</label><select id="bc${i}" data-bcert="${i}" style="min-height:38px;width:auto"><option value="2.1" ${l.cert==='2.1'?'selected':''}>2.1</option><option value="3.1" ${l.cert==='3.1'?'selected':''}>3.1</option></select></td>
    <td><label class="sr" for="bq${i}">Antall</label><input type="number" min="1" id="bq${i}" data-bqty="${i}" value="${l.qty}" class="b-qty" style="min-height:38px" data-fix="K2"></td>
    ${S.loggedIn?`<td class="b-unit">${fmtNOK(p.price)}</td><td><b id="bs${i}">${fmtNOK(p.price*l.qty)}</b></td>`:''}
    <td><button type="button" class="linkbtn" data-act="rmline" data-i="${i}">Fjern</button></td></tr>`;}).join('');
  const sum=S.basket.reduce((a,l)=>a+BY_SKU[l.sku].price*l.qty,0);
  const anyOut=S.basket.some(l=>BY_SKU[l.sku].stock===0);
  return `<div class="wrap">
    <div class="crumbs"><a href="#/">Hjem</a> / ${basketName()}</div>
    <ol class="xs-steps" data-note="B1" aria-label="Steg"><li class="on"><i>1</i>Produkter</li><li><i>2</i>${S.loggedIn?'Levering':'Kontaktinfo'}</li><li><i>3</i>${S.loggedIn?'Bekreftelse':'Svar innen 20 min'}</li></ol>
    <h1 data-fix="B1">${S.loggedIn?'Din bestilling':'Din tilbudsforespørsel'}</h1>
    <p class="muted">${S.loggedIn?'Prisene er dine avtalepriser eks. mva. Du kan også be om tilbud på hele kurven.':'Du får pris og leveringstid fra oss. Logg inn for å se avtalepris og bestille direkte.'}</p>
    ${anyOut?`<p class="notice warnbox" data-fix="P1">En eller flere varer er bestillingsvarer. Vi bekrefter leveringstid i ${S.loggedIn?'ordrebekreftelsen':'tilbudet'}.</p>`:''}
    <div class="two" style="margin-top:20px">
      <div>
        <div class="scrollx"><table class="btable"><thead><tr><th>Produkt</th><th>Sertifikat</th><th>Antall (stk)</th>${S.loggedIn?'<th class="b-unit">Pris/stk</th><th>Sum</th>':''}<th></th></tr></thead><tbody>${rows}</tbody></table></div>
        <p style="margin-top:12px;display:flex;gap:16px;flex-wrap:wrap"><a href="#/hurtigordre">Legg til flere fra liste</a><button type="button" class="linkbtn" data-act="basket2list">Lagre som liste</button><button type="button" class="linkbtn" data-act="clearbasket">Tøm</button></p>
      </div>
      <div class="card">
        ${S.loggedIn&&!UI.forceQuote?`<h2 style="font-size:1.3rem">Oppsummering</h2><table class="specs"><tr><th>Varer</th><td>${S.basket.length} linjer</td></tr><tr><th>Sum eks. mva</th><td><b id="bsum">${fmtNOK(sum)}</b></td></tr><tr><th>Frakt</th><td>Beregnes ved pakking. Henting er gratis.</td></tr></table>${enquiryForm('order')}
          <hr style="border:0;border-top:1px solid var(--line);margin:18px 0"><button type="button" class="linkbtn" data-act="basketquote">Be om tilbud på denne kurven i stedet</button>`
        :`<h2 style="font-size:1.3rem">${S.loggedIn?'Be om tilbud på kurven':'Send forespørsel'}</h2>${S.loggedIn?'<p class="small"><button type="button" class="linkbtn" data-act="backtoorder">Tilbake til bestilling</button></p>':''}${enquiryForm('quote')}`}
      </div>
    </div></div>`;
}

/* ===================== CONFIRMATION ===================== */
function viewConfirm(){
  const L=S.last||{type:'quote',ref:'IS-26-00000'};
  document.title='Takk | Industrisalg';
  const titles={quote:'Takk, vi har mottatt tilbudsforespørselen',order:'Takk, bestillingen er mottatt',special:'Takk, forespørselen er sendt til vår tekniske selger',technician:'Takk, spørsmålet er sendt til teknisk selger',contact:'Takk for henvendelsen',notify:'Du får beskjed når varen er på lager',quoteaccept:'Tilbudet er godtatt og ordren er opprettet'};
  const next = L.type==='order'||L.type==='quoteaccept'
    ? ['Du får ordrebekreftelse på e-post innen kort tid.','Lagervarer plukkes og sendes eller gjøres klare for henting samme dag.','Sertifikater ligger på ordren under Min konto.']
    : ['Du får en kopi av henvendelsen på e-post nå.','En selger ser på behovet og svarer innen 20 minutter i åpningstiden.','Fullstendig tilbud med pris og leveringstid sendes innen 24 timer.'];
  return `<div class="wrap section" data-fix="E4">
    <span class="xc-tick" aria-hidden="true"><svg width="34" height="34" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
    <h1>${titles[L.type]||'Takk'}</h1>
    <p class="xc-ref" data-note="F1"><span>Referanse</span>${esc(L.ref)}</p>
    <p class="muted">Oppgi referansen hvis du kontakter oss.</p>
    ${L.type==='notify'?'':`<div class="two"><div><h2 style="font-size:1.3rem">Hva skjer nå</h2><ol class="steps">${next.map(n=>`<li>${n}</li>`).join('')}</ol></div>
    <div class="card"><h3>Haster det?</h3><p>Ring <a href="tel:51637800">51 63 78 00</a> i åpningstiden, eller vakttelefon <a href="tel:47709806">477 09 806</a> utenom kontortid.</p></div></div>`}
    <p style="display:flex;gap:10px;flex-wrap:wrap;margin-top:20px"><a class="btn btn-primary" href="#/">Til forsiden</a><a class="btn btn-ghost" href="#/hurtigordre">Hurtigordre</a>${S.loggedIn?'<a class="btn btn-ghost" href="#/konto/ordre">Mine ordre</a>':''}</p>
  </div>`;
}

/* ===================== SPECIAL PRODUCT ===================== */
function viewSpecial(spec){
  document.title='Finn et spesialprodukt | Industrisalg';
  return `<div class="wrap"><div class="crumbs"><a href="#/">Hjem</a> / Finn et spesialprodukt</div>
  <div class="two">
    <div><h1>Finner du ikke festemiddelet du trenger?</h1>
      <p>Sortimentet vårt er bredere enn nettbutikken. Send oss det du har, så finner vår tekniske selger riktig produkt eller et godt alternativ.</p>
      <ul><li>Tegning, bilde eller gammel artikkelnummer holder</li><li>Spesialdimensjoner, duplex, 254 SMO, L7 og tommegjenger</li><li>3.1-sertifikat og sporbarhet ved behov</li></ul>
      <div class="notice" style="margin-top:16px">Forespørselen går direkte til vår tekniske selger for produkter utenfor standardsortimentet.</div>
      <div style="margin-top:24px">${testimonialCard(TESTIMONIALS[2])}</div>
    </div>
    <div class="card" data-fix="E3">${enquiryForm('special',{spec})}</div>
  </div></div>`;
}
function viewContact(){
  document.title='Kontakt oss | Industrisalg';
  return `<div class="wrap"><div class="crumbs"><a href="#/">Hjem</a> / Kontakt oss</div><div class="two"><div><h1>Kontakt oss i dag</h1><p>Velg det som passer best:</p>
  <div class="routes" style="grid-template-columns:1fr" data-fix="E3"><div class="route"><h3>Tilbud på produkter</h3><p>Legg produktene i forespørselen.</p><a class="btn btn-brand" href="#/kurv">Gå til forespørsel</a></div><div class="route"><h3>Spesialprodukt</h3><p>Send tegning eller bilde.</p><a class="btn btn-brand" href="#/spesialprodukt">Send spesifikasjon</a></div></div>
  <h2 style="margin-top:28px;font-size:1.3rem">Våre selgere</h2><p class="muted">Regionale distriktssjefer og teknisk selger vises her som i dag, med direkte telefon og e-post.</p>
  <p data-fix="X2">Telefon <a href="tel:51637800">51 63 78 00</a> · Vakttelefon <a href="tel:47709806">477 09 806</a> · <a href="mailto:post@industrisalg.no">post@industrisalg.no</a></p></div>
  <div class="card"><h2 style="font-size:1.3rem">Send en henvendelse</h2>${enquiryForm('contact')}</div></div></div>`;
}
