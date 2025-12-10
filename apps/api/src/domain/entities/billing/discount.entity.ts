import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from '../base.entity';
import {
  DiscountExpiredError,
  DiscountMaxRedemptionsReachedError,
  DiscountNotValidForUserError,
  DiscountNotActiveError,
} from '@/domain/errors/billing/discount.errors';

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
  FREE_PERIOD = 'free_period',
}

export enum DiscountDuration {
  ONCE = 'once',
  REPEATING = 'repeating',
  FOREVER = 'forever',
}

type DiscountEntityOwnProps = {
  code: string;
  type: DiscountType;
  value: number;
  duration: DiscountDuration;
  repeating_count?: number;
  assigned_to_user_id?: string;
  max_redemptions?: number;
  redemptions_count: number;
  expires_at?: Date;
  is_active: boolean;
  metadata?: Record<string, any>;
};

type DiscountEntityCreationProps = Omit<
  DiscountEntityOwnProps,
  'redemptions_count' | 'is_active'
> &
  Partial<Pick<DiscountEntityOwnProps, 'redemptions_count' | 'is_active'>> &
  BaseEntityCreationProps;

type DiscountEntityProps = Omit<
  DiscountEntityOwnProps,
  'repeating_count' | 'assigned_to_user_id' | 'max_redemptions' | 'expires_at' | 'metadata'
> &
  Required<Pick<DiscountEntityOwnProps, 'redemptions_count' | 'is_active'>> &
  Pick<DiscountEntityOwnProps, 'repeating_count' | 'assigned_to_user_id' | 'max_redemptions' | 'expires_at' | 'metadata'> &
  BaseEntityProps;

export class DiscountEntity extends BaseEntity<DiscountEntityProps> {
  protected prefix(): string {
    return 'disc';
  }

  constructor(props: DiscountEntityCreationProps) {
    super({
      ...props,
      redemptions_count: props.redemptions_count ?? 0,
      is_active: props.is_active ?? true,
      repeating_count: props.repeating_count,
      assigned_to_user_id: props.assigned_to_user_id,
      max_redemptions: props.max_redemptions,
      expires_at: props.expires_at,
      metadata: props.metadata,
    });

    this.validate_discount();
  }

  get code(): string {
    return this.props.code;
  }

  get type(): DiscountType {
    return this.props.type;
  }

  get value(): number {
    return this.props.value;
  }

  get duration(): DiscountDuration {
    return this.props.duration;
  }

  get repeating_count(): number | undefined {
    return this.props.repeating_count;
  }

  get assigned_to_user_id(): string | undefined {
    return this.props.assigned_to_user_id;
  }

  get max_redemptions(): number | undefined {
    return this.props.max_redemptions;
  }

  get redemptions_count(): number {
    return this.props.redemptions_count;
  }

  get expires_at(): Date | undefined {
    return this.props.expires_at;
  }

  get is_active(): boolean {
    return this.props.is_active;
  }

  get metadata(): Record<string, any> | undefined {
    return this.props.metadata;
  }

  redeem(): void {
    if (!this.is_active) {
      throw new DiscountNotActiveError('Discount is not active');
    }

    if (this.is_expired()) {
      throw new DiscountExpiredError('Discount has expired');
    }

    if (!this.can_be_redeemed()) {
      throw new DiscountMaxRedemptionsReachedError('Maximum redemptions reached');
    }

    this.props.redemptions_count += 1;
    this.touch();
  }

  can_be_redeemed(): boolean {
    if (!this.props.is_active) {
      return false;
    }

    if (this.is_expired()) {
      return false;
    }

    if (
      this.props.max_redemptions !== undefined &&
      this.props.redemptions_count >= this.props.max_redemptions
    ) {
      return false;
    }

    return true;
  }

  is_expired(): boolean {
    if (!this.props.expires_at) {
      return false;
    }

    return this.props.expires_at < new Date();
  }

  is_valid_for_user(user_id: string): boolean {
    if (!this.props.is_active) {
      return false;
    }

    if (this.is_expired()) {
      return false;
    }

    if (!this.can_be_redeemed()) {
      return false;
    }

    if (this.props.assigned_to_user_id) {
      return this.props.assigned_to_user_id === user_id;
    }

    return true;
  }

  validate_for_user(user_id: string): void {
    if (!this.is_valid_for_user(user_id)) {
      if (this.props.assigned_to_user_id && this.props.assigned_to_user_id !== user_id) {
        throw new DiscountNotValidForUserError('Discount is not assigned to this user');
      }

      if (!this.props.is_active) {
        throw new DiscountNotActiveError('Discount is not active');
      }

      if (this.is_expired()) {
        throw new DiscountExpiredError('Discount has expired');
      }

      if (!this.can_be_redeemed()) {
        throw new DiscountMaxRedemptionsReachedError('Maximum redemptions reached');
      }
    }
  }

  deactivate(): void {
    this.props.is_active = false;
    this.touch();
  }

  activate(): void {
    this.props.is_active = true;
    this.touch();
  }

  update_max_redemptions(max: number): void {
    this.props.max_redemptions = max;
    this.touch();
  }

  update_expiration(expires_at: Date): void {
    this.props.expires_at = expires_at;
    this.touch();
  }

  private validate_discount(): void {
    if (this.props.type === DiscountType.PERCENTAGE && this.props.value > 100) {
      throw new Error('Percentage discount cannot be greater than 100');
    }

    if (this.props.type === DiscountType.PERCENTAGE && this.props.value < 0) {
      throw new Error('Percentage discount cannot be negative');
    }

    if (this.props.type === DiscountType.FIXED && this.props.value < 0) {
      throw new Error('Fixed discount cannot be negative');
    }

    if (this.props.type === DiscountType.FREE_PERIOD && this.props.value <= 0) {
      throw new Error('Free period must be positive');
    }

    if (
      this.props.duration === DiscountDuration.REPEATING &&
      (!this.props.repeating_count || this.props.repeating_count <= 0)
    ) {
      throw new Error('Repeating discount must have a positive repeating count');
    }
  }
}
