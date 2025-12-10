import { OrganizationEntity } from '@/domain/entities/organization.entity';
import { OrganizationDTO, OrganizationSummaryDTO } from '../organization.dto';

export class OrganizationMapper {
  static toDTO(entity: OrganizationEntity): OrganizationDTO {
    return {
      id: entity.id,
      businessName: entity.businessName,
      brandColor: entity.brandColor,
      ownerId: entity.ownerId,
      subscription: entity.subscription,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }

  static toSummary(entity: OrganizationEntity): OrganizationSummaryDTO {
    return {
      id: entity.id,
      businessName: entity.businessName,
      brandColor: entity.brandColor,
    };
  }

  static toDTOList(entities: OrganizationEntity[]): OrganizationDTO[] {
    return entities.map(this.toDTO);
  }

  static toSummaryList(entities: OrganizationEntity[]): OrganizationSummaryDTO[] {
    return entities.map(this.toSummary);
  }
}
