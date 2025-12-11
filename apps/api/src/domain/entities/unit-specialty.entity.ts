import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from './base.entity';

type UnitSpecialtyEntityOwnProps = {
  unit_id: string;
  specialty_id: string;
};

type UnitSpecialtyEntityCreationProps = UnitSpecialtyEntityOwnProps & BaseEntityCreationProps;

type UnitSpecialtyEntityProps = Required<UnitSpecialtyEntityOwnProps> & BaseEntityProps;

export class UnitSpecialtyEntity extends BaseEntity<UnitSpecialtyEntityProps> {
  protected prefix(): string {
    return 'usp';
  }

  constructor(props: UnitSpecialtyEntityCreationProps) {
    super(props);
  }

  // Getters
  get unit_id(): string {
    return this.props.unit_id;
  }

  get specialty_id(): string {
    return this.props.specialty_id;
  }
}
