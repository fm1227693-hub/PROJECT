/**
 * Cursor state store, kept deliberately outside React.
 *
 * Pointer movement must never re-render the tree, so the cursor never reads
 * React state. Instead every interactive element opts in with
 * `data-cursor="expand | view | open | drag | solid"` and optionally
 * `data-cursor-label="VIEW"`, and a single set of delegated listeners on the
 * document resolves which of them is under the pointer. One subscriber — the
 * CustomCursor component — writes the result straight onto its two DOM nodes.
 */
const listeners = new Set();

export const cursorStore = {
  variant: 'default',
  label: '',
  pressed: false,
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  emit(variant, label) {
    if (variant === cursorStore.variant && (label || '') === cursorStore.label) return;
    cursorStore.variant = variant;
    cursorStore.label = label || '';
    listeners.forEach((fn) => fn(variant, cursorStore.label, cursorStore.pressed));
  },
  setPressed(pressed) {
    if (pressed === cursorStore.pressed) return;
    cursorStore.pressed = pressed;
    listeners.forEach((fn) => fn(cursorStore.variant, cursorStore.label, pressed));
  },
};

/** One set of document-level listeners for the entire page. */
export function bindCursorDelegation() {
  const resolve = (target) => {
    const el = target instanceof Element ? target : target?.parentElement;
    const hit = el?.closest?.('[data-cursor], [data-cursor-label]');
    if (!hit) return { variant: 'default', label: '' };
    return {
      variant: hit.dataset.cursor || 'expand',
      label: hit.dataset.cursorLabel || '',
    };
  };

  const apply = (target) => {
    const next = resolve(target);
    cursorStore.emit(next.variant, next.label);
  };

  const onOver = (e) => apply(e.target);
  const onLeaveDoc = () => cursorStore.emit('default', '');
  const onDown = (e) => {
    apply(e.target);
    cursorStore.setPressed(true);
  };
  const onUp = () => cursorStore.setPressed(false);

  document.addEventListener('pointerover', onOver, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeaveDoc, { passive: true });
  document.addEventListener('pointerdown', onDown, { passive: true });
  document.addEventListener('pointerup', onUp, { passive: true });

  return () => {
    document.removeEventListener('pointerover', onOver);
    document.documentElement.removeEventListener('pointerleave', onLeaveDoc);
    document.removeEventListener('pointerdown', onDown);
    document.removeEventListener('pointerup', onUp);
  };
}
