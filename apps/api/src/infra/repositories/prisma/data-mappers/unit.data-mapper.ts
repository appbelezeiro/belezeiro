import {
  Unit as PrismaUnit,
  UnitSpecialty as PrismaUnitSpecialty,
  UnitService as PrismaUnitService,
  UnitAmenity as PrismaUnitAmenity,
  Specialty as PrismaSpecialty,
  Service as PrismaService,
  Amenity as PrismaAmenity,
  Address as PrismaAddress,
  Phone as PrismaPhone,
  Prisma,
} from '@prisma/client';
import { UnitEntity } from '@/domain/entities/units/unit.entity.js';
import { UnitServiceType } from '@/domain/entities/units/unit.entity.types.js';
import { SpecialtyEntity } from '@/domain/entities/specialty.entity.js';
import { ServiceEntity } from '@/domain/entities/service.entity.js';
import { AmenityEntity } from '@/domain/entities/amenity.entity.js';
import { SpecialtyDataMapper } from './specialty.data-mapper.js';
import { ServiceDataMapper } from './service.data-mapper.js';
import { AmenityDataMapper } from './amenity.data-mapper.js';
import { AddressProps } from '@/domain/value-objects/address.value-object.js';
import { PhoneProps } from '@/domain/value-objects/phone.value-object.js';
import { randomUUID } from 'crypto';

type UnitPreferences = {
  palletColor?: string;
};

export type UnitWithRelations = PrismaUnit & {
  address: PrismaAddress | null;
  phones: PrismaPhone[];
  unit_specialties: (PrismaUnitSpecialty & { specialty: PrismaSpecialty })[];
  unit_services: (PrismaUnitService & { service: PrismaService })[];
  unit_amenities: (PrismaUnitAmenity & { amenity: PrismaAmenity })[];
};

export type UnitCreateData = Prisma.UnitCreateInput;
export type UnitUpdateData = Prisma.UnitUpdateInput;

export class UnitDataMapper {
  static toDomain(raw: UnitWithRelations): UnitEntity {
    const especialidades: SpecialtyEntity[] = raw.unit_specialties.map((us) =>
      SpecialtyDataMapper.toDomain(us.specialty)
    );

    const services: ServiceEntity[] = raw.unit_services.map((us) =>
      ServiceDataMapper.toDomain(us.service)
    );

    const amenities: AmenityEntity[] = raw.unit_amenities.map((ua) =>
      AmenityDataMapper.toDomain(ua.amenity)
    );

    const preferences = (raw.preferences as UnitPreferences) ?? {};

    // Convert Prisma Address to AddressProps
    const address: AddressProps | undefined = raw.address
      ? {
          id: raw.address.id,
          street: raw.address.street,
          number: raw.address.number,
          neighborhood: raw.address.neighborhood,
          city: raw.address.city,
          state: raw.address.state,
          zipcode: raw.address.zipcode,
          country: raw.address.country,
          complement: raw.address.complement ?? undefined,
          reference: raw.address.reference ?? undefined,
          latitude: raw.address.latitude ?? undefined,
          longitude: raw.address.longitude ?? undefined,
          unit_id: raw.address.unit_id ?? undefined,
          user_id: raw.address.user_id ?? undefined,
        }
      : undefined;

    // Convert Prisma Phones to PhoneProps[]
    const phones: PhoneProps[] = raw.phones.map((p) => ({
      id: p.id,
      country_code: p.country_code,
      area_code: p.area_code,
      number: p.number,
      label: p.label ?? undefined,
      is_whatsapp: p.is_whatsapp,
      is_verified: p.is_verified,
    }));

    return new UnitEntity({
      id: raw.id,
      orgId: raw.organization_id,
      name: raw.name,
      logo: raw.logo ?? '',
      gallery: raw.gallery,
      active: raw.is_active,
      phones,
      address,
      preferences,
      serviceType: raw.service_type as UnitServiceType,
      especialidades,
      services,
      amenities,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrismaUpdate(entity: UnitEntity): UnitUpdateData {
    const address = entity.address;
    const phones = entity.phones;

    return {
      id: entity.id,
      organization: {
        connect: { id: entity.orgId },
      },
      name: entity.name,
      logo: entity.logo?.URL ?? null,
      gallery: entity.gallery.map((g) => g.URL),
      is_active: entity.active,
      preferences: entity.preferences as Prisma.InputJsonValue,
      service_type: entity.serviceType,
      // Address: upsert if exists, delete if undefined
      address: address
        ? {
            upsert: {
              create: {
                id: address.id ?? randomUUID(),
                street: address.street,
                number: address.number,
                neighborhood: address.neighborhood,
                city: address.city,
                state: address.state,
                zipcode: address.zipcode,
                country: address.country,
                complement: address.complement ?? null,
                reference: address.reference ?? null,
                latitude: address.latitude ?? null,
                longitude: address.longitude ?? null,
              },
              update: {
                street: address.street,
                number: address.number,
                neighborhood: address.neighborhood,
                city: address.city,
                state: address.state,
                zipcode: address.zipcode,
                country: address.country,
                complement: address.complement ?? null,
                reference: address.reference ?? null,
                latitude: address.latitude ?? null,
                longitude: address.longitude ?? null,
              },
            },
          }
        : { delete: true },
      // Phones: delete all and recreate
      phones: {
        deleteMany: {},
        create: phones.map((p) => ({
          id: p.id ?? randomUUID(),
          country_code: p.country_code,
          area_code: p.area_code,
          number: p.number,
          label: p.label ?? null,
          is_whatsapp: p.is_whatsapp,
          is_verified: p.is_verified,
        })),
      },
    };
  }

  static toPrismaCreate(entity: UnitEntity): UnitCreateData {
    const address = entity.address;
    const phones = entity.phones;

    return {
      id: entity.id,
      organization: {
        connect: { id: entity.orgId },
      },
      name: entity.name,
      logo: entity.logo?.URL ?? null,
      gallery: entity.gallery.map((g) => g.URL),
      is_active: entity.active,
      preferences: entity.preferences as Prisma.InputJsonValue,
      service_type: entity.serviceType,
      created_at: entity.created_at,
      // Address: create if exists
      address: address
        ? {
            create: {
              id: address.id ?? randomUUID(),
              street: address.street,
              number: address.number,
              neighborhood: address.neighborhood,
              city: address.city,
              state: address.state,
              zipcode: address.zipcode,
              country: address.country,
              complement: address.complement ?? null,
              reference: address.reference ?? null,
              latitude: address.latitude ?? null,
              longitude: address.longitude ?? null,
            },
          }
        : undefined,
      // Phones: create all
      phones: {
        create: phones.map((p) => ({
          id: p.id ?? randomUUID(),
          country_code: p.country_code,
          area_code: p.area_code,
          number: p.number,
          label: p.label ?? null,
          is_whatsapp: p.is_whatsapp,
          is_verified: p.is_verified,
        })),
      },
    };
  }

  static extractSpecialtyIds(entity: UnitEntity): string[] {
    return entity.especialidades.map((e) => e.id);
  }

  static extractServiceIds(entity: UnitEntity): string[] {
    return entity.services.map((s) => s.id);
  }

  static extractAmenityIds(entity: UnitEntity): string[] {
    return entity.amenities.map((a) => a.id);
  }
}
