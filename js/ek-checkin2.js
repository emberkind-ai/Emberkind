"use strict";
/* ================= CHECK-IN, DEEPER (3.4.0) =================
   "Add your own": name your own tags for "What's been part of today?" (with one of twenty icons) and your own feeling
   words (with a face); they're kept and offered in every check-in, and flow into entries and Insights like any tag.
   Emotion faces: an expressive face beside the chosen mood, a small face on every feeling word, and a kind line once
   feelings are named (affect labelling: naming a feeling helps it settle). Shared face artwork: window.EKFACE. */
window.EKFACE=(function(){
  const EYE={dot:'<circle cx="8.6" cy="10.6" r="1.25"/><circle cx="15.4" cy="10.6" r="1.25"/>',happy:'<path d="M7.1 11q1.5-1.6 3 0M13.9 11q1.5-1.6 3 0" fill="none" stroke="#2A1A12" stroke-width="1.3" stroke-linecap="round"/>',
    shut:'<path d="M7.2 10.8h2.8M14 10.8h2.8" stroke="#2A1A12" stroke-width="1.3" stroke-linecap="round"/>',wide:'<circle cx="8.6" cy="10.4" r="1.6"/><circle cx="15.4" cy="10.4" r="1.6"/>'};
  const MOUTH={smile:'M8.3 14.6q3.7 3.2 7.4 0',soft:'M9 15q3 1.8 6 0',flat:'M9 15.6h6',sad:'M8.7 16.8q3.3-2.7 6.6 0',small:'M10.6 15.8q1.4-.8 2.8 0',wavy:'M8.3 16q1.25-1.3 2.5 0t2.5 0t2.4 0',grin:'M7.6 13.8q4.4 5.4 8.8 0z'};
  const BROW={worry:'<path d="M6.8 7.9l2.9-1M17.2 7.9l-2.9-1" stroke="#2A1A12" stroke-width="1.1" stroke-linecap="round"/>',cross:'<path d="M6.8 7l2.9 1.2M17.2 7l-2.9 1.2" stroke="#2A1A12" stroke-width="1.2" stroke-linecap="round"/>'};
  const K={awful:["#8FA0C8","dot","sad","worry","tear"],low:["#9DB5DA","dot","sad"],average:["#CBC8D8","dot","flat"],steady:["#BFE3C4","dot","soft"],glowing:["#FFD58A","happy","smile"],radiant:["#FFC36B","happy","grin",0,"blush"],
    anxious:["#F2C26B","wide","wavy","worry"],overwhelmed:["#C7A6F0","wide","small","worry","sweat"],irritated:["#F59A7A","dot","flat","cross"],tired:["#AAB4C8","shut","small"],flat:["#C4C4CC","dot","flat"],sad:["#8FB8E8","dot","sad",0,"tear"],
    lonely:["#A3A8E0","dot","sad","worry"],stuck:["#D4B08C","dot","wavy"],calm:["#9FDCCB","shut","soft"],content:["#B5E39A","happy","smile"],hopeful:["#FFE08A","dot","smile"],grateful:["#F7B6C8","happy","smile",0,"blush"]};
  let uid=0;function svg(kind,size){const k=K[kind]||K.average,[c,e,m,b,x]=k,gid="ekf"+kind+(++uid);return `<svg class="ekf" viewBox="0 0 24 24" width="${size||22}" height="${size||22}" aria-hidden="true"><defs><radialGradient id="${gid}" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity=".9"/></radialGradient></defs><circle cx="12" cy="12" r="10.6" fill="url(#${gid})"/>${b?BROW[b]:""}<g fill="#2A1A12">${EYE[e]}</g>${m==="grin"?`<path d="${MOUTH.grin}" fill="#2A1A12"/><path d="M9.6 15.6q2.4 1.3 4.8 0" fill="#E8607A"/>`:`<path d="${MOUTH[m]}" fill="none" stroke="#2A1A12" stroke-width="1.35" stroke-linecap="round"/>`}${x==="tear"?'<path d="M16.6 12.6q1.2 1.8 0 2.6q-1.2-.8 0-2.6z" fill="#7FC6EA"/>':""}${x==="blush"?'<ellipse cx="6.8" cy="13.6" rx="1.7" ry="1" fill="#F28BA8" opacity=".6"/><ellipse cx="17.2" cy="13.6" rx="1.7" ry="1" fill="#F28BA8" opacity=".6"/>':""}${x==="sweat"?'<path d="M18.4 6.2q1 1.5 0 2.2q-1-.7 0-2.2z" fill="#7FC6EA"/>':""}</svg>`;}
  return {svg,kinds:Object.keys(K)};})();
(function(){const $=s=>document.querySelector(s),F=window.EKFACE,MOODK=["awful","low","average","steady","glowing","radiant"];
const IC={heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',gym:'<path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"/>',paw:'<circle cx="7" cy="10" r="1.6"/><circle cx="10.5" cy="6.5" r="1.6"/><circle cx="14.5" cy="6.5" r="1.6"/><circle cx="18" cy="10" r="1.6"/><path d="M12 12c3 0 5 4 4 6s-6 1-8 0-1-6 4-6z"/>',
  book:'<path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/>',music:'<path d="M9 18V6l10-2v12"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="16" r="2"/>',leaf:'<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14M5 19l7-7"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',
  moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',bike:'<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="M6 16l4-7h5l3 7M10 9l2 7"/>',swim:'<path d="M2 17c2 0 2-1.6 4-1.6S8 17 10 17s2-1.6 4-1.6 2 1.6 4 1.6 2-1.6 4-1.6M8 13l3-5 5 3"/><circle cx="17" cy="6" r="1.6"/>',
  hike:'<path d="M3 20l6-10 4 6 3-4 5 8z"/>',home:'<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/>',shop:'<path d="M5 7h14l-1.5 9h-11z"/><circle cx="9" cy="19" r="1.3"/><circle cx="16" cy="19" r="1.3"/><path d="M5 7L4 4H2"/>',
  talk:'<path d="M4 5h16v11H9l-5 4z"/>',plan:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',game:'<rect x="3" y="8" width="18" height="9" rx="4.5"/><path d="M8 11v3M6.5 12.5h3M15.5 12h.01M17.5 13.5h.01"/>',
  star:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.6 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',cake:'<path d="M4 20h16v-7H4zM4 15c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 4 0M12 13V9M12 6v.01"/>',lotus:'<path d="M12 18c-4 0-7-2-8-5 3 0 5 1 8 5 3-4 5-5 8-5-1 3-4 5-8 5zM12 18c-2-3-2-7 0-11 2 4 2 8 0 11z"/>',car:'<path d="M5 16h14v-4l-2-5H7l-2 5zM5 16v2M19 16v2"/><circle cx="8" cy="14" r="1"/><circle cx="16" cy="14" r="1"/>'};
const ico=k=>`<svg viewBox="0 0 24 24" aria-hidden="true">${IC[k]||IC.star}</svg>`,esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const load=()=>{try{const v=JSON.parse(localStorage.getItem("ek-ci-own")||"{}");return {ctx:Array.isArray(v.ctx)?v.ctx:[],feel:Array.isArray(v.feel)?v.feel:[]};}catch(e){return {ctx:[],feel:[]};}};
const save=o=>{try{localStorage.setItem("ek-ci-own",JSON.stringify(o));}catch(e){}};
const AFF={neg:["Naming a feeling helps it settle. You're doing that right now.","It makes sense to feel this. You don't have to fix it to notice it.","Thank you for being honest with yourself."],pos:["Let this one land for a moment. Where do you feel it?","Notice what helped bring this. It's worth remembering.","Good things count too. Savour it."]};
const NEG=new Set(["anxious","overwhelmed","irritated","tired","flat","sad","lonely","stuck"]);
function chipCtx(t){return `<button aria-pressed="false" data-v="${esc(t.t)}" data-own="1">${ico(t.i)}<span>${esc(t.t)}</span><i class="ciownx" role="button" aria-label="Remove ${esc(t.t)}">&times;</i></button>`;}
function chipFeel(t){return `<button aria-pressed="false" data-v="${esc(t.t)}" data-own="1"><span class="cff">${F.svg(t.f,20)}</span>${esc(t.t)}<i class="ciownx" role="button" aria-label="Remove ${esc(t.t)}">&times;</i></button>`;}
function ensure(){const g=$("#ciCtxG"),fl=$("#ciFl");if(!g||!fl||!g.children.length)return;const own=load();
  /* faces on the built-in feeling words */
  fl.querySelectorAll("button[data-v]:not([data-own])").forEach(b=>{if(!b.querySelector(".cff")&&F.kinds.includes(b.dataset.v))b.insertAdjacentHTML("afterbegin",`<span class="cff">${F.svg(b.dataset.v,20)}</span>`);});
  /* your own tags and words, then the "Add your own" buttons */
  for(const [box,list,mk,kind] of [[g,own.ctx,chipCtx,"ctx"],[fl,own.feel,chipFeel,"feel"]]){box.querySelectorAll("[data-own]").forEach(b=>{if(!list.some(t=>t.t===b.dataset.v))b.remove();});
    list.forEach(t=>{if(![...box.querySelectorAll("[data-own]")].some(b=>b.dataset.v===t.t)){const add=box.querySelector(".ciadd");(add||box).insertAdjacentHTML(add?"beforebegin":"beforeend",mk(t));}});
    if(!box.querySelector(".ciadd")){const a=document.createElement("button");a.type="button";a.className="ciadd";a.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><span>Add your own</span>';a.addEventListener("click",e=>{e.stopPropagation();panel(kind);});box.appendChild(a);}}
  /* the mood's face, beside its name */
  const wx=$("#ciWx"),nm=$("#ciMoodName");if(wx&&nm&&!wx.querySelector(".cimface")){const row=document.createElement("div");row.className="cinamerow";nm.parentNode.insertBefore(row,nm);const f=document.createElement("span");f.className="cimface";row.appendChild(f);row.appendChild(nm);}
  moodFace();if(!fl.nextElementSibling||!fl.nextElementSibling.classList.contains("ciaff")){const p=document.createElement("p");p.className="ciaff";p.setAttribute("aria-live","polite");fl.after(p);}}
function moodFace(){const f=$("#ciWx .cimface"),m=+(($("#ciFlow")||{}).dataset||{}).mood||3;if(f&&f.dataset.m!==String(m)){f.dataset.m=m;f.innerHTML=F.svg(MOODK[m-1],44);f.classList.remove("pop");void f.offsetWidth;f.classList.add("pop");}}
function affirm(){const p=$(".ciaff");if(!p)return;const on=[...document.querySelectorAll('#ciFl button[aria-pressed="true"]')].map(b=>b.dataset.v);if(!on.length){p.textContent="";return;}
  const neg=on.some(v=>NEG.has(v)),L=AFF[neg?"neg":"pos"];p.textContent=L[(on.length+on[0].length)%L.length];}
/* the add-your-own panel */
let pan=null;function panel(kind){const own=load(),step=(kind==="ctx"?$("#ciCtxG"):$("#ciFl"));if(!step)return;if(pan)pan.remove();
  pan=document.createElement("div");pan.className="ciown";pan.setAttribute("role","group");pan.setAttribute("aria-label","Add your own");
  const opts=kind==="ctx"?Object.keys(IC).map((k,i)=>`<button type="button" class="cio${i?"":" on"}" data-i="${k}" aria-label="${k}">${ico(k)}</button>`).join(""):["content","calm","hopeful","grateful","flat","tired","sad","anxious","irritated","lonely","overwhelmed","stuck"].map((k,i)=>`<button type="button" class="cio${i?"":" on"}" data-i="${k}" aria-label="${k}">${F.svg(k,26)}</button>`).join("");
  pan.innerHTML=`<p class="ciownt">${kind==="ctx"?"Name something that's part of your days":"Name a feeling in your own words"}</p><input class="ciownin" maxlength="24" placeholder="${kind==="ctx"?"Therapy, walked the dog, gym...":"Restless, proud, tender..."}" aria-label="Name"><p class="ciownt sm">${kind==="ctx"?"Pick an icon":"Pick a face"}</p><div class="ciowng">${opts}</div><div class="ciownb"><button type="button" class="ciownc">Cancel</button><button type="button" class="ciownok">Add</button></div>`;
  step.after(pan);const inp=pan.querySelector("input");setTimeout(()=>inp.focus(),60);
  pan.addEventListener("click",e=>{e.stopPropagation();const o=e.target.closest(".cio");if(o){pan.querySelectorAll(".cio").forEach(x=>x.classList.toggle("on",x===o));return;}
    if(e.target.closest(".ciownc")){pan.remove();pan=null;return;}
    if(e.target.closest(".ciownok")){const t=inp.value.trim().replace(/\s+/g," ");if(!t){inp.focus();return;}const list=own[kind];if(list.some(x=>x.t.toLowerCase()===t.toLowerCase())||[...step.querySelectorAll("button[data-v]")].some(b=>b.dataset.v.toLowerCase()===t.toLowerCase())){if(typeof toast==="function")toast("You already have that one");return;}
      if(list.length>=12){if(typeof toast==="function")toast("Twelve of your own is plenty. Remove one first.");return;}
      const i=pan.querySelector(".cio.on").dataset.i;list.push(kind==="ctx"?{t,i}:{t,f:i});save(own);pan.remove();pan=null;ensure();const nb=[...step.querySelectorAll("[data-own]")].find(b=>b.dataset.v===t);if(nb)nb.click();}});
  inp.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();pan.querySelector(".ciownok").click();}});}
/* removing one of your own (asks first) */
document.addEventListener("click",async e=>{const x=e.target.closest&&e.target.closest(".ciownx");if(!x)return;e.stopPropagation();e.preventDefault();const b=x.closest("button[data-own]"),box=b.parentNode,kind=box.id==="ciCtxG"?"ctx":"feel",t=b.dataset.v;
  let yes=true;try{if(typeof ask==="function")yes=await ask({title:"Remove “"+t+"”?",text:"It won't be offered in future check-ins. Past entries keep it.",ok:"Remove",danger:true});}catch(err){}
  if(!yes)return;const own=load();own[kind]=own[kind].filter(v=>v.t!==t);save(own);if(kind==="ctx")ci.ctx.delete(t);else ci.feel.delete(t);b.remove();affirm();},true);
function init(){const f=$("#ciFlow");if(!f)return;new MutationObserver(()=>{if(!f.hidden){ensure();moodFace();affirm();}else if(pan){pan.remove();pan=null;}}).observe(f,{attributes:true,attributeFilter:["hidden","data-mood","data-step"]});
  const fl=$("#ciFl");if(fl)fl.addEventListener("click",()=>setTimeout(affirm,20));}
/* Home: "It's been a while" when the last check-in was three or more days ago (a day's "Not now" quiets it) */
function nudge(){const host=document.getElementById("forYou");if(!host)return;let n=document.getElementById("ekNudge"),last=0;try{const m=moods.filter(x=>x.mood);last=m.length?m[m.length-1].at:0;}catch(e){}
  const days=last?Math.floor((Date.now()-last)/864e5):0;let off=false;try{off=localStorage.getItem("ek-nudge")===new Date().toDateString();}catch(e){}
  const want=last&&days>=3&&!off;if(!want){if(n)n.remove();return;}
  if(!n){n=document.createElement("div");n.id="ekNudge";n.className="eknudge";host.parentNode.insertBefore(n,host);
    n.addEventListener("click",e=>{if(e.target.closest("[data-ci]")){if(typeof openCheckin==="function")openCheckin();}else if(e.target.closest(".eknx")){try{localStorage.setItem("ek-nudge",new Date().toDateString());}catch(x){}n.remove();}});}
  n.innerHTML=`<small class="eyk">It's been a while</small><p class="eknb">How's the weather inside today?</p><p class="eyl">Your last check-in was ${days} days ago. A tap is enough.</p><div class="eknr"><button type="button" class="eygo" data-ci>Check in</button><button type="button" class="eknx">Not now</button></div>`;}
setInterval(nudge,4000);setTimeout(nudge,1500);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
