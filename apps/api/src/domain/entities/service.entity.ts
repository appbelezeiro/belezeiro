import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from './base.entity';

type ServiceEntityOwnProps = {
  specialty_id: string;
  code: string;
  name: string;
  description: string | undefined;
  default_duration_minutes: number;
  default_price_cents: number;
  is_predefined: boolean;
  is_active: boolean;
};

type ServiceEntityCreationProps = Omit<ServiceEntityOwnProps, 'is_active' | 'description'> &
  Partial<Pick<ServiceEntityOwnProps, 'is_active'>> &
  { description?: string } &
  BaseEntityCreationProps;

type ServiceEntityProps = ServiceEntityOwnProps & BaseEntityProps;

export class ServiceEntity extends BaseEntity<ServiceEntityProps> {
  protected prefix(): string {
    return 'serv';
  }

  constructor(props: ServiceEntityCreationProps) {
    super({
      ...props,
      description: props.description,
      is_active: props.is_active ?? true,
    });
  }

  // Getters
  get specialty_id(): string {
    return this.props.specialty_id;
  }

  get code(): string {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get default_duration_minutes(): number {
    return this.props.default_duration_minutes;
  }

  get default_price_cents(): number {
    return this.props.default_price_cents;
  }

  get is_predefined(): boolean {
    return this.props.is_predefined;
  }

  get is_active(): boolean {
    return this.props.is_active;
  }

  // Methods
  update_name(name: string): void {
    this.props.name = name;
    this.touch();
  }

  update_description(description: string | undefined): void {
    this.props.description = description;
    this.touch();
  }

  update_default_duration(minutes: number): void {
    if (minutes <= 0) {
      throw new Error('Duration must be greater than 0');
    }
    this.props.default_duration_minutes = minutes;
    this.touch();
  }

  update_default_price(cents: number): void {
    if (cents < 0) {
      throw new Error('Price cannot be negative');
    }
    this.props.default_price_cents = cents;
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
