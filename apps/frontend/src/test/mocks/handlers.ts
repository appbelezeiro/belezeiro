// ============================================================================
// MSW HANDLERS - Handlers padrão para testes
// ============================================================================

import { http, HttpResponse } from "msw";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ============================================================================
// Mock Data
// ============================================================================

export const mockUser = {
  id: "user-1",
  email: "test@example.com",
  name: "Test User",
  photo: "https://example.com/avatar.jpg",
  isActive: true,
  onboardingCompleted: true,
};

export const mockCustomer = {
  id: "customer-1",
  name: "John Doe",
  phone: "11999999999",
  email: "john@example.com",
  photo: null,
  birthDate: "1990-01-15",
  notes: "",
  tags: ["VIP"],
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  isActive: true,
  totalAppointments: 10,
  totalSpent: 500,
  lastVisit: "2024-12-01T10:00:00.000Z",
};

export const mockService = {
  id: "service-1",
  name: "Corte de Cabelo",
  description: "Corte masculino tradicional",
  duration: 30,
  price: 50,
  category: "Cabelo",
  color: "#3B82F6",
  isActive: true,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  appointmentsCount: 100,
  revenue: 5000,
};

export const mockDashboardStats = {
  appointmentsToday: 12,
  appointmentsChange: 3,
  newClients: 4,
  newClientsChange: 2,
  topService: "Corte",
  topServicePercentage: 35,
  peakHours: "14h-16h",
  peakHoursCount: 8,
  revenue: 1500,
  revenueChange: 10,
};

export const mockAppointment = {
  id: "appointment-1",
  clientName: "John Doe",
  clientPhone: "11999999999",
  serviceName: "Corte de Cabelo",
  serviceColor: "#3B82F6",
  time: "14:00",
  duration: 30,
  status: "confirmed",
};

export const mockUnitInfo = {
  id: "unit-1",
  businessName: "Salão do Zezé",
  unitName: "Unidade Centro",
  address: "Av. Paulista, 1000 - Bela Vista, São Paulo",
  logo: null,
  primaryColor: "hsl(195, 70%, 45%)",
  isBookingEnabled: true,
  images: ["https://example.com/image1.jpg"],
};

export const mockTimeSlot = {
  id: "slot-1",
  time: "14:00",
  available: true,
};

export const mockBooking = {
  id: "booking-1",
  unitId: "unit-1",
  clientId: "customer-1",
  clientName: "John Doe",
  clientPhone: "11999999999",
  services: [mockService],
  date: "2024-12-15",
  time: "14:00",
  totalDuration: 30,
  totalPrice: 50,
  status: "CONFIRMED",
  createdAt: "2024-12-10T00:00:00.000Z",
  confirmationCode: "ABC123",
};

// ============================================================================
// Auth Handlers
// ============================================================================

const authHandlers = [
  http.post(`${API_URL}/api/auth/social-login`, async () => {
    return HttpResponse.json({ user: mockUser });
  }),

  http.post(`${API_URL}/api/auth/logout`, async () => {
    return HttpResponse.json({ status: "Logged out successfully" });
  }),

  http.post(`${API_URL}/api/auth/refresh`, async () => {
    return HttpResponse.json({ status: "Tokens refreshed successfully" });
  }),

  http.get(`${API_URL}/api/auth/me`, async () => {
    return HttpResponse.json({ user: mockUser });
  }),
];

// ============================================================================
// Customer Handlers
// ============================================================================

const customerHandlers = [
  http.get(`${API_URL}/api/customers`, async () => {
    return HttpResponse.json({
      customers: [mockCustomer],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  }),

  http.get(`${API_URL}/api/customers/:id`, async ({ params }) => {
    return HttpResponse.json({ ...mockCustomer, id: params.id });
  }),

  http.post(`${API_URL}/api/customers`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      ...mockCustomer,
      ...(body as object),
      id: "new-customer-1",
    });
  }),

  http.patch(`${API_URL}/api/customers/:id`, async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({
      ...mockCustomer,
      ...(body as object),
      id: params.id,
    });
  }),

  http.delete(`${API_URL}/api/customers/:id`, async () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_URL}/api/customers/search`, async () => {
    return HttpResponse.json([mockCustomer]);
  }),

  http.get(`${API_URL}/api/customers/:id/history`, async () => {
    return HttpResponse.json([
      {
        id: "history-1",
        type: "appointment",
        date: "2024-12-01T10:00:00.000Z",
        description: "Corte de Cabelo",
        value: 50,
        status: "completed",
      },
    ]);
  }),

  http.get(`${API_URL}/api/customers/tags`, async () => {
    return HttpResponse.json([
      { id: "tag-1", name: "VIP", color: "#FFD700", count: 5 },
      { id: "tag-2", name: "Novo", color: "#00FF00", count: 10 },
    ]);
  }),
];

// ============================================================================
// Service Handlers
// ============================================================================

const serviceHandlers = [
  http.get(`${API_URL}/api/services`, async () => {
    return HttpResponse.json({
      services: [mockService],
      total: 1,
      page: 1,
      limit: 10,
    });
  }),

  http.get(`${API_URL}/api/services/active`, async () => {
    return HttpResponse.json([mockService]);
  }),

  http.get(`${API_URL}/api/services/:id`, async ({ params }) => {
    return HttpResponse.json({ ...mockService, id: params.id });
  }),

  http.post(`${API_URL}/api/services`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      ...mockService,
      ...(body as object),
      id: "new-service-1",
    });
  }),

  http.patch(`${API_URL}/api/services/:id`, async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({
      ...mockService,
      ...(body as object),
      id: params.id,
    });
  }),

  http.delete(`${API_URL}/api/services/:id`, async () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_URL}/api/services/categories`, async () => {
    return HttpResponse.json([
      { id: "cat-1", name: "Cabelo", description: "", order: 1, servicesCount: 5 },
      { id: "cat-2", name: "Barba", description: "", order: 2, servicesCount: 3 },
    ]);
  }),
];

// ============================================================================
// Dashboard Handlers
// ============================================================================

const dashboardHandlers = [
  http.get(`${API_URL}/api/dashboard/stats`, async () => {
    return HttpResponse.json(mockDashboardStats);
  }),

  http.get(`${API_URL}/api/dashboard/recent-bookings`, async () => {
    return HttpResponse.json({
      appointments: [mockAppointment],
      total: 1,
    });
  }),

  http.get(`${API_URL}/api/dashboard/stats/secretary`, async () => {
    return HttpResponse.json({
      status: "active",
      messagesHandled: 150,
      appointmentsBooked: 45,
      responseRate: 98,
      averageResponseTime: 30,
      isEnabled: true,
    });
  }),

  http.get(`${API_URL}/api/dashboard/stats/plan`, async () => {
    return HttpResponse.json({
      plan: "professional",
      planName: "Profissional",
      daysRemaining: 25,
      appointmentsUsed: 150,
      appointmentsLimit: 500,
      features: ["AI Secretary", "Multiple Units", "Analytics"],
    });
  }),

  http.get(`${API_URL}/api/dashboard/stats/notifications`, async () => {
    return HttpResponse.json([
      {
        id: "notif-1",
        type: "appointment",
        title: "Novo Agendamento",
        message: "John Doe agendou para amanhã às 14h",
        timestamp: new Date().toISOString(),
        read: false,
      },
    ]);
  }),

  http.get(`${API_URL}/api/dashboard/stats/revenue`, async () => {
    return HttpResponse.json({
      period: "month",
      total: 15000,
      change: 10,
      data: [
        { date: "2024-12-01", revenue: 500, appointments: 10 },
        { date: "2024-12-02", revenue: 600, appointments: 12 },
      ],
    });
  }),
];

// ============================================================================
// Booking Handlers
// ============================================================================

const bookingHandlers = [
  http.get(`${API_URL}/api/units/:id/public`, async () => {
    return HttpResponse.json(mockUnitInfo);
  }),

  http.get(`${API_URL}/api/units/slug/:slug`, async () => {
    return HttpResponse.json(mockUnitInfo);
  }),

  http.get(`${API_URL}/api/units/:id/services`, async () => {
    return HttpResponse.json([mockService]);
  }),

  http.post(`${API_URL}/api/bookings/check-phone`, async () => {
    return HttpResponse.json({
      exists: false,
      clientName: null,
    });
  }),

  http.get(`${API_URL}/api/bookings/slots`, async () => {
    return HttpResponse.json({
      date: "2024-12-15",
      slots: [
        { id: "slot-1", time: "09:00", available: true },
        { id: "slot-2", time: "09:30", available: true },
        { id: "slot-3", time: "10:00", available: false },
        { id: "slot-4", time: "10:30", available: true },
      ],
    });
  }),

  http.post(`${API_URL}/api/bookings`, async () => {
    return HttpResponse.json(mockBooking);
  }),

  http.get(`${API_URL}/api/bookings/:id`, async ({ params }) => {
    return HttpResponse.json({ ...mockBooking, id: params.id });
  }),

  http.delete(`${API_URL}/api/bookings/:id`, async () => {
    return new HttpResponse(null, { status: 204 });
  }),
];

// ============================================================================
// OTP Handlers
// ============================================================================

const otpHandlers = [
  http.post(`${API_URL}/api/otp/send`, async () => {
    return HttpResponse.json({
      success: true,
      message: "OTP sent successfully",
      expiresIn: 300,
    });
  }),

  http.post(`${API_URL}/api/otp/verify`, async () => {
    return HttpResponse.json({
      success: true,
      isNewClient: true,
      clientId: null,
    });
  }),
];

// ============================================================================
// Client Handlers
// ============================================================================

const clientHandlers = [
  http.post(`${API_URL}/api/clients`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      clientId: "new-client-1",
      ...(body as object),
    });
  }),

  http.get(`${API_URL}/api/clients/by-phone`, async () => {
    return HttpResponse.json({
      clientId: "client-1",
      name: "John Doe",
      phone: "11999999999",
      email: "john@example.com",
    });
  }),
];

// ============================================================================
// Export All Handlers
// ============================================================================

export const handlers = [
  ...authHandlers,
  ...customerHandlers,
  ...serviceHandlers,
  ...dashboardHandlers,
  ...bookingHandlers,
  ...otpHandlers,
  ...clientHandlers,
];
