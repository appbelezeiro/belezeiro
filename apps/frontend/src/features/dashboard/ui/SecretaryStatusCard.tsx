import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Users, Calendar, CheckCircle2, Lock, ArrowRight, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useUnit } from "@/contexts/UnitContext";
import { dashboardService } from "../api/dashboard.service";
import type { SecretaryInfo } from "../types";

type SecretaryStatus = "active" | "inactive" | "busy" | "offline";

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  dotColor: string;
}

const statusConfigs: Record<SecretaryStatus, StatusConfig> = {
  active: {
    label: "Online",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    dotColor: "bg-emerald-500",
  },
  busy: {
    label: "Operando",
    color: "text-primary",
    bgColor: "bg-primary/10",
    dotColor: "bg-primary",
  },
  inactive: {
    label: "Inativo",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    dotColor: "bg-muted-foreground",
  },
  offline: {
    label: "Offline",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    dotColor: "bg-muted-foreground",
  },
};

function SecretaryCardSkeleton() {
  return (
    <Card className="bg-card border border-border shadow-soft overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
            <div className="h-4 w-28 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-5 w-8 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function SecretaryStatusCard() {
  const { selectedUnit } = useUnit();

  const {
    data: secretaryInfo,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboard", "secretary"],
    queryFn: () => dashboardService.getSecretaryInfo(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Loading state
  if (isLoading || !selectedUnit) {
    return <SecretaryCardSkeleton />;
  }

  // Error state or not enabled - show locked state
  if (isError || !secretaryInfo || !secretaryInfo.enabled) {
    return (
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20 border border-orange-200 dark:border-orange-800/50 shadow-soft overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-orange-800 dark:text-orange-200 flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-200/50 dark:bg-orange-800/30">
                <Bot className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              Secretaria Online
            </CardTitle>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-200/60 dark:bg-orange-800/40 text-orange-700 dark:text-orange-300">
              <Lock className="w-3 h-3" />
              Bloqueado
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          <div className="p-4 rounded-xl bg-orange-100/80 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800/50">
            <p className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-1">
              Voce esta perdendo clientes!
            </p>
            <p className="text-xs text-orange-700/80 dark:text-orange-300/70">
              Enquanto voce dorme, a Secretaria Online poderia estar agendando clientes automaticamente 24 horas por dia.
            </p>
          </div>

          <div className="space-y-2 opacity-60">
            <div className="flex items-center justify-between p-3 rounded-xl bg-orange-100/50 dark:bg-orange-900/20">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-500/70" />
                <span className="text-xs text-orange-700/70 dark:text-orange-300/60">Clientes perdidos</span>
              </div>
              <span className="text-sm font-bold text-orange-600/70 dark:text-orange-400/60">+12</span>
            </div>
          </div>

          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-md" size="sm">
            Ativar Secretaria Online
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  const status = (secretaryInfo.status as SecretaryStatus) || "active";
  const statusConfig = statusConfigs[status] || statusConfigs.active;

  return (
    <Card className="bg-card border border-border shadow-soft overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-br from-sky-soft to-background">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            Secretaria Online
          </CardTitle>
          <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", statusConfig.bgColor, statusConfig.color)}>
            <span className={cn("w-2 h-2 rounded-full animate-pulse", statusConfig.dotColor)} />
            {statusConfig.label}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-2">
        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Mensagens hoje</span>
          </div>
          <span className="text-sm font-bold text-foreground">{secretaryInfo.stats.messagesHandled}</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Agendamentos feitos</span>
          </div>
          <span className="text-sm font-bold text-foreground">{secretaryInfo.stats.appointmentsScheduled}</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Perguntas respondidas</span>
          </div>
          <span className="text-sm font-bold text-foreground">{secretaryInfo.stats.questionsAnswered}</span>
        </div>
      </CardContent>
    </Card>
  );
}
