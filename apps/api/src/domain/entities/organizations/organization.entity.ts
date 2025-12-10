import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from '../base.entity';
import { InvalidBusinessNameError, InvalidBrandColorError } from '@/domain/errors/organizations/organization.errors';

type SubscriptionPlan = 'free' | 'pro' | 'enterprise';
type SubscriptionStatus = 'active' | 'inactive' | 'suspended';

interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  expiresAt?: Date;
}

type OrganizationEntityOwnProps = {
  businessName: string;
  brandColor: string;
  ownerId: string;
  subscription?: Subscription;
};

type OrganizationEntityCreationProps = OrganizationEntityOwnProps & BaseEntityCreationProps;
type OrganizationEntityProps = Required<Omit<OrganizationEntityOwnProps, 'subscription'>> & {
  subscription?: Subscription;
} & BaseEntityProps;

export class OrganizationEntity extends BaseEntity<OrganizationEntityProps> {
  protected prefix(): string {
    return 'org';
  }

  constructor(props: OrganizationEntityCreationProps) {
    OrganizationEntity.validateBusinessName(props.businessName);
    OrganizationEntity.validateBrandColor(props.brandColor);

    super(props);
  }

  private static validateBusinessName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidBusinessNameError('Business name cannot be empty');
    }

    if (name.length < 2) {
      throw new InvalidBusinessNameError('Business name must have at least 2 characters');
    }

    if (name.length > 100) {
      throw new InvalidBusinessNameError('Business name must have at most 100 characters');
    }
  }

  private static validateBrandColor(color: string): void {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(color)) {
      throw new InvalidBrandColorError('Brand color must be a valid hex color (e.g., #FF0000)');
    }
  }

  get businessName(): string {
    return this.props.businessName;
  }

  get brandColor(): string {
    return this.props.brandColor;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get subscription(): Subscription | undefined {
    return this.props.subscription;
  }

  update_business_name(newName: string): void {
    OrganizationEntity.validateBusinessName(newName);
    this.props.businessName = newName;
    this.touch();
  }

  update_brand_color(newColor: string): void {
    OrganizationEntity.validateBrandColor(newColor);
    this.props.brandColor = newColor;
    this.touch();
  }

  update_subscription(subscription: Subscription): void {
    this.props.subscription = subscription;
    this.touch();
  }

  has_active_subscription(): boolean {
    return this.props.subscription?.status === 'active';
  }

  is_subscription_expired(): boolean {
    if (!this.props.subscription || !this.props.subscription.expiresAt) {
      return false;
    }

    return this.props.subscription.expiresAt < new Date();
  }
}
