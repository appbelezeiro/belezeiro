import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from './base.entity';

type BookingEntityOwnProps = {
  user_id: string; // owner of the schedule
  client_id: string; // who books
  start_at: string; // ISO timestamp
  end_at: string; // ISO timestamp
  status: 'confirmed' | 'cancelled';
};

type BookingEntityCreationProps = Omit<BookingEntityOwnProps, 'status'> &
  Partial<Pick<BookingEntityOwnProps, 'status'>> &
  BaseEntityCreationProps;

type BookingEntityProps = Required<BookingEntityOwnProps> & BaseEntityProps;

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

  get start_at(): string {
    return this.props.start_at;
  }

  get end_at(): string {
    return this.props.end_at;
  }

  get status(): 'confirmed' | 'cancelled' {
    return this.props.status;
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
}
