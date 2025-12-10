import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from './base.entity';

type BookingExceptionEntityOwnProps = {
  user_id: string;
  date: string; // YYYY-MM-DD
  type: 'block' | 'override';
  start_time?: string; // ISO timestamp normalized, applicable for override
  end_time?: string; // ISO timestamp normalized, applicable for override
  slot_duration_minutes?: number; // applicable for override
  reason?: string;
};

type BookingExceptionEntityCreationProps = BookingExceptionEntityOwnProps & BaseEntityCreationProps;
type BookingExceptionEntityProps = Required<BookingExceptionEntityOwnProps> & BaseEntityProps;

export class BookingExceptionEntity extends BaseEntity<BookingExceptionEntityProps> {
  protected prefix(): string {
    return 'bex';
  }

  constructor(props: BookingExceptionEntityCreationProps) {
    super({
      ...props,
      start_time: props.start_time ?? '',
      end_time: props.end_time ?? '',
      slot_duration_minutes: props.slot_duration_minutes ?? 0,
      reason: props.reason ?? '',
    });
  }

  get user_id(): string {
    return this.props.user_id;
  }

  get date(): string {
    return this.props.date;
  }

  get type(): 'block' | 'override' {
    return this.props.type;
  }

  get start_time(): string | undefined {
    return this.props.start_time || undefined;
  }

  get end_time(): string | undefined {
    return this.props.end_time || undefined;
  }

  get slot_duration_minutes(): number | undefined {
    return this.props.slot_duration_minutes || undefined;
  }

  get reason(): string | undefined {
    return this.props.reason || undefined;
  }

  update_override_times(start_time: string, end_time: string, slot_duration_minutes: number): void {
    this.props.start_time = start_time;
    this.props.end_time = end_time;
    this.props.slot_duration_minutes = slot_duration_minutes;
    this.touch();
  }

  update_reason(reason: string): void {
    this.props.reason = reason;
    this.touch();
  }
}
