import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useUnit } from "@/contexts/UnitContext";
import { dashboardService } from "../api/dashboard.service";
import type { RevenueStats } from "../types";

type RevenuePeriod = "day" | "week" | "month" | "year";

const periodLabels: Record<RevenuePeriod, string> = {
  day: "Hoje",
  week: "Esta semana",
  month: "Este mes",
  year: "Este ano",
};

function RevenueCardSkeleton() {
  return (
    <Card className="bg-card border border-border shadow-soft">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="h-5 w-24 bg-muted rounded animate-pulse" />
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-7 w-14 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-24 w-32 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

function MiniChart({ data }: { data: { amount: number }[] }) {
  if (data.length === 0) return null;

  const maxAmount = Math.max(...data.map((d) => d.amount), 1);
  const barWidth = Math.max(4, Math.floor(120 / data.length) - 2);

  return (
    <div className="flex items-end gap-1 h-24">
      {data.slice(-10).map((point, index) => (
        <div
          key={index}
          className="bg-primary/20 rounded-t transition-all hover:bg-primary/40"
          style={{
            width: `${barWidth}px`,
            height: `${Math.max(4, (point.amount / maxAmount) * 100)}%`,
          }}
        />
      ))}
    </div>
  );
}

export function RevenueStatsCard() {
  const { selectedUnit } = useUnit();
  const [period, setPeriod] = useState<RevenuePeriod>("month");

  const {
    data: revenueStats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboard", "revenue", selectedUnit?.id, period],
    queryFn: () => dashboardService.getRevenueStats(selectedUnit!.id, period),
    enabled: !!selectedUnit?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Loading state
  if (isLoading || !selectedUnit) {
    return <RevenueCardSkeleton />;
  }

  // Error or no data state
  if (isError || !revenueStats) {
    return (
      <Card className="bg-card border border-border shadow-soft">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Faturamento
            </CardTitle>
            <div className="flex gap-1">
              {(["day", "week", "month", "year"] as RevenuePeriod[]).map((p) => (
                <Button
                  key={p}
                  variant={period === p ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => setPeriod(p)}
                >
                  {periodLabels[p]}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex items-center justify-center h-24 text-muted-foreground">
            <p className="text-sm">Sem dados de faturamento</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositiveChange = revenueStats.change >= 0;

  return (
    <Card className="bg-card border border-border shadow-soft">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Faturamento
          </CardTitle>
          <div className="flex gap-1">
            {(["day", "week", "month", "year"] as RevenuePeriod[]).map((p) => (
              <Button
                key={p}
                variant={period === p ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setPeriod(p)}
              >
                {periodLabels[p]}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-foreground">
              {revenueStats.totalFormatted}
            </p>
            <div className="flex items-center gap-1 mt-1">
              {isPositiveChange ? (
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  isPositiveChange ? "text-emerald-600" : "text-destructive"
                )}
              >
                {revenueStats.changeLabel}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {periodLabels[period]}
            </div>
          </div>
          <MiniChart data={revenueStats.data} />
        </div>
      </CardContent>
    </Card>
  );
}
