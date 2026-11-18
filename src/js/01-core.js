
/* ===================== FIX CATALOGUE (for the developer panel) ===================== */
const FIXES = {
  B1:['One clear buying action per visitor state','Visitors get a single primary button: add to quote request. Logged-in customers see their own price and order directly, with "request a quote" kept as a secondary option. Replaces the three competing buttons on the live product page (add to cart, more info, add to enquiry).'],
  B2:['Basket label follows the buying model','The header basket says "Forespørsel" for visitors and "Bestilling" for logged-in customers, with a live count.'],
  B3:['Clear confirmation after adding','Every add gives visible confirmation of what was added and the next step. Now done through the mini cart highlight and a short message (see K1) rather than an overlay.'],
  D1:['Normalised filter values','One decimal format, one inch symbol and one grade notation. Removes duplicates such as 6,5 and 6.5 that currently split results.'],
  D2:['Length as a from/to range','Replaces a single list with several hundred length values.'],
  D3:['Table view with 50 rows by default','Page size 25, 50 or 100 instead of 6 or 9. Quantity field and add button on every row, so buyers never need to open each product.'],
  D4:['Sort options that work','Price sorting only appears when prices are visible. Adds sorting by dimension and stock.'],
  D5:['Real product photo plus technical drawing per standard','Replaces the generic placeholder image. One photo and one schematic drawing cover every size within a standard. Photos also appear as thumbnails in tables, basket and search suggestions.'],
  D6:['Search that understands how buyers type','Recognises DIN and ISO numbers, M10x30, 10x30, materials (A4, A2, ELF, VG), product words (mutter, skive, umbrako) and 14-digit article numbers, with live suggestions.'],
  D7:['Empty states that lead somewhere','No results offers to widen the search, browse standards, or send the specification to a technical salesperson with the search text prefilled.'],
  D8:['Active filter chips, result count and in-stock toggle',''],
  P1:['Out of stock is not a dead end','Shows typical lead time, the nearest in-stock sizes in the same standard and material, and a back-in-stock alert that captures an email.'],
  P2:['Single-piece selling made clear','The quantity field is labelled as exact pieces and pack size is shown as information, not a minimum. Matches the "kjøp ned til enkeltskruen" promise.'],
  P3:['Certificate choice on the product','2.1 is included per order, 3.1 can be selected. The choice follows the line into the quote or order.'],
  P4:['Complete the joint','Matching nut, washer and Nord-Lock in the same material and size, added in one click with quantities matched to the bolt.'],
  P5:['Ask a technician, with file upload','Short product-level question form. Product and article number are already known, so only the question and contact details are asked for.'],
  P6:['Save to a named list','Replaces the consumer-style wishlist with B2B purchase lists.'],
  P7:['Sticky action bar on mobile','Quantity and primary action stay visible while scrolling specifications.'],
  E1:['Engineering file types accepted','DWG, DXF, STEP, XLSX and CSV in addition to PDF, JPG, PNG and DOCX. Up to 20 MB per file and 5 files.'],
  E2:['Email or phone, not both','Fewer required fields. Department and organisation number moved under optional details.'],
  E3:['Three enquiry routes','Quote on products, find a special product, and upload a purchase list. Same backend and inbox, three focused forms.'],
  E4:['Confirmation with reference and next steps','Reference number, what happens next, response promise, after-hours phone, and a note that a copy is sent by email.'],
  E5:['Language-correct CTA links','Buttons point to /no/ targets so anchors are not lost on redirect (live site links to /#home-general-contactform). Technical fix in the theme.'],
  R1:['Quick order pad','Paste article numbers or descriptions with quantities, or upload a CSV, and get one basket. Unmatched lines can be sent to a technician.'],
  R2:['Reorder from order history','One click puts a past order back in the basket. nopCommerce has this natively; it needs enabling and a visible button.'],
  R3:['Accept quotes online','Customers accept a quote in their account instead of replying by email.'],
  R4:['Mine lister (named purchase lists)','Several named lists per customer, each addable to the basket in one click.'],
  R5:['Account manager in the account','The customer sees their regional sales contact with direct phone and email.'],
  R6:['Reasons to register','Clear benefits shown at login and in the price slot on product pages: own prices, reorder, order history, certificate archive.'],
  R7:['Certificate archive per order','2.1 and 3.1 certificates downloadable from each order.'],
  H1:['Hero with two clear actions','Find product (focuses search) and request a quote. The live hero has no button.'],
  H2:['Static trust row replaces the scrolling ticker','The live marquee repeats nine claims four times and moves constantly.'],
  H3:['Most-used standards replace random product carousels','Direct entry to DIN 931, 933, 912, 934, 985, 125 and Nord-Lock. Swap for "most ordered" once GA4 data is available.'],
  H4:['Industry tiles link to industry pages','On the live site the twelve industries are plain text.'],
  H5:['Industry landing pages','Built from the existing tag pages: relevant products, documentation notes, a testimonial and an enquiry form.'],
  H6:['Repeat-order strip on the homepage','Points returning buyers to quick order and their account.'],
  T1:['Consistent response promise','"Svar innen 20 minutter i åpningstiden, fullstendig tilbud innen 24 timer" replaces the conflicting 20 minutes vs 24 hours claims. Confirm with sales before launch.'],
  T2:['Stock claim matches reality','"13 000+ artikler på lager i Sandnes" replaces "alltid på lager" and "ingen restordre", which conflict with items marked out of stock.'],
  T3:['Attributed testimonials near decisions','Role and company (company names are placeholders, add with permission). Short quotes also placed on product and industry pages.'],
  T4:['Copy fixes','"Mutre" corrected to "Muttere" in navigation; FAQ "fokusere" corrected to "fokuserer".'],
  T5:['Page titles and meta descriptions','Each page gets a proper title (live site shows ". Kontakt oss" and "INDUSTRISALG. Blindnagler / Popnagler").'],
  M1:['Tracking events','GTM dataLayer events for every key action: search, zero results, filter, add, submit, upload, reorder, call clicks.'],
  X1:['Filters in a bottom sheet on mobile',''],
  K1:['Persistent cart instead of the slide-out overlay','From the 6 Oct review: the live slide-out cart blurs the page on every add. Adding now keeps the buyer on the page; the item is highlighted in the always-visible mini cart (R8) with a short confirmation. On small screens a confirmation with a link to the basket is shown instead.'],
  K2:['No refresh while changing quantities','From the 6 Oct review: the live cart refreshes on every quantity change and steps one by one. Quantities can be typed directly (for example 5000) and totals update in place without reloading the cart, in both the basket and the mini cart.'],
  K3:['Diameter first, pitch added','From the 6 Oct review: diameter (the attribute that differs between variants) and thread pitch were hidden. Tables now lead with Diameter, Length and Pitch, and pitch is listed in the product specifications. Column priority to be confirmed with the client.'],
  K4:['Standards shown as products, not categories','From the 6 Oct review: a standard such as UNC flat washers is a product with size variants, not a category. Standard tiles and pages now say "Se produkt" and show the number of variants; "category" is kept for the big groups.'],
  K5:['Image on every category, standard and product','From the 6 Oct review: several live categories and products have no picture. Every tile, table row and product page has a photo or, as a fallback, the technical drawing. Missing live images need to be uploaded.'],
  K6:['Base language without /no in the URL','From the 6 Oct review: Norwegian is the default language, so it should live at the root (industrisalg.no/...) and only English needs /en. Theme and routing change in nopCommerce; not shown in the prototype.'],
  K7:['Professional product photography','From the 6 Oct review: current product photos look low quality next to competitors. Recommend a consistent photo set (white background, same angle and lighting per standard). Content task; not shown in the prototype.'],
  X2:['Tap-to-call phone and after-hours line','Visible on every page.']
};
const PAGE_FIXES = {
  home:['H1','H2','H3','H6','E3','H4','T1','T2','T3','T4','B2','D6','X2','E5','T5','M1'],
  category:['K3','K4','K5','K1','D1','D2','D3','D4','D8','D7','B1','B3','X1','T5','M1'],
  search:['K3','K1','D6','D7','D3','D8','M1'],
  product:['K1','K3','K5','B1','B3','P1','P2','P3','P4','P5','P6','P7','D5','R6','T3','T5','M1'],
  basket:['K2','B1','B2','P3','E1','E2','E3','E4','M1'],
  confirm:['E4','T1','M1'],
  special:['E1','E2','E3','E4','T1','M1'],
  quick:['R1','E3','M1'],
  account:['R2','R3','R4','R5','R6','R7','M1'],
  industry:['H5','T3','E3'],
  contact:['E2','E3','T1','X2'],
  fixes:[]
};

/* ===================== STATE ===================== */
const fp = (std,mat,d,L)=>PRODUCTS.find(p=>p.std===std&&p.mat===mat&&p.d===d&&(L==null?p.L==null:p.L===L));
function seedState(){
  return {
    loggedIn:false,
    basket:[],
    lists:[
      {id:'l1', name:'Verksted standard', items:[{sku:fp('933','ELF',10,30).sku,qty:200},{sku:fp('934','ELF',10).sku,qty:200},{sku:fp('125','ELF',10).sku,qty:400},{sku:fp('912','ELF',8,25).sku,qty:100}]},
      {id:'l2', name:'Merdanlegg A4', items:[{sku:fp('931','A4',16,80).sku,qty:60},{sku:fp('985','A4',16).sku,qty:60},{sku:fp('125','A4',16).sku,qty:120}]}
    ],
    quotes:{}, notify:[], last:null
  };
}
let S;
try{ S = JSON.parse(localStorage.getItem('is-proto-v1')) || seedState(); }catch(e){ S = seedState(); }
function save(){ try{ localStorage.setItem('is-proto-v1', JSON.stringify(S)); }catch(e){} }

const ORDERS = [
  {id:'1002481', date:'02.10.2026', status:'Levert', ref:'PO 4410', lines:[[fp('933','A4',10,30),300],[fp('934','A4',10),300],[fp('125','A4',10),600]]},
  {id:'1002377', date:'11.09.2026', status:'Levert', ref:'Vedlikehold uke 37', lines:[[fp('931','ELF',16,80),80],[fp('NL','VG',16),80],[fp('934','ELF',16),80]]},
  {id:'1002190', date:'20.08.2026', status:'Levert', ref:'PO 4302', lines:[[fp('912','A2',6,20),500],[fp('985','A2',6),500]]}
];
const QUOTES = [
  {id:'T-26-0418', date:'08.10.2026', valid:'22.10.2026', lines:[[fp('931','A4',20,100),120,9.85],[fp('934','A4',20),120,2.10],[fp('NL','A4',20),120,21.40]]},
  {id:'T-26-0402', date:'01.10.2026', valid:'15.10.2026', lines:[[fp('933','VG',12,40),1000,1.05],[fp('125','VG',12),1000,0.19]]}
];

/* ===================== HELPERS ===================== */
const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const esc = s => String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
window.dataLayer = window.dataLayer || [];
const EVENTS=[];
function track(event, params={}){
  const e = Object.assign({event}, params);
  window.dataLayer.push(e);
  EVENTS.unshift(new Date().toLocaleTimeString('nb-NO')+'  '+event+'  '+JSON.stringify(params));
  if(EVENTS.length>30) EVENTS.pop();
  if($('#fixpanel').classList.contains('open')) renderFixPanel();
}
function toast(msg){
  const t=document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); t.textContent=(typeof tr==='function'?tr(msg):msg);
  $('#toastwrap').appendChild(t); setTimeout(()=>t.remove(),2600);
}
function toastLink(msg,href,label){
  const t=document.createElement('div'); t.className='toast'; t.setAttribute('role','status');
  t.innerHTML=`<span>${esc(msg)}</span> <a href="${href}" style="color:#ffd27a;font-weight:600;margin-left:8px">${esc(label)}</a>`;
  if(typeof translateDom==='function') translateDom(t);
  $('#toastwrap').appendChild(t); setTimeout(()=>t.remove(),4200);
}
function priceFor(p){ return p.price; }
function stockHtml(p, long){
  if(p.stock>0) return `<span class="stock-in">På lager${long?': '+fmtInt(p.stock)+' stk':' ('+fmtInt(p.stock)+')'}</span>`;
  return `<span class="stock-out" data-fix="P1">Bestillingsvare${long?', normalt 5 til 10 arbeidsdager':''}</span>`;
}
function qtyBox(id, val, label){
  return `<div class="qty"><button type="button" data-act="dec" aria-label="Færre">−</button><input type="number" min="1" step="1" inputmode="numeric" id="${id}" value="${val||1}" aria-label="${esc(label||'Antall stk')}"><button type="button" data-act="inc" aria-label="Flere">+</button></div>`;
}
function primaryLabel(){ return S.loggedIn ? 'Legg i bestilling' : 'Legg til i tilbudsforespørsel'; }
function basketName(){ return S.loggedIn ? 'Bestilling' : 'Forespørsel'; }
function basketCount(){ return S.basket.length; }

/* ===================== DRAWINGS ===================== */
function drawing(kind, std, big){
  const w=big?320:120, h=big?190:72;
  if(kind==='nut') return `<svg width="${w}" height="${h}" viewBox="0 0 160 95" role="img" aria-label="Teknisk tegning mutter"><g fill="none" stroke="currentColor" stroke-width="2"><polygon points="50,12 90,12 110,47 90,82 50,82 30,47"/><circle cx="70" cy="47" r="17"/><circle cx="70" cy="47" r="21" stroke-dasharray="3 3"/>${std==='985'?'<rect x="118" y="25" width="26" height="44"/><rect x="118" y="25" width="26" height="12" stroke-dasharray="2 2"/>':'<rect x="118" y="25" width="26" height="44"/>'}</g><text x="70" y="93" font-size="9" text-anchor="middle" fill="currentColor">d</text></svg>`;
  if(kind==='washer') return std==='NL'
    ? `<svg width="${w}" height="${h}" viewBox="0 0 160 95" role="img" aria-label="Teknisk tegning Nord-Lock"><g fill="none" stroke="currentColor" stroke-width="2"><circle cx="60" cy="47" r="34"/><circle cx="60" cy="47" r="14"/><path d="M110 30h40M110 30l5 8 5-8 5 8 5-8 5 8 5-8 5 8M110 64h40M110 64l5-8 5 8 5-8 5 8 5-8 5 8 5-8"/></g></svg>`
    : `<svg width="${w}" height="${h}" viewBox="0 0 160 95" role="img" aria-label="Teknisk tegning skive"><g fill="none" stroke="currentColor" stroke-width="2"><circle cx="60" cy="47" r="34"/><circle cx="60" cy="47" r="15"/><rect x="115" y="13" width="10" height="68"/></g><text x="60" y="51" font-size="9" text-anchor="middle" fill="currentColor">d</text></svg>`;
  if(std==='912') return `<svg width="${w}" height="${h}" viewBox="0 0 160 95" role="img" aria-label="Teknisk tegning sylinderskrue"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="10" y="27" width="26" height="40" rx="3"/><path d="M18 40h10M18 54h10"/><rect x="36" y="37" width="110" height="20"/><path d="M60 37v20M68 37v20M76 37v20M84 37v20M92 37v20M100 37v20M108 37v20M116 37v20M124 37v20M132 37v20M140 37v20" stroke-width="1"/></g><text x="90" y="82" font-size="9" text-anchor="middle" fill="currentColor">L</text></svg>`;
  const full = std!=='931';
  let threads=''; const start= full?40:92;
  for(let x=start;x<146;x+=7) threads+=`M${x} 37v20`;
  return `<svg width="${w}" height="${h}" viewBox="0 0 160 95" role="img" aria-label="Teknisk tegning sekskantbolt"><g fill="none" stroke="currentColor" stroke-width="2"><path d="M10 25h26v44H10z M10 36h26 M10 58h26"/><rect x="36" y="37" width="110" height="20"/><path d="${threads}" stroke-width="1"/><path d="M36 80h110M36 76v8M146 76v8" stroke-width="1"/></g><text x="91" y="92" font-size="9" text-anchor="middle" fill="currentColor">L</text></svg>`;
}
const STD_PHOTO={'933':'bolt_zinc','931':'bolt_zinc','934':'nut','985':'nyloc','125':'washer','NL':'nordlock'};
const CAT_PHOTO={'skruer-bolter':'bolt_black','skiver':'washer','muttere':'nut','tommegjenger':'bolt_zinc','innfesting':'anchor','nagler':'rivet','annet':'splitpin'};
function photo(key,cls,label){ return `<span class="ph ph-${key} ${cls||''}" ${label?`role="img" aria-label="${esc(label)}"`:'aria-hidden="true"'}></span>`; }
function thumb(p){ const k=STD_PHOTO[p.std]; return k?photo(k,'pthumb'):`<span class="pthumb pthumb-d" aria-hidden="true">${drawing(stdOf(p).kind,p.std,false)}</span>`; }
function catIcon(c){
  if(CAT_PHOTO[c.slug]) return photo(CAT_PHOTO[c.slug],'',c.name);
  const map={bolt:['bolt','933'],washer:['washer','125'],nut:['nut','934'],rod:['bolt','933'],anchor:['bolt','931'],rivet:['bolt','912'],other:['washer','NL']};
  const [k,s]=map[c.icon]||['bolt','933']; return drawing(k,s,false);
}

/* ===================== SEARCH ===================== */
const ISO_MAP={'4017':'933','4014':'931','4762':'912','4032':'934','10511':'985','7089':'125'};
function parseQuery(q){
  const s=' '+q.toUpperCase().replace(/,/g,'.').replace(/×|\*/g,'X')+' ';
  const r={};
  const art=s.match(/\b04\d{12}\b/); if(art){ r.sku=art[0]; return r; }
  const st=s.match(/(?:DIN|ISO)?\s?-?\b(933|931|912|934|985|125|4017|4014|4762|4032|10511|7089)\b/);
  if(st) r.std = ISO_MAP[st[1]]||st[1];
  if(/NORD.?LOCK/.test(s)) r.std='NL';
  if(!r.std){
    if(/LÅSEMUTTER|NYLON/.test(s)) r.std='985';
    else if(/UMBRAKO|SYLINDERSKRUE|INNVENDIG/.test(s)) r.std='912';
    else if(/DELGJENGET/.test(s)) r.std='931';
    else if(/HELGJENGET/.test(s)) r.std='933';
    else if(/MUTTER/.test(s)) r.kind='nut';
    else if(/SKIVE/.test(s)) r.kind='washer';
    else if(/BOLT|SKRUE/.test(s)) r.kind='bolt';
  }
  const m=s.match(/\bM\s?(\d{1,2})(?:\s?X\s?(\d{2,3}))?\b/);
  if(m){ r.d=+m[1]; if(m[2]) r.L=+m[2]; }
  else { const dx=s.match(/\b(\d{1,2})\s?X\s?(\d{2,3})\b/); if(dx){ r.d=+dx[1]; r.L=+dx[2]; } }
  if(/\bA4\b|A4-|SYREFAST/.test(s)) r.mat='A4';
  else if(/\bA2\b|A2-|RUSTFRI/.test(s)) r.mat='A2';
  else if(/\bELF\b|ELFORSINK|FORSINKET/.test(s)) r.mat='ELF';
  else if(/\bVG\b|VARMGALV|GALV/.test(s)) r.mat='VG';
  return r;
}
function searchProducts(q){
  q=(q||'').trim(); if(!q) return [];
  const r=parseQuery(q);
  if(r.sku) return BY_SKU[r.sku]?[BY_SKU[r.sku]]:[];
  const crit=Object.keys(r).length;
  if(!crit){ const t=q.toUpperCase(); return PRODUCTS.filter(p=>p.label.includes(t)||stdOf(p).name.toUpperCase().includes(t)); }
  return PRODUCTS.filter(p=>(!r.std||p.std===r.std)&&(!r.kind||stdOf(p).kind===r.kind)&&(!r.d||p.d===r.d)&&(!r.L||p.L===r.L)&&(!r.mat||p.mat===r.mat));
}
function describeQuery(q){
  const r=parseQuery(q); const parts=[];
  if(r.sku) parts.push('artikkelnr. '+r.sku);
  if(r.std) parts.push(STANDARDS[r.std].din);
  if(r.kind) parts.push({nut:'muttere',washer:'skiver',bolt:'bolter og skruer'}[r.kind]);
  if(r.d) parts.push('M'+r.d+(r.L?'x'+r.L:''));
  if(r.mat) parts.push(MATERIALS[r.mat].name);
  return parts.join(', ');
}
