"use strict";
/* ================= CHAT POLISH AND REPLY REPORTS (Emberkind 1.0.0) =================
   Replies appear word by word, new messages rise gently into place, and every companion reply has
   a small menu: Copy, Keep in Embers, Report this reply. Reports go to the Emberkind team without
   leaving the app (Google Play's rule for AI apps). Motion respects the reduced-motion setting. */
(function(){
const RM=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
const NAMES={soma:"Soma",siro:"Siro",orra:"Orra",ava:"Ava"};
const REASONS=[["harmful","Harmful or unsafe"],["inaccurate","Wrong or misleading"],["upsetting","Upsetting or inappropriate"],["unhelpful","Not helpful enough"],["character","Not like {name}"],["other","Something else"]];
const all=(s,r)=>Array.from((r||document).querySelectorAll(s));
const say=t=>{try{toast(t);}catch(e){}};
const who=()=>{try{if(current)return current;}catch(e){}const n=((document.getElementById("whoName")||{}).textContent||"").trim().toLowerCase();return NAMES[n]?n:"";};

/* ---------- 1. replies appear word by word ---------- */
function reveal(el,text){
  const tpl=document.createElement("div");tpl.innerHTML=md(text);
  const prev=el._shown||0;let pos=0,k=0;
  const w=document.createTreeWalker(tpl,NodeFilter.SHOW_TEXT),nodes=[];while(w.nextNode())nodes.push(w.currentNode);
  for(const n of nodes){const t=n.nodeValue,start=pos;pos+=t.length;if(RM||pos<=prev)continue;
    const cut=Math.max(0,prev-start),frag=document.createDocumentFragment();
    if(cut)frag.appendChild(document.createTextNode(t.slice(0,cut)));
    for(const p of t.slice(cut).split(/(\s+)/)){if(!p)continue;
      if(/^\s+$/.test(p)){frag.appendChild(document.createTextNode(p));continue;}
      const s=document.createElement("span");s.className="wf";s.style.animationDelay=Math.min(k++*42,3200)+"ms";s.textContent=p;frag.appendChild(s);}
    n.parentNode.replaceChild(frag,n);}
  el.replaceChildren(...tpl.childNodes);el._shown=pos;
}
window.EK_reveal=reveal;
window.EK_afterReply=function(el,k,text){if(!el)return;
  if(text&&(el.querySelector(".dots")||!el._shown))reveal(el,text);
  el.classList.add("settle");decorate(el);};

/* ---------- 2. a small menu on every companion reply ---------- */
const DOTS='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="19" cy="12" r="1.9"/></svg>';
function decorate(m){
  if(!m||!m.classList||!m.classList.contains("them")||m.querySelector(".dots")||m.querySelector(":scope > .mact"))return;
  if(m.querySelector(":scope > .mbar"))return;const bar=document.createElement("div");bar.className="mbar";
  bar.innerHTML='<button type="button" class="mb" data-act="copy" aria-label="Copy this message"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg></button>'+
    (canKeep()?'<button type="button" class="mb" data-act="keep" aria-label="Save to your Embers"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v17l-6-4-6 4z"/></svg></button>':"")+
    '<button type="button" class="mb" data-act="report" aria-label="Report this reply"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg></button>';m.appendChild(bar);
}
function decorateAll(){all("#msgs > .msg.them").forEach(decorate);}
function replyText(m){const c=m.cloneNode(true);c.querySelectorAll(".mact,.mmenu,.mbar,.saveR,.rflag").forEach(x=>x.remove());c.querySelectorAll("br").forEach(x=>x.replaceWith("\n"));c.querySelectorAll("p,h1,h2,h3,h4,ul,ol,blockquote").forEach(x=>x.append("\n\n"));c.querySelectorAll("li").forEach(x=>x.append("\n"));return c.textContent.replace(/[ \t]+\n/g,"\n").replace(/\n{3,}/g,"\n\n").trim();}
function prevUserText(m){let p=m.previousElementSibling;while(p&&!(p.classList.contains("msg")&&p.classList.contains("me")))p=p.previousElementSibling;return p?p.textContent.trim():"";}
function canKeep(){try{return Array.isArray(sparks)&&typeof persist==="function";}catch(e){return false;}}
let menuBtn=null;
function closeMenu(){all(".mmenu").forEach(x=>x.remove());if(menuBtn)menuBtn.setAttribute("aria-expanded","false");menuBtn=null;}
document.addEventListener("click",e=>{
  const b=e.target.closest&&e.target.closest(".mact");
  if(b){e.preventDefault();const same=menuBtn===b;closeMenu();if(same)return;
    const m=b.closest(".msg"),menu=document.createElement("div");menu.className="mmenu";menu.setAttribute("role","menu");
    menu.innerHTML='<button type="button" role="menuitem" data-act="copy">Copy</button>'+(canKeep()?'<button type="button" role="menuitem" data-act="keep">Keep in Embers</button>':"")+'<button type="button" role="menuitem" data-act="report">Report this reply</button>';
    m.appendChild(menu);menuBtn=b;b.setAttribute("aria-expanded","true");return;}
  const it=e.target.closest&&e.target.closest(".mmenu [data-act], .mbar [data-act]");
  if(it){const m=it.closest(".msg"),act=it.dataset.act;closeMenu();
    if(act==="copy")copyText(replyText(m));else if(act==="keep")keep(m);else openReport(m);return;}
  if(!(e.target.closest&&e.target.closest(".mmenu")))closeMenu();
},true);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu();});
async function copyText(t){try{await navigator.clipboard.writeText(t);say("Copied");}catch(e){say("Copying isn't available here");}}
function keep(m){const t=replyText(m);let s=((t.match(/[^.!?]+[.!?]/)||[t])[0]).trim();if(s.length>160)s=s.slice(0,157).replace(/\s+\S*$/,"")+"...";
  try{sparks.unshift({text:s,c:who(),at:Date.now()});sparks=sparks.slice(0,200);persist("embers",{items:sparks});say("Kept in your Embers");}catch(e){say("Couldn't keep that just now");}}

/* ---------- 3. Report this reply ---------- */
let repMsg=null,repWho="";
function sheet(){
  let s=document.getElementById("reportSheet");if(s)return s;
  s=document.createElement("div");s.className="sheet rsheet";s.id="reportSheet";s.setAttribute("role","dialog");s.setAttribute("aria-modal","true");s.setAttribute("aria-labelledby","repTitle");
  s.innerHTML='<h3 id="repTitle">Report this reply</h3>'+
    '<p class="rlede">Tell us what felt wrong. Reports go to the Emberkind team and help us improve how companions respond.</p>'+
    '<div class="rreasons" role="radiogroup" aria-label="What felt wrong">'+REASONS.map(([v,l])=>'<button type="button" role="radio" aria-checked="false" data-r="'+v+'">'+l+'</button>').join("")+'</div>'+
    '<label class="rnote"><span>Anything else? (optional)</span><textarea id="repNote" maxlength="500" rows="3" placeholder="Please don\'t include personal details"></textarea></label>'+
    '<label class="rprev"><input type="checkbox" id="repPrev"><span>Include my message before this reply, for context</span></label>'+
    '<div class="ractions"><button type="button" class="ybtn" id="repCancel">Cancel</button><button type="button" class="big" id="repSend" disabled>Send report</button></div>';
  const anchor=document.getElementById("askSheet");(anchor&&anchor.parentNode?anchor.parentNode:document.body).appendChild(s);
  s.querySelector(".rreasons").addEventListener("click",e=>{const r=e.target.closest("[data-r]");if(!r)return;
    all("#reportSheet [data-r]").forEach(x=>x.setAttribute("aria-checked",x===r?"true":"false"));document.getElementById("repSend").disabled=false;});
  document.getElementById("repCancel").onclick=closeReport;
  document.getElementById("repSend").onclick=sendReport;
  return s;
}
function openReport(m){repMsg=m;repWho=who();const s=sheet();
  const nm=NAMES[repWho]||"the companion";
  all("#reportSheet [data-r]").forEach(x=>{x.setAttribute("aria-checked","false");if(x.dataset.r==="character")x.textContent="Not like "+nm;});
  document.getElementById("repNote").value="";document.getElementById("repPrev").checked=false;document.getElementById("repSend").disabled=true;
  if(typeof openSheet==="function")openSheet("#reportSheet");else{s.classList.add("on");const sc=document.getElementById("scrim");if(sc)sc.classList.add("on");}}
function closeReport(){if(typeof closeSheets==="function")closeSheets();else{const s=document.getElementById("reportSheet");if(s)s.classList.remove("on");const sc=document.getElementById("scrim");if(sc)sc.classList.remove("on");}}
async function deliver(p){
  const C=window.EK_CONFIG||{};
  if(window.EK_STANDALONE&&C.apiBase){let id="";try{id=localStorage.getItem("ek-uid")||"";}catch(e){}
    const post=b=>fetch(String(C.apiBase).replace(/\/+$/,"")+"/v1/report",{method:"POST",headers:{"content-type":"application/json","x-ek-client":id},body:JSON.stringify(b)});
    let r=await post(p);
    /* a server that doesn't know this reason yet still gets the report, as "other" with the reason in the note */
    if(r.status===400&&p.reason==="unhelpful")r=await post(Object.assign({},p,{reason:"other",note:("Not helpful enough. "+(p.note||"")).trim().slice(0,500)}));
    return r.ok;}
  if(window.claude&&window.claude.use){const d=await window.claude.use("db");if(d){await d.collection("reports").add(Object.assign({kind:"reply",at:Date.now()},p));return true;}}
  return false;
}
async function sendReport(){
  const r=all("#reportSheet [data-r][aria-checked=true]")[0];if(!r||!repMsg)return;
  const p={companion:repWho,reason:r.dataset.r,note:document.getElementById("repNote").value.trim().slice(0,500),reply:replyText(repMsg).slice(0,6000),release:(typeof EK_RELEASE!=="undefined"?EK_RELEASE:"")};
  if(document.getElementById("repPrev").checked)p.prev=prevUserText(repMsg).slice(0,3000);
  const btn=document.getElementById("repSend");btn.disabled=true;btn.textContent="Sending...";
  let ok=false;try{ok=await deliver(p);}catch(e){ok=false;}
  btn.textContent="Send report";btn.disabled=false;
  if(ok){closeReport();if(!repMsg.querySelector(".rflag")){const f=document.createElement("span");f.className="rflag";f.textContent="Reported";repMsg.appendChild(f);}
    say("Thank you. Your report went to the Emberkind team.");}
  else say("Couldn't send that just now. Please try again in a moment.");
}

/* ---------- 4. new messages rise in; every reply gets its menu ---------- */
const box=document.getElementById("msgs");let lastWho="",lastN=0;
if(box)new MutationObserver(muts=>{
  const k=who(),msgs=all("#msgs > .msg"),added=[];
  for(const m of muts)for(const n of m.addedNodes)if(n.nodeType===1&&n.classList&&n.classList.contains("msg"))added.push(n);
  if(!RM){if(added.length===1)added[0].classList.add("rise");
    else if(added.length>1&&k===lastWho&&msgs.length>lastN)msgs.slice(lastN).forEach(x=>x.classList.add("rise"));}
  lastWho=k;lastN=msgs.length;decorateAll();
}).observe(box,{childList:true});

/* ---------- 5. a soft press and a light buzz when sending ---------- */
const form=document.getElementById("composer");
if(form)form.addEventListener("submit",()=>{const b=document.getElementById("sendBtn");if(!b)return;
  b.classList.remove("pressed");void b.offsetWidth;b.classList.add("pressed");setTimeout(()=>b.classList.remove("pressed"),240);
  try{if(typeof vib==="function")vib(8);}catch(e){}},true);
})();
