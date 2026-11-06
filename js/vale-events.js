"use strict";
/* ================= EMBERVALE SEASONAL EVENTS (3.4.0) =================
   Halloween (20 Oct to 2 Nov): lanterns become glowing jack-o'-lanterns, homes gain a spider web and a small
   floating ghost, and the Hometree flies orange and purple bunting. Christmas (1 Dec to 6 Jan): about one tree in
   three becomes a little Christmas tree, homes wear sparkling tinsel, and the Hometree swaps its prayer flags for
   tinsel, baubles and a star. Automatic by date (localStorage "ek-event" can force one: halloween, xmas or none). */
window.EKEVENT=(function(){
  function now(){try{const f=localStorage.getItem("ek-event");if(f)return f==="none"?null:f;}catch(e){}const d=new Date(),m=d.getMonth()+1,day=d.getDate();
    if((m===10&&day>=20)||(m===11&&day<=2))return "halloween";if(m===12||(m===1&&day<=6))return "xmas";return null;}
  const TA=Math.PI*2,glowL=(L,px,py,r,a)=>{if(L)L.push([px,py,r,a]);};
  /* a jack-o'-lantern, carved and glowing */
  function pumpkin(x,px,py,night,L,t,s){s=s||1;x.save();x.translate(px,py);x.scale(s,s);
    x.fillStyle="rgba(0,0,0,.22)";x.beginPath();x.ellipse(0,1,10,3,0,0,TA);x.fill();
    for(const [dx,w,c] of [[-5,6,"#C8561A"],[5,6,"#C8561A"],[0,7,"#E8762A"]]){x.fillStyle=c;x.beginPath();x.ellipse(dx,-7,w,7.5,0,0,TA);x.fill();}
    x.fillStyle="rgba(255,200,120,.35)";x.beginPath();x.ellipse(-2,-10,2.5,3.5,-.3,0,TA);x.fill();
    x.strokeStyle="#4A6A2A";x.lineWidth=2;x.lineCap="round";x.beginPath();x.moveTo(0,-14);x.quadraticCurveTo(1,-18,3,-19);x.stroke();
    const f=night?"#FFE27A":"#5A2A0A",flick=night&&t?.85+.15*Math.sin(t*.012):1;x.fillStyle=f;x.globalAlpha=flick;
    x.beginPath();x.moveTo(-5.5,-9);x.lineTo(-2.5,-9);x.lineTo(-4,-11.5);x.closePath();x.fill();x.beginPath();x.moveTo(2.5,-9);x.lineTo(5.5,-9);x.lineTo(4,-11.5);x.closePath();x.fill();
    x.beginPath();x.moveTo(-6,-5);x.quadraticCurveTo(0,-1,6,-5);x.lineTo(4,-4.4);x.lineTo(3,-3.2);x.lineTo(1.5,-4);x.lineTo(0,-2.6);x.lineTo(-1.5,-4);x.lineTo(-3,-3.2);x.lineTo(-4,-4.4);x.closePath();x.fill();x.globalAlpha=1;
    x.restore();if(night)glowL(L,px,py-7*s,26*s,.34);}
  /* a little ghost drifting by a home */
  function ghost(x,px,py,t,night){const b=Math.sin((t||0)*.002+px*.01)*3;x.save();x.translate(px,py+b);x.globalAlpha=night?.82:.7;
    const g=x.createRadialGradient(0,-8,1,0,-6,14);g.addColorStop(0,"#FFFFFF");g.addColorStop(1,"rgba(225,232,255,.85)");x.fillStyle=g;
    x.beginPath();x.moveTo(-7,4);x.lineTo(-7,-6);x.arc(0,-6,7,Math.PI,0);x.lineTo(7,4);for(let i=3;i>=-3;i--){const xx=i*2.33;x.lineTo(xx,i%2?2:5);}x.closePath();x.fill();
    x.fillStyle="#2A2440";x.beginPath();x.ellipse(-2.5,-7,1.2,1.7,0,0,TA);x.ellipse(2.5,-7,1.2,1.7,0,0,TA);x.fill();x.beginPath();x.ellipse(0,-3,1.2,1.4,0,0,TA);x.fill();
    if(night){x.globalAlpha=.18;x.fillStyle="#DDE6FF";x.beginPath();x.arc(0,-4,14,0,TA);x.fill();}x.restore();}
  /* a spider web in the corner of a roof */
  function web(x,px,py,r){x.save();x.translate(px,py);x.strokeStyle="rgba(240,240,250,.75)";x.lineWidth=.6;
    for(let k=0;k<=5;k++){const a=k/5*Math.PI/2;x.beginPath();x.moveTo(0,0);x.lineTo(Math.cos(a)*r,Math.sin(a)*r);x.stroke();}
    for(let ring=1;ring<=3;ring++){const rr=r*ring/3.4;x.beginPath();for(let k=0;k<=5;k++){const a=k/5*Math.PI/2,px2=Math.cos(a)*rr,py2=Math.sin(a)*rr;k?x.quadraticCurveTo(Math.cos(a-.157)*rr*.86,Math.sin(a-.157)*rr*.86,px2,py2):x.moveTo(px2,py2);}x.stroke();}
    x.fillStyle="#1A1420";x.beginPath();x.arc(r*.5,r*.62,1.6,0,TA);x.fill();x.restore();}
  /* tinsel: a sparkling garland along a curve */
  function tinsel(x,x0,y0,x1,y1,sag,t,cols){cols=cols||["#F2C744","#E8E8F2","#D9483E"];for(let i=0;i<=26;i++){const u=i/26,px=x0+(x1-x0)*u,py=y0+(y1-y0)*u+Math.sin(u*Math.PI)*sag,c=cols[i%cols.length],tw=.6+.4*Math.sin((t||0)*.006+i*1.7);
    x.fillStyle=c;x.globalAlpha=.85;x.beginPath();x.arc(px,py,1.6,0,TA);x.fill();x.globalAlpha=tw*.9;x.fillStyle="#FFFFFF";x.fillRect(px-.4,py-.4,.8,.8);}x.globalAlpha=1;}
  /* a home dressed for the season (anchored at its centre, sized by its footprint) */
  function house(x,cx,cy,w,t,night,L,ev,seed){const hh=30+w*12,rw=12+w*10;
    if(ev==="halloween"){web(x,cx-rw,cy-hh*.62,9+w*2);if(seed%2===0)ghost(x,cx+rw+6,cy-hh-6,t,night);pumpkin(x,cx-rw*.5,cy+4,night,L,t,.7);}
    if(ev==="xmas"){tinsel(x,cx-rw,cy-hh*.55,cx+rw,cy-hh*.55,6,t);tinsel(x,cx-rw*.8,cy-hh*.35,cx+rw*.8,cy-hh*.35,4,t,["#3FA85A","#F2C744","#E8E8F2"]);if(night)glowL(L,cx,cy-hh*.5,30,.18);}}
  /* a little Christmas tree */
  function xtree(x,px,py,s,t,night,L,seed){x.save();x.translate(px,py);x.scale(s,s);x.fillStyle="rgba(0,0,0,.2)";x.beginPath();x.ellipse(2,0,14,4,0,0,TA);x.fill();x.fillStyle="#5A3A22";x.fillRect(-2,-6,4,7);
    for(const [y,w,c] of [[-8,15,"#1F5A34"],[-18,12,"#26703F"],[-27,9,"#2F8048"],[-35,6,"#3A9052"]]){x.fillStyle=c;x.beginPath();x.moveTo(-w,y);x.lineTo(w,y);x.lineTo(0,y-14);x.closePath();x.fill();}
    const bc=["#D9483E","#F2C744","#5AA0E8","#E8E8F2"];for(let i=0;i<9;i++){const yy=-10-i*3.4,xx=((seed*7+i*5)%11-5)*(1-i/12);x.fillStyle=bc[(seed+i)%4];x.beginPath();x.arc(xx,yy,1.5,0,TA);x.fill();if(night)glowL(L,px+xx*s,py+yy*s,8,.12);}
    const tw=.75+.25*Math.sin((t||0)*.004+seed);x.fillStyle="#FFE27A";x.globalAlpha=tw;x.beginPath();for(let k=0;k<10;k++){const a=k/10*TA-Math.PI/2,r=k%2?1.6:4;x.lineTo(Math.cos(a)*r,-50+Math.sin(a)*r);}x.closePath();x.fill();x.globalAlpha=1;x.restore();if(night)glowL(L,px,py-50*s,18*s,.3);}
  /* the Hometree's dressing for the event (in its own scaled space) */
  function hometree(x,t,night,L,cx,cy,s,ev){const w=(t||0)/1000;
    if(ev==="xmas"){/* tinsel garlands draped across the canopy, baubles hanging below, a star on top */
      const gar=[[-140,-128,-20,-150,22],[20,-152,140,-130,22],[-110,-176,0,-196,18],[0,-196,110,-178,18],[-70,-226,70,-228,16]];gar.forEach(([a,b,c,d,sg],i)=>tinsel(x,a,b,c,d,sg+Math.sin(w*1.2+i)*1.5,t,i%2?["#E8E8F2","#F2C744"]:["#F2C744","#D9483E","#E8E8F2"]));
      const bc=["#D9483E","#F2C744","#5AA0E8","#E8E8F2","#B06AE0"];[[-118,-104],[-74,-118],[-30,-110],[24,-114],[70,-118],[118,-106],[-96,-160],[96,-164],[-46,-196],[48,-200],[0,-176]].forEach(([bx,by],i)=>{const sw=Math.sin(w*1.6+i)*1.5;
        x.strokeStyle="rgba(240,230,200,.6)";x.lineWidth=.6;x.beginPath();x.moveTo(bx,by-9);x.lineTo(bx+sw,by);x.stroke();const g=x.createRadialGradient(bx+sw-1.6,by-1.6,.5,bx+sw,by,5.5);g.addColorStop(0,"#FFFFFF");g.addColorStop(.35,bc[i%5]);g.addColorStop(1,"rgba(0,0,0,.35)");
        x.fillStyle=g;x.beginPath();x.arc(bx+sw,by+3,5.5,0,TA);x.fill();if(night&&L)L.push([cx+(bx+sw)*s,cy+(by+3)*s,14*s,.14]);});
      const tw=.8+.2*Math.sin(w*2);x.save();x.translate(0,-292);x.fillStyle="#FFE27A";x.globalAlpha=tw;x.beginPath();for(let k=0;k<10;k++){const a=k/10*TA-Math.PI/2,r=k%2?4.5:11;x.lineTo(Math.cos(a)*r,Math.sin(a)*r);}x.closePath();x.fill();x.restore();x.globalAlpha=1;if(L)L.push([cx,cy-292*s,40*s,night?.5:.25]);return true;}
    if(ev==="halloween"){/* orange and purple bunting, and jack-o'-lanterns among the branches */
      for(const [a0,a1,ph] of [[[-150,-120],[-10,-150],0],[[10,-150],[150,-126],1.7]]){const sag=18+Math.sin(w*1.3+ph)*3;x.strokeStyle="rgba(40,25,20,.7)";x.lineWidth=.8;x.beginPath();x.moveTo(...a0);x.quadraticCurveTo((a0[0]+a1[0])/2,(a0[1]+a1[1])/2+sag*2,...a1);x.stroke();
        for(let k=0;k<11;k++){const u=(k+.5)/11,px=a0[0]+(a1[0]-a0[0])*u,py=a0[1]+(a1[1]-a0[1])*u+Math.sin(u*Math.PI)*sag,sw=Math.sin(w*2.4+k*.7+ph)*2;x.fillStyle=["#F2862A","#5A2E7A","#1E1A22"][k%3];x.beginPath();x.moveTo(px-4.5,py);x.lineTo(px+4.5,py);x.lineTo(px+sw,py+11);x.closePath();x.fill();}}
      for(const [px,py] of [[-104,-150],[96,-156],[-30,-124],[40,-128]])pumpkin(x,px,py,night,null,t,.75);if(night&&L)for(const [px,py] of [[-104,-150],[96,-156],[-30,-124],[40,-128]])L.push([cx+px*s,cy+(py-6)*s,22*s,.3]);return true;}
    return false;}
  /* a little bat, wings beating */
  function bat(x,px,py,t,i){const f=Math.sin((t||0)*.02+i*1.3);x.save();x.translate(px,py);x.fillStyle="#1A1424";x.beginPath();x.ellipse(0,0,2.2,1.6,0,0,TA);x.fill();
    for(const s of [-1,1]){x.beginPath();x.moveTo(s*1.5,0);x.quadraticCurveTo(s*5,-4*f-1,s*8,-1*f);x.quadraticCurveTo(s*6,1,s*4.5,0.4);x.quadraticCurveTo(s*3,1.6,s*1.5,.6);x.closePath();x.fill();}
    x.fillStyle="#FFB04A";x.fillRect(-1,-.6,.7,.7);x.fillRect(.4,-.6,.7,.7);x.restore();}
  return {now,pumpkin,ghost,web,tinsel,house,xtree,hometree,bat};})();
