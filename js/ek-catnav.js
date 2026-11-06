"use strict";
/* ================= CATEGORY ARROWS (3.9.0) =================
   One shared control for any row of category chips: a thin gold ‹ before the row and › after it move to the
   previous or next category. They work by pressing the chip itself, so the row's own rules (what a category shows,
   resetting the cards, saving state) stay in one place. At the first or last category the matching arrow is
   disabled, and the chosen chip is kept in view.

   Use:  EKCATNAV.attach(rowElement, {chip: "[data-tab]", on: ".on", label: "category"})
   The row can re-render its chips freely; the arrows follow (they watch the row). Used by Embervale's builder
   bar (All, Paths, Village, Practice, Nature, Seasonal) in vale.js. */
(function(){
const CHEV=d=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d<0?"M14.5 6l-6 6 6 6":"M9.5 6l6 6-6 6"}"/></svg>`;
function attach(row,o){if(!row||row._ekcat)return null;row._ekcat=1;o=Object.assign({chip:"button",on:".on",label:"category"},o||{});
  const wrap=document.createElement("div");wrap.className="ekcat";row.parentNode.insertBefore(wrap,row);
  const mk=d=>{const b=document.createElement("button");b.type="button";b.className="ekcat-a "+(d<0?"l":"r");b.innerHTML=CHEV(d);
    b.setAttribute("aria-label",(d<0?"Previous ":"Next ")+o.label);b.addEventListener("click",()=>go(d));return b;};
  const L=mk(-1),R=mk(1);wrap.append(L,row,R);
  const chips=()=>[...row.querySelectorAll(o.chip)].filter(c=>c.offsetParent!==null||c.getClientRects().length);
  const idx=()=>chips().findIndex(c=>c.matches(o.on));
  function sync(){const n=chips().length,i=idx();L.disabled=i<=0;R.disabled=i<0||i>=n-1;
    const c=chips()[i];if(c){const r=row.getBoundingClientRect(),q=c.getBoundingClientRect();
      if(q.left<r.left+8||q.right>r.right-8)row.scrollTo({left:row.scrollLeft+(q.left+q.width/2)-(r.left+r.width/2),behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});}}
  function go(d){const cs=chips(),j=idx()+d;if(j<0||j>=cs.length)return;cs[j].click();requestAnimationFrame(sync);}
  new MutationObserver(()=>requestAnimationFrame(sync)).observe(row,{childList:true,subtree:true,attributes:true,attributeFilter:["class","aria-pressed"]});
  sync();return {go,sync};}
window.EKCATNAV={attach};
})();
