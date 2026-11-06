/* slot-sheets markup, kept in its own module so the page file stays small. */
document.getElementById("slot-sheets").outerHTML=`<div class="sheet" id="crisisSheet" role="dialog" aria-modal="true" aria-labelledby="crisisTitle">
    <button class="close cback" data-close aria-label="Back to Emberkind"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg><span><b>Back</b> to Emberkind</span></button>
    <h2 id="crisisTitle">Support</h2>
    <p class="sintro">Free, confidential services in Australia.<span class="cmore2"> Outside Australia, contact your local emergency number.</span></p>
    <div class="clist">
    <div class="cline"><div class="clh"><b>Emergency</b><a class="cnum" target="_top" href="tel:000" aria-label="Call Emergency on 000">000</a></div><small class="ctag">Police, ambulance, fire</small><p>Police, ambulance or fire, when someone is in immediate danger</p></div>
    <div class="cline"><div class="clh"><b>Lifeline</b><a class="cnum" target="_top" href="tel:131114" aria-label="Call Lifeline on 13 11 14">13 11 14</a></div><small class="ctag">Crisis support</small><p>24-hour crisis support and suicide prevention</p><a class="ctext" target="_top" href="sms:0477131114">Prefer to text? 0477 13 11 14</a></div>
    <div class="cline"><div class="clh"><b>Suicide Call Back Service</b><a class="cnum" target="_top" href="tel:1300659467" aria-label="Call Suicide Call Back Service on 1300 659 467">1300 659 467</a></div><small class="ctag">Suicide support</small><p>24-hour counselling for anyone affected by suicide</p></div>
    <div class="cline"><div class="clh"><b>Beyond Blue</b><a class="cnum" target="_top" href="tel:1300224636" aria-label="Call Beyond Blue on 1300 22 4636">1300 22 4636</a></div><small class="ctag">Anxiety and depression</small><p>24-hour support for anxiety and depression</p></div>
    <div class="cline"><div class="clh"><b>13YARN</b><a class="cnum" target="_top" href="tel:139276" aria-label="Call 13YARN on 13 92 76">13 92 76</a></div><small class="ctag">Aboriginal and Torres Strait Islander</small><p>24-hour crisis support by and for Aboriginal and Torres Strait Islander people</p></div>
    <div class="cline"><div class="clh"><b>1800RESPECT</b><a class="cnum" target="_top" href="tel:1800737732" aria-label="Call 1800RESPECT on 1800 737 732">1800 737 732</a></div><small class="ctag">Sexual assault, domestic violence</small><p>24-hour support for sexual assault and domestic and family violence</p></div>
    <div class="cline"><div class="clh"><b>Blue Knot Helpline</b><a class="cnum" target="_top" href="tel:1300657380" aria-label="Call Blue Knot Helpline on 1300 657 380">1300 657 380</a></div><small class="ctag">Childhood and complex trauma</small><p>Support for adult survivors of childhood trauma and complex trauma</p></div>
    </div>
  </div>
  <div class="sheet mateSheet" id="mateSheet" role="dialog" aria-modal="true" aria-labelledby="mateName">
    <div class="msTop"><span id="mateAv"></span><div><b id="mateName"></b><small id="mateRole"></small></div></div>
    <p id="mateAbout"></p>
    <p class="msWhen" id="mateWhen"></p>
    <p class="msNote" id="mateNote" hidden></p>
    <button class="link msRout" id="mateRout" hidden>Your routines</button>
    <p class="msLabel">Things people bring to the fire</p>
    <div class="msChips" id="mateChips"></div>
    <button class="sitBtn" id="sitBtn"></button>
    <button class="close" data-close>Not just now</button>
  </div>
  <div class="sheet" id="consentSheet" role="dialog" aria-modal="true" aria-labelledby="consentTitle">
    <h2 id="consentTitle">Before you sit down</h2>
    <ul class="cslist">
      <li><b>Companions are AI,</b> not people or professionals. They can make mistakes, so treat what they share as ideas to explore, not facts, diagnoses or care plans.</li>
      <li id="csAI"><b>Right now, nothing you type is sent anywhere.</b> Live companion conversations are switched off. When they arrive, we'll ask you again before anything is sent to an AI service.</li>
      <li><b>Check before you act.</b> Talk with a qualified professional before acting on any plan about your health, food, medication or big decisions.</li>
      <li><b>If you're in danger,</b> call 000. Lifeline is on 13 11 14, any time.</li>
    </ul>
    <button class="sitBtn" id="consentOk">I understand, let's begin</button>
    <button class="close" id="consentMore">Read safety and privacy</button>
  </div>
  <div class="sheet awsheet" id="awardSheet" role="dialog" aria-modal="true" aria-labelledby="awTitle">
    <div class="awburst" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
    <div class="awbig" id="awBig"></div>
    <p class="awkick" id="awKick">New badge</p>
    <h2 id="awTitle"></h2>
    <p class="awsub" id="awSub"></p>
    <p class="awline" id="awLine"></p>
    <button class="sitBtn" data-close>I honour this.</button>
    <button class="close" id="awAll">See all achievements</button>
  </div>
    <div class="sheet" id="simpleSheet" role="dialog" aria-modal="true" aria-labelledby="simpleTitle">
    <p class="awkick">Heads up: the app will look different</p>
    <h2 id="simpleTitle">Basic Display</h2>
    <p>For days when less is more. Every visual is minimised, and everything still works:</p>
    <ul class="cslist">
      <li><b>Home</b> swaps the animated fire scene and companions for a calm, text-first page with clear buttons.</li>
      <li><b>Breathe</b> replaces the fire, river, sky, earth and space visuals with one soft glowing circle that breathes with you. Cues, counts and guidance stay.</li>
      <li><b>Movement</b> is stilled across the app: twinkling stars, fireflies and card animations stop.</li>
      <li><b>Nothing is lost.</b> Your companions, check-ins, Embervale, awards and settings are all still here.</li>
    </ul>
    <p class="quiet">Switch back anytime in You, under Comfort.</p>
    <button class="sitBtn" id="simpleOk">Turn on Basic Display</button>
    <button class="close" data-close>Keep the full experience</button>
  </div>
  <div class="sheet" id="askSheet" role="dialog" aria-modal="true" aria-labelledby="askTitle">
    <h2 id="askTitle"></h2><p id="askText"></p>
    <input class="ftask" id="askInput" aria-label="Your answer" hidden>
    <button class="sitBtn" id="askOk"></button><button class="close" id="askCancel">Cancel</button>
  </div>
  <div class="sheet" id="mSetSheet" role="dialog" aria-modal="true" aria-labelledby="mSetTitle">
    <h2 id="mSetTitle">Sound and bells</h2>
    <span class="flabel">Interval bell</span>
    <div class="seg mseg" id="mInt" role="radiogroup"><button data-i="0" aria-checked="true">Off</button><button data-i="1" aria-checked="false">1 min</button><button data-i="2" aria-checked="false">2 min</button><button data-i="5" aria-checked="false">5 min</button></div>
    <span class="flabel">Background sound</span>
    <div class="chipsel fsnd" id="mSnd" role="radiogroup"><button role="radio" data-s="quiet" aria-pressed="true">Quiet</button><button role="radio" data-s="fire" aria-pressed="false">Fireside</button><button role="radio" data-s="rain" aria-pressed="false">Soft rain</button><button role="radio" data-s="ocean" aria-pressed="false">Ocean waves</button><button role="radio" data-s="forest" aria-pressed="false">Forest</button><button role="radio" data-s="brown" aria-pressed="false">Deep hum</button></div>
    <div class="volrow"><span class="flabel">Volume</span><div class="volctl open fixed" id="volMed"><button class="volbtn" type="button" aria-label="App volume"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path class="w1" d="M16 9.5a3.5 3.5 0 0 1 0 5"/><path class="w2" d="M18.5 7a7 7 0 0 1 0 10"/><path class="mx" d="M17 10l4 4M21 10l-4 4"/></svg></button><input type="range" min="0" max="100" step="1" aria-label="App volume" class="volrange"></div></div>
    <button class="sitBtn" data-close>Done</button>
  </div>
  <div class="sheet bset" id="bSetSheet" role="dialog" aria-modal="true" aria-labelledby="bSetTitle">
    <h2 id="bSetTitle">Sound and vibration</h2>
    <div class="bsetrow"><span><b>Sound</b><small>The practice's own nature sounds and soft cues.</small></span><button class="tg tgp" id="bSnd" role="switch" aria-checked="true" aria-label="Sound"><svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z"/><path class="on" d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/><path class="off" d="M17 10l4 4M21 10l-4 4"/></svg><span>Sound</span></button></div>
    <div class="bsetrow"><span><b>Vibration</b><small>A gentle pulse on each in and out breath.</small></span><button class="tg tgp" id="bVib" role="switch" aria-checked="true" aria-label="Vibration"><svg viewBox="0 0 24 24"><rect x="8" y="4" width="8" height="16" rx="2"/><path class="on" d="M4.5 9v6M19.5 9v6"/><path class="off" d="M4 4l16 16"/></svg><span>Vibration</span></button></div>
    <div class="volrow"><span class="flabel">Volume</span><div class="volctl open fixed" id="volBreathe"><button class="volbtn" type="button" aria-label="App volume"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path class="w1" d="M16 9.5a3.5 3.5 0 0 1 0 5"/><path class="w2" d="M18.5 7a7 7 0 0 1 0 10"/><path class="mx" d="M17 10l4 4M21 10l-4 4"/></svg></button><input type="range" min="0" max="100" step="1" aria-label="App volume" class="volrange"></div></div>
    <button class="sitBtn" data-close>Done</button>
  </div>
  <div class="sheet" id="instSheet" role="dialog" aria-modal="true" aria-labelledby="instTitle">
    <h2 id="instTitle">Install Emberkind</h2>
    <p id="instHow"></p>
    <button class="sitBtn" data-close>Got it</button>
  </div>
  <div class="sheet" id="glossSheet" role="dialog" aria-modal="true" aria-labelledby="glossTitle">
    <p class="gtype" id="glossType"></p>
    <h2 id="glossTitle"></h2>
    <p class="gtext" id="glossText"></p>
    <p class="gnote">A plain-language explanation for general understanding, not professional advice.</p>
    <button class="close" data-close>Got it</button>
  </div>
  <div class="sheet" id="feelSheet" role="dialog" aria-modal="true" aria-labelledby="feelTitle">
    <h2 id="feelTitle">Name what's here</h2>
    <p class="fpq">Where do you notice it? Choose any.</p>
    <div class="chipsel" id="feelBody"></div>
    <p class="fpq">What's it like? Choose up to three.</p>
    <div id="feelWords"></div>
    <button class="sitBtn" id="feelGo">Start with how it feels</button>
    <button class="close" id="feelUnsure">I'm not sure what I feel</button>
    <button class="close" data-close>Back</button>
  </div>`;
