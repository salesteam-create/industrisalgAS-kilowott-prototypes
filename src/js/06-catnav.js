
/* ===================== LIVE CATEGORY MENU (from industrisalg.no, NO + EN) ===================== */
/* group: [nameNO, nameEN, count, [[itemNO, itemEN, sampleStd?], ...]]  (max 4 items shown per group) */
const CATNAV = {
'skruer-bolter':[
 ['Sekskantbolter','Hex Bolts',1981,[['DIN 931 - Sekskantbolt delgjenget','DIN 931 - Hex Bolt Partial Thread','931'],['DIN 933 - Sekskantbolt helgjenget','DIN 933 - Hex Bolt Full Thread','933'],['DIN 6921 - Sekskant flensskrue','DIN 6921 - Hex Flange Bolt'],['DIN 933 - Venstregjenget sekskantbolt','DIN 933 - Left-hand Hex Bolt']]],
 ['Innvendig sekskantskrue','Socket Screws',1296,[['DIN 912 - Sylinderskrue med innvendig sekskant','DIN 912 - Socket Head Cap Screw','912'],['DIN 7991 - Senkhodeskrue med innvendig sekskant','DIN 7991 - Socket Countersunk Head Screw'],['ISO 7380 - Umbrakoskrue med kuppelhode','ISO 7380 - Button Head Socket Screw'],['DIN 7984 - Sylinderskrue med lavt hode','DIN 7984 - Low Head Socket Cap Screw']]],
 ['Maskinskruer','Machine Screws',1103,[['DIN 84 - Sylinderskrue med rett spor','DIN 84 - Slotted Cheese Head Screw'],['DIN 963 - Senkskrue med rett spor','DIN 963 - Slotted Countersunk Head Screw'],['DIN 85 - Panskrue med rett spor','DIN 85 - Slotted Pan Head Screw'],['DIN 7985 - Panskrue','DIN 7985 - Pan Head Screw']]],
 ['Gjengestifter','Set Screws',422,[['DIN 916 - Gjengestift med hul ende','DIN 916 - Set Screw Cup Point'],['DIN 914 - Gjengestift med spiss ende','DIN 914 - Set Screw Cone Point'],['DIN 915 - Gjengestift med tapp ende','DIN 915 - Set Screw Dog Point']]],
 ['Plateskruer','Tapping Screws',323,[['DIN 7981 - Plateskrue med panhode','DIN 7981 - Pan Head Tapping Screw'],['DIN 7982 - Plateskrue med senkhode','DIN 7982 - Countersunk Tapping Screw'],['DIN 7983 - Plateskrue med linsesenkhode','DIN 7983 - Raised Countersunk Tapping Screw']]],
 ['Låseskruer','Carriage Bolts',308,[['DIN 603 - Låseskrue med mutter','DIN 603 - Carriage Bolt C/W Nut'],['DIN 603 - Låseskrue','DIN 603 - Carriage Bolt']]],
 ['Sekskantbolter fingjenget','Hex Bolts Fine Thread',236,[['DIN 960 - Sekskantbolt fingjenget, delgjenget','DIN 960 - Hex Bolt Fine Thread Partial'],['DIN 961 - Sekskantbolt fingjenget, helgjenget','DIN 961 - Hex Bolt Fine Thread Full']]],
 ['Franske treskruer','Hex Wood Screws',181,[['DIN 571 - Fransk treskrue','DIN 571 - Hex Wood Screw'],['Fransk treskrue med flens','Hex Wood Screw with Flange']]],
 ['Selvborende skruer','Self Drilling Screws',127,[['DIN 7504K - Med sekskanthode','DIN 7504K - Hex Head'],['DIN 7504O - Med senkhode','DIN 7504O - Countersunk'],['DIN 7504N - Med panhode','DIN 7504N - Pan Head']]],
 ['Konstruksjonsbolter','Structural Bolts',78,[['DIN 6914 - Høyfast konstruksjonsbolt','DIN 6914 - High-Strength Structural Bolt']]],
 ['Vingeskruer','Wing Screws',36,[['DIN 316 - Vingeskrue','DIN 316 - Wing Screw']]],
 ['Plogbolter','Plow Bolts',23,[['Plogbolt med rundhode','Plow Bolt Round Head'],['Plogbolt med senkhode','Plow Bolt Countersunk Head']]],
 ['Løfteøyebolter','Lifting Eye Bolts',16,[['DIN 580 - Løfteøyebolt','DIN 580 - Lifting Eye Bolt']]],
 ['Drivskruer','Drive Screws',6,[]],
 ['Beltebolter','Elevator Bolts',3,[['Beltebolt med mutter og skive','Elevator Bolt C/W Nut and Washer']]],
 ['Hammerhodebolter','Hammer Head Bolts',2,[['TYPE 20/12 - Hammerhodebolt','TYPE 20/12 - Hammer Head Bolt']]]
],
'skiver':[
 ['Flate skiver','Flat Washers',250,[['DIN 125 - Flat skive','DIN 125 - Flat Washer','125'],['DIN 9021 - Skive med stor ytre diameter','DIN 9021 - Large OD Washer'],['Karosseriskive','Penny Washer'],['DIN 7349 - Tykk skive','DIN 7349 - Thick Washer']]],
 ['Fjærskiver','Spring Washers',127,[['DIN 127 - Fjærskive','DIN 127 - Spring Washer'],['DIN 6796 - Konisk tallerkenskive','DIN 6796 - Conical Spring Washer'],['DIN 7980 - Sprengskive for innv. sekskantskruer','DIN 7980 - Spring Washer for Socket Screws']]],
 ['Tannlåseskiver','Serrated Lock Washers',72,[['DIN 6798 - Tannlåseskive','DIN 6798 - Serrated Lock Washer'],['DIN 6798V - Senktannskive','DIN 6798V - Countersunk Serrated Lock Washer']]],
 ['Nord-Lock skiver','Nord-Lock Washers',62,[['Nord-Lock skive','Nord-Lock Washer','NL'],['Nord-Lock skive SP','Nord-Lock Washer SP']]],
 ['Herdede skiver','Hardened Washers',44,[['DIN 6916 - Herdet konstruksjonsskive','DIN 6916 - Structural Hardened Washer'],['DIN 6340 - Herdet skive','DIN 6340 - Hardened Washer']]],
 ['Firkantskiver','Square Washers',30,[['DIN 436 - Firkantskive','DIN 436 - Square Washer']]],
 ['Sikringsskiver med tunge','Tab Washers',29,[['DIN 432 - Bøyd låseskive med tunge','DIN 432 - Bent Tab Washer'],['DIN 93 - Sikringsskive med tunge','DIN 93 - Tab Washer']]],
 ['Bulldogskiver','Bulldog Washers',28,[['Ensidig bulldogskive','One Sided Bulldog Washer'],['Tosidig bulldogskive','Double Sided Bulldog Washer']]],
 ['Pynteskiver','Decorative Washers',22,[['Pynteskive','Decorative Washer'],['Solid pynteskive','Solid Decorative Washer']]],
 ['Skrå firkantskiver for U-bjelker','Angle Washers U-Section',10,[['DIN 434 - Skrå firkantskive','DIN 434 - Square Taper Washer']]],
 ['Sfæriske / Koniske skiver','Spherical / Conical Washers',10,[['DIN 6319 C - Sfærisk skive','DIN 6319 C - Spherical Washer'],['DIN 6319 D - Konisk skive','DIN 6319 D - Conical Washer']]],
 ['Skrå firkantskiver for I-bjelker','Square Taper Washers',9,[['DIN 435 - Skrå firkantskive','DIN 435 - Square Taper Washer']]],
 ['Starlock-skiver','Starlock Washers',7,[]]
],
'muttere':[
 ['Sekskantmuttere','Hex Nuts',642,[['DIN 934 - Sekskantmutter','DIN 934 - Hex Nut','934'],['DIN 985 - Låsemutter med nylonring','DIN 985 - Hex Nyloc Nut','985'],['DIN 439 - Lav sekskantmutter','DIN 439 - Thin Hex Nut'],['DIN 6334 - Skjøtemutter','DIN 6334 - Hex Coupling Nut']]],
 ['Vingemuttere','Wing Nuts',32,[['DIN 315 - Vingemutter','DIN 315 - Wing Nut']]],
 ['Løfteøyemuttere','Lifting Eye Nuts',27,[['DIN 582 - Løfteøyemutter','DIN 582 - Lifting Eye Nut']]],
 ['Palmuttere','Pal Nuts',21,[['DIN 7967 - Palmutter','DIN 7967 - Hex Pal Nut']]],
 ['Trapezmuttere','Trapez Nuts',10,[]],
 ['Firkantmuttere','Square Nuts',8,[['DIN 557 - Firkantmutter','DIN 557 - Square Nut']]],
 ['Klomuttere','Tee Nuts',7,[]],
 ['Kurvmuttere','Cage Nuts',6,[]],
 ['Sveisemuttere','Weld Nuts',5,[['DIN 929 - Sveisemutter','DIN 929 - Weld Nut']]],
 ['Nord-Lock combimuttere','Nord-Lock Combi Nuts',5,[]],
 ['Rektangulære muttere','Rectangular Nuts',3,[]]
],
'tommegjenger':[
 ['Skruer / Bolter (Imperial)','Screws / Bolts (Imperial)',951,[['UNC - Sekskantbolt delgjenget','UNC - Hex Bolt Partial Thread'],['UNC - Sekskantbolt helgjenget','UNC - Hex Bolt Full Thread'],['UNF - Sekskantbolt delgjenget','UNF - Hex Bolt Partial Thread'],['UNF - Sekskantbolt helgjenget','UNF - Hex Bolt Full Thread']]],
 ['Innvendig sekskantskrue (Imperial)','Socket Screws (Imperial)',378,[['UNC - Sylinderskrue med innvendig sekskant','UNC - Socket Head Cap Screw'],['UNC - Senkhodeskrue med innvendig sekskant','UNC - Socket Countersunk Head Screw'],['UNF - Sylinderskrue med innvendig sekskant','UNF - Socket Head Cap Screw']]],
 ['Muttere (Imperial)','Nuts (Imperial)',217,[['UNC - Sekskantmutter','UNC - Hex Nut'],['UNC - Låsemutter med nylonring','UNC - Hex Nyloc Nut'],['UNF - Sekskantmutter','UNF - Hex Nut'],['UNF - Låsemutter med nylonring','UNF - Hex Nyloc Nut']]],
 ['Gjengestenger / Pinnebolter (Imperial)','Threaded Rods / Stud Bolts (Imperial)',142,[['UNC - Gjengestang / Pinnebolt','UNC - Threaded Rod / Studbolt'],['UNC - Pinnebolt med 2 muttere (L7)','UNC - Studbolt C/W 2 Nuts'],['8UN - Pinnebolt med 2 muttere','8UN - Studbolt C/W 2 Nuts']]],
 ['Gjengestifter (Imperial)','Set Screws (Imperial)',104,[['UNC - Gjengestift med hul ende','UNC - Set Screw Cup Point']]],
 ['Skiver (tommegjenger)','Imperial Washers',25,[['UNC - Sprengskiver for innv. sekskantskruer','UNC - Spring Washer for Socket Cap Screws'],['Imperial - Flat skive','Imperial - Flat Washer']]]
],
'gjengestag':[
 ['Gjengestag / Studbolt','Threaded Rods / Stud Bolts',334,[['DIN 976 - Gjengestang / Pinnebolt','DIN 976 - Threaded Rod / Studbolt'],['DIN 938 - Pinnebolt (gjenget ende)','DIN 938 - Tap End Stud Bolt'],['Trapezgjengestenger','Trapez Rods'],['DIN 939 - Dobbeltendet pinnebolt','DIN 939 - Double Ended Stud']]]
],
'innfesting':[
 ['Ekspansjonsbolter','Wedge Anchors',153,[['Ekspansjonsbolt - europeisk produsent','Wedge Anchor - European Manufacturer'],['Ekspansjonsbolt - asiatisk produsent','Wedge Anchor - Asian Manufacturer'],['RAWL sekskantbolt','RAWL Hex Bolt'],['RAWL pinnebolt','RAWL Pinnbolt']]],
 ['Plugger','Plugs',56,[['Spikerplugg','Nail Plug'],['Nylonplugg','Nylon Plug'],['Rawlnut','Rawl Nut'],['Fasadeplugg','Facade Plug']]],
 ['Slaganker','Anchors',19,[['Ekspansjonshylse','Drop-in Anchor'],['Expresspiker','Split Drive Anchor']]],
 ['Betongskruer','Concrete Screws',5,[['Betongskrue FBS-S','Concrete Screw FBS-S']]],
 ['Bardunbolter','Bardun / Rock Bolts',2,[]]
],
'nagler':[
 ['Blindnagler / Popnagler','Blind Rivets / POP Rivets',116,[['Åpen popnagle','Open Blind Rivet'],['Åpen popnagle med ekstra bredt hode','Open Blind Rivet W/ Extra Wide Head'],['Tett popnagle','Sealed Blind Rivet']]],
 ['Nagler','Rivets',334,[['DIN 660 - Rundnagle','DIN 660 - Round Head Rivet'],['DIN 661 - Senknagle','DIN 661 - Countersunk Rivet'],['Nagle','Rivet'],['Flatnagle','Flat Head Rivet']]],
 ['Blindmuttere','Rivet Nuts',10,[['Blindmutter / Popmutter','POP Nut / Rivet Nut']]]
],
'annet':[
 ['Treskruer','Wood Screws',964,[['Sponplateskrue med senkhode','Countersunk Chipboard Wood Screw'],['DIN 97 - Treskrue med senkhode','DIN 97 - Slotted Countersunk Wood Screw'],['DIN 96 - Treskrue med rundt hode','DIN 96 - Slotted Round Head Wood Screw'],['Terrasseskrue','Terrace Screw']]],
 ['Pinner','Pins',592,[['DIN 94 - Saksesplint','DIN 94 - Split Pin'],['DIN 1481 - Spennstift','DIN 1481 - Spring Pin'],['DIN 1B - Konisk pinne','DIN 1B - Conical / Taper Pin'],['ISO 2338 - Parallell pinne','ISO 2338 - Parallel Pin']]],
 ['Verktøy / Tilbehør','Tools / Accessories',246,[['DIN 338 - Spiralbor','DIN 338 - Twist Drill Bit'],['Murbor','Concrete Drill Bit'],['Bits','Bits']]],
 ['Øyeskruer','Eye Screws',86,[['DIN 444 - Øyeskrue','DIN 444 - Eye Screw'],['ART. 1 - Øyeskrue','ART. 1 - Eye Screw']]],
 ['Andre festemidler / artikler','Other Fasteners / Items',76,[['Båtsøm','Boat Nail'],['ART. 105 - S-krok','ART. 105 - S-Hook'],['Kause','Rope Thimble']]],
 ['Låseringer','Retaining Rings',66,[['DIN 471 - Utvendig låsering','DIN 471 - External Retaining Ring'],['DIN 472 - Innvendig låsering','DIN 472 - Internal Retaining Ring']]],
 ['Skrukroker','Hook Screws',40,[['ART. 11 - Skrukrok','ART. 11 - Hook Screw']]],
 ['Møbelartikler','Furniture Items',31,[['Garderoberør','Wardrobe Pipe'],['Rørholder for garderobestang','Wardrobe Pipe Holder']]],
 ['Kombiskruer','Combi Screws',27,[]],
 ['Vinkelskruer','Angle Screws',17,[['ART. 7 - Vinkelskrue','ART. 7 - Angle Screw']]],
 ['Sjakler','Shackles',7,[]],
 ['Gipsplateskruer','Drywall Screws',7,[]],
 ['Lagersystemer','Warehouse Storage Systems',6,[['Lagerkasse','Storage Box']]],
 ['Wireklemmer','Wire Clamps',6,[['DIN 741 - Wireklemme','DIN 741 - Wire Clamp']]],
 ['Sikkerhetsskruer','Safety Screws',6,[]],
 ['Tjenester','Services',3,[['Sag','Saw'],['Lindapter','Lindapter'],['Løfteutstyr','Lifting Gear']]]
]
};
function megaMenu(c){
  const groups=CATNAV[c.slug]||[]; const en=LANG==='en';
  const catName = en ? (EN[c.name]||c.name) : c.name;
  const link = it => it[2] ? '#/kategori/'+STANDARDS[it[2]].slug : '#/kategori/'+c.slug;
  const cols = groups.map(([gno,gen,n,items])=>`<div class="mg"><a class="mgh" href="#/kategori/${c.slug}">${esc(en?gen:gno)} <span>${fmtInt(n)}</span></a>${items.length?`<ul>${items.map(it=>`<li><a href="${link(it)}" ${it[2]?'class="instock"':''}>${esc(en?it[1]:it[0])}</a></li>`).join('')}</ul>`:''}</div>`).join('');
  return `<div class="dd mega notr" role="region" aria-label="${esc(catName)}"><div class="megain">
    <div class="megatop"><b>${esc(catName)}</b><a href="#/kategori/${c.slug}">${en?'See all':'Se alle'} ${esc(catName.toLowerCase())}</a></div>
    <div class="megagrid ${groups.length<=3?'few':''}">${cols}</div></div></div>`;
}
