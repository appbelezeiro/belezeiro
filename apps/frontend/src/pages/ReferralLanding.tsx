import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/GoogleIcon";
import { Gift, Sparkles, ArrowRight, Crown, Check } from "lucide-react";

const ReferralLanding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref");
  
  // Mock: In production, fetch the referrer unit name from the refCode
  const referrerUnitName = "Studio Beleza & Arte";

  const handleGoogleLogin = () => {
    // After login, proceed to onboarding with the referral code
    navigate(`/onboarding?ref=${refCode}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      {/* Confetti-like decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 bg-primary/30 rounded-full animate-pulse" />
        <div className="absolute top-32 right-20 w-4 h-4 bg-secondary/40 rounded-full animate-pulse delay-100" />
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-primary/40 rounded-full animate-pulse delay-200" />
        <div className="absolute bottom-32 right-32 w-3 h-3 bg-secondary/30 rounded-full animate-pulse delay-300" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-12 shadow-2xl">
          {/* Gift Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
                <Gift className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Welcome Content */}
          <div className="text-center space-y-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Você foi{" "}
              <span className="text-primary">convidado!</span>
            </h1>
            
            <p className="text-muted-foreground text-lg leading-relaxed">
              <span className="font-semibold text-foreground">{referrerUnitName}</span>{" "}
              está te convidando para conhecer o Belezeiro.
            </p>
          </div>

          {/* Benefit Badge */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-muted-foreground">Seu presente de boas-vindas</p>
                <p className="text-xl font-bold text-primary">1 mês de Plano Pro grátis!</p>
              </div>
            </div>
          </div>

          {/* What you get */}
          <div className="mb-8 space-y-3">
            <p className="text-sm font-medium text-muted-foreground text-center">Com o Plano Pro você terá:</p>
            <div className="grid grid-cols-1 gap-2">
              {[
                "Agenda inteligente com confirmações automáticas",
                "Secretária Virtual com IA no WhatsApp",
                "Site profissional personalizado",
                "Relatórios e métricas do seu negócio",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Google Login Button */}
          <div className="space-y-4">
            <Button
              variant="google"
              size="lg"
              className="w-full h-14 text-base gap-3"
              onClick={handleGoogleLogin}
            >
              <GoogleIcon className="w-5 h-5" />
              Começar com Google
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Ao continuar, você concorda com nossos{" "}
              <a href="#" className="text-primary hover:underline underline-offset-4">
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a href="#" className="text-primary hover:underline underline-offset-4">
                Política de Privacidade
              </a>
            </p>
          </div>

          {/* Referral Code Display */}
          {refCode && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-center text-xs text-muted-foreground">
                Código de indicação: <span className="font-mono font-medium text-foreground">{refCode}</span>
              </p>
            </div>
          )}
        </div>

        {/* Back to Landing */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Conhecer o Belezeiro
          </button>
        </div>
      </div>
    </main>
  );
};

export default ReferralLanding;
