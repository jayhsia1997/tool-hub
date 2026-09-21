import { useEffect, useId, useRef } from "react";

type KeyboardShortcutsDialogProps = {
  open: boolean;
  onClose: () => void;
};

const FOCUSABLE_SELECTOR = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function KeyboardShortcutsDialog({ open, onClose }: KeyboardShortcutsDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const closeButton = panelRef.current?.querySelector<HTMLButtonElement>(".shortcuts-dialog-close");
    closeButton?.focus();

    function focusables() {
      return Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const items = focusables();
      if (items.length === 0) {
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="shortcuts-dialog-backdrop" onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="shortcuts-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shortcuts-dialog-panel">
          <div className="shortcuts-dialog-header">
            <h2 id={titleId} className="shortcuts-dialog-title">
              Keyboard Shortcuts
            </h2>
            <button type="button" className="shortcuts-dialog-close" onClick={onClose} aria-label="Close keyboard shortcuts">
              Close
            </button>
          </div>
          <ul className="shortcuts-list">
            <li>
              <span className="shortcuts-keys">
                <kbd>/</kbd>
                <kbd>⌘K</kbd>
                <kbd>Ctrl+K</kbd>
              </span>
              <span>Focus search</span>
            </li>
            <li>
              <span className="shortcuts-keys">
                <kbd>Esc</kbd>
              </span>
              <span>Clear and leave search</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
