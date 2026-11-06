"use strict";
/* ================= IMMERSIVE SCREENS (3.3.0) =================
   Check-in: a living inner-weather sky that reacts as you choose (storm with lightning, rain, overcast, sun through
   cloud, warm sun with turning rays, a golden sunburst with sparkles and a rainbow); wind and particles quicken with
   your energy; saving brings a little clearing. The same sky lives behind Today's mood picker and each journal entry.
   Task buddy: a lamplit room at night (an arched window of stars and moon, a warm lamp, dust drifting in its light).
   Your companion sits there with their ghostly copies; during a session they breathe inside a glowing progress ring,
   light bursts at each quarter, a tap brings a soft "I'm right here", and finishing releases a paper lantern.
   Journal: a real notebook (see app-13.css), with a pencil that writes while you type and an ink bloom when you keep
   an entry. Everything animates only while on screen, at 30fps at most, and holds still for reduced motion or Calm. */
(function(){const $=s=>document.querySelector(s),TAU=Math.PI*2;
const MODE=()=>{const a=document.getElementById("app");if(a&&a.classList.contains("simple"))return "simple";if(matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return "still";if(a&&a.classList.contains("calm"))return "calm";return "full";};
const still=()=>{const m=MODE();return m==="simple"||m==="still";};
const lerp=(a,b,u)=>a+(b-a)*u,mix=(a,b,u)=>a.map((v,i)=>Math.round(lerp(v,b[i],u)));
function fit(cv,max){const d=Math.min(max||1.5,window.devicePixelRatio||1),w=Math.max(1,cv.clientWidth),h=Math.max(1,cv.clientHeight);if(cv.width!==Math.round(w*d)||cv.height!==Math.round(h*d)){cv.width=Math.round(w*d);cv.height=Math.round(h*d);}return [cv.width,cv.height,d];}
function loop(fn,active){let raf=0,last=0,clock=0,drawn=false,was=false;
  /* full: 30fps; Calm: the same smooth frames on slowed time; Simple or reduced motion: one still frame, redrawn only when something changes */
  const tick=ts=>{raf=0;if(!active()){drawn=false;return;}if(still()){if(!drawn){fn(clock,1);drawn=true;}return;}
    if(ts-last>=32){let dt=Math.min(.1,(ts-last)/1000||.033);last=ts;if(MODE()==="calm")dt*=.45;clock+=dt;fn(clock,dt);}raf=requestAnimationFrame(tick);};
  const kick=()=>{const a=active();if(a&&!was)drawn=false;was=a;if(!raf&&a){last=0;raf=requestAnimationFrame(tick);}};
  const redo=()=>{drawn=false;kick();};setInterval(kick,700);document.addEventListener("visibilitychange",kick);window.addEventListener("ekmode",redo);return redo;}
/* ---------------- rain: drops at three depths, each fading tail to head, slanting with the wind, splashing ---------------- */
function Rain(n){const nd=any=>{const z=Math.random();return {x:Math.random()*1.1-.05,y:any?Math.random():-Math.random()*.25,z,len:.022+z*.04,v:.55+z*1.05,a:.14+z*.5,w:.5+z*1.1};};
  const L=Array.from({length:n},()=>nd(true)),sp=[];
  function step(dt,wind,count){for(let i=0;i<count;i++){const d=L[i];d.y+=d.v*dt;d.x+=d.v*dt*wind*.22;if(d.y>.84+d.z*.16){if(d.z>.5&&sp.length<36)sp.push({x:d.x,y:d.y,t:0,z:d.z});Object.assign(d,nd(false));}if(d.x>1.06)d.x-=1.12;}
    for(let i=sp.length-1;i>=0;i--){sp[i].t+=dt;if(sp[i].t>.4)sp.splice(i,1);}}
  function draw(x,W,H,wind,count,col){x.save();x.lineCap="round";const k=W/400+.35;
    for(let i=0;i<count;i++){const d=L[i],px=d.x*W,py=d.y*H,l=d.len*H,dx=-l*wind*.22,g=x.createLinearGradient(px+dx,py-l,px,py);g.addColorStop(0,`rgba(${col},0)`);g.addColorStop(1,`rgba(${col},${d.a.toFixed(2)})`);
      x.strokeStyle=g;x.lineWidth=d.w*k;x.beginPath();x.moveTo(px+dx,py-l);x.lineTo(px,py);x.stroke();}
    for(const s of sp){const u=s.t/.4,r=(1.5+u*7*s.z)*k;x.strokeStyle=`rgba(${col},${(.32*(1-u)*s.z).toFixed(3)})`;x.lineWidth=.7*k;x.beginPath();x.ellipse(s.x*W,s.y*H,r,r*.3,0,0,TAU);x.stroke();}x.restore();}
  return {step,draw};}
window.EKRAIN=Rain;
/* snow: flakes at three depths, drifting and swaying as they fall; near ones bigger, brighter, softly glowing */
function Snow(n){const nf=any=>{const z=Math.random();return {x:Math.random(),y:any?Math.random():-.05,z,r:.6+z*2.2,v:.035+z*.07,p:Math.random()*TAU,s:.4+Math.random()*.8};};
  const L=Array.from({length:n},()=>nf(true));
  function step(dt){for(const f of L){f.y+=f.v*dt;f.p+=dt*f.s;f.x+=Math.sin(f.p)*.012*dt;if(f.y>1.04)Object.assign(f,nf(false));if(f.x>1.03)f.x-=1.06;if(f.x<-.03)f.x+=1.06;}}
  function draw(x,W,H){const k=W/400+.4;x.save();for(const f of L){const px=f.x*W,py=f.y*H,r=f.r*k,a=.35+f.z*.55;
    if(f.z>.6){const g=x.createRadialGradient(px,py,0,px,py,r*2.6);g.addColorStop(0,`rgba(255,255,255,${(a*.45).toFixed(2)})`);g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;x.beginPath();x.arc(px,py,r*2.6,0,TAU);x.fill();}
    x.fillStyle=`rgba(255,255,255,${a.toFixed(2)})`;x.beginPath();x.arc(px,py,r,0,TAU);x.fill();}x.restore();}
  return {step,draw};}
window.EKSNOW=Snow;
/* ---------------- the inner-weather sky ---------------- */
const MP=[ /* top, bottom, cloud, dark, rain, storm, sun, rays, motes, rainbow, sparkle */
 [[10,12,30],[38,42,68],.95,.9,1,1,0,0,0,0,0],[[22,32,60],[68,84,118],.9,.62,.65,0,0,0,0,0,0],[[50,60,86],[136,144,166],.85,.32,0,0,.12,0,.05,0,0],
 [[38,84,126],[176,206,214],.5,.1,0,0,.6,.35,.2,0,0],[[50,100,166],[244,200,138],.22,0,0,0,.92,.7,.6,0,.2],[[90,68,150],[255,206,130],.1,0,0,0,1,1,1,0,1]];
function params(m){m=Math.max(1,Math.min(6,m));const a=Math.floor(m)-1,b=Math.min(5,a+1),u=m-1-a,A=MP[a],B=MP[b];return {top:mix(A[0],B[0],u),bot:mix(A[1],B[1],u),cloud:lerp(A[2],B[2],u),dark:lerp(A[3],B[3],u),rain:lerp(A[4],B[4],u),storm:lerp(A[5],B[5],u),sun:lerp(A[6],B[6],u),rays:lerp(A[7],B[7],u),motes:lerp(A[8],B[8],u),rainbow:lerp(A[9],B[9],u),sparkle:lerp(A[10],B[10],u)};}
function Sky(cv,o){const x=cv.getContext("2d"),LB=document.createElement("canvas"),L=LB.getContext("2d");let m=o.mood(),flash=0,nextBolt=2,bolt=null,clear=0,lastStep=-1;
  const R=(()=>{let s=7;return()=>{s=(s*9301+49297)%233280;return s/233280;};})();
  const clouds=Array.from({length:24},(_,i)=>({x:R()*1.4-.2,y:R()*.55,r:.1+R()*.16,sp:.5+R()*.9,l:i%3}));
  const rain=Rain(160);
  const motes=Array.from({length:70},()=>({x:R(),y:R(),v:.02+R()*.05,p:R()*TAU,s:.6+R()*1.6}));
  const sparks=Array.from({length:44},()=>({x:R(),y:R()*.75,p:R()*TAU,s:2+R()*4}));
  function draw(t,dt){const [W,H]=fit(cv,1.5);const tm=o.mood();m+=(tm-m)*Math.min(1,dt*2.4);const P=params(m),e=o.energy?o.energy():3,wind=.5+e*.28,step=o.step?o.step():0;
    if(step===5&&lastStep!==5)clear=1;lastStep=step;clear=Math.max(0,clear-dt*.25);
    const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,`rgb(${P.top})`);g.addColorStop(1,`rgb(${P.bot})`);x.globalCompositeOperation="source-over";x.globalAlpha=1;x.fillStyle=g;x.fillRect(0,0,W,H);
    const sx=W*.74,sy=H*.24,sr=Math.min(W,H)*.07;
    if(P.rays>.02){x.save();x.globalCompositeOperation="lighter";x.translate(sx,sy);x.rotate(t*.03);for(let i=0;i<16;i++){x.rotate(TAU/16);const gr=x.createLinearGradient(0,0,Math.max(W,H),0);gr.addColorStop(0,`rgba(255,236,190,${.16*P.rays})`);gr.addColorStop(1,"rgba(255,236,190,0)");x.fillStyle=gr;x.beginPath();x.moveTo(0,0);x.lineTo(Math.max(W,H)*1.2,-sr*1.4);x.lineTo(Math.max(W,H)*1.2,sr*1.4);x.closePath();x.fill();}x.restore();}
    if(P.sun>.02){x.save();x.globalCompositeOperation="lighter";let gg=x.createRadialGradient(sx,sy,0,sx,sy,sr*7);gg.addColorStop(0,`rgba(255,226,160,${.55*P.sun})`);gg.addColorStop(1,"rgba(255,226,160,0)");x.fillStyle=gg;x.fillRect(sx-sr*7,sy-sr*7,sr*14,sr*14);
      gg=x.createRadialGradient(sx-sr*.3,sy-sr*.3,0,sx,sy,sr);gg.addColorStop(0,`rgba(255,252,236,${P.sun})`);gg.addColorStop(.7,`rgba(255,214,120,${P.sun})`);gg.addColorStop(1,`rgba(255,180,80,${.8*P.sun})`);x.fillStyle=gg;x.beginPath();x.arc(sx,sy,sr*(1+.03*Math.sin(t*1.3)),0,TAU);x.fill();x.restore();}
    if(P.rainbow>.02){x.save();x.globalCompositeOperation="lighter";["255,90,90","255,170,80","255,235,110","110,230,130","90,170,255","160,110,255"].forEach((c,i)=>{x.strokeStyle=`rgba(${c},${.22*P.rainbow})`;x.lineWidth=Math.max(4,W*.018);x.beginPath();x.arc(W*.5,H*1.02,W*.78-i*W*.019,Math.PI,TAU);x.stroke();});x.restore();}
    /* clouds: soft, drawn small and stretched up */
    const lw=Math.max(8,W>>2),lh=Math.max(8,H>>2);if(LB.width!==lw||LB.height!==lh){LB.width=lw;LB.height=lh;}L.clearRect(0,0,lw,lh);
    const lit=mix([238,242,250],[44,50,72],P.dark),cov=P.cloud;for(const c of clouds){if(!still())c.x+=c.sp*wind*dt*.018;if(c.x>1.25)c.x=-.25;const n=Math.round(cov*24);if(clouds.indexOf(c)>=n)continue;
      const cx=c.x*lw,cy=(c.y+.04*Math.sin(t*.2+c.sp*7))*lh,r=c.r*lw*(1+c.l*.25),gr=L.createRadialGradient(cx,cy,0,cx,cy,r);const a=(.5+c.l*.18)*Math.min(1,cov*1.2);gr.addColorStop(0,`rgba(${lit},${a})`);gr.addColorStop(.6,`rgba(${lit},${a*.6})`);gr.addColorStop(1,`rgba(${lit},0)`);L.fillStyle=gr;L.fillRect(cx-r,cy-r,r*2,r*2);}
    x.imageSmoothingEnabled=true;x.drawImage(LB,0,0,W,H);
    /* lightning */
    if(P.storm>.3&&!still()){nextBolt-=dt;if(nextBolt<=0){flash=1;nextBolt=2.4+R()*4;let bx=W*(.15+R()*.7),by=0;bolt=[[bx,by]];while(by<H*.6){bx+=(R()-.5)*W*.08;by+=H*(.04+R()*.05);bolt.push([bx,by]);}}}
    if(flash>0){x.save();x.globalCompositeOperation="lighter";x.fillStyle=`rgba(200,210,255,${.32*flash*P.storm})`;x.fillRect(0,0,W,H);if(bolt){x.strokeStyle=`rgba(235,240,255,${flash})`;x.lineWidth=2;x.shadowColor="rgba(190,210,255,1)";x.shadowBlur=18;x.beginPath();bolt.forEach((p,i)=>i?x.lineTo(...p):x.moveTo(...p));x.stroke();}x.restore();flash=Math.max(0,flash-dt*3.2);}
    /* rain */
    if(P.rain>.02){const n=Math.round(P.rain*160);if(!still())rain.step(dt*(1+e*.1),.4+wind*.25,n);rain.draw(x,W,H,.4+wind*.25,n,"205,220,248");}
    /* light motes (more with energy) */
    if(P.motes>.02){x.save();x.globalCompositeOperation="lighter";const n=Math.round(P.motes*motes.length*(.5+e*.12));for(let i=0;i<Math.min(n,motes.length);i++){const q=motes[i];if(!still()){q.y-=q.v*dt*(.6+e*.2);q.p+=dt;if(q.y<-.05){q.y=1.05;q.x=R();}}const px=(q.x+.02*Math.sin(q.p))*W,py=q.y*H,r=q.s*(W/400);
      const gr=x.createRadialGradient(px,py,0,px,py,r*4);gr.addColorStop(0,"rgba(255,236,180,.9)");gr.addColorStop(1,"rgba(255,236,180,0)");x.fillStyle=gr;x.fillRect(px-r*4,py-r*4,r*8,r*8);}x.restore();}
    if(P.sparkle>.02){x.save();x.globalCompositeOperation="lighter";for(const s of sparks){const a=P.sparkle*Math.max(0,Math.sin(t*1.6+s.p)),px=s.x*W,py=s.y*H,r=s.s*(W/400)*(.6+a*.6);x.fillStyle=`rgba(255,250,225,${a.toFixed(2)})`;x.beginPath();x.moveTo(px,py-r*2);x.lineTo(px+r*.35,py-r*.35);x.lineTo(px+r*2,py);x.lineTo(px+r*.35,py+r*.35);x.lineTo(px,py+r*2);x.lineTo(px-r*.35,py+r*.35);x.lineTo(px-r*2,py);x.lineTo(px-r*.35,py-r*.35);x.closePath();x.fill();}x.restore();}
    if(clear>0){x.save();x.globalCompositeOperation="lighter";const gr=x.createRadialGradient(W*.5,H*.35,0,W*.5,H*.35,Math.max(W,H)*.7);gr.addColorStop(0,`rgba(255,244,214,${.35*clear})`);gr.addColorStop(1,"rgba(255,244,214,0)");x.fillStyle=gr;x.fillRect(0,0,W,H);x.restore();}}
  return loop(draw,o.active);}
/* ---------------- the lamplit room ---------------- */
function Room(cv,o){const x=cv.getContext("2d");const R=(()=>{let s=11;return()=>{s=(s*9301+49297)%233280;return s/233280;};})();
  const stars=Array.from({length:60},()=>({x:R(),y:R(),p:R()*TAU,s:R()})),dust=Array.from({length:46},()=>({x:R(),y:R(),vx:(R()-.5)*.012,vy:-.004-R()*.01,p:R()*TAU,s:.5+R()*1.4})),burst=[];let lastQ=-1;
  function draw(t,dt){const [W,H]=fit(cv,1.5),k=Math.min(W,H)/400;const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,"#0A1328");g.addColorStop(.6,"#132338");g.addColorStop(1,"#1E150F");x.globalCompositeOperation="source-over";x.fillStyle=g;x.fillRect(0,0,W,H);
    /* the arched window: night sky, stars and a crescent moon */
    const wx=W*.07,wy=H*.07,ww=W*.36,wh=H*.5,rad=ww/2;x.save();x.beginPath();x.moveTo(wx,wy+wh);x.lineTo(wx,wy+rad);x.arc(wx+rad,wy+rad,rad,Math.PI,TAU);x.lineTo(wx+ww,wy+wh);x.closePath();x.clip();
    const sg=x.createLinearGradient(0,wy,0,wy+wh);sg.addColorStop(0,"#16224A");sg.addColorStop(1,"#3A3F6E");x.fillStyle=sg;x.fillRect(wx,wy,ww,wh);
    for(const s of stars){const a=.35+.65*Math.max(0,Math.sin(t*(.6+s.s)+s.p));x.fillStyle=`rgba(255,255,255,${a.toFixed(2)})`;x.fillRect(wx+s.x*ww,wy+s.y*wh*.85,s.s<.85?1.2*k:2*k,s.s<.85?1.2*k:2*k);}
    const mx=wx+ww*.68,my=wy+wh*.3,mr=ww*.11;let mg=x.createRadialGradient(mx,my,0,mx,my,mr*4);mg.addColorStop(0,"rgba(230,228,255,.45)");mg.addColorStop(1,"rgba(230,228,255,0)");x.fillStyle=mg;x.fillRect(mx-mr*4,my-mr*4,mr*8,mr*8);
    x.fillStyle="#F2EEFF";x.beginPath();x.arc(mx,my,mr,0,TAU);x.fill();x.fillStyle="#1C2856";x.beginPath();x.arc(mx+mr*.42,my-mr*.22,mr*.9,0,TAU);x.fill();x.restore();
    x.save();x.strokeStyle="#3A2A1E";x.lineWidth=7*k;x.beginPath();x.moveTo(wx,wy+wh);x.lineTo(wx,wy+rad);x.arc(wx+rad,wy+rad,rad,Math.PI,TAU);x.lineTo(wx+ww,wy+wh);x.closePath();x.stroke();x.lineWidth=3.5*k;x.beginPath();x.moveTo(wx+rad,wy);x.lineTo(wx+rad,wy+wh);x.moveTo(wx,wy+wh*.55);x.lineTo(wx+ww,wy+wh*.55);x.stroke();
    x.fillStyle="#4A3626";x.fillRect(wx-8*k,wy+wh,ww+16*k,8*k);x.restore();
    /* the lamp's warm light, a soft cone, and a rug where the companion sits */
    const lx=W*.86,ly=H*.36;x.save();x.globalCompositeOperation="lighter";let lg=x.createRadialGradient(lx,ly,0,lx,ly,Math.max(W,H)*.75);lg.addColorStop(0,"rgba(255,180,90,.42)");lg.addColorStop(.35,"rgba(255,150,70,.14)");lg.addColorStop(1,"rgba(255,150,70,0)");x.fillStyle=lg;x.fillRect(0,0,W,H);
    lg=x.createRadialGradient(lx,ly,0,lx,ly,22*k);lg.addColorStop(0,"rgba(255,246,220,.95)");lg.addColorStop(1,"rgba(255,200,120,0)");x.fillStyle=lg;x.fillRect(lx-22*k,ly-22*k,44*k,44*k);x.restore();
    x.fillStyle="#2A1A12";x.fillRect(lx-2*k,ly+8*k,4*k,H*.62-ly);x.fillStyle="#C9884A";x.beginPath();x.moveTo(lx-20*k,ly+4*k);x.lineTo(lx+20*k,ly+4*k);x.lineTo(lx+12*k,ly-16*k);x.lineTo(lx-12*k,ly-16*k);x.closePath();x.fill();
    const rg=x.createRadialGradient(W*.5,H*.86,0,W*.5,H*.86,W*.42);rg.addColorStop(0,"rgba(150,70,40,.55)");rg.addColorStop(.7,"rgba(110,50,30,.3)");rg.addColorStop(1,"rgba(110,50,30,0)");x.fillStyle=rg;x.beginPath();x.ellipse(W*.5,H*.86,W*.42,H*.08,0,0,TAU);x.fill();
    /* dust drifting in the lamplight */
    x.save();x.globalCompositeOperation="lighter";for(const d of dust){if(!still()){d.x+=d.vx*dt*3;d.y+=d.vy*dt*3;d.p+=dt;if(d.y<-.02){d.y=1.02;d.x=R();}if(d.x<0)d.x=1;if(d.x>1)d.x=0;}
      const px=(d.x+.01*Math.sin(d.p))*W,py=d.y*H,near=Math.max(0,1-Math.hypot(px-lx,py-ly)/(Math.max(W,H)*.7)),a=(.15+.75*near)*(.5+.5*Math.sin(d.p*1.7));x.fillStyle=`rgba(255,220,160,${a.toFixed(2)})`;x.beginPath();x.arc(px,py,d.s*k,0,TAU);x.fill();}x.restore();
    /* light bursts at each quarter of a session */
    if(o.progress&&!still()){const p=o.progress(),q=Math.floor(p*4+1e-6);if(o.run()&&q>lastQ&&lastQ>=0&&q>0){const c=o.center();for(let i=0;i<60;i++){const a=R()*TAU,v=.4+R()*1.2;burst.push({x:c[0]*(W/cv.clientWidth),y:c[1]*(H/cv.clientHeight),vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1});}}lastQ=o.run()?q:-1;}
    if(burst.length){x.save();x.globalCompositeOperation="lighter";for(let i=burst.length-1;i>=0;i--){const b=burst[i];b.x+=b.vx*dt*160*k;b.y+=b.vy*dt*160*k;b.l-=dt*.7;if(b.l<=0){burst.splice(i,1);continue;}x.fillStyle=`rgba(255,220,150,${b.l.toFixed(2)})`;x.beginPath();x.arc(b.x,b.y,1.6*k,0,TAU);x.fill();}x.restore();}}
  return loop(draw,o.active);}
/* ---------------- wiring ---------------- */
const ACT={};function canvasIn(host,cls){if(!host)return null;let c=host.querySelector(":scope > canvas."+cls);if(!c){c=document.createElement("canvas");c.className=cls;c.setAttribute("aria-hidden","true");host.insertBefore(c,host.firstChild);}return c;}
function moodToday(){try{const d=new Date().toDateString(),t=(typeof moods!=="undefined"?moods:[]).filter(m=>m.mood&&new Date(m.at).toDateString()===d);return t.length?t[t.length-1].mood:3;}catch(e){return 3;}}
function init(){
  /* check-in flow */
  const ciS=$("#ciSky");if(ciS){const c=canvasIn(ciS,"ekfx");const sc=document.createElement("i");sc.className="ekscrim";ciS.appendChild(sc);
    ACT.ci=Sky(c,{mood:()=>+(($("#ciFlow")||{}).dataset||{}).mood||3,energy:()=>{try{return ci.energy||3;}catch(e){return 3;}},step:()=>+(($("#ciFlow")||{}).dataset||{}).step||0,active:()=>{const f=$("#ciFlow");return !!f&&!f.hidden&&!document.hidden;}});}
  {const f=$("#ciFlow");if(f&&ACT.ci){new MutationObserver(()=>ACT.ci()).observe(f,{attributes:true,attributeFilter:["data-mood","data-step","hidden"]});const en=$("#ciEn");if(en)en.addEventListener("click",()=>setTimeout(ACT.ci,30));}}
  /* Today: a live sky behind the mood picker */
  const tc=$("#tMoods")&&$("#tMoods").closest(".tcard");if(tc){tc.classList.add("ekskycard");const c=canvasIn(tc,"ekfx");ACT.today=Sky(c,{mood:moodToday,energy:()=>3,active:()=>{const v=$("#view-track"),t=$("#tToday");return !!v&&v.classList.contains("active")&&!!t&&!t.hidden&&!document.hidden;}});}
  /* a journal entry, under the sky of its day */
  const evS=$("#evSky");if(evS){const c=canvasIn(evS,"ekfx");ACT.ev=Sky(c,{mood:()=>{try{return (evCur&&evCur.mood)||3;}catch(e){return 3;}},energy:()=>{try{return (evCur&&evCur.energy)||3;}catch(e){return 3;}},active:()=>{const f=$("#entryView");return !!f&&!f.hidden&&!document.hidden;}});}
  /* Task buddy: the room, a hero with your companion and their ghostly copies, a ring, a whisper, a lantern */
  const fv=$("#view-focus"),fs=$("#fSetup");if(fv&&fs){const page=fv.querySelector(".fpage")||fv;const bg=canvasIn(page,"ekroom");
    const hero=document.createElement("div");hero.className="fhero";hero.setAttribute("aria-hidden","true");hero.innerHTML='<canvas class="ekroom2"></canvas><span class="fbuddy"><img class="g g1" alt=""><img class="g g2" alt=""><img class="g g3" alt=""><img class="me" alt=""></span>';fs.insertBefore(hero,fs.firstChild);
    const who=()=>{try{return fWho;}catch(e){return "siro";}},art=()=>{try{return CMP_CLASSIC[who()]||CMP_CLASSIC.siro;}catch(e){return "";}};
    const setHero=()=>{const a=art();hero.querySelectorAll("img").forEach(i=>{if(i.src!==a)i.src=a;});hero.dataset.k=who();};setHero();const pk=$("#fPick");if(pk)new MutationObserver(setHero).observe(pk,{childList:true,subtree:true,attributes:true});
    const onRun=()=>{const r=$("#fRun"),a=$("#fAfter");return (!!r&&!r.hidden)||(!!a&&!a.hidden);};
    const running=()=>{const r=$("#fRun");return !!r&&!r.hidden;};const prog=()=>{try{return fTotal?Math.max(0,Math.min(1,1-fLeft/fTotal)):0;}catch(e){return 0;}};
    const fav=fv.querySelector(".fav");let ring=null,head=null,C=0;if(fav){const sv=document.createElementNS("http://www.w3.org/2000/svg","svg");sv.setAttribute("class","fring");sv.setAttribute("viewBox","0 0 200 200");sv.setAttribute("aria-hidden","true");
      sv.innerHTML='<defs><linearGradient id="ekRg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE2A0"/><stop offset="1" stop-color="#F2A04A"/></linearGradient></defs><circle class="trk" cx="100" cy="100" r="88"/><circle class="arc" cx="100" cy="100" r="88"/><circle class="hd" r="5"/>';fav.insertBefore(sv,fav.firstChild);ring=sv.querySelector(".arc");head=sv.querySelector(".hd");C=2*Math.PI*88;ring.style.strokeDasharray=C;
      const gh=document.createElement("span");gh.className="fghost";gh.setAttribute("aria-hidden","true");gh.innerHTML='<img alt=""><img alt="">';fav.appendChild(gh);
      const wh=document.createElement("span");wh.className="fwhisper";wh.setAttribute("aria-live","polite");fav.appendChild(wh);
      const LINES=["I'm right here.","One small step at a time.","You're doing it.","Breathe, then the next bit.","No rush. I'm with you.","Look how far you've come."];let li=0,wt=0;
      fav.addEventListener("click",()=>{if(!running())return;wh.textContent=LINES[li++%LINES.length];fav.classList.remove("ping");void fav.offsetWidth;fav.classList.add("ping");clearTimeout(wt);wt=setTimeout(()=>{wh.textContent="";},2600);try{navigator.vibrate&&navigator.vibrate(8);}catch(e){}});
      fav.setAttribute("role","button");fav.setAttribute("tabindex","0");fav.setAttribute("aria-label","Tap your companion");}
    const center=()=>{if(!fav)return [bg.clientWidth/2,bg.clientHeight/3];const a=fav.getBoundingClientRect(),b=bg.getBoundingClientRect();return [a.left-b.left+a.width/2,a.top-b.top+a.height/2];};
    ACT.room=Room(bg,{active:()=>fv.classList.contains("active")&&onRun()&&!document.hidden,run:running,progress:prog,center});
    ACT.hero=Room(hero.querySelector("canvas"),{active:()=>fv.classList.contains("active")&&!onRun()&&!document.hidden});
    /* keep the session's look in step: the ring, the ghostly copies, the paused hush, the lantern at the end */
    setInterval(()=>{if(!fv.classList.contains("active"))return;fv.classList.toggle("frunning",onRun());const r=running();
      if(ring&&r){const p=prog();ring.style.strokeDashoffset=(C*(1-p)).toFixed(1);const a=-Math.PI/2+p*TAU;head.setAttribute("cx",(100+88*Math.cos(a)).toFixed(1));head.setAttribute("cy",(100+88*Math.sin(a)).toFixed(1));
        const g=fav&&fav.querySelector(".fghost");if(g){const s=(fav.querySelector("#fAv img")||{}).src;if(s)g.querySelectorAll("img").forEach(i=>{if(i.src!==s)i.src=s;});}}
      let pz=false;try{pz=!!fPaused;}catch(e){}fv.classList.toggle("fpaused",r&&pz);const af=$("#fAfter");fv.classList.toggle("fafter",!!af&&!af.hidden);},120);
    const after=$("#fAfter");if(after&&!after.querySelector(".flantern")){const l=document.createElement("span");l.className="flantern";l.setAttribute("aria-hidden","true");l.innerHTML="<i></i>";after.insertBefore(l,after.firstChild);}}
  /* journal entries still turn in like a page when kept (the writing page itself is ek-journal.js) */
  const sv=$("#tJSave");if(sv)sv.addEventListener("click",()=>setTimeout(()=>{const f=$("#tJList .tentry");if(f){f.classList.remove("pagein");void f.offsetWidth;f.classList.add("pagein");}},120));}
/* the Home and full-screen check-in cards: real rain instead of a striped pattern */
function cardSnow(){document.querySelectorAll(".csnow").forEach(el=>{if(el.querySelector("canvas"))return;const c=document.createElement("canvas");c.setAttribute("aria-hidden","true");el.appendChild(c);const x=c.getContext("2d"),sn=Snow(70);
  const on=()=>{const a=document.getElementById("app");return !!a&&a.dataset.weather==="snow"&&el.offsetParent!==null&&!document.hidden&&el.getBoundingClientRect().width>40;};
  ACT["snow"+Math.random()]=loop((t,dt)=>{const [W,H]=fit(c,1.5);x.clearRect(0,0,W,H);if(!still())sn.step(dt);sn.draw(x,W,H);},on);});}
function cardRain(){cardSnow();document.querySelectorAll(".crain").forEach(el=>{if(el.querySelector("canvas"))return;const c=document.createElement("canvas");c.setAttribute("aria-hidden","true");el.appendChild(c);const x=c.getContext("2d"),rn=Rain(110);
  const on=()=>{const a=document.getElementById("app");return !!a&&a.dataset.weather==="rain"&&el.offsetParent!==null&&!document.hidden&&el.getBoundingClientRect().width>40;};
  ACT["rain"+Math.random()]=loop((t,dt)=>{const [W,H]=fit(c,1.5);x.clearRect(0,0,W,H);if(!still())rn.step(dt,.5,110);rn.draw(x,W,H,.5,110,"235,242,255");},on);});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
setInterval(cardRain,1500);setTimeout(cardRain,300);
window.EKIMM={kick:()=>Object.values(ACT).forEach(k=>k&&k())};
})();
