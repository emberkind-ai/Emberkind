"use strict";
/* ================= CARDS (3.0.9) =================
   Home: each practice and tool has its own living card, in different sizes, with text that always reads clearly
   (on a dark frosted panel, or dark ink on the journal's paper). Check-in is full width, with a sky that follows the
   time of day and your weather, and a full-screen view. You: each of the six cards has its own art.
   Every card keeps its id and its tap action; only what it looks like changes. Low-stim mode and reduced motion keep
   everything still (see app-09.css). */
(function(){const $=s=>document.querySelector(s);
function art(card,cls,html){if(!card||card.querySelector(":scope > ."+cls))return;const a=document.createElement("span");a.className=cls;a.setAttribute("aria-hidden","true");a.innerHTML=html;card.insertBefore(a,card.firstChild);}
function panel(card,cls){if(!card||card.querySelector(":scope > ."+cls))return null;const t=document.createElement("span");t.className=cls;[...card.children].filter(e=>e.tagName==="B"||e.tagName==="SMALL").forEach(e=>t.appendChild(e));card.appendChild(t);return t;}
const siro=()=>typeof CMP_ART!=="undefined"&&CMP_ART.siro?CMP_ART.siro:"";
const mood=n=>typeof moodSVG==="function"?moodSVG(n):"";
/* Inner Atlas: everything shares one centre (the middle of the figure): five stationary rings, each fainter than the
   last, and a pulse that grows from that centre at a steady speed, fading out exactly at the fifth ring; each ring
   brightens as the pulse passes (timings in app-11.css: one pulse every 2.4s, 4.8s to cross) */
const RINGS=[[18,.62],[34,.48],[50,.35],[66,.23],[82,.13]];
const atlasArt=id=>'<span class="adots"></span><svg viewBox="0 0 100 200" class="bdy"><defs><radialGradient id="ekAu'+id+'" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFC27A" stop-opacity=".42"/><stop offset="1" stop-color="#FFC27A" stop-opacity="0"/></radialGradient></defs><circle class="aura" cx="50" cy="100" r="70" fill="url(#ekAu'+id+')"/><g class="rings">'+RINGS.map(([r,o])=>`<circle class="rg" cx="50" cy="100" r="${r}" style="--o:${o};--d:${(r/82*4.8).toFixed(3)}s"/>`).join("")+'</g><g class="pul"><circle cx="50" cy="100" r="82"/><circle cx="50" cy="100" r="82"/></g><path class="out" d="M50 8C57 8 61 14 61 21C61 28 57 33 54 34L54 38C62 40 70 42 74 46C78 50 79 58 80 70L83 96C84 102 83 108 80 110C78 104 77 98 76 92L73 72C72 78 71 88 71 98C71 108 70 114 68 120L67 160C67 172 68 184 66 194L58 194C57 180 56 168 55 156L52 122L50 120L48 122L45 156C44 168 43 180 42 194L34 194C32 184 33 172 33 160L32 120C30 114 29 108 29 98C29 88 28 78 27 72L24 92C23 98 22 104 20 110C17 108 16 102 17 96L20 70C21 58 22 50 26 46C30 42 38 40 46 38L46 34C43 33 39 28 39 21C39 14 43 8 50 8Z"/><path class="chan" d="M50 118V12"/><path class="ln" d="M38 58Q50 66 62 58"/>'+[[50,14,"#A47BFF"],[50,23,"#7B86FF"],[50,36,"#4FA8FF"],[50,56,"#3FBF7F"],[50,72,"#F5D04A"],[50,88,"#F59A3C"],[50,114,"#EF5A6A"],[19,106,"#3FBF7F"],[81,106,"#3FBF7F"],[39,152,"#EF5A6A"],[61,152,"#EF5A6A"],[38,188,"#EF5A6A"],[62,188,"#EF5A6A"]].map(([x,y,c],i)=>`<circle class="pt" style="--c:${c};--i:${i}" cx="${x}" cy="${y}" r="3.6"/>`).join("")+'</svg>';
const PENCIL='<svg viewBox="0 0 60 14" class="pen"><path d="M6 4h40v6H6z" fill="#F2C744"/><path d="M6 4h40v2H6z" fill="#F8DA6A"/><path d="M46 4l10 3-10 3z" fill="#E8C9A0"/><path d="M53 6l3 1-3 1z" fill="#3A3A3A"/><path d="M0 4h6v6H0z" fill="#E88A9A"/><path d="M5 4h2v6H5z" fill="#BFC4CC"/></svg>';
function home(){const bc=$("#breatheCard");if(bc&&bc.parentNode)bc.parentNode.classList.add("hgreg");
  art($("#breatheCard"),"hxa",'<span class="bsky"></span><span class="borb"><i class="r3"></i><i class="r2"></i><i class="r1"></i><i class="core"></i></span><span class="belts">'+["#F08A3C","#4FA8D8","#9CC8E8","#6DB25A","#9B7BE0"].map((c,i)=>`<i style="--c:${c};--a:${i*72}deg"></i>`).join("")+'</span><span class="bcue"><i>Breathe in</i><i>Breathe out</i></span>');
  art($("#medCard"),"hxa",'<span class="mstars">'+Array.from({length:14},(_,i)=>`<i style="--x:${(i*37)%92+4}%;--y:${(i*53)%60+4}%;--d:${(i%5)*.7}s"></i>`).join("")+'</span><span class="menso"></span><span class="mmoon"></span>');
  art($("#checkCard"),"hxa",'<span class="csky"></span><span class="csun"></span><i class="ccl a"></i><i class="ccl b"></i><i class="ccl c"></i><span class="crain"></span><span class="csnow"></span><span class="chill a"></span><span class="chill b"></span>');
  const JART='<svg viewBox="0 0 200 60" class="jl" preserveAspectRatio="none"><path class="w1" d="M8 14c10-6 18 6 28 0s16-6 26 0 18 4 28-2 18 6 30 0 16-4 26 2 20-4 30 0"/><path class="w2" d="M8 34c12-5 16 5 28 0s18-5 26 1 20 3 30-2 16 5 28 0 20-3 30 1"/><path class="w3" d="M8 54c10-5 20 5 30 0s16-5 28 0 18 3 28-1"/></svg><span class="jpen">'+PENCIL+'</span>';art($("#journalCard"),"hxa",JART);
  const s=siro(),BART=v=>v?`<span class="tb"><img class="g g1" src="${v}" alt=""><img class="g g2" src="${v}" alt=""><img class="g g3" src="${v}" alt=""><img class="me" src="${v}" alt=""></span>`:"";art($("#focusCard"),"hxa",s?`<span class="tb"><img class="g g1" src="${s}" alt=""><img class="g g2" src="${s}" alt=""><img class="g g3" src="${s}" alt=""><img class="me" src="${s}" alt=""></span>`:"");
  art($("#atlasCard"),"hxa",atlasArt("h"));const ta=$("#toolAtlas");if(ta){art(ta,"hxa",atlasArt("t"));ta.classList.add("atl3");}const ac=$("#atlasCard");if(ac)ac.classList.add("atl3");
  /* Tools: the same Journal and Task buddy cards as Home, with the same words */
  const tj=$("#toolJournal");if(tj&&typeof JART!=="undefined"){art(tj,"hxa",JART);tj.classList.add("jx3");const sm=tj.querySelector(".tt small");if(sm)sm.textContent="Write freely, privately.";}
  const tbd=$("#toolBuddy");if(tbd&&s){art(tbd,"hxa",BART(s));tbd.classList.add("bx3");const sm=tbd.querySelector(".tt small");if(sm)sm.textContent="Company for hard-to-start things.";}
  ["#breatheCard","#medCard","#checkCard","#journalCard","#focusCard","#atlasCard"].forEach(id=>{const c=$(id);if(!c)return;c.classList.add("hx3");panel(c,"hxt");});
  const ck=$("#checkCard");if(ck){const t=ck.querySelector(".hxt");if(t&&!t.querySelector(".cmood")){const b=t.querySelector("b"),sm=t.querySelector("small");if(b)b.textContent="How are you, really?";if(sm)sm.textContent="A one-minute check-in: mood, energy and what helps.";
      const m=document.createElement("span");m.className="cmood";m.innerHTML=[1,2,3,4,5,6].map(n=>`<span class="mic" style="--sz:24px">${mood(n)}</span>`).join("");t.appendChild(m);
      const go=document.createElement("span");go.className="ccta";go.textContent="Check in";t.appendChild(go);}
    if(!ck.querySelector(".hxfs")){const f=document.createElement("span");f.className="hxfs";f.setAttribute("role","button");f.tabIndex=0;f.setAttribute("aria-label","Open check-in full screen");
      f.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
      const openFs=e=>{e.stopPropagation();e.preventDefault();full();};f.addEventListener("click",openFs);f.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" ")openFs(e);});ck.appendChild(f);}}}
/* the full-screen check-in sky */
let fs=null;function full(){const host=$("#app")||document.body;if(!fs){fs=document.createElement("div");fs.className="ckfs";fs.setAttribute("role","dialog");fs.setAttribute("aria-modal","true");fs.setAttribute("aria-label","Check-in");
    fs.innerHTML='<span class="hxa" aria-hidden="true"><span class="csky"></span><span class="csun"></span><i class="ccl a"></i><i class="ccl b"></i><i class="ccl c"></i><i class="ccl d"></i><span class="crain"></span><span class="csnow"></span><span class="chill a"></span><span class="chill b"></span></span>'+
      '<button type="button" class="ckx" aria-label="Close">&times;</button><div class="ckin"><h2>How are you, really?</h2><p>Tap the weather that matches your inside right now.</p><div class="ckm">'+
      ["Awful","Low","Average","Steady","Glowing","Radiant"].map((n,i)=>`<button type="button" data-m="${i+1}"><span class="mic" style="--sz:46px">${mood(i+1)}</span><span>${n}</span></button>`).join("")+'</div><button type="button" class="ckall">Open the full check-in</button></div>';
    fs.addEventListener("click",e=>{if(e.target.closest(".ckx"))return close();const m=e.target.closest("[data-m]");if(m||e.target.closest(".ckall")){close();start(m?m.dataset.m:null);}});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&fs&&fs.classList.contains("on"))close();});host.appendChild(fs);}
  fs.classList.add("on");setTimeout(()=>{const x=fs.querySelector(".ckx");x&&x.focus({preventScroll:true});},60);}
function close(){if(fs)fs.classList.remove("on");}
function start(m){try{if(typeof openTrack!=="function")return $("#checkCard").click();try{trackFrom="fire";}catch(e){}openTrack("today");if(m)setTimeout(()=>{if(typeof openCheckin==="function")openCheckin(+m);else{const b=document.querySelector('#tMoods .mo[data-m="'+m+'"]');if(b)b.click();}},320);}catch(e){}}
/* You: six cards, each its own */
function you(){const A={youCheck:'<span class="ysky"></span><span class="ysun"></span><i class="ycl"></i>',
  youJournal:'<svg viewBox="0 0 100 40" class="yjl" preserveAspectRatio="none"><path d="M6 12c8-5 14 5 22 0s12-5 20 0 14 4 22-1 14 5 24 0"/><path d="M6 28c9-4 13 4 22 0s14-4 21 1 15 3 24-2"/></svg>',
  youRout:'<span class="yclk"><i class="hand"></i><i class="d d1"></i><i class="d d2"></i><i class="d d3"></i><i class="d d4"></i></span>',
  youAwards:'<span class="ymed"><i class="rib l"></i><i class="rib r"></i><i class="disc"><svg viewBox="0 0 24 24"><path d="M12 4l2.3 5 5.5.5-4.2 3.6 1.3 5.4L12 15.8 7.1 18.5l1.3-5.4L4.2 9.5l5.5-.5z"/></svg></i></span><span class="yshine"></span>',
  youPatterns:'<svg viewBox="0 0 100 44" class="yspark" preserveAspectRatio="none"><path class="ar" d="M2 38L16 30L30 34L44 20L58 24L72 12L86 16L98 6V44H2Z"/><path class="ln" d="M2 38L16 30L30 34L44 20L58 24L72 12L86 16L98 6"/><circle class="tip" cx="98" cy="6" r="3"/></svg>',
  youEmbers:'<span class="ycoal"></span>'+Array.from({length:7},(_,i)=>`<i class="ysp" style="--x:${12+i*12}%;--d:${(i*.55)%3}s;--s:${2+i%3}px"></i>`).join("")};
  Object.keys(A).forEach(id=>{const c=$("#"+id);if(!c)return;c.classList.add("yc3");art(c,"yca",A[id]);panel(c,"yct");});}
function init(){home();you();if(window.EKNAV){const h=EKNAV.hand;EKNAV.hand=function(a,b){h(a,b);const A=document.getElementById("app");if(A)A.classList.remove("app-regpeek");};}}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
/* Siro's art may arrive a moment after start-up */
setTimeout(()=>{const tb2=$("#toolBuddy");if(tb2&&!tb2.querySelector(".tb")&&siro()){const a=tb2.querySelector(".hxa");if(a)a.remove();art(tb2,"hxa",`<span class="tb"><img class="g g1" src="${siro()}" alt=""><img class="g g2" src="${siro()}" alt=""><img class="g g3" src="${siro()}" alt=""><img class="me" src="${siro()}" alt=""></span>`);tb2.classList.add("bx3");}const c=$("#focusCard");if(c&&!c.querySelector(".tb")&&siro()){const a=c.querySelector(".hxa");if(a)a.remove();art(c,"hxa",`<span class="tb"><img class="g g1" src="${siro()}" alt=""><img class="g g2" src="${siro()}" alt=""><img class="g g3" src="${siro()}" alt=""><img class="me" src="${siro()}" alt=""></span>`);}},1500);
window.EKCARDS2={full,close};
})();
/* 3.2.1: phones start sound paused until a tap; if sound is meant to be on but paused, any tap or key resumes it */
["pointerdown","keydown"].forEach(t=>document.addEventListener(t,()=>{try{if(typeof actx!=="undefined"&&actx&&actx.state==="suspended"&&typeof soundWanted!=="undefined"&&soundWanted&&!document.hidden)actx.resume();}catch(e){}},{capture:true,passive:true}));
