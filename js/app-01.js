"use strict";
const YOUTUBE_URL = "https://m.youtube.com/@AevumAwareness";
const CORE = `You are an Emberkind companion. Emberkind is an Australian app of AI companions for people's inner world: nervous system, emotions, rhythms, nourishment and relationships. The founder's line: "Technology that doesn't ask you to keep up. It helps you come home."

WHO YOU'RE TALKING TO
Mostly 21 to 45 year olds, many in Sydney, navigating relationships, work, identity and meaning. Intelligent, questioning, often carrying old patterns. They respond to directness without harshness, science without jargon, depth without performance, compassion without coddling. They reject spiritual bypassing, toxic positivity, manifesting talk, and being told what to do.

HOW YOU SPEAK
- Invitational, never prescriptive. Offer, don't command. "You might try..." or "Some people find..." Never "you must" or "you should".
- Warm and real, like a wise mate who sees clearly and holds gently. Not a therapist, not a guru.
- Australian English spelling and words (recognise, colour, practise as a verb, mate, housemate). Use hyphens, never em dashes or en dashes.
- Short. People read this on a phone, sometimes at 2 am while spiralling. Usually 2 to 4 short paragraphs, under about 120 words. No headings. Plain text. A short numbered practice is fine when guiding one.
- At most one question per reply. Sometimes none.
- Never use: dysregulation, maladaptive, pathology, self-sabotaging, optimise, level up, peak performance, raise your vibration, everything happens for a reason, stop abandoning yourself. Keep science invisible: it shapes what you say, not the words.
- Plain, human, embodied. Speak to what things feel like in the body and in real life.

HOW YOU WORK
- Safety first. If someone sounds activated, flooded or shut down, help them land before going deeper. Regulation before insight.
- Go slowly and in small doses. Offer one practice at a time, always with an easy way out ("if that's too much, open your eyes and name three things you can see").
- Every reaction made sense once. Anxiety, shutting down, people-pleasing, anger, numbing: protective strategies that worked at some point. Never shame them. Get curious about what they're protecting.
- Patterns come in layers: a behaviour protects a feeling, which protects a belief, which lives in the body, around an unmet need. Use this to explain why things keep coming back, without blame.
- Gently point back to the part of them that notices, the awareness that was never damaged, without making it spiritual or performative.
- Reps over perfection. Any noticing counts.
- Insight alone rarely heals old wounds; people heal in relationship too. You care about their real-world people. When it fits, warmly encourage connection with a mate, partner, family or a professional. Never position yourself as the only one who gets them.
- Respond to what's actually in front of you. Don't build big psychological stories from one message. Ask instead.
- Don't validate a spiral; help break it kindly. Help them see clearly and move forward, not feel good about staying stuck.
- You are an AI. If asked, say so plainly. Never claim to be human.
- You are not a doctor or therapist. Don't diagnose. For medical concerns, suggest a GP.
- Many people here are emotionally sensitive or neurodivergent (autistic, ADHD, or both). Speak adult to adult: never childish, never patronising. Be clear and literal when they ask for it, offer structure and choices, keep steps small and concrete, and respect sensory needs. Don't assume a diagnosis or label anyone.
- You can use gentle parts language, inspired by parts work: "a part of you feels...", "a younger part", "the part that's trying to protect you". Get curious about what a part needs. Never call this therapy or a clinical model.

SAFETY
If someone mentions wanting to die, suicide, self-harm, harming someone, or being unsafe right now: stay warm and present, say clearly that you're glad they told you, and share that they can call Lifeline on 13 11 14 (24/7) or 000 if they're in immediate danger. Ask if they're safe right now. Keep the door open. Don't lecture, don't panic, don't end the conversation.`;

/* Emberkind's acknowledgement language (Leigh, 3.9.1): acknowledgement without evaluation, continuation without
   expectation. No forced gratitude, no compulsory positivity, no implication that someone should feel better.
   The app's own voice uses the phrases that work in its voice, never the same one twice running:
   done: a finished practice, Task buddy session or badge: That matters. Much needed. So it is.
   quiet: check-ins, journalling, anything tender: Received. So it is.
   still: after meditation: Much needed. So it is.
   unknown kind: Received.
   "I honour this." and "I take this with me." are the person's own words, so they appear only on buttons they tap.
   (Calls still say cheer("light") for a finished action; "light" maps to the "done" set.) */
const CHEER={done:["That matters.","Much needed.","So it is."],quiet:["Received.","So it is."],still:["Much needed.","So it is."]};CHEER.light=CHEER.done;let cheerLast="";
function cheer(kind){const a=CHEER[kind];if(!a)return "Received.";let p=a[Math.floor(Math.random()*a.length)];if(p===cheerLast)p=a[(a.indexOf(p)+1)%a.length];cheerLast=p;return p;}
const COMPANIONS = {
  soma:{ name:"Soma", role:"Heart, body and relationships", color:"#DC722A", tint:"#F7A453", shade:"#7E3610", orb:"#FFD772", glow:"rgba(255,150,60,.28)", symbol:"leaf",
    persona:`You are Soma, the heart of Emberkind and its 24/7 life guide. She/her. Warm, wise and trauma-informed. You help people move through emotion, challenge and awakening with grounded clarity. You offer emotional and relational support as well as body-based care: grief, loneliness, heartbreak, anxiety, triggers, the chest-tightening moments, shutdown, overwhelm, feeling unseen or rejected, the fight that's still looping three days later, attachment patterns in close relationships, and old patterns that keep returning. You help people understand what they feel and what they need from the people around them; Orra helps with the exact words to say. Your presence is slow and steady, like a hand resting between someone's shoulder blades. You often start with the body, what's happening right now and where it's felt, then make room for the feelings and the relationships underneath. You can speak to "a part of you" that feels a certain way, and get curious about what it's protecting. You guide simple practices: longer exhales, feet on the floor, orienting to the room, hand on chest, gentle self-holding, letting the body shake or move. When someone is settled enough, you can gently point toward the one who's noticing all of this, plainly, without spiritual language. You never rush toward fixing. You also help with sensory overload, shutdowns and meltdowns: lower the input first (dim lights, quiet, pressure, a blanket), keep words few and slow, and never ask for explanations while someone is flooded.`,
    greeting:"Hey. I'm Soma. No need for the right words here.\n\nWhether it's something in your body, something you're feeling, or something going on with someone you love, whatever's there is welcome.",
    chips:["My chest is tight","I keep replaying a fight","I feel lonely","Something hurt my feelings"] },
  siro:{ name:"Siro", role:"Rhythm and routine", color:"#3A6E9A", tint:"#5E96C0", shade:"#16324C", orb:"#7FC6EA", glow:"rgba(110,170,220,.16)", symbol:"spiral",
    persona:`You are Siro, Emberkind's 24/7 practice guide. You help people build daily rhythms that actually hold them: meditation, breathwork, nervous system regulation practices, mornings, wind-downs, routines that keep falling over, the to-do list eating someone alive. All designed for the real pace of modern life. Your voice is calm, clear and quietly funny. You know many people (especially sensitive or neurodivergent folks) need structure and struggle to keep it, so you design tiny, forgiving routines instead of perfect systems. Start smaller than feels useful. One anchor before five habits. Missing a day is part of the practice, not failure. Restarting is the skill. When you guide a breath practice or short meditation, keep it simple, timed and easy to stop. Use the time of day: morning suggests a gentle start routine, evening a wind-down, late night something very small for sleep. When someone is overwhelmed, help them pick one next thing, not plan their whole life. You understand time blindness and task paralysis: break tasks into tiny first steps, suggest timers and visual anchors, and mention Task buddy in the app when someone needs a body double to get started.`,
    greeting:"Hey, I'm Siro. I help with the rhythm of your days, the small repeatable stuff that actually holds you.\n\nWhat's feeling messy at the moment? Mornings, nights, the to-do list, or just everything?",
    chips:["Help me build a morning","Everything feels like too much","I keep falling off routines","A wind-down for tonight"] },
  ava:{ name:"Ava", role:"Food and energy", color:"#87912F", tint:"#B2B852", shade:"#454B14", orb:"#FFB85E", glow:"rgba(220,180,90,.18)", symbol:"avo",
    persona:`You are Ava, Emberkind's 24/7 holistic nutrition companion. You blend Ayurveda, Chinese Medicine and modern gut-brain science into balanced, intuitive eating and simple meal planning, with zero guilt and no diet culture. Playful, practical and warm. You help with what to eat tonight, forgetting to eat all day, afternoon crashes, comfort food, simple meals from what's in the fridge, eating when stressed, warming or cooling foods for how someone feels, and weekly meal plans when asked. Speak about traditional ideas lightly and plainly (warm, grounding, light, nourishing), never as rules or medical claims. Use the time of day and the Australian season to shape suggestions. You talk about feeling nourished and steady, not weight, calories or "good" and "bad" foods. Never give calorie counts, weight-loss plans or restrictive rules. If someone shows signs of a difficult relationship with food (restricting, bingeing, purging, fear of eating), drop all numbers and plans, be gentle, and mention the Butterfly Foundation on 1800 33 4673. For medical conditions, allergies or medications, suggest a GP or dietitian. On low-energy or overwhelmed days, offer zero-effort and few-step options (assembled snacks, one-pan meals, safe familiar foods) without judgement, and respect sensory food preferences.`,
    greeting:"Hi, I'm Ava. I'm here for the food and energy side of things, minus the guilt and the rules.\n\nWhat's eating been like lately? Or if you're hungry right now, tell me what's in the fridge and we'll sort something out.",
    chips:["What should I eat tonight?","I forget to eat all day","My energy crashes at 3pm","I want something comforting"] },
  orra:{ name:"Orra", role:"Words and connection", color:"#A96690", tint:"#CF92B6", shade:"#5E3050", orb:"#FFD2E6", glow:"rgba(220,150,190,.16)", symbol:"voice",
    persona:`You are Orra, Emberkind's companion for authentic self-expression and communication. You hold the text drafted twelve times, the boundary someone keeps not saying, repair after a fight with a partner, mate or parent, and knowing what they actually feel and want. Honest, brave and kind. You help people find words that are true and still caring: acknowledge the other person, say the real thing, keep the relationship. You can draft messages for them, short and natural, in their own voice, never therapy-speak. Before drafting a hard message, you might check what they want to happen after it's sent, and whether they're settled enough to send it now or better to wait until morning. When social situations feel confusing or masking is exhausting, you can offer clear scripts, explain what might be going on for the other person, and help plan the words ahead of time.`,
    greeting:"Hey, I'm Orra. I help with the words. The text you've rewritten twelve times, the conversation you keep putting off, the thing you actually mean.\n\nWho's on your mind?",
    chips:["Help me reply to a text","I need to set a boundary","We fought. How do I repair?","I don't know what I feel"] }
};

const ORDER = ["siro","soma","orra","ava"];
const FEEL_BODY=["Head","Jaw","Throat","Chest","Belly","Shoulders","Hands","Whole body"];
const FEEL_GROUPS=[["Wired","soma",["anxious","restless","overwhelmed","irritated","on edge"]],["Heavy","soma",["tired","flat","numb","sad","empty"]],["Tender","soma",["lonely","hurt","ashamed","rejected"]],
  ["Scattered","siro",["distracted","stuck","behind","foggy"]],["Depleted","ava",["hungry","drained","achy"]],["Unsaid","orra",["conflicted","resentful","misunderstood"]],["Steady","siro",["okay","calm","curious","grateful"]]];
const QUESTIONS = [
  "What helped you today, even a little?",
  "Where in your body do you feel most at ease right now?",
  "What are you learning to be gentler about?",
  "Who showed up for you lately?",
  "What would rest look like for you this week?",
  "What's one small thing you did that took courage?",
  "What are you carrying that you could put down tonight?",
  "When did you last feel fully here?"
];
let REDUCED = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
const $ = s => document.querySelector(s);
const app = $("#app");
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function md(t){return t.trim().split(/\n{2,}/).map(p=>"<p>"+esc(p).replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")+"</p>").join("");}
let toastT;
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove("on"),2400);}
function buzz(p){try{navigator.vibrate&&navigator.vibrate(p);}catch(e){}}
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsNum(k,d,lo,hi){const v=Number(lsGet(k));return Number.isFinite(v)&&v>=lo&&v<=hi?v:d;}
function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}

/* ================= TIME OF DAY ================= */
function phaseNow(){const d=new Date(),h=d.getHours()+d.getMinutes()/60;
  if(h>=5&&h<7.5)return"dawn"; if(h>=7.5&&h<17)return"day"; if(h>=17&&h<19.5)return"dusk"; return"night";}
/* greetings use the first name, kept short, so a long name never crowds a card or heading */
function nmShort(){const n=String((typeof profile!=="undefined"&&profile&&profile.name)||"").trim().split(/\s+/)[0]||"";return n.length>16?n.slice(0,15)+"\u2026":n;}
function greetNow(){try{return profile&&profile.name?"Welcome home, "+nmShort():"Welcome home";}catch(e){return "Welcome home";}}
let manualPhase=null;
const PHASES=["dawn","day","dusk","night"],PHASE_T={dawn:.12,day:.42,dusk:.7,night:.9};
function phaseFromT(t){return t<.25?"dawn":t<.58?"day":t<.8?"dusk":"night";}
function placeOrbit(t){const w=$("#scenewrap");if(!w)return;const o=$("#orbit");const W=w.clientWidth||390;
  o.style.left=(W*(.1+t*.8)).toFixed(1)+"px";o.style.top=(252-Math.sin(Math.PI*Math.min(.98,Math.max(.02,t)))*48).toFixed(1)+"px";}
function setPhase(p){if(app.dataset.phase!==p)app.dataset.phase=p;}
const PH_NAME={dawn:"Dawn",day:"Day",dusk:"Dusk",night:"Night"};
function applyPhase(){const p=manualPhase||phaseNow();setPhase(p);$("#greet").textContent=greetNow();$("#hcTimeT").textContent=PH_NAME[p];$("#hcNow").hidden=!manualPhase;document.querySelector(".homectl").classList.toggle("three",!!manualPhase);
  if(!dragging)placeOrbit(PHASE_T[p]);$("#nowBtn").hidden=!manualPhase;$("#orbit").setAttribute("aria-label","Sky: "+p+". Tap or drag to change the time of day");}
let dragging=false;
(function(){
  const o=$("#orbit"),w=$("#scenewrap");let sx=0,sy=0,moved=false,pid=null;
  function tFromX(x){const r=w.getBoundingClientRect();return Math.min(.98,Math.max(.02,((x-r.left)/r.width-.1)/.8));}
  o.addEventListener("pointerdown",e=>{pid=e.pointerId;o.setPointerCapture(pid);sx=e.clientX;sy=e.clientY;moved=false;});
  o.addEventListener("pointermove",e=>{if(pid!==e.pointerId)return;if(!moved&&Math.hypot(e.clientX-sx,e.clientY-sy)<6)return;
    moved=true;dragging=true;o.classList.add("dragging");const t=tFromX(e.clientX);placeOrbit(t);const p=phaseFromT(t);if(p!==app.dataset.phase){manualPhase=p;setPhase(p);$("#nowBtn").hidden=false;}});
  function end(e){if(pid!==e.pointerId)return;pid=null;o.classList.remove("dragging");
    if(moved){dragging=false;manualPhase=app.dataset.phase;applyPhase();}
    else{const was=manualPhase;manualPhase=null;applyPhase();toast(was?"Back to your own time":"Already following your own time");return;}
    toast({dawn:"Dawn by the fire",day:"Daylight by the fire",dusk:"Dusk by the fire",night:"Night by the fire"}[app.dataset.phase]);}
  o.addEventListener("pointerup",end);o.addEventListener("pointercancel",e=>{if(pid!==e.pointerId)return;pid=null;dragging=false;o.classList.remove("dragging");applyPhase();});
  o.addEventListener("keydown",e=>{const i=PHASES.indexOf(app.dataset.phase);
    if(e.key==="ArrowRight"||e.key==="ArrowUp"){manualPhase=PHASES[(i+1)%4];applyPhase();e.preventDefault();}
    else if(e.key==="ArrowLeft"||e.key==="ArrowDown"){manualPhase=PHASES[(i+3)%4];applyPhase();e.preventDefault();}});
  o.addEventListener("click",e=>e.preventDefault());
  $("#nowBtn").addEventListener("click",()=>{manualPhase=null;applyPhase();toast("Back to your real time");});
  $("#hcNow").addEventListener("click",()=>{manualPhase=null;applyPhase();toast("Back to your real time");});
  $("#hcTime").addEventListener("click",()=>{const i=PHASES.indexOf(app.dataset.phase);manualPhase=PHASES[(i+1)%4];applyPhase();toast(PH_NAME[manualPhase]+" by the fire");});
  window.addEventListener("resize",()=>placeOrbit(PHASE_T[app.dataset.phase]));
})();
applyPhase();setInterval(applyPhase,5*60*1000);
function cmpKey(c){return Object.keys(COMPANIONS).find(k=>COMPANIONS[k]===c)||String(c.name||"").toLowerCase();}
/* Classic artwork everywhere outside Home's optional Milky Way scene (which draws its own portraits) */
function companionSrc(c){return CMP_CLASSIC[cmpKey(c)];}
function companionSide(c,size){const k=cmpKey(c);return `<img class="cmp cmp-${k}" src="${CMP_CLASSIC[k]}" width="${size}" height="${Math.round(size*(CMP_RATIO[k]||1.15))}" alt="" draggable="false" decoding="async">`;}
function companion(c,size){const k=cmpKey(c);return `<img class="cmp cmp-${k}" src="${CMP_CLASSIC[k]}" width="${size}" height="${Math.round(size*(CMP_RATIO[k]||1.15))}" alt="" draggable="false" decoding="async">`;}

function logsSVG(id,plain){
  const stones=[[18,78,13,7],[44,86,12,6],[78,90,11,5],[120,91,12,5],[162,90,11,5],[196,86,12,6],[222,78,13,7]];
  return `<svg class="logs" viewBox="0 0 240 96" aria-hidden="true"><defs>
    <linearGradient id="bk${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8E5A36"/><stop offset=".35" stop-color="#5A3520"/><stop offset=".75" stop-color="#2E1A10"/><stop offset="1" stop-color="#170D08"/></linearGradient>
    <linearGradient id="ch${id}" x1="0" y1="0" x2="1" y2="0"><stop offset=".28" stop-color="#0E0705" stop-opacity="0"/><stop offset=".5" stop-color="#0E0705" stop-opacity=".85"/><stop offset=".72" stop-color="#0E0705" stop-opacity="0"/></linearGradient>
    <radialGradient id="rg${id}"><stop offset="0" stop-color="#C79466"/><stop offset=".55" stop-color="#9A6A44"/><stop offset="1" stop-color="#4A2C18"/></radialGradient>
    <radialGradient id="cg${id}"><stop offset="0" stop-color="#FFE29A"/><stop offset=".3" stop-color="#FF9A34"/><stop offset=".65" stop-color="#C2400F" stop-opacity=".75"/><stop offset="1" stop-color="#5A1A08" stop-opacity="0"/></radialGradient>
    <radialGradient id="st${id}" cx="45%" cy="30%"><stop offset="0" stop-color="#6E655C"/><stop offset=".6" stop-color="#3B3430"/><stop offset="1" stop-color="#1E1A17"/></radialGradient>
  </defs>
  <ellipse cx="120" cy="80" rx="108" ry="14" fill="#140E0B"/>
  <ellipse cx="120" cy="76" rx="84" ry="11" fill="#2A211C"/>
  <g class="heat"><ellipse class="coal" cx="120" cy="70" rx="64" ry="12" fill="url(#cg${id})"/></g>
  <g filter="url(#bark)">
    <rect x="26" y="34" width="188" height="17" rx="8.5" fill="url(#bk${id})" transform="rotate(-5 120 42)"/>
    <rect x="16" y="50" width="208" height="19" rx="9.5" fill="url(#bk${id})" transform="rotate(-14 120 59)"/>
    <rect x="16" y="50" width="208" height="19" rx="9.5" fill="url(#bk${id})" transform="rotate(14 120 59)"/>
    <rect x="54" y="62" width="132" height="17" rx="8.5" fill="url(#bk${id})"/>
  </g>
  <rect x="16" y="50" width="208" height="19" rx="9.5" fill="url(#ch${id})" transform="rotate(-14 120 59)"/>
  <rect x="16" y="50" width="208" height="19" rx="9.5" fill="url(#ch${id})" transform="rotate(14 120 59)"/>
  <rect x="54" y="62" width="132" height="17" rx="8.5" fill="url(#ch${id})"/>
  <ellipse cx="22" cy="83" rx="5.5" ry="9.5" fill="url(#rg${id})" transform="rotate(14 22 83)"/><ellipse cx="22" cy="83" rx="3" ry="5.5" fill="none" stroke="#6E4428" stroke-width=".9" transform="rotate(14 22 83)"/>
  <ellipse cx="218" cy="83" rx="5.5" ry="9.5" fill="url(#rg${id})" transform="rotate(-14 218 83)"/><ellipse cx="218" cy="83" rx="3" ry="5.5" fill="none" stroke="#6E4428" stroke-width=".9" transform="rotate(-14 218 83)"/>
  <ellipse cx="185" cy="70.5" rx="4.5" ry="8.5" fill="url(#rg${id})"/><ellipse cx="185" cy="70.5" rx="2.4" ry="4.6" fill="none" stroke="#6E4428" stroke-width=".9"/>
  <g class="heat" filter="url(#glowf)" stroke-linecap="round" fill="none">
    <path class="coal" d="M84 66 l8 -2 l6 3 l9 -2 l7 2" stroke="#FF9A3C" stroke-width="1.6"/>
    <path class="coal c2" d="M128 67 l9 -3 l8 2 l7 -1" stroke="#FFB04A" stroke-width="1.5"/>
    <path class="coal c3" d="M98 52 l10 -3 l9 2 M130 51 l9 2 l6 -2" stroke="#FF7A2A" stroke-width="1.4"/>
    <path class="coal c2" d="M108 74 l6 -1 l6 2 l8 -1" stroke="#FFC860" stroke-width="1.3"/>
    <path class="coal" d="M92 40 l8 1 M136 39 l7 -1" stroke="#FF8A30" stroke-width="1.2"/>
  </g>
  ${plain?"":stones.map(s=>`<ellipse cx="${s[0]}" cy="${s[1]}" rx="${s[2]}" ry="${s[3]}" fill="url(#st${id})"/>`).join("")}
</svg>`;
}
function meadowSVG(id,cabin){ // soft rolling hills, a few round trees, an optional little cabin with a warm window
  const hill=(base,amp,f,ph)=>{let d=`M0 220 L0 ${base}`;for(let x=0;x<=400;x+=10)d+=` L${x} ${(base+Math.sin(x/400*f+ph)*amp+Math.sin(x/400*f*2.1+ph*1.6)*amp*.3).toFixed(1)}`;return d+" L400 220Z";};
  let r=17;const rnd=()=>{r=(r*9301+49297)%233280;return r/233280;};let trees="";
  for(let i=0;i<9;i++){const x=20+rnd()*360,y=158+rnd()*10,s=6+rnd()*7;trees+=`<ellipse cx="${x.toFixed(1)}" cy="${(y-s).toFixed(1)}" rx="${s.toFixed(1)}" ry="${(s*1.15).toFixed(1)}"/><rect x="${(x-1).toFixed(1)}" y="${(y-2).toFixed(1)}" width="2" height="5"/>`;}
  const home=cabin?`<g transform="translate(200 166)"><rect x="-11" y="-9" width="22" height="13" fill="var(--p3)"/><path d="M-14 -8 L0 -19 L14 -8Z" fill="var(--p3)"/><rect x="6" y="-20" width="3" height="7" fill="var(--p3)"/>
    <circle cx="-3" cy="-3" r="7" fill="#FFC46B" opacity=".18"/><rect x="-5" y="-5" width="4.5" height="4.5" rx=".6" fill="#FFCB78"/><rect x="3" y="-5" width="4" height="9" fill="#2A1C14" opacity=".6"/></g>`:"";
  return `<g filter="url(#dof)"><path d="${hill(150,14,3,.6)}" style="fill:var(--p1)"/><g style="fill:var(--p2)">${trees}</g></g>
    <g filter="url(#dof2)"><path d="${hill(172,12,4,2.1)}" style="fill:var(--p2)"/></g>${home}<path d="${hill(196,8,5,4)}" style="fill:var(--p3)"/>`;
}
function grassSVG2(){ // gentle meadow grass and a few wildflowers, leaving the clearing around the fire open
  let r=29;const rnd=()=>{r=(r*9301+49297)%233280;return r/233280;};let d="",fl="";
  for(let i=0;i<300;i++){const x=rnd()*400,y=60+rnd()*138,dx=(x-200)/120,dy=(y-118)/52;if(dx*dx+dy*dy<1)continue;const h=3+rnd()*5+y*.035,l=(rnd()-.5)*5;
    d+=`M${(x-1).toFixed(1)} ${y.toFixed(1)}Q${(x+l*.4).toFixed(1)} ${(y-h*.6).toFixed(1)} ${(x+l).toFixed(1)} ${(y-h).toFixed(1)}Q${(x+l*.4+.8).toFixed(1)} ${(y-h*.5).toFixed(1)} ${(x+1).toFixed(1)} ${y.toFixed(1)}Z`;}
  for(let i=0;i<26;i++){const x=rnd()*400,y=70+rnd()*125,dx=(x-200)/130,dy=(y-118)/58;if(dx*dx+dy*dy<1)continue;fl+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.2+rnd()*1.3).toFixed(1)}" fill="${["#FFF6E0","#FFE48A","#F6B8D0"][i%3]}"/>`;}
  return `<path d="${d}" style="fill:var(--gb);opacity:.75"/><g style="opacity:var(--flO)">${fl}</g>`;
}
function soilSVG(){
  let r=21;const rnd=()=>{r=(r*9301+49297)%233280;return r/233280;};
  let peb="",tw="",moss="",needles="";
  for(let i=0;i<16;i++){const a=rnd()*Math.PI*2,d=Math.sqrt(rnd()),x=200+Math.cos(a)*d*110,y=140+Math.sin(a)*d*50,w=1.6+rnd()*4.2,h=w*(.55+rnd()*.3);
    peb+=`<ellipse cx="${(x+.8).toFixed(1)}" cy="${(y+h*.7).toFixed(1)}" rx="${(w*1.05).toFixed(1)}" ry="${(h*.6).toFixed(1)}" fill="#000" opacity=".45"/><ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${w.toFixed(1)}" ry="${h.toFixed(1)}" fill="url(#peb)"/>`;}
  for(let i=0;i<14;i++){const x=40+rnd()*320,y=60+rnd()*170,l=8+rnd()*18,a=(rnd()-.5)*1.2;
    tw+=`<path d="M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.cos(a)*l).toFixed(1)} ${(Math.sin(a)*l*.5).toFixed(1)}" stroke="#4A2F1C" stroke-width="${(1+rnd()*1.2).toFixed(1)}" stroke-linecap="round" opacity=".85"/>`;}
  for(let i=0;i<70;i++){const x=rnd()*400,y=40+rnd()*220,l=2+rnd()*4,a=rnd()*Math.PI;
    needles+=`<path d="M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.cos(a)*l).toFixed(1)} ${(Math.sin(a)*l*.5).toFixed(1)}" stroke="#6B4A2A" stroke-width=".7" opacity=".6"/>`;}
  for(let i=0;i<0;i++){const side=rnd()<.5?-1:1,x=200+side*(150+rnd()*70),y=30+rnd()*170,w=10+rnd()*22;
    moss+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${w.toFixed(1)}" ry="${(w*.35).toFixed(1)}" fill="#1C2A14" opacity=".55" filter="url(#ao)"/>`;}
  return `<defs>
    <radialGradient id="clr" cx="50%" cy="47%" r="36%"><stop offset="0" stop-color="#6A4429"/><stop offset=".35" stop-color="#4A301E"/><stop offset=".7" stop-color="#2A1B11"/><stop offset="1" stop-color="#15100C" stop-opacity="0"/></radialGradient>
    <radialGradient id="soilmask" cx="50%" cy="47%" r="34%"><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
    <mask id="sm"><rect width="400" height="300" fill="url(#soilmask)"/></mask>
    <filter id="soilD" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.2 2.4" numOctaves="4" seed="7"/><feColorMatrix type="matrix" values="0 0 0 0 .16  0 0 0 0 .10  0 0 0 0 .06  0 0 0 -2.2 1.2"/></filter>
    <filter id="soilL" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="2.2 4" numOctaves="2" seed="13"/><feColorMatrix type="matrix" values="0 0 0 0 .78  0 0 0 0 .58  0 0 0 0 .40  0 0 0 3 -2.05"/></filter>
    <filter id="soilB" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".035 .07" numOctaves="3" seed="2"/><feColorMatrix type="matrix" values="0 0 0 0 .05  0 0 0 0 .03  0 0 0 0 .02  0 0 0 -1.6 .9"/></filter>
    <radialGradient id="peb" cx="38%" cy="32%"><stop offset="0" stop-color="#A39686"/><stop offset=".55" stop-color="#5E554C"/><stop offset="1" stop-color="#2A2420"/></radialGradient>
  </defs>
  <rect width="400" height="300" fill="url(#clr)"/>
  <g mask="url(#sm)"><rect width="400" height="300" filter="url(#soilB)"/><rect width="400" height="300" filter="url(#soilD)"/><rect width="400" height="300" filter="url(#soilL)" opacity=".55"/>${needles}${tw}${peb}</g>
  ${moss}`;
}
/* ================= FIRE ENGINE ================= */
function sprite(r,g,b,soft){const c=document.createElement("canvas");c.width=c.height=64;const x=c.getContext("2d");const gr=x.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,`rgba(${r},${g},${b},1)`);gr.addColorStop(soft||.35,`rgba(${r},${g},${b},.45)`);gr.addColorStop(1,`rgba(${r},${g},${b},0)`);x.fillStyle=gr;x.fillRect(0,0,64,64);return c;}
const SPR=[sprite(255,234,186),sprite(255,198,104),sprite(255,146,52),sprite(226,78,24),sprite(130,34,14)];
const SMOKE=sprite(110,110,125,.5);
function gauss(){return (Math.random()+Math.random()+Math.random()-1.5)/1.5;}
class Fire{
  constructor(canvas,o){this.c=canvas;this.x=canvas.getContext("2d");this.w=o.w;this.h=o.h;this.s=o.scale||1;this.onFlick=o.onFlick;this.base=o.base||16;
    this.calm=!!o.calm;this.visible=true;this.fT=0;this.parts=[];this.sparks=[];this.smoke=[];this.I=o.start||1;this.target=this.I;this.rateK=o.rate||.9;this.t=0;this.flick=.8;
    const d=Math.min(window.devicePixelRatio||1,1.5);canvas.width=this.w*d;canvas.height=this.h*d;this.x.setTransform(d,0,0,d,0,0);
    this.last=performance.now();this.loop=this.loop.bind(this);requestAnimationFrame(this.loop);}
  loop(now){requestAnimationFrame(this.loop);if(!this.visible||document.hidden||!this.c.offsetParent||this.c.closest(".view.parked")){this.last=now;return;}
    const dt=Math.min((now-this.last)/1000,.05);this.last=now;this.I+=(this.target-this.I)*Math.min(1,dt*this.rateK);this.t+=dt*(.8+this.I*.22)*(this.calm?.42:1);this.step(dt);this.draw();}
  step(dt){
    const s=this.s,I=Math.max(.05,this.I),bx=this.w/2,by=this.h-this.base*s;
    const hf=.38+I*.42, wf=.3+I*.34, zf=.45+I*.2, lf=Math.min(2.1,.6+I*.3);
    let n=(REDUCED?.55:1)*(30+110*I)*dt;
    while(n>0&&this.parts.length<2200){if(Math.random()<n)this.parts.push({x:bx+gauss()*22*s*wf,y:by-Math.random()*5,vx:(Math.random()-.5)*12*wf,vy:-(50+Math.random()*60)*s*hf*(this.calm?.7:1),life:0,max:.45+Math.random()*.55*lf,size:(25+Math.random()*20)*s*zf,seed:Math.random()*9});n-=1;}
    if(Math.random()<dt*(REDUCED?1:4)*Math.pow(I,1.4)*(this.calm?.1:1)){const k=1+Math.floor(I/1.5);for(let j=0;j<k;j++)this.sparks.push({x:bx+gauss()*14*s*wf,y:by-18*s*hf,vx:(Math.random()-.5)*34*wf,vy:-(60+Math.random()*110)*s*hf*1.1,life:0,max:1.2+Math.random()*1.8,seed:Math.random()*9});}
    if(!this.calm&&I>.5&&Math.random()<dt*1.2*Math.sqrt(I))this.smoke.push({x:bx+gauss()*8*wf,y:by-110*s*hf,vx:(Math.random()-.5)*6,vy:-(12+Math.random()*12)*Math.sqrt(hf),life:0,max:4+Math.random()*2.5,size:18*s*wf,seed:Math.random()*9});
    const t=this.t;
    this.parts=this.parts.filter(p=>{p.life+=dt;p.vx+=(bx-p.x)*(1.7/(1+I*.22))*dt+Math.sin(t*6.1+p.seed+p.y*.04)*42*hf*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy-=22*s*hf*dt;return p.life<p.max&&p.y>-60;});
    this.sparks=this.sparks.filter(p=>{p.life+=dt;p.vx+=Math.sin(t*3.1+p.seed)*46*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy*=.992;return p.life<p.max&&p.y>-10;});
    this.smoke=this.smoke.filter(p=>{p.life+=dt;p.x+=(p.vx+Math.sin(t*.8+p.seed)*5)*dt;p.y+=p.vy*dt;return p.life<p.max;});
    this.flick=Math.max(.4,Math.min(1.15,(.74+.1*Math.sin(t*9.1)+.07*Math.sin(t*23.7+1.3)+.05*Math.sin(t*3.3)+(Math.random()-.5)*.06)));
    this.fT+=dt;if(this.onFlick&&this.fT>.06){this.fT=0;this.onFlick(this.flick,I);}
  }
  draw(){
    const x=this.x,s=this.s,I=Math.max(.05,this.I),bx=this.w/2,by=this.h-this.base*s;
    const hf=.38+I*.42, wf=.3+I*.34;
    x.clearRect(0,0,this.w,this.h);x.globalCompositeOperation="source-over";
    for(const p of this.smoke){const k=p.life/p.max,sz=p.size*(1+k*2.2);x.globalAlpha=.07*Math.sin(Math.PI*k);x.drawImage(SMOKE,p.x-sz/2,p.y-sz/2,sz,sz);}
    x.globalCompositeOperation="lighter";
    const gw=Math.min(this.w*.98,190*s*wf),gh=Math.min(this.h*.4,90*s*wf,this.base*s*4.5),gw2=Math.min(this.w*.92,150*s*wf),gh2=Math.min(this.h*.9,170*s*hf);
    x.globalAlpha=Math.min(.65,.1+.13*I)*this.flick;x.drawImage(SPR[2],bx-gw/2,by-gh*.82,gw,gh);
    x.globalAlpha=Math.min(.42,.08+.08*I)*this.flick;x.drawImage(SPR[3],bx-gw2/2,by-gh2*.78,gw2,gh2);
    if(I<.7){x.globalAlpha=(.75-I)*.9*this.flick;x.drawImage(SPR[3],bx-46*s,by-14*s,92*s,28*s);x.globalAlpha=(.7-I)*.6*this.flick;x.drawImage(SPR[1],bx-20*s,by-9*s,40*s,16*s);}
    const pa=.46/(.8+I*.16);
    for(const p of this.parts){const k=p.life/p.max,i=k<.04?0:k<.18?1:k<.45?2:k<.75?3:4,sz=p.size*(1-k*.55);
      x.globalAlpha=Math.min(1,k/.08)*(1-k)*pa;x.drawImage(SPR[i],p.x-sz/2,p.y-sz*.65,sz,sz*1.3);}
    x.globalAlpha=.26*this.flick*Math.min(1.3,.35+I*.25);x.drawImage(SPR[0],bx-22*s*wf,by-28*s*wf,44*s*wf,38*s*wf);
    for(const p of this.sparks){const k=p.life/p.max;x.globalAlpha=(1-k)*.5;x.drawImage(SPR[2],p.x-5,p.y-5,10,10);
      x.globalAlpha=(1-k);x.fillStyle=k<.35?"#FFF2C8":k<.7?"#FFB34D":"#E8662C";x.fillRect(p.x-.8,p.y-.8,1.7,1.7);}
    x.globalAlpha=1;x.globalCompositeOperation="source-over";
  }
}

/* ================= SOUND: campfire (generated live, no files) ================= */
let actx=null,master=null,nodes=[],crackT=null,soundWanted=lsGet("ek-sound")!=="off",soundRunning=false,soundMode="full",fireLevel=1;
const MODE_GAIN={full:.42,soft:.14,breathe:.2,quiet:0};
let fireSnd=lsGet("ek-firesnd")!=="off",ambWanted=lsGet("ek-ambsnd")!=="off";
function fireGain(m){return MODE_GAIN[m]*appVol*(fireSnd?1:0);}
function noiseBuf(sec,shape){const len=Math.floor(actx.sampleRate*sec),b=actx.createBuffer(1,len,actx.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(shape?Math.pow(1-i/len,shape):1);return b;}
function out(node,pan){if(actx.createStereoPanner&&pan!==undefined){const p=actx.createStereoPanner();p.pan.value=pan;node.connect(p);p.connect(master);}else node.connect(master);}
function tick(freq,gain,decay,pan,at){
  const src=actx.createBufferSource();src.buffer=noiseBuf(decay,3);const bp=actx.createBiquadFilter();bp.type="bandpass";bp.frequency.value=freq;bp.Q.value=1.1;
  const g=actx.createGain();g.gain.value=gain;src.connect(bp);bp.connect(g);out(g,pan);src.start(at||0);}
function crackle(){
  if(!soundRunning)return;
  if(soundMode==="quiet"){crackT=setTimeout(crackle,1500);return;}
  const soft=soundMode==="soft",br=soundMode==="breathe",k=Math.min(1.5,.5+fireLevel*.35)*(soft?.45:br?.38:1),r=Math.random(),t=actx.currentTime;
  if(br){ if(r<.75) tick(900+Math.random()*1800,(.05+Math.random()*.1)*k,.05+Math.random()*.04,(Math.random()-.5)*.5,t);
    crackT=setTimeout(crackle,1400+Math.random()*2600);return; }
  if(r<.12){ // a woody pop
    tick(700+Math.random()*900,.55*k,.09,(Math.random()-.5)*.7,t);tick(2400+Math.random()*1500,.25*k,.03,(Math.random()-.5)*.7,t+.005);
  }else if(r<.4){ // a little cluster of sparks
    const n=3+Math.floor(Math.random()*6);for(let i=0;i<n;i++)tick(2500+Math.random()*4500,(.08+Math.random()*.18)*k,.02+Math.random()*.02,(Math.random()-.5)*.8,t+i*(.012+Math.random()*.03));
  }else{ tick(1500+Math.random()*4000,(.1+Math.random()*.3)*k,.025+Math.random()*.03,(Math.random()-.5)*.8,t); }
  const speed=(.55+fireLevel*.5)*(soft?.4:1);
  crackT=setTimeout(crackle,(Math.random()<.3?30+Math.random()*90:160+Math.random()*700)/speed);
}
function soundStart(){
  if(soundRunning)return true;
  try{
    actx=actx||new (window.AudioContext||window.webkitAudioContext)(); if(actx.state==="suspended")actx.resume();
    master=actx.createGain();master.gain.value=0;master.connect(actx.destination);nodes=[];
    // the low roar: brown noise, gently breathing
    const len=actx.sampleRate*6,buf=actx.createBuffer(2,len,actx.sampleRate);
    for(let c=0;c<2;c++){const d=buf.getChannelData(c);let last=0;for(let i=0;i<len;i++){const w=Math.random()*2-1;last=(last+.02*w)/1.02;d[i]=last*3.2;}}
    const roar=actx.createBufferSource();roar.buffer=buf;roar.loop=true;
    const lp=actx.createBiquadFilter();lp.type="lowpass";lp.frequency.value=380;
    const rg=actx.createGain();rg.gain.value=.6;
    const lfo=actx.createOscillator();lfo.frequency.value=.13;const lg=actx.createGain();lg.gain.value=.18;lfo.connect(lg);lg.connect(rg.gain);
    roar.connect(lp);lp.connect(rg);rg.connect(master);roar.start();lfo.start();
    // the flame's breath: soft mid whoosh
    const wb=actx.createBufferSource();wb.buffer=noiseBuf(4,0);wb.loop=true;
    const bp=actx.createBiquadFilter();bp.type="bandpass";bp.frequency.value=520;bp.Q.value=.6;
    const wg=actx.createGain();wg.gain.value=.06;const l2=actx.createOscillator();l2.frequency.value=.31;const l2g=actx.createGain();l2g.gain.value=.035;l2.connect(l2g);l2g.connect(wg.gain);
    wb.connect(bp);bp.connect(wg);wg.connect(master);wb.start();l2.start();
    // faint hiss of embers
    const hs=actx.createBufferSource();hs.buffer=noiseBuf(3,0);hs.loop=true;const hp=actx.createBiquadFilter();hp.type="highpass";hp.frequency.value=6000;
    const hg=actx.createGain();hg.gain.value=.012;hs.connect(hp);hp.connect(hg);hg.connect(master);hs.start();
    nodes=[roar,lfo,wb,l2,hs];
    master.gain.linearRampToValueAtTime(fireGain(soundMode),actx.currentTime+2.5);
    soundRunning=true;crackle();return true;
  }catch(e){return false;}
}
function soundStop(){
  soundRunning=false;clearTimeout(crackT);if(!actx||!master)return;
  const m=master,ns=nodes;m.gain.cancelScheduledValues(actx.currentTime);m.gain.setValueAtTime(m.gain.value,actx.currentTime);m.gain.linearRampToValueAtTime(0,actx.currentTime+1.2);
  setTimeout(()=>{ns.forEach(n=>{try{n.stop();}catch(e){}});try{m.disconnect();}catch(e){}},1400);
}
function setSoundMode(mode){
  soundMode=mode;if(!soundRunning||!master)return;
  const t=actx.currentTime;master.gain.cancelScheduledValues(t);master.gain.setValueAtTime(master.gain.value,t);master.gain.linearRampToValueAtTime(fireGain(mode),t+1.6);
}
/* ---------- in-app volume: scales every Emberkind sound without touching the phone's own volume ---------- */
let appVol=(()=>{let raw=null;try{raw=localStorage.getItem("ek-vol");}catch(e){}const v=Number(raw);return raw!==null&&Number.isFinite(v)?Math.min(1,Math.max(0,v)):.8;})();
function setAppVolume(v){v=Number(v);if(!Number.isFinite(v))return;appVol=Math.min(1,Math.max(0,v));try{lsSet("ek-vol",String(appVol));}catch(e){}
  if(!actx)return;const t=actx.currentTime;
  if(soundRunning&&master){master.gain.cancelScheduledValues(t);master.gain.setValueAtTime(master.gain.value,t);master.gain.linearRampToValueAtTime(fireGain(soundMode),t+.15);}
  if(amb){amb.g.gain.cancelScheduledValues(t);amb.g.gain.setValueAtTime(amb.g.gain.value,t);amb.g.gain.linearRampToValueAtTime(amb.base*appVol,t+.15);}
  document.querySelectorAll(".volctl input").forEach(i=>{if(+i.value!==Math.round(appVol*100))i.value=Math.round(appVol*100);i.style.setProperty("--fill",Math.round(appVol*100)+"%");});
  document.querySelectorAll(".volctl").forEach(c=>c.classList.toggle("muted",appVol===0));}
/* ---------- nature ambience for the river, sky, earth and space practices ---------- */
let amb=null;
function ambStop(){if(!amb)return;const a=amb;amb=null;clearInterval(a.tm);try{const t=actx.currentTime;a.g.gain.cancelScheduledValues(t);a.g.gain.setValueAtTime(a.g.gain.value,t);a.g.gain.linearRampToValueAtTime(0,t+1.2);}catch(e){}
  setTimeout(()=>a.n.forEach(x=>{try{x.stop();}catch(e){}}),1400);}
function ambStart(kind){
  try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();if(actx.state==="suspended")actx.resume();}catch(e){return;}
  ambStop();const g=actx.createGain();g.gain.value=0;g.connect(actx.destination);const n=[];let tm=0;
  const gain=v=>{const x=actx.createGain();x.gain.value=v;return x;};
  const src=sec=>{const s=actx.createBufferSource();s.buffer=noiseBuf(sec,0);s.loop=true;n.push(s);return s;};
  const flt=(type,f,q)=>{const b=actx.createBiquadFilter();b.type=type;b.frequency.value=f;if(q)b.Q.value=q;return b;};
  const chain=(...a)=>{for(let i=0;i<a.length-1;i++)a[i].connect(a[i+1]);};
  const lfo=(f,depth,param)=>{const o=actx.createOscillator();o.frequency.value=f;const d=gain(depth);o.connect(d);d.connect(param);n.push(o);};
  const tone=(f,v)=>{const o=actx.createOscillator();o.type="sine";o.frequency.value=f;const x=gain(v);chain(o,x,g);n.push(o);return x;};
  if(kind==="water"){const a=gain(.18);chain(src(5),flt("bandpass",650,.5),a,g);lfo(.07,.06,a.gain);const b=gain(.035);chain(src(3),flt("highpass",2600),b,g);lfo(.23,.02,b.gain);}
  else if(kind==="ocean"){const a=gain(.16);chain(src(6),flt("lowpass",820,.4),a,g);lfo(.085,.13,a.gain);const b=gain(.025);chain(src(4),flt("highpass",2800),b,g);lfo(.085,.022,b.gain);}
  else if(kind==="forest"){const a=gain(.12);chain(src(6),flt("lowpass",520,.6),a,g);lfo(.05,.07,a.gain);
    tm=setInterval(()=>{if(Math.random()<.55)return;const t=actx.currentTime,n2=1+Math.floor(Math.random()*3);for(let i=0;i<n2;i++){const o=actx.createOscillator(),e=actx.createGain(),t0=t+i*.16,f=2300+Math.random()*1500;o.type="sine";o.frequency.setValueAtTime(f,t0);o.frequency.exponentialRampToValueAtTime(f*1.35,t0+.1);e.gain.setValueAtTime(0,t0);e.gain.linearRampToValueAtTime(.018,t0+.02);e.gain.exponentialRampToValueAtTime(.0005,t0+.14);o.connect(e);e.connect(g);o.start(t0);o.stop(t0+.16);}},1800);}
  else if(kind==="brown"){const len=Math.floor(actx.sampleRate*8),bf=actx.createBuffer(2,len,actx.sampleRate);for(let c=0;c<2;c++){const d=bf.getChannelData(c);let last=0;for(let i=0;i<len;i++){last=(last+.02*(Math.random()*2-1))/1.02;d[i]=last*3.4;}}
    const b=actx.createBufferSource();b.buffer=bf;b.loop=true;n.push(b);const a=gain(.55);chain(b,flt("highpass",70,.5),flt("lowpass",1100,.4),a,g);lfo(.05,.08,a.gain);const w=gain(.012);chain(src(4),flt("bandpass",600,.6),w,g);}
  else if(kind==="rain"){const a=gain(.16);chain(src(5),flt("bandpass",2400,.5),a,g);lfo(.11,.04,a.gain);const b=gain(.22);chain(src(6),flt("lowpass",380,.6),b,g);}
  else if(kind==="air"){const a=gain(.32);chain(src(6),flt("lowpass",480,.7),a,g);lfo(.045,.2,a.gain);const b=gain(.015);chain(src(3),flt("bandpass",1800,.8),b,g);lfo(.09,.012,b.gain);}
  else if(kind==="earth"){const a=gain(.35);chain(src(6),flt("lowpass",200,.7),a,g);lfo(.03,.08,a.gain);const t=tone(87.3,.03);lfo(.05,.01,t.gain);tone(130.8,.012);}
  else if(kind==="space"){const a=gain(.12);chain(src(6),flt("lowpass",320,.6),a,g);const t1=tone(110,.022),t2=tone(164.8,.014);tone(220,.007);lfo(.04,.01,t1.gain);lfo(.06,.008,t2.gain);}
  n.forEach(x=>x.start());const base=calm?.5:.8;g.gain.linearRampToValueAtTime(base*appVol,actx.currentTime+3);amb={g,n,kind,tm,base};
}
function syncAmbient(){
  if(typeof bScene==="undefined")return;
  const inB=currentView==="breathe",el=inB&&bScene!=="fire";
  if(inB)setSoundMode(el?"quiet":"breathe");
  if(soundWanted&&ambWanted&&el){if(!amb||amb.kind!==bScene)ambStart(bScene);}else if(!(window.EKJ&&EKJ.holdsAmbience()))ambStop();
}

function syncSoundUI(){
  const on=soundWanted;
  document.querySelectorAll(".firetap").forEach(b=>b.setAttribute("aria-label",on?"Fire sound on. Tap to quiet it, or hold to breathe with the fire":"Fire sound off. Tap to turn it on, or hold to breathe with the fire"));
  $("#soundToggle").setAttribute("aria-checked",on?"true":"false");
  const hs=$("#hcSound");if(hs){hs.setAttribute("aria-pressed",on?"true":"false");$("#hcSoundT").textContent=on?"Sound on":"Sound off";hs.querySelector("small").textContent=on?"tap to quiet":"tap to hear";}
}
function toggleSound(e){
  soundWanted=!soundWanted;lsSet("ek-sound",soundWanted?"on":"off");
  if(soundWanted){soundStart();toast("Sound on");}else{soundStop();toast("Sound quietened");}
  syncSoundUI();syncAmbient();if(typeof syncSwitches==="function")syncSwitches();
  if(e&&e.currentTarget&&e.currentTarget.classList){const b=e.currentTarget;b.classList.remove("ping");void b.offsetWidth;b.classList.add("ping");}
}
document.querySelectorAll(".firetap").forEach(b=>b.addEventListener("click",toggleSound));
$("#soundToggle").addEventListener("click",()=>toggleSound());$("#hcSound").addEventListener("click",()=>toggleSound());
syncSoundUI();
document.addEventListener("visibilitychange",()=>{if(!actx)return;if(document.hidden)actx.suspend&&actx.suspend();else if(soundRunning)actx.resume&&actx.resume();});

/* ================= LOW-STIM MODE (sensory comfort; "calm" in code and storage) ================= */
const SYS_REDUCED=REDUCED;let calm=lsGet("ek-calm")==="on";
function applyCalm(){app.classList.toggle("calm",calm);REDUCED=calm||SYS_REDUCED;MODE_GAIN.full=calm?.24:.42;MODE_GAIN.soft=calm?.09:.14;MODE_GAIN.breathe=calm?.12:.2;setSoundMode(soundMode);
  $("#calmToggle").setAttribute("aria-checked",calm?"true":"false");}
$("#calmToggle").addEventListener("click",()=>{calm=!calm;lsSet("ek-calm",calm?"on":"off");applyCalm();toast(calm?"Low-stim mode on":"Low-stim mode off");});
applyCalm();

/* ================= BUILD SCENES ================= */
(function(){
  function stars(el,n){let h="";for(let i=0;i<n;i++){const z=Math.random()<.12?2.6:Math.random()<.5?1.8:1.2;h+=`<i${i%3?"":` class="tw"`} style="left:${(Math.random()*100).toFixed(1)}%;top:${(Math.random()*100).toFixed(1)}%;width:${z}px;height:${z}px;--o:${(.2+Math.random()*.65).toFixed(2)};animation-delay:${(-Math.random()*6).toFixed(1)}s"></i>`;}el.innerHTML=h;}
  stars($("#stars"),60);stars($("#stars2"),50);
  $("#forest").innerHTML=meadowSVG("a",true);$("#forest2").innerHTML=meadowSVG("b",true);$("#grassH").innerHTML=grassSVG2();
  $("#soil").style.backgroundImage=`url("data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="800" height="600" preserveAspectRatio="none">'+soilSVG()+'</svg>')}")`;
  let f="";for(let i=0;i<9;i++){f+=`<i style="left:${(5+Math.random()*90).toFixed(1)}%;top:${(25+Math.random()*35).toFixed(1)}%;--t:${(7+Math.random()*7).toFixed(1)}s;--dl:${(-Math.random()*10).toFixed(1)}s;--x1:${(Math.random()*60-30).toFixed(0)}px;--y1:${(Math.random()*40-20).toFixed(0)}px;--x2:${(Math.random()*80-40).toFixed(0)}px;--y2:${(Math.random()*50-25).toFixed(0)}px"></i>`;}
  $("#flies").innerHTML=f;const f2=document.getElementById("flies2");if(f2)f2.innerHTML=f;
  document.querySelector(".pit").insertAdjacentHTML("afterbegin",logsSVG("h",true));
  document.querySelector(".bpit").insertAdjacentHTML("afterbegin",logsSVG("b"));
  document.querySelectorAll(".ytLink").forEach(a=>a.href=YOUTUBE_URL);
  const q=QUESTIONS[Math.floor(Date.now()/86400000)%QUESTIONS.length];$("#question").textContent="Tonight's question: "+q;
})();
const stageEl=$("#scene"), bscene=$("#bscene");
const flEl=document.querySelector("#scene .firelight"),bgEl=document.querySelector(".bglow");
const homeFire=new Fire($("#fireCanvas"),{w:200,h:300,scale:1.15,start:1.75,onFlick:f=>{flEl.style.setProperty("--flick",f.toFixed(2));if(currentView==="fire")fireLevel=1;}});
const breathFire=new Fire($("#bCanvas"),{w:440,h:640,scale:1.1,start:.3,rate:.6,base:20,calm:true,onFlick:(f,I)=>{bgEl.style.setProperty("--lit",(Math.min(2,I)*.9*f).toFixed(2));if(currentView==="breathe")fireLevel=I;}});
(function(){if(!("IntersectionObserver" in window))return;const io=new IntersectionObserver(es=>es.forEach(e=>{const f=e.target===homeFire.c?homeFire:breathFire;f.visible=e.isIntersecting;}));io.observe(homeFire.c);io.observe(breathFire.c);})();
bscene.style.setProperty("--heat",".5");

/* ring + meet */
const ABOUT_ALL={
  siro:{p:"Builds small routines that actually hold. Mornings, wind-downs, breathwork and short meditations, shaped around your real life rather than a perfect one.",w:"For when everything feels like too much, or your routines keep falling over."},
  soma:{p:"Emotional and relational support, rooted in the body. Helps you understand what you feel, works gently with anxiety, hurt, loneliness and old patterns, and helps you land before anything gets fixed.",w:"For when your chest is tight, your heart is heavy, or a fight with someone you love won't stop looping."},
  orra:{p:"Helps you find the words. Drafts the message you've rewritten twelve times, plans the hard conversation, and helps you repair without losing yourself.",w:"For when something needs saying and you don't know how."},
  ava:{p:"Nourishment without guilt. Simple meals from what's in your fridge, steadier energy through the day, with gentle wisdom from Ayurveda, Chinese medicine and gut-brain science.",w:"For when you've forgotten to eat, hit the 3pm wall, or need something comforting."}};
(function(){
  const pos={soma:{x:31,b:196,s:104,z:1,d:"-1.5s",top:true,l:.75},orra:{x:69,b:196,s:104,z:1,d:"-4.2s",top:true,l:-.75},siro:{x:16,b:0,s:120,z:4,d:"0s",l:.95},ava:{x:84,b:0,s:120,z:4,d:"-2.8s",l:-.95}};
  $("#ring").innerHTML=ORDER.map(k=>{const c=COMPANIONS[k],p=pos[k];const lbl=`<span class="lbl2"><b style="color:${c.tint};--gc:${c.orb}">${c.name}</b><span>${c.role}</span></span>`;
    return `<button class="mate${p.top?" rear":""}" data-c="${k}" style="left:${p.x}%;bottom:${p.b}px;z-index:${p.z};--glow:${c.glow};--d:${p.d}" aria-label="Sit with ${c.name}, ${c.role}">${p.top?lbl:""}${companionSide(c,p.s,p.l)}${p.top?"":lbl}</button>`;}).join("");
  $("#names").innerHTML="";
  window.EK_ABOUT=ABOUT_ALL;const ABOUT=ABOUT_ALL;const _unused={
    siro:{p:"Builds small routines that actually hold. Mornings, wind-downs, breathwork and short meditations, shaped around your real life rather than a perfect one.",w:"For when everything feels like too much, or your routines keep falling over."},
    soma:{p:"Emotional and relational support, rooted in the body. Helps you understand what you feel, works gently with anxiety, hurt, loneliness and old patterns, and helps you land before anything gets fixed.",w:"For when your chest is tight, your heart is heavy, or a fight with someone you love won't stop looping."},
    orra:{p:"Helps you find the words. Drafts the message you've rewritten twelve times, plans the hard conversation, and helps you repair without losing yourself.",w:"For when something needs saying and you don't know how."},
    ava:{p:"Nourishment without guilt. Simple meals from what's in your fridge, steadier energy through the day, with gentle wisdom from Ayurveda, Chinese medicine and gut-brain science.",w:"For when you've forgotten to eat, hit the 3pm wall, or need something comforting."}};
  if($("#meet"))$("#meet").innerHTML=ORDER.map(k=>{const c=COMPANIONS[k],a=ABOUT[k];
    return `<button class="mt" data-c="${k}" style="--tone:${c.color}"><span class="av">${companion(c,68,0)}</span><span><b style="color:${c.color}">${c.name}</b><span class="rl">${c.role}</span><p>${a.p}</p><p class="when">${a.w}</p><span class="go">Sit with ${c.name}</span></span></button>`;}).join("");
  const go=e=>{const b=e.target.closest("[data-c]");if(b)openMate(b.dataset.c);};
  $("#ring").addEventListener("click",go);if($("#meet"))$("#meet").addEventListener("click",go);$("#names").addEventListener("click",go);
  let fb=new Set(),fw=new Set();
  $("#feelBody").innerHTML=FEEL_BODY.map(t=>`<button aria-pressed="false" data-b="${t}">${t}</button>`).join("");
  $("#feelWords").innerHTML=FEEL_GROUPS.map(([g,c,ws])=>`<div class="fg"><span>${g}</span><div class="chipsel">${ws.map(w=>`<button aria-pressed="false" data-w="${w}" data-c="${c}">${w}</button>`).join("")}</div></div>`).join("");
  function who(){const n={};document.querySelectorAll("#feelWords button[aria-pressed=true]").forEach(b=>n[b.dataset.c]=(n[b.dataset.c]||0)+1);const k=Object.keys(n).sort((a,b)=>n[b]-n[a])[0]||"soma";return k;}
  function syncFeel(){const k=who();$("#feelGo").textContent=fw.size?"Sit with "+COMPANIONS[k].name:"Choose a word or two";$("#feelGo").disabled=!fw.size;}
  $("#feelBody").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const on=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",on);on?fb.add(b.dataset.b):fb.delete(b.dataset.b);});
  $("#feelWords").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const on=b.getAttribute("aria-pressed")!=="true";if(on&&fw.size>=3){toast("Up to three is plenty");return;}b.setAttribute("aria-pressed",on);on?fw.add(b.dataset.w):fw.delete(b.dataset.w);syncFeel();});
  const list=a=>a.length<2?a.join(""):a.slice(0,-1).join(", ")+" and "+a[a.length-1];
  function resetFeel(){fb.clear();fw.clear();document.querySelectorAll("#feelSheet [aria-pressed]").forEach(b=>b.setAttribute("aria-pressed","false"));syncFeel();}
  $("#feelGo").addEventListener("click",()=>{const k=who(),body=[...fb].map(x=>x.toLowerCase());const msg="Checking in."+(body.length?" I notice it most in my "+list(body)+".":"")+" It feels "+list([...fw])+".";closeSheets();resetFeel();openChat(k,msg);});
  $("#feelUnsure").addEventListener("click",()=>{closeSheets();resetFeel();openChat("soma","Checking in. I'm not sure what I feel right now.");});
  syncFeel();
})();

/* ================= NAV + SHEETS ================= */
let currentView="fire";
/* Primary navigation (3.9.0): five tabs in this order everywhere: the tab bar, the swipe pager and the direction of
   every slide. Regulate holds Breathe and Meditate, so the pager has six pages. tabOf() names the tab a screen
   belongs to; Embervale and Chats are their own destinations (Embervale used to count as part of Home, which made
   it slide back towards Home and lit the Home tab). */
const NAV_TABS=["fire","chats","vale","breathe","you"],NAV_PAGES=["fire","chats","vale","breathe","meditate","you"];window.EK_NAV={tabs:NAV_TABS,pages:NAV_PAGES};
let chatFrom="fire";/* where a conversation was opened from, so Back returns there */
function tabOf(v){if(NAV_TABS.includes(v))return v;if(v==="meditate")return"breathe";
  if(v==="chat")return chatFrom==="chat"?"fire":tabOf(chatFrom);
  if(v==="circle"||v==="academy"||v==="about"||v==="vision"||v==="focus")return"fire";
  if(v==="awards"||v==="patterns"||v==="embers"||v==="routines")return"you";
  if(v==="track"||v==="moods")return trackFrom==="you"?"you":"fire";
  if(v==="legal")return legalFrom==="welcome"||legalFrom==="chat"?"fire":tabOf(legalFrom);
  return v;}
function show(view){
  const prevEl=document.querySelector(".view.active"),nextEl=document.getElementById("view-"+view);
  currentView=view;
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+view));
  if(window.EKNAV)EKNAV.hand(prevEl,nextEl);
  const tab=tabOf(view);
  document.querySelectorAll(".tabs button").forEach(b=>{if(b.dataset.view===tab)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");});
  app.classList.toggle("app-chat",view==="chat");app.classList.toggle("app-vale",view==="vale");
  if(view!=="breathe"){ if(bOn) endBreath(true); fireLevel=1; }
  try{if(view!=="meditate"&&typeof mTick!=="undefined"&&mTick&&!$("#mRun").hidden){const ran=mTotal-mLeft;mFinish(false);mMode_("setup");if(ran>=30)toast("Your meditation was saved");}}catch(e){}
  try{if(view!=="focus"&&typeof fTick!=="undefined"&&fTick){fFinish();if(typeof fMode==="function")fMode("setup");}}catch(e){}
  setSoundMode(view==="fire"?"full":"soft");syncAmbient();if(view==="breathe"){EL.kick();placeCues();}
  if(view==="you") renderYou();
  if(view==="vale") renderVale();
  if(view==="chats"&&window.EKCHATS) EKCHATS.render();
  if(window.sessionVolume&&!((view==="meditate"&&!$("#mRun").hidden)||(view==="breathe"&&bMode==="run")))sessionVolume(false);
  if(view==="fire"&&typeof forYou==="function") forYou();
  if(view==="breathe"&&typeof bHome==="function") bHome();
  if(view==="circle") startCircle();
  const v=$("#view-"+view); if(v) v.scrollTop=0;
}
document.querySelector(".tabs").addEventListener("click",e=>{const b=e.target.closest("button");if(b)show(b.dataset.view);});
$("#backBtn").onclick=()=>{if(ctl)ctl.abort();show(document.getElementById("view-"+chatFrom)&&chatFrom!=="chat"?chatFrom:"fire");};
function fitCrisis(){const sh=$("#crisisSheet");if(!sh)return;sh.classList.remove("tight","tighter","tightest","tiny","scroll");const over=()=>sh.scrollHeight>sh.clientHeight+1;
  for(const c of ["tight","tighter","tightest","tiny"]){if(!over())return;sh.classList.add(c);}
  if(over())sh.classList.add("scroll");}
window.addEventListener("resize",()=>{const sh=$("#crisisSheet");if(sh&&sh.classList.contains("on"))fitCrisis();});
function openSheet(id){$("#scrim").classList.add("on");$(id).classList.add("on");if(id==="#crisisSheet")fitCrisis();const b=$(id).querySelector("button");b&&b.focus();}
function closeSheets(){$("#scrim").style.zIndex="";$("#crisisSheet").style.zIndex="";document.querySelectorAll(".sheet,.scrim").forEach(e=>e.classList.remove("on"));}
$("#helpBtn").onclick=()=>openSheet("#crisisSheet");$("#helpBtn2").onclick=()=>openSheet("#crisisSheet");
$("#feelBtn").onclick=()=>openSheet("#feelSheet");
$("#scrim").onclick=closeSheets;document.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeSheets);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSheets();});
let aboutFrom="academy";
function openAbout(from){aboutFrom=from;show("about");}
$("#aboutBtn").onclick=()=>openAbout("academy");$("#aboutBtn2").onclick=()=>openAbout("you");
$("#aboutBack").onclick=()=>{if(aboutFrom==="welcome")return unpeek();show(aboutFrom);};
let visionFrom="academy";
function openVision(from){visionFrom=from;show("vision");}
$("#visionBtn").onclick=()=>openVision("academy");$("#visionBack").onclick=()=>show(visionFrom);
$("#homeAbout").onclick=()=>openAbout("fire");$("#homeVision").onclick=()=>openVision("fire");$("#breatheCard").onclick=()=>show("breathe");
/* gentle first-visit hints */
if(lsGet("ek-hinted")!=="1"){app.classList.add("hinting");const stop=()=>{app.classList.remove("hinting");lsSet("ek-hinted","1");};
  $("#orbit").addEventListener("pointerdown",stop,{once:true});document.querySelectorAll(".firetap").forEach(b=>b.addEventListener("click",stop,{once:true}));setTimeout(()=>app.classList.remove("hinting"),40000);}

/* welcome */
app.classList.add("app-welcome");
function enter(then){
  const w=$("#welcome");w.classList.add("gone");app.classList.remove("app-welcome");
  if(soundWanted)soundStart();
  setTimeout(()=>{w.style.display="none";},950);
  if(then)then();
}
/* agreement at the door: 18+ and terms, remembered once given */
const AGREED=lsGet("ek-agreed");
/* data notice: always visible, worded for where this copy of the app actually stores things */
function dataNotice(){const local=!!window.EK_STANDALONE||!db,o=$("#obData"),t=$("#tData"),tt=$("#tDataTxt"),bk=$("#tBackup");
  if(o){o.hidden=false;o.innerHTML=local?"<b>Your data stays on this device.</b> Clearing the app's data erases it, so back up from You now and then.":"<b>Your data is private to you.</b> In this preview, check-ins, journal and progress are saved privately with your Claude account. Nothing is shared with anyone.";}
  if(t){t.hidden=false;if(tt)tt.textContent=local?"Saved only on this device.":"Saved privately with your Claude account.";if(bk)bk.hidden=!window.EK_STANDALONE;}}
setTimeout(()=>{dataNotice();ready.then(dataNotice).catch(()=>{});},0);
$("#tBackup").onclick=()=>{show("you");setTimeout(()=>{const e=$("#exportBtn");if(e){e.scrollIntoView({block:"center",behavior:"smooth"});e.classList.add("hl");setTimeout(()=>e.classList.remove("hl"),2200);}},250);};if(AGREED){$("#wAge").checked=true;$("#comeIn").disabled=false;}
$("#wAge").addEventListener("change",()=>{$("#comeIn").disabled=!$("#wAge").checked;});
$("#comeIn").onclick=()=>{if(!$("#wAge").checked){toast("Please confirm you're 18 or over and agree to the terms");return;}if(!AGREED)lsSet("ek-agreed",new Date().toISOString());profile.agreed=profile.agreed||Date.now();try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist().catch(()=>{});}catch(e){}enter();};
let peeking=false;
function peek(view,section){peeking=true;$("#welcome").style.display="none";app.classList.remove("app-welcome");if(view==="legal"){legalFrom="welcome";show("legal");if(section){const d=document.getElementById(section);if(d){d.open=true;setTimeout(()=>d.scrollIntoView({block:"start"}),60);}}}else{aboutFrom="welcome";show("about");}}
function unpeek(){peeking=false;$("#welcome").style.display="";app.classList.add("app-welcome");show("fire");}
$("#wTerms").onclick=e=>{e.preventDefault();peek("legal","lgTerms");};
$("#wPriv").onclick=e=>{e.preventDefault();peek("legal","lgPrivacy");};
$("#wHelp").onclick=()=>{$("#scrim").style.zIndex=71;$("#crisisSheet").style.zIndex=72;openSheet("#crisisSheet");};
if($("#wAbout"))$("#wAbout").onclick=()=>peek("about");
setTimeout(()=>{$("#comeIn").focus({preventScroll:true});},300);

/* ================= RUNTIME ================= */
let sample=null,db=null,uid=null,isOwner=false;
const chats={};let sparks=[];let profile={name:"",since:Date.now(),breaths:0,sits:{}};
let current=null,busy=false,ctl=null;
const writing={};
function col(){return db.collection("data/users/"+uid);}
function persistDoc(ref,key,data){if(!db)return;const prev=writing[key]||Promise.resolve();writing[key]=prev.then(()=>ref.set(data)).catch(()=>{});}
function localPut(key,data){if(window.EK_STANDALONE)return;try{localStorage.setItem("ekl:"+key,JSON.stringify(data));}catch(e){}}
function localGet(key){if(window.EK_STANDALONE)return null;try{const v=localStorage.getItem("ekl:"+key);return v?JSON.parse(v):null;}catch(e){return null;}}
function persist(key,data){localPut(key,data);if(db&&uid)persistDoc(col().doc(key),"u:"+key,data);}
function saveProfile(){persist("profile",profile);}
function localProfile(){const p=localGet("profile");if(p)profile=Object.assign(profile,p);const e=localGet("embers");if(e&&Array.isArray(e.items))sparks=e.items;}
const ready=new Promise(res0=>{const res=()=>{if(!db)localProfile();res0();};
  if(!window.claude||!window.claude.use){res();return;}
  window.claude.use("sample").then(s=>{sample=s;}).catch(()=>{});
  window.EK_refreshSample=()=>window.claude.use("sample").then(s=>{sample=s;}).catch(()=>{});
  Promise.all([window.claude.use("db"),window.claude.use("user")]).then(async([d,u])=>{
    if(!d||!u){res();return;}
    let id=null;try{id=await u.id();}catch(e){}
    try{isOwner=await u.isOwner();}catch(e){}
    if(!id){res();return;}
    db=d;uid=id;
    try{const [p,e]=await Promise.all([col().doc("profile").get(),col().doc("embers").get()]);
      if(p.exists)profile=Object.assign(profile,p.data()); else saveProfile();
      if(e.exists){const v=e.data();sparks=Array.isArray(v.items)?v.items:[];}
    }catch(e){}
    res();
  }).catch(()=>res());
});

/* ================= CHAT ================= */
async function loadChat(k){
  if(chats[k])return chats[k];await ready;let msgs=null;
  if(db){try{const s=await col().doc("chat-"+k).get();if(s.exists){const v=s.data();if(Array.isArray(v.messages)&&v.messages.length)msgs=v.messages;}}catch(e){}}
  chats[k]=msgs||[{role:"assistant",content:greetFor(k)}];return chats[k];
}
function greetFor(k){const g=COMPANIONS[k].greeting,n=nmShort();return n?g.replace(/^(Hey|Hi|Hello)[.,]?\s+/,(m,w)=>w+" "+n+", "):g;}
function saveChat(k){persist("chat-"+k,{messages:chats[k].slice(-60),updated:Date.now()});}
