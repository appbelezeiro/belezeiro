import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { UnitAvailabilityRuleController } from '../../controllers/units/unit-availability-rule.controller';
import { UnitAvailabilityExceptionController } from '../../controllers/units/unit-availability-exception.controller';

export function createUnitAvailabilityRoutes(container: Container) {
  const router = new Hono();
  const rule_controller = new UnitAvailabilityRuleController(container);
  const exception_controller = new UnitAvailabilityExceptionController(container);

  // Rules
  router.post('/rules', (c) => rule_controller.create(c));
  router.post('/rules/bulk', (c) => rule_controller.bulk_create(c));
  router.get('/rules/unit/:unit_id', (c) => rule_controller.list_by_unit(c));
  router.put('/rules/:id', (c) => rule_controller.update(c));
  router.delete('/rules/:id', (c) => rule_controller.delete(c));

  // Exceptions
  router.post('/exceptions', (c) => exception_controller.create(c));
  router.post('/exceptions/bulk', (c) => exception_controller.bulk_create(c));
  router.get('/exceptions/unit/:unit_id', (c) => exception_controller.list_by_unit(c));
  router.put('/exceptions/:id', (c) => exception_controller.update(c));
  router.delete('/exceptions/:id', (c) => exception_controller.delete(c));

  // Helper: Get available slots
  router.get('/slots/unit/:unit_id/date/:date', (c) =>
    rule_controller.get_available_slots(c)
  );

  return router;
}
