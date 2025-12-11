import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from '../base.entity';

type UnitAvailabilityRuleEntityOwnProps = {
  unit_id: string;
  type: 'weekly' | 'specific_date';
  weekday?: number; // 0=sunday, 1=monday, ..., 6=saturday (only for weekly)
  date?: string; // YYYY-MM-DD (only for specific_date)
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  slot_duration_minutes: number;
  is_active: boolean;
  metadata?: Record<string, unknown>;
};

type UnitAvailabilityRuleEntityCreationProps = Omit<
  UnitAvailabilityRuleEntityOwnProps,
  'is_active'
> &
  Partial<Pick<UnitAvailabilityRuleEntityOwnProps, 'is_active'>> &
  BaseEntityCreationProps;

type UnitAvailabilityRuleEntityProps = Omit<
  UnitAvailabilityRuleEntityOwnProps,
  'weekday' | 'date' | 'metadata'
> &
  Pick<UnitAvailabilityRuleEntityOwnProps, 'weekday' | 'date' | 'metadata'> &
  BaseEntityProps;

export class UnitAvailabilityRuleEntity extends BaseEntity<UnitAvailabilityRuleEntityProps> {
  protected prefix(): string {
    return 'uar';
  }

  constructor(props: UnitAvailabilityRuleEntityCreationProps) {
    // Validate type-specific fields
    UnitAvailabilityRuleEntity.validateTypeSpecificFields(props);
    UnitAvailabilityRuleEntity.validateTimeFormat(props.start_time, 'start_time');
    UnitAvailabilityRuleEntity.validateTimeFormat(props.end_time, 'end_time');
    UnitAvailabilityRuleEntity.validateTimeRange(props.start_time, props.end_time);
    UnitAvailabilityRuleEntity.validateSlotDuration(props.slot_duration_minutes);

    super({
      ...props,
      is_active: props.is_active ?? true,
      metadata: props.metadata,
    });
  }

  private static validateTypeSpecificFields(
    props: UnitAvailabilityRuleEntityCreationProps
  ): void {
    if (props.type === 'weekly') {
      if (props.weekday === undefined) {
        throw new Error('Weekly rules must have a weekday (0-6)');
      }
      if (props.weekday < 0 || props.weekday > 6) {
        throw new Error('Weekday must be between 0 (Sunday) and 6 (Saturday)');
      }
      if (props.date !== undefined) {
        throw new Error('Weekly rules cannot have a specific date');
      }
    } else if (props.type === 'specific_date') {
      if (!props.date) {
        throw new Error('Specific date rules must have a date (YYYY-MM-DD)');
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(props.date)) {
        throw new Error('Date must be in YYYY-MM-DD format');
      }
      if (props.weekday !== undefined) {
        throw new Error('Specific date rules cannot have a weekday');
      }
    }
  }

  private static validateTimeFormat(time: string, fieldName: string): void {
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      throw new Error(`${fieldName} must be in HH:MM format (e.g., 09:00, 18:30)`);
    }
  }

  private static validateTimeRange(start_time: string, end_time: string): void {
    if (start_time >= end_time) {
      throw new Error(
        `start_time (${start_time}) must be before end_time (${end_time})`
      );
    }
  }

  private static validateSlotDuration(slot_duration_minutes: number): void {
    if (slot_duration_minutes <= 0) {
      throw new Error('slot_duration_minutes must be greater than 0');
    }
  }

  // Getters

  get unit_id(): string {
    return this.props.unit_id;
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

  get is_active(): boolean {
    return this.props.is_active;
  }

  get metadata(): Record<string, unknown> | undefined {
    return this.props.metadata;
  }

  // Update methods

  update_times(start_time: string, end_time: string): void {
    UnitAvailabilityRuleEntity.validateTimeFormat(start_time, 'start_time');
    UnitAvailabilityRuleEntity.validateTimeFormat(end_time, 'end_time');
    UnitAvailabilityRuleEntity.validateTimeRange(start_time, end_time);

    this.props.start_time = start_time;
    this.props.end_time = end_time;
    this.touch();
  }

  update_slot_duration(slot_duration_minutes: number): void {
    UnitAvailabilityRuleEntity.validateSlotDuration(slot_duration_minutes);
    this.props.slot_duration_minutes = slot_duration_minutes;
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

  update_metadata(metadata: Record<string, unknown>): void {
    this.props.metadata = metadata;
    this.touch();
  }
}
