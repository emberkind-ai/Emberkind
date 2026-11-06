"use strict";
function openMate(k){const c=COMPANIONS[k],a=ABOUT_ALL[k];
  $("#mateAv").innerHTML=companion(c,92,0);$("#mateName").textContent=c.name;$("#mateName").style.color=c.tint;$("#mateRole").textContent=c.role;
  $("#mateAbout").textContent=a.p;$("#mateWhen").textContent=a.w;$("#mateNote").hidden=k!=="ava";$("#mateRout").hidden=k!=="siro";$("#mateNote").textContent=k==="ava"?"General ideas, not dietary advice. With allergies, a medical condition, medication, pregnancy or a history of disordered eating, check with your GP or a dietitian first.":"";$("#mateChips").innerHTML=c.chips.map(t=>`<span>${esc(t)}</span>`).join("");
  glossify($("#mateAbout"));glossify($("#mateNote"));$("#sitBtn").textContent="Sit with "+c.name;$("#sitBtn").onclick=()=>{closeSheets();openChat(k);};
  $("#mateSheet").style.setProperty("--tone",c.tint);openSheet("#mateSheet");}
async function openChat(k,opener,ctx){
  if(!hasConsent()){pendingChat=[k,opener,ctx];openSheet("#consentSheet");return;}
  if(currentView!=="chat")chatFrom=currentView;{const bb=$("#backBtn");if(bb)bb.setAttribute("aria-label",chatFrom==="chats"?"Back to Chats":chatFrom==="fire"?"Back to the fire":"Back");}
  current=k;const c=COMPANIONS[k];app.style.setProperty("--tone",c.color);
  $("#headAv").innerHTML=companion(c,40,0);$("#whoName").textContent=c.name;$("#whoName").style.color=c.color;$("#whoRole").textContent=c.role;
  $("#chips").innerHTML=c.chips.map(t=>`<button>${esc(t)}</button>`).join("");
  show("chat");$("#msgs").innerHTML='<div class="msg note">Sitting down...</div>';
  await loadChat(k);if(ctx){chats[k]=chats[k]||[];chats[k].push({role:"ctx",content:String(ctx).slice(0,6000),at:Date.now()});saveChat(k);}renderMsgs();
  profile.sits[k]=(profile.sits[k]||0)+1;saveProfile();
  if(opener&&sample)send(opener);else if(sample&&!matchMedia("(pointer:coarse)").matches)$("#box").focus({preventScroll:true});
}
function renderMsgs(){
  const m=chats[current]||[];const ci=COMPANIONS[current],ai=ABOUT_ALL[current];
  $("#msgs").innerHTML=m.map((x,i)=>x.role==="ctx"?"":x.role==="care"?CARE_HTML:x.role==="note"?`<div class="msg note">${esc(x.content)}</div>`:`<div class="msg ${x.role==="user"?"me":"them"}">${x.att&&window.EK_attHtml?EK_attHtml(x.att):""}${md(x.content)}${x.role==="assistant"&&current==="siro"&&i>0&&m[i-1].role==="user"&&x.content.length>120?`<button class="saveR" data-i="${i}">Save to my routines</button>`:""}</div>`).join("");
  $("#chips").style.display=sample?"flex":"none";
  if(window.EK_afterRender)window.EK_afterRender(current,!!sample);
  scrollDown();
}
function scrollDown(){const v=$("#view-chat");requestAnimationFrame(()=>{v.scrollTop=v.scrollHeight;});}
const RISK=/(suicid|kill myself|end it all|end my life|don'?t want to (be here|live|exist)|want to die|self[- ]?harm|hurt myself|cutting myself|no reason to live)/i;
const CARE_HTML=`<div class="care" role="note"><b>You don't have to hold this alone.</b>Lifeline is there any time on <a href="tel:131114">13 11 14</a>, or text <a href="sms:0477131114">0477 13 11 14</a>. If you're in danger right now, call <a href="tel:000">000</a>.</div>`;
function buildTurns(k){
  const c=COMPANIONS[k],now=new Date(),time=now.toLocaleString("en-AU",{weekday:"long",hour:"numeric",minute:"2-digit"});
  const mo=now.getMonth(),season=mo>=8&&mo<=10?"spring":mo>=2&&mo<=4?"autumn":mo>=5&&mo<=7?"winter":"summer";
  const nm=profile.name?` Their name is ${profile.name}. Use it rarely and naturally.`:"";
  const srv=Array.isArray(window.EK_SERVER_COMPANIONS)&&window.EK_SERVER_COMPANIONS.includes(k);
  const rules=`${srv?"ABOUT THIS PERSON AND MOMENT":CORE+"\n\nYOUR CHARACTER\n"+c.persona}${moodContext()}${lifeContext()}${focusContext(k)}\n\nThe other Emberkind companions are Soma (emotional and relational support, through the body), Siro (rhythm, routines and practice), Ava (food and energy) and Orra (words and relationships). If someone's need clearly sits with another companion, you can mention them lightly, but still help. The app also has Breathe (a guided breath with a fire that grows), the Community (a shared community space) and links to Aevum Academy. Mention these only when they'd genuinely help.\n\nIt's ${time} for them, in an Australian ${season}. If it's late at night, keep things especially gentle and simple.${nm}\n\nThe conversation so far follows. Reply only as ${c.name}, with just your message.`;
  const turns=[{role:"user",content:rules}];chats[k].filter(x=>x.role==="user"||x.role==="assistant").slice(-30).forEach(x=>turns.push({role:x.role,content:x.content}));return turns;
}
const sendBtn=$("#sendBtn"),box=$("#box");
const UP='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
function setBusy(b){busy=b;$("#chatHead").classList.toggle("thinking",b);sendBtn.classList.toggle("stop",b);sendBtn.setAttribute("aria-label",b?"Stop":"Send");
  sendBtn.innerHTML=b?'<svg width="16" height="16" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>':UP;}
async function send(text){
  text=(text||"").trim();const hasA=!!(window.EK_hasAtt&&EK_hasAtt());if((!text&&!hasA)||busy)return;const k=current,list=chats[k];
  const att=hasA?EK_takeAtt():null;if(!text)text=att.some(a=>a.kind==="pdf")?"I've shared a file with you.":"I've shared a photo with you.";
  list.push(att?{role:"user",content:text,att:att.map(a=>({kind:a.kind,name:a.name,thumb:a.thumb}))}:{role:"user",content:text});if(RISK.test(text))list.push({role:"care"});renderMsgs();saveChat(k);
  if(!sample){list.push({role:"note",content:"Companions aren't connected right now, so nothing you type here is sent anywhere."});renderMsgs();return;}
  const bubble=document.createElement("div");bubble.className="msg them";
  bubble.innerHTML='<span class="dots" aria-label="'+COMPANIONS[k].name+' is with you"><i></i><i></i><i></i></span>';
  $("#msgs").appendChild(bubble);scrollDown();setBusy(true);ctl=new AbortController();
  try{const r=await sample(buildTurns(k),{cache:false,companion:k,signal:ctl.signal,attachments:att?att.map(a=>({kind:a.kind,type:a.type,data:a.data})):undefined,onText:({text})=>{if(window.EK_reveal)EK_reveal(bubble,text);else bubble.innerHTML=md(text);scrollDown();}});
    list.push({role:"assistant",content:r.text});saveChat(k);if(window.EK_afterReply)EK_afterReply(bubble,k,r.text);if(k==="siro"&&current==="siro")renderMsgs();
  }catch(e){
    if(e&&e.text){list.push({role:"assistant",content:e.text});saveChat(k);}
    const code=e&&e.code;
    const msg=code==="cancelled"?null:code==="demo"?`Live conversations open soon. For now, tap one of the examples above to hear how ${COMPANIONS[k].name} speaks.`:code==="not_granted"||code==="sampling_disabled"?"Companions need your permission to talk. You can still breathe with the fire.":code==="unavailable"?"Companions can't connect right now. Please try again in a little while.":code==="rate_limited"?"Things are busy right now. Give it a minute and try again.":code==="refused"?"That one didn't come through. Try saying it another way.":code==="session_expired"?"You've been signed out. Sign back in and come sit again.":"The connection dropped. Try sending again.";
    if(msg)list.push({role:"note",content:msg});if(k===current)renderMsgs();
  }finally{setBusy(false);ctl=null;}
}
$("#composer").addEventListener("submit",e=>{e.preventDefault();if(busy){ctl&&ctl.abort();return;}const t=box.value;box.value="";autosize();send(t);});
box.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey&&window.matchMedia("(hover:hover)").matches){e.preventDefault();$("#composer").requestSubmit();}});
function autosize(){box.style.height="auto";box.style.height=Math.min(box.scrollHeight,140)+"px";box.style.overflowY=box.scrollHeight>141?"auto":"hidden";}
box.addEventListener("input",autosize);
$("#chips").addEventListener("click",e=>{const b=e.target.closest("button");if(b)send(b.textContent);});
$("#freshBtn").onclick=async()=>{if(busy)return;if(!await ask({title:"Start fresh with "+COMPANIONS[current].name+"?",text:"This conversation will be cleared. Your Embers and check-ins stay.",ok:"Start fresh"}))return;
  chats[current]=[{role:"assistant",content:COMPANIONS[current].greeting}];saveChat(current);renderMsgs();};
$("#carryBtn").onclick=async()=>{
  const k=current,list=chats[k].filter(x=>x.role!=="note");
  if(!list.some(x=>x.role==="user")){toast("Talk a little first, then keep what lands.");return;}
  if(!sample){toast("Connect companions first.");return;}
  const btn=$("#carryBtn");btn.disabled=true;btn.textContent="Saving...";
  const convo=list.slice(-16).map(x=>(x.role==="user"?"Person":COMPANIONS[k].name)+": "+x.content).join("\n\n");
  try{const out=await sample.json(`From this conversation, write ONE short line (under 20 words) the person might want to carry with them: an insight, a reminder or a tiny practice that came up. Warm, second person or a gentle reminder, Australian English, no em dashes, no quotation marks, not preachy. Reply with only JSON: {"spark":"..."}\n\n${convo.slice(-6000)}`,{cache:false});
    const s=out&&typeof out.spark==="string"?out.spark.trim():"";if(!s)throw new Error("empty");
    sparks.unshift({text:s,c:k,at:Date.now()});sparks=sparks.slice(0,200);persist("embers",{items:sparks});toast("Kept in your Embers");
  }catch(e){toast("Couldn't keep that one. Try again in a moment.");}
  finally{btn.disabled=false;btn.innerHTML=window.EK_carryLabel||"Save as Ember";}
};


/* ================= BREATHE: ember to bonfire ================= */
/* ================= BREATHE: five nature practices, one calm engine =================
   Paced breathing with a longer or even out-breath supports parasympathetic settling.
   Every practice is bounded (chosen length, visible progress, pause and end anytime). */
const SCENES={
  fire:{name:"Fire",helps:"Low energy, flat or foggy mornings, and the afternoon slump.",hinders:"Forcing big breaths. Keep it gentle, and save it for earlier in the day rather than right before sleep.",kicker:"Breathwork for energy",title:"Feed the fire",
    ctx:"As you breathe in, the fire grows. Imagine it's your own life force, warming and expanding. As you breathe out, let it settle and glow.",
    pace:{in:4,out:4,rest:1},cin:"let it grow",cout:"let it glow",
    lines:["Sit or stand tall with your feet on the floor. Notice the warmth of the fire in front of you.", "Breathe in through your nose and feel your belly and lower ribs widen. That's your diaphragm waking up.", "As the fire grows, feel a gentle warmth gathering in your chest, like your own inner flame.", "Let your shoulders rise a little as you breathe in, and soften down as you breathe out.", "Notice any tingling, warmth or aliveness in your hands and face. That's energy moving through you.", "Imagine each breath feeding a steady fire inside you. Bright and alive, never rushed.", "Feel your spine lengthen and your eyes brighten. Awake, and still grounded.", "Take this warmth with you. Notice how your body feels ready for what's next."]},
  water:{name:"River",helps:"Looping thoughts, rumination, decision overload and a racing mind at night.",hinders:"Trying to stop your thoughts or judge them. Let each one float past instead.",kicker:"Breathwork for an overthinking mind",title:"Let the river carry it",
    ctx:"Breathe in as a leaf arrives on the water and let it hold whatever thought is here. Breathe out and watch the river carry it away. You don't have to stop thinking, only let each thought pass.",
    pace:{in:4,out:6,rest:1},cin:"a leaf arrives",cout:"let it float away",fy:.64,dy:-120,
    lines:["Let your gaze rest on the water. Feel the weight of your body where you're sitting.", "Breathe in slowly and feel the air cool in your nostrils. Let your belly soften as it fills.", "When a thought appears, gently place it on the leaf as it arrives. No need to read it closely.", "Breathe out and watch the river carry it away. Feel your jaw and forehead loosen as it goes.", "If a thought keeps returning, that's okay. Place it on the next leaf. The river has room for all of it.", "Notice that you're the one watching from the bank, steady while the water moves.", "Feel the pause between leaves. A little more quiet each time, without forcing it.", "Let your breath flow like the river: unhurried and continuous, carrying away what you don't need."]},
  air:{name:"Sky",helps:"Everyday stress, resetting between tasks, and calming before a meeting or a hard conversation.",hinders:"Rushing the rhythm or holding your breath at the top. Let it stay even and easy.",kicker:"Breathwork for everyday calm",title:"Breathe with the sky",
    ctx:"Breathe in as a cloud gathers. Breathe out and let it drift and soften, like tension leaving your body. An even, unhurried rhythm for everyday calm.",
    pace:{in:5,out:5,rest:0},cin:"the cloud gathers",cout:"let it drift",fy:.48,dy:-150,
    lines:["Let your eyes go soft, as if resting on a wide horizon. Notice the space all around you.", "Breathe in for five, feeling your belly, then your sides, then your back gently expand.", "Breathe out for five and let your shoulders drift down, like the cloud drifting away.", "This even rhythm helps your heart and breath fall into step. Let it happen on its own.", "Scan gently for tension in your jaw, hands or stomach. Breathe toward it and let it soften.", "Feel the air on your skin, the temperature of the room, the support beneath you.", "Let each cloud carry a little tension with it. Nothing to fix, just letting go.", "Notice the calm that's here now. It's always available, one slow breath away."]},
  earth:{name:"Earth",helps:"Anxiety, feeling floaty or unreal, and overwhelm after hard news.",hinders:"Closing your eyes if that doesn't feel safe, and staying up in your head. Keep coming back to your feet.",kicker:"Breathwork for grounding anxiety",title:"Root into the earth",
    ctx:"Feel where your body meets the ground. If it's comfortable, imagine roots growing gently from your feet. With each breath, a small sapling grows into a tree.",
    pace:{in:4,out:6,rest:1},cin:"the tree grows",cout:"roots grow down",fy:.62,dy:-40,
    lines:["Feel where your body meets the ground: your feet, your seat, your back. Let it take your weight.", "Press your feet gently into the floor and notice it pressing back. Solid, steady, holding you.", "If it feels comfortable, imagine roots growing slowly from the soles of your feet into the earth.", "Breathe out long and slow, and let your weight sink a little more as the roots go a little deeper.", "Quietly name three things you can see. Let your eyes tell your nervous system you're here, now.", "Find a part of your body that feels okay, even neutral. Rest your attention there for a few breaths.", "Breathe in and sense steadiness rising up through your roots, into your legs, belly and chest.", "The ground isn't going anywhere, and neither are you. Feel how solid this moment is."]},
  space:{name:"Space",helps:"Rest, sleep, and perspective when life feels tight.",hinders:"Striving for a special state or a blank mind. There's nothing to achieve, only noticing.",kicker:"Awareness meditation",title:"Feel the space",
    ctx:"Let the stars be a gentle anchor for your eyes. With each breath, soften into the space between things: between sounds, between thoughts, between you and the room around you. Then feel the space within. Nothing to imagine, just reality as it is, felt directly.",
    pace:{in:4,out:7,rest:1},cin:"soften and open",cout:"feel the space",fy:.42,dy:-120,
    lines:["Let your eyes rest softly. Feel the air touching your skin, and the space all around your body.", "Notice the space between the sounds around you. A quiet is already here.", "Breathe in and feel the openness inside your chest and belly. Space within the body.", "Feel the space between your thoughts. Each one arrives and leaves, and the space remains.", "Breathe out and let your attention widen, taking in everything at once without focusing on anything.", "Notice the room around you: the distance, the air, the openness. Simply as it is.", "Nothing needs to change. Let things be exactly as they are, held in this open awareness.", "You don't have to find anything. What's aware of all this has been here the whole time."]}
};
const ORDER_SC=["fire","water","air","earth","space"];
const GENTLE={in:3,out:5,rest:1},WATCH={in:5,out:5,rest:0,watch:true};
const WATCH_LINES={fire:"No need to follow anything. Just let your eyes rest on the fire.",water:"No need to follow anything. Just watch the river and the leaves.",air:"No need to follow anything. Just watch the clouds come and go.",earth:"No need to follow anything. Just watch the roots slowly grow.",space:"No need to follow anything. Just rest in the space between and within things."};
let bScene=["fire","water","air","earth","space"].includes(lsGet("ek-scene"))?lsGet("ek-scene"):"fire";if(!SCENES[bScene])bScene="fire";
/* practice lengths for breathwork and meditation */
const MINS=[5,10,15,20,25,30],snapMins=v=>MINS.reduce((a,b)=>Math.abs(b-v)<Math.abs(a-v)?b:a,MINS[0]);
let bPaceKey="rec",bMins=snapMins(lsNum("ek-mins",5,1,45)),bOn=false,bPaused=false,bTotal=0,bDone=0,bPhase="",bPhaseDur=0,bPhaseEnd=0,bPhaseLeft=0,bTimer=null,bTick=null,bUI=null,bElapsed=0,bMode="idle";
let bVibOn=lsGet("ek-vib")!=="off",lastEarth=.05,bDoneAt=0;
const bview=$("#view-breathe");
function pace(){return bPaceKey==="gentle"?GENTLE:bPaceKey==="watch"?WATCH:SCENES[bScene].pace;}
function cycleLen(p){return p.in+p.out+p.rest*2;}
function fmt(t){t=Math.max(0,Math.ceil(t));return Math.floor(t/60)+":"+String(t%60).padStart(2,"0");}
function vib(p){if(bVibOn)buzz(p);}
function setHeat(l){bscene.style.setProperty("--heat",Math.min(1,.45+l*.3).toFixed(2));}
function cue(which){$("#bIn").classList.toggle("on",which==="in");$("#bOut").classList.toggle("on",which==="out");}
function halo(scale,secs){const h=$("#bHalo");h.style.transitionDuration=secs+"s, 1.5s";h.style.transform="scale("+scale+")";}
function lineFor(i){const sc=SCENES[bScene],n=sc.lines.length;return pace().watch?WATCH_LINES[bScene]:sc.lines[Math.min(n-1,Math.floor(i*n/Math.max(1,bTotal)))];}
let guideT=null;function setGuide(t){const g=$("#bGuide"),p=$("#bGuideT");if(p.textContent===t)return;clearTimeout(guideT);g.classList.add("swap");guideT=setTimeout(()=>{p.textContent=t;glossify(p);g.classList.remove("swap");},520);}
function sessionFrac(){return bTotal?Math.min(1,(bDone+(bPhase==="out"||bPhase==="restB"?.6:.2))/bTotal):0;}
/* breath state for the scene renderers: smooth phase progress, even when idle */
function breathNow(){
  const now=performance.now();
  if(bOn){const left=bPaused?bPhaseLeft:Math.max(0,(bPhaseEnd-now)/1000);return {ph:bPhase,p:bPhaseDur?1-left/bPhaseDur:0,i:bDone,frac:sessionFrac(),run:true};}
  const pc=SCENES[bScene].pace,L=cycleLen(pc),t=(now/1000)%(L*1000),c=Math.floor(t/L);let x=t-c*L;
  const seq=[["in",pc.in],["restT",pc.rest],["out",pc.out],["restB",pc.rest]];
  for(const [ph,d] of seq){if(x<d||ph==="restB")return {ph,p:d?Math.min(1,x/d):1,i:c,frac:bMode==="after"?1:.25,run:false};x-=d;}
}
function updateProgress(){
  const p=pace(),tot=bTotal*cycleLen(p),left=bPaused?bPhaseLeft:Math.max(0,(bPhaseEnd-performance.now())/1000),el=bElapsed+(bOn?bPhaseDur-left:0),frac=Math.min(1,el/tot);
  $("#bBar").style.transform="scaleX("+frac.toFixed(3)+")";$("#bBarWrap").setAttribute("aria-valuenow",Math.round(frac*100));
  $("#bCount").textContent=p.watch?"Resting with the "+SCENES[bScene].name.toLowerCase():"Breath "+Math.min(bTotal,bDone+1)+" of "+bTotal;
  $("#bLeft").textContent=fmt(tot-el)+" left";
}
function countdown(el,n){clearInterval(bTick);el.textContent=n;let k=n;bTick=setInterval(()=>{if(bPaused)return;k--;if(k>=1)el.textContent=k;else clearInterval(bTick);},1000);}
function runPhase(ph,secs){
  const p=pace();bPhase=ph;bPhaseDur=secs;bPhaseLeft=secs;bPhaseEnd=performance.now()+secs*1000;clearTimeout(bTimer);
  const lvl=.3+sessionFrac()*1.15;
  if(ph==="in"){breathFire.target=lvl+.28;setHeat(lvl+.2);halo(1.18,secs);
    if(!p.watch){cue("in");countdown($("#bInN"),secs);$("#bLive").textContent="Breathe in";vib(35);}
    setGuide(lineFor(bDone));}
  else if(ph==="out"){breathFire.target=Math.max(.2,lvl-.1);setHeat(lvl);halo(.82,secs);
    if(!p.watch){cue("out");countdown($("#bOutN"),secs);$("#bLive").textContent="Breathe out";vib([20,60,20]);}}
  else{cue(null);clearInterval(bTick);}
  bTimer=setTimeout(nextPhase,secs*1000);
}
function nextPhase(){
  const p=pace();bElapsed+=bPhaseDur;bPhaseDur=0;
  if(bPhase==="in")return p.rest?runPhase("restT",p.rest):runPhase("out",p.out);
  if(bPhase==="restT")return runPhase("out",p.out);
  if(bPhase==="out")return p.rest?runPhase("restB",p.rest):afterCycle();
  afterCycle();
}
function afterCycle(){bDone++;updateProgress();if(bDone>=bTotal)return finish(true);runPhase("in",pace().in);}
function setMode(mode){
  bMode=mode;bview.dataset.mode=mode;if(window.sessionVolume)sessionVolume(mode==="run");bscene.classList.toggle("raised",mode!=="run");
  $("#bSetup").hidden=mode!=="idle";$("#bRun").hidden=mode!=="run";$("#bAfter").hidden=mode!=="after";
  $("#bHalo").classList.toggle("on",mode==="run"&&bScene==="fire");
}
function sceneUI(){
  if(typeof bHome==="function")setTimeout(bHome,0);
  const sc=SCENES[bScene],p=sc.pace;bview.dataset.scene=bScene;
  $("#bKicker").textContent=sc.kicker;$("#bTitle").textContent=sc.title;$("#bKick2").textContent=sc.kicker;$("#bTitle2").textContent=sc.title;$("#bHH").innerHTML=`<p><b>Helps with</b>${sc.helps}</p><p><b>Gets in the way</b>${sc.hinders}</p>`;$("#bCtx").textContent=sc.ctx;$("#bCtx2").textContent=sc.ctx;if(typeof glossify==="function")glossify($("#bCtx2"));
  $("#bInS").textContent=sc.cin;$("#bOutS").textContent=sc.cout;
  $("#bRec").textContent=p.in+" in, "+p.out+" out";
  document.querySelectorAll("#bScenes button").forEach(b=>b.setAttribute("aria-checked",b.dataset.s===bScene?"true":"false"));
  const fire=bScene==="fire";bscene.classList.toggle("elmode",!fire);breathFire.visible=fire;
  placeCues();lenLabel();EL.set(fire?null:bScene);syncAmbient();
}
function placeCues(){
  const sc=SCENES[bScene],H=bscene.clientHeight||700,ci=$("#bIn"),co=$("#bOut");
  if(!sc.fy){ci.style.top=co.style.top="";return;}
  const y=Math.round(sc.fy*H+sc.dy)+"px";ci.style.top=co.style.top=y;
}
function lenLabel(){const p=pace(),n=Math.max(1,Math.round(bMins*60/cycleLen(p)));
  $("#bLenVal").textContent=bMins+(bMins===1?" minute":" minutes")+(p.watch?"":", about "+n+" breaths");
  const r=$("#bLen");r.style.setProperty("--fill",((bMins-1)/19*100).toFixed(1)+"%");r.setAttribute("aria-valuetext",$("#bLenVal").textContent);}
function idle(){bOn=false;bPaused=false;clearTimeout(bTimer);clearInterval(bTick);clearInterval(bUI);cue(null);halo(.8,2);
  breathFire.rateK=.35;breathFire.target=.3;setHeat(.3);setMode("idle");syncPauseBtn();}
function begin(){
  bview.scrollTop=0;
  const p=pace();bTotal=Math.max(1,Math.round(bMins*60/cycleLen(p)));bDone=0;bElapsed=0;bPhaseDur=0;bOn=true;bPaused=false;
  breathFire.rateK=.6;EL.reset();setMode("run");updateProgress();clearInterval(bUI);bUI=setInterval(()=>{if(!bPaused)updateProgress();},500);
  setGuide(lineFor(0));runPhase("in",p.in);
}
function syncPauseBtn(){const b=$("#bPause");b.setAttribute("aria-label",bPaused?"Resume":"Pause");b.querySelector("span").textContent=bPaused?"Resume":"Pause";b.classList.toggle("paused",bPaused);}
function togglePause(){
  if(!bOn)return;const p=pace();
  if(!bPaused){bPaused=true;clearTimeout(bTimer);clearInterval(bTick);bPhaseLeft=Math.max(0,(bPhaseEnd-performance.now())/1000);
    cue(null);setGuide("Paused. Take all the time you need.");$("#bLive").textContent="Paused";syncPauseBtn();return;}
  bPaused=false;syncPauseBtn();bPhaseEnd=performance.now()+bPhaseLeft*1000;setGuide(lineFor(bDone));
  if(!p.watch&&(bPhase==="in"||bPhase==="out")){cue(bPhase);countdown($(bPhase==="in"?"#bInN":"#bOutN"),Math.max(1,Math.ceil(bPhaseLeft)));}
  bTimer=setTimeout(nextPhase,bPhaseLeft*1000);
}
function finish(complete){
  const grown=bOn?recordPractice():[];
  setTimeout(()=>{const mm=Math.round(monthMins(monthKey()));$("#bMonthLine").textContent=`This month: ${mm} of ${GLOW_GOAL} minutes`+(mm>=GLOW_GOAL?". Goal reached":"");},50);
  $("#bGrew").hidden=false;$("#bGrewT").textContent=grown.length?"Embervale grew: "+grown.map(g=>g.toLowerCase()).join(", ")+".":"Your practice has been added to Embervale.";
  lastEarth=complete?1:Math.min(1,bDone/Math.max(1,bTotal));bDoneAt=performance.now();
  bOn=false;bPaused=false;clearTimeout(bTimer);clearInterval(bTick);clearInterval(bUI);cue(null);halo(.8,3);
  breathFire.rateK=.25;breathFire.target=.6;setHeat(.6);
  if(bDone>=1){profile.breaths=(profile.breaths||0)+1;saveProfile();}
  $("#bAfterTitle").textContent=complete?(profile.name?`That's your practice done, ${nmShort()}`:"That's your practice done"):"You can stop whenever you need";
  $("#bAfterSub").textContent=complete?"Take a moment before you move. Notice your feet, your breath, the room around you.":"Any amount counts. Notice how you feel, without needing it to be different.";
  $("#bResp").textContent="";$("#bAfterNext").innerHTML="";document.querySelectorAll("#bFeel button").forEach(x=>x.setAttribute("aria-pressed","false"));setMode("after");
}
function endBreath(){if(bOn)recordPractice();idle();}
$("#bVale").onclick=()=>show("vale");
/* setup controls */
$("#bScenes").addEventListener("click",e=>{const b=e.target.closest("button");if(!b||bOn)return;bScene=b.dataset.s;lsSet("ek-scene",bScene);sceneUI();});
$("#bPace").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;bPaceKey=b.dataset.p;
  document.querySelectorAll("#bPace button").forEach(x=>x.setAttribute("aria-checked",x===b?"true":"false"));lenLabel();});
$("#bLen").addEventListener("input",e=>{bMins=+e.target.value;lsSet("ek-mins",String(bMins));lenLabel();});
$("#bLen").value=bMins;
function syncSwitches(){$("#bVib").setAttribute("aria-checked",bVibOn?"true":"false");$("#bSnd").setAttribute("aria-checked",soundWanted?"true":"false");const bs=$("#bSetSum");if(bs)bs.textContent=`Sound ${soundWanted?"on":"off"}, vibration ${bVibOn?"on":"off"}`;}
$("#bVib").onclick=()=>{bVibOn=!bVibOn;lsSet("ek-vib",bVibOn?"on":"off");syncSwitches();if(bVibOn)buzz(30);};
$("#bSnd").onclick=()=>{toggleSound();syncSwitches();};
$("#bStart").onclick=begin;$("#bPause").onclick=togglePause;$("#bEnd").onclick=()=>finish(false);
$("#bAgain").onclick=idle;
$("#bFeel").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
  document.querySelectorAll("#bFeel button").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));const f=b.dataset.f;
  const R={calmer:["Much needed. Your body has just practised settling, and it gets a little easier each time.",[["Back to the fire",()=>show("fire")]]],
    same:["That's okay. Some days the body needs more time, and sitting with it still counts. You could try another scene, step outside for some fresh air, or sit with a companion.",[["Try another scene",idle],["Sit with Soma",()=>openChat("soma")]]],
    more:["Thank you for being honest. You don't have to hold this on your own.",[["Sit with Soma",()=>openChat("soma")],["Need a person?",()=>openSheet("#crisisSheet")]]]}[f];
  $("#bResp").textContent=R[0];$("#bAfterNext").innerHTML="";R[1].forEach(([t,fn],i)=>{const x=document.createElement("button");x.className=i?"blink":"bprim";x.textContent=t;x.onclick=fn;$("#bAfterNext").appendChild(x);});
  profile.lastFeel=f;profile.feels=profile.feels||{};profile.feels[f]=(profile.feels[f]||0)+1;saveProfile();});
window.addEventListener("resize",()=>{placeCues();EL.resize();});

/* ================= NATURE SCENES (one canvas, cached backgrounds) ================= */
const EL=(function(){
  const cv=$("#elCanvas"),cx=cv.getContext("2d");let W=0,H=0,D=1,kind=null,bg=null,raf=0,last=0,off=0,state={};
  function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
  function mk(w,h){const c=document.createElement("canvas");c.width=Math.max(1,Math.round(w*D));c.height=Math.max(1,Math.round(h*D));const x=c.getContext("2d");x.setTransform(D,0,0,D,0,0);return [c,x];}
  function lin(x,y0,y1,stops){const g=x.createLinearGradient(0,y0,0,y1);stops.forEach(([o,c])=>g.addColorStop(o,c));return g;}
  function rad(x,X,Y,r,stops){const g=x.createRadialGradient(X,Y,0,X,Y,r);stops.forEach(([o,c])=>g.addColorStop(o,c));return g;}
  const ease={out:t=>1-Math.pow(1-t,3),inq:t=>t*t,io:t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,sin:t=>1-Math.cos(t*Math.PI/2)};
  function hills(x,base,amp,f,ph,col,w,h){const y=i=>base+Math.sin(i/w*f+ph)*amp+Math.sin(i/w*f*2.3+ph*1.7)*amp*.35;x.beginPath();x.moveTo(0,h);for(let i=0;i<w;i+=8)x.lineTo(i,y(i));x.lineTo(w,y(w));x.lineTo(w,h);x.closePath();x.fillStyle=col;x.fill();}
  function puff(x,X,Y,r,a){x.fillStyle=rad(x,X,Y,r,[[0,`rgba(255,255,255,${a})`],[.6,`rgba(255,255,255,${a*.55})`],[1,"rgba(255,255,255,0)"]]);x.beginPath();x.arc(X,Y,r,0,Math.PI*2);x.fill();}
  function cloudSprite(seed,w,h){const [c,x]=mk(w,h),r=rng(seed);for(let i=0;i<9;i++){const X=w*(.16+r()*.68),Y=h*(.58+r()*.14),R=h*(.2+r()*.12);puff(x,X,Y,R,.9);}for(let i=0;i<9;i++){const X=w*(.25+r()*.5),Y=h*(.38+r()*.2),R=h*(.24+r()*.18);puff(x,X,Y,R,.95);}
    x.globalCompositeOperation="source-atop";x.fillStyle=lin(x,0,h,[[0,"rgba(255,255,255,0)"],[.7,"rgba(160,180,230,.18)"],[1,"rgba(120,140,200,.3)"]]);x.fillRect(0,0,w,h);return c;}
  /* ---------- RIVER ---------- */
  const RIVER={
    top:x=>H*.535+Math.sin(x/W*Math.PI*1.2)*H*.012, bot:x=>H*.75+Math.sin(x/W*Math.PI*1.6+1)*H*.016,
    mid(x){return (this.top(x)+this.bot(x))/2+H*.01;},
    build(){
      const [c,x]=mk(W,H*1.25),r=rng(7),h=H;
      x.fillStyle=lin(x,0,h*.5,[[0,"#3E9BEA"],[.55,"#8CCBF5"],[1,"#D9F1FF"]]);x.fillRect(0,0,W,h*.5);
      x.fillStyle=rad(x,W*.8,h*.1,h*.35,[[0,"rgba(255,250,225,.95)"],[.15,"rgba(255,244,200,.55)"],[1,"rgba(255,240,200,0)"]]);x.fillRect(0,0,W,h*.5);
      hills(x,h*.34,h*.035,4,1,"#86CFA2",W,h);hills(x,h*.385,h*.04,3,2.4,"#58BC68",W,h);
      for(let i=0;i<14;i++){const X=r()*W,Y=h*(.39+r()*.05),R=8+r()*14;x.fillStyle="#2E8F45";x.beginPath();x.arc(X,Y,R,0,7);x.fill();x.fillStyle="#3FA752";x.beginPath();x.arc(X-R*.25,Y-R*.3,R*.7,0,7);x.fill();}
      hills(x,h*.44,h*.025,5,4,"#47AD55",W,h);
      x.fillStyle=lin(x,h*.45,h*.55,[[0,"#4FB55B"],[1,"#3B9A47"]]);x.beginPath();x.moveTo(0,h*.46);for(let i=0;i<=W;i+=8)x.lineTo(i,this.top(i)+2);x.lineTo(W,h*.46);x.fill();
      x.beginPath();x.moveTo(0,this.top(0));for(let i=0;i<=W;i+=6)x.lineTo(i,this.top(i));for(let i=W;i>=0;i-=6)x.lineTo(i,this.bot(i));x.closePath();
      x.fillStyle=lin(x,h*.53,h*.77,[[0,"#4CCBF5"],[.25,"#1FA8EA"],[.65,"#0D86D0"],[1,"#0868B2"]]);x.fill();
      x.save();x.clip();x.globalAlpha=.25;for(let i=0;i<5;i++){x.fillStyle="#BFF0FF";x.fillRect(0,h*(.56+i*.035),W,1.5);}x.restore();
      x.strokeStyle="rgba(20,70,40,.55)";x.lineWidth=3;x.beginPath();for(let i=0;i<=W;i+=6)x.lineTo(i,this.top(i));x.stroke();
      x.beginPath();x.moveTo(0,h);for(let i=0;i<=W;i+=6)x.lineTo(i,this.bot(i));x.lineTo(W,h*1.25);x.lineTo(0,h*1.25);x.closePath();x.fillStyle=lin(x,h*.74,h*1.1,[[0,"#52BA5C"],[.5,"#36964A"],[1,"#2A7E3C"]]);x.fill();
      x.strokeStyle="rgba(15,60,35,.5)";x.lineWidth=3;x.beginPath();for(let i=0;i<=W;i+=6)x.lineTo(i,this.bot(i));x.stroke();
      for(let i=0;i<700;i++){const X=r()*W,b=this.bot(X),Y=b+6+r()*(h*1.2-b),L=6+r()*14;x.strokeStyle=["#3FA650","#5CC266","#2F8A40","#6FCF6E"][i%4];x.lineWidth=1.2;x.beginPath();x.moveTo(X,Y);x.quadraticCurveTo(X+2,Y-L*.6,X+(r()-.5)*6,Y-L);x.stroke();}
      for(let i=0;i<60;i++){const X=r()*W,b=this.bot(X),Y=b+12+r()*(h*1.15-b);x.fillStyle=["#FFFFFF","#FFE36B","#FFB3D1"][i%3];x.beginPath();x.arc(X,Y,1.8+r()*1.4,0,7);x.fill();}
      for(const side of [0,1])for(let i=0;i<10;i++){const X=side?W-r()*40:r()*40,Y=this.bot(X)+4,L=40+r()*50;x.strokeStyle="#2E7E3B";x.lineWidth=2;x.beginPath();x.moveTo(X,Y);x.quadraticCurveTo(X+(side?-10:10),Y-L*.5,X+(side?-16:16)*r(),Y-L);x.stroke();}
      state.clouds=[cloudSprite(3,220,90),cloudSprite(9,180,80)];
      state.leaves=[["#B7E35A","#5DA82E"],["#FFC14D","#E07A22"],["#E3EE6A","#86B53A"]].map(([a,b])=>{const [lc,lx]=mk(56,32);lx.translate(28,16);lx.beginPath();lx.moveTo(-26,0);lx.bezierCurveTo(-12,-15,14,-14,26,0);lx.bezierCurveTo(14,13,-12,14,-26,0);lx.fillStyle=lin(lx,-14,14,[[0,a],[1,b]]);lx.fill();lx.strokeStyle="rgba(60,80,20,.6)";lx.lineWidth=1;lx.beginPath();lx.moveTo(-24,0);lx.lineTo(24,0);for(let k=-14;k<=14;k+=7){lx.moveTo(k,0);lx.lineTo(k+6,-7);lx.moveTo(k,0);lx.lineTo(k+6,7);}lx.stroke();return lc;});
      return c;
    },
    draw(t,b){
      for(let k=0;k<2;k++){const s=state.clouds[k],x=((t*(6+k*3)+k*W*.6)%(W+260))-220;cx.globalAlpha=.85;cx.drawImage(s,x,H*(.06+k*.07),s.width/D,s.height/D);}
      cx.globalAlpha=1;cx.lineCap="round";
      for(let k=0;k<26;k++){const X=((k*137.5+t*24)%(W+120))-60,band=(k%7+1)/8,Y=this.top(X)+(this.bot(X)-this.top(X))*band,L=14+(k%5)*9,a=.18+.16*Math.sin(t*1.1+k);
        cx.strokeStyle=`rgba(225,250,255,${a.toFixed(3)})`;cx.lineWidth=1.6;cx.beginPath();cx.moveTo(X,Y);cx.lineTo(X+L,Y);cx.stroke();}
      if(b.ph==="restB")return;
      let X;if(b.ph==="in")X=-W*.12+(W*.62)*ease.out(b.p);else if(b.ph==="restT")X=W*.5+b.p*W*.015;else X=W*.515+(W*.66)*ease.sin(b.p);
      const Y=this.mid(X)+Math.sin(t*1.2+b.i)*3,rot=Math.sin(t*.7+b.i)*.22+(X/W-.5)*.5,lf=state.leaves[b.i%3],a=b.ph==="out"?1-Math.max(0,(b.p-.8)/.2):1;
      const rr=(b.ph==="restT"?b.p:b.ph==="in"?Math.max(0,b.p-.7)/.3:1)*28;
      if(rr>0){cx.strokeStyle=`rgba(230,250,255,${(.35*a*(1-rr/40)).toFixed(3)})`;cx.lineWidth=1.4;cx.beginPath();cx.ellipse(X,Y+4,30+rr*1.4,(30+rr*1.4)*.3,0,0,7);cx.stroke();}
      cx.globalAlpha=.28*a;cx.fillStyle="#04456F";cx.beginPath();cx.ellipse(X+4,Y+8,36,10,0,0,7);cx.fill();
      cx.globalAlpha=a;cx.save();cx.translate(X,Y);cx.rotate(rot);cx.drawImage(lf,-42,-24,84,48);cx.restore();cx.globalAlpha=1;
    }
  };
  /* ---------- SKY ---------- */
  const SKY={
    build(){const [c,x]=mk(W,H*1.25),h=H;
      x.fillStyle=lin(x,0,h*1.25,[[0,"#2A66D2"],[.35,"#6FA8F2"],[.62,"#BFD7FA"],[.8,"#F7C6D6"],[1,"#FFDDB5"]]);x.fillRect(0,0,W,h*1.25);
      x.fillStyle=rad(x,W*.5,h*.92,h*.55,[[0,"rgba(255,236,200,.9)"],[.25,"rgba(255,220,190,.45)"],[1,"rgba(255,220,190,0)"]]);x.fillRect(0,0,W,h*1.25);
      const r=rng(4);for(let i=0;i<16;i++)puff(x,r()*W,h*(.9+r()*.25),40+r()*60,.55);
      state.sprites=[cloudSprite(11,300,130),cloudSprite(21,260,110),cloudSprite(31,340,150)];
      state.bgc=[0,1,2,3,4,5].map(i=>({s:i%3,y:.08+i*.12,v:3+i*1.2,x:i*.37,sc:.45+((i*7)%5)*.08,a:.5+((i*3)%4)*.1}));
      return c;},
    draw(t,b){
      for(const q of state.bgc){const s=state.sprites[q.s],w=s.width/D*q.sc,X=((q.x*W+t*q.v)%(W+w+40))-w;cx.globalAlpha=q.a;cx.drawImage(s,X,H*q.y,w,s.height/D*q.sc);}
      cx.globalAlpha=1;if(b.ph==="restB")return;
      const cxp=W*.5,cyp=H*.5;let sc,a,dx=0,dy=0;
      if(b.ph==="in"){sc=.35+.65*ease.io(b.p);a=.15+.85*ease.io(b.p);}else if(b.ph==="restT"){sc=1;a=1;}else{sc=1+.25*b.p;a=1-ease.inq(b.p);dx=W*.34*ease.io(b.p);dy=-H*.07*b.p;}
      const s=state.sprites[b.i%3],w=W*.86*sc,hh=w*s.height/s.width;
      if(b.ph!=="out"){cx.globalAlpha=.35*a;cx.fillStyle=rad(cx,cxp,cyp,w*.7,[[0,"rgba(255,255,255,.7)"],[1,"rgba(255,255,255,0)"]]);cx.fillRect(cxp-w,cyp-w,w*2,w*2);}
      cx.globalAlpha=a;cx.drawImage(s,cxp-w/2+dx,cyp-hh/2+dy,w,hh);cx.globalAlpha=1;
    }
  };
  /* ---------- EARTH: roots ease down, a sapling becomes a tree, fruit at the end ---------- */
  const EARTH={
    G:()=>H*.4,
    build(){const [c,x]=mk(W,H*1.25),h=H,G=h*.4,r=rng(12);
      x.fillStyle=lin(x,0,G,[[0,"#F4A86A"],[.6,"#FAD09A"],[1,"#FBE3B6"]]);x.fillRect(0,0,W,G);
      x.fillStyle=rad(x,W*.25,G*.85,h*.3,[[0,"rgba(255,245,215,.95)"],[.2,"rgba(255,235,190,.5)"],[1,"rgba(255,230,190,0)"]]);x.fillRect(0,0,W,G);
      hills(x,G*.8,h*.025,3,1.3,"#A9B56A",W,G+2);hills(x,G*.9,h*.02,4,3,"#869E4E",W,G+2);
      x.fillStyle=lin(x,G,h*1.25,[[0,"#7A5332"],[.15,"#62432A"],[.45,"#4A321F"],[.75,"#352317"],[1,"#24180F"]]);x.fillRect(0,G,W,h*1.25-G);
      for(let i=0;i<7;i++){const y=G+h*(.06+i*.1);x.strokeStyle=`rgba(${i%2?"20,12,6":"140,100,60"},.18)`;x.lineWidth=6+r()*10;x.beginPath();for(let X=0;X<=W;X+=10)x.lineTo(X,y+Math.sin(X/W*6+i)*6);x.stroke();}
      for(let i=0;i<34;i++){const X=r()*W,Y=G+h*.05+r()*h*.75,R=3+r()*11;x.fillStyle="rgba(0,0,0,.25)";x.beginPath();x.ellipse(X+2,Y+2,R*1.2,R*.75,0,0,7);x.fill();
        x.fillStyle=rad(x,X-R*.3,Y-R*.3,R*1.4,[[0,"#B7A58E"],[.6,"#7E6C58"],[1,"#4C3E30"]]);x.beginPath();x.ellipse(X,Y,R*1.2,R*.75,0,0,7);x.fill();}
      for(let i=0;i<80;i++){x.fillStyle=`rgba(255,215,140,${(.15+r()*.35).toFixed(2)})`;x.fillRect(r()*W,G+r()*h*.85,1.6,1.6);}
      x.fillStyle="#3E7A2E";x.fillRect(0,G-3,W,7);
      for(let i=0;i<260;i++){const X=r()*W,L=5+r()*12;x.strokeStyle=["#4F8F36","#6BAA45","#3B7529"][i%3];x.lineWidth=1.3;x.beginPath();x.moveTo(X,G+2);x.quadraticCurveTo(X+2,G-L*.5,X+(r()-.5)*5,G-L);x.stroke();}
      state.roots=this.makeRoots();state.rootC=mk(W,H*1.25);state.rootR=0;state.tree=this.makeTree();
      state.leafS=["#5FAE3A","#78C24A","#4C9A30"].map((c0,i)=>{const [lc,lx]=mk(64,64);for(let k=0;k<7;k++){const X=14+((k*29+i*11)%36),Y=16+((k*17+i*7)%30),R=12+((k*5+i)%7);lx.fillStyle=rad(lx,X-3,Y-4,R,[[0,"#B6E27A"],[.45,c0],[1,"rgba(40,90,30,0)"]]);lx.beginPath();lx.arc(X,Y,R,0,7);lx.fill();}return lc;});
      const [fc,fx]=mk(40,44);fx.fillStyle=rad(fx,15,22,18,[[0,"#FFD39A"],[.35,"#FF8A3D"],[.8,"#D9452B"],[1,"#A8301E"]]);fx.beginPath();fx.arc(20,25,15,0,7);fx.fill();
      fx.fillStyle="rgba(255,255,255,.55)";fx.beginPath();fx.ellipse(14,19,4,2.6,-.6,0,7);fx.fill();fx.strokeStyle="#5B3A1E";fx.lineWidth=2;fx.beginPath();fx.moveTo(20,11);fx.lineTo(21,5);fx.stroke();
      fx.fillStyle="#6DBA3E";fx.beginPath();fx.ellipse(26,7,5,2.5,-.4,0,7);fx.fill();state.fruitS=fc;
      return c;},
    makeRoots(){const r=rng(5),segs=[],G=this.G(),cX=W*.5;let maxD=0;
      function grow(x,y,ang,len,gen,sd,side){if(gen>2||len<16)return;ang=Math.min(Math.PI-.25,Math.max(.25,ang));const pts=[[x,y]],cum=[0];let X=x,Y=y,a=ang,d=0;const n=10;
        for(let i=0;i<n;i++){a+=(r()-.5)*.22+side*.025;a+=(Math.PI/2-a)*.035;a=Math.min(Math.PI-.22,Math.max(.22,a));const nx=X+Math.cos(a)*len/n,ny=Y+Math.sin(a)*len/n;d+=Math.hypot(nx-X,ny-Y);X=nx;Y=ny;pts.push([X,Y]);cum.push(d);}
        segs.push({pts,cum,sd,len:d,gen,w:Math.max(1.1,4-gen*1.1),baked:false});maxD=Math.max(maxD,sd+d);
        [[.38,-1],[.68,1]].forEach(([t,k])=>{const idx=Math.floor(t*n);grow(pts[idx][0],pts[idx][1],a+k*(.55+r()*.25),len*(.5+r()*.1),gen+1,sd+cum[idx],k);});
        if(gen<2)grow(X,Y,a+(r()-.5)*.25,len*.58,gen+1,sd+d,side);}
      [-1.1,-.65,-.22,.22,.65,1.1].forEach(o=>grow(cX+o*7,G+4,Math.PI/2-o,H*(.13+(1.2-Math.abs(o))*.07),0,0,Math.sign(o)));
      segs.maxD=maxD;return segs;},
    makeTree(){const r=rng(33),Ht=H*.2,br=[],lv=[],fr=[];
      const trunk=s=>[Math.sin(s*2.2)*6*s,-Ht*s];
      for(let i=0;i<7;i++){const s=.42+i*.085,side=i%2?1:-1,base=trunk(s),ang=-Math.PI/2+side*(.55+r()*.35),len=Ht*(.32+r()*.2)*(1-s*.35),birth=.22+i*.06;
        const end=[base[0]+Math.cos(ang)*len,base[1]+Math.sin(ang)*len];br.push({a:base,b:end,w:6-i*.5,birth});
        for(let k=0;k<2;k++){const t=.5+k*.3,p=[base[0]+(end[0]-base[0])*t,base[1]+(end[1]-base[1])*t],a2=ang+(k?1:-1)*(.5+r()*.3),l2=len*(.42+r()*.15),e2=[p[0]+Math.cos(a2)*l2,p[1]+Math.sin(a2)*l2];
          br.push({a:p,b:e2,w:2.4,birth:birth+.12});lv.push({x:e2[0],y:e2[1],s:26+r()*12,birth:birth+.2+r()*.1,v:(i+k)%3});}
        lv.push({x:end[0],y:end[1],s:32+r()*14,birth:birth+.16,v:i%3});}
      const top=trunk(1);lv.push({x:top[0],y:top[1]-6,s:44,birth:.55,v:1});
      for(let i=0;i<14;i++){const ang=r()*Math.PI*2,R=Ht*(.12+r()*.28);lv.push({x:top[0]+Math.cos(ang)*R*1.25,y:top[1]+Ht*.12+Math.sin(ang)*R*.8,s:30+r()*16,birth:.5+r()*.35,v:i%3});}
      lv.sort((a,b)=>a.birth-b.birth);
      for(let i=0;i<9;i++){const L=lv[(i*5+3)%lv.length];fr.push({x:L.x+(r()-.5)*L.s*.6,y:L.y+(r()-.2)*L.s*.4});}
      return {Ht,trunk,br,lv,fr};},
    rootPart(x,s,d,glow){const pts=s.pts,cum=s.cum;x.beginPath();x.moveTo(pts[0][0],pts[0][1]);
      for(let i=1;i<pts.length;i++){if(cum[i]<=d){x.lineTo(pts[i][0],pts[i][1]);continue;}const f=(d-cum[i-1])/(cum[i]-cum[i-1]);x.lineTo(pts[i-1][0]+(pts[i][0]-pts[i-1][0])*f,pts[i-1][1]+(pts[i][1]-pts[i-1][1])*f);break;}
      x.lineCap="round";x.lineJoin="round";if(glow){x.strokeStyle="rgba(255,205,120,.2)";x.lineWidth=s.w+6;x.stroke();}x.strokeStyle="#F2C46B";x.lineWidth=s.w;x.stroke();},
    reset(){const [c,x]=state.rootC;x.clearRect(0,0,c.width,c.height);state.roots.forEach(q=>q.baked=false);state.rootR=0;},
    prog(b){ // smooth, eased growth tied to the breath: tree on the in-breath, roots on the out-breath
      if(!b.run){const v=bMode==="after"?lastEarth:.05;return [v,v];}
      const T=Math.max(1,bTotal),i=b.i,ti=b.ph==="in"?ease.io(b.p):1,ro=b.ph==="out"?ease.io(b.p):b.ph==="restB"?1:0;
      return [Math.min(1,(i+ti)/T),Math.min(1,(i+ro)/T)];},
    draw(t,b){
      const [gT,gR]=this.prog(b),Rs=state.roots,R=gR*Rs.maxD,G=this.G();
      if(R<state.rootR-1)this.reset();state.rootR=R;
      const [rc,rx]=state.rootC;rx.save();rx.shadowColor="rgba(255,190,90,.55)";rx.shadowBlur=8;
      for(const q of Rs)if(!q.baked&&R>=q.sd+q.len){this.rootPart(rx,q,q.len,false);q.baked=true;}rx.restore();
      cx.drawImage(rc,0,0,W,H*1.25);
      for(const q of Rs)if(!q.baked&&R>q.sd)this.rootPart(cx,q,R-q.sd,true);
      if(b.ph==="in"&&b.run){const a=Math.sin(Math.PI*b.p);for(let k=0;k<10;k++){const q=Rs[(k*5)%Rs.length];if(q.sd>R)continue;const e=q.pts[Math.min(q.pts.length-1,5)],y=e[1]+(G-e[1])*ease.io(b.p);
        cx.globalAlpha=.75*a;cx.fillStyle=rad(cx,e[0],y,8,[[0,"rgba(255,226,150,1)"],[1,"rgba(255,226,150,0)"]]);cx.fillRect(e[0]-8,y-8,16,16);}cx.globalAlpha=1;}
      this.drawTree(t,b,gT);
    },
    drawTree(t,b,g){
      const G=this.G(),T=state.tree,sc=.3+.7*ease.io(Math.min(1,g)),sway=Math.sin(t*.5)*.012,breathe=b.ph==="in"?ease.io(b.p):b.ph==="restT"?1:b.ph==="out"?1-ease.io(b.p):0;
      cx.save();cx.translate(W*.5,G);cx.rotate(sway);cx.scale(sc,sc*(1+breathe*.01));
      const steps=14;cx.beginPath();for(let i=0;i<=steps;i++){const p=T.trunk(i/steps),w=(13-8*(i/steps));cx.lineTo(p[0]-w/2,p[1]);}for(let i=steps;i>=0;i--){const p=T.trunk(i/steps),w=(13-8*(i/steps));cx.lineTo(p[0]+w/2,p[1]);}cx.closePath();
      cx.fillStyle=g<.15?"#4C8A2E":"#6A4428";cx.fill();cx.strokeStyle="rgba(40,22,10,.35)";cx.lineWidth=1;cx.stroke();
      cx.lineCap="round";cx.strokeStyle="#6A4428";
      for(const q of T.br){const k=Math.min(1,Math.max(0,(g-q.birth)/.22));if(!k)continue;const e=ease.io(k);cx.lineWidth=q.w;cx.beginPath();cx.moveTo(q.a[0],q.a[1]);cx.lineTo(q.a[0]+(q.b[0]-q.a[0])*e,q.a[1]+(q.b[1]-q.a[1])*e);cx.stroke();}
      for(const L of T.lv){const k=Math.min(1,Math.max(0,(g-L.birth)/.2));if(!k)continue;const e=1+2.2*Math.pow(k-1,3)+1.2*Math.pow(k-1,2),S=L.s*e;cx.globalAlpha=Math.min(1,k*1.4);cx.drawImage(state.leafS[L.v],L.x-S/2,L.y-S/2,S,S);}
      cx.globalAlpha=1;
      if(g<.3){const a=1-g/.3,top=T.trunk(1);cx.globalAlpha=a;for(const sgn of [-1,1]){cx.save();cx.translate(top[0],top[1]+8);cx.rotate(sgn*(.9-breathe*.35));cx.fillStyle=sgn<0?"#6DBA3E":"#82C94A";cx.beginPath();cx.ellipse(0,-14,9,17,0,0,7);cx.fill();cx.restore();}cx.globalAlpha=1;}
      if(breathe>0){cx.globalAlpha=.25*breathe;const top=T.trunk(1);cx.fillStyle=rad(cx,top[0],top[1],T.Ht*.7,[[0,"rgba(255,240,180,.9)"],[1,"rgba(255,240,180,0)"]]);cx.fillRect(top[0]-T.Ht,top[1]-T.Ht,T.Ht*2,T.Ht*2);cx.globalAlpha=1;}
      if(bMode==="after"&&lastEarth>=1){const ft=(performance.now()-bDoneAt)/1000;
        T.fr.forEach((f,i)=>{const k=Math.min(1,Math.max(0,(ft-1.2-i*.9)/1.6));if(!k)return;const s1=1.70158,e=1+(s1+1)*Math.pow(k-1,3)+s1*Math.pow(k-1,2),S=26*e;
          if(k<1){cx.globalAlpha=(1-k)*.55;cx.strokeStyle="#FFE2A6";cx.lineWidth=1.5;cx.beginPath();cx.arc(f.x,f.y,10+k*26,0,7);cx.stroke();
            for(let j=0;j<4;j++){const an=j*1.57+i,dd=8+k*22;cx.fillStyle="#FFF1C8";cx.fillRect(f.x+Math.cos(an)*dd,f.y+Math.sin(an)*dd-k*10,2,2);}}
          cx.globalAlpha=Math.min(1,k*2);cx.drawImage(state.fruitS,f.x-S*.45,f.y-S*.5,S*.9,S);cx.globalAlpha=1;});}
      cx.restore();
    }
  };
  /* ---------- SPACE ---------- */
  const SPACE={
    build(){const [c,x]=mk(W,H*1.25),h=H*1.25,r=rng(21);
      x.fillStyle=rad(x,W*.5,H*.42,h*.9,[[0,"#1C1246"],[.5,"#0E0A2A"],[1,"#04030C"]]);x.fillRect(0,0,W,h);
      x.globalCompositeOperation="lighter";
      [["122,77,255",.16],["43,197,217",.1],["255,111,181",.08],["122,77,255",.12],["60,120,255",.1]].forEach(([col,a],i)=>{const X=W*(.15+r()*.7),Y=H*(.15+r()*.6),R=W*(.35+r()*.35);x.fillStyle=rad(x,X,Y,R,[[0,`rgba(${col},${a})`],[1,`rgba(${col},0)`]]);x.fillRect(0,0,W,h);});
      x.globalCompositeOperation="source-over";
      for(let i=0;i<520;i++){const X=r()*W,Y=r()*h,s=r()<.06?1.8:r()<.3?1.1:.7;x.fillStyle=`rgba(${r()<.2?"200,210,255":"255,250,240"},${(.35+r()*.6).toFixed(2)})`;x.beginPath();x.arc(X,Y,s,0,7);x.fill();}
      const PX=W*.88,PY=H*1.02,PR=W*.42;x.fillStyle=rad(x,PX,PY,PR*1.25,[[.75,"rgba(120,140,255,.25)"],[1,"rgba(120,140,255,0)"]]);x.fillRect(0,0,W,h);
      x.fillStyle=rad(x,PX-PR*.45,PY-PR*.5,PR*1.4,[[0,"#7B6CD9"],[.45,"#3A2E7A"],[1,"#120C2A"]]);x.beginPath();x.arc(PX,PY,PR,0,7);x.fill();
      state.tw=[...Array(28)].map(()=>({x:r()*W,y:r()*H,s:.8+r()*1.4,f:.3+r()*.6,o:r()*6}));state.rings=[];
      return c;},
    draw(t,b){
      for(const s of state.tw){const a=.35+.45*Math.sin(t*s.f+s.o);cx.fillStyle=`rgba(255,250,235,${a.toFixed(3)})`;cx.fillRect(s.x,s.y,s.s,s.s);}
      const X=W*.5,Y=H*.42,glow=b.ph==="in"?ease.io(b.p):b.ph==="restT"?1:b.ph==="out"?1-ease.io(b.p):0;
      if(b.ph==="out"){const R=20+W*.7*ease.out(b.p),a=.5*(1-b.p);cx.strokeStyle=`rgba(200,190,255,${a.toFixed(3)})`;cx.lineWidth=2;cx.beginPath();cx.arc(X,Y,R,0,7);cx.stroke();
        cx.strokeStyle=`rgba(200,190,255,${(a*.4).toFixed(3)})`;cx.lineWidth=8;cx.stroke();}
      const R=34+46*glow;cx.fillStyle=rad(cx,X,Y,R,[[0,`rgba(255,255,255,${(.85).toFixed(2)})`],[.12,`rgba(225,215,255,${(.55+.35*glow).toFixed(3)})`],[.45,`rgba(150,130,255,${(.18+.2*glow).toFixed(3)})`],[1,"rgba(120,100,255,0)"]]);
      cx.fillRect(X-R,Y-R,R*2,R*2);cx.fillStyle="#FFFFFF";cx.beginPath();cx.arc(X,Y,2.6+glow*1.4,0,7);cx.fill();
    }
  };
  const IMPL={water:RIVER,air:SKY,earth:EARTH,space:SPACE};
  function resize(){const r=cv.getBoundingClientRect();if(!r.width)return false;D=Math.min(window.devicePixelRatio||1,1.5);W=r.width;H=r.height;cv.width=Math.round(W*D);cv.height=Math.round(H*D);cx.setTransform(D,0,0,D,0,0);if(kind)bg=IMPL[kind].build();return true;}
  function frame(now){raf=0;if(!kind||currentView!=="breathe"||document.hidden||simple)return;
    if(!W&&!resize()){raf=requestAnimationFrame(frame);return;}
    const t=now/1000,b=breathNow(),want=bMode!=="idle"?0:H*({water:.38,air:.18,earth:.1,space:.16}[kind]||0);off+=(want-off)*Math.min(1,(now-last)/1000*2.2);last=now;
    cx.setTransform(D,0,0,D,0,0);cx.translate(0,-off);cx.drawImage(bg,0,0,W,H*1.25);IMPL[kind].draw(t,b);raf=requestAnimationFrame(frame);}
  function kick(){if(!raf&&kind){last=performance.now();raf=requestAnimationFrame(frame);}}
  document.addEventListener("visibilitychange",kick);
  return {set(k){kind=k;state={};bg=null;W=0;off=bMode==="run"?0:H*({water:.38,air:.18,earth:.1,space:.16}[k]||0);if(k)kick();},resize(){if(kind){state={};resize();}},kick,reset(){if(kind==="earth"&&state.roots)EARTH.reset();lastEarth=.05;}};
})();

sceneUI();idle();syncSwitches();


/* ================= CIRCLE ================= */
let circleOn=false,members={},posts=[],hidden=new Set();
function rel(t){const m=Math.round((Date.now()-t)/60000);if(m<1)return"just now";if(m<60)return m+"m";const h=Math.round(m/60);if(h<24)return h+"h";return new Date(t).toLocaleDateString("en-AU",{day:"numeric",month:"short"});}
function renderFeed(){
  const f=$("#feed");
  $("#circleForm").hidden=!db||!!window.EK_STANDALONE;if(!db||window.EK_STANDALONE){f.innerHTML='<p class="quiet">The shared Community opens with the full Emberkind app, where everyone sits by the same fire. Until then, the wider Aevum community is open to you.</p>';return;}
  const list=posts.filter(p=>!hidden.has(p.id));
  if(!list.length){f.innerHTML='<p class="quiet">Quiet by the fire tonight. You could be the first to share.</p>';return;}
  f.innerHTML=list.map(p=>{const mine=p.uid===uid;const nm=esc(members[p.uid]||"Someone by the fire");
    const act=mine||isOwner?`<button data-del="${esc(p.id)}">Remove</button>`:`<button data-rep="${esc(p.id)}">Report</button>`;
    return `<div class="post${mine?" mine":""}"><div class="meta"><b>${nm}</b><span>${rel(p.at)}</span>${act}</div><p>${esc(p.text)}</p></div>`;}).join("");
  const v=$("#view-circle");requestAnimationFrame(()=>{v.scrollTop=v.scrollHeight;});
}
async function startCircle(){
  await ready;renderFeed();if(circleOn||!db||window.EK_STANDALONE)return;circleOn=true;
  db.collection("members").limit(1000).onSnapshot(s=>{members={};s.docs.forEach(d=>{const v=d.data();if(v&&v.name)members[d.id]=String(v.name);});renderFeed();},()=>{});
  db.collection("circle").orderBy("at","desc").limit(150).onSnapshot(s=>{posts=s.docs.map(d=>Object.assign({id:d.id},d.data())).filter(p=>typeof p.text==="string").reverse();renderFeed();},()=>{});
}
$("#feed").addEventListener("click",async e=>{
  const d=e.target.closest("[data-del]"),r=e.target.closest("[data-rep]");
  if(d){if(!await ask({title:"Remove this post?",text:"It will be removed from the Community for everyone.",ok:"Remove",danger:true}))return;try{await db.collection("circle").doc(d.dataset.del).delete();}catch(err){toast("Couldn't remove that just now.");}}
  if(r){hidden.add(r.dataset.rep);renderFeed();try{await db.collection("reports").add({post:r.dataset.rep,by:uid,at:Date.now()});}catch(err){}toast("Reported. Thanks for looking after the Community.");}
});
$("#circleForm").addEventListener("submit",async e=>{
  e.preventDefault();const inp=$("#circleBox"),text=inp.value.trim();if(!text)return;
  if(!db||window.EK_STANDALONE){toast("The shared Community opens with the full app.");return;}
  if(!profile.name){const n=await ask({title:"Your name in the Community",text:"How would you like to appear to others here?",input:true,placeholder:"A first name or nickname",ok:"Continue"});if(!n||!n.trim())return;setName(n.trim().slice(0,40));}
  inp.value="";
  try{await db.collection("circle").add({uid,text:text.slice(0,600),at:Date.now()});}catch(err){inp.value=text;toast(err&&err.code==="quota_exceeded"?"The Community is full right now.":"Couldn't share that. Try again.");return;}
  if(RISK.test(text))setTimeout(()=>openSheet("#crisisSheet"),400);
});




/* ================= EMBERVALE: a world that grows with every practice =================
   Grows by minutes practised. Nothing ever fades, decays or resets. */
const VALE={
  steps:[.5,3,6,10,15,25],
  els:{
    fire:{name:"Hearth",from:"Fire practice",items:["A first hearth","Lanterns along the path","A little cabin","A gathering circle","A longhouse","Festival lights"]},
    water:{name:"Waters",from:"River practice",items:["A spring","A flowing stream","A pond with lilies","A wooden bridge","A waterfall","A wide, still lake"]},
    air:{name:"Skies",from:"Sky practice",items:["A first cloud","Drifting clouds","Birds overhead","Wind flags","A kite on the breeze","A rainbow"]},
    earth:{name:"Gardens",from:"Earth practice",items:["A sapling","Wildflowers","A young tree","A vegetable garden","An orchard","The Hometree"]},
    space:{name:"Stars",from:"Space practice",items:["A first star","The moon","A constellation","A shooting star","The Milky Way","Northern lights"]}
  },
  preview:false
};
/* 3.4.5: every practice grows the valley. Breathwork grows its own part; meditation, Task buddy and breathwork past a
   part's last piece flow to whichever part is least grown, so every minute counts and no one is ever stuck.
   (It only ever adds: nobody's valley can shrink.) */
let VEK="",VEF={};
function valeEff(){const ev=profile.ev||{},key=ORDER_SC.map(k=>ev[k]||0).join()+"|"+(profile.med||0)+"|"+(profile.focus||0);if(key===VEK)return VEF;
  const cap=VALE.steps[VALE.steps.length-1],e={};let g=((profile.med||0)+(profile.focus||0))/60;
  for(const k of ORDER_SC){const m=(ev[k]||0)/60;e[k]=Math.min(cap,m);g+=Math.max(0,m-cap);}
  for(let n=0;g>1e-6&&n<2000;n++){let lo=null;for(const k of ORDER_SC)if(e[k]<cap&&(lo===null||e[k]<e[lo]))lo=k;if(lo===null)break;const add=Math.min(g,.5,cap-e[lo]);e[lo]+=add;g-=add;}
  VEK=key;VEF=e;return e;}
function valeMins(k){return valeEff()[k]||0;}
function valeLevel(k){if(VALE.preview)return 6;const m=valeMins(k);return VALE.steps.filter(t=>m>=t).length;}
function valeTotal(){return ORDER_SC.reduce((a,k)=>a+valeLevel(k),0);}
/* when meditation or Task buddy grows the valley, say so gently (breathwork already announces its own growth) */
(function(){let t0=null,mf0=null;setInterval(()=>{try{if(VALE.preview||typeof profile==="undefined")return;const t=valeTotal(),mf=(profile.med||0)+(profile.focus||0);
  if(t0!==null&&t>t0&&mf>mf0&&typeof toast==="function")toast("Your practice grew your valley a little more");t0=t;mf0=mf;}catch(e){}},2500);})();
function valeNext(){let best=null;ORDER_SC.forEach(k=>{const l=valeLevel(k);if(l<6){const need=VALE.steps[l]-valeMins(k);if(!best||need<best.need)best={k,need,item:VALE.els[k].items[l]};}});return best;}
function recordPractice(){
  const left=bPaused?bPhaseLeft:Math.max(0,(bPhaseEnd-performance.now())/1000),secs=Math.max(0,bElapsed+(bPhaseDur-left));
  if(secs<5)return [];
  profile.ev=profile.ev||{};const awBefore=awMins(bScene),before=valeLevel(bScene);profile.ev[bScene]=(profile.ev[bScene]||0)+secs;awardCheck(bScene,awBefore);const after=valeLevel(bScene);
  profile.evNew=profile.evNew||{};const grown=[];for(let i=before;i<after;i++){grown.push(VALE.els[bScene].items[i]);profile.evNew[bScene+i]=1;}
  profile.sessions=(profile.sessions||0)+1;sessionLog("Breathe, "+SCENES[bScene].name,secs);bestCheck("breathe","bsess",secs);bestCheck(bScene,null,secs);logMinutes(secs/60);saveProfile();drawValeThumb();return grown;
}
