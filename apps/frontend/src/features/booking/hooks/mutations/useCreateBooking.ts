// ============================================================================
// USE CREATE BOOKING - Mutation Hook to Create a New Booking
// ============================================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { bookingService } from "../../api";
import type { CreateBookingRequest, Booking } from "../../types";

/**
 * Mutation hook to create a new booking
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, CreateBookingRequest>({
    mutationFn: (request) => bookingService.createBooking(request),
    onSuccess: (_, variables) => {
      // Invalidate availability cache for the booked date
      queryClient.invalidateQueries({
        queryKey: queryKeys.booking.all,
      });

      // Also invalidate the bookings list for the unit
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.all,
      });

      // Invalidate specific date availability
      queryClient.invalidateQueries({
        queryKey: queryKeys.booking.availability(
          variables.unitId,
          variables.date,
          variables.serviceIds
        ),
      });
    },
  });
}
