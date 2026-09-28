// "Try a sample debate": pre-written conversations, three per category.
// Nothing here is generated; there's no input, and every answer is
// pre-filled. Startup samples use made-up, generic examples (labeled as
// illustrative). Philosophy samples cite real texts, as paraphrases.

import type { Category } from './categories';

/** The stages the sample moves through, shown as tabs under the chat. */
export const STAGES: Record<Category, string[]> = {
  philosophy: ['Your decision', 'Questions', 'Real question', 'Both sides', 'Push back', 'Hand-back'],
  startup: ['Your idea', 'Questions', 'Real question', 'Both sides', 'Push back', 'Hand-back'],
};

export interface Sample {
  id: string;
  /** Tab title, and the kind of thing it is. */
  tab: string;
  kind: string;
  opening: string;
  /** Clarifying questions; `pick` is the answer the sample gives. */
  questions: { q: string; options: string[]; pick: number }[];
  realQuestion: string;
  bias?: string;
  caseFor: { text: string; source?: string }[];
  otherSide: { source: string; point: string }[];
  /** Shown under the other side, and under the sample. */
  note: string;
  pushback: string;
  reply: string;
  card: { position: string; strong: string; questions: string[]; test: string };
  /** What the person walked in with, and what they walk out with. */
  change: { before: string; after: string };
}

const ILLUSTRATIVE = 'Illustrative examples for this demo';
const PARAPHRASES = 'Paraphrases, not quotes';

export const SAMPLES: Record<Category, Sample[]> = {
  startup: [
    {
      id: 'hostel-food',
      tab: 'Hostel food delivery',
      kind: 'Startup idea',
      opening: 'I’m building food delivery for college hostels. The big apps made it, so will I.',
      questions: [
        { q: 'Who pays: the students, or their parents?', options: ['Students, from pocket money', 'Parents, on a monthly plan', 'Not sure yet'], pick: 0 },
        { q: 'What happens to orders during vacations?', options: ['They dip, we’ll survive', 'We deliver to homes', 'Haven’t thought about it'], pick: 2 },
        { q: 'Why won’t students just call the local dhaba?', options: ['We’re faster', 'We’re cheaper', 'More choice'], pick: 0 },
      ],
      realQuestion: 'Does demand survive three months of holidays a year?',
      bias: 'Survivorship. You’re looking at the big apps, not the graveyard.',
      caseFor: [
        { text: 'A captive audience, all in one place.' },
        { text: 'Dense routes: one building, hundreds of customers.' },
        { text: 'Cheap marketing through hostel groups.' },
      ],
      otherSide: [
        { source: 'Hostel snack app, 2017–2019', point: 'Couldn’t cover delivery costs on small orders.' },
        { source: 'Campus grocery app, 2018–2020', point: 'Saw orders collapse every vacation.' },
        { source: 'Meal-plan app, 2016–2018', point: 'Lost to the hostel’s own mess contract.' },
      ],
      note: ILLUSTRATIVE,
      pushback: 'But we’ll be faster than the dhaba.',
      reply: 'Faster matters at 11 p.m., not at lunch. Could you run late nights only, in one hostel, and see if it pays?',
      card: {
        position: 'Food delivery for college hostels.',
        strong: 'A dense, captive audience that’s cheap to reach.',
        questions: ['Does demand survive the holidays?', 'Will students pay for speed, or only for price?'],
        test: 'Run late-night delivery in one hostel for two weeks. Count the repeat orders.',
      },
      change: {
        before: 'An app for every hostel in the city.',
        after: 'Two weeks of late-night orders in one hostel, before writing any code.',
      },
    },
    {
      id: 'bill-splitting',
      tab: 'Flatmate bill-splitting',
      kind: 'Startup idea',
      opening: 'An app that splits rent and bills between flatmates. Everyone fights about money, so everyone needs it.',
      questions: [
        { q: 'How do flatmates split bills today?', options: ['A group chat and a spreadsheet', 'One person pays and chases', 'They just fight'], pick: 1 },
        { q: 'Who would pay for it?', options: ['Flatmates, a small monthly fee', 'Landlords', 'Nobody, we’ll run ads'], pick: 0 },
        { q: 'How often does a flat need it?', options: ['Every month', 'When someone moves', 'Only after a fight'], pick: 0 },
      ],
      realQuestion: 'Is the pain big enough to pay for, or just big enough to complain about?',
      bias: 'Availability. The fights are memorable, so they feel more common than they are.',
      caseFor: [
        { text: 'Money fights are real, and they come back every month.' },
        { text: 'A clear moment of need: rent day.' },
        { text: 'It spreads itself: one flatmate invites the rest.' },
      ],
      otherSide: [
        { source: 'Flatmate expense app, 2015–2017', point: 'Used for a month, then everyone went back to the group chat.' },
        { source: 'Rent-collection app, 2018–2020', point: 'Needed every flatmate to sign up. Most flats had one holdout.' },
        { source: 'Shared-bills wallet, 2019–2021', point: 'Charging for what a spreadsheet does free didn’t stick.' },
      ],
      note: ILLUSTRATIVE,
      pushback: 'But ours will be much simpler.',
      reply: 'Simpler than a group chat is a high bar. Would a flat pay to stop using theirs? Ask ten flats before you build.',
      card: {
        position: 'A bill-splitting app for flatmates.',
        strong: 'A real, monthly pain with a built-in way to spread.',
        questions: ['Will the whole flat sign up, or just the organized one?', 'Is the pain worth a fee, or just a complaint?'],
        test: 'Track bills by hand for ten flats for a month. See how many would pay to keep it.',
      },
      change: {
        before: 'Six months building the app.',
        after: 'One month doing it by hand for ten flats.',
      },
    },
    {
      id: 'in-house-crm',
      tab: 'Build our own CRM',
      kind: 'Work proposal',
      opening: 'I’m proposing we build our own customer database instead of paying for one. We’d save the subscription.',
      questions: [
        { q: 'How many people would use it?', options: ['Our sales team of 8', 'The whole company', 'Just me for now'], pick: 0 },
        { q: 'Who keeps it running after launch?', options: ['Our two developers', 'An agency', 'It won’t need much'], pick: 2 },
        { q: 'What does the current tool cost a year?', options: ['Less than a developer’s month', 'About a developer’s salary', 'No idea'], pick: 0 },
      ],
      realQuestion: 'Is the subscription the real cost, or the developer time it takes to keep a new one alive?',
      bias: 'Planning fallacy. First versions always look cheaper than they turn out.',
      caseFor: [
        { text: 'You’d own your data and your workflow.' },
        { text: 'No per-seat fees as the team grows.' },
        { text: 'It could fit your sales process exactly.' },
      ],
      otherSide: [
        { source: 'Internal sales tool, 2018–2020', point: 'The one developer who understood it left.' },
        { source: 'Homegrown customer database, 2019–2021', point: 'Upkeep cost more hours than the subscription did.' },
        { source: 'Custom CRM rebuild, 2020–2021', point: 'Went back to a paid tool after missing a quarter’s reports.' },
      ],
      note: ILLUSTRATIVE,
      pushback: 'But our needs are really specific.',
      reply: 'Then list the three things the current tool can’t do. If a setting or add-on covers them, the build solves a problem you don’t have.',
      card: {
        position: 'Build our own customer database instead of paying for one.',
        strong: 'Ownership, no per-seat fees, and a perfect fit.',
        questions: ['Who keeps it running after launch?', 'What won’t the developers build instead?'],
        test: 'List the three things the current tool can’t do, and check whether a setting or add-on does them.',
      },
      change: {
        before: 'Pitch a six-month internal build.',
        after: 'Pitch a one-week check of what the current tool can already do.',
      },
    },
  ],
  philosophy: [
    {
      id: 'skip-placements',
      tab: 'Skip placements?',
      kind: 'Life decision',
      opening: 'I’m skipping placements to build my startup full time. I’ll regret it forever if I don’t try.',
      questions: [
        { q: 'What would you lose if it fails in 12 months?', options: ['A year and some savings', 'My family’s savings', 'Nothing, I’m young'], pick: 0 },
        { q: 'Does anyone depend on your income?', options: ['No, just me', 'My parents, partly', 'Not yet, but soon'], pick: 1 },
        { q: 'Has anyone paid for the product yet?', options: ['Yes, a few people', 'Not yet', 'There’s no product yet'], pick: 1 },
      ],
      realQuestion: 'Is a secure path worth giving up for a chance you’d regret not taking?',
      caseFor: [
        { text: 'Courage is a virtue: acting well in spite of fear.', source: 'Aristotle, Nicomachean Ethics, Book III' },
        { text: 'No rulebook chooses for you. You become who you are by choosing.', source: 'Sartre, Existentialism Is a Humanism' },
      ],
      otherSide: [
        { source: 'Aristotle, Nicomachean Ethics, Book VI', point: 'Practical wisdom means weighing your circumstances, not just your desire.' },
        { source: 'Seneca, Letters to Lucilius, 18', point: 'Live the worst case for a few days first, so it can’t ambush you.' },
        { source: 'Kierkegaard, Either/Or, Part I', point: 'You’ll regret something either way, so regret alone can’t decide it.' },
      ],
      note: PARAPHRASES,
      pushback: 'But I’ll regret it forever if I don’t try.',
      reply: 'Kierkegaard would say you’ll regret something either way. Could you keep one offer open while you test for 8 weeks? Regret has a cheaper version.',
      card: {
        position: 'Skip placements to build my startup full time.',
        strong: 'Courage, and a story that’s yours to write.',
        questions: ['What happens to your parents’ plans if it fails?', 'What would make you stop after 8 weeks?'],
        test: 'Keep one offer open while you test for 8 weeks.',
      },
      change: {
        before: 'All in: no offer, no deadline.',
        after: 'One offer kept open, an 8-week test, and a clear point to stop.',
      },
    },
    {
      id: 'move-cities',
      tab: 'Move cities?',
      kind: 'Life decision',
      opening: 'I got a job offer in another city. My parents want me to stay. I think I should go.',
      questions: [
        { q: 'What does staying give you that the job can’t?', options: ['Time with my parents', 'Lower costs', 'Honestly, nothing'], pick: 0 },
        { q: 'Do your parents need you there, or want you there?', options: ['Want, mostly', 'Need, for their health', 'Hard to tell'], pick: 2 },
        { q: 'Could you come back if it doesn’t work out?', options: ['Easily', 'Maybe, after a year', 'Not really'], pick: 1 },
      ],
      realQuestion: 'Whose life is this plan for: yours, theirs, or both?',
      caseFor: [
        { text: 'A plan of life chosen for you by others is barely yours.', source: 'Mill, On Liberty, Chapter III' },
        { text: 'You can’t hand this choice to a rule. It’s yours to make.', source: 'Sartre, Existentialism Is a Humanism' },
      ],
      otherSide: [
        { source: 'Confucius, Analects, Book IV', point: 'While your parents are alive, don’t go far; if you must go, make sure they know where to find you.' },
        { source: 'Aristotle, Nicomachean Ethics, Book VIII', point: 'What we owe our parents can never be fully repaid, so it can’t be ignored either.' },
      ],
      note: PARAPHRASES,
      pushback: 'But I can’t stay forever just because they want me to.',
      reply: 'Fair. Even Confucius left room: if you go, let them know where to find you. Could you agree on visits before you leave, instead of after the guilt?',
      card: {
        position: 'Take the job in another city, against my parents’ wishes.',
        strong: 'A life you choose is more yours than one chosen for you.',
        questions: ['Is it want or need, for your parents?', 'What would bring you back?'],
        test: 'Ask your parents what exactly they’re afraid of, before you decide.',
      },
      change: {
        before: 'Go, and deal with the guilt later.',
        after: 'Go with a plan they helped make: visits, calls, and a way back.',
      },
    },
    {
      id: 'money-meaning',
      tab: 'Money or meaning?',
      kind: 'Belief',
      opening: 'Honestly, money matters more than meaning. Meaning is what people talk about once rent is paid.',
      questions: [
        { q: 'What would more money get you?', options: ['No more rent stress', 'Out of a job I hate', 'Just more'], pick: 1 },
        { q: 'How much would be enough?', options: ['I’ll know when I see it', 'A specific number', 'There’s no such thing'], pick: 0 },
        { q: 'When did something last feel worth it, money aside?', options: ['Last week, actually', 'Can’t remember', 'In college'], pick: 0 },
      ],
      realQuestion: 'Do you want money, or what you think it buys: freedom, safety, respect?',
      caseFor: [
        { text: 'A good life needs some means. Poverty makes it harder to live well.', source: 'Aristotle, Nicomachean Ethics, Book I' },
        { text: 'You’re right that meaning is easier to discuss once rent is paid.' },
      ],
      otherSide: [
        { source: 'Aristotle, Nicomachean Ethics, Book I', point: 'Money is only ever useful for something else, so it can’t be the point.' },
        { source: 'Epicurus, Principal Doctrines, 15', point: 'What nature needs is limited and easy to get; what vanity wants never ends.' },
        { source: 'Seneca, Letters to Lucilius, 2', point: 'Poor isn’t having too little. It’s always wanting more.' },
      ],
      note: PARAPHRASES,
      pushback: 'But getting out of a job I hate is meaning, for me.',
      reply: 'Then you’ve found the real goal, and it has a number. Epicurus would say: work out what enough is, before the target moves.',
      card: {
        position: 'Money matters more than meaning.',
        strong: 'Security is a real good, and it comes before a lot of other goods.',
        questions: ['What number is enough, and why that one?', 'What would you do the day you reached it?'],
        test: 'Write down what enough is, in numbers, and what you’d do the day you hit it.',
      },
      change: {
        before: 'More money, no finish line.',
        after: 'A number that means enough, and a plan for the day you reach it.',
      },
    },
  ],
};
