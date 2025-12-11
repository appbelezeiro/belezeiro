import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from './base.entity';

type UnitServiceEntityOwnProps = {
  unit_id: string;
  service_id: string;
  custom_price_cents?: number;
  custom_duration_minutes?: number;
  is_active: boolean;
};

type UnitServiceEntityCreationProps = Omit<UnitServiceEntityOwnProps, 'is_active'> &
  Partial<Pick<UnitServiceEntityOwnProps, 'is_active'>> &
  BaseEntityCreationProps;

type UnitServiceEntityProps = Required<UnitServiceEntityOwnProps> & BaseEntityProps;

export class UnitServiceEntity extends BaseEntity<UnitServiceEntityProps> {
  protected prefix(): string {
    return 'usv';
  }

  constructor(props: UnitServiceEntityCreationProps) {
    super({
      ...props,
      is_active: props.is_active ?? true,
    });
  }

  // Getters
  get unit_id(): string {
    return this.props.unit_id;
  }

  get service_id(): string {
    return this.props.service_id;
  }

  get custom_price_cents(): number | undefined {
    return this.props.custom_price_cents;
  }

  get custom_duration_minutes(): number | undefined {
    return this.props.custom_duration_minutes;
  }

  get is_active(): boolean {
    return this.props.is_active;
  }

  // Methods
  update_custom_price(cents: number | undefined): void {
    if (cents !== undefined && cents < 0) {
      throw new Error('Price cannot be negative');
    }
    this.props.custom_price_cents = cents;
    this.touch();
  }

  update_custom_duration(minutes: number | undefined): void {
    if (minutes !== undefined && minutes <= 0) {
      throw new Error('Duration must be greater than 0');
    }
    this.props.custom_duration_minutes = minutes;
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
