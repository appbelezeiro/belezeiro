// ============================================================================
// TEST UTILS - Utilitários para testes
// ============================================================================

import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';

/**
 * Cria um QueryClient para testes
 * Configurado para não fazer retry em testes
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface WrapperProps {
  children: ReactNode;
}

/**
 * Cria um wrapper com todos os providers necessários para testes
 */
export function createWrapper(queryClient?: QueryClient) {
  const client = queryClient ?? createTestQueryClient();

  return function Wrapper({ children }: WrapperProps) {
    return (
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <TooltipProvider>{children}</TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
  };
}

/**
 * Custom render que inclui todos os providers
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    queryClient?: QueryClient;
  }
) {
  const { queryClient, ...renderOptions } = options ?? {};

  return render(ui, {
    wrapper: createWrapper(queryClient),
    ...renderOptions,
  });
}

// Re-exporta tudo do testing-library
export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';

// Substitui o render padrão pelo customizado
export { customRender as render };
