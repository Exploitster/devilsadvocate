---
title: "feat: Pastel, Apple-style redesign with a floating category capsule"
type: feat
status: active
date: 2026-09-29
detail: comprehensive
---

# ✨ feat: Pastel, Apple-style redesign with a floating category capsule

## Overview

Redesign the whole Devils Advocate site in a clean, soothing, pastel look
that follows Apple's design language (system type, generous whitespace,
rounded tiles, translucent materials, pill controls, calm motion), and make
the Philosophy / Startup switch impossible to miss:

1. The category tabs become a **floating, centered capsule** (a segmented
   control with a sliding thumb) right under the hero.
2. Once you scroll past it, the capsule **hides while you scroll down and
   slides back in, pinned under the header, as soon as you scroll up**.
3. Switching tabs **visibly changes the page**: each tab has its own pastel
   accent (Philosophy = lavender, Startup = mint), a category card under the
   capsule swaps, new content slides in from the side of the chosen tab, and
   a short notice confirms the switch.
4. The new design language is written down (CLAUDE.md +
   `docs/design-language.md`) so it also governs the product app built later
   ("All these design language changes … goes for … this whole build").

## Problem Statement

From the request, in the user's words, and what we see in the code:

- **"Now it's hidden and we are not able to understand that these buttons
  are there."** The tabs are a full-width, left-aligned underline strip
  (`src/components/CategoryTabs.astro`, `.cats`, `.cats__tab`) that reads as
  part of the header border, not as a control.
- **"The UI remains the same so it's not even identifiable that the shift …
  happened."** Switching only swaps text inside identical layouts, with a
  360 ms opacity fade (`global.css` `cat-in`). Colors, layout and position
  don't change, and shared sections (Pricing, FAQ, Waitlist) don't change at
  all.
- **Look and feel**: today's "Two voices" language (Fraunces + Bricolage,
  raspberry/teal on cool gray, speech marks) is editorial. The user wants
  clean, pastel, soothing, Apple-like, site-wide and for future builds.

## Decisions (made in pipeline mode; revisit any of them)

| # | Decision | Why |
|---|---|---|
| D1 | **Type:** `-apple-system, BlinkMacSystemFont, "SF Pro Text"/"SF Pro Display", "Inter Variable", …` as one sans family. Self-host **Inter** (`@fontsource-variable/inter`) as the non-Apple fallback. Drop Fraunces and Bricolage. | SF Pro can't be self-hosted outside Apple platforms (licence), but the system stack gives real SF on iPhone/iPad/Mac. Inter is the closest open equivalent. Listing system fonts first means Apple devices never download Inter. |
| D2 | **Palette:** neutral Apple base (`#F5F5F7` page, `#FFFFFF` tiles, `#1D1D1F` ink, `#6E6E73` secondary) + pastels. Philosophy = lavender, Startup = mint, neutral fallback = sky. Evidence chips stay the only yellow (pastel butter). | Soothing and calm; one accent per category makes the switch visible everywhere. |
| D3 | **Accent follows the tab across the whole page** (header button, hero, capsule thumb, section tints, story rail, sample chat, pricing, waitlist) via tokens on `<html data-category>`. | A switch changes what's on screen wherever you are. |
| D4 | **Two voices become Messages-style bubbles** in chat contexts (hero debate, phone screens, sample chat, thank-you): user = right-aligned pastel-sky bubble, product = left-aligned white bubble with a small "DA" avatar. Outside chats (FAQ, promises, subheads) lines are plain text, no speech marks. | Clearer, familiar, Apple-like; keeps "whose line is it" readable. |
| D5 | **Capsule behaviour ("headroom")**: in flow under the hero; once scrolled past, hidden on scroll-down, shown pinned under the header on scroll-up; always shown when focused. | Exactly the requested behaviour; keeps the header itself static (no double hide/show). |
| D6 | **Keep the tab label "Startup"** (the user called it "business validation"; no rename was asked for). Flag in the summary as a one-word change. | Avoid unrequested copy changes. |
| D7 | **Rounded tiles are allowed** (Apple bento style); remove "no card grids" and "identical rounded cards" from the Avoid list. Keep: no gradient washes, no all-caps eyebrows, no emoji decoration, no real brand names. Chevrons (›) are allowed on text links only. | The requested language relies on tiles; keep the rules that still apply. |
| D8 | **No behaviour changes** to the waitlist, the story's scroll logic, or the sample player, beyond styling and the capsule offset. | Limits regression risk on the parts that already pass 50+ checks. |

## Proposed Solution

### Design tokens (`src/styles/global.css`, `:root` + dark)

```css
/* Neutrals */
--bg: #f5f5f7;  --surface: #ffffff;  --surface-2: #fbfbfd;
--ink: #1d1d1f; --ink-2: #6e6e73;    --line: rgb(0 0 0 / 0.08);
/* Pastels (surfaces) — 50 tint / 100 soft / 700 deep (text + buttons, AA on white) */
--lavender-50: #f5f3ff; --lavender-100: #e9e5ff; --lavender-700: #5b4bd0;
--mint-50:     #effaf5; --mint-100:     #d8f3e6; --mint-700:     #1f7a55;
--sky-50:      #f0f6ff; --sky-100:      #dcebff; --sky-700:      #0a5bc4;
--butter-100:  #fff1bd;                      /* evidence chips only */
/* Semantic, switched by <html data-category> */
--accent: var(--sky-700); --accent-soft: var(--sky-100); --accent-tint: var(--sky-50);
html[data-category='philosophy'] { --accent: var(--lavender-700); … }
html[data-category='startup']    { --accent: var(--mint-700); … }
/* Shape, depth, material, motion */
--r-tile: 28px; --r-card: 18px; --r-control: 12px; --r-pill: 999px;
--shadow-tile: 0 1px 2px rgb(0 0 0 / .04), 0 8px 28px rgb(0 0 0 / .06);
--shadow-float: 0 10px 30px rgb(0 0 0 / .12);
--glass: rgb(255 255 255 / .72); --glass-blur: saturate(180%) blur(20px);
--ease: cubic-bezier(.22, 1, .36, 1); --ease-spring: cubic-bezier(.34, 1.4, .64, 1);
```

Dark mode: `#000` page, `#1c1c1e` tiles, `#f5f5f7` ink, `#a1a1a6` secondary,
accents lifted to pastel-light tones with dark text on filled buttons,
tints as 14% alpha of the accent. Exact values are fixed in Phase 1 with a
contrast script (every text/background pair ≥ 4.5:1, large text ≥ 3:1).

Type scale (fluid, Apple-like): hero 44→80 px / 700 / −0.03em; section
title 34→56 px / 700 / −0.025em; lead 21→28 px / 500; body 17 px / 1.47 /
−0.01em; small 14 px; caption 13 px (nothing under 12 px).

### Floating capsule (`CategoryTabs.astro` + `src/scripts/categories.ts`)

- Markup stays a native radio group (works without JavaScript, arrow keys).
  Visual: centered glass pill (`--glass`, `--glass-blur`, `--shadow-float`),
  two segments with a line icon each (a "column" glyph for Philosophy, a
  "spark/lightbulb" glyph for Startup, inline SVG) and a sliding white thumb
  (`transform: translateX`, `--ease-spring`, 380 ms) tinted with the accent.
- Lead line centered above it: "What are you bringing? The rest of the page
  changes to match."
- **Category card** directly under the capsule (new, inside
  CategoryTabs): a pastel tile per category with icon, mode name ("Challenge
  my decision" / "Challenge my idea") and one line on what it covers. It is
  the first thing that visibly swaps when you click.
- **Headroom logic** (new module, e.g. `src/scripts/capsule.ts`, init from
  CategoryTabs):
  - `position: sticky; top: calc(var(--header-h) + 10px)` on a wrapper so it
    floats over content (no layout space when stuck).
  - Track `scrollY` in a passive, rAF-throttled listener. States:
    `in-flow` (natural position visible → always shown), `stuck-shown`,
    `stuck-hidden`. Downward delta ≥ 6 px while stuck → hide; upward delta
    ≥ 6 px → show. Ignore `scrollY < 0` and overscroll at the bottom (iOS
    bounce).
  - Hidden = `translateY(calc(-100% - 20px))` + `opacity: 0` +
    `pointer-events: none`, 280 ms `--ease`; never `visibility:hidden`
    (stays in the accessibility tree). `:focus-within` forces shown.
  - **Suppress** state changes for 450 ms after a category switch (the
    keep-your-place `scrollBy` in `categories.ts` must not hide the capsule
    you just clicked) and while the waitlist dialog is open.
  - Reduced motion: same states, no transitions.
- `--tabs-h` goes away as a layout offset: `scroll-padding-top` becomes
  `header + 1rem`; the story's `--pin-top` becomes `var(--header-h)` and the
  pin gets top padding equal to the capsule's height so a revealed capsule
  never covers the rail (`HowItWorks.astro`, `story.ts` `pinTop()`, the
  `scroll-margin-top` rules on `.cats__tab input` and `.rail-step`).

### Making the switch unmistakable (`categories.ts`, `global.css`)

1. Accent tokens swap on `<html data-category>`; tinted section backgrounds
   and accents transition over 500 ms (`background-color`, `color`,
   `border-color`, `fill`).
2. Category card and category-specific blocks animate in from the side of
   the chosen tab: `html[data-switch='to-left'|'to-right'] [data-cat]` gets
   `translateX(∓24px) → 0` + fade, 420 ms. **Exception:** the story root
   (contains the sticky pin) uses opacity only; a transform on it would
   un-stick the stage (already learned in the previous build).
3. A small glass toast under the capsule for 2.8 s: "Now showing Philosophy.
   Everything from Why this exists to the hand-back card has changed."
   (`role="status"`, polite). Shown on every switch; most useful when you
   switch while reading a shared section.
4. Keep-your-place behaviour stays exactly as it is (±2 px).
5. Move the pre-paint category script from `CategoryTabs.astro` into the
   `<head>` in `Base.astro`, so the header and hero get the right accent
   before first paint (no flash of the wrong color with `?for=`).

### Component-by-component

| File | Change |
|---|---|
| `src/styles/global.css` | New tokens (light/dark, per category), type scale, `.container` (max 1120 px; text blocks 720 px), section rhythm (Apple: 96–140 px), `.section-head` (centered title + lead), `.tile`, pill buttons (`.btn-primary` accent fill, `.btn-secondary` tinted), `.link-more` (›), focus ring (3 px accent ring, 2 px offset), receipts (butter pill), chat bubbles (`.chat .line--user/--product`), plain lines elsewhere, transitions, reduced-motion. Remove Fraunces/Bricolage references. |
| `src/layouts/Base.astro` | Fonts: drop Fraunces/Bricolage imports + preloads; import Inter (no preload); theme-color metas; pre-paint `data-category` script in `<head>`. |
| `package.json` | − `@fontsource-variable/fraunces`, − `@fontsource-variable/bricolage-grotesque`, + `@fontsource-variable/inter`. |
| `src/components/Nav.astro` | Glass header (translucent + blur, hairline), 52 px, small pill CTA in accent, mobile menu as a glass sheet. |
| `src/components/Hero.astro` | Centered headline/lead/CTAs/small print; the debate as a Messages-style card (white tile, bubbles, typing dots). Keep all `data-*` hooks used by `debate.ts`. |
| `src/components/CategoryTabs.astro` | Floating capsule, category card, toast, headroom init (above). |
| `src/components/Why.astro` | Centered section on an accent-tinted band; "everyone else" lines as soft gray quote chips; "Nobody shows their sources." as the display line; body. |
| `src/components/WhatItDoes.astro` | Bento: promise tile (large, accent-soft), four "does" tiles with line icons (2×2), two "bring" tiles. |
| `src/components/HowItWorks.astro`, `StepScreen.astro`, `PhoneFrame.astro`, `JourneyShot.astro` | Rail as pill numbers with accent fill; step text in the new type; phone as a clean rounded device (no brand-specific hardware details) with bubble screens; pin offset changes (above). Scroll logic unchanged. |
| `src/components/TrySample.astro` | Sample tabs as a segmented control; chat card with bubbles, quick-reply chips as pastel pills; stage tabs as small pills; hand-back card and "What changed" as tiles. Player logic unchanged. |
| `src/components/WhatYouGet.astro`, `HandBackCard.astro` | Straight (not rotated) white tile with soft shadow, check-icon list. |
| `src/components/Pricing.astro` | Two tiles; yearly with a 2 px accent ring and accent button; big SF-style prices; benefits with check icons; small print centered. Math and copy unchanged. |
| `src/components/Refuse.astro` | One tile, rows with a soft "no" icon, hairline separators. |
| `src/components/Faq.astro` | Apple-style accordion rows (question semibold, + rotates to ×, answer in secondary ink). Native `<details>` stays. |
| `src/components/Waitlist.astro` | Form in a tile; filled inputs (radius 12, `--bg` fill, accent focus ring); chips as pastel pills; consent row; full-width pill button on phones; thank-you dialog as a rounded sheet with bubbles. All script hooks unchanged. |
| `src/components/Footer.astro`, `src/pages/[page].astro` | Apple-like small footer on `--bg`; privacy page in a centered text column. |
| `src/components/UserLine.astro`, `ProductLine.astro`, `Receipt.astro` | Markup stays; add an avatar slot for product bubbles; styling moves to context classes (`.chat …`). |
| `src/dev/components.astro` | Refresh the dev preview to the new components. |
| `scripts/render-images.cjs`, `public/og.png`, `public/favicon.svg`, `favicon.ico`, `apple-touch-icon.png` | Re-render share image and icons in the new palette/type (Inter). |
| `CLAUDE.md`, `docs/copy.md`, new `docs/design-language.md` | Rewrite DESIGN LANGUAGE (tokens, type, tiles, bubbles, capsule, motion, Avoid list per D7) and point to `docs/design-language.md` as the source for the site **and the future product app**. Copy additions: capsule toast, category card lines. |

### New copy (voice rules still apply; no brand names)

- Category card, Philosophy: "Challenge my decision" / "For big life calls and
  the beliefs you've never questioned."
- Category card, Startup: "Challenge my idea" / "For startup ideas, side
  projects, and work proposals."
- Toast: "Now showing {Philosophy|Startup}. Everything from Why this exists to
  the hand-back card has changed."

## Technical Considerations

- **Performance** (Lighthouse mobile ≥ 90 is a brief requirement; currently
  99): system fonts are free on Apple; Inter variable (~48 KB woff2 Latin) only
  on others. `backdrop-filter` on two small sticky elements only (header,
  capsule), with an opaque fallback in `@supports not (backdrop-filter: …)`.
  Headroom listener: passive + rAF, writes one attribute only on state
  change. Avoid transitions on layout properties.
- **Accessibility:** contrast script over every token pair (light + dark,
  both categories); focus ring visible on glass; capsule keyboard reachable
  when hidden (`:focus-within`); toast `role="status"`; reduced motion
  removes slides, thumb spring, and headroom transitions.
- **No-JS:** radios still switch via `:has()`; capsule sits in flow (no
  headroom); category card switches via the same `[data-cat]` rules.
- **Security:** none (static site; no new data flows).

## System-Wide Impact

- **Interaction graph:** radio `change` → `categories.ts apply()` →
  anchor measure → `data-category` + `data-switch` on `<html>` → CSS token
  swap + slide → `scrollBy` keep-place → `da:category` event →
  `story.ts` (refit phone, recompute step) and `sample.ts` (pause hidden
  player) → new `capsule.ts` (suppress 450 ms, keep shown) → toast.
- **State risks:** headroom hiding right after a switch (suppressed);
  `data-switch` left on `<html>` making later appearances slide (clear it on
  `animationend`/timeout); stale `--tabs-h` references (grep to zero).
- **Parity:** every place that assumed the old always-visible bar:
  `global.css scroll-padding-top`, `HowItWorks.astro --pin-top`,
  `story.ts pinTop()`, the two `scroll-margin-top` rules, `categories.ts
  anchor()` (uses `bar.offsetHeight`).
- **Integration scenarios** (browser-tested):
  1. Scroll down past the capsule → hidden; scroll up 20 px → shown under
     the header; scroll to top → back in flow.
  2. Mid-story, scroll up (capsule shows), switch tab → same step, capsule
     stays visible, toast appears, accent turns lavender/mint.
  3. In Pricing (shared), switch → accent + toast change; position ±2 px.
  4. Tab key from the header while the capsule is hidden → capsule appears
     with a visible focus ring.
  5. `?for=philosophy` deep link → lavender header/hero on first paint.

## Implementation Phases

**Phase 1: Foundation**
- Tokens, type, dark mode, per-category accents; contrast script passes.
- Fonts swap (deps, Base.astro), pre-paint category script to `<head>`.
- Shared primitives: section head, tile, buttons, link-more, chips, bubbles.
- Success: `npm run check` and `build` clean; axe clean on a smoke page.

**Phase 2: Capsule + switch feedback**
- Floating capsule, category card, toast, headroom module, offsets
  (`--tabs-h` removal), slide-in by direction.
- Success: integration scenarios 1–5 pass in Playwright.

**Phase 3: Sections**
- Nav, Hero, Why, WhatItDoes, HowItWorks (+StepScreen/PhoneFrame/
  JourneyShot), TrySample, WhatYouGet/HandBackCard, Pricing, Refuse, FAQ,
  Waitlist (+dialog), Footer, privacy page, dev preview.
- Success: visual review at 360/390/768/1024/1440, light/dark, both
  categories.

**Phase 4: Polish, docs, assets**
- OG image and icons re-rendered; CLAUDE.md + `docs/design-language.md` +
  `docs/copy.md`.
- Full regression: previous suites (story/sample/tabs 23, waitlist pop-up 23,
  errors 6, axe/overflow matrix 20, brand scan), Lighthouse mobile.

## Alternative Approaches Considered

- **Self-hosting SF Pro:** rejected (licence restricts it to Apple
  platforms).
- **Hide the whole header on scroll-down too:** rejected for now; the request
  was about the capsule, and a static glass header keeps navigation reachable.
- **View Transitions API for the switch:** rejected; whole-page snapshots
  interfere with the sticky story stage and it isn't in every browser. CSS
  keyframes on `[data-cat]` are enough.
- **Scroll to the top of the category content on switch:** rejected; keeping
  your place was built on purpose, and the new feedback makes the change
  visible without moving you.

## Acceptance Criteria

### Functional
- [ ] Capsule is centered, visibly a floating control (glass + shadow +
      thumb), with icons and labels, on all widths from 360 px.
- [ ] Past its natural position: hides after a downward scroll ≥ 6 px, shows
      pinned under the header after an upward scroll ≥ 6 px, returns to flow
      at the top; focus inside it always shows it.
- [ ] Switching doesn't hide the capsule; keeps the page position (±2 px).
- [ ] Switching changes the accent across the page, swaps the category
      card, slides new category content in from the chosen side, and shows
      the toast (announced to screen readers).
- [ ] Whole site uses the new tokens, system/Inter type, tiles, pill
      controls and bubbles; Fraunces/Bricolage are gone.
- [ ] Waitlist, story, samples, hero debate behave exactly as before.
- [ ] No real brand names on the site (brand scan).

### Non-functional
- [ ] Lighthouse mobile: performance ≥ 90 (target ≥ 95), a11y/BP/SEO 100.
- [ ] axe clean and zero horizontal overflow at 360/390/768/1024/1440,
      light/dark, both categories.
- [ ] All text pairs ≥ 4.5:1 (large ≥ 3:1) by script.
- [ ] Reduced motion: no slides/springs/headroom transitions; final states.
- [ ] Works without JavaScript (tabs switch, list story, first sample).

### Quality gates
- [ ] `npm run check` 0/0/0, `npm run build` clean.
- [ ] All previous Playwright suites pass, plus the new capsule/switch suite.
- [ ] CLAUDE.md, `docs/design-language.md`, `docs/copy.md` updated and in
      sync.

## Success Metrics

- A first-time visitor can find and use the tabs without instruction (the
  capsule is the most prominent control below the hero).
- A switch is noticeable anywhere on the page within ~0.5 s (accent change +
  toast), verified in the browser suite.
- No regressions in the 70+ existing checks; Lighthouse stays in the 90s.

## Dependencies & Risks

| Risk | Mitigation |
|---|---|
| Pastel accents fail contrast | Pastels for surfaces only; deep 700 tones for text/buttons; contrast script gate. |
| `backdrop-filter` jank on low-end phones | Only on two small elements; opaque fallback. |
| SF vs Inter metric differences | Test with Inter (this sandbox has no SF); leave slack in fixed-height elements (phone, chat). |
| Sticky/transform conflicts | Opacity-only animation on the story root; capsule animates itself only. |
| Regression across ~15 components | Phased, with the existing suites after each phase; script hooks (`data-*`) untouched. |
| Brief conflicts | Update CLAUDE.md in the same change (D7). |
| `/lfg` PR + video steps | The repo has one branch (the working branch is also the default) and no `agent-browser` CLI here; the PR/video steps are reported as not applicable rather than faked. |

## Documentation Plan

- `docs/design-language.md` (new): tokens, type, color roles, tiles,
  bubbles, capsule/headroom, motion, dark mode, accessibility rules, do/don't.
  Written to apply to the product app as well.
- `CLAUDE.md`: DESIGN LANGUAGE replaced with a summary + pointer; Avoid list
  per D7; REPO NOTES: tokens and `capsule.ts`.
- `docs/copy.md`: regenerated from CLAUDE.md's COPY section.

## Sources & References

- Research: done locally by the planner with full repo context (this site
  was built in the same session). No `docs/brainstorms/`, `docs/solutions/`
  or prior plans exist. External research skipped: strong local context, no
  high-risk area.
- Current tabs: `src/components/CategoryTabs.astro` (`.cats`, `.cats__set`,
  `.cats__tab`), `src/scripts/categories.ts` (`apply()`, `anchor()`).
- Offsets tied to the old bar: `src/styles/global.css` (`--tabs-h`,
  `scroll-padding-top`), `src/components/HowItWorks.astro` (`--pin-top`,
  `.rail-step` scroll-margin), `src/scripts/story.ts` (`pinTop()`, `STAGE`
  media query).
- Switch fade today: `src/styles/global.css` (`html.cats-ready [data-cat]`,
  `@keyframes cat-in`).
- Script hooks to preserve: `debate.ts` (`[data-debate]`, `[data-turn]`,
  `[data-type-out]`, `[data-replay]`), `story.ts` (`[data-story]`,
  `[data-track]`, `[data-pin]`, `[data-go]`, `[data-text]`, `[data-screen]`),
  `sample.ts` (`[data-try]`, `[data-sample]`, `.msg[data-kind]`,
  `[data-toggle]`, `[data-fill]`), `waitlist.ts` (`[data-waitlist]`,
  `[data-done]`, `[data-done-note]`, …).
- Brief: `CLAUDE.md` (DESIGN LANGUAGE, Motion, Avoid, Quality floor).
