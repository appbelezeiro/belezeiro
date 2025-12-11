import { useApp } from "@/contexts/AppContext";
import { Bug, UserPlus, Building2, LayoutDashboard, Crown, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const FlowDebugControl = () => {
  const { flow, setFlow, plan, setPlan } = useApp();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 bg-card/95 backdrop-blur-sm border border-border rounded-2xl p-3 shadow-lg">
      <div className="flex items-center gap-2 px-1 text-muted-foreground border-b border-border pb-2 mb-1">
        <Bug className="w-4 h-4" />
        <span className="text-xs font-semibold">Debug Mode</span>
      </div>
      
      {/* Flow Selection */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground px-1">Fluxo</span>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setFlow("cadastro")}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left",
              flow === "cadastro"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Cadastro
          </button>
          <button
            onClick={() => setFlow("multiplas-unidades")}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left",
              flow === "multiplas-unidades"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Building2 className="w-3.5 h-3.5" />
            Múltiplas Unidades
          </button>
          <button
            onClick={() => setFlow("dashboard")}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left",
              flow === "dashboard"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="space-y-1.5 pt-2 border-t border-border">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground px-1">Plano</span>
        <div className="flex rounded-lg bg-secondary/80 p-0.5">
          <button
            onClick={() => setPlan("free")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              plan === "free"
                ? "bg-muted-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <User className="w-3 h-3" />
            Free
          </button>
          <button
            onClick={() => setPlan("pro")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              plan === "pro"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Crown className="w-3 h-3" />
            Pro
          </button>
        </div>
      </div>
    </div>
  );
};
