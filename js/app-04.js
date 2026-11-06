"use strict";
function renderYouMore(){try{const all=AW_ORDER.length*6,got=AW_ORDER.reduce((a,k)=>a+awSteps(k).filter((t,i)=>awMins(k)>=t).length,0);
  $("#ycAwLine").textContent=got?`${got} of ${all} earned`:"Earned as you go";
  const ev=profile.ev||{},mins=Math.round((ORDER_SC.reduce((a,k)=>a+(ev[k]||0),0)+(profile.med||0)+(profile.focus||0))/60);
  $("#ycPatLine").textContent=mins?`${mins} min practised`:"What helps you";
  $("#ycEmbLine").textContent=sparks.length?`${sparks.length} kept`:"Things worth carrying";}catch(e){}}

/* ================= ROUTINE PDF: a real, designed PDF file built in the app ================= */
if(window.CanvasRenderingContext2D&&!CanvasRenderingContext2D.prototype.roundRect)CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){r=Math.min(r,w/2,h/2);this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();return this;};
function wrapText(x,text,maxW){const words=String(text).split(/\s+/),lines=[];let cur="";for(const w of words){const t=cur?cur+" "+w:w;if(x.measureText(t).width>maxW&&cur){lines.push(cur);cur=w;}else cur=t;}if(cur)lines.push(cur);return lines;}
async function routinePDF(r){const W=1240,H=1754,M=96,pages=[];let c,x,y;
  const siro=new Image();siro.src=CMP_ART.siro;try{await siro.decode();}catch(e){}
  function newPage(first){c=document.createElement("canvas");c.width=W;c.height=H;x=c.getContext("2d");x.fillStyle="#FFFFFF";x.fillRect(0,0,W,H);pages.push(c);
    if(first){const g=x.createLinearGradient(0,0,W,320);g.addColorStop(0,"#2A1D70");g.addColorStop(.52,"#8B3D8E");g.addColorStop(1,"#FF8A3D");x.fillStyle=g;x.fillRect(0,0,W,320);
      const rg=x.createRadialGradient(W-120,330,0,W-120,330,420);rg.addColorStop(0,"rgba(255,214,120,.55)");rg.addColorStop(1,"rgba(255,214,120,0)");x.fillStyle=rg;x.fillRect(0,0,W,320);
      if(siro.naturalWidth){const h=260,w=h*siro.naturalWidth/siro.naturalHeight;x.drawImage(siro,W-M-w,320-h-18,w,h);}
      x.fillStyle="#fff";x.font="800 64px Nunito, Helvetica, Arial, sans-serif";x.fillText("EMBERKIND".split("").join(String.fromCharCode(8202)),M,140);
      
      x.fillStyle="rgba(255,255,255,.2)";x.beginPath();x.roundRect(M,220,230,48,24);x.fill();x.fillStyle="#fff";x.font="700 22px Nunito, Helvetica, Arial, sans-serif";x.fillText("YOUR ROUTINE",M+28,252);y=410;}
    else y=M;}
  function need(h){if(y+h>H-M-60)newPage(false);}
  newPage(true);
  x.fillStyle="#2A1D70";x.font="800 52px Nunito, Helvetica, Arial, sans-serif";for(const l of wrapText(x,r.title,W-2*M)){need(64);x.fillText(l,M,y);y+=64;}
  x.fillStyle="#7A6E86";x.font="500 24px Nunito, Helvetica, Arial, sans-serif";const d=new Date(r.at||Date.now()).toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"});
  x.fillText("Made with Siro"+(profile.name?" for "+profile.name:"")+", "+d,M,y+6);y+=70;
  const tk=r.title.replace(/\.\.\.$/,"").trim();let n=0;
  for(const raw of r.text.replace(/\r/g,"").split("\n")){const t=raw.trim().replace(/\*\*(.+?)\*\*/g,"$1").replace(/\*(.+?)\*/g,"$1");if(!t||t.replace(/[#*]/g,"").trim().startsWith(tk))continue;let m;
    if((m=t.match(/^#{1,6}\s+(.*)/))){need(70);x.fillStyle="#C2602A";x.font="800 24px Nunito, Helvetica, Arial, sans-serif";x.fillText(m[1].toUpperCase(),M,y+20);y+=56;continue;}
    if((m=t.match(/^(?:\d+[.)]|[-*\u2022])\s+(.*)/))){n++;x.font="500 30px Nunito, Helvetica, Arial, sans-serif";const ls=wrapText(x,m[1],W-2*M-130),h=Math.max(92,ls.length*42+44);need(h+20);
      x.fillStyle="#FFF6EC";x.strokeStyle="#F6DFC6";x.lineWidth=2;x.beginPath();x.roundRect(M,y,W-2*M,h,26);x.fill();x.stroke();
      const bg=x.createLinearGradient(M+24,y+22,M+76,y+74);bg.addColorStop(0,"#FF8A3D");bg.addColorStop(1,"#C2602A");x.fillStyle=bg;x.beginPath();x.arc(M+52,y+46,26,0,7);x.fill();
      x.fillStyle="#fff";x.font="800 26px Nunito, Helvetica, Arial, sans-serif";x.textAlign="center";x.fillText(String(n),M+52,y+55);x.textAlign="left";
      x.fillStyle="#2A1F33";x.font="500 30px Nunito, Helvetica, Arial, sans-serif";ls.forEach((l,i)=>x.fillText(l,M+104,y+54+i*42));y+=h+20;continue;}
    x.fillStyle="#3A3046";x.font="500 30px Nunito, Helvetica, Arial, sans-serif";for(const l of wrapText(x,t,W-2*M)){need(44);x.fillText(l,M,y+30);y+=44;}y+=16;}
  need(150);y+=20;x.strokeStyle="#EADFF0";x.lineWidth=2;x.beginPath();x.moveTo(M,y);x.lineTo(W-M,y);x.stroke();y+=44;
  x.fillStyle="#2A1D70";x.font="800 24px Nunito, Helvetica, Arial, sans-serif";x.fillText("Go gently.",M,y);x.fillStyle="#8A7E94";x.font="500 24px Nunito, Helvetica, Arial, sans-serif";
  x.fillText("A routine is a support, not a rule. Adjust anything that doesn't fit you.",M+132,y);y+=36;x.fillText("General ideas for daily life, not medical or professional advice. Emberkind.",M,y);
  // assemble a minimal PDF with one JPEG per page
  const enc=new TextEncoder(),parts=[],offs=[];let len=0;const push=b=>{const u=typeof b==="string"?enc.encode(b):b;parts.push(u);len+=u.length;};
  const obj=(n,body)=>{offs[n]=len;push(n+" 0 obj\n");body();push("\nendobj\n");};
  const imgs=await Promise.all(pages.map(p=>new Promise(res=>p.toBlob(b=>b.arrayBuffer().then(a=>res(new Uint8Array(a))),"image/jpeg",.9))));
  const np=pages.length,kids=[];for(let i=0;i<np;i++)kids.push((3+i*3)+" 0 R");
  push("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  obj(1,()=>push("<< /Type /Catalog /Pages 2 0 R >>"));obj(2,()=>push(`<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${np} >>`));
  imgs.forEach((im,i)=>{const p=3+i*3;
    obj(p,()=>push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im${i} ${p+1} 0 R >> >> /Contents ${p+2} 0 R >>`));
    obj(p+1,()=>{push(`<< /Type /XObject /Subtype /Image /Width ${W} /Height ${H} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${im.length} >>\nstream\n`);push(im);push("\nendstream");});
    const cs=`q 595.28 0 0 841.89 0 0 cm /Im${i} Do Q`;obj(p+2,()=>push(`<< /Length ${cs.length} >>\nstream\n${cs}\nendstream`));});
  const total=3+np*3,xref=len;let xr=`xref\n0 ${total}\n0000000000 65535 f \n`;for(let i=1;i<total;i++)xr+=String(offs[i]).padStart(10,"0")+" 00000 n \n";
  push(xr+`trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  return new Blob(parts,{type:"application/pdf"});}
async function deliverFile(blob,name){
  try{if(window.claude&&window.claude.use&&!window.EK_STANDALONE){const dl=await window.claude.use("downloads");if(dl){await dl.save({filename:name,data:blob});return "saved";}}}catch(e){if(e&&e.code==="declined")return "declined";}
  try{const f=new File([blob],name,{type:"application/pdf"});if(navigator.canShare&&navigator.canShare({files:[f]})&&/Android|iPhone|iPad/i.test(navigator.userAgent)){await navigator.share({files:[f],title:name});return "shared";}}catch(e){if(e&&e.name==="AbortError")return "declined";}
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},4000);return "downloaded";}

/* ================= SPOTIFY: app first, web player as the fallback ================= */
function openSpotify(url){const l=spotLinks(url||spotUrl()),ua=navigator.userAgent||"",inFrame=window.top!==window;
  const web=()=>{const w=window.open(l.web,"_blank");if(w){try{w.opener=null;}catch(e){}}else toast("Couldn't open Spotify here. Try again in a moment.");};
  if(/Android/i.test(ua)&&!inFrame&&l.android){try{window.location.href=l.android;}catch(e){}setTimeout(()=>{if(!document.hidden)web();},1300);return;}
  web();}


/* ================= TOOLS AND HOME ENTRY POINTS ================= */
let focusFrom="fire";
$("#medCard").onclick=openMeditate;
$("#journalCard").onclick=()=>{trackFrom="fire";openTrack("journal");};
const EK_ATLAS_URL="https://inner-atlas-beta-v65.awarenessunvailed.workers.dev/";

$("#atlasCard").onclick=()=>{/* a real new-tab link: window.open with noopener always returns null, which used to send the app itself away */const a=document.createElement("a");a.href=EK_ATLAS_URL;a.target="_blank";a.rel="noopener";document.body.appendChild(a);a.click();a.remove();};


/* ================= AEVUM PAGES: gentle reveals, the spiral, entry points ================= */
const ROOMS=[{"t": "Rooting", "e": "Earth", "d": "Safety in the body. Rest, the nervous system, feeling at home in your own skin."}, {"t": "Flowing", "e": "Water", "d": "Emotions and relationships. Feeling what's here, repairing what's frayed."}, {"t": "Igniting", "e": "Fire", "d": "Choice and purpose. Work, money and showing up, without burning out."}, {"t": "Opening", "e": "Air", "d": "Breath. Breathwork and pranayama as a doorway to clarity."}, {"t": "Resting", "e": "Space", "d": "Stillness. Meditation and self-inquiry, meeting the part of you that's always been okay."}];
document.querySelectorAll(".axorb").forEach(b=>b.addEventListener("click",()=>{const r=ROOMS[+b.dataset.i];document.querySelectorAll(".axorb").forEach(x=>x.classList.toggle("on",x===b));
  const box=$("#axRoom");box.classList.remove("show");void box.offsetWidth;$("#axRoomT").textContent=r.t;$("#axRoomE").textContent=r.e;$("#axRoomD").textContent=r.d;box.classList.add("show");buzz(12);}));
$(".axcore").addEventListener("click",()=>{document.querySelectorAll(".axorb").forEach(x=>x.classList.remove("on"));$("#axRoomT").textContent="The centre";$("#axRoomE").textContent="Home";$("#axRoomD").textContent="Recognising what was never lost. Tap any room to explore it.";});
(function(){const els=document.querySelectorAll(".ax .rv, .aevumhome .axshow");if(!("IntersectionObserver" in window)){els.forEach(e=>e.classList.add("in"));return;}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}}),{threshold:.15});els.forEach(e=>io.observe(e));})();
$("#visionBtn2").onclick=()=>openVision("academy");
$("#homeAcademy").onclick=()=>show("academy");


/* ================= MEDITATE HOME: galaxy, minute wheel, monthly practice ================= */
const MINFO={timer:["Meditation for stillness","Sit in stillness","Close your eyes or let them rest softly. A bowl rings to begin, then there's nothing to do but sit with whatever is here: your breath, sounds, sensations and passing thoughts. When your mind wanders, notice it and gently come back. A final bell brings you home."],
  scan:["Meditation for tension and sleep","Body scan","Sit or lie down comfortably. Each soft chime invites your attention a little lower, from the top of your head down to your feet. You don't need to relax anything. Simply notice what's there, and let your attention rest kindly on each part."],
  be:["Meditation for deep rest","Just be","No technique, no guidance and no goal. Let your body be held, let your breath breathe itself, and let your attention go wherever it likes. This is rest without effort, simply being here as you are."]};
const MDESC={timer:"A bell to begin, a bell to end, and stillness in between.",scan:"With each soft chime, move your attention down through the body.",be:"No guidance at all. Simply rest as you are."};
/* the minute wheel: swipe sideways, tap a number, or use the arrow keys. One component for Breathe and Meditate. */
function makeWheel(o){const w=o.el,vals=o.values||Array.from({length:o.max-o.min+1},(_,i)=>o.min+i);
  w.innerHTML=vals.map(m=>`<span data-m="${m}">${m}</span>`).join("");w.setAttribute("aria-valuemin",vals[0]);w.setAttribute("aria-valuemax",vals[vals.length-1]);
  const items=[...w.children],tick=w.parentElement&&w.parentElement.querySelector(".mtick");let raf=0,settle=null,cur=o.value();
  /* everything lines up with the dot itself, wherever the layout puts it */
  function anchor(){if(tick&&tick.getClientRects().length){const b=tick.getBoundingClientRect();if(b.width)return b.left+b.width/2;}const r=w.getBoundingClientRect();return r.left+r.width/2;}
  /* room at both ends, so the first and last choices can sit right under the dot, and snapping aims at the dot too */
  function pad(){const it=items[0];if(!it||!w.clientWidth)return;const r=w.getBoundingClientRect(),ax=anchor(),iw=it.offsetWidth,off=(ax-r.left)-r.width/2;
    const s=(k,v)=>w.style.setProperty(k,v,"important");s("padding-left",Math.max(0,Math.round(ax-r.left-iw/2))+"px");s("padding-right",Math.max(0,Math.round(r.right-ax-iw/2))+"px");
    s("scroll-padding-left",off>0?Math.round(2*off)+"px":"0px");s("scroll-padding-right",off<0?Math.round(-2*off)+"px":"0px");}
  function centre(){const cx=anchor();let best=null,bd=1e9;items.forEach(el=>{const b=el.getBoundingClientRect(),d=Math.abs(b.left+b.width/2-cx);el.style.setProperty("--d",Math.min(1,d/150).toFixed(3));if(d<bd){bd=d;best=el;}});return best;}
  function pick(){const el=centre();if(!el)return;const m=+el.dataset.m;if(m!==cur){cur=m;o.change(m);w.setAttribute("aria-valuenow",m);buzz(6);}}
  w.addEventListener("scroll",()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;pick();});clearTimeout(settle);settle=setTimeout(pick,120);},{passive:true});
  function to(m,smooth){const el=items[vals.indexOf(m)];if(!el)return;if(!smooth){cur=m;w.setAttribute("aria-valuenow",m);}if(!w.clientWidth)return;pad();const b=el.getBoundingClientRect();
    w.scrollTo({left:w.scrollLeft+(b.left+b.width/2)-anchor(),behavior:smooth?"smooth":"auto"});if(!smooth){cur=m;w.setAttribute("aria-valuenow",m);requestAnimationFrame(centre);}}
  w.addEventListener("keydown",e=>{if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();const i=Math.min(vals.length-1,Math.max(0,vals.indexOf(cur)+(e.key==="ArrowRight"?1:-1)));to(vals[i],true);}});
  items.forEach(el=>el.addEventListener("click",()=>to(+el.dataset.m,true)));
  window.addEventListener("resize",()=>{if(w.clientWidth)to(cur,false);});
  /* if the wheel was set while hidden, centre it the moment it appears */
  if(window.ResizeObserver){let was=0;new ResizeObserver(()=>{const now=w.clientWidth;if(now&&!was)to(cur,false);was=now;}).observe(w);}
  return {to};}
const M_WHEEL=makeWheel({el:$("#mWheel"),values:MINS,value:()=>mMins,change:v=>{mMins=v;lsSet("ek-mmins",String(v));$("#mLen").value=v;}});
window.mWheelTo=m=>{mMins=snapMins(m);M_WHEEL.to(mMins,false);};
/* the hearth: a breathing ember, slow rings of calm, and sparks drifting up. Drawn only while visible. */
const GAL=(function(){const c=$("#mGal"),x=c.getContext("2d");let W=0,H=0,D=1,sparks=[],ripples=[],raf=0,t0=performance.now(),vis=false;
  function spark(init){return {x:(Math.random()-.5)*60,y:init?-Math.random()*H*.6:0,v:12+Math.random()*22,w:Math.random()*Math.PI*2,amp:6+Math.random()*16,sz:Math.random()*1.8+.6,life:0,max:5+Math.random()*6,col:Math.random()<.18?"201,167,245":Math.random()<.5?"255,199,121":"255,150,80"};}
  function build(){const r=c.getBoundingClientRect();if(!r.width)return false;D=Math.min(devicePixelRatio||1,1.5);W=r.width;H=r.height;c.width=W*D;c.height=H*D;x.setTransform(D,0,0,D,0,0);sparks=[];for(let i=0;i<70;i++){const s=spark(true);s.life=Math.random()*s.max;sparks.push(s);}return true;}
  let last=performance.now();
  function frame(now){raf=0;if(!vis||document.hidden||!c.offsetParent)return;if(!W&&!build()){raf=requestAnimationFrame(frame);return;}
    const t=(now-t0)/1000,dt=Math.min(.05,(now-last)/1000);last=now;x.clearRect(0,0,W,H);const cx=W/2,cy=H*.62,br=.5+.5*Math.sin(t*2*Math.PI/10);
    for(let k=0;k<3;k++){const p=((t/10)+k/3)%1,r=40+p*Math.min(W,H)*.62;x.strokeStyle=`rgba(${k===1?"201,167,245":"242,177,96"},${(.32*(1-p)).toFixed(3)})`;x.lineWidth=1.4;x.beginPath();x.ellipse(cx,cy,r,r*.62,0,0,7);x.stroke();}
    const rr=70+br*18,g=x.createRadialGradient(cx,cy,0,cx,cy,rr*1.8);g.addColorStop(0,"rgba(255,246,216,.95)");g.addColorStop(.18,"rgba(255,199,121,.75)");g.addColorStop(.45,"rgba(232,100,44,.28)");g.addColorStop(1,"rgba(120,60,140,0)");
    x.fillStyle=g;x.beginPath();x.ellipse(cx,cy,rr*1.8,rr*1.25,0,0,7);x.fill();
    x.fillStyle="rgba(255,250,235,.95)";x.beginPath();x.ellipse(cx,cy,10+br*3,7+br*2,0,0,7);x.fill();
    for(const s of sparks){s.life+=dt;if(s.life>s.max){Object.assign(s,spark(false));}const f=s.life/s.max,y=cy-10-s.life*s.v,xx=cx+s.x+Math.sin(s.w+s.life*1.1)*s.amp;
      x.fillStyle=`rgba(${s.col},${(Math.sin(f*Math.PI)*.85).toFixed(3)})`;x.beginPath();x.arc(xx,y,s.sz,0,7);x.fill();}
    ripples=ripples.filter(r=>now-r.t<3000);for(const r of ripples){if(now<r.t)continue;const f=(now-r.t)/3000,rr=8+f*130,a=Math.max(0,1-Math.pow(f,1.4));x.strokeStyle=`rgba(${r.c},${(.6*a).toFixed(3)})`;x.lineWidth=1.8*(1-f)+.4;x.beginPath();x.ellipse(r.x,r.y,rr,rr*.62,0,0,7);x.stroke();}
    raf=requestAnimationFrame(frame);}
  if("IntersectionObserver" in window)new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis&&!raf){last=performance.now();raf=requestAnimationFrame(frame);}}).observe(c);else{vis=true;}
  window.addEventListener("resize",()=>{W=0;});
  c.addEventListener("pointerdown",e=>{const r=c.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top,n=performance.now();if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    [[0,"242,177,96"],[260,"201,167,245"],[520,"255,226,170"]].forEach(([d,col])=>ripples.push({x:px,y:py,t:n+d,c:col}));buzz(6);if(!raf){vis=true;last=performance.now();raf=requestAnimationFrame(frame);}});
  return {kick(){vis=true;W=0;last=performance.now();if(!raf)raf=requestAnimationFrame(frame);}};})();
function mHome(){fillMonth("m");if(typeof mNext==="function")mNext();
  weatherRow($("#mCiW"));
  $("#mCiT").textContent=profile.name?`How are you, ${nmShort()}?`:"How are you, really?";
  const sn={quiet:"Quiet",fire:"Fireside",rain:"Soft rain",ocean:"Ocean waves",forest:"Forest",brown:"Deep hum"};$("#mSetSum").textContent=`${sn[mSnd]||"Quiet"}, ${mInt?"bell every "+mInt+" min":"no interval bell"}`;
  const mi=MINFO[mMode];$("#mKick").textContent=mi[0];$("#mTitle").textContent=mi[1];$("#mCtx").textContent=mi[2];}
$("#mSetBtn").onclick=()=>openSheet("#mSetSheet");
$("#mCiW").addEventListener("click",e=>{const b=e.target.closest("[data-m]");if(b)loadMoods().then(()=>openCheckin(+b.dataset.m));});
$("#mCiTl").onclick=()=>{trackFrom="fire";openTrack("insights");};
$("#mMonth").onclick=()=>show("vale");


/* ================= BADGE ARTWORK: painted once per badge, then cached ================= */
const BADGE_PAL={journal:["#081830","#24407A",["#6F9BEA","#B9D2FF","#FFE6B0"]],bsess:["#1A0E06","#5A2E14",["#F2913D","#FFC779","#7FE3FF"]],msess:["#120A26","#3A2470",["#9A7CF0","#E59ACB","#FFE6B0"]],fire:["#2A0802","#7A1A05",["#FF5A14","#FFB347","#FFE7A3"]],water:["#021428","#063A66",["#1FA8E8","#7FE3FF","#E0FBFF"]],air:["#0C1E4A","#3D6FC2",["#9EC2FF","#FFFFFF","#FFC9EA"]],
  earth:["#071A0C","#1E4A1E",["#5FAE3A","#C9E86A","#FFE6A0"]],space:["#05041A","#1E1250",["#7A5CFF","#E04FD0","#7FD0FF"]],med:["#14051F","#4A1A5C",["#E07ABF","#C9A7F5","#FFF0FA"]],
  focus:["#06122A","#1C3A7A",["#4F7FE0","#9EC2FF","#FFFFFF"]],checkin:["#141A33","#3B4F8A",["#FFD86B","#9DBCE8","#FFFFFF"]],month:["#140A2A","#5A2E70",["#F2D98A","#FF8A3D","#C9A7F5"]]};
const MOTIF={journal:"M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6zM6 3v18M9 8h7M9 12h7M9 16h4",bsess:"M4 9h10a3 3 0 1 0-3-3M4 13h14a3 3 0 1 1-3 3M4 17h6",msess:"M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0zM12 7v5l3 2",fire:"M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.5 2-5 1 1.5 1.5 2 2.5 2C11 7.5 11 5 12 3z",water:"M3 10c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0",
  air:"M7 18a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 8.5 4.5 4.5 0 0 1 17.5 18z",earth:"M12 21V11M12 11c0-4 3-6 7-6 0 4-3 6-7 6zM12 13c0-3-2.5-5-6-5 0 3 2.5 5 6 5z",space:"M12 3l2 6.5L20.5 12 14 14l-2 7-2-7-6.5-2L10 9.5z",
  med:"M12 5c2 2.5 2 5 0 7-2-2-2-4.5 0-7zM4 13c3 0 6 1 8 4 2-3 5-4 8-4-1 4-4 6-8 6s-7-2-8-6z",focus:"M9 4h6M10 4v2M14 4v2M7 8h10l-1 10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2zM12 11c1 1.2 1.5 2 1.5 3a1.5 1.5 0 0 1-3 0c0-1 .5-1.8 1.5-3z",
  checkin:"M7 18a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 8.5 4.5 4.5 0 0 1 17.5 18zM12 3v2M5 6l1.4 1.4M19 6l-1.4 1.4",month:"M7 5h10a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3zM4 10h16M9 3v4M15 3v4M12 13l1 2 2 .3-1.5 1.4.4 2-1.9-1-1.9 1 .4-2-1.5-1.4 2-.3z"};
const BADGE_CACHE={};
function badgeArt(k,tier){const key=k+tier;if(BADGE_CACHE[key])return BADGE_CACHE[key];const W=300,H=400,c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");
  const [b1,b2,glow]=BADGE_PAL[k]||BADGE_PAL.space;let seed=[...key].reduce((a,ch)=>a*31+ch.charCodeAt(0),7)%233280;const rnd=()=>{seed=(seed*9301+49297)%233280;return seed/233280;};
  const bg=x.createLinearGradient(0,0,W,H);bg.addColorStop(0,b2);bg.addColorStop(1,b1);x.fillStyle=bg;x.fillRect(0,0,W,H);
  x.globalCompositeOperation="lighter";const n=4+tier*2;
  for(let i=0;i<n;i++){const px=W*(.1+rnd()*.9),py=H*(.05+rnd()*.75),r=50+rnd()*(70+tier*12),col=glow[i%3],g=x.createRadialGradient(px,py,0,px,py,r);
    g.addColorStop(0,col+(i%3===2?"44":"3a"));g.addColorStop(.45,col+"18");g.addColorStop(1,col+"00");x.fillStyle=g;x.fillRect(px-r,py-r,r*2,r*2);}
  for(let i=0;i<60+tier*40;i++){x.fillStyle=`rgba(255,255,255,${(.2+rnd()*.7).toFixed(2)})`;const sz=rnd()<.06?2.2:rnd()*1.3+.3;x.fillRect(rnd()*W,rnd()*H*.85,sz,sz);}
  x.globalCompositeOperation="source-over";
  try{const p=new Path2D(MOTIF[k]);x.save();x.translate(W*.56,H*.08);x.scale(8.2,8.2);x.lineCap="round";x.lineJoin="round";x.shadowColor=glow[2];x.shadowBlur=18+tier*4;x.strokeStyle=`rgba(255,255,255,${(.55+tier*.07).toFixed(2)})`;x.lineWidth=.9;x.stroke(p);x.shadowBlur=0;x.strokeStyle="rgba(255,255,255,.9)";x.lineWidth=.35;x.stroke(p);x.restore();}catch(e){}
  const fade=x.createLinearGradient(0,H*.5,0,H);fade.addColorStop(0,"rgba(0,0,0,0)");fade.addColorStop(1,"rgba(0,0,0,.55)");x.fillStyle=fade;x.fillRect(0,0,W,H);
  return BADGE_CACHE[key]=c.toDataURL("image/jpeg",.86);}
function badgeCard(k,i,size){const t=awSteps(k)[i],got=awGot(k,i),peek=!got&&/peek/.test(size||""),u=AW[k].unit==="days"?(t===1?"day":"days"):"minutes";
  const lock='<svg class="blk" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  const st=`<span class="bstair" style="--sc:${(BADGE_PAL[k]||BADGE_PAL.space)[2][1]}">${[0,1,2,3,4,5].map(j=>`<i class="${j<=i&&got?"on":j===i?"me":""}" style="height:${4+j*3}px"></i>`).join("")}</span>`;
  return `<span class="bcard2 ${size||""}${got?"":peek?" peeking":" locked"}" style="${got||peek?`background-image:url(${badgeArt(k,i+1)})`:""}">${st}${got?"":peek?lock:lock+`<svg class="bmot" viewBox="0 0 24 24" aria-hidden="true"><path d="${MOTIF[k]}"/></svg>`}<span class="bnum"><b>${t}</b><small>${u}</small></span></span>`;}
function medal(k,i,size){return badgeCard(k,i,size>80?"lg":"");}
const awOpen={};const FLAME='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.5 2-5 1 1.5 1.5 2 2.5 2C11 7.5 11 5 12 3z"/></svg>';
function renderAwards(){
  const total=AW_ORDER.reduce((a,k)=>a+awSteps(k).filter((t,i)=>awGot(k,i)).length,0),all=AW_ORDER.length*6;
  $("#awSummary").textContent=awPreview?"A preview of every badge.":total?`${total} of ${all} badges earned. Every practice and check-in counts.`:"Earn badges as your practice adds up: for each practice, for checking in, and for each month you show up.";
  const ds=profile.days||{},vals=Object.values(ds),bestDay=Math.round(Math.max(0,...vals)),daysN=vals.filter(v=>v>0).length,totalMin=Math.round(vals.reduce((a,v)=>a+v,0));
  const B=profile.best||{},pv=awPreview,mn=v=>Math.round((v||0)/60);const pb=[["Longest Fire",pv?8:mn(B.fire),"minutes","fire"],["Longest River",pv?10:mn(B.water),"minutes","water"],["Longest Sky",pv?12:mn(B.air),"minutes","air"],["Longest Earth",pv?10:mn(B.earth),"minutes","earth"],["Longest Space",pv?15:mn(B.space),"minutes","space"],["Longest meditation",pv?25:mn(B.med),"minutes","med"],["Most in a day",bestDay,"minutes","month"],["Days practised",daysN,daysN===1?"day":"days","checkin"],["Total practice",totalMin,"minutes","bsess"]];
  $("#pbRow").innerHTML=pb.map(([l,v,u,k])=>`<div class="pb"><span class="pbart${v?"":" zero"}" style="background-image:url(${badgeArt(k,6)})"><span class="bnum"><b>${v}</b><small>${u}</small></span></span><p>${l}</p></div>`).join("");
  const by={};for(const d in ds){const mk=d.slice(0,7);by[mk]=(by[mk]||0)+Math.min(40,ds[d]);}const mks=Object.keys(by).sort().reverse().slice(0,6);
  $("#hexRow").innerHTML=mks.length?mks.map(mk=>{const [y,m]=mk.split("-"),v=Math.round(by[mk]),f=Math.min(1,v/GLOW_GOAL);return `<span class="ringb${v>=GLOW_GOAL?" done":""}"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" class="rt"/><circle cx="50" cy="50" r="42" class="rf" stroke-dasharray="264" stroke-dashoffset="${(264*(1-f)).toFixed(0)}" transform="rotate(-90 50 50)"/></svg><small>${new Date(+y,+m-1,1).toLocaleDateString("en-AU",{month:"short"}).toUpperCase()}</small><b>${v}</b><i>minutes</i></span>`;}).join(""):'<p class="quiet">Each month you practise shows up here. Reach '+GLOW_GOAL+' minutes for a golden month.</p>';
  const lvl=1+Math.floor(total/3),into=total%3;$("#lvlCard").innerHTML=`<div class="lvtop"><span class="ylvl">${FLAME}Ember level ${lvl}</span><span>${total} of ${all} badges</span></div><div class="lvbar"><i style="width:${(into/3*100).toFixed(0)}%"></i></div><p>${3-into} more badge${3-into>1?"s":""} to Ember level ${lvl+1}. The last two badges in each row are stretch goals.</p>`;
  const near=[];AW_ORDER.forEach(k=>{const st=awSteps(k),h=awMins(k),i=st.findIndex(t=>h<t);if(i>=0)near.push([k,i,h/st[i]]);});near.sort((a,b)=>b[2]-a[2]);
  $("#closeRow").innerHTML=near.slice(0,6).map(([k,i])=>`<button class="bitem pv" data-k="${k}" data-i="${i}">${badgeCard(k,i)}<span class="bname">${AW[k].names[i]}</span></button>`).join("")||'<p class="quiet">Every badge earned. Remarkable.</p>';
  let grp="";$("#awards").innerHTML=AW_ORDER.map(k=>{const st=awSteps(k),n=st.filter((t,i)=>awGot(k,i)).length,head=AW[k].group!==grp?`<h2 class="awg">${(grp=AW[k].group)}</h2>`:"";
    return head+`<div class="awsec${awOpen[k]?" open":""}" data-k="${k}"><button class="awhd" data-open="${k}"><span><b>${AW[k].label}</b><small>${n} of 6</small></span><em>${awOpen[k]?"Show less":"See all"}</em></button><div class="bgrid">${st.map((t,i)=>`<button class="bitem" data-k="${k}" data-i="${i}" aria-label="${AW[k].names[i]}${awGot(k,i)?", earned":", not yet earned"}">${badgeCard(k,i)}<span class="bname">${AW[k].names[i]}</span></button>`).join("")}</div></div>`;}).join("");
  $("#awPrev").textContent=awPreview?"My badges":"Preview all";}
$("#awards").addEventListener("click",e=>{const o=e.target.closest("[data-open]");if(o){const k=o.dataset.open;awOpen[k]=!awOpen[k];renderAwards();return;}const b=e.target.closest(".bitem");if(b)showAward(b.dataset.k,+b.dataset.i,false);});
$("#closeRow").addEventListener("click",e=>{const b=e.target.closest(".bitem");if(b)showAward(b.dataset.k,+b.dataset.i,false);});
/* You page extras */
function renderYouExtras(){if($("#yFrAv")&&!$("#yFrAv").children.length)$("#yFrAv").innerHTML=companion(COMPANIONS.soma,58)+companion(COMPANIONS.orra,58);const ev=profile.ev||{},mins=Math.round((Object.values(ev).reduce((a,v)=>a+v,0)+(profile.med||0)+(profile.focus||0))/60);
  $("#ysMin").textContent=mins;$("#ysSes").textContent=profile.sessions||0;$("#ysCi").textContent=awMins("checkin");
  const got=AW_ORDER.reduce((a,k)=>a+awSteps(k).filter((t,i)=>awMins(k)>=t).length,0);$("#yLvl").innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.5 2-5 1 1.5 1.5 2 2.5 2C11 7.5 11 5 12 3z"/></svg>Ember level ${1+Math.floor(got/3)}`;
  const earned=[],next=[];AW_ORDER.forEach(k=>awSteps(k).forEach((t,i)=>{(awMins(k)>=t?earned:next).push([k,i,awMins(k)/t]);}));next.sort((a,b)=>b[2]-a[2]);
  const show=[...earned.slice(-3).reverse(),...next].slice(0,3);
  $("#yAchRow").innerHTML=show.map(([k,i])=>`<button class="bitem" data-k="${k}" data-i="${i}">${badgeCard(k,i)}<span class="bname">${AW[k].names[i]}</span></button>`).join("");}
$("#yAchRow").addEventListener("click",e=>{const b=e.target.closest(".bitem");if(b)showAward(b.dataset.k,+b.dataset.i,false);});
$("#yAchAll").onclick=()=>{renderAwards();show("awards");};
async function shareText(text,url){try{if(navigator.share){const d={title:"Emberkind",text};if(url)d.url=url;await navigator.share(d);return;}}catch(e){if(e&&e.name==="AbortError")return;}
  try{await navigator.clipboard.writeText(text+(url?" "+url:""));toast("Copied, ready to paste");}catch(e){toast("Sharing isn't available here");}}
$("#yShare").onclick=()=>{const m=$("#ysMin").textContent;shareText(`I've practised ${m} minutes with Emberkind, a calm place to land.`,EK_SHARE_URL);};
$("#yInvite").onclick=()=>shareText("Found this app for talking through things, gentle breathwork, meditation and a few cool tools for growth. It helps me understand myself better. I thought you might like it and we can use it together. There's even a world builder!\n"+EK_SHARE_URL);


/* ================= BREATHE PAGE: dial, monthly practice, next badge, thought, check-in ================= */
const B_WHEEL=makeWheel({el:$("#bWheel"),values:MINS,value:()=>bMins,change:v=>{const r=$("#bLen");r.value=v;r.dispatchEvent(new Event("input"));}});

function fillMonth(p){const mm=Math.round(monthMins(monthKey())),now=new Date(),last=new Date(now.getFullYear(),now.getMonth()+1,0).getDate(),left=last-now.getDate();
  $("#"+p+"MonNow").textContent=mm;$("#"+p+"MonGoal").textContent=" of "+GLOW_GOAL+" minutes";$("#"+p+"MonLeft").textContent=left+(left===1?" day left":" days left")+(mm>=GLOW_GOAL?". Goal reached":". Breathe, meditate and Task buddy all count");
  $("#"+p+"RingFill").setAttribute("stroke-dashoffset",(201*(1-Math.min(1,mm/GLOW_GOAL))).toFixed(1));$("#"+p+"MonM").textContent=now.toLocaleDateString("en-AU",{month:"short"}).toUpperCase();$("#"+p+"Month").classList.toggle("done",mm>=GLOW_GOAL);return mm;}
function weatherRow(el){if(!el.children.length)el.innerHTML=MOODS.map((n,i)=>`<button data-m="${i+1}" aria-label="${n}"><span class="mic" style="--sz:34px">${moodSVG(i+1)}</span><small>${n}</small></button>`).join("");}
function bHome(){try{fillMonth("b");const k=bScene,steps=awSteps(k),have=awMins(k),i=steps.findIndex(t=>have<t);
  if(i<0){$("#bNextB").innerHTML=badgeCard(k,5);$("#bNextP").style.width="100%";$("#bNextT").textContent="Every "+SCENES[k].name+" badge earned";$("#bNextS").textContent=cheer("light")+" Keep returning whenever it helps.";}
  else{$("#bNextB").innerHTML=badgeCard(k,i,"peek");$("#bNextP").style.width=Math.min(100,have/steps[i]*100).toFixed(0)+"%";$("#bNextT").textContent=AW[k].names[i];const need=Math.max(1,Math.ceil(steps[i]-have));$("#bNextS").textContent=`${need} more minute${need>1?"s":""} of ${SCENES[k].name} practice`;}
  const lv=valeLevel(k),it=VALE.els[k].items[lv];$("#bNextV").textContent=it?"In Embervale, next to grow: "+it.toLowerCase():"Your "+VALE.els[k].name.toLowerCase()+" in Embervale are fully grown";
  $("#bCiT").textContent=profile.name?`How are you, ${nmShort()}?`:"How are you, really?";weatherRow($("#bCiW"));requestAnimationFrame(()=>B_WHEEL.to(snapMins(bMins),false));}catch(e){}}
$("#bNext").onclick=()=>{renderAwards();show("awards");};
$("#bMonth").onclick=()=>show("vale");
$("#bCiW").addEventListener("click",e=>{const b=e.target.closest("[data-m]");if(b)loadMoods().then(()=>openCheckin(+b.dataset.m));});
$("#bCiTl").onclick=()=>{trackFrom="fire";openTrack("insights");};


$("#bSetBtn").onclick=()=>openSheet("#bSetSheet");syncSwitches();


/* ================= A LIVING SYSTEM: session memory, personal bests, companions that know your practice ================= */
function sessionLog(what,secs){profile.log=profile.log||[];profile.log.push({t:Date.now(),w:what,m:Math.round(secs/6)/10});if(profile.log.length>30)profile.log=profile.log.slice(-30);}
function bestCheck(key,aw,secs){profile.best=profile.best||{};const before=aw?awMins(aw):0;if(secs>(profile.best[key]||0))profile.best[key]=secs;if(aw)awardCheck(aw,before);}
function lifeContext(){try{const lines=[];const mm=Math.round(monthMins(monthKey()));if(mm)lines.push(`Practice this month: ${mm} of ${GLOW_GOAL} minutes towards their monthly goal.`);
  const lg=(profile.log||[]).slice(-6).reverse();if(lg.length)lines.push("Recent practice: "+lg.map(x=>`${x.w} (${x.m} min, ${new Date(x.t).toLocaleDateString("en-AU",{weekday:"short"})})`).join("; ")+".");
  const ev=profile.ev||{},fav=Object.keys(ev).sort((a,b)=>ev[b]-ev[a])[0];if(fav&&ev[fav]>120)lines.push(`The breath practice they return to most: ${SCENES[fav].name}.`);
  const got=AW_ORDER.reduce((a,k)=>a+awSteps(k).filter(t=>awMins(k)>=t).length,0);if(got)lines.push(`They have earned ${got} badges in Emberkind.`);
  if(!lines.length)return "";return "\n\nTHEIR PRACTICE IN EMBERKIND (use lightly and only when it helps. You can suggest a fitting practice in the app, such as an Earth breath for anxiety, River for a busy mind, or a body scan before sleep, but never push, praise excessively or turn it into a score.)\n"+lines.join("\n");}catch(e){return "";}}
/* a suggestion on Home that fits the moment: time of day and today's check-in */
function forYou(){const h=new Date().getHours(),today=(typeof moods!=="undefined"?moods:[]).filter(x=>x.mood&&dayKey(x.at)===dayKey(Date.now())).slice(-1)[0];let k,why;
  if(today&&today.mood<=2){k=["earth","Root into the earth","Your check-in today felt heavy. Grounding breath can help the body feel a little steadier."];}
  else if(today&&today.tags&&today.tags.some(t=>/overwhelmed|anxious|on edge|restless/.test(t))){k=["earth","Root into the earth","For the anxious edge you noticed today."];}
  else if(h>=5&&h<12){k=["fire","Feed the fire","A gentle energising breath to start your day."];}
  else if(h>=12&&h<17){k=["earth","Root into the earth","Steady yourself in the middle of the day."];}
  else if(h>=17&&h<21){k=["water","Let the river carry it","Let the day's thoughts float downstream."];}
  else{k=["space","Feel the space","A spacious breath to settle before sleep."];}
  const el=$("#forYou");if(!el)return;el.querySelector(".fyt").textContent=k[1];el.querySelector(".fyd").textContent=k[2];if(el.dataset.k!==k[0]||!$("#fyArt").innerHTML)$("#fyArt").innerHTML=FY_ART[k[0]]||FY_ART.fire;el.dataset.k=k[0];el.className="fy fy-"+k[0];}
$("#forYou").onclick=()=>{const k=$("#forYou").dataset.k;if(k==="med"){mMode="scan";openMeditate();}else{bScene=k;sceneUI();show("breathe");}};
ready.then(()=>loadMoods()).then(forYou).catch(()=>{});
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&typeof forYou==="function")forYou();});


/* ================= INSTALL: a quiet banner at the top, only where installing is possible ================= */
(function(){const bar=$("#instBar"),KEY="ek-install-dismissed",MONTH=30*864e5;let shownT=null;
  const standalone=()=>matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
  const iosSafari=()=>{const ua=navigator.userAgent||"",ios=/iPad|iPhone|iPod/.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);return ios&&/Safari/.test(ua)&&!/CriOS|FxiOS|EdgiOS|OPiOS|Instagram|FBAN|FBAV|Line\//.test(ua);};
  function mode(){if(!document.querySelector('link[rel="manifest"]')||window.top!==window||standalone())return null;
    const d=+(lsGet(KEY)||0);if(d&&Date.now()-d<MONTH)return null;if(window.__bip)return "prompt";if(iosSafari())return "ios";return null;}
  function hide(){bar.classList.remove("on");setTimeout(()=>{bar.hidden=true;},350);}
  function show(){const m=mode();if(!m||!bar.hidden)return;if(app.classList.contains("app-welcome")){setTimeout(show,2500);return;}
    bar.classList.toggle("ios",m==="ios");$("#instTxt").innerHTML=m==="ios"?'Tap the <svg viewBox="0 0 24 24" aria-label="three lines"><path d="M5 7h14M5 12h14M5 17h10"/></svg> <b>three lines</b> beside the web address, then <b>Share</b>, then <b>Add to Home Screen</b>.':"";
    $("#instGo").hidden=m==="ios";bar.hidden=false;requestAnimationFrame(()=>bar.classList.add("on"));}
  function later(){clearTimeout(shownT);shownT=setTimeout(show,3500);}
  $("#instGo").onclick=async()=>{const e=window.__bip;if(!e){hide();return;}window.__bip=null;try{e.prompt();const r=await e.userChoice;if(r&&r.outcome==="accepted")toast("Emberkind is on its way to your home screen");}catch(err){}hide();};
  $("#instX").onclick=()=>{lsSet(KEY,String(Date.now()));hide();};
  window.addEventListener("ek-bip",later);window.addEventListener("appinstalled",()=>{window.__bip=null;hide();});
  later();})();


/* Meditate shows its next badge the same way Breathe does */
function mNext(){try{const opts=["med","msess"].map(k=>{const st=awSteps(k),h=awMins(k),i=st.findIndex(t=>h<t);return i<0?null:[k,i,h/st[i]];}).filter(Boolean).sort((a,b)=>b[2]-a[2]);
  if(!opts.length){$("#mNextB").innerHTML=badgeCard("med",5);$("#mNextP").style.width="100%";$("#mNextT").textContent="Every meditation badge earned";$("#mNextS").textContent=cheer("still")+" Keep returning whenever it helps.";}
  else{const [k,i,f]=opts[0],t=awSteps(k)[i];$("#mNextB").innerHTML=badgeCard(k,i,"peek");$("#mNextP").style.width=Math.min(100,f*100).toFixed(0)+"%";$("#mNextT").textContent=AW[k].names[i];
    $("#mNextS").textContent=k==="msess"?`Sit for ${t} minutes in one meditation`:`${Math.max(1,Math.ceil(t-awMins(k)))} more minutes of meditation`;}
  const mm=Math.round(monthMins(monthKey()));$("#mNextV").textContent=mm>=GLOW_GOAL?`This month's ${LIMITED[new Date().getMonth()]} is yours`:`${GLOW_GOAL-mm} more minutes this month earns the ${LIMITED[new Date().getMonth()]}`;}catch(e){}}
$("#mNext").onclick=()=>{renderAwards();show("awards");};


/* ================= TOUCH: small, gentle responses that fade within three seconds ================= */
const FX=(function(){const c=$("#fxCanvas"),x=c.getContext("2d");let W=0,H=0,D=1,parts=[],raf=0,last=0;
  const reduce=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
  function size(){const r=c.getBoundingClientRect();D=Math.min(devicePixelRatio||1,1.5);if(r.width!==W||r.height!==H){W=r.width;H=r.height;c.width=W*D;c.height=H*D;}x.setTransform(D,0,0,D,0,0);}
  /* 3.4.1: stays its true size after a display-mode switch or resize */window.addEventListener("ekmode",()=>{try{size();}catch(e){}});window.addEventListener("resize",()=>{try{size();}catch(e){}});
  function add(kind,px,py){const R=Math.random,now=performance.now();
    if(kind==="fire")for(let i=0;i<18;i++)parts.push({k:"spark",x:px,y:py,vx:(R()-.5)*60,vy:-40-R()*90,r:1.2+R()*2.2,t0:now,life:1.6+R()*1.4,col:R()<.5?"255,199,121":R()<.7?"255,150,80":"255,236,190"});
    if(kind==="water"){parts.push({k:"leaf",x:px,y:py,t0:now,life:3,rot:R()*6,sw:R()*6});parts.push({k:"ring",x:px,y:py+60,t0:now+900,life:2.1,col:"200,240,255",max:60});}
    if(kind==="air")for(let i=0;i<5;i++)parts.push({k:"puff",x:px+(i-2)*14,y:py+(R()-.5)*10,r:12+R()*10,t0:now,life:3,dx:12+R()*10});
    if(kind==="earth"){parts.push({k:"rock",x:px,y:py,vy:0,t0:now,life:3,floor:py+70,w:12+R()*8,bounced:false});}
    if(kind==="space"){const a=Math.PI*(.7+R()*.25);parts.push({k:"comet",x:px,y:py,dx:Math.cos(a),dy:Math.sin(a)*.55+.35,t0:now,life:3});}
    if(!raf){last=now;raf=requestAnimationFrame(frame);}}
  function frame(now){raf=0;size();x.clearRect(0,0,W,H);const dt=Math.min(.05,(now-last)/1000);last=now;
    parts=parts.filter(p=>(now-p.t0)/1000<p.life||now<p.t0);
    x.globalCompositeOperation="lighter";
    for(const p of parts){if(now<p.t0)continue;const t=(now-p.t0)/1000,f=t/p.life,fade=Math.max(0,1-Math.pow(f,1.6));
      if(p.k==="spark"){p.vy+=10*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;const g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);g.addColorStop(0,`rgba(${p.col},${(.9*fade).toFixed(3)})`);g.addColorStop(1,`rgba(${p.col},0)`);x.fillStyle=g;x.fillRect(p.x-p.r*4,p.y-p.r*4,p.r*8,p.r*8);}
      else if(p.k==="ring"||p.k==="ripple"){const rr=6+f*(p.max||110);x.strokeStyle=`rgba(${p.col},${(.55*fade).toFixed(3)})`;x.lineWidth=1.6;x.beginPath();x.ellipse(p.x,p.y,rr,rr*(p.k==="ring"?.35:1),0,0,7);x.stroke();}
      else if(p.k==="puff"){x.globalCompositeOperation="source-over";const r=p.r*(1+f*.8),cx=p.x+p.dx*t,g=x.createRadialGradient(cx,p.y,0,cx,p.y,r);g.addColorStop(0,`rgba(255,255,255,${(.55*fade).toFixed(3)})`);g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;x.beginPath();x.arc(cx,p.y,r,0,7);x.fill();x.globalCompositeOperation="lighter";}
      else if(p.k==="leaf"){x.globalCompositeOperation="source-over";const yy=p.y+Math.min(60,t*40),xx=p.x+Math.sin(t*2.2+p.sw)*14;x.save();x.translate(xx,yy);x.rotate(p.rot+Math.sin(t*2)*.6);x.globalAlpha=fade;x.fillStyle="#7DBE5A";x.beginPath();x.ellipse(0,0,11,5,0,0,7);x.fill();x.strokeStyle="#4E8A36";x.lineWidth=1;x.beginPath();x.moveTo(-10,0);x.lineTo(10,0);x.stroke();x.restore();x.globalCompositeOperation="lighter";}
      else if(p.k==="rock"){x.globalCompositeOperation="source-over";p.vy+=900*dt;p.y+=p.vy*dt;if(p.y>p.floor){p.y=p.floor;if(!p.bounced){p.vy*=-.32;p.bounced=true;for(let i=0;i<6;i++)parts.push({k:"dust",x:p.x+(Math.random()-.5)*16,y:p.floor+4,vx:(Math.random()-.5)*40,vy:-20-Math.random()*20,t0:now,life:1.2});}else p.vy=0;}
        x.save();x.globalAlpha=fade;const g=x.createRadialGradient(p.x-p.w*.3,p.y-p.w*.35,1,p.x,p.y,p.w);g.addColorStop(0,"#B9A58C");g.addColorStop(1,"#5E4B3A");x.fillStyle=g;x.beginPath();x.ellipse(p.x,p.y,p.w,p.w*.68,0,0,7);x.fill();x.restore();x.globalCompositeOperation="lighter";}
      else if(p.k==="dust"){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=40*dt;x.fillStyle=`rgba(210,180,140,${(.5*fade).toFixed(3)})`;x.beginPath();x.arc(p.x,p.y,1.6,0,7);x.fill();}
      else if(p.k==="comet"){const travel=Math.min(1,t/1.1),L=220*travel,hx=p.x+p.dx*L,hy=p.y+p.dy*L,tl=70,g=x.createLinearGradient(hx,hy,hx-p.dx*tl,hy-p.dy*tl);
        g.addColorStop(0,`rgba(255,255,255,${(.95*fade).toFixed(3)})`);g.addColorStop(.35,`rgba(200,170,255,${(.6*fade).toFixed(3)})`);g.addColorStop(1,"rgba(150,110,255,0)");x.strokeStyle=g;x.lineWidth=1.6;x.lineCap="round";x.beginPath();x.moveTo(hx,hy);x.lineTo(hx-p.dx*tl,hy-p.dy*tl);x.stroke();
        const hg=x.createRadialGradient(hx,hy,0,hx,hy,7);hg.addColorStop(0,`rgba(255,255,255,${fade.toFixed(3)})`);hg.addColorStop(1,"rgba(200,170,255,0)");x.fillStyle=hg;x.fillRect(hx-7,hy-7,14,14);}}
    x.globalCompositeOperation="source-over";if(parts.length)raf=requestAnimationFrame(frame);else x.clearRect(0,0,W,H);}
  return {tap(kind,px,py){if(reduce())return;size();add(kind,px,py);buzz(6);}};})();
$("#view-breathe").addEventListener("pointerdown",e=>{if(bMode!=="idle"||e.target.closest("button,a,input,.bpanel,.person,.bside"))return;const r=$("#bscene").getBoundingClientRect();
  if(e.clientY>r.bottom||e.clientY<r.top)return;FX.tap(bScene,e.clientX-r.left,e.clientY-r.top);});


/* ================= CHECK-IN: an immersive, one-question-at-a-time flow ================= */
const CI_EN=[["Drained",1],["Low",2],["Steady",3],["Good",4],["Buzzing",5]];
const CI_IC={"Slept well":'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',"Poor sleep":'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/><path d="M15 4l4 4M19 4l-4 4"/>',"Moved my body":'<circle cx="14" cy="4.5" r="2"/><path d="M8 21l3-6 3 2v4M6 12l4-4 4 2 3 3"/>',
 "Time outside":'<path d="M12 22v-6M12 16l-5-1 5-11 5 11z"/>',"Saw people":'<circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M3 19c.8-3 2.8-4.5 5-4.5s4.2 1.5 5 4.5M11 19c.8-3 2.8-4.5 5-4.5s4.2 1.5 5 4.5"/>',"Alone time":'<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 3.8-6 7-6s6 2 7 6"/>',
 "Work stress":'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 13h18"/>',"Creative time":'<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-2 0-3 3 0 4-1a6 6 0 0 0-6-12z"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="7" r="1"/><circle cx="16" cy="10" r="1"/>',
 "Screens late":'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',"Ate well":'<path d="M3 12h18a9 9 0 0 1-18 0zM8 8c0-2 2-2 2-4M13 8c0-2 2-2 2-4"/>',"Skipped meals":'<path d="M3 12h18a9 9 0 0 1-18 0z" stroke-dasharray="2 3"/>',
 "Caffeine":'<path d="M4 9h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 11h2a2 2 0 0 1 0 4h-2M8 3v3M12 3v3"/>',"Conflict":'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',"Rested":'<path d="M3 18v-6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6M3 15h18M17 4h4l-4 4h4"/>',
 "Practised in Emberkind":'<path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.5 2-5 1 1.5 1.5 2 2.5 2C11 7.5 11 5 12 3z"/>'};
const CI_SKY=[["#141633","#2B3157","#4A5578"],["#1D2440","#3E4F78","#6E86B8"],["#232634","#4A4F66","#8E93A8"],["#1E2B3A","#4D7A8E","#B9D8C2"],["#2A1D16","#B46A2A","#F5B54A"],["#2A1A0E","#E08A2E","#FFE08A"]];
let ci={step:0,mood:3,energy:3,ctx:new Set(),feel:new Set(),from:null};
function ciSky(){const c=CI_SKY[ci.mood-1];$("#ciSky").style.background=`radial-gradient(120% 70% at 50% 0%,${c[2]}55,transparent 60%),linear-gradient(${c[1]},${c[0]} 70%)`;$("#ciFlow").dataset.mood=ci.mood;}
function ciRender(){const s=ci.step;$("#ciFlow").dataset.step=s;if(s===5)ci.guard=Date.now()+700;document.querySelectorAll("#ciFlow .cistep").forEach(el=>el.classList.toggle("on",+el.dataset.s===s));
  $("#ciDots").innerHTML=[0,1,2,3,4].map(i=>`<i class="${i<s?"done":i===s?"on":""}"></i>`).join("");$("#ciDots").style.visibility=s===5?"hidden":"visible";
  $("#ciBack").style.visibility=s>0&&s<5?"visible":"hidden";$("#ciSkip").hidden=!(s===2||s===3||s===4);
  $("#ciNext").textContent=s===4?"Save check-in":s===5?(ci.from&&ci.from!=="track"?"Back to "+({fire:"Home",breathe:"Regulate",meditate:"Meditate",chats:"Chats",vale:"Embervale",you:"You"}[ci.from]||"where you were"):"Done"):"Next";
  $("#ciArt").innerHTML=moodSVG(ci.mood);$("#ciMoodName").textContent=MOODS[ci.mood-1];
  $("#ciRow").querySelectorAll("button").forEach(b=>b.setAttribute("aria-checked",+b.dataset.m===ci.mood));
  $("#ciEn").querySelectorAll("button").forEach(b=>b.setAttribute("aria-checked",+b.dataset.e===ci.energy));ciSky();}
function openCheckin(m){loadMoods();const er=$("#ciErr");if(er)er.hidden=true;ci={step:0,mood:m||3,energy:3,ctx:new Set(),feel:new Set(),from:currentView};$("#ciNoteF").value="";
  $("#ciQ0").textContent=profile.name?`How's the weather inside, ${profile.name}?`:"How's the weather inside?";
  if(!$("#ciRow").children.length){$("#ciRow").innerHTML=MOODS.map((n,i)=>`<button role="radio" data-m="${i+1}" aria-label="${n}"><span class="mic" style="--sz:40px">${moodSVG(i+1)}</span></button>`).join("");
    $("#ciEn").innerHTML=CI_EN.map(([n,v])=>`<button role="radio" data-e="${v}"><i style="--h:${18+v*12}px"></i><span>${n}</span></button>`).join("");
    $("#ciCtxG").innerHTML=CI_CTX.map(t=>`<button aria-pressed="false" data-v="${t}"><svg viewBox="0 0 24 24" aria-hidden="true">${CI_IC[t]||CI_IC["Rested"]}</svg><span>${t}</span></button>`).join("");
    $("#ciFl").innerHTML=CI_FEEL.map(w=>`<button aria-pressed="false" data-v="${w}">${w}</button>`).join("");}
  document.querySelectorAll("#ciCtxG button,#ciFl button").forEach(b=>b.setAttribute("aria-pressed","false"));
  if(m)ci.step=0;const f=$("#ciFlow");f.hidden=false;requestAnimationFrame(()=>f.classList.add("open"));document.body.classList.add("ci-open");ciRender();}
function ciClose(){const f=$("#ciFlow");f.classList.remove("open");document.body.classList.remove("ci-open");setTimeout(()=>{f.hidden=true;},350);}
let ciSaving=false;
async function ciSave(){if(ciSaving)return;ciSaving=true;const btn=$("#ciNext");btn.disabled=true;btn.textContent="Saving...";
  try{const note=$("#ciNoteF").value.trim().slice(0,2000);const a=document.activeElement;if(a&&a.blur)a.blur();
    try{await Promise.race([loadMoods(),new Promise(r=>setTimeout(r,2500))]);}catch(e){}
    const ciBefore=awMins("checkin"),jb=awMins("journal"),entry={at:Date.now(),mood:ci.mood,energy:ci.energy,tags:[...ci.feel,...ci.ctx],note};ci.saved=entry;
    moods.push(entry);try{saveMoods();}catch(e){}
    if(!moods.some(x=>x.at===entry.at))throw new Error("not stored");
    profile.checkins=(profile.checkins||0)+1;profile.ciDays=awMins("checkin");try{saveProfile();}catch(e){}
    setTimeout(()=>{awardCheck("checkin",ciBefore);if(note)setTimeout(()=>awardCheck("journal",jb),1400);},700);
    const tags=[...ci.feel,...ci.ctx],wk=Date.now()-7*864e5,n=moods.filter(x=>x.mood&&x.at>wk).length,nm=profile.name?", "+profile.name:"";
    $("#ciDoneT").textContent=ci.mood<=2?`Thank you for checking in${nm}. Go gently.`:`${cheer("quiet")} Thanks for checking in${nm}.`;
    $("#ciLead").textContent=(ci.mood<=2?"Noticing a hard day takes courage. ":"")+"Every check-in is a small act of self-awareness. Over time your patterns become clear: what lifts you, what drains you and what you need. That understanding is where better choices, more ease and inner freedom begin."+(n>1?` That's ${n} check-ins this week.`:"");
    $("#ciCard").innerHTML=`<span class="mic" style="--sz:72px">${moodSVG(ci.mood)}</span><b>${MOODS[ci.mood-1]}</b><small>Energy: ${CI_EN[ci.energy-1][0]}</small>${tags.length?`<p>${esc(tags.join(", "))}</p>`:""}${note?`<em>${esc(note)}</em>`:""}`;
    ci.step=5;btn.disabled=false;ciRender();
    try{if(currentView==="track")tShow(tTab);}catch(e){}try{if(typeof renderYouCards==="function")renderYouCards();}catch(e){}try{if(typeof forYou==="function")forYou();}catch(e){}
    try{if(typeof bHome==="function"&&currentView==="breathe")bHome();if(typeof mHome==="function"&&currentView==="meditate")mHome();}catch(e){}}
  catch(e){btn.disabled=false;ciRender();$("#ciErr").hidden=false;console.error(e);}
  finally{ciSaving=false;}}
$("#ciRow").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;ci.mood=+b.dataset.m;buzz(6);ciRender();});
$("#ciEn").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;ci.energy=+b.dataset.e;buzz(6);ciRender();});
$("#ciCtxG").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const on=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",on);on?ci.ctx.add(b.dataset.v):ci.ctx.delete(b.dataset.v);buzz(4);});
$("#ciFl").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const on=b.getAttribute("aria-pressed")!=="true";if(on&&ci.feel.size>=3){toast("Up to three is plenty");return;}b.setAttribute("aria-pressed",on);on?ci.feel.add(b.dataset.v):ci.feel.delete(b.dataset.v);buzz(4);});
let ciTapT=0;$("#ciNext").onclick=()=>{if(ci.step===5&&Date.now()<(ci.guard||0))return;const now=Date.now();if(now-ciTapT<180)return;ciTapT=now;const a=document.activeElement;if(a&&a.blur&&a.tagName==="TEXTAREA")a.blur();
  if(ci.step===4){ciSave();return;}if(ci.step===5){ciClose();toast(window.EK_STANDALONE&&(profile.checkins||0)<=1?"Saved on this device. Back up in You.":"Check-in saved. See it anytime in Check-in.");if(ci.mood<=2)setTimeout(warnCheck,600);return;}ci.step++;ciRender();};
$("#ciSkip").onclick=()=>{if(ci.step===4){$("#ciNoteF").value="";ciSave();return;}ci.step++;ciRender();};
$("#ciBack").onclick=()=>{if(ci.step>0&&ci.step<5){ci.step--;ciRender();}};
$("#ciClose").onclick=ciClose;
$("#ciTalk").onclick=()=>{if(Date.now()<(ci.guard||0))return;const x=ci.saved;ciClose();openChat("soma",`I just checked in feeling ${MOODS[ci.mood-1].toLowerCase()}${ci.feel.size?" ("+[...ci.feel].join(", ")+")":""}. Can we talk it through?`,entryContext(x));};
$("#ciSeeP").onclick=()=>{if(Date.now()<(ci.guard||0))return;ciClose();trackFrom="fire";openTrack("insights");};


/* artwork for the "For you right now" card, matched to each practice */
const FY_ART={
 fire:`<svg viewBox="0 0 160 120"><defs><radialGradient id="fyG1" cx="50%" cy="80%" r="60%"><stop offset="0" stop-color="#FFB35A" stop-opacity=".7"/><stop offset="1" stop-color="#FFB35A" stop-opacity="0"/></radialGradient><linearGradient id="fyF1" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#E8642C"/><stop offset=".6" stop-color="#FF9A3C"/><stop offset="1" stop-color="#FFD27A"/></linearGradient><linearGradient id="fyF2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFC779"/><stop offset="1" stop-color="#FFF6D8"/></linearGradient></defs>
   <ellipse cx="88" cy="96" rx="60" ry="34" fill="url(#fyG1)"/><g class="fyfl"><path d="M88 100c-20 0-29-13-25-31 3-13 15-20 13-37 13 9 20 22 18 33 5-4 8-11 7-18 10 9 13 20 11 31-2 13-11 22-24 22z" fill="url(#fyF1)"/><path d="M88 100c-9 0-14-6-12-15 1-7 7-11 7-19 7 6 11 13 10 19 3-2 4-5 4-8 5 5 6 10 5 14-1 6-6 9-14 9z" fill="url(#fyF2)"/></g>
   <rect x="52" y="98" width="72" height="8" rx="4" fill="#5A3A22" transform="rotate(-6 88 102)"/><rect x="52" y="98" width="72" height="8" rx="4" fill="#6B4428" transform="rotate(6 88 102)"/>
   <g class="fyem"><circle cx="80" cy="60" r="1.6" fill="#FFD27A"/><circle cx="96" cy="54" r="1.3" fill="#FFB35A"/><circle cx="88" cy="46" r="1.2" fill="#FFF0C8"/><circle cx="104" cy="66" r="1.4" fill="#FFC779"/></g></svg>`,
 earth:`<svg viewBox="0 0 160 120"><circle class="fysun" cx="124" cy="30" r="14" fill="#FFE6A0"/><circle cx="124" cy="30" r="24" fill="#FFE6A0" opacity=".18"/>
   <path d="M0 96c30-14 60-18 90-12s52 6 70 0v36H0z" fill="#6E8F3E"/><path d="M0 104c40-8 80-8 160 0v16H0z" fill="#4E6B2C"/><path d="M0 112h160v8H0z" fill="#5A3A1E"/>
   <g class="fysap"><path d="M78 98V64" stroke="#3E6B2A" stroke-width="3" stroke-linecap="round"/><path d="M78 74c-12 0-18-8-18-16 12 0 18 8 18 16z" fill="#8DC45A"/><path d="M78 66c12 0 18-8 18-16-12 0-18 8-18 16z" fill="#A6D86A"/></g>
   <g stroke="#C9A86A" stroke-width="1.4" stroke-linecap="round" opacity=".6"><path d="M78 100l-8 10M78 100l9 9M78 100v12"/></g></svg>`,
 water:`<svg viewBox="0 0 160 120"><path d="M0 70c40-18 120-18 160 0v50H0z" fill="#0B5C96" opacity=".55"/>
   <g class="fywv"><path d="M-40 78c20-8 40-8 60 0s40 8 60 0 40-8 60 0 40 8 60 0" stroke="#7FE3FF" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/><path d="M-40 94c20-8 40-8 60 0s40 8 60 0 40-8 60 0 40 8 60 0" stroke="#BFF0FF" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55"/></g>
   <g class="fylf"><ellipse cx="92" cy="74" rx="16" ry="7" fill="#7DBE5A" transform="rotate(-14 92 74)"/><path d="M78 77L106 70" stroke="#4E8A36" stroke-width="1.2"/></g>
   <ellipse class="fyrp" cx="92" cy="80" rx="20" ry="5" fill="none" stroke="#E0FBFF" stroke-width="1.2"/></svg>`,
 space:`<svg viewBox="0 0 160 120"><defs><radialGradient id="fyS1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".3" stop-color="#C9B8FF" stop-opacity=".8"/><stop offset="1" stop-color="#7A5CFF" stop-opacity="0"/></radialGradient></defs>
   <circle cx="100" cy="56" r="34" fill="url(#fyS1)" opacity=".7"/><path class="fystar" d="M100 34l5 17 17 5-17 5-5 17-5-17-17-5 17-5z" fill="#F4EEFF"/>
   <g class="fytw" fill="#fff"><circle cx="24" cy="20" r="1.2"/><circle cx="52" cy="42" r="1"/><circle cx="140" cy="18" r="1.3"/><circle cx="148" cy="80" r="1"/><circle cx="36" cy="88" r="1.2"/><circle cx="70" cy="104" r=".9"/><circle cx="128" cy="104" r="1.1"/><circle cx="12" cy="60" r=".9"/></g>
   <g class="fysh"><path d="M20 10L70 40" stroke="url(#fyS2)" stroke-width="1.6" stroke-linecap="round"/><linearGradient id="fyS2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8A7BFF" stop-opacity="0"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient></g></svg>`,
 med:`<svg viewBox="0 0 160 120"><g class="fyrg" fill="none" stroke="#E6D6FF"><ellipse cx="96" cy="64" rx="22" ry="14" opacity=".7"/><ellipse cx="96" cy="64" rx="40" ry="25" opacity=".45"/><ellipse cx="96" cy="64" rx="58" ry="36" opacity=".25"/></g><circle cx="96" cy="64" r="16" fill="#FFE6B0" opacity=".9"/><circle cx="96" cy="64" r="30" fill="#F2B160" opacity=".2"/></svg>`};


/* ================= SESSION VOLUME: a small side button that opens a tall, thin slider ================= */
(function(){const wrap=$("#sVol"),btn=$("#sVolBtn"),pop=$("#sVolPop"),fill=$("#sVolFill"),thumb=$("#sVolThumb");let hideT=null;
  function draw(){const v=Math.round(appVol*100);fill.style.height=v+"%";thumb.style.bottom=`calc(${v}% - 9px)`;pop.setAttribute("aria-valuenow",v);btn.classList.toggle("mute",appVol===0);}
  function open(on){wrap.classList.toggle("open",on);btn.setAttribute("aria-expanded",on);clearTimeout(hideT);if(on)hideT=setTimeout(()=>open(false),3500);}
  function setFrom(e){const r=pop.querySelector(".svtrack").getBoundingClientRect();const v=Math.min(1,Math.max(0,(r.bottom-e.clientY)/r.height));setAppVolume(v);draw();open(true);}
  btn.addEventListener("click",e=>{e.stopPropagation();draw();open(!wrap.classList.contains("open"));});
  let drag=false;pop.addEventListener("pointerdown",e=>{e.stopPropagation();drag=true;pop.setPointerCapture(e.pointerId);setFrom(e);});
  pop.addEventListener("pointermove",e=>{if(drag)setFrom(e);});["pointerup","pointercancel"].forEach(t=>pop.addEventListener(t,()=>{drag=false;}));
  pop.addEventListener("keydown",e=>{if(e.key==="ArrowUp"||e.key==="ArrowDown"){e.preventDefault();setAppVolume(appVol+(e.key==="ArrowUp"?.05:-.05));draw();open(true);}});
  wrap.addEventListener("click",e=>e.stopPropagation());document.addEventListener("pointerdown",e=>{if(!wrap.contains(e.target))open(false);});
  window.sessionVolume=on=>{wrap.hidden=!on;if(!on)open(false);else draw();};})();


/* ================= SESSION CONTROLS: respond the instant a finger lifts, even if it drifted a little ================= */
function tapAction(el,fn){if(!el||!fn)return;let st=null,skipUntil=0;
  const run=()=>{try{fn();}catch(e){console.error(e);}};
  el.addEventListener("pointerdown",e=>{st={id:e.pointerId,x:e.clientX,y:e.clientY};try{el.setPointerCapture(e.pointerId);}catch(err){}},{passive:true});
  el.addEventListener("pointerup",e=>{if(st&&st.id===e.pointerId&&Math.hypot(e.clientX-st.x,e.clientY-st.y)<40){e.preventDefault();skipUntil=Date.now()+500;run();}st=null;});
  el.addEventListener("pointercancel",()=>{st=null;});
  el.onclick=()=>{if(Date.now()<skipUntil){skipUntil=0;return;}run();};}
["bEnd","bPause","mEnd","mPause","fEnd","fPause","ciNext","ciSkip","ciBack","ciClose","ciTalk","ciSeeP"].forEach(id=>{const el=document.getElementById(id);if(el&&el.onclick){const f=el.onclick;el.onclick=null;tapAction(el,f);}});


/* ================= MOOD HISTORY: week, month and all time ================= */
let mh={range:"month",off:0,sel:null};
function mhDays(){const m=new Map();for(const x of moods){const k=dayKey(x.at);if(!m.has(k))m.set(k,{list:[],ms:[]});const d=m.get(k);d.list.push(x);if(x.mood)d.ms.push(x.mood);}
  m.forEach(d=>{d.avg=d.ms.length?d.ms.reduce((a,b)=>a+b,0)/d.ms.length:0;});return m;}
function mhCell(dm,date,cls){const k=dayKey(date),d=dm.get(k),a=d&&d.avg?Math.round(d.avg):0,today=k===dayKey(Date.now()),sel=mh.sel===k;
  return `<button class="mhc ${cls||""}${today?" today":""}${sel?" sel":""}${d?" has":""}" data-k="${k}" aria-label="${date.toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"})}${a?", "+MOODS[a-1]:""}">`;}
function mhStats(list){const ms=list.filter(x=>x.mood),days=new Set(list.map(x=>dayKey(x.at))).size;
  if(!list.length)return '<p class="quiet">No check-ins here yet. Each one you add fills in this picture.</p>';
  const avg=ms.length?Math.round(ms.reduce((a,x)=>a+x.mood,0)/ms.length):0,dist=[0,0,0,0,0,0];ms.forEach(x=>dist[x.mood-1]++);
  const tags={};list.forEach(x=>(x.tags||[]).forEach(t=>tags[t]=(tags[t]||0)+1));const top=Object.entries(tags).sort((a,b)=>b[1]-a[1]).slice(0,5);
  return `<div class="mhsrow"><div><b>${avg?MOODS[avg-1]:"None"}</b><small>usual weather</small></div><div><b>${ms.length}</b><small>check-ins</small></div><div><b>${days}</b><small>${days===1?"day":"days"}</small></div></div>
   ${ms.length?`<div class="mhdist" aria-label="Mood mix">${dist.map((n,i)=>n?`<i style="flex:${n};background:${MCOL[i]}" title="${MOODS[i]}: ${n}"></i>`:"").join("")}</div><div class="mhdl">${dist.map((n,i)=>n?`<span><i style="background:${MCOL[i]}"></i>${MOODS[i]} ${n}</span>`:"").join("")}</div>`:""}
   ${top.length?`<p class="mhk">Most often part of your days</p><div class="mhtags">${top.map(([t,n])=>`<span>${esc(t)} <b>${n}</b></span>`).join("")}</div>`:""}`;}
function mhRender(){const dm=mhDays(),now=new Date();let html="",label="",list=[];
  document.querySelectorAll("#mhSeg button").forEach(b=>b.setAttribute("aria-checked",b.dataset.r===mh.range));
  if(mh.range==="week"){const st=new Date(now.getFullYear(),now.getMonth(),now.getDate()-((now.getDay()+6)%7)+mh.off*7);const en=new Date(st.getTime()+6*864e5);
    label=`${st.toLocaleDateString("en-AU",{day:"numeric",month:"short"})} to ${en.toLocaleDateString("en-AU",{day:"numeric",month:"short"})}`;
    html='<div class="mhweek">'+[0,1,2,3,4,5,6].map(i=>{const d=new Date(st.getFullYear(),st.getMonth(),st.getDate()+i),x=dm.get(dayKey(d)),a=x&&x.avg?Math.round(x.avg):0;
      return mhCell(dm,d,"wk")+`<small>${d.toLocaleDateString("en-AU",{weekday:"short"})}</small><span class="mhic">${a?moodSVG(a):'<i class="mhe"></i>'}</span><b>${d.getDate()}</b></button>`;}).join("")+'</div>';
    const pts=[0,1,2,3,4,5,6].map(i=>{const x=dm.get(dayKey(new Date(st.getFullYear(),st.getMonth(),st.getDate()+i)));return x&&x.avg?[20+i*46.7,100-(x.avg-1)/5*80]:null;});
    html+=`<svg class="mhline" viewBox="0 0 320 110">${[1,2,3,4,5,6].map(v=>`<line x1="10" x2="310" y1="${100-(v-1)/5*80}" y2="${100-(v-1)/5*80}"/>`).join("")}<polyline points="${pts.filter(Boolean).map(p=>p.join(",")).join(" ")}"/>${pts.map(p=>p?`<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="${MCOL[Math.round((100-p[1])/80*5)]}"/>`:"").join("")}</svg>`;
    list=moods.filter(x=>x.at>=st.getTime()&&x.at<en.getTime()+864e5);}
  else if(mh.range==="month"){const m0=new Date(now.getFullYear(),now.getMonth()+mh.off,1),dim=new Date(m0.getFullYear(),m0.getMonth()+1,0).getDate(),lead=(m0.getDay()+6)%7;
    label=m0.toLocaleDateString("en-AU",{month:"long",year:"numeric"});
    html='<div class="mhcal">'+["M","T","W","T","F","S","S"].map(d=>`<span class="mhh">${d}</span>`).join("")+Array(lead).fill('<span></span>').join("")+
      Array.from({length:dim},(_,i)=>{const d=new Date(m0.getFullYear(),m0.getMonth(),i+1),x=dm.get(dayKey(d)),a=x&&x.avg?Math.round(x.avg):0;
        return mhCell(dm,d,"cal")+`<span class="mhdot" style="${a?`background:${MCOL[a-1]}`:""}">${a?moodSVG(a):""}</span><b>${i+1}</b></button>`;}).join("")+'</div>';
    list=moods.filter(x=>{const d=new Date(x.at);return d.getFullYear()===m0.getFullYear()&&d.getMonth()===m0.getMonth();});}
  else{const y=now.getFullYear()+mh.off;label=String(y);
    html='<div class="mhyear"><span></span>'+Array.from({length:31},(_,i)=>`<span class="mhyd">${(i+1)%5===0||i===0?i+1:""}</span>`).join("")+
      Array.from({length:12},(_,m)=>{const dim=new Date(y,m+1,0).getDate();return `<span class="mhym">${new Date(y,m,1).toLocaleDateString("en-AU",{month:"narrow"})}</span>`+Array.from({length:31},(_,i)=>{if(i>=dim)return '<span></span>';const d=new Date(y,m,i+1),x=dm.get(dayKey(d)),a=x&&x.avg?Math.round(x.avg):0;
        return `<button class="mhpx${mh.sel===dayKey(d)?" sel":""}" data-k="${dayKey(d)}" style="${a?`background:${MCOL[a-1]}`:""}" aria-label="${d.toLocaleDateString("en-AU",{day:"numeric",month:"long"})}${a?", "+MOODS[a-1]:""}"></button>`;}).join("");}).join("")+'</div>';
    list=moods.filter(x=>new Date(x.at).getFullYear()===y);}
  $("#mhLabel").textContent=label;$("#mhBody").innerHTML=html;$("#mhStats").innerHTML=mhStats(list);$("#mhNext").disabled=mh.off>=0;mhDayRender(dm);}
function mhDayRender(dm){const el=$("#mhDay");if(!mh.sel){el.innerHTML='<p class="quiet mhhint">Tap a day to see its check-ins.</p>';return;}
  const d=dm.get(mh.sel);const [Y,M,D]=mh.sel.split("-").map(Number),date=new Date(Y,M-1,D);
  el.innerHTML=`<p class="mhk">${date.toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"})}</p>`+(d?d.list.slice().reverse().map(x=>`<div class="tentry" data-at="${x.at}" role="button" tabindex="0">${x.mood?moodDot(x.mood,18):'<i class="mdot jr" style="--sz:18px"></i>'}<div><b>${x.mood?MOODS[x.mood-1]:"Journal"}</b> <small>${new Date(x.at).toLocaleTimeString("en-AU",{hour:"numeric",minute:"2-digit"})}</small>${x.tags&&x.tags.length?`<p class="ttags">${esc(x.tags.join(", "))}</p>`:""}${x.note?`<p>${esc(x.note)}</p>`:""}</div></div>`).join(""):'<p class="quiet">Nothing recorded this day.</p>');}
function openHistory(){mh={range:"month",off:0,sel:dayKey(Date.now())};loadMoods().then(()=>{mhRender();show("moods");});}
$("#tOpenHist").onclick=openHistory;
$("#mhSeg").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;mh.range=b.dataset.r;mh.off=0;mhRender();});
$("#mhPrev").onclick=()=>{mh.off--;mhRender();};$("#mhNext").onclick=()=>{if(mh.off<0){mh.off++;mhRender();}};
$("#mhBody").addEventListener("click",e=>{const b=e.target.closest("[data-k]");if(!b)return;mh.sel=b.dataset.k;mhRender();buzz(5);});

/* ================= ONE ENTRY, FULL SCREEN, WITH SOMA A TAP AWAY ================= */
let evCur=null;
function openEntry(at){const x=moods.find(m=>m.at===+at);if(!x)return;evCur=x;const d=new Date(x.at);
  $("#evDate").textContent=d.toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"})+", "+d.toLocaleTimeString("en-AU",{hour:"numeric",minute:"2-digit"});
  $("#evArt").innerHTML=x.mood?moodSVG(x.mood):"";$("#evArt").hidden=!x.mood;$("#evMood").textContent=x.mood?MOODS[x.mood-1]:"Journal entry";
  $("#evMeta").textContent=x.energy?"Energy: "+CI_EN[x.energy-1][0]:"";$("#evTags").innerHTML=(x.tags||[]).map(t=>`<span>${esc(t)}</span>`).join("");
  $("#evNote").innerHTML=x.note?esc(x.note):'<p class="quiet">No note with this check-in.</p>';
  const c=CI_SKY[(x.mood||3)-1];$("#evSky").style.background=`radial-gradient(120% 70% at 50% 0%,${c[2]}55,transparent 60%),linear-gradient(${c[1]},${c[0]} 70%)`;
  if(!$("#evAv").innerHTML)$("#evAv").innerHTML=companion(COMPANIONS.soma,40,0);
  const f=$("#entryView");f.hidden=false;requestAnimationFrame(()=>f.classList.add("open"));document.body.classList.add("ci-open");}
function closeEntry(){const f=$("#entryView");f.classList.remove("open");document.body.classList.remove("ci-open");setTimeout(()=>{f.hidden=true;},300);}
$("#evClose").onclick=closeEntry;
$("#evSoma").onclick=()=>{const x=evCur;if(!x)return;closeEntry();const d=new Date(x.at).toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"});
  openChat("soma",x.note?`I'd like to talk through my journal entry from ${d}.`:`I'd like to talk about my check-in from ${d}.`,entryContext(x));};
document.addEventListener("click",e=>{const t=e.target.closest(".tentry[data-at]");if(t)openEntry(t.dataset.at);});
document.addEventListener("keydown",e=>{if(e.key==="Enter"){const t=e.target.closest&&e.target.closest(".tentry[data-at]");if(t)openEntry(t.dataset.at);}});


/* ================= CONTEXT HANDED TO A COMPANION (journal entries, check-ins, routines) ================= */
function focusContext(k){const c=(chats[k]||[]).filter(x=>x.role==="ctx").slice(-2);if(!c.length)return "";
  return "\n\nWHAT THEY'VE BROUGHT TO THIS CONVERSATION (shared privately from inside Emberkind; it's their own words and data)\n"+c.map(x=>x.content).join("\n---\n")+
  "\nRespond to this directly and specifically. Show you've taken in what they wrote, without reading it back to them word for word, and don't ask them to repeat it. Never diagnose from it.";}
function entryContext(x){if(!x)return "";const d=new Date(x.at),when=d.toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"})+" at "+d.toLocaleTimeString("en-AU",{hour:"numeric",minute:"2-digit"});
  const feel=(x.tags||[]).filter(t=>CI_FEEL.includes(t)),day=(x.tags||[]).filter(t=>!CI_FEEL.includes(t));
  return [`Source: their ${x.mood?"check-in":"journal entry"} from ${when}.`,x.mood?`Inner weather: ${MOODS[x.mood-1]} (${x.mood} of 6).`:"",x.energy?`Energy: ${CI_EN[x.energy-1][0]} (${x.energy} of 5).`:"",
    feel.length?`Feelings they chose: ${feel.join(", ")}.`:"",day.length?`Part of their day: ${day.join(", ")}.`:"",x.note?`What they wrote: "${x.note}"`:"They didn't write a note."].filter(Boolean).join("\n");}
function routineContext(r){if(!r)return "";return `Source: a routine they saved from an earlier conversation with you${r.at?", on "+new Date(r.at).toLocaleDateString("en-AU",{day:"numeric",month:"long"}):""}.\nTitle: ${r.title}\nThe full routine:\n${String(r.text).slice(0,4000)}\nHelp them with this specific routine: what's working, what isn't, and how to make it smaller, kinder or easier to keep.`;}


$("#rSiro").onclick=()=>{const r=routines[routCur];if(!r)return;openChat("siro",`I'd like to work on my routine "${r.title}".`,routineContext(r));};
(function(){const a=$("#rSiroAv");if(a&&!a.innerHTML)a.innerHTML=companion(COMPANIONS.siro,40,0);})();


/* ================= VERSION-AWARE SHARING, AND TITLES THAT FIT ON ONE LINE ================= */
const EK_RELEASE="3.9.3";const EK_VER=EK_RELEASE;
const EK_SHARE_URL="https://emberkind.emberkindai.workers.dev/";
function fitOne(el,max,min){if(!el||!el.offsetParent)return;const p=el.parentElement,ps=getComputedStyle(p),avail=p.clientWidth-parseFloat(ps.paddingLeft)-parseFloat(ps.paddingRight);
  el.style.whiteSpace="nowrap";el.style.maxWidth="100%";el.style.fontSize=max+"px";let f=max;while(el.scrollWidth>avail+.5&&f>min){f-=.5;el.style.fontSize=f+"px";}}
function fitTitles(){document.querySelectorAll(".youcards .ycard b").forEach(el=>{fitOne(el,15.5,9);const f=parseFloat(el.style.fontSize)||15.5,sm=el.parentElement.querySelector("small");if(sm)sm.style.fontSize=f<13?Math.max(9.5,f)+"px":"";});}
let fitT=null;window.addEventListener("resize",()=>{clearTimeout(fitT);fitT=setTimeout(fitTitles,120);});


/* ================= NAV EXTRAS AND THE INSTALL OPTION ================= */
document.querySelectorAll("[data-go2]").forEach(b=>b.addEventListener("click",()=>show(b.dataset.go2)));
$("#homeCommunity").onclick=()=>show("circle");
(function(){const KEY="ek-home-install-x",DAYS14=14*864e5,ua=navigator.userAgent||"";
  const standalone=()=>matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
  const inApp=/FBAN|FBAV|FB_IAB|Instagram|Line\/|Snapchat|musical_ly|BytedanceWebview|TikTok|Messenger|MicroMessenger|; wv\)/i.test(ua);
  const can=()=>!!document.querySelector('link[rel="manifest"]')&&window.top===window&&!standalone();
  function refresh(){const ok=can(),d=+(lsGet(KEY)||0),y=$("#yInstall"),h=$("#homeInstall");
    if(y)y.hidden=!ok;if(h)h.hidden=!(ok&&!(d&&Date.now()-d<DAYS14));}
  async function go(){const e=window.__bip;
    if(e&&!inApp){window.__bip=null;try{e.prompt();const r=await e.userChoice;if(r&&r.outcome==="accepted")toast("Emberkind is on its way to your home screen");}catch(err){}return;}
    const ios=/iPad|iPhone|iPod/.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1),android=/Android/i.test(ua);
    $("#instHow").innerHTML=inApp?"This looks like the browser inside another app (such as Facebook, Instagram or a messaging app), and those can't install apps. Tap the <b>&#8942;</b> or <b>&hellip;</b> menu and choose <b>Open in browser</b> (Chrome or Safari), then tap Install again.":ios?"In Safari, tap the <b>three lines</b> beside the web address, then <b>Share</b>, then <b>Add to Home Screen</b> (scroll down the list if you don't see it). On older iPhones, the Share button is at the bottom of the screen.":android?"Tap Chrome's <b>&#8942;</b> menu (top right), then <b>Install app</b> or <b>Add to Home screen</b>.":"In Chrome or Edge, click the <b>install icon</b> at the right of the address bar, or open the browser menu and choose <b>Install Emberkind</b>.";
    openSheet("#instSheet");}
  ["yInstall","homeInstallGo"].forEach(id=>{const b=document.getElementById(id);if(b)b.onclick=go;});
  const x=$("#homeInstallX");if(x)x.onclick=()=>{lsSet(KEY,String(Date.now()));refresh();};
  window.addEventListener("appinstalled",()=>{window.__bip=null;refresh();});window.addEventListener("ek-bip",refresh);
  refresh();})();


/* ================= FEEDBACK: an email with the release and screen filled in ================= */
(function(){const a=$("#feedbackBtn");if(!a)return;a.addEventListener("click",()=>{const v=(typeof EK_RELEASE!=="undefined"&&EK_RELEASE)?"Release "+EK_RELEASE:"";
  const body="What happened, or your idea:\n\n\nWhere in the app:\n\n\n---\nApp: "+(v||"unknown")+"\nScreen: "+innerWidth+"x"+innerHeight+"\nDevice: "+(navigator.userAgent||"").slice(0,140);
  a.href="mailto:emberkindai@gmail.com?subject="+encodeURIComponent("Emberkind feedback"+(v?" ("+v+")":""))+"&body="+encodeURIComponent(body);});})();

/* ================= SHARED HELPERS ================= */
async function hasDoc(path){await ready;if(!db||!uid)return false;try{return (await db.collection(path).doc(uid).get()).exists;}catch(e){return false;}}
async function markDoc(path,data){
  await ready;if(!db||!uid){toast("Couldn't save on this device.");return false;}
  try{await db.collection(path).doc(uid).set(Object.assign({at:Date.now()},data||{}));return true;}catch(e){toast("Couldn't save that. Try again.");return false;}
}

/* ================= YOU ================= */
function setName(n){profile.name=n;saveProfile();$("#nameIn").value=n;$("#greet").textContent=greetNow();if(typeof renderYouCards==="function")renderYouCards();if(db&&uid)persistDoc(db.collection("members").doc(uid),"m",{name:n,at:Date.now()});}
$("#nameIn").addEventListener("change",e=>{const n=e.target.value.trim().slice(0,40);if(n)setName(n);});
