"use strict";
/* ================= HOME IN WEBGL (3.5.4) =================
   Every effect on the Home painting runs on the graphics chip: a real, shader-generated fire (layered turbulence that
   licks, narrows and breaks up, deep red at the edges to a white-hot core) burning on the logs of a background whose
   painted flame has been removed; heat shimmer rippling the air above it; living mist flowing through the valley;
   water streaming down the falls and glinting on the river; sparks, fireflies and stars as glowing particles; the moon's
   halo breathing; and the four companions breathing, their emblems glowing, firelight on their fire-facing sides.
   ek-home.js keeps the 2D renderer as a fallback for phones without WebGL. */
window.EKHOMEGL=(function(){
const HEAD="#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n";
const NOISE="float hh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float nn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hh(i),hh(i+vec2(1,0)),f.x),mix(hh(i+vec2(0,1)),hh(i+vec2(1,1)),f.x),f.y);}float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*nn(p);p*=2.03;a*=.5;}return s;}";
const VQ="attribute vec2 a;uniform vec4 R;uniform vec4 V;varying vec2 v;void main(){v=a;vec2 p=R.xy+a*R.zw;vec2 c=p*V.xy+V.zw;gl_Position=vec4(c.x,-c.y,0.,1.);}";
const F={
  tex:HEAD+"uniform sampler2D T;uniform float A;varying vec2 v;void main(){gl_FragColor=texture2D(T,v)*A;}",
  disc:HEAD+"uniform vec4 C;varying vec2 v;void main(){float d=length(v*2.-1.);float a=clamp(1.-d,0.,1.);a=a*a*(3.-2.*a);a*=a;gl_FragColor=vec4(C.rgb*C.a*a,C.a*a);}",
  fire:HEAD+NOISE+`uniform float t,fl,k;varying vec2 v;
    /* one flame: turbulence flowing upward defines its own outline, so it breaks into licking tongues */
    float flame(vec2 uv,float xo,float sc,float to){vec2 q=vec2((uv.x-.5-xo)/sc,uv.y*2.*(1.-fl*.18)/(sc*(1.+k*.12))-.25);
      float n=fbm(q*1.15-vec2(to,t*3.))*.75+fbm(q*2.6-vec2(t*.2+to,t*4.6))*.25;
      float c=1.-16.*pow(max(0.,length(q*vec2(1.8+q.y*1.5,.75))-n*max(0.,q.y+.25)),1.2);
      return clamp(n*c*(1.5-pow(1.25*uv.y/sc,4.)),0.,1.)*clamp(c,0.,1.);}
    void main(){vec2 uv=vec2(v.x,1.-v.y);
      /* a campfire is several flames: a tall one in the middle, two leaning out, a low one at the base */
      float i=max(max(flame(uv,0.,1.,0.),flame(uv,-.17,.74,3.1)),max(flame(uv,.16,.8,6.3),flame(uv,-.04,.56,9.7)));
      /* the colour of real fire as it cools: white-hot, gold, orange, deep red */
      vec3 col=vec3(1.5*i,1.5*i*i*i,i*i*i*i*i*i);
      float a=clamp(i*2.4,0.,1.)*smoothstep(0.,.05,uv.y)*(1.-pow(uv.y,3.));
      gl_FragColor=vec4(min(col,1.)*a,clamp(max(col.r,col.g)*a,0.,1.));}`,
  fog:HEAD+NOISE+"uniform float t,W;varying vec2 v;void main(){float n=fbm(vec2(v.x*W/230.-t*.045,v.y*2.6+t*.018));float e=smoothstep(0.,.35,v.y)*smoothstep(1.,.5,v.y);float a=smoothstep(.42,.8,n)*e*.5;gl_FragColor=vec4(vec3(.86,.8,.97)*a,a);}",
  falls:HEAD+NOISE+"uniform float t;varying vec2 v;void main(){float n=fbm(vec2(v.x*9.,v.y*2.2-t*1.9));float e=smoothstep(0.,.2,v.x)*smoothstep(1.,.8,v.x)*smoothstep(0.,.1,v.y)*smoothstep(1.,.75,v.y);float a=smoothstep(.55,.85,n)*e*.45;gl_FragColor=vec4(vec3(.92,.94,1.)*a,a);}",
  river:HEAD+NOISE+"uniform float t;varying vec2 v;void main(){float n=fbm(vec2(v.x*26.+t*.35,v.y*7.-t*.12));float g=pow(smoothstep(.68,.93,n),2.)*.7*smoothstep(0.,.25,v.y)*smoothstep(1.,.7,v.y);gl_FragColor=vec4(vec3(1.,.97,.92)*g,g);}",
  haze:HEAD+NOISE+"uniform sampler2D T;uniform vec4 R;uniform vec2 S;uniform float t,s;varying vec2 v;void main(){vec2 o=vec2(fbm(vec2(v.x*5.,v.y*4.-t*2.2))-.5,fbm(vec2(v.x*5.+4.,v.y*4.-t*2.))-.5)*s*(1.-v.y*.3);vec2 uv=(R.xy+v*R.zw)/S+o;float m=smoothstep(0.,.3,v.x)*smoothstep(1.,.7,v.x)*smoothstep(0.,.35,v.y)*smoothstep(1.,.75,v.y);vec4 c=texture2D(T,uv);gl_FragColor=vec4(c.rgb*m,m);}",
  pts:HEAD+"varying vec4 vc;void main(){float d=length(gl_PointCoord*2.-1.);float a=clamp(1.-d,0.,1.);a=a*a;gl_FragColor=vec4(vc.rgb*vc.a*a,vc.a*a);}"};
const VP="attribute vec2 p;attribute float s;attribute vec4 c;uniform vec4 V;uniform float Z;varying vec4 vc;void main(){vec2 q=p*V.xy+V.zw;gl_Position=vec4(q.x,-q.y,0.,1.);gl_PointSize=s*Z;vc=c;}";
function create(cv,IMG,P,FIRE,IW,IH,FX){FX=FX||{fog:[790,850,905],stars:[330,20,930,440],flies:[640,1460],ffront:[1420,1640],moon:[290,377],falls:[690,796,104,98],river:[560,898,381,90]};const K=FIRE.k||1;let gl=null,force=false;try{force=localStorage.getItem("ek-gl-force")==="1";}catch(e){}
  /* only with real graphics hardware: if the browser would emulate WebGL on the processor, the 2D renderer is used instead */
  try{gl=cv.getContext("webgl",{alpha:false,antialias:false,premultipliedAlpha:true,powerPreference:"low-power",failIfMajorPerformanceCaveat:!force});}catch(e){}
  if(!gl||!IMG.bgnf)return null;
  const mk=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;};
  const prog=(vs,fs)=>{const p=gl.createProgram();gl.attachShader(p,mk(gl.VERTEX_SHADER,vs));gl.attachShader(p,mk(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));
    const u={},n=gl.getProgramParameter(p,gl.ACTIVE_UNIFORMS);for(let i=0;i<n;i++){const a=gl.getActiveUniform(p,i);u[a.name]=gl.getUniformLocation(p,a.name);}return {p,u};};
  let PR={},PP=null;try{for(const k in F)if(k!=="pts")PR[k]=prog(VQ,F[k]);PP=prog(VP,F.pts);}catch(e){console.warn("Home WebGL unavailable:",e.message);return null;}
  const quad=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]),gl.STATIC_DRAW);
  const pbuf=gl.createBuffer(),PMAX=520,pdata=new Float32Array(PMAX*7);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);
  const tex=im=>{const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;};
  const T={bg:tex(IMG.bgnf)};for(const k in P)if(IMG[k])T[k]=tex(IMG[k]);
  let V=[1,1,0,0],Z=1,lost=false;cv.addEventListener("webglcontextlost",e=>{e.preventDefault();lost=true;});
  const R=Math.random,TAU=Math.PI*2;
  const flies=Array.from({length:30},(_,i)=>({x:R()*IW,y:FX.flies[0]+R()*(FX.flies[1]-FX.flies[0]),ax:20+R()*50,ay:14+R()*36,sx:.08+R()*.18,sy:.06+R()*.16,p:R()*TAU,b:R()*TAU,bs:.6+R()*1.4,s:.5+R()*.7,front:i<6}));
  for(const f of flies)if(f.front)f.y=FX.ffront[0]+R()*(FX.ffront[1]-FX.ffront[0]);
  const stars=Array.from({length:30},()=>({x:FX.stars[0]+R()*(FX.stars[2]-FX.stars[0]),y:FX.stars[1]+R()*(FX.stars[3]-FX.stars[1]),p:R()*TAU,s:.6+R()*1.6,r:.6+R()*.9}));
  const sparks=[],smoke=[],flame=[];
  const gauss=()=>(R()+R()+R()-1.5)/1.5;
  function feed(dt,fl,f){const rate=(175+fl*180)*(.85+.3*f)*dt;for(let n=0;n<rate+(R()<rate%1?1:0);n++){if(flame.length>=320)break;const tall=R()<.12;
      flame.push({x:FIRE.x+gauss()*62*K,y:FIRE.base-8*K-R()*14*K,vx:(R()-.5)*16*K,vy:-(tall?370+R()*130:235+R()*110)*(1+fl*.35)*K,age:0,life:(tall?1:.74)+R()*.45,s:(58+R()*38)*K,sd:R()*TAU});}}
  function burn(t,dt){for(let i=flame.length-1;i>=0;i--){const q=flame[i];q.age+=dt;if(q.age>=q.life){flame.splice(i,1);continue;}
      q.vx+=-(q.x-FIRE.x)*2.2*dt+Math.sin(t*9+q.sd)*40*K*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;}
    points(flame.map(q=>{const u=q.age/q.life,s=q.s*(1-u*.78);let c;
      if(u<.18)c=[1,.93,.66];else if(u<.42)c=[1,.72,.26];else if(u<.7)c=[1,.42,.1];else c=[.85,.18,.05];
      return [q.x,q.y,s,c[0],c[1],c[2],.42*Math.pow(1-u,1.15)];}));}
  const blendNormal=()=>gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA),blendAdd=()=>gl.blendFunc(gl.ONE,gl.ONE);
  function use(pr){gl.useProgram(pr.p);const loc=gl.getAttribLocation(pr.p,"a");gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);gl.uniform4fv(pr.u.V,V);}
  function rect(pr,x,y,w,h){gl.uniform4f(pr.u.R,x,y,w,h);gl.drawArrays(gl.TRIANGLES,0,6);}
  function img(k,x,y,w,h,a){const pr=PR.tex;use(pr);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,T[k]);gl.uniform1i(pr.u.T,0);gl.uniform1f(pr.u.A,a==null?1:a);rect(pr,x,y,w,h);}
  function disc(x,y,rx,ry,r,g,b,a){const pr=PR.disc;use(pr);gl.uniform4f(pr.u.C,r,g,b,a);rect(pr,x-rx,y-ry,rx*2,ry*2);}
  function points(list){if(!list.length)return;const n=Math.min(PMAX,list.length);for(let i=0;i<n;i++){const q=list[i],o=i*7;pdata[o]=q[0];pdata[o+1]=q[1];pdata[o+2]=q[2];pdata[o+3]=q[3];pdata[o+4]=q[4];pdata[o+5]=q[5];pdata[o+6]=q[6];}
    gl.useProgram(PP.p);gl.bindBuffer(gl.ARRAY_BUFFER,pbuf);gl.bufferData(gl.ARRAY_BUFFER,pdata.subarray(0,n*7),gl.DYNAMIC_DRAW);
    const lp=gl.getAttribLocation(PP.p,"p"),ls=gl.getAttribLocation(PP.p,"s"),lc=gl.getAttribLocation(PP.p,"c");
    gl.enableVertexAttribArray(lp);gl.vertexAttribPointer(lp,2,gl.FLOAT,false,28,0);gl.enableVertexAttribArray(ls);gl.vertexAttribPointer(ls,1,gl.FLOAT,false,28,8);gl.enableVertexAttribArray(lc);gl.vertexAttribPointer(lc,4,gl.FLOAT,false,28,12);
    gl.uniform4fv(PP.u.V,V);gl.uniform1f(PP.u.Z,Z);gl.drawArrays(gl.POINTS,0,n);gl.disableVertexAttribArray(lp);gl.disableVertexAttribArray(ls);gl.disableVertexAttribArray(lc);}
  function comp(k,t){const p=P[k];if(!T[k])return;const br=Math.sin(t*TAU/p.per+p.ph),sy=1+.012*br,sx=1-.005*br,w=p.w*sx,h=p.h*sy;
    blendNormal();disc(p.x+p.w/2,p.y+p.h-4,p.w*.48,p.w*.09,.07,.03,.13,.7);                                   /* resting on the grass */
    img(k,p.x+p.w/2-w/2,p.y+p.h-h,w,h);
    blendAdd();const ey=p.y+p.h-(p.h*(1-p.emb))*sy,c=p.col.split(",").map(v=>v/255);disc(p.x+p.w/2,ey,p.w*.22,p.w*.22,c[0],c[1],c[2],.16+.12*(br+1)/2);}
  function rim(k,f){const p=P[k];blendAdd();disc(p.x+(p.side>0?p.w*.9:p.w*.1),p.y+p.h*.66,p.w*.42,p.w*.42,1,.55,.22,.08+.07*f);}
  function render(t,dt,s){if(lost)return false;const {W,H,d,sc,ox,oy}=s,pw=Math.round(W*d),ph=Math.round(H*d);
    gl.viewport(0,0,pw,ph);V=[2*sc/W,2*sc/H,2*ox/W-1,2*oy/H-1];Z=sc*d;gl.clearColor(.03,.02,.06,1);gl.clear(gl.COLOR_BUFFER_BIT);gl.enable(gl.BLEND);
    const tw=t%1000,f=s.flick,fl=s.flare;
    blendNormal();img("bg",0,0,IW,IH);
    /* heat shimmer: the painting itself, rippling in the air above the fire */
    use(PR.haze);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,T.bg);gl.uniform1i(PR.haze.u.T,0);gl.uniform2f(PR.haze.u.S,IW,IH);gl.uniform1f(PR.haze.u.t,tw);gl.uniform1f(PR.haze.u.s,.006+fl*.004);const hz=[FIRE.x-100*K,FIRE.top-240*K,200*K,250*K];gl.uniform4f(PR.haze.u.R,hz[0],hz[1],hz[2],hz[3]);rect(PR.haze,hz[0],hz[1],hz[2],hz[3]);
    /* the moon breathes; stars twinkle */
    blendAdd();if(FX.moon){const hb=.75+.25*Math.sin(t*.5);disc(FX.moon[0],FX.moon[1],135,135,1,.92,.74,.34*hb);}
    points(stars.map(q=>{const a=Math.max(0,Math.sin(t*q.s+q.p));return [q.x,q.y,9*q.r,1,1,1,a*a*.9];}));
    /* living mist through the valley */
    blendNormal();use(PR.fog);gl.uniform1f(PR.fog.u.t,tw);gl.uniform1f(PR.fog.u.W,IW);if(FX.fog&&FX.fog.length){const fy0=Math.min(...FX.fog)-60,fy1=Math.max(...FX.fog)+55;rect(PR.fog,0,fy0,IW,fy1-fy0);}
    /* water: streaming down the falls, glinting on the river */
    blendAdd();if(FX.falls){use(PR.falls);gl.uniform1f(PR.falls.u.t,tw);rect(PR.falls,FX.falls[0],FX.falls[1],FX.falls[2],FX.falls[3]);}if(FX.river){use(PR.river);gl.uniform1f(PR.river.u.t,tw);rect(PR.river,FX.river[0],FX.river[1],FX.river[2],FX.river[3]);}
    const fly=front=>points(flies.filter(q=>q.front===front).map(q=>{const bl=Math.max(0,Math.sin(t*q.bs+q.b));return [q.x+Math.sin(t*q.sx+q.p)*q.ax,q.y+Math.sin(t*q.sy+q.p*1.3)*q.ay,22*q.s*(front?1.6:1),.86,1,.6,.15+.85*bl*bl];}));
    fly(false);
    comp("siro",t);comp("ava",t);rim("siro",f);rim("ava",f);
    /* the fire: light on the ground and stones, the shader flame, its inner light, sparks and smoke */
    blendAdd();disc(FIRE.x,FIRE.base+6*K,330*K*(1+fl*.2),120*K,1,.55,.2,(.3+.1*f)*(1+fl*.5));disc(FIRE.x,FIRE.base-200*K,480*K,430*K,1,.5,.2,(.1+.04*f)*(1+fl*.5));
    blendAdd();feed(dt,fl,f);burn(t,dt);
    blendAdd();disc(FIRE.x,FIRE.base-60*K,70*K,90*K,1,.75,.35,.22+.12*f);
    const rate=(6+fl*40)*dt;for(let n=0;n<rate+(R()<rate%1?1:0);n++)if(sparks.length<70)sparks.push({x:FIRE.x+(R()-.5)*60*K,y:FIRE.base-(140+R()*60)*K,vx:(R()-.5)*40*K,vy:-(60+R()*90)*(1+fl*.5)*K,l:1,d:.8+R()*.7,s:.7+R()*1.1,p:R()*TAU});
    for(let i=sparks.length-1;i>=0;i--){const q=sparks[i];q.l-=dt*q.d;if(q.l<=0){sparks.splice(i,1);continue;}q.x+=(q.vx+Math.sin(t*2+q.p)*22)*dt;q.y+=q.vy*dt;}
    points(sparks.map(q=>[q.x,q.y,7*q.s,1,.72,.35,Math.min(1,q.l*1.4)]));
    if(R()<dt*1.2)smoke.push({x:FIRE.x+(R()-.5)*24*K,y:FIRE.base-330*K,r:22*K,l:1,vx:(4+R()*8)*K});
    blendNormal();for(let i=smoke.length-1;i>=0;i--){const m=smoke[i];m.l-=dt/6;if(m.l<=0){smoke.splice(i,1);continue;}m.y-=26*dt;m.x+=m.vx*dt;m.r+=12*dt;disc(m.x,m.y,m.r,m.r,.78,.74,.88,.07*m.l);}
    comp("soma",t);comp("orra",t);rim("soma",f);rim("orra",f);
    blendAdd();fly(true);return true;}
  return {render};}
return {create};})();
