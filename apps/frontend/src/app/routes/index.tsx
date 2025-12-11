// ============================================================================
// APP ROUTES - Configuração de rotas da aplicação
// ============================================================================

import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

// ============================================================================
// Lazy Loading de Páginas - Nova Arquitetura
// ============================================================================

// Auth Pages
const LoginPage = lazy(() => import('@/pages/login/LoginPage'));
const WelcomePage = lazy(() => import('@/pages/welcome/WelcomePage'));

// Public Pages
const LandingPage = lazy(() => import('@/pages/landing/LandingPage'));
const PublicUnitPage = lazy(() => import('@/pages/public-unit/PublicUnitPage'));
const PublicBookingPage = lazy(() => import('@/pages/public-booking/PublicBookingPage'));
const ReferralLandingPage = lazy(() => import('@/pages/referral-landing/ReferralLandingPage'));
const AboutUsPage = lazy(() => import('@/pages/about-us/AboutUsPage'));
const BlogPage = lazy(() => import('@/pages/blog/BlogPage'));
const ContactPage = lazy(() => import('@/pages/contact/ContactPage'));
const NotFoundPage = lazy(() => import('@/pages/not-found/NotFoundPage'));

// Protected Pages
const OnboardingPage = lazy(() => import('@/pages/onboarding/OnboardingPage'));
const OnboardingPlansPage = lazy(() => import('@/pages/onboarding/OnboardingPlansPage'));
const OnboardingSuccessPage = lazy(() => import('@/pages/onboarding/OnboardingSuccessPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const UnitSelectionPage = lazy(() => import('@/pages/unit-selection/UnitSelectionPage'));
const NewUnitPage = lazy(() => import('@/pages/new-unit/NewUnitPage'));
const AgendaPage = lazy(() => import('@/pages/agenda/AgendaPage'));
const CustomersPage = lazy(() => import('@/pages/customers/CustomersPage'));
const ServicesPage = lazy(() => import('@/pages/services/ServicesPage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const ReferralProgramPage = lazy(() => import('@/pages/referral-program/ReferralProgramPage'));
const HelpSupportPage = lazy(() => import('@/pages/help-support/HelpSupportPage'));

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
 *
 * Fluxo: pages → features → shared (components/lib)
 *
 * As páginas são simples containers que delegam para as features.
 * Cada feature tem tudo o que precisa: UI, hooks, services, types.
 */
export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* ============================================= */}
        {/* Public Routes (sem autenticação necessária)  */}
        {/* ============================================= */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/u/:slug" element={<PublicUnitPage />} />
        <Route path="/agendar" element={<PublicBookingPage />} />
        <Route path="/cadastro" element={<ReferralLandingPage />} />
        <Route path="/sobre" element={<AboutUsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contato" element={<ContactPage />} />

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
            <ProtectedRoute requireOnboarding={false}>
              <WelcomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute requireOnboarding={false}>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/plans"
          element={
            <ProtectedRoute requireOnboarding={false}>
              <OnboardingPlansPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/success"
          element={
            <ProtectedRoute requireOnboarding={false}>
              <OnboardingSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/selecionar-unidade"
          element={
            <ProtectedRoute>
              <UnitSelectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nova-unidade"
          element={
            <ProtectedRoute>
              <NewUnitPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agenda"
          element={
            <ProtectedRoute>
              <AgendaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <CustomersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicos"
          element={
            <ProtectedRoute>
              <ServicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuracoes"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/indicacao"
          element={
            <ProtectedRoute>
              <ReferralProgramPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ajuda-suporte"
          element={
            <ProtectedRoute>
              <HelpSupportPage />
            </ProtectedRoute>
          }
        />

        {/* ============================================= */}
        {/* 404 - Catch All                              */}
        {/* ============================================= */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

// Re-exports
export { ProtectedRoute } from './ProtectedRoute';
export { PublicRoute } from './PublicRoute';
