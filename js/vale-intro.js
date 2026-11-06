"use strict";
/* ================= EMBERVALE: THE FIRST VISIT =================
   The first time you open Embervale, a few full-screen slides over your softly blurred valley show how it works.
   The last slide's button fades them away while the camera glides down from high above into the land. */
window.EVO=(function(){
const IC={
  valley:'<path d="M6 46c8-12 15-18 22-18 5 0 8 3 11 7 3-6 7-9 11-9 4 0 8 7 10 20"/><circle cx="44" cy="14" r="5"/><path d="M20 46v-7m4 7v-5"/>',
  grow:'<path d="M32 52V26"/><path d="M32 30c0-9 7-14 16-14 0 9-7 14-16 14z"/><path d="M32 36c0-7-5-11-12-11 0 7 5 11 12 11z"/><path d="M16 52h32"/><circle cx="48" cy="40" r="4"/><path d="M48 37.5v5M45.5 40h5"/>',
  build:'<path d="M14 50V32l12-10 12 10v18z"/><path d="M22 50v-9h8v9"/><path d="M40 50V36l7-6 7 6v14z"/><path d="M10 50h48"/><path d="M47 24v-6m-3 3h6"/>',
  folk:'<circle cx="22" cy="22" r="5"/><path d="M14 44c0-7 4-12 8-12s8 5 8 12"/><circle cx="42" cy="24" r="4.5"/><path d="M35 44c0-6 3-10 7-10s7 4 7 10"/><path d="M8 50c8-4 16-5 24-5s16 1 24 5"/><path d="M50 12l2 4 4 1-4 1-2 4-2-4-4-1 4-1z"/>',
  explore:'<circle cx="32" cy="32" r="18"/><path d="M38 26l-4 10-10 4 4-10z"/><circle cx="32" cy="32" r="1.6"/><path d="M32 10v4M32 50v4M10 32h4M50 32h4"/>'};
const SLIDES=[
  ["valley","Welcome to Embervale","A valley that grows with you. Every breath, check-in and journal entry brings a little more of it to life."],
  ["grow","Practise, and it grows","Breathing grows trees, water, fire and sky. Every practice also earns Embercoins to build with."],
  ["build","Build your village","Place homes, practice spaces and gardens from the bar along the bottom. Upgrade them over five levels, from a simple hut to a sky-lantern home."],
  ["folk","Villagers and seasons","Villagers move in and follow your practice. The valley changes with the time of day and the seasons, and the mist clears as you grow."],
  ["explore","Make yourself at home","Pinch to zoom, drag to look around, and drag upwards to see the mountains and the sky. Tap anything to learn what it's for."]];
let el=null,i=0,sx=null;
const save=()=>{try{profile.vHow=1;profile.vIntro=1;saveProfile();}catch(e){}};
const still=()=>!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);
function render(){const [ic,t,d]=SLIDES[i],last=i===SLIDES.length-1;
  el.querySelector(".evoart").innerHTML=`<svg viewBox="0 0 64 64" aria-hidden="true">${IC[ic]}</svg>`;el.querySelector(".evot").textContent=t;el.querySelector(".evod").textContent=d;
  el.querySelectorAll(".evodots i").forEach((x,k)=>x.classList.toggle("on",k===i));el.querySelector(".evoback").style.visibility=i?"visible":"hidden";
  const nx=el.querySelector(".evonext");nx.textContent=last?"Enter Embervale":"Next";nx.classList.toggle("enter",last);el.querySelector(".evoskip").hidden=last;
  const c=el.querySelector(".evocard");c.classList.remove("in");void c.offsetWidth;c.classList.add("in");}
function go(n){if(n<0||n>=SLIDES.length)return;i=n;render();}
/* enter: the slides fade while the camera glides down from high above into the land */
function enter(){save();const wrap=el;wrap.classList.add("out");
  try{if(typeof EV!=="undefined"&&EV.cineTo&&EV.state&&!still()){const st=EV.state,hc=st.HC+.5,hr=st.HR+.5,z=EV.zoomDefault||1;EV.cineMode(true);EV.cineSet(hc,hr,z*.55,520);
      EV.cineTo([hc,hr,z*.55,520],[hc,hr,z,0],2200,0).then(()=>EV.cineMode(false));}}catch(e){try{EV.cineMode(false);}catch(x){}}
  setTimeout(()=>{wrap.remove();if(el===wrap)el=null;},still()?300:1300);}
function open(){if(el)return;const host=document.getElementById("valeWrap")||document.body;i=0;
  el=document.createElement("div");el.className="evintro";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","How Embervale works");
  el.innerHTML='<button type="button" class="evoskip">Skip</button><div class="evocard"><div class="evoart"></div><h2 class="evot"></h2><p class="evod"></p></div>'+
    '<div class="evonav"><button type="button" class="evoback" aria-label="Back">&#8249;</button><div class="evodots">'+SLIDES.map(()=>"<i></i>").join("")+'</div><button type="button" class="evonext">Next</button></div>';
  host.appendChild(el);render();
  el.querySelector(".evonext").onclick=()=>{if(i===SLIDES.length-1)enter();else go(i+1);};el.querySelector(".evoback").onclick=()=>go(i-1);el.querySelector(".evoskip").onclick=enter;
  el.addEventListener("touchstart",e=>{sx=e.touches.length===1?e.touches[0].clientX:null;},{passive:true});
  el.addEventListener("touchend",e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>50)go(i+(dx<0?1:-1));});
  el.addEventListener("keydown",e=>{if(e.key==="ArrowRight")go(i+1);else if(e.key==="ArrowLeft")go(i-1);});
  setTimeout(()=>{const n=el&&el.querySelector(".evonext");if(n)n.focus();},60);}
return {open,isOpen:()=>!!el};
})();
