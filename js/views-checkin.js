/* slot-checkin markup, kept in its own module so the page file stays small. */
document.getElementById("slot-checkin").outerHTML=`<div class="ci" id="ciFlow" role="dialog" aria-modal="true" aria-label="Check in" hidden>
    <div class="cisky" id="ciSky"><i class="cir"></i><i class="cig"></i></div>
    <header class="cihead"><button class="cibtn" id="ciBack" aria-label="Back"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button><div class="cidots" id="ciDots"></div><button class="cibtn" id="ciClose" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></header>
    <section class="cistep" data-s="0"><p class="cik">Check-in</p><h2 id="ciQ0">How's the weather inside?</h2><p class="cisub">Take a breath and notice. There's no right answer.</p>
      <div class="ciwx" id="ciWx"><span class="ciart" id="ciArt"></span><b id="ciMoodName">Average</b></div>
      <div class="cirow" id="ciRow" role="radiogroup" aria-label="Your inner weather"></div></section>
    <section class="cistep" data-s="1"><p class="cik">Energy</p><h2>How's your energy?</h2><p class="cisub">From running on empty to buzzing.</p>
      <div class="cien" id="ciEn" role="radiogroup" aria-label="Your energy"></div></section>
    <section class="cistep" data-s="2"><p class="cik">Your day</p><h2>What's been part of today?</h2><p class="cisub">Choose any that fit.</p>
      <div class="cictx" id="ciCtxG"></div></section>
    <section class="cistep" data-s="3"><p class="cik">Feelings</p><h2>Which words fit?</h2><p class="cisub">Choose up to three, or skip.</p>
      <div class="cifl" id="ciFl"></div></section>
    <section class="cistep" data-s="4"><p class="cik">A note</p><h2>Anything to remember?</h2><p class="cisub">Optional. It's kept in your journal.</p>
      <textarea class="cinote" id="ciNoteF" rows="6" placeholder="What happened, what you noticed..."></textarea><p class="cierr" id="ciErr" hidden>That didn't save. Please tap Save check-in again.</p></section>
    <section class="cistep cisaved" data-s="5"><div class="cicheck" aria-hidden="true"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="26"/><path d="M19 31l7 7 15-16"/></svg></div>
      <p class="cik">Check-in saved</p><h2 id="ciDoneT">Thanks for checking in</h2>
      <p class="cilead" id="ciLead">Every check-in is a small act of self-awareness. Over time your patterns become clear: what lifts you, what drains you and what you need. That understanding is where better choices, more ease and inner freedom begin.</p>
      <div class="cicard" id="ciCard"></div></section>
    <footer class="cifoot"><div class="cidone"><button class="cilink" id="ciTalk">Talk it through with Soma</button><button class="cilink" id="ciSeeP">See your patterns</button></div><button class="cinext" id="ciNext">Next</button><button class="ciskip" id="ciSkip">Skip</button></footer>
  </div>`;
