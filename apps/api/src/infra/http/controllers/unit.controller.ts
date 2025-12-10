import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { z } from 'zod';
import { UnitMapper } from '@/application/dtos/mappers/unit.mapper';
import { UnitNotFoundError } from '@/domain/errors/unit.errors';
import { NotFoundError } from '../errors/http-errors';

const DayScheduleSchema = z.object({
  enabled: z.boolean(),
  open: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
  close: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
});

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

const LunchBreakSchema = z.object({
  enabled: z.boolean(),
  start: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
  end: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
});

const WorkingHoursSchema = z.object({
  monday: DayScheduleSchema,
  tuesday: DayScheduleSchema,
  wednesday: DayScheduleSchema,
  thursday: DayScheduleSchema,
  friday: DayScheduleSchema,
  saturday: DayScheduleSchema,
  sunday: DayScheduleSchema,
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
  workingHours: WorkingHoursSchema,
  lunchBreak: LunchBreakSchema.optional(),
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
  workingHours: WorkingHoursSchema.optional(),
  lunchBreak: LunchBreakSchema.optional(),
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
        workingHours: payload.workingHours,
        lunchBreak: payload.lunchBreak,
      });

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
        workingHours: payload.workingHours,
        lunchBreak: payload.lunchBreak,
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
