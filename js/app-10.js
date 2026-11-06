"use strict";
/* ================= EMBERCOINS AND STREAKS (Emberkind 1.6) =================
   Two streaks: Practice (breathe or meditate, at least a minute) and Reflection (a check-in or a journal entry).
   Each practice or entry earns 100 Embercoins, up to 3 of each kind a day. Milestones are celebrated with bonus coins.
   Streak shields protect a streak for a missed day and are used automatically. A streak that ends starts fresh,
   kindly: coins, streak shields and the valley are never lost. Anyone can hide streaks. */
(function(){
const q=s=>document.querySelector(s),say=t=>{try{toast(t);}catch(e){}};
const COIN=100,DAILY=3,MAXB=3,PRICES={1:300,2:560,3:780},MILES={3:100,7:300,14:500,30:1000,60:1500,100:2500,180:3500,365:5000};
const KIND={p:{name:"Practice",how:"breathe or meditate"},r:{name:"Reflection",how:"check in or journal"}};
const ICON={p:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c4 0 7-2.7 7-6.6 0-3.4-2.3-5.6-3.6-7.6-.5 1.9-1.6 3-2.8 3.4.4-2.9-.9-5.7-3.4-7.2.3 3.3-1.5 5.3-3 7.1C4.9 11.7 5 13 5 14.4 5 18.3 8 21 12 21z"/></svg>',
  r:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19l7-7"/></svg>',
  coin:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5c1.6 1.8 2.4 3.2 2.4 4.6A2.4 2.4 0 0 1 12 14.6a2.4 2.4 0 0 1-2.4-2.5c0-1.4.8-2.8 2.4-4.6z"/></svg>',
  bank:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18h16"/><path d="M6.5 18c0-3 2.4-4.6 5.5-4.6s5.5 1.6 5.5 4.6"/><path d="M12 13.4c1.4-1.2 2-2.4 2-3.6 0-1.6-1.2-2.8-2-4.3-.8 1.5-2 2.7-2 4.3 0 1.2.6 2.4 2 3.6z"/></svg>'};
const fmt=n=>Number(n||0).toLocaleString("en-AU"),esc2=t=>String(t||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const when=t=>{const d=new Date(t),k=day(d);return (k===day()?"today":k===addDays(day(),-1)?"yesterday":d.toLocaleDateString("en-AU",{day:"numeric",month:"short"}))+" "+d.toLocaleTimeString("en-AU",{hour:"numeric",minute:"2-digit"}).toLowerCase();};
const day=d=>{try{return dayStr(d||new Date());}catch(e){d=d||new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}};
const addDays=(k,n)=>{const [y,m,dd]=k.split("-").map(Number);return day(new Date(y,m-1,dd+n));};
function eco(){if(typeof profile==="undefined"||!profile)return null;const e=profile.eco=profile.eco||{};e.coins=e.coins||0;e.banked=e.banked||0;
  e.st=e.st||{};for(const k of ["p","r"])e.st[k]=e.st[k]||{n:0,last:null,best:0};if(!e.today||e.today.d!==day())e.today={d:day(),p:0,r:0};return e;}
const save=()=>{try{saveProfile();}catch(e){}};
const notes=[];function flush(){if(!notes.length)return;say(notes.shift());if(notes.length)setTimeout(flush,2700);}
/* a gap is covered only if there are enough streak shields for every missed day (no ember is wasted on a streak
   that can't be saved); otherwise the count starts fresh and the embers are kept */
function missed(k){const e=eco(),s=e&&e.st[k];if(!s||!s.n||!s.last)return 0;const y=addDays(day(),-1);let m=0,d=s.last;while(d<y&&m<400){d=addDays(d,1);m++;}return m;}
function settle(k){const e=eco();if(!e)return;const s=e.st[k],m=missed(k),nm=KIND[k].name.toLowerCase();if(!m)return;
  if(m<=e.banked){e.banked-=m;s.last=addDays(day(),-1);notes.push((m>1?m+" streak shields":"A streak shield")+" kept your "+nm+" streak alight.");}
  else{s.n=0;s.last=null;notes.push("Your "+nm+" streak is starting fresh. Your coins, embers and valley are all still here.");}
  save();}
/* every earn and spend goes through the ledger; a reward with a key that has already been paid is refused */
function ledger(d,why,key){const e=eco();if(!e)return false;e.log=e.log||[];if(key){e.seen=e.seen||[];if(e.seen.includes(key))return false;e.seen.push(key);if(e.seen.length>120)e.seen=e.seen.slice(-120);}
  e.log.unshift({t:Date.now(),d,why});if(e.log.length>40)e.log=e.log.slice(0,40);return true;}
function earn(k,key,why){const e=eco();if(!e)return false;if(key&&e.seen&&e.seen.includes(key))return false;settle(k);const s=e.st[k],t=day();let got=0;
  if(e.today[k]<DAILY){if(ledger(COIN,why||KIND[k].name,key)){e.today[k]++;e.coins+=COIN;got=COIN;}}else if(key)ledger(0,why||KIND[k].name,key);
  if(s.last!==t){s.n=s.last===addDays(t,-1)?s.n+1:1;s.last=t;s.best=Math.max(s.best||0,s.n);const bonus=MILES[s.n];
    if(bonus){e.coins+=bonus;ledger(bonus,s.n+"-day "+KIND[k].name.toLowerCase()+" streak");save();render();celebrate(k,s.n,bonus,got);return true;}}
  save();render();if(got)pop("+"+got+" Embercoins",s.last===t&&!e.hide?KIND[k].name+" streak: "+s.n+" day"+(s.n===1?"":"s"):"");flush();return true;}
/* ---------- rewards you can feel ---------- */
/* after a reward, point gently at the next village building within reach */
function nextBuild(){try{const e=eco(),V=EVW.VILLAGE,own=profile.vown||{},era=EVW.eraInfo?EVW.eraInfo().i:9,an=w=>(/^[aeiou]/i.test(w)?"an ":"a ")+w,opts=Object.entries(V).filter(([k,v])=>(own[k]||0)<v.max&&(v.era||0)<=era).sort((a,b)=>a[1].price-b[1].price);if(!opts.length)return "";
  const can=opts.filter(([,v])=>v.price<=e.coins).pop();if(can)return "You can build "+an(can[1].name.toLowerCase())+" in Embervale.";const n=opts[0][1];return fmt(n.price-e.coins)+" more for "+an(n.name.toLowerCase())+".";}catch(x){return "";}}
function pop(a,b){let el=q("#ekPop");if(!el){el=document.createElement("div");el.id="ekPop";el.className="ekpop";el.setAttribute("role","status");el.setAttribute("aria-live","polite");document.body.appendChild(el);}
  const nx=/Embercoins$/.test(a)?nextBuild():"";el.innerHTML=ICON.coin+"<span><b>"+a+"</b>"+(b?"<small>"+b+"</small>":"")+(nx?"<em>"+nx+"</em>":"")+"</span>";el.classList.remove("on");void el.offsetWidth;el.classList.add("on");clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove("on"),2600);}
function celebrate(k,n,bonus,got){const s=sheet("ekCele",`<div class="ekburst" aria-hidden="true">${"<i></i>".repeat(14)}</div><div class="ekbig">${ICON[k]}<b>${n}</b></div>
  <h3>${n}-day ${KIND[k].name.toLowerCase()} streak</h3><p class="rlede">${n} days of showing up for yourself. That's how practice becomes part of who you are.</p>
  <p class="ekgain">${ICON.coin}+${fmt(bonus+got)} Embercoins</p><button type="button" class="big" id="ekCeleOk">I honour this.</button>`);q("#ekCeleOk").onclick=closeAll;}
/* ---------- the streaks card on Home ---------- */
function left(){const n=new Date(),m=new Date(n.getFullYear(),n.getMonth(),n.getDate()+1),s=m-n,h=Math.floor(s/36e5),mi=Math.floor(s%36e5/6e4);return h?h+"h "+mi+"m":mi+"m";}
function card(){let el=q("#ekStreaks");if(el)return el;const you=q("#view-you .ypage");if(!you)return null;const hd=you.querySelector(".yhead"),h=hd?hd.nextSibling:you.firstChild;
  const t=document.createElement("p");t.className="hsec";t.textContent="Your streaks";el=document.createElement("div");el.className="ekst";el.id="ekStreaks";you.insertBefore(t,h);you.insertBefore(el,h);
  el.addEventListener("click",ev=>{const b=ev.target.closest("[data-go],[data-shop],[data-vale]");if(!b)return;if(b.dataset.vale!=null){try{show("vale");}catch(x){}return;}if(b.dataset.shop!=null)return shop();const go=b.dataset.go;const c=q(go);if(c)c.click();});return el;}
function youCard(){let el=q("#ekYou");if(el)return el;const h=[...document.querySelectorAll("#view-you .ysec h2")].find(x=>x.textContent.trim()==="Your data"),anchor=q("#acSec")||q("#remSec")||(h&&h.closest(".ysec"));if(!anchor)return null;
  const sec=document.createElement("section");sec.className="ysec";sec.id="ekYouSec";sec.innerHTML='<header><h2>Streaks and Embercoins</h2></header><div class="ekst" id="ekYou"></div>';anchor.parentNode.insertBefore(sec,anchor);el=q("#ekYou");
  el.addEventListener("click",ev=>{const b=ev.target.closest("[data-go],[data-shop]");if(!b)return;if(b.dataset.shop!=null)return shop();const c=q(b.dataset.go);if(c){try{show("fire");}catch(x){}setTimeout(()=>c.click(),300);}});return el;}
function render(){const el=card(),e=eco();if(!el||!e)return;const el2=youCard();const bank=`<button type="button" class="ekpill" data-shop>${ICON.coin}<b>${fmt(e.coins)}</b><small>Embercoins</small></button><button type="button" class="ekpill" data-shop>${ICON.bank}<b>${e.banked}/${MAXB}</b><small>Streak shields</small></button>`;
  if(e.hide){el.innerHTML=`<div class="ekrow">${bank}</div>`;if(el2)el2.innerHTML=el.innerHTML;return;}
  /* 3.4.1: the You page's way: a big number, one line, one action, a soft glow */
  const hero=(k,go,act)=>{const s=e.st[k],done=s.last===day(),open=s.n>0&&!done,line=done?`Done today. Tomorrow makes ${s.n+1}.`:open?"Any amount counts. If today isn't the day, that's okay.":s.n?"Start again today. It counts.":"Start today and light it.";
    return `<div class="eyh${done?" done":""}" data-k="${k}"><small class="eyk">${KIND[k].name}</small><div class="eyb"><b>${s.n}</b><i>&raquo;</i><span>${s.n+1}</span></div><p class="eyl">${line}</p>${done?'<span class="eyok">&#10003; Done today</span>':`<button type="button" class="eygo" data-go="${go}">${act}</button>`}</div>`;};
  let month="";try{const mm=monthMins(),st=AW.month.steps,i=st.findIndex(v=>v>mm),tg=i<0?st[st.length-1]:st[i],nm=AW.month.names[i<0?st.length-1:i],d=new Date(),dl=new Date(d.getFullYear(),d.getMonth()+1,0).getDate()-d.getDate()+1,mon=d.toLocaleDateString("en-AU",{month:"short"}).toUpperCase();
    month=`<div class="eyh eymon"><span class="eybadge">${mon}</span><small class="eyk">This month</small><div class="eyb"><b>${mm}</b><i>/</i><span>${tg} mins</span></div><p class="eyl">${i<0?"Every monthly badge earned this month. That matters.":`${tg-mm} more to ${nm}, any time this ${new Date().toLocaleDateString("en-AU",{month:"long"})}.`}</p><div class="eybar"><i style="width:${Math.min(100,mm/tg*100).toFixed(1)}%"></i></div></div>`;}catch(x){}
  const coins=`<div class="eyh eycoin"><small class="eyk">Embercoins</small><div class="eyb"><b>${fmt(e.coins)}</b></div><p class="eyl">${e.banked} of ${MAXB} streak shields kept. <button type="button" class="eylink" data-shop>About shields</button></p><button type="button" class="eygo" data-vale>Spend in Embervale</button></div>`;
  el.innerHTML=(e.hide?"":`<div class="eygrid">${hero("p","#breatheCard","Practise now")}${hero("r","#checkCard","Check in")}</div><p class="eyany">Any amount counts: a minute of breathing or meditation, or one check-in or journal entry.</p>`)+`<div class="eygrid">${month}${coins}</div>`;if(el2)el2.innerHTML="";}
/* ---------- the shop: streak shields, how it works, and the option to hide streaks ---------- */
function shop(){const e=eco();if(!e)return;const room=MAXB-e.banked;
  const buy=n=>`<button type="button" class="ekbuy" data-n="${n}" ${n>room||e.coins<PRICES[n]?"disabled":""}><b>${n} streak shield${n>1?"s":""}</b><span>${ICON.coin}${fmt(PRICES[n])}</span>${n>1?`<small>Save ${fmt(n*PRICES[1]-PRICES[n])}</small>`:""}</button>`;
  const s=sheet("ekShop",`<h3>Streak shields</h3><p class="rlede">A streak shield keeps one streak alight for a day you miss. It's used automatically, and you can hold up to ${MAXB}. Any amount counts towards a streak.</p>
    <p class="ekhave">${ICON.coin}<b>${fmt(e.coins)}</b> Embercoins <span class="ekdot"></span> ${ICON.bank}<b>${e.banked}/${MAXB}</b> banked</p>
    <div class="ekbuys">${buy(1)}${buy(2)}${buy(3)}</div>${room<1?'<p class="quiet">Your hearth is full. Embers you use make room for more.</p>':""}
    ${(e.log||[]).length?`<details class="ekhow" open><summary>Recent activity</summary><ul class="eklog">${(e.log||[]).slice(0,8).map(l=>`<li><span>${esc2(l.why)}</span><small>${when(l.t)}</small><b class="${l.d>0?"up":l.d<0?"down":""}">${l.d>0?"+":""}${l.d?fmt(l.d):"counted"}</b></li>`).join("")}</ul></details>`:""}
    <details class="ekhow"><summary>How to earn Embercoins</summary><p class="quiet">Each breath or meditation of a minute or more, each check-in and each journal entry earns ${COIN} Embercoins (up to ${DAILY} of each kind a day). Any amount counts towards a streak: a minute of breathing or meditation, or one check-in or journal entry. Streak milestones at 3, 7, 14, 30, 60, 100, 180 and 365 days add a bonus. Spend them on streak shields, or on buildings for your village in Embervale.</p></details>
    <div class="ractions"><button type="button" class="ybtn" id="ekHide">${e.hide?"Show streaks":"Hide streaks"}</button><button type="button" class="big" id="ekDone">Done</button></div>`);
  s.onclick=ev=>{const b=ev.target.closest(".ekbuy");if(b&&!b.disabled){const n=+b.dataset.n;if(e.banked+n>MAXB||e.coins<PRICES[n])return;e.coins-=PRICES[n];e.banked+=n;ledger(-PRICES[n],n+" streak shield"+(n>1?"s":""));save();render();pop("Banked "+n+" ember"+(n>1?"s":""),fmt(e.coins)+" Embercoins left");shop();}};
  q("#ekHide").onclick=()=>{e.hide=!e.hide;save();render();closeAll();say(e.hide?"Streaks hidden. You'll still earn Embercoins.":"Streaks are showing again.");};q("#ekDone").onclick=closeAll;}
/* tells the rest of the app (field guide, weekly intentions, today's gift) that a new practice or entry just happened */
function act(d){try{document.dispatchEvent(new CustomEvent("ek:act",{detail:Object.assign({at:Date.now()},d)}));}catch(e){}}
function sheet(id,inner){let s=q("#"+id);if(!s){s=document.createElement("div");s.className="sheet rsheet eksheet";s.id=id;s.setAttribute("role","dialog");s.setAttribute("aria-modal","true");const a=q("#askSheet");(a&&a.parentNode?a.parentNode:document.body).appendChild(s);}
  s.innerHTML=inner;if(typeof openSheet==="function")openSheet("#"+id);else s.classList.add("on");return s;}
function closeAll(){if(typeof closeSheets==="function")closeSheets();else document.querySelectorAll(".sheet.on").forEach(x=>x.classList.remove("on"));}
/* ---------- listening for practice and reflection ---------- */
function hook(){if(typeof sessionLog==="function"&&!sessionLog._ek){const o=sessionLog;window.sessionLog=function(what,secs){const r=o.apply(this,arguments);try{if(secs>=60&&/^(Breathe|Meditate)/.test(String(what)))if(earn("p","p:"+String(what).slice(0,24)+":"+Math.round(secs)+":"+Math.floor(Date.now()/5000),String(what).split(",")[0]))act({k:"p",what:/^Meditate/.test(String(what))?"med":"breathe"});}catch(e){}return r;};window.sessionLog._ek=1;}
  if(typeof saveMoods==="function"&&!saveMoods._ek){const o=saveMoods,e=eco();if(e&&e.lastAt==null){let m=0;try{for(const x of moods)m=Math.max(m,x.at||0);}catch(z){}e.lastAt=m;}
    window.saveMoods=function(){const r=o.apply(this,arguments);try{const e=eco();let m=e.lastAt||0;const fresh=[];for(const x of moods){if((x.at||0)>(e.lastAt||0)){fresh.push(x);m=Math.max(m,x.at);}}e.lastAt=m;for(const x of fresh)if(earn("r","r:"+x.at,x.mood!=null?"Check-in":"Journal entry"))act({k:"r",what:x.mood!=null?"checkin":"journal"});}catch(z){}return r;};window.saveMoods._ek=1;}}
function wake(){const e=eco();if(!e)return;["p","r"].sort((a,b)=>missed(a)-missed(b)).forEach(settle);render();flush();
  const h=new Date().getHours();if(!e.hide&&h>=18&&e.today.nudged!==day()){const open=["p","r"].filter(k=>e.st[k].n>0&&e.st[k].last!==day());
    if(open.length){e.today.nudged=day();save();setTimeout(()=>say("Your "+open.map(k=>KIND[k].name.toLowerCase()).join(" and ")+" streak"+(open.length>1?"s are":" is")+" still open today. Any amount counts, and if today isn't the day, that's okay."),3200);}}}
window.EKECO={sheet,close:closeAll,bonus:(n,why,key)=>{const e=eco();n=Math.round(Number(n));if(!e||!(n>0)||!key)return false;if(!ledger(n,why,key))return false;e.coins+=n;save();render();pop("+"+fmt(n)+" Embercoins",why);return true;},summary:()=>{const e=eco();return e?{coins:e.coins,p:e.st.p.last===day()||e.st.p.last===addDays(day(),-1)?e.st.p.n:0,r:e.st.r.last===day()||e.st.r.last===addDays(day(),-1)?e.st.r.n:0,banked:e.banked}:{coins:0,p:0,r:0,banked:0};},coins:()=>{const e=eco();return e?e.coins:0;},spend:(n,why,noSave)=>{const e=eco();n=Math.round(Number(n));if(!e||!(n>0)||e.coins<n)return false;e.coins-=n;ledger(-n,why||"Spent");if(!noSave)save();render();return true;},pop,render,shop};
function init(){hook();wake();setInterval(()=>{if(!document.hidden)render();},60000);document.addEventListener("visibilitychange",()=>{if(!document.hidden)wake();});}
if(document.readyState!=="loading")setTimeout(init,700);else document.addEventListener("DOMContentLoaded",()=>setTimeout(init,700));
})();
