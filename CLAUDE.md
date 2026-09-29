You are building a STATIC marketing website for a product that is coming soon. The site's only job: make visitors understand the idea and the step-by-step journey they will get, then join a waitlist.

Waitlist storage (September 24, 2026): signups go into a Supabase table (`public.waitlist`, defined in `supabase/waitlist.sql` and run by hand in the Supabase SQL Editor). The browser inserts one row directly with `supabase-js` and the public anon/publishable key (`src/lib/supabase.ts`, `persistSession: false`); row-level security allows insert (with `consent = true`) and nothing else, and database checks enforce the email format, lengths, and allowed values. So the list is readable only from the Supabase dashboard. Never use or ask for a service-role or secret key. The waitlist (form, buttons, FAQ answer, privacy page) is built only when `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, and `PUBLIC_CONTACT_EMAIL` are all set (`WAITLIST_ON` in `src/config.ts`).

Hard scope rules:
- Static site only: no backend of our own, no API routes, no login, no checkout, no payment code. The only database is the insert-only Supabase waitlist table.
- Pricing is shown in USD; the site has no checkout, and every pricing button leads to the waitlist.
- Do NOT build any product functionality. No working chatbot. Any product screens shown on the page are illustrative mockups made of HTML and CSS.
- The only interactive pieces allowed: the hero animation, the Philosophy / Startup tabs under the hero, the scroll-driven "How it works", the "Try a sample debate" player (pre-written debates the reader plays by tapping pre-written answer chips: no text input, nothing generated, every chip has a scripted reply), the mobile menu, FAQ toggles, and the waitlist form (which writes to the Supabase waitlist table).

The site copy lives in `docs/copy.md` (the COPY section below, kept in sync).

# PRODUCT (for context; the site describes it, it does not build it)
Name: Devils Advocate
One-liner: A coming-soon chatbot you type to that challenges your startup idea or big life decision with real evidence, then hands the decision back to you.

The product is TEXT-ONLY at launch: you type, it types back. Don't describe or show any other way of using it.

How the product will behave (describe this on the site):
- It asks up to 3 clarifying questions before it argues.
- It never agrees or disagrees outright. It first says what's genuinely strong in your case, then presents the strongest other side.
- Every counterpoint has receipts: a curated database of real failed startups, and the actual texts of philosophers, with every quote checked word for word.
- It never gives a verdict. The user always decides.

Two modes:
- Challenge my idea: startup ideas and work proposals. Main lens: survivorship bias.
- Challenge my decision: big life decisions and philosophy and beliefs. Evidence comes from what great thinkers argued, on both sides, with book and chapter.

Audience: MBA students, first-time founders, and young professionals in India, plus founders and professionals outside India. Smart, busy, allergic to fluff, and on their phones. Design mobile-first.

Launch status: private beta opens December 1, 2026. Waitlist members get in first.

# VOICE
Humorous, straightforward, warm. Think: the funny, sharp friend who asks "wait, why?" when everyone else says "go for it." Short sentences and plain words. The humor comes from honesty, not insults. Never mean to the reader, never smug.

Rules:
- Never invent social proof: no fake testimonials, no fake user counts, no "trusted by" logos.
- No real company, brand, or product names anywhere in the copy, not even as a punchline or a service provider. Say "the big apps", "our payment partner", "another AI chatbot". Demo startups are generic descriptions ("a hostel snack app, 2017–2019"), labeled as illustrative. Philosophers are people, not companies, so they stay.
- Pricing is shown in USD; the site has no checkout, and every pricing button leads to the waitlist.
- No "free" claims about the product. (Joining the waitlist is free, and the pricing section says so.)
- Sentence case everywhere. Buttons say exactly what happens ("Join the waitlist").

# DESIGN LANGUAGE: calm, pastel, Apple-style
The full spec is `docs/design-language.md`. It governs this site and the product app that follows. Tokens live in `src/styles/tokens.css`; name tokens, never copy hex values into components.

Summary:
- Light grey page, white tiles, one soft pastel accent at a time. The accent follows the mode: Startup / "Challenge my idea" is mint (the default), Philosophy / "Challenge my decision" is lavender. It is set on `<html data-category>`.
- One type family: the system stack (SF Pro on Apple devices, self-hosted Inter elsewhere). Semibold headings, secondary text in `--ink-2`, body at 17px, sentence case.
- The two voices are chat bubbles inside conversations (the `bubbles` class): the user's on the right in the accent's soft tint, the product's on the left in grey. Outside conversations, lines are plain text.
- Evidence is the only yellow: `Receipt` chips on `--evidence`.
- Tiles are flat; only floating things get shadows (header, capsule, notice, dialog, phone mockups, the hand-back card). Glass (translucent with blur) for the header and the capsule, solid when people ask for reduced transparency or more contrast.
- Spend boldness in three places: the hero's animated debate, the scroll-driven "How it works", and the sample debate. Everything else stays quiet.

Mode capsule (the Philosophy / Startup tabs):
- A centered, floating glass segmented control just below the hero. Once scrolled past, it sticks under the header, hides while you scroll down, and comes back when you scroll up.
- A switch must be visible: the accent changes across the page, the new content slides in from the side of the tab you picked, the mode card under the capsule changes, and a short notice appears when that card is off screen. Your place on the page is kept.

Motion:
- The hero debate plays once on load.
- "How it works" moves with the scroll: a sticky stage (numbered rail, step text, phone) where scrolling advances the steps and each phone screen animates in. Rail numbers jump to a step. On screens too short for the stage it's a list whose phones play as they arrive.
- The sample debate waits for the reader: each tapped answer gets a short typing pause, then its scripted reply.
- No fade-in-on-scroll for regular sections. Respect prefers-reduced-motion by showing the final state instantly: "How it works" becomes a plain list, sample replies arrive at once, and switching tabs doesn't slide.

Avoid (these make a page look generated):
- All-caps eyebrow labels above headings.
- Highlighting one word of a headline in a different color or italic.
- Arrows appended to buttons (a › chevron on a text link is fine).
- Monospace for labels.
- "A · B · C" meta strings.
- Shadows on tiles that sit flat on the page; more than one accent on screen.
- Gradient washes.
- Cream and terracotta palettes.
- Stock illustrations or emoji as decoration.

Quality floor: responsive from 360px up, visible keyboard focus, WCAG AA contrast, semantic HTML, Lighthouse 90+ on mobile.

# TECH
- Astro (static output) with Tailwind CSS, mapping the tokens to Tailwind theme colors.
- Small vanilla TypeScript for the hero animation, the category tabs, the scroll-driven step-through, the sample player, the mobile menu, and the form. No React needed.
- Waitlist form: plain HTML form; `src/scripts/waitlist.ts` inserts one row with `supabase.from('waitlist').insert({...})` (never `.select()`: there is no select policy). The library loads only when someone uses the form. No backend of our own.
- Deploy target: GitHub Pages (.github/workflows/pages.yml); any static host works.

# COPY (use it; you may tighten wording, but keep the tone and the facts)

## Nav
Logo: Devils Advocate (semibold wordmark). Links: Try a sample, How it works, Pricing, FAQ. Button: Join the waitlist.

## Hero
Headline: Your idea sounds great. That's what worries us.
Subhead: Type out your startup idea or big decision. Devils Advocate asks the awkward questions, brings receipts from failed startups and 2,000 years of philosophy, then hands the decision back to you. You're the boss. We just read the fine print.
Primary button: Join the waitlist
Secondary link: See how it works
Small print: Private beta opens December 1, 2026. No spam. We save the arguing for the product.

Hero debate animation script (an illustration; plays once):
1. USER (a typed message that appears with a blinking text cursor): "I'm building food delivery for college hostels. The big apps made it, so will I."
2. Devils Advocate: "Love the confidence. Quick question first: who's paying? The students, or their parents' wallets?"
3. Devils Advocate: "Also, the big apps are the survivors. We found three hostel-delivery startups that didn't make it. Want to meet them?" plus a receipt chip: "3 similar startups, why they shut down, sources linked"
4. Devils Advocate: "Your call. Always."

## Category tabs (just below the hero)
Line above: What are you bringing? The rest of the page changes to match.
Tabs (a floating capsule; see DESIGN LANGUAGE): Philosophy (Life decisions and beliefs) / Business validation (Ideas and work proposals). Business validation is selected first, since it continues the hero's example. The choice is kept in the link as ?for=philosophy.
Mode card under the capsule: Philosophy: "Challenge my decision" / "For big life calls and the beliefs you've never questioned." Startup: "Challenge my idea" / "For startup ideas, side projects, and work proposals."
Notice after a switch, when the mode card is off screen: "Now showing {Philosophy|Business validation}, from the sample debate to the hand-back card."
Everything from "Try a sample debate" to "What you get" is written for the chosen tab. Pricing, What we won't do, FAQ, and the waitlist are shared; the waitlist's example idea follows the tab (Startup: "e.g. A pet-food brand for city apartments"; Philosophy: "e.g. Should I take the job in another city?").

## Try a sample debate (just below the category tabs; section id #try-a-sample)
Heading: Try a sample debate
Subhead (ProductLine): Pick a sample, then tap your answers and watch it argue back. Every reply is written in advance, so there's nothing to type. The real thing argues with whatever you bring.
Three sample tabs per category. Each is played by the reader, one tap at a time, with no text input: Devils Advocate greets you and you tap the opening; it asks three clarifying questions, each with three answer chips, and replies to whichever you tap; then the real question (and a bias, for startups); you tap "Fair. What's strong in it?" for what's genuinely strong, then "Now the other side." for the strongest other side with receipts; it invites a push back and offers three, each with its own reply; you tap "Give me my hand-back card." and it ends with "Here's your hand-back card. No verdict. Your call, always." plus Start over / Try another sample.
Every chip has a scripted reply (the decision tree lives in src/data/samples.ts), and every path ends in a complete card: each answer adds its own open question to the card, and each push back sets the cheapest test.
Progress steps under the chat follow along: Your idea (or Your decision) / Questions / Real question / Both sides / Push back / Hand-back. A Start over button sits in the chat's top bar.
Beside the chat, a hand-back card fills in from your answers (Your position, What's genuinely strong, Toughest counterpoints, Open questions only you can answer, Cheapest test this month).
Without JavaScript, each sample shows one finished path (the first answer at every step) and its card.
Samples (full scripts, with every answer and reply, in src/data/samples.ts; the tests below are for the first push back):
STARTUP (made-up startups, labeled "Illustrative examples for this demo"):
- Hostel food delivery (Startup idea). Real question: Does demand survive three months of holidays a year? Bias: survivorship. Cheapest test: Run late-night delivery in one hostel for two weeks. Count the repeat orders.
- Flatmate bill-splitting (Startup idea). Real question: Is the pain big enough to pay for, or just big enough to complain about? Bias: availability. Cheapest test: Track bills by hand for ten flats for a month. See how many would pay to keep it.
- Build our own CRM (Work proposal). Real question: Is the subscription the real cost, or the developer time it takes to keep a new one alive? Bias: planning fallacy. Cheapest test: List the three things the current tool can't do, and check whether a setting or add-on does them.
PHILOSOPHY (real sources, paraphrased and labeled "Paraphrases, not quotes"):
- Skip placements? (Life decision). Case for: Aristotle, Nicomachean Ethics, Book III; Sartre, Existentialism Is a Humanism. Other side: Aristotle, Nicomachean Ethics, Book VI; Seneca, Letters to Lucilius, 18; Kierkegaard, Either/Or, Part I. Cheapest test: Keep one offer open while you test for 8 weeks.
- Move cities? (Life decision). Case for: Mill, On Liberty, Chapter III; Sartre, Existentialism Is a Humanism. Other side: Confucius, Analects, Book IV; Aristotle, Nicomachean Ethics, Book VIII. Cheapest test: Ask your parents what exactly they're afraid of, before you decide.
- Money or meaning? (Belief). Case for: Aristotle, Nicomachean Ethics, Book I. Other side: Aristotle, Nicomachean Ethics, Book I; Epicurus, Principal Doctrines, 15; Seneca, Letters to Lucilius, 2. Cheapest test: Write down what enough is, in numbers, and what you'd do the day you hit it.
Note under the samples: Startup: Samples use made-up startups, labeled as illustrative. The real thing cites sources. Philosophy: The sources are real; the lines are paraphrases, not quotes. The conversation is a sample.
Then: "Want it to argue with your own idea?" (or "decision?") and a Join the waitlist button.

## Why this exists
Heading (both tabs): The people who love you are terrible at this.
STARTUP:
Body: Your friends say it's genius. Your parents say be careful. The internet says quit your job. Nobody shows their sources.
Body: For every delivery app on your phone, there's a graveyard of food apps nobody remembers. That's survivorship bias: you only hear from the ones who made it, because the ones who didn't aren't posting about it. We give tours of the graveyard, so you don't have to move in.
PHILOSOPHY:
Body: Your friends say follow your heart. Your parents say be practical. The internet says both, depending on the hour. Nobody shows their sources.
Body: The question keeping you up isn't new. Quit or stay, move or not, what actually matters: philosophers have argued about it for 2,000 years, on both sides. Most of us only ever hear the side we already agree with. We bring the best of both, with book and chapter, so you decide on arguments, not vibes.

## What it does (replaces "Two modes" and "What you can bring")
STARTUP:
Heading: What it does for your idea
The mode you'd pick: Challenge my idea
Promise: For the startup, side project, or work proposal you're about to bet time and money on. We find who tried it before, how it ended, and what would have to be true for you to be different.
What it does, specifically:
- Names the bias: You're looking at the winners. We show you the graveyard, and call out survivorship bias when it's doing the thinking.
- Finds who tried it before: Startups that went after the same customers, how they ended, and why. Every one sourced.
- Asks the unglamorous questions: Who pays, what it costs to serve them, and what happens in the off-season.
- Hands you the cheapest test: Something you can run this month, before you spend real money.
What you can bring:
- Startup ideas: Before you pitch it, bury it (on paper).
- Work proposals: Stress-test the strategy before your boss does.
PHILOSOPHY:
Heading: What it does for your decision
The mode you'd pick: Challenge my decision
Promise: For the big calls and the beliefs you've never questioned. Skip placements? Take the offer? Move cities? We bring what the great thinkers argued on both sides, with the page number, so it's not just vibes.
What it does, specifically:
- Finds the question under your question: "Should I quit?" is usually "is security worth a regret?" We name it, so you argue about the right thing.
- Brings both sides: Thinkers who'd back you and thinkers who'd stop you, with book and chapter for each.
- Checks every quote: Quotes are checked word for word against the text. Paraphrases are labeled as paraphrases.
- Hands you a smaller first step: A way to test the decision this month, before you bet everything on it.
What you can bring:
- Big life decisions: Quit, stay, move, or marry the startup.
- Philosophy and beliefs: Argue with Aristotle. He's had time to prepare.

## How it works (scroll-driven, 7 steps, sequence numbers are appropriate here)
Heading: Here's exactly what will happen when you show up
Under it (stage only): Keep scrolling. It plays out one step at a time. Link: Skip to the hand-back card
Each step's body is written per tab (Startup / Philosophy):
1. Pick your fight. Choose Challenge my idea. That's it. / Choose Challenge my decision. That's it.
2. Spill it. Type out your idea like you'd pitch it to a friend. Long rants welcome. Typos forgiven. / Type out the decision like you'd text a friend at 2 a.m. Long rants welcome. Typos forgiven.
3. We ask before we argue. Up to three questions: who pays, what it costs, what happens when it goes quiet. So we argue with your actual plan. / Up to three questions about what's at stake for you, so we argue with what you actually mean, not what we assumed.
4. We name the real question. Often it's a sneaky bias, like survivorship: you're looking at the winners, not the graveyard. / Under "should I quit?" there's usually something bigger, like "is security worth a regret?"
5. Receipts, both sides. First, what's genuinely strong in your idea. Then the strongest other side: startups that tried something similar, how they ended, every claim sourced. / First, what's genuinely strong in your case. Then the strongest other side: what great thinkers argued, with book and chapter. No made-up quotes. We check.
6. Push back. Disagree with us? Good. Every round brings fresh evidence, never the same point twice. (both)
7. You decide. You leave with a hand-back card, the cheapest test you can run this month, and zero verdicts. Your idea, your call. / You leave with a hand-back card and zero verdicts. Your life, your call.

Example content per step (shown inside the phone):
STARTUP (hostel food delivery):
- Step 2 user line (typed into a text box): "Food delivery for college hostels. The big apps did it, so there's clearly demand."
- Step 3 questions: "Who pays, students or parents?" / "What happens to orders during vacations?" / "Why won't hostels just call the local dhaba?"
- Step 4: "The real question: does demand survive 3 months of holidays a year? Bias spotted: survivorship. You're looking at the big apps, not the graveyard."
- Step 5 case for you: "Captive audience, dense delivery routes, cheap marketing through hostel groups." Other side, labeled "Illustrative examples for this demo": a hostel snack app (2017–2019) couldn't cover delivery costs on small orders; a campus grocery app (2018–2020) saw orders collapse every vacation; a meal-plan app (2016–2018) lost to the hostel's own mess contract.
- Step 6 user pushback: "But we'll do breakfast subscriptions!" Reply: "Interesting. Subscriptions fix vacation dips only if parents prepay a semester. Would they?"
PHILOSOPHY (skipping placements to build a startup):
- Step 2 user line: "I'm skipping placements to build my startup full time."
- Step 3 questions: "What would you lose if it fails in 12 months?" / "Does anyone depend on your income?" / "Has anyone paid for the product yet?"
- Step 4: "The real question: is a secure path worth giving up for a chance you'd regret not taking?"
- Step 5 case for you: "Many traditions prize courage and writing your own story." Other side, as receipt chips: Aristotle, Nicomachean Ethics, Book VI: practical wisdom means weighing your circumstances, not just your desire. Seneca, Letters to Lucilius: rehearse the worst case before you act, so it can't ambush you. (Paraphrases, not quotes.)
- Step 6 user pushback: "But I'll regret it forever if I don't try." Reply: "Maybe. Could you keep one offer open while you test for 8 weeks? Regret has a cheaper version."

## What you get
Heading: The hand-back card
Body: Every session ends with one card that's yours to keep:
- Your position, in one line
- The 3 toughest counterpoints, each with its source
- What's genuinely strong in your case
- The open questions only you can answer
- The cheapest test you can run this month
Line under it: No verdict. We don't do verdicts. We do homework.
Show a designed static mock of the card for the chosen tab:
- STARTUP: the hostel food delivery example (counterpoints: the three illustrative startups; test: Ask hostel parents if they'd prepay a semester of breakfasts).
- PHILOSOPHY: "I'm skipping placements to build my startup full time." Counterpoints: Aristotle, Nicomachean Ethics, Book VI (practical wisdom means weighing your circumstances, not just your desire); Seneca, Letters to Lucilius, 18 (live the worst case for a few days first, so it can't ambush you); Kierkegaard, Either/Or, Part I (you'll regret something either way, so regret alone can't decide it). Paraphrases, not quotes. Strong: Courage, and a story that's yours to write. Open questions: What would you lose if it fails in 12 months? / Does anyone depend on your income? / What would make you stop? Test: Keep one offer open while you test for 8 weeks.

## Pricing (after What you get, before What we won't do; section id #pricing)
Heading: Pricing (yes, we argued about this too)
Subhead (as a ProductLine): Cheaper than one bad decision. Prices apply from launch on December 1, 2026.

Yearly plan card (the highlighted one; first on mobile):
- Name: Yearly
- Price: $150 / year
- Savings line: That's $12.50 a month. You save $558 a year (79%) compared with paying monthly.
- Line: For people who make decisions for a living. Or just a lot of them.
- Button: Join the waitlist

Monthly plan card:
- Name: Monthly
- Price: $59 / month
- Line: For when you've got a big call coming up.
- Button: Join the waitlist

Benefits (the same list on both cards):
- Both modes: Challenge my idea and Challenge my decision
- All four areas: startup ideas, big life decisions, work proposals, and philosophy and beliefs
- Unlimited debates (fair use)
- Up to 3 clarifying questions before every debate, so we argue with what you actually mean
- The case for you first, then the strongest other side
- Receipts on every counterpoint: real failed startups and real philosophers, every quote checked
- Push back as many rounds as you like, with fresh evidence each time
- A hand-back card after every session: your position, the toughest counterpoints, open questions, and the cheapest test to run
- Saved history, so the next session picks up where the last one ended
- Your sessions stay private; delete them anytime

Under the cards (small print):
- Payments are processed securely by our payment partner.
- Joining the waitlist is free and commits you to nothing. We'll email you before billing starts.
- Fair use: unlimited means normal human use, not a bot arguing with our bot.

Math (keep it true if prices change): $59 × 12 = $708; $708 − $150 = $558 saved (79%); $150 ÷ 12 = $12.50 a month.

Design: two plans only, side by side on desktop, stacked on mobile with yearly first. The yearly card is highlighted with an accent ring and the filled accent button; savings sit as a short label under the price, not a corner badge. No gradient, no "Most popular" ribbon. Prices are large and bold. Both buttons scroll to #waitlist and focus the email field.

## What we won't do
Heading: Things we refuse to do
- Tell you what to do. We're a devil's advocate, not your dad.
- Disagree just for fun. We say what's good about your case first. Contrarian, not a troll.
- Make up quotes. Every quote is checked against the actual text.
- Argue about politics. We'd like to keep our friends.
- Replace real help. If you're going through something heavy, we drop the debate and point you to people who can help.

## FAQ (questions in the user's voice, answers in the product's voice)
- Isn't this just another AI chatbot with an attitude? / Most chatbots are trained to be agreeable. We're built to find the other side, and we bring receipts: a curated database of failed startups and the actual texts of philosophers, with every quote checked.
- Does it just disagree with everything? / No. It tells you what's strong first, then the strongest other side. Then it steps aside.
- What if I'm actually right? / Then you walk away more sure, with the counterarguments already handled. That's a win.
- Can I talk to it instead of typing? / Not at launch. It's text-only for now. Your thumbs will survive.
- Who is it for? / MBA students, first-time founders, and anyone about to make a call they'd hate to get wrong.
- Can I use it right now? / Not yet. Private beta opens December 1, 2026, and the waitlist gets in first.
- How much will it cost? / $59 a month, or $150 a year if you like saving $558. Prices apply from December 1, 2026.
- How do I pay? / Payments are processed securely by our payment partner.
- What do you do with my waitlist details? / We use them only to invite you to the beta. Email the contact address (PUBLIC_CONTACT_EMAIL) and we'll delete them.

## Waitlist (final section)
Heading: Got an idea you're completely sure about? Perfect.
Subhead: Join the waitlist. We'll argue with you on December 1.
Fields:
- Email (required)
- First name (optional)
- I am a (single select): MBA student / First-time founder / Working professional / Just curious
- What would you bring first? (multi-select chips): A startup idea / A life decision / A work proposal / A belief I want to test
- The idea or decision you'd bring (optional, one line, max 280 characters, placeholder: "e.g. I'm skipping placements to start a pet-food brand")
- Consent (required checkbox): "Email me about the Devils Advocate beta. Unsubscribe anytime." with a link to /privacy
- Hidden: the traffic source, from `utm_source` or `ref` in the URL (max 100 characters)
Button: Join the waitlist
Success (a pop-up over the page, the product answering: a short exchange, then a mini hand-back card; the form is replaced by a one-line note underneath):
- "You're in, {first name}. Welcome to the argument." (without a name: "You're in. Welcome to the argument.")
- "We'll email you before the beta opens on December 1. The waitlist gets in first, so you'll be one of the first people we politely disagree with."
- If they typed an idea: it's echoed back as their line (their chat bubble), then: "Noted. That's the first thing we'll argue about. Enjoy being completely sure of it until then."
- Otherwise, one line for the first thing they said they'd bring:
  - A startup idea: "Bring the startup idea. We're already dusting off the graveyard files."
  - A life decision: "Bring the big decision. Aristotle has been warned."
  - A work proposal: "Bring the proposal. We'll find the holes before your boss does."
  - A belief I want to test: "Bring the belief. Seneca has waited nearly 2,000 years for this."
- Card "Your first hand-back card": Your position: "I'm on the waitlist." / Toughest counterpoint: "None. It's the one call we won't argue with." / Cheapest test before December 1: "Doubt one thing you believed this morning." / sign-off: "Your call. Always."
- Name and idea are inserted as text, never HTML.
- The pop-up closes with its Close button, Escape, or a tap outside it. Focus then lands on the note that replaced the form: "You're on the list. See you on December 1." (for a repeat signup: "You're already on the list.")
While sending: the button is disabled and reads "Joining…"
Already on the list (database code 23505), in the same pop-up: You're already on the list. Eager. We respect it.
Invalid email: That email looks off. Check for typos and try again.
A database check failed (code 23514): Something in the form looks off. Check your email and try again.
Consent not ticked: Tick the box so we can email you about the beta.
Without JavaScript: Please enable JavaScript to join the waitlist.
Send failed: Something broke on our side, and it's not your idea's fault. Try again in a minute.

## Footer
Built by Avinash G, an MBA student who heard "great idea" one too many times.
Links: Privacy (a short static page: we collect email, first name, role, interests, the optional one-line idea, the traffic source, and consent; it's stored in our database, used only to contact the person about the beta, and never sold; anyone can email the contact address to have their data deleted).

# REPO NOTES (added during setup)
- Run `npm run dev` (http://localhost:4321), `npm run build`, and `npm run check`. `/_components` is a dev-only preview of the conversation components.
- Tokens live in `src/styles/tokens.css` (primitives, semantic roles, per-mode accents, dark mode); shared pieces (section head, band, tile, buttons, links, `list-check`, bubbles, receipts) in `src/styles/global.css`. Tailwind's default palette is cleared, so only the token colors exist as utilities (`bg-page`, `bg-surface`, `text-ink-2`, `text-accent`, `text-step-1`, `text-display`, ...).
- Use `UserLine`, `ProductLine`, `Receipt`, and `PhoneFrame` from `src/components/` for anything conversational. Put conversations in a `bubbles` container; don't restyle bubbles per section.
- Category content: copy lives in `src/data/categories.ts` (Why, What it does, hand-back card), `src/data/journey.ts` (steps and phone examples), and `src/data/samples.ts` (sample debates). Anything written for one tab carries `data-cat="startup"` or `data-cat="philosophy"`; global.css hides the other tab's. Scripts: `categories.ts` (the capsule and switching), `headroom.ts` (the capsule's hide-on-scroll), `story.ts` (How it works), `sample.ts` (sample player). They talk through the `da:category` event.
- Section ids and nav links live in `src/config.ts`. Use `path()` / `sectionHref()` from there for links: the site is served from a sub-path on GitHub Pages.
- Waitlist settings (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `PUBLIC_CONTACT_EMAIL`) are set as defaults in `.github/workflows/pages.yml` (all public values); GitHub Actions repository variables of the same name override them. Locally they live in the git-ignored `.env`.
