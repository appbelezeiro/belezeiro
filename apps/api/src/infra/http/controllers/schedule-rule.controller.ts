import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';

export class ScheduleRuleController {
  constructor(private readonly container: Container) {}

  async create(c: Context) {
    try {
      const body = await c.req.json();

      const weekday = Array.isArray(body.day_of_week)
        ? body.day_of_week
        : [body.day_of_week];

      const schedule_rule = await this.container.use_cases.create_schedule_rule.execute({
        user_id: body.user_id,
        weekday,
        start_time: body.start_time,
        end_time: body.end_time,
        slot_duration_minutes: body.slot_duration_minutes,
      });

      return c.json(
        {
          id: schedule_rule.id,
          user_id: schedule_rule.user_id,
          day_of_week: schedule_rule.weekday[0],
          weekday: schedule_rule.weekday,
          start_time: schedule_rule.start_time,
          end_time: schedule_rule.end_time,
          slot_duration_minutes: schedule_rule.slot_duration_minutes,
          created_at: schedule_rule.created_at,
          updated_at: schedule_rule.updated_at,
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

      const schedule_rules = await this.container.use_cases.get_schedule_rules_by_user.execute({
        user_id,
      });

      return c.json(
        schedule_rules.map((rule) => ({
          id: rule.id,
          user_id: rule.user_id,
          day_of_week: rule.weekday[0],
          weekday: rule.weekday,
          start_time: rule.start_time,
          end_time: rule.end_time,
          slot_duration_minutes: rule.slot_duration_minutes,
          created_at: rule.created_at,
          updated_at: rule.updated_at,
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
