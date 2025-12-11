import { Context } from 'hono';
import { z } from 'zod';
import type { Container } from '@/infra/di/factory-root';
import { UnitSpecialtyMapper } from '@/application/dtos/mappers/unit-specialty.mapper';
import { BadRequestError, NotFoundError } from '../errors/http-errors';
import { UnitSpecialtyAlreadyLinkedError } from '@/domain/errors/unit-specialty-already-linked.error';
import { SpecialtyNotFoundError } from '@/domain/errors/specialty-not-found.error';
import { UnitNotFoundError } from '@/domain/errors/units/unit.errors';

const LinkUnitSpecialtySchema = z.object({
  specialty_id: z.string().min(1),
});

export class UnitSpecialtyController {
  constructor(private readonly container: Container) {}

  async link(c: Context) {
    try {
      const { unit_id } = c.req.param();
      const body = await c.req.json();
      const payload = LinkUnitSpecialtySchema.parse(body);

      const unit_specialty = await this.container.use_cases.link_unit_specialty.execute({
        unit_id,
        specialty_id: payload.specialty_id,
      });

      return c.json(UnitSpecialtyMapper.toDTO(unit_specialty), 201);
    } catch (error) {
      if (error instanceof UnitSpecialtyAlreadyLinkedError) {
        throw new BadRequestError(error.message);
      }
      if (error instanceof SpecialtyNotFoundError || error instanceof UnitNotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  }

  async unlink(c: Context) {
    const { unit_id, specialty_id } = c.req.param();

    const deleted = await this.container.use_cases.unlink_unit_specialty.execute({
      unit_id,
      specialty_id,
    });

    if (!deleted) {
      throw new NotFoundError('Unit specialty link not found');
    }

    return c.json({ success: true }, 200);
  }

  async list_by_unit(c: Context) {
    const { unit_id } = c.req.param();

    const unit_specialties = await this.container.use_cases.get_unit_specialties.execute({
      unit_id,
    });

    // Fetch specialty details for each link
    const with_details = await Promise.all(
      unit_specialties.map(async (us) => {
        const specialty = await this.container.use_cases.get_specialty_by_id.execute({
          id: us.specialty_id,
        });
        return UnitSpecialtyMapper.toWithDetails(us, specialty!);
      })
    );

    return c.json({ items: with_details });
  }
}
