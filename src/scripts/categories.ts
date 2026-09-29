/**
 * The Philosophy / Startup capsule. The radios already switch the content
 * through CSS; this adds what CSS can't:
 *   - keeps your place: whatever section you're reading stays put, so
 *     switching halfway down never throws you back to the top;
 *   - makes the switch visible: the accent colour changes with
 *     <html data-category>, new content slides in from the side of the tab
 *     you picked, and a notice says what changed when the category card
 *     isn't on screen;
 *   - the choice in the URL (?for=philosophy), so the link can be shared;
 *   - the capsule's headroom (headroom.ts): hidden while you scroll down,
 *     back when you scroll up;
 *   - a `da:category` event, so the story and the samples can reset.
 *
 * <html data-category> is the source of truth (set before first paint
 * from ?for=, in Base.astro); the radios follow it, never the reverse.
 */

import { initHeadroom, type Headroom } from './headroom';

export type Category = 'philosophy' | 'startup';
export const CATEGORY_EVENT = 'da:category';

const DEFAULT: Category = 'startup';
const ORDER: Category[] = ['philosophy', 'startup']; // left to right in the capsule
const LABEL: Record<Category, string> = { philosophy: 'Philosophy', startup: 'Startup' };
const isCategory = (v: string | null | undefined): v is Category => v === 'philosophy' || v === 'startup';

export const currentCategory = (): Category => {
  const v = document.documentElement.getAttribute('data-category');
  return isCategory(v) ? v : DEFAULT;
};

export function initCategories(): void {
  const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="category"]'));
  const bar = document.querySelector<HTMLElement>('[data-cats]');
  const sentinel = document.querySelector<HTMLElement>('[data-cats-sentinel]');
  const toast = document.querySelector<HTMLElement>('[data-cats-toast]');
  if (!inputs.length || !bar || !sentinel) return;
  const root = document.documentElement;
  const header = document.querySelector<HTMLElement>('.site-header');
  const capsule = bar.querySelector<HTMLElement>('.capsule');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  // The radios follow <html>. (Normally already true; writing the
  // attribute again would restyle the whole page for nothing.)
  let current: Category = currentCategory();
  if (root.getAttribute('data-category') !== current) root.setAttribute('data-category', current);
  inputs.forEach((i) => (i.checked = i.value === current));
  root.setAttribute('data-cats-live', '');

  // The waitlist's example idea follows the tab too.
  const idea = document.querySelector<HTMLInputElement>('#wl-challenge');
  const matchWaitlist = (cat: Category) => {
    const text = idea?.getAttribute(`data-placeholder-${cat}`);
    if (idea && text) idea.placeholder = text;
  };
  matchWaitlist(current);

  // ---------------------------------------------------------------- //
  // Headroom                                                          //
  // ---------------------------------------------------------------- //

  const headerHeight = () => header?.offsetHeight ?? 0;
  const headroom: Headroom = initHeadroom(bar, sentinel, headerHeight);

  // Jumps to a spot on this page (nav links, "Skip to…", the story's step
  // numbers): keep the capsule out of the way until the scroll ends, so it
  // never lands on top of what you jumped to.
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target as Element | null;
      const link = target?.closest<HTMLAnchorElement>('a[href*="#"]');
      const samePage = link && new URL(link.href).pathname === location.pathname;
      if (samePage || target?.closest('[data-story] [data-go]')) headroom.hideUntilScrollEnd();
    },
    true,
  );

  // Tabbing into the capsule while it's hidden: show it at once, before
  // the browser scrolls it into view (so the page doesn't lurch).
  capsule?.addEventListener('focusin', () => headroom.show(true));

  // A modal dialog or the mobile menu: nothing to hide or show meanwhile.
  const pausers = [
    ...Array.from(document.querySelectorAll<HTMLDialogElement>('dialog')),
    ...Array.from(document.querySelectorAll<HTMLElement>('.menu-toggle')),
  ];
  const paused = () =>
    pausers.some((el) => (el instanceof HTMLDialogElement ? el.open : el.getAttribute('aria-expanded') === 'true'));
  const watchPausers = new MutationObserver(() => headroom.freeze(paused()));
  pausers.forEach((el) => watchPausers.observe(el, { attributes: true, attributeFilter: ['open', 'aria-expanded'] }));

  // ---------------------------------------------------------------- //
  // Switching                                                         //
  // ---------------------------------------------------------------- //

  // The section to hold in place: the one across a line a little way under
  // the header and the capsule (when it's showing).
  const anchor = () => {
    if (headroom.state === 'in-flow') return null; // the capsule is in view: nothing above it changes
    const capsuleBottom = headroom.state === 'shown' ? (capsule?.getBoundingClientRect().bottom ?? 0) : 0;
    const edge = Math.max(header?.getBoundingClientRect().bottom ?? 0, capsuleBottom);
    const line = edge + Math.min(200, (window.innerHeight - edge) * 0.3);
    for (const el of Array.from(document.querySelectorAll<HTMLElement>('main > section'))) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= line && rect.bottom > line) return { el, top: rect.top };
    }
    return null;
  };

  let switchTimer = 0;
  let toastTimer = 0;
  let toastClear = 0;

  // "Now showing Philosophy…" — only when the card that already says so
  // isn't on screen, and after arrow-key flicking has settled.
  const notify = (cat: Category) => {
    if (!toast) return;
    clearTimeout(toastTimer);
    clearTimeout(toastClear);
    toastTimer = window.setTimeout(() => {
      const card = document.querySelector<HTMLElement>(`[data-cats-card][data-cat="${cat}"]`);
      const rect = card?.getBoundingClientRect();
      const cardVisible = rect && rect.bottom > headerHeight() && rect.top < window.innerHeight;
      if (cardVisible) return;
      toast.textContent = `Now showing ${LABEL[cat]}, from Why this exists to the hand-back card.`;
      toast.setAttribute('data-show', '');
      toastClear = window.setTimeout(() => {
        toast.removeAttribute('data-show');
        toastClear = window.setTimeout(() => (toast.textContent = ''), 300);
      }, 4000);
    }, 500);
  };

  const apply = (cat: Category) => {
    if (cat === current) return;
    const from = current;
    current = cat;

    // Read first, then write everything, then one layout for the
    // correction.
    const held = anchor();
    if (!reduce.matches) {
      root.setAttribute('data-switch', ORDER.indexOf(cat) < ORDER.indexOf(from) ? 'to-left' : 'to-right');
      clearTimeout(switchTimer);
      switchTimer = window.setTimeout(() => root.removeAttribute('data-switch'), 500);
    }
    root.setAttribute('data-category', cat);
    inputs.forEach((i) => (i.checked = i.value === cat));
    if (held) {
      const shift = held.el.getBoundingClientRect().top - held.top;
      if (shift) window.scrollBy({ top: shift, behavior: 'instant' as ScrollBehavior });
    }

    const url = new URL(location.href);
    if (cat === DEFAULT) url.searchParams.delete('for');
    else url.searchParams.set('for', cat);
    history.replaceState(history.state, '', url);
    matchWaitlist(cat);
    window.dispatchEvent(new CustomEvent<Category>(CATEGORY_EVENT, { detail: cat }));

    // You just used the capsule: keep it showing, and don't count the
    // keep-your-place correction as a scroll.
    headroom.show();
    requestAnimationFrame(() => headroom.rebase());
    notify(cat);
  };

  inputs.forEach((input) =>
    input.addEventListener('change', () => {
      if (input.checked && isCategory(input.value)) apply(input.value);
    }),
  );
}
