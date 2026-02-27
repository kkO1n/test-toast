import React, { useRef } from "react";
import type { Toast } from "../types/types";

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
  handleClearTimeoutId: (id: string) => void;
  handleSetTimoutId: (id: string, timeoutId: number) => void;
  animationState: "enter" | "leave";
}

export const ToastItem: React.FC<ToastItemProps> = ({
  toast,
  onRemove,
  handleClearTimeoutId,
  handleSetTimoutId,
  animationState,
}) => {
  const durationRef = useRef(toast.duration || 3000);
  const leaveTimeRef = useRef<number | null>(null);

  const pause = () => {
    const pauseTime = new Date().getTime();
    const startTime = +toast.id;

    const newDuration =
      durationRef.current - (pauseTime - (leaveTimeRef.current || startTime));

    durationRef.current = newDuration;

    handleClearTimeoutId(toast.id);
  };

  const resume = () => {
    leaveTimeRef.current = new Date().getTime();

    const timeoutId = setTimeout(() => {
      onRemove(toast.id);
    }, durationRef.current);

    handleSetTimoutId(toast.id, timeoutId);
  };

  return (
    <div
      className={`toast toast-${toast.type} ${animationState}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <span>{toast.message}</span>
      <button onClick={() => onRemove(toast.id)}>x</button>
    </div>
  );
};
