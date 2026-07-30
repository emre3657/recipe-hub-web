import { useEffect, useRef, type ReactNode } from "react";

const FOCUSABLE_SELECTORS = [
  "a[href]",
  "area[href]",
  'input:not([type="hidden"]):not([disabled])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "iframe",
  "object",
  "embed",
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
  ).filter((element) => {
    const isHiddenFromInteraction = element.closest(
      '[inert], [aria-hidden="true"]',
    );

    const isVisible =
      element.offsetParent !== null || element.getClientRects().length > 0;

    return !isHiddenFromInteraction && isVisible;
  });
}

interface FocusTrapProps {
  children: ReactNode;
  active?: boolean;
}

function FocusTrap({ children, active = true }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) {
      return;
    }

    const container = containerRef.current;

    if (!container) {
      return;
    }

    const previousActiveElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const focusableElements = getFocusableElements(container);
    const initialFocusElement = focusableElements[0] ?? container;

    initialFocusElement.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }

      const currentFocusableElements = getFocusableElements(container);

      if (currentFocusableElements.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const firstElement = currentFocusableElements[0];
      const lastElement =
        currentFocusableElements[currentFocusableElements.length - 1];

      const activeElement =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;

      if (!activeElement || !container.contains(activeElement)) {
        event.preventDefault();

        if (event.shiftKey) {
          lastElement.focus();
        } else {
          firstElement.focus();
        }

        return;
      }

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      if (previousActiveElement?.isConnected) {
        previousActiveElement.focus();
      }
    };
  }, [active]);

  return (
    <div ref={containerRef} tabIndex={-1}>
      {children}
    </div>
  );
}

export default FocusTrap;
