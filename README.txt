EMBERKIND RELEASE 3.9.1
=======================
The Emberkind web app. Upload this folder to the Cloudflare Worker named "emberkind", so it opens at
https://emberkind.emberkindai.workers.dev. Every future release goes to that same Worker; the address never changes.

WHAT'S NEW IN 3.9.1 (Leigh's answers to the 3.9.0 open items; detail in AUDIT-3.9.1.md)
  - Acknowledgement without evaluation, continuation without expectation: the app no longer cheers. Its own voice
    says That matters. / Much needed. / So it is. / Received.; the buttons that close a finished moment say
    I honour this. (a new badge, a streak milestone), I take this with me. (all three weekly intentions done) or
    Received. (a new field guide find). The principle and its six phrases are in DESIGN_PRINCIPLES.md
  - Trimmed: the chat's repeat of the companion's description and "For when..." line; the "works offline" line
  - This month card: a goal and a timeframe ("30 more to Kindled Month, any time this November"), no countdown
  - Embervale: the waterfall Water practice promises at level 5 is here: a mound of clean grey stone at the lake's
    left end, one full sheet of water off an overhanging lip, whitewash and rings on the lake, moss and ferns; snow
    on the tops in winter, dimmer at night, still with reduced motion and in Basic Display
  - Tests: tests/release_391.py

WHAT'S NEW IN 3.9.0 (full detail, with root causes and every wording change, in AUDIT-3.9.0.md)
  - Five tabs: Home, Chats, Embervale, Regulate, You. Tools is gone; its four tools were already on Home
  - Embervale is its own destination: it slides from the correct side, lights its own tab, and has no Back to Home
  - New Chats tab: the four companions and your recent conversations, built on the existing conversation store
  - Classic is Home's look for everyone (new people, refreshes, updates). Milky Way is the one optional realistic
    scene, only when chosen in Scene; Meadow, Mossy forest, Violet valley and 3D were removed with their files
  - Classic companion art everywhere outside the Milky Way scene (Chats, chat header, companion screens, Task buddy)
  - Embervale: thin gold arrows step through the categories (All, Paths, Village, Practice, Nature, Seasonal)
  - Home: Emberkind larger and first, then Welcome home, then Find a seat by the fire; "Tap a companion to sit with
    them." sits inside the scene under the companions; "Who's by the fire" removed (its AI note kept)
  - Classic scene: Sound beside Day/Now again; Controls button removed; Scene now reachable in Classic; day and night
    change together in under a second
  - The fire: tap it for its sound, hold it to breathe (Leigh's decision); every description updated
  - Streaks say any amount counts; the lantern whisper is gone; About lists the five tabs
  - Task buddy: the line under Start says what a session really earns; Break it down again keeps your own steps
  - Inner Atlas on Home: the new description, whole on every phone width, with its not-medical-advice note
  - Streaks: no countdown; "Any amount counts. If today isn't the day, that's okay."
  - Task buddy: a pencil on each step to reword or remove it
  - Embervale: companions in the valley are Classic; sizes stop at 130% for buildings, large trees and the hearth,
    140% for ground pieces and 160% for small pieces, so nothing spills over its neighbours
  - Classic colours: every blue or purple interface surface (Task buddy, Journal, Check-in, You, sheets, switches)
    is now warm earth with amber and moss; illustrations keep their own colours
  - Companion screens: thin gold chevrons you can tap, and moving between companions no longer flickers or jumps
  - Sonnet only: every AI request, including titles and step breakdowns, uses claude-sonnet-5-5 (no Haiku)
  - Classic sky: shooting stars at dusk and night, and one wherever you tap the night sky
  - Basic Display ("Minimise all visuals."; was Simple display) holds every looping animation still; Low-stim
    mode ("Calmer visuals and softer sound."; was Calm mode) runs them at 45% speed. The breathing guide keeps its
    timing in both. Older notes below use the old names
  - Privacy policy names everything sent to the AI (Save as Ember, Task buddy steps); the in-app copies of the
    privacy policy and terms now match the website word for word (tests/legal_sync.py)
  - Feedback matches the moment: Nice!, Woohoo!, Very cool!, Yay!, Okay! after practices and Task buddy; quiet
    Okay. / Noted. / Nice. after check-ins and journalling; no "Well done"
  - Works from 320 px phones to desktop: no sideways scrolling, clipping or overlaps; text 11 px and up; settings now
    sits beside the (i) on Home; "Need a person?" stays reachable on companion screens
  - Every button and link is at least 44 px to tap, on every screen, from 320 px phones to desktop
  - DESIGN_PRINCIPLES.md, plus tests: tests/nav_classic.py, home_parts5to7.py, owner_decisions.py, tools_parts12_13.py, arrange_part8.py, companions_part11.py, model_sonnet_only.py, sky_part10.py, modes_census.py, companions_copy_15_16.py, responsive_part17.py, colour_scan.py (Playwright),
    legal_sync.py and tests/safety_signals.mjs (node)

WHAT'S NEW IN 3.8.9 (working snapshot)
  - Embervale: Flip and Size live in Arrange mode, in a glass bar at the bottom, for every placed thing except paths
    (decorations and ground pieces included; the hearth can flip and resize but not move); removed from item cards
  - Embervale: hold any item for half a second: a small vibration, Arrange mode turns on with it selected, drag to move
  - Selected item shows a soft amber outline; tapping empty ground deselects; messages sit above the bar

WHAT'S NEW IN 3.8.8
  - Task buddy: the original companion breathing + soft left/right clone effect restored; the companion is much
    bigger in the room; Task buddy title bigger and clear at the bottom left; timer goes up to 2 hours;
    Start together sits at the end of the page (no longer floats), with the empty gap removed; bigger companions

WHAT'S NEW IN 3.8.7
  - Task buddy polish: bigger companions, slightly smaller sound circles, Quiet's stars fill the circle evenly,
    the Spotify note truly centred, Start together in warm amber with no dark box behind it

WHAT'S NEW IN 3.8.6
  - Task buddy, calmer and cleaner: each background sound is a picture preview in a glass circle with its own glowing
    colour (Quiet, Fireside, Soft rain, Ocean waves, Forest, Deep hum) in a tidy grid; bigger companions; a smaller
    time; a larger, soft Start together; the Spotify text centred and never covered

WHAT'S NEW IN 3.8.5
  - Task buddy redesigned: the lamplit room header returns with your companion sitting in it, breathing; then an open,
    uncluttered column on a plum-to-amber night: companions as floating figures, the one thing written on the night
    with a golden line, the time as one large light number on an ember line, sounds as glowing orbs, Spotify as a
    quiet link, and Start together as a breathing ember pill
  - Journal redesigned: no box; Write freely is a light, elegant title over the date; prompts are soft italic lines,
    the page is ruled faintly across the night, the moods are glowing orbs, Keep this entry is an ember pill

WHAT'S NEW IN 3.8.4
  - Task buddy: the lamplit room fills the whole screen, the title floating on it; the companions, settings and
    Start together float over it as frosted glass
  - Journal: a night writing scene (warm lamplight, faint stars, soft vignette); Write freely is a frosted page
    with soft ruled lines, glowing prompts and a glass mood tray

WHAT'S NEW IN 3.8.3
  - Every companion opens the same immersive screen (full artwork, story, topics, Talk with): from the fire scene,
    the name tabs and Legacy's ring; the old plain sheet is gone. Swipe sideways to the next companion; small < >
    at the screen's sides show where you can swipe (they are hints, not buttons). Ava's food note is on her screen
  - "Your valley right now" in How everything works shows the valley again (it repaints as the valley's art loads)

WHAT'S NEW IN 3.8.2
  - Home's heading is easy to read over every scene: a solid bright gold Emberkind, light cream lines, and a soft
    feathered darkness behind the text (no box)

WHAT'S NEW IN 3.8.1
  - Tapping a companion opens their own full screen, like the tabs: a larger portrait, their story and topics, and
    Sit with at the bottom. Swipe, or tap the small gold arrows at the top right, to move between Soma, Siro, Ava
    and Orra without closing
  - Shooting stars and falling leaves in the Breathe screen's soft style: a glowing head on each star (which now
    flies either way), and dark leaves with no outline that melt into the trees; stars are clipped to the sky only
    around themselves, so they cost very little

WHAT'S NEW IN 3.8.0
  - Home's scenes: Meadow (under the Milky Way, now the default), Forest (the Milky Way forest), Mossy forest, Violet
    valley, Legacy (the original flat Home) and 3D Embervale (night only, no time slider)
  - Meadow: Soma and Orra hug the screen's edges on any phone, and the guides are a touch larger
  - Tap the sky for a shooting star, tap round the fire for tiny sparks, tap the trees for falling night leaves
    (moonlit edges); the flame still opens Breathe and the companions still open their sheets
  - Embervale's editor: Flip faces an item left or right (no turning in 2.5D); Size stays

WHAT'S NEW IN 3.7.3
  - The Milky Way scene has shooting stars too, clipped by a mask of its open sky so they pass behind the branches
    and pines

WHAT'S NEW IN 3.7.2
  - New scene, New Milky Way: a starlit meadow with all four companions sitting close together right at the edge of
    the stone ring; the living fire; the Meditate star in the Milky Way's core; and shooting stars that sweep across
    the sky and pass behind the trees (each is clipped by a mask of the painting's open sky)
  - Home's row is Controls, Settings, Sound, Scene. Scene is a menu of every way Home can look (Milky Way, New Milky
    Way, Mossy forest, Violet valley, Classic, 3D world), the current one ticked
  - The Controls card's About tab opens the full About card (Emberkind and Embervale)
  - Fixed: switching scenes could leave the previous painting on screen; a scene now changes once its paintings have
    arrived, so its layout and painting always change together

WHAT'S NEW IN 3.7.1
  - A Controls button on Home (after About, Settings and Sound) opens the card straight to the directions; About opens
    it on the About slide. The other button switches slide; the same button again closes it. The tab says Controls

WHAT'S NEW IN 3.7.0
  - Home controls start with About, Settings and Sound, then Scene, Classic and 3D world
  - About drops down a guide card under the controls (no text over the painting). Two slides, swiped or by tab:
    How to use (tap a companion, tap the fire to breathe, hold the fire for sound, tap the star to meditate, the way
    into Embervale, swiping; worded for each scene, Classic and the 3D world) and About (Emberkind and Embervale, with
    About Emberkind, How Embervale works and Need a person?). Closes on its x, About again, a tap outside, or Back
  - Classic mode has the original classic companions again
  - 3D world: the companions are true 3D figures in the classic style (sculpted bodies, folded laps and arms, closed-eye
    smiles, glowing emblems), lit and shadowed by the world, breathing and turned towards the fire

WHAT'S NEW IN 3.6.9
  - Siro and Ava sit together in the middle, just behind the fire, in every scene (Milky Way, Mossy forest, Violet
    valley) and in the 3D world; Soma and Orra hardly cover them now. In Mossy forest the whole group closes in
  - The fire answers on the flame itself (tap to breathe, hold for sound), so tapping Siro or Ava behind it opens them

WHAT'S NEW IN 3.6.8
  - Every companion picture rebuilt the same way: the edge takes the fur colour just inside it, then it's cut 10 px in
    from the outline and feathered 5 px (front-facing, fireside, scene cut-outs, 3D, tab faces). New front-facing Orra
  - 3D world: the companions use the daytime front-facing art, sit on the ground with soft contact shadows, turn
    partly towards the fire, are lit softly (no washed-out or muddy look) and fade into the haze like the world;
    textures are smoothed as they shrink, and appear as soon as they arrive
  - Mossy forest: all four sit together around the fire, Soma beside Siro and Orra beside Ava, on the moss
  - Embervale: every companion's card shows their front-facing picture (Siro, Ava and Soma were missing), centred
    neatly in the frame
  - Home: where two companions overlap, a tap opens the one in front (Soma was answering as Siro at the edge)

WHAT'S NEW IN 3.6.7
  Full audit pass (every screen, mode, scene and button; taps, swipes, layout at four screen sizes, visuals,
  accessibility, loading). Fixes: the chat's attachment pickers have names for screen readers ("Attach files",
  "Attach photos", "Take a photo"), and the chats sheet is properly labelled

WHAT'S NEW IN 3.6.6
  - New front-facing companions (Soma, Siro and Orra redrawn; Ava as before) on the cards, chats, sheets, Home name
    tabs, Task buddy and Embervale's info cards. The angled ones stay around the fire

WHAT'S NEW IN 3.6.5
  - Front-facing companions on the cards, in chats (list, header and inside), the companion sheets, the Home name tabs,
    Task buddy and Embervale's info cards. The angled ones stay wherever they sit around the fire: the Home scenes,
    the 3D world, Classic, and inside Embervale's world
  - Embervale builder: every placed item (except paths and streams) can be mirrored, turned (5 degree steps, or 15 with
    the buttons) and sized (50 to 160%) from its card, with Reset. Each item keeps its look

WHAT'S NEW IN 3.6.4
  - Mossy forest: the companions sit evenly around the fire like the Milky Way. Siro and Ava are further back, on the
    moss behind the stone ring (clear of the rocks and fire); Soma and Orra are in front either side; similar sizes,
    and nobody covers anyone else or the fire

WHAT'S NEW IN 3.6.3
  - Home opens straight into your scene: painted mode is on before the first frame (the Classic scene no longer
    flashes up), a tiny built-in preview of the scene shows instantly, the full painting downloads first, and the
    living scene takes over when ready
  - Faster opening: images and version-stamped files now load from the phone's own cache (each release installs a
    fresh one); the page itself is still checked online first for new versions, with a 2.5 s fallback when slow
  - Softer companions everywhere: their edges take the colour of the fur just inside before feathering, so there's no
    dark rim; Classic no longer puts a dark shadow around them
  - Names: Storybook forest is now Mossy forest; the switches that said "Painted"/"Painting" now say "Realistic"

WHAT'S NEW IN 3.6.2
  - The fluffy companions everywhere: Home (scenes, tabs, story screens), the companion sheets, chat headers, the
    "Continue a conversation" cards, Task buddy, and Embervale (the world, its cards and the builder). Siro has his
    new look with the water yin-yang
  - The 3D world looks like Embervale's hearth: soft greens, round puffy trees with jacaranda and blossom, the stone
    path around the hearth, the river, a pond and flowers. Swiping sideways turns the world (it no longer changes
    screen); dragging up and down scrolls the page
  - Companion sheets (like Ava's) are never taller than the screen: "Sit with" and "Not just now" are always in reach
  - Storybook forest: zoomed in 20%, with Soma and Orra sitting further back

WHAT'S NEW IN 3.6.1
  - No more intro flash: returning visitors never see the welcome screen (it's hidden before the first frame is
    drawn; first-time visitors still see it)
  - No more old version when you come back: Android keeps the app in memory, so returning resumed whatever page was
    open. Now the app checks the live release when you return (and every half hour) and reloads at a calm moment
    (on Home, nothing open) when there's a newer one
  - The scene appears straight away (the painting shows before the animation is ready), and if the phone drops the
    graphics while you're away the scene rebuilds itself instead of falling back
  - New default scene: the Milky Way forest. "Scene" switches between Milky Way, Storybook forest and Violet valley
    (each with its own WebGL fire, companions placed for it, stars, mist and fireflies); your choice is remembered
  - Classic: a switch back to the original Home, with the sun and moon you can drag, Day/Night/Now, the star for
    Meditate and the cabin for Embervale

WHAT'S NEW IN 3.6.0
  The 3D world (first version, a switch on Home: "3D world"; the painting stays the default). A small 3D clearing
  built in WebGL: rolling ground, pines, rocks, the stone ring and crossed logs, a cabin with lit windows at night,
  and mountains along the horizon in haze. The time of day changes everything: the sky runs from dawn to day to dusk
  to night with a moving sun, moon and stars; the light shifts colour and strength; the fire is a light of its own,
  strongest at night; and the sun (or moon) casts real shadows (a shadow map), so the trees, rocks, cabin and the
  companions throw shadows that swing and stretch through the day. The companions are their painted cut-outs,
  standing in the world and facing you. Drag to look around the fire; the slider scrubs the time of day ("Now"
  returns to the real time). Tapping a companion, the fire (tap or hold) and the cabin all work as on the painting.
  Your choice is remembered. Only with real graphics hardware; on a phone too slow for it, Home returns to the
  painting by itself

WHAT'S NEW IN 3.5.4
  Home in WebGL: a real, living campfire. The painted flame has been removed from the background (the logs, stones
  and coals stay) and a GPU particle fire burns in its place: white-gold at the heart, cooling through yellow and
  orange to deep red, rising, licking and never repeating, and flaring while you press it. Heat shimmer ripples the
  air above it; mist flows through the valley; water streams down the falls and glints on the river; sparks,
  fireflies and stars glow; the moon's halo breathes; the companions breathe with their emblems glowing.
  WebGL is used only with real graphics hardware, and if a phone's graphics turn out too slow it carries on
  smoothly with the 2D renderer. Calm slows it all; reduced motion holds a still image
  The painting is now clear of buttons. Directly under it: Sound, About and Settings as glowing pills (they swipe
  sideways), then the companion tabs, then "Not sure who? Start with how it feels"

WHAT'S NEW IN 3.5.3
  Home, repainted: a violet dusk clearing with the moon, mountains, a waterfall and the campfire. Siro and Ava sit
  behind the fire, Soma and Orra in front, each resting on the grass with a soft shadow beneath them
  - No more dark outlines: each companion is cut 10 px inside its edge and feathered over 5 px
  - The fire's flames now rise from the logs and blend with the painted fire; sparks are fewer, smaller and drift
    away naturally; the moon's halo breathes, stars twinkle, and the waterfall and river shimmer softly
  - Always night: the sun, moon and time buttons are gone from Home (Sound stays)
  - Meditate now lives in the moon, and Embervale in the waterfall and valley

WHAT'S NEW IN 3.5.2
  Home, painted: a forest clearing at night with Soma, Siro, Ava and Orra around a living fire. The companions
  breathe gently and their emblems glow with each breath; the fire flickers with a glow on the ground, rising sparks
  and soft smoke; fireflies drift and mist rolls through the valley. The painting is shaded for dawn, day, dusk and
  night and follows the sun and moon. Everything still works: tap the fire to breathe with it, hold it for its sound
  (it flares while you press), tap a companion to sit with them, the cabin opens Embervale and the star opens
  Meditate. Calm slows it all; reduced motion holds a still image; Simple display keeps its simple header
  Companion tabs: under the scene, a swipeable row of coloured tabs (Soma, Siro, Ava, Orra). Each opens that
  companion's artwork and story, things people bring to the fire, and "Talk with" them
  Carried in from 3.4.5: rain and snow drawn as real drops and flakes (check-in screens, Home and Embervale); every
  practice grows the valley (meditation, Task buddy and extra breathwork flow to whichever part is least grown, so
  no one is ever stuck); Embervale's unexplored land is soft mist instead of a flat pale shape; Home's heading and
  names stay readable in cloud, rain and snow

WHAT'S NEW IN 3.5.1
  Fixed: the hearth and the four companions had empty pictures on their Embervale info cards. The hearth now shows
  its campfire (with its string lights once it reaches level 6) and each companion shows themselves in a soft glow.
  Each companion keeps their own picture, and a picture that's still loading appears the moment it arrives

WHAT'S NEW IN 3.4.3
  Embervale: double-tap open ground to zoom in on that spot (it stays under your finger); double-tap again when
  you're fully in to glide back out. Single taps work exactly as before (buildings, villagers, removing paths in
  Arrange), and it's off while placing or laying paths. Reduced motion and Simple display zoom without the glide

WHAT'S NEW IN 3.4.2
  The "Need a person?" bubble pops again: as you scroll it squishes and tucks into a little dot with a bounce, and
  pops back out when you scroll up. (Since 2.7 the journey's fade had been quietly replacing this animation; both
  now work together.) Reduced motion and Simple display keep it gentle, with no bounce

WHAT'S NEW IN 3.4.1
  You page: a big number, one line, one action. Practice and reflection streaks as "3 » 4" with a single
  encouraging line and one button; this month's minutes against your next monthly badge, with days left and a
  month badge; Embercoins with "Spend in Embervale" and your streak shields in one line
  Home: "It's been a while" when your last check-in was three or more days ago (one tap to check in; "Not now"
  quiets it for the day)
  Insights: "Reflect on my patterns" with Soma is now available
  Seasons: every roofed building is dressed (hall, library, ashram, yoga shala, pods); the fire circle's string
  lights turn orange and purple for Halloween and red, green, gold and blue for Christmas; at night little bats
  flit about at Halloween and the fireflies twinkle in colours at Christmas
  Calm: only looping, ambient animations slow down; screens appear at normal speed (Tools' cards no longer
  replay slowly). Breathe's effects canvas keeps its true size after a display switch
  Checked: everything in the complete view can be earned through practice (buildings within what you can own,
  practice pieces by minutes, paths by era, wildlife through the field guide, villagers through homes)

WHAT'S NEW IN 3.4.0
  Calm and Simple display, done properly. Simple rests everything on a single still image (no leaves, particles
  or weather in Embervale). Calm keeps every effect in smooth slow motion (45% speed); in Embervale it turns off only
  the drifting leaves. Switching back restores everything at full speed. Fixed: the grey smudges after switching
  (a weather canvas stretched from a tiny size), and the 1-frame-a-second stutter in check-ins
  Check-in: "Add your own" tags with twenty icons and your own feeling words with faces; emotion faces beside the
  mood and on every feeling; a kind line once feelings are named
  Journal: a calm writing page (the paper stays on the entry cards): prompts row, a page that grows, word count,
  a draft that's kept, focus mode, an optional feeling, and Soma on tap: "Prompt me" and "Reflect with Soma"
  Field guide made real: all 26 birds, flowers, creatures and night-sky sights are drawn; unfound ones show as
  glowing silhouettes; once found they live in your valley (and the complete view shows them all)
  Villagers: every home brings two (a longhouse four), with no practice cap; up to twenty, seven new faces
  Seasons: Halloween (20 Oct to 2 Nov) brings jack-o'-lanterns, spider webs and ghosts; Christmas (1 Dec to 6 Jan)
  brings little Christmas trees, tinsel, and baubles and a star on the Hometree
  The Hometree's crown is rebuilt (tapering limbs, layered leafy clusters, seasonal colour) with proper prayer
  flags and soft streamers. YouTube links now go to youtube.com/@AevumAwareness
  Embervale's buttons can't be pressed for a moment after a card closes (no tap-through)

WHAT'S NEW IN 3.3.1
  - Task buddy setup, tidied into one calm layout: the title on the lamplit room, companions as a slim row of
    glowing avatars, then one glass panel (the task with a quiet "Help me break it down", the time in large type
    with a warm slider, sound as one swipeable row of icon chips with volume only while a sound is on, and a compact
    Spotify line), with "Start together" pinned to the bottom. Every control works exactly as before
  - No more rainbows in Check-in or the achievements (Embervale keeps its own): Radiant is golden light and
    sparkles; the top River badge is a moon over the waterfall with its reflection and lotus lights; the top Sky
    badge is a halo of light with a flight of birds
  - Fixed: tapping a card's X in Embervale could carry through to Preview and the buttons on the right
  - Arrange is now a universal edit mode: drag anything to move it, tap a path tile to remove it (coins refunded),
    or tap a building for its card
  - "Lift" is now "Remove" everywhere (paths and buildings)

WHAT'S NEW IN 3.3.0
  Check-in: a living inner-weather sky that reacts as you choose. Awful is a storm with rain and lightning, Low is
  steady rain, Average is soft overcast, Steady is sun breaking through cloud, Glowing is a warm sun with turning
  rays and light motes, Radiant is a golden sunburst with sparkles and a rainbow. It blends smoothly between moods,
  the wind and particles quicken with your energy, and saving brings a little clearing. Glass mood orbs, glowing
  energy columns, glass chips, a frosted note and a postcard of your inner weather. The same live sky sits behind
  Today's mood picker and each opened journal entry (the sky of the day it was written)
  Journal: a real notebook page (cream paper, margin, ruled lines that line up with your words) with pencil prompts,
  a pencil that writes while you type, an ink bloom when you keep an entry, and entries as paper slips with washi
  tape and date stamps that turn in like a page. Opened entries sit on a ruled page under their day's sky
  Task buddy: a lamplit room at night (an arched window of stars and moon, a warm lamp, dust drifting in its
  light). Your chosen companion sits there with their ghostly copies; during a session the room fills the screen,
  they breathe inside a glowing progress ring with a comet head, light bursts at each quarter, tapping them brings
  a soft "I'm right here", pausing hushes the ring, and finishing releases a paper lantern into the night
  Final audit fixes:
  - The Android back gesture now closes every newer layer (About, the full guide, Settings, the weather dialog,
    full-screen check-in, Embervale's info cards, guide, road and placing modes) instead of leaving the app
  - Reopening the app on Meditate opens Meditate again (it landed on Breathe since 3.1.0)
  - Sound that was paused by the phone's autoplay rule resumes on your first tap
  - Weather can't be broken by a damaged saved value
  - Reduce motion and Calm now also still the twinkling stars, the companions' sitting motion and their names' glow
  - Screen-reader labels for the meditation length and the ask dialog's answer box
  Verified: every button on every screen; four widths by day and night; offline; corrupted saved data; back gesture

WHAT'S NEW IN 3.2.0
  Achievements, rebuilt in a cinematic style: deep darkness, glowing particles, soft light and rim light. Each element's
  six tiers follow one arc: the element alone; a seated meditator appears as a glowing outline; the figure fills with
  its element; rim light and drifting particles; a signature phenomenon; a finale with bloom.
  - Space: nebula, stars, a crescent moon, shooting stars, aurora curtains, a galaxy ring
  - Fire: embers, a lava figure, rising sparks, sky lanterns, a halo of fire
  - River: a drop, a water-light figure and its reflection, a soft waterfall of light with mist, rainbow mist
  - Sky: dawn light, a cloud figure, sun rays from behind the head, kites, a rainbow
  - Earth: a sprout of light, a forest figure, fireflies, a glowing canopy, the Hometree's lanterns and light rays
  - Badges paint in a few at a time after the page opens (dark placeholder first), so it never stalls
  Fixed: the square gold frame drawn inside the picture was cut by the arch-shaped card. Frames are now drawn on the
  card's own arch: silver at tier 3, gold at 4, gold with an inner glow at 5, a radiant double frame at 6
  Fixed: the moon's cut-out showed a black disc; aurora and waterfall rebuilt as soft light, not flat paint
  About Emberkind: one card per section (How it works, The companions, What it can help with, Please know), each
  fully detailed inside; paragraphs and companions are no longer cards of their own (same in the guide)

WHAT'S NEW IN 3.1.1
  - Inner Atlas: everything now shares one centre, the middle of the figure. Five stationary rings fade outward, and
    a pulse grows from that centre at a steady speed, fading out exactly at the fifth ring, a new one every 2.4s;
    each ring brightens as the pulse passes. The old off-centre ring pattern is gone. Identical on Home and Tools
    (measured: every ring and pulse on each card shares one centre to within 0.1px, at the same spot on both)
  - Tools: Journal and Task buddy are now the same cards as on Home (paper and a writing pencil; Siro with his
    ghostly copies), with the same readable text

WHAT'S NEW IN 3.1.0
  Achievements: each element's badges are a scene from Embervale that grows richer at every tier, one new thing at a
  time, so you can see the level-up in the picture itself (the old height bars are retired):
  - Fire: an ember, a campfire, rising sparks, strung lanterns, sky lanterns, a grand bonfire
  - River: a drop, a spring, a reedy stream, lily pads and koi, a waterfall, a rainbow
  - Sky: a cloud, birds, a kite, wind, prayer flags, a rainbow sky
  - Earth: a seedling, a sapling, a blossoming tree, an orchard, a jacaranda, the Hometree
  - Space: a few stars, a moon, constellations, shooting stars, the aurora, the galaxy
  - Every other badge: its symbol inside rings and petals that multiply. Silver, then gold frames from tier 3
  Inner Atlas: rings ripple out from the heart, the points pulse in turn, light flows up the centre and a warm aura
  breathes; the Tools page now has the same card at the same full size
  Fixed: swiping to Breathe briefly showed the old screen with the Breathe/Meditate switch low down; the switch now
  shows at the top as the page slides in, and a cancelled swipe leaves Home clean
  Fixed: swiping between info cards in Embervale could be missed when the card redrew mid-swipe
  The companions, in full: in About Emberkind and the guide, each companion has their avatar, their name in their
  colour, who they are, what they help with, how they help, where you meet them in the app, and things to say
  Embervale builder: warm glass with an aurora glow, colour-coded tabs, cards lit by their category with a spotlight on
  each picture, ready cards glowing gently, locked ones frosted with a lock

WHAT'S NEW IN 3.0.9
  Home cards: each practice and tool is its own living card, in different sizes, and the text always reads clearly
  (white on a dark frosted panel, or dark ink on paper; every card measured at 7.7:1 contrast or better, day and night)
  - Breathe: a glowing orb that breathes in and out, "Breathe in / Breathe out" in time, five elements circling
  - Meditate: a night sky, a glowing crescent moon, twinkling stars and a slowly turning ensō
  - Check-in: full width, a live sky that follows the time of day and your weather (drifting clouds, sun or moon,
    rain or snow), with a full-screen button: an immersive sky where you tap your mood and go straight in
  - Journal (smaller): organic paper with ruled lines and a margin, and a pencil writing line by line
  - Task buddy (smaller): Siro, with ghostly copies of him fading out and back on a loop, keeping you company
  - Inner Atlas: a glowing body outline with its coloured points, softly pulsing
  You: each of the six cards has its own art (a little sky, paper and ink, a turning clock, a gold medal with a
  shine, a graph line drawing itself, glowing embers), with readable text
  Embervale: the rainbow keeps its size but its feet now sit behind the mountains wherever you pan or zoom
  Calm mode and reduced motion keep every card still

WHAT'S NEW IN 3.0.8
  Embervale
  - Fixed: the dark trapezoid "teeth" hanging off the hills at the valley's back-left edge (hill shading now stays
    inside each hill's outline), day and night
  - The darker range above the grey mountains is gone: clear, open sky. The grey range has a snowy crest rolling
    along its whole top, with little igloos, Everest-style camps (tents and prayer flags, glowing at night) and
    snowy pines along the slopes
  - The Hometree, reworked: great buttress roots flowing from a flared base, a warm-lit hollow you can walk into,
    a wooden walkway spiralling up the trunk, two treehouses with lit windows, vines and soft glowing dots, plus
    its lanterns, flags and ribbons. Its top is no longer cut off, and builder and info pictures show the whole tree
  - Alive: trees sway in the wind (the Hometree's flags with it); small green and orange leaves drift and twirl
    across the view now and then, more when zoomed in, coloured by season (none in winter)
  - Info cards: swipe left or right to move between cards, with gold arrows at the edges (none before the first or
    after the last). Placed items step through your valley; builder cards step through the bar. Tap the valley
    above a card to close it; the X is bigger and always works
  - Tabs: All first, Paths second
  - Preview: info cards show every building at level 5, fully grown, matching the picture
  - Vegetable garden: a scarecrow and a watering can. Decorations sit on a grounded base (shadow, grass, seasonal
    flowers, leaves or snow). The jacaranda sways too
  Guide
  - "How everything works": the (i) in Embervale, and a button at the top of About Emberkind on Home.
    Embervale tab: your valley right now, a growth graph for each practice, the eras on a timeline with where you
    are and what each opens, Embercoins, the five building levels in pictures with an animated demonstration and a
    cost chart, placing and paths, time, seasons, weather and preview. Emberkind tab: how to use every part
  You
  - The Embercoins card is black with a gold edge and gold sparkle, so the gold coin stands out

WHAT'S NEW IN 3.0.5
  - Every button on every screen was tapped (305 across 15 screens): one bug found and fixed. Inner Atlas now opens
    in a new tab; before, it also sent Emberkind itself away to the Atlas site
  - The Hometree's prayer flags sway and its ribbons ripple in the wind; its lanterns glow at night
  - Mist drifts between the distant mountains and the foothills; the blue-grey band on the left is now green hills,
    and the edge mist no longer drifts across the back hills
  - Embervale's own sky greys over and fills with cloud when the local weather is cloudy, rainy or snowy
  - The Retreat ashram has stone lanterns (lit at night), planters and prayer flags; the gathering circle has log
    benches and lanterns
  - Where the bridge path reaches the far bank there's a small riverside lookout: a bench and a lantern

WHAT'S NEW IN 3.0.1
  - Round buildings (eco homes, pods, practice hall, library) have lived-in detail: a stone footing, a framed door
    with a knob and a stone step, a lantern by the door that glows at night, and seasonal flower planters
  - Weather tints only the sky on Home, so the title and companions stay crisp while rain or snow falls in front
  - The guiding star fades with the rest of the scene when the time changes
  - The Hometree's roots stay on its own ground (they reached across neighbouring path tiles)
  Checked by eye in this release: rain, snow and cloud on Home and Embervale; About Emberkind; the zen settings
  button; the Embercoins card on You; time-of-day fades (every part of Home now fades together in 1.5 seconds);
  the enlarged hall, library, ashram and shala don't cover any path or neighbour

WHAT'S NEW IN 3.0.0
  Home and settings
  - Tapping (or holding) the fire turns all sound on or off, and the Sound button always agrees; it never jumps to Breathe
  - Time of day changes as one even 1.5-second fade across the whole scene, on Home and in Embervale
  - The (i) opens About Emberkind: how it works, what each part and companion does, what it can help with, and that
    it isn't medical advice or a crisis service (000, Lifeline 13 11 14). Close with the X, a tap outside, or (i)
  - A zen settings button under "Need a person?" (Home only) and "Detailed settings" in You open the full settings
  - Optional local weather (off by default): asks first, rounds your location to about 10 km on the device and asks
    Open-Meteo for current conditions; Home, Embervale and the Check-in card show sun, cloud, rain or snow. Your
    location never comes to us. Privacy and Terms updated; location permission allowed for the app itself
  Practices
  - Meditate: interval bell every 5 minutes by default (remembered); the settling note sits with the description
  You
  - Name, the six coloured cards, a big gold Embercoins card, Streak shields, then everything else
  Tools
  - Check-in is a living card with a small sky that follows the time and weather; bright tiles for the other tools
  Embervale
  - Placing: tap lays or lifts a tile, a drag only moves the view, pinch zooms, hold then drag lays a line
  - New: Zen path (10 coins: dark stones in moss, pebbles, stone lanterns auto-spaced every 3 tiles) and Stream
    (6 coins). Paths is the first tab in the builder
  - Yoga shala (was the yoga deck): a raised square timber platform with stairs, hip roof, planters, lanterns, flags
  - Practice hall, Library, Retreat ashram and Yoga shala are 25% bigger
  - The Hometree (was the ancient tree): massive, with lanterns, prayer flags and ribbons; seasonal colours
  - Lower distant mountains with rounded snow caps, terraced rolling foothills with trees, a few stars from the start
  - The sun/moon object is gone (the time button stays); cottage shadows no longer clip
  - See FUTURE-DIRECTION.txt for the long-term 3D village idea (not built)

WHAT'S NEW IN 2.7.4
  - Embervale: the river now ends in a lake near the foot of the valley (shore, ripples, lily pads, reeds) instead
    of running off into the distance. In 2.4 it fell off the island as a waterfall; the bigger valley since 2.5
    has no cliff edge, so a lake is the natural end
  - No paths into the distance: the old entrance road from the map's edge (there from the very start) and the
    road past the bridge are gone. Paths only join buildings to the hearth, so a new valley starts with none
  - The hearth's glow at night is a little softer

WHAT'S NEW IN 2.7.3 (simpler, steadier)
  - Breathe opens straight into its practice: no flight across the valley, no portals, no scene-switch transition
  - No return journeys: finishing or leaving a practice uses the normal screen fade
  - The one journey kept: Begin on Meditate rises from the fire through the wormhole into the night sky
  - The guiding star on Home simply opens Meditate
  - Embervale: the tab bar stays visible; a sun or moon in the sky can be dragged to change the valley's time of
    day (tap it to step through the day); a few clouds in every sky
  - Embervale fixes: the river comes out from the foot of the mountains and flows on into the mist instead of
    ending in the grass; the spring's stream now runs all the way into the river; the road over the bridge carries
    on out of the valley instead of stopping at the bank; paths pass over the gathering circle's edge stones
  - Embervale cottages (cabin and longhouse): log walls on a stone plinth under deep thatch, stone chimneys with
    smoke, arched doors with lanterns, flower boxes. At night the windows and lanterns glow and light the ground;
    night lights are a little brighter overall without blowing out
  - See FUTURE-DIRECTION.txt for the long-term 3D village idea (not built)

WHAT'S NEW IN 2.7.2
  - Embervale: the hearth is a gathering circle, a clearing of packed earth ringed with stones, with all four
    companions seated around it as on Home (Soma, Orra, Siro, Ava), from the very start
  - Breathe: switching element (fire, river, sky, earth, space) goes through a quick portal in that element's colours
  - Journeys always land at the top of Home; coming back to Regulate after a practice opens its setup page,
    never an old closing screen with the bars hidden

WHAT'S NEW IN 2.7.1
  - Home is the 2.4 Home again: the fire scene, then Explore, Install, Regulate, Tools, Embervale, Who's by the fire
    and the Academy, on one scrolling page. Journeys, the cabin, the guiding star and the info button stay.
  - Embervale: the hearth sits at the centre of every valley from the very start
  - You: streaks and shields at the top, This week under the coloured cards, Feedback under Reminders,
    no duplicate streaks block, no Live card. "Banked embers" are now "Streak shields"
  - Meditate: the description sits under the timer, as in Breathe
  - During a breath or meditation the tab bar and the Breathe/Meditate switch step aside
  - Every script and stylesheet is versioned (?v=2.7.1) and the offline cache revalidates, so a phone can never
    run a mix of old and new files (the cause of the blank Breathe screen)

WHAT'S NEW IN 2.6.1
  - Breathe is a journey too: Begin flies from the fire to where each scene lives (into the flames, east to the
    river, up into the clouds, down into the earth) and a portal opens onto it. Space rises through the wormhole.
    Tap to arrive at once. Calm mode uses a short fade; Journeys can be turned off in the lantern.

WHAT'S NEW IN 2.6.0
  - No more flashing between screens; Home and Breathe keep living while you're away instead of restarting
  - Home is the fire, full screen. A lantern (top left) holds sound, time of day and comfort settings
  - Tap the fire for its crackle, drag the sun for the time of day, tap the lit cabin for Embervale,
    tap the guiding star to rise into meditation
  - Meditation is a journey: from the fire, up through the sky and a wormhole, into the night above Embervale
  - Embervale: paths now lead to doors; building bases are no longer cut off
  - Fixed: Embervale's Back could leave the app after visiting a chat
  - New files: js/world.js, js/journey.js, css/app-06.css (all in the offline cache)

WHAT'S HERE
  index.html                 The app page
  css/, js/                  Styles and code, in small modules (every file under 600 lines)
  config.js                  Settings: live AI on, and the address of the API (emberkind-api)
  standalone.js              On-device storage and the connection to the API
  sw.js                      Offline support. Its cache is named for the release (emberkind-3.8.9); bump it each release
  manifest.webmanifest       Install details (name, icons, colours) used by Android and PWABuilder
  privacy.html, terms.html   Public policy pages (also linked inside the app)
  fonts/                     The app's fonts, bundled (SIL Open Font Licence)
  og-image.png               The picture shown when someone shares the link
  _headers                   Security headers for Cloudflare

RELEASING AN UPDATE
  1. Change the release number in three places: js/app-04.js (EK_RELEASE), index.html (the yrel line at the bottom of You)
     and sw.js (CACHE). For example 1.0.1 for a fix, 1.1.0 for new features.
  2. Upload the folder to the "emberkind" Worker again.
  3. People get the update the next time they open the app. The Google Play app updates too, with no resubmission,
     because it shows this website.
