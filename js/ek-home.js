"use strict";
/* ================= HOME, PAINTED (3.5.2) =================
   The Home scene is one painted world on a single canvas: the forest clearing at night, mist drifting through the
   valley, fireflies, and the four companions (Soma, Siro, Ava, Orra) breathing gently around a living fire with its
   glow, flickering flames, sparks and smoke. Time of day still follows the sun and moon: the painting is shaded for
   dawn, day, dusk and night and cross-fades between them.
   Nothing that worked before is lost: the real fire button (tap for its sound, hold to breathe with it) and the
   companions' own buttons are kept and simply moved over the painting; the fire flares while you press it.
   Below the controls, the companions' names are coloured tabs you can swipe; each opens their artwork and story,
   with a button to talk with them. Calm slows everything; reduced motion holds a single still frame. */
(function(){const $=s=>document.querySelector(s),TAU=Math.PI*2;
const ORDER=["soma","siro","ava","orra"];
/* the scenes (2D): each has its painting (with its own flame for the 2D renderer; without it for the WebGL fire),
   where the companions sit, the fire and its size, where Embervale and Meditate live, and its own life */
const SCENES={"milkyway":{"name":"Milky Way","IW":1080,"IH":1934,"P":{"siro":{"x":239.1,"y":1078,"w":303.9,"h":423.0},"ava":{"x":529.7,"y":1081,"w":310.6,"h":420.0},"soma":{"x":-8,"y":1183,"w":309.7,"h":440.0},"orra":{"x":774.2,"y":1183,"w":313.8,"h":440.0}},"FIRE":{"x":528,"base":1540,"top":1345,"k":0.78},"hot":{"cabin":[450.6,1089.0,645.9,1239.2],"star":[495.7,675.9,645.9,863.7]},"fx":{"moon":null,"stars":[200,0,900,960],"fog":[1300,1350,1400],"falls":null,"river":null,"flies":[1000,1470],"ffront":[1630,1880]},"bg":"img/home/bg-milkyway.webp","bgnf":"img/home/bg-milkyway-nofire.webp","sky":"img/home/sky-milkyway.png","trees":1360,"ring":[210,80]}};
const SORDER=["milkyway"];
const CP={siro:{side:1,emb:.6,col:"120,200,255",per:5.2,ph:1.1},ava:{side:-1,emb:.62,col:"255,170,80",per:6.1,ph:2.3},soma:{side:1,emb:.6,col:"190,255,120",per:5.8,ph:0},orra:{side:-1,emb:.55,col:"215,150,255",per:5.5,ph:3.4}};
let SID="milkyway",S=null,IW=1080,IH=1934,P={},FIRE={x:0,base:0,top:0,k:1},FX={};
function useScene(id){SID=SCENES[id]?id:"milkyway";S=SCENES[SID];IW=S.IW;IH=S.IH;FIRE=S.FIRE;FX=S.fx;P={};for(const k of ORDER)P[k]=Object.assign({},S.P[k],CP[k]);seedLife();}
const MODE=()=>{const a=$("#app");if(a&&a.classList.contains("simple"))return "simple";if(matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return "still";if(a&&a.classList.contains("calm"))return "calm";return "full";};
/* ---------- art ---------- */
const IMG={},load=(k,src)=>new Promise(r=>{const i=new Image();i.decoding="async";i.onload=()=>{IMG[k]=i;r();};i.onerror=()=>r();i.src=src;});
function sprite(r,stops,sy){const c=document.createElement("canvas");c.width=r*2;c.height=Math.round(r*2*(sy||1));const x=c.getContext("2d");x.scale(1,sy||1);const g=x.createRadialGradient(r,r,0,r,r,r);stops.forEach(([o,col])=>g.addColorStop(o,col));x.fillStyle=g;x.fillRect(0,0,r*2,r*2);return c;}
const FLY=sprite(32,[[0,"rgba(255,250,200,1)"],[.18,"rgba(230,255,150,.85)"],[.5,"rgba(200,255,120,.18)"],[1,"rgba(200,255,120,0)"]]);
const SPARK=sprite(16,[[0,"rgba(255,245,210,1)"],[.3,"rgba(255,190,90,.8)"],[1,"rgba(255,120,40,0)"]]);
const GLOW=sprite(128,[[0,"rgba(255,170,80,.9)"],[.35,"rgba(255,140,60,.35)"],[1,"rgba(255,120,50,0)"]]);
const SHADOW=sprite(64,[[0,"rgba(18,8,34,.75)"],[.6,"rgba(18,8,34,.35)"],[1,"rgba(18,8,34,0)"]]);
const SMOKE=sprite(64,[[0,"rgba(200,190,225,.5)"],[.6,"rgba(190,180,215,.16)"],[1,"rgba(190,180,215,0)"]]);
const HALO=sprite(64,[[0,"rgba(255,236,190,.55)"],[.4,"rgba(255,220,170,.18)"],[1,"rgba(255,220,170,0)"]]);
const STAR=sprite(8,[[0,"rgba(255,255,255,1)"],[.4,"rgba(220,225,255,.6)"],[1,"rgba(220,225,255,0)"]]);
/* a soft flame, pre-drawn once: a teardrop that is white-gold at the root and fades to nothing at the tip */
const FLAME=(()=>{const W=64,H=160,c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");
  x.filter="blur(4px)";x.beginPath();x.moveTo(W/2,6);x.bezierCurveTo(W*.78,H*.38,W*.92,H*.72,W/2,H-8);x.bezierCurveTo(W*.08,H*.72,W*.22,H*.38,W/2,6);x.closePath();
  const g=x.createLinearGradient(0,H,0,0);g.addColorStop(0,"rgba(255,248,210,.95)");g.addColorStop(.3,"rgba(255,200,95,.85)");g.addColorStop(.7,"rgba(255,120,40,.45)");g.addColorStop(1,"rgba(255,80,20,0)");x.fillStyle=g;x.fill();return c;})();
const FOG=(()=>{const c=document.createElement("canvas");c.width=640;c.height=150;const x=c.getContext("2d");let s=7;const R=()=>{s=(s*9301+49297)%233280;return s/233280;};
  for(let i=0;i<14;i++){const cx=40+R()*560,cy=60+R()*40,r=60+R()*70,g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,"rgba(215,200,245,.5)");g.addColorStop(1,"rgba(215,200,245,0)");x.fillStyle=g;x.fillRect(0,0,640,150);}return c;})();
/* ---------- living things ---------- */
const R=Math.random;let flies=[],stars=[],falls=[],glints=[];
function seedLife(){const fy=FX.flies,ff=FX.ffront,st=FX.stars;flies=Array.from({length:30},(_,i)=>({x:R()*IW,y:i<6?ff[0]+R()*(ff[1]-ff[0]):fy[0]+R()*(fy[1]-fy[0]),ax:20+R()*50,ay:14+R()*36,sx:.08+R()*.18,sy:.06+R()*.16,p:R()*TAU,b:R()*TAU,bs:.6+R()*1.4,s:.5+R()*.7,front:i<6}));
  stars=Array.from({length:30},()=>({x:st[0]+R()*(st[2]-st[0]),y:st[1]+R()*(st[3]-st[1]),p:R()*TAU,s:.6+R()*1.6,r:.6+R()*.8}));
  falls=FX.falls?Array.from({length:22},()=>({x:FX.falls[0]+10+R()*80,y:FX.falls[1]+4+R()*90,v:60+R()*50,l:10+R()*16})):[];glints=FX.river?Array.from({length:18},()=>({x:FX.river[0]+R()*FX.river[2],y:FX.river[1]+7+R()*75,p:R()*TAU,s:.8+R()*1.6})):[];}
const sparks=[],smoke=[];let flare=0,flareT=0,held=false,clock=0;
const flick=t=>.55+.2*Math.sin(t*7.3)+.13*Math.sin(t*13.1+1.3)+.08*Math.sin(t*23.9+2.1)+.04*Math.sin(t*41.7);
/* ---------- the scene ---------- */
let glN=0,glMs=0,G=null,placed=false,cv=null,x=null,wrap=null,raf=0,last=0,drawn=false,box={s:1,ox:0,oy:0,W:0,H:0,d:1};
function layout(){const W=wrap.clientWidth,H=wrap.clientHeight,d=Math.min(2,window.devicePixelRatio||1);if(!W||!H)return false;
  /* a scene can hug its group: Soma at the left edge, Orra at the right, on any screen */const [s,ox]=(()=>{let s=Math.max(W/IW,H/IH)*(S.zoom||1),ox=(W-IW*s)/2;if(S.hug){s=Math.max(s,(W-4)/(S.hug[1]-S.hug[0]));ox=Math.min(0,Math.max(W-IW*s,W/2-(S.hug[0]+S.hug[1])/2*s));}return [s,ox];})(),oy=IH*s>H?Math.max(H-IH*s,Math.min(0,H*.78-FIRE.base*s)):(H-IH*s)/2;
  const ch=cv.width!==Math.round(W*d)||cv.height!==Math.round(H*d);if(ch){cv.width=Math.round(W*d);cv.height=Math.round(H*d);}box={s,ox,oy,W,H,d};if(ch||!placed){place();placed=true;}return true;}
const scr=(ix,iy)=>[box.ox+ix*box.s,box.oy+iy*box.s];
function shadowUnder(k){const p=P[k],cx=p.x+p.w/2,cy=p.y+p.h-4,rx=p.w*.48,ry=p.w*.09;x.save();x.globalAlpha=.85;x.drawImage(SHADOW,cx-rx,cy-ry,rx*2,ry*2);x.restore();}
function drawComp(k,t){const p=P[k],im=IMG[k];if(!im)return;const br=Math.sin(t*TAU/p.per+p.ph),sy=1+.012*br,sx=1-.005*br;shadowUnder(k);
  x.save();x.translate(p.x+p.w/2,p.y+p.h);x.scale(sx,sy);x.drawImage(im,-p.w/2,-p.h,p.w,p.h);x.restore();
  /* the emblem's glow rises and falls with the breath */
  const ey=p.y+p.h-(p.h*(1-p.emb))*sy,gr=p.w*.22;x.save();x.globalCompositeOperation="lighter";x.globalAlpha=.14+.12*(br+1)/2;
  const g=x.createRadialGradient(p.x+p.w/2,ey,0,p.x+p.w/2,ey,gr);g.addColorStop(0,`rgba(${p.col},.85)`);g.addColorStop(1,`rgba(${p.col},0)`);x.fillStyle=g;x.fillRect(p.x+p.w/2-gr,ey-gr,gr*2,gr*2);x.restore();}
function rim(k,f){const p=P[k],cx=p.x+(p.side>0?p.w*.9:p.w*.1),cy=p.y+p.h*.66,r=p.w*.42;x.save();x.globalCompositeOperation="lighter";x.globalAlpha=.06+.06*f;x.drawImage(GLOW,cx-r,cy-r,r*2,r*2);x.restore();}
function drawFire(t,dt,f){const k=1+flare*.6,z=FIRE.k;x.save();x.globalCompositeOperation="lighter";
  x.globalAlpha=.30*k*(.85+.25*f);x.drawImage(GLOW,FIRE.x-330*z,FIRE.base-120*z,660*z,250*z);                 /* light on the ground and the stones */
  x.globalAlpha=.12*k*(.9+.2*f);x.drawImage(GLOW,FIRE.x-480*z,FIRE.base-560*z,960*z,820*z);                   /* the warm air around the fire */
  /* flame tongues, rooted in the logs: each leans and stretches on its own rhythm */
  for(let i=0;i<5;i++){const o=i-2,ph=t*(3.1+i*.83)+i*1.7,h=(150+55*(.5+.5*Math.sin(ph))+30*f)*(1+flare*.5)*(1-Math.abs(o)*.16)*z,w=h*.42,bx=FIRE.x+o*24*z,lean=Math.sin(t*2.1+i*1.3)*.08;
    x.save();x.translate(bx,FIRE.base-6);x.rotate(lean);x.globalAlpha=(.34-Math.abs(o)*.05)*(.85+.3*f);x.drawImage(FLAME,-w/2,-h,w,h);x.restore();}
  x.globalAlpha=.5+.25*f;x.drawImage(FLAME,FIRE.x-22*z,FIRE.base-110*z*(1+flare*.4),44*z,110*z*(1+flare*.4));     /* the bright heart */
  /* sparks, rising from the flame tips and fading */
  const rate=(6+flare*40)*dt;for(let n=0;n<rate+(R()<rate%1?1:0);n++)if(sparks.length<70)sparks.push({x:FIRE.x+(R()-.5)*60,y:FIRE.base-110-R()*50,vx:(R()-.5)*40,vy:-(60+R()*90)*(1+flare*.5),l:1,d:.8+R()*.7,s:.7+R()*1.1,p:R()*TAU});
  for(let i=sparks.length-1;i>=0;i--){const s=sparks[i];s.l-=dt*s.d;if(s.l<=0){sparks.splice(i,1);continue;}s.x+=(s.vx+Math.sin(t*2+s.p)*22)*dt;s.y+=s.vy*dt;x.globalAlpha=Math.min(1,s.l*1.4);const r=s.s*2.8;x.drawImage(SPARK,s.x-r,s.y-r,r*2,r*2);}
  x.restore();
  if(R()<dt*1.2)smoke.push({x:FIRE.x+(R()-.5)*24,y:FIRE.top+10,r:22,l:1,vx:4+R()*8});
  x.save();for(let i=smoke.length-1;i>=0;i--){const m=smoke[i];m.l-=dt/6;if(m.l<=0){smoke.splice(i,1);continue;}m.y-=26*dt;m.x+=m.vx*dt;m.r+=12*dt;x.globalAlpha=.08*m.l;x.drawImage(SMOKE,m.x-m.r,m.y-m.r,m.r*2,m.r*2);}x.restore();}
function drawSky(t){x.save();x.globalCompositeOperation="lighter";
  if(FX.moon){const hb=.75+.25*Math.sin(t*.5);x.globalAlpha=.55*hb;x.drawImage(HALO,FX.moon[0]-130,FX.moon[1]-130,260,260);}                  /* the moon's halo breathes */
  for(const s of stars){const a=Math.max(0,Math.sin(t*s.s+s.p));x.globalAlpha=a*a*.9;const r=4*s.r;x.drawImage(STAR,s.x-r,s.y-r,r*2,r*2);}
  x.restore();}
function drawWater(t,dt){x.save();x.globalCompositeOperation="lighter";x.strokeStyle="rgba(230,235,255,.16)";x.lineWidth=1.8;x.beginPath();
  for(const f of falls){f.y+=f.v*dt;if(f.y>FX.falls[1]+FX.falls[3]){f.y=FX.falls[1]+4+R()*20;f.x=FX.falls[0]+10+R()*80;}x.moveTo(f.x,f.y);x.lineTo(f.x+1,f.y+f.l);}x.stroke();
  for(const g of glints){const a=Math.max(0,Math.sin(t*g.s+g.p));x.globalAlpha=a*a*.7;x.drawImage(STAR,g.x-4,g.y-2,8,4);}x.restore();}
function drawFlies(t,front){x.save();x.globalCompositeOperation="lighter";
  for(const f of flies){if(f.front!==front)continue;const px=f.x+Math.sin(t*f.sx+f.p)*f.ax,py=f.y+Math.sin(t*f.sy+f.p*1.3)*f.ay,bl=Math.max(0,Math.sin(t*f.bs+f.b));x.globalAlpha=.15+.85*bl*bl;const r=11*f.s*(front?1.6:1);x.drawImage(FLY,px-r,py-r,r*2,r*2);}x.restore();}
function drawFog(t){x.save();FX.fog.map((y,i)=>[y,[.6,.9,.7][i%3],[0,.4,.7][i%3],[.3,.24,.2][i%3]]).forEach(([y,sp,o,a])=>{const w=620,off=((t*sp*10+o*(IW+w))%(IW+w))-w;x.globalAlpha=a;x.drawImage(FOG,off,y-60,w,150);x.drawImage(FOG,off-(IW+w),y-60,w,150);});x.restore();}
function frame(t,dt){if(!layout())return;const {s,ox,oy,d}=box;try{meteors(t,dt);}catch(e){}
  /* the instant background is only for the moment before the first frame; then the canvas carries it alone */
  {const a=$("#app");if(a&&!a.classList.contains("ekready"))requestAnimationFrame(()=>a.classList.add("ekready"));}
  if(G){flare=held?Math.min(1,flare+dt*1.6):Math.max(0,flare-dt*1.2);if(flareT>0){flareT-=dt;flare=Math.max(flare,.9);}if(G.render(t,dt,{W:box.W,H:box.H,d,sc:s,ox,oy,flick:flick(t),flare})===false){freshCanvas();renderer();}return;}x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,cv.width,cv.height);x.setTransform(d*s,0,0,d*s,d*ox,d*oy);
  /* the painting is drawn at screen size once, then copied each frame (no resizing every frame) */
  if(IMG.bg){const key=cv.width+"x"+cv.height+":"+IMG.bg.src+":"+s;if(!BGC||BGC.key!==key){BGC=document.createElement("canvas");BGC.width=cv.width;BGC.height=cv.height;BGC.key=key;const g=BGC.getContext("2d");g.setTransform(d*s,0,0,d*s,d*ox,d*oy);g.drawImage(IMG.bg,0,0,IW,IH);}
    x.setTransform(1,0,0,1,0,0);x.drawImage(BGC,0,0);x.setTransform(d*s,0,0,d*s,d*ox,d*oy);}
  flare=held?Math.min(1,flare+dt*1.6):Math.max(0,flare-dt*1.2);if(flareT>0){flareT-=dt;flare=Math.max(flare,.9);}
  const f=flick(t);drawSky(t);drawFog(t);drawWater(t,dt);drawFlies(t,false);drawComp("siro",t);drawComp("ava",t);rim("siro",f);rim("ava",f);drawFire(t,dt,f);drawComp("soma",t);drawComp("orra",t);rim("soma",f);rim("orra",f);drawFlies(t,true);}
function active(){const v=$("#view-fire"),a=$("#app");return !!cv&&!!v&&v.classList.contains("active")&&!document.hidden&&MODE()!=="simple"&&wrap.offsetParent!==null&&!(a&&(a.classList.contains("ek3d")||a.classList.contains("ekclassic")));}
function tick(ts){raf=0;if(!active()){drawn=false;return;}const m=MODE();if(m==="still"){if(!drawn){frame(clock,1);drawn=true;}return;}
  if(ts-last>=32){const iv=last?ts-last:33;let dt=Math.min(.1,iv/1000||.033);last=ts;
    /* a safety net: WebGL work lands on the graphics chip after the draw returns, so watch the real time between frames;
       if this phone's graphics are too slow for WebGL, carry on with the 2D renderer */
    if(G&&!document.hidden&&iv<400){glN++;glMs=glN<2?iv:glMs*.9+iv*.1;if(glN>45&&glMs>70)to2D();}if(m==="calm")dt*=.45;clock+=dt;frame(clock,dt);}raf=requestAnimationFrame(tick);}
function kick(){if(!raf&&active()){last=0;raf=requestAnimationFrame(tick);}}
function freshCanvas(){const n=document.createElement("canvas");n.className="ekpaintcv";n.setAttribute("aria-hidden","true");if(cv)cv.replaceWith(n);else wrap.insertBefore(n,wrap.firstChild);cv=n;x=null;G=null;BGC=null;placed=false;glN=0;glMs=0;}
function renderer(){/* WebGL first (a real fire on the painting without its flame); the 2D renderer otherwise */
  try{IMG.bgnf=IMG["bgnf:"+SID];IMG.bg=IMG["bg:"+SID];G=(window.EKHOMEGL&&IMG.bgnf)?EKHOMEGL.create(cv,IMG,P,FIRE,IW,IH,FX):null;}catch(e){G=null;}if(!G)x=cv.getContext("2d");cv.dataset.renderer=G?"webgl":"2d";}
function to2D(){freshCanvas();x=cv.getContext("2d");cv.dataset.renderer="2d";}
/* ---------- the buttons, kept and moved over the painting ---------- */
let hits=null,fire=null,BGC=null;
function place(){if(!hits)return;for(const k of ORDER){const p=P[k],b=hits.querySelector(`[data-k="${k}"]`);if(!b)continue;const [l,tp]=scr(p.x+p.w*.18,p.y+p.h*.08),[r,bt]=scr(p.x+p.w*.82,p.y+p.h*.96);
    Object.assign(b.style,{left:Math.max(0,l)+"px",top:tp+"px",width:Math.max(30,r-Math.max(0,l))+"px",height:(bt-tp)+"px",zIndex:String(Math.round(p.y+p.h))});}
  if(classic())return;
  for(const [sel,box] of [[".ekspot.ekcabin",S.hot.cabin],[".ekspot.ekstar",S.hot.star]]){const h=document.querySelector(sel);if(!h)continue;if(h.parentNode!==wrap)wrap.appendChild(h);const [l,t]=scr(box[0],box[1]),[r,b]=scr(box[2],box[3]);pin(h,l,t,r-l,b-t);}
  if(fire){if(fire.parentNode!==wrap)wrap.appendChild(fire);/* the fire answers on the flame itself (at least 64 px wide), so the companions sitting behind it answer on their own bodies */const z=FIRE.k,[cx,ft]=scr(FIRE.x,FIRE.top-10*z),[,fb]=scr(FIRE.x,FIRE.base+30*z),hw=Math.max(32,scr(FIRE.x+60*z,0)[0]-cx);pin(fire,cx-hw,ft,hw*2,fb-ft);}}
function pin(e,l,t,w,h){e.classList.add("ekpin");e.style.setProperty("--ekl",l+"px");e.style.setProperty("--ekt",t+"px");e.style.setProperty("--ekw",w+"px");e.style.setProperty("--ekh",h+"px");}
function setup(){wrap=$(".scenewrap");if(!wrap||cv)return;const app=$("#app");
  /* where the fire button and the hotspots first lived, so Classic can return them there */
  fire=wrap.querySelector(".firetap");HOME.fire=fire?[fire.parentNode,fire.nextSibling]:null;document.querySelectorAll(".ekspot.ekcabin,.ekspot.ekstar").forEach(h=>{HOME[h.classList.contains("ekcabin")?"cabin":"star"]=[h.parentNode,h.nextSibling];});
  freshCanvas();renderer();
  hits=document.createElement("div");hits.className="ekhits";hits.innerHTML=ORDER.map(k=>{let n=k;try{n=COMPANIONS[k].name+", "+COMPANIONS[k].role;}catch(e){}return `<button type="button" data-k="${k}" aria-label="Sit with ${n}"></button>`;}).join("");
  wrap.appendChild(hits);hits.addEventListener("click",e=>{const b=e.target.closest("button[data-k]");if(!b)return;const m=document.querySelector(`#ring .mate[data-c="${b.dataset.k}"]`);if(m)m.click();});
  if(fire){fire.classList.add("ekfire");fire.addEventListener("pointerdown",()=>{held=true;kick();});["pointerup","pointerleave","pointercancel"].forEach(t=>fire.addEventListener(t,()=>{held=false;}));fire.addEventListener("click",()=>{flareT=.45;});}
  if(!classic())app.classList.add("ekpaint");wrap.addEventListener("click",sceneTap);layout();kick();}
/* ---------- scenes, and Classic (the old Home with its sun, moon, star and cabin) ---------- */
const HOME={};const classic=()=>{const a=$("#app");return !!a&&a.classList.contains("ekclassic");};
const sceneFiles=id=>Promise.all([load("bg:"+id,SCENES[id].bg),load("bgnf:"+id,SCENES[id].bgnf)]);
function backdrop(){const d=document.documentElement,a=$("#app");d.style.removeProperty("--eklq");d.style.setProperty("--ekpre",`url("${S.bg}")`);d.classList.toggle("ekpre-z",(S.zoom||1)>1);if(a)a.classList.remove("ekready");}
function setScene(id){/* the scene changes only once its paintings have arrived, so layout and painting always change together */const to=SCENES[id]?id:"milkyway";return sceneFiles(to).then(()=>{useScene(to);backdrop();label();if(!cv)return;freshCanvas();renderer();layout();drawn=false;kick();});}
function nextScene(){const i=SORDER.indexOf(SID);setScene(SORDER[(i+1)%SORDER.length]);}
function label(){}
function setClassic(on){const a=$("#app");if(!a)return;a.classList.toggle("ekclassic",on);a.classList.toggle("ekpaint",!on);saveLook(on?"classic":"milkyway");art();placeSound();
  const back=(el,where)=>{if(!el||!where)return;el.classList.remove("ekpin");["--ekl","--ekt","--ekw","--ekh"].forEach(v=>el.style.removeProperty(v));if(el.parentNode!==where[0])where[0].insertBefore(el,where[1]&&where[1].parentNode===where[0]?where[1]:null);};
  if(on){back(fire,HOME.fire);back(document.querySelector(".ekspot.ekcabin"),HOME.cabin);back(document.querySelector(".ekspot.ekstar"),HOME.star);try{manualPhase=null;applyPhase();}catch(e){}try{EL.kick();}catch(e){}}
  else{placed=false;night();}
  backdrop();drawn=false;kick();}
function controls(){const sw=$("#view-fire .scenewrap");if(!sw||$(".ekctrl"))return;const row=document.createElement("div");row.className="ekctrl";row.setAttribute("role","group");row.setAttribute("aria-label","Home controls");
  row.insertAdjacentHTML("beforeend",'<button type="button" class="ekcb" data-go="settings"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2.2"/><circle cx="10" cy="17" r="2.2"/></svg><span>Settings</span></button>');
  row.insertAdjacentHTML("beforeend",'<button type="button" class="ekcb" data-go="scene" aria-haspopup="listbox" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18l5-7 4 5 3-4 6 6z"/><circle cx="16" cy="7" r="2.2"/></svg><span>Scene</span><svg class="ekchev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>');
  row.addEventListener("click",e=>{const b=e.target.closest("[data-go]");if(!b)return;const g=b.dataset.go;
    if(g==="scene"){if(window.EKHOWTO)EKHOWTO.close();if(window.EKSCENE)EKSCENE.toggle();return;}
    if(g==="settings"){const t=$("#ekGear");if(t)t.click();}});
  sw.parentNode.insertBefore(row,sw.nextSibling);placeSound();}
/* Sound lives beside Day/Now in Classic (as it always did there); Milky Way has no time control, so there it sits in the row under the scene */
function placeSound(){const snd=$("#hcSound"),hc=$(".homectl"),row=$(".ekctrl");if(!snd)return;if(classic()&&hc){if(snd.parentNode!==hc||hc.firstElementChild!==snd)hc.insertBefore(snd,hc.firstChild);}else if(row){const sc=row.querySelector('[data-go="scene"]');if(snd.nextElementSibling!==sc||snd.parentNode!==row)row.insertBefore(snd,sc);}}
function tabs(){const sw=$("#view-fire .scenewrap");if(!sw||$(".ekctabs"))return;controls();const C=(typeof COMPANIONS!=="undefined"?COMPANIONS:{});
  const row=document.createElement("div");row.className="ekctabs";row.setAttribute("role","list");row.setAttribute("aria-label","Your companions");
  row.innerHTML=ORDER.map(k=>{const c=C[k]||{name:k,role:"",tint:"#FFD08A"};return `<button type="button" role="listitem" class="ekct" data-k="${k}" style="--c:${c.tint}"><img src="${face(k)}" alt=""><span><b>${c.name}</b><small>${c.role||""}</small></span></button>`;}).join("");
  const anchor=$(".ekctrl")||sw;anchor.parentNode.insertBefore(row,anchor.nextSibling);row.addEventListener("click",e=>{const b=e.target.closest(".ekct");if(b)openStory(b.dataset.k);});
  const u=$("#view-fire .under");if(u){u.classList.add("ekunder");row.after(u);}}
let story=null;
function openStory(k){const C=(typeof COMPANIONS!=="undefined"?COMPANIONS:{})[k]||{name:k,role:""},A=(window.EK_ABOUT||{})[k]||{},chips=(C.chips||[]).slice(0,4);closeStory(true);
  story=document.createElement("div");story.className="ekstory"+(classic()?" ekcl":"");story.setAttribute("role","dialog");story.setAttribute("aria-modal","true");story.setAttribute("aria-label",C.name);story.style.setProperty("--c",C.tint||"#FFD08A");
  story.innerHTML=`<div class="ekobg"></div><button type="button" class="ekox" aria-label="Close">&times;</button><div class="ekoin"><div class="ekoart"><img src="${hero(k)}" alt="${C.name}"></div>
    <div class="ekotx"><h2>${C.name}</h2><p class="ekorole">${C.role||""}</p>${A.p?`<p class="ekop">${A.p}</p>`:""}${A.w?`<p class="ekow">${A.w}</p>`:""}
    ${chips.length?`<p class="ekok">Things people bring to the fire</p><div class="ekochips">${chips.map(t=>`<button type="button" data-t="${t.replace(/"/g,"&quot;")}">${t}</button>`).join("")}</div>`:""}
    <button type="button" class="ekogo">Talk with ${C.name}</button><button type="button" class="ekono">Not just now</button></div></div>`;
  document.body.appendChild(story);requestAnimationFrame(()=>story.classList.add("on"));
  story.addEventListener("click",e=>{if(e.target.closest(".ekox,.ekono")){closeStory();return;}const ch=e.target.closest(".ekochips button");if(e.target.closest(".ekogo")||ch){closeStory(true);try{openChat(k,ch?ch.dataset.t:undefined);}catch(x){}}});}
function closeStory(now){const s=story;if(!s)return;story=null;s.classList.remove("on");setTimeout(()=>s.remove(),now?0:320);}
/* ---------- the night's small things on a light overlay: shooting stars now and then (or where you tap the sky),
   clipped by the scene's sky mask so they pass behind the trees; tiny sparks when you tap round the fire; dark
   night leaves when you tap the trees ---------- */
let MC=null,MX=null,SKY=null,SKYK="",SKYD=null,met=[],bits=[],nextMet=3,metOn=false;
function skyAt(ix,iy){if(!SKYD)return 0;const x=Math.floor(ix/IW*SKYD.w),y=Math.floor(iy/IH*SKYD.h);if(x<0||y<0||x>=SKYD.w||y>=SKYD.h)return 0;return SKYD.a[(y*SKYD.w+x)*4+3]/255;}
function addMeteor(x,y,dir){const ang=.12+Math.random()*.5,sp=520+Math.random()*300;met.push({x,y,vx:dir*Math.cos(ang)*sp,vy:Math.sin(ang)*sp,age:0,life:1.1+Math.random()*.5,len:230+Math.random()*120});}
function tapSparks(x,y){for(let n=0;n<16;n++){const a=-Math.PI/2+(Math.random()-.5)*1.6,v=60+Math.random()*120;bits.push({k:"s",x:x+(Math.random()-.5)*20,y,vx:Math.cos(a)*v*.5,vy:Math.sin(a)*v,age:0,life:.7+Math.random()*.6,r:1.2+Math.random()*1.4,p:Math.random()*TAU});}}
function leaves(x,y){for(let n=0;n<7;n++)bits.push({k:"l",x:x+(Math.random()-.5)*110,y:y+(Math.random()-.5)*60,vx:(Math.random()-.5)*50,vy:20+Math.random()*40,age:0,life:2.4+Math.random()*1.2,r:8+Math.random()*5,rot:Math.random()*TAU,spin:(Math.random()-.5)*3,p:Math.random()*TAU,h:Math.random()});}
function meteors(t,dt){const want=!classic()&&MODE()!=="still";if(!want){if(metOn){MX&&MX.clearRect(0,0,MC.width,MC.height);metOn=false;}met.length=0;bits.length=0;return;}
  if(!MC){MC=document.createElement("canvas");MC.className="ekmeteor";MC.setAttribute("aria-hidden","true");wrap.insertBefore(MC,cv.nextSibling);MX=MC.getContext("2d");}
  if(S.sky&&SKYK!==S.sky){SKYK=S.sky;SKYD=null;SKY=new Image();SKY.onload=()=>{const c=document.createElement("canvas");c.width=SKY.naturalWidth;c.height=SKY.naturalHeight;const g=c.getContext("2d");g.drawImage(SKY,0,0);SKYD={w:c.width,h:c.height,a:g.getImageData(0,0,c.width,c.height).data};};SKY.src=S.sky;}
  const skyOk=!!(S.sky&&SKY&&SKY.complete&&SKY.naturalWidth),{s,ox,oy,d,W,H}=box;if(MC.width!==Math.round(W*d)||MC.height!==Math.round(H*d)){MC.width=Math.round(W*d);MC.height=Math.round(H*d);}
  if(skyOk){nextMet-=dt*(MODE()==="calm"?.5:1);if(nextMet<=0){nextMet=4+Math.random()*7;const dir=Math.random()<.5?-1:1;addMeteor(dir>0?IW*(.12+Math.random()*.3):IW*(.58+Math.random()*.3),IH*(.03+Math.random()*.12),dir);if(Math.random()<.15)nextMet=.6+Math.random();}}else met.length=0;
  if(!met.length&&!bits.length){if(metOn){MX.setTransform(1,0,0,1,0,0);MX.clearRect(0,0,MC.width,MC.height);metOn=false;}return;}
  metOn=true;MX.setTransform(1,0,0,1,0,0);MX.globalCompositeOperation="source-over";MX.clearRect(0,0,MC.width,MC.height);MX.setTransform(d*s,0,0,d*s,d*ox,d*oy);
  for(let i=met.length-1;i>=0;i--){const m=met[i];m.age+=dt;if(m.age>=m.life){met.splice(i,1);continue;}m.x+=m.vx*dt;m.y+=m.vy*dt;
    const u=m.age/m.life,fade=Math.min(1,u*6)*Math.min(1,(1-u)*3),n=Math.hypot(m.vx,m.vy),tx=m.x-m.vx/n*m.len,ty=m.y-m.vy/n*m.len,g=MX.createLinearGradient(tx,ty,m.x,m.y);
    g.addColorStop(0,"rgba(180,200,255,0)");g.addColorStop(.7,`rgba(220,232,255,${.7*fade})`);g.addColorStop(1,`rgba(255,255,255,${fade})`);
    MX.lineCap="round";MX.strokeStyle=`rgba(190,210,255,${.1*fade})`;MX.lineWidth=6/s;MX.beginPath();MX.moveTo((tx+m.x*2)/3,(ty+m.y*2)/3);MX.lineTo(m.x,m.y);MX.stroke();
    MX.strokeStyle=g;MX.lineWidth=2.6/s;MX.beginPath();MX.moveTo(tx,ty);MX.lineTo(m.x,m.y);MX.stroke();/* a soft glowing head, like the Breathe screen's stars */const hg=MX.createRadialGradient(m.x,m.y,0,m.x,m.y,6/s);hg.addColorStop(0,`rgba(255,255,255,${fade})`);hg.addColorStop(.35,`rgba(222,234,255,${.55*fade})`);hg.addColorStop(1,"rgba(200,215,255,0)");MX.fillStyle=hg;MX.beginPath();MX.arc(m.x,m.y,6/s,0,TAU);MX.fill();}
  if(met.length&&skyOk){/* clip to the sky only where the stars are (not the whole screen each frame) */let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const m of met){const n=Math.hypot(m.vx,m.vy)||1,tx=m.x-m.vx/n*m.len,ty=m.y-m.vy/n*m.len;x0=Math.min(x0,m.x,tx);y0=Math.min(y0,m.y,ty);x1=Math.max(x1,m.x,tx);y1=Math.max(y1,m.y,ty);}
    const pad=14/s;MX.save();MX.beginPath();MX.rect(x0-pad,y0-pad,x1-x0+pad*2,y1-y0+pad*2);MX.clip();MX.globalCompositeOperation="destination-in";MX.drawImage(SKY,0,0,IW,IH);MX.restore();MX.globalCompositeOperation="source-over";}
  for(let i=bits.length-1;i>=0;i--){const q=bits[i];q.age+=dt;if(q.age>=q.life){bits.splice(i,1);continue;}const u=q.age/q.life;
    if(q.k==="s"){q.vy+=40*dt;q.x+=(q.vx+Math.sin(t*9+q.p)*14)*dt;q.y+=q.vy*dt;const a=(1-u)*(.7+.3*Math.sin(t*20+q.p));MX.globalCompositeOperation="lighter";
      MX.fillStyle=`rgba(255,170,70,${.35*a})`;MX.beginPath();MX.arc(q.x,q.y,q.r*2.6/s,0,TAU);MX.fill();MX.fillStyle=`rgba(255,236,170,${a})`;MX.beginPath();MX.arc(q.x,q.y,q.r/s,0,TAU);MX.fill();MX.globalCompositeOperation="source-over";}
    else{q.x+=(q.vx+Math.sin(t*1.6+q.p)*22)*dt;q.y+=q.vy*dt;q.rot+=q.spin*dt;const a=Math.min(1,u*5)*Math.min(1,(1-u)*2.5),r=q.r/s;MX.save();MX.translate(q.x,q.y);MX.rotate(q.rot);MX.scale(1,.45+.35*Math.abs(Math.sin(t*2.2+q.p)));
      /* soft night leaves in the Breathe screen's style: a gentle glow to nothing at the edge, no outline */const lg=MX.createRadialGradient(-r*.25,-r*.1,0,0,0,r);lg.addColorStop(0,`rgba(${40+q.h*10},${70+q.h*14},${44+q.h*8},${.92*a})`);lg.addColorStop(.6,`rgba(${22+q.h*8},${44+q.h*10},${28+q.h*6},${.88*a})`);lg.addColorStop(1,"rgba(12,26,16,0)");MX.fillStyle=lg;MX.beginPath();MX.ellipse(0,0,r,r*.5,0,0,TAU);MX.fill();MX.restore();}}}
/* a tap on the scene itself: the sky sends a shooting star, round the fire throws sparks, the trees let fall a few leaves */
function sceneTap(e){if(!cv||classic()||!active())return;if(e.target.closest&&e.target.closest("button,a,.ekspot,.firetap,.ekhits,input,.ekctrl,.hero"))return;const r=wrap.getBoundingClientRect(),ix=(e.clientX-r.left-box.ox)/box.s,iy=(e.clientY-r.top-box.oy)/box.s;
  const rg=S.ring||[200,80],dx=(ix-FIRE.x)/rg[0],dy=(iy-FIRE.base)/rg[1];
  if(dx*dx+dy*dy<=1){tapSparks(ix,FIRE.base-FIRE.k*40);kick();return;}
  if(S.sky&&skyAt(ix,iy)>.5){addMeteor(ix,iy,ix>=IW/2?-1:1);kick();return;}
  if(S.trees&&iy<S.trees&&!(S.sky&&skyAt(ix,iy)>.2)){leaves(ix,iy);kick();}}
window.EKPAINT={whatIsAt:(x,y)=>{const r=wrap.getBoundingClientRect(),ix=(x-r.left-box.ox)/box.s,iy=(y-r.top-box.oy)/box.s,rg=S.ring||[200,80],dx=(ix-FIRE.x)/rg[0],dy=(iy-FIRE.base)/rg[1];return dx*dx+dy*dy<=1?"fire":S.sky&&skyAt(ix,iy)>.5?"sky":S.trees&&iy<S.trees&&!(S.sky&&skyAt(ix,iy)>.2)?"trees":"";},meteorNow:()=>{nextMet=0;},modes:()=>SORDER.map(id=>({id,name:SCENES[id].name})),open:openStory,close:()=>closeStory(),isOpen:()=>!!story,kick,repin:()=>{placed=false;kick();},setClassic,isClassic:classic,useMilkyWay,setScene,scene:()=>SID};
/* ---------- start ---------- */
function night(){if(classic())return;try{if(manualPhase!=="night"){manualPhase="night";applyPhase();}}catch(e){}}
/* Home has two looks. Classic (the original illustrated fire) is the default for everyone: new people, refreshed
   sessions and every update. Milky Way (the realistic forest) appears only when the person picks it in Scene, and
   that choice is kept as "ek-look". The keys from earlier releases (ek-homemode, ek-scene, ek-home3d) are retired,
   so a scene saved before 3.9.0 (Meadow, Mossy forest, Violet valley, 3D) opens as Classic. */
function savedLook(){try{return localStorage.getItem("ek-look")==="milkyway"?"milkyway":"classic";}catch(e){return "classic";}}
function saveLook(v){try{localStorage.setItem("ek-look",v);["ek-homemode","ek-scene","ek-home3d"].forEach(k=>localStorage.removeItem(k));}catch(e){}}
const face=k=>classic()&&typeof CMP_CLASSIC!=="undefined"?CMP_CLASSIC[k]:`img/home/${k}-face.webp`;
const hero=k=>classic()&&typeof CMP_CLASSIC!=="undefined"?CMP_CLASSIC[k]:`img/home/${k}-hero.webp`;
function art(){document.querySelectorAll(".ekctabs .ekct[data-k] img").forEach(i=>{i.src=face(i.parentNode.dataset.k);});}
/* the painted scene's files load only when Milky Way is wanted, so Classic never downloads them */
let paintP=null;const painted=()=>paintP||(paintP=Promise.all([sceneFiles(SID),...ORDER.map(k=>load(k,`img/home/${k}.webp`))]).then(()=>setup()));
function useMilkyWay(){return painted().then(()=>{setClassic(false);});}
function init(){const look=savedLook();useScene("milkyway");
  wrap=$(".scenewrap");const a=$("#app");if(look==="classic"){if(a)a.classList.add("ekclassic");}else backdrop();setInterval(night,5000);tabs();
  if(look==="classic")setClassic(true);else painted().then(()=>{night();kick();});
  setInterval(kick,700);document.addEventListener("visibilitychange",()=>{glN=0;glMs=0;last=0;kick();});window.addEventListener("resize",()=>{if(cv){layout();drawn=false;kick();}});window.addEventListener("ekmode",()=>{drawn=false;kick();});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
