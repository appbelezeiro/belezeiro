// ============================================================================
// MSW SERVER - Mock Service Worker para testes
// ============================================================================

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Cria servidor MSW com handlers padrão
export const server = setupServer(...handlers);
