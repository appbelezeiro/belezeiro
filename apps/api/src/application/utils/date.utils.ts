/**
 * Date utilities for booking system
 * All timestamps are normalized to UTC with seconds and milliseconds set to zero
 */

export interface TimeInterval {
  start: string; // ISO timestamp
  end: string; // ISO timestamp
}

export interface Slot {
  start: string; // HH:mm format
  end: string; // HH:mm format
}

/**
 * Normalizes a date to UTC with seconds and milliseconds set to zero
 */
export function normalizeTimestamp(date: Date | string): string {
  const d = new Date(date);
  d.setUTCSeconds(0, 0);
  return d.toISOString();
}

/**
 * Formats a date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses YYYY-MM-DD and HH:mm to ISO timestamp
 */
export function parseDateTime(date: string, time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const d = new Date(date);
  d.setUTCHours(hours, minutes, 0, 0);
  return d.toISOString();
}

/**
 * Extracts HH:mm from ISO timestamp
 */
export function extractTime(timestamp: string): string {
  const d = new Date(timestamp);
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Gets the weekday (0=sunday, 6=saturday) from a date string
 */
export function getWeekday(date: string): number {
  return new Date(date).getDay();
}

/**
 * Adds days to a date and returns YYYY-MM-DD
 */
export function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

/**
 * Checks if two time intervals overlap
 */
export function intervalsOverlap(a: TimeInterval, b: TimeInterval): boolean {
  const aStart = new Date(a.start);
  const aEnd = new Date(a.end);
  const bStart = new Date(b.start);
  const bEnd = new Date(b.end);

  return aStart < bEnd && aEnd > bStart;
}

/**
 * Merges overlapping intervals and returns sorted, normalized intervals
 */
export function mergeIntervals(intervals: TimeInterval[]): TimeInterval[] {
  if (intervals.length === 0) return [];

  // Sort by start time
  const sorted = [...intervals].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  const merged: TimeInterval[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const lastMerged = merged[merged.length - 1];

    if (intervalsOverlap(lastMerged, current)) {
      // Merge intervals
      const newEnd =
        new Date(current.end) > new Date(lastMerged.end) ? current.end : lastMerged.end;
      merged[merged.length - 1] = {
        start: lastMerged.start,
        end: newEnd,
      };
    } else {
      merged.push(current);
    }
  }

  return merged;
}

/**
 * Subtracts intervals from a base interval, returning remaining intervals
 */
export function subtractIntervals(
  base: TimeInterval,
  toSubtract: TimeInterval[],
): TimeInterval[] {
  let remaining: TimeInterval[] = [base];

  for (const sub of toSubtract) {
    const newRemaining: TimeInterval[] = [];

    for (const interval of remaining) {
      if (!intervalsOverlap(interval, sub)) {
        // No overlap, keep as is
        newRemaining.push(interval);
      } else {
        const intervalStart = new Date(interval.start);
        const intervalEnd = new Date(interval.end);
        const subStart = new Date(sub.start);
        const subEnd = new Date(sub.end);

        // If there's a part before the subtraction
        if (intervalStart < subStart) {
          newRemaining.push({
            start: interval.start,
            end: subStart < intervalEnd ? sub.start : interval.end,
          });
        }

        // If there's a part after the subtraction
        if (intervalEnd > subEnd) {
          newRemaining.push({
            start: subEnd > intervalStart ? sub.end : interval.start,
            end: interval.end,
          });
        }
      }
    }

    remaining = newRemaining;
  }

  return remaining;
}
