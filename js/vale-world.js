"use strict";
/* ================= EMBERVALE VALLEY (layout) =================
   A 36 x 36 valley (it grew from 24 x 24 for room to breathe): a river down the eastern side, meadows, bush,
   and a home clearing around the hearth at the centre.
   The valley opens up as you practise: the explored area grows with your progress (mist covers the rest).
   Everything you earn sits on the grid with its own footprint, so nothing can overlap. */
const EVW=(()=>{
const N=36,HC=18,HR=18,K=N/24,sc=p=>[Math.round(p[0]*K),Math.round(p[1]*K)],A=EVA,inb=(c,r,w,h)=>c>=0&&r>=0&&c+w<=N&&r+h<=N;
const hash=s=>{let h=7;for(const ch of String(s))h=(h*31+ch.charCodeAt(0))>>>0;return h;};
const CN={soma:"Soma",siro:"Siro",orra:"Orra",ava:"Ava"},DEC_DEF=[[15,8],[7,7],[9,16],[16,16],[5,14],[12,17]].map(sc);
/* the river: two tiles wide, meandering down the east of the valley, never jumping more than one tile a row */
const RIVER=(()=>{const rows=[];let c=27;for(let r=0;r<N;r++){const want=Math.round(27+3.3*Math.sin(r*.22+.5)-(r>22?(r-22)*.3:0));c=r?Math.max(c-1,Math.min(c+1,want)):want;rows.push(c);}return rows;})();
const RSET=new Set();RIVER.forEach((c,r)=>{RSET.add(r*N+c);RSET.add(r*N+c+1);});
/* the river comes down from the mountains and ends in a lake near the foot of the valley: shore, ripples, lily pads
   and reeds. The lake's tiles count as water, so nothing is ever built or grown on it */
const LAKE={c:RIVER[N-4]+1,r:N-3,rx:118,ry:58};
for(let r=N-8;r<N;r++)for(let c=LAKE.c-6;c<=LAKE.c+6;c++){if(c<0||c>=N)continue;const dx=((c+.5)-(r+.5)-(LAKE.c-LAKE.r))*32,dy=((c+.5)+(r+.5)-(LAKE.c+LAKE.r))*16;if((dx/(LAKE.rx+14))**2+(dy/(LAKE.ry+8))**2<=1)RSET.add(r*N+c);}
const RLINE=[[RIVER[0]+1,-9],[RIVER[0]+1,0],...RIVER.slice(0,N-5).map((c,r)=>[c+1,r+.5]),[LAKE.c,LAKE.r]];/* 2.7.3: on into the mist, never ending in the grass */
/* fixed meadow detail, so the ground looks the same every visit */
const PATCHES=(()=>{const R=A.rnd(5),o=[];for(let i=0;i<158;i++)o.push({c:R()*N,r:R()*N,rx:.8+R()*2.4,ry:.6+R()*1.6,a:R()*3,tone:(R()-.5)*.1});return o;})();
const TUFTS=(()=>{const R=A.rnd(11),o=[];for(let i=0;i<1000;i++)o.push([R()*N,R()*N]);return o;})();
const DOTS=(()=>{const R=A.rnd(3),o=[];for(let i=0;i<520;i++)o.push([R()*N,R()*N]);return o;})();
const dist=(c,r)=>Math.hypot(c+.5-HC,r+.5-HR);
function talked(c){try{const v=chats[c],a=Array.isArray(v)?v:(v&&(v.list||v.messages))||[];return a.some(m=>m&&m.role==="user");}catch(e){return false;}}
function total(){try{return valeTotal();}catch(e){return 0;}}
/* layouts saved on the old 12 x 12 world move to the same spot in the middle of the new valley */
function migrate(){try{if(profile.vN!==N){const grow=o=>{if(!o)return;for(const k of Object.keys(o))if(Array.isArray(o[k]))o[k]=sc(o[k]);};grow(profile.vplace);if(profile.valeGridV===2)grow(profile.valeGrid);profile.vN=N;saveProfile();}}catch(e){}
  try{if(profile.valeGrid&&profile.valeGridV!==2){const g={};for(const [k,v] of Object.entries(profile.valeGrid))if(Array.isArray(v))g[k]=sc([v[0]+6,v[1]+6]);profile.valeGrid=g;profile.valeGridV=2;saveProfile();}}catch(e){}}
/* pieces grown from practice: [id, element, level, kind, w, h, default spot, what it's for] */
const EARNED=[["cabin","fire",2,"cabin",2,2,[8,8],"A little cabin by the fire. Somewhere warm to come back to after practice."],
 ["longhouse","fire",4,"longhouse",3,2,[11,6],"A longhouse for the whole village, raised from many days of tending the fire."],
 ["spring","water",0,"spring",1,1,[14,9],"Where the water first rises. It feeds a stream down to the river."],
 ["pond","water",2,"pond",2,2,[7,14],"A still pond with lilies, for slowing down and noticing."],
 ["lake","water",5,"lake",3,3,[20,13],"A wide, still lake: calm that has grown deep over time."],
 ["sapling","earth",0,"sap",1,1,[9,6],"A sapling. Every great tree starts here."],
 ["flowers0","earth",1,"flowers",1,1,[8,12],"Wildflowers: small moments of joy along the way."],["flowers1","earth",1,"flowers",1,1,[13,15],"Wildflowers: small moments of joy along the way."],["flowers2","earth",1,"flowers",1,1,[6,10],"Wildflowers: small moments of joy along the way."],
 ["young","earth",2,"young",1,1,[15,12],"A young tree, growing a little every time you show up."],
 ["garden","earth",3,"garden",2,2,[10,15],"A vegetable garden: small daily care becoming nourishment."],
 ["orchard","earth",4,"orchard",2,2,[5,6],"An orchard. Patience that bears fruit."],
 ["ancient","earth",5,"ancient",2,2,[4,10],"The Hometree: a great old tree hung with lanterns, prayer flags and ribbons, grown from long practice."],
 ["flags","air",3,"flags",1,1,[14,7],"Wind flags, carrying each breath out on the breeze."]];
/* the eco village: built with Embercoins */
const VILLAGE={home:{era:0,name:"Eco home",w:2,h:2,price:250,max:6,cat:"Homes",purpose:"A round earth home with a living roof, where the village rests. Each one makes the valley feel more like home."},
 pod:{era:0,name:"Meditation pod",w:1,h:1,price:300,max:4,cat:"Practice spaces",purpose:"A small, quiet dome for sitting. One person, one breath at a time."},
 yoga:{era:1,name:"Yoga shala",w:2,h:2,price:450,max:2,cat:"Practice spaces",purpose:"An open timber deck among the trees, for movement and breath."},
 hall:{era:2,name:"Practice hall",w:3,h:3,price:1200,max:1,cat:"Practice spaces",purpose:"The heart of practice: a round hall with a sky lantern, for breathwork and sitting together."},
 zen:{era:1,name:"Zen garden",w:2,h:2,price:450,max:2,cat:"Stillness",purpose:"Raked sand and still stones. Watch thoughts settle like ripples."},
 pool:{era:1,name:"Reflection pool",w:2,h:2,price:500,max:2,cat:"Stillness",purpose:"Still water that mirrors the sky. A place to look inward and let the day settle."},
 circle:{era:0,name:"Gathering circle",w:2,h:2,price:350,max:2,cat:"Gathering",purpose:"Stone seats around a small fire, where the village comes together to share."},
 library:{era:2,name:"Library",w:3,h:3,price:900,max:1,cat:"Gathering",purpose:"Timber, glass and a living roof. Home to the teachings and stories of the valley."},
 ashram:{era:3,name:"Retreat ashram",w:3,h:3,price:1500,max:1,cat:"Gathering",purpose:"A tiered pavilion for deep retreat: slow days of practice and rest."}};
const VDEF={home:[[6,18],[9,19],[14,19],[17,17],[3,7],[18,9]],pod:[[16,5],[3,12],[16,10],[6,4]],yoga:[[5,20],[19,19]],hall:[[2,15]],zen:[[7,3],[17,21]],pool:[[15,21],[2,19]],circle:[[11,19],[9,2]],library:[[13,2]],ashram:[[1,2]]};
const GROUND=new Set(["spring","pond","lake","garden","zen","pool"]);
const mins=m=>m<1?Math.round(m*60)+" seconds":m+" minute"+(m===1?"":"s");
function pieces(pv){const lv={};ORDER_SC.forEach(k=>lv[k]=pv?6:valeLevel(k));const out=[],add=(id,name,kind,w,h,def,o)=>out.push(Object.assign({id,name,kind,w,h,def,ground:GROUND.has(kind)},o||{}));
  add("fire","The hearth","fire",3,3,[HC-1,HR-1],{lv:Math.max(1,lv.fire||0),auto:1,open:1,purpose:"The heart of your valley. Everything gathers around the fire."});
  add("soma","Soma","comp",1,1,[HC-2,HR],{who:"soma",auto:1,open:1,purpose:"Soma keeps the fire and is always here to sit with you."});
  [["orra",[HC,HR-2]],["siro",[HC,HR+2]],["ava",[HC+2,HR]]].forEach(([c,d])=>add(c,CN[c],"comp",1,1,d,{who:c,auto:1,open:1,purpose:CN[c]+(talked(c)?" sits by the fire with you.":" sits by the fire, there whenever you want to talk.")}));
  add("jacaranda","A jacaranda","jac",1,1,sc([10,8]),{open:1,cat:"nature",purpose:"A jacaranda to start your valley. Plant it wherever feels right; it flowers purple in spring."});
  for(const [id,el,i,kind,w,h,def,purpose] of EARNED)add(id,VALE.els[el].items[i],kind,w,h,sc(def),{earned:el,cat:el==="earth"?"nature":"practice",open:lv[el]>i,purpose,need:"Grows with "+mins(VALE.steps[i])+" of "+VALE.els[el].from.toLowerCase()+"."});
  const own=pv?{home:3,pod:2,yoga:1,hall:1,zen:1,pool:1,circle:1,library:1,ashram:1}:(profile.vown||{});
  const lvls=profile.vlvl||{};for(const [k,v] of Object.entries(VILLAGE))for(let i=0;i<Math.min(v.max,own[k]||0);i++){const id="v:"+k+":"+i;add(id,v.name,k,v.w,v.h,sc(VDEF[k][i]||VDEF[k][0]),{village:k,cat:"village",open:1,lvl:pv?5:Math.max(1,Math.min(5,lvls[id]||1)),purpose:v.purpose});}
  let dec=[];try{dec=decorItems();}catch(e){}
  dec.forEach((d,i)=>add("d_"+d.id,d.label,"decor",1,1,DEC_DEF[i%DEC_DEF.length],{art:d.art,open:1,decor:1,cat:"seasonal",purpose:"A seasonal piece for your valley, here for a while."}));
  return {list:out,lv};}
/* thin doubled road strips to single paths: a tile goes only if it sits in a 2x2 block of road and its neighbours
   stay connected without it; building doors always stay */
function thin(map,doorList){const S=new Set(map.keys()),K=(c,r)=>r*N+c,keepK=new Set((doorList||[]).map(d=>K(d.c,d.r)));
  const nb=i=>{const c=i%N,r=(i-c)/N;return [[c+1,r],[c-1,r],[c,r+1],[c,r-1]].filter(([a,b])=>a>=0&&b>=0&&a<N&&b<N&&S.has(K(a,b))).map(([a,b])=>K(a,b));};
  const in22=i=>{const c=i%N,r=(i-c)/N;return [[0,0],[-1,0],[0,-1],[-1,-1]].some(([dc,dr])=>{const a=c+dc,b=r+dr;return [[a,b],[a+1,b],[a,b+1],[a+1,b+1]].every(([x,y])=>x>=0&&y>=0&&x<N&&y<N&&S.has(K(x,y)));});};
  const joined=ns=>{if(ns.length<2)return true;const seen=new Set([ns[0]]),q=[ns[0]];while(q.length&&seen.size<600){const v=q.shift();for(const w of nb(v))if(!seen.has(w)){seen.add(w);q.push(w);}}return ns.every(x=>seen.has(x));};
  let changed=true,guard=0;while(changed&&guard++<6){changed=false;for(const i of [...S]){if(keepK.has(i)||!in22(i))continue;const ns=nb(i);S.delete(i);if(joined(ns))changed=true;else S.add(i);}}
  return [...S].map(i=>map.get(i));}
function bfs(start,goal,blocked){const k=p=>p[1]*N+p[0],prev=new Map([[k(start),null]]),q=[start];
  for(let qi=0;qi<q.length;qi++){const p=q[qi];if(goal(p)){const out=[];let cur=p;while(cur){out.unshift(cur);cur=prev.get(k(cur));}return out;}
    for(const [dc,dr] of [[0,1],[1,0],[-1,0],[0,-1]]){const n=[p[0]+dc,p[1]+dr];if(!inb(n[0],n[1],1,1)||prev.has(k(n))||blocked(n))continue;prev.set(k(n),p);q.push(n);}}
  return [];}
function compute(){migrate();const pv=!!VALE.preview,{list,lv}=pieces(pv),R=pv?99:(6+17*Math.min(1,total()/30))*K,legacy=!pv&&profile.vV!==3;
  const place=pv?{}:(profile.vplace||{}),old=pv?{}:(profile.valeGrid||{}),cat={lv};
  const occ=new Array(N*N).fill(null),seen=new Uint8Array(N*N),items=[],bridgeOn=cat.lv.water>=4,br=HR+1,rc=RIVER[br],road=new Set(bridgeOn?[br*N+rc-1,br*N+rc+2]:[]);
  for(let c=0;c<N;c++)for(let r=0;r<N;r++){if(dist(c,r)<=R)seen[r*N+c]=1;if(RSET.has(r*N+c))occ[r*N+c]="river";}
  const fits=(c,r,w,h,self)=>{if(!inb(c,r,w,h))return false;for(let i=c;i<c+w;i++)for(let j=r;j<r+h;j++){if(!seen[j*N+i]||road.has(j*N+i))return false;const o=occ[j*N+i];if(o&&o!==self)return false;}return true;};
  const near=(c,r,w,h)=>{for(let d=1;d<N;d++)for(let dc=-d;dc<=d;dc++)for(let dr=-d;dr<=d;dr++)if(Math.max(Math.abs(dc),Math.abs(dr))===d&&fits(c+dc,r+dr,w,h))return [c+dc,r+dr];return null;};
  /* only what's been placed stands in the valley; everything else waits in the Build library (the fire and companions are always there) */
  for(const it of list){if(!it.open)continue;const mine=Array.isArray(place[it.id])?place[it.id]:Array.isArray(old[it.id])?old[it.id]:null;if(!pv&&!it.auto&&!(it.id in place)&&(!legacy||it.id==="jacaranda"))continue;
    let p=mine&&fits(mine[0],mine[1],it.w,it.h)?mine:(fits(it.def[0],it.def[1],it.w,it.h)?it.def:near(it.def[0],it.def[1],it.w,it.h));
    if(!p)continue;it.c=p[0];it.r=p[1];it.placed=1;for(let i=it.c;i<it.c+it.w;i++)for(let j=it.r;j<it.r+it.h;j++)occ[j*N+i]=it.id;items.push(it);}
  /* valleys from before the library keep everything exactly where it stood */
  let eraUp=null,eraFrom=null;if(!pv){const ei=eraOf(total());if(profile.vEra==null){profile.vEra=ei;try{saveProfile();}catch(e){}}else if(ei>profile.vEra){eraFrom=profile.vEra;profile.vEra=ei;eraUp=ei;try{saveProfile();}catch(e){}}}
  if(legacy){profile.vplace=profile.vplace||{};items.forEach(it=>{if(!it.auto)profile.vplace[it.id]=[it.c,it.r];});profile.vV=3;try{saveProfile();}catch(e){}}
  const taken=n=>!!occ[n[1]*N+n[0]],tiles=new Map(),doors=[],fire=items.find(i=>i.id==="fire");let bridge=null,front=()=>null;
  if(fire){const ring=new Set();for(let i=fire.c-1;i<=fire.c+fire.w;i++)for(let j=fire.r-1;j<=fire.r+fire.h;j++)if(inb(i,j,1,1)&&!(i>=fire.c&&i<fire.c+fire.w&&j>=fire.r&&j<fire.r+fire.h))ring.add(i+","+j);
    const toFire=(s,extra)=>{if(!inb(s[0],s[1],1,1)||(taken(s)&&!extra))return;bfs(s,p=>ring.has(p[0]+","+p[1]),n=>taken(n)&&!(extra&&extra(n))).forEach(t=>tiles.set(t[1]*N+t[0],t));};
    /* paths lead to doors. Every building draws its door at the front of its footprint, facing down the screen, so
       each path starts from the free tile nearest that spot (usually the one at the front corner) rather than from
       the middle of the building's left side, where it used to run under the base and miss the door. */
    front=b=>{const cx=(b.c+b.w/2)-(b.r+b.h/2),cy=(b.c+b.w/2)+(b.r+b.h/2),fy=(b.c+b.w)+(b.r+b.h);let best=null,bd=1e9;
      for(let i=b.c-1;i<=b.c+b.w;i++)for(let j=b.r-1;j<=b.r+b.h;j++){if(i>=b.c&&i<b.c+b.w&&j>=b.r&&j<b.r+b.h)continue;if(!inb(i,j,1,1)||taken([i,j]))continue;
        const tx=i-j,ty=i+j+1;if(ty<cy)continue;const d=Math.hypot((tx-cx)*2,ty-fy);if(d<bd){bd=d;best=[i,j];}}return best;};
    items.filter(i=>i.kind==="cabin"||i.kind==="longhouse"||(i.village&&i.w>1&&i.kind!=="zen"&&i.kind!=="pool")).forEach(b=>{const s0=front(b);if(!s0)return;toFire(s0);
      if(tiles.has(s0[1]*N+s0[0]))doors.push({c:s0[0],r:s0[1],kind:b.kind,bc:b.c,br:b.r,w:b.w,h:b.h});});
    if(bridgeOn){bridge={c:rc,r:br,len:2};toFire([rc+2,br],n=>n[1]===br&&(n[0]===rc||n[0]===rc+1));}}
  /* ---------- roads are yours to lay (2.8) ----------
     Preview shows the designed valley. Your own valley draws only the roads you have laid. The first time, the roads
     you already had become yours (doubled strips thinned to single paths) and lantern paths lead to the zen garden and
     the pool. Road tiles: p = path, l = lantern path (grass, stepping stones, small lights), z = plaza paving. */
  const key=(c,r)=>r*N+c,LAN=new Map();
  /* single paths, never doubled strips: thin the design first (for Preview and for the first move into your own roads) */
  if(pv||!profile.vroads){const keep=thin(tiles,doors);tiles.clear();keep.forEach(t=>tiles.set(key(t[0],t[1]),t));}
  items.filter(i=>i.kind==="zen"||i.kind==="pool").forEach(it=>{const s0=front(it);if(!s0||!tiles.size)return;
    const way=bfs(s0,p=>tiles.has(key(p[0],p[1])),n=>taken(n));way.forEach(t=>{if(!tiles.has(key(t[0],t[1])))LAN.set(key(t[0],t[1]),t);});});
  let lpath=[],plaza=[],zpath=[],ustream=[],ubridge=[];
  if(pv)lpath=[...LAN.values()];
  else{if(!profile.vroads){const rd={};tiles.forEach(t=>{rd[t[0]+","+t[1]]="p";});LAN.forEach(t=>{const k=t[0]+","+t[1];if(!rd[k])rd[k]="l";});
      profile.vroads=rd;if(bridge)profile.vbridge=bridge;try{saveProfile();}catch(e){}}
    const roads=profile.vroads;tiles.clear();doors.length=0;bridge=profile.vbridge||null;
    for(const [k,t] of Object.entries(roads)){const [c,r]=k.split(",").map(Number);if(!inb(c,r,1,1)||occ[key(c,r)])continue;const p=[c,r];if(t==="l")lpath.push(p);else if(t==="z")plaza.push(p);else if(t==="n")zpath.push(p);else if(t==="w"||t==="wb"){ustream.push(p);if(t==="wb")ubridge.push(p);}else tiles.set(key(c,r),p);}
    items.filter(i=>i.kind==="cabin"||i.kind==="longhouse"||(i.village&&i.w>1&&i.kind!=="zen"&&i.kind!=="pool")).forEach(b=>{const s0=front(b);if(s0&&roads[s0[0]+","+s0[1]])doors.push({c:s0[0],r:s0[1],kind:b.kind,bc:b.c,br:b.r,w:b.w,h:b.h});});
    for(const k of Object.keys(roads)){const [c,r]=k.split(",").map(Number);if(inb(c,r,1,1)&&!occ[key(c,r)])occ[key(c,r)]="road";}}
  const sp=items.find(i=>i.id==="spring"),stream=sp&&cat.lv.water>=2?bfs([sp.c,sp.r],p=>[[0,1],[1,0],[-1,0],[0,-1]].some(([a,b])=>RSET.has((p[1]+b)*N+p[0]+a)),n=>taken(n)&&occ[n[1]*N+n[0]]!=="spring"):[];
  /* the stream runs all the way into the river (it used to stop one tile short, beside it) */
  if(stream.length){const e=stream[stream.length-1];for(const [da,db] of [[0,1],[1,0],[-1,0],[0,-1]]){const c2=e[0]+da,r2=e[1]+db;if(RSET.has(r2*N+c2)&&r2>=0&&r2<N){stream.push([c2,r2]);stream.push([RIVER[r2]+.5,r2]);break;}}}
  /* the bush and meadow: forests in clusters away from home, light scatter elsewhere, clearings kept open */
  const used=new Set([...tiles.keys(),...stream.map(p=>p[1]*N+p[0])]),scen=[];
  const nearThing=(c,r)=>items.some(it=>it.kind!=="comp"&&!it.village&&c>=it.c-1&&c<it.c+it.w+1&&r>=it.r-1&&r<it.r+it.h+1);
  for(let c=0;c<N;c++)for(let r=0;r<N;r++){const k=r*N+c,d=dist(c,r);if(occ[k]||used.has(k)||d<3.2*K||nearThing(c,r))continue;
    const h=hash(c*97+r*31)%100,f=Math.sin(c*.45+1.3)*Math.cos(r*.38+.7)+Math.sin((c+r)*.21)*.6,bank=[[0,1],[1,0],[-1,0],[0,-1]].some(([a,b])=>RSET.has((r+b)*N+c+a));
    if(f>.5&&d>5.5*K){if(h<70)scen.push({c,r,kind:h%5===0?"young":h%4===0?"shrub":"gum",seed:h});}
    else if(bank&&h<30)scen.push({c,r,kind:h%2?"shrub":"young",seed:h});
    else if(h<(d>8*K?10:6))scen.push({c,r,kind:h%4===0?"rock":h%4===1?"flowers":"shrub",seed:h});}
  /* zen lanterns: walk each zen path from its ends and set a lantern whenever the last one is 3 or more tiles away,
     so lines, corners, branches, loops and single tiles all get evenly spaced lights */
  const zlan=[];{const set=new Set(zpath.map(p=>p[0]+","+p[1])),done=new Set(),D=[[0,1],[1,0],[-1,0],[0,-1]],deg=p=>D.filter(([a,b])=>set.has((p[0]+a)+","+(p[1]+b))).length,order=[];
    for(const s0 of [...zpath].sort((a,b)=>deg(a)-deg(b)||a[1]-b[1]||a[0]-b[0])){const k0=s0[0]+","+s0[1];if(done.has(k0))continue;done.add(k0);const q=[s0];
      while(q.length){const p=q.shift();order.push(p);for(const [a,b] of D){const k=(p[0]+a)+","+(p[1]+b);if(set.has(k)&&!done.has(k)){done.add(k);q.push([p[0]+a,p[1]+b]);}}}}
    for(const p of order)if(zlan.every(l=>Math.abs(l[0]-p[0])+Math.abs(l[1]-p[1])>=3))zlan.push(p);}
  return {N,pv,lv:cat.lv,items,list,occ,seen,fits,R,path:[...tiles.values()],lpath,plaza,zpath,ustream,ubridge,zlan,roads:pv?null:profile.vroads,doors,stream,scen,bridge,river:RLINE,lake:LAKE,riverSet:RSET,HC,HR,eraUp,eraFrom};}
/* the Build library: buying village buildings, placing and storing pieces */
/* one step: the building is yours only if the coins came off, and the coins come off only if you get it */
/* eras: the valley grows from a clearing to a sanctuary, and each era opens new buildings */
const ERAS=[["Clearing",0],["Hamlet",6],["Village",15],["Sanctuary",25]];
function eraOf(g){let i=0;ERAS.forEach((e,k)=>{if(g>=e[1])i=k;});return i;}
function eraInfo(){const g=total(),i=eraOf(g),n=ERAS[i+1];return {i,name:ERAS[i][0],grown:g,next:n?n[0]:null,need:n?n[1]:null,from:ERAS[i][1]};}
function buy(kind){const v=VILLAGE[kind];if(!v)return null;if((v.era||0)>eraOf(total()))return null;const own=profile.vown=profile.vown||{},n=own[kind]||0;if(n>=v.max)return null;
  if(!(window.EKECO&&EKECO.spend(v.price,v.name,true)))return null;own[kind]=n+1;try{saveProfile();}catch(e){}return "v:"+kind+":"+n;}
function place(id,c,r){profile.vplace=profile.vplace||{};profile.vplace[id]=[c,r];profile.vV=3;try{saveProfile();}catch(e){}}
/* upgrades: five levels. Each costs Embercoins, and levels 3 to 5 also need part of your valley grown through practice */
const UPCOST=[0,0,.8,1.2,1.8,2.6],UPNEED=[0,0,0,4,10,18];
function upInfo(id){const st=(profile.vlvl||{}),kind=(String(id).split(":")[1]||""),v=VILLAGE[kind];if(!v)return null;const lv=Math.max(1,Math.min(5,st[id]||1));if(lv>=5)return {lv,max:true};
  const next=lv+1,cost=Math.round(v.price*UPCOST[next]/10)*10,need=UPNEED[next],grown=total();return {lv,next,cost,need,grown,ready:grown>=need};}
function upgrade(id){const u=upInfo(id);if(!u||u.max||!u.ready)return false;const kind=String(id).split(":")[1];
  if(!(window.EKECO&&EKECO.spend(u.cost,VILLAGE[kind].name+" to level "+u.next,true)))return false;profile.vlvl=profile.vlvl||{};profile.vlvl[id]=u.next;try{saveProfile();}catch(e){}return true;}
function resetSpots(){const p=profile.vplace||{};for(const k in p)p[k]=1;delete profile.valeGrid;try{saveProfile();}catch(e){}}
/* each placed item's look: flipped, turned and sized (paths and streams excepted) */
function look(id){return (profile.vlook&&profile.vlook[id])||null;}
function setLook(id,o){profile.vlook=profile.vlook||{};const l=Object.assign({f:1,r:0,s:1},profile.vlook[id]||{},o);if(l.f===1&&!l.r&&l.s===1)delete profile.vlook[id];else profile.vlook[id]=l;try{saveProfile();}catch(e){}}
function store(id){if(profile.vplace)delete profile.vplace[id];try{saveProfile();}catch(e){}}
function lanterns(st){const n=st.pv?12:Math.min(16,(profile.lanterns||0)+(st.lv.fire>=2?4:0));return st.path.filter((p,i)=>i%2===1).slice(0,n);}
return {N,HC,HR,compute,lanterns,PATCHES,TUFTS,DOTS,RIVER,VILLAGE,buy,place,store,look,setLook,resetSpots,upInfo,upgrade,ERAS,eraInfo};
})();
