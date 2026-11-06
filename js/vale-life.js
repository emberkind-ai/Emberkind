"use strict";
/* ================= EMBERVALE LIFE =================
   The people of your valley. Homes give them somewhere to live, your practice brings more of them in, and they
   mirror what you've been doing: after you meditate they gather at the pods, zen garden and pool; after breathwork
   they fill the hall; after a check-in or journal entry they visit the library and the circle.
   Where each one is comes from the clock, not a simulation, so it costs almost nothing. */
const EVL=(()=>{
const A=EVA,N=EVW.N;
const FOLK=[["Ellie","found her breath again by the river."],["Banjo","whittles birds from fallen branches."],["Yindi","tells stories by the fire on cold nights."],["Hugo","is learning to say no without guilt."],["Saoirse","walks the zen path every morning."],["Ravi","fixes anything with a hinge or a handle."],["Wren","keeps a journal of every sunrise."],["Mira","came looking for quiet after a busy few years."],["Jarrah","knows every bird in the valley by its call."],["Leila","is learning to rest without having to earn it."],["Tom","keeps the lanterns trimmed and the paths swept."],["Aiko","hums while she tends the garden."],["Kai","came for a week and stayed for the seasons."],["Rosa","brings warm bread to the gathering circle."],["Sam","writes letters by the fire most evenings."],["Priya","sits by the pool to watch the sky change."],["Ari","is slowly learning to breathe slower."],["Noa","plants a tree for every friend who visits."],["Eli","fixes things quietly, without being asked."],["Hana","walks the river path at first light."],["Jun","grows tomatoes and gives most of them away."],["Ivy","walks the valley paths at first light."],["Maya","teaches the children the names of the stars."],["Ben","plays guitar by the circle on warm evenings."],["Sol","came to rest and found a reason to stay."],["Ruby","keeps a journal of every season here."]];
const SKIN=["#F1C9A5","#E0AC84","#C68A62","#9C6644","#7A4A2E","#F6D5B8","#B07850"],CLOTH=["#7FB6A0","#D88A7A","#9C8FD0","#E8C27A","#6F9EC9","#C9A27A","#B5643C","#8FC28A"],HAIR=["#3B2A20","#6B4630","#1E1A18","#A7744A","#D9B98A","#5A3A2A"];
const CAP={home:[2,2,2,2,2],cabin:[2,2,2,2,2],longhouse:[4,4,4,4,4]};/* 3.4.0: every home brings its villagers the moment it's placed */
const GO={med:["pod","zen","pool"],breathe:["hall","ashram","yoga"],reflect:["library","pool","circle"]},DAY=["garden","orchard","library","hall","circle","yoga","pod","zen","pool"];
const DOING={pod:"Sitting quietly in the pod",zen:"Raking the zen garden",pool:"Sitting by the reflection pool",hall:"Breathing with others in the hall",ashram:"On retreat at the ashram",yoga:"Moving in the yoga shala",library:"Reading in the library",circle:"Talking at the gathering circle",garden:"Tending the garden",orchard:"Picking fruit in the orchard",fire:"Sitting by the fire",home:"Resting at home"};
const MIRROR={med:"after your meditation",breathe:"after your breathwork",reflect:"after your reflection"};
function recent(){const now=Date.now();for(const l of (profile.log||[]).slice(-8).reverse()){if(now-l.t>3*36e5)break;if(/^Meditate/.test(l.w))return "med";if(/^Breathe/.test(l.w))return "breathe";}
  try{const m=moods[moods.length-1];if(m&&now-m.at<3*36e5)return "reflect";}catch(e){}return null;}
function door(st,it){for(const p of [[it.c+Math.floor(it.w/2),it.r+it.h],[it.c+it.w,it.r+Math.floor(it.h/2)],[it.c-1,it.r+Math.floor(it.h/2)],[it.c+Math.floor(it.w/2),it.r-1]])if(p[0]>=0&&p[1]>=0&&p[0]<N&&p[1]<N&&(!st.occ[p[1]*N+p[0]]||(st.occ[p[1]*N+p[0]]==="road"&&!(st.roads&&st.roads[p[0]+","+p[1]]==="w"))))return p;return [it.c,Math.min(N-1,it.r+it.h)];}
function walk(st,a,b){const k=p=>p[1]*N+p[0],prev=new Map([[k(a),null]]),q=[a],br=st.bridge;
  const ok=p=>p[0]>=0&&p[1]>=0&&p[0]<N&&p[1]<N&&st.seen[k(p)]&&(!st.occ[k(p)]||(st.occ[k(p)]==="road"&&!(st.roads&&st.roads[p[0]+","+p[1]]==="w"))||(st.occ[k(p)]==="river"&&br&&p[1]===br.r));
  for(let i=0;i<q.length&&i<2600;i++){const p=q[i];if(p[0]===b[0]&&p[1]===b[1]){const o=[];let c=p;while(c){o.unshift(c);c=prev.get(k(c));}return o;}
    for(const [dc,dr] of [[0,1],[1,0],[-1,0],[0,-1]]){const n=[p[0]+dc,p[1]+dr];if(prev.has(k(n))||!(ok(n)||(n[0]===b[0]&&n[1]===b[1])))continue;prev.set(k(n),p);q.push(n);}}return [];}
let cache=null,ckey="";
function beds(st){const o=[];for(const h of st.items)if(CAP[h.kind])for(let n=0;n<CAP[h.kind][(h.lvl||1)-1];n++)o.push(h);return o;}
const PAUSE=[6500,9000,7500,11000,8000];
/* each villager walks a little loop, like the people in a village game: home, a first stop (which mirrors your
   practice), a second place to wander to, and home again, pausing a while at each */
function plan(st,ph){const mood=recent(),k2=[st.items.map(i=>i.id+(i.lvl||"")+i.c+","+i.r).join(),ph,mood,st.pv].join("|");if(cache&&k2===ckey)return cache;ckey=k2;
  const bd=beds(st);let grown=0;try{grown=valeTotal();}catch(e){}const pop=Math.min(bd.length,20),fire=st.items.find(i=>i.id==="fire"),of=k=>st.items.filter(i=>i.kind===k),out=[];
  const wander=["fire","circle","garden","orchard","pool","zen","library","yoga"].flatMap(of);
  for(let i=0;i<pop;i++){const home=bd[i],f=FOLK[i%FOLK.length];let stops=[home],why=DOING.home,mir=null;
    if(ph==="night"){if(i%4===0&&fire){stops=[home,fire];why=DOING.fire;}}
    else{const want=mood&&i%3!==2?GO[mood].flatMap(of):[];let d1;if(want.length){d1=want[i%want.length];mir=mood;}else{const d=DAY.flatMap(of);d1=d.length?d[(i*3+1)%d.length]:(fire||home);}
      why=DOING[d1.kind]||DOING.home;stops=[home,d1];const d2=wander.filter(w=>w!==d1&&w!==home)[(i*5+2)%Math.max(1,wander.length)];if(d2)stops.push(d2);}
    const v={i,name:f[0],story:f[1],skin:SKIN[i%SKIN.length],cloth:CLOTH[(i*3+1)%CLOTH.length],hair:HAIR[(i*5+2)%HAIR.length],style:i%3,home,dest:stops[1]||home,why:why+(mir?" "+MIRROR[mir]:""),mirror:mir,off:i*9137,legs:[]};
    let tt=0;for(let s2=0;s2<stops.length;s2++){const a=stops[s2],b2=stops[(s2+1)%stops.length];if(a===b2)continue;const path=walk(st,door(st,a),door(st,b2)),pause=PAUSE[(i+s2)%PAUSE.length];
      if(path.length){v.legs.push({t0:tt,walk:path.length*1050,pause,path});tt+=path.length*1050+pause;}}
    v.dur=Math.max(1,tt);out.push(v);}
  return cache=out;}
/* where everyone is right now, from the clock */
function frame(st,t,ph){const out=[];for(const v of plan(st,ph)){let p=null,moving=false;
    if(!v.legs.length){if(ph==="night")continue;const h=door(st,v.home),m=A.tileCenter(h[0],h[1]);p=[m[0]+((v.i%3)-1)*9,m[1]+4];}
    else{const u=(t+v.off)%v.dur;const lg=v.legs.find(l=>u>=l.t0&&u<l.t0+l.walk+l.pause)||v.legs[0],lu=u-lg.t0,r=lg.path;
      if(lu<lg.walk){const pos=lu/lg.walk*(r.length-1),a=Math.floor(pos),b=Math.min(r.length-1,a+1),w=pos-a,pa=A.tileCenter(r[a][0],r[a][1]),pb=A.tileCenter(r[b][0],r[b][1]);p=[pa[0]+(pb[0]-pa[0])*w,pa[1]+(pb[1]-pa[1])*w];moving=true;}
      else{const e=r[r.length-1],m=A.tileCenter(e[0],e[1]),an=v.i*1.9;p=[m[0]+Math.cos(an)*12,m[1]+Math.sin(an)*5];}
      if(ph==="night"&&!moving&&lg===v.legs[v.legs.length-1])continue;}
    out.push({v,x:p[0],y:p[1],moving,night:ph==="night",d:p[1]/16+.25});}return out;}
/* little people: round heads, a few hairstyles, rosy cheeks, swinging arms and steps */
const SC=1.8;
function draw(x,f,t){x.save();x.translate(f.x,f.y);x.scale(SC,SC);draw0(x,f,t);x.restore();}
function draw0(x,f,t){const v=f.v,ph=t*.012+v.i,b=f.moving?Math.abs(Math.sin(ph))*1.4:Math.sin(t*.003+v.i)*.3,y=-b,sw=f.moving?Math.sin(ph)*2.2:0;
  if(f.night&&f.moving){const g=x.createRadialGradient(4,y-7,0,4,y-7,14);g.addColorStop(0,"rgba(255,210,140,.55)");g.addColorStop(1,"rgba(255,210,140,0)");x.fillStyle=g;x.beginPath();x.arc(4,y-7,14,0,7);x.fill();A.dot(x,4.5,y-6.5,1.3,"#FFE2A8");}
  A.shadow(x,1,1,4.6,1.8,.22);x.strokeStyle="#3A2E28";x.lineWidth=1.7;x.lineCap="round";x.beginPath();x.moveTo(-1.3,y-4);x.lineTo(-1.3+sw,0);x.moveTo(1.3,y-4);x.lineTo(1.3-sw,0);x.stroke();
  x.fillStyle=v.cloth;x.beginPath();x.moveTo(-3.9,y-3.5);x.quadraticCurveTo(-4.4,y-11,0,y-11.6);x.quadraticCurveTo(4.4,y-11,3.9,y-3.5);x.quadraticCurveTo(0,y-2.4,-3.9,y-3.5);x.fill();
  x.strokeStyle=v.cloth;x.lineWidth=1.6;x.beginPath();x.moveTo(-3.4,y-9.6);x.lineTo(-4.6-sw*.4,y-6);x.moveTo(3.4,y-9.6);x.lineTo(4.6+sw*.4,y-6);x.stroke();
  A.dot(x,0,y-15,3.6,v.skin);x.fillStyle=v.hair;x.beginPath();
  if(v.style===0)x.arc(0,y-15.5,3.75,Math.PI*.95,Math.PI*2.05);else if(v.style===1){x.arc(0,y-15.6,3.7,Math.PI,0);x.moveTo(2.4,y-18.6);x.arc(1.8,y-19.4,1.6,0,7);}else{x.arc(0,y-15.5,3.8,Math.PI*.85,Math.PI*2.15);x.rect(-3.8,y-15.5,1.4,4.6);x.rect(2.4,y-15.5,1.4,4.6);}
  x.fill();A.dot(x,-1.9,y-13.9,.7,"rgba(232,120,120,.55)");A.dot(x,1.9,y-13.9,.7,"rgba(232,120,120,.55)");}
function hit(st,t,ph,wx,wy,rad){let best=null,bd=rad||16;for(const f of frame(st,t,ph)){const d=Math.hypot(wx-f.x,(wy-(f.y-15))*1.1);if(d<bd){bd=d;best=f.v;}}return best;}
return {plan,frame,draw,hit,beds:st=>beds(st).length};
})();
