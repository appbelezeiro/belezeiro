// ============================================================================
// USE THROTTLE - Hook for throttling values and callbacks
// ============================================================================

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Throttles a value by the specified interval
 * Unlike debounce, throttle ensures the value updates at most once per interval
 *
 * @param value - The value to throttle
 * @param interval - Interval in milliseconds (default: 300ms)
 * @returns The throttled value
 *
 * @example
 * const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
 * const throttledPosition = useThrottle(mousePosition, 100);
 */
export function useThrottle<T>(value: T, interval: number = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();

    if (now >= lastExecuted.current + interval) {
      lastExecuted.current = now;
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, interval - (now - lastExecuted.current));

      return () => clearTimeout(timerId);
    }
  }, [value, interval]);

  return throttledValue;
}

/**
 * Throttles a callback function
 *
 * @param callback - The callback to throttle
 * @param interval - Interval in milliseconds
 * @returns A throttled version of the callback
 */
export function useThrottledCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  interval: number = 300
): T {
  const lastExecuted = useRef<number>(0);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const throttledCallback = useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastExecuted.current >= interval) {
        lastExecuted.current = now;
        callback(...args);
      } else if (!timeoutId.current) {
        timeoutId.current = setTimeout(() => {
          lastExecuted.current = Date.now();
          callback(...args);
          timeoutId.current = null;
        }, interval - (now - lastExecuted.current));
      }
    }) as T,
    [callback, interval]
  );

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return throttledCallback;
}
