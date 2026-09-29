# Design language

Calm, clean, pastel, in the spirit of Apple's own pages: a light grey page,
white tiles, one soft accent at a time, and generous space. Nothing shouts.
Only the conversation and the evidence get emphasis.

This document governs the marketing site **and** the product app built after
it. Values live in `src/styles/tokens.css`; this file names tokens and never
repeats their values, so there is one place to change a colour.

## Product language (site and app)

### Principles

- **Quiet surfaces, one accent.** Neutral greys and white carry the layout.
  The accent is the only colour, and it follows the mode you're in.
- **The conversation is the hero.** Chats look like messages: your lines on
  the right, ours on the left. Everything else is plain text.
- **Evidence is the only yellow.** `--evidence` appears behind citations and
  nowhere else.
- **Flat until it floats.** Tiles sit flat on the page. Only things that float
  over content (the header, the capsule, a notice, a dialog, a phone mockup,
  the hand-back card) get a shadow.
- **State is never colour alone.** A picked choice gets a tick or a ring as
  well as the accent.

### Colour roles

| Token | Use |
| --- | --- |
| `--page` | the page background |
| `--surface` | tiles, cards, inputs, dialogs |
| `--surface-2` | grouped rows inside a tile, quiet fills, unselected controls |
| `--ink` | text and headings |
| `--ink-2` | secondary text: leads, labels, answers, captions |
| `--line` | hairlines between rows (drawn as inset shadows, never borders) |
| `--control` | outlines of inputs and chips (reads at 3:1) |
| `--accent` | primary buttons, links, the selected state, focus rings |
| `--accent-hover` | primary button hover |
| `--accent-soft` | selected fills, your chat bubbles, the capsule thumb, secondary buttons |
| `--accent-tint` | full-width section bands |
| `--on-accent` | text on `--accent` |
| `--evidence` | receipts (citations) only |
| `--danger` | form errors only, never the accent |
| `--glass` + `--glass-blur` | the header, the capsule, the phone's title bar |

Dark mode redefines the same roles; components never branch on the scheme.
Glass turns solid when blur is unsupported or when people ask for reduced
transparency, more contrast, or forced colours.

### One accent per mode

| Mode | Tab | Accent family |
| --- | --- | --- |
| Challenge my idea | Startup | mint (`--mint-*`) |
| Challenge my decision | Philosophy | lavender (`--lavender-*`) |

Mint is the default, so the page paints right before any script runs. The
accent is set on `<html data-category>`; a block marked `data-cat` carries its
own mode's accent. In the app, the same rule applies per session: a session in
"Challenge my decision" is lavender everywhere it appears.

### Type

- One family: the system stack (`--font-stack`): SF Pro on Apple devices,
  Inter everywhere else, with a metric-matched fallback so nothing shifts.
- Scale tokens `--step--1` to `--step-4` and `--step-display`, fluid between
  phone and desktop. Body is `--step-0` (17px).
- Headings are semibold (600; the hero is 700) with slightly tight tracking.
  Leads are `--step-1` in `--ink-2`.
- Sentence case everywhere. No all-caps labels.

### Shape, space, depth

- Radii: `--r-tile` for tiles and cards, `--r-card` for smaller cards,
  `--r-control` for inputs, `--r-chip` for receipts, `--r-pill` for buttons,
  chips, tabs and the capsule.
- Sections are separated by `--section-gap`; content sits in `--container`,
  prose in `--measure`.
- Shadows: `--shadow-float` for things over the page (capsule, notice,
  dialog), `--shadow-lift` for showcase objects (chat card, phone, hand-back
  card).

### The two voices

- In a conversation (a container with the `bubbles` class), `UserLine` is a
  right-aligned bubble in `--bubble-user-bg` and `ProductLine` a left-aligned
  grey bubble in `--bubble-product-bg`. A card inside a conversation opts out
  with `plain`.
- Outside a conversation, lines are plain text. Screen readers still hear
  whose line it is.
- Typing: grey bubble with three dots. Drafting: an outlined bubble with a
  blinking caret in the accent.

### Evidence

`Receipt` is a small `--evidence` chip holding the source. Paraphrases are
labelled as paraphrases; illustrative examples are labelled as illustrative.

### Motion

- Ease with `--ease`; springy selection (the capsule thumb) with
  `--ease-spring`.
- Motion explains a change: a message arriving, a step advancing, a mode
  switching. Nothing fades in just because it scrolled into view.
- Under `prefers-reduced-motion`, everything shows its final state at once.

### Accessibility floor

WCAG AA contrast for text and 3:1 for control edges and states, a visible
3px `--accent` focus ring, 44px tap targets, real form controls (radios for
the capsule, `<details>` for the FAQ, `<dialog>` for the pop-up), and
semantic HTML.

## Site patterns

- **Header:** glass, 52px (`--header-h`), a hairline under it, a small pill
  button in the accent. It doesn't hide.
- **Mode capsule:** a centered glass segmented control under the hero, with
  a line icon per mode and a sliding thumb (`--capsule-thumb` with an accent
  ring). Once scrolled past, it sticks under the header, hides while you
  scroll down and returns as soon as you scroll up (`headroom.ts`). It shows
  on focus, stays out of the way during anchor jumps, and freezes while a
  dialog or the menu is open.
- **Visible switch:** switching modes changes the accent across the page,
  slides the new content in from the side of the tab you picked, updates the
  mode card under the capsule, and, if that card is off screen, shows a short
  notice under the capsule. Your reading position is kept.
- **Section head:** a centered heading with an optional `section-lead`.
- **Bands:** alternate sections sit on a full-width `--accent-tint` band
  (`band` class): Why this exists, How it works, What you get, the waitlist.
- **Tiles:** white, flat, `--r-tile`. The one big tile per section may use
  `--accent-soft` (the promise, "What changed").
- **Buttons:** `btn-primary` (accent fill) for the main action,
  `btn-secondary` (accent-soft) for the rest. Pills, no arrows. Text links use
  `link-quiet`; a trailing chevron (`link-more`) is allowed on text links
  only.
- **Lists:** `list-check` for included items; hairline-separated rows inside
  one tile for FAQs and refusals.
- **Forms:** white inputs with a `--control` outline, choice chips as pills
  (accent-soft with a ring and a tick when picked), errors in `--danger`.
- **Dialog:** a sheet from the bottom on phones, centered from tablet up,
  with a blurred, dimmed backdrop.

## Avoid

- Gradient washes, glows, and more than one accent on screen.
- All-caps eyebrow labels, monospace labels, "A · B · C" meta strings.
- Highlighting one word of a headline in another colour or italic.
- Arrows on buttons (a chevron on a text link is fine).
- Shadows on tiles that sit flat on the page.
- Emoji or stock illustration as decoration.
- Real brand or company names anywhere in the copy.
- Cream and terracotta palettes.
