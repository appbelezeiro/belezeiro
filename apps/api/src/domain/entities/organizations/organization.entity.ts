import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from '../base.entity';
import { InvalidBusinessNameError } from '@/domain/errors/organizations/organization.errors';

type OrganizationEntityOwnProps = {
  businessName: string;
  ownerId: string;
};

type OrganizationEntityCreationProps = OrganizationEntityOwnProps & BaseEntityCreationProps;
type OrganizationEntityProps = Required<OrganizationEntityOwnProps> & BaseEntityProps;

export class OrganizationEntity extends BaseEntity<OrganizationEntityProps> {
  protected prefix(): string {
    return 'org';
  }

  constructor(props: OrganizationEntityCreationProps) {
    OrganizationEntity.validateBusinessName(props.businessName);

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

  get businessName(): string {
    return this.props.businessName;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  update_business_name(newName: string): void {
    OrganizationEntity.validateBusinessName(newName);
    this.props.businessName = newName;
    this.touch();
  }
}
