"use strict";
/* ===== Conversations: many chats with each companion =====
   Each companion keeps up to 35 conversations on this device (and in sync, if you're signed in). The open one is stored
   as "chat-<companion>" exactly as before; the others as "chat-<companion>-<id>"; and "chats-<companion>" lists them all
   with a short title Claude writes after the first exchange. "New chat" starts a fresh one without losing the last. */
(function(){
const LIMIT=35,NAMES={soma:"Soma",siro:"Siro",orra:"Orra",ava:"Ava"},KEYS=Object.keys(NAMES),idx={};
const say=t=>{try{toast(t);}catch(e){}};
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const nid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const talk=m=>(m||[]).filter(x=>x.role==="user"||x.role==="assistant");
const userN=m=>(m||[]).filter(x=>x.role==="user").length;
const lastLine=m=>{const x=talk(m).pop();return x?String(x.content).replace(/\s+/g," ").trim().slice(0,90):"";};
function quickTitle(m){const x=(m||[]).find(y=>y.role==="user");if(!x)return "New conversation";const w=String(x.content).replace(/\s+/g," ").trim().split(" ").slice(0,6).join(" ");return (w.length>34?w.slice(0,33)+"\u2026":w).replace(/[.,;:!?]+$/,"")||"New conversation";}
function ago(t){const d=Date.now()-t,m=Math.round(d/60000);if(m<1)return "Just now";if(m<60)return m+" min ago";const h=Math.round(m/60);if(h<24)return h+" h ago";const dd=new Date(t),y=new Date();y.setDate(y.getDate()-1);
  if(dd.toDateString()===y.toDateString())return "Yesterday";if(d<6*864e5)return dd.toLocaleDateString("en-AU",{weekday:"long"});return dd.toLocaleDateString("en-AU",{day:"numeric",month:"short"});}
async function getDoc(key){try{await ready;}catch(e){}try{if(db){const s=await col().doc(key).get();if(s.exists)return s.data();}}catch(e){}try{const v=localGet(key);if(v)return v;}catch(e){}return null;}
async function delDoc(key){try{if(db)await col().doc(key).delete();}catch(e){}try{localStorage.removeItem("ekl:"+key);}catch(e){}}
const _save=window.saveChat;
async function index(k){if(idx[k])return idx[k];let v=await getDoc("chats-"+k);
  if(!v||!Array.isArray(v.list)||!v.list.length){const m=await loadChat(k),now=Date.now(),id=nid();v={active:id,list:[{id,title:userN(m)?quickTitle(m):"New conversation",titled:0,created:now,updated:now,n:userN(m),last:lastLine(m)}]};persist("chats-"+k,v);}
  if(!v.list.some(s=>s.id===v.active))v.active=v.list[0].id;idx[k]=v;return v;}
const saveIdx=k=>{if(idx[k])persist("chats-"+k,idx[k]);};
const cur=k=>{const v=idx[k];return v?v.list.find(s=>s.id===v.active):null;};
/* every save keeps the list up to date */
window.saveChat=function(k){_save(k);try{const s=cur(k),m=chats[k];if(!s||!m)return;s.updated=Date.now();s.n=userN(m);s.last=lastLine(m);if(!s.titled&&s.n)s.title=quickTitle(m);saveIdx(k);}catch(e){}};
/* Claude names each conversation after its first exchange (a few warm words) */
async function title(k){const s=cur(k),m=chats[k];if(!s||s.titled||s.titling||!userN(m)||!(typeof sample==="function"&&sample.json))return;s.titling=1;
  const convo=talk(m).slice(0,6).map(x=>(x.role==="user"?"Person":NAMES[k])+": "+String(x.content).slice(0,500)).join("\n\n");
  try{const out=await sample.json('Give this conversation a short, warm title of 2 to 5 words in Australian English: plain words, no quotes, no emoji, no full stop. Name what it is about, gently, the way the person might. Return only JSON: {"title":"..."}\n\nConversation:\n'+convo);
    const t=out&&typeof out.title==="string"?out.title.trim().replace(/^["'\u201C\u2018]+|["'\u201D\u2019.]+$/g,""):"";if(t&&t.length<=48){s.title=t;s.titled=1;saveIdx(k);refresh();}}catch(e){}finally{s.titling=0;}}
const ar=window.EK_afterReply;window.EK_afterReply=function(el,k){try{ar&&ar.apply(this,arguments);}catch(e){}title(k);};
/* moving between conversations */
async function openSession(k,id){const v=await index(k);if(v.active===id)return;
  if(!userN(chats[k])){const gone=v.active;v.list=v.list.filter(x=>x.id!==gone);delDoc("chat-"+k+"-"+gone);}else persist("chat-"+k+"-"+v.active,{messages:(chats[k]||[]).slice(-60),updated:Date.now()});
  const d=await getDoc("chat-"+k+"-"+id);chats[k]=d&&Array.isArray(d.messages)&&d.messages.length?d.messages:[{role:"assistant",content:greetFor(k)}];v.active=id;_save(k);saveIdx(k);
  try{if(current===k){renderMsgs();const v=document.getElementById("view-chat");[60,400,1000].forEach(t=>setTimeout(()=>{v.scrollTop=v.scrollHeight;},t));}}catch(e){}refresh();}
async function startNew(k){const v=await index(k);if(!userN(chats[k])){say("This is already a fresh conversation.");return;}
  persist("chat-"+k+"-"+v.active,{messages:chats[k].slice(-60),updated:Date.now()});const id=nid(),now=Date.now();
  v.list.unshift({id,title:"New conversation",titled:0,created:now,updated:now,n:0,last:""});v.active=id;chats[k]=[{role:"assistant",content:greetFor(k)}];
  while(v.list.length>LIMIT){const old=v.list.filter(s=>s.id!==v.active).sort((a,b)=>a.updated-b.updated)[0];v.list=v.list.filter(s=>s!==old);delDoc("chat-"+k+"-"+old.id);}
  _save(k);saveIdx(k);try{if(current===k)renderMsgs();}catch(e){}refresh();say("A new conversation with "+NAMES[k]+".");}
async function remove(k,id){const v=await index(k);const ok=typeof ask==="function"?await ask({title:"Delete this conversation?",text:"It will be removed from this device and your synced account. This can't be undone.",ok:"Delete"}):confirm("Delete this conversation?");if(!ok)return;
  if(v.active===id){const other=v.list.filter(s=>s.id!==id).sort((a,b)=>b.updated-a.updated)[0];if(other)await openSession(k,other.id);else{v.list=[];chats[k]=[{role:"assistant",content:greetFor(k)}];const nid2=nid(),now=Date.now();v.list.push({id:nid2,title:"New conversation",titled:0,created:now,updated:now,n:0,last:""});v.active=nid2;_save(k);try{renderMsgs();}catch(e){}}}
  v.list=v.list.filter(s=>s.id!==id);delDoc("chat-"+k+"-"+id);saveIdx(k);refresh();say("Conversation deleted.");}
/* the header: Chats, New chat and Save as Ember as clear buttons */
const IC={chats:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',add:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  ember:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c3 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-5 3-7 0 3 1 4 3 4 0-3-1-5 0-8z"/></svg>'};
window.EK_carryLabel=IC.ember+"<span>Save as Ember</span>";
const head=document.getElementById("chatHead"),fresh=document.getElementById("freshBtn"),carry=document.getElementById("carryBtn");
if(head&&fresh&&carry){const bar=document.createElement("div");bar.className="chatbar";const cb=document.createElement("button");cb.type="button";cb.id="chatsBtn";cb.className="cbtn";cb.innerHTML=IC.chats+"<span>Chats</span>";cb.setAttribute("aria-label","Your conversations");
  fresh.className="cbtn";fresh.innerHTML=IC.add+"<span>New chat</span>";fresh.setAttribute("aria-label","Start a new conversation");carry.className="cbtn cbember";carry.innerHTML=window.EK_carryLabel;carry.setAttribute("aria-label","Save what matters as an Ember");
  bar.append(cb,fresh,carry);head.appendChild(bar);
  fresh.onclick=()=>{try{if(busy)return;}catch(e){}startNew(current);};cb.onclick=()=>drawer(current);
  const who=head.querySelector(".who");if(who){who.setAttribute("role","button");who.tabIndex=0;who.addEventListener("click",()=>drawer(current));}}
/* the conversations drawer */
const sh=document.createElement("div");sh.className="sheet csheet";sh.id="convSheet";sh.setAttribute("role","dialog");sh.setAttribute("aria-modal","true");sh.setAttribute("aria-label","Your chats");document.body.appendChild(sh);
let shownK=null;
function groups(list){const t0=new Date();t0.setHours(0,0,0,0);const w0=t0.getTime()-6*864e5,G=[["Today",[]],["This week",[]],["Earlier",[]]];
  list.slice().sort((a,b)=>b.updated-a.updated).forEach(s=>(s.updated>=t0.getTime()?G[0]:s.updated>=w0?G[1]:G[2])[1].push(s));return G.filter(g=>g[1].length);}
async function drawer(k){if(!k)return;shownK=k;const v=await index(k);
  sh.innerHTML=`<div class="cshead"><h3 id="convT">Conversations with ${NAMES[k]}</h3><button type="button" class="cx" data-close aria-label="Close">&times;</button></div>
  <button type="button" class="csnew" data-new>${IC.add}<span>New conversation</span></button>
  <div class="ekcs-list">${groups(v.list).map(([g,ss])=>`<h4>${g}</h4>`+ss.map(s=>`<div class="csrow${s.id===v.active?" on":""}" data-id="${s.id}"><button type="button" class="csopen" data-open="${s.id}"><b>${esc(s.title)}</b><small>${esc(ago(s.updated))}${s.last?" \u00b7 "+esc(s.last):""}</small></button>
    <button type="button" class="csmore" data-more="${s.id}" aria-label="Options for ${esc(s.title)}">\u22EF</button></div>`).join("")).join("")}</div>`;
  sh.closest||0;try{openSheet("#convSheet");}catch(e){sh.classList.add("on");}}
sh.addEventListener("click",async e=>{const k=shownK,t=e.target;if(t.closest("[data-close]")){closeSheets();return;}
  if(t.closest("[data-new]")){closeSheets();await startNew(k);return;}
  const o=t.closest("[data-open]");if(o){closeSheets();await openSession(k,o.dataset.open);return;}
  const mo=t.closest("[data-more]");if(mo){const row=mo.closest(".csrow"),open=row.querySelector(".csacts");sh.querySelectorAll(".csacts").forEach(x=>x.remove());if(open)return;
    row.insertAdjacentHTML("beforeend",'<div class="csacts"><button type="button" data-rename>Rename</button><button type="button" data-del class="csdel">Delete</button></div>');return;}
  const rn=t.closest("[data-rename]");if(rn){const row=rn.closest(".csrow"),id=row.dataset.id,s=idx[k].list.find(x=>x.id===id);row.querySelector(".csacts").remove();
    const b=row.querySelector(".csopen b");b.innerHTML=`<input class="csin" maxlength="48" value="${esc(s.title)}" aria-label="Conversation name">`;const inp=b.querySelector("input");inp.focus();inp.select();
    const done=()=>{const nv=inp.value.trim();if(nv){s.title=nv;s.titled=1;saveIdx(k);}drawer(k);};inp.addEventListener("keydown",ev=>{if(ev.key==="Enter"){ev.preventDefault();done();}if(ev.key==="Escape")drawer(k);});inp.addEventListener("blur",done,{once:true});return;}
  const dl=t.closest("[data-del]");if(dl){const id=dl.closest(".csrow").dataset.id;await remove(k,id);if(sh.classList.contains("on"))drawer(k);}});
/* Home: continue a conversation */
let home=null;async function homeRow(){const help=document.getElementById("forYou");if(!help)return;if(!home){home=document.createElement("section");home.className="ekcv";home.setAttribute("aria-label","Continue a conversation");help.insertAdjacentElement("afterend",home);}
  const all=[];for(const k of KEYS){const v=await index(k);v.list.forEach(s=>{if(s.n>0)all.push([k,s]);});}all.sort((a,b)=>b[1].updated-a[1].updated);const top=all.slice(0,3);
  home.hidden=!top.length;home.innerHTML=top.length?`<h3 class="hsec">Continue a conversation</h3><div class="ekcv-l">${top.map(([k,s])=>`<button type="button" class="ekcv-c" data-k="${k}" data-id="${s.id}" style="--cc:${COMPANIONS[k].color}"><span class="ekcv-av">${companion(COMPANIONS[k],44)}</span><span class="ekcv-t"><b>${esc(s.title)}</b><small>${NAMES[k]} \u00b7 ${esc(ago(s.updated))}</small></span><span class="ekcv-g" aria-hidden="true">\u203A</span></button>`).join("")}</div>`:"";}
document.addEventListener("click",async e=>{const c=e.target.closest&&e.target.closest(".ekcv-c");if(!c)return;const k=c.dataset.k,id=c.dataset.id;await openChat(k);await openSession(k,id);});
function refresh(){if(sh.classList.contains("on")&&shownK)drawer(shownK);homeRow();}
const ow=window.show;if(typeof ow==="function")window.show=function(v){const r=ow.apply(this,arguments);if(v==="fire")setTimeout(homeRow,60);return r;};
const oc=window.openChat;if(typeof oc==="function")window.openChat=async function(){const r=await oc.apply(this,arguments);try{await index(current);}catch(e){}return r;};
setTimeout(homeRow,1600);
window.EK_sessions={index,openSession,startNew,remove,drawer,homeRow};
})();
