// ============================================================================
// APP PROVIDERS - Composição de todos os providers da aplicação
// ============================================================================

import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryProvider } from './QueryProvider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AppProvider } from '@/contexts/AppContext';

interface AppProvidersProps {
  children: ReactNode;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

/**
 * Composição de todos os providers da aplicação
 * Ordem importa! Os providers mais externos são renderizados primeiro.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AppProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>{children}</BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </AppProvider>
      </GoogleOAuthProvider>
    </QueryProvider>
  );
}
