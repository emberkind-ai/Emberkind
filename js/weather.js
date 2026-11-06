"use strict";
/* ================= LOCAL WEATHER (3.0, optional) =================
   Off unless you turn it on in Settings. When on, the app asks your device for its approximate location, rounds it
   to about 10 km on the device, and asks Open-Meteo (a free weather service, no account) for the current conditions.
   Your location never comes to us and isn't stored; only the result (sunny, cloudy, rain or snow) is kept, for up to
   30 minutes. Home and Embervale then show matching weather: drifting cloud, rain or snow, and a soft change of light.
   Storms show as rain. The effect draws on one small canvas per scene, at most 30 frames a second, and only while
   that scene is on screen. */
window.EKWX=(function(){
const $=s=>document.querySelector(s),app=$("#app");
const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v);}catch(e){return null;}};
const RM=()=>!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)||document.querySelector(".calm");
let on=ls("ek-wx")==="on",state=null,timer=0;
const last=()=>{try{const v=JSON.parse(ls("ek-wx-last")||"null");return v&&typeof v.s==="string"&&typeof v.at==="number"?v:null;}catch(e){return null;}};
/* WMO weather codes to four looks: clear/mostly clear = sunny; partly cloudy, overcast, fog = cloudy;
   drizzle, rain, showers, thunderstorms = rain; snow, snow grains, snow showers = snow */
function look(code){code=+code;if(code<=1)return "sunny";if(code<=48)return "cloudy";if((code>=71&&code<=77)||code===85||code===86)return "snow";return "rain";}
function apply(s){state=s;if(app){if(s&&on)app.dataset.weather=s;else delete app.dataset.weather;}hosts.forEach(h=>h.kick());}
async function fetchNow(){if(!on||!navigator.geolocation)return;
  const cached=last();if(cached&&Date.now()-cached.at<30*60e3){apply(cached.s);return;}
  navigator.geolocation.getCurrentPosition(async p=>{const la=Math.round(p.coords.latitude*10)/10,lo=Math.round(p.coords.longitude*10)/10;
    try{const r=await fetch("https://api.open-meteo.com/v1/forecast?latitude="+la+"&longitude="+lo+"&current=weather_code&timezone=auto",{cache:"no-store"});
      const j=await r.json();const s=look(j&&j.current?j.current.weather_code:0);ls("ek-wx-last",JSON.stringify({s,at:Date.now()}));apply(s);}catch(e){if(cached)apply(cached.s);}},
    ()=>{setOn(false,true);},{enableHighAccuracy:false,maximumAge:30*60e3,timeout:15000});}
function setOn(v,denied){on=!!v;ls("ek-wx",on?"on":"off");if(!on){ls("ek-wx-last",null);apply(null);}else fetchNow();syncSwitch();
  if(denied&&typeof toast==="function")toast("Location wasn't allowed, so weather stays off.");}
/* ---------- the effect: one light canvas per scene ---------- */
const hosts=[];
const MODE=()=>{const a=document.getElementById("app");if(a&&a.classList.contains("simple"))return "simple";if(matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return "still";if(a&&a.classList.contains("calm"))return "calm";return "full";};
function host(parent,opt){opt=opt||{};if(!parent)return null;const c=document.createElement("canvas");c.className="ekwx";c.setAttribute("aria-hidden","true");parent.appendChild(c);
  const x=c.getContext("2d"),LB=document.createElement("canvas"),L=LB.getContext("2d");let raf=0,last=0,parts=[],clouds=[],W=0,H=0,rn=null;
  /* the canvas follows its scene's real size; it never draws while the scene is hidden or tiny (that was the grey smudge) */
  function size(){const r=parent.getBoundingClientRect(),w=Math.round(r.width),h=Math.round(r.height);if(w<40||h<40)return false;if(w!==W||h!==H||c.width!==w){W=w;H=h;c.width=W;c.height=H;seed();}return true;}
  function seed(){parts=[];const s=state,n=s==="rain"?110:s==="snow"?80:0;for(let i=0;i<n;i++)parts.push({x:Math.random()*W,y:Math.random()*H,v:s==="rain"?620+Math.random()*320:28+Math.random()*34,l:10+Math.random()*8,r:1+Math.random()*1.8,p:Math.random()*6.3});
    clouds=[];const m=opt.clouds===false?0:s==="cloudy"?5:s==="rain"||s==="snow"?4:0;for(let i=0;i<m;i++)clouds.push({x:Math.random()*W,y:H*(.03+Math.random()*.2),s:.7+Math.random()*.7,v:4+Math.random()*6,p:[0,1,2,3,4].map(()=>[(Math.random()-.5)*1.6,(Math.random()-.4)*.5,.45+Math.random()*.5])});}
  function visible(){const v=parent.closest(".view");return !document.hidden&&(!v||v.classList.contains("active"))&&!!state&&on;}
  function draw(ts){raf=0;const md=MODE();if(!visible()||md==="simple"){x.clearRect(0,0,c.width,c.height);return;}if(!size()){raf=requestAnimationFrame(draw);return;}
    if(ts-last<33){raf=requestAnimationFrame(draw);return;}let dt=Math.min(.05,(ts-last)/1000||.033);last=ts;if(md==="calm")dt*=.45;
    const night=(app&&app.dataset.phase)==="night",still=md==="still";x.clearRect(0,0,W,H);
    if(clouds.length){/* soft cumulus: overlapping puffs, drawn small and stretched up so the edges stay soft */const lw=Math.max(8,W>>2),lh=Math.max(8,H>>2);if(LB.width!==lw||LB.height!==lh){LB.width=lw;LB.height=lh;}L.clearRect(0,0,lw,lh);
      for(const cl of clouds){if(!still)cl.x+=cl.v*dt;if(cl.x>W+200)cl.x=-200;for(const [dx,dy,k] of cl.p){const cx=(cl.x+dx*90*cl.s)/4,cy=(cl.y+dy*60*cl.s)/4,r=70*cl.s*k/4,g=L.createRadialGradient(cx,cy-r*.25,0,cx,cy,r);
        g.addColorStop(0,night?"rgba(170,180,205,.22)":"rgba(255,255,255,.6)");g.addColorStop(.6,night?"rgba(130,142,170,.14)":"rgba(246,248,252,.35)");g.addColorStop(1,"rgba(255,255,255,0)");L.fillStyle=g;L.fillRect(cx-r,cy-r,r*2,r*2);}}
      x.imageSmoothingEnabled=true;x.drawImage(LB,0,0,W,H);}
    if(state==="rain"){if(window.EKRAIN){/* real drops: three depths, fading tails, a slant, splashes */if(!rn)rn=EKRAIN(130);if(!still)rn.step(dt,.45,130);rn.draw(x,W,H,.45,130,night?"190,205,232":"232,240,252");}
      else{x.strokeStyle=night?"rgba(190,205,230,.35)":"rgba(220,232,250,.55)";x.lineWidth=1.1;x.beginPath();
      for(const d of parts){if(!still){d.y+=d.v*dt;d.x+=d.v*dt*.12;if(d.y>H){d.y=-20;d.x=Math.random()*W;}}x.moveTo(d.x,d.y);x.lineTo(d.x-d.l*.12,d.y-d.l);}x.stroke();}}
    if(state==="snow"){x.fillStyle="rgba(255,255,255,.9)";for(const f of parts){if(!still){f.y+=f.v*dt;f.p+=dt;f.x+=Math.sin(f.p)*12*dt;if(f.y>H){f.y=-6;f.x=Math.random()*W;}}x.beginPath();x.arc(f.x,f.y,f.r,0,6.3);x.fill();}}
    if(!still)raf=requestAnimationFrame(draw);}
  function kick(){W=0;H=0;if(!raf){last=0;raf=requestAnimationFrame(draw);}}
  try{new ResizeObserver(()=>{if(state)kick();}).observe(parent);}catch(e){}window.addEventListener("ekmode",kick);
  const h={kick};hosts.push(h);return h;}
/* ---------- the Settings switch, with a clear explanation before the device asks for location ---------- */
function syncSwitch(){const b=$("#ekpWx");if(b)b.setAttribute("aria-checked",String(on));}
function explain(){const d=document.createElement("div");d.className="ekabout on";d.setAttribute("role","dialog");d.setAttribute("aria-modal","true");
  d.innerHTML=`<div class="ekab-card"><header><h2>Match your local weather?</h2><button type="button" class="ekab-x" aria-label="Close">&times;</button></header>
  <p class="ekab-lede">Home and Embervale can show the weather where you are: sun, cloud, rain or snow.</p>
  <p>Your phone will ask to share your location. Emberkind rounds it to about 10 km on your device and sends only that to Open-Meteo, a weather service, to get the current conditions.</p>
  <p><b>Your location never comes to us</b>, isn't stored, and isn't used for anything else. It's optional and you can turn it off at any time.</p>
  <div class="ekab-acts"><button type="button" class="ekab-no">Not now</button><button type="button" class="ekab-yes">Allow location</button></div></div>`;
  app.appendChild(d);const close=()=>d.remove();d.addEventListener("click",e=>{if(e.target===d||e.target.closest(".ekab-x,.ekab-no"))close();else if(e.target.closest(".ekab-yes")){close();setOn(true);}});}
function addSwitch(){const note=$("#ekpTimeNote");if(!note||$("#ekpWx"))return;const row=document.createElement("div");row.className="ekrow";
  row.innerHTML='<span>Match my local weather<small>Optional. Uses your approximate location; never sent to us</small></span><button type="button" class="eksw" role="switch" id="ekpWx" aria-label="Match my local weather"></button>';
  note.after(row);row.querySelector("#ekpWx").addEventListener("click",()=>{if(on)setOn(false);else explain();});syncSwitch();}
function init(){hosts.length=0;host($("#scenewrap"));host($("#valeWrap"),{clouds:false});addSwitch();
  /* the weather tint colours the sky only, so the title and companions stay crisp */
  const stars=$("#scenewrap .stars");if(stars&&!$("#scenewrap .ekwxtint")){const t=document.createElement("div");t.className="ekwxtint";t.setAttribute("aria-hidden","true");stars.after(t);}
  if(on){const c=last();if(c)apply(c.s);fetchNow();}
  document.addEventListener("visibilitychange",()=>{if(!document.hidden&&on)fetchNow();});
  if(window.EKNAV){const h=EKNAV.hand;EKNAV.hand=function(a,b){h(a,b);hosts.forEach(k=>k.kick());};}
  clearInterval(timer);timer=setInterval(()=>{if(on)fetchNow();},30*60e3);}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
return {get state(){return state;},get on(){return on;},set:setOn,_look:look,_apply:apply};
})();
