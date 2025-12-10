import { BookingEntity } from '@/domain/entities/booking.entity';
import { IBookingRepository } from '@/application/contracts/i-booking-repository.interface';
import { IBookingRuleRepository } from '@/application/contracts/i-booking-rule-repository.interface';
import { IBookingExceptionRepository } from '@/application/contracts/i-booking-exception-repository.interface';
import { InvalidTimeRangeError } from '@/domain/errors/invalid-time-range.error';
import { BookingOverlapError } from '@/domain/errors/booking-overlap.error';
import { SlotNotAvailableError } from '@/domain/errors/slot-not-available.error';
import { AvailabilityService } from '@/application/services/availability.service';
import { formatDate } from '@/application/utils/date.utils';

class UseCase {
  private availability_service: AvailabilityService;

  constructor(
    private readonly booking_repository: IBookingRepository,
    private readonly booking_rule_repository: IBookingRuleRepository,
    private readonly booking_exception_repository: IBookingExceptionRepository,
  ) {
    this.availability_service = new AvailabilityService(
      booking_rule_repository,
      booking_exception_repository,
      booking_repository,
    );
  }

  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Validate time range
    const start = new Date(input.start_at);
    const end = new Date(input.end_at);

    if (start >= end) {
      throw new InvalidTimeRangeError(
        `Start time (${input.start_at}) must be before end time (${input.end_at})`,
      );
    }

    // 2. Check for overlapping bookings (double-booking protection)
    const overlapping = await this.booking_repository.find_overlapping(
      input.user_id,
      input.start_at,
      input.end_at,
    );

    const confirmed_overlapping = overlapping.filter((b) => b.status === 'confirmed');

    if (confirmed_overlapping.length > 0) {
      throw new BookingOverlapError(
        `Booking conflicts with existing booking ${confirmed_overlapping[0].id}`,
      );
    }

    // 3. Verify slot is available
    const date = formatDate(start);
    const available_slots = await this.availability_service.get_available_slots(
      input.user_id,
      date,
    );

    // Check if requested time falls within any available slot
    const is_available = available_slots.some((slot) => {
      const slot_start = new Date(`${date}T${slot.start}:00.000Z`);
      const slot_end = new Date(`${date}T${slot.end}:00.000Z`);
      return start >= slot_start && end <= slot_end;
    });

    if (!is_available && available_slots.length > 0) {
      throw new SlotNotAvailableError(
        `Requested time slot is not available. Available slots: ${available_slots.map((s) => `${s.start}-${s.end}`).join(', ')}`,
      );
    }

    // 4. Create booking
    const booking = new BookingEntity({
      user_id: input.user_id,
      client_id: input.client_id,
      start_at: input.start_at,
      end_at: input.end_at,
    });

    return this.booking_repository.create(booking);
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
    client_id: string;
    start_at: string; // ISO timestamp
    end_at: string; // ISO timestamp
  };

  export type Output = Promise<BookingEntity>;
}

export { UseCase as CreateBookingUseCase };
