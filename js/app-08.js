"use strict";
/* ================= REMINDERS (Emberkind 1.1) =================
   Gentle reminders to check in, regulate and talk the day through, at times each person chooses.
   The phone's push address and chosen times go to Emberkind's server, which sends each reminder on time
   in the person's own time zone. Shown in You, as small lines on the matching screens, and after a session. */
(function(){
const C=window.EK_CONFIG||{},API=String(C.apiBase||"").replace(/\/+$/,"");
const SUPPORTED=!!(window.EK_STANDALONE&&API&&"serviceWorker" in navigator&&"PushManager" in window&&"Notification" in window);
const TYPES=[["checkin","Check in","Notice how you're going"],["regulate","Regulate","Breathe or meditate, whatever feels right"],["day","How was your day","Talk it through with a companion"]];
const SLOTS=[["m","Morning"],["d","Midday"],["e","Evening"]];
const DEF={times:{m:"08:00",d:"12:30",e:"18:00"},on:{checkin:[],regulate:["e"],day:[]}};
const q=s=>document.querySelector(s),say=t=>{try{toast(t);}catch(e){}};
const ls={get:k=>{try{return localStorage.getItem(k);}catch(e){return null;}},set:(k,v)=>{try{localStorage.setItem(k,v);}catch(e){}}};
function load(){try{const v=JSON.parse(ls.get("ek-rem")||"null");if(v&&v.times&&v.on)return v;}catch(e){}return JSON.parse(JSON.stringify(DEF));}
let st=load();
const save=()=>ls.set("ek-rem",JSON.stringify(st));
const tz=()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"Australia/Sydney";}catch(e){return "Australia/Sydney";}};
const perm=()=>SUPPORTED?Notification.permission:"unsupported";
const anyOn=()=>Object.values(st.on).some(a=>a.length);
function fmt(t){const[h,m]=t.split(":").map(Number);return(((h+11)%12)+1)+(m?":"+String(m).padStart(2,"0"):"")+(h>=12?" pm":" am");}
function nextText(){const n=new Date(),now=n.getHours()*60+n.getMinutes();let best=null;
  for(const[type]of TYPES)for(const sl of st.on[type]){const[h,m]=st.times[sl].split(":").map(Number),t=h*60+m,d=t>now?t-now:t+1440-now;if(!best||d<best.d)best={d,t:st.times[sl],today:t>now};}
  return best?(best.today?"today at ":"tomorrow at ")+fmt(best.t):"none set";}
function keyBytes(b){const s=b.replace(/-/g,"+").replace(/_/g,"/"),bin=atob(s+"===".slice((s.length+3)%4));return Uint8Array.from(bin,c=>c.charCodeAt(0));}
async function swReg(){let r=await navigator.serviceWorker.getRegistration();if(!r){try{r=await navigator.serviceWorker.register("sw.js");}catch(e){}}
  return Promise.race([navigator.serviceWorker.ready,new Promise((_,no)=>setTimeout(()=>no(new Error("sw_timeout")),10000))]);}
async function subscription(create){const r=await swReg();let s=await r.pushManager.getSubscription();
  if(!s&&create){const k=await(await fetch(API+"/v1/push/key")).json();s=await r.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:keyBytes(k.key)});}return s;}
async function sync(){if(!SUPPORTED||perm()!=="granted")return false;
  try{const s=await subscription(anyOn());if(!s)return true;
    const body=anyOn()?{subscription:s.toJSON(),tz:tz(),times:st.times,on:st.on}:{endpoint:s.endpoint};
    const r=await fetch(API+"/v1/push/"+(anyOn()?"subscribe":"unsubscribe"),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
    if(r.ok)ls.set("ek-rem-synced",new Date().toDateString());return r.ok;}catch(e){return false;}}
let syncT=null;const syncSoon=()=>{clearTimeout(syncT);syncT=setTimeout(sync,600);};
async function allow(){if(!SUPPORTED)return false;let p=Notification.permission;
  if(p==="default"){try{p=await Notification.requestPermission();}catch(e){}}
  ls.set("ek-rem-asked",String(Date.now()));
  if(p==="granted"){if(!anyOn()){st=JSON.parse(JSON.stringify(DEF));save();}const ok=await sync();render();say(ok?"Reminders on. Next: "+nextText():"Reminders are on. We'll keep trying to connect.");return true;}
  render();if(p==="denied")say("Notifications are blocked. You can allow them in your phone's settings.");return false;}

/* ---------- the Reminders section in You ---------- */
function sectionHTML(){const p=perm();
  const head=p==="granted"?`<p class="quiet">Gentle nudges at times that suit you. Next: <b id="remNext">${nextText()}</b></p>`
    :p==="denied"?`<p class="quiet">Notifications are blocked for Emberkind. To get reminders, allow notifications for Emberkind in your phone's settings.</p>`
    :`<p class="quiet">Gentle nudges to check in, breathe or talk your day through. It starts with one evening reminder at 6 pm, and you choose the rest.</p><button class="big remallow" id="remAllow" type="button">Turn on reminders</button>`;
  const rows=TYPES.map(([k,l,d])=>`<div class="remrow"><div class="remlbl"><b>${l}</b><small>${d}</small></div><div class="remchips" role="group" aria-label="${l} reminder times">${SLOTS.map(([s,sl])=>`<button type="button" class="remchip" data-type="${k}" data-slot="${s}" aria-pressed="${st.on[k].includes(s)}">${sl}</button>`).join("")}</div></div>`).join("");
  const times=`<div class="remtimes">${SLOTS.map(([k,l])=>`<label><span>${l}</span><input type="time" data-t="${k}" value="${st.times[k]}" aria-label="${l} reminder time"></label>`).join("")}</div>`;
  return `<header><h2>Reminders</h2></header>${head}${rows}${times}`;}
function render(){if(!SUPPORTED)return;let sec=q("#remSec");
  if(!sec){const h=[...document.querySelectorAll("#view-you .ysec h2")].find(x=>x.textContent.trim()==="Your data");if(!h)return;
    sec=document.createElement("section");sec.className="ysec yrem";sec.id="remSec";const d=h.closest(".ysec");d.parentNode.insertBefore(sec,d);}
  sec.innerHTML=sectionHTML();nudges();}
const updateNext=()=>{const n=q("#remNext");if(n)n.textContent=nextText();};
function openSettings(){const t=q(".tabs button[data-view=you]");if(t)t.click();setTimeout(()=>{render();const s=q("#remSec");if(s)s.scrollIntoView({behavior:"smooth",block:"start"});},250);}
document.addEventListener("click",e=>{const t=e.target;if(!t.closest)return;
  if(t.closest("#remAllow")){e.preventDefault();allow();return;}
  const c=t.closest(".remchip");if(c){const arr=st.on[c.dataset.type],i=arr.indexOf(c.dataset.slot);if(i>=0)arr.splice(i,1);else arr.push(c.dataset.slot);
    save();c.setAttribute("aria-pressed",String(i<0));if(perm()==="granted")syncSoon();else if(i<0&&perm()==="default")allow();updateNext();nudges();return;}
  if(t.closest("[data-rem-open]")){e.preventDefault();openSettings();}});
document.addEventListener("change",e=>{const inp=e.target.closest&&e.target.closest("#remSec input[data-t]");if(!inp)return;
  const v=/^\d\d:\d\d$/.test(inp.value)?inp.value:st.times[inp.dataset.t],[h,m]=v.split(":").map(Number);
  st.times[inp.dataset.t]=String(h).padStart(2,"0")+":"+String(m).padStart(2,"0");
  save();if(perm()==="granted")syncSoon();updateNext();nudges();});

/* ---------- small reminder lines on the matching screens ---------- */
const NUDGE_AT={regulate:"#bSetup",checkin:"#view-track",day:"#view-fire"};
function nudgeHTML(type){const on=st.on[type];
  if(perm()==="granted"&&on.length)return `<span aria-hidden="true">\ud83d\udd14</span> Reminder: ${SLOTS.filter(([s])=>on.includes(s)).map(([s,l])=>l.toLowerCase()+" "+fmt(st.times[s])).join(", ")} <button type="button" class="remlink" data-rem-open>Change</button>`;
  return `<span aria-hidden="true">\ud83d\udd14</span> <button type="button" class="remlink" data-rem-open>Set a gentle reminder</button>`;}
function nudges(){if(!SUPPORTED)return;for(const[type,sel]of Object.entries(NUDGE_AT)){const host=q(sel);if(!host)continue;
  let n=host.querySelector(":scope > .remnudge");if(!n){n=document.createElement("p");n.className="remnudge";n.dataset.type=type;host.appendChild(n);}n.innerHTML=nudgeHTML(type);}}

/* ---------- after finishing a session or check-in ---------- */
function sheet(){let s=q("#remSheet");if(s)return s;s=document.createElement("div");s.className="sheet rsheet";s.id="remSheet";
  s.setAttribute("role","dialog");s.setAttribute("aria-modal","true");s.setAttribute("aria-labelledby","remTitle");
  s.innerHTML='<h3 id="remTitle">Want a gentle nudge?</h3><p class="rlede">Emberkind can remind you to breathe, check in or talk your day through. We\'ll start with one evening reminder at 6 pm, and you can change it anytime in You.</p><div class="ractions"><button type="button" class="ybtn" id="remLater">Not now</button><button type="button" class="big" id="remYes">Allow reminders</button></div>';
  const a=q("#askSheet");(a&&a.parentNode?a.parentNode:document.body).appendChild(s);
  q("#remLater").onclick=()=>{ls.set("ek-rem-asked",String(Date.now()));closeS();};q("#remYes").onclick=async()=>{closeS();await allow();};return s;}
function openS(){sheet();if(typeof openSheet==="function")openSheet("#remSheet");else q("#remSheet").classList.add("on");}
function closeS(){if(typeof closeSheets==="function")closeSheets();else{const s=q("#remSheet");if(s)s.classList.remove("on");}}
function whenClear(fn,n){if(q(".sheet.on")&&n>0)return setTimeout(()=>whenClear(fn,n-1),1000);fn();}
let lastTask=0,queued=false;const asked=()=>Date.now()-(+ls.get("ek-rem-asked")||0)<3*86400000;
function afterTask(){if(!SUPPORTED||Date.now()-lastTask<8000)return;lastTask=Date.now();const p=perm();
  if(p==="granted"){if(anyOn())setTimeout(()=>say("Next reminder: "+nextText()),1200);return;}
  if(p!=="default"||asked()||queued)return;queued=true;
  setTimeout(()=>whenClear(()=>{queued=false;if(perm()!=="default"||asked()||q(".sheet.on"))return;ls.set("ek-rem-asked",String(Date.now()));openS();},30),1500);}
function watch(){const vb=q("#view-breathe");if(vb)new MutationObserver(()=>{if(vb.dataset.mode==="after")afterTask();}).observe(vb,{attributes:true,attributeFilter:["data-mode"]});
  const ma=q("#mAfter");if(ma)new MutationObserver(()=>{if(ma.getClientRects().length)afterTask();}).observe(ma,{attributes:true,attributeFilter:["hidden","style","class"]});
  const cd=q("#ciDoneT");if(cd)new MutationObserver(()=>{if(cd.textContent.trim()&&cd.getClientRects().length)afterTask();}).observe(cd,{childList:true,characterData:true,subtree:true});}

/* ---------- opening the app from a notification ---------- */
function route(go){const tab=t=>{const b=q(".tabs button[data-view="+t+"]");if(b)b.click();};
  if(go==="checkin"){tab("fire");setTimeout(()=>{const b=q("#checkCard");if(b)b.click();},250);}else if(go==="regulate")tab("breathe");else if(go==="day")tab("fire");}
function fromHash(){const m=/[#&]go=(checkin|regulate|day)\b/.exec(location.hash);if(!m)return;history.replaceState(history.state,"",location.pathname+location.search);
  const w=q("#welcome"),wait=n=>{if(w&&!w.classList.contains("gone")&&w.getClientRects().length&&n>0)return setTimeout(()=>wait(n-1),300);route(m[1]);};setTimeout(()=>wait(40),900);}

function init(){if(!SUPPORTED)return;render();watch();fromHash();window.addEventListener("hashchange",fromHash);
  navigator.serviceWorker.addEventListener("message",e=>{if(e.data&&e.data.go)route(e.data.go);});
  if(!ls.get("ek-agreed")){subscription(false).then(s=>{if(s){fetch(API+"/v1/push/unsubscribe",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({endpoint:s.endpoint})}).catch(()=>{});s.unsubscribe().catch(()=>{});}}).catch(()=>{});return;}
  if(perm()==="granted"&&anyOn()&&ls.get("ek-rem-synced")!==new Date().toDateString())sync();}
if(document.readyState!=="loading")setTimeout(init,300);else document.addEventListener("DOMContentLoaded",()=>setTimeout(init,300));
})();
