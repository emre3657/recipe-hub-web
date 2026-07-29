import { useEffect, useId, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import FocusTrap from "../FocusTrap/FocusTrap";
import styles from "./ConfirmDialog.module.css";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isConfirming = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isConfirming) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isConfirming, isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !isConfirming) {
      onClose();
    }
  };

  return createPortal(
    <div className={styles.backdrop} onMouseDown={handleBackdropMouseDown}>
      <FocusTrap>
        <section
          className={styles.dialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
        >
          <div className={styles.content}>
            <div className={styles.header}>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>

              <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                disabled={isConfirming}
                aria-label="Close dialog"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
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

            <p id={descriptionId} className={styles.description}>
              {description}
            </p>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.cancelButton}
              type="button"
              disabled={isConfirming}
              onClick={onClose}
            >
              {cancelLabel}
            </button>

            <button
              className={styles.confirmButton}
              type="button"
              disabled={isConfirming}
              onClick={onConfirm}
            >
              {isConfirming ? "Please wait..." : confirmLabel}
            </button>
          </div>
        </section>
      </FocusTrap>
    </div>,
    document.body,
  );
}

export default ConfirmDialog;
