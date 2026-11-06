"use strict";
/* ---------- painting the vale ---------- */
function paintVale(cv,W,H){EV.paint(cv,W,H,{thumb:cv.id!=="valeCanvas"});}
function drawValeThumb(){const c=$("#valeThumb");if(!c)return;if(typeof drawDecor==="function")try{drawDecor();}catch(e){}const r=c.getBoundingClientRect();paintVale(c,r.width||340,r.height||170);
  const n=valeTotal(),nx=valeNext();$("#valeHomeLine").textContent=n?`${n} of 30 things have grown so far.`:"Your world is waiting. Your first practice plants something.";
  $("#valeHomeNext").textContent=nx?`Next: ${nx.item.toLowerCase()}, with ${Math.max(1,Math.ceil(nx.need))} more minute${Math.ceil(nx.need)>1?"s":""} of ${VALE.els[nx.k].from.replace(" practice","")} practice.`:"Every part of Embervale has grown. It's yours to rest in.";}
function renderVale(){
  drawDecor();renderSeason();
  const c=$("#valeCanvas"),r=c.getBoundingClientRect();paintVale(c,r.width||360,r.height||420);
  const n=valeTotal();$("#valeCount").textContent=VALE.preview?"A preview of Embervale, fully grown.":n?`${n} of 30 things have grown.`:"Nothing has grown yet. Your first practice plants something here.";
  $("#valeList").innerHTML=ORDER_SC.map(k=>{const e=VALE.els[k],l=valeLevel(k),m=valeMins(k),next=l<6?VALE.steps[l]:null,prev=l?VALE.steps[l-1]:0,frac=next?Math.min(1,(m-prev)/(next-prev)):1;
    return `<div class="vrow"><div class="vhead"><i class="th th-${k} vth"></i><div><b>${e.name}</b><small>${e.from}${m>=1?`, ${Math.floor(m)} min so far`:""}</small></div></div>
      <div class="vbar"><i style="transform:scaleX(${VALE.preview?1:frac.toFixed(3)})"></i></div>
      <p class="vnext">${l<6&&!VALE.preview?`Next: ${e.items[l].toLowerCase()}`:"All grown"}</p>
      <div class="vbadges">${e.items.map((it,i)=>`<span class="vb${i<l?" on":""}${i<l&&profile.evNew&&profile.evNew[k+i]&&!VALE.preview?" new":""}">${it}</span>`).join("")}</div></div>`;}).join("");
  const ln=VALE.preview?10:(profile.lanterns||0);$("#valeList").innerHTML+=`<div class="vrow"><div class="vhead"><i class="th vth vlan"></i><div><b>Lanterns</b><small>Task buddy</small></div></div><p class="vnext">${ln?`${Math.min(ln,fLanternRoom()?ln:ln)} lantern${ln>1?"s":""} lit by Task buddy${fLanternRoom()?"":". The path is fully lit"}`:"Task buddy sessions of two minutes or more light lanterns along the path."}</p></div>`;
  $("#valePrev").textContent=VALE.preview?"Back to my Embervale":"Preview Embervale fully grown";
  if(!VALE.preview&&profile.evNew&&Object.keys(profile.evNew).length){setTimeout(()=>{profile.evNew={};saveProfile();},4000);}
}
/* Home's Embervale card opens the Embervale tab itself, so the tab lights and the slide matches the tab bar */
$("#valeOpen").onclick=()=>{const t=document.querySelector('.tabs button[data-view="vale"]');if(t)t.click();else show("vale");};
$("#valeBreathe").onclick=()=>show("breathe");
$("#valePrev").onclick=()=>{VALE.preview=!VALE.preview;renderVale();drawValeThumb();};
ready.then(()=>drawValeThumb());
window.addEventListener("resize",()=>{drawValeThumb();if(currentView==="vale")renderVale();});


/* ================= SAFETY, CONSENT, PATTERNS, YOUR DATA ================= */
let legalFrom="you";
function openLegal(from,section){legalFrom=from||currentView;show("legal");if(section){const d=document.getElementById(section);if(d){d.open=true;setTimeout(()=>d.scrollIntoView({block:"start",behavior:"smooth"}),80);}}}
$("#legalBack").onclick=()=>{if(legalFrom==="welcome")return unpeek();show(legalFrom);};
$("#legalOpen").onclick=()=>openLegal("you");
$("#wLegal").onclick=()=>peek("legal");
$("#aiNoteMore").onclick=()=>openLegal("chat");
$("#bSafety").onclick=()=>openLegal("breathe","lgBreath");
$("#circleRules").onclick=()=>openLegal("circle");
function hasConsent(){return lsGet("ek-consent")==="1"||!!profile.consent;}
let pendingChat=null;
$("#consentOk").onclick=()=>{lsSet("ek-consent","1");profile.consent=Date.now();saveProfile();closeSheets();if(pendingChat){const [k,o,c]=pendingChat;pendingChat=null;openChat(k,o,c);}};
$("#consentMore").onclick=()=>{closeSheets();openLegal("fire");};
function renderPatterns(){
  const ev=profile.ev||{},tot=ORDER_SC.reduce((a,k)=>a+(ev[k]||0),0),f=profile.feels||{},fn=(f.calmer||0)+(f.same||0)+(f.more||0);
  if(tot<5){$("#patterns").innerHTML='<p class="quiet">Your patterns will appear here after a few practices: which elements you return to, and how your body feels afterwards.</p>';return;}
  const max=Math.max(...ORDER_SC.map(k=>ev[k]||0),1);
  const rows=ORDER_SC.map(k=>`<div class="pt"><span>${SCENES[k].name}</span><i><b style="transform:scaleX(${((ev[k]||0)/max).toFixed(3)})"></b></i><em>${Math.round((ev[k]||0)/60)} min</em></div>`).join("");
  const feel=fn?`<p>After practising, you felt calmer <b>${f.calmer||0}</b> of ${fn} time${fn>1?"s":""} you checked in.</p>`:"";
  $("#patterns").innerHTML=`<p>You've practised for <b>${Math.round(tot/60)} minutes</b> in total.</p>${rows}${feel}<p class="quiet">Patterns are for curiosity, not scores. Every amount counts.</p>`;
}
async function deleteMyData(){
  const acc=!!(window.EK_ACCT&&window.EK_ACCT.signedIn());
  if(!await ask({title:"Delete all your data?",text:acc?"This removes your name, conversations, Embers, check-ins, practice history, routines and Embervale from this phone and from your account. You stay signed in. It can't be undone.":"This removes your name, conversations, Embers, check-ins, practice history, routines and Embervale. It can't be undone.",ok:"Delete everything",danger:true}))return;
  if(acc){const w=await window.EK_ACCT.wipeServer();if(w!=="ok"){toast(w==="signin"?"Please sign in again first, so the copy in your account is deleted too.":"Couldn't reach Emberkind to delete the copy in your account. Check your connection and try again.");return;}}
  try{if(db&&uid){const ks=["profile","embers",...ORDER.map(k=>"chat-"+k)];await Promise.all(ks.map(k=>col().doc(k).delete().catch(()=>{})));await db.collection("members").doc(uid).delete().catch(()=>{});}}catch(e){}
  try{Object.keys(localStorage).filter(k=>k.startsWith("ek")&&!/^ek-acct/.test(k)).forEach(k=>localStorage.removeItem(k));}catch(e){}
  toast("Your data has been deleted");setTimeout(()=>location.reload(),900);
}
$("#deleteBtn").onclick=deleteMyData;


/* ================= BASIC DISPLAY ("simple" in code and storage) ================= */
let simple=lsGet("ek-simple")==="on";
function applySimple(){app.classList.toggle("simple",simple);if(!simple&&typeof EL!=="undefined")EL.kick();$("#simpleToggle").setAttribute("aria-checked",simple?"true":"false");}
function setSimple(on){simple=on;lsSet("ek-simple",simple?"on":"off");applySimple();toast(simple?"Basic Display on. Switch back anytime in You.":"Full experience back on");}
$("#simpleToggle").onclick=()=>{if(simple){setSimple(false);return;}openSheet("#simpleSheet");};
$("#simpleOk").onclick=()=>{closeSheets();setSimple(true);};
$("#feelBtn2").onclick=()=>openSheet("#feelSheet");applySimple();

/* ================= FOCUS TOGETHER (body doubling) ================= */
const F_LINES=["I'm right here, working alongside you.","One small step at a time. That's all this needs.","If your mind wandered, that's okay. Just come back to the next step.","Roll your shoulders and take one slow breath, then carry on.","Is there water nearby? A sip can help.","You don't have to finish. You only have to keep going gently."];
let fWho="siro",fMins=Math.round(lsNum("ek-fmins",25,5,120)/5)*5,fSnd=["quiet","fire","rain","ocean","forest","brown"].includes(lsGet("ek-fsnd"))?lsGet("ek-fsnd"):"quiet",fLeft=0,fTotal=0,fTick=null,fPaused=false,fLineI=0,fSteps=[],fChecks=[],fResetT=null,fLastT=0;
/* 3.9.0 (Part 12A): what a session really earns. Two minutes or more lights a lantern on Embervale's path
   (fFinish adds profile.lanterns; vale-world.js lanterns() draws up to 16, four of them from fire practice), and
   every session adds to the Task buddy achievements. Task buddy does not earn Embercoins. */
function fLanternRoom(){let fire=0;try{fire=valeLevel("fire");}catch(e){}return (profile.lanterns||0)+(fire>=2?4:0)<16;}
function fReward(){const p=$("#fReward");if(p)p.textContent=fLanternRoom()?"Stop whenever you need. Two minutes or more lights a lantern on Embervale's path.":"Stop whenever you need. Embervale's path is fully lit, and every session still counts towards your Task buddy achievements.";}
function fRender(){fReward();$("#fPick").innerHTML=ORDER.map(k=>{const c=COMPANIONS[k];return `<button role="radio" aria-checked="${k===fWho}" data-k="${k}">${companion(c,52,0)}<span>${c.name}</span></button>`;}).join("");}
function fMode(m){$("#fSetup").hidden=m!=="setup";$("#fRun").hidden=m!=="run";$("#fAfter").hidden=m!=="after";}
function fTemplate(task){const t=task.toLowerCase();
  if(/email|reply|message|text|dm/.test(t))return["Open the message and read it once","Write one rough sentence back","Add the details you need","Read it through once, then send"];
  if(/clean|tidy|wash|dish|laundry|room|fold/.test(t))return["Put a basket or bag nearby","Pick up just five things","Clear one small surface","Put the rest away, one area at a time"];
  if(/study|read|learn|assignment|essay|write|report|uni|course/.test(t))return["Open the document or book","Write the heading or first line","Work on one small section","Note where you'll pick up next time"];
  if(/call|phone|book|appointment|form|bill|pay/.test(t))return["Find the number, link or form","Jot down what you need to say or enter","Make the call or fill it in","Note what happened and the next date"];
  return["Gather what you need in one place","Do the first two-minute piece","Keep going with the next small bit","Notice what's done, then rest"];}
function fDrawSteps(el,run){el.innerHTML=fSteps.map((st,i)=>{const cur=run&&!st.done&&fSteps.findIndex(x=>!x.done)===i;
  return `<label class="fstep${st.done?" done":""}${cur?" cur":""}"><input type="checkbox" data-i="${i}" ${st.done?"checked":""}><span>${esc(st.t)}</span>${run?"":`<button type="button" class="fedit" data-e="${i}" aria-label="Edit step ${i+1}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg></button>`}</label>`;}).join("")+(run?"":`<button class="fadd" id="fAdd">Add your own step</button>`);
  const a=$("#fAdd");if(a)a.onclick=async()=>{const t=await ask({title:"Add a small step",input:true,placeholder:"For example, open the document",ok:"Add step"});if(t&&t.trim()){fSteps.push({t:t.trim().slice(0,80),done:false,mine:true});fDrawSteps(el,false);}};
  /* 3.9.0: any step can be reworded before starting; a reworded step becomes the person's own (kept by Break it down again); saved empty, it's removed */
  el.querySelectorAll(".fedit").forEach(b=>b.onclick=async e=>{e.preventDefault();e.stopPropagation();const i=+b.dataset.e,s=fSteps[i];if(!s)return;
    const t=await ask({title:"Edit this step",input:true,value:s.t,placeholder:"Leave it empty to remove this step",ok:"Save"});if(t==null||t===false)return;const v=String(t).trim().slice(0,80);
    if(!v){fSteps.splice(i,1);toast("Step removed");}else if(v!==s.t)fSteps[i]={t:v,done:s.done,mine:true};fDrawSteps(el,false);});}
/* 3.9.0 (Part 12B): "Break it down again" builds on what is already there. The current steps go to the companion
   with the request; any step the person wrote is always kept (in their words, or the companion's tidier version of
   them), back in its place if the reply leaves it out; ticked steps stay ticked. */
const fNorm=s=>String(s).toLowerCase().replace(/[^a-z0-9 ]+/g," ").replace(/\s+/g," ").trim();
function fSame(a,b){a=fNorm(a);b=fNorm(b);if(!a||!b)return false;if(a===b||a.includes(b)||b.includes(a))return true;const A=new Set(a.split(" ")),B=b.split(" ");return B.filter(w=>A.has(w)).length/Math.max(A.size,B.length)>=.7;}
function fKeep(next,prev){const out=next.map(t=>({t,done:false}));
  out.forEach(o=>{const p=prev.find(q=>fSame(q.t,o.t));if(p){o.done=!!p.done;if(p.mine)o.mine=true;}});
  prev.forEach((m,i)=>{if(!m.mine||out.some(o=>fSame(o.t,m.t)))return;out.splice(Math.min(out.length,i),0,{t:m.t,done:!!m.done,mine:true});});return out;}
async function fBreakDown(){const task=$("#fTask").value.trim();if(!task){toast("Name the one thing first");$("#fTask").focus();return;}
  const btn=$("#fBreak");btn.disabled=true;btn.textContent=COMPANIONS[fWho].name+" is thinking...";let steps=null;
  const prev=fSteps.slice(),cur=prev.map(s=>s.t),mine=prev.filter(s=>s.mine).map(s=>s.t);
  const ctx=cur.length?` Their current steps are: ${JSON.stringify(cur)}.`+(mine.length?` They wrote these steps themselves: ${JSON.stringify(mine)}. Keep every one of them, in their words where you can (you may clarify or tidy them), and build the other steps around them.`:` Build on these rather than starting over.`):"";
  try{if(sample&&sample.json){const r=await sample.json(`Break this task into tiny, doable steps for someone who finds starting hard. Task: "${task}".${ctx} Reply ONLY with JSON like {"steps":["..."]}: 3 to ${mine.length>2?6:5} steps, each under 12 words, plain Australian English, warm and practical, the first step doable in under two minutes.`);if(r&&Array.isArray(r.steps)&&r.steps.length)steps=r.steps.slice(0,6).map(x=>String(x).slice(0,90));}}catch(e){}
  if(steps)fSteps=fKeep(steps,prev);
  else if(prev.length){toast(COMPANIONS[fWho].name+" couldn't help just now. Your steps are kept.");}
  else fSteps=fTemplate(task).map(t=>({t,done:false}));
  fDrawSteps($("#fSteps"),false);btn.disabled=false;btn.textContent="Break it down again";}
function fShow(){const m=Math.floor(fLeft/60),sec=Math.floor(fLeft%60);$("#fTime").textContent=m+":"+String(sec).padStart(2,"0");$("#fBar").style.transform="scaleX("+(1-fLeft/fTotal).toFixed(3)+")";}
function fStop(){clearInterval(fTick);fTick=null;clearInterval(fResetT);}
function fSound(on){try{if(!on){ambStop();if(soundRunning)setSoundMode("soft");return;}if(fSnd==="quiet"){ambStop();if(soundRunning)setSoundMode("quiet");return;}
  if(fSnd!=="fire"){setSoundMode("quiet");if(soundWanted)ambStart(fSnd);}
  if(fSnd==="fire"){ambStop();if(!soundRunning&&soundWanted)soundStart();setSoundMode("full");}}catch(e){}}
function fFinish(){const done=fTotal-fLeft;fStop();fSound(false);$("#fCheck").hidden=true;$("#fReset").hidden=true;
  const awBefore=awMins("focus");if(done>=60){profile.sessions=(profile.sessions||0)+1;sessionLog("Task buddy"+($("#fTask").value.trim()?": "+$("#fTask").value.trim().slice(0,40):""),done);}profile.focus=(profile.focus||0)+Math.round(done);logMinutes(done/60);awardCheck("focus",awBefore);const lit=done>=120&&fLanternRoom();if(done>=120){profile.lanterns=(profile.lanterns||0)+1;drawValeThumb();}saveProfile();
  const n=fSteps.filter(x=>x.done).length;$("#fAfterT").textContent=fLeft<=0?"Time's up. You stayed with it.":(profile.name?`${cheer("light")} You showed up for it, ${nmShort()}.`:`${cheer("light")} You showed up for it.`);
  $("#fAfterS").textContent=(fSteps.length?`You ticked off ${n} of ${fSteps.length} steps. `:"")+(lit?"A new lantern now glows on Embervale's path.":"Any amount counts.");$("#fResp").textContent="";fMode("after");if(fLeft<=0)buzz([30,80,30]);}
function fAsk(){$("#fCheck").hidden=false;buzz(20);setTimeout(()=>{$("#fCheck").hidden=true;},90000);}
$("#fCheck").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;$("#fCheck").hidden=true;const next=fSteps.find(x=>!x.done);
  $("#fLine").textContent={ok:"Lovely. Keep going, I'm right here.",drift:"Welcome back, no guilt at all."+(next?" Next small step: "+next.t.toLowerCase()+".":" What's the very next small thing?"),
    stuck:"Let's make it smaller. "+(next?"Could you do just the first minute of: "+next.t.toLowerCase()+"?":"What's the tiniest piece you could do in one minute?")+" Or take a 1-minute reset breath."}[b.dataset.c];});
function fBreathe(){$("#fReset").hidden=false;let t=0;const orb=$("#fOrb"),tx=$("#fResetT");clearInterval(fResetT);
  const step=()=>{const ph=t%10;if(ph===0){orb.style.transitionDuration="4s";orb.style.transform="scale(1.25)";tx.textContent="Breathe in";}if(ph===4){orb.style.transitionDuration="6s";orb.style.transform="scale(.8)";tx.textContent="Breathe out, slowly";}t++;if(t>=60){clearInterval(fResetT);$("#fReset").hidden=true;$("#fLine").textContent="Welcome back. On to the next small step.";}};step();fResetT=setInterval(step,1000);}
$("#fPick").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;fWho=b.dataset.k;fRender();});
function fLenSync(){const r=$("#fLen");r.value=fMins;r.style.setProperty("--fill",((fMins-5)/115*100).toFixed(1)+"%");const h=Math.floor(fMins/60),m=fMins%60;
  const t=h?(h+" hour"+(h>1?"s":"")+(m?" "+m+" min":"")):fMins+" minutes";$("#fLenVal").textContent=t;r.setAttribute("aria-valuetext",t);}
$("#fLen").addEventListener("input",e=>{fMins=+e.target.value;lsSet("ek-fmins",String(fMins));fLenSync();});fLenSync();
function fSndSync(){$("#fSnd").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.s===fSnd?"true":"false"));}
$("#fSnd").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;fSnd=b.dataset.s;lsSet("ek-fsnd",fSnd);fSndSync();if(fSnd!=="quiet"&&!soundWanted){soundWanted=true;lsSet("ek-sound","on");syncSoundUI();}fSound(true);toast(fSnd==="quiet"?"Quiet":b.textContent.trim()+" playing");});fSndSync();
const SPOT_DEFAULT="https://open.spotify.com/search/focus%20music";const AEVUM_PLAYLIST="https://open.spotify.com/playlist/18xHmCULBOhn15XDd4xoMr";
function spotUrl(){return lsGet("ek-spot")||SPOT_DEFAULT;}
function spotSync(){const mine=!!lsGet("ek-spot");$("#fSpotSet").textContent=mine?"Change my playlist":"Use my own playlist";$("#fSpot").setAttribute("href",AEVUM_PLAYLIST);const r=$("#fSpotAutoRow");if(r){r.hidden=!mine;$("#fSpotAuto").checked=lsGet("ek-spot-auto")!=="0";}}

$("#fSpot").addEventListener("click",e=>{e.preventDefault();openSpotify(AEVUM_PLAYLIST);fSnd="quiet";lsSet("ek-fsnd","quiet");fSndSync();fSound(true);toast("Opening our playlist in Spotify. Emberkind will stay quiet.");});
if($("#fSpotAuto"))$("#fSpotAuto").addEventListener("change",e=>{lsSet("ek-spot-auto",e.target.checked?"1":"0");});
$("#fSpotSet").onclick=async()=>{const v=await ask({title:"Your own playlist",text:"Paste a Spotify playlist or album link. It opens in Spotify when you press Start together. Leave it empty to remove it.",input:true,value:lsGet("ek-spot")||"",placeholder:"https://open.spotify.com/playlist/...",ok:"Save"});if(v===null)return;const t=v.trim();
  if(!t){lsSet("ek-spot","");toast("Your playlist is removed");}else if(/^https:\/\/(open\.spotify\.com|spotify\.link)\//.test(t)||/^spotify:/.test(t)){lsSet("ek-spot",t);lsSet("ek-spot-auto","1");toast("Saved. It opens in Spotify when you start.");}else{toast("That doesn't look like a Spotify link");return;}spotSync();};spotSync();
$("#fBreak").onclick=fBreakDown;
$("#fSteps").addEventListener("change",e=>{const i=+e.target.dataset.i;if(fSteps[i]){fSteps[i].done=e.target.checked;}});
$("#fRunSteps").addEventListener("change",e=>{const i=+e.target.dataset.i;if(!fSteps[i])return;fSteps[i].done=e.target.checked;fDrawSteps($("#fRunSteps"),true);if(e.target.checked){buzz(15);$("#fLine").textContent=fSteps.every(x=>x.done)?"Every step done. "+cheer("light"):"Nice. On to the next one.";}});
$("#fStart").onclick=()=>{const c=COMPANIONS[fWho];fTotal=fLeft=fMins*60;fPaused=false;fLineI=0;$("#fAv").innerHTML=companion(c,120,0);
  const task=$("#fTask").value.trim();if(!fSteps.length&&task)fSteps=fTemplate(task).map(t=>({t,done:false}));
  $("#fWho").textContent=c.name+" is working alongside you"+(task?" while you "+task.charAt(0).toLowerCase()+task.slice(1):"")+".";$("#fLine").textContent=F_LINES[0];$("#fPause").textContent="Pause";
  const marks=[.3,.6,.85].map(f=>Math.round(fTotal*f));fChecks=marks;fDrawSteps($("#fRunSteps"),true);fMode("run");fShow();fStop();fSound(true);
  fLastT=Date.now();fTick=setInterval(()=>{const now=Date.now();if(fPaused){fLastT=now;return;}const dt=Math.floor((now-fLastT)/1000);if(dt<1)return;fLastT+=dt*1000;const before=fTotal-fLeft;fLeft=Math.max(0,fLeft-dt);fShow();const el=fTotal-fLeft;if(fChecks.some(c=>c>before&&c<=el))fAsk();else if(el>0&&Math.floor(el/240)>Math.floor(before/240)){$("#fLine").textContent=F_LINES[1+(fLineI++%(F_LINES.length-1))];}if(fLeft<=0)fFinish();},1000);
  if(lsGet("ek-spot")&&lsGet("ek-spot-auto")!=="0"){openSpotify(lsGet("ek-spot"));fSnd="quiet";lsSet("ek-fsnd","quiet");fSndSync();fSound(true);toast("Opening your playlist in Spotify. Your session keeps going.");}};
$("#fPause").onclick=()=>{fPaused=!fPaused;$("#fPause").textContent=fPaused?"Resume":"Pause";$("#fLine").textContent=fPaused?"Paused. Take the time you need.":"Back to it, gently.";};
$("#fBreath").onclick=fBreathe;$("#fResetEnd").onclick=()=>{clearInterval(fResetT);$("#fReset").hidden=true;};
$("#fEnd").onclick=fFinish;
$("#fRes").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;$("#fRes").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));
  $("#fResp").textContent={done:`${cheer("light")} Let that land for a moment before the next thing.`,start:"A start is the hardest part, and you did it. That counts.",rest:"That's okay. Showing up and trying is enough for today."}[b.dataset.r];});
$("#fAgain").onclick=()=>{fSteps=[];$("#fSteps").innerHTML="";$("#fBreak").textContent="Help me break it down";fMode("setup");};
$("#focusBack").onclick=()=>{fStop();fSound(false);fMode("setup");show(focusFrom);focusFrom="fire";};
$("#focusCard").onclick=()=>{focusFrom="fire";fRender();fMode("setup");show("focus");};

/* ================= PLAIN-LANGUAGE GLOSSARY ================= */
var GLOSS=[
 ["Body doubling","Neurodivergent support strategy",/body[- ]doubl(?:ing|e)/i,"Doing a task with another person present, in the room or online, so it's easier to start and keep going. Widely used in ADHD communities; people often describe it as borrowed focus and gentle accountability. Research is still emerging."],
 ["Nervous system","Physiology",/nervous system/i,"Your brain, spinal cord and nerves. Its automatic (autonomic) branch shifts your body between states such as alert, calm and shut down, mostly without you choosing."],
 ["Regulation","Psychology",/regulation/i,"Emotional or nervous system regulation: returning towards a settled, flexible state after stress. It's a skill that grows with practice and through safe connection with others."],
 ["Breathwork","Practice",/breathwork/i,"Intentional ways of breathing, such as slow, paced breathing or longer out-breaths, used to shift how the body and mind feel."],
 ["Diaphragm","Anatomy",/diaphragm/i,"The dome-shaped muscle beneath your lungs. Breathing low into your belly uses it fully, which tends to be calmer and more efficient than shallow chest breathing."],
 ["Vagus nerve","Physiology",/vagus nerve/i,"A long nerve linking the brainstem with the heart, lungs and gut, and a major part of the body's rest-and-digest system. Slow breathing with longer out-breaths is thought to engage it."],
 ["Parasympathetic","Physiology",/parasympathetic/i,"The branch of the autonomic nervous system that supports rest, digestion and recovery, sometimes called rest and digest."],
 ["Window of tolerance","Psychology",/window of tolerance/i,"A concept from psychiatrist Dan Siegel: the zone where you can feel and think at the same time. Above it you feel flooded or anxious; below it, numb or shut down."],
 ["Self-inquiry","Contemplative tradition",/self-inquiry/i,"Turning attention back onto the one who is aware, with questions such as \"what is noticing this?\" Central to traditions such as Advaita Vedanta (non-dual teaching from India)."],
 ["Ayurveda","Traditional medicine",/ayurveda/i,"A traditional system of medicine from India. The word means knowledge of life in Sanskrit. It focuses on balancing body, mind and daily rhythms, and isn't a substitute for medical care."],
 ["Chinese medicine","Traditional medicine",/chinese medicine/i,"A traditional system from China built on concepts such as qi (vital energy) and balance, using diet, herbs, acupuncture and movement. Not a substitute for medical care."],
 ["Gut-brain connection","Science",/gut-brain/i,"Two-way communication between your digestive system and brain through nerves, hormones and gut microbes. It helps explain why stress affects digestion and food affects mood."],
 ["Parts work","Psychology",/parts work/i,"An approach, best known from Internal Family Systems therapy (developed by Richard Schwartz), that sees the mind as made of parts, such as protectors and younger parts, each trying to help. Emberkind is inspired by it, not a form of it."],
 ["Neurodivergent","Neurodiversity",/neurodivergent/i,"A term from the neurodiversity movement for minds that work differently from what's considered typical, including autism, ADHD and dyslexia. It describes difference, not a disorder."],
 ["Time blindness","Neurodivergent experience",/time blindness/i,"Difficulty sensing how much time has passed or how long things will take. Commonly described by people with ADHD."],
 ["Masking","Neurodivergent experience",/masking/i,"Hiding or suppressing natural traits, such as autistic or ADHD traits, to fit social expectations. Often exhausting over time."],
 ["Shutdown and meltdown","Neurodivergent experience",/shutdowns?|meltdowns?/i,"Involuntary responses to overwhelming stress or sensory input. A meltdown is an outward release of distress; a shutdown is an inward withdrawal. Neither is a tantrum or a choice."],
 ["Sensory overload","Neurodivergent experience",/sensory overload/i,"When input from the senses, such as noise, light, touch or crowds, exceeds what your nervous system can process at once, leading to distress or shutdown."],
 ["Trauma-informed","Practice standard",/trauma-informed/i,"An approach that recognises how stress and trauma shape people, and puts safety, choice, collaboration and trust first."],
 ["Grounding","Therapeutic technique",/grounding/i,"Ways of bringing attention back to the present through the body and senses, such as feeling your feet or naming things you can see. Often used for anxiety."],
 ["Accredited Practising Dietitian","Health profession",/accredited practising dietitian/i,"Australia's credential for university-qualified dietitians recognised by Dietitians Australia, who give individual nutrition and medical diet advice."]
];
function glossify(root){if(!root||!GLOSS)return;const used=new Set();const skip="a,input,textarea,svg,script,style,.gl,summary,label,b,h1,h2,h3,.axhero,.axpillars,.tabs,.seg,.chipsel,.bscenes,button:not(.bcard):not(.valecard)";
  const q=[];const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){const p=n.parentElement;if(!p||p.closest(skip))return NodeFilter.FILTER_REJECT;return n.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
  while(w.nextNode())q.push(w.currentNode);
  while(q.length){const n=q.shift();for(let gi=0;gi<GLOSS.length;gi++){if(used.has(gi))continue;const m=n.nodeValue.match(GLOSS[gi][2]);if(!m)continue;used.add(gi);
      const after=n.splitText(m.index);const rest=after.splitText(m[0].length);const sp=document.createElement("span");sp.className="gl";sp.setAttribute("role","button");sp.tabIndex=0;sp.dataset.g=gi;sp.textContent=m[0];after.replaceWith(sp);q.unshift(rest);break;}}}
function openGloss(gi){const g=GLOSS[gi];if(!g)return;$("#glossType").textContent=g[1];$("#glossTitle").textContent=g[0];$("#glossText").textContent=g[3];openSheet("#glossSheet");}
document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest(".gl");if(!t)return;e.preventDefault();e.stopPropagation();openGloss(+t.dataset.g);},true);
document.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.classList&&e.target.classList.contains("gl")){e.preventDefault();openGloss(+e.target.dataset.g);}});
["#welcome","#view-fire .homemore","#view-fire .meet","#view-academy","#view-about","#view-vision","#view-legal","#view-focus","#view-you","#view-circle","#bCtx2"].forEach(sel=>glossify(document.querySelector(sel)));


/* ================= AWARDS: themed milestones for time spent in each practice ================= */
const AW_STEPS=[5,15,30,60,150,300];
const AW_ICON={fire:'<path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.5 2-5 1 1.5 1.5 2 2.5 2C11 7.5 11 5 12 3z"/>',
  water:'<path d="M3 10c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',
  air:'<path d="M7 18a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 8.5 4.5 4.5 0 0 1 17.5 18z"/>',
  earth:'<path d="M12 21V11M12 11c0-4 3-6 7-6 0 4-3 6-7 6zM12 13c0-3-2.5-5-6-5 0 3 2.5 5 6 5z"/>',
  space:'<path d="M12 3l2 6.5L20.5 12 14 14l-2 7-2-7-6.5-2L10 9.5z"/>',
  med:'<path d="M12 5c2 2.5 2 5 0 7-2-2-2-4.5 0-7z"/><path d="M4 13c3 0 6 1 8 4 2-3 5-4 8-4-1 4-4 6-8 6s-7-2-8-6z"/>',
  checkin:'<path d="M7 18a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 8.5 4.5 4.5 0 0 1 17.5 18z"/><path d="M12 3v2M5 6l1.4 1.4M19 6l-1.4 1.4"/>',
  journal:'<path d="M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6z"/><path d="M6 3v18M9 8h7M9 12h7M9 16h4"/>',
  bsess:'<path d="M4 9h10a3 3 0 1 0-3-3M4 13h14a3 3 0 1 1-3 3M4 17h6"/>',
  msess:'<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
  month:'<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/><path d="M12 13l1 2 2 .3-1.5 1.4.4 2-1.9-1-1.9 1 .4-2-1.5-1.4 2-.3z"/>',
  focus:'<path d="M9 4h6M10 4v2M14 4v2M7 8h10l-1 10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"/><path d="M12 11c1 1.2 1.5 2 1.5 3a1.5 1.5 0 0 1-3 0c0-1 .5-1.8 1.5-3z"/>'};
const AW={
  fire:{label:"Fire",group:"Breathwork",from:"Fire practice",names:["Spark","Kindling","Steady Flame","Hearthkeeper","Bonfire Heart","Eternal Ember"],line:"Your warmth is growing, one breath at a time."},
  water:{label:"River",group:"Breathwork",from:"River practice",names:["First Ripple","Creek Song","River Bend","Still Pool","Deep Current","Ocean Mind"],line:"Thoughts come and go. You're learning to let them flow."},
  air:{label:"Sky",group:"Breathwork",from:"Sky practice",names:["First Breeze","Cloud Drifter","Open Sky","Windkeeper","Skyward","Boundless Blue"],line:"A little more space and calm, carried with you."},
  earth:{label:"Earth",group:"Breathwork",from:"Earth practice",names:["Seedling","Rooted","Mossy Stone","Old Oak","Mountain Heart","Ancient Grove"],line:"Steadier ground, built breath by breath."},
  space:{label:"Space",group:"Breathwork",from:"Space practice",names:["First Star","Stargazer","Moonlit","Constellation","Quiet Cosmos","Infinite Sky"],line:"Resting more often in the space that holds everything."},
  med:{label:"Meditation",group:"Meditation",from:"meditation in total",steps:[10,30,60,120,300,600],names:["Settling","Still Water","Deep Rest","Quiet Mind","Wide Open","Boundless"],line:"Stillness is becoming familiar ground."},
  bsess:{label:"Breath session length",group:"Sessions",from:"in a single breath session",unit:"min",steps:[3,5,8,10,15,20],names:["First Wave","Steady Tide","Deep Tide","Long Exhale","Breath Voyager","Breath Master"],line:"Staying with your breath a little longer each time."},
  msess:{label:"Meditation session length",group:"Sessions",from:"in a single meditation",unit:"min",steps:[5,10,15,20,30,45],names:["Still Moment","Quiet Stretch","Deep Sit","Mountain Sit","Long Silence","Timeless"],line:"Sitting longer, with more ease."},
  month:{label:"Monthly practice",group:"Monthly",from:"practice in a single month",steps:[30,60,100,150,300,600],names:["Kindled Month","Warm Month","Glowing Month","Golden Month","Radiant Month","Transcendental Astronaut"],line:"A month of showing up for yourself. Up to 40 minutes a day count."},
  checkin:{label:"Check-ins",group:"Check-ins and journal",from:"days you checked in",unit:"days",steps:[1,3,7,14,30,60],names:["First Light","Weather Watcher","Steady Skies","Season Sense","Moon Cycle","Sky Keeper"],line:"Noticing how you are is a quiet kind of care."},
  journal:{label:"Journal",group:"Check-ins and journal",from:"journal entries",unit:"entries",steps:[1,3,7,14,30,60],names:["First Page","Kept Words","Inkwell","Story Keeper","Deep Pages","Life Chronicle"],line:"Putting it into words is how it starts to settle."},
  focus:{label:"Task buddy",group:"Task buddy",from:"with Task buddy",steps:[10,30,60,120,300,600],names:["Showing Up","Lantern Lit","Steady Hands","Deep Work","Flow Finder","Mountain Mover"],line:"Every session you show up for counts."}
};
const AW_ORDER=["fire","water","air","earth","space","med","bsess","msess","month","checkin","journal","focus"];let awPreview=false;
function awMins(k){if(k==="journal")return (typeof moods!=="undefined"?moods:[]).filter(x=>x.note).length;if(k==="bsess")return ((profile.best||{}).breathe||0)/60;if(k==="msess")return ((profile.best||{}).med||0)/60;if(k==="checkin"){const d=new Set();(typeof moods!=="undefined"?moods:[]).forEach(x=>{if(x.mood)d.add(dayKey(x.at));});return Math.max(d.size,profile.ciDays||0);}
  if(k==="month"){const ds=profile.days||{},by={};for(const key in ds){const mk=key.slice(0,7);by[mk]=(by[mk]||0)+Math.min(40,ds[key]);}return Math.max(0,...Object.values(by),profile.monthBest||0);}
  return (k==="focus"?(profile.focus||0):k==="med"?(profile.med||0):((profile.ev||{})[k]||0))/60;}
function awSteps(k){return AW[k].steps||AW_STEPS;}
function awGot(k,i){return awPreview||awMins(k)>=awSteps(k)[i];}
function awSub(k,t){if(k==="checkin")return `${t} ${t>1?"days":"day"} you checked in`;if(k==="journal")return `${t} journal ${t>1?"entries":"entry"}`;if(k==="month")return `${t} minutes of practice in a single month`;
  if(k==="bsess")return `A ${t}-minute breath session`;if(k==="msess")return `A ${t}-minute meditation`;if(k==="med")return `${t} minutes of meditation in total`;if(k==="focus")return `${t} minutes with Task buddy`;return `${t} minutes of ${AW[k].from}`;}
function showAward(k,i,fresh){const t=awSteps(k)[i],got=awGot(k,i),u=AW[k].unit||"minutes";$("#awBig").innerHTML=medal(k,i,96);$("#awKick").textContent=fresh?"New badge":got?"Badge earned":"Still to earn";
  $("#awTitle").textContent=AW[k].names[i];$("#awSub").textContent=awSub(k,t);
  $("#awLine").textContent=got?(fresh?cheer(/check|ci|journ|refl|mood/i.test(k+" "+(AW[k].group||""))?"quiet":"light")+" ":"")+AW[k].line:(k==="bsess"||k==="msess")?`Try a ${t}-minute session when it feels right. No rush, it'll be here.`:`${Math.max(1,Math.ceil(t-awMins(k)))} more ${u==="days"?(Math.ceil(t-awMins(k))>1?"days":"day"):u==="entries"?(Math.ceil(t-awMins(k))>1?"entries":"entry"):(Math.ceil(t-awMins(k))>1?"minutes":"minute")} to go. No rush, it'll be here.`;
  $("#awardSheet").classList.toggle("fresh",!!fresh);openSheet("#awardSheet");if(fresh)buzz([20,60,20]);}
function awardCheck(k,beforeMins){const now=awMins(k),fresh=awSteps(k).map((t,i)=>beforeMins<t&&now>=t?i:-1).filter(i=>i>=0);
  if(fresh.length){const i=fresh[fresh.length-1];profile.awSeen=profile.awSeen||{};profile.awSeen[k+i]=1;saveProfile();awQueue.push([k,i]);setTimeout(awFlush,900);}}
/* new badges wait their turn: never on top of another sheet, the check-in, an open entry, or a conversation */
const awQueue=[];let awT=null;
function awBlocked(){return (window.EKJ&&EKJ.busy())||!!document.querySelector(".sheet.on")||!$("#ciFlow").hidden||!$("#entryView").hidden||currentView==="chat"||(typeof bMode!=="undefined"&&bMode==="run")||!$("#mRun").hidden;}
function awFlush(){clearTimeout(awT);if(!awQueue.length)return;if(awBlocked()){awT=setTimeout(awFlush,1500);return;}const [k,i]=awQueue.shift();showAward(k,i,true);if(awQueue.length)awT=setTimeout(awFlush,1500);}
$("#awPrev").onclick=()=>{awPreview=!awPreview;renderAwards();};
$("#awAll").onclick=()=>{closeSheets();show("you");setTimeout(()=>{const a=$("#awards");if(a)a.scrollIntoView({block:"start",behavior:"smooth"});},250);};


/* ================= CHECK-IN: mood, energy, journal and patterns ================= */
const MOODS=["Awful","Low","Average","Steady","Glowing","Radiant"],MCOL=["#4F5A80","#6E86B8","#A3A6B6","#8FC27A","#F5B54A","#FFD86B"],MN=MOODS.length;
/* weather graphics for each mood, from storm to radiant sun */
function moodSVG(m){const cl=(x,y,s,f)=>`<path d="M${x-14*s} ${y+6*s}a${8*s} ${8*s} 0 0 1 ${2*s}-${15.5*s}a${10*s} ${10*s} 0 0 1 ${19*s}-${2*s}a${7*s} ${7*s} 0 0 1 ${7*s} ${17.5*s}z" fill="${f}"/>`;
  const sun=(x,y,r,glow)=>`<circle cx="${x}" cy="${y}" r="${r*1.9}" fill="url(#mg${glow})" opacity=".55"/>`+[...Array(8)].map((_,i)=>{const a=i*Math.PI/4;return `<path d="M${(x+Math.cos(a)*r*1.35).toFixed(1)} ${(y+Math.sin(a)*r*1.35).toFixed(1)}L${(x+Math.cos(a)*r*1.75).toFixed(1)} ${(y+Math.sin(a)*r*1.75).toFixed(1)}" stroke="#FFC34A" stroke-width="2.2" stroke-linecap="round"/>`;}).join("")+`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#ms)"/>`;
  const drops=(xs,y,len,c)=>xs.map((x,i)=>`<path d="M${x} ${y+(i%2)*3}l-2 ${len}" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/>`).join("");
  
  const body=[
    ()=>cl(26,22,1,"#56607F")+drops([15,21,27,33],30,9,"#7FA3D9")+`<path d="M27 26l-5 8h5l-3 7" stroke="#FFD86B" stroke-width="2" fill="none" stroke-linejoin="round"/>`,
    ()=>cl(26,22,1,"#8A99BD")+drops([18,26,34],31,6,"#9DBCE8"),
    ()=>cl(22,26,.75,"#C3C6D3")+cl(28,22,1,"#D9DBE5"),
    ()=>sun(31,17,6,1)+cl(23,28,.95,"#E6E8EF")+`<path d="M34 39c0-6 4-9 9-9-1 5-4 9-9 9z" fill="#7DBE5A"/><path d="M34 39c2-3 4-5 8-7" stroke="#4E8A36" stroke-width="1.2" fill="none"/>`,
    ()=>sun(24,24,9,1),
    ()=>sun(24,25,8.5,2)+[[8,9,3.2],[40,10,2.6],[41,34,3],[9,37,2.2]].map(([x,y,r])=>`<path d="M${x} ${y-r*2}Q${x} ${y} ${x+r*2} ${y}Q${x} ${y} ${x} ${y+r*2}Q${x} ${y} ${x-r*2} ${y}Q${x} ${y} ${x} ${y-r*2}z" fill="#FFF3C4"/>`).join("")
  ][m-1]();
  return `<svg viewBox="0 0 48 48" aria-hidden="true">${body}</svg>`;}
function moodButtons(){return MOODS.map((n,i)=>`<button class="mo" data-m="${i+1}" aria-label="${n}"><span class="mic" style="--sz:44px">${moodSVG(i+1)}</span><span>${n}</span></button>`).join("");}
const CI_FEEL=["anxious","overwhelmed","irritated","tired","flat","sad","lonely","stuck","calm","content","hopeful","grateful"];
const CI_CTX=["Slept well","Poor sleep","Moved my body","Time outside","Saw people","Alone time","Work stress","Creative time","Screens late","Ate well","Skipped meals","Caffeine","Conflict","Rested","Practised in Emberkind"];
const T_PROMPTS=["What's taking up the most space in me today?","What helped, even a little?","What does a younger part of me need right now?","What am I avoiding, and why might that make sense?","Three small things I'm glad for"];
let moods=[],moodsLoaded=false,ciMood=3,ciEnergy=3,ciSel=new Set(),ciCtxSel=new Set(),tTab="today";
function mergeByTime(...lists){const m=new Map();lists.forEach(l=>(l||[]).forEach(x=>{if(x&&x.at)m.set(x.at,x);}));return [...m.values()].sort((a,b)=>a.at-b.at);}
let moodsP=null;
function loadMoods(){return moodsP||(moodsP=(async()=>{await ready;let remote=null;
  try{if(db&&uid){const d=await col().doc("moods").get();if(d.exists){const v=d.data();if(Array.isArray(v.items))remote=v.items;}}}catch(e){}
  const l=localGet("moods"),before=moods.length;moods=mergeByTime(remote,l&&l.items,moods);moodsLoaded=true;
  if(moods.length>(remote?remote.length:0)&&db&&uid)saveMoods();return moods;})());}
function saveMoods(){if(moods.length>1500)moods=moods.slice(-1500);persist("moods",{items:moods});}
function dayKey(t){const d=new Date(t);return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();}
function dayAvg(){const m={};moods.forEach(x=>{if(!x.mood)return;const k=dayKey(x.at);(m[k]=m[k]||[]).push(x.mood);});return m;}
function moodContext(){if(!moods||!moods.length)return "";const wk=Date.now()-7*864e5,r=moods.filter(x=>x.at>wk&&x.mood).slice(-5);if(!r.length)return "";
  return "\n\nRECENT CHECK-INS (shared privately by the person in Emberkind's check-in tool. Use gently and only when it's relevant. Don't recite them back like a record, and never diagnose from them.)\n"+r.map(x=>`- ${new Date(x.at).toLocaleDateString("en-AU",{weekday:"short",day:"numeric",month:"short"})}: mood ${x.mood}/6 (${MOODS[x.mood-1].toLowerCase()}), energy ${x.energy||3}/5${x.tags&&x.tags.length?", "+x.tags.join(", "):""}${x.note?`, note: "${x.note.slice(0,140)}"`:""}`).join("\n");}
function warnCheck(){const wk=Date.now()-5*864e5,r=moods.filter(x=>x.at>wk&&x.mood);const heavy=r.filter(x=>x.mood<=2).length;
  const el=$("#tWarn");if(r.length>=3&&heavy>=3){el.hidden=false;el.innerHTML=`<p><b>Your last few check-ins have felt heavy.</b> That's worth noticing gently. Would one of these help?</p><div class="fbtns"><button data-a="soma">Sit with Soma</button><button data-a="earth">Earth practice</button><button data-a="person">Need a person?</button></div>`;}else el.hidden=true;}
$("#tWarn").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const a=b.dataset.a;if(a==="soma")openChat("soma","Checking in. My last few days have felt heavy.");else if(a==="earth"){bScene="earth";sceneUI();show("breathe");}else openSheet("#crisisSheet");});
function moodDot(m,size){return `<span class="mic" style="--sz:${(size||14)+6}px">${moodSVG(m||3)}</span>`;}
function renderToday(){const now=new Date(),wd=[];for(let i=6;i>=0;i--){const d=new Date(now-i*864e5);wd.push(d);}
  const avg=dayAvg();$("#tWeek").innerHTML=wd.map(d=>{const a=avg[dayKey(d)];const m=a?Math.round(a.reduce((p,c)=>p+c,0)/a.length):0;
    return `<div class="wd"><span>${d.toLocaleDateString("en-AU",{weekday:"narrow"})}</span>${m?moodDot(m,22):'<i class="mdot empty" style="--sz:22px"></i>'}</div>`;}).join("");
  const today=moods.filter(x=>dayKey(x.at)===dayKey(now));
  $("#tTodayList").innerHTML=today.length?today.slice().reverse().map(x=>`<div class="tentry" data-at="${x.at}" role="button" tabindex="0">${x.mood?moodDot(x.mood,18):'<i class="mdot jr" style="--sz:18px"></i>'}<div><b>${x.mood?MOODS[x.mood-1]:"Journal"}</b> <small>${new Date(x.at).toLocaleTimeString("en-AU",{hour:"numeric",minute:"2-digit"})}</small>${x.tags&&x.tags.length?`<p class="ttags">${esc(x.tags.join(", "))}</p>`:""}${x.note?`<p>${esc(x.note)}</p>`:""}</div></div>`).join(""):'<p class="quiet">No check-ins yet today. Whenever you\'re ready.</p>';
  warnCheck();}
function renderJournal(){const j=moods.filter(x=>x.note).slice(-60).reverse();
  $("#tJList").innerHTML=j.length?j.map(x=>`<div class="tentry" data-at="${x.at}" role="button" tabindex="0">${x.mood?moodDot(x.mood,18):'<i class="mdot jr" style="--sz:18px"></i>'}<div><small>${new Date(x.at).toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"})}</small><p>${esc(x.note)}</p></div></div>`).join(""):'<p class="quiet">Your journal entries will appear here.</p>';}
function renderInsights(){const avg=dayAvg(),days=[];for(let i=29;i>=0;i--){const d=new Date(Date.now()-i*864e5),a=avg[dayKey(d)];days.push(a?a.reduce((p,c)=>p+c,0)/a.length:null);}
  const pts=days.map((v,i)=>v?[(i/29*300+10).toFixed(1),(110-(v-1)/(MN-1)*90).toFixed(1)]:null);
  const line=pts.filter(Boolean).map(p=>p.join(",")).join(" ");
  $("#tChart").innerHTML=`<svg viewBox="0 0 320 125" class="tsvg">${[1,2,3,4,5,6].map(v=>`<line x1="10" x2="310" y1="${110-(v-1)/(MN-1)*90}" y2="${110-(v-1)/(MN-1)*90}" class="gl1"/>`).join("")}${line?`<polyline points="${line}" class="pl"/>`:""}${pts.map((p,i)=>p?`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${MCOL[Math.round(days[i])-1]}"/>`:"").join("")}</svg>`;
  $("#tPix").innerHTML=days.map(v=>`<i style="background:${v?MCOL[Math.round(v)-1]:"rgba(255,255,255,.06)"}"></i>`).join("");
  const by={};const all=moods.filter(x=>x.mood);const base=all.length?all.reduce((a,x)=>a+x.mood,0)/all.length:3;
  all.forEach(x=>(x.tags||[]).forEach(t=>{(by[t]=by[t]||[]).push(x.mood);}));
  const rows=Object.entries(by).filter(([t,a])=>a.length>=2).map(([t,a])=>[t,a.reduce((p,c)=>p+c,0)/a.length-base,a.length]).sort((a,b)=>b[1]-a[1]);
  const up=rows.filter(r=>r[1]>.15).slice(0,4),dn=rows.filter(r=>r[1]<-.15).slice(-4).reverse();
  $("#tTags").innerHTML=rows.length?`${up.length?`<p class="tfine">Often brighter with</p><div class="chipsel">${up.map(r=>`<span class="tchip up">${esc(r[0])}</span>`).join("")}</div>`:""}${dn.length?`<p class="tfine">Often heavier with</p><div class="chipsel">${dn.map(r=>`<span class="tchip dn">${esc(r[0])}</span>`).join("")}</div>`:""}${!up.length&&!dn.length?'<p class="quiet">No clear patterns yet. Keep checking in and they\'ll start to show.</p>':""}`:'<p class="quiet">After a week or so of check-ins with a few tags, you\'ll see what tends to lift you and what tends to weigh on you.</p>';
  renderAI();}
function renderAI(){const el=$("#tAI");
  if(!sample){el.hidden=true;el.innerHTML="";return;}el.hidden=false;
  el.innerHTML=`<p class="tq">Spot my patterns</p><p>Ask Soma to look gently across your recent check-ins and journal, and reflect back what stands out.</p><button class="vgo" id="tAIGo">Reflect on my patterns</button><div id="tAIOut"></div>`;
  $("#tAIGo").onclick=async()=>{const r=moods.slice(-40);if(r.length<3){toast("A few more check-ins first");return;}const b=$("#tAIGo");b.disabled=true;b.textContent="Soma is reflecting...";
    const lines=r.map(x=>`${new Date(x.at).toLocaleString("en-AU",{weekday:"short",day:"numeric",month:"short",hour:"numeric"})}: ${x.mood?"mood "+x.mood+"/6, energy "+(x.energy||3)+"/5":"journal"}${x.tags&&x.tags.length?", "+x.tags.join(", "):""}${x.note?', "'+x.note.slice(0,160)+'"':""}`).join("\n");
    try{const o=await sample.json(`You are Soma, a warm, trauma-informed companion in the Emberkind app (not a clinician).${profile.name?" Their name is "+profile.name+".":""} Read these private check-ins and reply ONLY with JSON {"noticing":["..."],"helps":["..."],"watch":"...","invite":"..."}. noticing: 2-3 gentle observations about patterns (time of day, sleep, people, practices). helps: 1-3 things that seem to lift them. watch: one early sign worth noticing kindly, or "" if none. invite: one small, kind suggestion for this week. Plain Australian English, no diagnosis, no clinical labels, no shaming, under 25 words per item.\n\n${lines}`,{});
      $("#tAIOut").innerHTML=`<div class="aiout">${(o.noticing||[]).length?`<p class="tfine">What I'm noticing</p><ul>${o.noticing.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}${(o.helps||[]).length?`<p class="tfine">What seems to help</p><ul>${o.helps.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}${o.watch?`<p class="tfine">Worth noticing gently</p><p>${esc(o.watch)}</p>`:""}${o.invite?`<p class="tfine">A small invitation</p><p>${esc(o.invite)}</p>`:""}<button class="link" id="tAITalk">Talk it through with Soma</button><p class="tfine">AI reflections can be wrong. Take what fits and leave the rest.</p></div>`;
      $("#tAITalk").onclick=()=>openChat("soma","I just looked at my check-in patterns and want to talk them through.");}catch(e){toast("Couldn't reflect just now. Try again soon.");}
    b.disabled=false;b.textContent="Reflect again";};}
function tShow(t){tTab=t;$("#tTabs").querySelectorAll("button").forEach(b=>b.setAttribute("aria-checked",b.dataset.t===t));$("#tToday").hidden=t!=="today";$("#tJournal").hidden=t!=="journal";$("#tInsights").hidden=t!=="insights";
  if(t==="today")renderToday();if(t==="journal")renderJournal();if(t==="insights")renderInsights();}
async function openTrack(t){await loadMoods();$("#tQ").textContent=profile.name?`How are you, ${nmShort()}?`:"How are you, right now?";show("track");tShow(t||"today");}
$("#tMoods").addEventListener("click",e=>{const b=e.target.closest(".mo");if(b)openCheckin(+b.dataset.m);});
$("#tTabs").addEventListener("click",e=>{const b=e.target.closest("button");if(b)tShow(b.dataset.t);});
$("#tMoods").innerHTML=moodButtons();($("#tlMoods")||{}).innerHTML=MOODS.map((n,i)=>`<span class="mic" style="--sz:26px">${moodSVG(i+1)}</span>`).join("");
$("#tPrompts").innerHTML=T_PROMPTS.map(p=>`<button aria-pressed="false">${p}</button>`).join("");
$("#tPrompts").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const t=$("#tJText");t.value=(t.value?t.value+"\n\n":"")+b.textContent+"\n";t.focus();});
$("#tJSave").onclick=()=>{const v=$("#tJText").value.trim();if(!v){toast("Write a little first");return;}const jb=awMins("journal");setTimeout(()=>awardCheck("journal",jb),50);moods.push({at:Date.now(),note:v.slice(0,4000),tags:[]});saveMoods();$("#tJText").value="";toast("Kept in your journal");renderJournal();};
let trackFrom="fire";
$("#trackBack").onclick=()=>show(trackFrom);$("#checkCard").onclick=()=>{trackFrom="fire";openTrack("today");};
$("#youCheck").onclick=()=>{trackFrom="you";openTrack("today");};$("#youJournal").onclick=()=>{trackFrom="you";openTrack("journal");};
function renderYouCards(){$("#yAv").textContent=(profile.name||"").trim().charAt(0).toUpperCase()||"";loadRout().then(()=>{$("#ycRoutLine").textContent=routines.length?`${routines.length} saved`:"Made with Siro";});$("#ycMoods").innerHTML=[6,5,4,3].map(m=>`<span class="mic" style="--sz:22px">${moodSVG(m)}</span>`).join("");
  const last=[...moods].reverse().find(x=>x.mood),j=moods.filter(x=>x.note).length;
  $("#ycCheckLine").textContent=last?`Last: ${MOODS[last.mood-1]}, ${new Date(last.at).toLocaleDateString("en-AU",{weekday:"short"})}`:(profile.name?`How are you, ${nmShort()}?`:"How are you, right now?");
  $("#ycJournalLine").textContent=j?`${j} entr${j>1?"ies":"y"} kept`:"Write freely, privately";}
ready.then(()=>{loadMoods();const g=$("#greet");if(g)g.textContent=greetNow();});

/* ================= YOUR ROUTINES (made with Siro) ================= */
let routines=[],routLoaded=false,routCur=-1;
let routP=null;
function loadRout(){return routP||(routP=(async()=>{await ready;let remote=null;
  try{if(db&&uid){const d=await col().doc("routines").get();if(d.exists){const v=d.data();if(Array.isArray(v.items))remote=v.items;}}}catch(e){}
  const l=localGet("routines");routines=mergeByTime(remote,l&&l.items,routines);routLoaded=true;return routines;})());}
function saveRout(){persist("routines",{items:routines.slice(-100)});}
function routTitle(t){const clean=t.replace(/\r/g,"");const h=clean.match(/^\s*#{1,6}\s+(.+)$/m)||clean.match(/^\s*\*\*([^*]{6,})\*\*/m);if(h)return h[1].trim().replace(/[:.]$/,"").slice(0,60);
  const sents=clean.replace(/[#*_>`]/g,"").split(/(?<=[.!?])\s+|\n+/).map(x=>x.trim()).filter(x=>x.length>=14&&!/^\d+[.)]/.test(x));let l=sents[0]||"A routine with Siro";l=l.replace(/[.,;:!]+$/,"");return l.length>60?l.slice(0,57).replace(/\s+\S*$/,"")+"...":l;}
async function renderRout(){await loadRout();$("#rOne").hidden=true;$("#rList").hidden=false;
  $("#rList").innerHTML=routines.length?routines.map((r,i)=>`<button class="rrow" data-i="${i}"><b>${esc(r.title)}</b><small>Saved ${new Date(r.at).toLocaleDateString("en-AU",{day:"numeric",month:"short"})}</small></button>`).join(""):'<p class="quiet">When live conversations open, routines you shape with Siro can be saved here.</p>';}
function openRout(i){const r=routines[i];if(!r)return;routCur=i;$("#rList").hidden=true;$("#rOne").hidden=false;$("#rTitle").textContent=r.title;$("#rBody").innerHTML=md(r.text);}
$("#rList").addEventListener("click",e=>{const b=e.target.closest(".rrow");if(b)openRout(+b.dataset.i);});
$("#routBack").onclick=()=>{if(!$("#rOne").hidden){renderRout();return;}show("you");};
$("#rDel").onclick=async()=>{if(routCur<0)return;if(!await ask({title:"Remove this routine?",text:"It will be removed from Your routines.",ok:"Remove",danger:true}))return;routines.splice(routCur,1);saveRout();renderRout();};
function routineDoc(r){const lines=r.text.replace(/\r/g,"").split("\n"),out=[];let n=0;const fmt=t=>esc(t).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/\*(.+?)\*/g,"<em>$1</em>");
  const tk=r.title.replace(/\.\.\.$/,"").trim();
  lines.forEach(l=>{const t=l.trim();if(!t||t.replace(/[#*]/g,"").trim().startsWith(tk))return;let m;
    if((m=t.match(/^#{1,6}\s+(.*)/))||(m=t.match(/^\*\*([^*]+)\*\*:?$/)))out.push(`<p class="psec">${fmt(m[1])}</p>`);
    else if((m=t.match(/^(?:\d+[.)]|[-*\u2022])\s+(.*)/))){n++;out.push(`<div class="pstep"><i>${n}</i><span>${fmt(m[1])}</span></div>`);}
    else out.push(`<p class="pintro">${fmt(t)}</p>`);});
  const d=new Date(r.at||Date.now()).toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"});
  return `<header class="pban"><div class="pw">EMBERKIND</div><div class="pkind">Your routine</div><img src="${CMP_ART.siro}" alt=""></header>
  <div class="pbody"><h1>${esc(r.title)}</h1><p class="pmeta">Made with Siro${profile.name?" for "+esc(profile.name):""}, ${d}</p>${out.join("")}
  <div class="pfoot"><b>Go gently.</b> A routine is a support, not a rule. Adjust anything that doesn't fit you, and any amount counts.<br>General ideas for daily life, not medical or professional advice. Emberkind.</div></div>`;}
$("#rPdf").onclick=async()=>{const r=routines[routCur];if(!r)return;const b=$("#rPdf");b.disabled=true;b.textContent="Making your PDF...";
  try{const blob=await routinePDF(r),name="Emberkind routine - "+r.title.replace(/[^\w\s-]/g,"").trim().slice(0,40)+".pdf";const res=await deliverFile(blob,name);
    toast(res==="declined"?"No problem, nothing was saved":res==="shared"?"Choose where to save your PDF":"Your routine PDF is ready");}
  catch(e){toast("Couldn't make the PDF just now");}b.disabled=false;b.textContent="Download as PDF";};
async function openRoutines(){await loadRout();show("routines");renderRout();}
$("#youRout").onclick=openRoutines;$("#mateRout").onclick=()=>{closeSheets();openRoutines();};
$("#msgs").addEventListener("click",async e=>{const b=e.target.closest(".saveR");if(!b)return;await loadRout();const m=(chats[current]||[])[+b.dataset.i];if(!m)return;
  routines.push({title:routTitle(m.content),text:m.content,at:Date.now()});saveRout();b.textContent="Saved to your routines";b.disabled=true;toast("Saved to Your routines. You'll find it in the You tab.");});


/* ================= EMBERVALE SEASONS: decorations, limited editions, special items ================= */
const DAY_CAP=40,GLOW_GOAL=150,ASTRO_GOAL=600;
function dayStr(d){d=d||new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function logMinutes(min){if(!(min>0))return;const before=monthMins(),mb=awMins("month");setTimeout(()=>{profile.monthBest=awMins("month");awardCheck("month",mb);},2600);profile.days=profile.days||{};const k=dayStr();profile.days[k]=(profile.days[k]||0)+min;checkSeason(before);}
function monthKey(d){d=d||new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0");}
function monthMins(mk){mk=mk||monthKey();const ds=profile.days||{};let t=0;for(const k in ds)if(k.startsWith(mk))t+=Math.min(DAY_CAP,ds[k]);return t;}
const SEASONS={spring:{name:"Spring",months:[8,9,10],decor:"jac",title:"Jacaranda season"},summer:{name:"Summer",months:[11,0,1],decor:"lan",title:"Long summer evenings"},
  autumn:{name:"Autumn",months:[2,3,4],decor:"map",title:"Golden autumn"},winter:{name:"Winter",months:[5,6,7],decor:"sol",title:"Winter solstice"}};
const LIMITED=["New Year Lanterns","Summer Hammock","Harvest Basket","Golden Maple","Mushroom Ring","Solstice Arch","Winter Hearth","Wattle Bloom","Wattle Arch","Jacaranda Arbour","Firefly Garden","Christmas Star Tree"];
function seasonNow(d){d=d||new Date();const m=d.getMonth();return Object.values(SEASONS).find(x=>x.months.includes(m));}
const DECOR_ART={
  jac:'<path d="M28 58V36" stroke="#5A3A22" stroke-width="4"/><circle cx="20" cy="26" r="13" fill="#8E6FD8"/><circle cx="36" cy="22" r="14" fill="#A88BEA"/><circle cx="29" cy="14" r="11" fill="#B9A0F2"/><circle cx="44" cy="32" r="9" fill="#8E6FD8"/><g fill="#C9B5FF"><circle cx="12" cy="48" r="1.6"/><circle cx="46" cy="52" r="1.4"/><circle cx="34" cy="56" r="1.5"/></g>',
  xmas:'<path d="M30 6l14 18h-6l10 13h-7l9 13H10l9-13h-7l10-13h-6z" fill="#2F7A44"/><rect x="27" y="50" width="6" height="7" fill="#5A3A22"/><path d="M30 2l2 4 4 .5-3 3 .8 4-3.8-2-3.8 2 .8-4-3-3 4-.5z" fill="#FFD86B"/><g><circle cx="24" cy="22" r="2" fill="#FF6B6B"/><circle cx="35" cy="30" r="2" fill="#FFD86B"/><circle cx="22" cy="38" r="2" fill="#7FD0FF"/><circle cx="38" cy="44" r="2" fill="#FF8FD0"/><circle cx="30" cy="40" r="2" fill="#FFF"/></g><rect x="40" y="50" width="10" height="8" rx="1" fill="#E8553A"/><rect x="44" y="50" width="2" height="8" fill="#FFD86B"/><rect x="8" y="51" width="9" height="7" rx="1" fill="#7FA8F0"/>',
  lan:'<path d="M4 14q26 12 52 0" stroke="#3A2618" stroke-width="1.2" fill="none"/><g><rect x="10" y="17" width="9" height="12" rx="4" fill="#FF7A5C"/><rect x="26" y="21" width="9" height="12" rx="4" fill="#FFB347"/><rect x="42" y="17" width="9" height="12" rx="4" fill="#FF7A5C"/></g><g fill="#FFE6A8" opacity=".7"><circle cx="14.5" cy="23" r="2"/><circle cx="30.5" cy="27" r="2"/><circle cx="46.5" cy="23" r="2"/></g>',
  map:'<path d="M30 58V34" stroke="#5A3A22" stroke-width="4"/><circle cx="22" cy="26" r="12" fill="#E8762E"/><circle cx="38" cy="24" r="13" fill="#F2A03D"/><circle cx="30" cy="14" r="10" fill="#D9542A"/><ellipse cx="30" cy="57" rx="18" ry="3" fill="#E8762E" opacity=".8"/>',
  sol:'<path d="M10 58V24q20-22 40 0v34" stroke="#6B4428" stroke-width="3.5" fill="none"/><g fill="#FFD27A"><circle cx="14" cy="22" r="3"/><circle cx="22" cy="13" r="3"/><circle cx="30" cy="10" r="3"/><circle cx="38" cy="13" r="3"/><circle cx="46" cy="22" r="3"/></g>',
  obs:'<rect x="14" y="34" width="32" height="22" fill="#D9DCE8"/><path d="M12 35a18 18 0 0 1 36 0z" fill="#EEF0F7"/><path d="M28 18h4v17h-4z" fill="#3A3F5C"/><path d="M33 22l16-12 2 3-16 12z" fill="#7A84B0"/><rect x="26" y="44" width="8" height="12" rx="3" fill="#3A3F5C"/><path d="M50 30v12" stroke="#5A3A22" stroke-width="1.5"/><path d="M50 30h8l-2 3 2 3h-8z" fill="#8A7BFF"/><path d="M54 32.6l.5 1 1.1.2-.8.8.2 1.1-1-.5-1 .5.2-1.1-.8-.8 1.1-.2z" fill="#FFF3C4"/>',
  bench:'<rect x="8" y="34" width="44" height="6" rx="2" fill="#8A5A3A"/><rect x="8" y="24" width="44" height="5" rx="2" fill="#8A5A3A"/><rect x="12" y="40" width="4" height="14" fill="#5A3A22"/><rect x="44" y="40" width="4" height="14" fill="#5A3A22"/><rect x="14" y="30" width="12" height="5" rx="2" fill="#E89BB8"/><rect x="34" y="30" width="12" height="5" rx="2" fill="#9EC2FF"/>'
};
const DECOR_POS={season1:[20,64],season2:[80,62],xmas:[64,70],limited:[38,76],obs:[86,40],bench:[42,90]};
function decorItems(){const out=[],d=new Date(),se=seasonNow(d),pv=VALE.preview;
  out.push({id:"season1",art:se.decor,label:se.title,size:15});out.push({id:"season2",art:se.decor,label:se.title,size:12});
  if(d.getMonth()===11||pv)out.push({id:"xmas",art:"xmas",label:"Christmas tree",size:14});
  const lim=Object.keys(profile.limited||{});if(pv&&!lim.length)lim.push(monthKey());
  lim.slice(-6).forEach((mk,i)=>{const mi=+mk.split("-")[1]-1,se2=seasonNow(new Date(+mk.split("-")[0],mi,1));out.push({id:"limited"+mk,art:mi===11?"xmas":se2.decor,label:LIMITED[mi]+", "+new Date(+mk.split("-")[0],mi,1).toLocaleDateString("en-AU",{month:"long",year:"numeric"})+" edition",size:13,gold:true,def:[38-i*6,78-i*2]});});
  if(profile.astronaut||pv)out.push({id:"obs",art:"obs",label:"The Observatory, a one-of-a-kind item",size:16,gold:true});
  return out;}
function decorHTML(edit){const pos=profile.valePos||{};return decorItems().map(it=>{const p=pos[it.id]||it.def||DECOR_POS[it.id]||[50,70];
  return `<span class="dec${it.gold?" gold":""}${it.locked?" locked":""}${edit?" edit":""}" data-id="${it.id}" title="${esc(it.label)}" style="left:${p[0]}%;top:${p[1]}%;--w:${it.size}%"><svg viewBox="0 0 60 60" aria-hidden="true">${DECOR_ART[it.art]}</svg></span>`;}).join("");}
let arranging=false;
function drawDecor(){const a=$("#valeDecor");if(a)a.innerHTML="";const b=$("#valeThumbDecor");if(b)b.innerHTML="";}
(function(){let drag=null;const box=$("#valeDecor");
  box.addEventListener("pointerdown",e=>{if(!arranging)return;const el=e.target.closest(".dec");if(!el||el.classList.contains("locked"))return;drag=el;el.setPointerCapture(e.pointerId);el.classList.add("drag");e.preventDefault();});
  box.addEventListener("pointermove",e=>{if(!drag)return;const r=box.getBoundingClientRect();const x=Math.min(96,Math.max(4,(e.clientX-r.left)/r.width*100)),y=Math.min(96,Math.max(30,(e.clientY-r.top)/r.height*100));drag.style.left=x+"%";drag.style.top=y+"%";});
  box.addEventListener("pointerup",()=>{if(!drag)return;profile.valePos=profile.valePos||{};profile.valePos[drag.dataset.id]=[parseFloat(drag.style.left),parseFloat(drag.style.top)];saveProfile();drag.classList.remove("drag");drag=null;drawValeThumb();});
  box.addEventListener("click",e=>{if(arranging)return;const el=e.target.closest(".dec");if(el)toast(el.getAttribute("title"));});})();
$("#valeArrange").onclick=()=>{arranging=!arranging;$("#valeArrange").textContent=arranging?"Done arranging":"Arrange decorations";$("#valeWrap").classList.toggle("arranging",arranging);drawDecor();if(arranging)toast("Drag a decoration to move it");};
function checkSeason(before){const mk=monthKey(),now=monthMins(mk);profile.limited=profile.limited||{};let msg=null;
  if(before<GLOW_GOAL&&now>=GLOW_GOAL&&!profile.limited[mk]){profile.limited[mk]=1;msg=`${LIMITED[new Date().getMonth()]} is now yours, a limited ${new Date().toLocaleDateString("en-AU",{month:"long"})} edition for Embervale.`;}
  if(before<ASTRO_GOAL&&now>=ASTRO_GOAL&&!profile.astronaut){profile.astronaut=mk;msg="Transcendental Astronaut. You've earned the one-of-a-kind Observatory for Embervale.";}
  if(msg)setTimeout(()=>toast(msg),1400);}
function renderSeason(){const se=seasonNow(),mk=monthKey(),mm=Math.round(monthMins(mk)),mo=new Date().toLocaleDateString("en-AU",{month:"long"});
  const g=Math.min(1,mm/GLOW_GOAL),a=Math.min(1,mm/ASTRO_GOAL),limName=LIMITED[new Date().getMonth()];
  $("#valeSeason").innerHTML=`<div class="scard"><p class="awkick">${se.name} in Embervale</p><h3>${se.title}</h3>
    <p class="quiet">Seasonal decorations appear on their own. Practise through ${mo} to earn this month's limited edition.</p>
    <div class="sgoal"><div><b>${limName}</b><small>Limited ${mo} edition: ${mm} of ${GLOW_GOAL} minutes this month</small></div><span class="dprev"><svg viewBox="0 0 60 60" aria-hidden="true">${DECOR_ART[new Date().getMonth()===11?"xmas":se.decor]}</svg></span></div>
    <div class="vbar"><i style="transform:scaleX(${g.toFixed(3)})"></i></div>
    <div class="sgoal"><div><b>Transcendental Astronaut</b><small>${ASTRO_GOAL} minutes in a single month earns a special badge and the one-of-a-kind Observatory</small></div><span class="dprev"><svg viewBox="0 0 60 60" aria-hidden="true">${DECOR_ART.obs}</svg></span></div>
    <div class="vbar"><i style="transform:scaleX(${a.toFixed(3)})"></i></div>
    <p class="tfine">Up to ${DAY_CAP} minutes a day count towards monthly goals, so rest is built in.</p></div>`;}


/* ================= IN-APP QUESTIONS (no browser pop-ups, which embedded views can block) ================= */
let askRes=null;
function ask(o){return new Promise(res=>{askRes=res;$("#askTitle").textContent=o.title||"";$("#askText").textContent=o.text||"";const inp=$("#askInput");inp.hidden=!o.input;inp.value=o.value||"";inp.placeholder=o.placeholder||"";inp.setAttribute("aria-label",o.title||o.placeholder||"Your answer");
  const ok=$("#askOk");ok.textContent=o.ok||"OK";ok.classList.toggle("danger",!!o.danger);openSheet("#askSheet");if(o.input)setTimeout(()=>inp.focus(),250);});}
function askDone(v){const r=askRes;askRes=null;closeSheets();if(r)r(v);}
$("#askOk").onclick=()=>askDone($("#askInput").hidden?true:$("#askInput").value);
$("#askCancel").onclick=()=>askDone(null);
$("#askInput").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();askDone($("#askInput").value);}});


/* ================= VOLUME CONTROLS ================= */
document.querySelectorAll(".volctl").forEach(c=>{const b=c.querySelector(".volbtn"),r=c.querySelector("input");r.value=Math.round(appVol*100);r.style.setProperty("--fill",r.value+"%");
  b.addEventListener("click",()=>{if(c.id==="volYou"||c.classList.contains("fixed")){setAppVolume(appVol>0?0:.8);return;}const open=!c.classList.contains("open");c.classList.toggle("open",open);b.setAttribute("aria-expanded",open);});
  r.addEventListener("input",()=>setAppVolume(r.value/100));});
setAppVolume(appVol);

/* ================= SPOTIFY: open the app when it's installed, otherwise the web player ================= */
function spotLinks(url){url=String(url||"").trim();if(/^https:\/\/spotify\.link\//.test(url))return {web:url,uri:url,android:""};const m=url.match(/open\.spotify\.com\/(?:intl-[a-z]{2}(?:-[a-z]{2})?\/)?(playlist|album|track|artist|show|episode)\/([A-Za-z0-9]+)/)||url.match(/^spotify:(playlist|album|track|artist|show|episode):([A-Za-z0-9]+)/);const path=m?m[1]+"/"+m[2]:"search/focus%20music";
  const web="https://open.spotify.com/"+path,uri="spotify:"+path.replace(/\//g,":");
  const android="intent://open.spotify.com/"+path+"#Intent;scheme=https;package=com.spotify.music;end";return {web,uri,android};}
function spotHref(){const l=spotLinks(spotUrl()),ua=navigator.userAgent||"";return /Android/i.test(ua)?l.android:l.web;}


/* ================= MEDITATE ================= */
const SCAN=["Bring your attention to the top of your head.","Soften your forehead, eyes and jaw.","Let your shoulders drop and feel your arms.","Notice your chest rising and falling.","Rest your attention in your belly.","Feel your hands, and the air on your skin.","Notice your hips and your seat.","Feel your legs, heavy and supported.","Rest your attention in your feet.","Now feel your whole body at once, just as it is."];
let mMode="timer",mMins=snapMins(lsNum("ek-mmins",10,1,45)),mInt=(v=>v===null||v===undefined||v===""?5:+v)(lsGet("ek-mint")),mSnd=["quiet","fire","rain","ocean","forest","brown"].includes(lsGet("ek-msnd"))?lsGet("ek-msnd"):"quiet",mLeft=0,mTotal=0,mTick=null,mPaused=false,mWake=null,mHideT=null,mStep=0;
function bowl(gain){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();if(actx.state==="suspended")actx.resume();const t=actx.currentTime,out=actx.createGain();out.gain.value=(gain||.5)*appVol;out.connect(actx.destination);
  [[196,1,7],[196.6,.6,7],[531,.35,4.5],[1013,.18,2.8],[1530,.08,1.8]].forEach(([f,a,d])=>{const o=actx.createOscillator(),g=actx.createGain();o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(a*.35,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(out);o.start(t);o.stop(t+d+.1);});}catch(e){}if(typeof bVibOn==="undefined"||bVibOn)buzz(40);}
const MHH={timer:["Building a steady habit, settling a busy day, and learning to rest without effort.","Judging a wandering mind. Noticing you've wandered and coming back is the practice."],
  scan:["Tension you've been carrying, feeling cut off from your body, and winding down for sleep.","Trying to make every part relax. Simply notice what's there, even if it stays tight."],
  be:["Deep rest, and a break from always doing something.","Turning it into another task. If thoughts come, let them come and go."]};
function mSync(){if(typeof mHome==="function"){try{mHome();}catch(e){}}$("#mHH").innerHTML=`<p><b>Helps with</b>${MHH[mMode][0]}</p><p><b>Gets in the way</b>${MHH[mMode][1]}</p>`;$("#mLen").value=mMins;$("#mLenVal").textContent=mMins+(mMins===1?" minute":" minutes");$("#mLen").style.setProperty("--fill",((mMins-1)/44*100).toFixed(1)+"%");
  $("#mModes").querySelectorAll("button").forEach(b=>b.setAttribute("aria-checked",b.dataset.m===mMode));$("#mInt").querySelectorAll("button").forEach(b=>b.setAttribute("aria-checked",+b.dataset.i===mInt));
  $("#mSnd").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.s===mSnd?"true":"false"));$("#mInt").style.opacity=mMode==="be"?.4:1;}
function mSound(on){const keep=fSnd;fSnd=on?mSnd:"quiet";fSound(on);fSnd=keep;}
function mFmt(t){t=Math.max(0,Math.ceil(t));return Math.floor(t/60)+":"+String(t%60).padStart(2,"0");}
function mShowCtl(){$("#mCtl").classList.add("on");clearTimeout(mHideT);mHideT=setTimeout(()=>$("#mCtl").classList.remove("on"),4000);}
function mMode_(m){if(m==="run")$("#view-meditate").scrollTop=0;if(window.sessionVolume)sessionVolume(m==="run");$("#mSetup").hidden=m!=="setup";$("#mRun").hidden=m!=="run";$("#mAfter").hidden=m!=="after";$("#view-meditate").classList.toggle("dark",m==="run");}
async function mBegin(){mTotal=mMins*60;mLeft=mTotal;mPaused=false;mStep=0;mMode_("run");$("#mCue").textContent="Settle in. Let your eyes close if that feels okay.";$("#mTime").textContent="";
  try{if(navigator.wakeLock)mWake=await navigator.wakeLock.request("screen");}catch(e){}
  mSound(true);let settle=10;clearInterval(mTick);
  mTick=setInterval(()=>{if(mPaused)return;if(settle>0){settle--;if(settle===0){bowl(.55);$("#mCue").textContent=mMode==="scan"?SCAN[0]:"Rest here. When your mind wanders, gently come back.";}return;}
    mLeft--;$("#mTime").textContent=mFmt(mLeft)+" left";const el=mTotal-mLeft;
    if(mMode==="scan"){const per=Math.max(20,Math.floor(mTotal/SCAN.length));if(el%per===0&&mStep<SCAN.length-1){mStep++;bowl(.22);$("#mCue").textContent=SCAN[mStep];}}
    else if(mMode==="timer"&&mInt&&el%(mInt*60)===0&&mLeft>5)bowl(.25);
    if(mLeft<=0)mFinish(true);},1000);}
function mFinish(done){clearInterval(mTick);const secs=mTotal-mLeft;if(done){bowl(.5);setTimeout(()=>bowl(.4),2600);setTimeout(()=>bowl(.3),5200);}
  mSound(false);try{if(mWake)mWake.release();}catch(e){}mWake=null;
  if(secs>=30){const before=awMins("med");profile.sessions=(profile.sessions||0)+1;sessionLog("Meditate, "+({timer:"quiet timer",scan:"body scan",be:"just be"}[mMode]),secs);bestCheck("med","msess",secs);profile.med=(profile.med||0)+secs;logMinutes(secs/60);awardCheck("med",before);saveProfile();}
  $("#mAfterT").textContent=done?(profile.name?`Welcome back, ${nmShort()}`:"Welcome back"):"You can stop whenever you need";
  $("#mAfterS").textContent=(secs>=60?`${Math.round(secs/60)} minutes of stillness. `:"")+"Take a moment before you move. Notice your feet, your breath, and the room around you.";mMode_("after");}
$("#mModes").addEventListener("click",e=>{const b=e.target.closest("button");if(b){mMode=b.dataset.m;mSync();}});
$("#mInt").addEventListener("click",e=>{const b=e.target.closest("button");if(b){mInt=+b.dataset.i;lsSet("ek-mint",String(mInt));mSync();}});

$("#mSnd").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;mSnd=b.dataset.s;lsSet("ek-msnd",mSnd);mSync();if(mSnd!=="quiet"&&!soundWanted){soundWanted=true;lsSet("ek-sound","on");syncSoundUI();}mSound(true);});
$("#mStart").onclick=mBegin;$("#mRun").addEventListener("click",e=>{if(e.target.closest("button"))return;mShowCtl();});
$("#mPause").onclick=()=>{mPaused=!mPaused;$("#mPause").textContent=mPaused?"Resume":"Pause";$("#mCue").textContent=mPaused?"Paused. Take all the time you need.":"Back to stillness.";mShowCtl();};
$("#mEnd").onclick=()=>mFinish(false);$("#mAgain").onclick=()=>{mMode_("setup");mSync();requestAnimationFrame(()=>{mWheelTo(mMins,false);GAL.kick();});};$("#mCheck").onclick=()=>{trackFrom="fire";openTrack("today");};
function openMeditate(){mMode_("setup");mSync();show("meditate");requestAnimationFrame(()=>{mWheelTo(mMins,false);GAL.kick();});}
document.querySelectorAll(".pswitch").forEach(sw=>sw.addEventListener("click",e=>{const b=e.target.closest("[data-go]");if(!b)return;if(b.dataset.go==="meditate"){if(bOn)return;openMeditate();}else{if(mTick&&!$("#mRun").hidden)return;show("breathe");}}));
mSync();


/* ================= YOU: cards open their own pages ================= */
document.querySelectorAll("[data-back]").forEach(b=>b.addEventListener("click",()=>show(b.dataset.back)));
$("#youAwards").onclick=()=>{renderAwards();show("awards");};
$("#youPatterns").onclick=()=>{renderPatterns();show("patterns");};
$("#youEmbers").onclick=()=>{renderSparks();show("embers");};
