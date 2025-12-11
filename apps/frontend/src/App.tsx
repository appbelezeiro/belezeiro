import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppProvider } from "@/contexts/AppContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { GlobalDebugControl } from "@/components/debug/GlobalDebugControl";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { ToastFeedbackModule } from "@/shared/lib/toast";
import LandingPage from "./pages/LandingPage";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import OnboardingPlans from "./pages/OnboardingPlans";
import OnboardingSuccess from "./pages/OnboardingSuccess";
import Dashboard from "./pages/Dashboard";
import UnitSelection from "./pages/UnitSelection";
import NewUnit from "./pages/NewUnit";
import Agenda from "./pages/Agenda";
import Customers from "./pages/Customers";
import Services from "./pages/Services";
import Settings from "./pages/Settings";
import PublicUnit from "./pages/PublicUnit";
import PublicBooking from "./pages/PublicBooking";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import ReferralProgram from "./pages/ReferralProgram";
import ReferralLanding from "./pages/ReferralLanding";
import HelpSupport from "./pages/HelpSupport";

const queryClient = new QueryClient();

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ToastFeedbackModule />
            <BrowserRouter>
              <AuthProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />

                  {/* Protected Routes (require authentication) */}
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
                    path="/indicacao"
                    element={
                      <ProtectedRoute>
                        <ReferralProgram />
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
                    path="/ajuda-suporte"
                    element={
                      <ProtectedRoute>
                        <HelpSupport />
                      </ProtectedRoute>
                    }
                  />

                  {/* Public Routes (no authentication required) */}
                  <Route path="/u/:slug" element={<PublicUnit />} />
                  <Route path="/agendar" element={<PublicBooking />} />
                  <Route path="/cadastro" element={<ReferralLanding />} />
                  <Route path="/sobre" element={<AboutUs />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/contato" element={<Contact />} />

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <GlobalDebugControl />
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AppProvider>
    </GoogleOAuthProvider>
  </QueryClientProvider>
);

export default App;
