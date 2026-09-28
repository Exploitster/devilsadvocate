/**
 * "Try a sample debate". Plays a pre-written conversation: the opening
 * types itself out, the product thinks and replies, the sample taps its
 * pre-filled answer to each question, and the hand-back card fills in as
 * stages complete. The stage tabs follow along, and jump when pressed.
 *
 * - Starts when the chat scrolls into view; pauses while it's out of view.
 * - Pause / Play / Play again, and the stage tabs, are the controls.
 * - Reduced motion: the finished conversation and card, nothing plays.
 *
 * CSS sets the starting state (messages folded, card waiting), so this
 * writes nothing to the page until a sample starts.
 */

import { CATEGORY_EVENT } from './categories';

const TYPE_MS = 24;
const THINK_MS = 800;

type Kind = 'type' | 'product' | 'chips' | 'user';

interface Player {
  panel: HTMLElement;
  log: HTMLElement;
  msgs: HTMLElement[];
  dots: HTMLElement;
  stages: HTMLButtonElement[];
  parts: HTMLElement[];
  toggle: HTMLButtonElement;
  fills: HTMLElement | null;
  next: number;
  stage: number;
  state: 'idle' | 'playing' | 'paused' | 'done';
  byUser: boolean; // paused by the Pause button, not by scrolling away
  timer: number;
}

export function initSamples(): void {
  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-try]'));
  if (!roots.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  const players = new Map<HTMLElement, Player>();
  const playerFor = (panel: HTMLElement): Player => {
    let p = players.get(panel);
    if (p) return p;
    p = {
      panel,
      log: panel.querySelector<HTMLElement>('[data-log]')!,
      msgs: Array.from(panel.querySelectorAll<HTMLElement>('.msg[data-kind]')),
      dots: panel.querySelector<HTMLElement>('[data-dots]')!,
      stages: Array.from(panel.querySelectorAll<HTMLButtonElement>('[data-go]')),
      parts: Array.from(panel.querySelectorAll<HTMLElement>('[data-fill]')),
      toggle: panel.querySelector<HTMLButtonElement>('[data-toggle]')!,
      fills: panel.querySelector<HTMLElement>('[data-fills]'),
      next: 0,
      stage: -1,
      state: 'idle',
      byUser: false,
      timer: 0,
    };
    players.set(panel, p);
    p.toggle.addEventListener('click', () => onToggle(p!));
    p.stages.forEach((b, n) => b.addEventListener('click', () => jump(p!, n)));
    return p;
  };

  // ---------------------------------------------------------------- //
  // Showing things                                                    //
  // ---------------------------------------------------------------- //

  const nearBottom = (log: HTMLElement) => log.scrollHeight - log.scrollTop - log.clientHeight < 96;
  const follow = (p: Player, wasNear: boolean) => {
    if (!wasNear) return;
    const go = () => p.log.scrollTo({ top: p.log.scrollHeight, behavior: reduce.matches ? 'auto' : 'smooth' });
    requestAnimationFrame(go);
    window.setTimeout(go, 360); // again once the message has unfolded
  };

  const show = (p: Player, el: HTMLElement, instant = false) => {
    const wasNear = nearBottom(p.log);
    el.toggleAttribute('data-instant', instant);
    el.setAttribute('data-shown', '');
    if (!instant) follow(p, wasNear);
  };
  const hide = (el: HTMLElement) => {
    el.setAttribute('data-instant', '');
    el.removeAttribute('data-shown');
  };

  const setStage = (p: Player, n: number) => {
    if (n === p.stage) return;
    p.stage = n;
    p.stages.forEach((b, k) => {
      if (k === n) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
      b.dataset.state = k < n ? 'done' : '';
    });
    fill(p, n);
  };

  // A part of the card fills once the stage that produces it is over.
  const fill = (p: Player, stage: number) =>
    p.parts.forEach((part) => part.toggleAttribute('data-filled', Number(part.dataset.fill) < stage));

  const setToggle = (p: Player) => {
    p.toggle.textContent = p.state === 'playing' ? 'Pause' : p.state === 'done' ? 'Play again' : 'Play';
    if (p.fills) p.fills.hidden = p.state === 'done';
  };

  // Put the conversation back to "nothing said yet".
  const reset = (p: Player) => {
    clearTimeout(p.timer);
    p.msgs.forEach((m) => {
      hide(m);
      m.querySelectorAll('.chip').forEach((c) => c.classList.remove('is-picked'));
      const typed = m.querySelector<HTMLElement>('[data-type]');
      if (typed?.dataset.full) typed.textContent = typed.dataset.full;
    });
    hide(p.dots);
    p.next = 0;
    p.stage = -1;
    setStage(p, 0);
    p.log.scrollTop = 0;
    p.state = 'idle';
    setToggle(p);
  };

  // Everything at once: the finished conversation and card.
  const finishNow = (p: Player) => {
    clearTimeout(p.timer);
    p.msgs.forEach((m) => {
      const typed = m.querySelector<HTMLElement>('[data-type]');
      if (typed?.dataset.full) typed.textContent = typed.dataset.full;
      if (m.dataset.kind === 'chips') hide(m);
      else show(p, m, true);
    });
    hide(p.dots);
    p.next = p.msgs.length;
    setStage(p, p.stages.length - 1);
    fill(p, Infinity);
    p.state = 'done';
    setToggle(p);
  };

  // ---------------------------------------------------------------- //
  // Playing                                                           //
  // ---------------------------------------------------------------- //

  const wait = (p: Player, ms: number, then: () => void) => {
    clearTimeout(p.timer);
    p.timer = window.setTimeout(() => p.state === 'playing' && then(), ms);
  };

  const readTime = (el: HTMLElement) => Math.min(2600, 700 + (el.textContent?.trim().length ?? 0) * 16);

  const step = (p: Player) => {
    const el = p.msgs[p.next];
    if (!el) {
      hide(p.dots);
      setStage(p, p.stages.length - 1);
      fill(p, Infinity);
      p.state = 'done';
      setToggle(p);
      return;
    }
    const kind = el.dataset.kind as Kind;
    // Already on screen (resuming after a pause): move on.
    if (kind !== 'chips' && el.hasAttribute('data-shown')) {
      p.next += 1;
      step(p);
      return;
    }
    setStage(p, Number(el.dataset.stage));
    const advance = () => {
      p.next += 1;
      step(p);
    };

    if (kind === 'type') {
      const typed = el.querySelector<HTMLElement>('[data-type]')!;
      const text = typed.dataset.full ?? (typed.dataset.full = typed.textContent?.trim() ?? '');
      typed.textContent = '';
      show(p, el);
      let n = 0;
      const tick = () => {
        n += 1;
        typed.textContent = text.slice(0, n);
        if (n < text.length) wait(p, TYPE_MS, tick);
        else wait(p, 650, advance);
      };
      wait(p, 300, tick);
    } else if (kind === 'product') {
      // It thinks first: the dots sit at the bottom, then give way.
      p.log.append(p.dots);
      show(p, p.dots);
      wait(p, THINK_MS, () => {
        hide(p.dots);
        show(p, el);
        wait(p, readTime(el), advance);
      });
    } else if (kind === 'chips') {
      show(p, el);
      wait(p, 650, () => {
        const pick = Number(el.dataset.pick);
        el.querySelectorAll('.chip')[pick]?.classList.add('is-picked');
        wait(p, 600, () => {
          // The tapped answer becomes the user's line; the chips fold away.
          el.removeAttribute('data-instant');
          el.removeAttribute('data-shown');
          advance();
        });
      });
    } else {
      show(p, el);
      wait(p, 900, advance);
    }
  };

  const play = (p: Player) => {
    if (p.state === 'done' || p.state === 'idle') reset(p);
    p.state = 'playing';
    p.byUser = false;
    setToggle(p);
    step(p);
  };

  const pause = (p: Player, byUser: boolean) => {
    if (p.state !== 'playing') return;
    clearTimeout(p.timer);
    // Finish anything half-typed, so a paused sample never reads cut off.
    const typed = p.msgs[p.next]?.querySelector<HTMLElement>('[data-type]');
    if (typed?.dataset.full && p.msgs[p.next]?.hasAttribute('data-shown')) {
      typed.textContent = typed.dataset.full;
      p.next += 1;
    }
    hide(p.dots);
    p.state = 'paused';
    p.byUser = byUser;
    setToggle(p);
  };

  const resume = (p: Player) => {
    p.state = 'playing';
    p.byUser = false;
    setToggle(p);
    step(p);
  };

  const onToggle = (p: Player) => {
    if (p.state === 'playing') pause(p, true);
    else if (p.state === 'paused') resume(p);
    else play(p);
  };

  // Jump to a stage: everything before it at once, then play from there.
  const jump = (p: Player, n: number) => {
    const first = p.msgs.findIndex((m) => Number(m.dataset.stage) >= n);
    if (reduce.matches) {
      p.msgs[first]?.scrollIntoView({ block: 'nearest' });
      setStage(p, n);
      return;
    }
    clearTimeout(p.timer);
    hide(p.dots);
    p.msgs.forEach((m, k) => {
      const typed = m.querySelector<HTMLElement>('[data-type]');
      if (typed?.dataset.full) typed.textContent = typed.dataset.full;
      if (k < first && m.dataset.kind !== 'chips') show(p, m, true);
      else hide(m);
    });
    p.next = first;
    p.stage = -1;
    setStage(p, n);
    requestAnimationFrame(() => (p.log.scrollTop = p.log.scrollHeight));
    p.state = 'playing';
    p.byUser = false;
    setToggle(p);
    step(p);
  };

  // ---------------------------------------------------------------- //
  // Tabs, visibility, categories                                      //
  // ---------------------------------------------------------------- //

  const activePanel = (root: HTMLElement) => root.querySelector<HTMLElement>('[data-sample]:not([hidden])')!;

  // Each sample's chat window: it plays once enough of it is on screen,
  // and pauses when it scrolls away (or its tab or category is hidden).
  const watcher = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const panel = (entry.target as HTMLElement).closest<HTMLElement>('[data-sample]')!;
        const p = playerFor(panel);
        if (entry.isIntersecting) {
          if (reduce.matches) continue;
          if (p.state === 'idle') play(p);
          else if (p.state === 'paused' && !p.byUser) resume(p);
        } else {
          pause(p, false);
        }
      }
    },
    { threshold: 0.4 },
  );

  const selectTab = (root: HTMLElement, tabs: HTMLButtonElement[], k: number, focus: boolean) => {
    const before = activePanel(root);
    tabs.forEach((t, n) => {
      const on = n === k;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      root.querySelector<HTMLElement>(`#${t.getAttribute('aria-controls')}`)!.hidden = !on;
    });
    if (focus) tabs[k]!.focus();
    const now = activePanel(root);
    if (now === before) return;
    const old = playerFor(before);
    pause(old, false);
    if (reduce.matches) return;
    reset(old);
    reset(playerFor(now)); // the watcher starts it once it's on screen
  };

  const setUp = (root: HTMLElement) => {
    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-sample-tab]'));
    tabs.forEach((tab, k) => {
      tab.addEventListener('click', () => selectTab(root, tabs, k, false));
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
        selectTab(root, tabs, to, true);
      });
    });

    root.querySelectorAll<HTMLElement>('.chat').forEach((chat) => watcher.observe(chat));
  };

  roots.forEach(setUp);

  // Switching category: stop the hidden one; the watcher starts the other.
  window.addEventListener(CATEGORY_EVENT, () => {
    roots.forEach((root) => {
      if (root.getClientRects().length) return;
      const p = playerFor(activePanel(root));
      pause(p, false);
    });
  });

  // Turning reduced motion on mid-play: show the finished state.
  reduce.addEventListener('change', () => {
    if (reduce.matches) players.forEach(finishNow);
  });
}
