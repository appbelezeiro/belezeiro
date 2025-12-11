import { UnitAvailabilityExceptionEntity } from '@/domain/entities/units/unit-availability-exception.entity';

export interface IUnitAvailabilityExceptionRepository {
  create(
    exception: UnitAvailabilityExceptionEntity
  ): Promise<UnitAvailabilityExceptionEntity>;

  find_by_id(id: string): Promise<UnitAvailabilityExceptionEntity | null>;

  find_by_unit_id(unit_id: string): Promise<UnitAvailabilityExceptionEntity[]>;

  find_by_unit_id_and_date(
    unit_id: string,
    date: string
  ): Promise<UnitAvailabilityExceptionEntity | null>;

  find_by_unit_id_and_date_range(
    unit_id: string,
    start_date: string,
    end_date: string
  ): Promise<UnitAvailabilityExceptionEntity[]>;

  update(
    exception: UnitAvailabilityExceptionEntity
  ): Promise<UnitAvailabilityExceptionEntity>;

  delete(id: string): Promise<boolean>;

  delete_all_by_unit_id(unit_id: string): Promise<number>;
}
