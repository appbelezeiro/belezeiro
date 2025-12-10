import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from '../base.entity';

type BookingRuleEntityOwnProps = {
  user_id: string;
  type: 'weekly' | 'specific_date';
  weekday?: number; // 0=sunday ... 6=saturday, only for weekly
  date?: string; // YYYY-MM-DD, only for specific_date
  start_time: string; // ISO timestamp normalized
  end_time: string; // ISO timestamp normalized
  slot_duration_minutes: number;
  min_advance_minutes?: number; // minimum advance time in minutes to create a booking
  max_duration_minutes?: number; // maximum duration allowed for a booking
  max_bookings_per_day?: number; // maximum bookings per day for the schedule owner
  max_bookings_per_client_per_day?: number; // maximum bookings per day for a single client
  metadata?: Record<string, unknown>;
};

type BookingRuleEntityCreationProps = BookingRuleEntityOwnProps & BaseEntityCreationProps;
type BookingRuleEntityProps = Required<BookingRuleEntityOwnProps> & BaseEntityProps;

export class BookingRuleEntity extends BaseEntity<BookingRuleEntityProps> {
  protected prefix(): string {
    return 'brl';
  }

  constructor(props: BookingRuleEntityCreationProps) {
    super({
      ...props,
      metadata: props.metadata ?? {},
      min_advance_minutes: props.min_advance_minutes ?? undefined,
      max_duration_minutes: props.max_duration_minutes ?? undefined,
      max_bookings_per_day: props.max_bookings_per_day ?? undefined,
      max_bookings_per_client_per_day: props.max_bookings_per_client_per_day ?? undefined,
    });
  }

  get user_id(): string {
    return this.props.user_id;
  }

  get type(): 'weekly' | 'specific_date' {
    return this.props.type;
  }

  get weekday(): number | undefined {
    return this.props.weekday;
  }

  get date(): string | undefined {
    return this.props.date;
  }

  get start_time(): string {
    return this.props.start_time;
  }

  get end_time(): string {
    return this.props.end_time;
  }

  get slot_duration_minutes(): number {
    return this.props.slot_duration_minutes;
  }

  get metadata(): Record<string, unknown> {
    return this.props.metadata;
  }

  get min_advance_minutes(): number | undefined {
    return this.props.min_advance_minutes || undefined;
  }

  get max_duration_minutes(): number | undefined {
    return this.props.max_duration_minutes || undefined;
  }

  get max_bookings_per_day(): number | undefined {
    return this.props.max_bookings_per_day || undefined;
  }

  get max_bookings_per_client_per_day(): number | undefined {
    return this.props.max_bookings_per_client_per_day || undefined;
  }

  update_times(start_time: string, end_time: string): void {
    this.props.start_time = start_time;
    this.props.end_time = end_time;
    this.touch();
  }

  update_slot_duration(slot_duration_minutes: number): void {
    this.props.slot_duration_minutes = slot_duration_minutes;
    this.touch();
  }

  update_metadata(metadata: Record<string, unknown>): void {
    this.props.metadata = metadata;
    this.touch();
  }
}
