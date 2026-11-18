
/* ===================== DATA ===================== */
const MATERIALS = {
  A4:  {code:'A4',  num:'07', name:'A4 Syrefast',     bolt:'A4-80', nut:'A4-80', washer:'A4',     f:3.2},
  A2:  {code:'A2',  num:'05', name:'A2 Rustfri',      bolt:'A2-70', nut:'A2-70', washer:'A2',     f:2.4},
  ELF: {code:'ELF', num:'02', name:'Elforsinket',     bolt:'8.8',   nut:'8',     washer:'HV 200', f:1.0},
  VG:  {code:'VG',  num:'03', name:'Varmgalvanisert', bolt:'8.8',   nut:'8',     washer:'HV 200', f:1.4}
};
const STANDARDS = {
  '933': {num:'0933', din:'DIN 933', iso:'ISO 4017', name:'Sekskantbolt helgjenget', kind:'bolt', cat:'skruer-bolter', slug:'din-933', minL:2, mats:['A4','A2','ELF','VG'],
          desc:'Helgjenget sekskantbolt. Gjenger hele veien opp til hodet gir god klemlengde i tynne konstruksjoner.'},
  '931': {num:'0931', din:'DIN 931', iso:'ISO 4014', name:'Sekskantbolt delgjenget', kind:'bolt', cat:'skruer-bolter', slug:'din-931', minL:3.5, mats:['A4','A2','ELF','VG'],
          desc:'Delgjenget sekskantbolt med glatt skaft. Gir bedre skjærkapasitet der bolten går gjennom flere deler.'},
  '912': {num:'0912', din:'DIN 912', iso:'ISO 4762', name:'Sylinderskrue med innvendig sekskant', kind:'bolt', cat:'skruer-bolter', slug:'din-912', minL:1.5, mats:['A4','A2','ELF'],
          desc:'Sylinderskrue med innvendig sekskant (umbrako). Kompakt hode for trange steder og forsenkede hull.'},
  '934': {num:'0934', din:'DIN 934', iso:'ISO 4032', name:'Sekskantmutter', kind:'nut', cat:'muttere', slug:'din-934', mats:['A4','A2','ELF','VG'],
          desc:'Standard sekskantmutter. Velg samme materiale og fasthetsklasse som bolten.'},
  '985': {num:'0985', din:'DIN 985', iso:'ISO 10511', name:'Låsemutter med nylonring', kind:'nut', cat:'muttere', slug:'din-985', mats:['A4','A2','ELF'],
          desc:'Lav låsemutter med nylonring som hindrer at mutteren løsner ved vibrasjon.'},
  '125': {num:'0125', din:'DIN 125', iso:'ISO 7089', name:'Flat skive', kind:'washer', cat:'skiver', slug:'din-125', mats:['A4','A2','ELF','VG'],
          desc:'Flat skive som fordeler klemkraften og beskytter underlaget.'},
  'NL':  {num:'9100', din:'Nord-Lock', iso:'', name:'Nord-Lock låseskive', kind:'washer', cat:'skiver', slug:'nord-lock', mats:['A4','VG'],
          desc:'Kilelåsende skivepar som sikrer boltforbindelsen med strekk i stedet for friksjon.'}
};
const CATEGORIES = [
  {slug:'skruer-bolter', name:'Skruer / Bolter', subs:['933','931','912'], icon:'bolt'},
  {slug:'skiver', name:'Skiver', subs:['125','NL'], icon:'washer'},
  {slug:'muttere', name:'Muttere', subs:['934','985'], icon:'nut'},
  {slug:'tommegjenger', name:'Tommegjenger', subs:[], icon:'bolt'},
  {slug:'gjengestag', name:'Gjengestag / Studbolt', subs:[], icon:'rod'},
  {slug:'innfesting', name:'Innfesting', subs:[], icon:'anchor'},
  {slug:'nagler', name:'Nagler', subs:[], icon:'rivet'},
  {slug:'annet', name:'Annet', subs:[], icon:'other'}
];
const INDUSTRIES = [
  {slug:'olje-og-energi', name:'Olje og energi', intro:'Festemateriell med full sporbarhet for offshore og landanlegg.', mat:'A4', stds:['931','933','934','NL'], focus:'3.1-sertifikat, L7/A320 og duplex på forespørsel'},
  {slug:'forhandlere', name:'Forhandlere (PROFF videresalg)', intro:'Vi er lageret i bakgrunnen, slik at dere kan levere komplett sortiment.', mat:'ELF', stds:['933','934','125'], focus:'Faste avtalepriser, rask påfylling og hurtigordre'},
  {slug:'akvakultur', name:'Akvakultur', intro:'Festemidler som tåler saltvann og krevende marine miljøer.', mat:'A4', stds:['933','985','125'], focus:'A4 syrefast og varmgalvanisert, sertifikat per ordre'},
  {slug:'maskinentreprenorer', name:'Maskinentreprenører og pukkverk', intro:'Rett festemateriell til tungt utstyr, på lager når maskinen står.', mat:'ELF', stds:['931','934','NL'], focus:'Høyfaste bolter og levering samme dag'},
  {slug:'skipsverft', name:'Skipsverft', intro:'Festemateriell og spesialløsninger til norske verft.', mat:'A4', stds:['931','934','125'], focus:'Sporbarhet og store volum'},
  {slug:'industriell-produksjon', name:'Industriell produksjon', intro:'Stabil leverandør for produksjon som ikke tåler ventetid.', mat:'ELF', stds:['912','933','985'], focus:'Hurtigordre og faste lister'},
  {slug:'mekaniske-verksted', name:'Mekaniske verksted', intro:'Fra én bolt til større kvantum, uten minstekjøp.', mat:'ELF', stds:['912','934','125'], focus:'Kjøp ned til enkeltstykk'},
  {slug:'bygg-og-vedlikehold', name:'Bygg og vedlikehold', intro:'Festemateriell til nybygg og løpende vedlikehold.', mat:'VG', stds:['931','934','125'], focus:'Varmgalvanisert for utendørs bruk'},
  {slug:'jernvare-og-landbruk', name:'Jernvare og landbruk', intro:'Bredt utvalg med fokus på tilgjengelighet.', mat:'VG', stds:['933','934','125'], focus:'Standardsortiment på lager'},
  {slug:'kjoretoyverksted', name:'Kjøretøyverksted', intro:'Rett del raskt, uten unødvendig styr.', mat:'ELF', stds:['912','985','125'], focus:'Enkeltstykk og hurtig levering'},
  {slug:'batutstyr', name:'Båtutstyr', intro:'Løsninger for båt og fritidsmarin som holder i saltvann.', mat:'A4', stds:['912','985','125'], focus:'A4 syrefast'},
  {slug:'byggevare', name:'Byggevare', intro:'Festemateriell fra kjente merker og eget bredt sortiment.', mat:'VG', stds:['933','934','125'], focus:'Forhandleravtaler'}
];
const LENGTHS = [12,16,20,25,30,35,40,50,60,70,80,100,120];
const DIAMS = [6,8,10,12,16,20];

function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return Math.abs(h)}
function pad(n,l){return String(n).padStart(l,'0')}

const PRODUCTS=[]; const BY_SKU={};
for(const [code,s] of Object.entries(STANDARDS)){
  for(const m of s.mats){
    const M=MATERIALS[m];
    for(const d of DIAMS){
      const lens = s.kind==='bolt' ? LENGTHS.filter(L=>L>=Math.max(12,d*s.minL) && L<=d*10) : [null];
      for(const L of lens){
        const sku='04'+s.num+M.num+pad(d*10,3)+pad(L||0,3);
        const grade = s.kind==='bolt'?M.bolt: s.kind==='nut'?M.nut: (code==='NL'?(m==='A4'?'A4':'Delta Protekt'):M.washer);
        const size=' M '+d+(L?' X '+L:'');
        let label;
        if(code==='NL') label=(m==='A4'?'A4 NORD-LOCK':'DELTA PROTEKT NORD-LOCK')+' M '+d;
        else if(m==='A4'||m==='A2') label=(s.kind==='washer'?m:grade)+' '+s.din+size;
        else label=m+' '+s.din+(s.kind==='washer'?'':' '+grade)+size;
        const h=hash(sku);
        const stock = (h%9===0)?0:((h%40)*(d<=10?250:60)+ (h%97));
        let price;
        if(s.kind==='bolt') price=(d*d*(L||10)*0.00085*M.f)+0.32;
        else if(s.kind==='nut') price=d*d*0.0055*M.f+0.18;
        else if(code==='NL') price=d*0.85+2.4+(m==='A4'?2:0);
        else price=d*d*0.0024*M.f+0.07;
        const pack = s.kind==='bolt' ? (d<=8?200:d<=12?100:(L>80?25:50)) : (d<=10?500:200);
        const p={sku,std:code,mat:m,d,L,grade,label,stock,price:Math.round(price*100)/100,pack};
        PRODUCTS.push(p); BY_SKU[sku]=p;
      }
    }
  }
}
const STD_BY_SLUG = Object.fromEntries(Object.entries(STANDARDS).map(([k,v])=>[v.slug,k]));
const fmtNOK = n => n.toLocaleString('nb-NO',{minimumFractionDigits:2,maximumFractionDigits:2})+' kr';
const fmtInt = n => n.toLocaleString('nb-NO');
const PITCH={6:'1,0',8:'1,25',10:'1,5',12:'1,75',16:'2,0',20:'2,5'};
const pitchOf = p => STANDARDS[p.std].kind==='washer' ? '–' : PITCH[p.d]+' mm';
const productUrl = p => '#/produkt/'+p.sku;
const stdOf = p => STANDARDS[p.std];
const matOf = p => MATERIALS[p.mat];
const sizeOf = p => 'M'+p.d+(p.L?'x'+p.L:'');
