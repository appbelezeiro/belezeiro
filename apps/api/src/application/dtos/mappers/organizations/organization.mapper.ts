import { OrganizationEntity } from '@/domain/entities/organizations/organization.entity';
import { OrganizationDTO, OrganizationSummaryDTO } from '../../organizations/organization.dto';

export class OrganizationMapper {
  static toDTO(entity: OrganizationEntity): OrganizationDTO {
    return {
      id: entity.id,
      name: entity.name,
      ownerId: entity.ownerId,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }

  static toSummary(entity: OrganizationEntity): OrganizationSummaryDTO {
    return {
      id: entity.id,
      name: entity.name,
    };
  }

  static toDTOList(entities: OrganizationEntity[]): OrganizationDTO[] {
    return entities.map(this.toDTO);
  }

  static toSummaryList(entities: OrganizationEntity[]): OrganizationSummaryDTO[] {
    return entities.map(this.toSummary);
  }
}
