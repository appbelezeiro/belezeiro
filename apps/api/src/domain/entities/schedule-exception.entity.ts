import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from './base.entity';

export type ScheduleExceptionType = 'block' | 'custom';

type ScheduleExceptionEntityOwnProps = {
  user_id: string;
  date: Date;
  type: ScheduleExceptionType;
  start_time?: string;
  end_time?: string;
  reason?: string;
};

type ScheduleExceptionEntityCreationProps = ScheduleExceptionEntityOwnProps & BaseEntityCreationProps;
type ScheduleExceptionEntityProps = Required<
  Pick<ScheduleExceptionEntityOwnProps, 'user_id' | 'date' | 'type'>
> &
  Partial<Pick<ScheduleExceptionEntityOwnProps, 'start_time' | 'end_time' | 'reason'>> &
  BaseEntityProps;

export class ScheduleExceptionEntity extends BaseEntity<ScheduleExceptionEntityProps> {
  protected prefix(): string {
    return 'sex';
  }

  constructor(props: ScheduleExceptionEntityCreationProps) {
    super(props);
  }

  get user_id(): string {
    return this.props.user_id;
  }

  get date(): Date {
    return this.props.date;
  }

  get type(): ScheduleExceptionType {
    return this.props.type;
  }

  get start_time(): string | undefined {
    return this.props.start_time;
  }

  get end_time(): string | undefined {
    return this.props.end_time;
  }

  get reason(): string | undefined {
    return this.props.reason;
  }

  update_times(start_time: string, end_time: string): void {
    this.props.start_time = start_time;
    this.props.end_time = end_time;
    this.touch();
  }

  update_reason(reason: string): void {
    this.props.reason = reason;
    this.touch();
  }

  update_date(date: Date): void {
    this.props.date = date;
    this.touch();
  }
}
