import { Card, CardContent } from "@/components/ui/card";
import { Crown, Sparkles, Calendar, CheckCircle2, X, ArrowRight, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePlan } from "@/contexts/AppContext";

const mockPlanData = {
  planName: "Pro",
  isActive: true,
  nextBillingDate: "15 de Janeiro",
  features: [
    "Agendamentos ilimitados",
    "Secretária Online 24h",
    "Relatórios avançados",
  ],
};

const freeRestrictions = [
  "Limite de 30 agendamentos/mês",
  "Sem Secretária Online",
  "Relatórios básicos apenas",
];

export const PlanStatusCard = () => {
  const { isPro } = usePlan();
  const { planName, isActive, nextBillingDate, features } = mockPlanData;

  if (!isPro) {
    return (
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20 border border-red-200 dark:border-red-800/50 shadow-soft overflow-hidden">
        {/* Warning Header */}
        <div className="relative p-4 bg-gradient-to-r from-red-500 to-orange-500">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 right-2">
              <AlertTriangle className="h-6 w-6 text-white/40" />
            </div>
          </div>
          
          <div className="relative flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">
                  Plano Free
                </span>
                <Badge className="bg-white/20 text-white border-0 text-[10px]">
                  Limitado
                </Badge>
              </div>
              <p className="text-xs text-white/80">Recursos restritos</p>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          {/* Warning message */}
          <div className="p-3 rounded-xl bg-red-100/80 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50">
            <p className="text-sm font-medium text-red-800 dark:text-red-200 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              Sua concorrência está na frente!
            </p>
            <p className="text-xs text-red-700/80 dark:text-red-300/70 mt-1 ml-6">
              Profissionais Pro atendem 3x mais clientes por mês.
            </p>
          </div>

          {/* Restrictions list */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-red-700 dark:text-red-300 uppercase tracking-wider">
              Você está limitado a
            </p>
            <ul className="space-y-2">
              {freeRestrictions.map((restriction, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-red-700/80 dark:text-red-300/70">
                  <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                  {restriction}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Button */}
          <Button 
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-md"
          >
            <Crown className="w-4 h-4 mr-2" />
            Assinar o Pro agora
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          {/* Urgency text */}
          <p className="text-center text-xs text-red-600/70 dark:text-red-400/60">
            Não perca mais clientes. Teste grátis por 7 dias.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border border-border shadow-soft overflow-hidden plan-card-popular">
      {/* Premium Header */}
      <div className="relative p-4 gradient-ocean">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 right-2">
            <Sparkles className="h-6 w-6 text-primary-foreground/40" />
          </div>
          <div className="absolute bottom-2 left-4">
            <Sparkles className="h-4 w-4 text-primary-foreground/30" />
          </div>
        </div>
        
        <div className="relative flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
            <Crown className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary-foreground">
                Plano {planName}
              </span>
              {isActive && (
                <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-[10px]">
                  Ativo
                </Badge>
              )}
            </div>
            <p className="text-xs text-primary-foreground/80">Recursos premium</p>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Next billing */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
          <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Próxima mensalidade</p>
            <p className="text-sm font-medium text-foreground">{nextBillingDate}</p>
          </div>
        </div>

        {/* Features list */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Recursos ilimitados ativados
          </p>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Enjoy message */}
        <div className="text-center pt-2">
          <p className="text-sm font-medium text-primary flex items-center justify-center gap-1">
            <Sparkles className="h-4 w-4" />
            Desfrute!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
