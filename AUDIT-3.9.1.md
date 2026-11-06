# Emberkind Release 3.9.1: Leigh's answers to the 3.9.0 open items

Built 7 November 2026 on Release 3.9.0 (see AUDIT-3.9.0.md for everything before this).

## 1. Acknowledgement language
Leigh's principle: acknowledgement without evaluation, continuation without expectation. No forced gratitude, no
compulsory positivity, no implication that someone should feel better. Six phrases (DESIGN_PRINCIPLES.md):
Received. That matters. I honour this. I take this with me. So it is. Much needed.
- The app's own voice (cheer() in js/app-01.js): finished practice, Task buddy session or badge: That matters. /
  Much needed. / So it is.; check-ins and journalling: Received. / So it is.; after meditation: Much needed. / So it
  is.; anything else: Received. Never the same phrase twice running. "Woohoo!", "Yay!", "Very cool!", "Nice!" and
  "Okay!" (added in 3.9.0 from the master prompt's Part 16) are gone.
- The person's own words, on the buttons that close a finished moment: a new badge and a streak milestone: I honour
  this. (were "Lovely" and "Keep going"); all three weekly intentions done: I take this with me. (was "Thank you");
  a new field guide find: Received. (was "Lovely"). Ordinary closes ("Done", "Got it" on settings and info sheets)
  are unchanged.
- After Breathe, choosing "Calmer" is met with "Much needed." (was "Lovely."). The "About the same" and "Still a lot"
  replies were already in this spirit and are unchanged.

## 2. Trims (approved)
- The chat's intro card repeated the companion's description and "For when..." line from their own screen: removed.
  The chat header keeps their name and role.
- "Full screen, works offline, one tap from your home screen.": removed from Home's install banner and the install
  sheet (the iPhone instructions in that sheet stay).
- Kept as Leigh chose: "By the fire since...", the small capital kickers, "THINGS PEOPLE BRING TO THE FIRE".

## 3. This month card
Leigh asked for a call that weighs engagement and ethics. The countdown ("25 days left") is gone; the goal and its
timeframe stay: "30 more to Kindled Month, any time this November." The badge, the goal and the monthly reset all
still work as before; only the ticking clock is gone. Ideas for conscious incentives are in the reply to Leigh.

## 4. The waterfall (Water practice, level 5)
To Leigh's design and reference photos: a natural mound of clean grey stone at the lake's left end, facing you;
water pours in one full sheet off an overhanging lip in front of a shadowed hollow (a fall, not a trickle down the
rocks), lands in whitewash with a little mist and rings out across the lake; moss and ferns on the stone, pebbles
and a few flowers at its foot; snow on the tops in winter; the stone dims at dusk and night. js/vale-art.js falls()
(the old, unused cliff-edge drawing was removed); js/vale.js draws it from Water level 5 (and in Preview) in the
valley's depth order, so anything behind it stays behind it. It stands in the lake's reserved water and shore, so
no one's placed items are moved. Still with reduced motion and in Basic Display (the valley is a still image there).

## Tests
tests/release_391.py (14 checks: buttons, where each phrase may appear, trims, month line, waterfall only from level 5
and animating). tests/companions_copy_15_16.py updated to the new vocabulary. Full regression in the release notes
to Leigh. Checked by eye: the waterfall close up and at normal zoom, by day, at night and in winter.

## Copy register (3.9.1)
| Where | Before | After | Class |
|---|---|---|---|
| App voice after finished actions | Nice! Woohoo! Very cool! Yay! Okay! | That matters. Much needed. So it is. | tone (Leigh's decision) |
| App voice after check-ins and journalling | Okay. Noted. Nice. | Received. So it is. | tone (Leigh's decision) |
| App voice after meditation | Nice. Very cool. Okay. | Much needed. So it is. | tone (Leigh's decision) |
| New badge sheet button | Lovely | I honour this. | tone (Leigh's decision) |
| Streak milestone button | Keep going | I honour this. | tone (Leigh's decision) |
| Weekly intentions done button | Thank you | I take this with me. | tone (Leigh's decision) |
| Field guide find button | Lovely | Received. | tone (Leigh's decision) |
| Breathe, "Calmer" reply | Lovely. Your body has just practised settling... | Much needed. Your body has just practised settling... | tone |
| Monthly badges all earned | ...this month. Nice! | ...this month. That matters. | tone |
| Chat intro | companion description + "For when..." line | removed | redundant (Leigh approved) |
| Install banner and sheet | Full screen, works offline, one tap from your home screen. | removed | redundant (Leigh approved) |
| This month card | 30 more to Kindled Month. 25 days left. | 30 more to Kindled Month, any time this November. | tone (countdown removed) |
| You | Emberkind Release 3.9.0 | Emberkind Release 3.9.1 | functional |
