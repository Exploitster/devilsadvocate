/**
 * "How it works", played by scrolling. See HowItWorks.astro: CSS decides
 * which version shows (the stage or the plain list), so this never
 * rearranges the page on load. It only drives what's showing:
 *
 *   - stage: scroll position through the track sets the step; the rail
 *     fills continuously; the phone is scaled to fit; rail numbers jump
 *     to a step. It only measures while the stage is near the screen;
 *   - list, with motion (short screens): each phone plays its step once
 *     as it scrolls into view;
 *   - reduced motion or no JavaScript: the list, finished, nothing moves.
 */

import { CATEGORY_EVENT } from './categories';

interface Story {
  root: HTMLElement;
  track: HTMLElement;
  pin: HTMLElement;
  rail: HTMLElement;
  buttons: HTMLButtonElement[];
  texts: HTMLElement[];
  screens: HTMLElement[];
  phoneWrap: HTMLElement;
  live: HTMLElement;
  current: number;
}

// Keep in step with the media query in HowItWorks.astro: the stage needs
// ~600px (phones) or ~540px (desktop) under the header and capsule band.
const STAGE =
  '(prefers-reduced-motion: no-preference) and (min-height: 45rem), ' +
  '(prefers-reduced-motion: no-preference) and (min-width: 64rem) and (min-height: 41.25rem)';
const TYPE_MS = 26;

export function initStory(): void {
  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-story]'));
  if (!roots.length) return;

  const stage = matchMedia(STAGE);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  // Where the stage sticks: read from its CSS (header + capsule band), so
  // the script can't drift from the styles. Re-read on resize.
  let pinTopPx = 0;
  const readPinTop = () => {
    const pin = document.querySelector<HTMLElement>('[data-pin]');
    pinTopPx = pin ? parseFloat(getComputedStyle(pin).top) || 0 : 0;
  };
  const pinTop = () => pinTopPx;

  const stories: Story[] = roots.map((root) => ({
    root,
    track: root.querySelector<HTMLElement>('[data-track]')!,
    pin: root.querySelector<HTMLElement>('[data-pin]')!,
    rail: root.querySelector<HTMLElement>('[data-rail]')!,
    buttons: Array.from(root.querySelectorAll<HTMLButtonElement>('[data-go]')),
    texts: Array.from(root.querySelectorAll<HTMLElement>('[data-text]')),
    screens: Array.from(root.querySelectorAll<HTMLElement>('.story-track [data-screen]')),
    phoneWrap: root.querySelector<HTMLElement>('[data-phone-wrap]')!,
    live: root.querySelector<HTMLElement>('[data-story-live]')!,
    current: 0, // the markup starts on step 1
  }));
  const total = stories[0]!.texts.length;
  const shown = (s: Story) => s.root.getClientRects().length > 0;

  // Step 2 types the message into the box. One at a time, page-wide.
  let typing: { el: HTMLElement; text: string; timer: number } | null = null;
  const stopTyping = () => {
    if (!typing) return;
    clearTimeout(typing.timer);
    typing.el.textContent = typing.text;
    typing = null;
  };
  const typeIn = (screen: HTMLElement) => {
    const el = screen.querySelector<HTMLElement>('[data-type]');
    if (!el) return;
    stopTyping();
    const text = el.dataset.full ?? (el.dataset.full = el.textContent?.trim() ?? '');
    el.textContent = '';
    let n = 0;
    const job = { el, text, timer: 0 };
    const tick = () => {
      if (typing !== job) return;
      n += 1;
      el.textContent = text.slice(0, n);
      if (n < text.length) job.timer = window.setTimeout(tick, TYPE_MS);
      else typing = null;
    };
    typing = job;
    job.timer = window.setTimeout(tick, 700);
  };

  // ---------------------------------------------------------------- //
  // Stage                                                             //
  // ---------------------------------------------------------------- //

  let announceTimer = 0;
  const setStep = (s: Story, i: number, announce: boolean) => {
    if (i === s.current) return;
    s.current = i;
    s.buttons.forEach((b, k) => {
      if (k === i) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
      b.dataset.state = k < i ? 'done' : '';
    });
    s.texts.forEach((t, k) => {
      t.toggleAttribute('data-active', k === i);
      t.dataset.pos = k < i ? 'before' : 'after';
    });
    s.screens.forEach((sc, k) => sc.toggleAttribute('data-active', k === i));
    if (s.screens[i]?.querySelector('[data-type]')) typeIn(s.screens[i]!);
    else stopTyping();
    if (announce) {
      clearTimeout(announceTimer);
      const title = s.texts[i]?.querySelector('h3')?.textContent?.trim() ?? '';
      announceTimer = window.setTimeout(() => (s.live.textContent = `Step ${i + 1} of ${total}: ${title}`), 450);
    }
  };

  const progress = (s: Story) => {
    const room = s.track.offsetHeight - s.pin.offsetHeight;
    if (room <= 0) return 0;
    return Math.min(1, Math.max(0, (pinTop() - s.track.getBoundingClientRect().top) / room));
  };

  // Only stories near the screen are measured, on scroll or otherwise.
  const near = new Set<Story>();
  let frame = 0;
  const update = () => {
    frame = 0;
    if (!stage.matches) return;
    for (const s of near) {
      if (!shown(s)) continue;
      const p = progress(s);
      // The fill reaches each number as its step begins.
      s.rail.style.setProperty('--p', String(Math.min(1, (p * total) / (total - 1))));
      setStep(s, Math.min(total - 1, Math.floor(p * total)), true);
    }
  };
  const onScroll = () => {
    if (near.size && !frame) frame = requestAnimationFrame(update);
  };

  // Scale the phone to whatever height is left under the text.
  const fit = (s: Story) => {
    if (!stage.matches || !shown(s)) return;
    const phone = s.phoneWrap.firstElementChild as HTMLElement | null;
    if (!phone) return;
    const scale = Math.min(1, s.phoneWrap.clientHeight / phone.offsetHeight, s.phoneWrap.clientWidth / phone.offsetWidth);
    phone.style.setProperty('--s', String(Math.max(0.5, Math.round(scale * 1000) / 1000)));
  };

  const approach = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const s = stories.find((x) => x.track === entry.target)!;
        if (entry.isIntersecting) {
          if (!pinTopPx) readPinTop();
          near.add(s);
          fit(s);
        } else {
          near.delete(s);
        }
      }
      onScroll();
    },
    { rootMargin: '100% 0px' },
  );
  stories.forEach((s) => approach.observe(s.track));

  const jumpTo = (s: Story, i: number) => {
    const room = s.track.offsetHeight - s.pin.offsetHeight;
    const trackTop = window.scrollY + s.track.getBoundingClientRect().top - pinTop();
    // A little way into the step, so rounding never lands on the one before.
    const top = trackTop + ((i + 0.12) / total) * room;
    window.scrollTo({ top, behavior: reduce.matches ? 'auto' : 'smooth' });
  };
  stories.forEach((s) => s.buttons.forEach((b, i) => b.addEventListener('click', () => jumpTo(s, i))));

  // ---------------------------------------------------------------- //
  // List with motion (short screens): play each phone as it arrives   //
  // ---------------------------------------------------------------- //

  const listScreens = stories.flatMap((s) => Array.from(s.root.querySelectorAll<HTMLElement>('.story-list [data-screen]')));
  const seen = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const screen = entry.target as HTMLElement;
        screen.setAttribute('data-active', '');
        if (screen.querySelector('[data-type]')) typeIn(screen);
        seen.unobserve(screen);
      }
    },
    { threshold: 0.4 },
  );
  let watching = false;
  const watchList = () => {
    const want = !stage.matches && !reduce.matches;
    if (want === watching) return;
    watching = want;
    seen.disconnect();
    listScreens.forEach((screen) => {
      screen.toggleAttribute('data-watch', want);
      screen.removeAttribute('data-active');
      if (want) seen.observe(screen);
    });
  };

  // ---------------------------------------------------------------- //
  // Changes                                                           //
  // ---------------------------------------------------------------- //

  const refresh = () => {
    stopTyping();
    watchList();
    near.forEach(fit);
    update();
  };
  stage.addEventListener('change', refresh);
  reduce.addEventListener('change', refresh);
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      readPinTop();
      near.forEach(fit);
    }, 150);
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  // The other category's story just appeared: fit its phone, find its step.
  window.addEventListener(CATEGORY_EVENT, () => {
    stopTyping();
    near.forEach(fit);
    update();
  });
  // Fonts change text heights, and so the room left for the phone.
  document.fonts?.ready.then(() => near.forEach(fit));

  watchList();
}
