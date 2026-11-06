"use strict";
/* ================= HOME: THE GUIDE CARD (3.7.0) =================
   "About" drops down a card under Home's controls instead of laying text over the painting. Two slides, swiped or
   picked by tab: "How to use" (the directions for whichever Home you're in: the painted scenes, Classic or the 3D
   world) and "About" (what Emberkind and Embervale are, and the guides). Closes on its ×, on About again, on a tap
   outside, or with Back. */
(function(){const $=s=>document.querySelector(s);let card=null,open=false,cur=0,go=()=>{},tab=()=>{};
const TIPS={milkyway:{star:"the bright star in the Milky Way",vale:"the path into the trees"}};
const I={who:'<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c.8-4 4-6 8-6s7.2 2 8 6"/>',fire:'<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.8 2.5-5.5.5 1.6 1.2 2.4 2.5 2.9C12.5 8 12 5.5 12 3z"/>',
  hold:'<path d="M11 5 6 9H3v6h3l5 4zM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>',star:'<path d="m12 3 2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
  vale:'<path d="M3 19 9 9l4 6 3-4 5 8z"/><circle cx="16" cy="6" r="2"/>',swipe:'<path d="M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  look:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'};
const ico=k=>`<svg viewBox="0 0 24 24" aria-hidden="true">${I[k]}</svg>`;
const row=(k,a,b)=>`<li>${ico(k)}<span><b>${a}</b>${b}</span></li>`;
function howTo(){const a=$("#app"),cl=a&&a.classList.contains("ekclassic"),d3=a&&a.classList.contains("ek3d");let sc="milkyway";try{sc=(window.EKPAINT&&EKPAINT.scene())||sc;}catch(e){}const T=TIPS[sc]||TIPS.milkyway;
  const base=row("who","Tap a companion","to sit with them.")+row("hold","Tap the fire","to turn its sound on or off.")+row("fire","Hold the fire","to breathe with it.");
  if(cl)return base+row("star","Tap the star","to meditate.")+row("vale","Tap the cabin","to visit Embervale.")+row("sun","Drag the sun or moon","across the sky, or tap Night/Now.");
  return base+row("star","Tap "+T.star,"to meditate.")+row("vale","Tap "+T.vale,"to visit Embervale.")+row("swipe","Swipe across","to move between the tabs.");}
function build(){card=document.createElement("section");card.className="ekguide";card.setAttribute("role","dialog");card.setAttribute("aria-label","Controls");
  card.innerHTML=`<div class="ekgtop"><div class="ekgtabs" role="tablist"><button type="button" role="tab" data-gt="0" aria-selected="true">Controls</button><button type="button" role="tab" data-gt="1" aria-selected="false">About</button></div><button type="button" class="ekgx" aria-label="Close">×</button></div>
  <div class="ekgslides" data-noswipe><div class="ekgslide" data-gs="0"><ul class="ekghow"></ul></div>
</div></div>`;
  const row=$(".ekctrl");row.after(card);const sl=card.querySelector(".ekgslides");
  tab=i=>{cur=i;card.querySelectorAll("[data-gt]").forEach(b=>b.setAttribute("aria-selected",String(+b.dataset.gt===i)));};go=(i,smooth)=>{sl.scrollTo({left:i*sl.clientWidth,behavior:smooth===false?"auto":"smooth"});tab(i);};
  /* About opens the full card with both Emberkind and Embervale */card.querySelectorAll("[data-gt]").forEach(b=>b.addEventListener("click",()=>{if(+b.dataset.gt===1){close();const l=$("#ekLantern");if(l)l.click();return;}go(0);}));sl.addEventListener("scroll",()=>{tab(Math.round(sl.scrollLeft/Math.max(1,sl.clientWidth)));pills();},{passive:true});
  card.querySelector(".ekgx").addEventListener("click",close);
  document.addEventListener("pointerdown",e=>{if(open&&!card.contains(e.target)&&!e.target.closest('.ekctrl [data-go="controls"]'))close();},true);}
function pills(){const c=$('.ekctrl [data-go="controls"]'),a=$('.ekctrl [data-go="about"]');if(c)c.setAttribute("aria-expanded",String(open&&cur===0));if(a)a.setAttribute("aria-expanded",String(open&&cur===1));}
function show2(i){if(!card)build();i=i||0;card.querySelector(".ekghow").innerHTML=howTo();
  open=true;card.classList.add("on");requestAnimationFrame(()=>go(i,false));tab(i);pills();try{history.pushState({ekguide:1},"");}catch(e){}/* once it has opened, bring the whole card into view */setTimeout(()=>{if(open)card.scrollIntoView({block:"end",behavior:"smooth"});},460);}
function close(){if(!open)return;open=false;card.classList.remove("on");pills();}
/* the same pill again closes it; the other pill switches slide */
/* ---------- the Scene menu: every way Home can look, the current one ticked ---------- */
let menu=null,mOpen=false;
const curMode=()=>{const a=$("#app");return a&&a.classList.contains("ekclassic")?"classic":"milkyway";};
const DESC={classic:"The original illustrated fire, with the sun and moon",milkyway:"A realistic forest under the Milky Way"};
function mList(){const ms=[{id:"classic",name:"Classic"},{id:"milkyway",name:"Milky Way"}],c=curMode();
  return ms.map(m=>`<button type="button" role="option" class="eksi${m.id===c?" on":""}" data-sm="${m.id}" aria-selected="${m.id===c}"><span><b>${m.name}</b><small>${DESC[m.id]||""}</small></span><i aria-hidden="true">${m.id===c?"✓":""}</i></button>`).join("");}
function mBuild(){menu=document.createElement("section");menu.className="ekguide ekscene";menu.setAttribute("role","listbox");menu.setAttribute("aria-label","Scene");
  menu.innerHTML='<div class="ekgtop"><b class="ekstitle">Scene</b><button type="button" class="ekgx" aria-label="Close">×</button></div><div class="eksl"></div>';
  const row=$(".ekctrl");(card&&card.parentNode?card:row).after(menu);menu.querySelector(".ekgx").addEventListener("click",mClose);
  menu.addEventListener("click",e=>{const b=e.target.closest("[data-sm]");if(!b)return;choose(b.dataset.sm);});
  document.addEventListener("pointerdown",e=>{if(mOpen&&!menu.contains(e.target)&&!e.target.closest('.ekctrl [data-go="scene"]'))mClose();},true);}
function choose(id){const P=window.EKPAINT;if(P){if(id==="milkyway")P.useMilkyWay();else P.setClassic(true);}
  setTimeout(()=>{if(menu)menu.querySelector(".eksl").innerHTML=mList();},60);setTimeout(mClose,260);}
function mShow(){if(!menu)mBuild();menu.querySelector(".eksl").innerHTML=mList();mOpen=true;menu.classList.add("on");const b=$('.ekctrl [data-go="scene"]');if(b)b.setAttribute("aria-expanded","true");try{history.pushState({ekscene:1},"");}catch(e){}setTimeout(()=>{if(mOpen)menu.scrollIntoView({block:"end",behavior:"smooth"});},460);}
function mClose(){if(!mOpen)return;mOpen=false;menu.classList.remove("on");const b=$('.ekctrl [data-go="scene"]');if(b)b.setAttribute("aria-expanded","false");}
window.EKSCENE={toggle:()=>mOpen?mClose():mShow(),open:mShow,close:mClose,isOpen:()=>mOpen,choose};
/* ---------- a companion's screen: always the immersive one (the same as the name tabs). Swipe sideways to the next
   (Soma, Siro, Ava, Orra); small ‹ › at the screen's sides hint that you can (they are not buttons) ---------- */
(function(){const ORD=["soma","siro","ava","orra"],NOTE={ava:"General ideas, not dietary advice. With allergies, a medical condition, medication, pregnancy or a history of disordered eating, check with your GP or a dietitian first."};
  let dir=0,sx=0,sy=0,st=0;
  const deco=s=>{if(s._ek)return;s._ek=1;const k=(s.getAttribute("aria-label")||"").toLowerCase(),i=ORD.indexOf(k);if(i<0)return;s.dataset.k=k;s.setAttribute("data-noswipe","");
    if(NOTE[k]&&!s.querySelector(".ekonote")){const p=document.createElement("p");p.className="ekonote";p.textContent=NOTE[k];const at=s.querySelector(".ekok")||s.querySelector(".ekogo");if(at)at.parentNode.insertBefore(p,at);}
    /* 3.9.0 (Part 11): thin gold chevrons you can tap (not hints in a dark pill: they had shared the Home whispers' class) */
    const chev=(c,lab,d)=>`<button type="button" class="ekmnav ${c}" aria-label="${lab}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg></button>`;
    if(i>0)s.insertAdjacentHTML("beforeend",chev("l","Previous companion","M14.5 5.5 8 12l6.5 6.5"));if(i<ORD.length-1)s.insertAdjacentHTML("beforeend",chev("r","Next companion","M9.5 5.5 16 12l-6.5 6.5"));
    s.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest(".ekmnav");if(!b)return;e.stopPropagation();window.EKMATE.go(b.classList.contains("l")?-1:1);});
    /* moving between companions: the screen stays put (no fade from Home, no lift); only the card slides sideways */
    if(dir){s.classList.add("ekswap","on",dir>0?"ekfr":"ekfl");dir=0;}
    s.addEventListener("touchstart",e=>{const t=e.touches[0];sx=t.clientX;sy=t.clientY;st=Date.now();},{passive:true});
    s.addEventListener("touchend",e=>{const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;/* a slow, deliberate swipe counts too (up to 1.2 s) */if(Date.now()-st<1200&&Math.abs(dx)>56&&Math.abs(dx)>Math.abs(dy)*1.5){const j=i+(dx<0?1:-1);if(j>=0&&j<ORD.length){dir=dx<0?1:-1;EKPAINT.open(ORD[j]);}}},{passive:true});};
  new MutationObserver(()=>{document.querySelectorAll(".ekstory").forEach(deco);}).observe(document.body,{childList:true});
  /* every companion tap, anywhere (the fire scene, Legacy's ring), opens the immersive screen; never the old sheet */
  const hook=()=>{if(typeof openMate!=="function"||!window.EKPAINT)return setTimeout(hook,300);window.openMate=openMate=function(k){try{closeSheets();}catch(e){}EKPAINT.open(k);};
    /* closing everything also closes a companion's screen */if(typeof closeSheets==="function"&&!closeSheets._ek){const cs=closeSheets;window.closeSheets=closeSheets=function(){try{if(EKPAINT.isOpen())EKPAINT.close();}catch(e){}return cs.apply(this,arguments);};closeSheets._ek=1;}};hook();
  window.EKMATE={go:d=>{const s=document.querySelector(".ekstory[data-k]");if(!s)return;const j=ORD.indexOf(s.dataset.k)+d;if(j>=0&&j<ORD.length){dir=d;EKPAINT.open(ORD[j]);}},current:()=>{const s=document.querySelector(".ekstory[data-k]");return s?s.dataset.k:null;}};})();
/* ---------- the Journal tab gets its own night writing scene (Check-in's other tabs keep theirs) ---------- */
(function(){const sync=()=>{const v=document.getElementById("view-track"),j=document.getElementById("tJournal");if(v)v.classList.toggle("ekjourn",!!(j&&j.offsetParent));};
  document.addEventListener("click",()=>setTimeout(sync,30),true);setInterval(sync,800);})();
window.EKHOWTO={toggle:i=>{i=i||0;if(!open)return show2(i);if(cur===i)return close();go(i);pills();},open:show2,close,isOpen:()=>open,slide:()=>cur};})();
