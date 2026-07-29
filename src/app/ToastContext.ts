import { createContext } from "react";

export type ToastVariant = "success" | "error";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

export interface ToastContextValue {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (toastId: string) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(
  undefined,
);
