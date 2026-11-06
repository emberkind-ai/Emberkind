"use strict";
/* ================= ONE ORDER FOR BREATHE AND MEDITATE, AND HOME'S SECTIONS =================
   Breathe and Meditate share the same order, so they read and work the same way: the title, the minutes, Begin, a
   clear Settings button, the description, what it helps with, how close the next reward is, then everything else.
   On Home, your Embervale sits right under "What would help right now" and the install card, before the tools. */
(function(){
function arrange(id,sels){const c=document.getElementById(id);if(!c)return;const blocks=[];
  for(const s of sels){const e=c.querySelector(s);if(!e)continue;let n=e;while(n&&n.parentElement!==c)n=n.parentElement;if(n&&!blocks.includes(n))blocks.push(n);}
  if(blocks.length<2)return;const first=blocks.reduce((a,b)=>a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_PRECEDING?b:a),mark=document.createComment("order");
  c.insertBefore(mark,first);blocks.forEach(b=>c.insertBefore(b,mark));mark.remove();}
arrange("bSetup",["#bKick2","#bTitle2","#bLen",".bpick","#bLenVal","#bStart","#bSetBtn","#bCtx2","#bHH","#bNext","#bProg","#bPace","#bRec"]);
arrange("mSetup",["#mKick","#mTitle","#mLen",".mpick","#mLenVal","#mStart","#mSetBtn","#mCtx",".mfoot","#mHH","#mNext","#mProg"]);
/* a proper Settings button: icon, a title, the current choices, and an arrow */
["bSetBtn","mSetBtn"].forEach(id=>{const b=document.getElementById(id);if(!b||b.querySelector(".setk"))return;const sum=b.querySelector("span");const box=document.createElement("span");box.className="setbox";
  box.innerHTML='<b class="setk">Settings</b>';if(sum){b.insertBefore(box,sum);box.appendChild(sum);}else b.appendChild(box);b.classList.add("setbtn");b.setAttribute("aria-label","Practice settings");});
/* Home: Embervale right under what would help right now (and the install card), then the tools */
(function(){const card=document.getElementById("valeOpen"),inst=document.getElementById("homeInstall"),help=document.getElementById("forYou");if(!card)return;
  const head=[...document.querySelectorAll("#view-fire .hsec")].find(p=>p.textContent.trim()==="Your world");const after=inst||help;if(!after)return;
  const anchor=after.nextSibling;if(head)after.parentNode.insertBefore(head,anchor);after.parentNode.insertBefore(card,head?head.nextSibling:anchor);})();
})();

/* About Emberkind: a paragraph that lists several things (like the four companions) becomes one card each */
(function(){const card=document.querySelector("#ekAbout .ekab-card");if(!card)return;card.querySelectorAll("p").forEach(p=>{if(p.classList.contains("ekab-lede")||p.querySelectorAll("b").length<2)return;
  const parts=p.innerHTML.split(/(?=<b>)/).map(x=>x.trim()).filter(Boolean);p.outerHTML=parts.map(h=>"<p>"+h.replace(/<\/b>\s*[:.\u2013-]\s*/,"</b>")+"</p>").join("");});})();
/* Home's cards: a small floating motif in each (wind, stars, sun and cloud, pages, sparkles, compass) */
(function(){const M={"x-breathe":'<path d="M8 30h34a8 8 0 1 0-8-8M8 42h48a8 8 0 1 1-8 8M8 54h22"/>',"x-med":'<path d="M40 10l2.4 6 6.6.6-5 4.4 1.6 6.4-5.6-3.4-5.6 3.4 1.6-6.4-5-4.4 6.6-.6zM16 40l1.2 3 3.3.3-2.5 2.2.8 3.2-2.8-1.7-2.8 1.7.8-3.2-2.5-2.2 3.3-.3zM52 46a10 10 0 1 1-6-18 8 8 0 0 0 6 18z"/>',
  "x-check":'<circle cx="44" cy="22" r="9"/><path d="M44 6v4M44 34v4M28 22h4M56 22h4M33 11l3 3M52 30l3 3M33 33l3-3M52 14l3-3M14 52h34a8 8 0 0 0 0-16 12 12 0 0 0-23 3 7 7 0 0 0-11 13z"/>',"x-journal":'<rect x="16" y="10" width="34" height="46" rx="5"/><path d="M24 22h18M24 30h18M24 38h12M46 44l10-10 4 4-10 10-5 1z"/>',
  "x-buddy":'<path d="M32 8l2.5 7 7 2.5-7 2.5L32 27l-2.5-7-7-2.5 7-2.5zM50 34l1.6 4.4 4.4 1.6-4.4 1.6L50 46l-1.6-4.4-4.4-1.6 4.4-1.6zM18 38l1.6 4.4 4.4 1.6-4.4 1.6L18 50l-1.6-4.4-4.4-1.6 4.4-1.6z"/>',"x-atlas":'<circle cx="34" cy="34" r="22"/><circle cx="34" cy="34" r="14"/><path d="M34 6v8M34 54v8M6 34h8M54 34h8M40 28l-4 10-8 4 4-10z"/>'};
  document.querySelectorAll(".hx").forEach(c=>{const k=Object.keys(M).find(x=>c.classList.contains(x));if(!k||c.querySelector(".hxd"))return;const d=document.createElement("span");d.className="hxd";d.setAttribute("aria-hidden","true");d.innerHTML='<svg viewBox="0 0 68 68">'+M[k]+"</svg>";c.appendChild(d);});})();
