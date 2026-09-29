/**
 * "Headroom" for a sticky bar: once it's stuck under the header, it hides
 * while you scroll down and comes back as soon as you scroll up.
 *
 * Writes one attribute on the bar, data-headroom = in-flow | shown |
 * hidden; CSS does the rest. Kept cheap: the scroll path reads only
 * scrollY. Where the bar rests in the page (a sentinel just above it) is
 * measured only when the page's size changes, not on scroll. (An
 * IntersectionObserver can't do this: an instant jump past a zero-height
 * sentinel never "intersects", so it never reports.)
 *
 * Callers can force a state: show it (after a tab switch, on focus),
 * hide it until a programmatic scroll ends (anchor jumps), or freeze it
 * (a modal dialog or the mobile menu is open).
 */

export type HeadroomState = 'in-flow' | 'shown' | 'hidden';

export interface Headroom {
  readonly state: HeadroomState;
  /** Show it now (if stuck). `instant` skips the transition. */
  show(instant?: boolean): void;
  /** Hide it (if stuck) and ignore scrolling until the current scroll ends. */
  hideUntilScrollEnd(): void;
  /** Stop reacting to scroll (dialog or menu open); resume and rebase after. */
  freeze(on: boolean): void;
  /** Take the current position as the new starting point. */
  rebase(): void;
}

// Scroll this far in one direction before the bar reacts (accumulated, so
// slow scrolls count too).
const TOLERANCE = 8;

export function initHeadroom(bar: HTMLElement, sentinel: HTMLElement, headerHeight: () => number): Headroom {
  let state: HeadroomState = 'in-flow';
  let stuck = false;
  let frozen = false;
  let locked = false;
  let lockTimer = 0;
  let maxY = 0;
  let stuckAt = Infinity; // scrollY past which the bar is stuck
  const clampY = () => Math.min(maxY, Math.max(0, window.scrollY));
  let lastY = 0;
  let dir = 0;
  let run = 0;
  let frame = 0;

  const set = (next: HeadroomState, instant = false) => {
    if (!stuck && next !== 'in-flow') next = 'in-flow';
    if (next === state) return;
    state = next;
    if (instant) {
      bar.setAttribute('data-instant', '');
      requestAnimationFrame(() => requestAnimationFrame(() => bar.removeAttribute('data-instant')));
    }
    bar.dataset.headroom = next;
  };

  const rebase = () => {
    lastY = clampY();
    dir = 0;
    run = 0;
  };

  // The page's height changes (fonts, the story's layout, the waitlist
  // note), so the clamp's ceiling is kept up to date without layout reads
  // on scroll. Clamping stops iOS bounce at either end counting as a
  // scroll.
  const measure = () => {
    maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    stuckAt = sentinel.getBoundingClientRect().top + window.scrollY - (headerHeight() + 8);
  };

  const tick = () => {
    frame = 0;
    const y = clampY();
    const delta = y - lastY;
    lastY = y;
    const nowStuck = y > stuckAt;
    if (nowStuck !== stuck) {
      stuck = nowStuck;
      dir = 0;
      run = 0;
      // Just stuck: show it; it hides once you keep scrolling down.
      set(stuck ? (locked ? 'hidden' : 'shown') : 'in-flow');
      return;
    }
    if (frozen || locked || !stuck || delta === 0) return;
    // A jump (layout change, orientation, a programmatic scroll we weren't
    // told about) isn't the reader scrolling: start again from here.
    if (Math.abs(delta) > window.innerHeight * 0.5) {
      dir = 0;
      run = 0;
      return;
    }
    const d = Math.sign(delta);
    if (d !== dir) {
      dir = d;
      run = 0;
    }
    run += Math.abs(delta);
    if (run >= TOLERANCE) set(dir > 0 ? 'hidden' : 'shown');
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };
  window.addEventListener('scroll', schedule, { passive: true });

  // Re-measure when the page's size changes (fonts arriving, the story's
  // layout, rotation), then re-check the state.
  const remeasure = () => {
    measure();
    schedule();
  };
  new ResizeObserver(remeasure).observe(document.body);
  window.addEventListener('resize', remeasure);
  measure();
  rebase();
  tick(); // a page opened halfway down starts with the bar stuck and shown

  const unlock = () => {
    if (!locked) return;
    locked = false;
    clearTimeout(lockTimer);
    window.removeEventListener('scrollend', unlock);
    window.removeEventListener('scroll', lockScroll);
    rebase();
  };
  // Where scrollend isn't supported: done after 150ms without scrolling.
  const lockScroll = () => {
    clearTimeout(lockTimer);
    lockTimer = window.setTimeout(unlock, 150);
  };

  return {
    get state() {
      return state;
    },
    show(instant = false) {
      set('shown', instant);
      rebase();
    },
    hideUntilScrollEnd() {
      locked = true;
      set('hidden');
      window.addEventListener('scrollend', unlock, { once: true });
      window.addEventListener('scroll', lockScroll, { passive: true });
      lockScroll(); // also ends the lock if nothing scrolls at all
    },
    freeze(on: boolean) {
      frozen = on;
      if (!on) requestAnimationFrame(rebase);
    },
    rebase,
  };
}
