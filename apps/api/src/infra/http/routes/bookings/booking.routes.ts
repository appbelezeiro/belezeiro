import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { BookingController } from '../../controllers/bookings/booking.controller';
import { BookingRuleController } from '../../controllers/bookings/booking-rule.controller';
import { BookingExceptionController } from '../../controllers/bookings/booking-exception.controller';

export function createBookingRoutes(container: Container) {
  const router = new Hono();
  const booking_controller = new BookingController(container);
  const rule_controller = new BookingRuleController(container);
  const exception_controller = new BookingExceptionController(container);

  // Booking Rules
  router.post('/rules', (context) => rule_controller.create(context));
  router.get('/rules', (context) => rule_controller.list(context));
  router.put('/rules/:id', (context) => rule_controller.update(context));
  router.delete('/rules/:id', (context) => rule_controller.delete(context));

  // Booking Exceptions
  router.post('/exceptions', (context) => exception_controller.create(context));
  router.get('/exceptions', (context) => exception_controller.list(context));
  router.put('/exceptions/:id', (context) => exception_controller.update(context));
  router.delete('/exceptions/:id', (context) => exception_controller.delete(context));

  // Availability
  router.get('/available-days', (context) => booking_controller.get_available_days(context));
  router.get('/available-slots', (context) => booking_controller.get_available_slots(context));

  // Bookings
  router.post('/', (context) => booking_controller.create(context));
  router.post('/:id/cancel', (context) => booking_controller.cancel(context));

  return router;
}
