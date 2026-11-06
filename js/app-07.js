"use strict";
/* ================= NAVIGATION (Emberkind 1.0.1) =================
   Android's back button steps back inside the app (closing a menu, sheet or check-in, ending a session,
   then returning to Home) and only leaves the app from Home. When you come back, Emberkind skips the
   18+ screen you've already agreed to and returns you to where you were. */
(function(){
const ROOT="fire";
const q=s=>document.querySelector(s);
const vis=el=>!!el&&!el.hidden&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=="hidden"&&getComputedStyle(el).display!=="none";
const view=()=>{const v=q(".view.active");return v?v.id.replace(/^view-/,""):ROOT;};
const welcomeOpen=()=>{const w=q("#welcome");return !!w&&!w.classList.contains("gone")&&vis(w);};
const overlay=()=>!!(q(".mmenu")||q(".sheet.on")||vis(q("#ciFlow"))||vis(q("#entryView"))||q(".ekabout.on")||q(".ektut.on")||q(".ckfs.on")||q("#ekPanel.on")||vis(q("#evInfo"))||vis(q("#evHow"))||q(".ekstory")||q(".ekjc.jfocus")||q(".ekguide.on")||q(".ekscene.on"));
const atRoot=()=>welcomeOpen()||(view()===ROOT&&!overlay());
let ignore=0,backPending=false,syncT=0;
function remember(){try{if(welcomeOpen())return;let c="";try{c=current||"";}catch(e){}if(!c){const n=((q("#whoName")||{}).textContent||"").trim().toLowerCase();if(/^(soma|siro|orra|ava)$/.test(n))c=n;}
  localStorage.setItem("ek-last",JSON.stringify({v:view(),c:view()==="chat"?c:"",at:Date.now()}));}catch(e){}}
function sync(){
  remember();
  const has=!!(history.state&&history.state.ek);
  /* history.back() lands later: never ask for a second one before the first arrives, or two taps in a row
     (a button that presses another button, like Embervale's Back) step out of the app altogether */
  if(atRoot()){if(has&&!backPending){backPending=true;ignore++;history.back();setTimeout(()=>{backPending=false;},800);}}
  else if(!has)history.pushState({ek:1},"");
}
function press(sel){const el=q(sel);if(el&&vis(el)){el.click();return true;}return false;}
function stepBack(){
  if(q(".mmenu")){document.body.click();return;}
  /* 3.2.1: the layers added since 2.x, topmost first */
  if(q(".ekscene.on")){if(window.EKSCENE)EKSCENE.close();return;}
  if(q(".ekguide.on")){if(window.EKHOWTO)EKHOWTO.close();return;}
  if(q(".ekstory")){if(window.EKPAINT)EKPAINT.close();return;}
  if(q(".ekjc.jfocus")){if(window.EKJOURNAL)EKJOURNAL.leaveFocus();return;}
  if(vis(q("#evRoadBar"))&&press("#evRoadDone"))return;
  if(vis(q("#evPlaceBar"))&&press("#evPlaceCancel"))return;
  if(vis(q("#evInfo"))){const x=q("#evInfo [data-close]");if(x){x.click();return;}}
  if(vis(q("#evHow"))){const x=q("#evHow [data-close]");if(x){x.click();return;}}
  if(q(".ckfs.on")){if(window.EKCARDS2)EKCARDS2.close();return;}
  if(q(".ektut.on")){if(window.EKTUT)EKTUT.close();return;}
  {const ab=[...document.querySelectorAll(".ekabout.on")].pop();if(ab){const x=ab.querySelector(".ekab-x");if(x)x.click();else ab.remove();return;}}
  if(q("#ekPanel.on")){if(window.EKHOME&&EKHOME.open)EKHOME.open(false);return;}
  if(q("#askSheet.on")&&press("#askCancel"))return;
  if(q("#crisisSheet.on")&&press("#crisisSheet .cback"))return;
  if(q(".sheet.on")){if(typeof closeSheets==="function")closeSheets();else press("#scrim");return;}
  if(vis(q("#ciFlow"))&&press("#ciClose"))return;
  if(vis(q("#entryView"))&&press("#evClose"))return;
  const v=view(),root=q("#view-"+v);
  /* Embervale: back first tucks the builder bar away for a full view of the valley */
  if(v==="vale"&&window.EVBAR&&EVBAR.shown()){EVBAR.hide();return;}
  if(v==="breathe"&&root&&root.dataset.mode==="run"&&press("#bEnd"))return;
  if(v==="meditate"&&vis(q("#mRun"))&&press("#mEnd"))return;
  if(v==="focus"&&vis(q("#fRun"))&&press("#fEnd"))return;
  if(root){const b=[...root.querySelectorAll("#backBtn,.back2,[data-back],[id$='Back']")].find(vis);if(b){b.click();return;}}
  if(v!==ROOT){const t=q(".tabs button[data-view=fire]");if(t)t.click();else if(typeof show==="function")show(ROOT);}
}
window.addEventListener("popstate",()=>{backPending=false;if(ignore>0){ignore--;return;}if(/[#&]go=/.test(location.hash))return;if(welcomeOpen())return;stepBack();setTimeout(sync,120);});
document.addEventListener("click",()=>{clearTimeout(syncT);syncT=setTimeout(sync,150);},true);/* one check per burst of taps */
document.addEventListener("keyup",e=>{if(e.key==="Enter"||e.key==="Escape")setTimeout(sync,150);},true);
document.addEventListener("visibilitychange",()=>{if(document.hidden)remember();});

/* ---------- come back to where you were ---------- */
function resume(){
  let agreed=false;try{agreed=!!localStorage.getItem("ek-agreed");}catch(e){}
  if(!agreed||!welcomeOpen())return;
  const box=q("#wAge"),go=q("#comeIn");if(!box||!go)return;
  box.checked=true;go.disabled=false;go.click();
  let last=null;try{last=JSON.parse(localStorage.getItem("ek-last")||"null");}catch(e){}
  if(!last||!last.v||last.v===ROOT)return;
  setTimeout(()=>{
    const tab=t=>{const b=q(".tabs button[data-view="+t+"]");if(b)b.click();};
    if(["chats","vale","breathe","you"].includes(last.v))tab(last.v);
    else if(last.v==="meditate"){tab("breathe");setTimeout(()=>{if(typeof openMeditate==="function")openMeditate();},120);}
    else if(last.v==="track"){setTimeout(()=>press("#checkCard"),120);}
    else if(last.v==="focus"){setTimeout(()=>press("#focusCard"),120);}
    else if(last.v==="chat"&&/^(soma|siro|orra|ava)$/.test(last.c||"")){const m=q('.mate[data-c="'+last.c+'"]');if(m){m.click();setTimeout(()=>press("#sitBtn"),200);}}
    setTimeout(sync,800);
  },350);
}
if(document.readyState!=="loading")setTimeout(resume,60);else document.addEventListener("DOMContentLoaded",()=>setTimeout(resume,60));
})();

/* the Elsewhere playlist tile opens Spotify the same careful way */
document.addEventListener("click",e=>{const a=e.target.closest&&e.target.closest("#spotTile");if(!a)return;e.preventDefault();try{openSpotify(AEVUM_PLAYLIST);}catch(x){window.open(a.href,"_blank");}});
