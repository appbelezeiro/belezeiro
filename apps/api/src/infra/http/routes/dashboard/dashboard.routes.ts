import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { DashboardController } from '../../controllers/dashboard/dashboard.controller';
import { createAuthMiddleware } from '../../middleware/auth.middleware';

export function createDashboardRoutes(container: Container) {
  const router = new Hono();
  const controller = new DashboardController();
  const auth_middleware = createAuthMiddleware(container.services.token_service);

  // All dashboard routes require authentication
  router.use('/*', auth_middleware);

  // KPI Stats
  router.get('/stats', (context) => controller.getStats(context));

  // Recent bookings (today)
  router.get('/recent-bookings', (context) => controller.getRecentBookings(context));

  // Plan info
  router.get('/plan', (context) => controller.getPlanInfo(context));

  // AI Secretary info (mock)
  router.get('/secretary', (context) => controller.getSecretaryInfo(context));

  // Revenue stats
  router.get('/revenue', (context) => controller.getRevenue(context));

  // Notifications
  router.get('/notifications', (context) => controller.getNotifications(context));
  router.patch('/notifications/:id/read', (context) => controller.markNotificationAsRead(context));
  router.patch('/notifications/read-all', (context) => controller.markAllNotificationsAsRead(context));

  return router;
}
