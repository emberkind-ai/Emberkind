# Emberkind Release 3.9.0: audit, root causes and change log

Release 3.9.0, built 7 November 2026. It covers the audit of navigation and visual modes, Part 4 (primary navigation),
Owner Decisions 1, 2 and 5, Part 1's Classic default, Part 5 (category arrows), Part 6 (Home), Part 7 (Classic
scene controls), Part 2 colour pass, Part 8 (Arrange checks and size limits), Part 9 (Classic companions in Embervale), Part 10
(shooting stars and fireflies), Part 11 (companion screens), Part 12 (Task buddy), Part 14 (one model), Basic
Display and Low-stim mode, the privacy policy and terms, Part 15 (companion system), Part 16 (feedback) and
Part 17 (responsive and accessibility),
Part 13 (Inner Atlas) and Leigh's decisions of 6 November. Everything else in the master prompt is listed under
"Still to do". Spec: Emberkind_Master_Prompt_v3.md. Design rules: DESIGN_PRINCIPLES.md.

## Root causes found and fixed
1. **Embervale slid back towards Home and lit the Home tab.** The swipe pager's order (app-12.js) had no Embervale,
   so it fell back to tabOf(), and tabOf("vale") returned "fire". Every slide into Embervale was computed as a move
   to Home's position, and show() marked Home as the current tab. Fix: one order, `EK_NAV` in app-01.js
   (Home, Chats, Embervale, Regulate, You; Regulate holds Breathe and Meditate), used by the tab bar, the pager and
   the slide direction. tabOf() maps Embervale and Chats to themselves.
2. **Embervale still had a Back-to-Home button** (#valeBack, and #evBack in its header) from when it was a Home
   sub-page. Removed. Android back still returns Home from any tab (app-07.js).
3. **Tab active state was split** across app-01.css and app-02.css (icon colour, a dot, an icon drop-shadow), so only
   the icon and label changed. Replaced by one rule set in css/ek-nav.css that lights the whole tab.
4. **Conflicting !important pair**: app-05.css hid the tab bar in Embervale and app-06.css re-showed it. Both removed.
5. **Home defaulted to the Meadow scene**, and fell back to Meadow for any unknown saved scene. Classic was only
   reachable as "Legacy". Fix: one key, `ek-look` ("classic" or "milkyway"), Classic unless the person picks Milky
   Way. The old keys (ek-homemode, ek-scene, ek-home3d) are retired, so every update and every new person opens Classic.
6. **Realistic companion art was the app-wide default**: companion() and companionSrc() returned CMP_ART, and Task
   buddy's room and Embervale's companion cards used it directly. Now CMP_CLASSIC. Realistic portraits remain only
   inside the Milky Way Home scene, its name tabs and its companion screens.
7. **Classic launches downloaded the Milky Way paintings anyway** (the painted scene was set up for every look). They
   now load only when Milky Way is chosen; the early boot script in index.html preloads them only for ek-look=milkyway.

8. **Classic people could not reach Milky Way.** app-18.css hid the Scene button whenever Classic was on
   (`#app.ekclassic .ekctrl [data-go="scene"]{display:none!important}`). The first 3.9.0 test opened the menu from
   code, so it missed this; the Parts 5-7 suite now taps the real buttons. Rule removed.
9. **Milky Way hid the About (i) button** (`#app.ekpaint #ekLantern{display:none!important}`). The Controls card's
   About tab was the only way round it; with Controls removed it would have stranded "How it works". Rule removed.
10. **Day and night changed unevenly**: the sky faded over 3.2 s or 1.5 s (two competing rules), the ground and glow
   over 1.5 s, the sun over 3 s. All now share one timing, `--phaseT` (0.7 s), so the scene changes as one.

11. **Task buddy's "Each session lights a lantern in Embervale" was half true.** fFinish (app-03.js) lights a
   lantern only for sessions of two minutes or more, and vale-world.js lanterns() draws at most 16 along the path,
   four of them from fire practice. Task buddy earns no Embercoins. The line under Start now says what really
   happens, and says the path is fully lit once it is; Embervale's growth list matches.
12. **"Break it down again" threw away the person's steps.** fBreakDown sent only the task, then replaced the list.
   It now sends the current steps and the person's own steps with the request, always keeps their steps (back in
   place if the reply drops one, without duplicating a tidied version), keeps ticks, and keeps everything as it was
   if the companion can't be reached.
13. **The About card's text had two copies** (world.js and ek-companions.js); the visible one is ek-companions.js.
   Both now describe the five tabs.

14. **Realistic companions in Embervale.** The companions sitting in the valley were drawn from CMP_SIDE (the
   fluffy realistic art). They now use CMP_CLASSIC, as everywhere outside Home's Milky Way scene.
15. **One size limit for everything.** Every piece could grow to 160%, so in a crowded valley a large building
   spilled over the pond and companions beside it. Limits are now per kind (vale.js maxS): buildings, large trees
   and the hearth 130%, ground pieces (spring, pond, lake, garden, zen, pool) 140%, small pieces 160%. The slider,
   + and − follow the limit, + switches off at it, a look saved larger is drawn at the limit, and steps start from
   the size you can see. Grid footprints never change.

16. **Blue and purple interface surfaces.** tests/colour_scan.py measures every visible surface on 18 screens and
   flags blue or purple backgrounds outside illustrations. It found 21. Each was traced to its one source rule and
   changed there (no override layer): Task buddy's page and view, Journal and Check-in, the You page, streak and
   Patterns cards, every sheet, Home's Embervale card, Embervale's backdrop, the Breathe/Meditate switch and its
   Meditate thumb, Meditate's chosen chip, and Home's control buttons. Classic palette: warm earth surfaces, amber
   for what is chosen or lit, moss as the cool accent. Illustrations keep their colours (the check-in sky card, the
   You page's Check-in sky and Journal paper tiles, Task buddy's room and sound pictures). The scan now runs strict.
17. **Companion screens.** Their ‹ › used the class .ekhint, shared with Home's first-visit whispers, so they
   inherited a dark plum pill; they were also hints, not buttons. Swapping companion faded the whole screen from
   transparent and lifted it 24 px (the "gaps" and "vertical movement" in Part 11). Now: thin gold chevron buttons
   (44 x 72, no background, "Previous companion" / "Next companion"), the screen stays still while only the card
   slides sideways, and a slow swipe (up to 1.2 s) counts, not just a flick under 0.7 s.

18. **Haiku was still in use.** config.js listed claude-haiku-5-5 as claudeQuick, and three background jobs asked
   for it (conversation titles, Task buddy breakdowns, the line to carry). Leigh, Nov 2026: Sonnet only, never Haiku.
   The quick tier is gone from config.js, standalone.js and every caller; every AI request now uses claudeModel.
   tests/model_sonnet_only.py runs a real conversation (streamed reply), a title and a breakdown against a stand-in
   for the emberkind-api worker and checks the model on every request. The worker itself isn't in this bundle: if
   it accepts a model from the client, consider having it allow only Sonnet too.
19. **Classic had no shooting stars** (ek-home.js meteors() runs only in Milky Way). js/ek-sky.js adds Classic's own:
   a thin warm-white streak across the upper sky every 9 to 20 seconds at dusk and night (half as often in Calm),
   and one from wherever you tap the night sky (not the title, sun, moon, buttons or companions). Never by day, in
   Simple, with reduced motion or while Home is out of sight; at most two at once. Classic's fireflies already
   worked (9, at dusk and night only); Milky Way keeps its own shooting stars and fireflies.
20. **ek-catnav.js (Part 5) was missing from the service worker's offline list**, so Embervale's category arrows
   could have been missing offline after an update. Added, with ek-sky.js.

21. **Simple mode and Calm mode** (Leigh, 7 Nov: "Simple mode: minimise all visuals. Calm mode: calmer visuals").
   Renamed "Simple display" to Simple mode everywhere (You, the settings panel, its sheet, its toast, comments) and
   described them as Leigh put it: Simple mode "Minimise all visuals."; Calm mode "Calmer visuals and softer sound."
   (Calm also softens sound, so the line says so.) tests/modes_census.py visits 18 screens in each mode. Calm was
   already right: js/ek-motion.js runs every looping animation at 45% speed (552 loops checked). Simple left three
   loops running (Journal's save halo, the chat backdrop's drift, the glow on "how it feels"); ek-motion.js now holds
   any loop still the moment it starts in Simple (except "someone is replying" dots), and releases them all when
   Simple is switched off. The breathing guide is timed transitions, not loops, and keeps its exact timing in both
   modes. Simple's text-first Home no longer shows "Start with how it feels" twice, and hides Scene (nothing to see).

22. **Names (Leigh, 7 Nov): Basic Display and Low-stim mode.** "Simple mode" is now Basic Display and "Calm mode"
   is Low-stim mode everywhere a person sees them (You, the settings panel, the Basic Display sheet and its button,
   both toasts) and in code comments. Descriptions unchanged: "Minimise all visuals." and "Calmer visuals and softer
   sound." Internally they stay .simple / .calm with the storage keys ek-simple / ek-calm, so nobody's saved choice
   resets on update.
23. **Privacy policy and terms.** The policy said the AI writes conversation titles and "Nothing else leaves your
   device", but Save as Ember sends the recent conversation and Task buddy's Help me break it down sends the task
   (and, from 3.9.0, your current steps). Both are now named, in the storage section and in "What is sent"; privacy
   dated 7 November 2026. The in-app copy (js/views-legal.js) had drifted: it lacked the 4 November Local weather
   sections of both documents and its terms still said 21 October. Both copies now match word for word, and
   tests/legal_sync.py fails if they ever differ again. The terms needed no 3.9.0 changes (date stays 4 November).
   Checked and still accurate: the AI provider (Claude by Anthropic; Sonnet only needs no policy change), what stays
   on the device (the Home look is one of "settings"), the delete-account and delete-data pages (You > Account >
   Delete my account still exists), and the setup and Cloudflare guides.

24. **Part 15, companions.** tests/companions_copy_15_16.py: each companion's name and role read the same on Home,
   the name tabs, their own screen, Chats and the chat header; no realistic portrait outside the Milky Way scene; a
   chat opened from Chats, a companion's screen or its suggestion chips reaches that companion at the API (stand-in
   worker). Nothing needed changing.
25. **Part 16, feedback.** One helper, cheer(kind) in app-01.js, never the same phrase twice running. Light (a Breathe
   practice, a Task buddy session, a badge): Nice! Woohoo! Very cool! Yay! Okay!. Quiet (check-ins, journal, check-in
   badges): Okay. Noted. Nice. (no exclamations, nothing that sounds like a grade). After meditation: Nice. Very cool.
   Okay. (no "Woohoo!" after stillness; Leigh to confirm). Replaced: "Well done for checking in", "Nice work showing
   up", "Every step done. Beautiful.", "Beautiful. Let that land...", "Well done, [name]." on badges, "Beautiful. Keep
   returning..." on practice and meditation. Kept: "Thank you for checking in. Go gently." (low mood), and factual
   confirmations ("Kept in your journal", "Your meditation was saved"). No emoji as feedback or icons anywhere.
26. **Part 17, responsive.** tests/responsive_part17.py sweeps 12 screens at 320x568, 360x740, 412x915, 430x932,
   768x1024 and 1280x800 for sideways scrolling, elements past the edge, clipped text, touch targets, overlaps, text
   under 11 px and the tab bar. Found and fixed:
   - the larger Emberkind title ran under the settings button at every width: settings moved beside the (i) in the
     top-left row, title given clear space; in Basic Display settings takes the corner;
   - on a companion's screen "Need a person?" was hidden behind it, where the close button is: it now sits above
     the screen, top left;
   - on a 320 x 568 phone Embervale's tool rail ran into the builder bar: it stops above the bar and scrolls;
   - text under 11 px: tab labels 10.5 -> 11.5 px, the help pill, Task buddy and journal labels, Embervale's tool
     labels, the You tile titles on narrow phones;
   - five tiny targets (streak chip, chat Details, You streak link, chat name, Embervale arrows) and the most-used
     small controls (back links, chat and journal buttons, chips, Meditate modes) brought to 44 px or given an
     invisible 44 px touch area; the compact help dot is a true 44 x 44 circle;
   - glossary links ("body doubling") were blue: now amber;
   - on 320 px the cabin's tap spot overlapped the back-row companions: the cabin's spot is on top (a tap on the cabin
     opens Embervale; the companions keep almost all of their area).
   Strict sweep result: 0 problems at all six sizes. Still 16 to 23 controls per size between 32 and 44 px (chat
   message actions, Meditate's minute numbers, a few chips): usable, listed by the sweep for a follow-up.
   Two regressions of mine caught on the way and fixed: the help dot briefly showed clipped text, and a check-in
   helper insert split a declaration (caught by the syntax check before any test ran).

27. **Part 9 remainder: auroras and waterfalls.** The aurora works: green curtains across the night sky (faint at
   dusk) once Space practice reaches level 5, visible at every zoom a person can reach. The waterfall does not exist:
   vale-art.js has a waterfall drawing, but nothing calls it, and Water practice's level 5 ("A waterfall") draws
   nothing new. The old drawing was made for the island-and-cliff valley; drawn into today's valley it stood on flat
   meadow below the lake and looked broken, so it was not shipped. A waterfall that fits (for example where the river
   enters from the mountains) is a design decision (open item 7d).
28. **Part 17 second pass.** The last 32-43 px controls (the Breathe/Meditate switch, Meditate's modes, chat message
   buttons and suggestion chips, the Check-in and Journal tabs, "Set a gentle reminder", Embervale's seven tools,
   Break it down, the install banner's close, two small links) are now 44 px. The strict sweep fails on anything
   under 44 px: 0 at all six sizes. Trade-off: on a standard-height phone Embervale's taller tool column scrolls a
   little to reach Sound (the fade shows there's more).
29. **Release.** Version line on You reads "Emberkind Release 3.9.0". The offline cache is named
   emberkind-3.9.0-release, so phones that tested a 3.9.0 snapshot start clean (script files can stay in the
   browser's own cache for up to an hour, per _headers).

## Part 8 checked in a crowded valley (tests/arrange_part8.py, 19 checks, real touch input)
37 placed pieces (all earned items, 15 village buildings). Hold half a second: Arrange on, item selected, one short
tick. A spring flipped and enlarged to 140%: Flip lit amber, bar says 140%, every footprint and position unchanged,
no other item's look changed. Swipe on empty ground pans with the item still selected; pinch zoom works while
arranging; the selected item drags onto open ground and nothing else moves; tapping empty ground deselects. The
hearth selects, flips and resizes but never moves; ↺ returns 100%. Not built: edge auto-pan (optional in the spec).

## Leigh's decisions (6 November) and what changed
1. Sound stays on by default. The fire's gestures swap: tap the fire to turn its sound on or off (like the Sound
   button), hold it for half a second to breathe with it (one short tick). Every description updated: first-visit
   whisper, About, the guide card, the Embervale tour, the settings panel note, screen-reader labels.
2. Streaks stay, and now say any amount counts: under the streak cards on You ("Any amount counts: a minute of
   breathing or meditation, or one check-in or journal entry."), on the open-streak line ("Any amount counts. 5h 12m
   left today."), in the evening reminder, in the streak shields sheet and its How to earn, and on Embervale's
   streak chip for screen readers. The rule itself is unchanged (practice needs a minute; any check-in or entry).
3. No lantern: the whisper "The lantern holds your settings." is now "Tap ⓘ to see how Emberkind works."

4. (Follow-up, 6 Nov) Streak countdowns removed: an open streak now says "Any amount counts. If today isn't the
   day, that's okay." The evening reminder says the same, with no time left.
5. (Follow-up, 6 Nov) Task buddy steps can be edited before starting: a pencil on each step (44 px) opens its words;
   a reworded step becomes the person's own and is kept by Break it down again; saved empty, it's removed.

## Changes in Parts 5 to 7
- Part 5: js/ek-catnav.js, one shared arrow control for any row of category chips. Embervale's builder bar has thin
  gold ‹ › around All, Paths, Village, Practice, Nature (and Seasonal once there is something seasonal). Arrows press
  the chip itself, disable at the ends, keep the chosen chip in view and fade the cards in. Order unchanged.
- Part 6: Emberkind is first and larger (36 to 46 px), then "Welcome home" or "Welcome home, [name]", then "Find a
  seat by the fire." "Tap a companion to sit with them." moved from the top into the scene, under the companions,
  centred, with a feathered darkening (no box). "Who's by the fire" removed; its AI note kept, shortened, under the
  companions. Continue a conversation already appears only when there is one (verified). "Write freely" was already
  the journal's wording.
- Part 7: Sound sits beside Day/Now inside Classic's scene (Sound, Day; or Sound, Dusk, Now after a change), as in
  the original. In Milky Way, which has no time control, Sound sits in the row under the scene. Controls button
  removed; its How to use content remains in About (i) on Home. The older "Back to real time" pill is hidden in
  Classic (Now does the same). First-visit whispers no longer sit on the sun-and-moon tip. Ground-to-page boundary
  checked by day and night: no seam. Purple tints on the row's pressed buttons are now amber. Milky Way no longer whispers "Drag the sun"
  (it has no sun to drag).

## Changes in Part 4 and Classic
- Tab bar: Home (rounded hearth), Chats (speech bubble), Embervale (small village), Regulate, You. Tools removed;
  its four tools (Check-in, Journal, Task buddy, Inner Atlas) were already on Home. Every route that went through
  Tools (check-in reminders, reopening the last screen, check-in's end button, mood history) now goes through Home.
- New Chats destination (js/ek-chats.js, css/ek-nav.css): the four Classic companions, "Not sure who?", recent
  conversations across companions, calm empty and error states. Built on the existing conversation store
  (chat-sessions.js), so routing, personalities and history are untouched. Back from a conversation returns to
  where it was opened (chatFrom in app-01.js).
- Home's Embervale card opens the Embervale tab itself, so the tab lights and the slide matches.
- Swiping: you can swipe into Embervale from Chats or Regulate; inside Embervale sideways drags move the map.
- Scene menu: Classic and Milky Way only. Meadow, Mossy forest, Violet valley and 3D Embervale removed, with their
  files (js/ek-home3d.js, img/3d/, the meadow/storybook/violet paintings) and service worker entries.
- 49 CSS rules that only styled the removed Tools page deleted.
- Version 3.9.0 in every ?v= reference, the service worker cache name and EK_RELEASE.

## Tests run (headless Chromium, Pixel user agent, touch input)
Latest full run: nav_classic 46/46, home_parts5to7 41/41, owner_decisions 12/12, tools_parts12_13 18/18,
arrange_part8 19/19, companions_part11 12/12, colour_scan strict (0 surfaces), safety signals 22/22. All scripts
parse.
- `tests/owner_decisions.py`: tap the fire switches sound and stays on Home; holding it opens Breathe on the fire
  practice without changing sound; About lists Home, Tools on Home, Chats, Embervale, Regulate, You; no lantern
  whisper; any-amount wording on You, the shields sheet and the Embervale chip.
- `tests/tools_parts12_13.py`: reward line, including the full-path case; own steps marked, sent, kept through a reply
  that drops them, kept once through a tidied reply and repeated taps, kept when the companion can't be reached;
  ticks kept; empty steps refused; Inner Atlas description whole at 360, 412 and 430 px (also checked by eye).
- `tests/home_parts5to7.py`: 41 checks, all passed, using real touch taps. Category arrows (order, ends, every
  category reached, rapid taps, chip in view, full Paths set); Home hierarchy, invitation position and no overlaps
  at 360, 412 and 430 px; Sound toggle and persistence; Day/Now and back to real time; one 0.7 s timing across sky,
  ground, glow and mist; Scene, Milky Way and Classic by tapping; About (i) in Milky Way; Continue conversation only
  when one exists; "Welcome home, Leigh".
- `tests/nav_classic.py`: 46 checks at 360x740, 412x860 and 430x932, all passed. Covers: Classic on first launch
  (and no Milky Way files downloaded); tab order; each tab shows its screen with only its tab lit; all 20
  tab-to-tab moves slide the right way and never show a third screen; rapid and repeated taps; touch swipes into and
  out of Embervale; Chats empty state, list, open, Back to Chats; Classic art in Chats, name tabs, companion screen
  and Task buddy; Scene menu choices and persistence across refresh; five upgrade cases from 3.8.x all open Classic
  with old keys retired; tab bar fits with 44 px+ targets and no sideways scroll; no script errors.
- Screenshots of every tab, Chats, an open conversation, a Classic companion screen, Task buddy and Milky Way were
  reviewed by eye, plus the tab bar at 3x zoom.
- `node tests/safety_signals.mjs`: 21 of 21 safety signals present.
- Not tested: a real Pixel 9 Pro, live AI replies (the sandbox is offline), the service worker update on an
  installed app.

## Copy register (every string changed or removed, with its class)
| Where | Before | After | Class |
|---|---|---|---|
| Tab bar | Tools | Chats | functional (Owner Decision 1) |
| Tools page | "Tools", "Everyday support", "Practical tools for noticing how you are and getting through the day, gently." | removed with the page | redundant |
| Tools page cards | Check-in, Journal, Task buddy, Inner Atlas descriptions | removed with the page (same tools on Home) | redundant |
| Tools page, Inner Atlas | "A reference for self-inquiry, not medical advice." | moved to Home's Inner Atlas card, shortened: "For self-inquiry, not medical advice." | safety signal, shortened |
| Embervale | "‹ Back" and the ‹ in its header | removed | functional (Embervale is a tab) |
| Scene menu | Meadow, Forest, Mossy forest, Violet valley, Legacy, 3D Embervale, with descriptions | "Classic: The original illustrated fire, with the sun and moon" and "Milky Way: A realistic forest under the Milky Way" | functional (Owner Decision 2) |
| Scene menu | "3D needs real graphics hardware; on slower phones Home stays on the painting." | removed | redundant |
| Controls card | "Swipe across to move between Home, Breathe, Meditate, Tools and You." | "Swipe across to move between the tabs." | functional |
| Check-in end button | "Back to Tools" | "Back to Chats" or "Back to Embervale" where relevant | functional |
| Chat back (screen reader) | "Back to the fire" | unchanged from Home; "Back to Chats" from Chats; "Back" elsewhere | functional, accessibility |
| Chats (new) | none | "Chats", "Recent", "No conversations yet. Tap a companion when you're ready.", "Your conversations didn't load. Nothing's lost.", "Try again" | functional |
| Chats (new) | none | "Not sure who? Start with how it feels" and "Your conversations are private to you. Companions are AI, here alongside the people in your life, never instead of them." | safety signals, reused |
| Home | "Welcome back, [name]" | "Welcome home, [name]" | safety signal (presence), per Part 6A |
| Home | "Tap a companion to sit with them." at the top | same words, inside the scene under the companions | safety signal, moved |
| Home | "Who's by the fire" with each companion's story | removed (each companion's screen carries the same story) | redundant |
| Home | "Emberkind companions are AI. They're here for the in-between moments, alongside the people in your life, never instead of them." | "Companions are AI, here alongside the people in your life, never instead of them." under the companions | safety signal, shortened |
| Home | Controls button | removed | redundant (Part 7C) |
| Home, Classic | "Back to real time" pill | hidden (Now does the same) | redundant |
| Home whisper | "Tap the fire to breathe · Hold to quiet it" | "Tap the fire for its sound · Hold it to breathe" | functional (Leigh's decision) |
| Home whisper | "The lantern holds your settings." | "Tap ⓘ to see how Emberkind works." | functional (Leigh's decision) |
| About, guide card, tour, settings note, fire label | tap to breathe, hold for sound | tap for sound, hold to breathe | functional (Leigh's decision) |
| About | Home, Regulate, Embervale, Tools, You; "who's by the fire"; "Siro sits with you" | Home, Tools on Home, Chats, Embervale, Regulate, You; no "who's by the fire"; "a companion sits with you" | functional |
| You, streaks | "{time} left today to keep it alight." | "Any amount counts. If today isn't the day, that's okay." plus a line under the cards | safety signal added (Leigh's decision) |
| Reminder toast | "...still open today: {time} left." | "...still open today. Any amount counts, and if today isn't the day, that's okay." | safety signal added (Leigh's decision) |
| Task buddy | (none) | "Edit this step" dialog, "Leave it empty to remove this step", "Step removed" | functional |
| Shields sheet | (none) | "Any amount counts towards a streak." in the lede and How to earn | safety signal added |
| Task buddy | "Stop whenever you need. Each session lights a lantern in Embervale." | "Stop whenever you need. Two minutes or more lights a lantern on Embervale's path." (or "...is fully lit, and every session still counts towards your Task buddy achievements.") | safety signal kept; functional corrected |
| Task buddy after | "A new lantern now glows in Embervale." | "A new lantern now glows on Embervale's path." (only when one did) | functional |
| Embervale growth | "Each Task buddy session lights a lantern along the path." | "Task buddy sessions of two minutes or more light lanterns along the path." | functional |
| Task buddy | (none) | "{Companion} couldn't help just now. Your steps are kept." | functional, error state |
| Home, Inner Atlas | "Tap where you feel it, explore what it means." | "Explore how body, mind & emotions connect. Tap where you feel it & explore your inner patterns." | functional (Part 13) |
| You, settings panel, sheet, toasts | "Simple display", "Fewer visuals across the app. Changes how it looks.", "Turn on simple display" | "Basic Display", "Minimise all visuals.", "Turn on Basic Display" | functional (Leigh's decision) |
| You, settings panel, toasts | "Calm mode: Slower, stiller movement and softer sound." | "Low-stim mode: Calmer visuals and softer sound." | functional (Leigh's decision) |
| Privacy policy (site and app) | "...a short title for each one, using its first few messages. Nothing else leaves your device." | adds what Save as Ember and Task buddy's Help me break it down send; same in "What is sent" | safety signal (transparency), made accurate |
| In-app privacy and terms | no Local weather sections; terms dated 21 October | the 4 November Local weather sections; terms dated 4 November | functional, brought level with the website |
| Simple mode Home | "Not sure who? Start with how it feels" (second copy) | hidden; the header's "Start with how it feels" stays | redundant |
| You | "Emberkind Release 3.8.9" | "Emberkind Release 3.9.0" | functional |

## Decisions for Leigh
1. A Milky Way choice is remembered across sessions. This update resets everyone to Classic once, including people
   who had picked the Milky Way forest before.
2. Outside Home's scene, Classic art is used everywhere even when Milky Way is chosen (Chats, chat header, Task
   buddy, Embervale).
3. You can swipe into Embervale but not out of it, because the map uses sideways drags. Leave by any tab or Back.
4. Sound defaults to on: kept by Leigh (6 Nov), with tap the fire for sound.
5. Streaks: kept by Leigh (6 Nov), with any-amount wording (above). The open-streak line still shows the hours
   left; DESIGN_PRINCIPLES.md section 5 discourages countdowns, so dropping the time is an option.
6. Lantern whisper: replaced (Leigh, 6 Nov).
8. Meditate's night-sky backdrop: kept as a scene (Leigh, 7 Nov).
9. Part 14: Sonnet only, never Haiku (Leigh, 7 Nov). No model picker; see 18 above.
10. Home's "For you right now" card takes the colours of the practice it suggests: kept as illustrations (Leigh, 7 Nov).
7. Open after release (each can go in 3.9.1):
   a. After meditation the feedback is "Nice." / "Very cool." / "Okay." rather than "Woohoo!". Keep?
   b. Part 16 trim candidates (none removed; Owner Decision 8): You's "By the fire since [month]"; the small capital
      kickers above practices ("BREATHWORK FOR ENERGY", "MEDITATION FOR STILLNESS"); "THINGS PEOPLE BRING TO THE
      FIRE" above suggestion chips; the companion's role and "For when..." line repeated at the top of their chat;
      the install banner's "Full screen, works offline, one tap from your home screen." Kept as safety signals in
      spirit: "No right answer. A tap is enough.", "Whenever you're ready.", "If this isn't the week, that's okay.",
      "Nothing here ever fades, and you can never fall behind.", "Tap the screen anytime to pause or end.", "No need
      for the right words here.", and the Breathe and Meditate "Helps with" / "Gets in the way" notes.
   c. The This month card still counts down ("25 days left"). Drop it, as the streak countdown was?
   d. Water practice level 5 promises "A waterfall" but nothing is drawn (see 27).

## Still to do (spec order)
Part 9: auroras and waterfalls (seasonal and weather events) not yet looked at; edge auto-pan (optional) not built.
Part 16 copy trim (remove taglines and helper text: needs Leigh's sign-off per Owner Decision 8, list to come);
the 32-43 px targets above; then the Part 18 release build. Dead CSS
for the removed 3D scene and Tools page in app-18.css.
