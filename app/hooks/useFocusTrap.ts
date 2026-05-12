import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
  );
}

/**
 * Keeps keyboard focus inside `rootRef` while `active` (modal / drawer open).
 */
export function useFocusTrap(active: boolean, rootRef: React.RefObject<HTMLElement | null>) {
  const previousFocus = useRef<Element | null>(null);

  useEffect(() => {
    if (!active || !rootRef.current) return;

    const root = rootRef.current;
    previousFocus.current = document.activeElement;

    const nodes = getFocusable(root);
    nodes[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const list = getFocusable(root);
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      (previousFocus.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    };
  }, [active, rootRef]);
}
