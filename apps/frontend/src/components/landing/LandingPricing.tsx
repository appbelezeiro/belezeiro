import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles } from "lucide-react";

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
    cta: "Começar grátis",
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

export function LandingPricing() {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Escolha o plano{" "}
            <span className="text-primary">ideal para você</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Comece grátis e evolua quando precisar. Sem surpresas, sem letras miúdas.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                onClick={() =>
                  navigate(
                    plan.popular ? "/bem-vindo?plan=pro" : "/bem-vindo"
                  )
                }
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            ✓ Sem necessidade de cartão de crédito &nbsp;&nbsp; 
            ✓ Cancele quando quiser &nbsp;&nbsp; 
            ✓ 7 dias de teste grátis do Pro
          </p>
        </div>
      </div>
    </section>
  );
}
