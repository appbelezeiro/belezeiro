import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from './base.entity';
import { PlanInvalidPriceError } from '@/domain/errors/plan.errors';

export enum RenewalInterval {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  CUSTOM = 'custom',
}

export type PlanFeatures = {
  advanced_booking: boolean;
  custom_branding: boolean;
  analytics: boolean;
  api_access: boolean;
  priority_support: boolean;
  custom_integrations: boolean;
};

export type PlanLimits = {
  max_bookings_per_month: number;
  max_concurrent_bookings: number;
  max_booking_rules: number;
  max_team_members: number;
  max_locations: number;
};

type PlanEntityOwnProps = {
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval: RenewalInterval;
  features: PlanFeatures;
  limits: PlanLimits;
  trial_days?: number;
  is_active: boolean;
  metadata?: Record<string, any>;
};

type PlanEntityCreationProps = Omit<PlanEntityOwnProps, 'is_active'> &
  Partial<Pick<PlanEntityOwnProps, 'is_active'>> &
  BaseEntityCreationProps;

type PlanEntityProps = Required<PlanEntityOwnProps> & BaseEntityProps;

export class PlanEntity extends BaseEntity<PlanEntityProps> {
  protected prefix(): string {
    return 'plan';
  }

  constructor(props: PlanEntityCreationProps) {
    super({
      ...props,
      is_active: props.is_active ?? true,
      description: props.description,
      trial_days: props.trial_days,
      metadata: props.metadata,
    });

    this.validate_price();
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get price(): number {
    return this.props.price;
  }

  get currency(): string {
    return this.props.currency;
  }

  get interval(): RenewalInterval {
    return this.props.interval;
  }

  get features(): PlanFeatures {
    return this.props.features;
  }

  get limits(): PlanLimits {
    return this.props.limits;
  }

  get trial_days(): number | undefined {
    return this.props.trial_days;
  }

  get is_active(): boolean {
    return this.props.is_active;
  }

  get metadata(): Record<string, any> | undefined {
    return this.props.metadata;
  }

  activate(): void {
    this.props.is_active = true;
    this.touch();
  }

  deactivate(): void {
    this.props.is_active = false;
    this.touch();
  }

  update_price(new_price: number): void {
    if (new_price < 0) {
      throw new PlanInvalidPriceError('Price cannot be negative');
    }
    this.props.price = new_price;
    this.touch();
  }

  update_limits(new_limits: Partial<PlanLimits>): void {
    this.props.limits = {
      ...this.props.limits,
      ...new_limits,
    };
    this.touch();
  }

  update_features(new_features: Partial<PlanFeatures>): void {
    this.props.features = {
      ...this.props.features,
      ...new_features,
    };
    this.touch();
  }

  has_feature(feature: keyof PlanFeatures): boolean {
    return this.props.features[feature] === true;
  }

  get_limit(limit: keyof PlanLimits): number {
    return this.props.limits[limit];
  }

  update_trial_days(days: number): void {
    if (days < 0) {
      throw new PlanInvalidPriceError('Trial days cannot be negative');
    }
    this.props.trial_days = days;
    this.touch();
  }

  private validate_price(): void {
    if (this.props.price < 0) {
      throw new PlanInvalidPriceError('Price cannot be negative');
    }
  }
}
