"use strict";
/* ================= EMBERVALE INFO CARDS (3.0.6) =================
   Swipe left or right inside an open card to move to the previous or next one, with gold arrows at the edges
   (none before the first card or after the last). Placed items step through everything in your valley; cards
   opened from the builder bar step through the bar. Tapping the valley above an open card closes it, and the X
   has a large, reliable touch area. */
(function(){const $=s=>document.querySelector(s);let bar=null,dir=0,veil=null,box=null;
  /* where the card was opened from */
  document.addEventListener("click",e=>{const t=e.target;if(!t||!t.closest)return;const ci=t.closest("#evCards .evci");
    if(ci){const cards=[...document.querySelectorAll("#evCards .evcard")].filter(c=>c.offsetParent);bar={cards,idx:cards.indexOf(ci.closest(".evcard")),own:true};return;}
    if(t.closest("#valeCanvas"))bar=null;},true);
  function ctx(){if(!box||box.hidden)return null;if(bar&&bar.own&&bar.idx>=0)return {mode:"bar",i:bar.idx,n:bar.cards.length};
    const s=box.querySelector(".evnav .quiet"),m=s&&/(\d+)\s+of\s+(\d+)/.exec(s.textContent);return m?{mode:"items",i:+m[1]-1,n:+m[2]}:null;}
  function go(d){const c=ctx();if(!c)return;const j=c.i+d;if(j<0||j>=c.n)return;dir=d;
    if(c.mode==="items"){const b=box.querySelector('[data-nav="'+(d<0?-1:1)+'"]');if(b)b.click();}
    else{const card=bar.cards[j],ib=card&&card.querySelector(".evci");if(ib){const keep=bar;ib.click();bar=keep;bar.idx=j;}}}
  function decorate(){if(!box||box.hidden)return;const h=box.querySelector(".exh");if(!h)return;h.querySelectorAll(".exarrow").forEach(a=>a.remove());const c=ctx();
    if(c){const mk=(cls,lab,txt,d)=>{const b=document.createElement("button");b.type="button";b.className="exarrow "+cls;b.setAttribute("aria-label",lab);b.innerHTML=txt;
        b.addEventListener("click",e=>{e.stopPropagation();go(d);});h.appendChild(b);};if(c.i>0)mk("exL","Previous","&#8249;",-1);if(c.i<c.n-1)mk("exR","Next","&#8250;",1);}
    const card=box.querySelector(".excard");if(card&&dir){card.classList.add(dir>0?"exin-r":"exin-l");dir=0;}
    const x=box.querySelector(".exx");if(x&&!x._ek){x._ek=1;x.addEventListener("pointerdown",e=>e.stopPropagation());}}
  let guard={t:0,x:0,y:0},wasOn=false,lastUp={x:-99,y:-99};document.addEventListener("pointerup",e=>{lastUp={x:e.clientX,y:e.clientY};},true);
  function sync(){if(!box)return;const on=!box.hidden;if(veil)veil.classList.toggle("on",on);if(on)decorate();else{bar=null;if(wasOn){guard={t:Date.now()+400,x:lastUp.x,y:lastUp.y};const vw=document.getElementById("valeWrap");if(vw){vw.classList.add("evguard");clearTimeout(vw._g);vw._g=setTimeout(()=>vw.classList.remove("evguard"),450);}}}wasOn=on;}
  /* the tap that closes a card can't carry through to whatever sits behind that same spot; any other tap goes through */
  document.addEventListener("click",e=>{if(e.isTrusted&&Date.now()<guard.t&&Math.hypot(e.clientX-guard.x,e.clientY-guard.y)<36&&e.target&&e.target.closest&&e.target.closest("#valeWrap")&&!e.target.closest("#evInfo")){e.preventDefault();e.stopPropagation();}},true);
  function close(){if(!box||box.hidden)return;const x=box.querySelector("[data-close]");if(x)x.click();}
  function attach(){box=$("#evInfo");if(!box)return false;const wrap=box.parentNode;veil=document.createElement("div");veil.className="evveil";veil.setAttribute("aria-hidden","true");wrap.insertBefore(veil,box);
    veil.addEventListener("click",close);
    new MutationObserver(sync).observe(box,{childList:true,attributes:true,attributeFilter:["hidden"]});
    let sx=0,sy=0,st=0,on=false;box.addEventListener("touchstart",e=>{const p=e.touches[0];sx=p.clientX;sy=p.clientY;st=Date.now();on=e.touches.length===1;},{passive:true,capture:true});
    /* finger-up is heard on the whole page: the card can redraw itself mid-swipe, and the browser then sends the
       finger-up to the old, removed element, which never reaches the card */
    document.addEventListener("touchend",e=>{if(!on)return;on=false;if(!box||box.hidden)return;const p=e.changedTouches[0],dx=p.clientX-sx,dy=p.clientY-sy;if(Date.now()-st<4000&&Math.abs(dx)>56&&Math.abs(dx)>Math.abs(dy)*1.4)go(dx<0?1:-1);},{passive:true,capture:true});
    document.addEventListener("touchcancel",()=>{on=false;},{passive:true,capture:true});
    document.addEventListener("keydown",e=>{if(!box||box.hidden)return;if(e.key==="ArrowRight")go(1);else if(e.key==="ArrowLeft")go(-1);});sync();return true;}
  const t=setInterval(()=>{if(attach())clearInterval(t);},800);
  window.EKCARDS={go,ctx};
})();
