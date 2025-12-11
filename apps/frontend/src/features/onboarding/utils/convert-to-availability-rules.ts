// ============================================================================
// CONVERT TO AVAILABILITY RULES
// Converts legacy workingHours + lunchBreak to new availability rules system
// ============================================================================

import type { AvailabilityRuleInput, AvailabilityExceptionInput } from '@/features/units/types/unit-availability.types';

interface DaySchedule {
  enabled: boolean;
  open: string; // HH:MM
  close: string; // HH:MM
}

interface LunchBreak {
  enabled: boolean;
  start: string; // HH:MM
  end: string; // HH:MM
}

type WorkingHours = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
};

const DAY_TO_WEEKDAY: Record<keyof WorkingHours, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

/**
 * Converts legacy workingHours to availability rules
 * @param workingHours - The working hours object
 * @param slotDurationMinutes - Default slot duration (default: 30)
 * @returns Array of availability rules
 */
export function convertWorkingHoursToRules(
  workingHours: WorkingHours,
  slotDurationMinutes: number = 30
): AvailabilityRuleInput[] {
  const rules: AvailabilityRuleInput[] = [];

  for (const [dayName, schedule] of Object.entries(workingHours)) {
    if (!schedule.enabled) {
      continue;
    }

    const weekday = DAY_TO_WEEKDAY[dayName as keyof WorkingHours];

    rules.push({
      type: 'weekly',
      weekday,
      start_time: schedule.open,
      end_time: schedule.close,
      slot_duration_minutes: slotDurationMinutes,
      is_active: true,
      metadata: {
        migrated_from: 'workingHours',
        original_day: dayName,
      },
    });
  }

  return rules;
}

/**
 * Converts lunch break to availability exceptions
 * Currently not used - lunch breaks are not converted to exceptions
 * Kept for future reference if needed
 */
export function convertLunchBreakToExceptions(
  lunchBreak: LunchBreak,
  workingDays: number[]
): AvailabilityExceptionInput[] {
  if (!lunchBreak.enabled) {
    return [];
  }

  // NOTE: This is not currently used. Lunch breaks would need to be
  // implemented as daily exceptions, which might not be the best approach.
  // Consider implementing lunch breaks differently in the future.

  return [];
}

/**
 * Main conversion function - converts working hours and lunch break
 * to the new availability rules system
 */
export function convertToAvailabilityRules(
  workingHours: WorkingHours,
  lunchBreak?: LunchBreak,
  slotDurationMinutes: number = 30
): {
  availability_rules: AvailabilityRuleInput[];
  availability_exceptions: AvailabilityExceptionInput[];
} {
  const availability_rules = convertWorkingHoursToRules(workingHours, slotDurationMinutes);

  // For now, we don't convert lunch breaks to exceptions
  // This could be implemented in the future if needed
  const availability_exceptions: AvailabilityExceptionInput[] = [];

  return {
    availability_rules,
    availability_exceptions,
  };
}
