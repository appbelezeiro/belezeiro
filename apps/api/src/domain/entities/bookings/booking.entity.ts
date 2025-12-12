import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from '../base.entity';
import { InvalidTimeRangeError } from '@/domain/errors/bookings/invalid-time-range.error';
import { BookingInPastError } from '@/domain/errors/bookings/booking-in-past.error';
import { BookingTooCloseError } from '@/domain/errors/bookings/booking-too-close.error';
import { BookingExceedsMaxDurationError } from '@/domain/errors/bookings/booking-exceeds-max-duration.error';
import { BookingInvalidDurationForSlotError } from '@/domain/errors/bookings/booking-invalid-duration-for-slot.error';

type BookingEntityOwnProps = {
  user_id: string; // owner of the schedule
  client_id: string; // who books
  unit_id: string; // which unit the booking belongs to
  service_id?: string; // which service (optional)
  price_cents?: number; // price in cents (optional)
  notes?: string; // booking notes (optional)
  start_at: string; // ISO timestamp
  end_at: string; // ISO timestamp
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
};

type BookingEntityCreationProps = Omit<BookingEntityOwnProps, 'status'> &
  Partial<Pick<BookingEntityOwnProps, 'status'>> &
  BaseEntityCreationProps;

type BookingEntityProps = Omit<BookingEntityOwnProps, 'service_id' | 'price_cents' | 'notes'> &
  Pick<BookingEntityOwnProps, 'service_id' | 'price_cents' | 'notes'> &
  BaseEntityProps;

export class BookingEntity extends BaseEntity<BookingEntityProps> {
  protected prefix(): string {
    return 'book';
  }

  constructor(props: BookingEntityCreationProps) {
    super({
      ...props,
      status: props.status ?? 'confirmed',
    });
  }

  get user_id(): string {
    return this.props.user_id;
  }

  get client_id(): string {
    return this.props.client_id;
  }

  get unit_id(): string {
    return this.props.unit_id;
  }

  get service_id(): string | undefined {
    return this.props.service_id;
  }

  get price_cents(): number | undefined {
    return this.props.price_cents;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  get start_at(): string {
    return this.props.start_at;
  }

  get end_at(): string {
    return this.props.end_at;
  }

  get status(): 'confirmed' | 'cancelled' | 'completed' | 'no_show' {
    return this.props.status;
  }

  complete(): void {
    this.props.status = 'completed';
    this.touch();
  }

  mark_no_show(): void {
    this.props.status = 'no_show';
    this.touch();
  }

  cancel(): void {
    this.props.status = 'cancelled';
    this.touch();
  }

  /**
   * Checks if this booking overlaps with another booking
   */
  overlaps_with(other: BookingEntity): boolean {
    const thisStart = new Date(this.start_at);
    const thisEnd = new Date(this.end_at);
    const otherStart = new Date(other.start_at);
    const otherEnd = new Date(other.end_at);

    return thisStart < otherEnd && thisEnd > otherStart;
  }

  /**
   * Validates that the booking is not in the past
   */
  validate_not_in_past(): void {
    const now = new Date();
    const start = new Date(this.start_at);
    const end = new Date(this.end_at);

    if (start < now) {
      throw new BookingInPastError(
        `Cannot create booking with start time (${this.start_at}) in the past`,
      );
    }

    if (end < now) {
      throw new BookingInPastError(
        `Cannot create booking with end time (${this.end_at}) in the past`,
      );
    }
  }

  /**
   * Validates that start_at < end_at
   */
  validate_time_range(): void {
    const start = new Date(this.start_at);
    const end = new Date(this.end_at);

    if (start >= end) {
      throw new InvalidTimeRangeError(
        `Start time (${this.start_at}) must be before end time (${this.end_at})`,
      );
    }
  }

  /**
   * Validates minimum advance time
   * @param min_advance_minutes minimum advance time in minutes
   */
  validate_minimum_advance(min_advance_minutes: number): void {
    const now = new Date();
    const start = new Date(this.start_at);
    const diff_ms = start.getTime() - now.getTime();
    const diff_minutes = Math.floor(diff_ms / 1000 / 60);

    if (diff_minutes < min_advance_minutes) {
      throw new BookingTooCloseError(
        `Booking must be created at least ${min_advance_minutes} minutes in advance. Current advance: ${diff_minutes} minutes`,
      );
    }
  }

  /**
   * Validates maximum duration
   * @param max_duration_minutes maximum duration allowed in minutes
   */
  validate_max_duration(max_duration_minutes: number): void {
    const start = new Date(this.start_at);
    const end = new Date(this.end_at);
    const duration_ms = end.getTime() - start.getTime();
    const duration_minutes = Math.floor(duration_ms / 1000 / 60);

    if (duration_minutes > max_duration_minutes) {
      throw new BookingExceedsMaxDurationError(
        `Booking duration (${duration_minutes} minutes) exceeds maximum allowed (${max_duration_minutes} minutes)`,
      );
    }
  }

  /**
   * Validates that booking duration is a multiple of slot duration
   * @param slot_duration_minutes slot duration in minutes
   */
  validate_is_multiple_of_slot(slot_duration_minutes: number): void {
    const start = new Date(this.start_at);
    const end = new Date(this.end_at);
    const duration_ms = end.getTime() - start.getTime();
    const duration_minutes = Math.floor(duration_ms / 1000 / 60);

    if (duration_minutes % slot_duration_minutes !== 0) {
      throw new BookingInvalidDurationForSlotError(
        `Booking duration (${duration_minutes} minutes) must be a multiple of slot duration (${slot_duration_minutes} minutes)`,
      );
    }
  }
}
