// The two categories picked with the tabs under the hero. Everything
// between the tabs and Pricing is written once per category, so each one
// reads as if the page were only about it. Copy lives in docs/copy.md.

export type Category = 'philosophy' | 'startup';

/** Tab order, as the brief lists them. */
export const CATEGORIES: Category[] = ['philosophy', 'startup'];

/** Shown first: it continues the hero's example (a startup idea). */
export const DEFAULT_CATEGORY: Category = 'startup';

export const CATEGORY: Record<
  Category,
  { label: string; hint: string; mode: string; noun: string; card: string }
> = {
  philosophy: {
    label: 'Philosophy',
    hint: 'Life decisions and beliefs',
    mode: 'Challenge my decision',
    noun: 'decision',
    card: 'For big life calls and the beliefs you’ve never questioned.',
  },
  startup: {
    label: 'Business validation',
    hint: 'Ideas and work proposals',
    mode: 'Challenge my idea',
    noun: 'idea',
    card: 'For startup ideas, side projects, and work proposals.',
  },
};

/** "Why this exists": everyone else's opinion, then why we exist. */
export const WHY: Record<Category, { others: string[]; body: string }> = {
  philosophy: {
    others: ['Your friends say follow your heart.', 'Your parents say be practical.', 'The internet says both, depending on the hour.'],
    body: 'The question keeping you up isn’t new. Quit or stay, move or not, what actually matters: philosophers have argued about it for 2,000 years, on both sides. Most of us only ever hear the side we already agree with. We bring the best of both, with book and chapter, so you decide on arguments, not vibes.',
  },
  startup: {
    others: ['Your friends say it’s genius.', 'Your parents say be careful.', 'The internet says quit your job.'],
    body: 'For every delivery app on your phone, there’s a graveyard of food apps nobody remembers. That’s survivorship bias: you only hear from the ones who made it, because the ones who didn’t aren’t posting about it. We give tours of the graveyard, so you don’t have to move in.',
  },
};

/** "What it does": the promise, what you can bring, and what it does. */
export const WHAT_IT_DOES: Record<
  Category,
  {
    heading: string;
    promise: string;
    bring: { what: string; quip: string }[];
    does: { what: string; how: string }[];
  }
> = {
  philosophy: {
    heading: 'What it does for your decision',
    promise:
      'For the big calls and the beliefs you’ve never questioned. Skip placements? Take the offer? Move cities? We bring what the great thinkers argued on both sides, with the page number, so it’s not just vibes.',
    bring: [
      { what: 'Big life decisions', quip: 'Quit, stay, move, or marry the startup.' },
      { what: 'Philosophy and beliefs', quip: 'Argue with Aristotle. He’s had time to prepare.' },
    ],
    does: [
      {
        what: 'Finds the question under your question',
        how: '“Should I quit?” is usually “is security worth a regret?” We name it, so you argue about the right thing.',
      },
      {
        what: 'Brings both sides',
        how: 'Thinkers who’d back you and thinkers who’d stop you, with book and chapter for each.',
      },
      {
        what: 'Checks every quote',
        how: 'Quotes are checked word for word against the text. Paraphrases are labeled as paraphrases.',
      },
      {
        what: 'Hands you a smaller first step',
        how: 'A way to test the decision this month, before you bet everything on it.',
      },
    ],
  },
  startup: {
    heading: 'What it does for your idea',
    promise:
      'For the startup, side project, or work proposal you’re about to bet time and money on. We find who tried it before, how it ended, and what would have to be true for you to be different.',
    bring: [
      { what: 'Startup ideas', quip: 'Before you pitch it, bury it (on paper).' },
      { what: 'Work proposals', quip: 'Stress-test the strategy before your boss does.' },
    ],
    does: [
      {
        what: 'Names the bias',
        how: 'You’re looking at the winners. We show you the graveyard, and call out survivorship bias when it’s doing the thinking.',
      },
      {
        what: 'Finds who tried it before',
        how: 'Startups that went after the same customers, how they ended, and why. Every one sourced.',
      },
      {
        what: 'Asks the unglamorous questions',
        how: 'Who pays, what it costs to serve them, and what happens in the off-season.',
      },
      {
        what: 'Hands you the cheapest test',
        how: 'Something you can run this month, before you spend real money.',
      },
    ],
  },
};

/** The hand-back card in "What you get". */
export const HAND_BACK: Record<
  Category,
  {
    position: string;
    counterpoints: { source: string; point: string }[];
    note: string;
    strong: string;
    questions: string[];
    test: string;
  }
> = {
  philosophy: {
    position: 'I’m skipping placements to build my startup full time.',
    counterpoints: [
      {
        source: 'Aristotle, Nicomachean Ethics, Book VI',
        point: 'Practical wisdom means weighing your circumstances, not just your desire.',
      },
      {
        source: 'Seneca, Letters to Lucilius, 18',
        point: 'Live the worst case for a few days first, so it can’t ambush you.',
      },
      {
        source: 'Kierkegaard, Either/Or, Part I',
        point: 'You’ll regret something either way, so regret alone can’t decide it.',
      },
    ],
    note: 'Paraphrases, not quotes',
    strong: 'Courage, and a story that’s yours to write.',
    questions: [
      'What would you lose if it fails in 12 months?',
      'Does anyone depend on your income?',
      'What would make you stop?',
    ],
    test: 'Keep one offer open while you test for 8 weeks.',
  },
  startup: {
    position: 'Food delivery for college hostels. The big apps did it, so there’s clearly demand.',
    counterpoints: [
      { source: 'Hostel snack app, 2017–2019', point: 'Couldn’t cover delivery costs on small orders.' },
      { source: 'Campus grocery app, 2018–2020', point: 'Saw orders collapse every vacation.' },
      { source: 'Meal-plan app, 2016–2018', point: 'Lost to the hostel’s own mess contract.' },
    ],
    note: 'Illustrative examples for this demo',
    strong: 'Captive audience, dense delivery routes, cheap marketing through hostel groups.',
    questions: [
      'Does demand survive 3 months of holidays a year?',
      'Would parents prepay a semester?',
      'Why won’t hostels just call the local dhaba?',
    ],
    test: 'Ask hostel parents if they’d prepay a semester of breakfasts.',
  },
};
