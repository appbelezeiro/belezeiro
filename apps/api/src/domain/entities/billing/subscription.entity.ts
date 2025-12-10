import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from '../base.entity';
import { RenewalInterval } from './plan.entity';
import {
  SubscriptionAlreadyActiveError,
  SubscriptionAlreadyCanceledError,
  SubscriptionCannotBeReactivatedError,
  SubscriptionInvalidStatusError,
} from '@/domain/errors/billing/subscription.errors';

export enum SubscriptionStatus {
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
}

type SubscriptionEntityOwnProps = {
  unit_id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  start_date: Date;
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  canceled_at?: Date;
  trial_end?: Date;
  renewal_interval: RenewalInterval;
  discount_id?: string;
  provider_subscription_id?: string;
  metadata?: Record<string, any>;
};

type SubscriptionEntityCreationProps = Omit<
  SubscriptionEntityOwnProps,
  'cancel_at_period_end' | 'status'
> &
  Partial<Pick<SubscriptionEntityOwnProps, 'cancel_at_period_end' | 'status'>> &
  BaseEntityCreationProps;

type SubscriptionEntityProps = Required<SubscriptionEntityOwnProps> & BaseEntityProps;

export class SubscriptionEntity extends BaseEntity<SubscriptionEntityProps> {
  protected prefix(): string {
    return 'sub';
  }

  constructor(props: SubscriptionEntityCreationProps) {
    super({
      ...props,
      cancel_at_period_end: props.cancel_at_period_end ?? false,
      status: props.status ?? SubscriptionStatus.INCOMPLETE,
      canceled_at: props.canceled_at,
      trial_end: props.trial_end,
      discount_id: props.discount_id,
      provider_subscription_id: props.provider_subscription_id,
      metadata: props.metadata,
    });
  }

  get unit_id(): string {
    return this.props.unit_id;
  }

  get user_id(): string {
    return this.props.user_id;
  }

  get plan_id(): string {
    return this.props.plan_id;
  }

  get status(): SubscriptionStatus {
    return this.props.status;
  }

  get start_date(): Date {
    return this.props.start_date;
  }

  get current_period_start(): Date {
    return this.props.current_period_start;
  }

  get current_period_end(): Date {
    return this.props.current_period_end;
  }

  get cancel_at_period_end(): boolean {
    return this.props.cancel_at_period_end;
  }

  get canceled_at(): Date | undefined {
    return this.props.canceled_at;
  }

  get trial_end(): Date | undefined {
    return this.props.trial_end;
  }

  get renewal_interval(): RenewalInterval {
    return this.props.renewal_interval;
  }

  get discount_id(): string | undefined {
    return this.props.discount_id;
  }

  get provider_subscription_id(): string | undefined {
    return this.props.provider_subscription_id;
  }

  get metadata(): Record<string, any> | undefined {
    return this.props.metadata;
  }

  activate(): void {
    if (this.props.status === SubscriptionStatus.ACTIVE) {
      throw new SubscriptionAlreadyActiveError('Subscription is already active');
    }

    this.props.status = SubscriptionStatus.ACTIVE;
    this.props.cancel_at_period_end = false;
    this.props.canceled_at = undefined;
    this.touch();
  }

  cancel(immediate: boolean): void {
    if (
      this.props.status === SubscriptionStatus.CANCELED ||
      this.props.status === SubscriptionStatus.EXPIRED
    ) {
      throw new SubscriptionAlreadyCanceledError('Subscription is already canceled');
    }

    if (immediate) {
      this.props.status = SubscriptionStatus.CANCELED;
      this.props.canceled_at = new Date();
    } else {
      this.props.cancel_at_period_end = true;
    }

    this.touch();
  }

  reactivate(): void {
    if (!this.can_be_reactivated()) {
      throw new SubscriptionCannotBeReactivatedError(
        'Subscription cannot be reactivated in current status',
      );
    }

    this.props.status = SubscriptionStatus.ACTIVE;
    this.props.cancel_at_period_end = false;
    this.props.canceled_at = undefined;
    this.touch();
  }

  mark_as_past_due(): void {
    this.props.status = SubscriptionStatus.PAST_DUE;
    this.touch();
  }

  mark_as_unpaid(): void {
    this.props.status = SubscriptionStatus.UNPAID;
    this.touch();
  }

  mark_as_expired(): void {
    this.props.status = SubscriptionStatus.EXPIRED;
    this.touch();
  }

  mark_as_trialing(): void {
    this.props.status = SubscriptionStatus.TRIALING;
    this.touch();
  }

  update_status(status: SubscriptionStatus): void {
    this.props.status = status;
    this.touch();
  }

  update_period(start: Date, end: Date): void {
    if (start >= end) {
      throw new SubscriptionInvalidStatusError('Start date must be before end date');
    }

    this.props.current_period_start = start;
    this.props.current_period_end = end;
    this.touch();
  }

  apply_discount(discount_id: string): void {
    this.props.discount_id = discount_id;
    this.touch();
  }

  remove_discount(): void {
    this.props.discount_id = undefined;
    this.touch();
  }

  extend_trial(days: number): void {
    if (days < 0) {
      throw new SubscriptionInvalidStatusError('Trial extension days cannot be negative');
    }

    const current_trial_end = this.props.trial_end ?? new Date();
    const new_trial_end = new Date(current_trial_end);
    new_trial_end.setDate(new_trial_end.getDate() + days);

    this.props.trial_end = new_trial_end;
    this.touch();
  }

  update_provider_subscription_id(provider_id: string): void {
    this.props.provider_subscription_id = provider_id;
    this.touch();
  }

  update_plan(plan_id: string): void {
    this.props.plan_id = plan_id;
    this.touch();
  }

  is_active(): boolean {
    return (
      this.props.status === SubscriptionStatus.ACTIVE ||
      this.props.status === SubscriptionStatus.TRIALING
    );
  }

  is_in_trial(): boolean {
    if (!this.props.trial_end) {
      return false;
    }

    return (
      this.props.status === SubscriptionStatus.TRIALING && this.props.trial_end > new Date()
    );
  }

  has_expired(): boolean {
    return this.props.status === SubscriptionStatus.EXPIRED;
  }

  can_access_features(): boolean {
    return (
      this.props.status === SubscriptionStatus.ACTIVE ||
      this.props.status === SubscriptionStatus.TRIALING
    );
  }

  can_be_reactivated(): boolean {
    return (
      this.props.status === SubscriptionStatus.CANCELED &&
      this.props.current_period_end > new Date()
    );
  }

  is_past_due(): boolean {
    return this.props.status === SubscriptionStatus.PAST_DUE;
  }

  is_unpaid(): boolean {
    return this.props.status === SubscriptionStatus.UNPAID;
  }
}
