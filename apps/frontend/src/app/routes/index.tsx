// ============================================================================
// APP ROUTES - Configuração de rotas da aplicação
// ============================================================================

import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

// ============================================================================
// Lazy Loading de Páginas
// ============================================================================

// Auth
const LoginPage = lazy(() =>
  import('@/features/auth/components/LoginPage').then((m) => ({
    default: m.LoginPage,
  }))
);

// Public Pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const PublicUnit = lazy(() => import('@/pages/PublicUnit'));
const PublicBooking = lazy(() => import('@/pages/PublicBooking'));
const ReferralLanding = lazy(() => import('@/pages/ReferralLanding'));
const AboutUs = lazy(() => import('@/pages/AboutUs'));
const Blog = lazy(() => import('@/pages/Blog'));
const Contact = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Protected Pages
const Welcome = lazy(() => import('@/pages/Welcome'));
const Onboarding = lazy(() => import('@/pages/Onboarding'));
const OnboardingPlans = lazy(() => import('@/pages/OnboardingPlans'));
const OnboardingSuccess = lazy(() => import('@/pages/OnboardingSuccess'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const UnitSelection = lazy(() => import('@/pages/UnitSelection'));
const NewUnit = lazy(() => import('@/pages/NewUnit'));
const Agenda = lazy(() => import('@/pages/Agenda'));
const Customers = lazy(() => import('@/pages/Customers'));
const Services = lazy(() => import('@/pages/Services'));
const Settings = lazy(() => import('@/pages/Settings'));
const ReferralProgram = lazy(() => import('@/pages/ReferralProgram'));
const HelpSupport = lazy(() => import('@/pages/HelpSupport'));

// ============================================================================
// Fallback de Loading
// ============================================================================

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}

// ============================================================================
// Componente de Rotas
// ============================================================================

/**
 * Configuração de rotas da aplicação
 */
export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* ============================================= */}
        {/* Public Routes (sem autenticação necessária)  */}
        {/* ============================================= */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/u/:slug" element={<PublicUnit />} />
        <Route path="/agendar" element={<PublicBooking />} />
        <Route path="/cadastro" element={<ReferralLanding />} />
        <Route path="/sobre" element={<AboutUs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contato" element={<Contact />} />

        {/* ============================================= */}
        {/* Auth Routes (apenas não autenticados)        */}
        {/* ============================================= */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* ============================================= */}
        {/* Protected Routes (requer autenticação)       */}
        {/* ============================================= */}
        <Route
          path="/bem-vindo"
          element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/plans"
          element={
            <ProtectedRoute>
              <OnboardingPlans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/success"
          element={
            <ProtectedRoute>
              <OnboardingSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/selecionar-unidade"
          element={
            <ProtectedRoute>
              <UnitSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nova-unidade"
          element={
            <ProtectedRoute>
              <NewUnit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agenda"
          element={
            <ProtectedRoute>
              <Agenda />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicos"
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuracoes"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/indicacao"
          element={
            <ProtectedRoute>
              <ReferralProgram />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ajuda-suporte"
          element={
            <ProtectedRoute>
              <HelpSupport />
            </ProtectedRoute>
          }
        />

        {/* ============================================= */}
        {/* 404 - Catch All                              */}
        {/* ============================================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

// Re-exports
export { ProtectedRoute } from './ProtectedRoute';
export { PublicRoute } from './PublicRoute';
