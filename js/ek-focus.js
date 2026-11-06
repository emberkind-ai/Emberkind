"use strict";
/* ================= TASK BUDDY SETUP, TIDIED (3.3.1) =================
   The setup controls are regrouped, never rebuilt: every control keeps its id and behaviour. The title sits on the
   lamplit room; companions are a slim row of avatars; one glass panel holds the task (with "Help me break it down"
   as a quiet link), the time, the sound (one swipeable row of icon chips; volume shows only while a sound is on) and
   a compact Spotify line; "Start together" stays pinned to the bottom of the screen. Styles in app-14.css. */
(function(){const $=s=>document.querySelector(s);
const IC={quiet:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',fire:'<path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.5 2-5 1 1.5 1.5 2 2.5 2C11 7.5 11 5 12 3z"/>',
  rain:'<path d="M7 15a4 4 0 1 1 .6-7.95A5.5 5.5 0 0 1 18 9a3.5 3.5 0 0 1 0 7H7"/><path d="M9 19l-1 2M13 19l-1 2M17 19l-1 2"/>',ocean:'<path d="M2 12c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M2 17c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/>',
  forest:'<path d="M12 2l5 8h-3l4 6h-5v6h-2v-6H6l4-6H7z"/>',brown:'<path d="M2 12c1.5-4 3-4 4.5 0s3 4 4.5 0 3-4 4.5 0 3 4 4.5 0"/>'};
function el(tag,cls){const e=document.createElement(tag);e.className=cls;return e;}
function tidy(){const fs=$("#fSetup");if(!fs||fs.dataset.tidy)return;const hero=fs.querySelector(".fhero");if(!hero)return;fs.dataset.tidy="1";
  const kids=[...fs.children],label=t=>kids.find(e=>e.classList&&e.classList.contains("flabel")&&new RegExp(t,"i").test(e.textContent));
  const h1=fs.querySelector("h1"),lede=fs.querySelector(".lede"),whoL=label("sits with"),pick=$("#fPick"),taskL=label("one thing"),task=$("#fTask"),brk=$("#fBreak"),steps=$("#fSteps"),
    lenRow=fs.querySelector(".fbrow"),len=$("#fLen"),sndL=label("sound"),snd=$("#fSnd"),vol=fs.querySelector(".volrow"),spot=fs.querySelector(".fspot"),spAuto=$("#fSpotAutoRow"),spN=$("#fSpotN"),start=$("#fStart"),quiet=[...fs.querySelectorAll(":scope > p.quiet")].pop();
  /* the title rests on the room */
  if(h1){const ht=el("div","fhtext");ht.appendChild(h1);hero.appendChild(ht);}
  if(lede)hero.after(lede);
  /* companions: a slim row */
  const who=el("div","fwhorow");if(whoL)who.appendChild(whoL);if(pick)who.appendChild(pick);(lede||hero).after(who);
  /* one glass panel, in sections */
  const panel=el("div","fpanel");who.after(panel);const sec=c=>{const s=el("section","fsec "+c);panel.appendChild(s);return s;};
  const s1=sec("fs-task");if(taskL)s1.appendChild(taskL);const tw=el("div","ftaskwrap");if(task)tw.appendChild(task);if(brk)tw.appendChild(brk);s1.appendChild(tw);if(steps)s1.appendChild(steps);
  const s2=sec("fs-time");if(lenRow)s2.appendChild(lenRow);if(len)s2.appendChild(len);
  const s3=sec("fs-sound");if(sndL)s3.appendChild(sndL);if(snd)s3.appendChild(snd);if(vol)s3.appendChild(vol);
  const s4=sec("fs-spot");if(spot)s4.appendChild(spot);if(spAuto)s4.appendChild(spAuto);if(spN)s4.appendChild(spN);
  /* start, pinned */
  const bar=el("div","fstartbar");if(start)bar.appendChild(start);if(quiet)bar.appendChild(quiet);panel.after(bar);
  /* sound chips get icons; volume only while a sound is on */
  if(snd)snd.querySelectorAll("button[data-s]").forEach(b=>{if(!b.querySelector("svg")&&IC[b.dataset.s])b.insertAdjacentHTML("afterbegin",`<svg viewBox="0 0 24 24" aria-hidden="true">${IC[b.dataset.s]}</svg>`);});
  const syncVol=()=>{const on=snd&&snd.querySelector('button[aria-pressed="true"]');s3.classList.toggle("silent",!on||on.dataset.s==="quiet");
    /* keep the chosen sound in view in its swipeable row */if(on&&snd){const l=on.offsetLeft-16,r=on.offsetLeft+on.offsetWidth-snd.clientWidth+16;if(snd.scrollLeft>l)snd.scrollTo({left:l,behavior:"smooth"});else if(snd.scrollLeft<r)snd.scrollTo({left:r,behavior:"smooth"});}};syncVol();if(snd){snd.addEventListener("click",()=>setTimeout(syncVol,30));new MutationObserver(syncVol).observe(snd,{subtree:true,attributes:true,attributeFilter:["aria-pressed"]});}
  /* the time slider's warm fill follows its value */
  const fill=()=>{if(!len)return;const p=(len.value-len.min)/(len.max-len.min)*100;len.style.setProperty("--fill",p+"%");};fill();if(len)len.addEventListener("input",fill);}
const t=setInterval(()=>{tidy();if($("#fSetup")&&$("#fSetup").dataset.tidy)clearInterval(t);},400);
})();
