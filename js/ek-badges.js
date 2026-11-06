"use strict";
/* ================= ACHIEVEMENT ART (3.2.0) =================
   Cinematic badges: deep darkness, additive light, soft glow layers, particles and rim light. Each element's six tiers
   follow one arc: (1) the element alone, small and quiet; (2) a seated meditator appears as a glowing outline of
   particles; (3) the figure fills with its element (nebula, lava, water light, cloud, forest); (4) rim light and
   particles drifting off its edges; (5) a signature phenomenon (aurora, a waterfall of light, sky lanterns, sun rays,
   a great tree); (6) a finale with bloom (a galaxy ring, a halo of fire, rainbow mist, a sunburst, the Hometree).
   Soft layers are painted at a quarter of the resolution and stretched up, which blurs them naturally at almost no
   cost. Frames are drawn by CSS on the card's own shape (app-12.css), never in the picture, so nothing is cut off.
   Pictures paint in a few at a time after the page appears (a dark placeholder shows first), then stay cached. */
(function(){if(typeof badgeArt!=="function")return;
const W=300,H=400,TAU=Math.PI*2,CACHE={},Q=[],QK=new Set();let pumping=false;
const rng=seed=>{let s=Math.abs(seed)%233280;return()=>{s=(s*9301+49297)%233280;return s/233280;};};
const FIG=new Path2D();{const poly=pts=>{let a=0;for(let k=0;k<pts.length;k++){const [x1,y1]=pts[k],[x2,y2]=pts[(k+1)%pts.length];a+=x1*y2-x2*y1;}if(a<0)pts=pts.slice().reverse();FIG.moveTo(...pts[0]);for(const q of pts.slice(1))FIG.lineTo(...q);FIG.closePath();};
  FIG.moveTo(172,104);FIG.arc(150,104,22,0,TAU);FIG.closePath();
  FIG.addPath(new Path2D("M142 122L158 122L160 140L140 140Z"));
  FIG.addPath(new Path2D("M118 146C128 138 172 138 182 146C188 160 182 196 174 236L126 236C118 196 112 160 118 146Z"));
  poly([[120,148],[106,154],[88,196],[74,250],[66,262],[80,270],[92,258],[104,206],[122,170]]);
  poly([[180,148],[194,154],[212,196],[226,250],[234,262],[220,270],[208,258],[196,206],[178,170]]);
  FIG.addPath(new Path2D("M58 270C66 244 112 236 150 246C188 236 234 244 242 270C236 292 196 304 150 302C104 304 64 292 58 270Z"));}
const FT=[.74,0,0,.74,39,6];let inFig=false;function fig(x,fn){x.save();x.transform(...FT);inFig=true;try{fn();}finally{inFig=false;x.restore();}}
let EDGE=null,INNER=null;function prep(){if(EDGE)return;const c=document.createElement("canvas").getContext("2d");EDGE=[];INNER=[];
  for(let y=78;y<308;y+=3)for(let x=52;x<250;x+=3){if(!c.isPointInPath(FIG,x,y))continue;INNER.push([x,y]);if(!c.isPointInPath(FIG,x-5,y)||!c.isPointInPath(FIG,x+5,y)||!c.isPointInPath(FIG,x,y-5)||!c.isPointInPath(FIG,x,y+5))EDGE.push([x,y]);}}
/* soft light: drawn at a quarter size and stretched up, which blurs it for free */
const LC=document.createElement("canvas");LC.width=75;LC.height=100;const LX=LC.getContext("2d");
function layer(x,fn,mode,alpha){LX.setTransform(1,0,0,1,0,0);LX.globalCompositeOperation="source-over";LX.globalAlpha=1;LX.clearRect(0,0,75,100);LX.setTransform(.25,0,0,.25,0,0);if(inFig)LX.transform(...FT);fn(LX);
  x.save();x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation=mode||"lighter";x.globalAlpha=alpha==null?1:alpha;x.imageSmoothingEnabled=true;try{x.imageSmoothingQuality="high";}catch(e){}x.drawImage(LC,0,0,W,H);x.restore();}
const glow=(x,px,py,r,c,a)=>{const g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,`rgba(${c},${a})`);g.addColorStop(1,`rgba(${c},0)`);x.fillStyle=g;x.fillRect(px-r,py-r,r*2,r*2);};
const bg=(x,stops)=>{const g=x.createLinearGradient(0,0,0,H);stops.forEach(([o,c])=>g.addColorStop(o,c));x.fillStyle=g;x.fillRect(0,0,W,H);};
function nebula(y,R,cols,n,cx,cy,sx,sy,a){y.globalCompositeOperation="lighter";for(let i=0;i<n;i++){const px=cx+(R()-.5)*sx,py=cy+(R()-.5)*sy,r=24+R()*70;glow(y,px,py,r,cols[i%cols.length],a*(.5+R()*.5));}y.globalCompositeOperation="source-over";}
function stars(x,R,n,y0,y1,big){x.save();x.globalCompositeOperation="lighter";for(let i=0;i<n;i++){const px=R()*W,py=y0+R()*(y1-y0),s=R();x.fillStyle=`rgba(255,255,255,${(.25+s*.75).toFixed(2)})`;x.fillRect(px,py,s<.9?1:1.6,s<.9?1:1.6);if(s>1-(big||.04))glow(x,px,py,4+R()*6,"200,215,255",.5);}x.restore();}
function sparks(x,R,n,cx,cy,sx,sy,c,up){x.save();x.globalCompositeOperation="lighter";for(let i=0;i<n;i++){const px=cx+(R()-.5)*sx,py=cy-R()*sy,l=up?4+R()*10:0,a=(.3+R()*.7).toFixed(2);
  if(l){x.strokeStyle=`rgba(${c},${a})`;x.lineWidth=1.2;x.beginPath();x.moveTo(px,py);x.lineTo(px+(R()-.5)*2,py+l);x.stroke();}else{x.fillStyle=`rgba(${c},${a})`;x.beginPath();x.arc(px,py,.6+R()*1.4,0,TAU);x.fill();}if(R()<.12)glow(x,px,py,8,c,.4);}x.restore();}
/* the figure */
function inside(x,fn){x.save();x.clip(FIG);fn();x.restore();}
function outline(x,R,c,n){x.save();x.globalCompositeOperation="lighter";for(let i=0;i<n;i++){const p=EDGE[(R()*EDGE.length)|0];x.fillStyle=`rgba(${c},${(.35+R()*.65).toFixed(2)})`;x.beginPath();x.arc(p[0]+(R()-.5)*2,p[1]+(R()-.5)*2,.6+R()*1.3,0,TAU);x.fill();}x.restore();}
function rim(x,c,w,b){x.save();x.globalCompositeOperation="lighter";x.fillStyle=`rgba(${c},.6)`;for(const p of EDGE)x.fillRect(p[0]-.8,p[1]-.8,1.6*w,1.6*w);x.restore();layer(x,y=>{y.fillStyle=`rgba(${c},.32)`;for(const p of EDGE)y.fillRect(p[0]-3,p[1]-3,6,6);},"lighter",b>12?1:.8);}
function dissolve(x,R,c,n,dir){x.save();x.globalCompositeOperation="lighter";for(let i=0;i<n;i++){const p=EDGE[(R()*EDGE.length)|0],vx=p[0]-150,vy=p[1]-200,m=Math.hypot(vx,vy)||1,d=R()*R()*46;
  const px=p[0]+vx/m*d+(dir||-.5)*d*.8,py=p[1]+vy/m*d-d*.5;x.fillStyle=`rgba(${c},${(.9*(1-d/48)).toFixed(2)})`;x.beginPath();x.arc(px,py,.5+R()*1.4,0,TAU);x.fill();}x.restore();}
function inner(x,R,c,n,f){x.save();x.globalCompositeOperation="lighter";for(let i=0;i<n;i++){const p=INNER[(R()*INNER.length)|0];x.fillStyle=`rgba(${c},${(.2+R()*.8).toFixed(2)})`;x.fillRect(p[0]+R()*3,p[1]+R()*3,f||1.2,f||1.2);}x.restore();}
/* ---- space: nebula, stars, a moon, shooting stars, aurora, a galaxy ring ---- */
function space(x,t,R){bg(x,[[0,"#02030B"],[.6,"#090A26"],[1,"#03030A"]]);
  layer(x,y=>nebula(y,R,["90,70,220","200,60,160","40,120,230"],6+t*3,150,170,300,260,.18+t*.05));stars(x,R,90+t*45,0,H,.03+t*.01);
  if(t>=2){layer(x,y=>glow(y,232,70,60,"220,215,255",.5));const mc=document.createElement("canvas");mc.width=40;mc.height=40;const m=mc.getContext("2d");m.fillStyle="#F2EEFF";m.beginPath();m.arc(20,20,15,0,TAU);m.fill();m.globalCompositeOperation="destination-out";m.beginPath();m.arc(27,15,13.5,0,TAU);m.fill();x.drawImage(mc,212,50);}
  if(t>=5){layer(x,y=>{for(let i=0;i<44;i++){const px=i*7.4-6,top=20+26*Math.sin(px*.018+1.2)+14*Math.sin(px*.05),len=150+50*Math.sin(px*.021+.4),u=i/44,c=u<.5?"80,255,170":u<.8?"70,210,255":"170,110,255";
      const g=y.createLinearGradient(0,top,0,top+len);g.addColorStop(0,`rgba(${c},0)`);g.addColorStop(.3,`rgba(${c},.55)`);g.addColorStop(.7,`rgba(${c},.22)`);g.addColorStop(1,`rgba(${c},0)`);y.fillStyle=g;y.fillRect(px,top,9,len);}},"lighter",t>=6?.85:.75);
    x.save();x.globalCompositeOperation="lighter";for(let i=0;i<120;i++){const px=R()*W,top=24+26*Math.sin(px*.018+1.2),len=60+R()*120;const g=x.createLinearGradient(0,top,0,top+len);g.addColorStop(0,"rgba(160,255,210,0)");g.addColorStop(.4,"rgba(160,255,210,.09)");g.addColorStop(1,"rgba(160,255,210,0)");x.fillStyle=g;x.fillRect(px,top,1,len);}x.restore();}
  if(t>=6)fig(x,()=>{x.save();x.translate(150,196);x.rotate(-.32);layer(x,y=>{y.save();y.translate(150,196);y.rotate(-.32);y.strokeStyle="rgba(120,140,255,.6)";y.lineWidth=16;y.beginPath();y.ellipse(0,0,166,56,0,0,TAU);y.stroke();y.restore();},"lighter",.9);
    x.globalCompositeOperation="lighter";for(let i=0;i<620;i++){const a=R()*TAU,j=(R()-.5)*(R()*16);x.fillStyle=R()<.5?`rgba(150,170,255,${(.3+R()*.7).toFixed(2)})`:`rgba(230,160,255,${(.3+R()*.6).toFixed(2)})`;x.fillRect(Math.cos(a)*(166+j),Math.sin(a)*(56+j*.4),1.2,1.2);}x.restore();glow(x,150,196,90,"190,170,255",.35);});
  if(t>=4){for(const [sx,sy,l] of [[268,36,80],[96,58,54]]){const g=x.createLinearGradient(sx,sy,sx-l,sy+l*.45);g.addColorStop(0,"rgba(255,255,255,.95)");g.addColorStop(1,"rgba(255,255,255,0)");x.strokeStyle=g;x.lineWidth=1.6;x.beginPath();x.moveTo(sx,sy);x.lineTo(sx-l,sy+l*.45);x.stroke();glow(x,sx,sy,6,"255,255,255",.7);}}
  if(t===1){glow(x,150,190,70,"140,120,255",.25);}
  if(t===2)fig(x,()=>outline(x,R,"185,175,255",520));
  if(t>=3)fig(x,()=>{inside(x,()=>{x.fillStyle="#060A24";x.fillRect(50,80,200,230);layer(x,y=>{y.save();y.clip(FIG);nebula(y,R,["120,90,255","255,80,170","70,170,255"],16,150,190,200,220,.5);y.restore();},"lighter",t>=4?1:.8);inner(x,R,"255,255,255",260+t*40);});
    rim(x,"175,165,255",1.2,t>=5?16:10);if(t>=4)dissolve(x,R,"200,190,255",300+t*90,-.6);if(t>=6)glow(x,150,170,40,"255,240,255",.5);});}
/* ---- fire: embers, lava, sparks, sky lanterns, a halo of fire ---- */
function fire(x,t,R){bg(x,[[0,"#050202"],[.65,"#150604"],[1,"#2C0B04"]]);layer(x,y=>glow(y,150,330,180,"255,90,20",.22+t*.06));
  if(t>=6)fig(x,()=>{layer(x,y=>{y.strokeStyle="rgba(255,120,30,.6)";y.lineWidth=26;y.beginPath();y.arc(150,176,118,0,TAU);y.stroke();},"lighter",.9);x.save();x.globalCompositeOperation="lighter";for(let i=0;i<520;i++){const a=R()*TAU,r=118+(R()-.5)*(R()*26);x.fillStyle=R()<.6?`rgba(255,${120+R()*100|0},40,${(.3+R()*.7).toFixed(2)})`:`rgba(255,230,160,${(.3+R()*.6).toFixed(2)})`;x.beginPath();x.arc(150+Math.cos(a)*r,176+Math.sin(a)*r,.6+R()*1.2,0,TAU);x.fill();}x.restore();});
  if(t>=5)for(const [px,py,s] of [[52,92,1],[246,70,1.2],[98,40,.8],[214,150,.9],[34,170,.7],[270,200,.8]]){glow(x,px,py,26*s,"255,170,70",.55);x.fillStyle="rgba(255,190,110,.95)";x.beginPath();x.moveTo(px-6*s,py-8*s);x.lineTo(px+6*s,py-8*s);x.lineTo(px+4.6*s,py+7*s);x.lineTo(px-4.6*s,py+7*s);x.closePath();x.fill();glow(x,px,py,8*s,"255,250,220",.8);}
  sparks(x,R,30+t*26,150,330,260,300,"255,170,70",t>=4);
  if(t===1){layer(x,y=>glow(y,150,214,60,"255,120,30",.9));glow(x,150,216,20,"255,220,150",.8);}
  if(t===2)fig(x,()=>outline(x,R,"255,150,60",520));
  if(t>=3)fig(x,()=>{inside(x,()=>{x.fillStyle="#120806";x.fillRect(50,80,200,230);x.save();x.globalCompositeOperation="lighter";for(let i=0;i<14+t*2;i++){let p=INNER[(R()*INNER.length)|0],px=p[0],py=p[1],a=R()*TAU;const pts=[[px,py]];for(let k=0;k<9;k++){a+=(R()-.5)*1.4;px+=Math.cos(a)*(6+R()*9);py+=Math.sin(a)*(6+R()*9);pts.push([px,py]);}
      for(const [w,c] of [[5,"rgba(255,80,20,.28)"],[1.6,"rgba(255,190,90,.95)"]]){x.strokeStyle=c;x.lineWidth=w;x.beginPath();pts.forEach((q,k)=>k?x.lineTo(...q):x.moveTo(...q));x.stroke();}}x.restore();layer(x,y=>{y.save();y.clip(FIG);glow(y,150,230,110,"255,100,30",.45);y.restore();},"lighter",.8);});
    rim(x,"255,150,60",1.2,t>=5?16:10);if(t>=4)dissolve(x,R,"255,170,80",300+t*90,-.4);});}
/* ---- river: a drop, water light, reflection, a waterfall of light, rainbow mist ---- */
function water(x,t,R){bg(x,[[0,"#01060C"],[.6,"#04192B"],[1,"#062E46"]]);stars(x,R,40,0,200,.02);
  if(t>=5)fig(x,()=>{layer(x,y=>{for(let i=0;i<60;i++){const u=i/59,px=96+u*108,f=Math.pow(Math.sin(u*Math.PI),1.6),g=y.createLinearGradient(0,0,0,280);g.addColorStop(0,"rgba(200,240,255,0)");g.addColorStop(.2,`rgba(200,240,255,${(.5*f).toFixed(2)})`);g.addColorStop(1,`rgba(200,240,255,${(.3*f).toFixed(2)})`);y.fillStyle=g;y.fillRect(px,0,2.4,280);}nebula(y,R,["190,235,255","230,248,255"],8,150,272,220,40,.35);},"lighter",.9);
    x.save();x.globalCompositeOperation="lighter";for(let i=0;i<70;i++){const px=150+(R()-.5)*(R()*96);x.strokeStyle=`rgba(220,245,255,${(.08+R()*.22).toFixed(2)})`;x.lineWidth=1;x.beginPath();x.moveTo(px,R()*40);x.lineTo(px+(R()-.5)*3,180+R()*90);x.stroke();}x.restore();sparks(x,R,60,150,280,170,70,"220,245,255",false);});
  if(t>=6){layer(x,y=>glow(y,150,96,120,"220,235,255",.55),"lighter",.9);x.save();x.globalCompositeOperation="lighter";x.fillStyle="rgba(240,246,255,.95)";x.beginPath();x.arc(150,96,30,0,TAU);x.fill();x.restore();}
  x.save();const wg=x.createLinearGradient(0,232,0,H);wg.addColorStop(0,"rgba(30,110,160,.55)");wg.addColorStop(1,"rgba(4,20,34,.9)");x.fillStyle=wg;x.fillRect(0,232,W,H-232);x.restore();
  x.save();x.globalCompositeOperation="lighter";for(let i=1;i<=3+Math.min(t,3);i++){x.strokeStyle=`rgba(170,230,255,${(.5-i*.06).toFixed(2)})`;x.lineWidth=1.2;x.beginPath();x.ellipse(150,244,16*i,4.4*i,0,0,TAU);x.stroke();}x.restore();
  if(t>=6){x.save();x.globalCompositeOperation="lighter";for(let i=0;i<26;i++){const yy=238+i*6,w=26-i*.6;x.fillStyle=`rgba(230,240,255,${(.5-i*.017).toFixed(2)})`;x.fillRect(150-w/2+(R()-.5)*8,yy,w,1.4);}for(const [lx,ly] of [[78,262],[214,270],[120,300],[188,318],[60,330]]){glow(x,lx,ly,16,"255,190,110",.7);x.fillStyle="rgba(255,226,170,.95)";x.beginPath();x.ellipse(lx,ly,4,2,0,0,TAU);x.fill();}x.restore();}
  if(t===1){layer(x,y=>glow(y,150,200,40,"140,220,255",.8));x.fillStyle="#BFEFFF";x.beginPath();x.moveTo(150,170);x.bezierCurveTo(166,198,166,214,150,220);x.bezierCurveTo(134,214,134,198,150,170);x.fill();}
  if(t===2)fig(x,()=>outline(x,R,"130,215,255",520));
  if(t>=3)fig(x,()=>{inside(x,()=>{x.fillStyle="#03213A";x.fillRect(50,80,200,230);x.save();x.globalCompositeOperation="lighter";for(let i=0;i<16+t*2;i++){const y0=90+R()*215;x.strokeStyle=`rgba(130,225,255,${(.25+R()*.45).toFixed(2)})`;x.lineWidth=.8+R()*1.4;x.beginPath();x.moveTo(50,y0);x.bezierCurveTo(110,y0-26*R(),180,y0+26*R(),250,y0-8);x.stroke();}x.restore();
      layer(x,y=>{y.save();y.clip(FIG);nebula(y,R,["60,180,255","120,240,255"],10,150,200,200,220,.45);y.restore();},"lighter",.9);inner(x,R,"220,250,255",180);});
    rim(x,"120,215,255",1.2,t>=5?16:10);if(t>=4){dissolve(x,R,"170,235,255",300+t*90,-.3);x.save();x.globalAlpha=.22;x.translate(0,604);x.scale(1,-1);x.clip(new Path2D("M0 0H300V302H0Z"));x.fillStyle="rgba(120,215,255,.5)";x.fill(FIG);x.restore();}});}
/* ---- sky: dawn light, cloud, sun rays, kites, a sunburst and rainbow ---- */
function air(x,t,R){bg(x,[[0,"#0B1E46"],[.5,"#3E6AAE"],[.82,"#D9A58E"],[1,"#F1C7A2"]]);
  if(t>=4)fig(x,()=>{layer(x,y=>{y.fillStyle="rgba(255,236,200,.18)";for(let i=0;i<16;i++){const a=i/16*TAU;y.beginPath();y.moveTo(150,104);y.lineTo(150+Math.cos(a)*520,104+Math.sin(a)*520);y.lineTo(150+Math.cos(a+.07)*520,104+Math.sin(a+.07)*520);y.closePath();y.fill();}},"lighter",t>=6?.9:.6);layer(x,y=>glow(y,150,104,70+t*10,"255,225,170",.5),"lighter",.85);});
  layer(x,y=>nebula(y,R,["255,255,255","255,225,210"],4+t*2,150,300,320,120,.4),"source-over",.8);
  if(t>=6){layer(x,y=>{y.strokeStyle="rgba(255,236,190,.55)";y.lineWidth=14;y.beginPath();y.arc(150,96,96,0,TAU);y.stroke();y.lineWidth=6;y.beginPath();y.arc(150,96,128,0,TAU);y.stroke();},"lighter",.8);x.strokeStyle="rgba(20,30,60,.7)";x.lineWidth=1.3;for(let i=0;i<7;i++){const bx=206+Math.abs(i-3)*12,by=40+i*7;x.beginPath();x.moveTo(bx-5,by);x.quadraticCurveTo(bx-2,by-3,bx,by);x.quadraticCurveTo(bx+2,by-3,bx+5,by);x.stroke();}}
  if(t>=4){x.strokeStyle="rgba(15,25,55,.7)";x.lineWidth=1.4;for(const [bx,by] of [[52,80],[70,72],[84,86]]){x.beginPath();x.moveTo(bx-6,by);x.quadraticCurveTo(bx-3,by-4,bx,by);x.quadraticCurveTo(bx+3,by-4,bx+6,by);x.stroke();}}
  if(t>=5)for(const [kx,ky,c] of [[248,62,"232,72,62"],[48,150,"62,143,217"]]){x.strokeStyle="rgba(20,30,60,.4)";x.lineWidth=.8;x.beginPath();x.moveTo(kx,ky+12);x.quadraticCurveTo(kx-24,ky+110,kx-30,320);x.stroke();x.fillStyle=`rgb(${c})`;x.beginPath();x.moveTo(kx,ky-12);x.lineTo(kx+9,ky);x.lineTo(kx,ky+12);x.lineTo(kx-9,ky);x.closePath();x.fill();}
  if(t===1){layer(x,y=>nebula(y,R,["255,255,255"],5,150,200,150,50,.65),"source-over",.9);layer(x,y=>glow(y,150,230,60,"255,220,170",.6),"lighter",.8);}
  if(t===2)fig(x,()=>outline(x,R,"255,250,240",560));
  if(t>=3)fig(x,()=>{inside(x,()=>{const g=x.createLinearGradient(60,0,240,0);g.addColorStop(0,"#5F84BE");g.addColorStop(.55,"#B9CDE6");g.addColorStop(1,"#E9C3AC");x.fillStyle=g;x.fillRect(50,76,200,236);
      layer(x,y=>{y.save();y.clip(FIG);nebula(y,R,["255,255,255","255,236,220"],14,160,190,190,220,.26);y.restore();},"source-over",.85);
      x.save();x.globalCompositeOperation="lighter";x.strokeStyle="rgba(255,255,255,.35)";x.lineWidth=1;for(let i=0;i<7;i++){const y0=126+i*26;x.beginPath();x.moveTo(60,y0);x.bezierCurveTo(110,y0-14,170,y0+14,240,y0-4);x.stroke();}x.restore();inner(x,R,"255,250,235",120);});
    rim(x,"255,236,200",1.2,t>=5?14:10);if(t>=4)dissolve(x,R,"255,250,240",280+t*80,-.7);});}
/* ---- earth: a sprout of light, forest, fireflies, a great tree, the Hometree ---- */
function earth(x,t,R){bg(x,[[0,"#020703"],[.6,"#06180C"],[1,"#0D2A16"]]);layer(x,y=>nebula(y,R,["90,200,110","200,190,90"],4+t*2,150,240,300,240,.12+t*.03));
  if(t>=5)fig(x,()=>{x.save();const tg=x.createLinearGradient(0,120,0,310);tg.addColorStop(0,"rgba(30,20,10,.9)");tg.addColorStop(1,"rgba(20,14,8,.95)");x.fillStyle=tg;x.beginPath();x.moveTo(134,300);x.bezierCurveTo(140,240,138,170,144,110);x.lineTo(156,110);x.bezierCurveTo(162,170,160,240,166,300);x.closePath();x.fill();x.restore();
    layer(x,y=>nebula(y,R,["120,220,110","230,210,110","90,180,90"],22,150,60,360,150,.32),"lighter",.95);
    x.save();x.globalCompositeOperation="lighter";for(let i=0;i<900;i++){const a=R()*TAU,r=Math.sqrt(R()),px=150+Math.cos(a)*r*176,py=60+Math.sin(a)*r*76;x.fillStyle=R()<.75?`rgba(${120+R()*80|0},${210+R()*40|0},${100+R()*40|0},${(.25+R()*.6).toFixed(2)})`:`rgba(255,226,140,${(.3+R()*.6).toFixed(2)})`;x.fillRect(px,py,1.3,1.3);}x.restore();
    if(t>=6){for(let i=0;i<20;i++){const a=R()*TAU,r=Math.sqrt(R()),px=150+Math.cos(a)*r*150,py=66+Math.sin(a)*r*58;glow(x,px,py,11,"255,190,90",.6);x.fillStyle="rgba(255,226,160,.95)";x.beginPath();x.arc(px,py,1.7,0,TAU);x.fill();}
      layer(x,y=>{y.fillStyle="rgba(255,236,190,.16)";for(let i=0;i<7;i++){const a=Math.PI*.36+i*.05;y.beginPath();y.moveTo(150,0);y.lineTo(150+Math.cos(a)*700,Math.sin(a)*700);y.lineTo(150+Math.cos(a+.03)*700,Math.sin(a+.03)*700);y.closePath();y.fill();}},"lighter",.8);}});
  sparks(x,R,10+t*12,150,330,280,300,"210,255,140",false);
  if(t===1){layer(x,y=>glow(y,150,208,50,"170,255,140",.8));x.strokeStyle="rgba(200,255,170,.95)";x.lineWidth=2.2;x.beginPath();x.moveTo(150,232);x.quadraticCurveTo(148,214,150,198);x.stroke();x.fillStyle="rgba(190,255,160,.95)";x.beginPath();x.ellipse(140,198,10,5,-.5,0,TAU);x.fill();x.beginPath();x.ellipse(160,194,11,5,.5,0,TAU);x.fill();}
  if(t===2)fig(x,()=>outline(x,R,"170,240,130",520));
  if(t>=3)fig(x,()=>{inside(x,()=>{x.fillStyle="#08200F";x.fillRect(50,80,200,230);layer(x,y=>{y.save();y.clip(FIG);nebula(y,R,["90,200,90","210,200,90"],12,150,200,200,220,.5);y.restore();},"lighter",.9);
      for(let i=0;i<150+t*20;i++){const p=INNER[(R()*INNER.length)|0];x.fillStyle=R()<.7?`rgba(${110+R()*80|0},${200+R()*50|0},${90+R()*40|0},.85)`:"rgba(240,215,120,.9)";x.beginPath();x.ellipse(p[0],p[1],2.6,1.2,R()*TAU,0,TAU);x.fill();}});
    rim(x,"200,245,150",1.2,t>=5?16:10);if(t>=4)dissolve(x,R,"210,255,160",300+t*90,-.5);});}
/* ---- every other badge: its symbol, glowing in a nebula, with rings of light as it grows ---- */
function other(x,k,t,R){const P=(typeof BADGE_PAL!=="undefined"&&BADGE_PAL[k])||["#120A26","#3A2470",["#9A7CF0","#E59ACB","#FFE6B0"]],[b1,b2,gl]=P,hex=h=>{const n=parseInt(h.slice(1),16);return `${n>>16&255},${n>>8&255},${n&255}`;};
  bg(x,[[0,"#030209"],[.6,b1],[1,"#030209"]]);layer(x,y=>nebula(y,R,[hex(gl[0]),hex(gl[1]),hex(b2)],6+t*3,150,180,300,280,.2+t*.05));stars(x,R,60+t*30,0,H,.03);
  if(t>=3){x.save();x.globalCompositeOperation="lighter";for(let r=0;r<t-2;r++){const rad=70+r*18;for(let i=0;i<160;i++){const a=R()*TAU,j=(R()-.5)*4;x.fillStyle=`rgba(${hex(gl[r%3])},${(.2+R()*.6).toFixed(2)})`;x.fillRect(150+Math.cos(a)*(rad+j),176+Math.sin(a)*(rad+j),1.2,1.2);}}x.restore();}
  layer(x,y=>glow(y,150,176,60+t*12,hex(gl[0]),.55+t*.05));
  try{const M=typeof MOTIF!=="undefined"?MOTIF[k]:null;if(M){const p=new Path2D(M);x.save();x.translate(102,128);x.scale(4,4);x.lineCap="round";x.lineJoin="round";x.globalCompositeOperation="lighter";x.shadowColor=gl[2];x.shadowBlur=10+t*4;x.strokeStyle="rgba(255,255,255,.95)";x.lineWidth=1.1;x.stroke(p);x.restore();}}catch(e){}
  if(t>=5)sparks(x,R,40+t*10,150,320,260,300,hex(gl[2]),false);}
function render(k,tier){prep();const c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d"),t=Math.max(1,Math.min(6,tier||1)),key=k+t,R=rng([...key].reduce((a,ch)=>a*31+ch.charCodeAt(0),7));
  try{({fire,water,air,earth,space})[k]?({fire,water,air,earth,space})[k](x,t,R):other(x,k,t,R);}catch(e){bg(x,[[0,"#1A1426"],[1,"#3A2A5A"]]);}
  x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation="source-over";x.globalAlpha=1;const f=x.createLinearGradient(0,H*.62,0,H);f.addColorStop(0,"rgba(0,0,0,0)");f.addColorStop(1,"rgba(0,0,0,.72)");x.fillStyle=f;x.fillRect(0,0,W,H);
  return c.toDataURL("image/jpeg",.9);}
/* paint a few at a time after the page appears; a dark placeholder shows until each is ready */
const PAL={fire:["#1A0703","#050201"],water:["#04192B","#01060C"],air:["#4F7FC0","#F0C7A6"],earth:["#06180C","#020703"],space:["#090A26","#02030B"]};
const enc=s=>encodeURIComponent(s).replace(/\(/g,"%28").replace(/\)/g,"%29").replace(/'/g,"%27");
function ph(k,t){const p=PAL[k]||["#16122A","#07060C"];return "data:image/svg+xml;utf8,"+enc(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 4'><desc>ekph-${k}-${t}</desc><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${p[0]}'/><stop offset='1' stop-color='${p[1]}'/></linearGradient><rect width='3' height='4' fill='url(#g)'/></svg>`);}
function pump(){const t0=performance.now();while(Q.length&&performance.now()-t0<14){const [k,t]=Q.shift(),key=k+t;if(!CACHE[key])CACHE[key]=render(k,t);QK.delete(key);
    document.querySelectorAll(`[style*="ekph-${k}-${t}"]`).forEach(e=>{e.style.backgroundImage=`url(${CACHE[key]})`;});}
  if(Q.length)requestAnimationFrame(pump);else pumping=false;}
badgeArt=function(k,tier){const t=Math.max(1,Math.min(6,tier||1)),key=k+t;if(CACHE[key])return CACHE[key];if(!QK.has(key)){QK.add(key);Q.push([k,t]);if(!pumping){pumping=true;requestAnimationFrame(pump);}}return ph(k,t);};
/* cards know their tier, so the frame (drawn by CSS on the card's own arch) can grow with it */
if(typeof badgeCard==="function"){const bc=badgeCard;badgeCard=function(k,i,size){return bc(k,i,size).replace('<span class="bcard2','<span data-tier="'+(i+1)+'" class="bcard2');};}
window.EKBADGE={art:badgeArt,render};
})();
