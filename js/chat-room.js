"use strict";
/* ===== The chat room: a warm, themed sanctuary for each companion =====
   A candlelit room in their colours, their portrait glowing and breathing until you begin,
   and their own "thinking" animation: Soma's embers, Siro's water ripples, Orra's speech bubble, Ava's avocado. */
(function(){
const view=document.getElementById("view-chat"),msgs=document.getElementById("msgs");if(!view||!msgs)return;
const room=document.createElement("div");room.className="croom";room.setAttribute("aria-hidden","true");
room.innerHTML='<i class="cb cb1"></i><i class="cb cb2"></i><i class="cb cb3"></i><i class="cb cb4"></i><i class="cb cb5"></i><div class="cfloor"></div>';
view.insertBefore(room,view.firstChild);
const hero=document.createElement("div");hero.className="chero";hero.setAttribute("aria-hidden","true");msgs.parentNode.insertBefore(hero,msgs);
const AVO='<svg viewBox="0 0 40 46" aria-hidden="true"><path class="aleaf" d="M20 9c-1-4 1-7 5-8-1 4-2 6-5 8z"/><path class="askin" d="M20 8c-9 0-15 10-15 20 0 9 7 15 15 15s15-6 15-15C35 18 29 8 20 8z"/>'+
  '<path class="aflesh" d="M20 12c-7 0-11 8-11 16 0 7 5 11 11 11s11-4 11-11c0-8-4-16-11-16z"/><circle class="aseed" cx="20" cy="29" r="6.5"/><circle class="ashine" cx="18" cy="27" r="1.6"/></svg>';
const TY={soma:'<span class="ty tyS"><b></b><i></i><i></i><i></i><i></i></span>',siro:'<span class="ty tyR"><i></i><i></i><i></i><b></b></span>',
  orra:'<span class="ty tyO"><i></i><i></i><i></i></span>',ava:'<span class="ty tyA">'+AVO+'</span>'};
const mate=()=>{try{return current;}catch(e){return view.dataset.mate;}};
function theme(){const k=mate();msgs.querySelectorAll(".msg.typing").forEach(m=>{if(!m.querySelector(".dots"))m.classList.remove("typing");});msgs.querySelectorAll(".dots").forEach(d=>{if(d.dataset.ty===k||!TY[k])return;d.dataset.ty=k;d.innerHTML=TY[k];d.classList.add("dthemed");const b=d.closest(".msg");b&&b.classList.add("typing");});
  view.classList.toggle("chas",!!msgs.querySelector(".msg.me"));}
function greet(k){let g="";try{g=typeof greetFor==="function"?greetFor(k):COMPANIONS[k].greeting;}catch(e){g=(COMPANIONS[k]||{}).greeting||"";}return String(g).split(/\n/)[0].trim();}
const esc2=s=>String(s).replace(/[&<>"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));
function sync(k){const c=COMPANIONS[k];if(!c)return;view.dataset.mate=k;hero.innerHTML='<div class="chav">'+companion(c,132)+'</div><p class="chgreet">'+esc2(c.role||"")+"</p>";theme();}
/* opening a chat: your history fades in message by message instead of all at once */
/* every chat opens on the newest message and stays there while everything settles; touching the screen to scroll
   stops it. When the keyboard opens, the latest messages stay in view above it (unless you've scrolled up to read) */
let pinUntil=0,near=true;const bottom=()=>{view.scrollTop=view.scrollHeight;};
function pinFor(ms){pinUntil=Date.now()+ms;bottom();[80,250,600,1100,1800,2400].forEach(t=>setTimeout(()=>{if(Date.now()<pinUntil)bottom();},t));}
view.addEventListener("touchstart",()=>{pinUntil=0;},{passive:true});view.addEventListener("wheel",()=>{pinUntil=0;},{passive:true});
view.addEventListener("scroll",()=>{near=view.scrollHeight-view.scrollTop-view.clientHeight<160;},{passive:true});
msgs.addEventListener("load",e=>{if(e.target.tagName==="IMG"&&Date.now()<pinUntil)bottom();},true);
const keep=()=>{let cv="";try{cv=currentView;}catch(e){}if(cv==="chat"&&near)requestAnimationFrame(bottom);};
if(window.visualViewport)visualViewport.addEventListener("resize",keep);window.addEventListener("resize",keep);
const bx=document.getElementById("box");if(bx)bx.addEventListener("focus",()=>{if(near)[120,350,700].forEach(t=>setTimeout(bottom,t));});
const oc=window.openChat;if(typeof oc==="function")window.openChat=function(){msgs.classList.add("copening");clearTimeout(msgs._co);msgs._co=setTimeout(()=>msgs.classList.remove("copening"),4200);
  const r=oc.apply(this,arguments);near=true;pinFor(2600);Promise.resolve(r).then(()=>pinFor(2600)).catch(()=>{});return r;};
const prev=window.EK_afterRender;window.EK_afterRender=(k,live)=>{try{prev&&prev(k,live);}catch(e){}try{sync(k);}catch(e){}};
new MutationObserver(()=>{try{theme();}catch(e){}}).observe(msgs,{childList:true,subtree:true});
})();
