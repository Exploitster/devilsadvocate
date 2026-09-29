// "Try a sample debate": three pre-written debates per category, played
// by the reader. Nothing is generated and there's no text input: the
// reader answers by tapping one of the chips offered at each step, and
// every chip has its own scripted reply. So the whole thing is a small,
// closed decision tree:
//
//   opening → question 1 (3 choices) → question 2 (3) → question 3 (3)
//     → the real question → what's strong → the other side
//     → push back (3 choices) → hand-back card
//
// Each choice carries the product's reply to it and the open question it
// adds to the hand-back card; each push-back carries the reply, the
// cheapest test, and what you walk out with. Every path through the tree
// ends in a complete, consistent card.
//
// Startup samples use made-up, generic examples (labeled as
// illustrative). Philosophy samples cite real texts, as paraphrases.

import type { Category } from './categories';

/** Progress through a debate, shown as steps under the chat. */
export const STAGES: Record<Category, string[]> = {
  philosophy: ['Your decision', 'Questions', 'Real question', 'Both sides', 'Push back', 'Hand-back'],
  startup: ['Your idea', 'Questions', 'Real question', 'Both sides', 'Push back', 'Hand-back'],
};

/** How the product opens each conversation, per category. */
export const GREETING: Record<Category, string> = {
  startup: 'Pitch me. What are you building?',
  philosophy: 'What’s the call you’re trying to make?',
};

/** The chips that move the debate on between its fixed steps. */
export const NEXT = {
  strong: 'Fair. What’s strong in it?',
  other: 'Now the other side.',
  card: 'Give me my hand-back card.',
  restart: 'Start over',
  another: 'Try another sample',
};

export interface Choice {
  /** What you say when you tap it. */
  say: string;
  /** What Devils Advocate says back. */
  reply: string;
  /** The open question it leaves on your hand-back card. */
  open: string;
}

export interface PushBack {
  say: string;
  reply: string;
  /** The cheapest test this month, on the card. */
  test: string;
  /** "Walking out with", under the card. */
  after: string;
}

export interface Sample {
  id: string;
  /** Tab title, and the kind of thing it is. */
  tab: string;
  kind: string;
  opening: string;
  questions: { q: string; choices: Choice[] }[];
  realQuestion: string;
  bias?: string;
  caseFor: { text: string; source?: string }[];
  otherSide: { source: string; point: string }[];
  /** Shown under the other side, and under the sample. */
  note: string;
  pushbacks: PushBack[];
  card: { position: string; strong: string };
  /** What the person walked in with. */
  before: string;
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
        {
          q: 'Who pays: the students, or their parents?',
          choices: [
            {
              say: 'Students, from pocket money',
              reply: 'Then every order competes with the canteen and a packet of instant noodles. Small baskets, thin margins.',
              open: 'Can a small order cover the cost of delivering it?',
            },
            {
              say: 'Parents, on a monthly plan',
              reply: 'Interesting. Parents pay for peace of mind, not speed. That’s a meal subscription, not a delivery app.',
              open: 'Would parents prepay a month before seeing it work?',
            },
            {
              say: 'Not sure yet',
              reply: 'Normal at this stage, and the most important thing to find out. Who pays decides what you build.',
              open: 'Who actually pays, and how much?',
            },
          ],
        },
        {
          q: 'What happens to orders during vacations?',
          choices: [
            {
              say: 'They dip, we’ll survive',
              reply: 'Hostels sit empty for about three months a year. That’s a quarter of the year with costs and no customers.',
              open: 'Can the business cover three empty months?',
            },
            {
              say: 'We deliver to homes too',
              reply: 'Then you’re up against the big apps on their home turf, where they’re strongest.',
              open: 'Why would anyone pick you over the big apps at home?',
            },
            {
              say: 'Haven’t thought about it',
              reply: 'Most people don’t. It’s also the usual way campus businesses quietly shut down.',
              open: 'What happens to your riders when campus is empty?',
            },
          ],
        },
        {
          q: 'Why won’t students just call the local dhaba?',
          choices: [
            {
              say: 'We’re faster',
              reply: 'Faster matters at 11 p.m., when the dhaba’s shut. At lunch it’s a two-minute walk away.',
              open: 'Is late night your whole market?',
            },
            {
              say: 'We’re cheaper',
              reply: 'Cheaper than a place with no app, no riders and no commission? That’s hard to keep up.',
              open: 'How are you cheaper once you pay the riders?',
            },
            {
              say: 'More choice',
              reply: 'Choice helps, but students mostly reorder the same three things.',
              open: 'Do students want choice, or the usual, fast?',
            },
          ],
        },
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
      pushbacks: [
        {
          say: 'But we’ll be faster than the dhaba.',
          reply: 'Then prove it where speed wins: late nights, one hostel, two weeks. If people order again, you’ve got something.',
          test: 'Run late-night delivery in one hostel for two weeks. Count the repeat orders.',
          after: 'Two weeks of late-night orders in one hostel, before writing any code.',
        },
        {
          say: 'The big apps did fine, so the demand is there.',
          reply: 'The demand is there, and so are the big apps. The startups on the other side had demand too. What they lacked was a reason to be picked over the default.',
          test: 'Ask 30 students which app they ordered from last week, and what would make them switch.',
          after: 'A reason to be picked over the big apps, written down before the app is.',
        },
        {
          say: 'Vacations won’t matter if we grow fast.',
          reply: 'Growth doesn’t fill an empty campus. It just makes the empty months more expensive. Plan the quiet months first.',
          test: 'Price out three vacation months: riders, rent, and zero orders. See if you’re still standing.',
          after: 'A plan for the three quiet months, before the busy ones.',
        },
      ],
      card: {
        position: 'Food delivery for college hostels.',
        strong: 'A dense, captive audience that’s cheap to reach.',
      },
      before: 'An app for every hostel in the city.',
    },
    {
      id: 'bill-splitting',
      tab: 'Flatmate bill-splitting',
      kind: 'Startup idea',
      opening: 'An app that splits rent and bills between flatmates. Everyone fights about money, so everyone needs it.',
      questions: [
        {
          q: 'How do flatmates split bills today?',
          choices: [
            {
              say: 'A group chat and a spreadsheet',
              reply: 'So it’s already solved, for free, with tools everyone has. Your app has to beat “good enough”.',
              open: 'What does the spreadsheet get wrong often enough to pay to fix?',
            },
            {
              say: 'One person pays and chases',
              reply: 'That person is your customer. Everyone else in the flat is just along for the ride.',
              open: 'Would the one who chases pay, even if the rest won’t?',
            },
            {
              say: 'They just fight',
              reply: 'Fights are loud, but they’re not a budget. People rarely pay to end an argument they can just keep having.',
              open: 'Is the fight about the maths, or about who didn’t pay?',
            },
          ],
        },
        {
          q: 'Who would pay for it?',
          choices: [
            {
              say: 'Flatmates, a small monthly fee',
              reply: 'A monthly fee to split a monthly bill. Every flatmate has to agree it’s worth it.',
              open: 'Will a whole flat agree to pay, or only one person?',
            },
            {
              say: 'Landlords',
              reply: 'Landlords already get paid. What problem of theirs would you solve?',
              open: 'What does a landlord lose when flatmates fight?',
            },
            {
              say: 'Nobody, we’ll run ads',
              reply: 'Ads need lots of people opening the app lots of times. Bills come once a month.',
              open: 'How many flats would ads need to cover your costs?',
            },
          ],
        },
        {
          q: 'How often does a flat need it?',
          choices: [
            {
              say: 'Every month',
              reply: 'Good, that’s a habit. Now it has to be less effort than the group chat it replaces, every month.',
              open: 'Is it less effort than the group chat, every single month?',
            },
            {
              say: 'When someone moves',
              reply: 'Then it’s used a few times a year. Hard to charge monthly for that.',
              open: 'Could it be a one-time tool for moving in and out?',
            },
            {
              say: 'Only after a fight',
              reply: 'Then you’re selling to people at their angriest, once. Tough market.',
              open: 'After a fight, do people look for tools, or just avoid each other?',
            },
          ],
        },
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
      pushbacks: [
        {
          say: 'But ours will be much simpler.',
          reply: 'Simpler than a group chat is a high bar. Would a flat pay to stop using theirs? Ask ten flats before you build.',
          test: 'Track bills by hand for ten flats for a month. See how many would pay to keep it.',
          after: 'One month doing it by hand for ten flats.',
        },
        {
          say: 'Everyone I know complains about this.',
          reply: 'Complaining is free. That’s the availability bias again: the fights stick in memory, the calm months don’t. Find out who’d pay.',
          test: 'Ask 20 flats to prepay one month. Count how many actually do.',
          after: 'Twenty flats asked to pay, before six months of building.',
        },
        {
          say: 'We’ll make it fun, with reminders and badges.',
          reply: 'Fun helps people come back, but nobody wants a game about owing rent. Fix the chasing first; the badges can wait.',
          test: 'Send the reminders by hand for five flats for a month. See if the chasing stops.',
          after: 'A month of hand-sent reminders, to see if chasing is the real pain.',
        },
      ],
      card: {
        position: 'A bill-splitting app for flatmates.',
        strong: 'A real, monthly pain with a built-in way to spread.',
      },
      before: 'Six months building the app.',
    },
    {
      id: 'in-house-crm',
      tab: 'Build our own CRM',
      kind: 'Work proposal',
      opening: 'I’m proposing we build our own customer database instead of paying for one. We’d save the subscription.',
      questions: [
        {
          q: 'How many people would use it?',
          choices: [
            {
              say: 'Our sales team of 8',
              reply: 'Eight people: small enough that a paid tool is cheap, big enough that a day of downtime really hurts.',
              open: 'What does a day of downtime cost eight salespeople?',
            },
            {
              say: 'The whole company',
              reply: 'Then it’s not a side project anymore. Everyone’s work would run through code a few people maintain.',
              open: 'Who fixes it when the whole company is stuck?',
            },
            {
              say: 'Just me for now',
              reply: 'Then the subscription is probably tiny, and a spreadsheet might do. Why build at all?',
              open: 'Would a spreadsheet do the job for now?',
            },
          ],
        },
        {
          q: 'Who keeps it running after launch?',
          choices: [
            {
              say: 'Our two developers',
              reply: 'So two developers who aren’t working on your actual product. That’s the real price tag.',
              open: 'What would those developers build instead?',
            },
            {
              say: 'An agency',
              reply: 'Then you’re paying a subscription again, just to a different company, and with less control.',
              open: 'Is an agency retainer cheaper than the tool?',
            },
            {
              say: 'It won’t need much',
              reply: 'Every internal tool says that at launch. Security updates, new fields, broken imports: it adds up.',
              open: 'Who owns it when the person who built it leaves?',
            },
          ],
        },
        {
          q: 'What does the current tool cost a year?',
          choices: [
            {
              say: 'Less than a developer’s month',
              reply: 'Then the build only pays off if it takes under a month, and never needs fixing. It won’t.',
              open: 'How many months would the build really take?',
            },
            {
              say: 'About a developer’s salary',
              reply: 'Now it’s a fair comparison. But the build costs a salary too, plus the upkeep after.',
              open: 'Is there a cheaper plan of the tool you have?',
            },
            {
              say: 'No idea',
              reply: 'Worth finding out before the pitch. It’s the first thing your boss will ask.',
              open: 'What does the current tool actually cost?',
            },
          ],
        },
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
      pushbacks: [
        {
          say: 'But our needs are really specific.',
          reply: 'Then list the three things the current tool can’t do. If a setting or add-on covers them, the build solves a problem you don’t have.',
          test: 'List the three things the current tool can’t do, and check whether a setting or add-on does them.',
          after: 'Pitch a one-week check of what the current tool can already do.',
        },
        {
          say: 'We’ll own our data.',
          reply: 'A good reason. Most paid tools let you export everything, though. If yours does, you own your data already.',
          test: 'Export everything from the current tool this week. See what, if anything, you can’t take with you.',
          after: 'A tested export, instead of a rebuild to get the same data.',
        },
        {
          say: 'The subscription keeps going up.',
          reply: 'That’s a real cost. Compare it with developer time, not with zero. Then ask the vendor for a better plan.',
          test: 'Get a quote for a smaller plan, and price the build as developer hours plus a year of upkeep.',
          after: 'A side-by-side cost, upkeep included, before anyone writes code.',
        },
      ],
      card: {
        position: 'Build our own customer database instead of paying for one.',
        strong: 'Ownership, no per-seat fees, and a perfect fit.',
      },
      before: 'Pitch a six-month internal build.',
    },
  ],
  philosophy: [
    {
      id: 'skip-placements',
      tab: 'Skip placements?',
      kind: 'Life decision',
      opening: 'I’m skipping placements to build my startup full time. I’ll regret it forever if I don’t try.',
      questions: [
        {
          q: 'What would you lose if it fails in 12 months?',
          choices: [
            {
              say: 'A year and some savings',
              reply: 'A real cost, but a recoverable one. Seneca’s advice: rehearse the worst case, and it loses its grip on you.',
              open: 'What’s your plan for month 13 if it fails?',
            },
            {
              say: 'My family’s savings',
              reply: 'Then it isn’t only your risk. Aristotle’s practical wisdom means weighing everyone your choice touches.',
              open: 'Have you asked your family how much they’re willing to lose?',
            },
            {
              say: 'Nothing, I’m young',
              reply: 'Being young lowers the cost; it doesn’t make it zero. A year is a year, and placements don’t come round twice.',
              open: 'What would a year out cost you when you look for a job?',
            },
          ],
        },
        {
          q: 'Does anyone depend on your income?',
          choices: [
            {
              say: 'No, just me',
              reply: 'That’s freedom, and it’s rarer than it looks. It makes this bet more yours to take.',
              open: 'What’s the least you can live on for a year?',
            },
            {
              say: 'My parents, partly',
              reply: 'Then there’s a floor you can’t go below. Work out that number before you jump.',
              open: 'What do your parents need from you each month?',
            },
            {
              say: 'Not yet, but soon',
              reply: 'Then you have a window. Windows are worth using, and worth knowing when they close.',
              open: 'When does your window close?',
            },
          ],
        },
        {
          q: 'Has anyone paid for the product yet?',
          choices: [
            {
              say: 'Yes, a few people',
              reply: 'That’s evidence, not just hope. It makes the case for you stronger.',
              open: 'Would they pay again, and tell a friend?',
            },
            {
              say: 'Not yet',
              reply: 'Then you’re betting on belief, not evidence. That’s allowed, but it’s worth knowing which one you’re using.',
              open: 'What would it take to get one paying customer this month?',
            },
            {
              say: 'There’s no product yet',
              reply: 'Then skipping placements buys you time to build, not proof. Could you build something first?',
              open: 'Could you build a first version before placements end?',
            },
          ],
        },
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
      pushbacks: [
        {
          say: 'But I’ll regret it forever if I don’t try.',
          reply: 'Kierkegaard would say you’ll regret something either way. Could you keep one offer open while you test for 8 weeks? Regret has a cheaper version.',
          test: 'Keep one offer open while you test for 8 weeks.',
          after: 'One offer kept open, an 8-week test, and a clear point to stop.',
        },
        {
          say: 'Everyone successful took a big risk.',
          reply: 'That’s survivorship: we hear from the risk-takers who made it, not the ones who didn’t. And Sartre would remind you that you’re choosing your life, not borrowing theirs.',
          test: 'Talk to two founders who tried and stopped. Ask what they’d do differently.',
          after: 'The whole picture: the risk-takers who made it, and the ones who didn’t.',
        },
        {
          say: 'A job would kill my motivation.',
          reply: 'Maybe. But for Aristotle, courage is the brave thing done wisely, not just the brave thing. A deadline can protect motivation too.',
          test: 'Set a date and a number: if the startup hasn’t hit it by then, you take a job.',
          after: 'A deadline and a number, instead of all or nothing.',
        },
      ],
      card: {
        position: 'Skip placements to build my startup full time.',
        strong: 'Courage, and a story that’s yours to write.',
      },
      before: 'All in: no offer, no deadline.',
    },
    {
      id: 'move-cities',
      tab: 'Move cities?',
      kind: 'Life decision',
      opening: 'I got a job offer in another city. My parents want me to stay. I think I should go.',
      questions: [
        {
          q: 'What does staying give you that the job can’t?',
          choices: [
            {
              say: 'Time with my parents',
              reply: 'That’s a real good, and a hard one to get back later. Worth weighing honestly.',
              open: 'How much time with them would you actually lose?',
            },
            {
              say: 'Lower costs',
              reply: 'A practical reason. But costs can be planned for; an offer like this might not come twice.',
              open: 'Does the new salary cover the new city?',
            },
            {
              say: 'Honestly, nothing',
              reply: 'Then the question isn’t whether to leave. It’s how to leave well.',
              open: 'What would leaving well look like?',
            },
          ],
        },
        {
          q: 'Do your parents need you there, or want you there?',
          choices: [
            {
              say: 'Want, mostly',
              reply: 'Want matters, but it isn’t need. Mill would say their preferences can’t write your plan of life for you.',
              open: 'How can you honour what they want without living by it?',
            },
            {
              say: 'Need, for their health',
              reply: 'That changes the weight of it. Aristotle says what we owe our parents can never be fully repaid, so it can’t be ignored.',
              open: 'Who else could help with their care if you go?',
            },
            {
              say: 'Hard to tell',
              reply: 'Then that’s the first thing to find out. It’s hard to decide well without knowing which one it is.',
              open: 'Is it want, or need?',
            },
          ],
        },
        {
          q: 'Could you come back if it doesn’t work out?',
          choices: [
            {
              say: 'Easily',
              reply: 'Then this is more reversible than it feels. Reversible choices deserve less agonising.',
              open: 'What would make you come back?',
            },
            {
              say: 'Maybe, after a year',
              reply: 'A year is a real trial. Set it up as one, with a check-in point.',
              open: 'What would you check at the one-year mark?',
            },
            {
              say: 'Not really',
              reply: 'Then it’s a one-way door, and it deserves more care. Not a reason to stay; a reason to prepare.',
              open: 'What would make a one-way move feel safe enough?',
            },
          ],
        },
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
      pushbacks: [
        {
          say: 'But I can’t stay forever just because they want me to.',
          reply: 'Fair. Even Confucius left room: if you go, let them know where to find you. Could you agree on visits before you leave, instead of after the guilt?',
          test: 'Ask your parents what exactly they’re afraid of, before you decide.',
          after: 'Go with a plan they helped make: visits, calls, and a way back.',
        },
        {
          say: 'They’ll get used to it.',
          reply: 'Maybe. Confucius asks for something smaller: that they know where to find you. Getting used to it goes faster with a plan than with silence.',
          test: 'Agree on a call schedule and the date of the first visit before you accept.',
          after: 'A move with calls planned and the first visit already on the calendar.',
        },
        {
          say: 'It’s my life, not theirs.',
          reply: 'Mill would agree it’s yours to live. Aristotle would add that a good life includes the people in it. Both can be true.',
          test: 'Ask your parents what exactly they’re afraid of, and answer each fear before you go.',
          after: 'Their fears named out loud, and answered, before you leave.',
        },
      ],
      card: {
        position: 'Take the job in another city, against my parents’ wishes.',
        strong: 'A life you choose is more yours than one chosen for you.',
      },
      before: 'Go, and deal with the guilt later.',
    },
    {
      id: 'money-meaning',
      tab: 'Money or meaning?',
      kind: 'Belief',
      opening: 'Honestly, money matters more than meaning. Meaning is what people talk about once rent is paid.',
      questions: [
        {
          q: 'What would more money get you?',
          choices: [
            {
              say: 'No more rent stress',
              reply: 'That’s security, and it’s a real good. It’s also a specific amount, not an endless one.',
              open: 'How much would end the rent stress?',
            },
            {
              say: 'Out of a job I hate',
              reply: 'So money is the exit, not the goal. That’s meaning, wearing a salary.',
              open: 'What would you do the day you left?',
            },
            {
              say: 'Just more',
              reply: 'Seneca would say that’s the one kind of wanting that never gets full.',
              open: 'What would “more” be for?',
            },
          ],
        },
        {
          q: 'How much would be enough?',
          choices: [
            {
              say: 'I’ll know when I see it',
              reply: 'Most people don’t. The target tends to move as soon as they get close.',
              open: 'What number is enough, and why that one?',
            },
            {
              say: 'A specific number',
              reply: 'Good. A number is a finish line, and finish lines can be crossed.',
              open: 'Have you written the number down?',
            },
            {
              say: 'There’s no such thing',
              reply: 'Epicurus would call that vanity talking: what we need is limited, what we want isn’t.',
              open: 'Is there a number that would stop the worry?',
            },
          ],
        },
        {
          q: 'When did something last feel worth it, money aside?',
          choices: [
            {
              say: 'Last week, actually',
              reply: 'Then meaning isn’t missing from your life. It’s just not the thing you’re counting.',
              open: 'What was it, and how do you get more of it?',
            },
            {
              say: 'Can’t remember',
              reply: 'That’s worth sitting with. It might be the real problem under the money one.',
              open: 'What used to feel worth it?',
            },
            {
              say: 'In college',
              reply: 'So you know what it feels like. What was different then: the work, or the people?',
              open: 'What from college could you bring back?',
            },
          ],
        },
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
      pushbacks: [
        {
          say: 'But getting out of a job I hate is meaning, for me.',
          reply: 'Then you’ve found the real goal, and it has a number. Epicurus would say: work out what enough is, before the target moves.',
          test: 'Write down what enough is, in numbers, and what you’d do the day you hit it.',
          after: 'A number that means enough, and a plan for the day you reach it.',
        },
        {
          say: 'Meaning doesn’t pay rent.',
          reply: 'True, and Aristotle agrees you need the means. He’d just say money is for something. Name the something, and you’ll know when to stop.',
          test: 'Write down what the money is for, and how much of it that takes.',
          after: 'A reason for the money, and a number for enough.',
        },
        {
          say: 'Rich people seem pretty happy.',
          reply: 'Some do. Seneca was one of the richest men in Rome, and he still wrote that always wanting more is the real poverty.',
          test: 'For one month, note each purchase that still made you happier a week later.',
          after: 'A month of evidence on what money actually buys you.',
        },
      ],
      card: {
        position: 'Money matters more than meaning.',
        strong: 'Security is a real good, and it comes before a lot of other goods.',
      },
      before: 'More money, no finish line.',
    },
  ],
};
