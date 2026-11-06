"use strict";
/* ================= JOURNEYS (2.6): travelling through Embervale into a practice =================
   Architecture: the world you already know (the fire, its hills and companions) stays the real scene. A single
   WebGL layer draws only what the existing renderers can't: the deepening sky, warp streaks, the wormhole and the
   night sky above the valley where meditation happens. One timeline drives both, so the camera, the light, the
   sound and the screens move together.
   Fire to meditation: the camera lifts off the fire (the ground and companions fall away beneath you, the sky
   moves slowly, embers stream past), the sky deepens to night, the stars stretch, a wormhole carries you up, and
   it opens into the night sky above Embervale, with the valley's curve below and the fire as one warm point of
   light. Meditation happens there. "Return to the fire" makes the same journey back down.
   Tap during a journey to arrive at once. Low-stim mode and reduced motion use a short, still crossfade instead.
   Basic Display turns journeys off. No WebGL: the camera still lifts, with a soft fade instead of the wormhole. */
window.EKJ=(function(){
const $=s=>document.querySelector(s),app=$("#app");
const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v);}catch(e){return null;}};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),sm=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const still=()=>(typeof calm!=="undefined"&&calm)||!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);
const enabledNow=()=>ls("ek-journey")!=="off"&&!(typeof simple!=="undefined"&&simple);

/* ---------- the WebGL layer: one full-screen shader, nothing to download ---------- */
const FS=`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;uniform float uT,uStar,uVeil,uWarp,uTun,uZ,uOpen,uCos,uEmb,uLift,uSpd,uMode;uniform sampler2D uTex;
float h(vec2 p){p=fract(p*vec2(233.34,851.73));p+=dot(p,p+23.45);return fract(p.x*p.y);}
float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n2(p);p=mat2(1.6,1.2,-1.2,1.6)*p+vec2(3.1,7.7);a*=.5;}return v;}
float starL(vec2 q,float d){vec2 id=floor(q),f=fract(q)-.5;float r=h(id);if(r<d)return 0.;vec2 o=vec2(h(id+1.3),h(id+7.1))-.5;
  float s=length(f-o*.7);float tw=.65+.35*sin(uT*(1.+r*3.)+r*40.);return smoothstep(.03+.1*(r-d)/(1.-d),0.,s)*tw;}
vec2 rot(vec2 p,float a){float c=cos(a),s=sin(a);return vec2(c*p.x-s*p.y,s*p.x+c*p.y);}
void main(){
  vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;vec2 c=p-vec2(0.,.06);float r=length(c),a=atan(c.y,c.x);
  /* the cached night sky comes first, so nothing else is computed while you sit */
  if(uMode>.5){vec3 sky;
    if(uMode<1.5){vec2 cq=p*1.2+vec2(uT*.004,0.);float nb=fbm(cq*1.8+vec2(0.,uT*.006)),nb2=fbm(cq*3.5-vec2(uT*.004,0.)+nb);
      vec3 nc=mix(vec3(.10,.05,.22),vec3(.36,.17,.5),nb2);nc=mix(nc,vec3(.12,.30,.42),smoothstep(.55,.85,nb)*.5);
      nc+=vec3(.9,.45,.2)*smoothstep(.6,.9,nb2*nb*1.6)*.22;sky=mix(vec3(.02,.015,.05),nc,smoothstep(.25,.9,nb)*.85);
      vec2 pc=p-vec2(0.,-1.62);float pr=length(pc),R=1.28;
      if(pr<R+.01){float pl=smoothstep(R+.004,R-.004,pr);sky=mix(sky,mix(vec3(.03,.025,.04),vec3(.07,.055,.08),n2(pc*6.)*.6+n2(pc*13.)*.4),pl);}
      sky+=vec3(1.,.62,.3)*exp(-abs(pr-R)*40.)*.55+vec3(.4,.6,1.)*exp(-abs(pr-R)*12.)*.12*step(R,pr);
      gl_FragColor=vec4(sky,1.);return;}
    sky=texture2D(uTex,gl_FragCoord.xy/uRes).rgb;
    float cs=starL(rot(p,uT*.003)*24.,.88)+starL(p*48.+2.,.93)*.8+starL(p*90.+7.,.96)*.6;
    sky+=vec3(1.,.96,.9)*cs*step(1.29,length(p-vec2(0.,-1.62)));
    vec2 hp=p-vec2(0.,-1.62+1.28-.012);float hd=length(hp*vec2(1.,1.4));sky+=vec3(1.,.7,.35)*(exp(-hd*90.)*1.2+exp(-hd*22.)*.25)*(.85+.15*sin(uT*2.3));
    gl_FragColor=vec4(sky,1.);return;}
  /* each part is only computed while it is on screen (uniform branches cost almost nothing on a GPU) */
  /* the sky deepening above the valley */
  vec3 col=mix(vec3(.015,.012,.04),vec3(.08,.05,.17),smoothstep(-.7,.5,p.y))*uVeil;float al=uVeil;
  vec3 light=vec3(0.);
  /* stars, drifting down as the camera rises */
  if(uStar*(1.-uTun)>.001){vec2 sq=p+vec2(0.,uLift*.35);
    float st=starL(sq*22.,.9)+starL(sq*40.+3.7,.94)*.75+starL(sq*72.+9.1,.965)*.55;
    light+=vec3(1.,.95,.88)*st*uStar*(1.-uWarp*.85)*(1.-uTun);}
  /* warp: the stars stretch into streaks that pour outward */
  if(uWarp>.001){vec2 wq=vec2(a*30./6.2832,log(r+.001)*4.-uZ*1.7);vec2 wid=floor(wq),wf=fract(wq);
    float lane=smoothstep(.07,0.,abs(wf.x-.5-(h(wid+2.)-.5)*.6));float len=mix(.05,.95,uWarp);
    float seg=smoothstep(len,len*.4,abs(wf.y-.5)*2.);light+=mix(vec3(.85,.8,1.),vec3(1.,.75,.5),h(wid+5.))*lane*seg*step(.8,h(wid))*uWarp*smoothstep(.02,.2,r)*1.4;}
  /* embers from the fire, streaming past as you rise */
  if(uEmb>.001){float em=0.;for(int i=0;i<14;i++){float fi=float(i);float sp=.3+h(vec2(fi,3.1))*.6;
      float y=fract(h(vec2(fi,9.3))-uLift*sp*1.9+uT*.04*sp)*2.4-1.2;vec2 d=p-vec2((h(vec2(fi,1.7))-.5)*.62+.03*sin(uT*1.3+fi),y);
      float bl=.0035+uSpd*.03;em+=exp(-d.x*d.x*42000.-d.y*d.y/(bl*bl))*(.5+.5*h(vec2(fi,5.)));}
    light+=vec3(1.,.62,.28)*em*uEmb*1.6;}
  col+=light;
  /* the wormhole: bands of ember and violet light rushing past */
  if(uTun>.001){float tv=.42/(r+.02)+uZ,sw=a/6.2832*3.+tv*.05+uT*.03;
    float f1=fbm(vec2(sw*6.,tv*1.3)),f2=fbm(vec2(sw*12.+5.,tv*2.7));
    float band=smoothstep(.38,.85,f1)*.95+smoothstep(.55,.95,f2)*.65;
    vec3 tc=mix(vec3(.32,.13,.58),vec3(1.,.56,.24),smoothstep(.3,.9,f2));tc=mix(tc,vec3(.55,.75,1.),smoothstep(.75,1.,f1)*.45);
    vec3 tun=tc*band*smoothstep(0.,.32,r)*1.35+vec3(1.,.93,.82)*exp(-r*9.)*1.6+vec3(.5,.35,.9)*exp(-r*3.)*.35;
    tun*=smoothstep(uOpen*1.5-.3,uOpen*1.5,r);
    col=mix(col,tun+light*.3,uTun);al=mix(al,1.,uTun);
    col+=vec3(1.,.9,.95)*exp(-abs(r-uOpen*1.5)*14.)*sin(uOpen*3.1416)*uTun*.9;}
  /* the night sky above Embervale: nebula, stars, the curve of the valley below and the fire's one warm point */
  /* the calm night sky in two layers: mode 1 paints the slow part (nebula, the valley's curve) into a texture now
     and then; mode 2 draws that texture plus the live part (twinkling stars, the fire's point of light) */
  if(uCos>.001){vec2 cq=p*1.2+vec2(uT*.004,0.);float nb=fbm(cq*1.8+vec2(0.,uT*.006)),nb2=fbm(cq*3.5-vec2(uT*.004,0.)+nb);
    vec3 nc=mix(vec3(.10,.05,.22),vec3(.36,.17,.5),nb2);nc=mix(nc,vec3(.12,.30,.42),smoothstep(.55,.85,nb)*.5);
    nc+=vec3(.9,.45,.2)*smoothstep(.6,.9,nb2*nb*1.6)*.22;
    vec3 cs_=mix(vec3(.02,.015,.05),nc,smoothstep(.25,.9,nb)*.85);
    float cs=starL(rot(p,uT*.003)*24.,.88)+starL(p*48.+2.,.93)*.8+starL(p*90.+7.,.96)*.6;cs_+=vec3(1.,.96,.9)*cs;
    vec2 pc=p-vec2(0.,-1.62);float pr=length(pc),R=1.28;
    if(pr<R+.01){float pl=smoothstep(R+.004,R-.004,pr);cs_=mix(cs_,mix(vec3(.03,.025,.04),vec3(.07,.055,.08),n2(pc*6.)*.6+n2(pc*13.)*.4),pl);}
    cs_+=vec3(1.,.62,.3)*exp(-abs(pr-R)*40.)*.55+vec3(.4,.6,1.)*exp(-abs(pr-R)*12.)*.12*step(R,pr);
    vec2 hp=p-vec2(0.,-1.62+R-.012);float hd=length(hp*vec2(1.,1.4));cs_+=vec3(1.,.7,.35)*(exp(-hd*90.)*1.2+exp(-hd*22.)*.25)*(.85+.15*sin(uT*2.3));
    col=mix(col,cs_,uCos);al=mix(al,1.,uCos);}
  gl_FragColor=vec4(col,al);}`;
const VS="attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const GL=(function(){
  /* compiled in the background while you sit by the fire, so a journey never waits for it */
  let cv=null,gl=null,prog=null,L={},ok=false,pending=false,par=null;
  function sh(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;}
  function start(){prog=gl.createProgram();gl.attachShader(prog,sh(gl.VERTEX_SHADER,VS));gl.attachShader(prog,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(prog);pending=true;}
  function finish(){pending=false;
    if(!gl.getProgramParameter(prog,gl.LINK_STATUS)){console.warn("Journeys: shader did not compile",gl.getProgramInfoLog(prog));ok=false;return;}
    const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    gl.useProgram(prog);const ap=gl.getAttribLocation(prog,"p");gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,2,gl.FLOAT,false,0,0);
    "uRes uT uStar uVeil uWarp uTun uZ uOpen uCos uEmb uLift uSpd uMode uTex".split(" ").forEach(n=>L[n]=gl.getUniformLocation(prog,n));ok=true;}
  function ready(){if(ok)return true;if(!gl||!pending)return false;if(par&&!gl.getProgramParameter(prog,par.COMPLETION_STATUS_KHR))return false;finish();return ok;}
  function init(){if(cv)return ready();cv=document.createElement("canvas");cv.className="ekgl";cv.setAttribute("aria-hidden","true");app.insertBefore(cv,app.firstChild);
    try{gl=cv.getContext("webgl",{alpha:true,premultipliedAlpha:true,antialias:false,depth:false,stencil:false,powerPreference:"high-performance"})||cv.getContext("experimental-webgl");
      if(gl){par=gl.getExtension("KHR_parallel_shader_compile");start();}}catch(e){console.warn("Journeys: WebGL unavailable",e);gl=null;}
    cv.addEventListener("webglcontextlost",e=>{e.preventDefault();ok=false;pending=false;});cv.addEventListener("webglcontextrestored",()=>{L={};start();});return ready();}
  function size(scale){const r=cv.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2)*scale;const w=Math.max(2,Math.round(r.width*d)),h=Math.max(2,Math.round(r.height*d));
    if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;}gl.viewport(0,0,w,h);}
  let fb=null,tex=null,tw=0,th=0;
  function uni(u,w,h){gl.useProgram(prog);gl.uniform2f(L.uRes,w,h);for(const k in u)if(L[k]&&k!=="uTex")gl.uniform1f(L[k],u[k]);}
  function draw(u,scale){if(!ready())return false;size(scale);uni(Object.assign({uMode:0},u),cv.width,cv.height);
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,3);return true;}
  function target(w,h){if(!tex){tex=gl.createTexture();fb=gl.createFramebuffer();}
    if(w===tw&&h===th)return;tw=w;th=h;gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
    [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.LINEAR));
    [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.CLAMP_TO_EDGE));
    gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);gl.bindFramebuffer(gl.FRAMEBUFFER,null);}
  /* the calm night sky: the slow layer is repainted at half size only when asked (every few seconds, or after a resize) */
  function sky(t,scale,repaint){if(!ready())return false;const w0=cv.width,h0=cv.height;size(scale);
    if(repaint||!tex||cv.width!==w0||cv.height!==h0){const w=Math.max(2,cv.width>>1),h=Math.max(2,cv.height>>1);target(w,h);
      gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,null);/* never read the texture while painting into it */
      gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.viewport(0,0,w,h);uni({uMode:1,uT:t},w,h);gl.drawArrays(gl.TRIANGLES,0,3);
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,cv.width,cv.height);}
    gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);uni({uMode:2,uT:t},cv.width,cv.height);gl.uniform1i(L.uTex,0);
    gl.drawArrays(gl.TRIANGLES,0,3);return true;}
  /* warm up: start compiling when the app is idle, then one tiny draw so the driver finishes its own work too */
  function warm(){if(cv&&ok)return;init();let tries=0;const poll=()=>{if(ready()){try{const r=app.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2)*quality;cv.width=Math.round(r.width*d);cv.height=Math.round(r.height*d);gl.viewport(0,0,cv.width,cv.height);gl.useProgram(prog);gl.uniform2f(L.uRes,cv.width,cv.height);gl.uniform1f(L.uTun,1);gl.uniform1f(L.uCos,1);gl.uniform1f(L.uEmb,1);gl.uniform1f(L.uWarp,1);gl.drawArrays(gl.TRIANGLES,0,3);gl.uniform1f(L.uTun,0);gl.uniform1f(L.uCos,0);gl.uniform1f(L.uEmb,0);gl.uniform1f(L.uWarp,0);}catch(e){}return;}if(pending&&++tries<120)setTimeout(poll,250);};setTimeout(poll,250);}
  return {init,ready,draw,sky,warm,el:()=>cv,ok:()=>ok};
})();

/* ---------- sound for the journey: a rising wind, a deep swell, and the bowl on arrival ---------- */
const SFX=(function(){let nodes=null;
  function start(dur,up){if(!soundWanted)return;try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();if(actx.state==="suspended")actx.resume();}catch(e){return;}
    stop();const t=actx.currentTime,out=actx.createGain();out.gain.value=appVol;out.connect(actx.destination);
    const len=actx.sampleRate*2,buf=actx.createBuffer(1,len,actx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
    const src=actx.createBufferSource();src.buffer=buf;src.loop=true;const bp=actx.createBiquadFilter();bp.type="bandpass";bp.Q.value=.9;const wg=actx.createGain();wg.gain.value=0;
    src.connect(bp);bp.connect(wg);wg.connect(out);
    const sub=actx.createOscillator();sub.type="sine";const sg=actx.createGain();sg.gain.value=0;sub.connect(sg);sg.connect(out);
    const k=dur/6.3,at=x=>t+x*k;
    bp.frequency.setValueAtTime(up?260:1300,t);bp.frequency.exponentialRampToValueAtTime(up?1500:600,at(up?4.2:1.6));bp.frequency.exponentialRampToValueAtTime(up?320:240,at(6.2));
    wg.gain.setValueAtTime(0,t);wg.gain.linearRampToValueAtTime(.05,at(up?1.8:.6));wg.gain.linearRampToValueAtTime(.17,at(up?4.1:1.6));wg.gain.linearRampToValueAtTime(.04,at(up?5.4:3.6));wg.gain.linearRampToValueAtTime(0,at(6.3));
    sub.frequency.setValueAtTime(up?46:92,t);sub.frequency.exponentialRampToValueAtTime(up?96:48,at(up?4.4:2.2));
    sg.gain.setValueAtTime(0,t);sg.gain.linearRampToValueAtTime(.075,at(up?4.2:1.6));sg.gain.linearRampToValueAtTime(0,at(up?6.2:4.2));
    src.start(t);sub.start(t);src.stop(at(6.5));sub.stop(at(6.5));nodes={out,src,sub,wg,sg};}
  function stop(fast){if(!nodes)return;const n=nodes;nodes=null;try{const t=actx.currentTime;n.out.gain.cancelScheduledValues(t);n.out.gain.setValueAtTime(n.out.gain.value,t);n.out.gain.linearRampToValueAtTime(0,t+(fast?.25:.6));
    setTimeout(()=>{try{n.src.stop();n.sub.stop();n.out.disconnect();}catch(e){}},fast?350:800);}catch(e){}}
  return {start,stop};})();

/* ---------- the home scene's layers, moved as one camera ---------- */
const H=()=>($("#view-fire")||{}).clientHeight||700;
function camera(k,spd){/* k: 0 = sitting by the fire, 1 = high above it */
  const h=H(),q=s=>document.querySelectorAll("#scenewrap "+s);
  q(".stage, .names").forEach(e=>{e.style.transform=k?`translateY(${(k*h*1.08).toFixed(1)}px) scale(${(1-.08*k).toFixed(3)})`:"";e.style.transformOrigin="50% 100%";});
  q(".stars").forEach(e=>{e.style.transform=k?`translateY(${(k*h*.2).toFixed(1)}px)`:"";});
  q("#orbit, .ekspot").forEach(e=>{e.style.translate=k?`0 ${(k*h*.42).toFixed(1)}px`:"";e.style.opacity=k?String(clamp(1-k*1.6,0,1)):"";});}

/* ---------- the journey timeline ---------- */
let busy=false,raf=0,skip=null,cosmos=false,cosRaf=0,cosLast=0,z=0,quality=.55;/* quality is remembered, so a slow phone starts the next journey where it settled */
const T0=performance.now(),now=()=>((performance.now()-T0)/1000)%600;
function chrome(hide){app.classList.toggle("app-journey",hide);}
function fitCanvas(){const cv=GL.el();if(!cv)return;if(cv.classList.contains("over")){cv.style.top=cv.style.height="";return;}
  const m=$("main"),a=app.getBoundingClientRect(),r=m?m.getBoundingClientRect():a;cv.style.top=(r.top-a.top)+"px";cv.style.height=r.height+"px";}
function overlay(on){const cv=GL.el();if(!cv)return;cv.classList.toggle("over",on);cv.classList.add("on");fitCanvas();}
function play(spec){return new Promise(done=>{
  busy=true;chrome(true);const useGL=!spec.noGL;GL.init();const ok=useGL&&GL.ready()&&!still();if(useGL)overlay(true);const cv=GL.el()||document.createElement("canvas");if(useGL)cv.style.opacity="1";
  const cam_=spec.camFn||camera,tapEl=spec.tap||cv;
  const dur=spec.dur,t0=performance.now();let lastT=0,fired=new Set(),prevCam=spec.cam(0);z=0;let scale=quality,slow=0,lastWall=performance.now();
  skip=()=>{skip=null;const cut=spec.dur-.35;if((performance.now()-t0)/1000<cut){shift=cut-(performance.now()-t0)/1000;}};let shift=0;
  tapEl.onpointerdown=()=>{if(skip)skip();};
  function end(){raf=0;skip=null;tapEl.onpointerdown=null;if(useGL)cv.style.background="";try{cam_(0);}catch(e){}busy=false;chrome(false);done();}
  function frame(){try{step();}catch(e){console.error(e);for(const [at,fn] of spec.cues)if(!fired.has(at)){fired.add(at);try{fn();}catch(x){}}end();}}
  function step(){const t=Math.min(dur,(performance.now()-t0)/1000+shift),dt=Math.max(0,t-lastT);lastT=t;
    for(const [at,fn] of spec.cues)if(t>=at&&!fired.has(at)){fired.add(at);try{fn();}catch(e){console.error(e);}}
    const cam=spec.cam(t),spd=Math.abs(cam-prevCam)/Math.max(dt,1/120)*.6;prevCam=cam;
    const wall=performance.now(),fdt=wall-lastWall;lastWall=wall;if(fdt>26&&fdt<300){if(++slow>=8&&scale>.3){scale=Math.max(.3,scale*.8);quality=scale;slow=0;}}else slow=Math.max(0,slow-1);
    cam_(cam,spd);if(spec.frame)spec.frame(t);const u=spec.u(t);z+=dt*(u.speed||0);
    if(!useGL){}else if(ok)GL.draw({uT:now(),uStar:u.star||0,uVeil:u.veil||0,uWarp:u.warp||0,uTun:u.tun||0,uZ:z,uOpen:u.open||0,uCos:u.cos||0,uEmb:u.emb||0,uLift:cam,uSpd:Math.min(1,spd)},scale);
    else cv.style.background=`rgba(10,8,22,${Math.max(u.veil||0,u.tun||0,u.cos||0).toFixed(3)})`;
    if(t<dur){raf=requestAnimationFrame(frame);return;}
    end();}
  raf=requestAnimationFrame(frame);});}

/* fire to the stars. then: what to do on arrival (open the setup, or begin the session) */
async function rise(then,opts){{const fv=$("#view-fire");if(fv)fv.scrollTop=0;}opts=opts||{};
  if(busy)return;const fast=still();
  if(typeof currentView!=="undefined"&&currentView!=="fire"){show("fire");await new Promise(r=>setTimeout(r,fast?120:380));}
  if(typeof setSoundMode==="function")setTimeout(()=>{if(busy)setSoundMode("quiet");},fast?0:900);
  if(!fast)SFX.start(6.3,true);
  const arrive=opts.arrive||(()=>{enterCosmos();if(typeof openMeditate==="function")openMeditate();else show("meditate");if(then)then();});
  const spec=fast?{dur:1.1,cam:()=>0,u:t=>({veil:sm(0,.5,t),cos:sm(.35,.75,t)}),cues:[[.6,arrive]]}
    :{dur:6.3,
      cam:t=>ease(sm(.55,3.1,t)),
      u:t=>{const sp=.35+5.2*Math.exp(-Math.pow((t-4.1)/.75,2));return {emb:sm(.1,.7,t)*(1-sm(2.4,3.2,t)),star:sm(.9,2.4,t),veil:sm(1.1,3.2,t),warp:sm(2.5,3.5,t)*(1-sm(4.6,5.4,t)),
        tun:sm(3.05,3.7,t)*(1-sm(5.6,6.2,t)),open:sm(4.95,5.9,t),cos:sm(4.85,5.7,t),speed:sp};},
      cues:[[4.1,arrive],[5.55,()=>{if(typeof bowl==="function"&&soundWanted)bowl(.32);}]]};
  await play(spec);if(opts.after)opts.after();else fadeInView("view-meditate");}

/* the meditation place: the night sky above the valley, drawn behind Meditate at a gentle frame rate */
function enterCosmos(){cosmos=true;app.classList.add("ek-cosmos");GL.init();if(!GL.ready()){app.classList.add("ek-cosmos-flat");return;}
  const cv=GL.el();cv.classList.add("on");fitCanvas();cosLast=0;if(!cosRaf)cosRaf=requestAnimationFrame(cosFrame);syncSound();}
let skyPaint=0;
function cosFrame(ts){cosRaf=0;if(!cosmos)return;
  if(!busy&&!document.hidden&&ts-cosLast>=125){const re=!cosLast||ts-skyPaint>4000;cosLast=ts;if(re)skyPaint=ts;GL.sky(now(),.36,re);}
  cosRaf=requestAnimationFrame(cosFrame);}
function exitCosmos(keepCanvas){if(!cosmos)return;cosmos=false;app.classList.remove("ek-cosmos","ek-cosmos-flat");if(cosRaf){cancelAnimationFrame(cosRaf);cosRaf=0;}
  const cv=GL.el();if(cv&&!keepCanvas&&!busy){cv.classList.remove("on","over");cv.style.opacity="";}syncSound();}
function fadeInView(id){const v=document.getElementById(id);if(!v)return;const cv=GL.el();if(cv){cv.classList.remove("over");fitCanvas();}
  v.classList.remove("ekarrive");void v.offsetWidth;v.classList.add("ekarrive");setTimeout(()=>v.classList.remove("ekarrive"),900);}

/* the night sky's own quiet hum, when no other meditation sound is chosen */
function holdsAmbience(){return cosmos&&soundWanted&&ambWanted&&(typeof mSnd==="undefined"||mSnd==="quiet");}
function syncSound(){if(holdsAmbience()){if(typeof amb!=="undefined"&&(!amb||amb.kind!=="space"))ambStart("space");}else if(typeof amb!=="undefined"&&amb&&amb.kind==="space"&&typeof currentView!=="undefined"&&currentView!=="breathe")ambStop();}

/* ---------- wiring ---------- */
/* Begin: journey up first, unless you're already among the stars */
const mStart=$("#mStart");
if(mStart&&mStart.onclick){const begin=mStart.onclick;mStart.onclick=e=>{if(busy)return;if(cosmos||!enabledNow())return begin.call(mStart,e);rise(()=>begin.call(mStart,e));};}
/* leaving Meditate any other way puts the sky away quietly */
const prevHand=EKNAV.hand;EKNAV.hand=function(prev,next){prevHand(prev,next);if(cosmos&&next&&next.id!=="view-meditate")leaveSky();};
/* if a journey is still finishing, wait for it, then put the sky away unless you've gone back to Meditate */
let skyWait=0;function leaveSky(){if(!busy){exitCosmos();return;}clearInterval(skyWait);let n=0;skyWait=setInterval(()=>{if(++n>80||!busy){clearInterval(skyWait);if(cosmos&&!busy&&currentView!=="meditate")exitCosmos();}},150);}
window.addEventListener("resize",()=>{if(cosmos&&!busy){cosLast=0;fitCanvas();}});
/* compile the journey layer quietly once the app has settled, if journeys are on */
const idle=window.requestIdleCallback||(f=>setTimeout(f,1));setTimeout(()=>idle(()=>{if(enabledNow())GL.warm();},{timeout:4000}),2500);

/* Breathe has no journeys (2.7.3): Begin starts the session, and switching element is immediate. */

function rise0(){if(typeof openMeditate==="function")openMeditate();else show("meditate");}
return {rise:rise0,busy:()=>busy,inCosmos:()=>cosmos,holdsAmbience,syncSound,
  enabled(v){if(v===undefined)return ls("ek-journey")!=="off";ls("ek-journey",v?"on":"off");return v;},
  _gl:GL,_test:{rise,camera}};
})();
