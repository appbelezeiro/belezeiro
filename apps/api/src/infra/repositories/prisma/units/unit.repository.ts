import { IUnitRepository } from '@/application/contracts/units/i-unit-repository.interface.js';
import { UnitEntity } from '@/domain/entities/units/unit.entity.js';
import { UnitSpecialtyEntity } from '@/domain/entities/unit-specialty.entity.js';
import { UnitServiceEntity } from '@/domain/entities/unit-service.entity.js';
import { UnitAmenityEntity } from '@/domain/entities/unit-amenity.entity.js';
import { prisma } from '@/infra/clients/prisma-client.js';
import { UnitDataMapper, UnitWithRelations } from '../data-mappers/unit.data-mapper.js';
import { UnitSpecialtyDataMapper } from '../data-mappers/unit-specialty.data-mapper.js';
import { UnitServiceDataMapper } from '../data-mappers/unit-service.data-mapper.js';
import { UnitAmenityDataMapper } from '../data-mappers/unit-amenity.data-mapper.js';

const unitInclude = {
  address: true,
  phones: true,
  unit_specialties: { include: { specialty: true } },
  unit_services: { include: { service: true } },
  unit_amenities: { include: { amenity: true } },
} as const;

export class PrismaUnitRepository implements IUnitRepository {
  async create(entity: UnitEntity): Promise<UnitEntity> {
    const unitData = UnitDataMapper.toPrismaCreate(entity);

    const created = await prisma.$transaction(async (tx) => {
      // 1. Create the unit
      const unit = await tx.unit.create({
        data: unitData,
      });

      // 2. Create UnitSpecialty relations
      if (entity.especialidades.length > 0) {
        const unitSpecialties = entity.especialidades.map((specialty) => {
          const unitSpecialtyEntity = new UnitSpecialtyEntity({
            unit_id: unit.id,
            specialty_id: specialty.id,
          });
          return UnitSpecialtyDataMapper.toPrismaCreate(unitSpecialtyEntity);
        });

        await tx.unitSpecialty.createMany({
          data: unitSpecialties,
        });
      }

      // 3. Create UnitService relations
      if (entity.services.length > 0) {
        const unitServices = entity.services.map((service) => {
          const unitServiceEntity = new UnitServiceEntity({
            unit_id: unit.id,
            service_id: service.id,
          });
          return UnitServiceDataMapper.toPrismaCreate(unitServiceEntity);
        });

        await tx.unitService.createMany({
          data: unitServices,
        });
      }

      // 4. Create UnitAmenity relations
      if (entity.amenities.length > 0) {
        const unitAmenities = entity.amenities.map((amenity) => {
          const unitAmenityEntity = new UnitAmenityEntity({
            unit_id: unit.id,
            amenity_id: amenity.id,
          });
          return UnitAmenityDataMapper.toPrismaCreate(unitAmenityEntity);
        });

        await tx.unitAmenity.createMany({
          data: unitAmenities,
        });
      }

      // 5. Return unit with all relations
      return tx.unit.findUnique({
        where: { id: unit.id },
        include: unitInclude,
      });
    });

    return UnitDataMapper.toDomain(created as UnitWithRelations);
  }

  async find_by_id(id: string): Promise<UnitEntity | null> {
    const found = await prisma.unit.findUnique({
      where: { id },
      include: unitInclude,
    });

    return found ? UnitDataMapper.toDomain(found as UnitWithRelations) : null;
  }

  async find_by_organization_id(organizationId: string): Promise<UnitEntity[]> {
    const units = await prisma.unit.findMany({
      where: { organization_id: organizationId },
      include: unitInclude,
      orderBy: { created_at: 'desc' },
    });

    return units.map((u) => UnitDataMapper.toDomain(u as UnitWithRelations));
  }

  async list_all(): Promise<UnitEntity[]> {
    const units = await prisma.unit.findMany({
      include: unitInclude,
      orderBy: { created_at: 'desc' },
    });

    return units.map((u) => UnitDataMapper.toDomain(u as UnitWithRelations));
  }

  async list_active(): Promise<UnitEntity[]> {
    const units = await prisma.unit.findMany({
      where: { is_active: true },
      include: unitInclude,
      orderBy: { created_at: 'desc' },
    });

    return units.map((u) => UnitDataMapper.toDomain(u as UnitWithRelations));
  }

  async update(entity: UnitEntity): Promise<UnitEntity> {
    const unitData = UnitDataMapper.toPrismaUpdate(entity);

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update unit data
      await tx.unit.update({
        where: { id: entity.id },
        data: unitData,
      });

      // 2. Sync UnitSpecialty relations (delete all + recreate)
      await tx.unitSpecialty.deleteMany({
        where: { unit_id: entity.id },
      });

      if (entity.especialidades.length > 0) {
        const unitSpecialties = entity.especialidades.map((specialty) => {
          const unitSpecialtyEntity = new UnitSpecialtyEntity({
            unit_id: entity.id,
            specialty_id: specialty.id,
          });
          return UnitSpecialtyDataMapper.toPrismaCreate(unitSpecialtyEntity);
        });

        await tx.unitSpecialty.createMany({
          data: unitSpecialties,
        });
      }

      // 3. Sync UnitService relations (delete all + recreate)
      await tx.unitService.deleteMany({
        where: { unit_id: entity.id },
      });

      if (entity.services.length > 0) {
        const unitServices = entity.services.map((service) => {
          const unitServiceEntity = new UnitServiceEntity({
            unit_id: entity.id,
            service_id: service.id,
          });
          return UnitServiceDataMapper.toPrismaCreate(unitServiceEntity);
        });

        await tx.unitService.createMany({
          data: unitServices,
        });
      }

      // 4. Sync UnitAmenity relations (delete all + recreate)
      await tx.unitAmenity.deleteMany({
        where: { unit_id: entity.id },
      });

      if (entity.amenities.length > 0) {
        const unitAmenities = entity.amenities.map((amenity) => {
          const unitAmenityEntity = new UnitAmenityEntity({
            unit_id: entity.id,
            amenity_id: amenity.id,
          });
          return UnitAmenityDataMapper.toPrismaCreate(unitAmenityEntity);
        });

        await tx.unitAmenity.createMany({
          data: unitAmenities,
        });
      }

      // 5. Return unit with all relations
      return tx.unit.findUnique({
        where: { id: entity.id },
        include: unitInclude,
      });
    });

    return UnitDataMapper.toDomain(updated as UnitWithRelations);
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Cascade delete is configured in schema, so this will also delete relations
      await prisma.unit.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
