# Emberkind design principles and psychological safety

Binding on every change (Owner Decision 8). Copied verbatim from the Final Master Implementation Prompt v3. The safety signals in section 4 are guarded by `tests/safety-signals.json` and `node tests/safety_signals.mjs`: if you shorten a signal, update that list in the same change and say so in the release notes.

## DESIGN PHILOSOPHY AND PSYCHOLOGICAL SAFETY (binding on every change)

Everything in Emberkind is intentionally designed to help a nervous system settle. The wording, colour, motion, sound, spacing, rhythm and structure are all part of that. Your job is not only to make the app look right and work; it is to preserve and deepen this intention in every screen, string, animation and interaction you touch. When a rule elsewhere in this document conflicts with a psychological safety signal, the safety signal wins, and you flag the conflict to Leigh.

## 1. Who it is for
- Sensitive, emotionally attuned people.
- People with sensitive nervous systems.
- Neurodivergent people (including ADHD, autistic, dyslexic, demand-sensitive and alexithymic experiences; design inclusively, never label users).
- People with trauma histories, named or not.

Assume any user may arrive overwhelmed, tired, flat, ashamed, anxious or on guard. Design for the hardest moment; the lighter moments will take care of themselves.

## 2. What it is for
- Helping people notice, settle and reconnect with what is here, not fixing, optimising or performing.
- Healing understood as reconnection, repatterning and integration, never as repairing something broken. Nobody using Emberkind is treated as broken.
- Grounded in conscious human psychology and whole-system understanding: body, nervous system, emotions, relationships, rhythm and routine, food and energy, language and meaning. The four companions map to these territories (Soma: heart, body, relationships; Siro: rhythm and routine; Ava: food and energy; Orra: words and connection).
- Nervous-system regulating by design, not by claim: do not present contested theories as fact, and do not make clinical or medical claims.

## 3. Voice and wording
**Tone:** warm, steady, plain, grounded. A slight non-dual, contemplative touch (presence, awareness, allowing, spaciousness, "whatever's here") is offered lightly and never required. Spiritual language is an optional depth, not the default surface.

**Never:**
- Spiritual bypassing (using spirituality to skip pain, "everything happens for a reason", telling people how they should feel or awaken).
- Therapeutic clichés, generic reassurance ("you've got this!", "be kind to yourself" on repeat), corporate or clinical language, motivational-poster energy.
- Diagnosing, labelling, or implying clinical authority.
- Pressure, urgency, shame, comparison or guilt.

**Rules**
- **Invite, don't instruct.** "Find a seat by the fire." not "Select a companion." Prefer "when you're ready" and "if you like" over commands.
- **Permission and optionality.** "optional", "whatever's here", "no wrong way to start", "skip", "not now".
- **Short, literal, unambiguous sentences.** One idea per line. No idioms, sarcasm or double meanings (helps autistic users, brain fog, dyslexia, exhaustion).
- **Sensation and noticing over performance.** Ask what is here ("What's taking up the most space in me today?"), not how productive or good someone was.
- **Neutral emotional vocabulary.** The mood scale (Heavy, Low, Mixed, Okay, Good, Light) is a sensation continuum, not good versus bad. Never colour emotions red or green as right or wrong.
- **Say what will happen before it happens.** Say what is private. Say what the AI cannot do.
- **Always an exit.** "Stop whenever you need."
- **No guilt words** unless safety demands it: missed, failed, behind, overdue, lost, broke, only, just, should, must, need to.
- **Celebrate quietly.** Match the energy of the moment (see Part 16 guard below).
- **Australian English.**

**Say this / not this**
- "Welcome home" / "Welcome back! Ready to be productive?"
- "Whatever's here. There's no wrong way to start." / "Write your entry now."
- "Stop whenever you need." / "Complete your session!"
- "That didn't load. Nothing's lost. Try again when you're ready." / "Error! Request failed."
- "Not sure who? Start with how it feels." / "Choose a companion to continue."
- "Saved only on this device." / "Your data is securely stored."

## 4. Psychological safety signals already in the app (keep, protect, extend)
These are examples observed in the current app. The list is not exhaustive. Inventory the rest before changing any copy.

**Control and exits**
- "Stop whenever you need." (Task buddy)
- "(optional)" on "How does this feel?"
- Back always works; the system back gesture closes overlays one layer at a time.
- Skip on guides; user-chosen session length; sound off until the person chooses ("Sound off, tap to hear").

**Permission and low-barrier entry**
- "Whatever's here. There's no wrong way to start." (Journal)
- "Not sure who? Start with how it feels." (Home)
- "Prompt me" (prompts are offered, never imposed).

**Predictability and transparency**
- "Spotify opens alongside Emberkind and the background sound turns to Quiet. Your session keeps time while you listen." (says what will happen before it happens; this is functional and a safety signal, keep it)
- "You can also drag the sun or moon across the sky." / "tap to change" (discoverability, no hidden gestures)

**Privacy and honest limits**
- "Saved only on this device." with Back up.
- "Private to this device. Nothing is sent to Soma unless you tap a Soma button, and AI can be wrong."
- "Check-ins are a private space for noticing patterns. They aren't a diagnosis or a clinical record."
- AI features run only when the person deliberately taps them ("Reflect with Soma").

**Human support**
- "Need a person?" always available on the main screens.

**Presence and co-regulation**
- "Welcome home", "Find a seat by the fire.", "Tap a companion to sit with them." (the fire as hearth and anchor; companions who sit with you; body doubling: "a companion sits with you while you do one small thing")

**Non-judgemental measurement**
- Neutral mood words; no scores, grades or "good/bad day" judgements.
- "Set a gentle reminder" (the person sets it; nothing nags).

## 5. Sensory and nervous-system-regulating design
- **Light and colour:** warm amber, moss and earth tones; dark-first, low glare. No stark white blasts or harsh blue-white. Contrast must still meet at least WCAG AA. Avoid alarm red for ordinary states.
- **Motion:** slow, rhythmic, breath-paced (roughly 4 to 6 seconds per cycle). Eased in and out. No sudden movement, no flashing or strobing (never more than 3 flashes per second), nothing that causes motion discomfort. Honour `prefers-reduced-motion` and the app's slow-graphics mode. Animations never block interaction. The day/night change is a quick, uniform fade so the scene never lurches or splits.
- **Sound:** off until the person turns it on. Never autoplay. Nothing sudden or loud. Moderate default volume. All soundscapes optional.
- **Haptics:** one short, subtle tick for a meaningful action (for example hold-to-arrange). Never patterns or repeated buzzing. Respect the vibration setting.
- **Layout and cognitive load:** one primary action per screen. Generous spacing. Consistent positions for navigation, back and help. No surprise layout shifts. Three to six choices at a time. Progressive disclosure. Short lines. Touch targets at least 44 px (48 preferred). Text must scale.
- **Time:** no countdown pressure by default. Timers are containers the person chooses ("How long?"), not deadlines. Nothing times out in a way that loses work; drafts are kept.
- **Rewards and progress:** gentle and unforced. No loss mechanics, no streak-shaming, no leaderboards, no comparison, no FOMO, no urgent notifications. Embervale grows; it never punishes absence.
- **Errors, loading and empty states:** calm, specific and blameless, and they say that nothing is lost.

## 6. Neurodivergent-informed principles
- **ADHD:** chunk and externalise ("the one thing", Break it down), body-doubling presence, a low-friction start, forgiving pause and resume, simple visible progress, short session options, no required streaks.
- **Autistic:** predictability, consistent patterns and positions, literal wording, sensory control (sound, motion), clear statements of what happens next, and no jarring changes to familiar layouts when the app updates (keep familiar anchors).
- **Dyslexia and processing differences:** short text, readable type and spacing, icons paired with words.
- **Demand sensitivity (PDA-style):** invitations and choices, no commands or ultimatums, never "you must".
- **Alexithymia and interoception:** more than one way to name an experience (words, faces, body location through "tap where you feel it"), always optional; never require naming an emotion.
- **Fatigue and shutdown:** a low-energy path is always available (one tap to quiet, to the fire, to sound).

## 7. Trauma-informed principles in practice
- **Safety:** physical-feeling and emotional safety cues everywhere; nothing startling.
- **Trustworthiness and transparency:** say what happens, what is stored, what the AI can and can't do.
- **Choice and control:** the person decides depth, pace, timing and whether to engage at all.
- **Collaboration:** the person is the expert on themselves; companions ask and offer, they do not tell.
- **Empowerment:** build agency and noticing, not dependence.
- **Cultural humility:** no assumptions about belief, background, body, gender, family or ability.
- **Pacing:** never push depth. Reflection with a companion is always person-initiated. No unprompted prompts to relive hard experiences.
- **Grounding on hand:** regulation practices are one step away when intensity rises.

## 8. Companion conduct (do not alter personalities or system prompts as part of UI work)
- Distinct voices and roles. Warm, steady, curious; they follow the person's pace.
- One question at a time. Offer choices, including "not now".
- Reflect rather than interpret; never state certainty about the person's inner world.
- Never diagnose, never claim clinical authority, never moralise.
- Avoid over-validation and avoid fostering dependence; encourage human connection and keep human support ("Need a person?") easy to reach.
- When someone is overwhelmed, ground in the body and slow things down.
- Respect "no". Be honest that AI can be wrong.
- Handle crisis content with care and point to human and crisis support.

## 9. How to apply this on every change
For every screen, string, animation, sound and interaction you touch, ask:
1. Does this give the person more choice or less?
2. Is there a clear exit, skip or back?
3. Does it say what will happen before it happens?
4. Could it feel like pressure, judgement, demand, urgency or failure?
5. Is the language plain, literal, invitational and grounded?
6. What is the sensory load (motion, sound, light, colour, density)?
7. What is the cognitive load (how many things at once)?
8. Is privacy stated honestly where it matters?
9. Is there a low-energy path?
10. If someone opens this while overwhelmed, does it help them settle or does it add load?

**Process rule for copy:** before removing or rewording any text, classify it as (a) functional, (b) a psychological safety signal, or (c) redundant. Keep (a) and (b). Shorten (b) instead of deleting it. Only remove (c). List every string you changed or removed, with its class, in the final report.

## 10. Improvements to audit and propose (don't silently change)
- **Streak and progress framing:** Embervale shows a "0 day streak" chip. Review it and any similar counters for pressure or loss framing. Propose a gentler framing (for example days practised, or removing it) and ask Leigh before changing.
- **Celebration phrases:** match energy (see the Part 16 guard). Consider quieter acknowledgements for check-ins and journalling.
- **Errors, loading, offline and empty states:** rewrite any that are blunt, technical or blaming.
- **Colour:** find any use of alarm red or high-contrast warnings for ordinary states.
- **Motion:** audit every animation for reduced-motion handling and flashing.
- **Sound defaults:** confirm nothing autoplays and the default level is moderate.
- **Reminders and notifications:** confirm the wording has no urgency or guilt.
- **Onboarding and consent:** confirm choice, clarity and an easy way to skip or return.
- **Accessibility:** touch targets, text scaling, screen-reader labels, focus order.
- **After updates:** keep familiar anchors; consider a calm "what's new" note instead of silent layout changes.
- **Low-energy path:** confirm one exists from Home.
- **Keep it enforceable (DX and AX):** save this section into the repo as `DESIGN_PRINCIPLES.md`, and add a small "safety signals register" with a test that checks the key strings above still exist, so future edits cannot delete them by accident.


## Acknowledgement language (Leigh, 3.9.1)

**Acknowledgement without evaluation. Continuation without expectation.**

No forced gratitude. No compulsory positivity. No implication that someone should feel better. Just a moment
recognised, and life continuing. These phrases acknowledge something without judging it or asking it to become
something else, with no performance, perfectionism or hype:

| Phrase | Character | Where |
|---|---|---|
| Received. | Quiet acknowledgement | app voice (check-ins, journalling); button (a new field guide find) |
| That matters. | Affirmation of significance | app voice (a finished practice, Task buddy session, badge) |
| I honour this. | Respect and self-recognition | button only (a new badge, a streak milestone) |
| I take this with me. | Integration and continuation | button only (all three weekly intentions done) |
| So it is. | Acceptance and completion | app voice |
| Much needed. | Relief, appreciation and recognition | app voice (after a practice, after meditation) |

"I honour this." and "I take this with me." are the person's own words, so they only ever appear on a button they
tap. The app's voice never cheers ("Woohoo!", "Yay!", "Well done"), and never grades. One helper, cheer() in
js/app-01.js, holds the app-voice sets.
