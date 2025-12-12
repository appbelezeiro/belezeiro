import { Context, Next } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { NotFoundError, ForbiddenError } from '../errors/http-errors';

export function createUnitOwnershipMiddleware(container: Container) {
  return async (c: Context, next: Next) => {
    const { unit_id } = c.req.param();
    const auth = c.get('auth');
    const user_id = auth.userId;

    // Buscar unidade
    const unit = await container.repositories.unit_repository.find_by_id(unit_id);

    if (!unit) {
      throw new NotFoundError('Unit not found');
    }

    // Buscar organização para validar owner
    const organization =
      await container.repositories.organization_repository.find_by_id(unit.orgId);

    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    // Validar se user é owner da organização
    if (organization.ownerId !== user_id) {
      throw new ForbiddenError('You do not own this unit');
    }

    // Passar para próximo middleware
    await next();
  };
}
