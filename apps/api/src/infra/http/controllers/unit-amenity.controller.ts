import { Context } from 'hono';
import { z } from 'zod';
import type { Container } from '@/infra/di/factory-root';
import { UnitAmenityMapper } from '@/application/dtos/mappers/unit-amenity.mapper';
import { BadRequestError, NotFoundError } from '../errors/http-errors';
import { UnitAmenityAlreadyLinkedError } from '@/domain/errors/unit-amenity-already-linked.error';
import { AmenityNotFoundError } from '@/domain/errors/amenity-not-found.error';
import { UnitNotFoundError } from '@/domain/errors/units/unit.errors';

const LinkUnitAmenitySchema = z.object({
  amenity_id: z.string().min(1),
});

export class UnitAmenityController {
  constructor(private readonly container: Container) {}

  async link(c: Context) {
    try {
      const { unit_id } = c.req.param();
      const body = await c.req.json();
      const payload = LinkUnitAmenitySchema.parse(body);

      const unit_amenity = await this.container.use_cases.link_unit_amenity.execute({
        unit_id,
        amenity_id: payload.amenity_id,
      });

      return c.json(UnitAmenityMapper.toDTO(unit_amenity), 201);
    } catch (error) {
      if (error instanceof UnitAmenityAlreadyLinkedError) {
        throw new BadRequestError(error.message);
      }
      if (error instanceof AmenityNotFoundError || error instanceof UnitNotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  }

  async unlink(c: Context) {
    const { unit_id, amenity_id } = c.req.param();

    const deleted = await this.container.use_cases.unlink_unit_amenity.execute({
      unit_id,
      amenity_id,
    });

    if (!deleted) {
      throw new NotFoundError('Unit amenity link not found');
    }

    return c.json({ success: true }, 200);
  }

  async list_by_unit(c: Context) {
    const { unit_id } = c.req.param();

    const unit_amenities = await this.container.use_cases.get_unit_amenities.execute({
      unit_id,
    });

    // Fetch amenity details for each link
    const with_details = await Promise.all(
      unit_amenities.map(async (ua) => {
        const amenity = await this.container.use_cases.get_amenity_by_id.execute({
          id: ua.amenity_id,
        });
        return UnitAmenityMapper.toWithDetails(ua, amenity!);
      })
    );

    return c.json({ items: with_details });
  }
}
