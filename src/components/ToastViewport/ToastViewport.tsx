import { useCallback, useEffect, useRef, useState } from "react";
import type { Toast } from "../../app/ToastContext";
import styles from "./ToastViewport.module.css";

interface ToastViewportProps {
  toasts: Toast[];
  dismissToast: (toastId: string) => void;
}

function ToastViewport({ toasts, dismissToast }: ToastViewportProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className={styles.viewport}
      aria-live="polite"
      aria-relevant="additions removals"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} dismissToast={dismissToast} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  dismissToast: (toastId: string) => void;
}

function ToastItem({ toast, dismissToast }: ToastItemProps) {
  const [isClosing, setIsClosing] = useState(false);
  const closingTimerRef = useRef<number | null>(null);

  const isClosingRef = useRef(false);

  const handleDismiss = useCallback(() => {
    if (isClosingRef.current) {
      return;
    }

    isClosingRef.current = true;
    setIsClosing(true);

    closingTimerRef.current = window.setTimeout(() => {
      dismissToast(toast.id);
    }, 200);
  }, [dismissToast, toast.id]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      handleDismiss();
    }, toast.duration ?? 4000);

    return () => {
      window.clearTimeout(timerId);

      if (closingTimerRef.current !== null) {
        window.clearTimeout(closingTimerRef.current);
      }
    };
  }, [handleDismiss, toast.duration]);

  return (
    <div
      className={[
        styles.toast,
        styles[toast.variant],
        isClosing ? styles.closing : styles.entering,
      ].join(" ")}
      role={toast.variant === "error" ? "alert" : undefined}
    >
      <p className={styles.message}>{toast.message}</p>

      <button
        type="button"
        className={styles.closeButton}
        onClick={handleDismiss}
        aria-label="Dismiss notification"
      >
        <svg
          className={styles.closeIcon}
          aria-hidden="true"
          viewBox="0 0 24 24"
        >
          <path
            d="M6 6l12 12M18 6L6 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default ToastViewport;
