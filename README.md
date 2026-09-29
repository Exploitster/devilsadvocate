# Devils Advocate: coming-soon site

A static marketing site built with Astro and Tailwind CSS. There is no backend of our own: waitlist signups go straight from the browser into an insert-only Supabase table (`supabase/waitlist.sql`), via `supabase-js`.

The brief is in `CLAUDE.md`, and all page copy is in `docs/copy.md`.

## Run it

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve dist/ locally
```

While `npm run dev` is running, `/_components` shows every conversation component. That page is dev-only and is left out of the build.

## Before launch

The waitlist appears once `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, and `PUBLIC_CONTACT_EMAIL` are set: as GitHub Actions variables for the live site, or in `.env` locally (see `.env.example`). Setup steps: `docs/deploy.md`.

Live on GitHub Pages at https://expoitster.github.io/devilsadvocate/ (published by `.github/workflows/pages.yml`). For Vercel, Netlify, or a custom domain, see `docs/deploy.md`.

The share image (`public/og.png`), touch icon, and `favicon.ico` are pre-rendered by `scripts/render-images.cjs`. Re-run it if the headline or icon changes.

## Where things live

| Path | What it is |
| --- | --- |
| `src/styles/tokens.css` | design tokens: colors (light, dark, and each mode's accent), type scale, shape, motion |
| `src/styles/global.css` | Tailwind theme mapping, base styles, shared pieces (tiles, buttons, chat bubbles, receipts) |
| `docs/design-language.md` | the design language for the site and the product app |
| `src/layouts/Base.astro` | document shell, self-hosted fonts, nav, footer |
| `src/components/UserLine.astro` | the user's voice: plain text, or a right-hand bubble inside a chat |
| `src/components/ProductLine.astro` | the product's voice: plain text, or a left-hand grey bubble inside a chat |
| `src/components/CategoryTabs.astro` | the floating Philosophy / Startup capsule (with `src/scripts/categories.ts` and `headroom.ts`) |
| `src/components/Receipt.astro` | inline citation chip, the only thing that is yellow |
| `src/components/PhoneFrame.astro` | static phone screen for mockups |
| `src/pages/index.astro` | the page's sections, in order |
| `src/config.ts` | section ids, nav links, title and description, placeholders |
| `src/data/journey.ts` | the How it works steps and both modes' examples |
| `astro.config.mjs` | site URL, and the build step that writes robots.txt and sitemap.xml |
