"use strict";
/* ================= EMBERVALE ART (2.5D) =================
   How everything in the valley looks: sky, mountains, ground, water, and each thing that grows or gets built.
   Tiles are 64 x 32 (a 2:1 angled view). Seasons follow the Australian calendar. */
const EVA=(()=>{
const TW=64,TH=32,TAU=7;
const P=(c,r)=>[(c-r)*TW/2,(c+r)*TH/2];
const SEAS={
  summer:{grass:["#7DB45F","#88BE66"],leaf:["#3F8F45","#57A64B","#77BD5A"],path:"#E3D9C6",soil:"#8A5E3C"},
  autumn:{grass:["#A2B464","#AEBE6C"],leaf:["#D9772B","#E8A13A","#C4552A"],path:"#DDD0B8",soil:"#83583A",fall:["#D9772B","#E8A13A"]},
  winter:{grass:["#EAF0F5","#F4F7FA"],leaf:["#5E7F66","#6C8C70","#55765E"],path:"#D9D0C3",soil:"#8B7A6A",bare:true,frost:true,snow:true},
  spring:{grass:["#8DC86E","#98D078"],leaf:["#7CC765","#99D67A","#5FAF52"],path:"#E6DCC8",soil:"#8A5E3C",blossom:["#F6B8CF","#FFFFFF","#F9D1E0"]}};
const SKY={day:{summer:["#74BCE8","#D3ECF5"],autumn:["#88B4D6","#EEDFC6"],winter:["#A9CBE6","#EEF4F8"],spring:["#82C5E7","#DFF1EE"]},dusk:["#2E3262","#F2A35E"],night:["#081226","#1B2A4C"],dawn:["#56689F","#F5C29E"]};
const EVERGREEN=["#6E9A72","#7FAE80","#5C8A63"];
function seasonKey(d){const m=(d||new Date()).getMonth();return [11,0,1].includes(m)?"summer":[2,3,4].includes(m)?"autumn":[5,6,7].includes(m)?"winter":"spring";}
function phaseOf(d){d=d||new Date();const h=d.getHours()+d.getMinutes()/60;return h>=20||h<5?"night":h<7?"dawn":h<17.5?"day":"dusk";}
function rnd(seed){let s=(seed*2654435761)>>>0||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
function shade(h,a){const n=parseInt(h.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const t=a<0?0:255,p=Math.abs(a);r=Math.round((t-r)*p+r);g=Math.round((t-g)*p+g);b=Math.round((t-b)*p+b);return "#"+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);}
function poly(x,pts,fill){x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.fillStyle=fill;x.fill();}
function shadow(x,cx,cy,rx,ry,a){x.fillStyle=`rgba(18,28,18,${a||.18})`;x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,TAU);x.fill();}
function dot(x,cx,cy,r,col){x.fillStyle=col;x.beginPath();x.arc(cx,cy,r,0,TAU);x.fill();}
const tileCenter=(c,r)=>P(c+.5,r+.5);
function diamond(c,r,k){const m=tileCenter(c,r),hw=TW/2*(k||1),hh=TH/2*(k||1);return [[m[0],m[1]-hh],[m[0]+hw,m[1]],[m[0],m[1]+hh],[m[0]-hw,m[1]]];}
/* everything tile-shaped is drawn in "tile space" through this transform, so shapes line up with the grid */
const tileSpace=x=>x.transform(TW/2,TH/2,-TW/2,TH/2,0,0);

/* ---------- sky and the mountains behind the valley (screen space) ---------- */
function cloud(x,cx,cy,s,ph){x.fillStyle=ph==="night"?"rgba(180,190,220,.16)":ph==="dusk"?"rgba(255,222,204,.78)":"rgba(255,255,255,.92)";
  [[0,0,1],[.85,.18,.74],[-.85,.22,.7],[.35,-.36,.72]].forEach(([dx,dy,k])=>{x.beginPath();x.ellipse(cx+dx*s,cy+dy*s,s*k,s*k*.6,0,0,TAU);x.fill();});}
function sky(x,W,H,se,ph,lv,t,noMoon,hy){
  const c=ph==="day"?SKY.day[se]:SKY[ph],g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,c[0]);g.addColorStop(1,c[1]);x.fillStyle=g;x.fillRect(0,0,W,H);
  const dark=ph==="night"?1:ph==="day"?.16:.6,R=rnd(7);
  aurora(x,W,H,t,lv.space>=5?(ph==="night"?1:ph==="dusk"?.45:0):0);
  {const n=lv.space>=3?80:lv.space>=1?26:14;/* a few stars from the start; space practice brings more */for(let i=0;i<n;i++){const s=R()*1.5+.4;x.fillStyle=`rgba(255,255,255,${(.25+R()*.65)*dark})`;x.fillRect(R()*W,R()*H*.42,s,s);}}
  if(lv.space>=5){x.save();x.globalAlpha=.22*dark+.02;const mg=x.createLinearGradient(0,0,W,H*.4);mg.addColorStop(0,"rgba(210,200,255,0)");mg.addColorStop(.5,"rgba(225,215,255,.95)");mg.addColorStop(1,"rgba(210,200,255,0)");x.fillStyle=mg;x.beginPath();x.ellipse(W*.5,H*.19,W*.62,H*.055,-.28,0,TAU);x.fill();x.restore();}
  if(lv.space>=6&&ph!=="day"){x.save();for(let i=0;i<3;i++){x.globalAlpha=.15*dark;const ag=x.createLinearGradient(0,H*.04,0,H*.34);ag.addColorStop(0,"rgba(110,255,190,0)");ag.addColorStop(.6,i%2?"rgba(160,120,255,.9)":"rgba(110,255,190,.9)");ag.addColorStop(1,"rgba(110,255,190,0)");x.fillStyle=ag;x.beginPath();x.moveTo(0,H*.34);for(let k=0;k<=10;k++)x.lineTo(W*k/10,H*(.09+.045*Math.sin(k*1.2+i*1.7+t*.0004))+i*9);x.lineTo(W,H*.34);x.fill();}x.restore();}
  if(lv.space>=2&&!noMoon){const mx=W*.82,my=H*.11,mr=Math.max(8,Math.min(W,H)*.032);x.save();x.globalAlpha=ph==="day"?.6:1;
    const mg=x.createRadialGradient(mx,my,0,mx,my,mr*3.2);mg.addColorStop(0,`rgba(255,245,220,${.3*dark+.05})`);mg.addColorStop(1,"rgba(255,245,220,0)");x.fillStyle=mg;x.beginPath();x.arc(mx,my,mr*3.2,0,TAU);x.fill();
    dot(x,mx,my,mr,"#FFF4DA");x.globalAlpha=ph==="day"?.5:.95;dot(x,mx+mr*.42,my-mr*.22,mr*.88,c[0]);x.restore();}
  if(lv.space>=3){const pts=[[.16,.09],[.19,.2],[.12,.15],[.24,.135],[.2,.24]].map(p=>[W*p[0],H*p[1]]);x.strokeStyle=`rgba(255,255,255,${.28*dark+.04})`;x.lineWidth=1;x.beginPath();x.moveTo(...pts[0]);x.lineTo(...pts[1]);x.moveTo(...pts[2]);x.lineTo(...pts[3]);x.stroke();pts.forEach(p=>dot(x,p[0],p[1],1.7,`rgba(255,255,255,${.8*dark+.15})`));}
  if(lv.space>=4&&ph!=="day"){const k=(t*.00022)%1;if(k<.22){const sx=W*(.25+k*2.6),sy=H*(.05+k*.5),sg=x.createLinearGradient(sx,sy,sx-70,sy-26);sg.addColorStop(0,"rgba(255,255,255,.95)");sg.addColorStop(1,"rgba(255,255,255,0)");x.strokeStyle=sg;x.lineWidth=2;x.beginPath();x.moveTo(sx,sy);x.lineTo(sx-70,sy-26);x.stroke();}}
  /* 3.0.9: the rainbow keeps its size but its feet sit on the world's horizon (hy, just below the far ridge),
     so the mountains always cover its ends, wherever you pan or zoom; without hy (pictures) it sits as before */
  if(lv.air>=6){const fy=hy!=null?hy:H*.62+W*.086,r=Math.max(60,Math.min(W*.46,fy-H*.05));x.save();x.globalAlpha=ph==="night"?.1:.28;["#FF6B6B","#FFB86B","#FFE56B","#7BE07B","#6BB8FF","#9B7BFF"].forEach((col,i)=>{x.strokeStyle=col;x.lineWidth=Math.max(3,W*.009);x.beginPath();x.arc(W*.5,fy,r-i*W*.0095,Math.PI,Math.PI*2);x.stroke();});x.restore();}
  const wx=window.EKWX&&EKWX.on?EKWX.state:null;if(wx==="cloudy"||wx==="rain"||wx==="snow"){x.fillStyle=wx==="rain"?"rgba(84,96,114,.42)":wx==="snow"?"rgba(205,212,224,.34)":"rgba(128,138,154,.3)";x.fillRect(0,0,W,H*.62);}
  const nc=wx==="cloudy"||wx==="rain"||wx==="snow"?7:lv.air>=2?5:lv.air>=1?3:2;/* 2.7.3: a few clouds in every sky; sky practice brings more */for(let i=0;i<nc;i++){const cx=((i*W*.33+t*.006*(i%2?1:.65))%(W*1.3))-W*.15;cloud(x,cx,H*(.07+i*.055),Math.max(16,W*.045)*(1+(i%2)*.35),ph);}
  if(lv.air>=3)for(let i=0;i<3;i++){const bx=((t*.025+i*55)%(W+80))-40,by=H*.2+Math.sin(t*.002+i)*6+i*11;x.strokeStyle=ph==="night"?"rgba(220,220,240,.45)":"rgba(40,50,70,.5)";x.lineWidth=1.4;x.beginPath();x.moveTo(bx-6,by-3);x.quadraticCurveTo(bx-3,by-5,bx,by);x.quadraticCurveTo(bx+3,by-5,bx+6,by-3);x.stroke();}}
function mountains(x,W,base,se,ph,par){const cols=ph==="night"?["#1A2442","#121A33"]:ph==="dusk"?["#5D4C72","#4A3D5E"]:ph==="dawn"?["#7D80A8","#676F92"]:se==="winter"?["#A4B4C6","#8A9DB0"]:["#93ABBE","#78968E"];
  cols.forEach((col,li)=>{const f=li?.011:.006,h=li?44:70,p=par*(li?.35:.18);x.fillStyle=col;x.beginPath();x.moveTo(-10,base+60);
    for(let px=-10;px<=W+20;px+=12){const n=Math.sin((px-p)*f+li*3.1)*.55+Math.sin((px-p)*f*2.7+1.7+li)*.3+Math.sin((px-p)*f*6.1+li*5)*.15;x.lineTo(px,base-h*(.55+n*.45)-(li?0:18));}
    x.lineTo(W+20,base+60);x.closePath();x.fill();});}
/* the land beyond the valley: rolling hills, then distant hills, then broad snow-capped mountains, then great
   Himalaya-like massifs along the horizon, each layer rising higher, with open sky above */
const LAND={day:{far:"#AFC0D3",mid:"#8A9DAE",hill2:"#6F8E80",snow:"#F5F8FB"},dawn:{far:"#B9AFC8",mid:"#9188A6",hill2:"#76808A",snow:"#F7EEF2"},dusk:{far:"#8E7B9C",mid:"#6E5F80",hill2:"#56596A",snow:"#E9DCE6"},night:{far:"#2B3653",mid:"#222C45",hill2:"#1C2A33",snow:"#B9C6DA"}};
function ridge(x0,x1,step,base,hf){const pts=[];for(let px=x0;px<=x1;px+=step)pts.push([px,base(px)-hf(px)]);return pts;}
/* one mountain layer: lit on the left of each peak, one broad shaded face on the right running down into the
   next valley, and a snow cap only on the high summits, with a craggy lower edge */
function massif(x,pts,bottom,col,snowCol,snowFrom,shadeAmt){const n=pts.length;
  x.fillStyle=col;x.beginPath();x.moveTo(pts[0][0],bottom(pts[0][0]));pts.forEach(p=>x.lineTo(p[0],p[1]));for(let k=n-1;k>=0;k--)x.lineTo(pts[k][0],bottom(pts[k][0]));x.closePath();x.fill();x.save();x.clip();/* 3.0.6: shading and snow never spill outside the hill */
  const peaks=[],vals=[];for(let i=1;i<n-1;i++){if(pts[i][1]<pts[i-1][1]&&pts[i][1]<=pts[i+1][1])peaks.push(i);if(pts[i][1]>pts[i-1][1]&&pts[i][1]>=pts[i+1][1])vals.push(i);}
  x.fillStyle=shade(col,-shadeAmt);
  for(const pi of peaks){const vi=vals.find(v=>v>pi)||n-1,pk=pts[pi],vl=pts[vi],by=bottom(pk[0]);x.beginPath();x.moveTo(pk[0],pk[1]);for(let k=pi+1;k<=vi;k++)x.lineTo(pts[k][0],pts[k][1]);
    x.lineTo(vl[0]-(vl[0]-pk[0])*.15,Math.min(by,vl[1]+(by-vl[1])*.9));x.lineTo(pk[0]+(vl[0]-pk[0])*.35,by);x.closePath();x.fill();}
  if(!snowCol){x.restore();return;}x.fillStyle=snowCol;
  for(const pi of peaks){const pk=pts[pi],cap=(snowFrom-pk[1])*.38;if(cap<=6)continue;const lim=pk[1]+cap;let a=pi,b=pi;while(a>0&&pts[a-1][1]<lim&&pk[0]-pts[a-1][0]<70)a--;while(b<n-1&&pts[b+1][1]<lim&&pts[b+1][0]-pk[0]<70)b++;
    x.beginPath();x.moveTo(pts[a][0],pts[a][1]);for(let k=a+1;k<=b;k++)x.lineTo(pts[k][0],pts[k][1]);
    const steps=Math.max(3,Math.round((pts[b][0]-pts[a][0])/18));for(let k=steps;k>=0;k--){const xx=pts[a][0]+(pts[b][0]-pts[a][0])*k/steps;x.lineTo(xx,lim+Math.sin(k*1.9)*cap*.12-Math.abs(xx-pk[0])*.04);}
    x.closePath();x.fill();}x.restore();}
/* 3.0.6: the far range's snowy crest rolls along its whole top, with little igloos, Everest-style camps (tents and
   prayer flags) and snowy pines dotted along the slopes; camps glow faintly at night */
/* 3.0.7: a deep, rounded snow mantle on the far range, lit white on the sunny faces and blue-grey on the shaded ones,
   with couloirs running down from the summits; little igloos and Everest-style camps sit in the snow on small ledges */
function snowline(x,pts,W,ph){const night=ph==="night"||ph==="dusk",TA=Math.PI*2,n=pts.length,dx=pts[1][0]-pts[0][0];
  const yAt=px=>{const f=(px-pts[0][0])/dx,i=Math.max(0,Math.min(n-2,Math.floor(f))),u=f-i;return pts[i][1]*(1-u)+pts[i+1][1]*u;};
  const D=px=>44+18*Math.sin(px*.006+.7)+10*Math.sin(px*.017+1.3)+5*Math.sin(px*.041),low=(p,k)=>p[1]+D(p[0])+3*Math.sin(k*1.3);
  const mantle=()=>{x.beginPath();x.moveTo(pts[0][0],pts[0][1]);for(const p of pts)x.lineTo(p[0],p[1]);for(let k=n-1;k>=0;k--)x.lineTo(pts[k][0],low(pts[k],k));x.closePath();};
  x.save();x.fillStyle=night?"#D5DCEA":"#FBFDFF";mantle();x.fill();
  x.save();mantle();x.clip();const peaks=[];for(let i=1;i<n-1;i++)if(pts[i][1]<pts[i-1][1]&&pts[i][1]<=pts[i+1][1])peaks.push(i);
  for(const pi of peaks){let vi=pi+1;while(vi<n-1&&pts[vi+1][1]>=pts[vi][1])vi++;const pk=pts[pi],vl=pts[vi];
    const g=x.createLinearGradient(pk[0],0,vl[0],0);g.addColorStop(0,night?"#9AA7C0":"#CDD8E8");g.addColorStop(1,night?"#7F8CA8":"#B4C3D9");x.fillStyle=g;
    x.beginPath();x.moveTo(pk[0],pk[1]);for(let k=pi+1;k<=vi;k++)x.lineTo(pts[k][0],pts[k][1]);x.lineTo(vl[0],vl[1]+D(vl[0])+8);x.lineTo(pk[0]+(vl[0]-pk[0])*.2,pk[1]+D(pk[0])+12);x.closePath();x.fill();
    x.strokeStyle=night?"rgba(105,120,152,.55)":"rgba(160,178,204,.8)";x.lineWidth=1;for(let k=1;k<=3;k++){const sx=pk[0]-k*10,sy=yAt(sx)+3;x.beginPath();x.moveTo(sx,sy);x.quadraticCurveTo(sx-4,sy+D(sx)*.4,sx-1,sy+D(sx)*.8);x.stroke();}
    x.fillStyle=night?"rgba(255,255,255,.18)":"rgba(255,255,255,.75)";x.beginPath();x.ellipse(pk[0]-8,pk[1]+7,9,3,-.3,0,TA);x.fill();}
  x.restore();x.strokeStyle=night?"rgba(120,135,165,.55)":"rgba(160,180,206,.75)";x.lineWidth=1.1;x.beginPath();for(let k=0;k<n;k++){const y=low(pts[k],k);k?x.lineTo(pts[k][0],y):x.moveTo(pts[k][0],y);}x.stroke();
  const h=v=>{const q=Math.sin(v*127.1+311.7)*43758.5453;return q-Math.floor(q);};
  for(let px=-W+40;px<W-40;px+=56){const r=h(px);if(r>.44)continue;const y=yAt(px)+D(px)*(.42+h(px+3)*.26);x.save();x.translate(px,y);x.scale(1.3,1.3);
    x.fillStyle=night?"rgba(60,70,98,.32)":"rgba(122,142,172,.3)";x.beginPath();x.ellipse(1,1.2,14,3.2,0,0,TA);x.fill();
    if(r<.18){x.fillStyle=night?"#DCE3F0":"#FFFFFF";x.beginPath();x.ellipse(0,0,8.5,7,0,Math.PI,TA);x.closePath();x.fill();x.strokeStyle=night?"rgba(110,125,160,.75)":"rgba(140,160,190,.85)";x.lineWidth=.8;
      x.beginPath();x.ellipse(0,0,8.5,7,0,Math.PI,TA);x.stroke();x.beginPath();x.moveTo(-7.6,-3);x.lineTo(7.6,-3);x.moveTo(-3,-6.3);x.lineTo(-3,-3);x.moveTo(3.4,-3);x.lineTo(3.4,0);x.stroke();
      x.fillStyle=night?"#E8EEF7":"#F2F6FB";x.beginPath();x.ellipse(7.6,0,3.4,3,0,Math.PI,TA);x.fill();x.fillStyle=night?"#FFC86A":"#3E4A5E";x.beginPath();x.ellipse(9,0,1.6,2,0,Math.PI,TA);x.fill();}
    else{const tc=["#E8603C","#F2B63A","#3E8FD9","#D94848"];for(let k=0;k<3;k++){const tx=-8+k*8,ty=(k%2)*1.5;x.fillStyle=tc[(k+Math.floor(r*40))%4];x.beginPath();x.moveTo(tx-4.4,ty);x.lineTo(tx+4.4,ty);x.lineTo(tx,ty-6.6);x.closePath();x.fill();
        x.fillStyle="rgba(0,0,0,.18)";x.beginPath();x.moveTo(tx,ty-6.6);x.lineTo(tx+4.4,ty);x.lineTo(tx,ty);x.closePath();x.fill();
        if(night){const g=x.createRadialGradient(tx,ty-2,0,tx,ty-2,8);g.addColorStop(0,"rgba(255,200,110,.6)");g.addColorStop(1,"rgba(255,200,110,0)");x.fillStyle=g;x.beginPath();x.arc(tx,ty-2,8,0,TA);x.fill();}}
      x.strokeStyle="rgba(70,60,50,.6)";x.lineWidth=.5;x.beginPath();x.moveTo(-13,-11);x.lineTo(-13,0);x.moveTo(13,-11);x.lineTo(13,0);x.moveTo(-13,-10);x.quadraticCurveTo(0,-5,13,-10);x.stroke();
      ["#3E8FD9","#F4F1E8","#D94848","#3FA85A","#F2C744"].forEach((cl,k)=>{const u=(k+.5)/5,fx=-13+26*u,fy=-10+Math.sin(u*Math.PI)*4.5;x.fillStyle=cl;x.fillRect(fx-1,fy,2,2.6);});}
    x.restore();}
  x.restore();}
function landscape(x,N,se,ph){const S=SEAS[se],c=LAND[ph]||LAND.day,w=N*32,W=w*3.2,edge=px=>Math.abs(px)/2,snowy=!!S.snow;
  const hill=snowy?(ph==="night"?"#8E9BB0":"#E6ECF2"):ph==="night"?"#1E2E26":shade(S.grass[0],ph==="dusk"?-.32:-.16),hillB=snowy?shade(hill,-.06):shade(hill,-.1);
  /* 3.0: distant mountains, low and wide with rounded snowy tops so the sky stays open; in front, terraced rolling
     foothills with tree clusters fill the land between (nothing shows through), and the side ranges are green hills */
  const farR=ridge(-W,W,10,px=>HZ+20,px=>150+34*Math.sin(px*.0011+1)+54*Math.sin(px*.0078+.4)+16*Math.sin(px*.019+2.1));
  massif(x,farR,px=>HZ+150,c.far,null,0,.04);snowline(x,farR,W,ph);
  /* mist drifting between the distant mountains and the foothills */
  {const mc=ph==="night"?"rgba(150,165,190,":"rgba(255,255,255,";for(const [y,hh,a] of [[HZ+126,34,.34],[HZ+146,26,.22]]){const g=x.createLinearGradient(0,y-hh,0,y+hh);g.addColorStop(0,mc+"0)");g.addColorStop(.5,mc+a+")");g.addColorStop(1,mc+"0)");x.fillStyle=g;x.fillRect(-W,y-hh,2*W,hh*2);}}
  {const bf=px=>HZ+150-(26+14*Math.sin(px*.0037+.5)+9*Math.sin(px*.0091+1.3));massif(x,ridge(-W,W,10,px=>HZ+150,px=>HZ+150-bf(px)),px=>Math.max(HZ+150,edge(px)+4),snowy?shade(hill,-.08):shade(hill,-.12),null,0,.05);
    if(!snowy){x.save();x.lineWidth=2;for(let k=1;k<=4;k++){x.strokeStyle=ph==="night"?"rgba(255,255,255,.035)":"rgba(255,255,255,.08)";x.beginPath();for(let px=-W;px<=W;px+=14){const y=bf(px)+k*9+4*Math.sin(px*.01+k);px===-W?x.moveTo(px,y):x.lineTo(px,y);}x.stroke();}
      x.fillStyle=shade(hill,-.24);for(let px=-W;px<=W;px+=34){if(((px/34|0)*7)%5>1)continue;const y=bf(px)+6;x.beginPath();x.ellipse(px,y,8,10,0,0,TAU);x.ellipse(px+9,y+3,6,8,0,0,TAU);x.fill();}x.restore();}}
  massif(x,ridge(-W,W,10,px=>Math.max(HZ+60,edge(px)*.45-170),px=>72+26*Math.sin(px*.0021+.6)+16*Math.sin(px*.0052+2)+6*Math.sin(px*.013)),px=>edge(px)+4,snowy?shade(hill,-.05):shade(hill,-.06),null,0,.06);
  massif(x,ridge(-W,W,26,px=>edge(px)*.75-70,px=>95+38*Math.sin(px*.0045+1.7)+22*Math.sin(px*.011)),px=>edge(px)+4,snowy?shade(hill,-.04):shade(hill,-.03),null,0,.08);
  massif(x,ridge(-W,W,22,px=>edge(px)-8,px=>48+22*Math.sin(px*.0072+.3)+12*Math.sin(px*.019+1)),px=>edge(px)+4,hill,null,0,.06);
  /* a few dark trees along the near hills, so they read as land rather than paper */
  if(!snowy){x.fillStyle=hillB;for(let px=-W;px<=W;px+=46){const yb=edge(px)-8-(48+22*Math.sin(px*.0072+.3)+12*Math.sin(px*.019+1))*.55;if((px/46|0)%3===0)continue;x.beginPath();x.ellipse(px+(px%17),yb+10,9,13,0,0,TAU);x.fill();}}}
/* the green and violet curtains of an aurora, drifting across the night sky (earned through deep Space practice) */
function aurora(x,W,H,t,k){if(k<=0)return;x.save();x.globalCompositeOperation="lighter";
  [["80,255,170",0,.34,.06],["110,200,255",1.1,.22,.11],["190,120,255",2.3,.2,.15]].forEach(([col,p0,amp,y0f])=>{const len=H*(.17+y0f*.3);
    for(let px=-8;px<W+8;px+=7){const top=H*y0f+Math.sin(px*.008+t*.00032+p0)*H*.035+Math.sin(px*.021-t*.00055+p0*2)*H*.014,fl=.5+.5*Math.sin(px*.047+t*.0018+p0*3);
      const g=x.createLinearGradient(0,top,0,top+len);g.addColorStop(0,`rgba(${col},0)`);g.addColorStop(.22,`rgba(${col},${(amp*k*fl).toFixed(3)})`);g.addColorStop(1,`rgba(${col},0)`);x.fillStyle=g;x.fillRect(px,top,7,len);}});
  x.restore();}
/* everything beyond the mountains and past the near edges fades into soft cloud, so the world never ends in a void */
const CLOUD={night:"14,22,42",dusk:"228,206,206",dawn:"232,214,222",day:"244,247,250"};
/* lantern paths: soft grass with flat stepping stones, and a small lantern on every other tile that glows at night */
function lpath(x,tiles,se,ph,L){const night=ph==="night"||ph==="dusk",snow=se==="winter";
  for(const [c,r] of tiles){const m=tileCenter(c,r),R=rnd(c*53+r*29);x.fillStyle=snow?"rgba(255,255,255,.35)":"rgba(120,170,90,.35)";x.beginPath();x.ellipse(m[0],m[1],24,11,0,0,TAU);x.fill();
    for(let k=0;k<2;k++){const sx=m[0]+(R()-.5)*16,sy=m[1]+(R()-.5)*6;x.fillStyle="#CFC6B4";x.beginPath();x.ellipse(sx,sy,7,3.4,R()*.6,0,TAU);x.fill();x.fillStyle="rgba(0,0,0,.12)";x.beginPath();x.ellipse(sx+1,sy+1.4,7,3.2,0,0,Math.PI);x.fill();}
    if((c+r)%2===0){const lx=m[0]+12,ly=m[1]-3;x.strokeStyle="#3C2E24";x.lineWidth=1.6;x.beginPath();x.moveTo(lx,ly);x.lineTo(lx,ly-14);x.stroke();
      dot(x,lx,ly-16,2.6,night?"#FFD58A":"#E9C98C");if(night&&L)L.push([lx,ly-16,22,.28]);}}}
/* zen path: flat dark stones set in soft moss, tiny pebbles, and small stone lanterns placed by the world (zlan) */
function zpath(x,tiles,se,ph,L,lan){const night=ph==="night",snow=se==="winter",set=new Set(tiles.map(t=>t[0]+","+t[1]));
  const moss=snow?["#DCE3E6","#C9D2D6"]:night?["#21402A","#2C5234"]:["#3F6E3A","#4F8A47"],stone=night?["#45484D","#55595F"]:["#5A5E64","#757A81"];
  x.save();x.lineCap="round";x.lineJoin="round";x.strokeStyle=moss[0];x.lineWidth=25;x.beginPath();
  for(const [c,r] of tiles){const m=tileCenter(c,r);x.moveTo(m[0]-.1,m[1]);x.lineTo(m[0]+.1,m[1]);for(const [a,b] of [[1,0],[0,1]])if(set.has((c+a)+","+(r+b))){const q=tileCenter(c+a,r+b);x.moveTo(m[0],m[1]);x.lineTo(q[0],q[1]);}}x.stroke();
  for(const [c,r] of tiles){const m=tileCenter(c,r),R=rnd(c*53+r*31);for(let i=0;i<10;i++){const px=m[0]+(R()-.5)*30,py=m[1]+(R()-.5)*14,rr=3+R()*4;x.fillStyle=R()>.5?moss[1]:shade(moss[0],.1);x.beginPath();x.ellipse(px,py,rr,rr*.6,0,0,TAU);x.fill();}}
  for(const [c,r] of tiles){const m=tileCenter(c,r),R=rnd(c*17+r*71);
    for(const [dx,dy,rx,ry] of [[(R()-.5)*8-6,(R()-.5)*3-2,9,5],[(R()-.5)*8+7,(R()-.5)*3+3,7.5,4.2]]){x.fillStyle="rgba(20,22,24,.35)";x.beginPath();x.ellipse(m[0]+dx+1,m[1]+dy+1.6,rx,ry,0,0,TAU);x.fill();
      const g=x.createLinearGradient(0,m[1]+dy-ry,0,m[1]+dy+ry);g.addColorStop(0,stone[1]);g.addColorStop(1,stone[0]);x.fillStyle=snow?"#C7CCD1":g;x.beginPath();x.ellipse(m[0]+dx,m[1]+dy,rx,ry,(R()-.5)*.4,0,TAU);x.fill();
      x.fillStyle="rgba(255,255,255,.14)";x.beginPath();x.ellipse(m[0]+dx-rx*.25,m[1]+dy-ry*.35,rx*.45,ry*.3,0,0,TAU);x.fill();}
    for(let i=0;i<5;i++){x.fillStyle=R()>.5?"#8E9297":"#B6B9BC";x.beginPath();x.arc(m[0]+(R()-.5)*26,m[1]+(R()-.5)*11,1+R()*.8,0,TAU);x.fill();}}
  for(const [c,r] of (lan||[])){const m=tileCenter(c,r),lx=m[0]+11,ly=m[1]-3;x.fillStyle="rgba(20,22,24,.3)";x.beginPath();x.ellipse(lx+2,ly+2,6,2.6,0,0,TAU);x.fill();
    x.fillStyle="#8B8F95";x.fillRect(lx-3.5,ly-2.5,7,3);x.fillStyle="#9EA3A9";x.fillRect(lx-1.6,ly-8,3.2,6);x.fillStyle=night?"#FFD27A":"#C9C2B0";x.fillRect(lx-3,ly-12.5,6,4.5);
    x.fillStyle="#2E3135";x.fillRect(lx-.8,ly-12.5,1.6,4.5);x.fillStyle="#6C7076";x.beginPath();x.moveTo(lx-5.5,ly-12.5);x.lineTo(lx+5.5,ly-12.5);x.lineTo(lx,ly-16.5);x.closePath();x.fill();
    if(night&&L){L.push([lx,ly-10,20,.42]);L.push([lx,ly+2,30,.18]);}}
  x.restore();}
/* a laid stream: a sandy bank, water and a glint, flowing from tile to tile */
function ustream(x,tiles,ph){const col=ph==="night"?"#2E5C86":"#5AACD8",set=new Set(tiles.map(t=>t[0]+","+t[1]));x.save();x.lineCap="round";x.lineJoin="round";
  const run=(w,cl)=>{x.strokeStyle=cl;x.lineWidth=w;x.beginPath();for(const [c,r] of tiles){const m=tileCenter(c,r);x.moveTo(m[0]-.1,m[1]);x.lineTo(m[0]+.1,m[1]);for(const [a,b] of [[1,0],[0,1]])if(set.has((c+a)+","+(r+b))){const q=tileCenter(c+a,r+b);x.moveTo(m[0],m[1]);x.lineTo(q[0],q[1]);}}x.stroke();};
  run(24,"#CDBF95");run(17,shade(col,-.12));run(12,col);x.strokeStyle="rgba(255,255,255,.45)";x.lineWidth=1.2;for(const [c,r] of tiles){const m=tileCenter(c,r);x.beginPath();x.moveTo(m[0]-5,m[1]-1);x.lineTo(m[0]+3,m[1]+1);x.stroke();}
  x.restore();}
/* plaza: square stone paving, for small gathering spaces */
function plaza(x,tiles,se){const snow=se==="winter";for(const [c,r] of tiles){const p=[P(c,r),P(c+1,r),P(c+1,r+1),P(c,r+1)];x.fillStyle=snow?"#E9E7E2":"#D9D0C0";x.beginPath();x.moveTo(p[0][0],p[0][1]);p.slice(1).forEach(q=>x.lineTo(q[0],q[1]));x.closePath();x.fill();
    x.strokeStyle="rgba(120,100,80,.35)";x.lineWidth=1;const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];const a=mid(p[0],p[1]),b=mid(p[3],p[2]),d=mid(p[0],p[3]),e=mid(p[1],p[2]);
    x.beginPath();x.moveTo(p[0][0],p[0][1]);p.slice(1).forEach(q=>x.lineTo(q[0],q[1]));x.closePath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.moveTo(d[0],d[1]);x.lineTo(e[0],e[1]);x.stroke();}}
function landClip(x){const L=1e4;x.beginPath();x.moveTo(-L,L/2-20);x.lineTo(0,-20);x.lineTo(L,L/2-20);x.lineTo(L,1e5);x.lineTo(-L,1e5);x.closePath();x.clip();}
function cloudFrame(x,N,ph){x.save();landClip(x);/* only the near edges fade into mist; the back hills stay clear */x.beginPath();x.rect(-1e5,N*.8*16,2e5,2e5);x.clip();tileSpace(x);const c=N/2,g=x.createRadialGradient(c,c,N*.72,c,c,N*1.12),col=CLOUD[ph]||CLOUD.day;
  g.addColorStop(0,`rgba(${col},0)`);g.addColorStop(.55,`rgba(${col},.75)`);g.addColorStop(1,`rgba(${col},1)`);x.fillStyle=g;x.fillRect(-N*3,-N*3,N*7,N*7);x.restore();}
function kite(x,kx,ky,s,t,tilt){const sw=Math.sin(t*.0009)*3*s;x.save();x.translate(kx,ky);x.rotate(tilt||0);
  x.strokeStyle="rgba(60,50,40,.42)";x.lineWidth=1;x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(14*s+sw,40*s,0,96*s+sw*2);x.stroke();
  const k=[[0,-14*s],[10*s,0],[0,16*s],[-10*s,0]];poly(x,k,"#E8604C");poly(x,[k[0],k[1],[0,0]],"#F2A65A");
  for(let i=1;i<5;i++)dot(x,Math.sin(t*.003+i)*2*s,16*s+i*7*s,2*s,["#6BB8FF","#FFE56B","#7BE07B","#FF8FAB"][i%4]);x.restore();}
/* soft, slow snowfall: flakes drift and sway on a fixed pattern, so it costs little */
function snowfall(x,W,H,t,n){x.fillStyle="rgba(255,255,255,.9)";for(let i=0;i<n;i++){const u=(i*0.6180339)%1,v=(i*0.3819660+.1)%1,sp=.6+(i%5)*.12,y=((v*H+t*.012*sp)%(H+20))-10,x0=u*W+Math.sin(t*.0006+i)*10;x.globalAlpha=.55+(i%3)*.15;x.beginPath();x.arc(x0,y,1.2+(i%4)*.45,0,TAU);x.fill();}x.globalAlpha=1;}

/* ---------- the valley floor (world space) ---------- */
const HZ=-300;
/* rolling foothills along the horizon, in front of the far mountains */
function foothills(x,se,ph){const S=SEAS[se],c=ph==="night"?"#1E2D3A":S.snow?"#DCE5EC":shade(S.grass[0],-.28),c2=ph==="night"?"#25374A":S.snow?"#E9EFF4":shade(S.grass[0],-.18);
  [[c,HZ-40,190,.0021],[c2,HZ-10,130,.0033]].forEach(([col,base,h,f],li)=>{x.fillStyle=col;x.beginPath();x.moveTo(-6000,HZ+40);for(let px=-6000;px<=6000;px+=60){const n=Math.sin(px*f+li*2)*.5+Math.sin(px*f*2.6+1+li)*.3+.2;x.lineTo(px,base-h*Math.max(0,n));}x.lineTo(6000,HZ+40);x.closePath();x.fill();});}
function ground(x,N,se,detail,patches,tufts,dots){const S=SEAS[se],D=30,L=P(0,N),B=P(N,N),R=P(N,0),T=P(0,0);
  x.fillStyle=shade(S.grass[0],S.snow?-.04:-.12);x.fillRect(-6000,HZ,12000,9000);
  const O=k=>[P(-k,-k),P(N+k,-k),P(N+k,N+k),P(-k,N+k)];poly(x,O(4),shade(S.grass[0],S.snow?-.02:-.06));poly(x,[T,R,B,L],S.grass[0]);
  x.save();tileSpace(x);x.beginPath();x.rect(0,0,N,N);x.clip();
  for(const p of patches){x.fillStyle=shade(p.tone>0?S.grass[1]:S.grass[0],p.tone);x.beginPath();x.ellipse(p.c,p.r,p.rx,p.ry,p.a,0,TAU);x.fill();}
  x.restore();
  if(S.frost){x.save();tileSpace(x);x.beginPath();x.rect(0,0,N,N);x.clip();for(const p of patches){if(p.tone<0)continue;x.fillStyle="rgba(246,250,253,.42)";x.beginPath();x.ellipse(p.c,p.r,p.rx*.9,p.ry*.8,p.a,0,TAU);x.fill();}x.restore();}
  if(detail&&!S.snow){x.strokeStyle=shade(S.grass[0],-.16);x.lineWidth=1;x.beginPath();for(const t of tufts){const p=P(t[0],t[1]);x.moveTo(p[0],p[1]);x.lineTo(p[0]-1.5,p[1]-3.5);x.moveTo(p[0]+2,p[1]);x.lineTo(p[0]+3,p[1]-3);}x.stroke();
    if(S.fall||S.frost){x.fillStyle=S.frost?"rgba(240,248,255,.4)":S.fall[0];x.beginPath();for(const d of dots){const p=P(d[0],d[1]);x.moveTo(p[0]+1.7,p[1]);x.arc(p[0],p[1],1.7,0,TAU);}x.fill();}}}
/* 3.9.1: the waterfall (Water practice, level 5), to Leigh's design: a natural mound of clean grey stone at the lake's
   left end, facing you. Water pours in one full sheet off an overhanging lip, in front of a shadowed hollow, and lands
   in white water that rings out across the lake, so it reads as a fall, not a trickle down the rocks. Moss and ferns
   on the stone, pebbles and a few flowers at its foot; snow on the tops in winter; the stone dims at dusk and night.
   g = {x,y}: where the falling water meets the lake, in valley pixels. t = 0 draws it still. */
function falls(x,g,ph,se,t){
  /* drawn at 1.3x around its landing point, so it reads as a big fall beside the lake */
  x.save();x.translate(g.x,g.y);x.scale(1.3,1.3);
  const bx=0,by=0,night=ph==="night",dusk=ph==="dusk"||ph==="dawn",dk=night?-.42:dusk?-.16:0,win=se==="winter",C=h=>dk?shade(h,dk):h;
  const rnd=i=>{const v=Math.sin(i*127.1+311.7)*43758.5453;return v-Math.floor(v);},mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
  function blob(cx,cy,w,h,seed){const n=9,p=[];for(let i=0;i<n;i++){const a=i/n*TAU,j=.84+rnd(seed*13+i)*.28;p.push([cx+Math.cos(a)*w/2*j,cy+Math.sin(a)*h/2*j]);}
    const s0=mid(p[n-1],p[0]);x.beginPath();x.moveTo(s0[0],s0[1]);for(let i=0;i<n;i++){const m=mid(p[i],p[(i+1)%n]);x.quadraticCurveTo(p[i][0],p[i][1],m[0],m[1]);}x.closePath();}
  function rock(cx,cy,w,h,seed,top){blob(cx,cy,w,h,seed);const gr=x.createLinearGradient(cx-w*.35,cy-h*.55,cx+w*.3,cy+h*.5);
    gr.addColorStop(0,C(top||"#D5D8DB"));gr.addColorStop(.5,C("#AAAFB4"));gr.addColorStop(1,C("#788087"));x.fillStyle=gr;x.fill();
    x.save();x.clip();x.fillStyle=`rgba(255,255,255,${night?.04:.17})`;x.beginPath();x.ellipse(cx-w*.14,cy-h*.3,w*.34,h*.17,-.2,0,TAU);x.fill();
    x.fillStyle=`rgba(30,36,42,${night?.18:.12})`;x.beginPath();x.ellipse(cx+w*.18,cy+h*.36,w*.42,h*.2,0,0,TAU);x.fill();x.restore();
    x.strokeStyle=C("#5C636A");x.globalAlpha=.32;x.lineWidth=.8;x.stroke();x.globalAlpha=1;
    if(win){x.fillStyle=C("#F4F7FA");x.beginPath();x.ellipse(cx-w*.06,cy-h*.36,w*.32,h*.12,-.1,0,TAU);x.fill();}}
  function moss(cx,cy,w,h){if(win)return;x.fillStyle=C("#7FA65A");x.beginPath();x.ellipse(cx,cy,w,h,-.15,0,TAU);x.fill();x.fillStyle=C("#9CC271");x.beginPath();x.ellipse(cx-w*.25,cy-h*.25,w*.45,h*.4,0,0,TAU);x.fill();}
  function fern(px,py,len,ang,fl){if(win)return;x.save();x.translate(px,py);x.rotate(ang);x.scale(fl,1);x.strokeStyle=C("#4F8040");x.lineWidth=1.1;x.lineCap="round";
    x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(len*.35,-len*.55,len,-len*.6);x.stroke();x.fillStyle=C("#5F9A48");
    for(let k=1;k<7;k++){const u=k/7,qx=len*(.7*u+.3*u*u),qy=-len*(1.1*u-.5*u*u),l=(1-u)*len*.24+1.5;x.beginPath();x.ellipse(qx,qy-l*.4,l*.55,l*.22,-.9,0,TAU);x.fill();x.beginPath();x.ellipse(qx+l*.3,qy+l*.2,l*.5,l*.2,.5,0,TAU);x.fill();}x.restore();}
  /* shade on the water beneath the mound, and the hollow behind the fall */
  x.fillStyle=`rgba(28,48,60,${night?.3:.18})`;x.beginPath();x.ellipse(bx,by+3,58,13,0,0,TAU);x.fill();
  rock(bx-25,by-38,42,48,1);rock(bx+25,by-36,40,46,2);rock(bx-1,by-60,36,22,3);
  x.fillStyle=C("#3F464C");x.beginPath();x.ellipse(bx+1,by-24,17,25,0,0,TAU);x.fill();
  /* the overhanging lip */
  rock(bx+1,by-54,54,17,4,"#DDE0E3");moss(bx-17,by-60,8,2.6);moss(bx+19,by-59,7,2.3);
  /* one full sheet of water, curving off the lip */
  const y0=by-50,y1=by+1;x.save();x.beginPath();x.moveTo(bx-12,y0);x.quadraticCurveTo(bx-15,y0+6,bx-15.5,y0+16);x.lineTo(bx-16,y1);x.lineTo(bx+18,y1);x.lineTo(bx+17.5,y0+16);x.quadraticCurveTo(bx+17,y0+6,bx+14,y0);x.closePath();
  const wg=x.createLinearGradient(0,y0,0,y1);wg.addColorStop(0,night?"rgba(205,226,240,.92)":"rgba(244,251,255,.97)");wg.addColorStop(.5,night?"rgba(120,165,195,.86)":"rgba(176,220,243,.9)");wg.addColorStop(1,night?"rgba(190,215,232,.9)":"rgba(232,247,255,.95)");
  x.fillStyle=wg;x.fill();x.clip();x.strokeStyle=`rgba(255,255,255,${night?.22:.5})`;x.lineWidth=1.1;x.lineCap="round";
  for(let i=0;i<8;i++){const sx=bx-12.5+i*4.1,sp=.05*(1+(i%3)*.22),off=((t*sp)+i*17)%14;for(let yy=y0-14+off;yy<y1;yy+=14){x.beginPath();x.moveTo(sx,yy);x.lineTo(sx+.4,yy+8);x.stroke();}}
  x.fillStyle=`rgba(90,140,170,${night?.25:.16})`;x.fillRect(bx-16,y0,3,y1-y0);x.fillRect(bx+15,y0,3,y1-y0);x.restore();
  x.strokeStyle=`rgba(255,255,255,${night?.5:.9})`;x.lineWidth=1.6;x.beginPath();x.moveTo(bx-12,y0+.5);x.quadraticCurveTo(bx+1,y0-2.5,bx+14,y0+.5);x.stroke();
  /* stones either side, some standing in the water */
  rock(bx-31,by-14,31,33,5);rock(bx+34,by-12,29,29,6);moss(bx-36,by-28,6,2.2);moss(bx+38,by-24,5,2);
  rock(bx-45,by-1,22,15,7);rock(bx+47,by+2,19,12,8);rock(bx-24,by+5,12,7,9);
  fern(bx-41,by-42,17,-.25,-1);fern(bx+42,by-38,16,.15,1);fern(bx-52,by-8,11,-.1,-1);fern(bx+55,by-6,10,.1,1);
  /* white water where it lands, a little mist, and rings across the lake */
  const fa=night?.55:.88;x.fillStyle=`rgba(255,255,255,${fa*.6})`;x.beginPath();x.ellipse(bx+1,by+4,22,6,0,0,TAU);x.fill();
  for(let i=0;i<7;i++){const ex=bx-13+i*4.6+Math.sin(t*.004+i)*1.4,ey=by+2+(i%2)*2.2,r=3.8+(i%3)*1.4+Math.sin(t*.006+i*2)*.8;x.fillStyle=`rgba(255,255,255,${fa})`;x.beginPath();x.arc(ex,ey,Math.max(1.5,r),0,TAU);x.fill();}
  const mg=x.createRadialGradient(bx+1,by-6,2,bx+1,by-6,30);mg.addColorStop(0,`rgba(255,255,255,${night?.12:.24})`);mg.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=mg;x.beginPath();x.arc(bx+1,by-6,30,0,TAU);x.fill();
  for(let k=0;k<2;k++){const q=((t*.00035)+k*.5)%1;x.strokeStyle=`rgba(255,255,255,${(1-q)*(night?.25:.5)})`;x.lineWidth=1;x.beginPath();x.ellipse(bx+1,by+7,12+q*38,3.5+q*10,0,0,TAU);x.stroke();}
  /* pebbles and a few flowers at its foot */
  [[-60,7,3.2],[-55,10,2.2],[57,9,2.8],[62,6,2]].forEach(([dx,dy,r])=>{x.fillStyle=C("#9CA2A8");x.beginPath();x.ellipse(bx+dx,by+dy,r*1.4,r*.8,0,0,TAU);x.fill();});
  if(!win&&!night)[[-50,-14,"#FFFFFF"],[-46,-17,"#F7D774"],[50,-12,"#FFFFFF"],[54,-15,"#F2B6C6"]].forEach(([dx,dy,c])=>dot(x,bx+dx,by+dy,1.5,c));
  x.restore();
}
function river(x,line,ph,off){const col=ph==="night"?"#2E5C86":"#5AACD8";x.save();landClip(x);/* it emerges from the foot of the mountains */x.lineCap="round";x.lineJoin="round";
  const path=()=>{x.beginPath();const pts=line.map(p=>P(p[0],p[1]));x.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length-1;i++){const m=[(pts[i][0]+pts[i+1][0])/2,(pts[i][1]+pts[i+1][1])/2];x.quadraticCurveTo(pts[i][0],pts[i][1],m[0],m[1]);}x.lineTo(pts[pts.length-1][0],pts[pts.length-1][1]);};
  [[64,"#CDBF95"],[52,shade(col,-.14)],[42,col]].forEach(([w,c])=>{path();x.strokeStyle=c;x.lineWidth=w;x.stroke();});
  path();x.strokeStyle="rgba(255,255,255,.3)";x.lineWidth=2;x.setLineDash([12,30]);x.lineDashOffset=-off;x.stroke();x.setLineDash([]);x.restore();}
function stream(x,pts,ph){if(pts.length<2)return;const col=ph==="night"?"#2E5C86":"#5AACD8";x.lineCap="round";x.lineJoin="round";
  /* the light edge stops at the bank; only plain water runs on into the river, so the two merge with no seam */
  [[14,shade(col,.2)],[10,col]].forEach(([w,cl],k)=>{const ps=k===0&&pts.length>3?pts.slice(0,-2):pts;x.strokeStyle=cl;x.lineWidth=w;x.beginPath();ps.forEach((p,i)=>{const m=tileCenter(p[0],p[1]);i?x.lineTo(m[0],m[1]):x.moveTo(m[0],m[1]);});x.stroke();});}
function paths(x,tiles,se,spurs){if(!tiles.length)return;spurs=spurs||[];const S=SEAS[se],set=new Set(tiles.map(t=>t[0]+","+t[1])),segs=[];
  for(const [c,r] of tiles){if(set.has((c+1)+","+r))segs.push([c,r,c+1,r]);if(set.has(c+","+(r+1)))segs.push([c,r,c,r+1]);}
  const run=(w,col)=>{x.strokeStyle=col;x.lineWidth=w;x.lineCap="round";x.lineJoin="round";x.beginPath();for(const [a,b,c2,d] of segs){const p=tileCenter(a,b),q=tileCenter(c2,d);x.moveTo(p[0],p[1]);x.lineTo(q[0],q[1]);}
    for(const [c,r] of tiles){const p=tileCenter(c,r);x.moveTo(p[0]-.1,p[1]);x.lineTo(p[0]+.1,p[1]);}for(const [p,q] of spurs){x.moveTo(p[0],p[1]);x.lineTo(q[0],q[1]);}x.stroke();};
  run(25,shade(S.path,-.16));run(20,S.path);
  x.fillStyle=shade(S.path,-.09);x.beginPath();for(const [c,r] of tiles){const m=tileCenter(c,r),R=rnd(c*31+r*17);for(let i=0;i<2;i++){const sx=m[0]+(R()-.5)*14,sy=m[1]+(R()-.5)*6;x.moveTo(sx+2.4,sy);x.ellipse(sx,sy,2.4,1.2,0,0,TAU);}}x.fill();}
function waterBox(x,c0,r0,c1,r1,ph,lilies){const col=ph==="night"?"#2E5C86":"#5AACD8",cx=(c0+c1)/2,cy=(r0+r1)/2,rad=(c1-c0)/2,R=rnd(c0*13+r0);
  x.save();tileSpace(x);[[.95,"#D9CDA6"],[.85,shade(col,-.12)],[.77,col]].forEach(([k,c])=>{x.fillStyle=c;x.beginPath();x.arc(cx,cy,rad*k,0,TAU);x.fill();});
  x.fillStyle="rgba(255,255,255,.14)";x.beginPath();x.arc(cx-rad*.2,cy-rad*.2,rad*.4,0,TAU);x.fill();x.restore();
  x.strokeStyle="rgba(255,255,255,.4)";x.lineWidth=1.2;x.beginPath();for(let i=0;i<Math.round(rad*5);i++){const a=R()*TAU,d=R()*rad*.55,p=P(cx+Math.cos(a)*d,cy+Math.sin(a)*d);x.moveTo(p[0]-6,p[1]);x.lineTo(p[0]+5,p[1]);}x.stroke();
  if(lilies)for(let i=0;i<5;i++){const a=R()*TAU,d=rad*(.2+R()*.42),p=P(cx+Math.cos(a)*d,cy+Math.sin(a)*d);x.fillStyle="#4E9A52";x.beginPath();x.ellipse(p[0],p[1],5.5,2.8,0,0,TAU);x.fill();if(i%2)dot(x,p[0]+1,p[1]-1.5,1.8,"#F6B8CF");}}
function spring(x,c,r,ph){const night=ph==="night",m=tileCenter(c,r);
  /* a clear spring in a ring of rounded stones, a little rock stack with a trickle, ripples and a fern */
  x.fillStyle="rgba(0,0,0,.14)";x.beginPath();x.ellipse(m[0],m[1]+3,26,12,0,0,TAU);x.fill();
  x.fillStyle=night?"#2E5C86":"#4FA3D6";x.beginPath();x.ellipse(m[0],m[1],19,9,0,0,TAU);x.fill();
  const g=x.createRadialGradient(m[0]-4,m[1]-2,1,m[0],m[1],19);g.addColorStop(0,night?"rgba(160,200,255,.35)":"rgba(255,255,255,.55)");g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;x.beginPath();x.ellipse(m[0],m[1],18,8.5,0,0,TAU);x.fill();
  x.strokeStyle="rgba(255,255,255,.55)";x.lineWidth=.9;for(const k of [.45,.75]){x.beginPath();x.ellipse(m[0]+3,m[1]+1,17*k,8*k,0,0,TAU);x.stroke();}
  const stone=(px,py,rx,ry)=>{x.fillStyle=night?"#5E6470":"#8E8C86";x.beginPath();x.ellipse(px,py,rx,ry,0,0,TAU);x.fill();x.fillStyle=night?"#767C88":"#B3B0A8";x.beginPath();x.ellipse(px-rx*.2,py-ry*.35,rx*.62,ry*.5,0,0,TAU);x.fill();};
  for(let k=0;k<11;k++){const a=k/11*TAU+.3;stone(m[0]+Math.cos(a)*21,m[1]+Math.sin(a)*10.5,4.6+(k%3),3+(k%2));}
  stone(m[0]-12,m[1]-11,7,5);stone(m[0]-8,m[1]-16,5,3.6);x.strokeStyle=night?"rgba(170,210,255,.7)":"rgba(255,255,255,.9)";x.lineWidth=1.6;x.beginPath();x.moveTo(m[0]-7,m[1]-15);x.quadraticCurveTo(m[0]-4,m[1]-10,m[0]-5,m[1]-5);x.stroke();
  x.strokeStyle=night?"#2F5A33":"#3F8A3A";x.lineWidth=1.3;x.beginPath();for(const k of [-5,-2,1,4]){x.moveTo(m[0]+16,m[1]-3);x.quadraticCurveTo(m[0]+16+k,m[1]-10,m[0]+16+k*1.7,m[1]-14);}x.stroke();}
/* 3.0.6: the vegetable garden gets a scarecrow and a watering can; decorations sit on a grounded, seasonal base */
function garden(x,c,r,se){garden0(x,c,r,se);const TA=Math.PI*2,win=se==="winter",s0=P(c+1.95,r+.35),w0=P(c+.1,r+1.75);
  x.fillStyle="rgba(0,0,0,.16)";x.beginPath();x.ellipse(s0[0]+2,s0[1]+1,7,2.4,0,0,TA);x.fill();x.fillStyle="#6B4630";x.fillRect(s0[0]-.9,s0[1]-24,1.8,24);x.fillRect(s0[0]-8,s0[1]-17,16,1.6);
  x.fillStyle="#C85A3C";x.beginPath();x.moveTo(s0[0]-5,s0[1]-18);x.lineTo(s0[0]+5,s0[1]-18);x.lineTo(s0[0]+4,s0[1]-9);x.lineTo(s0[0]-4,s0[1]-9);x.closePath();x.fill();x.fillStyle="#E8B44A";x.fillRect(s0[0]-1.5,s0[1]-15,3,3);
  x.strokeStyle="#E8C460";x.lineWidth=.8;for(const sx of [-8,8]){x.beginPath();x.moveTo(s0[0]+sx,s0[1]-16.5);x.lineTo(s0[0]+sx+(sx<0?-2:2),s0[1]-14);x.stroke();}
  x.fillStyle="#D9C08A";x.beginPath();x.arc(s0[0],s0[1]-21.5,3.4,0,TA);x.fill();x.fillStyle=win?"#F4F7FB":"#C9A04A";x.beginPath();x.ellipse(s0[0],s0[1]-24.4,6.4,1.7,0,0,TA);x.fill();x.fillRect(s0[0]-3,s0[1]-28,6,3.6);
  x.fillStyle="#3E8F8A";x.fillRect(w0[0]-3,w0[1]-5,6,5);x.strokeStyle="#3E8F8A";x.lineWidth=1.1;x.beginPath();x.moveTo(w0[0]+3,w0[1]-3.5);x.lineTo(w0[0]+7,w0[1]-7);x.stroke();x.beginPath();x.arc(w0[0],w0[1]-5,2.6,Math.PI,TA);x.stroke();}
function decorBase(x,cx,cy,seed,se){const TA=Math.PI*2,R=rnd(seed||3);x.fillStyle="rgba(20,30,15,.2)";x.beginPath();x.ellipse(cx,cy+1,20,6.5,0,0,TA);x.fill();
  if(se==="winter"){x.fillStyle="rgba(255,255,255,.85)";x.beginPath();x.ellipse(cx,cy+1,17,5,0,0,TA);x.fill();return;}
  x.strokeStyle=se==="autumn"?"#8E9A4E":"#4F8A3E";x.lineWidth=1;for(let k=0;k<7;k++){const a=R()*TA,gx=cx+Math.cos(a)*16,gy=cy+1+Math.sin(a)*5;x.beginPath();x.moveTo(gx,gy);x.lineTo(gx-1.2,gy-4);x.moveTo(gx,gy);x.lineTo(gx+1.3,gy-3.4);x.stroke();}
  const col=se==="autumn"?["#E8873A","#D9622E","#F2B54A"]:["#F28BA8","#FFD36B","#FFFFFF","#B394E8"];for(let k=0;k<4;k++){const a=R()*TA;x.fillStyle=col[k%col.length];x.beginPath();x.arc(cx+Math.cos(a)*18,cy+1+Math.sin(a)*5.5,1.3,0,TA);x.fill();}}
function garden0(x,c,r,se){const win=se==="winter",aut=se==="autumn",i=.14,o=2-i,h=6,pt=(u,v)=>P(c+u,r+v),up=(p,d)=>[p[0],p[1]-d],m=pt(1,1);
  /* a raised timber bed: soft shadow, plank sides, a rim, dark tilled soil in mounded rows, and seasonal crops */
  x.fillStyle="rgba(0,0,0,.13)";x.beginPath();x.ellipse(m[0],m[1]+6,66,28,0,0,TAU);x.fill();
  const a=pt(i,i),b=pt(o,i),cc=pt(o,o),d=pt(i,o);poly(x,[d,cc,up(cc,h),up(d,h)],"#7A5030");poly(x,[cc,b,up(b,h),up(cc,h)],"#9A6A3E");
  x.strokeStyle="rgba(50,28,12,.35)";x.lineWidth=.8;x.beginPath();[[d,cc],[cc,b]].forEach(([p,q])=>{x.moveTo(p[0],p[1]-h/2);x.lineTo(q[0],q[1]-h/2);});x.stroke();
  poly(x,[up(a,h),up(b,h),up(cc,h),up(d,h)],"#B9874F");const e=.12,soil=[pt(i+e,i+e),pt(o-e,i+e),pt(o-e,o-e),pt(i+e,o-e)].map(q=>up(q,h));poly(x,soil,win?"#EEF1F4":"#5A3A24");
  const rows=[.6,1,1.4],U0=i+e+.12,U1=o-e-.12;x.lineCap="round";
  rows.forEach(v=>{const p0=up(pt(U0,v),h),p1=up(pt(U1,v),h);x.strokeStyle=win?"#DCE2E8":"#6E4A2E";x.lineWidth=6;x.beginPath();x.moveTo(p0[0],p0[1]);x.lineTo(p1[0],p1[1]);x.stroke();
    x.strokeStyle=win?"#F7F9FB":"#82593A";x.lineWidth=2;x.beginPath();x.moveTo(p0[0],p0[1]-1.5);x.lineTo(p1[0],p1[1]-1.5);x.stroke();});
  const lettuce=(px,py)=>{dot(x,px,py+1,5.2,"#3E7F35");dot(x,px-1,py-.5,4.4,"#5FA845");dot(x,px+.5,py-1.2,3,"#8DCB5C");dot(x,px-1,py-2,1.4,"#C3E79A");};
  const carrot=(px,py)=>{x.strokeStyle="#4E9A3C";x.lineWidth=1.3;x.beginPath();for(const k of [-3,0,3]){x.moveTo(px,py);x.quadraticCurveTo(px+k,py-5,px+k*1.5,py-9);}x.stroke();x.fillStyle="#F08A2C";x.beginPath();x.ellipse(px,py+.5,2.2,1.5,0,0,TAU);x.fill();};
  const tomato=(px,py)=>{x.strokeStyle="#8A6A44";x.lineWidth=1.2;x.beginPath();x.moveTo(px,py+1);x.lineTo(px,py-12);x.stroke();dot(x,px-2,py-6,3.4,"#3F8A3A");dot(x,px+2,py-9,3,"#4E9A3C");dot(x,px+2.5,py-4,2,"#E2483A");dot(x,px-2.5,py-9.5,1.8,"#E2483A");dot(x,px+3,py-4.6,.7,"#FFB3A8");};
  const pumpkin=(px,py)=>{x.fillStyle="#E07A22";x.beginPath();x.ellipse(px,py-1,5.2,3.8,0,0,TAU);x.fill();x.strokeStyle="rgba(150,70,10,.6)";x.lineWidth=.8;x.beginPath();for(const k of [-2.2,0,2.2]){x.ellipse(px+k*.6,py-1,1.6,3.6,0,0,TAU);}x.stroke();dot(x,px+1.6,py-2.8,1,"#F7B266");x.fillStyle="#5A7A2A";x.fillRect(px-.6,py-6,1.3,2.4);};
  const kale=(px,py)=>{dot(x,px,py,4,"#3C6A5A");dot(x,px-1,py-1.5,3,"#5B8C78");dot(x,px+1,py-3,1.4,"#F4F7FA");};
  rows.forEach((v,ri)=>{for(let u=U0+.08;u<=U1-.05;u+=.27){const q=up(pt(u,v),h+1.5);if(win){if((Math.round(u*10)+ri)%3===0)kale(q[0],q[1]);continue;}
    (ri===0?lettuce:ri===1?carrot:aut?pumpkin:tomato)(q[0],q[1]);}});
  const sp=up(pt(i+.05,i+.05),h);x.fillStyle="#7A5030";x.fillRect(sp[0]-1,sp[1]-14,2,14);x.fillStyle="#C99A62";x.fillRect(sp[0]-7,sp[1]-18,14,7);x.fillStyle="#7A5030";x.fillRect(sp[0]-4,sp[1]-15.5,8,1.1);}
/* a little footbridge over one stream tile, spanning the water in the direction of travel ("r" or "c"), gently arched,
   with crosswise planks, two rails with end posts, and a soft shadow on the water */
function footbridge(x,c,r,dir){const a=dir==="r"?P(c+.5,r):P(c,r+.5),b=dir==="r"?P(c+.5,r+1):P(c+1,r+.5),v=[b[0]-a[0],b[1]-a[1]],q=dir==="r"?[32,16]:[-32,16],ql=Math.hypot(q[0],q[1]),u=[q[0]/ql,q[1]/ql],W=11;
  x.save();x.fillStyle="rgba(20,40,60,.22)";x.beginPath();x.ellipse((a[0]+b[0])/2,(a[1]+b[1])/2+4,16,6,Math.atan2(v[1],v[0]),0,TAU);x.fill();
  const at=t=>[a[0]+v[0]*t,a[1]+v[1]*t-Math.sin(Math.PI*t)*3.5];
  for(let i=0;i<=7;i++){const t=i/7,m=at(t);x.fillStyle=i%2?"#A0724C":"#8C6240";x.beginPath();x.moveTo(m[0]-u[0]*W,m[1]-u[1]*W-1.6);x.lineTo(m[0]+u[0]*W,m[1]+u[1]*W-1.6);x.lineTo(m[0]+u[0]*W,m[1]+u[1]*W+1.6);x.lineTo(m[0]-u[0]*W,m[1]-u[1]*W+1.6);x.closePath();x.fill();}
  x.strokeStyle="#6B4630";x.lineWidth=1.6;x.lineCap="round";for(const sd of [-1,1]){x.beginPath();for(let i=0;i<=10;i++){const m=at(i/10),px=m[0]+u[0]*W*sd*.92,py=m[1]+u[1]*W*sd*.92-7;i?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();
    for(const t of [0,1]){const m=at(t),px=m[0]+u[0]*W*sd*.92,py=m[1]+u[1]*W*sd*.92;x.beginPath();x.moveTo(px,py);x.lineTo(px,py-8);x.stroke();}}
  x.restore();}
function bridge(x,c,r,len){const a=tileCenter(c,r),b=tileCenter(c+len-1,r),dx=b[0]-a[0],dy=b[1]-a[1];x.save();x.translate(a[0],a[1]);
  const n=Math.max(4,Math.round(Math.hypot(dx,dy)/6));for(let i=-1;i<=n+1;i++){const k=i/n;x.save();x.translate(dx*k,dy*k);x.rotate(-.46);x.fillStyle=i%2?"#A0724C":"#8C6240";x.fillRect(-12,-2.2,24,4.4);x.restore();}
  x.strokeStyle="#6B4630";x.lineWidth=1.8;x.beginPath();x.moveTo(-6,-14);x.lineTo(dx-6,dy-14);x.moveTo(6,-2);x.lineTo(dx+6,dy-2);x.stroke();x.restore();}
/* 3.4.5: soft mist along the land's far edges, so the unexplored land dissolves into the distance instead of ending in a
   hard line; drawn after the distant mountains, fading out as the valley grows to fill the land */
function fogEdge(x,N,R,ph){const k=Math.max(0,Math.min(1,(N*.9-R)/(N*.5)));if(k<=0)return;const col=CLOUD[ph]||CLOUD.day,Rn=rnd(97);x.save();tileSpace(x);
  for(let t=-2;t<=N+2;t+=1.1)for(const [cx,cy] of [[t,-.3+Rn()*.8],[-.3+Rn()*.8,t]]){const rr=2.2+Rn()*2.2,g=x.createRadialGradient(cx,cy,0,cx,cy,rr);g.addColorStop(0,`rgba(${col},${(.5*k).toFixed(2)})`);g.addColorStop(1,`rgba(${col},0)`);x.fillStyle=g;x.beginPath();x.arc(cx,cy,rr,0,TAU);x.fill();}
  x.restore();}
function fog(x,N,hc,hr,R,ph){if(R>=N*1.5)return;const col=CLOUD[ph]||CLOUD.day;
  x.save();landClip(x);tileSpace(x);
  const g=x.createRadialGradient(hc,hr,Math.max(0,R-.5),hc,hr,R+3);g.addColorStop(0,`rgba(${col},0)`);g.addColorStop(.45,`rgba(${col},.55)`);g.addColorStop(1,`rgba(${col},.68)`);
  x.fillStyle=g;x.fillRect(-N*3,-N*3,N*7,N*7);
  /* 3.4.5: rolling banks of mist across the unexplored land, bright and shadowed, so it reads as mist, not a flat shape */
  const Rm=rnd(Math.round(R*7)+3),sh=col.split(",").map(v=>Math.round(v*.86)).join(",");for(let k=0;k<70;k++){const an=Rm()*6.283,d=R+1.2+Rm()*N*.95,cx=hc+Math.cos(an)*d,cy=hr+Math.sin(an)*d,rr=1.4+Rm()*2.8,dk=k%4===0,a=dk?.16+Rm()*.12:.16+Rm()*.24,pg=x.createRadialGradient(cx,cy-rr*.2,0,cx,cy,rr);
    pg.addColorStop(0,`rgba(${dk?sh:col},${a.toFixed(2)})`);pg.addColorStop(1,`rgba(${dk?sh:col},0)`);x.fillStyle=pg;x.beginPath();x.arc(cx,cy,rr,0,TAU);x.fill();}
  const Rn=rnd(Math.round(R*13)+7);for(let k=0;k<26;k++){const an=k/26*6.283+Rn()*.2,d=R+1.2+Rn()*1.4,cx=hc+Math.cos(an)*d,cy=hr+Math.sin(an)*d,rr=.8+Rn()*1.1,pg=x.createRadialGradient(cx,cy,0,cx,cy,rr);
    pg.addColorStop(0,`rgba(${col},.54)`);pg.addColorStop(1,`rgba(${col},0)`);x.fillStyle=pg;x.beginPath();x.arc(cx,cy,rr,0,TAU);x.fill();}
  x.restore();}

/* ---------- things that stand up (drawn from their base point) ---------- */
/* the Hometree: a great old tree at the heart of the village, hung with paper lanterns, prayer flags and ribbons */
/* the Hometree's prayer flags and ribbons, drawn live so they move in the wind; its lanterns glow at night */
function homewind(x,cx,cy,s,t,night,L){const TA=Math.PI*2,w=(t||0)/1000,ev=window.EKEVENT?EKEVENT.now():null;x.save();x.translate(cx,cy);x.scale(s,s);
  if(!(window.EKEVENT&&EKEVENT.hometree(x,t,night,L,cx,cy,s,ev))){
  /* prayer flags in their traditional order (blue, white, red, green, yellow), each one shaded and catching the wind */
  const fl=[["#2F6FD0","#1F55A8"],["#F6F4EC","#D3CEBE"],["#D9483E","#AE342C"],["#3FA85A","#2C8344"],["#F2C744","#CFA22C"]];
  for(const [a0,a1,ph] of [[[-150,-120],[-10,-150],0],[[10,-150],[150,-126],1.7]]){const sag=16+Math.sin(w*1.3+ph)*3,pt=u=>[a0[0]+(a1[0]-a0[0])*u,a0[1]+(a1[1]-a0[1])*u+Math.sin(u*Math.PI)*sag];
    x.strokeStyle="rgba(70,48,30,.75)";x.lineWidth=.7;x.beginPath();for(let k=0;k<=20;k++){const q=pt(k/20);k?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]);}x.stroke();
    for(let k=0;k<10;k++){const u=(k+.5)/10,[px,py]=pt(u),sw=Math.sin(w*2.6+k*.8+ph)*1.8,c=fl[k%5],fw=8.2,fh=10.5;
      x.fillStyle=c[0];x.beginPath();x.moveTo(px-fw/2,py);x.lineTo(px+fw/2,py);x.lineTo(px+fw/2+sw,py+fh);x.quadraticCurveTo(px+sw*.5,py+fh+1.4*Math.sin(w*3+k),px-fw/2+sw,py+fh);x.closePath();x.fill();
      x.fillStyle=c[1];x.beginPath();x.moveTo(px+fw*.1,py);x.lineTo(px+fw/2,py);x.lineTo(px+fw/2+sw,py+fh);x.lineTo(px+fw*.1+sw,py+fh);x.closePath();x.fill();
      x.fillStyle="rgba(255,255,255,.28)";x.beginPath();x.arc(px+sw*.5,py+fh*.5,1.5,0,TA);x.fill();}}
  /* streamers: soft tapered ribbons drifting from the lower branches */
  const rib=["#F49BB8","#8FD0EE","#F6CF5A","#BFA4F0","#9CDB92","#F7AE80"];
  rib.forEach((c,k)=>{const sx=-118+k*46+(k%2?6:-4),sy=-112-(k%3)*6,len=40+(k%3)*8,ph2=w*2+k*1.1;x.fillStyle=c;x.globalAlpha=.88;x.beginPath();
    const P=[];for(let i=0;i<=12;i++){const u=i/12,yy=sy+u*len,xx=sx+Math.sin(ph2+u*3.4)*6*u+u*u*6*Math.sin(w*.9+k);P.push([xx,yy,(1-u)*2.6+.35]);}
    P.forEach(([xx,yy,ww],i)=>i?x.lineTo(xx+ww,yy):x.moveTo(xx+ww,yy));for(let i=P.length-1;i>=0;i--)x.lineTo(P[i][0]-P[i][2],P[i][1]);x.closePath();x.fill();x.globalAlpha=1;});}
  x.restore();
  if(night&&L)for(const [lx,ly] of [[-120,-96],[-70,-112],[-26,-104],[30,-108],[78,-110],[124,-98],[-96,-130],[100,-134]])L.push([cx+lx*s,cy+ly*s,26*s,.34]);}
function hometree(x,cx,cy,s,se,seed){const R=rnd(seed||7),TA=Math.PI*2,snow=se==="winter",aut=se==="autumn",spr=se==="spring";x.save();x.translate(cx,cy);x.scale(s,s);
  shadow(x,10,8,132,44,.24);
  /* great buttress roots flowing out from a flared base, mossy on top, with faint glowing dots (a nod to Pandora) */
  const bark=(a,b)=>{const g=x.createLinearGradient(a,0,b,0);g.addColorStop(0,"#4A2F1E");g.addColorStop(.5,"#7A5434");g.addColorStop(1,"#3E2718");return g;};
  const roots=[[-2.75,74,-30],[-2.3,62,-24],[-1.6,40,-18],[2.75,-74,30],[2.3,-62,24],[1.6,-40,18],[3.1,0,0]];
  for(const [a,l,sx] of [[2.75,60,-30],[-2.7,60,30],[-1.2,96,-30],[1.2,96,30],[-.62,78,-20],[.62,78,20],[-.15,58,-8],[.2,58,8]]){const tx=Math.sin(a)*l,ty=Math.abs(Math.cos(a))*l*.38+6;
    x.fillStyle=bark(Math.min(sx,tx)-16,Math.max(sx,tx)+16);x.beginPath();x.moveTo(sx-17,-58);x.bezierCurveTo(sx-14,-16,tx*.62-14,ty*.4,tx-9,ty);x.quadraticCurveTo(tx+1,ty+5,tx+11,ty-2);x.bezierCurveTo(tx*.5+10,ty*.1-10,sx+12,-18,sx+18,-62);x.closePath();x.fill();
    x.strokeStyle=snow?"rgba(255,255,255,.75)":"rgba(110,160,70,.6)";x.lineWidth=3.2;x.beginPath();x.moveTo(sx,-54);x.bezierCurveTo(sx-4,-18,tx*.6-6,ty*.3-4,tx-2,ty-4);x.stroke();x.strokeStyle="rgba(255,225,180,.12)";x.lineWidth=1.2;x.beginPath();x.moveTo(sx+6,-56);x.bezierCurveTo(sx+4,-20,tx*.55,ty*.2,tx+6,ty-3);x.stroke();}
  x.fillStyle=bark(-56,56);x.beginPath();x.moveTo(-54,2);x.bezierCurveTo(-38,-36,-34,-96,-24,-152);x.lineTo(24,-152);x.bezierCurveTo(36,-98,40,-38,56,2);x.quadraticCurveTo(0,12,-54,2);x.closePath();x.fill();
  x.strokeStyle="rgba(30,18,10,.32)";x.lineWidth=1.4;for(let k=0;k<9;k++){x.beginPath();const ox=-32+k*8;x.moveTo(ox,-2);x.bezierCurveTo(ox+8,-50,ox-8,-100,ox*.45+2,-148);x.stroke();}
  /* the hollow you can walk into: a warm-lit arch with a door frame and steps */
  const hg=x.createRadialGradient(0,-16,2,0,-16,22);hg.addColorStop(0,"#FFD58A");hg.addColorStop(.55,"#E8913A");hg.addColorStop(1,"#5A3216");x.fillStyle="#2A170C";x.beginPath();x.moveTo(-14,2);x.lineTo(-14,-22);x.quadraticCurveTo(0,-44,14,-22);x.lineTo(14,2);x.closePath();x.fill();
  x.fillStyle=hg;x.beginPath();x.moveTo(-11,1);x.lineTo(-11,-21);x.quadraticCurveTo(0,-39,11,-21);x.lineTo(11,1);x.closePath();x.fill();
  x.strokeStyle="#8A5A32";x.lineWidth=2.2;x.beginPath();x.moveTo(-14,2);x.lineTo(-14,-22);x.quadraticCurveTo(0,-44,14,-22);x.lineTo(14,2);x.stroke();
  x.fillStyle="#9C8F7E";x.fillRect(-12,2,24,3.4);x.fillStyle="#B3A691";x.fillRect(-15,5.4,30,3.4);
  /* a wooden walkway spiralling up round the trunk (front half shows), with a rope rail */
  x.lineCap="round";for(let k=0;k<70;k++){const u=k/70,ang=u*Math.PI*3.4,yy=-52-u*96,half=40-u*20;const c=Math.cos(ang);if(c<.05)continue;const px=Math.sin(ang)*half;
    x.fillStyle=c>.5?"#A8783E":"#8A6034";x.fillRect(px-4,yy,8,2.4);if(k%5===0){x.fillStyle="#5A3C22";x.fillRect(px-.6,yy-6,1.2,6);}}
  x.strokeStyle="rgba(220,190,140,.75)";x.lineWidth=.9;x.beginPath();let st=false;for(let k=0;k<=140;k++){const u=k/140,ang=u*Math.PI*3.4,yy=-58-u*96,half=40-u*20;if(Math.cos(ang)<.05){st=false;continue;}const px=Math.sin(ang)*half;st?x.lineTo(px,yy):x.moveTo(px,yy);st=true;}x.stroke();
  for(let k=0;k<26;k++){const px=(R()-.5)*70,py=-R()*140;x.fillStyle=k%2?"rgba(120,230,255,.55)":"rgba(190,140,255,.5)";x.beginPath();x.arc(px,py,1.1,0,TA);x.fill();}
  /* the crown: tapering limbs that fork into smaller branches, under a canopy of layered, leafy clusters */
  const limb=(x0,y0,x1,y1,w0,w1,bx,by)=>{const l=Math.hypot(x1-x0,y1-y0),nx=-(y1-y0)/l,ny=(x1-x0)/l,wm=(w0+w1)/4;x.beginPath();x.moveTo(x0+nx*w0/2,y0+ny*w0/2);x.quadraticCurveTo(bx+nx*wm,by+ny*wm,x1+nx*w1/2,y1+ny*w1/2);
    x.lineTo(x1-nx*w1/2,y1-ny*w1/2);x.quadraticCurveTo(bx-nx*wm,by-ny*wm,x0-nx*w0/2,y0-ny*w0/2);x.closePath();x.fill();};
  x.fillStyle=bark(-130,130);
  for(const b of [[-14,-146,-100,-186,17,6,-58,-150],[14,-148,104,-192,17,6,60,-154],[-6,-150,-44,-236,14,5,-30,-196],[6,-150,46,-242,14,5,30,-200],[0,-150,0,-266,12,4,4,-210],
    [-70,-170,-134,-160,6,2,-100,-172],[-78,-176,-92,-226,5,2,-88,-200],[74,-174,138,-166,6,2,104,-178],[80,-180,94,-232,5,2,90,-206],[-34,-214,-70,-262,4.5,1.5,-52,-240],[36,-218,72,-266,4.5,1.5,54,-246],[0,-240,-24,-288,4,1.5,-12,-266],[0,-244,26,-290,4,1.5,12,-268]])limb(...b);
  const pal=snow?["#22442C","#2F5A36","#3F6E44","#5C8A5E"]:aut?["#6E3414","#A04E1C","#CC7428","#F0AE48"]:spr?["#2C5C30","#3E7E3B","#5EA64E","#97D27C"]:["#21552C","#317536","#4A9643","#7DBF5E"];
  const CL=[[-80,-254,34],[0,-278,40],[80,-256,34],[-20,-238,50],[24,-240,50],[-62,-214,48],[66,-216,48],[-104,-184,44],[106,-188,44],[0,-208,46],[-132,-152,34],[134,-156,34],[-40,-182,40],[40,-184,40],[-152,-120,22],[152,-122,22]];
  const blob=(px,py,r)=>{x.beginPath();x.arc(px,py,r,0,TA);x.fill();};
  for(const [cx2,cy2,r] of CL){
    x.fillStyle=pal[0];for(let k=0;k<9;k++){const a=k/9*TA+R();blob(cx2+Math.cos(a)*r*.55,cy2+Math.sin(a)*r*.42+r*.14,r*.42*(.8+R()*.4));}
    x.fillStyle=pal[1];for(let k=0;k<8;k++){const a=k/8*TA+R();blob(cx2+Math.cos(a)*r*.44-r*.05,cy2+Math.sin(a)*r*.34-r*.04,r*.36*(.8+R()*.4));}
    x.fillStyle=pal[2];for(let k=0;k<6;k++){const a=R()*TA;blob(cx2-r*.18+Math.cos(a)*r*.3,cy2-r*.2+Math.sin(a)*r*.22,r*.25*(.8+R()*.4));}
    x.fillStyle=pal[3];for(let k=0;k<4;k++){const a=R()*TA;blob(cx2-r*.3+Math.cos(a)*r*.16,cy2-r*.32+Math.sin(a)*r*.12,r*.13*(.8+R()*.5));}
    for(let k=0;k<16;k++){const a=R()*TA,d=.86+R()*.22;x.fillStyle=k%3?pal[1]:pal[2];x.save();x.translate(cx2+Math.cos(a)*r*d,cy2+Math.sin(a)*r*.78*d);x.rotate(a);x.beginPath();x.ellipse(0,0,4.2,2.2,0,0,TA);x.fill();x.restore();}
    if(snow){x.fillStyle="rgba(240,246,250,.9)";x.beginPath();x.ellipse(cx2-r*.2,cy2-r*.52,r*.36,r*.13,-.15,0,TA);x.fill();x.beginPath();x.ellipse(cx2+r*.16,cy2-r*.42,r*.24,r*.1,.2,0,TA);x.fill();}}
  /* touches of colour: blossom in spring, warm light in summer, red leaves in autumn, and a few spirit glows */
  const acc=spr?["#F7B6CB","#FFFFFF","#F49BB8"]:aut?["#D9483E","#F2C744","#B8401E"]:snow?null:["rgba(255,236,170,.75)","rgba(255,250,220,.6)"];
  if(acc)for(let k=0;k<46;k++){const [cx2,cy2,r]=CL[k%CL.length],a=R()*TA,d=R();x.fillStyle=acc[k%acc.length];blob(cx2+Math.cos(a)*r*.8*d,cy2+Math.sin(a)*r*.6*d,spr?2:1.6);}
  for(let k=0;k<10;k++){const [cx2,cy2,r]=CL[(k*5)%CL.length],px=cx2+(R()-.5)*r,py=cy2+(R()-.5)*r*.6,g=x.createRadialGradient(px,py,0,px,py,6);g.addColorStop(0,k%2?"rgba(150,235,255,.7)":"rgba(255,220,150,.7)");g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;blob(px,py,6);}
  /* two little treehouses on the branches, with lit windows; vines hang from the canopy */
  /* each treehouse sits on a sturdy branch from the trunk, on a small plank platform */
  for(const [hx,hy,sc] of [[-92,-150,1],[86,-158,.9]]){const sg=Math.sign(hx);x.strokeStyle="#5A3C25";x.lineCap="round";x.lineWidth=8*sc;x.beginPath();x.moveTo(sg*16,-124);x.quadraticCurveTo(hx*.5,hy+18,hx,hy+8*sc);x.stroke();
    x.strokeStyle="rgba(140,100,60,.6)";x.lineWidth=2;x.beginPath();x.moveTo(sg*16,-127);x.quadraticCurveTo(hx*.5,hy+14,hx,hy+5*sc);x.stroke();
    x.fillStyle="#9A6E42";x.beginPath();x.ellipse(hx,hy+7*sc,17*sc,4.5*sc,0,0,TA);x.fill();x.fillStyle="rgba(60,35,18,.35)";x.beginPath();x.ellipse(hx,hy+8.5*sc,17*sc,3*sc,0,0,Math.PI);x.fill();}
  for(const [hx,hy,sc] of [[-92,-150,1],[86,-158,.9]]){x.save();x.translate(hx,hy);x.scale(sc,sc);x.fillStyle="#7A5434";x.beginPath();x.ellipse(0,6,18,5,0,0,TA);x.fill();x.fillStyle="#C9A27A";x.fillRect(-10,-10,20,16);
    x.fillStyle="#FFC86A";x.fillRect(-6,-5,4,5);x.fillRect(3,-5,4,5);x.fillStyle=snow?"#EEF2F6":"#A0703A";x.beginPath();x.moveTo(-14,-9);x.lineTo(14,-9);x.lineTo(0,-26);x.closePath();x.fill();x.fillStyle="rgba(0,0,0,.18)";x.beginPath();x.moveTo(0,-26);x.lineTo(14,-9);x.lineTo(4,-9);x.closePath();x.fill();x.restore();}
  x.strokeStyle="rgba(70,130,60,.85)";x.lineWidth=1.3;for(const [vx,vy,l] of [[-130,-120,34],[-60,-118,26],[40,-120,30],[118,-116,36],[-20,-122,20]]){x.beginPath();x.moveTo(vx,vy);x.bezierCurveTo(vx+4,vy+l*.3,vx-4,vy+l*.6,vx+2,vy+l);x.stroke();x.fillStyle="#5E9E52";x.beginPath();x.arc(vx+2,vy+l,1.8,0,TA);x.fill();}
  for(const [lx,ly,c] of [[-120,-96,"#E8604C"],[-70,-112,"#F2A33A"],[-26,-104,"#E8604C"],[30,-108,"#F2C744"],[78,-110,"#E8604C"],[124,-98,"#F2A33A"],[-96,-130,"#F2C744"],[100,-134,"#E8604C"]]){
    x.strokeStyle="rgba(50,30,20,.7)";x.lineWidth=.9;x.beginPath();x.moveTo(lx,ly-12);x.lineTo(lx,ly-5);x.stroke();
    const lg=x.createRadialGradient(lx,ly,1,lx,ly,16);lg.addColorStop(0,"rgba(255,210,120,.55)");lg.addColorStop(1,"rgba(255,180,90,0)");x.fillStyle=lg;x.beginPath();x.arc(lx,ly,16,0,TA);x.fill();
    x.fillStyle=c;x.beginPath();x.ellipse(lx,ly,5.5,7,0,0,TA);x.fill();x.fillStyle="rgba(255,240,200,.6)";x.beginPath();x.ellipse(lx-1.5,ly-2,1.6,3,0,0,TA);x.fill();x.fillStyle="#3A2A1C";x.fillRect(lx-3,ly-8,6,1.6);x.fillRect(lx-3,ly+6.4,6,1.6);}
  x.restore();}
function tree(x,cx,cy,s,se,seed,kind){if(kind==="ancient")return hometree(x,cx,cy,s,se,seed);const S=SEAS[se],R=rnd(seed);
  const h={sap:20,young:36,fruit:26,ancient:66,jac:40,gum:48}[kind]*s,w={sap:8,young:16,fruit:13,ancient:34,jac:18,gum:19}[kind]*s,ever=kind==="ancient"||kind==="gum";
  shadow(x,cx+4*s,cy+1,w*1.05,w*.44);
  x.strokeStyle=ever?"#C9C2B4":"#6B4A33";x.lineWidth=Math.max(1.4,{sap:1.6,young:3,fruit:2.6,ancient:7,jac:3.2,gum:3.4}[kind]*s);x.lineCap="round";x.beginPath();x.moveTo(cx,cy);x.lineTo(cx,cy-h*.55);x.stroke();
  if(S.bare&&!ever){x.lineWidth=Math.max(1,x.lineWidth*.55);
    for(let i=0;i<6;i++){const a=-Math.PI/2+(R()-.5)*1.7,l=h*(.22+R()*.3),y0=cy-h*(.38+R()*.22);x.beginPath();x.moveTo(cx,y0);x.lineTo(cx+Math.cos(a)*l*.65,y0+Math.sin(a)*l);x.stroke();}
    if(S.frost)for(let i=0;i<6;i++)dot(x,cx+(R()-.5)*w,cy-h*(.55+R()*.35),1.4*s,"rgba(240,248,255,.85)");return;}
  const pal=kind==="jac"?(se==="spring"||se==="summer"?["#8E6BD9","#A98AE8","#7A58C8"]:S.leaf):ever?EVERGREEN:S.leaf,n=kind==="ancient"?8:kind==="sap"?2:5;
  for(let i=0;i<n;i++){const bx=cx+(R()-.5)*w*1.15,by=cy-h*(.62+R()*.3),br=w*(.4+R()*.24);dot(x,bx,by+2*s,br,shade(pal[i%pal.length],-.12));dot(x,bx-1*s,by,br*.92,pal[i%pal.length]);}
  dot(x,cx-w*.28,cy-h*.88,w*.32,"rgba(255,255,255,.12)");
  if(S.snow){const R2=rnd(seed+9);for(let i=0;i<n;i++){const bx=cx+(R2()-.5)*w*1.0,by=cy-h*(.78+R2()*.18);x.fillStyle="rgba(248,251,253,.95)";x.beginPath();x.ellipse(bx,by,w*.32,w*.14,0,0,TAU);x.fill();}}
  if(S.blossom&&!ever)for(let i=0;i<12;i++)dot(x,cx+(R()-.5)*w*1.3,cy-h*(.55+R()*.45),1.6*s,S.blossom[i%3]);
  if(kind==="fruit"&&(se==="autumn"||se==="summer"))for(let i=0;i<6;i++)dot(x,cx+(R()-.5)*w,cy-h*(.55+R()*.35),1.9*s,se==="autumn"?"#F07A2B":"#E84B3C");}
function flowers(x,cx,cy,s,se,seed){const R=rnd(seed),win=se==="winter",n=win?5:se==="autumn"?9:14;
  /* a leafy mound with five-petalled blooms at different heights */
  x.fillStyle="rgba(0,0,0,.12)";x.beginPath();x.ellipse(cx,cy+3*s,17*s,7*s,0,0,TAU);x.fill();
  const leaf=win?["#7E8F86","#A7B4AC"]:["#3F8A3A","#5FA845"];for(let k=0;k<7;k++){const a=k/7*TAU;dot(x,cx+Math.cos(a)*9*s,cy+Math.sin(a)*3.6*s-2*s,5*s,leaf[k%2]);}dot(x,cx,cy-3*s,6*s,leaf[1]);
  const pal=win?["#FFFFFF","#E6EEF6"]:se==="autumn"?["#F2A541","#E8743B","#D9534F","#F6D06F"]:["#F7A8C8","#C9A7F2","#FFFFFF","#FFD866","#FF8C7A","#F28DB2"];
  const pts=[];for(let k=0;k<n;k++){const a=R()*TAU,d=Math.sqrt(R());pts.push([cx+Math.cos(a)*13*s*d,cy+Math.sin(a)*5*s*d-2*s,4+R()*6]);}
  pts.sort((p,q)=>p[1]-q[1]).forEach(([px,py,hh],k)=>{const top=py-hh*s;x.strokeStyle=win?"#8FA39A":"#3E7F35";x.lineWidth=1*s;x.beginPath();x.moveTo(px,py);x.lineTo(px,top);x.stroke();
    const col=pal[k%pal.length],rr=(win?1.4:2.1)*s;for(let j=0;j<5;j++){const a=j/5*TAU+k;dot(x,px+Math.cos(a)*rr,top+Math.sin(a)*rr*.75,rr*.95,col);}
    dot(x,px,top,rr*.62,win?"#DDE7EF":"#FFC93C");dot(x,px-rr*.3,top-rr*.35,rr*.28,"rgba(255,255,255,.75)");});}
function rock(x,cx,cy,s,seed){const R=rnd(seed);shadow(x,cx+2,cy+1,9*s,3.5*s,.14);[[0,0,1],[6,1,.7],[-5,1.5,.6]].forEach(([dx,dy,k],i)=>{if(i&&R()<.4)return;x.fillStyle=i?"#9A968E":"#A9A59C";x.beginPath();x.ellipse(cx+dx*s,cy-3*s*k+dy*s,7*s*k,5*s*k,0,0,TAU);x.fill();x.fillStyle="rgba(255,255,255,.18)";x.beginPath();x.ellipse(cx+dx*s-2*s*k,cy-5*s*k+dy*s,3*s*k,1.6*s*k,0,0,TAU);x.fill();});}
function shrub(x,cx,cy,s,se,seed){const S=SEAS[se],R=rnd(seed),pal=se==="winter"?["#5E7F66","#6C8C70"]:S.leaf;shadow(x,cx+2,cy+1,11*s,4*s,.15);
  for(let i=0;i<4;i++){const bx=cx+(R()-.5)*14*s,by=cy-5*s-R()*5*s;dot(x,bx,by+1.5*s,6*s,shade(pal[i%pal.length],-.12));dot(x,bx,by,5.4*s,pal[i%pal.length]);}
  if(S.blossom)for(let i=0;i<4;i++)dot(x,cx+(R()-.5)*14*s,cy-7*s-R()*5*s,1.4*s,S.blossom[i%3]);
  if(S.snow){x.fillStyle="rgba(248,251,253,.95)";x.beginPath();x.ellipse(cx,cy-9*s,10*s,4*s,0,0,TAU);x.fill();}}
/* a house on a w x h footprint, drawn from its top tile corner (0,0) */
function house(x,w,h,night,L,roof,snow){
  /* a timber cottage under deep thatch: log walls on a stone plinth, a stone chimney, an arched door with a lantern,
     paned windows with flower boxes. At night the windows and lantern glow and light the ground around them */
  const z=27,rh=24,A=P(0,0),B=P(w,0),C=P(w,h),D=P(0,h),up=(p,k)=>[p[0],p[1]-(k===undefined?z:k)],m=(a,b,k)=>[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k],R=rnd(w*7+h*3+1);
  shadow(x,(A[0]+C[0])/2+6,(A[1]+C[1])/2+6,(B[0]-D[0])*.5,(C[1]-A[1])*.4,.2);
  const pl=5;poly(x,[D,C,up(C,pl),up(D,pl)],"#8E8981");poly(x,[C,B,up(B,pl),up(C,pl)],"#76716A");
  x.fillStyle="rgba(255,255,255,.16)";for(let i=0;i<12;i++){const p=m(D,C,(i+.5)/12);x.beginPath();x.ellipse(p[0],p[1]-pl/2,2.6,1.3,0,0,TAU);x.fill();}
  const fw=night?"#7A5232":"#B07C4B",rw=night?"#5A3B23":"#8C5F37";poly(x,[up(D,pl),up(C,pl),up(C),up(D)],fw);poly(x,[up(C,pl),up(B,pl),up(B),up(C)],rw);
  const logs=5;x.lineWidth=1;for(let i=1;i<logs;i++){const hh=pl+(z-pl)*i/logs;x.strokeStyle="rgba(50,28,14,.42)";x.beginPath();x.moveTo(...up(D,hh));x.lineTo(...up(C,hh));x.lineTo(...up(B,hh));x.stroke();
    x.strokeStyle="rgba(255,226,180,.15)";x.beginPath();x.moveTo(D[0],D[1]-hh-1.2);x.lineTo(C[0],C[1]-hh-1.2);x.lineTo(B[0],B[1]-hh-1.2);x.stroke();}
  for(let i=0;i<logs;i++){const hh=pl+(z-pl)*(i+.5)/logs;dot(x,C[0],C[1]-hh,2.6,night?"#9A7448":"#C99A64");dot(x,C[0],C[1]-hh,1.2,"#7E5632");}
  const win=(a,b,side)=>{const p0=[a[0],a[1]-z*.42],p1=[b[0],b[1]-z*.42],p2=[b[0],b[1]-z*.78],p3=[a[0],a[1]-z*.78];
    poly(x,[[p0[0]-1.5,p0[1]+1.5],[p1[0]+1.5,p1[1]+1.5],[p2[0]+1.5,p2[1]-1.5],[p3[0]-1.5,p3[1]-1.5]],"#5A3B22");
    if(night){const g=x.createLinearGradient(p3[0],p3[1],p1[0],p1[1]);g.addColorStop(0,"#FFE9AE");g.addColorStop(1,"#FFB458");poly(x,[p0,p1,p2,p3],g);}else poly(x,[p0,p1,p2,p3],side?"#86AFC6":"#9CC6DC");
    x.strokeStyle="#5A3B22";x.lineWidth=1.1;x.beginPath();const ma=m(p0,p1,.5),mb=m(p3,p2,.5),mc=m(p0,p3,.5),md=m(p1,p2,.5);x.moveTo(...ma);x.lineTo(...mb);x.moveTo(...mc);x.lineTo(...md);x.stroke();
    if(!night&&!snow&&!side){poly(x,[[p0[0]-2,p0[1]+1],[p1[0]+2,p1[1]+1],[p1[0]+2,p1[1]+4],[p0[0]-2,p0[1]+4]],"#6E4A2C");for(let i=0;i<4;i++){const q=m(p0,p1,(i+.5)/4);dot(x,q[0],q[1]-.6,1.6,i%2?"#F28BA8":"#FFD36B");}}
    if(night){const cx=(p0[0]+p2[0])/2,cy=(p0[1]+p2[1])/2;L.push([cx,cy,30,.34]);L.push([cx,cy+z*.62,40,.18]);}};
  for(const k of w>2?[.16,.7]:[.14])win(m(D,C,k),m(D,C,k+.14),0);win(m(C,B,.34),m(C,B,.6),1);
  const d0=m(D,C,w>2?.42:.5),d1=m(D,C,w>2?.56:.68),dh=z*.7;
  poly(x,[[d0[0]-1.5,d0[1]],[d1[0]+1.5,d1[1]],[d1[0]+1.5,d1[1]-dh-1.5],[d0[0]-1.5,d0[1]-dh-1.5]],"#4A2E1A");
  poly(x,[d0,d1,[d1[0],d1[1]-dh],[d0[0],d0[1]-dh]],night?"#5C3A22":"#6E462A");
  x.strokeStyle="rgba(30,16,8,.45)";x.lineWidth=.8;x.beginPath();for(let i=1;i<3;i++){const q=m(d0,d1,i/3);x.moveTo(q[0],q[1]);x.lineTo(q[0],q[1]-dh);}x.stroke();
  const kn=m(d0,d1,.78);dot(x,kn[0],kn[1]-dh*.45,1.1,"#D9B36A");
  poly(x,[[d0[0]-3,d0[1]+1],[d1[0]+3,d1[1]+1],[d1[0]+3,d1[1]+3.5],[d0[0]-3,d0[1]+3.5]],"#9C978F");
  const ln=[d1[0]+6,d1[1]-dh*.82];x.strokeStyle="#3B2A1C";x.lineWidth=1;x.beginPath();x.moveTo(ln[0]-3,ln[1]-5);x.lineTo(ln[0],ln[1]-5);x.lineTo(ln[0],ln[1]-3);x.stroke();
  poly(x,[[ln[0]-2.2,ln[1]-3],[ln[0]+2.2,ln[1]-3],[ln[0]+2.6,ln[1]+3],[ln[0]-2.6,ln[1]+3]],night?"#FFD27A":"#5B5048");
  if(night){L.push([ln[0],ln[1],22,.42]);L.push([(d0[0]+d1[0])/2,(d0[1]+d1[1])/2+6,46,.24]);}
  const e=6,rl=P(0,h/2),rr=P(w,h/2),RL=[rl[0]-4,rl[1]-z-rh],RR=[rr[0]+4,rr[1]-z-rh],
    eA=[up(A)[0]-e*.4,up(A)[1]-e*.2],eB=[up(B)[0]+e,up(B)[1]+e*.5],eC=[up(C)[0],up(C)[1]+e*.9],eD=[up(D)[0]-e,up(D)[1]+e*.5];
  const tl=snow?["#EEF2F6","#D3DCE4"]:night?["#8E7444","#6A5330"]:["#D9B76B","#A98340"];
  poly(x,[eA,eB,RR,RL],shade(tl[1],-.1));poly(x,[eB,eC,RR],shade(tl[0],-.08));
  const g=x.createLinearGradient(0,RL[1],0,eD[1]);g.addColorStop(0,tl[0]);g.addColorStop(1,tl[1]);poly(x,[eD,eC,RR,RL],g);
  x.lineWidth=.8;for(let i=0;i<46;i++){const k=R(),a=m(eD,eC,k),b=m(RL,RR,Math.min(1,Math.max(0,k+(R()-.5)*.04))),s=.3+R()*.55,q=m(a,b,s),q2=m(a,b,Math.min(1,s+.18));
    x.strokeStyle=R()>.5?"rgba(110,80,30,.35)":"rgba(255,236,170,.26)";x.beginPath();x.moveTo(...q);x.lineTo(...q2);x.stroke();}
  for(let i=0;i<14;i++){const k=R(),a=m(eB,eC,k),q=m(a,RR,.2+R()*.5),q2=m(a,RR,Math.min(1,.35+R()*.5));x.strokeStyle="rgba(110,80,30,.3)";x.beginPath();x.moveTo(...q);x.lineTo(...q2);x.stroke();}
  x.lineCap="round";x.strokeStyle=shade(tl[1],-.22);x.lineWidth=3.2;x.beginPath();x.moveTo(...eD);x.lineTo(...eC);x.lineTo(...eB);x.stroke();
  x.strokeStyle=shade(tl[1],-.3);x.lineWidth=4.2;x.beginPath();x.moveTo(...RL);x.lineTo(...RR);x.stroke();
  x.strokeStyle=snow?"#FFFFFF":"rgba(255,232,170,.42)";x.lineWidth=1.2;x.beginPath();x.moveTo(RL[0],RL[1]-1.5);x.lineTo(RR[0],RR[1]-1.5);x.stroke();
  if(snow){x.fillStyle="rgba(255,255,255,.85)";x.beginPath();x.moveTo(...RL);x.lineTo(...RR);const s1=m(RR,eC,.35),s0=m(RL,eD,.35);x.lineTo(...s1);x.lineTo(...s0);x.closePath();x.fill();}
  const ch=m(RL,RR,.74),cw=5,chH=17;
  poly(x,[[ch[0]-cw,ch[1]+6],[ch[0]+cw,ch[1]+6],[ch[0]+cw,ch[1]-chH],[ch[0]-cw,ch[1]-chH]],"#8A857D");
  poly(x,[[ch[0]+cw,ch[1]+6],[ch[0]+cw+3,ch[1]+4],[ch[0]+cw+3,ch[1]-chH-2],[ch[0]+cw,ch[1]-chH]],"#6F6A63");
  x.fillStyle="rgba(50,45,40,.35)";for(let i=0;i<6;i++)x.fillRect(ch[0]-cw+1+(i%2)*4,ch[1]+3-i*3.6,3.5,1);
  poly(x,[[ch[0]-cw-1.5,ch[1]-chH],[ch[0]+cw+3.5,ch[1]-chH-2],[ch[0]+cw+3.5,ch[1]-chH-4],[ch[0]-cw-1.5,ch[1]-chH-2]],"#5E5A54");
  if(night)L.push([ch[0],ch[1]-chH-4,10,.12]);
  return [ch[0]+1,ch[1]-chH-5];}
function fireBase(x,lv){if(lv>=4)for(let i=0;i<5;i++){const a=Math.PI*(.12+i*.44),sx=Math.cos(a)*46,sy=Math.sin(a)*21;x.save();x.translate(sx,sy);x.rotate(Math.cos(a)*.35);x.fillStyle="#7A4E30";x.beginPath();x.ellipse(0,0,12,4.4,0,0,TAU);x.fill();x.fillStyle="#B0845C";x.beginPath();x.ellipse(10,0,2.4,3.8,0,0,TAU);x.fill();x.restore();}
  shadow(x,0,2,30,13,.2);for(let i=0;i<11;i++){const a=i/11*Math.PI*2;x.fillStyle=i%2?"#8D8A84":"#A6A29B";x.beginPath();x.ellipse(Math.cos(a)*21,Math.sin(a)*9.5,4.8,3.3,0,0,TAU);x.fill();}
  x.lineCap="round";x.strokeStyle="#6B4228";x.lineWidth=4.2;x.beginPath();x.moveTo(-12,3);x.lineTo(10,-4);x.moveTo(-10,-4);x.lineTo(12,3);x.stroke();}
function flames(x,cx,cy,t,L,night){const f=(k,col,hm)=>{const fl=Math.sin(t*.012+k)*2.6,hh=(28+Math.sin(t*.008+k*2)*4)*hm;x.fillStyle=col;x.beginPath();x.moveTo(cx-10*hm,cy);x.quadraticCurveTo(cx-9*hm,cy-hh*.55,cx+fl,cy-hh);x.quadraticCurveTo(cx+9*hm,cy-hh*.55,cx+10*hm,cy);x.closePath();x.fill();};
  f(0,"#E8541E",1.15);f(1.7,"#F5902A",.88);f(3.1,"#FFD45E",.56);L.push([cx,cy-14,night?110:50,night?.36:.1]);}
function festoon(x,night,L,ev){const BC=ev==="halloween"?["#FF9A3A","#B87AF0"]:ev==="xmas"?["#FF5A5A","#5AD07A","#FFD24A","#6AB0FF"]:null;const pts=[[-66,-4],[0,-36],[66,-4],[0,28]];
  pts.forEach(p=>{x.strokeStyle="#5A3A22";x.lineWidth=2.2;x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(p[0],p[1]-44);x.stroke();});
  for(let i=0;i<4;i++){const a=pts[i],b=pts[(i+1)%4],ax=a[0],ay=a[1]-44,bx=b[0],by=b[1]-44,mx=(ax+bx)/2,my=(ay+by)/2+13;
    x.strokeStyle="rgba(40,30,20,.55)";x.lineWidth=1;x.beginPath();x.moveTo(ax,ay);x.quadraticCurveTo(mx,my,bx,by);x.stroke();
    for(let k=1;k<7;k++){const u=k/7,px=(1-u)*(1-u)*ax+2*(1-u)*u*mx+u*u*bx,py=(1-u)*(1-u)*ay+2*(1-u)*u*my+u*u*by+2;dot(x,px,py,2.3,BC?BC[(i*6+k)%BC.length]:night?"#FFD99E":"#F3D48E");if(night)L.push([px,py,8,.18]);}}}
function lantern(x,night,L){shadow(x,2,0,5,2.4,.15);x.strokeStyle="#4A3424";x.lineWidth=2;x.beginPath();x.moveTo(0,0);x.lineTo(0,-20);x.stroke();
  x.fillStyle=night?"#FFCF85":"#EFC46E";x.fillRect(-3.2,-27,6.4,7);x.fillStyle="#3A2A1C";x.fillRect(-4.2,-28.6,8.4,2);L.push([0,-23,night?30:10,night?.3:.08]);}
function windflags(x,cx,cy,t){const a=[cx-30,cy-2],b=[cx+30,cy+2],top=40,cols=["#2F6FD0","#F4F1E8","#D9483B","#3E9B4F","#F2C230"];
  /* prayer flags on a sagging rope between two carved poles, swaying in the breeze */
  x.fillStyle="rgba(0,0,0,.14)";[a,b].forEach(p=>{x.beginPath();x.ellipse(p[0],p[1]+1,5,2,0,0,TAU);x.fill();});
  [a,b].forEach(p=>{x.strokeStyle="#5A3A22";x.lineWidth=2.6;x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(p[0],p[1]-top);x.stroke();x.strokeStyle="#7A5434";x.lineWidth=1;x.beginPath();x.moveTo(p[0]-.6,p[1]-2);x.lineTo(p[0]-.6,p[1]-top+2);x.stroke();dot(x,p[0],p[1]-top-1.5,2.6,"#D9A441");dot(x,p[0]-.8,p[1]-top-2.3,.9,"#FFE3A0");});
  const A0=[a[0],a[1]-top+3],B0=[b[0],b[1]-top+3],sag=9,at=u=>[A0[0]+(B0[0]-A0[0])*u,A0[1]+(B0[1]-A0[1])*u+Math.sin(u*Math.PI)*sag];
  x.strokeStyle="#6B5A48";x.lineWidth=.9;x.beginPath();for(let u=0;u<=1.001;u+=.05){const q=at(u);u===0?x.moveTo(q[0],q[1]):x.lineTo(q[0],q[1]);}x.stroke();
  for(let k=0;k<9;k++){const u=(k+.7)/10,q=at(u),w=5.2,hh=7.5,sw=Math.sin((t||0)*.003+k*.9)*1.8;
    x.fillStyle=cols[k%5];x.beginPath();x.moveTo(q[0]-w/2,q[1]);x.lineTo(q[0]+w/2,q[1]);x.lineTo(q[0]+w/2+sw,q[1]+hh);x.lineTo(q[0]-w/2+sw*.8,q[1]+hh+.6);x.closePath();x.fill();
    x.fillStyle="rgba(0,0,0,.14)";x.fillRect(q[0]-w/2,q[1],w,1.2);dot(x,q[0]+sw*.45,q[1]+hh*.55,1,"rgba(255,255,255,.55)");}}
function picture(x,im,cx,cy,hgt){if(!im)return;const w=hgt*im.naturalWidth/im.naturalHeight;shadow(x,cx,cy,w*.36,w*.14,.2);x.drawImage(im,cx-w/2,cy-hgt+2,w,hgt);}
/* soft amber light: one pre-drawn glow, blended gently so night scenes stay warm without washing out */
let GLOW=null;
function glowImg(){if(GLOW)return GLOW;GLOW=document.createElement("canvas");GLOW.width=GLOW.height=128;const g=GLOW.getContext("2d"),gr=g.createRadialGradient(64,64,0,64,64,64);
  gr.addColorStop(0,"rgba(255,190,115,1)");gr.addColorStop(.3,"rgba(255,165,85,.5)");gr.addColorStop(.65,"rgba(255,140,60,.14)");gr.addColorStop(1,"rgba(255,130,50,0)");g.fillStyle=gr;g.fillRect(0,0,128,128);return GLOW;}
function glows(x,L){if(!L.length)return;const im=glowImg();x.save();x.globalCompositeOperation="screen";for(const [lx,ly,r,a] of L){x.globalAlpha=Math.min(.6,a*1.2);x.drawImage(im,lx-r,ly-r,r*2,r*2);}x.restore();}
return {HZ,foothills,snowfall,shadow,TW,TH,P,tileCenter,diamond,shade,dot,seasonKey,phaseOf,rnd,sky,mountains,kite,ground,falls,river,stream,paths,waterBox,spring,garden,bridge,fog,
  tree,flowers,rock,shrub,house,fireBase,flames,festoon,lantern,windflags,picture,glows,SEAS,landscape,cloudFrame,aurora,lpath,plaza,zpath,ustream,homewind,decorBase,footbridge,fogEdge};
})();
