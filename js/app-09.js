"use strict";
/* ================= ACCOUNTS AND SAVING (Emberkind 1.4) =================
   Right after the 18+ welcome, people choose: sign in with Google (everything they create is saved to their
   account and comes back on any phone), or use Emberkind without an account (it stays on this phone only).
   While signed in, changes save automatically a few seconds after they happen, and when the app is closed. */
(function(){
const C=window.EK_CONFIG||{},API=String(C.apiBase||"").replace(/\/+$/,""),ON=!!(window.EK_STANDALONE&&API);
const q=s=>document.querySelector(s),say=t=>{try{toast(t);}catch(e){}};
/* Some phones and private modes block storage entirely: then accounts stay off and the rest of the app carries on. */
let LS=null;try{LS=window.localStorage;void LS.length;}catch(e){LS=null;}
const oSet=Storage.prototype.setItem,oDel=Storage.prototype.removeItem;
const get=k=>{try{return LS.getItem(k);}catch(e){return null;}},put=(k,v)=>{try{oSet.call(LS,k,v);}catch(e){}},del=k=>{try{oDel.call(LS,k);}catch(e){}};
/* device-only state is never uploaded, and never delays saving: account and sign-in details, and first-visit hints */
const SKIP=/^ek-(acct|acct-choice|last|uid|agreed|beta-ok|rem|sync|hint)/,syncable=k=>typeof k==="string"&&k.startsWith("ek")&&!SKIP.test(k);
let cfg=null,acct=null,timer=null,lastHash="",applying=false,wiping=false;const dirtyKeys=new Set();
try{acct=JSON.parse(get("ek-acct")||"null");}catch(e){}
const esc2=s=>String(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const hashOf=s=>{let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;return s.length+":"+h;};
async function api(path,opt){opt=opt||{};const h={"content-type":"application/json"};if(acct&&acct.token)h.authorization="Bearer "+acct.token;
  const r=await fetch(API+path,{method:opt.method||"GET",headers:h,body:opt.body?JSON.stringify(opt.body):undefined,keepalive:!!opt.keepalive});let j={};try{j=await r.json();}catch(e){}return {ok:r.ok,status:r.status,j};}
function saveAcct(a){acct=a;if(a)put("ek-acct",JSON.stringify(a));else{del("ek-acct");del("ek-sync-at");}render();}

/* ---------- saving everything to the account ---------- */
Storage.prototype.setItem=function(k,v){oSet.call(this,k,v);if(this===LS&&!applying&&syncable(k))changed(k);};
Storage.prototype.removeItem=function(k){oDel.call(this,k);if(this===LS&&!applying&&syncable(k))changed(k);};
function changed(k){if(wiping||!acct||!cfg||!cfg.sync)return;dirtyKeys.add(k);clearTimeout(timer);timer=setTimeout(()=>push(false),6000);}
function snapshot(){const o={};for(let i=0;i<LS.length;i++){const k=LS.key(i);if(syncable(k))o[k]=LS.getItem(k);}return o;}
function apply(obj,updated){applying=true;try{const keep=new Set(Object.keys(obj));const ks=[];for(let i=0;i<LS.length;i++)ks.push(LS.key(i));
  ks.forEach(k=>{if(syncable(k)&&!keep.has(k))del(k);});Object.entries(obj).forEach(([k,v])=>{if(syncable(k)&&typeof v==="string")put(k,v);});if(updated)put("ek-sync-at",String(updated));}finally{applying=false;}dirtyKeys.clear();}
async function push(force){clearTimeout(timer);if(!acct||!cfg||!cfg.sync)return false;const snap=snapshot();if(!Object.keys(snap).length)return false;
  const data=JSON.stringify(snap),h=hashOf(data);if(!force&&h===lastHash){dirtyKeys.clear();return true;}
  const r=await api("/v1/sync",{method:"PUT",body:{data,base:Number(get("ek-sync-at")||0),force:!!force},keepalive:data.length<60000}).catch(()=>null);if(!r)return false;
  if(r.ok){put("ek-sync-at",String(r.j.updated));lastHash=h;dirtyKeys.clear();savedLine();return true;}
  if(r.status===409)return pull(true);if(r.status===401)saveAcct(null);return false;}
async function pull(merge){const since=Number(get("ek-sync-at")||0),r=await api("/v1/sync"+(since&&!merge?"?since="+since:"")).catch(()=>null);
  if(!r||r.status===204||!r.ok||!r.j.data)return false;let server={};try{server=JSON.parse(r.j.data);}catch(e){return false;}
  const mine={};dirtyKeys.forEach(k=>{const v=get(k);if(v!==null)mine[k]=v;});const hadLocal=dirtyKeys.size>0;
  apply(Object.assign({},server,mine),r.j.updated);if(hadLocal)await push(true);location.reload();return true;}
function savedLine(){const s=q("#acSaved");if(s)s.textContent="Saved to your account just now";}
document.addEventListener("visibilitychange",()=>{if(document.hidden&&dirtyKeys.size&&!wiping)push(false);});
/* Used by "Delete my data": removes the copy saved in the account first, so nothing comes back on the next sign-in. */
window.EK_ACCT={signedIn:()=>!!acct,async wipeServer(){if(!acct||!cfg||!cfg.sync)return "ok";wiping=true;clearTimeout(timer);
  const r=await api("/v1/sync",{method:"DELETE"}).catch(()=>null);if(r&&r.ok){del("ek-sync-at");dirtyKeys.clear();lastHash="";return "ok";}wiping=false;return r&&r.status===401?"signin":"offline";}};

/* ---------- signing in ---------- */
let gsi=null;
function loadGsi(){if(window.google&&google.accounts&&google.accounts.id)return Promise.resolve();
  if(!gsi)gsi=new Promise((res,rej)=>{const s=document.createElement("script");s.src="https://accounts.google.com/gsi/client";s.async=true;s.onload=()=>res();s.onerror=()=>{gsi=null;rej(new Error("gsi"));};document.head.appendChild(s);});return gsi;}
async function googleButton(box){await loadGsi();google.accounts.id.initialize({client_id:cfg.googleClientId,callback:onCred,ux_mode:"popup",auto_select:false,cancel_on_tap_outside:true});
  box.innerHTML="";box.hidden=false;google.accounts.id.renderButton(box,{type:"standard",theme:"filled_black",size:"large",shape:"pill",text:"continue_with",width:Math.min(320,box.clientWidth||300)});}
async function onCred(resp){const r=await api("/v1/auth/google",{method:"POST",body:{credential:resp&&resp.credential}}).catch(()=>({ok:false,j:{}}));
  if(!(r.ok&&r.j.token)){say("Sign-in didn't work. Please try again.");return;}
  put("ek-acct-choice","google");closeAll();saveAcct({token:r.j.token,name:r.j.user.name,email:r.j.user.email,photo:r.j.user.photo||null});await afterSignIn();}
async function afterSignIn(){if(!cfg.sync){say("Signed in as "+(acct.name||acct.email));return;}
  const r=await api("/v1/sync").catch(()=>null),server=r&&r.ok&&r.j.data?r.j:null,local=snapshot(),size=JSON.stringify(local).length;
  if(!server){await push(true);say("Signed in. Everything is now saved to your account.");return;}
  if(size<1500){apply(JSON.parse(server.data),server.updated);say("Welcome back. Bringing everything back\u2026");setTimeout(()=>location.reload(),700);return;}
  choose(server);}
function sheet(id,inner){let s=q("#"+id);if(!s){s=document.createElement("div");s.className="sheet rsheet";s.id=id;s.setAttribute("role","dialog");s.setAttribute("aria-modal","true");
  const a=q("#askSheet");(a&&a.parentNode?a.parentNode:document.body).appendChild(s);}s.innerHTML=inner;if(typeof openSheet==="function")openSheet("#"+id);else s.classList.add("on");return s;}
function closeAll(){if(typeof closeSheets==="function")closeSheets();else document.querySelectorAll(".sheet.on").forEach(x=>x.classList.remove("on"));}
function choose(server){const s=sheet("acChoose",'<h3>Which Emberkind should we keep?</h3><p class="rlede">This phone and your account both have Emberkind on them.</p><div class="acpick"><button type="button" class="big" data-p="both">Combine both</button><button type="button" class="ybtn" data-p="acct">Use my account\'s</button><button type="button" class="ybtn" data-p="phone">Use this phone\'s</button></div>');
  s.onclick=async e=>{const b=e.target.closest("[data-p]");if(!b)return;closeAll();const p=b.dataset.p;
    if(p==="phone"){await push(true);say("Saved this phone's Emberkind to your account");return;}
    const srv=JSON.parse(server.data),next=p==="both"?Object.assign({},srv,snapshot()):srv;apply(next,server.updated);if(p==="both")await push(true);location.reload();};}
function welcomeAsk(){if(!cfg||!cfg.accounts||acct||get("ek-acct-choice")==="local")return;
  const s=sheet("acWelcome",'<h3>Keep everything safe</h3><p class="rlede">Sign in with Google and everything you create in Emberkind (check-ins, journal, practice, Embervale and your conversations) is saved to your account. Change phones or clear your browser and it\'s all still here.</p><div class="acgsi" id="obGsi"></div><button type="button" class="ybtn acwide" id="obLocal">Use without an account</button>');
  googleButton(q("#obGsi")).catch(()=>{q("#obGsi").innerHTML='<p class="rlede">Couldn\'t reach Google just now. You can sign in later from You.</p>';});
  q("#obLocal").onclick=()=>{sheet("acWelcome",'<h3>Stay on this phone only?</h3><p class="rlede">Without an account, everything stays only on this phone. If you clear the app\'s or browser data, uninstall, or change phones, it\'s gone for good. You can sign in any time from You.</p><div class="ractions"><button type="button" class="ybtn" id="obBack">Go back</button><button type="button" class="big" id="obOk">I understand</button></div>');
    q("#obBack").onclick=()=>{closeAll();setTimeout(welcomeAsk,250);};q("#obOk").onclick=()=>{put("ek-acct-choice","local");closeAll();};};}

/* ---------- the Account section in You ---------- */
function avatar(){return acct.photo?`<img class="acav acimg" src="${esc2(acct.photo)}" alt="">`:`<span class="acav" aria-hidden="true">${esc2((acct.name||acct.email||"?").trim().charAt(0).toUpperCase())}</span>`;}
function html(){if(acct)return `<header><h2>Account</h2></header><div class="acrow">${avatar()}<div class="actx"><b>${esc2(acct.name||"Signed in")}</b><small>${esc2(acct.email||"")}</small></div><button type="button" class="ybtn acsmall" id="acPhoto">Change photo</button></div>
    <p class="quiet acnote" id="acSaved">${cfg.sync?"Everything you create is saved to your account.":"Signed in."}</p><div class="acbtns"><button type="button" class="ybtn" id="acOut">Sign out</button><button type="button" class="ybtn acdel" id="acDel">Delete my account</button></div>`;
  return `<header><h2>Account</h2></header><p class="quiet">Sign in to save everything to your account, so it's safe if you clear your browser or change phones. Right now, your Emberkind lives only on this phone.</p>
    <button type="button" class="big acgo" id="acIn">Sign in with Google</button><div class="acgsi" id="acGsi" hidden></div><p class="quiet acnote"><a href="privacy.html" target="_blank" rel="noopener">How we look after your data</a></p>`;}
function render(){if(!ON||!cfg||!cfg.accounts)return;let sec=q("#acSec");
  if(!sec){const h=[...document.querySelectorAll("#view-you .ysec h2")].find(x=>x.textContent.trim()==="Your data"),anchor=q("#remSec")||(h&&h.closest(".ysec"));if(!anchor)return;
    sec=document.createElement("section");sec.className="ysec yacct";sec.id="acSec";anchor.parentNode.insertBefore(sec,anchor);}
  sec.innerHTML=html();const dw=q("#dataWhere");if(dw&&acct&&cfg.sync)dw.textContent="Everything you create is saved on this phone and to your account, so it's safe if you clear your browser or change phones.";}
async function shrink(f){const im=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=URL.createObjectURL(f);});
  const s=Math.min(im.naturalWidth,im.naturalHeight),c=document.createElement("canvas");c.width=c.height=256;c.getContext("2d").drawImage(im,(im.naturalWidth-s)/2,(im.naturalHeight-s)/2,s,s,0,0,256,256);return c.toDataURL("image/jpeg",.85);}
function pickPhoto(){const inp=document.createElement("input");inp.type="file";inp.accept="image/*";inp.style.display="none";document.body.appendChild(inp);
  inp.onchange=async()=>{const f=inp.files&&inp.files[0];inp.remove();if(!f)return;let url;try{url=await shrink(f);}catch(e){say("That picture couldn't be opened. Try another.");return;}
    const r=await api("/v1/account/photo",{method:"PUT",body:{photo:url}}).catch(()=>null);if(r&&r.ok){acct.photo=r.j.photo;saveAcct(acct);say("Photo updated");}else say("Couldn't update your photo. Try a different picture.");};inp.click();}
async function signOut(){if(dirtyKeys.size)await push(false);if(acct)await api("/v1/auth/signout",{method:"POST"}).catch(()=>{});try{google.accounts.id.disableAutoSelect();}catch(e){}saveAcct(null);say("Signed out. This phone keeps its copy.");}
function askDelete(){const s=sheet("acSheet",'<h3>Delete your account?</h3><p class="rlede">This deletes your account and everything saved in it from Emberkind\'s server, including your photo. It can\'t be undone. This phone keeps its own copy until you delete it in Your data.</p><div class="ractions"><button type="button" class="ybtn" id="acNo">Cancel</button><button type="button" class="big acdanger" id="acYes">Delete account</button></div>');
  q("#acNo").onclick=closeAll;q("#acYes").onclick=async()=>{q("#acYes").disabled=true;const r=await api("/v1/account/delete",{method:"POST"}).catch(()=>({ok:false,status:0}));closeAll();
    if(r.ok){saveAcct(null);say("Your account is deleted.");}else if(r.status===401){saveAcct(null);say("You were signed out. Sign in again to delete your account.");}else say("That didn't work. Please try again.");};}
document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#acIn,#acOut,#acDel,#acPhoto,#comeIn");if(!t)return;
  if(t.id==="comeIn"){setTimeout(welcomeAsk,900);return;}e.preventDefault();
  if(t.id==="acIn"){t.hidden=true;googleButton(q("#acGsi")).catch(()=>{t.hidden=false;say("Couldn't reach Google just now. Please try again.");});}
  else if(t.id==="acOut")signOut();else if(t.id==="acPhoto")pickPhoto();else askDelete();},true);
async function init(){if(!ON||!LS)return;try{const r=await api("/v1/config");cfg=r.ok?r.j:null;}catch(e){cfg=null;}if(!cfg||!cfg.accounts)return;render();
  const w=q("#welcome");if(!(w&&!w.classList.contains("gone")&&w.getClientRects().length))setTimeout(welcomeAsk,600);
  if(acct){const r=await api("/v1/account").catch(()=>null);if(r&&r.status===401){saveAcct(null);return;}if(r&&r.ok){acct.name=r.j.user.name;acct.email=r.j.user.email;acct.photo=r.j.user.photo||null;saveAcct(acct);}
    if(cfg.sync)await pull(false);}}
if(document.readyState!=="loading")setTimeout(init,500);else document.addEventListener("DOMContentLoaded",()=>setTimeout(init,500));
})();
