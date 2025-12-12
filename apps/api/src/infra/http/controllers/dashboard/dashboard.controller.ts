import { Context } from 'hono';
import { z } from 'zod';
import { prisma } from '@/infra/repositories/prisma/client/index.js';
import type { AuthContext } from '../../middleware/auth.middleware';
import { BadRequestError, NotFoundError } from '../../errors/http-errors';

const StatsQuerySchema = z.object({
  unitId: z.string().min(1),
});

const RevenueQuerySchema = z.object({
  unitId: z.string().min(1),
  period: z.enum(['day', 'week', 'month', 'year']).default('month'),
});

const NotificationsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(10),
});

export class DashboardController {
  async getStats(c: Context) {
    const query = StatsQuerySchema.parse(c.req.query());
    const { unitId } = query;

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Get start of week
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    // Appointments today
    const appointmentsToday = await prisma.booking.count({
      where: {
        unit_id: unitId,
        start_at: { gte: today, lt: tomorrow },
        status: 'confirmed',
      },
    });

    // Appointments yesterday (for comparison)
    const appointmentsYesterday = await prisma.booking.count({
      where: {
        unit_id: unitId,
        start_at: { gte: yesterday, lt: today },
        status: 'confirmed',
      },
    });

    // New customers this week
    const newCustomersThisWeek = await prisma.customer.count({
      where: {
        unit_id: unitId,
        created_at: { gte: startOfWeek },
      },
    });

    // New customers last week (for comparison)
    const newCustomersLastWeek = await prisma.customer.count({
      where: {
        unit_id: unitId,
        created_at: { gte: startOfLastWeek, lt: startOfWeek },
      },
    });

    // Top service (most booked in the last 30 days)
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const topServiceResult = await prisma.booking.groupBy({
      by: ['service_id'],
      where: {
        unit_id: unitId,
        service_id: { not: null },
        start_at: { gte: thirtyDaysAgo },
      },
      _count: { service_id: true },
      orderBy: { _count: { service_id: 'desc' } },
      take: 1,
    });

    let topService = { name: 'N/A', percentage: 0 };
    if (topServiceResult.length > 0 && topServiceResult[0].service_id) {
      const service = await prisma.service.findUnique({
        where: { id: topServiceResult[0].service_id },
      });

      const totalBookings = await prisma.booking.count({
        where: {
          unit_id: unitId,
          service_id: { not: null },
          start_at: { gte: thirtyDaysAgo },
        },
      });

      if (service && totalBookings > 0) {
        topService = {
          name: service.name,
          percentage: Math.round((topServiceResult[0]._count.service_id / totalBookings) * 100),
        };
      }
    }

    // Peak hours (most common booking hour today)
    const todayBookings = await prisma.booking.findMany({
      where: {
        unit_id: unitId,
        start_at: { gte: today, lt: tomorrow },
        status: 'confirmed',
      },
      select: { start_at: true },
    });

    let peakHours = { range: 'N/A', count: 0 };
    if (todayBookings.length > 0) {
      const hourCounts: Record<number, number> = {};
      todayBookings.forEach((booking) => {
        const hour = booking.start_at.getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });

      const peakHour = Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0];
      if (peakHour) {
        const hour = parseInt(peakHour[0]);
        peakHours = {
          range: `${hour}h-${hour + 2}h`,
          count: peakHour[1],
        };
      }
    }

    return c.json({
      appointmentsToday: {
        value: appointmentsToday,
        change: appointmentsToday - appointmentsYesterday,
        changeLabel: `${appointmentsToday - appointmentsYesterday >= 0 ? '+' : ''}${appointmentsToday - appointmentsYesterday} vs ontem`,
      },
      newCustomers: {
        value: newCustomersThisWeek,
        change: newCustomersThisWeek - newCustomersLastWeek,
        changeLabel: `${newCustomersThisWeek - newCustomersLastWeek >= 0 ? '+' : ''}${newCustomersThisWeek - newCustomersLastWeek} esta semana`,
      },
      topService: {
        value: topService.name,
        percentage: topService.percentage,
        changeLabel: `${topService.percentage}% dos pedidos`,
      },
      peakHours: {
        value: peakHours.range,
        count: peakHours.count,
        changeLabel: `${peakHours.count} agendamentos`,
      },
    });
  }

  async getRecentBookings(c: Context) {
    const query = StatsQuerySchema.parse(c.req.query());
    const { unitId } = query;

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const bookings = await prisma.booking.findMany({
      where: {
        unit_id: unitId,
        start_at: { gte: today, lt: tomorrow },
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            photo_url: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            default_duration_minutes: true,
          },
        },
      },
      orderBy: { start_at: 'asc' },
    });

    return c.json({
      items: bookings.map((booking) => ({
        id: booking.id,
        client: {
          id: booking.client.id,
          name: booking.client.name,
          email: booking.client.email,
          photo: booking.client.photo_url,
        },
        service: booking.service
          ? {
              id: booking.service.id,
              name: booking.service.name,
              duration: booking.service.default_duration_minutes,
            }
          : null,
        startAt: booking.start_at.toISOString(),
        endAt: booking.end_at.toISOString(),
        status: booking.status,
        priceCents: booking.price_cents,
        notes: booking.notes,
      })),
      total: bookings.length,
    });
  }

  async getPlanInfo(c: Context) {
    const query = StatsQuerySchema.parse(c.req.query());
    const { unitId } = query;

    const subscription = await prisma.subscription.findUnique({
      where: { unit_id: unitId },
      include: {
        plan: true,
      },
    });

    if (!subscription) {
      // Return free plan info if no subscription
      return c.json({
        plan: {
          name: 'Gratuito',
          status: 'active',
        },
        limits: {
          bookingsPerMonth: 50,
          customersLimit: 100,
          unitsLimit: 1,
        },
        usage: {
          bookingsThisMonth: 0,
          customersCount: 0,
          unitsCount: 1,
        },
        expiresAt: null,
      });
    }

    // Get current month usage
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const bookingsThisMonth = await prisma.booking.count({
      where: {
        unit_id: unitId,
        created_at: { gte: startOfMonth },
      },
    });

    const customersCount = await prisma.customer.count({
      where: { unit_id: unitId },
    });

    const planLimits = (subscription.plan.limits as Record<string, number>) || {};

    return c.json({
      plan: {
        id: subscription.plan.id,
        name: subscription.plan.name,
        status: subscription.status,
        price: subscription.plan.price,
      },
      limits: {
        bookingsPerMonth: planLimits.bookingsPerMonth || null,
        customersLimit: planLimits.customersLimit || null,
        unitsLimit: planLimits.unitsLimit || null,
      },
      usage: {
        bookingsThisMonth,
        customersCount,
      },
      currentPeriodEnd: subscription.current_period_end?.toISOString() || null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
  }

  async getSecretaryInfo(c: Context) {
    // Mock data for AI Secretary - to be implemented later
    return c.json({
      enabled: false,
      stats: {
        messagesHandled: 0,
        appointmentsScheduled: 0,
        questionsAnswered: 0,
      },
      status: 'inactive',
      lastActive: null,
    });
  }

  async getRevenue(c: Context) {
    const query = RevenueQuerySchema.parse(c.req.query());
    const { unitId, period } = query;

    const now = new Date();
    let startDate: Date;
    let groupBy: 'day' | 'week' | 'month';

    switch (period) {
      case 'day':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        groupBy = 'day';
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        groupBy = 'day';
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 1);
        groupBy = 'day';
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(startDate.getFullYear() - 1);
        groupBy = 'month';
        break;
    }

    // Get completed bookings with prices
    const bookings = await prisma.booking.findMany({
      where: {
        unit_id: unitId,
        start_at: { gte: startDate },
        status: { in: ['confirmed', 'completed'] },
        price_cents: { not: null },
      },
      select: {
        start_at: true,
        price_cents: true,
      },
      orderBy: { start_at: 'asc' },
    });

    // Group by date
    const revenueByDate: Record<string, number> = {};
    let totalRevenue = 0;

    bookings.forEach((booking) => {
      let dateKey: string;
      if (groupBy === 'month') {
        dateKey = `${booking.start_at.getFullYear()}-${String(booking.start_at.getMonth() + 1).padStart(2, '0')}`;
      } else {
        dateKey = booking.start_at.toISOString().split('T')[0];
      }

      revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + (booking.price_cents || 0);
      totalRevenue += booking.price_cents || 0;
    });

    const data = Object.entries(revenueByDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amount]) => ({
        date,
        amount,
        amountFormatted: `R$ ${(amount / 100).toFixed(2)}`,
      }));

    // Get previous period for comparison
    const periodDuration = now.getTime() - startDate.getTime();
    const previousStart = new Date(startDate.getTime() - periodDuration);

    const previousBookings = await prisma.booking.findMany({
      where: {
        unit_id: unitId,
        start_at: { gte: previousStart, lt: startDate },
        status: { in: ['confirmed', 'completed'] },
        price_cents: { not: null },
      },
      select: { price_cents: true },
    });

    const previousTotal = previousBookings.reduce((sum, b) => sum + (b.price_cents || 0), 0);
    const change = previousTotal > 0 ? ((totalRevenue - previousTotal) / previousTotal) * 100 : 0;

    return c.json({
      data,
      total: totalRevenue,
      totalFormatted: `R$ ${(totalRevenue / 100).toFixed(2)}`,
      change: Math.round(change),
      changeLabel: `${change >= 0 ? '+' : ''}${Math.round(change)}% vs período anterior`,
      period,
    });
  }

  async getNotifications(c: Context) {
    const auth = c.get('auth') as AuthContext;
    const query = NotificationsQuerySchema.parse(c.req.query());

    const notifications = await prisma.notification.findMany({
      where: {
        target_user_id: auth.userId,
      },
      include: {
        template: {
          select: {
            name: true,
            title_template: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
      take: query.limit,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        target_user_id: auth.userId,
        read_at: null,
      },
    });

    return c.json({
      items: notifications.map((n) => ({
        id: n.id,
        title: n.template.title_template || n.template.name,
        message: typeof n.payload === 'object' && n.payload !== null ? (n.payload as Record<string, unknown>).message || '' : '',
        type: n.template.name,
        priority: n.priority,
        read: n.read_at !== null,
        createdAt: n.created_at.toISOString(),
      })),
      unreadCount,
      total: notifications.length,
    });
  }

  async markNotificationAsRead(c: Context) {
    const auth = c.get('auth') as AuthContext;
    const { id } = c.req.param();

    const notification = await prisma.notification.findFirst({
      where: {
        id,
        target_user_id: auth.userId,
      },
    });

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    await prisma.notification.update({
      where: { id },
      data: { read_at: new Date() },
    });

    return c.json({ success: true });
  }

  async markAllNotificationsAsRead(c: Context) {
    const auth = c.get('auth') as AuthContext;

    await prisma.notification.updateMany({
      where: {
        target_user_id: auth.userId,
        read_at: null,
      },
      data: { read_at: new Date() },
    });

    return c.json({ success: true });
  }
}
