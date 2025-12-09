import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { z } from 'zod';

const AuthenticateUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  providerId: z.string().min(1),
  photoUrl: z.string().optional(),
});

export class UserController {
  constructor(private readonly container: Container) { }

  async create(c: Context) {
    const body = await c.req.json();
    const payload = AuthenticateUserSchema.parse(body);

    const user = await this.container.use_cases.create_user.execute({
      name: payload.name,
      email: payload.email,
      providerId: payload.providerId,
      photoUrl: payload.photoUrl,
    });

    return c.json(
      {
        id: user.id,
        name: user.name,
      },
      201,
    );
  }
}
