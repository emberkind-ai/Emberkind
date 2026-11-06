"use strict";
/* ================= CLASSIC SKY: SHOOTING STARS (3.9.0, Part 10) =================
   The Milky Way scene has shooting stars (ek-home.js meteors()); Classic now has its own, drawn its way: a thin
   warm-white streak that crosses the upper sky now and then at dusk and at night (every 9 to 20 seconds, half as
   often in Calm), and one wherever you tap the night sky. Never in daylight, in Simple, with reduced motion, or
   while Home is out of sight. It lives in the stars layer, so it passes behind the trees.
   Classic's fireflies are its own CSS layer (#flies, app-01.css): hidden by day, shown at dusk and night.
   Test hooks: window.EKSKY = {shoot(x,y), tick(), ok()}. */
(function(){
const app=document.getElementById("app"),wrap=document.getElementById("scenewrap"),layer=document.getElementById("stars");
if(!app||!wrap||!layer)return;
const RM=window.matchMedia?matchMedia("(prefers-reduced-motion: reduce)"):{matches:false};
const ok=()=>app.classList.contains("ekclassic")&&!app.classList.contains("ekpaint")&&/^(night|dusk)$/.test(app.dataset.phase||"")
  &&!RM.matches&&!app.classList.contains("simple")&&!document.hidden&&(typeof currentView==="undefined"||currentView==="fire");
function shoot(x,y){if(layer.querySelectorAll(".ekshoot").length>=2)return null;
  const s=document.createElement("i"),left=Math.random()<.5;s.className="ekshoot";s.setAttribute("aria-hidden","true");
  s.style.left=Math.round(x)+"px";s.style.top=Math.round(y)+"px";s.style.setProperty("--a",(left?180-(16+Math.random()*18):16+Math.random()*18)+"deg");
  layer.appendChild(s);const done=()=>{if(s.parentNode)s.remove();};s.addEventListener("animationend",done);setTimeout(done,2200);return s;}
function tick(){if(!ok())return null;const r=layer.getBoundingClientRect();return shoot(r.width*(.15+Math.random()*.7),Math.min(r.height*.5,60+Math.random()*170));}
(function loop(){const calm=app.classList.contains("calm");setTimeout(()=>{tick();loop();},(9+Math.random()*11)*1000*(calm?2:1));})();
/* a tap on open night sky sends one from that spot (not on the sun or moon, a button, a companion or the title) */
wrap.addEventListener("click",e=>{if(!ok())return;const t=e.target;if(t.closest&&t.closest("button,a,.orbit,.mate,.hero,.homectl,.ekctrl,.ekinvite,.firetap"))return;
  /* the title lets taps through to the sky, so its area is excluded by position */const h=wrap.querySelector(".hero");if(h){const q=h.getBoundingClientRect();if(e.clientX>=q.left&&e.clientX<=q.right&&e.clientY>=q.top&&e.clientY<=q.bottom)return;}
  const r=layer.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;if(y<0||y>Math.min(r.height,330))return;shoot(x,y);});
window.EKSKY={shoot,tick,ok};
})();
