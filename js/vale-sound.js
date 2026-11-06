"use strict";
/* ================= EMBERVALE SOUND =================
   A gentle soundscape made live on the phone, with no audio files: soft wind, the river, birdsong by day,
   crickets and a distant frogmouth at night, cicadas on summer days. It follows the time and season you choose,
   respects your sound setting, shares Home's audio, and fades out when you leave or put the phone down. */
const EVS=(()=>{
let own=null,out=null,beds=[],timers=[],on=false,layer="",se="",NB=null;
const want=()=>{try{const v=profile.vSound;if(v!=null)return !!v;return typeof soundWanted==="undefined"?true:!!soundWanted;}catch(e){return false;}};
function ac(){try{if(typeof actx!=="undefined"){actx=actx||new (window.AudioContext||window.webkitAudioContext)();return actx;}own=own||new (window.AudioContext||window.webkitAudioContext)();return own;}catch(e){return null;}}
function noise(a){if(NB&&NB.sampleRate===a.sampleRate)return NB;const n=a.sampleRate*2,b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<n;i++){l=(l+.02*(Math.random()*2-1))/1.02;d[i]=l*3.5;}return NB=b;}
/* a steady bed of filtered noise, gently moving (wind, water, cicadas) */
function bed(a,type,f,q,vol,lfo){const s=a.createBufferSource();s.buffer=noise(a);s.loop=true;const fl=a.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const g=a.createGain();g.gain.value=vol;s.connect(fl);fl.connect(g);g.connect(out);
  if(lfo){const o=a.createOscillator(),og=a.createGain();o.frequency.value=lfo[0];og.gain.value=lfo[1];o.connect(og);og.connect(lfo[2]==="f"?fl.frequency:g.gain);o.start();beds.push(o,og);}s.start();beds.push(s,fl,g);}
function chirp(a,f0,f1,dur,vol,when){const o=a.createOscillator(),g=a.createGain(),t=a.currentTime+(when||0);o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+dur*.25);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(out);o.start(t);o.stop(t+dur+.05);}
function every(fn,min,max){const go=()=>{if(!on)return;try{fn();}catch(e){}timers.push(setTimeout(go,min+Math.random()*(max-min)));};timers.push(setTimeout(go,min*.4+Math.random()*min*.6));}
function build(ph,season){const a=ac();layer=ph;se=season;const night=ph==="night",winter=season==="winter";
  bed(a,"bandpass",500,.6,winter?.11:.06,[.07,winter?.05:.03,"g"]);
  bed(a,"bandpass",1600,.9,.035,[.6,500,"f"]);
  if(night){every(()=>{for(let i=0;i<3;i++)chirp(a,4300,4200,.05,.02,i*.11);},900,2200);every(()=>{chirp(a,190,170,.35,.05);chirp(a,190,170,.35,.05,.6);},9000,20000);return;}
  if(season==="summer"&&ph==="day")bed(a,"bandpass",5200,8,.012,[14,.01,"g"]);
  const gap=winter?[5000,9000]:ph==="dawn"?[900,2200]:[1600,4200];
  every(()=>{const f=2200+Math.random()*1800,n=2+Math.floor(Math.random()*3);for(let i=0;i<n;i++)chirp(a,f*(1+i*.05),f*(1.25+i*.05),.09,.035,i*.13);},gap[0],gap[1]);
  if(ph!=="dusk")every(()=>{chirp(a,1400,900,.4,.03);chirp(a,1500,1000,.5,.03,.45);},12000,26000);}
function clear(){timers.forEach(clearTimeout);timers=[];const old=beds;beds=[];return old;}
function kill(list){list.forEach(n=>{try{n.stop&&n.stop();}catch(e){}try{n.disconnect();}catch(e){}});}
function start(ph,season){if(on||!want())return;const a=ac();if(!a)return;try{if(a.state==="suspended")a.resume();}catch(e){}on=true;out=a.createGain();out.gain.setValueAtTime(0,a.currentTime);out.gain.linearRampToValueAtTime(.9,a.currentTime+2.5);out.connect(a.destination);build(ph,season);}
function stop(){if(!on)return;on=false;const a=ac(),o=out,old=clear();try{o.gain.cancelScheduledValues(a.currentTime);o.gain.setValueAtTime(o.gain.value,a.currentTime);o.gain.linearRampToValueAtTime(0,a.currentTime+1.2);}catch(e){}setTimeout(()=>{kill(old);try{o.disconnect();}catch(e){}},1400);}
function set(ph,season){if(!on||(ph===layer&&season===se))return;kill(clear());build(ph,season);}
function toggle(ph,season){profile.vSound=!want();try{saveProfile();}catch(e){}if(want())start(ph,season);else stop();return want();}
document.addEventListener("visibilitychange",()=>{if(document.hidden)stop();});
return {start,stop,set,toggle,want,on:()=>on,state:()=>({on,layer,se,nodes:beds.length})};
})();
