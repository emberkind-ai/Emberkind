"use strict";
/* ================= EMBERVALE ENGINE (2.5D) =================
   Draws the valley full screen. Anything that doesn't move is drawn once into a small cached picture and reused,
   only what's on screen is drawn, and frames are capped at 30 a second, so it stays smooth on phones.
   Drag to look around, pinch or scroll to zoom, and Arrange to move anything onto a free spot. */
const EV=(()=>{
const A=EVA,V=EVW,N=V.N,RM0=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
/* 3.4.0: Basic Display makes the valley a still image (as reduced motion does); Calm turns off only the drifting leaves */
const appCls=c=>{const a=document.getElementById("app");return !!a&&a.classList.contains(c);};let RM=!!RM0||appCls("simple");
try{VALE.state=()=>state;VALE.cam=()=>({z:cam.z,x:cam.x,y:cam.y,S,ox,oy});}catch(e){}/* read-only view of the valley, for checks */
try{new MutationObserver(()=>{const n=!!RM0||appCls("simple");if(n!==RM){RM=n;LEAVES.length=0;try{redraw();}catch(e){}}}).observe(document.getElementById("app"),{attributes:true,attributeFilter:["class"]});}catch(e){}
const SEASONS4=["auto","spring","summer","autumn","winter"],SNAME={spring:"Spring",summer:"Summer",autumn:"Autumn",winter:"Winter"};
const imgs={};let cv0=null,W=0,H=0,S=1,ox=0,oy=0,state=null,cam={z:0,x:0,y:0},arranging=false,sel=null,drag=null,placing=null,timeView="auto",seasonView="auto",raf=0,active=false,lastT=0;
const fx={};const fmt=n=>Number(n||0).toLocaleString("en-AU"),esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])),coins=()=>window.EKECO?EKECO.coins():0;
const say=t=>{try{toast(t);}catch(e){}},hash=s=>{let h=7;for(const ch of String(s))h=(h*31+ch.charCodeAt(0))>>>0;return h;};
function img(key,src){let i=imgs[key];if(!i){i=new Image();i.onload=()=>redraw();i.src=src;imgs[key]=i;}return i.complete&&i.naturalWidth?i:null;}
function decorImg(art){try{return img("d_"+art,"data:image/svg+xml;charset=utf-8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">'+DECOR_ART[art]+"</svg>"));}catch(e){return null;}}
function compImg(c){try{return img("cl_"+c,CMP_CLASSIC[c]);}catch(e){return null;}}
function compFront(c){try{return img("cc_"+c,CMP_CLASSIC[c]);}catch(e){return null;}}

/* ---------- cached pictures: each still thing is drawn once per zoom step, then reused ---------- */
const SC=new Map();let SCK=0;
function cached(key,k,box,draw){if(k!==SCK){SC.clear();SCK=k;}let e=SC.get(key);
  if(!e){const c=document.createElement("canvas");c.width=Math.max(1,Math.ceil((box[2]-box[0])*k));c.height=Math.max(1,Math.ceil((box[3]-box[1])*k));
    const x=c.getContext("2d");x.setTransform(k,0,0,k,-box[0]*k,-box[1]*k);const L=[];e={c,box,L,extra:draw(x,L)};SC.set(key,e);if(SC.size>500)SC.delete(SC.keys().next().value);}
  return e;}
function stamp(x,e,ax,ay,L,a){if(a!=null&&a<1)x.globalAlpha=a;x.drawImage(e.c,ax+e.box[0],ay+e.box[1],e.box[2]-e.box[0],e.box[3]-e.box[1]);x.globalAlpha=1;if(L)for(const l of e.L)L.push([l[0]+ax,l[1]+ay,l[2],l[3]]);}
const TB={sap:[-16,-34,16,8],young:[-30,-64,30,10],fruit:[-22,-46,22,8],gum:[-30,-78,30,10],jac:[-30,-66,30,10],ancient:[-176,-340,176,44]}/* 2.6: the ancient tree's roots drew 2px below its old box */;
const treeS=(kind,s,se,v,k)=>cached(`t${kind}${s}${se}${v}`,k,TB[kind].map(n=>n*s),x=>A.tree(x,0,0,s,se,v*7+3,kind));
const smallS=(kind,se,v,k)=>kind==="rock"?cached("r"+v,k,[-15,-12,15,6],x=>A.rock(x,0,0,1,v)):kind==="shrub"?cached(`s${se}${v}`,k,[-17,-20,17,7],x=>A.shrub(x,0,0,1,se,v)):cached(`f${se}${v}`,k,[-20,-14,20,10],x=>A.flowers(x,0,0,1,se,v*5+1));

/* ---------- drawing ---------- */
const base=(w,h)=>Math.min(w*.96/(N*A.TW),h*.9/(N*A.TH+120));
function zoom0(w,h,st){const R=Math.min(st?st.R:6,N);return Math.max(.55,Math.min(.85,w*1.1/(2*R*45)))/base(w,h);}
/* ---------- cinema: the camera glides from place to place (journeys into practices) ---------- */
let cine=null,cineOn=false;
const camAt=(c,r,z,up,w,h)=>{const s=base(w,h)*z,p=A.P(c,r),wy=p[1]-(up||0);return {z,x:-p[0]*s,y:-.05*h+(N*A.TH/2-wy)*s};};
const eio=u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;
function cineStep(ts){if(!cine)return;const u=Math.min(1,(ts-cine.t0)/cine.dur),e=eio(u),f=cine.from,t=cine.to,L=(a,b)=>a+(b-a)*e;
  const z=L(f[2],t[2])*(1-(cine.arc||0)*Math.sin(Math.PI*u));Object.assign(cam,camAt(L(f[0],t[0]),L(f[1],t[1]),z,L(f[3]||0,t[3]||0),W,H));
  if(u>=1){const d=cine.done;cine=null;d&&d();}}
function view(w,h,thumb,st){const b=base(w,h);
  if(thumb){const R=Math.min(st.R,N);S=Math.max(b,Math.min(w*.95/((2*R+3)*46),h*.95/((2*R+3)*23+70)));ox=w/2;oy=h*.56-(N*A.TH/2)*S;return;}
  if(!cam.z)cam.z=zoom0(w,h,st);S=b*cam.z;ox=w/2+cam.x;oy=h*.55+cam.y-(N*A.TH/2)*S;}
const tilesOf=it=>{const o=[];for(let i=it.c;i<it.c+it.w;i++)for(let j=it.r;j<it.r+it.h;j++)o.push([i,j]);return o;};
function ground(x,it,se,ph){if(it.kind==="spring")A.spring(x,it.c,it.r,ph);else if(it.kind==="garden")A.garden(x,it.c,it.r,se);else if(it.kind==="zen")EVV.zen(x,it.c,it.r,it.lvl,se);else if(it.kind==="pool")EVV.pool(x,it.c,it.r,it.lvl,ph,se);else A.waterBox(x,it.c,it.r,it.c+it.w,it.r+it.h,ph,it.kind==="pond");}
/* 3.0.6: trees lean gently in the wind (their bases stay put) */
function swayStamp(x,e,px,py,L,a,ph,t){if(RM||!t){stamp(x,e,px,py,L,a);return;}const k=Math.sin(t*.0011+ph)*.026+Math.sin(t*.0023+ph*1.7)*.008;x.save();x.translate(px,py);x.transform(1,0,k,1,0,0);stamp(x,e,0,0,null,a);x.restore();}
/* 3.0.6: small green and orange leaves drift and twirl across the view now and then; more when zoomed in */
const LEAVES=[];let leafAt=0,leafT=0;
function leaves(x,w,h,t,se){if(RM||se==="winter"||appCls("calm")){LEAVES.length=0;return;}const dt=leafT?Math.min(.05,(t-leafT)/1000):0;leafT=t;const z=cam.z||1;
  if(t>leafAt&&LEAVES.length<(z>1.4?9:4)){const pal=se==="autumn"?["#E8873A","#D9622E","#F2B54A","#B8742E"]:se==="spring"?["#7CC167","#9AD27A","#F2B54A","#5FA84F"]:["#6FB45A","#4F944A","#E8873A","#8CC56E"];
    LEAVES.push({x:-20,y:h*(.1+Math.random()*.55),vx:26+Math.random()*30,vy:6+Math.random()*12,r:Math.random()*6.3,vr:(Math.random()<.5?-1:1)*(1.2+Math.random()*2),p:Math.random()*6.3,s:(4+Math.random()*3)*Math.min(1.6,Math.max(.9,z*.8)),c:pal[Math.floor(Math.random()*pal.length)]});
    leafAt=t+(z>1.4?700:2200)+Math.random()*(z>1.4?1600:4200);}
  for(let i=LEAVES.length-1;i>=0;i--){const f=LEAVES[i];f.p+=dt*2.2;f.x+=f.vx*dt+Math.sin(f.p)*14*dt;f.y+=f.vy*dt+Math.cos(f.p*.8)*10*dt;f.r+=f.vr*dt;if(f.x>w+30||f.y>h+30){LEAVES.splice(i,1);continue;}
    x.save();x.translate(f.x,f.y);x.rotate(f.r);x.scale(Math.cos(f.p*1.6),1);x.fillStyle=f.c;x.beginPath();x.moveTo(0,-f.s);x.quadraticCurveTo(f.s*.85,-f.s*.15,0,f.s);x.quadraticCurveTo(-f.s*.85,-f.s*.15,0,-f.s);x.fill();
    x.strokeStyle="rgba(60,40,20,.35)";x.lineWidth=.7;x.beginPath();x.moveTo(0,-f.s*.8);x.lineTo(0,f.s*1.25);x.stroke();x.restore();}}
function drawItem(x,it,se,t,L,night,k,smoke){const cc=A.P(it.c+it.w/2,it.r+it.h/2);
  switch(it.kind){
    case "fire":{const L2=[],z=1.5;x.save();x.translate(cc[0],cc[1]);x.scale(z,z);stamp(x,cached("fb"+(it.lv>=4?1:0),k,[-62,-16,62,26],y=>A.fireBase(y,it.lv)),0,0);A.flames(x,0,0,t,L2,night);x.restore();for(const l of L2)L.push([cc[0]+l[0]*z,cc[1]+l[1]*z,l[2]*z,l[3]]);}
      if(it.lv>=6)stamp(x,cached("fe"+night+((window.EKEVENT&&EKEVENT.now())||""),k,[-72,-88,72,34],(y,LL)=>A.festoon(y,night,LL,window.EKEVENT&&EKEVENT.now())),cc[0],cc[1],L);break;
    case "cabin":case "longhouse":{const w=it.kind==="cabin"?2:3,a=A.P(it.c,it.r),wn=se==="winter",e=cached(`h${w}${night}${se}`,k,[-2*32-60,-120,w*32+60,(w+2)*16+60],(y,LL)=>A.house(y,w,2,night,LL,w===2?"#7A4A3A":"#5E6B4A",wn));
      stamp(x,e,a[0],a[1],L);if(smoke&&e.extra)smoke.push([a[0]+e.extra[0],a[1]+e.extra[1],hash(it.id)%100/100]);break;}
    case "flags":A.windflags(x,cc[0],cc[1]+4,t);break;
    case "sap":case "young":{const s=it.kind==="sap"?1:1.15;swayStamp(x,treeS(it.kind,s,se,hash(it.id)%5,k),cc[0],cc[1]+4,null,1,it.c*.7+it.r*.3,t);break;}
    case "ancient":{const sw=RM||!t?0:Math.sin(t*.0009+it.c)*.012;x.save();x.translate(cc[0],cc[1]+8);x.transform(1,0,sw,1,0,0);stamp(x,treeS("ancient",1.1,se,1,k),0,0);const L2=[];A.homewind(x,0,0,1.1,RM?0:t,night,L2);x.restore();for(const l of L2)L.push([l[0]+cc[0],l[1]+cc[1]+8,l[2],l[3]]);break;}
    case "orchard":[[-.45,-.15],[.45,-.15],[0,.45]].forEach(([dc,dr],i)=>{const p=A.P(it.c+1+dc,it.r+1+dr);stamp(x,treeS("fruit",1,se,i,k),p[0],p[1]);});break;
    case "flowers":stamp(x,smallS("flowers",se,hash(it.id)%5,k),cc[0],cc[1]);break;
    case "comp":A.picture(x,compImg(it.who),cc[0],cc[1]+6+(RM?0:Math.sin(t*.002+hash(it.who))*1.2),46);break;
    case "decor":A.decorBase(x,cc[0],cc[1]+8,hash(it.id),se);A.picture(x,decorImg(it.art),cc[0],cc[1]+8,50);break;
    case "circle":{const L2=[];x.save();x.translate(cc[0],cc[1]);EVV.draw(x,"circle",it.lvl,night,L2,se,t);x.restore();for(const l of L2)L.push([l[0]+cc[0],l[1]+cc[1],l[2],l[3]]);break;}
    case "home":case "pod":case "library":case "hall":case "ashram":case "yoga":stamp(x,cached("v"+it.kind+(it.lvl||1)+night+se,k,EVV.BOX[it.kind],(y,LL)=>EVV.draw(y,it.kind,it.lvl,night,LL,se,0)),cc[0],cc[1]+2,L);break;
    case "jac":swayStamp(x,treeS("jac",1.1,se,2,k),cc[0],cc[1]+4,null,1,it.c*.7+it.r*.3,t);break;}
  const f0=fx[it.id];if(f0){const u=(t-f0)/1600;if(u>=0&&u<1){x.strokeStyle=`rgba(255,226,150,${(1-u).toFixed(2)})`;x.lineWidth=2.5;x.beginPath();x.ellipse(cc[0],cc[1],30+u*40,(30+u*40)*.5,0,0,7);x.stroke();for(let i=0;i<8;i++){const a=i/8*6.283+u*2;A.dot(x,cc[0]+Math.cos(a)*(26+u*30),cc[1]-u*40+Math.sin(a)*12,2,`rgba(255,236,170,${(1-u).toFixed(2)})`);}}else if(u>=1)delete fx[it.id];}}
function outline(x,c,r,w,h,col){const pts=[A.P(c,r),A.P(c+w,r),A.P(c+w,r+h),A.P(c,r+h)];x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.fillStyle=col+"38";x.fill();x.strokeStyle=col;x.lineWidth=2/S;x.stroke();}
/* the lake at the foot of the valley, where the river ends */
function drawLake(x,lk,ph,se,t){const m=A.P(lk.c,lk.r),col=ph==="night"?"#2E5C86":"#5AACD8",win=se==="winter",TA=Math.PI*2;
  const blob=(rx,ry,dx,dy)=>{x.beginPath();x.ellipse(m[0]+dx,m[1]+dy,rx,ry,0,0,TA);x.fill();};
  const shape=k=>{blob(lk.rx*k,lk.ry*k,0,0);blob(lk.rx*.62*k,lk.ry*.7*k,-lk.rx*.5,lk.ry*.18);blob(lk.rx*.55*k,lk.ry*.62*k,lk.rx*.48,-lk.ry*.12);};
  x.save();x.fillStyle="#CDBF95";shape(1.12);x.fillStyle=A.shade(col,-.14);shape(1.03);x.fillStyle=col;shape(.95);
  const g=x.createRadialGradient(m[0],m[1],4,m[0],m[1],lk.rx);g.addColorStop(0,"rgba(255,255,255,.16)");g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;shape(.9);
  x.strokeStyle="rgba(255,255,255,.3)";x.lineWidth=1.4;for(let i=0;i<3;i++){const k=((t*.00006)+i/3)%1,rr=.25+k*.55;x.globalAlpha=(1-k)*.9;x.beginPath();x.ellipse(m[0]+lk.rx*.1,m[1],lk.rx*rr*.6,lk.ry*rr*.6,0,0,TA);x.stroke();}x.globalAlpha=1;
  if(!win){for(const [a,b] of [[-.45,.2],[-.3,.4],[.42,-.15],[.56,.12],[.1,.44],[-.6,-.05]]){const px=m[0]+a*lk.rx,py=m[1]+b*lk.ry;x.fillStyle=ph==="night"?"#2F5A33":"#4E8F4A";x.beginPath();x.moveTo(px,py);x.ellipse(px,py,6.5,3.2,0,.5,TA-.15);x.closePath();x.fill();}
    x.fillStyle="#F6B8CC";for(const [a,b] of [[-.45,.2],[.56,.12]]){x.beginPath();x.arc(m[0]+a*lk.rx+1,m[1]+b*lk.ry-1.2,1.9,0,TA);x.fill();}}
  x.strokeStyle=win?"#B9B2A0":ph==="night"?"#3E5A2A":"#5E7F3A";x.lineWidth=1.2;x.lineCap="round";x.beginPath();
  for(let i=0;i<11;i++){const th=.25+i*.24,px=m[0]+Math.cos(th)*lk.rx*1.06,py=m[1]+Math.sin(th)*lk.ry*1.06;x.moveTo(px,py);x.lineTo(px-1.5,py-9-(i%3)*2);x.moveTo(px+2.5,py);x.lineTo(px+3.5,py-7);}x.stroke();
  x.restore();}
function paintTo(c,w,h,thumb,t,st){const d=Math.min(2,window.devicePixelRatio||1),x=c.getContext("2d");
  if(c.width!==Math.round(w*d)||c.height!==Math.round(h*d)){c.width=Math.round(w*d);c.height=Math.round(h*d);}
  view(w,h,thumb,st);const k=Math.pow(2,Math.round(Math.log2(Math.max(.05,S*d))*3)/3),se=thumb||seasonView==="auto"?A.seasonKey():seasonView,ph=thumb||timeView==="auto"?A.phaseOf():timeView,night=ph==="night"||ph==="dusk",L=[],smoke=thumb?null:[];
  x.setTransform(d,0,0,d,0,0);A.sky(x,w,h,se,ph,st.lv,t,false,oy+(A.HZ+60)*S);
  x.setTransform(d*S,0,0,d*S,d*ox,d*oy);
  A.ground(x,N,se,S*d>.55,V.PATCHES,V.TUFTS,V.DOTS);A.river(x,st.river,ph,thumb||RM?0:t*.02);if(st.lake)drawLake(x,st.lake,ph,se,thumb||RM?0:t);A.cloudFrame(x,N,ph);
  /* the gathering circle: a clearing of packed earth around the hearth, edged with stones, where the four
     companions sit, the same fire as Home. Drawn on the ground so the companions and the fire stand on it */
  {const gf=st.items.find(i=>i.id==="fire");if(gf){const m=A.P(gf.c+gf.w/2,gf.r+gf.h/2),lv=gf.lv||1,win=se==="winter",TA=Math.PI*2;
    x.save();x.translate(m[0],m[1]+2);x.scale(1,.5);
    const g=x.createRadialGradient(0,0,8,0,0,128);g.addColorStop(0,win?"rgba(238,234,228,.96)":"rgba(201,170,124,.95)");g.addColorStop(.7,win?"rgba(228,224,218,.88)":"rgba(184,152,108,.82)");g.addColorStop(1,win?"rgba(228,224,218,0)":"rgba(170,140,98,0)");
    x.fillStyle=g;x.beginPath();x.arc(0,0,128,0,TA);x.fill();
    x.fillStyle=win?"rgba(200,196,190,.55)":"rgba(150,118,80,.35)";for(let i=0;i<40;i++){const a=i*2.4,rr=18+((i*37)%90);x.beginPath();x.arc(Math.cos(a)*rr,Math.sin(a)*rr,1.6+(i%3)*.6,0,TA);x.fill();}
    const n=18+Math.min(4,lv)*2;for(let i=0;i<n;i++){const a=i/n*TA+.1,rx=Math.cos(a)*112,ry=Math.sin(a)*112;
      x.fillStyle="rgba(60,52,44,.28)";x.beginPath();x.ellipse(rx+1.5,ry+3,9,7,0,0,TA);x.fill();
      x.fillStyle=i%3?"#a9a39a":"#bdb7ad";x.beginPath();x.ellipse(rx,ry,8.5,6.5,a,0,TA);x.fill();x.fillStyle="rgba(255,255,255,.22)";x.beginPath();x.ellipse(rx-2,ry-2,4,2.6,a,0,TA);x.fill();}
    if(night){const w=x.createRadialGradient(0,0,4,0,0,132);w.addColorStop(0,"rgba(255,170,80,.3)");w.addColorStop(1,"rgba(255,140,60,0)");x.fillStyle=w;x.beginPath();x.arc(0,0,132,0,TA);x.fill();}
    x.restore();}}
  /* each building's path ends in a short spur to its door, tucked just under the front of its base */
  const doorSpurs=(st.doors||[]).map(d=>{const cc=A.P(d.bc+d.w/2,d.br+d.h/2),B=EVV.BOX[d.kind],dy=Math.min(B?B[3]-6:99,(d.w+d.h)*8*(B?1:.8));return [A.P(d.c+.5,d.r+.5),[cc[0],cc[1]+2+dy]];});
  A.paths(x,st.path,se,doorSpurs);if(st.plaza&&st.plaza.length)A.plaza(x,st.plaza,se);if(st.lpath&&st.lpath.length)A.lpath(x,st.lpath,se,ph,L);
  /* where the bridge path reaches the far bank: a small riverside lookout with a bench and a lantern */
  if(st.bridge){const far=[st.bridge.c+2,st.bridge.r];if(st.path.some(p=>p[0]===far[0]&&p[1]===far[1])){const m=A.tileCenter(far[0],far[1]),bx=m[0]+16,by=m[1]+4;
    x.fillStyle="rgba(20,22,24,.25)";x.beginPath();x.ellipse(bx+2,by+3,13,4,0,0,7);x.fill();x.fillStyle="#6B4630";x.fillRect(bx-11,by-4,22,4);x.fillStyle="#8A6040";x.fillRect(bx-11,by-8,22,2.6);x.fillRect(bx-9,by,2,4);x.fillRect(bx+7,by,2,4);
    x.strokeStyle="#3B2F26";x.lineWidth=1.6;x.beginPath();x.moveTo(bx+16,by+2);x.lineTo(bx+16,by-14);x.stroke();x.fillStyle=night?"#FFD27A":"#E6D6AA";x.beginPath();x.arc(bx+16,by-15.5,2.8,0,7);x.fill();if(night){L.push([bx+16,by-15,22,.4]);L.push([bx+16,by+2,30,.16]);}}}if(st.ustream&&st.ustream.length)A.ustream(x,st.ustream,ph);(st.ubridge||[]).forEach(p=>{const R=st.roads||{},w=k=>R[k]==="w"||R[k]==="wb",along=w((p[0]-1)+","+p[1])||w((p[0]+1)+","+p[1]);A.footbridge(x,p[0],p[1],along?"r":"c");});if(st.zpath&&st.zpath.length)A.zpath(x,st.zpath,se,ph,L,st.zlan);A.stream(x,st.stream,ph);
  const dragged=!thumb&&drag&&drag.moved?drag.it:null,pk=new Set(st.path.map(p=>p[1]*N+p[0]));
  if(!thumb&&arranging&&sel&&!dragged&&st.items.some(i=>i.id===sel.id))outline(x,sel.c,sel.r,sel.w,sel.h,"rgba(247,181,101,.95)");
  for(const it of st.items)if(it.ground&&it!==dragged){const lk=V.look&&V.look(it.id);if(lk&&(lk.f<0||(lk.s||1)!==1))drawLooked(x,it,lk,null,()=>ground(x,it,se,ph));else ground(x,it,se,ph);}
  if(st.bridge)A.bridge(x,st.bridge.c,st.bridge.r,st.bridge.len);
  if(st.lv.water>=4)st.stream.forEach(p=>{if(pk.has(p[1]*N+p[0]))A.bridge(x,p[0],p[1],1);});
  A.fog(x,N,st.HC,st.HR,st.R,ph);A.landscape(x,N,se,ph);if(!st.pv&&A.fogEdge)A.fogEdge(x,N,st.R,ph);
  if(!thumb&&arranging){x.strokeStyle="rgba(255,255,255,.2)";x.lineWidth=1/S;x.beginPath();for(let i=0;i<N;i++)for(let j=0;j<N;j++)if(st.seen[j*N+i]){const p=A.diamond(i,j);x.moveTo(p[0][0],p[0][1]);p.slice(1).forEach(q=>x.lineTo(q[0],q[1]));x.closePath();}x.stroke();
    st.items.forEach(it=>{if(it!==dragged)outline(x,it.c,it.r,it.w,it.h,it===sel?"#F2A04A":"#FFFFFF");});}
  /* everything standing, back to front, skipping what's off screen */
  const vx0=(-160-ox)/S,vx1=(w+160-ox)/S,vy0=(-60-oy)/S,vy1=(h+260-oy)/S,inView=(p)=>p[0]>vx0&&p[0]<vx1&&p[1]>vy0&&p[1]<vy1,list=[];
  for(const it of st.items)if(!it.ground&&it!==dragged&&inView(A.P(it.c+it.w/2,it.r+it.h/2)))list.push({d:it.c+it.w+it.r+it.h-it.w*.01,it});
  /* 3.9.1: the waterfall at the lake's left end once Water practice reaches level 5 (vale-art.js falls), sorted with
     the trees and buildings so anything standing behind it stays behind it */
  if(st.lake&&st.lv.water>=5){const lk=st.lake,m=A.P(lk.c,lk.r),g={x:m[0]-lk.rx*.48,y:m[1]-lk.ry*.2};if(inView([g.x,g.y]))list.push({d:lk.c+lk.r-.5,falls:g});}
  for(const p of V.lanterns(st)){const m=A.tileCenter(p[0],p[1]);if(inView(m))list.push({d:p[0]+p[1]+1.9,lan:m});}
  if(!thumb)for(const f of EVL.frame(st,t,ph))if(inView([f.x,f.y]))list.push({d:f.d,vil:f});
  if(!thumb&&typeof EVF!=="undefined")for(const f of EVF.frame(st,RM?0:t))if(inView([f.x,f.y]))list.push({d:f.d,fa:f});
  const EV=!thumb&&window.EKEVENT?EKEVENT.now():null,HOMES={home:1,cabin:1,longhouse:1,pod:1,library:1,hall:1,ashram:1,yoga:1};
  for(const o of st.scen){const dd=Math.hypot(o.c+.5-st.HC,o.r+.5-st.HR),a=Math.max(0,Math.min(1,st.R+1.5-dd));if(a<=0)continue;const m=A.tileCenter(o.c,o.r);if(inView(m))list.push({d:o.c+o.r+1.5,sc:o,m,a});}
  list.sort((p,q)=>p.d-q.d);
  for(const e of list){if(e.falls){A.falls(x,e.falls,ph,se,RM||thumb?0:t);continue;}if(e.lan){if(EV==="halloween")EKEVENT.pumpkin(x,e.lan[0]+12,e.lan[1]-1,night,L,RM?0:t,1.05);else stamp(x,cached("l"+night,k,[-7,-32,8,5],(y,LL)=>A.lantern(y,night,LL)),e.lan[0]+12,e.lan[1]-3,L);}
    else if(e.fa)EVF.draw(x,e.fa,RM?0:t);
    else if(e.sc&&EV==="xmas"&&(e.sc.kind==="gum"||e.sc.kind==="young")&&e.sc.seed%3===0)EKEVENT.xtree(x,e.m[0],e.m[1]+3,e.sc.kind==="gum"?1.05:.9,RM?0:t,night,L,e.sc.seed);
    else if(e.sc){const o=e.sc,v=o.seed%5;swayStamp(x,o.kind==="gum"||o.kind==="young"?treeS(o.kind,o.kind==="gum"?.95+v*.04:.9,se,v,k):smallS(o.kind,se,v,k),e.m[0],e.m[1]+3,null,e.a,o.c*.7+o.r*.3,thumb?0:t);}
    else if(e.vil)EVL.draw(x,e.vil,t);else{const lk=V.look&&V.look(e.it.id);if(lk)drawLooked(x,e.it,lk,L,()=>drawItem(x,e.it,se,t,L,night,k,smoke));else drawItem(x,e.it,se,t,L,night,k,smoke);if(EV&&HOMES[e.it.kind]){const cc=A.tileCenter(e.it.c+(e.it.w-1)/2,e.it.r+(e.it.h-1)/2);EKEVENT.house(x,cc[0],cc[1],e.it.w,RM?0:t,night,L,EV,(e.it.c*7+e.it.r)|0);}}}
  const ghost=!thumb&&placing?placing:null;if(ghost){const g=Object.assign({},ghost.it,{c:ghost.c,r:ghost.r});outline(x,g.c,g.r,g.w,g.h,ghost.ok?"#58D68D":"#FF6B6B");x.globalAlpha=.88;if(g.ground)ground(x,g,se,ph);else drawItem(x,g,se,t,L,night,k,null);x.globalAlpha=1;}
  if(dragged){const g=Object.assign({},dragged,{c:drag.c,r:drag.r});if(g.c>=0&&g.r>=0&&g.c+g.w<=N&&g.r+g.h<=N){outline(x,g.c,g.r,g.w,g.h,drag.ok?"#58D68D":"#FF6B6B");x.globalAlpha=.85;if(g.ground)ground(x,g,se,ph);else drawItem(x,g,se,t,L,night,k,null);x.globalAlpha=1;}}
  if(!thumb&&!RM){for(const [sx,sy,o] of smoke)for(let i=0;i<3;i++){const p=(t*.00035+i/3+o)%1;A.dot(x,sx+Math.sin(p*6+i)*3,sy-p*34,2.5+p*5,`rgba(235,235,240,${(1-p)*.3})`);}
    const fc=A.P(st.HC,st.HR);
    if(night)for(let i=0;i<12;i++){const a=i*.63+t*.0003*(i%2?1:-1),r=70+(i%3)*36,px=fc[0]+Math.cos(a)*r*1.4+Math.sin(t*.002+i)*6,py=fc[1]+Math.sin(a)*r*.6+Math.cos(t*.0017+i)*5;if(EV==="halloween")EKEVENT.bat(x,px,py-26,t,i);else{A.dot(x,px,py,1.5,EV==="xmas"?["#FF7A7A","#7CE08A","#FFE27A","#8AC4FF"][i%4]:"rgba(255,236,160,.85)");L.push([px,py,7,.16]);}}
    else if(ph==="day"){x.fillStyle="rgba(20,32,40,.06)";for(let i=0;i<2;i++){const cx=((t*.012+i*900)%(N*64+900))-N*32-450,cy=N*A.TH/2+(i?140:-120);x.beginPath();x.ellipse(cx,cy,170,70,0,0,7);x.fill();}}}
  if(st.lv.air>=5){const an=st.items.find(i=>i.id==="flags")||st.items.find(i=>i.id==="fire"),a=an?A.tileCenter(an.c+(an.w-1)/2,an.r+(an.h-1)/2):[0,N*16],kx=a[0]+150+50*Math.sin(t*.00016),ky=a[1]-340+22*Math.sin(t*.00027+1),tl=.16*Math.cos(t*.00016);
    x.strokeStyle="rgba(255,255,255,.5)";x.lineWidth=1.2;x.beginPath();x.moveTo(a[0],a[1]-26);x.quadraticCurveTo((a[0]+kx)/2+40,(a[1]+ky)/2+50,kx,ky+10);x.stroke();A.kite(x,kx,ky,1.3,t,tl);}
  if(!thumb&&typeof EVF!=="undefined")EVF.skies(x,st,RM?0:t,night);
  x.setTransform(d,0,0,d,0,0);if(ph!=="day"&&ph!=="dawn"){x.fillStyle=ph==="night"?"rgba(6,12,34,.34)":"rgba(40,20,50,.12)";x.fillRect(0,0,w,h);}
  
  if(se==="winter"&&!thumb&&!RM)A.snowfall(x,w,h,t,navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4?40:64);
  x.setTransform(d*S,0,0,d*S,d*ox,d*oy);A.glows(x,L);x.setTransform(d,0,0,d,0,0);if(!thumb&&t)leaves(x,w,h,t,se);x.setTransform(1,0,0,1,0,0);}

/* ---------- touch: pan, pinch, tap, arrange ---------- */
const ptrs=new Map();let pinch=null,down=null;
const clampZ=z=>Math.min(9,Math.max(1.35,z));
function clampCam(){const lx=N*32*S*.55,ly=N*16*S*.55;cam.x=Math.max(-lx,Math.min(lx,cam.x));cam.y=Math.max(-ly,Math.min(ly+900*S,cam.y));}
function toTile(px,py){const wx=(px-ox)/S,wy=(py-oy)/S;return [Math.floor((wx/32+wy/16)/2),Math.floor((wy/16-wx/32)/2)];}
function itemAt(px,py){if(!state)return null;for(const dy of [0,20,40,60]){const [c,r]=toTile(px,py+dy*S);if(c<0||r<0||c>=N||r>=N)continue;const id=state.occ[r*N+c];if(id&&id!=="river")return state.items.find(i=>i.id===id);}return null;}
function pos(e){const b=cv0.getBoundingClientRect();return [e.clientX-b.left,e.clientY-b.top];}
function onDown(e){if(cineOn)return;const p=pos(e);const pan0=!!(q2("evInfo")&&q2("evInfo").offsetParent);try{cv0.setPointerCapture(e.pointerId);}catch(x){}ptrs.set(e.pointerId,p);down={p,t:Date.now(),cam:Object.assign({},cam),moved:false,pan0,slop:e.pointerType==="touch"?10:6,ghost:Date.now()-multiEnd<300};
  if(ptrs.size===2){multi=true;clearTimeout(holdT);const [a,b]=[...ptrs.values()];pinch={d:Math.hypot(a[0]-b[0],a[1]-b[1])||1,z:cam.z};drag=null;return;}
  if(road&&!VALE.preview){const [c,r]=toTile(p[0],p[1]),k=c+","+r;roadOp=(()=>{const cur=state&&state.roads&&state.roads[k];if(!cur)return "lay";if(cur===road||(cur==="wb"&&road!=="w"))return "lift";return "lay";})();lastRoadK=k;down.road=true;down.rc=[c,r];clearTimeout(holdT);
    /* press and hold, then drag, to lay a line; a plain drag only moves the view */
    holdT=setTimeout(()=>{if(down&&down.road&&!down.moved&&ptrs.size===1&&!multi){down.paint=true;try{navigator.vibrate&&navigator.vibrate(12);}catch(_){}roadAt(c,r);}},380);return;}
  if(placing){const [c,r]=toTile(p[0],p[1]);placing.oc=c-placing.c;placing.or=r-placing.r;placing.moving=true;return;}
  if(!arranging&&!VALE.preview){const it=itemAt(p[0],p[1]);if(it){clearTimeout(holdT);holdT=setTimeout(()=>{if(down&&!down.moved&&ptrs.size===1&&!multi&&!arranging&&!placing&&!road){try{navigator.vibrate&&navigator.vibrate(15);}catch(_){}arranging=true;sel=it;down.held=true;if(it.id!=="fire"){const [c,r]=toTile(down.p[0],down.p[1]);drag={it,oc:c-it.c,or:r-it.r,c:it.c,r:it.r,ok:true,moved:false};}ui();redraw();say(it.id==="fire"?"Arrange mode. The hearth stays put, but you can flip or resize it below.":"Arrange mode. Drag to move it, or flip and resize it below.");}},450);}}
  if(arranging){const it=itemAt(p[0],p[1]);if(it&&it.id==="fire"){sel=it;redraw();return;}if(it){sel=it;const [c,r]=toTile(p[0],p[1]);drag={it,oc:c-it.c,or:r-it.r,c:it.c,r:it.r,ok:true,moved:false};redraw();}}}
function onMove(e){if(!ptrs.has(e.pointerId)||!down)return;const p=pos(e);ptrs.set(e.pointerId,p);
  if(down.road&&road&&down.paint){const [c,r]=toTile(p[0],p[1]),k=c+","+r;if(k!==lastRoadK){lastRoadK=k;if(roadOp==="lay")roadAt(c,r);}return;}
  if(pinch&&ptrs.size===2){const [a,b]=[...ptrs.values()];cam.z=clampZ(pinch.z*Math.hypot(a[0]-b[0],a[1]-b[1])/pinch.d);clampCam();redraw();return;}
  const dx=p[0]-down.p[0],dy=p[1]-down.p[1];if(Math.hypot(dx,dy)>(down.slop||6)){down.moved=true;if(!down.road&&!drag)clearTimeout(holdT);}
  if(placing&&placing.moving){if(!down.moved)return;const [c,r]=toTile(p[0],p[1]);placing.c=c-placing.oc;placing.r=r-placing.or;placing.ok=state.fits(placing.c,placing.r,placing.it.w,placing.it.h,placing.it.id);ui();redraw();return;}
  if(drag){if(!down.moved)return;drag.moved=true;const [c,r]=toTile(p[0],p[1]);drag.c=c-drag.oc;drag.r=r-drag.or;drag.ok=state.fits(drag.c,drag.r,drag.it.w,drag.it.h,drag.it.id);redraw();return;}
  if(down.moved){cam.x=down.cam.x+dx;cam.y=down.cam.y+dy;clampCam();redraw();}}
function onUp(e){ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=null;
  /* once two fingers were down (zooming), letting go is never a tap: no card opens while you navigate */
  if(multi){clearTimeout(holdT);if(!ptrs.size){multi=false;down=null;lastTap=null;multiEnd=Date.now();}else if(down)down.moved=true;return;}if(!down){if(!ptrs.size)multi=false;return;}if(down.road){clearTimeout(holdT);if(!down.paint&&!down.moved&&!multi&&Date.now()-down.t<600&&down.rc)roadAt(down.rc[0],down.rc[1]);down=null;if(!ptrs.size)multi=false;return;}if(placing&&placing.moving){placing.moving=false;down=null;return;}
  clearTimeout(holdT);
  if(drag){const dr=drag;drag=null;if(dr.moved&&dr.ok&&(dr.c!==dr.it.c||dr.r!==dr.it.r)){V.place(dr.it.id,dr.c,dr.r);refresh();say("Moved. It stays there until you move it again.");}
    else if(dr.moved&&!dr.ok)say("That spot isn't free yet. Try open ground in your valley.");redraw();down=null;return;}
  if(!down.moved&&!down.ghost&&Date.now()-down.t<450&&Math.abs(cam.x-down.cam.x)<2&&Math.abs(cam.y-down.cam.y)<2&&cam.z===down.cam.z){if(!multi&&!placing&&!road&&lastTap&&Date.now()-lastTap.t<500&&Math.hypot(down.p[0]-lastTap.p[0],down.p[1]-lastTap.p[1])<48){lastTap=null;dz(down.p);down=null;return;}lastTap=null;const vv=!arranging&&!placing&&state?EVL.hit(state,performance.now(),timeView==="auto"?A.phaseOf():timeView,(down.p[0]-ox)/S,(down.p[1]-oy)/S,Math.max(16,26/S)):null;if(vv)villager(vv);else{const it=itemAt(down.p[0],down.p[1]);if(it)info(it.id);else{lastTap={t:Date.now(),p:down.p};if(arranging&&sel){sel=null;redraw();}if(!arranging&&!placing&&!road&&!down.pan0){const lt=lastTap;clearTimeout(barT);barT=setTimeout(()=>{if(lastTap===lt)setBar(!barHidden);},330);}}if(!it&&arranging&&state&&state.roads){const [c,r]=toTile(down.p[0],down.p[1]),k=c+","+r;if(state.roads[k]){lastTap=null;const was=roadOp;roadOp="lift";roadAt(c,r);roadOp=was;say("Path removed. Its coins are back.");}}}}down=null;}
/* 3.4.3: double-tap open ground to zoom in on that spot (it stays under your finger); double-tap again when
   fully in to glide back out. Single taps keep doing exactly what they did. */
let lastTap=null,zAnim=0;
function dz(p){if(!state||!cam.z||!cv0)return;const w=cv0.clientWidth,h=cv0.clientHeight,b=S/cam.z,TH2=N*A.TH/2,wx=(p[0]-ox)/S,wy=(p[1]-oy)/S,z0=cam.z,x0=cam.x,y0=cam.y;
  const zf=zoom0(w,h,state),full=cam.z>=8.2,zt=full?zf:clampZ(Math.max(cam.z*2.2,zf*1.6)),D=RM?0:340,t0=performance.now();
  const at=z=>{const s=b*z;return [p[0]-w/2-wx*s,p[1]-h*.55+TH2*s-wy*s];};cancelAnimationFrame(zAnim);
  const step=now=>{const u=D?Math.min(1,(now-t0)/D):1,e=1-Math.pow(1-u,3);cam.z=z0+(zt-z0)*e;if(full){cam.x=x0*(1-e);cam.y=y0*(1-e);}else{const q=at(cam.z);cam.x=q[0];cam.y=q[1];}clampCam();redraw();if(u<1)zAnim=requestAnimationFrame(step);};
  zAnim=requestAnimationFrame(step);try{navigator.vibrate&&navigator.vibrate(6);}catch(x){}}
function onWheel(e){e.preventDefault();cam.z=clampZ(cam.z*(e.deltaY<0?1.12:.89));clampCam();redraw();}

/* ---------- full-screen screen and its controls ---------- */
function seasonLabel(){return seasonView==="auto"?SNAME[A.seasonKey()]+" \u00b7 now":SNAME[seasonView];}
const PHN={dawn:"Dawn",day:"Day",dusk:"Dusk",night:"Night"},TIMES=["auto","dawn","day","dusk","night"];
const nowPh=()=>timeView==="auto"?A.phaseOf():timeView,nowSe=()=>seasonView==="auto"?A.seasonKey():seasonView;
function timeLabel(){return timeView==="auto"?PHN[A.phaseOf()]+" \u00b7 now":PHN[timeView];}
const q2=id=>document.getElementById(id);
const SV=p=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+p+'</svg>';
const COIN=SV('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5c1.6 1.8 2.4 3.2 2.4 4.6A2.4 2.4 0 0 1 12 14.6a2.4 2.4 0 0 1-2.4-2.5c0-1.4.8-2.8 2.4-4.6z"/>'),
  FIRE=SV('<path d="M12 21c4 0 7-2.7 7-6.6 0-3.4-2.3-5.6-3.6-7.6-.5 1.9-1.6 3-2.8 3.4.4-2.9-.9-5.7-3.4-7.2.3 3.3-1.5 5.3-3 7.1C4.9 11.7 5 13 5 14.4 5 18.3 8 21 12 21z"/>'),
  IC={centre:SV('<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4"/>'),time:SV('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>'),
  season:SV('<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19l7-7"/>'),eye:SV('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>'),grow:SV('<path d="M12 20v-8"/><path d="M12 12.5c0-4.2 3-6.8 7.5-6.8 0 4.2-3 6.8-7.5 6.8z"/><path d="M12 14.5C12 11.4 9.7 9 6 9c0 3.1 2.3 5.5 6 5.5z"/>'),info:SV('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>'),sound:SV('<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M15.5 9.2a4 4 0 0 1 0 5.6M18 6.8a7.5 7.5 0 0 1 0 10.4"/>'),book:SV('<path d="M4 5.5C6.5 4 9 4 12 5.8c3-1.8 5.5-1.8 8-.3V19c-2.5-1.5-5-1.5-8 .3-3-1.8-5.5-1.8-8-.3z"/><path d="M12 5.8V19"/>')};
function ui(){if(!q2("evTop"))return;const sm=window.EKECO?EKECO.summary():{coins:0,p:0,r:0};
  const er=V.eraInfo();q2("evCount").innerHTML=`<span class="hudc" id="hudCoins">${COIN}<b>${fmt(sm.coins)}</b></span><span class="hudf" id="hudFire" role="button" tabindex="0" aria-label="${Math.max(sm.p,sm.r)} day streak. Any amount counts. Tap for how streaks work">${FIRE}<b>${Math.max(sm.p,sm.r)}</b><em>day streak</em></span><span class="hude" id="hudEra">${er.name}</span>`;
  eraCard(er);
  q2("evSeasonT").textContent=seasonLabel();const so=EVS.want();q2("evSoundT").textContent=so?"Sound on":"Sound off";q2("evSound").setAttribute("aria-pressed",String(so));q2("evSound").classList.toggle("mute",!so);q2("evTimeT").textContent=timeLabel();q2("evCompleteT").textContent=VALE.preview?"Mine":"Preview";
  q2("evArrange").textContent=arranging?"Done":"Arrange";q2("evArrange").setAttribute("aria-pressed",String(arranging));q2("evHint").hidden=!arranging;
  const pb=q2("evPlaceBar");pb.hidden=!placing;if(placing){q2("evPlaceTxt").textContent=placing.ok?"Drag to adjust, then place":"That spot isn't free. Drag to open ground";q2("evPlaceOk").disabled=!placing.ok;}
  const rb=q2("evRoadBar");if(rb){rb.hidden=!road;if(road)q2("evRoadTxt").textContent=ROADT[road].name+": tap to lay a tile ("+ROADT[road].price+" each), or hold then drag to lay a line. Drag to look around. Tap a laid tile to remove it.";}
  const bar=q2("evBar");bar.hidden=!!placing||!!VALE.preview||arranging||!!road;if(!bar.hidden)cards();}
/* ---------- the builder bar: what you can place or build, in full colour; what's locked, greyed ---------- */
let tab="all",barKey="";const TH={};
const TABS=[["all","All"],["paths","Paths"],["village","Village"],["practice","Practice"],["nature","Nature"],["seasonal","Seasonal"]];
/* roads you lay yourself: a price per tile (refunded in full if you remove it), and some open with the eras */
const ROADT={p:{name:"Path",price:5,era:0,why:"A simple stone path. Lay it tile by tile, and remove it any time to get your coins back."},
  l:{name:"Lantern path",price:8,era:1,why:"Grass and flat stepping stones, with small lanterns that glow at night. Lovely for gardens and quiet places."},
  n:{name:"Zen path",price:10,era:1,why:"Dark flat stones set in soft moss, with pebbles and small stone lanterns that glow at night, spaced along the way on their own. Quiet, mindful and calm."},
  z:{name:"Plaza",price:6,era:2,why:"Square stone paving, for a small gathering space rather than doubled paths."},
  w:{name:"Stream",price:6,era:1,why:"A little stream of clear water with a sandy bank. Lay it tile by tile and it flows from one to the next."}};
let road=null,roadOp="lay",lastRoadK=null,holdT=0,multi=false;
function roadAt(c,r){if(!state||VALE.preview)return;const k=c+","+r,R=profile.vroads||(profile.vroads={}),cur=R[k];
  /* a path laid onto a stream becomes a little footbridge (the stream keeps flowing under it); lifting it removes only the bridge */
  if(roadOp==="lift"){if(!cur)return;if(cur==="wb"){R[k]="w";const T=ROADT[road]||ROADT.p;if(window.EKECO)EKECO.bonus(T.price,"Footbridge removed","road:"+k+":"+Date.now());try{saveProfile();}catch(e){}refresh();return;}
    delete R[k];const T=ROADT[cur]||ROADT.p;if(window.EKECO)EKECO.bonus(T.price,T.name+" removed","road:"+k+":"+Date.now());try{saveProfile();}catch(e){}refresh();return;}
  if(cur==="w"&&road!=="w"){const T=ROADT[road];if(V.eraInfo().i<T.era)return say(T.name+" opens in the "+V.ERAS[T.era][0]+" era.");
    if(!(window.EKECO&&EKECO.spend(T.price,"Footbridge built",true)))return say("Not enough Embercoins for a footbridge yet.");R[k]="wb";try{saveProfile();}catch(e){}refresh();return say("A little footbridge over the stream.");}
  if(cur&&cur!==road&&cur!=="wb"&&c>=0&&r>=0&&c<N&&r<N){const T=ROADT[road],O=ROADT[cur]||ROADT.p;if(V.eraInfo().i<T.era)return say(T.name+" opens in the "+V.ERAS[T.era][0]+" era.");
    if(!(window.EKECO&&EKECO.spend(T.price,T.name+" laid",true)))return say("Not enough Embercoins for another tile yet.");if(window.EKECO)EKECO.bonus(O.price,O.name+" replaced","road:"+k+":"+Date.now());R[k]=road;try{saveProfile();}catch(e){}refresh();return;}
  if(cur||c<0||r<0||c>=N||r>=N)return;const i=r*N+c;if(!state.seen[i])return say("Explore further before building there.");const o=state.occ[i];
  if(o)return say(o==="river"?"Paths can't cross the river.":"Something is already there.");const T=ROADT[road];
  if(V.eraInfo().i<T.era)return say(T.name+" opens in the "+V.ERAS[T.era][0]+" era.");
  if(!(window.EKECO&&EKECO.spend(T.price,T.name+" laid",true)))return say("Not enough Embercoins for another tile yet.");R[k]=road;try{saveProfile();}catch(e){}refresh();}
function roadInfo(t){const T=ROADT[t],lock=V.eraInfo().i<T.era?"Opens in the "+V.ERAS[T.era][0]+" era.":"";
  q2("evInfo").innerHTML=xcard({tint:TINTS.paths,art:`<img alt="" src="${bigThumb("road-"+t)}">`,name:T.name,chip:`${COIN}${T.price} a tile`,lede:lock||"Refunded in full if you remove it.",
    secs:[{i:"about",t:"About",h:`<p>${T.why}</p>`},{i:"does",t:"How to lay it",h:"<p>Tap open ground to lay a tile, and drag to look around. Tap a laid tile to remove it.</p>"},lock?{i:"lock",t:"Unlocks",h:`<p>${lock}</p>`}:null],
    act:lock?"":`<button type="button" class="big" data-road="${t}">Lay ${T.name.toLowerCase()}</button>`});panel("evInfo");q2("evInfo").scrollTop=0;}
/* pictures can be drawn at any resolution: every transform is scaled, so a big hero picture is sharp, not stretched */
let THS=1;function sctx(c){const x=c.getContext("2d");if(THS!==1){const st=CanvasRenderingContext2D.prototype.setTransform;x.setTransform=(a,b,cc,d,e,f)=>st.call(x,a*THS,b*THS,cc*THS,d*THS,e*THS,f*THS);x.setTransform(1,0,0,1,0,0);}return x;}
function bigThumb(kind,lvl,it){THS=3;try{return thumb(kind,lvl,it);}finally{THS=1;}}
/* ---------- one design for every info panel: a big picture card, the name, a status line, then tidy sections ---------- */
const XI={about:'<path d="M12 3c4 4 6 7 6 10a6 6 0 0 1-12 0c0-3 2-6 6-10z"/>',does:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  lv:'<path d="M4 19h4v-4h4v-4h4V7h4"/>',now:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',coin:'<circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.5 10.5h4a1.5 1.5 0 0 1 0 3h-3"/>'};
const xi=k=>`<svg viewBox="0 0 24 24" aria-hidden="true">${XI[k]}</svg>`;
const TINTS={village:"#E3A857",nature:"#6BAF5B",practice:"#F08A3C",seasonal:"#C98BD6",paths:"#C9B79C",folk:"#E89BB0"};
function xcard(o){return `<div class="excard" style="--tint:${o.tint||TINTS.village}"><div class="exh"><button type="button" class="exx" data-close aria-label="Close">&times;</button><div class="exart">${o.art}</div></div>`+
  `<div class="exhead"><h3>${o.name}</h3>${o.chip?`<span class="exchip">${o.chip}</span>`:""}</div>`+(o.lede?`<p class="exlede">${o.lede}</p>`:"")+
  `<div class="exsecs">${o.secs.filter(Boolean).map(z=>`<section class="exsec"><span class="exic">${xi(z.i)}</span><div><h4>${z.t}</h4>${z.h}</div></section>`).join("")}</div>`+(o.extra||"")+(o.nav||"")+(o.act?`<div class="ractions">${o.act}</div>`:"")+"</div>";}
function thumb(kind,lvl,it){if(String(kind).startsWith("road-")){const key0=kind+A.seasonKey()+"@"+THS;if(TH[key0])return TH[key0];const c=document.createElement("canvas");c.width=112*THS;c.height=88*THS;const x=sctx(c),t=kind.slice(5),se=A.seasonKey();
    /* a short winding stretch (a square for plaza), so each road reads as what it is */
    const seg=t==="z"?[[0,0],[1,0],[0,1],[1,1]]:[[0,0],[1,0],[2,0],[2,1]],k=t==="z"?.82:.66,cw=t==="z"?[0,32]:[16,40];x.setTransform(k,0,0,k,56-cw[0]*k,46-cw[1]*k);
    if(t==="z")A.plaza(x,seg,se);else if(t==="n")A.zpath(x,seg,se,"day",null,[[0,0],[2,1]]);else if(t==="w")A.ustream(x,seg,"day");else if(t==="l")A.lpath(x,seg,se,"day",null);else A.paths(x,seg,se);return TH[key0]=c.toDataURL();}
  if(kind==="decor"&&it)return "data:image/svg+xml;charset=utf-8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">'+(DECOR_ART[it.art]||"")+"</svg>");
  const se=A.seasonKey(),key=kind+(lvl||1)+(kind==="fire"&&it?"f"+(it.lv||1):"")+(kind==="comp"&&it?it.who:"")+se+"@"+THS;if(TH[key])return TH[key];const c=document.createElement("canvas");c.width=112*THS;c.height=88*THS;const x=sctx(c),L=[],fit=(b,cx,by)=>{const s=Math.min(100/(b[2]-b[0]),78/(b[3]-b[1]));x.setTransform(s,0,0,s,cx-(b[0]+b[2])/2*s,by-b[3]*s);};
  const TR={sap:1.7,young:1.25,jac:1.15,ancient:.22};
  /* 3.4.4: the hearth and the companions get their own pictures (the valley draws them in its own loop) */
  if(kind==="comp"&&it){const im=compFront(it.who);x.setTransform(1,0,0,1,0,0);const g=x.createRadialGradient(56,52,4,56,52,46);g.addColorStop(0,"rgba(255,214,150,.45)");g.addColorStop(1,"rgba(255,214,150,0)");x.fillStyle=g;x.fillRect(0,0,112,88);
    x.fillStyle="rgba(96,150,80,.5)";x.beginPath();x.ellipse(56,73,24,4.5,0,0,Math.PI*2);x.fill();
    if(!im){const i=imgs["cf_"+it.who];if(i)i.addEventListener("load",()=>{const el=document.querySelector("#evInfo .exart img");if(el&&infoId===it.id)el.src=bigThumb(kind,lvl,it);},{once:true});return c.toDataURL();}
    A.picture(x,im,56,74,56);}
  else if(kind==="fire"){const lv=(it&&it.lv)||1,big=lv>=6,z=big?.74:.92;x.setTransform(z,0,0,z,56,big?68:66);A.fireBase(x,lv);A.flames(x,0,0,1400,[],false);if(big)A.festoon(x,false,[],window.EKEVENT&&EKEVENT.now());}
  else if(EVV.BOX[kind]){fit(EVV.BOX[kind],56,84);EVV.draw(x,kind,lvl||1,false,L,se,0);}
  else if(kind==="zen"||kind==="pool"){x.setTransform(.82,0,0,.82,56,46);if(kind==="zen")EVV.zen(x,-1,-1,lvl||1,se);else EVV.pool(x,-1,-1,lvl||1,"day",se);}
  else if(TR[kind]){x.setTransform(1,0,0,1,56,kind==="ancient"?84:82);A.tree(x,0,0,TR[kind],se,7,kind);if(kind==="ancient")A.homewind(x,0,0,TR[kind],0,false,null);}
  else if(kind==="orchard"){x.setTransform(1,0,0,1,56,80);[[-22,-4],[22,-4],[0,4]].forEach(([dx,dy],i)=>A.tree(x,dx,dy,1,se,11+i,"fruit"));}
  else if(kind==="flowers"){x.setTransform(1.7,0,0,1.7,56,70);A.flowers(x,0,0,1,se,5);}
  else if(kind==="cabin"||kind==="longhouse"){const w=kind==="cabin"?2:3;fit([-2*32-16,-72,w*32+26,(w+2)*16+26],56,84);A.house(x,w,2,false,L,w===2?"#7A4A3A":"#5E6B4A",se==="winter");}
  else if(kind==="spring"||kind==="pond"||kind==="lake"){const r=kind==="spring"?.5:kind==="pond"?1:1.5,s=kind==="lake"?.62:.85;x.setTransform(s,0,0,s,56,48);A.waterBox(x,-r,-r,r,r,"day",kind==="pond");}
  else if(kind==="garden"){x.setTransform(.8,0,0,.8,56,46);A.garden(x,-1,-1,se);}
  else if(kind==="flags"){x.setTransform(1.4,0,0,1.4,56,72);A.windflags(x,0,0,0);}
  return TH[key]=c.toDataURL();}
function entries(){const st=state,on=new Set(st.items.map(i=>i.id)),c=coins(),out=[];
  for(const it of st.list){if(it.auto||it.village||on.has(it.id))continue;out.push({it,ok:!!it.open,kind:it.kind,cat:it.cat||"nature",label:it.open?"Ready to place":"Locked"});}
  for(const [k,v] of Object.entries(V.VILLAGE)){const mine=st.list.filter(i=>i.village===k);mine.filter(i=>!on.has(i.id)).forEach(i=>out.push({it:i,ok:true,kind:k,cat:"village",lvl:i.lvl,label:"Ready to place"}));
    if(mine.length<v.max){const lock=(v.era||0)>V.eraInfo().i;out.push({vk:k,ok:!lock&&c>=v.price,kind:k,cat:"village",price:lock?0:v.price,label:lock?V.ERAS[v.era][0]+" era":""});}}
  {const era=V.eraInfo().i;for(const [t,T] of Object.entries(ROADT)){const lock=era<T.era;out.push({road:t,ok:!lock,kind:"road-"+t,cat:"paths",lock:lock?V.ERAS[T.era][0]+" era":""});}}
  return out.filter(e=>tab==="all"||e.cat===tab).sort((a,b)=>b.ok-a.ok);}
function cards(){const key=[coins(),tab,state.items.map(i=>i.id).join(),JSON.stringify(profile.vown||{}),JSON.stringify(profile.vlvl||{}),A.seasonKey(),state.list.filter(i=>i.open).length].join("|");if(key===barKey)return;barKey=key;
  q2("evTabs").innerHTML=TABS.filter(([k])=>k!=="seasonal"||state.list.some(i=>i.decor)).map(([k,n])=>`<button type="button" class="evtab${tab===k?" on":""}" data-tab="${k}" aria-pressed="${tab===k}">${n}</button>`).join("");
  const es=entries();q2("evCards").innerHTML=es.length?es.map(e=>{if(e.road){const T=ROADT[e.road],info=`data-rinfo="${e.road}"`,act=e.ok?`data-road="${e.road}"`:info;
      return `<div class="evcard${e.ok?"":" off"}" data-cat="${e.cat||"paths"}"><button type="button" class="evcm" ${act}><span class="evth"><img alt="" src="${thumb(e.kind)}"></span><b>${T.name}</b><small>${e.lock?esc(e.lock):COIN+T.price+" a tile"}</small></button><button type="button" class="evci" ${info} aria-label="About ${T.name}">i</button></div>`;}
    const id=e.it?e.it.id:e.vk,name=e.it?e.it.name:V.VILLAGE[e.vk].name,info=e.it?`data-info="${id}"`:`data-vinfo="${id}"`,act=e.it?(e.ok?`data-place="${id}"`:info):(e.ok?`data-buy="${id}"`:info);
    return `<div class="evcard${e.ok?"":" off"}" data-cat="${e.cat||"paths"}"><button type="button" class="evcm" ${act}><span class="evth"><img alt="" src="${thumb(e.kind,e.lvl,e.it)}"></span><b>${esc(name)}</b><small>${e.price?COIN+fmt(e.price):esc(e.label)}</small></button><button type="button" class="evci" ${info} aria-label="About ${esc(name)}">i</button></div>`;}).join("")
    :'<p class="evempty">Everything you\'ve earned is in your valley. Practise to grow more, or build with Embercoins.</p>';}
/* ---------- info: pops up over the bar, scrolls, steps through everything, and handles upgrades ---------- */
const WHAT={fire:"Your hearth. Practice keeps it burning, and the valley gathers round it.",cabin:"A warm place to rest between practices.",longhouse:"Room for the whole village. It grows as your practice grows.",spring:"Where the water starts. Breathe with water to feed the stream.",pond:"A quiet place to slow down.",lake:"A wide, still water that holds your long practice.",sap:"A sapling. Breathe with earth to help it grow.",young:"A young tree, growing a little with each practice.",garden:"Small daily care becoming nourishment.",orchard:"Patience that bears fruit over the seasons.",ancient:"Steady roots from long practice. It stays green all year.",flowers:"Small moments of joy, blooming with regular practice.",flags:"Each breath carried out on the breeze.",jac:"Your first tree. Plant it anywhere; it flowers purple each spring.",home:"Two villagers move in as soon as it's placed. Each level makes it a little more beautiful.",pod:"A small, quiet dome for one person and one breath at a time.",yoga:"An open space among the trees, for movement and breath.",hall:"The heart of practice, for breathwork and sitting together.",zen:"Raked sand and still stones. Watch thoughts settle like ripples.",pool:"Still water that mirrors the sky. A place to look inward.",circle:"Seats round a small fire, where the village comes together.",library:"Home to the teachings and stories of the valley.",ashram:"A pavilion for slow retreat days of practice and rest.",comp:"One of your companions. Sit with them by the fire."};
const GO={pod:["#medCard","Start a meditation"],hall:["#breatheCard","Start a breath practice"],ashram:["#breatheCard","Start a breath practice"],yoga:["#breatheCard","Start a breath practice"],zen:["#medCard","Start a meditation"],pool:["#medCard","Start a meditation"],home:["#checkCard","Check in"],library:["#journalCard","Open your journal"],longhouse:["#journalCard","Open your journal"],cabin:["#checkCard","Check in"],fire:["#breatheCard","Start a breath practice"],pond:["#medCard","Start a meditation"],spring:["#breatheCard","Start a breath practice"]};
let infoId=null;
function navList(){return state.list.filter(i=>i.open&&!i.decor);}
function info(id,vk){const it=id?state.list.find(i=>i.id===id)||null:null,v=vk?V.VILLAGE[vk]:null;if(!it&&!v)return;infoId=it?it.id:null;
  const on=!!(it&&state.items.some(i=>i.id===it.id)),kind=it?it.kind:vk,name=it?it.name:v.name,go=GO[kind],LN=EVV.NAMES[kind];let lvlHtml="",act="",stat="";
  if(it&&it.auto)stat="Always part of your valley.";else if(it&&it.earned)stat=it.open?"Grown from your "+(VALE.els[it.earned].from||"practice").toLowerCase()+".":(it.need||"Still growing.");else if(it&&it.village)stat=on?"Standing in your valley.":"Built, ready to place.";else if(v)stat="Part of the Aevum eco village. Build it for "+fmt(v.price)+" Embercoins.";else if(it)stat=on?"In your valley.":"Ready to place.";
  if(it&&it.village&&LN){const u=VALE.preview?{lv:5,max:true}:(V.upInfo(it.id)||{lv:1,max:false});lvlHtml=`<h4 class="evh4">Level ${u.lv} of 5 \u00b7 ${LN[u.lv-1]}</h4><div class="evlv">${[1,2,3,4,5].map(n=>`<i class="${n<=u.lv?"on":""}"></i>`).join("")}</div>`;
    if(!u.max){lvlHtml+=`<div class="evnext"><img alt="" src="${thumb(kind,u.next)}"><div><b>Next: ${LN[u.next-1]}</b><small>${u.ready?fmt(u.cost)+" Embercoins":"Needs "+u.need+" of 30 grown in your valley (you have "+u.grown+")"}</small></div></div>`;act+=`<button type="button" class="big" data-upgrade="${it.id}" ${u.ready&&coins()>=u.cost?"":"disabled"}>Upgrade for ${fmt(u.cost)}</button>`;}
    else lvlHtml+='<p class="evdoes">Fully grown. This is as beautiful as it gets.</p>';}
  else if(v&&LN)lvlHtml=`<h4 class="evh4">Grows over five levels</h4><div class="evnext"><img alt="" src="${thumb(vk,5)}"><div><b>From ${LN[0]} to ${LN[4]}</b><small>Upgrade it as your valley grows.</small></div></div>`;
  if(it&&!it.auto)act+=on?`<button type="button" class="ybtn" data-store="${it.id}">Remove</button>`:(it.open?`<button type="button" class="big" data-place="${it.id}">Place in valley</button>`:"");
  if(v&&!it&&(v.era||0)>V.eraInfo().i){stat="Opens in the "+V.ERAS[v.era][0]+" era, at "+V.ERAS[v.era][1]+" of 30 grown (you have "+V.eraInfo().grown+").";act="";}
  else if(v&&!it){const n=state.list.filter(i=>i.village===vk).length;act=n<v.max?`<button type="button" class="big" data-buy="${vk}" ${coins()<v.price?"disabled":""}>Build for ${fmt(v.price)}</button>`:"";}
  const list=navList(),ix=it?list.findIndex(i=>i.id===it.id):-1,nav=list.length>1&&ix>=0?`<div class="evnav"><button type="button" class="ybtn" data-nav="-1" aria-label="Previous">&#8249; Previous</button><span class="quiet">${ix+1} of ${list.length}</span><button type="button" class="ybtn" data-nav="1" aria-label="Next">Next &#8250;</button></div>`:"";
  const cat=v||(it&&it.village)?"village":(it&&it.decor)?"seasonal":(it&&it.cat)||"nature",lvN=it&&it.village&&LN?(VALE.preview?5:(V.upInfo(it.id)||{lv:1}).lv):0;
  const chip=(v||(it&&it.village)?"Village":cat==="seasonal"?"Seasonal":cat==="practice"?"Practice":"Nature")+(lvN?` \u00b7 Level ${lvN} of 5`:"");
  q2("evInfo").innerHTML=xcard({tint:TINTS[cat]||TINTS.nature,art:`<img alt="" src="${bigThumb(kind,it&&it.lvl||1,it)}">`,name:esc(name),chip,lede:esc(stat),
    secs:[{i:"about",t:"About",h:`<p>${esc((it&&it.purpose)||(v&&v.purpose)||"")}</p>`},WHAT[kind]?{i:"does",t:"What it does",h:`<p>${esc(WHAT[kind])}</p>`}:null,lvlHtml?{i:"lv",t:"Levels",h:lvlHtml.replace(/<h4 class="evh4">([^<]*)<\/h4>/,'<p class="exsub">$1</p>')}:null],
    extra:go?`<div class="evgoRow"><button type="button" class="ybtn evgo" data-goto="${go[0]}">${go[1]} &#8594;</button></div>`:"",nav,act});panel("evInfo");q2("evInfo").scrollTop=0;}
/* ---------- villagers and eras ---------- */
const list=a=>a.length<2?(a[0]||""):a.slice(0,-1).join(", ")+" and "+a[a.length-1];
function villager(v){const home=v.home&&v.home.name?v.home.name:"a home";q2("evInfo").innerHTML=xcard({tint:TINTS.folk,art:`<span class="evface exface" style="--c:${v.cloth};--s:${v.skin}"></span>`,name:esc(v.name),chip:"Villager",lede:"Lives in "+esc(home.toLowerCase()),
  secs:[{i:"about",t:"About",h:`<p>${esc(v.name)} ${esc(v.story)}</p>`},{i:"now",t:"Right now",h:`<p>${esc(v.why)}.</p>`+(v.mirror?'<p class="evmirror">Your practice is rippling through the valley.</p>':"")}]});panel("evInfo");q2("evInfo").scrollTop=0;}
function eraCard(er){const body=q2("evPBody");if(!body)return;let el=q2("evEra");if(!el){el=document.createElement("div");el.id="evEra";el.className="everacard";body.insertBefore(el,body.firstChild);}
  const pct=er.next?Math.max(0,Math.min(100,Math.round((er.grown-er.from)/(er.need-er.from)*100))):100,folk=state?Math.min(EVL.plan(state,timeView==="auto"?A.phaseOf():timeView).length,99):0,room=state?EVL.beds(state):0,opens=Object.values(V.VILLAGE).filter(v=>(v.era||0)===er.i+1).map(v=>v.name);
  el.innerHTML=`<p class="evsub">Your valley</p><h3>${er.name}</h3><div class="everabar"><i style="width:${pct}%"></i></div><p class="quiet">${er.next?`${er.grown} of ${er.need} grown towards the ${er.next} era`+(opens.length?`, which opens the ${list(opens).toLowerCase()}`:"")+".":"Your valley has become a sanctuary."}</p><p class="quiet">${folk} villager${folk===1?"":"s"} living here, with room for ${room}.</p>`;}
const ERA_BONUS=[0,300,600,1000];
function eraUp(i,from){const n=V.ERAS[i][0];let bonus=0;const opens=[];for(let k=(from==null?i-1:from)+1;k<=i;k++){const b=ERA_BONUS[k]||0;Object.values(V.VILLAGE).filter(v=>(v.era||0)===k).forEach(v=>opens.push(v.name));if(window.EKECO&&b&&EKECO.bonus(b,"Became a "+V.ERAS[k][0].toLowerCase(),"era:"+k))bonus+=b;}
  q2("evInfo").innerHTML=`<div class="evcele"><p class="evsub">A new era</p><h3>Your valley is now a ${n.toLowerCase()}</h3><p class="evpurpose">Every practice has added to this place.${opens.length?` You can now build the ${list(opens).toLowerCase()}.`:""}</p>${bonus?`<p class="evgain">+${fmt(bonus)} Embercoins</p>`:""}<button type="button" class="big" data-close>Wonderful</button></div>`;panel("evInfo");}
function panel(id){["evPanel","evInfo","evHow"].forEach(p=>{const e=q2(p);if(e)e.hidden=p!==id;});}
function how(){q2("evHow").innerHTML='<h3>How Embervale works</h3><ol class="evhow"><li><b>Practise to grow.</b> Breathing grows pieces for your valley, and every practice, check-in or journal entry earns Embercoins.</li><li><b>Build from the bar.</b> Everything you can place or build is in full colour along the bottom. Greyed things are still growing; tap the i on any card to read about it.</li><li><b>Place it.</b> Tap a card, drag it to open ground (green means it fits), then tap Place here.</li><li><b>Upgrade.</b> Tap a building to see its five levels, from a simple hut to a sky-lantern home. Higher levels need your valley to grow through practice.</li><li><b>Explore.</b> Pinch to zoom, use the buttons on the right for time of day and season, and Arrange to move things.</li></ol><div class="evhelp"><span>Need to talk to someone?</span><button type="button" class="ybtn" data-help>Need a person?</button></div><button class="evclose" type="button" data-close>Got it</button>';panel("evHow");try{profile.vHow=1;saveProfile();}catch(e){}}
function startPlace(id){const it=state.list.find(i=>i.id===id);if(!it)return;arranging=false;panel(null);const [c0,r0]=toTile(W/2,H*.5);let spot=null;
  for(let d=0;d<14&&!spot;d++)for(let dc=-d;dc<=d&&!spot;dc++)for(let dr=-d;dr<=d&&!spot;dr++)if(Math.max(Math.abs(dc),Math.abs(dr))===d&&state.fits(c0+dc,r0+dr,it.w,it.h,it.id))spot=[c0+dc,r0+dr];
  if(!spot){spot=[c0,r0];say("No open ground in view. Drag it to a clear spot.");}placing={it,c:spot[0],r:spot[1],ok:state.fits(spot[0],spot[1],it.w,it.h,it.id)};ui();redraw();}
function build(wrap){const ov=document.createElement("div");ov.className="evui";
  ov.innerHTML=`<div class="evtop" id="evTop"><div class="evtitle"><b>Embervale</b><small id="evCount"></small></div><button class="evbtn evicon2" id="evHowBtn" type="button" aria-label="How Embervale works">${IC.info}</button><button class="evbtn evarr" id="evArrange" type="button">Arrange</button></div>`+
   `<div class="evrail"><button type="button" class="evr" id="evCentre" aria-label="Recentre">${IC.centre}<small>Centre</small></button><button type="button" class="evr" id="evTime" aria-label="Time of day">${IC.time}<small id="evTimeT"></small></button><button type="button" class="evr" id="evSeason" aria-label="Season">${IC.season}<small id="evSeasonT"></small></button><button type="button" class="evr" id="evComplete" aria-label="Preview the complete valley">${IC.eye}<small id="evCompleteT"></small></button><button type="button" class="evr" id="evGrow" aria-label="Your growth">${IC.grow}<small>Growth</small></button><button type="button" class="evr" id="evGuide" aria-label="Field guide">${IC.book}<small>Guide</small></button><button type="button" class="evr" id="evSound" aria-label="Valley sound">${IC.sound}<small id="evSoundT"></small></button></div>`+
   '<div class="evhint" id="evHint" hidden><span>Drag anything to a free spot</span><button type="button" id="evReset">Reset layout</button></div>'+
   '<div class="evlookbar" id="evLook" hidden role="group" aria-label="Flip and size"><span class="evlkname" data-lk="name"></span><div class="evlkrow"><button type="button" class="evlk evlkflip" data-lk="flip" aria-pressed="false">Flip</button><button type="button" class="evlk evlks" data-lk="s-" aria-label="Smaller">&minus;</button><input type="range" min="50" max="160" step="5" value="100" data-lk="sz" aria-label="Size"><button type="button" class="evlk evlks" data-lk="s+" aria-label="Bigger">+</button><b data-lv="sz">100%</b><button type="button" class="evlk evlks" data-lk="reset" aria-label="Reset flip and size">&#8634;</button></div></div>'+
   '<div class="evplace" id="evRoadBar" hidden><span id="evRoadTxt"></span><button type="button" class="evok" id="evRoadDone">Done</button></div><div class="evplace" id="evPlaceBar" hidden><span id="evPlaceTxt"></span><button type="button" id="evPlaceCancel">Cancel</button><button type="button" class="evok" id="evPlaceOk">Place here</button></div>'+
   '<div class="evbar" id="evBar"><div class="evtabs" id="evTabs" role="group" aria-label="Kinds of building"></div><div class="evcards" id="evCards"></div></div>'+
   '<div class="evpanel" id="evPanel" hidden><div id="evPBody"></div><button class="evclose" id="evPClose" type="button">Close</button></div><div class="evpanel" id="evInfo" hidden></div><div class="evpanel" id="evHow" hidden></div>';
  wrap.appendChild(ov);const body=ov.querySelector("#evPBody");["valeCount","valeBreathe","valeSeason","valeList","valePrev"].forEach(id=>{const n=document.getElementById(id);if(n)body.appendChild(n);});
  const q=q2;
  q("evArrange").onclick=()=>{if(VALE.preview){say("This is the complete view. Go back to your valley to arrange it.");return;}arranging=!arranging;sel=null;ui();redraw();if(arranging)say("Edit mode: drag anything to move it, tap a path tile to remove it, or tap a building for more.");};
  lookWire();q("evReset").onclick=()=>{V.resetSpots();refresh();say("Back to the original layout");};
  q("evSeason").onclick=()=>{seasonView=SEASONS4[(SEASONS4.indexOf(seasonView)+1)%5];barKey="";ui();redraw();EVS.set(nowPh(),nowSe());};
  /* changing the time cross-fades the whole valley over 1.5 seconds rather than cutting */
  q("evTime").onclick=()=>{try{if(cv0&&cv0.width&&!RM){const snap=document.createElement("canvas");snap.width=cv0.width;snap.height=cv0.height;snap.getContext("2d").drawImage(cv0,0,0);snap.className="evfade";
      snap.style.cssText="position:absolute;left:"+cv0.offsetLeft+"px;top:"+cv0.offsetTop+"px;width:"+cv0.clientWidth+"px;height:"+cv0.clientHeight+"px;pointer-events:none;z-index:1;transition:opacity 1.5s ease";
      cv0.parentNode.insertBefore(snap,cv0.nextSibling);requestAnimationFrame(()=>requestAnimationFrame(()=>{snap.style.opacity="0";}));setTimeout(()=>snap.remove(),1650);}}catch(e){}
    timeView=TIMES[(TIMES.indexOf(timeView)+1)%5];ui();redraw();EVS.set(nowPh(),nowSe());};
;
  q("evSound").onclick=()=>{EVS.toggle(nowPh(),nowSe());ui();};
  q("evComplete").onclick=()=>{arranging=false;placing=null;cam.z=0;const b=q("valePrev");if(b)b.click();else{VALE.preview=!VALE.preview;refresh();}ui();};
  q("evCentre").onclick=()=>{cam={z:zoom0(W,H,state),x:0,y:0};redraw();};q("evGrow").onclick=()=>panel("evPanel");q("evPClose").onclick=()=>panel(null);q("evHowBtn").onclick=()=>{if(window.EKTUT)EKTUT.open("vale");else how();};q("evGuide").onclick=()=>{if(window.EKGUIDE)EKGUIDE.open();};
  q("evCount").onclick=ev=>{if(ev.target.closest("#hudCoins,#hudFire")&&window.EKECO)EKECO.shop();};
  q("evRoadDone").onclick=()=>{road=null;ui();redraw();};q("evPlaceCancel").onclick=()=>{placing=null;ui();redraw();};q("evPlaceOk").onclick=()=>{if(!placing||!placing.ok)return;const it=placing.it;V.place(it.id,placing.c,placing.r);placing=null;fx[it.id]=performance.now();refresh();say(it.name+" placed. Tap it any time to see what it's for.");};
  q("evTabs").onclick=ev=>{const b=ev.target.closest("[data-tab]");if(!b)return;tab=b.dataset.tab;barKey="";cards();const ec=q("evCards");ec.scrollLeft=0;ec.classList.remove("ekcat-in");void ec.offsetWidth;ec.classList.add("ekcat-in");};
  /* Part 5: thin gold arrows step through the categories (js/ek-catnav.js) */
  /* Part 17: keep the tool rail above the builder bar on short screens */if(window.ResizeObserver)new ResizeObserver(fitRail).observe(q("evBar"));window.addEventListener("resize",fitRail);setTimeout(fitRail,0);
  ov.addEventListener("click",ev=>{if(ev.target.closest("[data-help]")){panel(null);const h=document.getElementById("helpBtn");if(h)h.click();return;}const n=ev.target.closest("[data-nav]");if(n){const list=navList(),i=list.findIndex(x=>x.id===infoId);if(i<0)return;info(list[(i+Number(n.dataset.nav)+list.length)%list.length].id);return;}
    const g=ev.target.closest("[data-goto]");if(g){const sel2=g.dataset.goto;panel(null);try{show("fire");}catch(e){}setTimeout(()=>{const c=document.querySelector(sel2);if(c)c.click();},380);return;}
    const rd=ev.target.closest("[data-road],[data-rinfo]");if(rd){if(rd.dataset.rinfo)return roadInfo(rd.dataset.rinfo);if(VALE.preview)return say("This is the complete view. Go back to your valley to lay paths.");road=rd.dataset.road;arranging=false;panel(null);ui();redraw();return say("Tap or drag on open ground to lay. Tap a path to remove it.");}
    const b=ev.target.closest("[data-place],[data-store],[data-buy],[data-info],[data-vinfo],[data-close],[data-upgrade]");if(!b)return;
    if(b.dataset.close!=null)return panel(null);if(b.dataset.info)return info(b.dataset.info);if(b.dataset.vinfo)return info(null,b.dataset.vinfo);
    if(b.dataset.place)return startPlace(b.dataset.place);if(b.dataset.store){V.store(b.dataset.store);refresh();say("Removed. It's back in your builder bar to place again.");return panel(null);}
    if(b.dataset.upgrade){const id=b.dataset.upgrade,ok=V.upgrade(id);if(!ok)return say("Not quite yet. Keep practising to grow your valley and earn Embercoins.");fx[id]=performance.now();refresh();const it=state.list.find(i=>i.id===id);if(window.EKECO&&it)EKECO.pop("Upgraded: "+EVV.NAMES[it.kind][it.lvl-1],fmt(coins())+" Embercoins left");return info(id);}
    if(b.dataset.buy){const id=V.buy(b.dataset.buy);if(!id)return say("Not enough Embercoins yet. Practise or check in to earn more.");state=V.compute();if(window.EKECO)EKECO.pop("Built: "+V.VILLAGE[b.dataset.buy].name,fmt(coins())+" Embercoins left");startPlace(id);}});}
function mount(){const wrap=document.getElementById("valeWrap");cv0=document.getElementById("valeCanvas");if(!wrap||!cv0)return;
  wrap.classList.add("evfs");if(!document.getElementById("evTop"))build(wrap);
  if(!cv0._ev){cv0._ev=1;cv0.style.touchAction="none";cv0.addEventListener("pointerdown",onDown);cv0.addEventListener("pointermove",onMove);cv0.addEventListener("pointerup",onUp);cv0.addEventListener("pointercancel",onUp);cv0.addEventListener("wheel",onWheel,{passive:false});}
  state=V.compute();ui();if(state.eraUp!=null){const a=state.eraUp,f=state.eraFrom;setTimeout(()=>{if(!cineOn)eraUp(a,f);},cineOn?6000:500);}if(!active){active=true;lastT=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(frame);}
  try{if(!profile.vHow&&!VALE.preview&&!cineOn&&!window.EKCINE)setTimeout(()=>{if(!cineOn&&window.EVO)EVO.open();else if(!cineOn)how();},700);}catch(e){}}
function frame(ts){if(!active)return;if(cine)cineStep(ts);if(typeof currentView!=="undefined"&&currentView!=="vale"){active=false;arranging=false;sel=null;placing=null;panel(null);setBar(false);EVS.stop();return;}if(!EVS.on()&&!document.hidden)EVS.start(nowPh(),nowSe());
  const r=cv0.getBoundingClientRect();W=r.width;H=r.height;if(!lastT||ts-lastT>=33){lastT=ts;paintTo(cv0,W,H,false,RM?0:ts,state);}if(!RM&&!document.hidden)raf=requestAnimationFrame(frame);else active=false;}
function redraw(){lookBar();if(active&&RM&&cv0)paintTo(cv0,W,H,false,0,state);else if(cv0&&!active&&state&&typeof currentView!=="undefined"&&currentView==="vale"){active=true;lastT=0;raf=requestAnimationFrame(frame);}}
/* 3.8.9: Flip and Size live in Arrange mode, in a glass bar at the bottom, for every placed thing (paths are separate) */
/* 3.9.0 (Part 17): on short screens (a 320 x 568 phone) the seven tools on the right ran down into the builder bar.
   The rail now stops 8 px above the bar and scrolls, with a soft fade at its lower edge. */
function fitRail(){const rail=document.querySelector("#valeWrap .evrail"),bar=q2("evBar");if(!rail||!bar)return;rail.style.maxHeight="";rail.classList.remove("evrail-fit");
  const room=Math.floor(bar.getBoundingClientRect().top-rail.getBoundingClientRect().top-8);if(rail.scrollHeight>room+1&&room>80){rail.style.maxHeight=room+"px";rail.classList.add("evrail-fit");}}
function lookBar(){const b=q2("evLook");if(!b)return;const it=arranging&&sel&&state&&state.items.some(i=>i.id===sel.id)?sel:null;
  if(!it){if(!b.hidden){b.hidden=true;const tt=document.getElementById("toast");if(tt)tt.style.bottom="";}return;}b.hidden=false;b.dataset.look=it.id;const bar=q2("evBar");b.style.bottom=((bar?bar.offsetHeight:0)+10)+"px";const tt=document.getElementById("toast");if(tt){const top=b.getBoundingClientRect().top;if(top>0)tt.style.bottom=Math.round(innerHeight-top+10)+"px";}
  const mx=Math.round(maxS(it)*100),l=Object.assign({f:1,s:1},(V.look&&V.look(it.id))||{}),pc=Math.min(mx,Math.round((l.s||1)*100));
  b.querySelector('[data-lk="name"]').textContent=it.id==="fire"?"Hearth \u00b7 stays in place":(it.name||"");
  const fb=b.querySelector('[data-lk="flip"]');fb.classList.toggle("on",l.f<0);fb.setAttribute("aria-pressed",String(l.f<0));
  const r=b.querySelector('[data-lk="sz"]');if(+r.max!==mx)r.max=mx;if(+r.value!==pc)r.value=pc;b.querySelector('[data-lk="s+"]').disabled=pc>=mx;b.querySelector('[data-lk="s-"]').disabled=pc<=50;b.querySelector('[data-lv="sz"]').textContent=pc+"%";}
function lookSet(o){const b=q2("evLook"),id=b&&b.dataset.look;if(!id||!V.setLook)return;const l=Object.assign({f:1,r:0,s:1},(V.look&&V.look(id))||{},o);l.r=0;l.s=Math.max(.5,Math.min(maxS(state&&state.items.find(i=>i.id===id)),Math.round(l.s*100)/100));V.setLook(id,l);redraw();}
function lookWire(){const b=q2("evLook");if(!b||b.dataset.wired)return;b.dataset.wired="1";
  b.addEventListener("click",e=>{const k=e.target.closest("[data-lk]");if(!k)return;const id=b.dataset.look,l=Object.assign({f:1,s:1},(V.look&&V.look(id))||{});l.s=Math.min(l.s||1,maxS(state&&state.items.find(i=>i.id===id)));/* steps start from the size you can see */
    if(k.dataset.lk==="flip")lookSet({f:l.f<0?1:-1});else if(k.dataset.lk==="s-")lookSet({s:(l.s||1)-.05});else if(k.dataset.lk==="s+")lookSet({s:(l.s||1)+.05});else if(k.dataset.lk==="reset")lookSet({f:1,s:1});});
  b.addEventListener("input",e=>{if(e.target.dataset.lk==="sz")lookSet({s:+e.target.value/100});});
  ["pointerdown","pointermove","pointerup"].forEach(t=>b.addEventListener(t,e=>e.stopPropagation()));}
function refresh(){state=V.compute();ui();if(state.eraUp!=null)eraUp(state.eraUp,state.eraFrom);redraw();}
function paint(c,w,h,opt){if(opt&&opt.thumb){paintTo(c,w,h,true,0,V.compute());return;}mount();}
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&typeof currentView!=="undefined"&&currentView==="vale")redraw();});
wireLook();
/* view-only: tap empty ground (or press back) to tuck the builder bar away for a full view of the valley; tap the ground again to bring it back */
var barHidden=false,barT=0,multiEnd=0;
function setBar(h){barHidden=!!h;const b=document.getElementById("evBar");if(b)b.classList.toggle("ek-tuck",barHidden);
  if(barHidden){try{if(!localStorage.getItem("ek-tuck-tip")){localStorage.setItem("ek-tuck-tip","1");say("Builder tucked away. Tap the ground again to bring it back.");}}catch(e){}}}
window.EVBAR={shown:()=>{const b=document.getElementById("evBar");return !!b&&!barHidden&&!!b.offsetParent;},hide:()=>setBar(true),show:()=>setBar(false)};
return {paint,refresh,N,get state(){return state;},get arranging(){return arranging;},setSeason:s=>{seasonView=s;ui();redraw();},
  screenOf:(c,r)=>{const p=A.P(c+.5,r+.5);return [ox+p[0]*S,oy+p[1]*S];},
  /* cinema: hide the valley's controls and pause touch, place the camera, glide it (resolves on arrival) */
  cineMode(on){cineOn=!!on;const w=document.getElementById("valeWrap");if(w)w.classList.toggle("evcine",cineOn);if(!on)cine=null;},
  cineSet(c,r,z,up){Object.assign(cam,camAt(c,r,z,up,W||innerWidth,H||innerHeight));redraw();},
  openInfo(id){info(id);},cineTo(from,to,dur,arc){return new Promise(done=>{cine={from,to,dur,arc,t0:performance.now(),done};if(!active){active=true;lastT=0;raf=requestAnimationFrame(frame);}});},get zoom(){return cam.z;},get zoomDefault(){return zoom0(W,H,state);}};
/* ---------- fine editing: flip, turn and size every placed item (not paths or streams) ---------- */
/* 3.9.0 (Part 8): how big each kind of piece may grow. Buildings, large trees and the hearth stop at 130% (beyond
   that they spill over their neighbours in a crowded valley); ground pieces at 140%; small pieces at 160%.
   Every size keeps the same grid footprint. A look saved larger than its limit is drawn at the limit. */
function maxS(it){if(!it)return 1.6;if(it.ground)return 1.4;if(it.id==="fire"||String(it.id).startsWith("v:")||(it.w||1)*(it.h||1)>=4)return 1.3;return 1.6;}
function drawLooked(x,it,lk,L,fn){const cc=A.P(it.c+it.w/2,it.r+it.h/2),n0=L?L.length:0,f=lk.f||1,sc=Math.min(lk.s||1,maxS(it)),ro=0,co=Math.cos(ro),si=Math.sin(ro);
  x.save();x.translate(cc[0],cc[1]);x.rotate(ro);x.scale(f*sc,sc);x.translate(-cc[0],-cc[1]);fn();x.restore();
  if(L)for(let i=n0;i<L.length;i++){const p=L[i];if(!p)continue;const dx=(p[0]-cc[0])*f*sc,dy=(p[1]-cc[1])*sc;p[0]=cc[0]+dx*co-dy*si;p[1]=cc[1]+dx*si+dy*co;if(typeof p[2]==="number")p[2]*=sc;}}
function lookUI(id){const l=Object.assign({f:1,r:0,s:1},(V.look&&V.look(id))||{});
  return `<div class="vlook" data-look="${id}"><div class="vlrow"><span>Flip</span><button type="button" data-lk="flip" class="${l.f<0?"on":""}" aria-pressed="${l.f<0}">⇋ Face ${l.f<0?"left":"right"}</button><button type="button" data-lk="reset">Reset</button></div>

  <div class="vlrow"><span>Size</span><button type="button" data-lk="s-" aria-label="Smaller">−</button><input type="range" min="50" max="160" step="5" value="${Math.round(l.s*100)}" data-lk="sz" aria-label="Size"><button type="button" data-lk="s+" aria-label="Bigger">+</button><b data-lv="sz">${Math.round(l.s*100)}%</b></div></div>`;}
function applyLook(box,o){const id=box.dataset.look,l=Object.assign({f:1,r:0,s:1},(V.look&&V.look(id))||{},o);l.r=0;l.s=Math.max(.5,Math.min(maxS(state&&state.items.find(i=>i.id===id)),Math.round(l.s*100)/100));V.setLook(id,l);
  const q=s=>box.querySelector(s);q('[data-lk="sz"]').value=Math.round(l.s*100);q('[data-lv="sz"]').textContent=Math.round(l.s*100)+"%";const fb=q('[data-lk="flip"]');fb.classList.toggle("on",l.f<0);fb.textContent="⇋ Face "+(l.f<0?"left":"right");fb.setAttribute("aria-pressed",String(l.f<0));
  try{refresh();}catch(e){}try{redraw();}catch(e){}}
function wireLook(){if(wireLook.done)return;wireLook.done=true;
document.addEventListener("click",ev=>{const b=ev.target.closest(".vlook button[data-lk]");if(!b)return;ev.stopPropagation();const box=b.closest(".vlook"),l=Object.assign({f:1,r:0,s:1},(V.look&&V.look(box.dataset.look))||{});
  const k=b.dataset.lk;applyLook(box,k==="flip"?{f:-l.f}:k==="rl"?{r:l.r-15}:k==="rr"?{r:l.r+15}:k==="s-"?{s:l.s-.1}:k==="s+"?{s:l.s+.1}:{f:1,r:0,s:1});},true);
document.addEventListener("input",ev=>{const r=ev.target.closest(".vlook input[data-lk]");if(!r)return;applyLook(r.closest(".vlook"),r.dataset.lk==="ro"?{r:+r.value}:{s:+r.value/100});});}

})();
