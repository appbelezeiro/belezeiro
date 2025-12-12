import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from '../base.entity';

type CustomerEntityOwnProps = {
  userId: string;
  unitId: string;
  notes?: string;
};

type CustomerEntityCreationProps = CustomerEntityOwnProps & BaseEntityCreationProps;

type CustomerEntityProps = CustomerEntityOwnProps & BaseEntityProps;

export class CustomerEntity extends BaseEntity<CustomerEntityProps> {
  protected prefix(): string {
    return 'cust';
  }

  constructor(props: CustomerEntityCreationProps) {
    super(props);
  }

  get userId(): string {
    return this.props.userId;
  }

  get unitId(): string {
    return this.props.unitId;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  update_notes(notes: string | undefined): void {
    this.props.notes = notes;
    this.touch();
  }
}
