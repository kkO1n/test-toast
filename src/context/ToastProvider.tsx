import React, { useRef, useState, type ReactNode } from "react";
import type { Toast } from "../types/types";
import { ToastItem } from "../components/ToastItem";
import { ToastContext } from "./ToastContext";

const uuid = () => new Date().getTime().toString();

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutIdMap = useRef(new Map<string, number>());
  const [animationState, setAnimationState] = useState<
    Record<string, "enter" | "leave">
  >({});

  const addToast = (toast: Omit<Toast, "id">) => {
    const duration = toast.duration || 3000;

    const otherToastWithSameType = toasts.find((ts) => ts.type === toast.type);
    if (otherToastWithSameType) {
      const otherToastTimeoutId = timeoutIdMap.current.get(
        otherToastWithSameType.id,
      );

      clearTimeout(otherToastTimeoutId);

      const newTimoutId = setTimeout(() => {
        removeToast(otherToastWithSameType.id);
      }, duration);
      timeoutIdMap.current.set(otherToastWithSameType.id, newTimoutId);
      return;
    }

    const newToast: Toast = {
      id: uuid(),
      ...toast,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    const timeoutId = setTimeout(() => {
      removeToast(newToast.id);
    }, duration);
    timeoutIdMap.current.set(newToast.id, timeoutId);
    setAnimationState((prev) => ({ ...prev, [newToast.id]: "enter" }));
  };

  const removeToast = (id: string) => {
    const timeoutId = timeoutIdMap.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutIdMap.current.delete(id);
    }

    setAnimationState((prev) => ({ ...prev, [id]: "leave" }));
    setTimeout(
      () =>
        setToasts((prevToasts) =>
          prevToasts.filter((toast) => toast.id !== id),
        ),
      300,
    );
  };

  const handleClearTimeoutId = (id: string) => {
    const timeoutId = timeoutIdMap.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  const handleSetTimoutId = (id: string, timeoutId: number) => {
    timeoutIdMap.current.set(id, timeoutId);
  };

  return (
    <>
      <div className="toast-list">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
            handleSetTimoutId={handleSetTimoutId}
            handleClearTimeoutId={handleClearTimeoutId}
            animationState={animationState[toast.id]}
          />
        ))}
      </div>
      <ToastContext.Provider value={{ addToast, removeToast }}>
        {children}
      </ToastContext.Provider>
    </>
  );
};
