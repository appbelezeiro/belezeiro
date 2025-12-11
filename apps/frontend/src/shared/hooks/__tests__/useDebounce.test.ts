// ============================================================================
// USE DEBOUNCE TESTS
// ============================================================================

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 300));
    expect(result.current).toBe("initial");
  });

  it("should debounce value changes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "initial" } }
    );

    // Initial value
    expect(result.current).toBe("initial");

    // Update value
    rerender({ value: "updated" });

    // Should still be initial
    expect(result.current).toBe("initial");

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Now should be updated
    expect(result.current).toBe("updated");
  });

  it("should cancel pending update on unmount", () => {
    const { result, rerender, unmount } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "updated" });
    expect(result.current).toBe("initial");

    unmount();

    // Should not throw or cause issues
    act(() => {
      vi.advanceTimersByTime(300);
    });
  });

  it("should reset timer on rapid value changes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "initial" } }
    );

    // Rapid updates
    rerender({ value: "update1" });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: "update2" });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: "update3" });

    // Should still be initial
    expect(result.current).toBe("initial");

    // Complete the debounce
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should be the last value
    expect(result.current).toBe("update3");
  });

  it("should work with different delay values", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "updated" });

    // Not enough time
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("initial");

    // More time
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("updated");
  });

  it("should work with objects", () => {
    const initialObj = { name: "John" };
    const updatedObj = { name: "Jane" };

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: initialObj } }
    );

    expect(result.current).toBe(initialObj);

    rerender({ value: updatedObj });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(updatedObj);
  });
});
