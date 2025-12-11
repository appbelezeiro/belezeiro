// ============================================================================
// USE AVAILABILITY - Query Hook for Available Time Slots
// ============================================================================

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { bookingService } from "../../api";
import type { DayAvailability, TimeSlot } from "../../types";
import { format } from "date-fns";

interface UseAvailabilityOptions {
  unitId: string;
  date: Date;
  serviceIds: string[];
  enabled?: boolean;
}

/**
 * Query hook to fetch available time slots for a specific date
 */
export function useAvailability({
  unitId,
  date,
  serviceIds,
  enabled = true,
}: UseAvailabilityOptions) {
  const dateString = format(date, "yyyy-MM-dd");

  return useQuery<DayAvailability, Error>({
    queryKey: queryKeys.booking.availability(unitId, dateString, serviceIds),
    queryFn: () => bookingService.getAvailability(unitId, dateString, serviceIds),
    enabled: enabled && !!unitId && serviceIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes (availability can change quickly)
  });
}

interface UseWeekAvailabilityOptions {
  unitId: string;
  startDate: Date;
  endDate: Date;
  serviceIds: string[];
  enabled?: boolean;
}

/**
 * Query hook to fetch available time slots for a week
 */
export function useWeekAvailability({
  unitId,
  startDate,
  endDate,
  serviceIds,
  enabled = true,
}: UseWeekAvailabilityOptions) {
  const startDateString = format(startDate, "yyyy-MM-dd");
  const endDateString = format(endDate, "yyyy-MM-dd");

  return useQuery<DayAvailability[], Error>({
    queryKey: queryKeys.booking.weekAvailability(
      unitId,
      startDateString,
      endDateString,
      serviceIds
    ),
    queryFn: () =>
      bookingService.getWeekAvailability(
        unitId,
        startDateString,
        endDateString,
        serviceIds
      ),
    enabled: enabled && !!unitId && serviceIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Helper to get available slots from availability data
 */
export function getAvailableSlots(availability?: DayAvailability): TimeSlot[] {
  if (!availability) return [];
  return availability.slots.filter((slot) => slot.available);
}
