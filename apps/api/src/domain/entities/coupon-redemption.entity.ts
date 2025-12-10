import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from './base.entity';

type CouponRedemptionEntityOwnProps = {
  coupon_id: string;
  user_id: string;
  subscription_id: string;
  redeemed_at: Date;
  metadata?: Record<string, any>;
};

type CouponRedemptionEntityCreationProps = Omit<
  CouponRedemptionEntityOwnProps,
  'redeemed_at'
> &
  Partial<Pick<CouponRedemptionEntityOwnProps, 'redeemed_at'>> &
  BaseEntityCreationProps;

type CouponRedemptionEntityProps = Required<CouponRedemptionEntityOwnProps> &
  BaseEntityProps;

export class CouponRedemptionEntity extends BaseEntity<CouponRedemptionEntityProps> {
  protected prefix(): string {
    return 'cred';
  }

  constructor(props: CouponRedemptionEntityCreationProps) {
    super({
      ...props,
      redeemed_at: props.redeemed_at ?? new Date(),
      metadata: props.metadata,
    });
  }

  get coupon_id(): string {
    return this.props.coupon_id;
  }

  get user_id(): string {
    return this.props.user_id;
  }

  get subscription_id(): string {
    return this.props.subscription_id;
  }

  get redeemed_at(): Date {
    return this.props.redeemed_at;
  }

  get metadata(): Record<string, any> | undefined {
    return this.props.metadata;
  }
}
