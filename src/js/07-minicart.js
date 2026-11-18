
/* ===================== MINI CART RAIL (persistent, Amazon-style) ===================== */
FIXES.R8=['Persistent mini cart (Amazon-style)','A slim cart column stays visible on every page while the basket has items: subtotal, go-to-basket button, each item with photo, stock pill, price and a quantity control (bin at 1). It can be hidden to a small tab and the choice is remembered. Acts as a constant reminder to finish the request or order. Hidden on the basket page itself.'];
['home','category','search','product','quick','account','industry','special','contact'].forEach(k=>{ if(PAGE_FIXES[k]&&!PAGE_FIXES[k].includes('R8')) PAGE_FIXES[k].push('R8'); });
PAGE_FIXES.home.push('K5');

const ICON_BIN='<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>';
const ICON_PLUS='<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" d="M12 5v14M5 12h14"/></svg>';
const ICON_MINUS='<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" d="M5 12h14"/></svg>';
let MC_VISIBLE=null;
function mcImg(p){ const k=STD_PHOTO[p.std]; return k?photo(k,'mcimg',p.label):`<span class="mcimg mcdraw" aria-hidden="true">${drawing(stdOf(p).kind,p.std,false)}</span>`; }
function renderMini(){
  const rail=$('#minicart'), tab=$('#mcTab'); if(!rail) return;
  const has=S.basket.length>0, onBasket=(CURRENT==='basket'||CURRENT==='confirm');
  const show = has && !onBasket && !S.mcHidden;
  const showTab = has && !onBasket && (S.mcHidden || window.innerWidth<900);
  if(!has||onBasket){ rail.hidden=true; tab.hidden=true; }
  const visibleNow = show && window.innerWidth>=900;
  document.body.classList.toggle('has-mc', visibleNow);
  rail.hidden=!show;
  tab.hidden=!showTab;
  const n=S.basket.length;
  tab.innerHTML=`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 4h14l-2 9H8.2l.4 2H19v2H7L5 6H3V4h2.4z M9 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/></svg><b>${n}</b><span>Vis kurv</span>`;
  tab.setAttribute('aria-label','Vis kurv, '+n+(n===1?' vare':' varer'));
  if(show){
    const sum=S.basket.reduce((a,l)=>a+BY_SKU[l.sku].price*l.qty,0);
    rail.innerHTML=`
      <div class="mc-head">
        <button type="button" class="mc-hide" data-act="mchide" aria-label="Skjul kurv"><svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" d="M9 5l7 7-7 7"/></svg>Skjul</button>
        ${S.loggedIn?`<div class="mc-lbl">Delsum</div><div class="mc-sum">${fmtNOK(sum)}</div>`:`<div class="mc-lbl">Din forespørsel</div><div class="mc-sum mc-count">${n} ${n===1?'vare':'varer'}</div>`}
        <a class="mc-go" href="#/kurv">${S.loggedIn?'Gå til bestilling':'Gå til forespørsel'}</a>
      </div>
      <ul class="mc-list">${S.basket.map((l,i)=>{const p=BY_SKU[l.sku]; return `<li class="mc-item">
        <a href="${productUrl(p)}" class="mc-pic" title="${esc(p.label)}">${mcImg(p)}</a>
        <span class="mc-pill ${p.stock>0?'in':'out'}">${p.stock>0?'På lager':'Bestillingsvare'}</span>
        <div class="mc-price">${S.loggedIn?fmtNOK(p.price*l.qty):'<span class="mc-np">Pris i tilbud</span>'}</div>
        <div class="mc-qty" role="group" aria-label="${esc(p.label)}">
          <button type="button" data-act="mcdec" data-i="${i}" aria-label="${l.qty>1?'Færre':'Fjern'}">${l.qty>1?ICON_MINUS:ICON_BIN}</button>
          <input type="number" min="1" value="${l.qty}" data-mcqty="${i}" aria-label="Antall" inputmode="numeric">
          <button type="button" data-act="mcinc" data-i="${i}" aria-label="Flere">${ICON_PLUS}</button>
        </div></li>`;}).join('')}</ul>`;
    translateDom(rail);
  } else rail.innerHTML='';
  translateDom(tab);
  if(MC_VISIBLE!==visibleNow){ MC_VISIBLE=visibleNow; if(typeof fitNav==='function') fitNav(); }
}
function mcChanged(ev,i){ save(); updateHeader(); if(CURRENT==='basket') render(true); track(ev,{line:i,lines:S.basket.length}); }
var ACT_EXTRA = Object.assign(typeof ACT_EXTRA!=='undefined'?ACT_EXTRA:{}, {
  mchide(){ S.mcHidden=true; save(); renderMini(); track('mini_cart_hide'); },
  mcshow(){ if(window.innerWidth<900){ go('#/kurv'); return; } S.mcHidden=false; save(); renderMini(); track('mini_cart_show'); },
  mcinc(t){ const i=+t.dataset.i; S.basket[i].qty+=1; mcChanged('mini_cart_qty_change',i); },
  mcdec(t){ const i=+t.dataset.i; if(S.basket[i].qty>1) S.basket[i].qty-=1; else S.basket.splice(i,1); mcChanged(S.basket[i]?'mini_cart_qty_change':'mini_cart_remove',i); }
});
function mcTotalsInPlace(){
  const sum=S.basket.reduce((a,x)=>a+BY_SKU[x.sku].price*x.qty,0); const s=$('#minicart .mc-sum'); if(s&&S.loggedIn) s.textContent=fmtNOK(sum);
  $$('#minicart .mc-item').forEach((li,i)=>{ const pr=li.querySelector('.mc-price'); const l=S.basket[i]; if(pr&&l&&S.loggedIn) pr.textContent=fmtNOK(BY_SKU[l.sku].price*l.qty);
    const b=li.querySelector('[data-act=mcdec]'); if(b&&l){ b.innerHTML=l.qty>1?ICON_MINUS:ICON_BIN; } });
  $('#basketCount').textContent=S.basket.length;
}
document.addEventListener('change',e=>{ const t=e.target; if(t.matches('[data-mcqty]')){ const i=+t.dataset.mcqty, v=parseInt(t.value,10); if(v>0){ S.basket[i].qty=v; save(); mcTotalsInPlace(); if(CURRENT==='basket') basketTotalsInPlace(i); track('mini_cart_qty_change',{line:i,qty:v}); } else t.value=S.basket[i].qty; } });
let mcT; window.addEventListener('resize',()=>{ clearTimeout(mcT); mcT=setTimeout(renderMini,90); });
