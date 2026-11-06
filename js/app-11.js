"use strict";
/* ================= FIELD GUIDE, WEEKLY INTENTIONS AND TODAY'S GIFT =================
   Field guide: 26 Australian birds, flowers, creatures and night-sky sights, found by practising at different
   times of day and through the seasons. Weekly intentions: three gentle goals each week. Today's gift: opened by
   the first practice or entry of the day (opening the app isn't enough). Every reward goes through the ledger, once. */
(function(){
const q=s=>document.querySelector(s),esc=t=>String(t||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const day=d=>{try{return dayStr(d||new Date());}catch(e){d=d||new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}};
const phase=()=>{try{return EVA.phaseOf();}catch(e){return "day";}},season=()=>{try{return EVA.seasonKey();}catch(e){return "spring";}};
const placed=id=>!!(profile.vplace&&id in profile.vplace);
/* id, name, kind, colour, times of day, seasons, practice kind (p = breathe or meditate, r = check-in or journal), hint, fact, extra condition */
const G=[["kookaburra","Laughing kookaburra","bird","#8C6A4F",["dawn","day"],0,0,"Practise in the morning","Its laughing call at dawn and dusk has been called the bush's alarm clock."],
 ["magpie","Australian magpie","bird","#3A3A3A",["day"],0,"p","Breathe or meditate during the day","Magpies sing rich, warbling songs, often together as a family."],
 ["lorikeet","Rainbow lorikeet","bird","#3FA34D",["day"],["spring","summer"],0,"Practise on a spring or summer day","Lorikeets feed on nectar with brush-tipped tongues."],
 ["fairywren","Superb fairywren","bird","#3E7BD6",["dawn","day"],["spring"],0,"Practise in spring","In spring the males turn a brilliant blue."],
 ["lyrebird","Superb lyrebird","bird","#7A5C44",["dawn"],0,0,"Practise at dawn","Lyrebirds can mimic almost any sound they hear."],
 ["frogmouth","Tawny frogmouth","bird","#8E8578",["night","dusk"],0,0,"Practise after dark","Frogmouths sit perfectly still so they look like a broken branch."],
 ["cockatoo","Sulphur-crested cockatoo","bird","#E9E4D6",["day"],0,"r","Check in or journal during the day","Cockatoos can live for decades."],
 ["swan","Black swan","bird","#2B2B2B",0,0,0,"Practise once a pond or lake is in your valley","Black swans are the bird emblem of Western Australia.",()=>placed("pond")||placed("lake")],
 ["wagtail","Willie wagtail","bird","#1F1F1F",0,0,"r","Check in or journal any time","Wagtails fan their tails side to side as they hunt for insects."],
 ["waratah","Waratah","flower","#C8323C",0,["spring"],0,"Practise in spring","The waratah is the floral emblem of New South Wales."],
 ["wattle","Golden wattle","flower","#E9C23B",0,["winter"],0,"Practise in winter","Golden wattle is Australia's national floral emblem."],
 ["flannel","Flannel flower","flower","#F2EEE2",0,["spring"],"r","Reflect in spring","Its petals feel soft, like flannel, which is how it got its name."],
 ["bottlebrush","Bottlebrush","flower","#D84A3C",0,["summer"],0,"Practise in summer","Nectar-eating birds love bottlebrush flowers."],
 ["kangaroopaw","Kangaroo paw","flower","#D9583A",0,["spring","summer"],"p","Breathe or meditate in spring or summer","Kangaroo paw is the floral emblem of Western Australia."],
 ["banksia","Banksia","flower","#D99A3C",0,["autumn","winter"],0,"Practise in autumn or winter","Many banksias need fire or heat to release their seeds."],
 ["jacbloom","Jacaranda in bloom","flower","#9C7BDA",0,["spring"],0,"Plant your jacaranda, then practise in spring","Jacarandas turn whole streets purple in late spring.",()=>placed("jacaranda")],
 ["wombat","Common wombat","creature","#8A7360",["dusk","night"],0,0,"Practise in the evening","Wombats are famous for their cube-shaped droppings."],
 ["echidna","Short-beaked echidna","creature","#6B5440",["dawn"],0,"p","Breathe or meditate at dawn","Echidnas are one of the few mammals that lay eggs."],
 ["bluetongue","Blue-tongue lizard","creature","#4F79B8",["day"],["summer"],0,"Practise on a summer day","They flash their blue tongue to startle anything that comes too close."],
 ["platypus","Platypus","creature","#6E5A47",["dawn","dusk"],0,0,"Practise at dawn or dusk","Platypuses hunt with their eyes shut, sensing tiny electric signals."],
 ["possum","Brushtail possum","creature","#7D7A78",["night"],0,"r","Check in or journal at night","Possums often make their homes in tree hollows and roofs."],
 ["crux","Southern Cross","sky","#BFD3FF",["night"],0,0,"Practise after dark","The Southern Cross is on the Australian flag."],
 ["emu","Emu in the Sky","sky","#D7C9FF",["night"],["autumn","winter"],0,"Practise on an autumn or winter night","In Aboriginal astronomy, the Emu is traced by dark dust lanes in the Milky Way."],
 ["saucepan","The Saucepan","sky","#FFE3A8",["night"],["summer"],0,"Practise on a summer night","From the Southern Hemisphere, Orion's Belt and sword look like a saucepan."],
 ["scorpius","Scorpius","sky","#FFB7A8",["night"],["winter"],"p","Breathe or meditate on a winter night","Scorpius rides high in Australian winter skies."],
 ["milkyway","The Milky Way","sky","#E6E2FF",["night"],0,"p","Breathe or meditate late at night","Far from city lights, the Milky Way stretches right across the sky."]];
const CAT={bird:"Birds",flower:"Flowers",creature:"Creatures",sky:"Night sky"};
const ICON={bird:'<path d="M4 14c2.5-.5 4.5-2.5 5.5-5 .8-2 2.6-3.5 4.8-3.5 1.6 0 3 .8 3.7 2l2 .3-1.6 1.2c.1 3.9-3 7-6.9 7H8l-3 3v-3.2"/><circle cx="15.6" cy="8" r=".7"/>',
  flower:'<circle cx="12" cy="10" r="2.4"/><path d="M12 7.6c0-2.4 1.2-4 2.6-4 1.4 0 1.7 2 .6 3.6M14.3 9.2c2.2-.9 4.2-.4 4.4 1s-1.6 2.3-3.5 1.7M13.6 12.1c1.3 2 1.2 4-.1 4.6s-2.6-1-2.3-3M10.4 12.2c-1.6 1.7-3.6 2-4.2.7s.7-2.7 2.7-2.9M9.6 9.2c-2.2-.9-3.3-2.6-2.6-3.8s2.6-.8 3.6.8"/><path d="M12 12.4V21"/>',
  creature:'<ellipse cx="12" cy="15" rx="4" ry="3.6"/><ellipse cx="6.2" cy="10" rx="1.7" ry="2.2"/><ellipse cx="9.6" cy="7.2" rx="1.7" ry="2.2"/><ellipse cx="14.4" cy="7.2" rx="1.7" ry="2.2"/><ellipse cx="17.8" cy="10" rx="1.7" ry="2.2"/>',
  sky:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><circle cx="18.5" cy="18.5" r="1"/><circle cx="5" cy="19" r=".8"/>'};
const icon=(k,col,found)=>`<svg viewBox="0 0 24 24" aria-hidden="true" class="fgi" style="--c:${found?col:"#5C6475"}">${ICON[k]}</svg>`;
const fg=()=>(profile.fg=profile.fg||{});
window.EKFG={all:()=>G};
const art=(g,found)=>(typeof EVF!=="undefined")?`<img class="fgimg${found?"":" off"}" src="${EVF.img(g[0],g[2],!!found)}" alt="">`:icon(g[2],g[3],found);
/* celebrations take turns and never interrupt: a new card waits until nothing else is open and you are back on Home or in Embervale.
   The find and its coins are already recorded, so if you are away a long time the card simply is not shown. */
function whenFree(fn,tries){tries=tries||0;const v=(document.querySelector(".view.active")||{}).id,calm=(v==="view-fire"||v==="view-vale")&&!document.querySelector(".sheet.on")&&!document.hidden&&!(window.EKJ&&EKJ.busy());
  if(calm)return fn();if(tries<400)setTimeout(()=>whenFree(fn,tries+1),1500);}
function discover(d){const found=fg(),t=day();if(Object.values(found).filter(x=>x.d===t).length>=3)return;
  const ph=phase(),se=season(),cands=G.filter(g=>!found[g[0]]&&(!g[4]||g[4].includes(ph))&&(!g[5]||g[5].includes(se))&&(!g[6]||g[6]===d.k)&&(!g[9]||g[9]()));
  if(!cands.length)return;const g=cands[Object.keys(found).length%cands.length];found[g[0]]={d:t,ph};try{saveProfile();}catch(e){}
  if(window.EKECO)EKECO.bonus(25,"Field guide: "+g[1],"fg:"+g[0]);
  setTimeout(()=>whenFree(()=>{if(!window.EKECO)return;EKECO.sheet("fgNew",`<div class="fgbig">${art(g,1)}</div><p class="evsub">New in your field guide</p><h3>${esc(g[1])}</h3><p class="rlede">${esc(g[8])}</p><p class="quiet">${Object.keys(found).length} of ${G.length} found</p><div class="ractions"><button type="button" class="ybtn" id="fgOpen">Open field guide</button><button type="button" class="big" id="fgOk">Received.</button></div>`);
    q("#fgOk").onclick=EKECO.close;q("#fgOpen").onclick=()=>guide(g[2]);}),1600);}
function guide(cat){cat=CAT[cat]?cat:"bird";const found=fg(),n=Object.keys(found).length;
  const tabs=Object.entries(CAT).map(([k,v])=>`<button type="button" class="evtab${k===cat?" on":""}" data-fgc="${k}">${v}</button>`).join("");
  const tiles=G.filter(g=>g[2]===cat).map(g=>{const f=found[g[0]];return `<button type="button" class="fgt${f?"":" off"}" data-fg="${g[0]}">${art(g,f)}<b>${f?esc(g[1]):"Not found yet"}</b><small>${f?"Found "+esc(f.d.split("-").reverse().slice(0,2).join("/")):esc(g[7])}</small></button>`;}).join("");
  const s=EKECO.sheet("fgSheet",`<h3>Field guide</h3><p class="rlede">Birds, flowers, creatures and stars of the valley, found by practising at different times of day and through the seasons. ${n} of ${G.length} found.</p><div class="evtabs fgtabs">${tabs}</div><div class="fggrid">${tiles}</div><p class="quiet fgfact" id="fgFact" aria-live="polite"></p><div class="ractions"><button type="button" class="big" id="fgDone">Done</button></div>`);
  s.onclick=ev=>{const c=ev.target.closest("[data-fgc]");if(c)return guide(c.dataset.fgc);const t=ev.target.closest("[data-fg]");if(t){const g=G.find(x=>x[0]===t.dataset.fg),f=found[g[0]];q("#fgFact").textContent=f?g[1]+": "+g[8]+" It lives in your valley now.":"Something is out there. Hint: "+g[7]+".";}};q("#fgDone").onclick=EKECO.close;}
/* ---------- weekly intentions (Monday to Sunday) ---------- */
function weekKey(){const d=new Date(),t=new Date(d.getFullYear(),d.getMonth(),d.getDate());t.setDate(t.getDate()-(t.getDay()+6)%7);return day(t);}
function wk(){const k=weekKey();if(!profile.wk||profile.wk.k!==k)profile.wk={k,pd:[],rd:[],br:0,med:0,ci:0,jr:0,early:0,both:0};return profile.wk;}
const POOL=[[["pd3","Breathe or meditate on 3 different days",3,w=>w.pd.length],["med2","Meditate twice",2,w=>w.med],["br3","Do 3 breath practices",3,w=>w.br],["early","Practise once before 9 am",1,w=>w.early]],
  [["rd3","Check in or journal on 3 different days",3,w=>w.rd.length],["jr1","Write in your journal once",1,w=>w.jr],["ci3","Check in 3 times",3,w=>w.ci]],
  [["both","Practise and reflect on the same day",1,w=>w.both],["pd5","Breathe or meditate on 5 different days",5,w=>w.pd.length],["rd5","Check in or journal on 5 different days",5,w=>w.rd.length]]];
function intentions(){const n=Number(weekKey().replace(/-/g,""))%97;return [POOL[0][n%4],POOL[1][(n>>1)%3],POOL[2][(n>>2)%3]];}
function track(d){const w=wk(),t=day();if(d.k==="p"){if(!w.pd.includes(t))w.pd.push(t);d.what==="med"?w.med++:w.br++;if(new Date(d.at).getHours()<9)w.early++;}else{if(!w.rd.includes(t))w.rd.push(t);d.what==="journal"?w.jr++:w.ci++;}
  w.both=w.pd.filter(x=>w.rd.includes(x)).length;try{saveProfile();}catch(e){}let done=0;
  for(const [id,txt,goal,val] of intentions())if(val(w)>=goal){done++;if(window.EKECO)EKECO.bonus(150,"Weekly intention: "+txt,"wk:"+w.k+":"+id);}
  if(done===3&&window.EKECO&&EKECO.bonus(250,"All three weekly intentions","wk:"+w.k+":all"))setTimeout(()=>whenFree(()=>{EKECO.sheet("wkAll",`<p class="evsub">This week</p><h3>All three intentions, done</h3><p class="rlede">You kept the promises you made to yourself this week. That matters.</p><p class="ekgain">+250 Embercoins</p><button type="button" class="big" id="wkOk">I take this with me.</button>`);q("#wkOk").onclick=EKECO.close;}),2600);}
/* ---------- today's gift by the fire ---------- */
const giftKey=()=>"gift:"+day(),giftOpen=()=>!!(profile.eco&&profile.eco.seen&&profile.eco.seen.includes(giftKey()));
/* ---------- the "This week" card on Home, under your streaks ---------- */
function card(){let el=q("#ekWeek");if(el)return el;const a=q("#ekStreaks");if(!a)return null;const t=document.createElement("p");t.className="hsec";t.textContent="This week";el=document.createElement("div");el.className="ekweek";el.id="ekWeek";
  a.parentNode.insertBefore(el,a.nextSibling);a.parentNode.insertBefore(t,el);el.addEventListener("click",ev=>{if(ev.target.closest("#fgBtn"))guide();});return el;}
function render(){const el=card();if(!el||typeof profile==="undefined"||!profile)return;const w=wk(),n=Object.keys(fg()).length;
  el.innerHTML=`<div class="wkgift${giftOpen()?" open":""}">${giftOpen()?"Today's gift is open. Another waits tomorrow.":"A gift is waiting by the fire. Practise or check in to open it."}</div>`+
    intentions().map(([id,txt,goal,val])=>{const v=Math.min(goal,val(w)),done=v>=goal;return `<div class="wkr${done?" done":""}" data-wk="${id}"><span class="wkc" aria-hidden="true">${done?"\u2713":""}</span><span class="wkt">${esc(txt)}</span><span class="wkn">${v}/${goal}</span><span class="wkb"><i style="width:${Math.round(v/goal*100)}%"></i></span></div>`;}).join("")+
    `<p class="quiet wkq">Gentle intentions that reset each Monday. If this isn't the week, that's okay.</p><button type="button" class="ybtn wkfg" id="fgBtn">Field guide \u00b7 ${n} of ${G.length} found</button>`;}
document.addEventListener("ek:act",ev=>{const d=ev.detail||{};try{if(window.EKECO)EKECO.bonus(50,"Today's gift by the fire",giftKey());track(d);discover(d);}catch(e){}render();});
window.EKGUIDE={ids:()=>G.map(g=>g[0]),open:guide,count:()=>Object.keys(fg()).length,total:G.length,intentions:()=>intentions().map(i=>i[0]),render};
function init(){render();setInterval(()=>{if(!document.hidden)render();},60000);}
if(document.readyState!=="loading")setTimeout(init,900);else document.addEventListener("DOMContentLoaded",()=>setTimeout(init,900));
})();
