import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';

export class ScheduleController {
  constructor(private readonly container: Container) {}

  async getSlotsByDay(c: Context) {
    try {
      const user_id = c.req.param('user_id');
      const date = c.req.query('date');

      if (!date) {
        return c.json({ error: 'Date query parameter is required' }, 400);
      }

      const slots = await this.container.use_cases.get_slots_by_day.execute({
        user_id,
        date: new Date(date),
      });

      return c.json({ slots });
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
