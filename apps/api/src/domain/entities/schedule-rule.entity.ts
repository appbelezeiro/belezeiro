import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from './base.entity';

type ScheduleRuleEntityOwnProps = {
  user_id: string;
  weekday: number[];
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_active: boolean;
};

type ScheduleRuleEntityCreationProps = Omit<ScheduleRuleEntityOwnProps, 'is_active'> &
  Partial<Pick<ScheduleRuleEntityOwnProps, 'is_active'>> &
  BaseEntityCreationProps;

type ScheduleRuleEntityProps = Required<ScheduleRuleEntityOwnProps> & BaseEntityProps;

export class ScheduleRuleEntity extends BaseEntity<ScheduleRuleEntityProps> {
  protected prefix(): string {
    return 'srl';
  }

  constructor(props: ScheduleRuleEntityCreationProps) {
    super({
      ...props,
      is_active: props.is_active ?? true,
    });
  }

  get user_id(): string {
    return this.props.user_id;
  }

  get weekday(): number[] {
    return this.props.weekday;
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

  get is_active(): boolean {
    return this.props.is_active;
  }

  update_times(start_time: string, end_time: string): void {
    this.props.start_time = start_time;
    this.props.end_time = end_time;
    this.touch();
  }

  update_slot_duration(duration: number): void {
    this.props.slot_duration_minutes = duration;
    this.touch();
  }

  update_weekdays(weekdays: number[]): void {
    this.props.weekday = weekdays;
    this.touch();
  }

  activate(): void {
    this.props.is_active = true;
    this.touch();
  }

  deactivate(): void {
    this.props.is_active = false;
    this.touch();
  }
}
