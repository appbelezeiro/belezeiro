import { Context } from 'hono';
import { z } from 'zod';
import type { AuthContext } from '../../middleware/auth.middleware';

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
    const { unitId: _unitId } = query;

    // TODO: Implementar com Prisma quando o banco estiver configurado
    // Dados mockados por enquanto
    return c.json({
      appointmentsToday: {
        value: 12,
        change: 3,
        changeLabel: '+3 vs ontem',
      },
      newCustomers: {
        value: 8,
        change: 2,
        changeLabel: '+2 esta semana',
      },
      topService: {
        value: 'Corte de Cabelo',
        percentage: 45,
        changeLabel: '45% dos pedidos',
      },
      peakHours: {
        value: '14h-16h',
        count: 5,
        changeLabel: '5 agendamentos',
      },
    });
  }

  async getRecentBookings(c: Context) {
    const query = StatsQuerySchema.parse(c.req.query());
    const { unitId: _unitId } = query;

    // TODO: Implementar com Prisma quando o banco estiver configurado
    // Dados mockados por enquanto
    return c.json({
      items: [
        {
          id: 'bkg_mock_1',
          client: {
            id: 'usr_mock_1',
            name: 'João Silva',
            email: 'joao@example.com',
            photo: null,
          },
          service: {
            id: 'svc_mock_1',
            name: 'Corte de Cabelo',
            duration: 30,
          },
          startAt: new Date().toISOString(),
          endAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          status: 'confirmed',
          priceCents: 5000,
          notes: null,
        },
        {
          id: 'bkg_mock_2',
          client: {
            id: 'usr_mock_2',
            name: 'Maria Santos',
            email: 'maria@example.com',
            photo: null,
          },
          service: {
            id: 'svc_mock_2',
            name: 'Manicure',
            duration: 45,
          },
          startAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          endAt: new Date(Date.now() + 105 * 60 * 1000).toISOString(),
          status: 'confirmed',
          priceCents: 3500,
          notes: null,
        },
      ],
      total: 2,
    });
  }

  async getPlanInfo(c: Context) {
    const query = StatsQuerySchema.parse(c.req.query());
    const { unitId: _unitId } = query;

    // TODO: Implementar com Prisma quando o banco estiver configurado
    // Dados mockados por enquanto
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
        bookingsThisMonth: 12,
        customersCount: 25,
        unitsCount: 1,
      },
      expiresAt: null,
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
    const { unitId: _unitId, period } = query;

    // TODO: Implementar com Prisma quando o banco estiver configurado
    // Dados mockados por enquanto
    const mockData = [
      { date: '2024-01-01', amount: 15000, amountFormatted: 'R$ 150.00' },
      { date: '2024-01-02', amount: 22000, amountFormatted: 'R$ 220.00' },
      { date: '2024-01-03', amount: 18500, amountFormatted: 'R$ 185.00' },
      { date: '2024-01-04', amount: 31000, amountFormatted: 'R$ 310.00' },
      { date: '2024-01-05', amount: 27500, amountFormatted: 'R$ 275.00' },
    ];

    const totalRevenue = mockData.reduce((sum, d) => sum + d.amount, 0);

    return c.json({
      data: mockData,
      total: totalRevenue,
      totalFormatted: `R$ ${(totalRevenue / 100).toFixed(2)}`,
      change: 12,
      changeLabel: '+12% vs período anterior',
      period,
    });
  }

  async getNotifications(c: Context) {
    const _auth = c.get('auth') as AuthContext;
    const query = NotificationsQuerySchema.parse(c.req.query());
    const _limit = query.limit;

    // TODO: Implementar com Prisma quando o banco estiver configurado
    // Dados mockados por enquanto
    return c.json({
      items: [
        {
          id: 'ntf_mock_1',
          title: 'Novo agendamento',
          message: 'João Silva agendou um corte de cabelo para amanhã às 14h',
          type: 'booking_created',
          priority: 'normal',
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'ntf_mock_2',
          title: 'Agendamento cancelado',
          message: 'Maria Santos cancelou o agendamento de manicure',
          type: 'booking_cancelled',
          priority: 'high',
          read: true,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ],
      unreadCount: 1,
      total: 2,
    });
  }

  async markNotificationAsRead(c: Context) {
    const _auth = c.get('auth') as AuthContext;
    const { id: _id } = c.req.param();

    // TODO: Implementar com Prisma quando o banco estiver configurado
    return c.json({ success: true });
  }

  async markAllNotificationsAsRead(c: Context) {
    const _auth = c.get('auth') as AuthContext;

    // TODO: Implementar com Prisma quando o banco estiver configurado
    return c.json({ success: true });
  }
}
