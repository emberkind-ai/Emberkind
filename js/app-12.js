"use strict";
/* ================= SWIPE BETWEEN SECTIONS =================
   A pager like modern apps: swipe anywhere to move through Home, Chats, Embervale, Breathe, Meditate and You (EK_NAV.pages in app-01.js). Both sections
   move together under your finger, so you can see where you're going and drag it back if you change your mind;
   let go past a third of the way (or flick) and it settles in. Tapping a tab or the Breathe/Meditate switch slides
   the same way. Swiping only stands aside for things that are themselves dragged or swiped: sliders and the
   meditation wheel, the orbiting light on Home, decorations while you arrange them, sideways scrollers, text boxes,
   open panels, Embervale, and a breathing or meditation session that's running. Taps work everywhere as normal.
   The outer edges are left to the browser's own back gesture. */
(function(){
const ORDER=(window.EK_NAV&&EK_NAV.pages)||["fire","chats","vale","breathe","meditate","you"],EDGE=24,EASE="cubic-bezier(.2,.8,.2,1)";
const RM=()=>!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);
const DRAGGED='input,textarea,select,[contenteditable],[role=slider],[data-noswipe],.sheet,.scrim,#orbit,.firetap';
const $=s=>document.querySelector(s),viewEl=v=>document.getElementById("view-"+v),cur=()=>typeof currentView!=="undefined"?currentView:"";
const pos=v=>{const i=ORDER.indexOf(v);if(i>=0)return i;try{return ORDER.indexOf(tabOf(v));}catch(e){return -1;}};
/* a session only holds the swipe on its own screen, so a stale flag can never freeze swiping elsewhere */
const breathing=()=>cur()==="breathe"&&typeof bOn!=="undefined"&&!!bOn,meditating=()=>cur()==="meditate"&&typeof mTick!=="undefined"&&!!mTick&&!!$("#mRun")&&!$("#mRun").hidden;
/* only a panel you can actually see holds the swipe: a closed sheet that kept its class never blocks it */
const openPanel=()=>[...document.querySelectorAll(".sheet.on,.scrim.on,#ekPanel.on")].some(e=>{if(!e.getClientRects().length)return false;const cs=getComputedStyle(e);return cs.visibility!=="hidden"&&+cs.opacity>.05&&cs.pointerEvents!=="none";});
function scrollsX(n){for(;n&&n!==document.body;n=n.parentElement){if(n.scrollWidth>n.clientWidth+4){const o=getComputedStyle(n).overflowX;if(o==="auto"||o==="scroll")return true;}}return false;}
function blocked(e){const t=e.target,x=e.touches[0].clientX,app=$("#app");
  if(!ORDER.includes(cur()))return true;
  if(cur()==="vale")return true;/* Embervale's map owns sideways drags; you can swipe into it, and leave by its tab */
  if(app&&(app.classList.contains("app-welcome")||app.classList.contains("app-chat")))return true;
  if(openPanel()||breathing()||meditating()||(window.EKJ&&EKJ.busy()))return true;
  if(x<EDGE||x>innerWidth-EDGE)return true;
  if(t&&t.closest&&(t.closest(DRAGGED)||(typeof arranging!=="undefined"&&arranging&&t.closest("#valeDecor"))))return true;
  return scrollsX(t);}
const W=()=>{const m=$("main");return m?m.clientWidth:innerWidth;};
function place(el,x,anim){if(!el)return;el.style.transition=anim?`transform .26s ${EASE}`:"none";el.style.transform=`translate3d(${x.toFixed(1)}px,0,0)`;}
function clear(el){{const A=document.getElementById("app");if(A)A.classList.remove("app-regpeek");}if(!el)return;el.style.transition="";el.style.transform="";el.style.display="";el.style.zIndex="";if(window.EKNAV)EKNAV.park();}
/* let the next section show itself as it slides in (Meditate shows its setup, as its button would) */
function peek(v){const el=viewEl(v);if(!el)return null;{const A=document.getElementById("app"),reg=v==="breathe"||v==="meditate";if(A)A.classList.toggle("app-regpeek",reg);const rs=document.querySelector(".regswitch");if(rs&&reg)rs.classList.toggle("med",v==="meditate");}if(v==="meditate"&&!meditating()){try{mMode_("setup");mSync();}catch(e){}}el.classList.remove("parked");el.removeAttribute("inert");el.style.display="flex";el.style.zIndex="1";return el;}
let st=null,quiet=false;
document.addEventListener("touchstart",e=>{st=null;if(e.touches.length!==1||blocked(e))return;const t=e.touches[0];st={x:t.clientX,y:t.clientY,t:Date.now(),dx:0,lock:null,el:viewEl(cur()),i:ORDER.indexOf(cur()),nb:null,dir:0};},{passive:true});
document.addEventListener("touchmove",e=>{if(!st||e.touches.length!==1)return;const t=e.touches[0],dx=t.clientX-st.x,dy=t.clientY-st.y;
  if(!st.lock){if(Math.abs(dx)<10&&Math.abs(dy)<10)return;st.lock=Math.abs(dx)>Math.abs(dy)*1.4?"x":"y";if(st.lock==="y"){st=null;return;}}
  if(e.cancelable)e.preventDefault();st.dx=dx;if(RM())return;
  const dir=dx<0?1:-1,j=st.i+dir,w=W();
  if(dir!==st.dir){if(st.nb){clear(st.nb);st.nb=null;}st.dir=dir;if(j>=0&&j<ORDER.length)st.nb=peek(ORDER[j]);}
  if(!st.nb){place(st.el,dx*.3,false);return;}
  place(st.el,dx,false);place(st.nb,dx+(dir>0?w:-w),false);},{passive:false});
function release(commit){const s=st;st=null;if(!s)return;
  if(!commit){place(s.el,0,!RM());if(s.nb)place(s.nb,s.dir>0?W():-W(),!RM());setTimeout(()=>{clear(s.el);if(s.nb)clear(s.nb);},RM()?0:280);return;}
  const v=ORDER[s.i+s.dir];
  if(RM()||!s.nb){clear(s.el);if(s.nb)clear(s.nb);return go(v,s.dir,false);}
  place(s.el,s.dir>0?-W():W(),true);place(s.nb,0,true);
  setTimeout(()=>{s.nb.classList.add("ekno-anim");go(v,s.dir,false);clear(s.el);clear(s.nb);},270);}
document.addEventListener("touchend",()=>{if(!st)return;if(st.lock!=="x"){const s=st;st=null;clear(s.el);return;}
  const dx=st.dx,fast=Math.abs(dx)/Math.max(1,Date.now()-st.t)>.45&&Math.abs(dx)>40,far=Math.abs(dx)>W()*.3,j=st.i+(dx<0?1:-1);
  if(!st.dir)st.dir=dx<0?1:-1;release((fast||far)&&j>=0&&j<ORDER.length&&j===st.i+st.dir);});
document.addEventListener("touchcancel",()=>release(false));
/* open a section the same way its own button would, so nothing it sets up is skipped */
function go(v,dir,animate){quiet=true;try{if(v==="meditate"&&typeof openMeditate==="function")openMeditate();else if(v==="breathe"&&cur()==="meditate")show("breathe");else{const b=$(`.tabs button[data-view="${v}"]`);if(b)b.click();else show(v);}}finally{quiet=false;}if(animate!==false)slide(v,dir);}
function slide(v,dir){const el=viewEl(v);if(!el)return;el.classList.remove("ekno-anim");if(RM())return;el.classList.remove("ekslide-l","ekslide-r");void el.offsetWidth;el.classList.add(dir>0?"ekslide-r":"ekslide-l");setTimeout(()=>el.classList.remove("ekslide-l","ekslide-r"),420);}
/* tabs and the Breathe/Meditate switch slide the same way as a swipe */
document.addEventListener("click",e=>{if(quiet||!e.target.closest)return;const b=e.target.closest(".tabs button[data-view],.pswitch [data-go]");if(!b)return;
  const to=b.dataset.view||b.dataset.go,from=pos(cur()),ti=pos(to);if(from<0||ti<0||from===ti)return;setTimeout(()=>{if(pos(cur())===ti)slide(cur(),ti>from?1:-1);},0);},true);
window.EKSWIPE={order:ORDER.slice()};
})();
