"use strict";
/* ================= ONE MOTION SYSTEM (3.4.0, extended in 3.9.0) =================
   Low-stim mode, "calm" in code ("Calmer visuals and softer sound"): every looping, ambient animation keeps playing in smooth slow
   motion (45% speed); one-off entrances and transitions run at normal speed so screens never feel sluggish;
   canvases slow their own clocks.
   Basic Display, "simple" in code ("Minimise all visuals"): animations rest on a single still image (see the .simple rules); canvases
   draw one still frame. 3.9.0: any looping animation the .simple rules don't cover is held still here as soon as
   it starts, so new visuals can't slip through. "Someone is replying" dots keep moving so that feedback isn't lost.
   The breathing guide is timed transitions, not loops, so neither mode changes its timing.
   Switching back restores full speed and movement, and every canvas is told to re-measure and redraw ("ekmode").
   Test hook: window.EKMOTION = {held(), apply()}. */
(function(){const app=document.getElementById("app");if(!app)return;let calmWas=false,simpleWas=false;
  const isCSS=a=>(window.CSSAnimation&&a instanceof CSSAnimation),held=new Set(),KEEP='.dots,.thinking,[aria-busy="true"]';
  function one(a,calm,simple){if(!isCSS(a))return;let inf=false;try{inf=a.effect.getTiming().iterations===Infinity;}catch(e){}
    if(inf&&simple){const t=a.effect.target;if(!(t&&t.closest&&t.closest(KEEP))){if(a.playState==="running"){a.pause();held.add(a);}return;}}
    if(held.has(a)){held.delete(a);if(a.playState==="paused")a.play();}
    const r=calm&&inf?.45:1;if(a.playbackRate!==r){if(a.updatePlaybackRate)a.updatePlaybackRate(r);else a.playbackRate=r;}}
  function rate(){const calm=app.classList.contains("calm"),simple=app.classList.contains("simple");
    /* leaving Basic Display releases everything it held, including loops on screens that have since closed */if(!simple&&held.size){held.forEach(a=>{try{if(a.playState==="paused")a.play();}catch(e){}});held.clear();}
    if(!calm&&!calmWas&&!simple&&!simpleWas)return;
    try{document.getAnimations().forEach(a=>one(a,calm,simple));}catch(e){}calmWas=calm;simpleWas=simple;}
  /* catch each loop the moment it starts, so nothing runs at full speed (or at all, in Simple) first */
  document.addEventListener("animationstart",e=>{const calm=app.classList.contains("calm"),simple=app.classList.contains("simple");if(!calm&&!simple)return;try{e.target.getAnimations().forEach(a=>one(a,calm,simple));}catch(x){}},true);
  let last=app.className;new MutationObserver(()=>{if(app.className===last)return;const was=last;last=app.className;const m=c=>was.split(/\s+/).includes(c)!==app.classList.contains(c);
    if(m("calm")||m("simple")){rate();requestAnimationFrame(()=>window.dispatchEvent(new Event("ekmode")));}}).observe(app,{attributes:true,attributeFilter:["class"]});
  setInterval(rate,600);rate();window.EKMOTION={held:()=>held.size,apply:rate};})();
