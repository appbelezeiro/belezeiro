import { Calendar, Users, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { useUnit } from "@/contexts/UnitContext";
import { dashboardService } from "../api/dashboard.service";
import type { DashboardStats } from "../types";

interface KPIData {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ElementType;
}

function mapStatsToKPIData(stats: DashboardStats): KPIData[] {
  return [
    {
      label: "Agendamentos hoje",
      value: String(stats.appointmentsToday.value),
      change: stats.appointmentsToday.changeLabel,
      changeType: stats.appointmentsToday.change >= 0 ? "positive" : "negative",
      icon: Calendar,
    },
    {
      label: "Novos clientes",
      value: String(stats.newCustomers.value),
      change: stats.newCustomers.changeLabel,
      changeType: stats.newCustomers.change >= 0 ? "positive" : "negative",
      icon: Users,
    },
    {
      label: "Servico mais pedido",
      value: stats.topService.value || "N/A",
      change: stats.topService.changeLabel,
      changeType: "neutral",
      icon: TrendingUp,
    },
    {
      label: "Horario de pico",
      value: stats.peakHours.value || "N/A",
      change: stats.peakHours.changeLabel,
      changeType: "neutral",
      icon: Clock,
    },
  ];
}

function KPICardSkeleton() {
  return (
    <Card className="bg-card border border-border shadow-soft">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-7 w-16 bg-muted rounded animate-pulse" />
          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
          <div className="h-3 w-20 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export function KPICards() {
  const isMobile = useIsMobile();
  const { selectedUnit } = useUnit();

  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboard", "stats", selectedUnit?.id],
    queryFn: () => dashboardService.getStats(selectedUnit!.id),
    enabled: !!selectedUnit?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  const gridClass = `grid gap-4 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`;

  // Loading state
  if (isLoading || !selectedUnit) {
    return (
      <div className={gridClass}>
        {[...Array(4)].map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error state - show empty cards
  if (isError || !stats) {
    const emptyData: KPIData[] = [
      { label: "Agendamentos hoje", value: "0", icon: Calendar },
      { label: "Novos clientes", value: "0", icon: Users },
      { label: "Servico mais pedido", value: "N/A", icon: TrendingUp },
      { label: "Horario de pico", value: "N/A", icon: Clock },
    ];

    return (
      <div className={gridClass}>
        {emptyData.map((kpi) => (
          <Card
            key={kpi.label}
            className="bg-card border border-border shadow-soft hover:shadow-card transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                  <kpi.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpiData = mapStatsToKPIData(stats);

  return (
    <div className={gridClass}>
      {kpiData.map((kpi) => (
        <Card
          key={kpi.label}
          className="bg-card border border-border shadow-soft hover:shadow-card transition-shadow"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                <kpi.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              {kpi.change && (
                <p
                  className={`text-xs font-medium ${
                    kpi.changeType === "positive"
                      ? "text-emerald-600"
                      : kpi.changeType === "negative"
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {kpi.change}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
