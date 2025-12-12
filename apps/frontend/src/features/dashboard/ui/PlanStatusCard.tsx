import { Card, CardContent } from "@/components/ui/card";
import { Crown, Sparkles, Calendar, CheckCircle2, X, ArrowRight, AlertTriangle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useUnit } from "@/contexts/UnitContext";
import { dashboardService } from "../api/dashboard.service";
import type { PlanInfo } from "../types";

const freeRestrictions = [
  "Limite de 30 agendamentos/mes",
  "Sem Secretaria Online",
  "Relatorios basicos apenas",
];

const proFeatures = [
  "Agendamentos ilimitados",
  "Secretaria Online 24h",
  "Relatorios avancados",
];

function PlanCardSkeleton() {
  return (
    <Card className="bg-card border border-border shadow-soft overflow-hidden">
      <div className="p-4 bg-muted animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-muted-foreground/20" />
          <div className="space-y-2">
            <div className="h-5 w-24 bg-muted-foreground/20 rounded" />
            <div className="h-3 w-32 bg-muted-foreground/20 rounded" />
          </div>
        </div>
      </div>
      <CardContent className="p-4 space-y-4">
        <div className="h-16 bg-muted rounded-xl animate-pulse" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
}

function isPlanPro(planInfo: PlanInfo): boolean {
  const planName = planInfo.plan.name.toLowerCase();
  return planName !== "free" && planName !== "gratuito";
}

export function PlanStatusCard() {
  const { selectedUnit } = useUnit();

  const {
    data: planInfo,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboard", "plan", selectedUnit?.id],
    queryFn: () => dashboardService.getPlanInfo(selectedUnit!.id),
    enabled: !!selectedUnit?.id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Loading state
  if (isLoading || !selectedUnit) {
    return <PlanCardSkeleton />;
  }

  // Error state or no plan - show free plan
  if (isError || !planInfo) {
    return (
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20 border border-red-200 dark:border-red-800/50 shadow-soft overflow-hidden">
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
                <span className="text-lg font-bold text-white">Plano Free</span>
                <Badge className="bg-white/20 text-white border-0 text-[10px]">Limitado</Badge>
              </div>
              <p className="text-xs text-white/80">Recursos restritos</p>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-red-700 dark:text-red-300 uppercase tracking-wider">
              Voce esta limitado a
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

          <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-md">
            <Crown className="w-4 h-4 mr-2" />
            Assinar o Pro agora
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isPro = isPlanPro(planInfo);
  const planName = planInfo.plan.name;
  const isActive = planInfo.plan.status === "active";
  const nextBillingDate = formatDate(planInfo.currentPeriodEnd);

  if (!isPro) {
    return (
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20 border border-red-200 dark:border-red-800/50 shadow-soft overflow-hidden">
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
                <span className="text-lg font-bold text-white">Plano {planName}</span>
                <Badge className="bg-white/20 text-white border-0 text-[10px]">Limitado</Badge>
              </div>
              <p className="text-xs text-white/80">Recursos restritos</p>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          <div className="p-3 rounded-xl bg-red-100/80 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50">
            <p className="text-sm font-medium text-red-800 dark:text-red-200 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              Sua concorrencia esta na frente!
            </p>
            <p className="text-xs text-red-700/80 dark:text-red-300/70 mt-1 ml-6">
              Profissionais Pro atendem 3x mais clientes por mes.
            </p>
          </div>

          {planInfo.usage && planInfo.limits.bookingsPerMonth && (
            <div className="p-3 rounded-xl bg-orange-100/80 dark:bg-orange-900/30">
              <p className="text-xs text-orange-700 dark:text-orange-300">
                Uso: {planInfo.usage.bookingsThisMonth} / {planInfo.limits.bookingsPerMonth} agendamentos este mes
              </p>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-medium text-red-700 dark:text-red-300 uppercase tracking-wider">
              Voce esta limitado a
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

          <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-md">
            <Crown className="w-4 h-4 mr-2" />
            Assinar o Pro agora
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <p className="text-center text-xs text-red-600/70 dark:text-red-400/60">
            Nao perca mais clientes. Teste gratis por 7 dias.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border border-border shadow-soft overflow-hidden plan-card-popular">
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
              <span className="text-lg font-bold text-primary-foreground">Plano {planName}</span>
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
        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
          <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Proxima mensalidade</p>
            <p className="text-sm font-medium text-foreground">{nextBillingDate}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Recursos ilimitados ativados
          </p>
          <ul className="space-y-2">
            {proFeatures.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center pt-2">
          <p className="text-sm font-medium text-primary flex items-center justify-center gap-1">
            <Sparkles className="h-4 w-4" />
            Desfrute!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
