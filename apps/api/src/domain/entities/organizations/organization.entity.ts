import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from '../base.entity';
import { InvalidBusinessNameError } from '@/domain/errors/organizations/organization.errors';

type OrganizationEntityOwnProps = {
  name: string;
  ownerId: string;
};

type OrganizationEntityCreationProps = OrganizationEntityOwnProps & BaseEntityCreationProps;
type OrganizationEntityProps = Required<OrganizationEntityOwnProps> & BaseEntityProps;

export class OrganizationEntity extends BaseEntity<OrganizationEntityProps> {
  protected prefix(): string {
    return 'org';
  }

  constructor(props: OrganizationEntityCreationProps) {
    OrganizationEntity.validateBusinessName(props.name);

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

  get name(): string {
    return this.props.name;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  update_name(newName: string): void {
    OrganizationEntity.validateBusinessName(newName);
    this.props.name = newName;
    this.touch();
  }
}
