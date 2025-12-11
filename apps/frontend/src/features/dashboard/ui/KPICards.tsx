import { Calendar, Users, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface KPIData {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ElementType;
}

const kpiData: KPIData[] = [
  {
    label: "Agendamentos hoje",
    value: "12",
    change: "+3 vs ontem",
    changeType: "positive",
    icon: Calendar,
  },
  {
    label: "Novos clientes",
    value: "4",
    change: "+2 esta semana",
    changeType: "positive",
    icon: Users,
  },
  {
    label: "Serviço mais pedido",
    value: "Corte",
    change: "35% dos pedidos",
    changeType: "neutral",
    icon: TrendingUp,
  },
  {
    label: "Horário de pico",
    value: "14h-16h",
    change: "8 agendamentos",
    changeType: "neutral",
    icon: Clock,
  },
];

export function KPICards() {
  const isMobile = useIsMobile();

  return (
    <div className={`grid gap-4 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
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
