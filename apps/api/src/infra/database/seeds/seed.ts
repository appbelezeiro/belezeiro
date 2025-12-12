import { prisma } from '@/infra/clients/prisma-client';
import { SpecialtyEntity } from '@/domain/entities/specialty.entity';
import { ServiceEntity } from '@/domain/entities/service.entity';
import { AmenityEntity } from '@/domain/entities/amenity.entity';
import { SpecialtyDataMapper } from '@/infra/repositories/prisma/data-mappers/specialty.data-mapper';
import { ServiceDataMapper } from '@/infra/repositories/prisma/data-mappers/service.data-mapper';
import { AmenityDataMapper } from '@/infra/repositories/prisma/data-mappers/amenity.data-mapper';
import { SPECIALTY_SEEDS } from './specialty-seeds';
import { SERVICE_SEEDS } from './service-seeds';
import { AMENITY_SEEDS } from './amenity-seeds';

export async function runSeeds(): Promise<void> {
  console.log('🌱 Starting database seeds...');

  // Seed specialties (batch upsert)
  console.log('  → Seeding specialties...');
  const specialtyUpserts = SPECIALTY_SEEDS.map((seed) => {
    const entity = new SpecialtyEntity({
      id: seed.id,
      code: seed.code,
      name: seed.name,
      description: seed.description,
      icon: seed.icon,
      is_predefined: seed.is_predefined,
      is_active: seed.is_active,
    });
    const data = SpecialtyDataMapper.toPrismaCreate(entity);

    return prisma.specialty.upsert({
      where: { code: seed.code },
      create: data,
      update: { id: seed.id }, // Ensure ID matches seed
    });
  });
  await Promise.all(specialtyUpserts);
  console.log(`  ✓ Upserted ${SPECIALTY_SEEDS.length} specialties`);

  // Seed services (batch upsert)
  console.log('  → Seeding services...');
  const serviceUpserts = SERVICE_SEEDS.map((seed) => {
    const entity = new ServiceEntity({
      id: seed.id,
      specialty_id: seed.specialty_id,
      code: seed.code,
      name: seed.name,
      description: seed.description,
      default_duration_minutes: seed.default_duration_minutes,
      default_price_cents: seed.default_price_cents,
      is_predefined: seed.is_predefined,
      is_active: seed.is_active,
    });
    const data = ServiceDataMapper.toPrismaCreate(entity);

    return prisma.service.upsert({
      where: { code: seed.code },
      create: data,
      update: { id: seed.id, specialty_id: seed.specialty_id },
    });
  });
  await Promise.all(serviceUpserts);
  console.log(`  ✓ Upserted ${SERVICE_SEEDS.length} services`);

  // Seed amenities (batch upsert)
  console.log('  → Seeding amenities...');
  const amenityUpserts = AMENITY_SEEDS.map((seed) => {
    const entity = new AmenityEntity({
      id: seed.id,
      code: seed.code,
      name: seed.name,
      description: seed.description,
      icon: seed.icon,
      is_predefined: seed.is_predefined,
      is_active: seed.is_active,
    });
    const data = AmenityDataMapper.toPrismaCreate(entity);

    return prisma.amenity.upsert({
      where: { code: seed.code },
      create: data,
      update: { id: seed.id },
    });
  });
  await Promise.all(amenityUpserts);
  console.log(`  ✓ Upserted ${AMENITY_SEEDS.length} amenities`);

  console.log('🌱 Database seeding completed!\n');
}
