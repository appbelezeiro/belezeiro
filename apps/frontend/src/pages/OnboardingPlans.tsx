import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "/mês",
    description: "Para começar a organizar sua agenda",
    features: [
      { text: "1 unidade", included: true },
      { text: "Agenda básica", included: true },
      { text: "50 agendamentos/mês", included: true },
      { text: "Notificações por e-mail", included: true },
      { text: "Suporte por e-mail", included: true },
      { text: "Página pública", included: false },
      { text: "Secretário Online (IA)", included: false },
      { text: "Relatórios avançados", included: false },
    ],
    cta: "Escolher plano gratuito",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "R$ 49,90",
    period: "/mês",
    description: "Para profissionais que querem crescer",
    features: [
      { text: "Unidades ilimitadas", included: true },
      { text: "Agenda completa", included: true },
      { text: "Agendamentos ilimitados", included: true },
      { text: "Notificações no celular", included: true },
      { text: "Suporte prioritário", included: true },
      { text: "Página pública ativa", included: true },
      { text: "Secretário Online (IA)", included: true },
      { text: "Relatórios avançados", included: true },
    ],
    cta: "Assinar Pro",
    variant: "default" as const,
    popular: true,
  },
];

const OnboardingPlans = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSelectPlan = (isPopular: boolean) => {
    navigate("/onboarding/success");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="content-container py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/onboarding")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <span className="text-sm text-muted-foreground">Escolha seu plano</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="content-container py-8">
        <div className="space-y-8">
          {/* Intro */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Escolha o plano ideal para você
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Comece grátis e faça upgrade quando precisar de mais recursos
            </p>
          </div>

          {/* Plans Grid */}
          <div className={`gap-6 max-w-4xl mx-auto ${isMobile ? 'flex flex-col-reverse' : 'grid md:grid-cols-2'}`}>
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-card border rounded-2xl p-8 ${
                  plan.popular
                    ? "border-primary shadow-xl shadow-primary/10"
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground gap-1">
                    <Sparkles className="w-3 h-3" />
                    Mais popular
                  </Badge>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center">
                          <X className="w-3 h-3 text-muted-foreground" />
                        </div>
                      )}
                      <span
                        className={
                          feature.included ? "text-foreground" : "text-muted-foreground"
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.variant}
                  size="lg"
                  className="w-full"
                  onClick={() => handleSelectPlan(plan.popular)}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>

          {/* Footer text */}
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Você pode mudar de plano a qualquer momento.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingPlans;
