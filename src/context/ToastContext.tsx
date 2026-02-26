import { createContext, useContext } from "react";
import type { Toast } from "../types/types";

type ToastContextType = {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
};

export const ToastContext = createContext<ToastContextType>({
  addToast: () => {},
  removeToast: () => {},
});

export const useToast = () => {
  if (!ToastContext) {
    throw new Error("useToast должен использоваться внутри ToastProvider");
  }
  return useContext(ToastContext);
};
