# Frontend-Only Birthday Web App

## Why
Create a shareable birthday greeting experience without backend hosting complexity, accounts, or database storage. The app should let someone build a personalized birthday page and send it as a link.

## What
Build a Vite + React JavaScript frontend app where a creator enters a celebrant name, age, optional from label, optional birthdate, and short wish notes, then gets a shareable URL containing the greeting data. Opening the link shows a polished surprise birthday scene that starts lightly dimmed with a glowing gift box and candle-lit modern cake, supports microphone or tap-to-blow interaction, then switches to a bright festive room with celebration effects, looping birthday music, highly visible embedded cake message, and floating letter-style notes.

## Context

**Relevant files:**
- `package.json` - project scripts and frontend dependencies to create.
- `index.html` - Vite HTML entry.
- `vite.config.js` - Vite React plugin configuration and static build behavior.
- `src/main.jsx` - React mount entry.
- `src/App.jsx` - top-level creator/share/celebrant flow.
- `src/styles.css` - responsive visual system, creator layout, birthday room, cake, gift box, notes, and animation styles.
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
- Align the `open it` cue so the arrow clearly points to the gift box on desktop and mobile.
- Make the gift box glow enough to feel tappable and important before it opens.
- Show a lightly dimmed room while the candle is lit, not a near-black background, then transition to a bright, happy, all-ages festive room after the candle is blown out.
- Show dynamic cake text with ordinal age formatting: `Happy {ageOrdinal} Birthday, {name}!` and `from: {from}`. Handle `1st`, `2nd`, `3rd`, `4th`, and the `11th`/`12th`/`13th` exceptions correctly.
- Redesign the cake so it feels modern, friendly, all-ages, and visually prominent. The cake should stand out from the room and celebration effects.
- Visually attach the candle to the cake top; it must not look like it is floating above the cake.
- Hide the birthday text before the candle is blown out. Before blow-out, the cake should look decorated but should not show the final birthday text. After blow-out, reveal the text as a clear embedded cake inscription with enough contrast and scale to be readable.
- Make the cake and birthday message the primary visual focus after blow-out.
- Display the optional birthdate on the note area, upper right side.
- Remove the old floating prompt pair `Make a wish!` and `Blow the candle`. Replace it with a playful curly/circular broken-arrow visual pointing to the gift box with concise open-the-gift copy.
- After the gift opens, emphasize the sequence: make a wish first, then blow the candle.
- Make the candle glow/light reactive to microphone volume so users can see whether blowing is being detected before the threshold is reached.
- Include a microphone sensitivity meter, countdown before listening, and fallback `Tap to Blow` button.
- Show wish notes as floating letter/envelope elements after the celebration starts. Clicking/tapping a note opens it like an actual letter.
- Make floating notes visibly float around the celebration screen rather than reading like a static panel.
- Add more birthday hats/decorations while keeping motion lightweight and nonblocking.
- Start audio only after user interaction and provide mute/unmute.
- Use HTML5 Audio with `public/audio/happy-birthday.wav`, generated locally by `scripts/create-birthday-audio.mjs` during implementation.
- Keep copy-link as the primary share path and use native share only when `navigator.share` is available.
- Keep animations lightweight enough for mobile.
- Respect `prefers-reduced-motion` by reducing or disabling nonessential animation intensity.
- Maintain Vercel static deployment compatibility. No route handling should require a backend; hash-based links should load on direct visits.
- Keep creator-page copy user-facing only. Remove technical/internal explanations such as frontend-only, URL hash, local browser state, independent-link implementation details, and database/backend language from visible UI. Keep only the information users need to create and share a greeting.
- Replace the accumulated visual style with one coherent minimal magical birthday room reveal direction. The experience should feel cleaner, modern, warm, all-ages, and intentional.
- Redesign the creator page around a calm, premium birthday-maker interface with clear hierarchy, simpler surfaces, warmer color discipline, modern spacing, and a preview that visually matches the birthday scene.
- Redesign the gift reveal scene so the unopened gift is the single pre-open focal point in a softly dimmed room with a clear cue, restrained glow, and minimal competing decoration.
- Redesign the post-open/post-blow celebration around a bright room reveal where the cake and cake message remain the primary focus; decorations, confetti, notes, and controls must support the scene rather than compete with it.
- Redesign sticky notes so they read as friendly lightweight notes around the celebration scene, with responsive placement that avoids blocking the cake, controls, and message.
- Keep the existing app functionality and data behavior unchanged during the redesign: URL hash format, validation limits, local draft behavior, create-new flow, mic behavior, tap fallback, audio behavior, mute behavior, and Vercel static compatibility must be preserved.
- Add continuous birthday banners/garlands to the room background. Banners must sit behind the gift/cake/sticky notes/controls, feel integrated with the room, and remain lightweight/responsive.
- Fix the cake decoration placement so the candle, candle base/socket, and sprinkles visibly sit on the cake surfaces instead of floating outside the cake.

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
- Cake/message visibility can regress if decorations compete with the inscription. -> **Mitigation:** make the cake/message hierarchy explicit: large cake, attached candle, clean surface, high-contrast inscription revealed only after blow-out.
- Decorative hats/notes can clutter mobile screens. -> **Mitigation:** use responsive placement, cap density on small screens, and respect reduced-motion preferences.
- A full visual redesign can accidentally change feature behavior or share-link compatibility. -> **Mitigation:** limit Rev 6 to `src/App.jsx` structure needed for presentation and `src/styles.css`; preserve share-data, audio, mic, validation, and routing helpers.
- A minimal magical direction can become too plain if decoration is removed without replacing hierarchy. -> **Mitigation:** use room lighting, gift focus, cake scale, color contrast, and restrained edge decorations as the visual interest instead of adding more objects.
- Background banners can clutter the scene or compete with the cake. -> **Mitigation:** place banners in the background layer, keep opacity restrained, and verify they do not overlap primary UI on mobile.
- Cake sprinkles and candle can drift visually when using absolute positioning and responsive scaling. -> **Mitigation:** anchor decoration elements inside the cake/top coordinate space and avoid large box-shadow offsets that extend beyond the cake.

**Pushback:**
- Do not overbuild this with routing, global state libraries, or backend-shaped abstractions. Future-us will hate a tiny greeting app pretending to be a platform.
- URL-only sharing means the link itself contains the greeting data. Keep private/sensitive messages out of scope unless a backend is added later.
- This should still be a birthday app, not a generic party dashboard. Avoid generic gradient-card clutter; make the gift, candle, cake, letters, and room-light transition carry the experience.
- User-facing copy should not explain the implementation. People creating a birthday link need direct labels and actions, not engineering details.
- The current UI has accumulated too many disconnected visual ideas. Do not keep layering fixes on top of the existing look. Rev 6 should reset the visual language while preserving the product contract.
- Rev 7 is a visual correction, not another redesign. Do not change the share-data contract, microphone/audio behavior, creator flow, note behavior, or app architecture to fix decoration placement.

## Tasks

**Execution note:** T1-T12 are completed project history. The next implementation pass for Rev 7 must execute only T13, then run the full Done checklist items affected by Rev 7.

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
**Status:** Completed in current repository history.  
**Do:** Make the create-another/new-greeting path return to a clean builder while preserving old copied links, clarify in UI that each link is independent, keep hash decoding backward compatible for current `v=1` links, and verify Vercel static build assumptions.  
**Files:** `src/App.jsx`, `src/lib/shareData.js`, `vite.config.js`, `package.json`, `src/styles.css`  
**Verify:** `npm run build`; Manual: generate two different links, open both, and confirm the first link still renders its original greeting.

### T7: Surprise scene choreography and reactive candle
**Status:** Completed in current repository history.  
**Do:** Replace the old floating prompts with a curly/circular broken-arrow open-gift cue, remove redundant pre-blow birthday text outside the cake, keep the cake decorated before blow-out, reveal the embedded cake message only after blow-out, show make-a-wish-before-blow guidance, make candle glow react to mic level, and transition the room from dim to bright/festive after blow-out.  
**Files:** `src/App.jsx`, `src/lib/audio.js`, `src/styles.css`  
**Verify:** `npm run build`; Manual: open a generated link, verify the gift cue points to the box, the cake message stays hidden until blow-out, candle glow reacts to mic meter, and the background brightens after blow-out.

### T8: Floating letter notes and all-ages festive polish
**Status:** Completed in current repository history.  
**Do:** Update creator note placeholders to include `- from sender`, replace static post-celebration notes with floating letter/envelope elements, open each note like an actual letter on click/tap, and retune the main page plus shared theme to feel modern, festive, happy, and age-neutral.  
**Files:** `src/App.jsx`, `src/styles.css`  
**Verify:** `npm run build`; Manual: notes appear as floating letters after celebration, each opens/readably closes or dismisses, note placeholder encourages sender names, and the builder page no longer feels plain or overly dark.

### T9: Birthday scene UI refinement
**Status:** Completed in current repository history.  
**Do:** Refine the current birthday scene and creator copy without changing the share-data contract. Align the `open it` cue so it clearly points to the gift, add gift glow, lighten the pre-blow scene, redesign the cake as modern/all-ages/friendly, attach the candle to the cake top, increase cake/message prominence and inscription contrast after blow-out, make notes visibly float around the screen, add more hats/decorations, and simplify creator-page copy to only user-facing guidance.  
**Files:** `src/App.jsx`, `src/styles.css`  
**Verify:** `npm run build`; Manual: open a generated link on desktop/mobile, confirm the gift cue points to the gift, the gift glows, the pre-blow scene is not overly dark, the candle is attached to the cake, the cake and post-blow message are visually dominant/readable, notes float around the screen, extra hats/decorations appear without blocking the cake, and creator copy contains no technical/internal explanations.

### T10: Note interaction and cake inscription correction
**Status:** Completed in current repository history.  
**Do:** Fix floating note click/tap behavior so every visible note reliably opens its letter. Redesign the cake again to better match a modern all-ages birthday cake, keeping the candle attached and the cake visually prominent. Remove the white/background panel behind the birthday inscription; the message should look embedded on the cake surface itself while staying readable through color, shadow, stroke, placement, or icing-style treatment.  
**Files:** `src/App.jsx`, `src/styles.css`  
**Verify:** `npm run build`; Manual: after blowing out the candle, click/tap each visible note and confirm it opens; confirm the redesigned cake is visually stronger than the previous version; confirm the birthday message has no white panel/card behind it and remains readable as part of the cake design.

### T11: CSS pseudo-3D birthday cake
**Status:** Completed in current repository history.
**Do:** Redesign the birthday cake using CSS pseudo-3D, not Three.js or a new dependency. Add layered cake depth, a top frosting ellipse, shaded side/front faces, stronger contact shadows, an attached candle base/socket on the top surface, and a piped front-face birthday message that reads as icing on the cake. Preserve existing celebration flow, share-data behavior, microphone behavior, audio behavior, sticky notes, and creator form behavior.
**Files:** `src/App.jsx`, `src/styles.css`
**Verify:** `npm run build`; Manual: open a generated link, reveal the cake, confirm the cake reads as pseudo-3D with visible top/side/front depth, the candle base is attached to the top surface, and after blow-out the birthday message appears piped onto the front face rather than floating or sitting on a panel.

### T12: Minimal magical visual redesign
**Status:** Completed in current repository history.
**Do:** Replace the current accumulated visual design with a cohesive minimal magical birthday room reveal. Redesign the creator page, gift reveal scene, cake presentation, sticky notes, decorations, color palette, spacing, and responsive layout for a cleaner modern all-ages experience. Preserve all existing functionality and data behavior: URL hash encoding/decoding, validation limits, local draft behavior, create-new flow, mic countdown/detection, tap fallback, candle blow state, audio loop/mute, sticky note content, copy-link/native-share, reduced-motion handling, and Vercel static compatibility. Use existing stack and assets only; do not add dependencies, backend code, TypeScript, routing changes, or new persistence.
**Files:** `src/App.jsx`, `src/styles.css`
**Verify:** `npm run build`; Manual: create a greeting, open the generated link, confirm the creator page feels modern and focused, the pre-open scene has one clear glowing gift focal point in a softly dimmed room, the cake/message are the dominant post-open/post-blow elements, notes/decorations do not block the cake or controls on desktop/mobile, and all existing interactions still work.

### T13: Background banners and cake decoration anchoring
**Do:** Add continuous birthday banners/garlands to the celebrant room background while keeping them behind the stage content and responsive on desktop/mobile. Fix the cake decoration anchoring so the candle and candle base/socket visibly attach to the top frosting surface, and sprinkles stay contained on the cake/frosting surfaces instead of appearing outside or floating. Preserve all existing functionality and share-data behavior: URL hash encoding/decoding, validation limits, local draft behavior, create-new flow, mic countdown/detection, tap fallback, candle blow state, audio loop/mute, sticky note content, copy-link/native-share, reduced-motion handling, and Vercel static compatibility.
**Files:** `src/App.jsx`, `src/styles.css`
**Verify:** `npm run build`; Manual: open a generated link on desktop and mobile, confirm continuous banners appear in the room background behind the gift/cake/notes/controls, confirm the candle is visually planted into the cake top, confirm sprinkles stay on cake/frosting surfaces, and confirm all existing interactions still work.

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
- [ ] Manual: `open it` cue is aligned and visually points to the gift on desktop and mobile.
- [ ] Manual: gift box has a visible glow and reads as the tappable focal point before opening.
- [ ] Manual: pre-blow scene is lightly dimmed but not near-black.
- [ ] Manual: after gift open, UI emphasizes making a wish first, then blowing the candle.
- [ ] Manual: cake text uses ordinal birthday format, including `11th`, `12th`, and `13th`.
- [ ] Manual: birthday text is hidden before blow-out and appears embedded on the cake only after the candle is blown out.
- [ ] Manual: candle is visually attached to the cake and does not appear to float.
- [ ] Manual: cake design feels modern, friendly, all-ages, and stands out from the background.
- [ ] Manual: post-blow cake inscription is high-contrast, readable, and visually prominent.
- [ ] Manual: microphone blow detection works on localhost when permission is granted.
- [ ] Manual: candle glow reacts to mic volume before the blow threshold is reached.
- [ ] Manual: `Tap to Blow` works when mic is denied, blocked, unsupported, or unreliable.
- [ ] Manual: candle flame disappears, celebration animation starts, notes display, and audio loops after interaction.
- [ ] Manual: room/background shifts from dim candle-lit surprise mode to brighter all-ages celebration mode after blow-out.
- [ ] Manual: wish notes appear as floating letters and open like actual letters on click/tap.
- [ ] Manual: every visible floating note is clickable/tappable and opens its letter reliably.
- [ ] Manual: wish notes visibly float around the celebration screen rather than staying in a static panel area.
- [ ] Manual: additional hats/decorations appear but do not block the cake or message.
- [ ] Manual: wish note placeholders include `- from sender`.
- [ ] Manual: creator page visible copy uses plain user-facing guidance and omits technical/internal explanations about frontend-only, URL hash, localStorage, backend/database, and implementation details.
- [ ] Manual: cake message has no white panel/card behind it and reads as embedded icing/decor on the cake surface.
- [ ] Manual: cake uses CSS pseudo-3D with visible layered depth, top frosting ellipse, shaded side/front faces, and strong contact shadow.
- [ ] Manual: candle has a visible base/socket attached to the cake top surface.
- [ ] Manual: birthday message appears as piped icing on the front cake face, not as floating text or a panel.
- [ ] Manual: creator page uses a cohesive modern birthday-maker design with clear hierarchy, restrained copy, consistent spacing, and no technical/internal implementation explanations.
- [ ] Manual: pre-open birthday scene follows the minimal magical room reveal direction: softly dimmed room, one clear gift focal point, clear open cue, and restrained glow.
- [ ] Manual: post-blow scene brightens into a clean all-ages celebration where the cake and birthday message remain the primary focus.
- [ ] Manual: redesigned cake, sticky notes, decorations, controls, and confetti feel visually consistent instead of patched together.
- [ ] Manual: sticky notes and decorations avoid blocking the cake, birthday message, mic controls, mute control, and New greeting button on desktop and mobile.
- [ ] Manual: Rev 6 visual redesign preserves existing URL hash data behavior, generated-link compatibility, local draft behavior, validation limits, create-new flow, mic fallback behavior, audio behavior, reduced-motion handling, and Vercel static build behavior.
- [ ] Manual: continuous birthday banners/garlands appear in the celebrant room background and remain behind the gift, cake, sticky notes, controls, and New greeting button.
- [ ] Manual: banners are responsive on desktop/mobile and do not clutter or block the cake/message.
- [ ] Manual: candle and candle base/socket visibly attach to the top frosting surface and no longer appear floating.
- [ ] Manual: sprinkles stay contained on the cake/frosting surfaces and do not appear outside the cake.
- [ ] Manual: Rev 7 preserves existing URL hash data behavior, generated-link compatibility, local draft behavior, validation limits, create-new flow, mic fallback behavior, audio behavior, reduced-motion handling, and Vercel static build behavior.
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

### Rev 3 - 2026-05-29
**Change:** Added a focused UI refinement pass for gift cue alignment, gift glow, lighter pre-blow scene, modern all-ages cake redesign, attached candle, stronger cake/message visibility, more visibly floating notes, additional hats/decorations, and cleaner user-facing creator copy.  
**Reason:** User feedback after Rev 2 found the gift cue misaligned, the scene too dark, the candle visually floating, the cake/message insufficiently prominent, notes not floating enough, and creator copy too technical.  
**Updated Done criteria:** Added verification for cue alignment, gift glow, lighter pre-blow scene, attached candle, modern prominent cake, readable post-blow inscription, visibly floating notes, nonblocking decorations, and creator copy without technical/internal implementation language. Rev 3 execution is limited to T9 because T1-T8 are already completed in repository history.

### Rev 4 - 2026-05-29
**Change:** Added a focused correction for note clickability, another cake redesign pass, and removal of the white/background panel behind the cake birthday message.  
**Reason:** User feedback after Rev 3 found floating notes not opening, the cake still not visually satisfactory, and the birthday message background panel undesirable.  
**Updated Done criteria:** Added verification that every visible note opens, the cake redesign improves the visual focus, and the cake message appears embedded directly on the cake without a white panel/card. Rev 4 execution is limited to T10 because T1-T9 are already completed in repository history.

### Rev 5 - 2026-05-31
**Change:** Added a focused CSS pseudo-3D cake pass with layered depth, side shading, top frosting ellipse, attached candle base, and piped front-face birthday message.  
**Reason:** User wants the cake to look more dimensional while keeping the app lightweight and frontend-only.  
**Updated Done criteria:** Added verification for pseudo-3D depth, top/side/front cake faces, attached candle base/socket, contact shadow, and front-face piped message. Rev 5 execution is limited to T11 because T1-T10 are already completed in repository history.

### Rev 6 - 2026-05-31
**Change:** Added a full visual redesign pass using a minimal magical birthday room reveal direction, covering the creator page, gift reveal scene, cake presentation, sticky notes, decorations, color palette, spacing, and responsive layout.
**Reason:** User feedback rejected the accumulated visual design as a whole; the next pass should reset the visual language instead of continuing isolated polish fixes.
**Updated Done criteria:** Added verification that the creator page, pre-open room, post-blow celebration, cake/message hierarchy, sticky notes, decorations, controls, and responsive layout feel cohesive, cleaner, modern, and all-ages while preserving all existing functionality and data behavior. Rev 6 execution is limited to T12 because T1-T11 are already completed in repository history.

### Rev 7 - 2026-05-31
**Change:** Added continuous celebrant-room birthday banners/garlands and a focused cake decoration anchoring correction for the candle, candle base/socket, and sprinkles.
**Reason:** User feedback after Rev 6 found the background still needs continuous birthday banners and that the sprinkles/candle visually appear outside or floating instead of attached to the cake.
**Updated Done criteria:** Added verification for background banners staying behind content, responsive/nonblocking banner behavior, visibly attached candle/base, contained sprinkles, and preservation of all existing functionality/share-data behavior. Rev 7 execution is limited to T13 because T1-T12 are already completed in repository history.
