import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/GoogleIcon";
import { Sparkles, Heart, ArrowRight } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");

  const handleGoogleLogin = () => {
    // After login, proceed to onboarding with the plan parameter if present
    if (plan) {
      navigate(`/onboarding?plan=${plan}`);
    } else {
      navigate("/onboarding");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-12 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <svg
                className="w-9 h-9 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
            </div>
          </div>

          {/* Welcome Content */}
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Heart className="w-4 h-4" />
              <span>Bem-vindo ao Belezeiro</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Estamos{" "}
              <span className="text-primary">felizes</span>{" "}
              em ter você conosco!
            </h1>
            
            <p className="text-muted-foreground text-lg leading-relaxed">
              Antes de configurar seu negócio, vamos criar sua conta. 
              É rápido e fácil com o Google.
            </p>
          </div>

          {/* Plan Badge */}
          {plan === "pro" && (
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Você está ativando o <span className="text-primary">Plano Pro</span>
                </span>
              </div>
            </div>
          )}

          {/* Google Login Button */}
          <div className="space-y-4">
            <Button
              variant="google"
              size="lg"
              className="w-full h-14 text-base gap-3"
              onClick={handleGoogleLogin}
            >
              <GoogleIcon className="w-5 h-5" />
              Continuar com Google
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

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground">O que vem a seguir</span>
            </div>
          </div>

          {/* Steps Preview */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { step: "1", label: "Seu negócio" },
              { step: "2", label: "Horários" },
              { step: "3", label: "Serviços" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-semibold text-muted-foreground">{item.step}</span>
                </div>
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Landing */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Voltar para o início
          </button>
        </div>
      </div>
    </main>
  );
};

export default Welcome;
