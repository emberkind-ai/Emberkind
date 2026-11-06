"use strict";
/* ================= CHATS (3.9.0) =================
   The Chats tab: the primary place to talk with the companions. It does not keep its own data. It reads the
   conversation store in chat-sessions.js (window.EK_sessions: up to 35 conversations per companion) and opens
   conversations with the existing openChat() and EK_sessions.openSession(), so model routing, personalities,
   history and sync are exactly as before.

   Layout: the four companions sit together at the top (Classic artwork, tap one to talk with them), then the
   conversations you've had, newest first. Back from a conversation returns here (see chatFrom in app-01.js).
   Public API for other modules and tests: window.EKCHATS = {render, open(k,id)}. */
(function(){
const $=s=>document.querySelector(s);
const ORD=["soma","siro","ava","orra"];
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const view=$("#view-chats"),who=$("#ckWho"),list=$("#ckList");
if(!view||!who||!list)return;

function ago(t){const d=Date.now()-t,m=Math.round(d/60000);if(m<1)return "Just now";if(m<60)return m+" min ago";const h=Math.round(m/60);if(h<24)return h+" h ago";
  const dd=new Date(t),y=new Date();y.setDate(y.getDate()-1);if(dd.toDateString()===y.toDateString())return "Yesterday";
  if(d<6*864e5)return dd.toLocaleDateString("en-AU",{weekday:"long"});return dd.toLocaleDateString("en-AU",{day:"numeric",month:"short"});}

/* the companions by the fire: drawn once (their art never changes here; Classic is the only art outside Home's scene) */
function drawWho(){if(who.childElementCount)return;const C=typeof COMPANIONS!=="undefined"?COMPANIONS:{};
  who.innerHTML=ORD.map((k,i)=>{const c=C[k]||{name:k,role:"",tint:"#FFD08A"};
    return `<button type="button" class="ck-mate ck-m${i}" data-k="${k}" style="--c:${c.tint||c.color}" aria-label="Talk with ${esc(c.name)}, ${esc(c.role)}">`+
      `<span class="ck-fig">${typeof companion==="function"?companion(c,78):""}</span><b>${esc(c.name)}</b><small>${esc(c.role)}</small></button>`;}).join("")+
    '<span class="ck-ember" aria-hidden="true"></span>';}

let seq=0;
async function render(){drawWho();const my=++seq;
  if(!window.EK_sessions){list.innerHTML="";return;}
  let all=[];
  try{for(const k of ORD){const v=await EK_sessions.index(k);(v&&v.list||[]).forEach(s=>{if(s.n>0)all.push([k,s]);});}}
  catch(e){if(my!==seq)return;list.innerHTML=`<div class="ck-empty"><p>Your conversations didn't load. Nothing's lost.</p><button type="button" class="ck-retry" data-retry>Try again</button></div>`;return;}
  if(my!==seq)return;/* a newer render started while this one waited */
  all.sort((a,b)=>b[1].updated-a[1].updated);
  if(!all.length){list.innerHTML='<p class="ck-empty">No conversations yet. Tap a companion when you\'re ready.</p>';return;}
  const C=COMPANIONS;
  list.innerHTML='<h2 class="ck-h">Recent</h2><div class="ck-rows">'+all.map(([k,s])=>`<button type="button" class="ck-row" data-k="${k}" data-id="${esc(s.id)}" style="--c:${C[k].tint||C[k].color}">`+
    `<span class="ck-av">${companion(C[k],40)}</span><span class="ck-tx"><b>${esc(s.title)}</b><small><em>${esc(C[k].name)}</em> \u00b7 ${esc(ago(s.updated))}</small>`+
    `${s.last?`<span class="ck-last">${esc(s.last)}</span>`:""}</span><svg class="ck-go" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6"/></svg></button>`).join("")+'</div>';}

/* open a companion's current conversation, or a particular one */
async function open(k,id){if(typeof openChat!=="function")return;await openChat(k);
  /* openChat waits for consent the first time; only switch conversation once the chat is actually open */
  if(id&&window.EK_sessions&&typeof currentView!=="undefined"&&currentView==="chat"&&current===k)await EK_sessions.openSession(k,id);}

view.addEventListener("click",e=>{const t=e.target;
  const m=t.closest(".ck-mate");if(m){open(m.dataset.k);return;}
  const r=t.closest(".ck-row");if(r){open(r.dataset.k,r.dataset.id);return;}
  if(t.closest("[data-retry]")){render();return;}
  if(t.closest(".ck-feel")){const f=$("#feelBtn");if(f)f.click();}});

window.EKCHATS={render,open};
})();
