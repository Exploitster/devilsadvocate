/**
 * "Try a sample debate", played by the reader. At each step Devils
 * Advocate says something and offers a few reply chips; tapping one says
 * it, and the scripted reply to that exact chip follows. The tree (see
 * src/data/samples.ts) is closed: there's no text input, every chip has a
 * reply, and every path ends in a complete hand-back card.
 *
 *   greeting → your opening → 3 questions (3 answers each)
 *     → real question → what's strong → the other side
 *     → push back (3 choices) → hand-back card → start over / another
 *
 * The page's markup is one finished path (for no JavaScript); this clears
 * it and plays from the start. Everything is inserted as text, never HTML.
 * With reduced motion, replies arrive at once and nothing animates.
 */

import type { Choice, PushBack, Sample } from '../data/samples';

interface Payload {
  greeting: string;
  next: { strong: string; other: string; card: string; restart: string; another: string };
  done: string;
  push: string;
  sample: Sample;
}

type Part = 'position' | 'strong' | 'counter' | 'open' | 'test';

interface Game {
  data: Payload;
  log: HTMLElement;
  replies: HTMLElement;
  stages: HTMLElement[];
  parts: Map<Part, HTMLElement>;
  open: HTMLElement;
  test: HTMLElement;
  fills: HTMLElement | null;
  answers: Choice[];
  run: number; // bumped on restart, so a pending reply from the old run is dropped
}

const THINK_MS = 650;
const THINK_LONG_MS = 1000; // before the longer messages (both sides)

export function initSamples(): void {
  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-try]'));
  if (!roots.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  // ---------------------------------------------------------------- //
  // Building messages (text only)                                     //
  // ---------------------------------------------------------------- //

  const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  // Same markup as UserLine / ProductLine, so the bubble styles apply.
  const line = (who: 'user' | 'product', ...content: (Node | string)[]) => {
    const wrap = el('div', `line line--${who} line--sm`);
    const body = el('div', 'line__body');
    body.append(el('span', 'sr-only-text', who === 'user' ? 'You: ' : 'Devils Advocate: '));
    content.forEach((c) => body.append(typeof c === 'string' ? el('p', undefined, c) : c));
    wrap.append(body);
    return wrap;
  };

  const receipt = (source: string) => {
    const chip = el('span', 'receipt');
    chip.append(el('span', 'sr-only-text', 'Source: '), source);
    return chip;
  };

  const leadPara = (lead: string, text: string) => {
    const p = el('p');
    p.append(el('strong', 'lead', lead), ' ', text);
    return p;
  };

  const strongMsg = (s: Sample) => {
    const list = el('ul', 'points');
    list.setAttribute('role', 'list');
    s.caseFor.forEach((c) => {
      const li = el('li', undefined, c.text);
      if (c.source) li.append(' ', receipt(c.source));
      list.append(li);
    });
    return [el('p', 'lead', 'What’s genuinely strong in your case:'), list];
  };

  const otherMsg = (s: Sample) => {
    const list = el('ul', 'points points--receipts');
    list.setAttribute('role', 'list');
    s.otherSide.forEach((r) => {
      const li = el('li');
      li.append(receipt(r.source), el('span', 'points__text', r.point));
      list.append(li);
    });
    return [el('p', 'lead', 'The strongest other side:'), list, el('p', 'msg__note', s.note)];
  };

  // ---------------------------------------------------------------- //
  // The chat                                                          //
  // ---------------------------------------------------------------- //

  const wait = (ms: number) => new Promise<void>((done) => window.setTimeout(done, reduce.matches ? 0 : ms));

  const toBottom = (g: Game) => {
    const go = () => g.log.scrollTo({ top: g.log.scrollHeight, behavior: reduce.matches ? 'auto' : 'smooth' });
    requestAnimationFrame(go);
  };

  const append = (g: Game, node: HTMLElement) => {
    const item = el('li', 'msg');
    item.setAttribute('data-new', '');
    const inner = el('div', 'msg__in');
    inner.append(node);
    item.append(inner);
    g.log.append(item);
    toBottom(g);
    return item;
  };

  const you = (g: Game, text: string) => append(g, line('user', text));

  // Devils Advocate "thinks" (typing dots), then says it. Resolves false
  // if the debate was restarted meanwhile.
  const say = async (g: Game, content: (Node | string)[], think = THINK_MS) => {
    const run = g.run;
    const dots = el('span', 'chat-dots');
    dots.setAttribute('aria-hidden', 'true');
    dots.append(el('span'), el('span'), el('span'));
    const dotsItem = reduce.matches ? null : append(g, dots);
    await wait(think);
    dotsItem?.remove();
    if (run !== g.run) return false;
    append(g, line('product', ...content));
    return true;
  };

  // Offer reply chips. `speak` chips are things you say (they appear as
  // your message); the others are controls.
  const offer = (g: Game, chips: { label: string; speak?: boolean; quiet?: boolean; pick: () => void }[]) => {
    const hadFocus = g.replies.contains(document.activeElement);
    g.replies.replaceChildren();
    chips.forEach((c) => {
      const b = el('button', c.quiet ? 'reply-chip reply-chip--quiet' : 'reply-chip', c.label);
      b.type = 'button';
      b.setAttribute('data-new', '');
      b.addEventListener('click', () => {
        // The chip goes away; keep focus in the reply area (not the page)
        // until the next chips arrive.
        const focused = g.replies.contains(document.activeElement);
        g.replies.replaceChildren();
        if (focused) g.replies.focus({ preventScroll: true });
        if (c.speak !== false) you(g, c.label);
        c.pick();
      });
      g.replies.append(b);
    });
    // Keyboard users carry on from where they were.
    if (hadFocus) (g.replies.firstElementChild as HTMLElement | null)?.focus({ preventScroll: true });
  };

  const setStage = (g: Game, n: number) =>
    g.stages.forEach((st, k) => {
      if (k === n) st.setAttribute('aria-current', 'step');
      else st.removeAttribute('aria-current');
      st.dataset.state = k < n ? 'done' : '';
    });

  const fill = (g: Game, part: Part, on = true) => g.parts.get(part)?.toggleAttribute('data-filled', on);

  // ---------------------------------------------------------------- //
  // The tree                                                          //
  // ---------------------------------------------------------------- //

  const start = (g: Game) => {
    g.run += 1;
    g.answers = [];
    g.log.replaceChildren();
    g.parts.forEach((_, part) => fill(g, part, false));
    if (g.fills) g.fills.hidden = false;
    setStage(g, 0);
    const s = g.data.sample;
    append(g, line('product', g.data.greeting));
    offer(g, [{ label: s.opening, pick: () => opened(g) }]);
  };

  const opened = (g: Game) => {
    fill(g, 'position');
    setStage(g, 1);
    ask(g, 0);
  };

  const ask = async (g: Game, n: number) => {
    const q = g.data.sample.questions[n]!;
    if (!(await say(g, [q.q]))) return;
    offer(
      g,
      q.choices.map((choice) => ({ label: choice.say, pick: () => answered(g, n, choice) })),
    );
  };

  const answered = async (g: Game, n: number, choice: Choice) => {
    g.answers[n] = choice;
    if (!(await say(g, [choice.reply]))) return;
    if (n + 1 < g.data.sample.questions.length) return ask(g, n + 1);

    // All three answered: the open questions they leave go on the card.
    g.open.replaceChildren(...g.answers.map((a) => el('li', undefined, a.open)));
    fill(g, 'open');
    setStage(g, 2);
    const s = g.data.sample;
    const real = [leadPara('The real question:', s.realQuestion)];
    if (s.bias) real.push(leadPara('Bias spotted:', s.bias));
    if (!(await say(g, real))) return;
    offer(g, [{ label: g.data.next.strong, pick: () => strong(g) }]);
  };

  const strong = async (g: Game) => {
    setStage(g, 3);
    if (!(await say(g, strongMsg(g.data.sample), THINK_LONG_MS))) return;
    fill(g, 'strong');
    offer(g, [{ label: g.data.next.other, pick: () => other(g) }]);
  };

  const other = async (g: Game) => {
    if (!(await say(g, otherMsg(g.data.sample), THINK_LONG_MS))) return;
    fill(g, 'counter');
    setStage(g, 4);
    if (!(await say(g, [g.data.push]))) return;
    offer(
      g,
      g.data.sample.pushbacks.map((p) => ({ label: p.say, pick: () => pushed(g, p) })),
    );
  };

  const pushed = async (g: Game, p: PushBack) => {
    if (!(await say(g, [p.reply]))) return;
    g.test.textContent = p.test;
    offer(g, [{ label: g.data.next.card, pick: () => card(g) }]);
  };

  const card = async (g: Game) => {
    setStage(g, 5);
    if (!(await say(g, [g.data.done]))) return;
    fill(g, 'test');
    setStage(g, 6); // every step done
    if (g.fills) g.fills.hidden = true;
    offer(g, [
      { label: g.data.next.restart, speak: false, quiet: true, pick: () => start(g) },
      { label: g.data.next.another, speak: false, quiet: true, pick: () => another(g) },
    ]);
  };

  // ---------------------------------------------------------------- //
  // Samples and tabs                                                  //
  // ---------------------------------------------------------------- //

  const games = new Map<HTMLElement, Game>();
  const tabsOf = new Map<HTMLElement, HTMLButtonElement[]>();

  const setUpPanel = (panel: HTMLElement) => {
    const json = panel.querySelector<HTMLScriptElement>('[data-sample-json]');
    if (!json?.textContent) return;
    const partEls = Array.from(panel.querySelectorAll<HTMLElement>('[data-part]'));
    const g: Game = {
      data: JSON.parse(json.textContent) as Payload,
      log: panel.querySelector<HTMLElement>('[data-log]')!,
      replies: panel.querySelector<HTMLElement>('[data-replies]')!,
      stages: Array.from(panel.querySelectorAll<HTMLElement>('[data-stage-n]')),
      parts: new Map(partEls.map((p) => [p.dataset.part as Part, p])),
      open: panel.querySelector<HTMLElement>('[data-open]')!,
      test: panel.querySelector<HTMLElement>('[data-test]')!,
      fills: panel.querySelector<HTMLElement>('[data-fills]'),
      answers: [],
      run: 0,
    };
    // New messages are read out as they arrive.
    g.log.setAttribute('aria-live', 'polite');
    g.log.setAttribute('aria-relevant', 'additions');
    g.replies.tabIndex = -1;
    panel.querySelector<HTMLButtonElement>('[data-restart]')?.addEventListener('click', () => start(g));
    games.set(panel, g);
    start(g);
  };

  const selectTab = (root: HTMLElement, k: number, focus: boolean) => {
    const tabs = tabsOf.get(root)!;
    tabs.forEach((t, n) => {
      const on = n === k;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      root.querySelector<HTMLElement>(`#${t.getAttribute('aria-controls')}`)!.hidden = !on;
    });
    if (focus) tabs[k]!.focus();
  };

  // "Try another sample": the next tab, from the start.
  function another(g: Game) {
    const panel = [...games].find(([, x]) => x === g)![0];
    const root = panel.closest<HTMLElement>('[data-try]')!;
    const tabs = tabsOf.get(root)!;
    const k = (Number(panel.dataset.sample) + 1) % tabs.length;
    const next = root.querySelector<HTMLElement>(`[data-sample="${k}"]`)!;
    selectTab(root, k, false);
    start(games.get(next)!);
    tabs[k]!.focus({ preventScroll: true });
  }

  roots.forEach((root) => {
    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-sample-tab]'));
    tabsOf.set(root, tabs);
    root.querySelectorAll<HTMLElement>('[data-sample]').forEach(setUpPanel);
    tabs.forEach((tab, k) => {
      tab.addEventListener('click', () => selectTab(root, k, false));
      tab.addEventListener('keydown', (e) => {
        const last = tabs.length - 1;
        const to =
          e.key === 'ArrowRight' ? (k === last ? 0 : k + 1)
          : e.key === 'ArrowLeft' ? (k === 0 ? last : k - 1)
          : e.key === 'Home' ? 0
          : e.key === 'End' ? last
          : -1;
        if (to < 0) return;
        e.preventDefault();
        selectTab(root, to, true);
      });
    });
  });
}
