import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from './base.entity';

type UnitAmenityEntityOwnProps = {
  unit_id: string;
  amenity_id: string;
};

type UnitAmenityEntityCreationProps = UnitAmenityEntityOwnProps & BaseEntityCreationProps;

type UnitAmenityEntityProps = Required<UnitAmenityEntityOwnProps> & BaseEntityProps;

export class UnitAmenityEntity extends BaseEntity<UnitAmenityEntityProps> {
  protected prefix(): string {
    return 'uam';
  }

  constructor(props: UnitAmenityEntityCreationProps) {
    super(props);
  }

  // Getters
  get unit_id(): string {
    return this.props.unit_id;
  }

  get amenity_id(): string {
    return this.props.amenity_id;
  }
}
