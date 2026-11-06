"use strict";
/* ================= THE JOURNAL WRITING PAGE (3.4.0) =================
   Calm and modern: a soft deep panel, the date, prompts as one swipeable row, a borderless page that grows as you
   write, a word count and a draft that's kept as you go. Focus mode gives you the whole screen (back to leave).
   "How does this feel?" adds an optional feeling to the entry. Soma, only when you tap: "Prompt me" (a prompt shaped
   by your recent check-ins) and "Reflect with Soma" (what you seem to feel and need, one gentle question to write
   into, and feeling words you can tag). Entries keep their paper cards; only the writing page changed. */
(function(){const $=s=>document.querySelector(s),F=()=>window.EKFACE;
const FEEL=[["Heavy","awful"],["Low","low"],["Mixed","average"],["Okay","steady"],["Good","glowing"],["Light","radiant"]];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ai=()=>{try{return (typeof sample!=="undefined"&&sample&&typeof sample.json==="function")?sample:null;}catch(e){return null;}};
let tags=new Set(),pending=null;
function init(){const t=$("#tJText"),card=t&&t.closest(".tcard"),save=$("#tJSave");if(!card||card.dataset.ekj)return;card.dataset.ekj="1";card.classList.remove("ekpaper");card.classList.add("ekjc");
  card.querySelectorAll(".jpencil").forEach(e=>e.remove());const tq=card.querySelector(".tq");
  /* header: title, date, focus */
  const hd=document.createElement("div");hd.className="ekjhd";hd.innerHTML=`<div><small class="ekjdate"></small></div><button type="button" class="ekjfocus" aria-label="Focus mode" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>`;
  if(tq){tq.parentNode.insertBefore(hd,tq);hd.firstChild.insertBefore(tq,hd.firstChild.firstChild);}else card.prepend(hd);
  const setDate=()=>{hd.querySelector(".ekjdate").textContent=new Date().toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"});};setDate();
  /* Soma's prompt pill leads the prompt row */
  const pr=$("#tPrompts");if(pr&&ai()){const b=document.createElement("button");b.type="button";b.className="ekjai1";b.innerHTML="&#10022; Prompt me";pr.prepend(b);b.addEventListener("click",e=>{e.stopPropagation();promptMe(b);});}
  /* footer: feeling, count and draft, Soma, keep */
  const ft=document.createElement("div");ft.className="ekjft";ft.innerHTML=`<p class="ekjl">How does this feel? <span>(optional)</span></p><div class="ekjfeel" role="group" aria-label="How does this feel">${FEEL.map(([n,k])=>`<button type="button" data-f="${n}" aria-pressed="false" aria-label="${n}">${F()?F().svg(k,30):""}<span>${n}</span></button>`).join("")}</div>
    <div class="ekjmeta"><span class="ekjwc">0 words</span><span class="ekjdr" aria-live="polite"></span></div>${ai()?'<button type="button" class="ekjref" disabled>Reflect with Soma</button>':""}`;
  t.after(ft);if(save)ft.after(save);const out=document.createElement("div");out.className="ekjout";out.setAttribute("aria-live","polite");(save||ft).after(out);
  const note=document.createElement("p");note.className="ekjpriv";note.textContent=ai()?"Private to this device. Nothing is sent to Soma unless you tap a Soma button, and AI can be wrong.":"Private to this device.";out.after(note);
  /* page that grows; word count; a draft kept as you go */
  const grow=()=>{t.style.height="auto";t.style.height=Math.max(card.classList.contains("jfocus")?window.innerHeight*.5:168,t.scrollHeight+2)+"px";};
  const count=()=>{const n=(t.value.trim().match(/\S+/g)||[]).length;ft.querySelector(".ekjwc").textContent=n+(n===1?" word":" words");const r=ft.querySelector(".ekjref");if(r)r.disabled=t.value.trim().length<20;};
  let dt=0;const keep=()=>{clearTimeout(dt);dt=setTimeout(()=>{try{if(t.value.trim())localStorage.setItem("ek-jdraft",JSON.stringify({t:t.value,at:Date.now(),f:[...tags]}));else localStorage.removeItem("ek-jdraft");ft.querySelector(".ekjdr").textContent=t.value.trim()?"Draft kept":"";}catch(e){}},500);};
  try{const d=JSON.parse(localStorage.getItem("ek-jdraft")||"null");if(d&&d.t&&!t.value){t.value=d.t;(d.f||[]).forEach(f=>tags.add(f));ft.querySelector(".ekjdr").textContent="Draft restored";}}catch(e){}
  t.addEventListener("input",()=>{grow();count();keep();});t.setAttribute("placeholder","Whatever's here. There's no wrong way to start.");
  const syncFeel=()=>ft.querySelectorAll(".ekjfeel button").forEach(b=>b.setAttribute("aria-pressed",tags.has(b.dataset.f)));
  ft.querySelector(".ekjfeel").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const f=b.dataset.f;FEEL.forEach(([n])=>{if(n!==f)tags.delete(n);});tags.has(f)?tags.delete(f):tags.add(f);syncFeel();keep();});
  syncFeel();count();setTimeout(grow,0);
  /* focus mode */
  const fb=hd.querySelector(".ekjfocus");fb.addEventListener("click",()=>{const on=!card.classList.contains("jfocus");card.classList.toggle("jfocus",on);document.body.classList.toggle("ekj-focus",on);fb.setAttribute("aria-pressed",on);fb.setAttribute("aria-label",on?"Leave focus mode":"Focus mode");grow();if(on)t.focus();});
  /* Soma: reflect */
  const rb=ft.querySelector(".ekjref");if(rb)rb.addEventListener("click",()=>reflect(t,out,rb));
  /* keeping an entry: its feeling and any words you tagged go with it; the draft is cleared */
  if(save){save.addEventListener("click",()=>{pending={note:t.value.trim(),tags:[...tags]};},true);
    save.addEventListener("click",()=>{const p=pending;pending=null;if(!p||!p.note)return;setTimeout(()=>{try{const last=moods[moods.length-1];if(last&&last.note===p.note.slice(0,4000)){last.tags=[...new Set([...(last.tags||[]),...p.tags])];if(typeof saveMoods==="function")saveMoods();if(typeof renderJournal==="function")renderJournal();}}catch(e){}
      tags.clear();syncFeel();out.innerHTML="";try{localStorage.removeItem("ek-jdraft");}catch(e){}ft.querySelector(".ekjdr").textContent="";count();grow();if(card.classList.contains("jfocus"))fb.click();},0);});}
  /* the date stays current if the page is left open overnight */
  setInterval(setDate,60000);
  window.EKJOURNAL={tags:()=>[...tags],leaveFocus:()=>{if(card.classList.contains("jfocus"))fb.click();}};}
function recent(){try{return moods.slice(-12).map(x=>`${new Date(x.at).toLocaleDateString("en-AU",{weekday:"short"})}: ${x.mood?"mood "+x.mood+"/6":"journal"}${x.tags&&x.tags.length?", "+x.tags.join(", "):""}`).join("\n");}catch(e){return "";}}
async function promptMe(b){const s=ai();if(!s)return;const was=b.innerHTML;b.disabled=true;b.textContent="Soma is thinking...";
  try{const o=await s.json(`You are Soma, a warm, trauma-informed companion in the Emberkind app (not a clinician). Offer one gentle, specific journalling prompt for today, shaped by these recent check-ins if they help:\n${recent()||"(none yet)"}\nReply ONLY with JSON {"prompt":"..."}. The prompt: at most 18 words, plain Australian English, open-ended, no clinical language, no assumptions about trauma.`);
    const p=(o&&o.prompt||"").trim();if(p){const t=$("#tJText");t.value=(t.value?t.value+"\n\n":"")+p+"\n";t.dispatchEvent(new Event("input",{bubbles:true}));t.focus();}}catch(e){if(typeof toast==="function")toast("Couldn't reach Soma just now. Try again soon.");}
  b.disabled=false;b.innerHTML=was;}
async function reflect(t,out,b){const s=ai(),txt=t.value.trim();if(!s||txt.length<20)return;b.disabled=true;b.textContent="Soma is reading...";
  try{const o=await s.json(`You are Soma, a warm, trauma-informed companion in the Emberkind app (not a clinician)${(typeof profile!=="undefined"&&profile.name)?". Their name is "+profile.name:""}. Read this private journal entry and reply ONLY with JSON {"reflection":"...","question":"...","words":["..."]}. reflection: 2 or 3 sentences reflecting back what they seem to feel and need, validating and specific to what they wrote; no advice lists, no diagnosis, no clinical labels. question: one gentle, open question that invites them a little deeper. words: up to 3 single feeling words that might fit. Plain Australian English. If the entry mentions wanting to die or being in danger, gently say they deserve support right now and suggest Lifeline on 13 11 14 in the reflection.\nEntry:\n"""${txt.slice(0,3000)}"""`);
    const words=(o&&Array.isArray(o.words)?o.words:[]).slice(0,3).map(w=>String(w).toLowerCase().replace(/[^a-z\- ]/g,"").trim()).filter(Boolean);
    out.innerHTML=`<div class="ekjcard"><div class="ekjwho">${typeof companion==="function"&&typeof COMPANIONS!=="undefined"?companion(COMPANIONS.soma,34,0):""}<b>Soma</b></div><p>${esc(o.reflection||"")}</p>${o.question?`<p class="ekjq">${esc(o.question)}</p><button type="button" class="ekjwrite">Write about this</button>`:""}${words.length?`<p class="ekjl">Words that might fit</p><div class="ekjwords">${words.map(w=>`<button type="button" data-w="${esc(w)}" aria-pressed="${tags.has(w)}">${esc(w)}</button>`).join("")}</div>`:""}<button type="button" class="ekjtalk">Talk it through with Soma</button></div>`;
    const wq=out.querySelector(".ekjwrite");if(wq)wq.onclick=()=>{t.value=t.value.trimEnd()+"\n\n"+o.question+"\n";t.dispatchEvent(new Event("input",{bubbles:true}));t.focus();t.setSelectionRange(t.value.length,t.value.length);};
    out.querySelectorAll(".ekjwords button").forEach(w=>w.onclick=()=>{const v=w.dataset.w;tags.has(v)?tags.delete(v):tags.add(v);w.setAttribute("aria-pressed",tags.has(v));});
    out.querySelector(".ekjtalk").onclick=()=>{if(typeof openChat==="function")openChat("soma","I just wrote in my journal and I'd like to talk it through.");};}
  catch(e){if(typeof toast==="function")toast("Couldn't reach Soma just now. Your words are safe here.");}
  b.textContent="Reflect with Soma";b.disabled=t.value.trim().length<20;}
const go=setInterval(()=>{if($("#tJText")&&$("#tPrompts")&&$("#tPrompts").children.length){clearInterval(go);init();}},300);
})();
