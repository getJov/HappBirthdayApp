# Frontend-Only Birthday Web App

## Why
Create a shareable birthday greeting experience without backend hosting complexity, accounts, or database storage. The app should let someone build a personalized birthday page and send it as a link.

## What
Build a Vite + React JavaScript frontend app where a creator enters a celebrant name, age, optional from label, optional birthdate, and short wish notes, then gets a shareable URL containing the greeting data. Opening the link shows a surprise birthday scene that starts dim with a gift box and candle-lit cake, supports microphone or tap-to-blow interaction, then switches to a bright festive room with celebration effects, looping birthday music, embedded cake message, and floating letter-style notes.

## Context

**Relevant files:**
- `package.json` - project scripts and frontend dependencies to create.
- `index.html` - Vite HTML entry.
- `vite.config.js` - Vite React plugin configuration and static build behavior.
- `src/main.jsx` - React mount entry.
- `src/App.jsx` - top-level creator/share/celebrant flow.
- `src/styles.css` - responsive dark festive UI, cake, gift box, and animation styles.
- `src/lib/shareData.js` - encode/decode URL hash data and local draft helpers.
- `src/lib/audio.js` - microphone blow detection and HTML5 audio control helpers.
- `src/components/ConfettiCanvas.jsx` - lightweight canvas celebration effects.
- `scripts/create-birthday-audio.mjs` - generates a small local birthday melody audio asset during implementation.
- `public/audio/happy-birthday.wav` - generated local looping birthday song asset used by HTML5 Audio.

**Patterns to follow:**
- Use plain React JavaScript files: `.jsx` and `.js`.
- Keep browser API logic in small helpers instead of burying it inside JSX.
- Keep the app frontend-only. URL hash data is the share contract; localStorage is only for creator-side draft convenience.

**Key decisions already made:**
- Stack: Vite + React + JavaScript, not TypeScript.
- Styling: plain CSS with CSS animations and a canvas for celebration effects.
- Storage: URL hash/query encoding for shareable data; optional localStorage for drafts only.
- Interaction: Web Audio API for microphone blow detection, HTML5 Audio for looping song playback, and a required tap fallback.
- Repo metadata: Git is initialized and task-level commits are available.
- Hosting target: Vercel static hosting with build command `npm run build` and output directory `dist`.

## Constraints

**Must:**
- Scaffold a JavaScript Vite React app.
- Encode name, age, optional from label, optional birthdate, and short notes into a versioned shareable URL hash using a compact payload, e.g. `#v=1&data=...`.
- Preserve old generated links. Creating a new greeting must not overwrite or invalidate previous shared URLs because each link is self-contained in its hash payload.
- Let users create multiple greetings from the main app. The celebrant view must include an obvious create-another/new-greeting path that returns to a clean builder without destroying existing copied links.
- Enforce creator-side limits: name max 40 chars, from label max 40 chars, age 1-120, max 5 wish notes, each note max 120 chars, and warn/block if the generated URL exceeds 2,000 chars.
- Encourage note attribution by showing placeholder copy that includes `- from sender` in the wish note fields.
- Default the from label to `Friends`.
- Keep wish notes short and enforce limits before generating links.
- Show a gift box first; tapping/clicking opens the cover and reveals the cake.
- Show a dim room while the candle is lit, then transition to a bright, happy, all-ages festive room after the candle is blown out.
- Show dynamic cake text with ordinal age formatting: `Happy {ageOrdinal} Birthday, {name}!` and `from: {from}`. Handle `1st`, `2nd`, `3rd`, `4th`, and the `11th`/`12th`/`13th` exceptions correctly.
- Hide the birthday text before the candle is blown out. Before blow-out, the cake should look decorated but should not show the final birthday text. After blow-out, reveal the text as part of the cake design.
- Display the optional birthdate on the note area, upper right side.
- Remove the old floating prompt pair `Make a wish!` and `Blow the candle`. Replace it with a playful curly/circular broken-arrow visual pointing to the gift box with concise open-the-gift copy.
- After the gift opens, emphasize the sequence: make a wish first, then blow the candle.
- Make the candle glow/light reactive to microphone volume so users can see whether blowing is being detected before the threshold is reached.
- Include a microphone sensitivity meter, countdown before listening, and fallback `Tap to Blow` button.
- Show wish notes as floating letter/envelope elements after the celebration starts. Clicking/tapping a note opens it like an actual letter.
- Start audio only after user interaction and provide mute/unmute.
- Use HTML5 Audio with `public/audio/happy-birthday.wav`, generated locally by `scripts/create-birthday-audio.mjs` during implementation.
- Keep copy-link as the primary share path and use native share only when `navigator.share` is available.
- Keep animations lightweight enough for mobile.
- Respect `prefers-reduced-motion` by reducing or disabling nonessential animation intensity.
- Maintain Vercel static deployment compatibility. No route handling should require a backend; hash-based links should load on direct visits.

**Must not:**
- Add a backend, database, server persistence, auth, or API.
- Use TypeScript.
- Introduce a heavy animation framework for this small app.
- Store shareable greeting data only in localStorage.
- Depend on microphone support as the only way to complete the experience.

**Out of scope:**
- Automatic age calculation from birthdate.
- Birthday countdowns.
- Reusable yearly birthday links.
- User accounts, galleries, analytics, or remote media upload.
- Server-side Vercel functions or Vercel storage.

## Risk

**Level:** 2

**Risks identified:**
- Microphone access is browser- and context-dependent, often requiring HTTPS or localhost. -> **Mitigation:** make mic support progressive enhancement and always show `Tap to Blow`.
- URL length can break if too many notes are encoded. -> **Mitigation:** cap note count and note length in the creator UI; keep encoded data compact.
- Browser autoplay policies will block music before interaction. -> **Mitigation:** only start the HTML5 Audio loop after gift opening or blow/tap interaction, and expose mute/unmute.
- HTML5 Audio requires an actual audio asset. -> **Mitigation:** generate `public/audio/happy-birthday.wav` locally during implementation with `scripts/create-birthday-audio.mjs`; do not depend on network assets.
- Task-level commits are required for continued execution. -> **Mitigation:** continue committing each revision task after verification.
- Repeated use can be misunderstood as editing old links. -> **Mitigation:** make the copy/new-greeting flow clear: old links are immutable URL payloads; the builder can generate another independent URL.
- The brighter all-ages theme can become noisy if every element animates. -> **Mitigation:** reserve motion for reveal, candle feedback, letter opening, and celebration effects; keep normal form UI calm and scannable.
- Vercel deploys static files behind HTTPS, but localhost and preview environments differ. -> **Mitigation:** keep mic fallback mandatory and document build/output assumptions.

**Pushback:**
- Do not overbuild this with routing, global state libraries, or backend-shaped abstractions. Future-us will hate a tiny greeting app pretending to be a platform.
- URL-only sharing means the link itself contains the greeting data. Keep private/sensitive messages out of scope unless a backend is added later.
- This should still be a birthday app, not a generic party dashboard. Avoid generic gradient-card clutter; make the gift, candle, cake, letters, and room-light transition carry the experience.

## Tasks

**Execution note:** T1-T5 are completed project history. The next implementation pass for Rev 2 must execute only T6-T8, then run the full Done checklist items affected by Rev 2.

### T1: Repository metadata readiness
**Status:** Completed in current repository history.  
**Do:** Repair or initialize Git metadata in the project root, then create the initial baseline commit containing `AGENTS.md` and the active spec so later task-level commits can proceed normally.  
**Files:** `.git`, `AGENTS.md`, `plans/05282026-no-ticket-frontend-only-birthday-web-app/spec.md`  
**Verify:** `git status --short`

### T2: Vite React JavaScript scaffold
**Status:** Completed in current repository history.  
**Do:** Create the Vite React JavaScript project structure, package scripts, app entry, and base CSS reset/layout.  
**Files:** `package.json`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/styles.css`  
**Verify:** `npm run build`

### T3: Creator form and share data contract
**Status:** Completed in current repository history.  
**Do:** Build the creator form, validation/limits, optional local draft persistence, versioned URL hash encoding/decoding, copy-link button, and native-share button when available.  
**Files:** `src/App.jsx`, `src/lib/shareData.js`, `src/styles.css`  
**Verify:** Manual: create a link, reload it, and confirm the greeting data survives only through the URL.

### T4: Celebrant scene and interaction flow
**Status:** Completed in current repository history.  
**Do:** Build the gift-box reveal, cake/candle scene, dynamic birthday message, birthdate note placement, floating prompts, mic countdown, sensitivity meter, blow detection, and tap fallback.  
**Files:** `src/App.jsx`, `src/lib/audio.js`, `src/styles.css`  
**Verify:** Manual: open a generated link, reveal the cake, blow/tap the candle, and confirm the fallback works when mic is denied.

### T5: Celebration effects and audio
**Status:** Completed in current repository history.  
**Do:** Add canvas confetti/party effects, festive decorations, wish notes display, locally generated looping HTML5 birthday audio, and mute/unmute control after user interaction.  
**Files:** `scripts/create-birthday-audio.mjs`, `src/components/ConfettiCanvas.jsx`, `src/App.jsx`, `src/styles.css`, `public/audio/happy-birthday.wav`  
**Verify:** `npm run build`; Manual: confirm celebration starts after candle blow and audio can be muted/unmuted.

### T6: Reusable creation flow and Vercel readiness
**Do:** Make the create-another/new-greeting path return to a clean builder while preserving old copied links, clarify in UI that each link is independent, keep hash decoding backward compatible for current `v=1` links, and verify Vercel static build assumptions.  
**Files:** `src/App.jsx`, `src/lib/shareData.js`, `vite.config.js`, `package.json`, `src/styles.css`  
**Verify:** `npm run build`; Manual: generate two different links, open both, and confirm the first link still renders its original greeting.

### T7: Surprise scene choreography and reactive candle
**Do:** Replace the old floating prompts with a curly/circular broken-arrow open-gift cue, remove redundant pre-blow birthday text outside the cake, keep the cake decorated before blow-out, reveal the embedded cake message only after blow-out, show make-a-wish-before-blow guidance, make candle glow react to mic level, and transition the room from dim to bright/festive after blow-out.  
**Files:** `src/App.jsx`, `src/lib/audio.js`, `src/styles.css`  
**Verify:** `npm run build`; Manual: open a generated link, verify the gift cue points to the box, the cake message stays hidden until blow-out, candle glow reacts to mic meter, and the background brightens after blow-out.

### T8: Floating letter notes and all-ages festive polish
**Do:** Update creator note placeholders to include `- from sender`, replace static post-celebration notes with floating letter/envelope elements, open each note like an actual letter on click/tap, and retune the main page plus shared theme to feel modern, festive, happy, and age-neutral.  
**Files:** `src/App.jsx`, `src/styles.css`  
**Verify:** `npm run build`; Manual: notes appear as floating letters after celebration, each opens/readably closes or dismisses, note placeholder encourages sender names, and the builder page no longer feels plain or overly dark.

## Done
- [ ] `git status --short` works before app implementation commits.
- [ ] `npm run build` passes.
- [ ] Manual: creator can generate, copy, and native-share a URL.
- [ ] Manual: creator can return from celebrant view to a clean builder and generate another independent link.
- [ ] Manual: two generated links remain independent; opening an old link still shows the old greeting data.
- [ ] Manual: copy-link still works when native share is unavailable.
- [ ] Manual: generated URL opens a personalized celebrant page using only URL data.
- [ ] Manual: creator validation enforces name/from/age/note limits and blocks URLs over 2,000 chars.
- [ ] Manual: gift box opens and reveals the cake.
- [ ] Manual: pre-open gift cue uses a curly/circular broken-arrow style pointing to the box, not the old `Make a wish!` / `Blow the candle` floating prompt pair.
- [ ] Manual: after gift open, UI emphasizes making a wish first, then blowing the candle.
- [ ] Manual: cake text uses ordinal birthday format, including `11th`, `12th`, and `13th`.
- [ ] Manual: birthday text is hidden before blow-out and appears embedded on the cake only after the candle is blown out.
- [ ] Manual: microphone blow detection works on localhost when permission is granted.
- [ ] Manual: candle glow reacts to mic volume before the blow threshold is reached.
- [ ] Manual: `Tap to Blow` works when mic is denied, blocked, unsupported, or unreliable.
- [ ] Manual: candle flame disappears, celebration animation starts, notes display, and audio loops after interaction.
- [ ] Manual: room/background shifts from dim candle-lit surprise mode to brighter all-ages celebration mode after blow-out.
- [ ] Manual: wish notes appear as floating letters and open like actual letters on click/tap.
- [ ] Manual: wish note placeholders include `- from sender`.
- [ ] Manual: mute/unmute control works.
- [ ] Manual: reduced-motion preference reduces or disables nonessential celebration motion.
- [ ] Manual: Vercel settings are compatible: build command `npm run build`, output directory `dist`, no backend functions required.
- [ ] No backend, database, TypeScript, or server persistence was introduced.

## Revision Log

### Rev 1 - 2026-05-28
**Change:** Tightened execution readiness by adding Git metadata readiness, exact URL payload limits, ordinal birthday formatting, native-share fallback behavior, reduced-motion handling, and a local generated HTML5 audio asset path.  
**Reason:** Governance review found execution blockers around invalid Git metadata and unresolved audio assets, plus concerns around vague URL limits and birthday text formatting.  
**Updated Done criteria:** Added Git readiness, copy fallback, validation/URL limits, ordinal formatting, and reduced-motion verification.

### Rev 2 - 2026-05-29
**Change:** Added reusable multi-link creation behavior, old-link preservation, Vercel static hosting assumptions, revised surprise UI choreography, reactive candle glow, delayed cake message reveal, floating letter notes, note sender placeholder guidance, and a brighter all-ages festive theme.  
**Reason:** User wants to reuse the app for multiple friends, preserve previously shared links, deploy to Vercel, and make the celebrant experience feel more like a dim-room birthday surprise that becomes bright and celebratory after the candle is blown out.  
**Updated Done criteria:** Added independent-link verification, clean builder return, Vercel static deployment checks, gift-arrow prompt verification, make-wish-before-blow guidance, delayed cake text, reactive candle light, bright room transition, floating letter notes, and note placeholder verification. Rev 2 execution is limited to T6-T8 because T1-T5 are already completed in repository history.
