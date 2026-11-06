"use strict";
/* ================= EMBERVALE WILDLIFE (3.4.0) =================
   The field guide's 26 birds, flowers, creatures and night-sky sights, drawn for real. Once found they live in the
   valley: birds perch in its trees, flowers grow in small patches, creatures potter about (the platypus and the swan
   keep to the water), and constellations rise in the night sky. The complete view shows them all. In the field guide,
   found ones are shown in full colour; the rest are glowing silhouettes, a tease of what's out there. */
const EVF=(()=>{const TA=Math.PI*2,K=(c)=>c;
const E=(x,cx,cy,rx,ry,c,rot)=>{x.fillStyle=c;x.beginPath();x.ellipse(cx,cy,rx,ry,rot||0,0,TA);x.fill();};
const T=(x,pts,c)=>{x.fillStyle=c;x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.fill();};
const eye=(x,px,py,r,c)=>{E(x,px,py,r,r,c||"#14100C");E(x,px-r*.35,py-r*.35,r*.35,r*.35,"#FFFFFF");};
/* birds face right, standing on (0,0) */
function bird(x,id,t){const b=Math.sin((t||0)*.004+id.length)*.6;x.save();x.translate(0,b*.3);x.strokeStyle="#5A4030";x.lineWidth=1;x.beginPath();x.moveTo(-1,-3);x.lineTo(-2,0);x.moveTo(2,-3);x.lineTo(2,0);x.stroke();
  const P={kookaburra:["#8C6A4F","#F1E6D2","#F1E6D2","#6E5440","#7A5C42","#3A3028",9],magpie:["#1C1C1E","#1C1C1E","#F4F4F4","#F4F4F4","#1C1C1E","#B9B4AE",6],lorikeet:["#3FA34D","#3E66D6","#F26A2A","#2F8A3C","#3FA34D","#E8402A",4],
    fairywren:["#8C7A66","#2F7FE0","#D9D0C2","#7A6A58","#2F6FD0","#2A2420",3],lyrebird:["#7A5C44","#7A5C44","#9C826A","#5E4632","#6E5440","#2A2420",4],frogmouth:["#8E8578","#9A9184","#B5AC9C","#7A7266","#8E8578","#5A5248",5],
    cockatoo:["#F2EFE6","#F2EFE6","#FFFFFF","#E2DED2","#F2EFE6","#2A2A2A",4],swan:["#1E1E22","#1E1E22","#2A2A30","#2A2A30","#1E1E22","#D9383A",6],wagtail:["#1C1C1E","#1C1C1E","#F4F4F4","#1C1C1E","#1C1C1E","#2A2A2A",3]}[id]||["#888","#888","#AAA","#777","#888","#333",4];
  const [body,head,belly,wing,tail,beak,bl]=P;
  if(id==="lyrebird"){x.strokeStyle="#B8946A";x.lineWidth=1.6;for(const s of [-1,1]){x.beginPath();x.moveTo(-8,-10);x.bezierCurveTo(-20,-18+s*4,-26,-34,-16+s*5,-42);x.stroke();}x.strokeStyle="rgba(230,215,190,.75)";x.lineWidth=.6;for(let k=0;k<9;k++){x.beginPath();x.moveTo(-8,-10);x.quadraticCurveTo(-18+k,-26,-22+k*1.6,-38+Math.abs(k-4));x.stroke();}}
  else if(id==="wagtail"){for(let k=-2;k<=2;k++)T(x,[[-7,-9],[-17,-12+k*2.4],[-17,-9+k*2.4]],tail);}
  else if(id==="fairywren")T(x,[[-6,-10],[-11,-24],[-8,-25],[-3,-11]],tail);
  else T(x,[[-7,-10],[-16,-6],[-15,-3],[-6,-7]],tail);
  if(id==="swan"){E(x,0,-6,12,5.5,body);E(x,-3,-7,7,3.5,"#2E2E36");x.strokeStyle=body;x.lineWidth=3.2;x.lineCap="round";x.beginPath();x.moveTo(8,-8);x.bezierCurveTo(13,-14,6,-20,10,-26);x.stroke();E(x,11,-27,3,2.6,head);T(x,[[13,-28],[19,-26],[13,-25.6]],beak);E(x,18.4,-26.4,.8,.7,"#FFFFFF");E(x,11.6,-27.8,.7,.7,"#E8E8E8");x.restore();return;}
  if(id==="frogmouth"){E(x,0,-11,7,10,body);for(let k=0;k<10;k++)E(x,-4+(k%3)*4,-16+Math.floor(k/3)*4,1.4,.8,"rgba(70,60,50,.5)",.4);E(x,1,-21,6.5,5.5,head);T(x,[[3,-19],[9,-18],[3,-16]],"#6A6058");eye(x,0,-22,1.4,"#F2C744");eye(x,4.2,-22,1.4,"#F2C744");x.restore();return;}
  E(x,0,-9,9,6,body);E(x,1,-7,6,3.6,belly);E(x,-2,-10,6,3.6,wing,-.2);
  if(id==="magpie"){E(x,-2,-11,4,2,"#F4F4F4",-.2);E(x,5,-15.4,2.2,1.6,"#F4F4F4");}
  const hr=id==="kookaburra"?5.6:4.3,hx=id==="kookaburra"?7:6.5,hy=id==="kookaburra"?-16:-15;E(x,hx,hy,hr,hr*.95,head);
  if(id==="kookaburra"){x.fillStyle="#5A4030";x.fillRect(hx-4,hy-.6,8,1.4);}
  if(id==="fairywren"){E(x,hx,hy-1.4,3.4,2.2,"#5BB8FF");x.fillStyle="#141C30";x.fillRect(hx-3,hy+.6,6,1.2);}
  if(id==="lorikeet")E(x,4,-10,3.6,3,"#F2C744");
  if(id==="wagtail"){x.strokeStyle="#F4F4F4";x.lineWidth=.8;x.beginPath();x.moveTo(hx-1,hy-2.2);x.lineTo(hx+2.4,hy-2.4);x.stroke();}
  if(id==="cockatoo")for(let k=0;k<5;k++)T(x,[[hx-1+k*.6,hy-3],[hx-6+k*1.2,hy-11+k*.8],[hx-.2+k*.6,hy-3.4]],"#F2CC3A");
  T(x,[[hx+hr*.7,hy-1.4],[hx+hr*.7+bl,hy+.2],[hx+hr*.7,hy+1.6]],beak);eye(x,hx+1.2,hy-1,1.15);x.restore();}
/* flowers, from the ground up */
function flower(x,id,t){const sw=Math.sin((t||0)*.0016+id.length)*.08;x.save();x.transform(1,0,sw,1,0,0);x.strokeStyle="#3E7A3A";x.lineWidth=1.3;
  const stems=n=>{for(let k=0;k<n;k++){const dx=(k-(n-1)/2)*4;x.beginPath();x.moveTo(dx*.4,0);x.quadraticCurveTo(dx*.7,-8,dx,-14-k%2*3);x.stroke();E(x,dx*.6-2,-6,3,1.2,"#4E8A44",-.6);}};
  if(id==="waratah"){stems(1);for(let k=0;k<6;k++)T(x,[[0,-12],[-8+k*3.2,-10],[-6+k*2.4,-14]],"#B8282E");for(let r=0;r<3;r++)for(let k=0;k<6-r;k++)E(x,-5+r*1.6+k*2,-16-r*3,1.6,1.6,r%2?"#E0444A":"#C8323C");}
  else if(id==="wattle"){x.strokeStyle="#5E8A4A";x.lineWidth=1.2;for(let k=0;k<3;k++){x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(-6+k*6,-10,-8+k*8,-20);x.stroke();}for(let k=0;k<16;k++)E(x,-9+(k*5)%18,-13-(k*7)%10,1.9,1.9,k%2?"#F2C744":"#E8B830");}
  else if(id==="flannel"){stems(2);for(const [cx,cy] of [[-2,-15],[4,-19]]){for(let k=0;k<10;k++){const a=k/10*TA;E(x,cx+Math.cos(a)*3,cy+Math.sin(a)*2,2.6,1.1,"#F4F0E4",a);E(x,cx+Math.cos(a)*4.6,cy+Math.sin(a)*3,.7,.5,"#9CB890",a);}E(x,cx,cy,1.6,1.3,"#8A9A70");}}
  else if(id==="bottlebrush"){x.strokeStyle="#5A4030";x.lineWidth=1.4;x.beginPath();x.moveTo(0,0);x.lineTo(0,-24);x.stroke();x.strokeStyle="#D84A3C";x.lineWidth=.8;for(let k=0;k<16;k++){const y=-8-k;x.beginPath();x.moveTo(-3.6,y);x.lineTo(3.6,y);x.stroke();}x.fillStyle="#F2D06A";for(let k=0;k<16;k+=2){E(x,-3.8,-8-k,.5,.5,"#F2D06A");E(x,3.8,-8-k,.5,.5,"#F2D06A");}}
  else if(id==="kangaroopaw"){x.strokeStyle="#5C7A3A";x.lineWidth=1.5;for(const d of [-4,4]){x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(d*.5,-12,d,-20);x.stroke();for(let k=0;k<3;k++)T(x,[[d,-20+k*2],[d+4+k,-24+k*2],[d+5+k,-22+k*2],[d+1,-18+k*2]],k%2?"#E06A3A":"#D9583A");}}
  else if(id==="banksia"){x.strokeStyle="#5A4030";x.lineWidth=1.6;x.beginPath();x.moveTo(0,0);x.lineTo(0,-10);x.stroke();for(const s of [-1,1])T(x,[[0,-8],[s*10,-12],[s*9,-10],[s*7,-11],[s*6,-9]],"#4E7A44");E(x,0,-18,4.4,9,"#D99A3C");for(let k=0;k<12;k++)E(x,-2.6+(k%3)*2.6,-24+Math.floor(k/3)*3.6,.9,.9,"#B8742A");}
  else if(id==="jacbloom"){x.strokeStyle="#6A4A30";x.lineWidth=2;x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(2,-12,-2,-20);x.stroke();for(let k=0;k<14;k++)E(x,-8+(k*5)%16,-20-(k*3)%9,2.6,2.2,k%2?"#9C7BDA":"#B49AEA");}
  x.restore();}
/* creatures, from the ground up */
function creature(x,id,t){const w=Math.sin((t||0)*.002+id.length);x.save();
  if(id==="wombat"){E(x,0,-7,11,7.5,"#8A7360");E(x,8,-9,5,4.6,"#9A8370");E(x,5.4,-13,1.6,1.6,"#7A6350");E(x,12.4,-8.6,1.8,1.4,"#3A2A20");eye(x,9.6,-10.4,.9);for(const d of [-6,4])E(x,d,-.6,2.4,1.4,"#6E5A48");}
  else if(id==="echidna"){E(x,0,-6,10,6,"#6B5440");x.strokeStyle="#EDE0C8";x.lineWidth=1;for(let k=0;k<14;k++){const a=Math.PI+.2+k/13*(Math.PI-.4);x.beginPath();x.moveTo(Math.cos(a)*7,-6+Math.sin(a)*4.4);x.lineTo(Math.cos(a)*11.6,-6+Math.sin(a)*7.6);x.stroke();}x.strokeStyle="#4A3A2A";x.lineWidth=1.8;x.lineCap="round";x.beginPath();x.moveTo(9,-5);x.lineTo(16,-3.6+w*.4);x.stroke();eye(x,8.4,-6.6,.8);}
  else if(id==="bluetongue"){x.fillStyle="#7A6A58";x.beginPath();x.moveTo(-16,-2);x.quadraticCurveTo(-4,-8,8,-4);x.quadraticCurveTo(13,-3.4,14,-2);x.quadraticCurveTo(4,0,-16,-2);x.fill();for(let k=0;k<5;k++)E(x,-10+k*4,-4.6,1.4,2.4,"#4A3E32");eye(x,10.6,-3.6,.7);
    if(w>.3){x.strokeStyle="#4F79B8";x.lineWidth=1.4;x.beginPath();x.moveTo(14,-2.4);x.lineTo(17.4,-2.2);x.stroke();}}
  else if(id==="platypus"){E(x,0,1,16,3.4,"rgba(140,200,230,.35)");E(x,0,-2.6,9,4.2,"#6E5A47");E(x,-10,-2,4.6,2.2,"#5A4838");E(x,10.6,-2.8,4,1.8,"#3A3A40");eye(x,6.4,-4.4,.8);}
  else if(id==="possum"){x.strokeStyle="#3E3A38";x.lineWidth=3.2;x.lineCap="round";x.beginPath();x.moveTo(-6,-6);x.quadraticCurveTo(-16,-4,-14,6);x.stroke();E(x,0,-8,7,6,"#8A8684");E(x,1,-6,4.4,3.2,"#E6E0D8");E(x,6,-14,4.4,4,"#8A8684");
    T(x,[[4,-17],[3.4,-22],[6.6,-17.6]],"#7A7674");T(x,[[7,-17.4],[8.6,-22],[9.4,-16.6]],"#7A7674");E(x,10,-13.2,1.2,1,"#E89AA8");eye(x,7,-15,1.2);}
  x.restore();}
/* constellations (drawn at their own small scale, centred) */
const SKY={crux:[[0,-14,2.6],[0,14,2.2],[-10,1,2.2],[9,-3,1.8],[4,7,1.2]],saucepan:[[-8,-4,1.8],[0,-2,1.8],[8,0,1.8],[2,8,1.2],[3,13,1.6],[4,18,1.2],[-14,-16,2.4],[14,14,2.6]],
  scorpius:[[-16,-14,1.6],[-12,-8,1.6],[-6,-4,2.8],[0,0,1.6],[4,6,1.4],[6,12,1.4],[10,16,1.4],[16,16,1.4],[19,12,1.6],[17,7,1.2]],emu:[],milkyway:[]};
function sky(x,id,t){x.save();const tw=k=>.7+.3*Math.sin((t||0)*.003+k*1.9);
  if(id==="milkyway"||id==="emu"){const g=x.createLinearGradient(-26,-20,26,20);g.addColorStop(0,"rgba(200,190,255,0)");g.addColorStop(.5,"rgba(220,210,255,.45)");g.addColorStop(1,"rgba(200,190,255,0)");x.fillStyle=g;x.beginPath();x.ellipse(0,0,30,8,-.6,0,TA);x.fill();
    for(let k=0;k<26;k++){const u=(k*37%26)/26-.5,v=((k*13)%9-4)/4;E(x,u*50*Math.cos(.6)+v*4,-u*50*Math.sin(.6)*1+v*4,.5+(k%3)*.3,.5+(k%3)*.3,`rgba(255,255,255,${(.5+.5*tw(k)).toFixed(2)})`);}
    if(id==="emu"){x.fillStyle="rgba(20,16,36,.75)";x.beginPath();x.ellipse(-8,6,9,4.6,-.6,0,TA);x.fill();x.lineWidth=2.4;x.strokeStyle="rgba(20,16,36,.75)";x.beginPath();x.moveTo(-2,2);x.quadraticCurveTo(6,-6,10,-14);x.stroke();E(x,11,-15,2.4,2,"rgba(20,16,36,.8)");}}
  else{const S=SKY[id]||[];x.strokeStyle="rgba(190,210,255,.25)";x.lineWidth=.6;x.beginPath();S.forEach((s,i)=>{if(id!=="crux"||i<2)i?x.lineTo(s[0],s[1]):x.moveTo(s[0],s[1]);});if(id==="crux"){x.moveTo(S[2][0],S[2][1]);x.lineTo(S[3][0],S[3][1]);}x.stroke();
    S.forEach((s,i)=>{const r=s[2]*tw(i),c=id==="scorpius"&&i===2?"255,140,110":"235,240,255",g=x.createRadialGradient(s[0],s[1],0,s[0],s[1],r*3);g.addColorStop(0,`rgba(${c},.95)`);g.addColorStop(1,`rgba(${c},0)`);x.fillStyle=g;x.beginPath();x.arc(s[0],s[1],r*3,0,TA);x.fill();});}
  x.restore();}
let G=[];function list(){if(!G.length){try{G=window.EKFG?EKFG.all():[];}catch(e){}}return G;}
function draw1(x,id,kind,t){if(kind==="bird")bird(x,id,t);else if(kind==="flower")flower(x,id,t);else if(kind==="creature")creature(x,id,t);else sky(x,id,t);}
/* field guide pictures, cached */
const IMG={};function img(id,kind,found){const k=id+(found?1:0);if(IMG[k])return IMG[k];const S=120,c=document.createElement("canvas");c.width=c.height=S;const x=c.getContext("2d");
  const bg={bird:["#1E3A5A","#4A7AA8"],flower:["#1E3A2A","#4A7A52"],creature:["#2E2418","#6A5438"],sky:["#0A0E24","#24285A"]}[kind]||["#222","#444"],g=x.createLinearGradient(0,0,0,S);g.addColorStop(0,bg[0]);g.addColorStop(1,bg[1]);x.fillStyle=g;x.fillRect(0,0,S,S);
  const art=document.createElement("canvas");art.width=art.height=S;const a=art.getContext("2d");a.translate(S/2,kind==="sky"?S/2:S*.8);const sc=kind==="sky"?1.9:kind==="flower"?2.6:kind==="creature"?3:2.5;a.scale(sc,sc);if(kind==="bird")a.translate(0,id==="lyrebird"?6:id==="swan"?2:4);draw1(a,id,kind,0);
  if(!found&&kind==="sky"){x.globalAlpha=.3;x.drawImage(art,0,0);x.globalAlpha=1;x.fillStyle="rgba(255,255,255,.85)";x.font="800 22px sans-serif";x.textAlign="center";x.fillText("?",S-18,28);}
  else if(!found){a.setTransform(1,0,0,1,0,0);a.globalCompositeOperation="source-in";a.fillStyle="#141A2A";a.fillRect(0,0,S,S);x.save();x.shadowColor="rgba(160,200,255,.85)";x.shadowBlur=14;x.globalAlpha=.95;x.drawImage(art,0,0);x.restore();
    x.fillStyle="rgba(255,255,255,.85)";x.font="800 22px sans-serif";x.textAlign="center";x.fillText("?",S-18,28);}
  else{if(kind==="sky"){x.drawImage(art,0,0);}else{x.fillStyle="rgba(0,0,0,.25)";x.beginPath();x.ellipse(S/2,S*.82,34,7,0,0,TA);x.fill();x.drawImage(art,0,0);}}
  return IMG[k]=c.toDataURL("image/png");}
/* where each one lives in the valley (fixed for a given valley, so they're always in the same place) */
let ckey="",spots=[];const H=(s)=>{let h=2166136261;for(const ch of s)h=Math.imul(h^ch.charCodeAt(0),16777619);return h>>>0;};
function place(st){const fg=(typeof profile!=="undefined"&&profile.fg)||{},pv=!!(st.pv||(window.VALE&&VALE.preview)),key=[pv,Object.keys(fg).sort().join(),st.R,st.items.length].join("|");if(key===ckey)return spots;ckey=key;spots=[];
  const N=EVW.N,A=EVA,own=list().filter(g=>pv||fg[g[0]]);if(!own.length)return spots;
  const open=[],water=[];for(let r=1;r<N-1;r++)for(let c=1;c<N-1;c++){const i=r*N+c;if(!st.seen[i])continue;const d=Math.hypot(c+.5-st.HC,r+.5-st.HR);if(d>st.R-.5)continue;const o=st.occ[i];if(o==="river"||o==="lake"){water.push([c,r]);continue;}if(!o&&d>2.6)open.push([c,r]);}
  const trees=(st.scen||[]).filter(o=>(o.kind==="gum"||o.kind==="young")&&Math.hypot(o.c+.5-st.HC,o.r+.5-st.HR)<st.R+1);
  const used=new Set(),pick=(arr,id)=>{if(!arr.length)return null;let i=H(id)%arr.length;for(let n=0;n<arr.length;n++){const p=arr[(i+n)%arr.length],k=p[0]+","+p[1];if(!used.has(k)){used.add(k);return p;}}return null;};
  for(const g of own){const [id,,kind]=g;if(kind==="sky"){spots.push({id,kind,sky:true});continue;}
    if(kind==="bird"&&id!=="swan"){const tr=trees.length?trees[H(id)%trees.length]:null;if(tr){const m=A.tileCenter(tr.c,tr.r);spots.push({id,kind,x:m[0]+(H(id)%3-1)*9,y:m[1]-30-(H(id+"y")%3)*6,d:tr.c+tr.r+1.52,s:.9});continue;}}
    const p=(id==="platypus"||id==="swan")&&water.length?pick(water,id):pick(open,id);if(!p)continue;const m=A.tileCenter(p[0],p[1]);
    if(kind==="flower")for(let k=0;k<3;k++)spots.push({id,kind,x:m[0]+(k-1)*9,y:m[1]+(k%2)*5,d:p[0]+p[1]+1+k*.01,s:.85});
    else spots.push({id,kind,x:m[0],y:m[1]+4,d:p[0]+p[1]+1.2,s:kind==="creature"?.9:.95,walk:kind==="creature"&&id!=="platypus"});}
  return spots;}
function frame(st,t){const out=[];for(const s of place(st)){if(s.sky)continue;let x0=s.x;if(s.walk&&t)x0+=Math.sin(t*.00035+H(s.id)%7)*7;out.push({d:s.d,x:x0,y:s.y,s:s.s,id:s.id,kind:s.kind,flip:s.walk&&t?Math.cos(t*.00035+H(s.id)%7)<0:false});}return out;}
function draw(x,f,t){x.save();x.translate(f.x,f.y);x.scale(f.flip?-f.s:f.s,f.s);draw1(x,f.id,f.kind,t);x.restore();}
/* constellations in the night sky above the valley */
function skies(x,st,t,night){if(!night)return;const sp=place(st).filter(s=>s.sky);if(!sp.length)return;const N=EVW.N,top=EVA.P(0,0);
  sp.forEach((s,i)=>{const px=top[0]+(i-(sp.length-1)/2)*120,py=top[1]-120-(i%2)*46;x.save();x.translate(px,py);x.scale(1.5,1.5);sky(x,s.id,t);x.restore();});}
return {img,frame,draw,skies,art:draw1};})();
