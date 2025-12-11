import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { z } from 'zod';
import { UnitMapper } from '@/application/dtos/mappers/units/unit.mapper';
import { UnitNotFoundError } from '@/domain/errors/units/unit.errors';
import { NotFoundError } from '../../errors/http-errors';
import type { AuthContext } from '../../middleware/auth.middleware';

const AddressSchema = z.object({
  cep: z.string().regex(/^\d{5}-?\d{3}$/),
  street: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional(),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2),
});

const ProfessionRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
});

const ServiceRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  professionId: z.string(),
});

const AvailabilityRuleInputSchema = z.object({
  type: z.enum(['weekly', 'specific_date']),
  weekday: z.number().min(0).max(6).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  start_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
  end_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
  slot_duration_minutes: z.number().positive(),
  is_active: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const AvailabilityExceptionInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.enum(['block', 'override']),
  start_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  end_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  slot_duration_minutes: z.number().positive().optional(),
  reason: z.string().optional(),
});

const CreateUnitSchema = z.object({
  organizationId: z.string().min(1),
  name: z.string().min(1),
  logo: z.string().url().optional(),
  gallery: z.array(z.string().url()).optional(),
  whatsapp: z.string().min(10),
  phone: z.string().min(10).optional(),
  address: AddressSchema,
  professions: z.array(ProfessionRefSchema).min(1),
  services: z.array(ServiceRefSchema).min(1),
  serviceType: z.enum(['local', 'home', 'both']),
  amenities: z.array(
    z.enum(['wifi', 'parking', 'coffee', 'ac', 'snacks', 'waiting-room', 'accessibility'])
  ),

  // Availability rules are now the primary way to define availability
  availability_rules: z.array(AvailabilityRuleInputSchema).optional(),
  availability_exceptions: z.array(AvailabilityExceptionInputSchema).optional(),
});

const UpdateUnitSchema = z.object({
  name: z.string().min(1).optional(),
  logo: z.string().url().optional(),
  gallery: z.array(z.string().url()).optional(),
  isActive: z.boolean().optional(),
  whatsapp: z.string().min(10).optional(),
  phone: z.string().min(10).optional(),
  address: AddressSchema.optional(),
  professions: z.array(ProfessionRefSchema).min(1).optional(),
  services: z.array(ServiceRefSchema).min(1).optional(),
  serviceType: z.enum(['local', 'home', 'both']).optional(),
  amenities: z
    .array(
      z.enum(['wifi', 'parking', 'coffee', 'ac', 'snacks', 'waiting-room', 'accessibility'])
    )
    .optional(),
});

export class UnitController {
  constructor(private readonly container: Container) {}

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const payload = CreateUnitSchema.parse(body);

      const unit = await this.container.use_cases.create_unit.execute({
        organizationId: payload.organizationId,
        name: payload.name,
        logo: payload.logo,
        gallery: payload.gallery,
        whatsapp: payload.whatsapp,
        phone: payload.phone,
        address: payload.address,
        professions: payload.professions,
        services: payload.services,
        serviceType: payload.serviceType,
        amenities: payload.amenities,
        availability_rules: payload.availability_rules,
        availability_exceptions: payload.availability_exceptions,
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

  async list_active(c: Context) {
    const units = await this.container.use_cases.list_active_units.execute();

    return c.json({
      items: UnitMapper.toListItemList(units),
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
        logo: payload.logo,
        gallery: payload.gallery,
        isActive: payload.isActive,
        whatsapp: payload.whatsapp,
        phone: payload.phone,
        address: payload.address,
        professions: payload.professions,
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
