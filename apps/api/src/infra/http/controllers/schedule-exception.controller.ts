import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';

export class ScheduleExceptionController {
  constructor(private readonly container: Container) {}

  async create(c: Context) {
    try {
      const body = await c.req.json();

      const type = body.is_available ? 'custom' : 'block';

      const schedule_exception =
        await this.container.use_cases.create_schedule_exception.execute({
          user_id: body.user_id,
          date: new Date(body.date),
          type,
          start_time: body.start_time,
          end_time: body.end_time,
        });

      return c.json(
        {
          id: schedule_exception.id,
          user_id: schedule_exception.user_id,
          date: schedule_exception.date,
          type: schedule_exception.type,
          is_available: schedule_exception.type === 'custom',
          start_time: schedule_exception.start_time,
          end_time: schedule_exception.end_time,
          created_at: schedule_exception.created_at,
          updated_at: schedule_exception.updated_at,
        },
        201,
      );
    } catch (error) {
      return c.json(
        {
          error: error instanceof Error ? error.message : 'Internal server error',
        },
        500,
      );
    }
  }

  async getByUser(c: Context) {
    try {
      const user_id = c.req.param('user_id');

      const schedule_exceptions =
        await this.container.use_cases.get_schedule_exceptions_by_user.execute({
          user_id,
        });

      return c.json(
        schedule_exceptions.map((exception) => ({
          id: exception.id,
          user_id: exception.user_id,
          date: exception.date,
          type: exception.type,
          is_available: exception.type === 'custom',
          start_time: exception.start_time,
          end_time: exception.end_time,
          created_at: exception.created_at,
          updated_at: exception.updated_at,
        })),
      );
    } catch (error) {
      return c.json(
        {
          error: error instanceof Error ? error.message : 'Internal server error',
        },
        500,
      );
    }
  }
}
