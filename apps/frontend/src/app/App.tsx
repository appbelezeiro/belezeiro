// ============================================================================
// APP - Componente principal da aplicação
// ============================================================================

import { AppProviders } from './providers';
import { AppRoutes } from './routes';
import { GlobalDebugControl } from '@/components/debug/GlobalDebugControl';

/**
 * Componente raiz da aplicação
 * Compõe providers e rotas
 */
export function App() {
  return (
    <AppProviders>
      <AppRoutes />
      <GlobalDebugControl />
    </AppProviders>
  );
}

export default App;
