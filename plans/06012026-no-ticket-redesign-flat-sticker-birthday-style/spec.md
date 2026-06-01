# Redesign Flat Sticker Birthday Style

## Why
The current birthday app has accumulated multiple cartoon-room directions and no longer matches the requested simple flat sticker style. This redesign resets the visual language while preserving the existing shareable birthday greeting behavior.

## What
Redesign the creator and celebrant experiences into a consistent flat sticker-style birthday app: flat colors, no gradients, white sticker borders, small shadows, a single global one-color watermark background, redesigned sticker-like gift/cake/card/balloons/banner/notes, and preserved sharing, mic, tap, audio, and confetti behavior.

## Context

**Relevant files:**
- `src/App.jsx` - owns creator form, gift-open flow, blow/candle state, post-blow celebration UI, controls, and interaction state.
- `src/styles.css` - owns the current visual system, CSS artwork, layout, animation, responsive behavior, and reduced-motion handling.
- `src/components/ConfettiCanvas.jsx` - owns falling confetti after the candle is blown out.
- `src/lib/shareData.js` - owns URL hash payload, validation limits, draft helpers, and ordinal age formatting.
- `src/lib/audio.js` - owns microphone blow detection and audio-level callbacks.

**Patterns to follow:**
- Keep the app as plain Vite + React JavaScript with CSS artwork.
- Keep visual artwork in CSS/JSX rather than adding image dependencies.
- Preserve existing browser API helpers instead of moving mic/share/audio behavior into styling work.

**Key decisions already made:**
- No database, backend, router, or new app architecture.
- No new dependency for banner physics unless explicitly approved later.
- Confetti remains lightweight canvas-based.
- The birthday data contract remains the existing URL hash payload.

## Constraints

**Must:**
- Use a flat sticker visual style: flat colors, no gradients, white sticker borders, small offset shadows, bold simple shapes.
- Apply the sticker treatment specifically to the balloons, cake, gift, folded card, and sticky notes: each should read as a flat object with a visible white outer border and a small shadow.
- Use the same simple background on every page: one solid background color with diagonal birthday hat and gift outline drawings as a watermark pattern.
- Preserve URL hash sharing, validation limits, local draft behavior, mic blow detection, tap-anywhere fallback, audio behavior, mute behavior, and static Vercel compatibility.
- Make the gift page clickable anywhere on screen to open the gift.
- Redesign the gift as a simple red/yellow flat sticker gift.
- Redesign the blowing page with one candle only, a two-layer cake, yellowish cake bases, pink icing/topping, blue and yellow sprinkles, and a white plate.
- Show the floating message: `Make a wish, and blow the candle!`
- Redesign the blown page with the cake centered and a folded card placed on or near the cake plate area.
- Make the card start closed, open with a book-like animation on click, then settle into one whole rectangular readable card page that reveals the birthday message.
- Add a full-width top balloon/circle bar with overlapping clickable circles that pop and regenerate later.
- Add hanging `Happy Birthday` banner/bunting below the balloons. The real/physics-like motion applies only to the individual hanging banting letters or flags attached to the string.
- Show up to 5 notes as draggable sticky-note flat stickers in different colors.
- Keep falling confetti after blow-out.
- Put the two post-blow controls at the top right as icon-only buttons.
- Respect `prefers-reduced-motion` by reducing nonessential animation and hover motion.
- Keep mobile layouts readable with no overlapping card, cake, controls, balloons, banner, or notes.
- Rev 2 refinement must make the gift slightly larger and keep it visually centered on the gift page.
- Rev 2 refinement must change the blowing-page wish note so it reads as curved/arched text or a curved sticker treatment without a filled background panel; readability must still be preserved with stroke, outline, or shadow.
- Rev 2 refinement must make the cake the primary visual highlight of the app. The cake may change colors at implementation discretion, but it must remain flat, sticker-like, two-layered, and exactly one candle.
- Rev 2 refinement must add more balloons to the blown page without blocking controls, the cake, card, or sticky notes.
- Rev 2 refinement must align the banner string with the individual hanging banting letters/flags so each flag visibly hangs from the string.
- Rev 2 refinement must place the birthday card on or near the cake plate area and keep it closed first.
- Rev 2 refinement must make the card open like a book from the closed folded state, then settle into one whole readable rectangular card page, not remain as a split-panel book view.
- Rev 2 open-card layout must show birthdate at the top right, the birthday message centered, and the from label at the bottom right.
- Rev 2 open-card birthday message must use a cursive/script-like font treatment while staying readable.

**Must not:**
- Do not change `src/lib/shareData.js` payload format or validation rules unless a defect is found.
- Do not change microphone detection thresholds or audio asset behavior unless required by the redesign.
- Do not introduce new dependencies for physics, drag, icons, or animation.
- Do not add gradients.
- Do not keep old dark-room, glow-heavy, or multi-candle visual assumptions.
- Do not apply physics behavior to balloons, cake, gift, card, sticky notes, confetti, or the whole scene.
- Do not vary the background pattern between creator, gift, blowing, and blown pages.
- Do not mix unrelated refactors into the redesign.
- Do not remove contrast from the blowing-page wish note while removing its filled background.
- Do not add extra candles or change the birthday data contract while redesigning the cake/card.

**Out of scope:**
- Backend storage, accounts, analytics, routing, deployment changes, and new audio generation.
- Literal rigid-body physics engine behavior outside the hanging banting letters/flags.
- Rewriting the creator data model or share-link format.

## Risk

**Level:** 3

**Risks identified:**
- "Real physics" for the banner can pull in unnecessary complexity and new dependencies. -> **Mitigation:** limit the effect to the individual hanging banting letters/flags on the string, implement physics-like hover movement with CSS transitions or small local JS spring-style state only, and pause before adding any physics library.
- Draggable sticky notes can interfere with tap-anywhere blow behavior and mobile scrolling. -> **Mitigation:** enable note dragging only in post-blow state, ignore controls/card targets in scene tap handling, and keep drag constraints within the viewport.
- Full-width balloons, bunting, card, cake, confetti, and notes can clutter small screens. -> **Mitigation:** define responsive z-index/layering rules, reduce balloon/note density on mobile, and verify mobile screenshots manually.
- Visual reset can accidentally break app behavior. -> **Mitigation:** limit implementation to `src/App.jsx`, `src/styles.css`, and only touch `ConfettiCanvas.jsx` if confetti colors need alignment; preserve helper files.
- Rev 2 card and cake changes can overlap on mobile if the card moves onto the plate area. -> **Mitigation:** keep the closed card compact, make the open card scale responsively, and verify mobile layout after opening.
- Rev 2 cake redesign can regress the one-candle/two-layer contract. -> **Mitigation:** keep explicit Done criteria for exactly one candle and two cake layers.

**Pushback:**
- A physics dependency does not belong in this app for banner hover. Future-us will hate maintaining an engine for decorative bunting. Use lightweight physics-like motion on the hanging letters/flags only unless the product explicitly requires true simulation.
- Do not turn this into another decorative pile-up. The hierarchy is one focal point per phase: gift, then cake/candle, then cake/card with celebration elements supporting it.
- Removing the blowing-note background cannot mean sacrificing readability. Use a curved text treatment with a white sticker stroke or strong shadow instead of invisible text on the watermark.

## Tasks

### T1: Sticker Visual System And Background
**Do:** Replace the current dark/glow-heavy styling with flat sticker tokens, one global solid-color diagonal hat/gift outline watermark background, white sticker borders, small shadows, no gradients, and creator-page styling that matches the new visual language.
**Files:** `src/styles.css`
**Verify:** `npm run build`; Manual: creator, gift, blowing, and blown pages share the same flat background/watermark language and no gradients are visible.

### T2: Gift And Blowing Scenes
**Do:** Update the celebrant pre-blow JSX and CSS so the gift page opens from any non-control screen click, the gift is simple red/yellow sticker artwork, the cake uses one candle, two yellowish layers, pink icing, blue/yellow sprinkles, a white plate, and the floating wish/blow message.
**Files:** `src/App.jsx`, `src/styles.css`
**Verify:** `npm run build`; Manual: generated greeting opens to the gift, clicking anywhere opens it, cake appears with exactly one candle, mic blow and repeated tap fallback still blow out the candle.

### T3: Blown Celebration Interactions
**Do:** Redesign post-blow layout with centered sticker cake, clickable folded sticker side card opening like a book, full-width overlapping sticker balloon bar with pop/regenerate behavior, hanging banting letters/flags with physics-like hover motion on the string, draggable sticker sticky notes, icon-only top-right controls, and existing confetti.
**Files:** `src/App.jsx`, `src/styles.css`, `src/components/ConfettiCanvas.jsx`
**Verify:** `npm run build`; Manual: card opens and reveals the dynamic message, balloons pop and return, notes drag without blocking controls, banner moves on hover, buttons remain icon-only.

### T4: Responsive And Regression Pass
**Do:** Tune desktop/mobile spacing, layering, reduced-motion styles, focus states, and text sizing so the sticker redesign remains readable and does not overlap. Confirm the share-link, create-new, mute, audio, mic, and fallback flows still work.
**Files:** `src/App.jsx`, `src/styles.css`
**Verify:** `npm run build`; Manual: test creator form, generated link reload, gift open, candle blow/tap fallback, blown celebration, card open, balloon pop, note drag, mute, and new greeting on desktop and mobile widths.

### T5: Rev 2 Visual Refinements
**Do:** Make the gift larger and centered; redesign the wish/blow note as curved readable text without a filled background; redesign the cake as the main flat sticker highlight with exactly one candle and two layers; add more post-blow balloons; align the banner string to the hanging banting letters/flags; move the birthday card onto/near the cake plate area; keep the card closed first; make the card open with a book-like animation, then settle into one whole readable rectangular card with birthdate top right, cursive centered message, and from label bottom right.
**Files:** `src/App.jsx`, `src/styles.css`
**Verify:** `npm run build`; Manual: gift is larger/centered, wish note is curved with no filled panel, cake is visually dominant and still one candle/two layers, balloon count is increased, banner letters visibly hang from the string, card starts closed on the plate area, and open card layout is readable on desktop and mobile.

## Done
- [ ] `npm run build` passes.
- [ ] No gradients remain in the visible UI.
- [ ] All pages use one consistent flat background with diagonal birthday hat/gift watermark outlines.
- [ ] Balloons, cake, gift, folded card, and sticky notes all have visible white sticker borders and small shadows.
- [ ] Gift page uses simple red/yellow sticker gift and opens from clicking anywhere on the page.
- [ ] Blowing page shows one-candle two-layer sticker cake, white plate, pink icing, blue/yellow sprinkles, and the exact wish/blow message.
- [ ] Blown page shows centered cake, clickable folded card with dynamic birthday message, clickable regenerating balloon bar, physics-like motion only on hanging banting letters/flags, draggable five-note sticker design, falling confetti, and icon-only top-right controls.
- [ ] Rev 2 gift is slightly larger and centered.
- [ ] Rev 2 blowing-page wish note is curved/readable and has no filled background panel.
- [ ] Rev 2 cake is the main visual highlight, flat sticker-like, exactly one candle, and exactly two layers.
- [ ] Rev 2 blown page has more balloons without blocking the cake, card, controls, banner, or notes.
- [ ] Rev 2 banner string aligns with the hanging banting letters/flags.
- [ ] Rev 2 card starts closed on/near the cake plate area, opens with a book-like animation, then settles into one whole readable rectangular card with birthdate top right, cursive centered message, and from label bottom right.
- [ ] Existing share-link, validation, local draft, mic blow, tap fallback, audio, mute, and new-greeting behavior still work.
- [ ] Mobile and desktop layouts have no incoherent overlaps.

## Revision Log

### Rev 1 — June 1, 2026
**Change:** Clarified that balloons, cake, gift, folded card, and notes must all read as sticker-like objects with white borders and small shadows; the same solid-color diagonal birthday hat/gift outline watermark background must appear on every page; and physics-like behavior is scoped only to the individual hanging banting letters/flags on the string.

**Reason:** The original spec captured the general direction but left room for inconsistent sticker treatment, per-page background drift, and over-broad physics behavior.

**Updated Done criteria:** Added explicit sticker-border verification and narrowed the blown-page banner criterion to physics-like motion only on hanging banting letters/flags.

### Rev 2 — June 1, 2026
**Change:** Added refinement scope for a larger centered gift, curved no-panel blowing note, more balloons, better aligned banting string, redesigned plate-area card, readable whole-card open state, card birthdate/message/from layout, cursive message treatment, and a stronger cake redesign.

**Reason:** The first implementation established the flat sticker direction, but the cake/card/banner/gift details need more visual hierarchy and clearer layout. The cake should be the app highlight.

**Updated Done criteria:** Added explicit Rev 2 checks for gift centering/scale, curved note treatment, cake prominence and one-candle/two-layer contract, increased balloon count, banner string alignment, and readable card layout.

### Rev 3 — June 1, 2026
**Change:** Clarified the card interaction: the card starts closed like a folded card/book, opens with a book-like animation, then settles into one whole rectangular readable card page.

**Reason:** Rev 2 needed to preserve the desired book-like opening motion without leaving the final open state as a split-panel book.

**Updated Done criteria:** T5 and Done now require a closed folded card, book-like opening animation, and final one-page readable card layout.
