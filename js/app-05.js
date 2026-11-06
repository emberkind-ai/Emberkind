"use strict";
async function renderYou(){
  await ready;await loadMoods();renderYouCards();renderYouMore();renderYouExtras();requestAnimationFrame(fitTitles);renderPatterns();renderAwards();$("#nameIn").value=profile.name||"";
  $("#since").textContent="By the fire since "+new Date(profile.since||Date.now()).toLocaleDateString("en-AU",{month:"long",year:"numeric"});
  const sits=profile.sits||{},top=Object.keys(sits).sort((a,b)=>sits[b]-sits[a])[0];
  const parts=[];const b=profile.breaths||0;
  parts.push(b?`You've breathed the fire to life ${b} time${b===1?"":"s"}.`:"You haven't breathed with the fire yet.");
  if(top)parts.push(`You sit most with ${COMPANIONS[top].name}.`);
  $("#stats").textContent=parts.join(" ");renderSparks();
  
}
function renderSparks(){
  const el=$("#sparkList");
  if(!sparks.length){el.innerHTML='<p class="quiet">Nothing here yet.</p>';return;}
  el.innerHTML=sparks.map((s,i)=>{const c=COMPANIONS[s.c]||COMPANIONS.soma,d=new Date(s.at).toLocaleDateString("en-AU",{day:"numeric",month:"short"});
    return `<div class="spark"><span class="dotc" style="color:${c.color}"></span><div><q>${esc(s.text)}</q><small>${c.name}, ${d}</small></div><button class="x" data-i="${i}" aria-label="Let this one go">Let go</button></div>`;}).join("");
}
$("#sparkList").addEventListener("click",e=>{const b=e.target.closest(".x");if(!b)return;sparks.splice(+b.dataset.i,1);persist("embers",{items:sparks});renderSparks();});




/* ================= PREVIEW MODE ================= */
(function(){
  const st=$("#aiStatus");if(st)st.textContent="Not connected right now.";
})();
if("serviceWorker" in navigator&&location.protocol==="https:"){window.addEventListener("load",()=>{navigator.serviceWorker.register("sw.js").catch(()=>{});});}

$("#exportBtn").onclick=()=>{try{const out={app:"Emberkind",format:2,version:(typeof EK_RELEASE!=="undefined"?EK_RELEASE:""),exported:new Date().toISOString(),data:{}};
  Object.keys(localStorage).filter(k=>k.startsWith("ek")&&k!=="ek-last").forEach(k=>{out.data[k]=localStorage.getItem(k);});
  const name="emberkind-backup-"+new Date().toISOString().slice(0,10)+".json";
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(out)],{type:"application/json"}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);
  toast("Backup saved. Keep the file somewhere safe.");}catch(e){toast("Couldn't back up just now");}};
/* ===== RESTORE: bring a backup file back onto this device ===== */
(function(){const btn=$("#importBtn"),inp=$("#importFile");if(!btn||!inp)return;
  btn.onclick=()=>{inp.value="";inp.click();};
  inp.addEventListener("change",async()=>{const f=inp.files&&inp.files[0];if(!f)return;
    try{
      if(f.size>5*1024*1024)throw new Error("size");
      let j;try{j=JSON.parse(await f.text());}catch(e){throw new Error("shape");}
      if(!j||(j.app!=="Emberkind"&&j.app!=="Emberkind beta")||!j.data||typeof j.data!=="object"||Array.isArray(j.data))throw new Error("shape");
      const keys=Object.keys(j.data).filter(k=>/^ek[A-Za-z0-9:_.\/\-]*$/.test(k));
      if(!keys.length||keys.length>3000)throw new Error("shape");
      const when=j.exported?new Date(j.exported).toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"}):"an earlier date";
      if(!await ask({title:"Restore this backup?",text:"This replaces what's on this device now with the backup saved on "+when+". Anything you've made since then will be lost.",ok:"Restore"}))return;
      const old=Object.keys(localStorage).filter(k=>k.startsWith("ek")),keep=old.map(k=>[k,localStorage.getItem(k)]);
      try{old.forEach(k=>localStorage.removeItem(k));keys.forEach(k=>{const v=j.data[k];localStorage.setItem(k,typeof v==="string"?v:JSON.stringify(v));});}
      catch(e){try{Object.keys(localStorage).filter(k=>k.startsWith("ek")).forEach(k=>localStorage.removeItem(k));keep.forEach(([k,v])=>localStorage.setItem(k,v));}catch(_){}throw new Error("write");}
      toast("Restored. Reopening...");setTimeout(()=>location.reload(),900);
    }catch(e){toast(e.message==="size"?"That file is too big to be a backup":e.message==="write"?"Couldn't restore on this device":"That doesn't look like an Emberkind backup file");}finally{inp.value="";}
  });})();

/* ================= COMPANIONS: live chat whenever live AI is switched on ================= */
ready.then(()=>window.claude.use("sample")).then(s=>{if(s&&!sample)sample=s;document.body.classList.toggle("ek-noai",!sample);
  if(sample){const cs=$("#csAI");if(cs)cs.innerHTML="<b>To reply, your messages, and any photos or files you choose to share, are sent securely through Emberkind's server to Claude,</b> Anthropic's AI. To help it respond, it also receives your recent check-ins, practice history and the name you chose. Please don't share details like addresses, ID numbers or other people's private information.";
    const st=$("#aiStatus");if(st)st.textContent="Live.";const q=document.querySelector("#aiSection .quiet");if(q)q.textContent="Your companions are live. Messages you send them go securely through Emberkind's server to our AI provider, currently Claude by Anthropic, and nowhere else.";}}).catch(()=>{});
(function(){const a=$("#soonCheck"),b=$("#soonBreathe");if(a)a.onclick=()=>{loadMoods().then(()=>openCheckin());};if(b)b.onclick=()=>show("breathe");})();

/* ================= EXAMPLE CONVERSATIONS: shown as labelled samples, never as replies ================= */
const EK_EXAMPLES={
 soma:[["My chest is tight and I can't settle.","That sounds really uncomfortable. A tight chest is often your body bracing for something it senses is hard. If it feels okay, rest a hand right where it's tight and let a slow breath out be a little longer than the breath in. What do you notice under your hand?"],
       ["I keep replaying a fight with my partner.","Of course it's looping. A part of you is trying to make sense of it and keep you safe. Before we go back into what was said, where do you feel it most right now? We can go slowly. Nothing needs solving tonight."]],
 siro:[["I can't get started on anything today.","That's really common, especially when everything feels like one big blob. Let's find the smallest possible first step, something that takes two minutes. What's one thing on your list? We'll shrink it together."],
       ["Can you help me with a gentle morning routine?","Let's keep it small enough to actually happen. Maybe three anchors: water before your phone, three slow breaths by a window, and one minute outside. Which of those feels easiest to start with tomorrow?"]],
 orra:[["I need to tell my housemate something's bothering me.","That takes courage. Let's find words that are honest and kind. Something like: \"Hey, can I talk to you about something small that's been on my mind?\" Want to tell me what it is, and we'll shape the rest together?"],
       ["I'm exhausted from pretending I'm fine at work.","Holding that mask all day is genuinely tiring. You don't have to drop it everywhere at once. Is there one person, or one moment in the day, where you could let it rest a little?"]],
 ava:[["I'm too tired to cook anything.","Fair enough. Tonight doesn't need a real meal. Something like toast with eggs, a wrap with whatever's in the fridge, or yoghurt and fruit all count. What have you got close by?"],
       ["I always crash in the afternoon.","That dip is so common. It can help to have some protein and fibre at lunch, and water before reaching for more coffee. Would it help to look at what a usual lunch looks like for you?"]]};
window.EK_afterRender=(k,live)=>{if(live)return;const ex=EK_EXAMPLES[k];const m=$("#msgs");if(!ex||!m||m.querySelector(".excard"))return;const n=COMPANIONS[k].name;
  const card=document.createElement("div");card.className="excard";card.setAttribute("role","note");
  card.innerHTML=`<p class="exk">Example conversation</p><p class="exs">To show how ${esc(n)} speaks. These are written examples, not live replies.</p>`+
    ex.map(([q,a])=>`<div class="exq"><b>You</b>${esc(q)}</div><div class="exa"><b>${esc(n)}</b>${esc(a)}</div>`).join("");
  m.appendChild(card);};
