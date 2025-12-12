import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { z } from 'zod';
import { OrganizationMapper } from '@/application/dtos/mappers/organizations/organization.mapper';
import { OrganizationNotFoundError, OrganizationAlreadyExistsError } from '@/domain/errors/organizations/organization.errors';
import { NotFoundError, ConflictError } from '../../errors/http-errors';
import { AuthContext } from '../../middleware/auth.middleware';

const CreateOrganizationSchema = z.object({
  name: z.string().min(2).max(100),
});

const UpdateOrganizationSchema = z.object({
  name: z.string().min(2).max(100).optional(),
});

export class OrganizationController {
  constructor(private readonly container: Container) { }

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const payload = CreateOrganizationSchema.parse(body);
      const auth = c.get("auth") as AuthContext;

      const organization = await this.container.use_cases.create_organization.execute({
        name: payload.name,
        owner_id: auth.userId,
      });

      return c.json(OrganizationMapper.toSummary(organization), 201);
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

  async list(c: Context) {
    const { userId } = c.get("auth") as AuthContext;

    const organizations = await this.container.use_cases.list_organizations_by_owner.execute({
      ownerId: userId,
    });

    return c.json({
      items: organizations.map(OrganizationMapper.toDTO),
      total: organizations.length,
    });
  }

  async list_by_owner(c: Context) {
    const { ownerId } = c.req.param();

    const organizations = await this.container.use_cases.list_organizations_by_owner.execute({
      ownerId,
    });

    return c.json({
      items: organizations.map(OrganizationMapper.toDTO),
      total: organizations.length,
    });
  }

  async update(c: Context) {
    try {
      const { id } = c.req.param();
      const body = await c.req.json();
      const payload = UpdateOrganizationSchema.parse(body);

      const organization = await this.container.use_cases.update_organization.execute({
        id,
        name: payload.name,
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
