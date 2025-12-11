import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { z } from 'zod';
import { UnitAvailabilityRuleMapper } from '@/application/dtos/mappers/units/unit-availability-rule.mapper';
import {
  AvailabilityRuleNotFoundError,
  InvalidAvailabilityRuleError,
} from '@/domain/errors/units/unit-availability.errors';
import { NotFoundError, BadRequestError } from '../../errors/http-errors';

const CreateUnitAvailabilityRuleSchema = z.object({
  unit_id: z.string().min(1),
  type: z.enum(['weekly', 'specific_date']),
  weekday: z.number().min(0).max(6).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  start_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
  end_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
  slot_duration_minutes: z.number().positive(),
  is_active: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const BulkCreateUnitAvailabilityRulesSchema = z.object({
  unit_id: z.string().min(1),
  rules: z.array(CreateUnitAvailabilityRuleSchema.omit({ unit_id: true })),
});

const UpdateUnitAvailabilityRuleSchema = z.object({
  start_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  end_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  slot_duration_minutes: z.number().positive().optional(),
  is_active: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export class UnitAvailabilityRuleController {
  constructor(private readonly container: Container) {}

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const payload = CreateUnitAvailabilityRuleSchema.parse(body);

      const rule = await this.container.use_cases.create_unit_availability_rule.execute({
        unit_id: payload.unit_id,
        type: payload.type,
        weekday: payload.weekday,
        date: payload.date,
        start_time: payload.start_time,
        end_time: payload.end_time,
        slot_duration_minutes: payload.slot_duration_minutes,
        is_active: payload.is_active,
        metadata: payload.metadata,
      });

      return c.json(UnitAvailabilityRuleMapper.toDTO(rule), 201);
    } catch (error) {
      if (error instanceof InvalidAvailabilityRuleError) {
        throw new BadRequestError(error.message);
      }
      throw error;
    }
  }

  async bulk_create(c: Context) {
    try {
      const body = await c.req.json();
      const payload = BulkCreateUnitAvailabilityRulesSchema.parse(body);

      const rules = await this.container.use_cases.bulk_create_unit_availability_rules.execute(
        {
          unit_id: payload.unit_id,
          rules: payload.rules,
        }
      );

      return c.json(
        {
          items: UnitAvailabilityRuleMapper.toDTOList(rules),
          total: rules.length,
        },
        201
      );
    } catch (error) {
      if (error instanceof InvalidAvailabilityRuleError) {
        throw new BadRequestError(error.message);
      }
      throw error;
    }
  }

  async list_by_unit(c: Context) {
    const { unit_id } = c.req.param();

    const rules = await this.container.use_cases.get_unit_availability_rules_by_unit.execute({
      unit_id,
    });

    return c.json({
      items: UnitAvailabilityRuleMapper.toListItemList(rules),
      total: rules.length,
    });
  }

  async update(c: Context) {
    try {
      const { id } = c.req.param();
      const body = await c.req.json();
      const payload = UpdateUnitAvailabilityRuleSchema.parse(body);

      const rule = await this.container.use_cases.update_unit_availability_rule.execute({
        id,
        ...payload,
      });

      return c.json(UnitAvailabilityRuleMapper.toDTO(rule));
    } catch (error) {
      if (error instanceof AvailabilityRuleNotFoundError) {
        throw new NotFoundError(error.message);
      }
      if (error instanceof InvalidAvailabilityRuleError) {
        throw new BadRequestError(error.message);
      }
      throw error;
    }
  }

  async delete(c: Context) {
    try {
      const { id } = c.req.param();

      await this.container.use_cases.delete_unit_availability_rule.execute({ id });

      return c.body(null, 204);
    } catch (error) {
      if (error instanceof AvailabilityRuleNotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  }

  async get_available_slots(c: Context) {
    const { unit_id, date } = c.req.param();

    const slots = await this.container.use_cases.get_unit_available_slots.execute({
      unit_id,
      date,
    });

    return c.json({ slots });
  }
}
