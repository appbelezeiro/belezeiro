import { UnitEntity } from '@/domain/entities/unit.entity';

export interface IUnitRepository {
  create(entity: UnitEntity): Promise<UnitEntity>;
  find_by_id(id: string): Promise<UnitEntity | null>;
  find_by_organization_id(organizationId: string): Promise<UnitEntity[]>;
  list_all(): Promise<UnitEntity[]>;
  list_active(): Promise<UnitEntity[]>;
  update(entity: UnitEntity): Promise<UnitEntity>;
  delete(id: string): Promise<boolean>;
}
