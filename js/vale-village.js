"use strict";
/* ================= EMBERVALE ECO VILLAGE =================
   Village buildings with five levels each: humble and natural at first, then rammed earth, timber and glass,
   living roofs, and finally a sky lantern and solar, in the spirit of the Aevum eco village. Never mansions. */
const EVV=(()=>{
const A=EVA,TAU=7,{shadow,dot,shade,rnd}=A;
const NAMES={home:["Thatch hut","Earth roundhouse","Timber eco home","Garden home","Sky-lantern home"],pod:["Woven dome","White pod","Deck pod","Glass-eye pod","Light pod"],
  library:["Reading hut","Earth library","Timber library","Garden library","Sky-lantern library"],hall:["Open shelter","Earth hall","Glass hall","Balcony hall","Sky-lantern hall"],
  ashram:["Open pavilion","Tiered pavilion","Lantern pavilion","Terrace ashram","Light ashram"],yoga:["Mats on the grass","Raised shala","Open shala","Garden shala","Grand shala"],
  circle:["Log circle","Stone circle","Sunken fire circle","Gathering deck","Lantern circle"],zen:["Sand and stones","Raked garden","Moss garden","Lantern garden","Water garden"],
  pool:["Still pond","Lotus pool","Gravel-ring pool","Lantern pool","Moon pool"]};
function cyl(x,cx,cy,rx,h,col){const ry=rx*.5;x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,Math.PI);x.lineTo(cx-rx,cy-h);x.ellipse(cx,cy-h,rx,ry,0,Math.PI,0,true);x.closePath();x.fillStyle=col;x.fill();
  const g=x.createLinearGradient(cx-rx,0,cx+rx,0);g.addColorStop(0,"rgba(255,255,255,.1)");g.addColorStop(.55,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,.24)");x.fillStyle=g;x.fill();}
function band(x,cy,rx,y0,y1,night,L,n){const ry=rx*.5;for(let i=0;i<n;i++){const a=Math.PI*(.12+.76*(i+.5)/n),px=-Math.cos(a)*rx*.98,py=cy+Math.sin(a)*ry*.98;
  x.fillStyle=night?"#FFCF8A":"#9DC6DE";x.fillRect(px-3.2,py-y1,6.4,y1-y0);if(night&&i%2===0)L.push([px,py-(y0+y1)/2,20,.18]);}}
function glass(x,cy,rx,y0,y1,night,L){const ry=rx*.5;x.beginPath();x.ellipse(0,cy-y0,rx*.99,ry,0,0,Math.PI);x.lineTo(-rx*.99,cy-y1);x.ellipse(0,cy-y1,rx*.99,ry,0,Math.PI,0,true);x.closePath();
  x.fillStyle=night?"#EDBE7E":"#5F7C88";x.fill();x.strokeStyle=night?"rgba(120,70,30,.45)":"rgba(255,255,255,.32)";x.lineWidth=1;
  for(let i=1;i<8;i++){const a=Math.PI*i/8,px=-Math.cos(a)*rx,py=Math.sin(a)*ry;x.beginPath();x.moveTo(px,cy-y0+py);x.lineTo(px,cy-y1+py);x.stroke();}if(night)L.push([0,cy-(y0+y1)/2+ry*.6,rx,.22]);}
function roofDisc(x,cy,rx,dome,se,col){const S=A.SEAS[se],gr=col||(se==="winter"?"#EEF3F7":se==="autumn"?"#93A35E":"#6F9E5C");x.fillStyle=shade(gr,-.15);x.beginPath();x.ellipse(0,cy,rx,rx*.5,0,0,TAU);x.fill();
  x.fillStyle=gr;x.beginPath();x.ellipse(0,cy-2,rx-2,rx*.5-1,0,0,TAU);x.fill();if(dome){x.beginPath();x.ellipse(0,cy-2,rx-2,dome,0,Math.PI,TAU);x.fill();}
  if(!col){const R=rnd(Math.round(rx*7));for(let i=0;i<Math.round(rx*.6);i++){const a=R()*TAU,d=R()*.85;dot(x,Math.cos(a)*rx*d*.9,cy-2+Math.sin(a)*rx*.45*d-(dome?R()*dome*.7:0),1.4,i%3?shade(gr,.18):(S.blossom?S.blossom[i%3]:"#E8D27A"));}}}
function thatch(x,cy,rx,hh,se){const ry=rx*.5,c=se==="winter"?"#EEF3F7":"#C9A55C";x.fillStyle=shade(c,-.12);x.beginPath();x.ellipse(0,cy,rx,ry,0,0,TAU);x.fill();
  x.fillStyle=c;x.beginPath();x.moveTo(-rx,cy);x.lineTo(0,cy-hh);x.lineTo(rx,cy);x.ellipse(0,cy,rx,ry,0,0,Math.PI);x.closePath();x.fill();
  x.strokeStyle=shade(c,-.25);x.lineWidth=1;for(let i=-4;i<=4;i++){const u=i/4*.95;x.beginPath();x.moveTo(0,cy-hh);x.lineTo(u*rx,cy+ry*Math.sqrt(1-u*u));x.stroke();}}
function skyLantern(x,cy,r,night,L){x.fillStyle="#C2C7CB";x.beginPath();x.ellipse(0,cy,r,r*.5,0,0,TAU);x.fill();x.fillStyle="#AEB4B9";x.beginPath();x.moveTo(-r,cy);x.lineTo(0,cy-r*1.1);x.lineTo(r,cy);x.closePath();x.fill();
  x.strokeStyle="rgba(255,255,255,.4)";x.lineWidth=1;for(let i=-3;i<=3;i++){x.beginPath();x.moveTo(i*r/3.5,cy+Math.abs(i)*.4);x.lineTo(0,cy-r*1.1);x.stroke();}if(night)L.push([0,cy-r*.4,r*2.4,.2]);}
function solar(x,cy,r){x.fillStyle="#2E4470";for(const [u,v] of [[-.62,-.02],[.18,.1]]){const px=u*r,py=cy+v*r;x.beginPath();x.moveTo(px,py);x.lineTo(px+r*.36,py-r*.07);x.lineTo(px+r*.44,py+r*.1);x.lineTo(px+r*.08,py+r*.17);x.closePath();x.fill();}}
function deck(x,rx){x.fillStyle="#9C744B";x.beginPath();x.ellipse(0,6,rx,rx*.5,0,0,Math.PI);x.lineTo(-rx,3);x.ellipse(0,3,rx,rx*.5,0,Math.PI,0,true);x.closePath();x.fill();x.fillStyle="#B58A5C";x.beginPath();x.ellipse(0,3,rx,rx*.5,0,0,TAU);x.fill();}
/* one round building, shaped by its level's options */
/* 3.0.1: lived-in detail for every round building (eco homes, pods, hall, library) */
function detail(x,rx,ry,night,L,se){const TA=Math.PI*2,snow=se==="winter";
  for(let i=0;i<=16;i++){const a=i/16*Math.PI;if(Math.abs(a-Math.PI/2)<.22)continue;const px=Math.cos(a)*rx,py=Math.sin(a)*ry;x.fillStyle=i%3?"#9C978F":"#B5B0A7";x.beginPath();x.ellipse(px,py-1.5,Math.min(3.4,rx*.12),2.2,0,0,TA);x.fill();}
  x.strokeStyle="rgba(255,236,200,.35)";x.lineWidth=1;x.beginPath();x.moveTo(-5.5,ry);x.lineTo(-5.5,ry-13);x.quadraticCurveTo(0,ry-18.6,5.5,ry-13);x.lineTo(5.5,ry);x.stroke();
  dot(x,3,ry-6.5,.9,"#D9B36A");x.fillStyle="#A8A39A";x.beginPath();x.ellipse(0,ry+2.4,8,2.6,0,0,TA);x.fill();
  const lx=9,ly=ry-12;x.strokeStyle="#3B2A1C";x.lineWidth=.9;x.beginPath();x.moveTo(lx-3,ly-3);x.lineTo(lx,ly-3);x.lineTo(lx,ly-1.5);x.stroke();x.fillStyle=night?"#FFD27A":"#5B5048";x.fillRect(lx-1.8,ly-1.5,3.6,4.6);
  if(night&&L){L.push([lx,ly+1,18,.38]);L.push([0,ry+4,30,.16]);}
  if(!snow&&rx>=24)for(const s of [-1,1]){const a=Math.PI/2+s*.62,px=Math.cos(a)*rx*1.02,py=Math.sin(a)*ry*1.02;x.fillStyle="#8E5B3A";x.fillRect(px-4,py-4,8,5);
    for(let k=0;k<4;k++)dot(x,px-3+k*2,py-5-(k%2)*1.6,2,k%2?"#5E9E52":(se==="autumn"?"#E39B3B":k?"#F28BA8":"#FFD36B"));}}
/* 3.0.2: stone lanterns, planters and flags for the ashram; log benches and lanterns round the gathering circle */
function toro(x,px,py,night,L){x.fillStyle="rgba(20,22,24,.3)";x.beginPath();x.ellipse(px+2,py+2,7,3,0,0,Math.PI*2);x.fill();x.fillStyle="#8B8F95";x.fillRect(px-4,py-3,8,3.5);x.fillStyle="#9EA3A9";x.fillRect(px-1.8,py-10,3.6,7);
  x.fillStyle=night?"#FFD27A":"#C9C2B0";x.fillRect(px-3.4,py-15.5,6.8,5.5);x.fillStyle="#2E3135";x.fillRect(px-.9,py-15.5,1.8,5.5);x.fillStyle="#6C7076";x.beginPath();x.moveTo(px-6.5,py-15.5);x.lineTo(px+6.5,py-15.5);x.lineTo(px,py-20.5);x.closePath();x.fill();
  if(night&&L){L.push([px,py-12,22,.42]);L.push([px,py+2,32,.18]);}}
function ashramDetail(x,lv,night,L,se){toro(x,-58,8,night,L);toro(x,58,8,night,L);
  if(se!=="winter")for(const [px,py] of [[-30,24],[30,24]]){x.fillStyle="#8E5B3A";x.fillRect(px-6,py-5,12,6);for(let k=0;k<5;k++)dot(x,px-4+k*2,py-6-(k%2)*2,2.2,k%2?"#5E9E52":(se==="autumn"?"#E39B3B":"#F28BA8"));}
  if(lv>=4){const fl=["#3E7BD9","#F4F4F4","#D9483E","#3FA85A","#F2C744"];for(let k=0;k<10;k++){const u=k/10,px=-58+116*u,py=-10+Math.sin(u*Math.PI)*6-12;x.fillStyle=fl[k%5];x.beginPath();x.moveTo(px-3,py);x.lineTo(px+3,py);x.lineTo(px,py+7);x.closePath();x.fill();}}}
function circleDetail(x,lv,night,L,se){for(const [px,py,rot] of [[-50,-4,.46],[50,-4,-.46],[-30,22,-.46],[30,22,.46]]){x.save();x.translate(px,py);x.rotate(rot);x.fillStyle="#6B4630";x.fillRect(-11,-3,22,6);x.fillStyle="#8A6040";x.fillRect(-11,-3,22,2.2);x.fillStyle="#C99A64";x.beginPath();x.ellipse(-11,0,1.6,3,0,0,Math.PI*2);x.ellipse(11,0,1.6,3,0,0,Math.PI*2);x.fill();x.restore();}
  if(lv>=2){toro(x,-60,14,night,L);toro(x,60,14,night,L);}}
function round(x,o,night,L,se){const rx=o.rx,ry=rx*.5;shadow(x,6,6,rx*1.15,rx*.5,.2);if(o.deck)deck(x,rx*1.22);
  if(o.open){x.strokeStyle="#6B4630";x.lineWidth=3.2;for(let i=0;i<8;i++){const a=i/8*TAU;if(Math.sin(a)<-.2)continue;const px=Math.cos(a)*rx*.92,py=Math.sin(a)*ry*.92;x.beginPath();x.moveTo(px,py);x.lineTo(px,py-o.h);x.stroke();}}
  else{cyl(x,0,0,rx,o.h,o.wall);if(o.slats){x.strokeStyle="rgba(70,45,25,.25)";x.lineWidth=1;for(let i=1;i<10;i++){const a=Math.PI*i/10,px=-Math.cos(a)*rx,py=Math.sin(a)*ry;x.beginPath();x.moveTo(px,py);x.lineTo(px,py-o.h);x.stroke();}}
    if(o.glass)glass(x,0,rx,3,o.h-4,night,L);else band(x,0,rx,5,Math.min(o.h-3,15),night,L,o.win||3);
    x.fillStyle="#6B4630";x.beginPath();x.moveTo(-5,ry);x.lineTo(5,ry);x.lineTo(5,ry-13);x.quadraticCurveTo(0,ry-18,-5,ry-13);x.closePath();x.fill();detail(x,rx,ry,night,L,se);}
  let top=-o.h,r2=rx;if(o.tier){cyl(x,0,top,o.tier,o.th,o.tw||o.wall);if(o.glass2)glass(x,top,o.tier,2,o.th-3,night,L);else band(x,top,o.tier,3,o.th-4,night,L,3);top-=o.th;r2=o.tier;}
  if(o.thatch)thatch(x,top,rx*1.14,o.thatch,se);else if(o.dome&&o.dome.length)roofDisc(x,top,r2*1.04,o.dome[0],se,se==="winter"?"#F2F5F8":o.dome[1]);else roofDisc(x,top,r2*(o.over||1.12),o.dome||0,se);
  if(o.solar)solar(x,top,r2);if(o.lantern)skyLantern(x,top-3,Math.max(5,r2*.26),night,L);}
const ROUND={
  home:[{rx:28,h:15,wall:"#C8A57A",thatch:30},{rx:36,h:20,wall:"#D8C29E",dome:20},{rx:40,h:22,wall:"#B98A5E",slats:1,win:4,deck:1,dome:14},{rx:42,h:20,wall:"#D2B48C",tier:31,th:16,tw:"#B98A5E",deck:1,dome:10},{rx:44,h:26,wall:"#C9A27A",glass:1,over:1.22,solar:1,lantern:1,deck:1}],
  pod:[{rx:12,h:6,wall:"#C8A57A",thatch:20},{rx:15,h:5,wall:"#EDE6D6",dome:[20,"#F1EBDD"]},{rx:15,h:5,wall:"#EDE6D6",dome:[20,"#F1EBDD"],deck:1},{rx:16,h:6,wall:"#EDE6D6",glass:1,dome:[18,"#F1EBDD"],deck:1},{rx:17,h:8,wall:"#D9D3C8",glass:1,dome:[16,"#E4E8EA"],lantern:1,deck:1}],
  library:[{rx:46,h:20,wall:"#C8A57A",thatch:40,win:5},{rx:58,h:24,wall:"#D8C29E",tier:44,th:18,win:6},{rx:58,h:24,wall:"#C9A27A",slats:1,tier:46,th:20,tw:"#B88E66",win:6},{rx:58,h:24,wall:"#C9A27A",glass:1,tier:46,th:20,tw:"#B88E66",deck:1},{rx:60,h:26,wall:"#C9A27A",glass:1,tier:46,th:20,tw:"#B88E66",glass2:1,deck:1,solar:1,lantern:1,over:1.2}],
  hall:[{rx:52,h:14,open:1,thatch:44},{rx:62,h:26,wall:"#CDB38E",win:8},{rx:64,h:28,wall:"#CDB38E",glass:1},{rx:64,h:26,wall:"#CDB38E",glass:1,tier:52,th:16,glass2:1,deck:1},{rx:66,h:30,wall:"#C9A27A",glass:1,over:1.22,solar:1,lantern:1,deck:1}]};
function ashram(x,lv,night,L,se){shadow(x,6,6,74,30,.2);x.fillStyle=lv>=4?"#D9C7A6":"#CDB896";x.beginPath();x.moveTo(-72,0);x.lineTo(0,-36);x.lineTo(72,0);x.lineTo(0,36);x.closePath();x.fill();
  if(lv>=4){const R=rnd(5);for(let i=0;i<26;i++){const a=R()*TAU;dot(x,Math.cos(a)*64,Math.sin(a)*30,3+R()*2,i%4?"#6F9E5C":"#E7A3C0");}}
  if(lv>=5){x.fillStyle=night?"rgba(237,190,126,.75)":"rgba(140,175,190,.55)";x.beginPath();x.moveTo(-48,4);x.lineTo(0,28);x.lineTo(48,4);x.lineTo(48,-24);x.lineTo(0,0);x.lineTo(-48,-24);x.closePath();x.fill();}
  x.strokeStyle="#6B4630";x.lineWidth=4;[[-48,4],[48,4],[0,28],[-24,16],[24,16]].forEach(([px,py])=>{x.beginPath();x.moveTo(px,py);x.lineTo(px,py-30);x.stroke();});
  if(night){x.fillStyle="rgba(255,207,138,.45)";x.beginPath();x.ellipse(0,6,40,18,0,0,TAU);x.fill();L.push([0,-6,40,.2]);}
  const snow=se==="winter",roof=(y,w,h,c)=>{x.fillStyle=shade(c,-.2);x.beginPath();x.moveTo(-w,y);x.lineTo(0,y-h);x.lineTo(0,y+w*.5-h*.2);x.closePath();x.fill();x.fillStyle=c;x.beginPath();x.moveTo(w,y);x.lineTo(0,y-h);x.lineTo(0,y+w*.5-h*.2);x.closePath();x.fill();
    x.fillStyle=shade(c,.1);x.beginPath();x.moveTo(-w,y);x.lineTo(0,y+w*.5-h*.2);x.lineTo(w,y);x.lineTo(0,y+w*.5);x.closePath();x.fill();if(snow){x.fillStyle="rgba(246,249,252,.92)";x.beginPath();x.moveTo(-w*.55,y-h*.45);x.lineTo(0,y-h);x.lineTo(w*.55,y-h*.45);x.closePath();x.fill();}};
  roof(-26,82,30,"#B5643C");if(lv>=2)roof(-54,50,26,"#C2703F");if(lv>=5)solar(x,-30,60);dot(x,0,lv>=2?-82:-58,3,"#E8C27A");
  if(lv>=3)for(const [px,py] of [[-70,2],[70,2],[0,38],[0,-34]]){x.strokeStyle="#4A3424";x.lineWidth=1.6;x.beginPath();x.moveTo(px,py);x.lineTo(px,py-16);x.stroke();dot(x,px,py-18,2.6,night?"#FFCF85":"#EFC46E");if(night)L.push([px,py-18,18,.22]);}}
function yoga(x,lv,night,L,se){
  /* the yoga shala: a raised square timber platform with stairs at the front. Level 2 is the platform, 3 adds corner
     posts and a shingled hip roof, 4 brings lush planters, 5 hangs lanterns and prayer flags */
  const P=(a,b)=>[a,b],T=[0,-30],Rr=[60,0],Bt=[0,30],Lf=[-60,0],up=(p,h)=>[p[0],p[1]-h],h=lv>=2?9:0,snow=se==="winter",TA=Math.PI*2;
  const poly=(pts,col)=>{x.fillStyle=col;x.beginPath();x.moveTo(...pts[0]);for(let k=1;k<pts.length;k++)x.lineTo(...pts[k]);x.closePath();x.fill();};
  shadow(x,4,6,62,26,.16);
  if(lv<2){["#7FB6A0","#D88A7A","#9C8FD0"].forEach((c,k)=>{x.save();x.translate(-20+k*20,-2+k*2);x.rotate(.46);x.fillStyle=c;x.fillRect(-11,-4,22,8);x.restore();});return;}
  const post=(p,top)=>{x.fillStyle="#5E3D26";x.fillRect(p[0]-2.2,p[1]-top,4.4,top);x.fillStyle="rgba(255,230,190,.18)";x.fillRect(p[0]-2.2,p[1]-top,1.4,top);};
  const roofH=lv>=3?40:0,inset=(p,k)=>[p[0]*k,p[1]*k];
  if(lv>=3){post(up(inset(T,.86),h),roofH);post(up(inset(Lf,.86),h),roofH);post(up(inset(Rr,.86),h),roofH);}
  poly([Lf,Bt,up(Bt,h),up(Lf,h)],night?"#5A3D25":"#8C6438");poly([Bt,Rr,up(Rr,h),up(Bt,h)],night?"#4A321F":"#74512F");
  poly([up(T,h),up(Rr,h),up(Bt,h),up(Lf,h)],night?"#8A6844":"#C29563");
  x.strokeStyle="rgba(70,42,20,.35)";x.lineWidth=1;for(let k=1;k<8;k++){const a=k/8,p1=[T[0]+(Lf[0]-T[0])*a,T[1]+(Lf[1]-T[1])*a],p2=[Rr[0]+(Bt[0]-Rr[0])*a,Rr[1]+(Bt[1]-Rr[1])*a];x.beginPath();x.moveTo(p1[0],p1[1]-h);x.lineTo(p2[0],p2[1]-h);x.stroke();}
  x.strokeStyle="rgba(255,236,200,.25)";x.beginPath();x.moveTo(...up(Lf,h));x.lineTo(...up(Bt,h));x.lineTo(...up(Rr,h));x.stroke();
  for(let k=0;k<3;k++){const w=26-k*2,y0=30-h+k*3+3,top=h-k*3;poly([[-w/2,y0+ (k*3)],[w/2,y0+(k*3)],[w/2,y0+k*3+3.2],[-w/2,y0+k*3+3.2]],k%2?"#9A6E44":"#B0804F");}
  if(lv>=3){["#7FB6A0","#D88A7A","#9C8FD0","#E8C27A"].forEach((c,k)=>{x.save();x.translate(-24+k*16,-h-6+k*4);x.rotate(.46);x.fillStyle=c;x.fillRect(-10,-3.5,20,7);x.restore();});
    post(up(inset(Bt,.86),h),roofH);
    const e=1.12,rT=up(inset(T,e),h+roofH),rL=up(inset(Lf,e),h+roofH),rR=up(inset(Rr,e),h+roofH),rB=up(inset(Bt,e),h+roofH),apex=[0,-h-roofH-26];
    poly([rL,rB,apex],snow?"#E8EEF4":night?"#5B3A28":"#9A5E3C");poly([rB,rR,apex],snow?"#D6DEE6":night?"#4A2F20":"#7E4A2E");
    x.strokeStyle=night?"rgba(0,0,0,.25)":"rgba(60,30,15,.28)";x.lineWidth=1;for(let k=1;k<6;k++){const a=k/6;x.beginPath();x.moveTo(rL[0]+(apex[0]-rL[0])*a,rL[1]+(apex[1]-rL[1])*a);x.lineTo(rB[0]+(apex[0]-rB[0])*a,rB[1]+(apex[1]-rB[1])*a);x.lineTo(rR[0]+(apex[0]-rR[0])*a,rR[1]+(apex[1]-rR[1])*a);x.stroke();}
    x.strokeStyle="#3E271A";x.lineWidth=2;x.beginPath();x.moveTo(...rL);x.lineTo(...rB);x.lineTo(...rR);x.stroke();dot(x,apex[0],apex[1]-2,3,"#D9B36A");}
  if(lv>=4){const pl=[[-66,4],[66,4],[-34,26],[34,26],[-50,-14],[50,-14]];pl.forEach(([px,py],k)=>{x.fillStyle="#8E5B3A";x.fillRect(px-5,py-6,10,7);for(let q=0;q<5;q++)dot(x,px+(q-2)*3,py-8-(q%2)*3,4,k%2?"#4F944A":"#67AE5A");if(k%2===0&&!snow)dot(x,px+2,py-12,2,"#F28BA8");});}
  if(lv>=5){const cs=[up(inset(Lf,1.05),h+roofH-4),up(inset(Bt,1.05),h+roofH-4),up(inset(Rr,1.05),h+roofH-4)];
    x.strokeStyle="#3B2A1C";x.lineWidth=.8;cs.forEach(c=>{x.beginPath();x.moveTo(c[0],c[1]);x.lineTo(c[0],c[1]+8);x.stroke();x.fillStyle=night?"#FFC86A":"#E8604C";x.beginPath();x.ellipse(c[0],c[1]+12,3.6,4.6,0,0,TA);x.fill();if(night)L.push([c[0],c[1]+12,26,.4]);});
    const fl=["#3E7BD9","#F4F4F4","#D9483E","#3FA85A","#F2C744"];for(let k=0;k<8;k++){const a=k/8,px=cs[0][0]+(cs[1][0]-cs[0][0])*a,py=cs[0][1]+(cs[1][1]-cs[0][1])*a+Math.sin(a*Math.PI)*6;x.fillStyle=fl[k%5];x.beginPath();x.moveTo(px-2.5,py);x.lineTo(px+2.5,py);x.lineTo(px,py+6);x.closePath();x.fill();}}
  if(lv>=3&&night)L.push([0,-h-10,44,.18]);}
function circle(x,lv,t,night,L){shadow(x,0,4,46,19,.14);if(lv>=4)deck(x,50);
  if(lv>=3){x.fillStyle="#E8743A";x.beginPath();x.ellipse(0,0,34,16,0,0,TAU);x.fill();x.fillStyle="#7A5A40";x.beginPath();x.ellipse(0,0,24,11,0,0,TAU);x.fill();}
  else for(let i=0;i<8;i++){const a=i/8*TAU;x.fillStyle=lv>=2?(i%2?"#9A968E":"#AAA69C"):"#7A4E30";x.beginPath();x.ellipse(Math.cos(a)*36,Math.sin(a)*17-3,lv>=2?7:9,lv>=2?4.5:3.4,0,0,TAU);x.fill();}
  dot(x,0,0,9,"#6B655E");x.fillStyle="#F5902A";x.beginPath();x.moveTo(-5,0);x.quadraticCurveTo(0,-14-Math.sin(t*.01)*2,5,0);x.closePath();x.fill();L.push([0,-6,night?40:16,night?.26:.08]);
  if(lv>=4)for(const [px,py] of [[-40,-16],[42,-10],[30,20]]){x.fillStyle="#8C6240";x.beginPath();x.ellipse(px,py,7,3.5,0,0,TAU);x.fill();}
  if(lv>=5){const pts=[[-48,4],[0,-22],[48,4],[0,26]];pts.forEach(p=>{x.strokeStyle="#5A3A22";x.lineWidth=2;x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(p[0],p[1]-30);x.stroke();});
    for(let i=0;i<4;i++){const a=pts[i],b=pts[(i+1)%4];for(let k=1;k<5;k++){const u=k/5,px=a[0]+(b[0]-a[0])*u,py=a[1]-30+(b[1]-a[1])*u+Math.sin(u*Math.PI)*7;dot(x,px,py,1.8,night?"#FFD99E":"#F3D48E");if(night)L.push([px,py,7,.16]);}}}}
function zen(x,c,r,lv,se){const m=A.P(c+1,r+1);x.fillStyle=se==="winter"?"#F1F4F7":"#E4DACB";x.beginPath();x.ellipse(m[0],m[1],56,28,0,0,TAU);x.fill();
  if(lv>=2){x.strokeStyle="rgba(150,135,110,.55)";x.lineWidth=1;for(let k=1;k<5;k++){x.beginPath();x.ellipse(m[0]-14,m[1]-2,k*6,k*3,0,0,TAU);x.stroke();}for(let k=-3;k<=3;k++){x.beginPath();x.moveTo(m[0]+8+k*2,m[1]-20+k*6);x.lineTo(m[0]+46+k*2,m[1]-2+k*6);x.stroke();}}
  [[-14,-2,9],[18,6,6],[30,-8,5]].forEach(([dx,dy,s])=>{x.fillStyle="#8E8A82";x.beginPath();x.ellipse(m[0]+dx,m[1]+dy-s*.4,s,s*.7,0,0,TAU);x.fill();if(lv>=3){x.fillStyle=se==="winter"?"#F6F9FB":"#6E9E52";x.beginPath();x.ellipse(m[0]+dx-s*.3,m[1]+dy-s*.9,s*.5,s*.25,0,0,TAU);x.fill();}});
  if(lv>=4){x.fillStyle="#9C978E";x.fillRect(m[0]-40,m[1]-14,8,12);x.fillRect(m[0]-43,m[1]-18,14,4);dot(x,m[0]-36,m[1]-10,2,"#F5D08A");}
  if(lv>=5){x.fillStyle="#8E8A82";x.beginPath();x.ellipse(m[0]+40,m[1]+12,9,4.5,0,0,TAU);x.fill();x.fillStyle="#6DB8DC";x.beginPath();x.ellipse(m[0]+40,m[1]+11,6,3,0,0,TAU);x.fill();}}
/* a round reflection pool; the corners of its footprint stay grass, but count as used */
function pool(x,c,r,lv,ph,se){const m=A.P(c+1,r+1),col=ph==="night"?"#2E5C86":se==="winter"?"#9CC6DE":"#6DB8DC";
  if(lv>=3){x.fillStyle=se==="winter"?"#F1F4F7":"#E4DACB";x.beginPath();x.ellipse(m[0],m[1],60,30,0,0,TAU);x.fill();x.strokeStyle="rgba(150,135,110,.5)";x.lineWidth=1;for(let k=0;k<3;k++){x.beginPath();x.ellipse(m[0],m[1],56-k*3,28-k*1.5,0,0,TAU);x.stroke();}}
  x.fillStyle="#B8B1A3";x.beginPath();x.ellipse(m[0],m[1],47,23.5,0,0,TAU);x.fill();
  const g=x.createRadialGradient(m[0]-10,m[1]-6,4,m[0],m[1],44);g.addColorStop(0,shade(col,.28));g.addColorStop(1,col);x.fillStyle=g;x.beginPath();x.ellipse(m[0],m[1],41,20.5,0,0,TAU);x.fill();
  x.strokeStyle="rgba(255,255,255,.45)";x.lineWidth=1.2;x.beginPath();x.ellipse(m[0],m[1],26,11,0,Math.PI*1.1,Math.PI*1.6);x.stroke();
  if(lv>=2){[[-18,5],[14,-6],[22,8]].forEach(([dx,dy],i)=>{x.fillStyle="#4E9A52";x.beginPath();x.ellipse(m[0]+dx,m[1]+dy,5.5,2.8,0,0,TAU);x.fill();if(i!==1)dot(x,m[0]+dx+1,m[1]+dy-2,2,"#F6B8CF");});
    for(let i=0;i<4;i++){x.fillStyle="#C9C2B4";x.beginPath();x.ellipse(m[0]-38+i*9,m[1]+14-i*5,4,2,0,0,TAU);x.fill();}}
  if(lv>=4){x.fillStyle="#9C978E";x.fillRect(m[0]+44,m[1]-18,7,13);x.fillRect(m[0]+41,m[1]-22,13,4);dot(x,m[0]+47.5,m[1]-12,2,"#F5D08A");x.strokeStyle="#6E9E52";x.lineWidth=1.4;for(let i=0;i<5;i++){x.beginPath();x.moveTo(m[0]-44+i*3,m[1]-2);x.lineTo(m[0]-46+i*3,m[1]-14);x.stroke();}}
  if(lv>=5){x.fillStyle="#B58A5C";x.beginPath();x.ellipse(m[0],m[1]+24,26,6,0,0,Math.PI);x.fill();if(ph!=="day"){x.fillStyle="rgba(255,224,160,.35)";x.beginPath();x.ellipse(m[0],m[1],30,14,0,0,TAU);x.fill();}}}
/* draw any village building at its level, from the centre of its footprint */
/* 3.0: the large buildings are drawn 25% bigger: their art, light positions and boxes scale together */
const BIG={hall:1,ashram:1,library:1,yoga:1},BS=1.25;
function draw(x,kind,lv,night,L,se,t){if(!BIG[kind])return draw0(x,kind,lv,night,L,se,t);const n0=L?L.length:0;x.save();x.scale(BS,BS);const r=draw0(x,kind,lv,night,L,se,t);x.restore();
  if(L)for(let k=n0;k<L.length;k++){const l=L[k];L[k]=[l[0]*BS,l[1]*BS,l[2]*BS,l[3]];}return r;}
function draw0(x,kind,lv,night,L,se,t){lv=Math.max(1,Math.min(5,lv||1));if(ROUND[kind])return round(x,ROUND[kind][lv-1],night,L,se);
  if(kind==="ashram"){ashram(x,lv,night,L,se);return ashramDetail(x,lv,night,L,se);}if(kind==="yoga")return yoga(x,lv,night,L,se);if(kind==="circle"){circle(x,lv,t||0,night,L);return circleDetail(x,lv,night,L,se);}}
/* each box covers everything that building draws at any level, season or time of day, with a 4px margin
   (measured in 2.6: the hall, library, home and pod drew below their old boxes, which sliced their bases flat) */
const BOX={home:[-60,-90,61,37],pod:[-25,-40,30,21],library:[-78,-120,79,47],hall:[-85,-112,86,51],ashram:[-86,-112,86,44],yoga:[-76,-112,76,54],circle:[-56,-56,56,35]};
for(const k in BIG)BOX[k]=BOX[k].map(v=>Math.round(v*BS));
return {NAMES,draw,zen,pool,BOX,MAX:5};
})();
