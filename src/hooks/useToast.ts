import { useContext } from "react";
import { ToastContext } from "../app/ToastContext";

function useToast() {
  const toastContext = useContext(ToastContext);

  if (!toastContext) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return toastContext;
}

export default useToast;
