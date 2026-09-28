/**
 * The Philosophy / Startup tabs. The radios already switch the content
 * through CSS; this adds what CSS can't:
 *   - keeps your place: whatever section is at the top of the screen stays
 *     there, so switching halfway down never throws you back to the top;
 *   - a short fade on the content that just appeared;
 *   - the choice in the URL (?for=philosophy), so the link can be shared;
 *   - a `da:category` event, so the story and the samples can reset.
 */

export type Category = 'philosophy' | 'startup';
export const CATEGORY_EVENT = 'da:category';

const DEFAULT: Category = 'startup';

export const currentCategory = (): Category =>
  (document.documentElement.getAttribute('data-category') as Category | null) ?? DEFAULT;

export function initCategories(): void {
  const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="category"]'));
  const bar = document.querySelector<HTMLElement>('[data-cats]');
  if (!inputs.length || !bar) return;
  const root = document.documentElement;
  const header = document.querySelector<HTMLElement>('.site-header');

  const checked = () => (inputs.find((i) => i.checked)?.value as Category | undefined) ?? DEFAULT;
  // Normally the inline script has already set this; writing it again
  // would restyle the whole page for nothing.
  if (root.getAttribute('data-category') !== checked()) root.setAttribute('data-category', checked());
  root.setAttribute('data-cats-live', '');

  // The waitlist's example idea follows the tab too.
  const idea = document.querySelector<HTMLInputElement>('#wl-challenge');
  const matchWaitlist = (cat: Category) => {
    const text = idea?.getAttribute(`data-placeholder-${cat}`);
    if (idea && text) idea.placeholder = text;
  };
  matchWaitlist(checked());

  // The section to hold in place: the one you're reading, i.e. the one
  // across a line a little way under the header and the tabs.
  const anchor = () => {
    if (bar.getBoundingClientRect().top > (header?.offsetHeight ?? 0) + 1) return null; // tabs not stuck yet
    const edge = bar.getBoundingClientRect().bottom;
    const line = edge + Math.min(200, (window.innerHeight - edge) * 0.3);
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section'));
    for (const el of sections) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= line && rect.bottom > line) return { el, top: rect.top };
    }
    return null;
  };

  const apply = (cat: Category) => {
    if (root.getAttribute('data-category') === cat) return;
    const held = anchor();
    // Only content that appears because of a switch fades in.
    root.classList.add('cats-ready');
    root.setAttribute('data-category', cat);
    // Inputs drive the CSS; keep them in step when this runs from the URL.
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
  };

  inputs.forEach((input) => input.addEventListener('change', () => input.checked && apply(input.value as Category)));
}
