"use strict";
/* 3.6.1: Android keeps an installed app in memory, so coming back resumes the page you left, even if a newer
   release has been uploaded since. When you return (and every half hour) the app checks the live release number,
   and if there's a newer one it reloads itself at a calm moment: on Home, with nothing open. */
(function(){const cur=(document.documentElement.innerHTML.match(/Release (\d+\.\d+\.\d+)/)||[])[1];if(!cur)return;let want=null,busy=false;
  const calm=()=>{const v=document.querySelector(".view.active"),ci=document.getElementById("ciFlow");return !!v&&v.id==="view-fire"&&!document.querySelector(".sheet.on,.ekstory,.ekabout.on,.ektut.on,#ekPanel.on")&&(!ci||ci.hidden);};
  async function check(){if(busy||navigator.onLine===false)return;busy=true;try{const r=await fetch("index.html?fresh="+Date.now(),{cache:"no-store"});const m=(await r.text()).match(/Release (\d+\.\d+\.\d+)/);if(m&&m[1]!==cur)want=m[1];}catch(e){}busy=false;go();}
  function go(){if(want&&!document.hidden&&calm())location.reload();}
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)check();});setInterval(check,30*60e3);setInterval(go,5000);})();
