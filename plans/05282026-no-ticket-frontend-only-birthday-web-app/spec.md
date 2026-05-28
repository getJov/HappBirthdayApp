# Frontend-Only Birthday Web App

## Why
Create a shareable birthday greeting experience without backend hosting complexity, accounts, or database storage. The app should let someone build a personalized birthday page and send it as a link.

## What
Build a Vite + React JavaScript frontend app where a creator enters a celebrant name, age, optional from label, optional birthdate, and short wish notes, then gets a shareable URL containing the greeting data. Opening the link shows a dark gift-box birthday scene that reveals a cake, supports microphone or tap-to-blow interaction, then plays a looping birthday song and shows celebration effects plus friend notes.

## Context

**Relevant files:**
- `package.json` - project scripts and frontend dependencies to create.
- `index.html` - Vite HTML entry.
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
- Repo metadata: the current `.git` directory is invalid/empty; execution must repair or initialize Git before task-level commits.

## Constraints

**Must:**
- Scaffold a JavaScript Vite React app.
- Encode name, age, optional from label, optional birthdate, and short notes into a versioned shareable URL hash using a compact payload, e.g. `#v=1&data=...`.
- Enforce creator-side limits: name max 40 chars, from label max 40 chars, age 1-120, max 5 wish notes, each note max 120 chars, and warn/block if the generated URL exceeds 2,000 chars.
- Default the from label to `Friends`.
- Keep wish notes short and enforce limits before generating links.
- Show a gift box first; tapping/clicking opens the cover and reveals the cake.
- Show a dark, glowing, festive, responsive, mobile-friendly celebrant page.
- Show dynamic cake text with ordinal age formatting: `Happy {ageOrdinal} Birthday, {name}!` and `from: {from}`. Handle `1st`, `2nd`, `3rd`, `4th`, and the `11th`/`12th`/`13th` exceptions correctly.
- Display the optional birthdate on the note area, upper right side.
- Include floating prompts: `Make a wish!` and `Blow the candle`.
- Include a microphone sensitivity meter, countdown before listening, and fallback `Tap to Blow` button.
- Start audio only after user interaction and provide mute/unmute.
- Use HTML5 Audio with `public/audio/happy-birthday.wav`, generated locally by `scripts/create-birthday-audio.mjs` during implementation.
- Keep copy-link as the primary share path and use native share only when `navigator.share` is available.
- Keep animations lightweight enough for mobile.
- Respect `prefers-reduced-motion` by reducing or disabling nonessential animation intensity.

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

## Risk

**Level:** 2

**Risks identified:**
- Microphone access is browser- and context-dependent, often requiring HTTPS or localhost. -> **Mitigation:** make mic support progressive enhancement and always show `Tap to Blow`.
- URL length can break if too many notes are encoded. -> **Mitigation:** cap note count and note length in the creator UI; keep encoded data compact.
- Browser autoplay policies will block music before interaction. -> **Mitigation:** only start the HTML5 Audio loop after gift opening or blow/tap interaction, and expose mute/unmute.
- HTML5 Audio requires an actual audio asset. -> **Mitigation:** generate `public/audio/happy-birthday.wav` locally during implementation with `scripts/create-birthday-audio.mjs`; do not depend on network assets.
- Current Git metadata is invalid/empty, but execution requires task-level commits. -> **Mitigation:** make repository initialization/repair the first execution task before app implementation begins.

**Pushback:**
- Do not overbuild this with routing, global state libraries, or backend-shaped abstractions. Future-us will hate a tiny greeting app pretending to be a platform.
- URL-only sharing means the link itself contains the greeting data. Keep private/sensitive messages out of scope unless a backend is added later.

## Tasks

### T1: Repository metadata readiness
**Do:** Repair or initialize Git metadata in the project root, then create the initial baseline commit containing `AGENTS.md` and the active spec so later task-level commits can proceed normally.  
**Files:** `.git`, `AGENTS.md`, `plans/05282026-no-ticket-frontend-only-birthday-web-app/spec.md`  
**Verify:** `git status --short`

### T2: Vite React JavaScript scaffold
**Do:** Create the Vite React JavaScript project structure, package scripts, app entry, and base CSS reset/layout.  
**Files:** `package.json`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/styles.css`  
**Verify:** `npm run build`

### T3: Creator form and share data contract
**Do:** Build the creator form, validation/limits, optional local draft persistence, versioned URL hash encoding/decoding, copy-link button, and native-share button when available.  
**Files:** `src/App.jsx`, `src/lib/shareData.js`, `src/styles.css`  
**Verify:** Manual: create a link, reload it, and confirm the greeting data survives only through the URL.

### T4: Celebrant scene and interaction flow
**Do:** Build the gift-box reveal, cake/candle scene, dynamic birthday message, birthdate note placement, floating prompts, mic countdown, sensitivity meter, blow detection, and tap fallback.  
**Files:** `src/App.jsx`, `src/lib/audio.js`, `src/styles.css`  
**Verify:** Manual: open a generated link, reveal the cake, blow/tap the candle, and confirm the fallback works when mic is denied.

### T5: Celebration effects and audio
**Do:** Add canvas confetti/party effects, festive decorations, wish notes display, locally generated looping HTML5 birthday audio, and mute/unmute control after user interaction.  
**Files:** `scripts/create-birthday-audio.mjs`, `src/components/ConfettiCanvas.jsx`, `src/App.jsx`, `src/styles.css`, `public/audio/happy-birthday.wav`  
**Verify:** `npm run build`; Manual: confirm celebration starts after candle blow and audio can be muted/unmuted.

## Done
- [ ] `git status --short` works before app implementation commits.
- [ ] `npm run build` passes.
- [ ] Manual: creator can generate, copy, and native-share a URL.
- [ ] Manual: copy-link still works when native share is unavailable.
- [ ] Manual: generated URL opens a personalized celebrant page using only URL data.
- [ ] Manual: creator validation enforces name/from/age/note limits and blocks URLs over 2,000 chars.
- [ ] Manual: gift box opens and reveals the cake.
- [ ] Manual: cake text uses ordinal birthday format, including `11th`, `12th`, and `13th`.
- [ ] Manual: microphone blow detection works on localhost when permission is granted.
- [ ] Manual: `Tap to Blow` works when mic is denied, blocked, unsupported, or unreliable.
- [ ] Manual: candle flame disappears, celebration animation starts, notes display, and audio loops after interaction.
- [ ] Manual: mute/unmute control works.
- [ ] Manual: reduced-motion preference reduces or disables nonessential celebration motion.
- [ ] No backend, database, TypeScript, or server persistence was introduced.

## Revision Log

### Rev 1 - 2026-05-28
**Change:** Tightened execution readiness by adding Git metadata readiness, exact URL payload limits, ordinal birthday formatting, native-share fallback behavior, reduced-motion handling, and a local generated HTML5 audio asset path.  
**Reason:** Governance review found execution blockers around invalid Git metadata and unresolved audio assets, plus concerns around vague URL limits and birthday text formatting.  
**Updated Done criteria:** Added Git readiness, copy fallback, validation/URL limits, ordinal formatting, and reduced-motion verification.
