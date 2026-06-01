# Redesign Flat Sticker Birthday Style

## Why
The current birthday app has accumulated multiple cartoon-room directions and no longer matches the requested simple flat sticker style. This redesign resets the visual language while preserving the existing shareable birthday greeting behavior.

## What
Redesign the creator and celebrant experiences into a consistent sticker-style birthday app: mostly flat colors, controlled premium cake/candle gradients, white sticker borders, small shadows, a single global one-color watermark background, redesigned sticker-like gift/cake/card/balloons/banner/notes, and preserved sharing, mic, tap, audio, and confetti behavior.

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
- Use a sticker visual style: mostly flat colors, white sticker borders, small offset shadows, bold simple shapes, and controlled soft gradients only where Rev 4 explicitly permits them.
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
- Rev 4 mobile polish must fix mobile layout weirdness without changing the share-link contract.
- Rev 4 blowing-page wish note must sit above the cake in an upward semicircle/arc, visually wrapping around the cake area, with no filled background panel.
- Rev 4 mobile balloons must remain perfect circles, not stretch into ovals.
- Rev 4 banting letters must remain visible and not be covered by the string or other decoration.
- Rev 4 card must sit on the cake plate at the lower-right side of the cake.
- Rev 4 closed card must look like a folded letter/folder with a second folded page slightly visible behind it.
- Rev 4 open card must still become one whole readable page card.
- Rev 4 sticky notes must look more clearly like sticky notes, with paper-like shape/details while preserving drag behavior.
- Rev 4 must add a visible theme toggle with two themes: pink default/current and blue alternate.
- Rev 4 theme toggle must affect page colors, creator preview background direction, and cake colors without changing URL hash payload data.
- Rev 4 cake must become a premium sticker-style birthday cake illustration: two-tier, thick white die-cut outline, soft layered depth, rounded friendly shapes, pastel cream layers, vibrant frosting, glossy frosting drips, decorative cherries, sprinkles, whipped cream accents, single centered candle, and slightly tilted perspective.
- Rev 4 cake may use controlled smooth gradients and soft highlights for cake layers, frosting, candle body, flame, and shadows only.
- Rev 4 candle must have a blue-to-purple body treatment and warm animated flame with small glow.
- Rev 4 blow interaction must make the flame bend/shrink with mic/tap progress where feasible, show a small smoke puff after extinguishing, keep/trigger the existing confetti after extinguishing, and make the cake do a tiny celebratory bounce after blow-out.
- Rev 5/T7 must show the theme toggle only on the main creator/input page, not on gift, blowing, or blown pages.
- Rev 5/T7 must keep the selected local theme applied to all pages even though the toggle control only appears on the creator page.
- Rev 5/T7 must move the gift to the visual center of the screen and slightly higher.
- Rev 5/T7 must move the blowing-page wish arc higher, above the candle, especially on mobile.
- Rev 5/T7 must make small-screen banting letters readable by ensuring the string/line never covers the letter faces.
- Rev 5/T7 must keep the open card readable, inside the viewport, and positioned so it does not cover the cake.
- Rev 5/T7 must allow sticky notes to drag anywhere on the screen, constrained only by viewport edges rather than the current tight movement limit.

**Must not:**
- Do not change `src/lib/shareData.js` payload format or validation rules unless a defect is found.
- Do not change microphone detection thresholds or audio asset behavior unless required by the redesign.
- Do not introduce new dependencies for physics, drag, icons, or animation.
- Do not add gradients to page backgrounds, watermark backgrounds, normal UI panels, balloons, sticky notes, gift, or ordinary controls.
- Do not use harsh gradients; permitted gradients must be controlled soft gradients limited to the Rev 4 premium cake/candle/flame/frosting/shadow treatment.
- Do not keep old dark-room, glow-heavy, or multi-candle visual assumptions.
- Do not apply physics behavior to balloons, cake, gift, card, sticky notes, confetti, or the whole scene.
- Do not vary the background pattern between creator, gift, blowing, and blown pages.
- Do not mix unrelated refactors into the redesign.
- Do not remove contrast from the blowing-page wish note while removing its filled background.
- Do not add extra candles or change the birthday data contract while redesigning the cake/card.
- Do not persist theme choice inside generated greeting URLs unless a later spec explicitly changes the share contract.
- Do not show the theme toggle on shared celebrant/gift/blowing/blown pages.
- Do not solve card overlap by hiding the cake or moving the card off-screen.

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
- Rev 4 theme toggle can accidentally become part of the share-data contract. -> **Mitigation:** keep theme as local UI state/class only unless explicitly revised later; do not alter `src/lib/shareData.js`.
- Rev 4 premium gradients conflict with the original flat/no-gradient rule. -> **Mitigation:** explicitly allow controlled soft gradients only on cake/candle/flame/frosting/shadow details and keep all page backgrounds/UI panels non-gradient.
- Rev 4 mobile fixes can regress desktop composition. -> **Mitigation:** isolate mobile-specific sizing/positioning in media queries and verify both desktop and mobile.
- Rev 4 blow interaction can overcomplicate microphone behavior. -> **Mitigation:** use existing `micLevel`, `candleBlown`, and tap progress state for visual response only; do not alter detection thresholds.
- Rev 5 moving the theme toggle to creator-only can be confused with removing theme support from shared pages. -> **Mitigation:** keep theme state/class application global/local, but render the toggle control only inside `Creator`.
- Rev 5 unconstrained note dragging can make notes hard to recover if dragged off-screen. -> **Mitigation:** constrain to viewport bounds with enough room to move anywhere visible, not to a small central box.
- Rev 5 open-card repositioning can regress desktop if only mobile is considered. -> **Mitigation:** tune desktop and mobile card positions separately.

**Pushback:**
- A physics dependency does not belong in this app for banner hover. Future-us will hate maintaining an engine for decorative bunting. Use lightweight physics-like motion on the hanging letters/flags only unless the product explicitly requires true simulation.
- Do not turn this into another decorative pile-up. The hierarchy is one focal point per phase: gift, then cake/candle, then cake/card with celebration elements supporting it.
- Removing the blowing-note background cannot mean sacrificing readability. Use a curved text treatment with a white sticker stroke or strong shadow instead of invisible text on the watermark.
- The cake can be premium without becoming photorealistic. Avoid stock/clipart noise; build the richer look from controlled CSS shapes, soft highlights, and sticker layering.

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

### T6: Rev 4 Mobile And Premium Cake Refinements
**Do:** Fix mobile layout weirdness; make the blowing note an upward semicircle above the cake without a filled background; keep mobile balloons circular; make banting letters visible and string alignment clear; move the closed card to the lower-right cake plate area; redesign closed card as a folded letter/folder with a slight second page visible; keep open card as one whole readable page; make notes read as sticky notes; add a pink/blue theme toggle that changes page theme, preview background direction, and cake colors without changing share-data payload; redesign the cake as a premium sticker-style two-tier cake with controlled soft gradients, cream layers, vibrant frosting, glossy drips, cherries, sprinkles, cream swirls, one centered blue-to-purple candle, warm reactive flame, smoke puff after blow-out, and a tiny cake bounce.
**Files:** `src/App.jsx`, `src/styles.css`
**Verify:** `npm run build`; Manual: mobile gift/blowing/blown layouts do not look weird, wish note arcs upward above cake, mobile balloons stay circular, banting letters are readable, card sits lower-right on plate and opens correctly, notes look like sticky notes, pink/blue toggle changes app and cake colors, cake remains one candle/two layers and premium sticker-like, flame bends/shrinks before blow-out, smoke appears after blow-out, cake bounces lightly, and confetti still appears.

### T7: Rev 5 Layout Corrections
**Do:** Render the theme toggle only on the main creator/input page while keeping selected local theme applied globally; center the gift and move it slightly higher; move the wish arc higher above the candle, especially on mobile; fix small-screen banting readability so the string does not cover letters; reposition/resize the open card so it stays inside the viewport and does not cover the cake; expand sticky-note dragging so notes can move anywhere visible on the screen.
**Files:** `src/App.jsx`, `src/styles.css`
**Verify:** `npm run build`; Manual: theme toggle appears only on creator page, theme still applies on celebrant pages, gift is centered/higher, wish arc sits above candle on desktop/mobile, banting letters are readable on small screens, open card does not cover cake or overflow right edge, and sticky notes drag across the visible viewport.

## Done
- [ ] `npm run build` passes.
- [ ] No gradients remain in page backgrounds, watermark backgrounds, normal UI panels, balloons, sticky notes, gift, or ordinary controls; controlled soft gradients are allowed only for the Rev 4 cake/candle/flame/frosting/shadow treatment.
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
- [ ] Rev 4 mobile layouts no longer look weird across gift, blowing, and blown pages.
- [ ] Rev 4 blowing note sits above the cake in an upward semicircle/arc with no filled background panel.
- [ ] Rev 4 balloons remain circular on mobile.
- [ ] Rev 4 banting letters are visible and not covered by the string.
- [ ] Rev 4 card sits on the lower-right cake plate area, closed state looks like a folded letter/folder with a second page slightly visible, and open state is one whole readable page.
- [ ] Rev 4 notes look like sticky notes and remain draggable.
- [ ] Rev 4 pink/blue theme toggle changes app colors, preview background direction, and cake colors without changing share-link payload.
- [ ] Rev 4 cake looks premium sticker-style with two tiers, one centered candle, controlled soft gradients, frosting drips, cherries, sprinkles, cream swirls, sticker outline, soft depth, reactive flame, smoke puff after blow-out, tiny bounce after blow-out, and existing confetti.
- [ ] Rev 5 theme toggle appears only on the creator/input page while the selected local theme still applies across pages.
- [ ] Rev 5 gift is centered and slightly higher on the gift page.
- [ ] Rev 5 wish arc sits higher above the candle on desktop and mobile.
- [ ] Rev 5 banting letters are readable on small screens and not crossed by the string.
- [ ] Rev 5 open card stays inside the viewport, remains readable, and does not cover the cake.
- [ ] Rev 5 sticky notes can be dragged anywhere within the visible viewport.
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

### Rev 4 — June 1, 2026
**Change:** Added mobile polish, corrected blowing-note arc direction/placement, mobile circular balloons, visible banting letters, lower-right plate card placement with folded-letter closed state, stronger sticky-note treatment, pink/blue theme toggle, and premium sticker cake direction with controlled gradients and richer blow-out interaction.

**Reason:** The T5 result needs mobile correction and stronger cake/card polish. The cake is now explicitly the premium visual highlight, and the earlier no-gradient rule needs a narrow exception for cake/candle/flame quality.

**Updated Done criteria:** Added Rev 4 checks for mobile layout, upward arced note, circular balloons, visible banting letters, folded plate card, sticky-note polish, theme toggle, premium cake details, reactive flame, smoke puff, bounce, and preserved confetti/share behavior.

### Rev 5 — June 1, 2026
**Change:** Added layout corrections for creator-only theme toggle, higher centered gift, higher wish arc above the candle, readable small-screen banting, safe open-card placement, and broader sticky-note dragging.

**Reason:** Post-T6 review showed remaining mobile/layout issues: the theme toggle appeared on shared pages, the gift and wish arc were too low, banting string still obscured letters on small screens, open card could cover the cake or overflow, and note dragging was too constrained.

**Updated Done criteria:** Added Rev 5 checks for creator-only theme toggle, centered/higher gift, higher wish arc, readable banting, safe open-card position, and viewport-wide note dragging.
