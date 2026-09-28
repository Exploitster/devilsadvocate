// "How it works": the seven steps, written once per category, and the
// example shown on the phone at each step. Everything here is illustration
// for static mockups. Copy lives in docs/copy.md.

import type { Category } from './categories';

interface Step {
  title: string;
  body: Record<Category, string>;
}

export const STEPS: Step[] = [
  {
    title: 'Pick your fight.',
    body: {
      philosophy: 'Choose Challenge my decision. That’s it.',
      startup: 'Choose Challenge my idea. That’s it.',
    },
  },
  {
    title: 'Spill it.',
    body: {
      philosophy: 'Type out the decision like you’d text a friend at 2 a.m. Long rants welcome. Typos forgiven.',
      startup: 'Type out your idea like you’d pitch it to a friend. Long rants welcome. Typos forgiven.',
    },
  },
  {
    title: 'We ask before we argue.',
    body: {
      philosophy: 'Up to three questions about what’s at stake for you, so we argue with what you actually mean, not what we assumed.',
      startup: 'Up to three questions: who pays, what it costs, what happens when it goes quiet. So we argue with your actual plan.',
    },
  },
  {
    title: 'We name the real question.',
    body: {
      philosophy: 'Under “should I quit?” there’s usually something bigger, like “is security worth a regret?”',
      startup: 'Often it’s a sneaky bias, like survivorship: you’re looking at the winners, not the graveyard.',
    },
  },
  {
    title: 'Receipts, both sides.',
    body: {
      philosophy: 'First, what’s genuinely strong in your case. Then the strongest other side: what great thinkers argued, with book and chapter. No made-up quotes. We check.',
      startup: 'First, what’s genuinely strong in your idea. Then the strongest other side: startups that tried something similar, how they ended, every claim sourced.',
    },
  },
  {
    title: 'Push back.',
    body: {
      philosophy: 'Disagree with us? Good. Every round brings fresh evidence, never the same point twice.',
      startup: 'Disagree with us? Good. Every round brings fresh evidence, never the same point twice.',
    },
  },
  {
    title: 'You decide.',
    body: {
      philosophy: 'You leave with a hand-back card and zero verdicts. Your life, your call.',
      startup: 'You leave with a hand-back card, the cheapest test you can run this month, and zero verdicts. Your idea, your call.',
    },
  },
];

export interface Example {
  /** Step 2: the user's opening message, as typed. */
  opening: string;
  /** Step 3: up to three clarifying questions. */
  questions: string[];
  /** Step 4: the named question, and a bias if one was spotted. */
  realQuestion: { lead: string; text: string }[];
  /** Step 5 */
  caseFor: string;
  otherSideNote: string;
  receipts: { source: string; point: string }[];
  /** Step 6 */
  pushback: string;
  reply: string;
  /** Step 7: the mini hand-back card, drawn from the step 6 exchange. */
  card: { counterpoints: string[]; test: string };
}

export const EXAMPLES: Record<Category, Example> = {
  startup: {
    opening: 'Food delivery for college hostels. The big apps did it, so there’s clearly demand.',
    questions: [
      'Who pays, students or parents?',
      'What happens to orders during vacations?',
      'Why won’t hostels just call the local dhaba?',
    ],
    realQuestion: [
      { lead: 'The real question:', text: 'does demand survive 3 months of holidays a year?' },
      { lead: 'Bias spotted:', text: 'survivorship. You’re looking at the big apps, not the graveyard.' },
    ],
    caseFor: 'Captive audience, dense delivery routes, cheap marketing through hostel groups.',
    otherSideNote: 'Illustrative examples for this demo',
    receipts: [
      { source: 'Hostel snack app, 2017–2019', point: 'Couldn’t cover delivery costs on small orders.' },
      { source: 'Campus grocery app, 2018–2020', point: 'Saw orders collapse every vacation.' },
      { source: 'Meal-plan app, 2016–2018', point: 'Lost to the hostel’s own mess contract.' },
    ],
    pushback: 'But we’ll do breakfast subscriptions!',
    reply: 'Interesting. Subscriptions fix vacation dips only if parents prepay a semester. Would they?',
    card: {
      counterpoints: ['Hostel snack app, 2017–2019', 'Campus grocery app, 2018–2020', 'Meal-plan app, 2016–2018'],
      test: 'Ask hostel parents if they’d prepay a semester of breakfasts.',
    },
  },
  philosophy: {
    opening: 'I’m skipping placements to build my startup full time.',
    questions: [
      'What would you lose if it fails in 12 months?',
      'Does anyone depend on your income?',
      'Has anyone paid for the product yet?',
    ],
    realQuestion: [
      {
        lead: 'The real question:',
        text: 'is a secure path worth giving up for a chance you’d regret not taking?',
      },
    ],
    caseFor: 'Many traditions prize courage and writing your own story.',
    otherSideNote: 'Paraphrases, not quotes',
    receipts: [
      {
        source: 'Aristotle, Nicomachean Ethics, Book VI',
        point: 'Practical wisdom means weighing your circumstances, not just your desire.',
      },
      {
        source: 'Seneca, Letters to Lucilius',
        point: 'Rehearse the worst case before you act, so it can’t ambush you.',
      },
    ],
    pushback: 'But I’ll regret it forever if I don’t try.',
    reply: 'Maybe. Could you keep one offer open while you test for 8 weeks? Regret has a cheaper version.',
    card: {
      counterpoints: ['Aristotle, Nicomachean Ethics, Book VI', 'Seneca, Letters to Lucilius'],
      test: 'Keep one offer open while you test for 8 weeks.',
    },
  },
};
