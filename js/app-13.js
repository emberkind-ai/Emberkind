"use strict";
/* ================= SMALL KINDNESSES =================
   The "Visit Embervale" button after a practice shows a live preview of your valley behind it, like the Home card. */
(function(){const b=document.getElementById("bVale"),host=document.getElementById("bGrew");if(!b||!host)return;
  const c=b.querySelector("canvas");const paint=()=>{if(!c||!b.getClientRects().length)return;try{const r=b.getBoundingClientRect();paintVale(c,r.width,r.height);}catch(e){}};
  new MutationObserver(()=>{if(!host.hidden)setTimeout(paint,80);}).observe(host,{attributes:true,attributeFilter:["hidden"]});
  window.addEventListener("resize",()=>{if(!host.hidden)paint();});})();

/* "Need a person?" folds into a small dot once you scroll, and opens out again at the top of the page */
(function(){const app=document.getElementById("app");if(!app)return;let raf=0;
  /* some sections scroll the page itself, Breathe scrolls its scene: look at whatever scrolls inside the active section */
  const check=()=>{raf=0;const v=document.querySelector(".view.active");let y=0;if(v){y=v.scrollTop;v.querySelectorAll(".bscene").forEach(s=>{y=Math.max(y,s.scrollTop);});}app.classList.toggle("person-mini",y>40);};
  document.addEventListener("scroll",()=>{if(!raf)raf=requestAnimationFrame(check);},true);
  document.addEventListener("click",e=>{if(e.target.closest&&e.target.closest(".tabs button,.pswitch button"))setTimeout(check,60);});})();

/* Breathe and Meditate share one switch: pinned in the same place, the same size, with a highlight that glides
   between them. It drives the original buttons, so their rules (like not switching mid-session) still apply. */
(function(){const app=document.getElementById("app");if(!app)return;
  const bar=document.createElement("div");bar.className="regswitch";bar.id="regSwitch";bar.setAttribute("role","tablist");bar.setAttribute("aria-label","Breathe or meditate");
  bar.innerHTML='<span class="rsthumb" aria-hidden="true"></span><button type="button" role="tab" data-to="breathe">Breathe</button><button type="button" role="tab" data-to="meditate">Meditate</button>';app.appendChild(bar);
  const sync=()=>{const v=typeof currentView!=="undefined"?currentView:"",on=v==="breathe"||v==="meditate";app.classList.toggle("app-reg",on);bar.classList.toggle("med",v==="meditate");
    bar.querySelectorAll("[data-to]").forEach(b=>{const s=b.dataset.to===v;b.setAttribute("aria-selected",String(s));b.tabIndex=s?0:-1;});};
  bar.addEventListener("click",e=>{const b=e.target.closest("[data-to]");if(!b)return;const v=currentView;if(b.dataset.to===v)return;const src=document.querySelector(`#view-${v} .pswitch [data-go="${b.dataset.to}"]`);if(src)src.click();setTimeout(sync,30);});
  document.querySelectorAll(".view").forEach(el=>new MutationObserver(sync).observe(el,{attributes:true,attributeFilter:["class"]}));sync();})();
