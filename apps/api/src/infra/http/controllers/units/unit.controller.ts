import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { z } from 'zod';
import { UnitMapper } from '@/application/dtos/mappers/units/unit.mapper';
import { UnitNotFoundError } from '@/domain/errors/units/unit.errors';
import { NotFoundError } from '../../errors/http-errors';
import type { AuthContext } from '../../middleware/auth.middleware';

const AddressSchema = z.object({
  street: z.string().min(1),
  number: z.string().min(1),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2),
  zipcode: z.string().regex(/^\d{5}-?\d{3}$/),
  country: z.string().length(2).default('BR'),
  complement: z.string().optional(),
  reference: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

const PhoneSchema = z.object({
  country_code: z.string().min(1).default('+55'),
  area_code: z.string().min(2).max(3),
  number: z.string().min(8).max(9),
  label: z.string().optional(),
  is_whatsapp: z.boolean().default(false),
  is_verified: z.boolean().default(false),
});

const CreateUnitSchema = z.object({
  orgId: z.string().min(1),
  name: z.string().min(1),
  preferences: z.object({
    palletColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  }).optional(),
  logo: z.string().url().default(''),
  gallery: z.array(z.string().url()).default([]),
  phones: z.array(PhoneSchema).min(1),
  address: AddressSchema,
  especialidades: z.array(z.string()).default([]),
  services: z.array(z.string()).default([]),
  serviceType: z.enum(['on-site', 'home-care', 'both']),
  amenities: z.array(z.string()).default([]),
});

const UpdateUnitSchema = z.object({
  name: z.string().min(1).optional(),
  preferences: z.object({
    palletColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  }).optional(),
  logo: z.string().url().optional(),
  gallery: z.array(z.string().url()).optional(),
  active: z.boolean().optional(),
  phones: z.array(PhoneSchema).optional(),
  address: AddressSchema.nullable().optional(),
  especialidades: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  serviceType: z.enum(['on-site', 'home-care', 'both']).optional(),
  amenities: z.array(z.string()).optional(),
});

export class UnitController {
  constructor(private readonly container: Container) { }

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const payload = CreateUnitSchema.parse(body);

      const unit = await this.container.use_cases.create_unit.execute({
        orgId: payload.orgId,
        name: payload.name,
        preferences: payload.preferences ?? {},
        logo: payload.logo,
        gallery: payload.gallery,
        phones: payload.phones,
        address: payload.address,
        specalities: payload.especialidades,
        services: payload.services,
        serviceType: payload.serviceType,
        amenities: payload.amenities,
      });

      // Complete onboarding for the user after creating their first unit
      const auth = c.get('auth') as AuthContext | undefined;
      if (auth?.userId) {
        await this.container.use_cases.complete_onboarding.execute({
          userId: auth.userId,
        });
      }

      return c.json(UnitMapper.toDTO(unit), 201);
    } catch (error) {
      throw error;
    }
  }

  async get_by_id(c: Context) {
    const { id } = c.req.param();

    const unit = await this.container.use_cases.get_unit_by_id.execute({ id });

    if (!unit) {
      throw new NotFoundError('Unit not found');
    }

    return c.json(UnitMapper.toDTO(unit));
  }

  async list_by_organization(c: Context) {
    const { organizationId } = c.req.param();

    const units = await this.container.use_cases.list_units_by_organization.execute({
      organizationId,
    });

    return c.json({
      items: UnitMapper.toDTOList(units),
      total: units.length,
    });
  }

  async update(c: Context) {
    try {
      const { id } = c.req.param();
      const body = await c.req.json();
      const payload = UpdateUnitSchema.parse(body);

      const unit = await this.container.use_cases.update_unit.execute({
        id,
        name: payload.name,
        preferences: payload.preferences,
        logo: payload.logo,
        gallery: payload.gallery,
        active: payload.active,
        phones: payload.phones,
        address: payload.address,
        especialidades: payload.especialidades,
        services: payload.services,
        serviceType: payload.serviceType,
        amenities: payload.amenities,
      });

      return c.json(UnitMapper.toDTO(unit));
    } catch (error) {
      if (error instanceof UnitNotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  }
}
