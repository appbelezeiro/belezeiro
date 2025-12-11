import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from '../base.entity';

type UnitAvailabilityExceptionEntityOwnProps = {
  unit_id: string;
  date: string; // YYYY-MM-DD
  type: 'block' | 'override';
  start_time?: string; // HH:MM format (only for override)
  end_time?: string; // HH:MM format (only for override)
  slot_duration_minutes?: number; // only for override
  reason?: string;
};

type UnitAvailabilityExceptionEntityCreationProps =
  UnitAvailabilityExceptionEntityOwnProps & BaseEntityCreationProps;

type UnitAvailabilityExceptionEntityProps =
  Required<UnitAvailabilityExceptionEntityOwnProps> & BaseEntityProps;

export class UnitAvailabilityExceptionEntity extends BaseEntity<UnitAvailabilityExceptionEntityProps> {
  protected prefix(): string {
    return 'uex';
  }

  constructor(props: UnitAvailabilityExceptionEntityCreationProps) {
    // Validate date format
    UnitAvailabilityExceptionEntity.validateDateFormat(props.date);

    // Validate type-specific fields
    UnitAvailabilityExceptionEntity.validateTypeSpecificFields(props);

    super({
      ...props,
      start_time: props.start_time ?? '',
      end_time: props.end_time ?? '',
      slot_duration_minutes: props.slot_duration_minutes ?? 0,
      reason: props.reason ?? '',
    });
  }

  private static validateDateFormat(date: string): void {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error('Date must be in YYYY-MM-DD format');
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

  private static validateTypeSpecificFields(
    props: UnitAvailabilityExceptionEntityCreationProps
  ): void {
    if (props.type === 'block') {
      // Block exceptions should not have time fields
      if (props.start_time !== undefined) {
        throw new Error('Block exceptions cannot have start_time');
      }
      if (props.end_time !== undefined) {
        throw new Error('Block exceptions cannot have end_time');
      }
      if (props.slot_duration_minutes !== undefined) {
        throw new Error('Block exceptions cannot have slot_duration_minutes');
      }
    } else if (props.type === 'override') {
      // Override exceptions must have time fields
      if (!props.start_time) {
        throw new Error('Override exceptions must have start_time');
      }
      if (!props.end_time) {
        throw new Error('Override exceptions must have end_time');
      }
      if (!props.slot_duration_minutes) {
        throw new Error('Override exceptions must have slot_duration_minutes');
      }

      // Validate time formats
      this.validateTimeFormat(props.start_time, 'start_time');
      this.validateTimeFormat(props.end_time, 'end_time');
      this.validateTimeRange(props.start_time, props.end_time);

      if (props.slot_duration_minutes <= 0) {
        throw new Error('slot_duration_minutes must be greater than 0');
      }
    }
  }

  // Getters

  get unit_id(): string {
    return this.props.unit_id;
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

  // Update methods

  update_override_times(
    start_time: string,
    end_time: string,
    slot_duration_minutes: number
  ): void {
    if (this.props.type !== 'override') {
      throw new Error('Can only update times for override exceptions');
    }

    UnitAvailabilityExceptionEntity.validateTimeFormat(start_time, 'start_time');
    UnitAvailabilityExceptionEntity.validateTimeFormat(end_time, 'end_time');
    UnitAvailabilityExceptionEntity.validateTimeRange(start_time, end_time);

    if (slot_duration_minutes <= 0) {
      throw new Error('slot_duration_minutes must be greater than 0');
    }

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
