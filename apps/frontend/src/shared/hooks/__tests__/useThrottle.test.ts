// ============================================================================
// USE THROTTLE TESTS
// ============================================================================

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useThrottle } from "../useThrottle";

describe("useThrottle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useThrottle("initial", 300));
    expect(result.current).toBe("initial");
  });

  it("should keep initial value when updated within throttle interval", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 300),
      { initialProps: { value: "initial" } }
    );

    // Initial value
    expect(result.current).toBe("initial");

    // Update within interval (should be throttled)
    rerender({ value: "update1" });

    // Value should still be initial (throttled)
    expect(result.current).toBe("initial");
  });

  it("should eventually update to latest value after interval", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 300),
      { initialProps: { value: "initial" } }
    );

    // Update the value
    rerender({ value: "updated" });

    // Initially still shows old value
    expect(result.current).toBe("initial");

    // After interval passes, should update
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("updated");
  });

  it("should handle multiple rapid updates and return the latest value", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 500),
      { initialProps: { value: "v1" } }
    );

    // Rapid updates
    rerender({ value: "v2" });
    rerender({ value: "v3" });
    rerender({ value: "v4" });

    // Should still show v1 (throttled)
    expect(result.current).toBe("v1");

    // After interval, should show latest
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe("v4");
  });

  it("should work with different data types", () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };

    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 300),
      { initialProps: { value: obj1 } }
    );

    expect(result.current).toBe(obj1);

    rerender({ value: obj2 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(obj2);
  });
});
