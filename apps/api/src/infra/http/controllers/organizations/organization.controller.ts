import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { z } from 'zod';
import { OrganizationMapper } from '@/application/dtos/mappers/organizations/organization.mapper';
import { OrganizationNotFoundError, OrganizationAlreadyExistsError } from '@/domain/errors/organizations/organization.errors';
import { NotFoundError, ConflictError } from '../../errors/http-errors';

const CreateOrganizationSchema = z.object({
  businessName: z.string().min(2).max(100),
  brandColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  ownerId: z.string().min(1),
  subscription: z
    .object({
      plan: z.enum(['free', 'pro', 'enterprise']),
      status: z.enum(['active', 'inactive', 'suspended']),
      expiresAt: z.string().datetime().optional(),
    })
    .optional(),
});

const UpdateOrganizationSchema = z.object({
  businessName: z.string().min(2).max(100).optional(),
  brandColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  subscription: z
    .object({
      plan: z.enum(['free', 'pro', 'enterprise']),
      status: z.enum(['active', 'inactive', 'suspended']),
      expiresAt: z.string().datetime().optional(),
    })
    .optional(),
});

export class OrganizationController {
  constructor(private readonly container: Container) {}

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const payload = CreateOrganizationSchema.parse(body);

      const organization = await this.container.use_cases.create_organization.execute({
        businessName: payload.businessName,
        brandColor: payload.brandColor,
        ownerId: payload.ownerId,
        subscription: payload.subscription
          ? {
              ...payload.subscription,
              expiresAt: payload.subscription.expiresAt
                ? new Date(payload.subscription.expiresAt)
                : undefined,
            }
          : undefined,
      });

      return c.json(OrganizationMapper.toDTO(organization), 201);
    } catch (error) {
      if (error instanceof OrganizationAlreadyExistsError) {
        throw new ConflictError(error.message);
      }
      throw error;
    }
  }

  async get_by_id(c: Context) {
    const { id } = c.req.param();

    const organization = await this.container.use_cases.get_organization_by_id.execute({ id });

    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    return c.json(OrganizationMapper.toDTO(organization));
  }

  async get_by_owner(c: Context) {
    const { ownerId } = c.req.param();

    const organization = await this.container.use_cases.get_organization_by_owner.execute({
      ownerId,
    });

    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    return c.json(OrganizationMapper.toDTO(organization));
  }

  async update(c: Context) {
    try {
      const { id } = c.req.param();
      const body = await c.req.json();
      const payload = UpdateOrganizationSchema.parse(body);

      const organization = await this.container.use_cases.update_organization.execute({
        id,
        businessName: payload.businessName,
        brandColor: payload.brandColor,
        subscription: payload.subscription
          ? {
              ...payload.subscription,
              expiresAt: payload.subscription.expiresAt
                ? new Date(payload.subscription.expiresAt)
                : undefined,
            }
          : undefined,
      });

      return c.json(OrganizationMapper.toDTO(organization));
    } catch (error) {
      if (error instanceof OrganizationNotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  }
}
