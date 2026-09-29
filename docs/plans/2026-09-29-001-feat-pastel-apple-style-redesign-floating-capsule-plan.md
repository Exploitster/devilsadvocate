---
title: "feat: Pastel, Apple-style redesign with a floating category capsule"
type: feat
status: completed
date: 2026-09-29
detail: comprehensive
---

# ✨ feat: Pastel, Apple-style redesign with a floating category capsule

## Enhancement Summary

**Deepened on:** 2026-09-29
**Sections enhanced:** 7 (Decisions, Design tokens, Floating capsule, Switch
feedback, Component table, Technical considerations, Phases/Acceptance)
**Reviewers used (in parallel):** frontend races reviewer, performance oracle,
architecture strategist, code-simplicity reviewer, visual-design review
(frontend-design + ui-ux-pro-max skills, with a WCAG contrast script), best
practices researcher (W3C APG/WCAG techniques, MDN, headroom.js, Apple font
licence, via their GitHub sources).
**Not run, by design:** Rails/Python/Ruby reviewers, data/migration/schema/
deployment agents (no database or backend in this change), Figma sync and
design-implementation reviewers (no Figma source), README writer, git
history and issue analysts (no issues; history known), learnings researcher
(no `docs/solutions/`). Running them on a static CSS/TS redesign would only
return "not applicable".

### Key improvements
1. **Two real bugs caught before coding.** (a) Moving the pre-paint script
   to `<head>` as drafted would let `categories.ts` resync from the default
   radio and undo `?for=philosophy`, and a bad `?for=` value would show both
   categories. (b) The new sticky offset would make `anchor()` always return
   null, silently breaking keep-your-place.
2. **A contrast-verified palette** replacing the draft values (five draft
   pairs failed AA or had no margin), dark mode included.
3. **A robust headroom design**: sentinel IntersectionObserver for in-flow
   vs stuck, accumulated-distance threshold, clamped `scrollY` (iOS bounce),
   jump detection, forced states for switches / anchor jumps / focus /
   dialog, no fixed timers.
4. **Performance guards**: font fallback metrics for Inter, no animated
   tokens or section colours, blur ≤ 16 px, `overflow-x: clip` for slides.
5. **Scope trimmed** where it didn't serve the request (extra icons, section
   re-arrangements, dev preview), kept where it does (toast, category card,
   Inter, design doc; reasons below).

### New considerations discovered
- Sticky elements keep their flow space; the capsule band (~60 px) stays in
  the layout at its natural position, so `--tabs-h` is kept as that band's
  height and the offsets that use it stay (simplifies Phase 2).
- WCAG 2.2 F110/C43: a revealed sticky bar must not cover the focused
  element; `scroll-padding-top` keeps header + capsule band.
- SC 1.4.11: the selected segment needs a ≥ 3:1 cue (accent ring/label), not
  just a white thumb on glass (1.03:1).
- Safari 26 tints its toolbars from sticky elements at the top edge; check
  the glass header on iOS when possible (not testable in this sandbox).

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

### Research Insights — decisions revised after review

- **D1 (type), confirmed with changes:** stack is
  `-apple-system, BlinkMacSystemFont, "Inter Variable", "Inter Fallback",
  "Segoe UI", Roboto, Arial, sans-serif`. No `system-ui` (Windows CJK
  issues; Tailwind dropped it). SF Pro's licence forbids embedding. Import
  only `@fontsource-variable/inter/wght.css`, `font-display: swap`, **no
  preload**, plus an `"Inter Fallback"` `@font-face` on `local(Arial)` with
  `size-adjust`/`ascent-override`/`descent-override`/`line-gap-override`
  computed from Inter's metrics (target CLS < 0.02). Most of the audience is
  on Android, so Inter is kept (the simplicity review suggested system fonts
  only; rejected for cross-platform consistency).
- **D2/D3 (palette/accent), revised:** drop the neutral sky theme. The
  default accent is **mint** (Startup is the default tab), so no-JS and
  first paint match and nothing flashes. One accent at a time plus butter
  for evidence. Final values under "Design tokens".
- **D4 (bubbles), refined:** product bubble is grey (`#E9E9EB` / dark
  `#2C2C2E`), not white on a white tile; user bubble is the accent-soft. Style
  via `:where(.chat)` context rules; avatar via `::before`, no new slot.
- **D5 (headroom), refined:** see "Floating capsule → Research Insights".
- **D7 (tiles), revised:** grid tiles are **flat** (white on `#F5F5F7`, no
  shadow), as on Apple's own pages; shadows only on floating things (capsule,
  toast, dialog, phone). The Avoid rule against identical shadowed cards
  stays.
- **Kept against the simplicity review:** the toast and the category card
  (they answer the explicit complaint that a switch isn't identifiable; the
  card also carries the tab hints), `docs/design-language.md` (the user wants
  the language to govern future builds; the doc names tokens and never
  repeats hex values, CLAUDE.md points to it, so there's no triple upkeep).
- **Cut or trimmed per the simplicity review:** icons everywhere except the
  capsule segments (and the same glyph on the category card); no content
  re-arrangement (restyle sections in place); dev preview only if it breaks;
  favicon recolour + OG re-render stay as the last, small task.

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

#### Research Insights — final token values (supersede the draft above)

Verified with a WCAG script (ratios in brackets). Draft failures fixed:
`--ink-2 #6E6E73` on the 100 tints (4.13–4.32), mint-700 on mint-100
(exactly 4.50), filled inputs with no ≥ 3:1 edge (1.09), secondary text on
glass over dark content (≤ 3.35), 50-tints too close to the page to show a
switch.

| Role | Light | Dark |
|---|---|---|
| page / surface / surface-2 | `#F5F5F7` / `#FFFFFF` / `#FBFBFD` | `#000000` / `#1C1C1E` / `#2C2C2E` |
| text | `#1D1D1F` (16.8 on surface) | `#F5F5F7` (15.6) |
| text-2 (one token everywhere) | `#636368` (5.49 on page; 4.72 lavender-soft; 4.93 mint-soft) | `#B4B4B9` (≥ 4.74 everywhere) |
| hairline (decorative) | `rgb(0 0 0 / .08)` | `rgb(255 255 255 / .12)` |
| control border (inputs, checkbox) | `#8A8A8F` (3.44) | `#7C7C80` (4.09) |
| lavender tint / soft / deep / hover | `#F1EEFF` / `#E6E1FF` / `#5B4BD0` / `#4B3CB8` | `#2F2D39` / `#413F54` / `#B8ADFF` |
| mint tint / soft / deep / hover | `#EAF7F0` / `#D3F0E2` / `#1B7050` / `#155C41` | `#26322E` / `#2F493F` / `#6DD6A6` |
| on-accent (button text) | `#FFFFFF` (6.25 lavender, 6.03 mint) | `#1D1D1F` (8.38 / 9.47) |
| evidence (butter) | `#FFF0B3` + text (14.7) | `#49411A` + text (9.39) |
| bubble user / product | accent-soft / `#E9E9EB` | accent-soft / `#2C2C2E` |
| selected segment label | accent-deep on accent-soft (4.93 / 4.98) | (5.07 / 5.51) |

Tints (ΔE 8 / 6.6 from the page, 13.7 between the two) are for section
bands; soft (ΔE 26) for the card, thumb and bubbles.

**Token architecture** (`src/styles/tokens.css`, imported by `global.css`;
a future app imports the same file):
- Tier 1, primitives: `--lavender-50 … -700`, `--mint-…`, `--gray-…`,
  `--butter-…`. Per-hue role aliases that flip in dark mode (`--lavender-strong`,
  `--lavender-soft`, …) so each category mapping is written once.
- Tier 2, semantic: `--color-bg`, `--color-surface`, `--color-text`,
  `--color-text-2`, `--color-line`, `--color-control`, `--color-accent`,
  `--color-accent-hover`, `--color-on-accent`, `--color-accent-soft`,
  `--color-accent-tint`, `--color-evidence`.
- Tier 3, component: `--bubble-user-bg`, `--bubble-product-bg`,
  `--capsule-thumb`, `--capsule-glass`, …
- Category scope in one selector list per category:
  `html[data-category='philosophy'], html:not(.js):has(#cat-philosophy:checked), [data-cat='philosophy'] { --color-accent: …; }`
  (the no-JS path switches the accent too; a `[data-cat]` block stays
  correctly themed mid-animation). `:root` defaults to mint.
- `@theme inline` exposes semantic tokens only; a grep gate keeps primitive
  names out of components.

**Type & spacing (Apple-like on the web):** headings weight 600, tracking
−0.02em (−0.015em for section titles), `text-wrap: balance`. Hero 40→80 px /
1.05; section title 32→56 px / 1.07; lead 19→24 px / 1.33 / 400; body 17 px /
1.47 / −0.012em; small 14 / 1.43; caption 13. 8-pt spacing: section padding
`clamp(64px, 10vw, 140px)`; tile padding 24→40 px, gap 12→20 px, radius 22 px
(phone) / 28 px (desktop); container 1080 px, text column 680 px.

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

#### Research Insights — capsule and headroom (supersede the bullets above where they differ)

**Visual spec.** 4 px padding, fully rounded, 44 px segments (52 px tall),
equal-width segments ≥ 148 px (304 px total; fits 328 px at 360 px). Each
segment: 18 px line icon (1.75 stroke) + 15 px / 600 label; unselected label
in text colour (not text-2). Thumb: accent-soft fill, 1.5 px accent-deep
ring (the ≥ 3:1 selected cue for SC 1.4.11), shadow
`0 1px 3px rgb(0 0 0 / .12)`, slides with `transform` over 380 ms, overshoot
≤ 1.2. Glass `rgb(255 255 255 / .80)` / dark `rgb(28 28 30 / .80)`,
`saturate(180%) blur(16px)` with `-webkit-` prefix, 1 px inner hairline,
shadow `0 1px 2px rgb(0 0 0 / .06), 0 8px 24px rgb(0 0 0 / .10)`. Opaque
under `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))`,
`prefers-reduced-transparency`, `prefers-contrast: more` and
`forced-colors`. Hints ("Life decisions and beliefs") never inside the
capsule; they live on the category card, linked with `aria-describedby`.
`will-change: transform` on the capsule's inner element only.

**Structure.** `main > .cats-lead`, then a zero-height **sentinel**
(`[data-cats-sentinel]`), then the sticky wrapper `main > [data-cats]`
(its parent must span the page, so no extra wrapper around it together with
the card/toast). Sticky `top: calc(var(--header-h) + 8px)`. The transform
goes on an inner `.capsule`, never on `[data-cats]`. Sticky keeps its flow
space, so `--tabs-h` is **kept** as the capsule band height; the offsets
that use it (`scroll-padding-top`, story `--pin-top`, the two
`scroll-margin-top` rules) stay, and satisfy WCAG 2.2 C43 (a revealed bar
never covers the focused element; avoids failure F110).

**State.** `[data-cats][data-headroom="in-flow|shown|hidden"]`:
- in-flow vs stuck from an IntersectionObserver on the sentinel (no layout
  reads in the scroll path);
- direction in a rAF callback that reads only `scrollY`, clamped to
  `[0, scrollHeight − innerHeight]` (read every frame; iOS toolbar changes
  `innerHeight`), always storing the clamped value (bounce never counts as
  "up");
- change state after an **accumulated** distance ≥ 8 px since the last
  direction change (slow scrolls move < 6 px per frame);
- any per-frame |Δ| > 0.5 × `innerHeight` is a **jump**: rebaseline, no
  change (covers stage↔list collapse, orientation, form→note shrink).

**Forced states (no fixed timers):**
- `da:category` (fires synchronously after the keep-place `scrollBy`):
  force `shown`, rebaseline on the next frame.
- Same-page anchor clicks (`a[href*="#"]` resolving to this page) and story
  rail `[data-go]` clicks: force `hidden` and lock until `scrollend`
  (fallback: 150 ms without a scroll event).
- `focusin` inside the capsule: `shown` with transitions off (runs before
  the browser scrolls it into view, so no lurch).
- `dialog[open]` or the mobile menu open: freeze; rebaseline one frame after
  close (the thank-you's `note.focus()` scrolls the page).
- Reduced motion: same states, no transitions.

**Module boundaries.** A small generic `src/scripts/headroom.ts`
(`initHeadroom(el, sentinel)`) writing only `data-headroom`; `categories.ts`
owns the tabs, calls it, and reads `data-headroom` in `anchor()` (line
measured from the header's bottom plus the capsule's visible height; the old
"top ≤ header + 1" check goes). `story.ts` `pinTop()` reads
`parseFloat(getComputedStyle(pin).top)` instead of re-deriving the formula;
recheck the `STAGE` min-heights.

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

#### Research Insights — switching

- **Source of truth is `<html data-category>`.** The head script sets it
  from `?for=` against an allowlist (`philosophy|startup`, else
  `startup`). A tiny inline script right after the radios checks the
  matching radio; `initCategories()` reads the category **from `<html>`**
  and syncs the radios, never the reverse (fixes the deep-link revert and
  the load-time whole-document restyle).
- **What animates:** never the tokens themselves (`@property` animation
  restyles the page every frame) and never `color`/`background-color` on
  whole sections. Bands swap instantly; only small elements transition
  (buttons, thumb, rail, links, 250 ms). The content slide carries the
  motion.
- **Slide:** 16 px over 360 ms (not 24 px), direction from the chosen tab;
  skipped under reduced motion; `data-switch` cleared by one restartable
  500 ms timer (`animationend` bubbles from chat/phone animations, doesn't
  fire on hidden elements or under reduced motion). `main { overflow-x:
  clip }` (not `hidden`, which breaks sticky). The story root and anything
  containing sticky/fixed children: opacity only. No `will-change` on
  `[data-cat]`.
- **Ordering in `apply()`:** read (anchor), then write `data-category` and
  `data-switch` together, one forced layout for the keep-place correction,
  then the toast and the headroom update after the reads.
- **Toast:** the live region exists, empty, from page load
  (`role="status"`); announce ~500 ms after the last change (arrow keys
  select on every press); show it only when the category card is off
  screen; 4 s; opaque surface (not glass); short copy: "Now showing
  Philosophy, from Why this exists to the hand-back card." The radio already
  announces "Philosophy, selected", so the toast only adds where the change
  happened.
- **INP target:** < 200 ms with 4× CPU slowdown (one full-document style
  recalc per click on ~2,800 elements is acceptable).

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

### Research Insights — performance and platform

- Fonts: see D1 (fallback metrics; no preload). Measure with Inter, since
  Lighthouse and most visitors will download it. Target LCP ≤ 2.0 s,
  CLS < 0.02.
- `backdrop-filter` only on the header and capsule, blur ≤ 16 px. The toast
  and the mobile menu are opaque: a nested blur inside the header can't see
  the page and is large.
- Never animate `box-shadow` (fade a shadow layer's opacity if needed); keep
  the h1 the largest text and never animate it in (LCP element stability).
- Headroom listener reads only `scrollY` and writes one attribute on the
  capsule wrapper (not `<html>`), so it needn't be merged with `story.ts`.
- Phase-safe renames: about 250 references to `--devil`, `--paper`,
  `--ink-muted`, `font-product`, … exist today. Phase 1 aliases the old names
  to the new semantic tokens so the site renders at every phase; Phase 4
  deletes the aliases with a grep gate (zero matches). Delete Hero's
  `.debate .line--*` overrides once bubbles are context-styled.

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

### Non-functional (additions from review)
- [ ] `?for=philosophy` survives load (no revert to Startup); `?for=junk`
      shows Startup only.
- [ ] Keep-your-place still ±2 px with the floating capsule shown or hidden.
- [ ] Capsule never reveals over the target of a nav/anchor/rail jump; never
      toggles from iOS-style bounce; `focusin` reveals it without a page jump.
- [ ] Selected segment has a ≥ 3:1 non-text cue; glass goes opaque under
      reduced transparency / more contrast / forced colours.
- [ ] No layout-affecting transitions; INP < 200 ms at 4× CPU; CLS < 0.02.
- [ ] Grep gate: no old token names (`--devil`, `--paper`, `font-product`, …)
      and no primitive colour names outside `tokens.css`.

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

> Research insight: split `docs/design-language.md` into **Product
> language** (tokens, bubbles, receipts, accent per *mode*: idea = mint,
> decision = lavender, so the product app can reuse it without the site's
> tabs) and **Site patterns** (capsule, toast, tiles, section rhythm). Name
> tokens, never repeat hex values; `src/styles/tokens.css` is the single
> source. No JSON tokens until something other than CSS needs them.

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

### External references (from the best-practices review; read via their GitHub sources because the sandbox blocks the sites)

- ARIA APG tabs pattern (why a radio group fits better here): https://github.com/w3c/aria-practices/blob/main/content/patterns/tabs/tabs-pattern.html
- MDN, ARIA live regions: https://github.com/mdn/content/blob/main/files/en-us/web/accessibility/aria/guides/live_regions/index.md
- WCAG 2.1 SC 1.4.11 Non-text Contrast: https://github.com/w3c/wcag/blob/main/understanding/21/non-text-contrast.html
- WCAG F110 (sticky content obscuring focus) and C43 (scroll-padding): https://github.com/w3c/wcag/blob/main/techniques/failures/F110.html, https://github.com/w3c/wcag/blob/main/techniques/css/C43.html
- headroom.js (tolerance, bounce handling): https://github.com/WickyNilliams/headroom.js/blob/master/src/Headroom.js
- `scrollend` support: https://github.com/web-platform-dx/web-features/blob/main/features/scrollend.yml.dist
- Apple fonts licence (SF Pro not embeddable): https://developer.apple.com/fonts/
- Font fallback metric overrides: https://github.com/GoogleChrome/developer.chrome.com/blob/main/site/en/blog/framework-tools-font-fallback/index.md
- `backdrop-filter` compat: https://github.com/mdn/browser-compat-data/blob/main/css/properties/backdrop-filter.json
- `prefers-reduced-transparency` support: https://github.com/web-platform-dx/web-features/blob/main/features/prefers-reduced-transparency.yml.dist
