// ============================================================================
// MSW HANDLERS - Handlers padrão para testes
// ============================================================================

import { http, HttpResponse } from 'msw';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Dados mock
const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  avatar: 'https://example.com/avatar.jpg',
  role: 'OWNER',
  unitId: 'unit-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Handlers de autenticação
const authHandlers = [
  // POST /auth/login
  http.post(`${API_URL}/auth/login`, async () => {
    return HttpResponse.json({
      user: mockUser,
      message: 'Login successful',
    });
  }),

  // POST /auth/logout
  http.post(`${API_URL}/auth/logout`, async () => {
    return HttpResponse.json({
      message: 'Logged out successfully',
    });
  }),

  // POST /auth/refresh
  http.post(`${API_URL}/auth/refresh`, async () => {
    return HttpResponse.json({
      message: 'Token refreshed',
    });
  }),

  // GET /auth/me
  http.get(`${API_URL}/auth/me`, async () => {
    return HttpResponse.json({
      user: mockUser,
    });
  }),
];

// Handlers de clientes
const customerHandlers = [
  // GET /customers
  http.get(`${API_URL}/customers`, async () => {
    return HttpResponse.json({
      data: [
        {
          id: 'customer-1',
          name: 'John Doe',
          phone: '11999999999',
          email: 'john@example.com',
        },
      ],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
      },
    });
  }),
];

// Handlers de serviços
const serviceHandlers = [
  // GET /services
  http.get(`${API_URL}/services`, async () => {
    return HttpResponse.json({
      data: [
        {
          id: 'service-1',
          name: 'Corte de Cabelo',
          duration: 30,
          price: 50,
        },
      ],
    });
  }),
];

// Handlers de agendamentos
const bookingHandlers = [
  // GET /bookings
  http.get(`${API_URL}/bookings`, async () => {
    return HttpResponse.json({
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
      },
    });
  }),
];

// Exporta todos os handlers
export const handlers = [
  ...authHandlers,
  ...customerHandlers,
  ...serviceHandlers,
  ...bookingHandlers,
];
