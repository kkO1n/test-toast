import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Toast Component", () => {
  it("should set/clear timeouts on mouse enter/leave", () => {
    vi.useFakeTimers();
    vi.spyOn(window, "setTimeout");
    vi.spyOn(window, "clearTimeout");
    render(<App />);

    const successButton = screen.getByText("Success Toast");
    fireEvent.click(successButton);
    const toast = screen.getByText("Успех!");

    expect(setTimeout).toHaveBeenCalledExactlyOnceWith(
      expect.any(Function),
      3000,
    );
    expect(clearTimeout).toHaveBeenCalledTimes(0);

    fireEvent.mouseEnter(toast);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(clearTimeout).toHaveBeenCalledTimes(1);

    fireEvent.mouseLeave(toast);
    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(clearTimeout).toHaveBeenCalledTimes(1);

    fireEvent.mouseEnter(toast);
    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(clearTimeout).toHaveBeenCalledTimes(2);

    fireEvent.mouseLeave(toast);
    expect(setTimeout).toHaveBeenCalledTimes(3);
    expect(clearTimeout).toHaveBeenCalledTimes(2);
  });

  it("should remove toast by itself", async () => {
    vi.useRealTimers();
    render(<App />);

    const successButton = screen.getByText("Success Toast");
    fireEvent.click(successButton);
    expect(screen.getByText("Успех!")).toBeDefined();

    await sleep(1000);
    expect(screen.getByText("Успех!")).toBeDefined();

    await sleep(2400);
    expect(screen.queryByText("Успех!")).toBeNull();
  });

  it("should not remove toast when mouseEnter", async () => {
    vi.useRealTimers();
    render(<App />);

    const successButton = screen.getByText("Success Toast");

    fireEvent.click(successButton);
    expect(screen.getByText("Успех!")).toBeDefined();

    await sleep(1000);
    fireEvent.mouseEnter(screen.getByText("Успех!"));
    await sleep(4000);
    expect(screen.getByText("Успех!")).toBeDefined();
  }, 10000);
});
