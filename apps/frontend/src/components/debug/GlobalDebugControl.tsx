import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Bug, Crown, User, ChevronUp, ChevronDown, Calendar, Users, FileText, Gift, Plus, Moon, Sun, LifeBuoy } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const GlobalDebugControl = () => {
  const { plan, setPlan, emptyStates, setEmptyState, toggleAllEmptyStates, publicDarkMode, setPublicDarkMode } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  const allEmpty = Object.values(emptyStates).every(Boolean);
  const someEmpty = Object.values(emptyStates).some(Boolean);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col bg-card/95 backdrop-blur-sm border border-border rounded-2xl shadow-lg overflow-hidden">
      {/* Expanded content */}
      {isExpanded && (
        <div className="p-3 space-y-4 border-b border-border">
          {/* Plan Selection */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground px-1 font-semibold">
              Plano
            </span>
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

          {/* Public Page Theme */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground px-1 font-semibold">
              Página Pública
            </span>
            <label className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer">
              <div className="flex items-center gap-2">
                {publicDarkMode ? (
                  <Moon className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                <span className="text-xs text-foreground">Modo escuro</span>
              </div>
              <Switch
                checked={publicDarkMode}
                onCheckedChange={setPublicDarkMode}
                className="scale-75"
              />
            </label>
          </div>

          {/* Empty States */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground px-1 font-semibold">
                Empty States
              </span>
              <button
                onClick={() => toggleAllEmptyStates(!allEmpty)}
                className="text-[10px] text-primary hover:underline"
              >
                {allEmpty ? "Desativar todos" : "Ativar todos"}
              </button>
            </div>
            <div className="space-y-2">
              <label className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-foreground">Faturas</span>
                </div>
                <Switch
                  checked={emptyStates.invoices}
                  onCheckedChange={(checked) => setEmptyState("invoices", checked)}
                  className="scale-75"
                />
              </label>
              <label className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-foreground">Agendamentos</span>
                </div>
                <Switch
                  checked={emptyStates.appointments}
                  onCheckedChange={(checked) => setEmptyState("appointments", checked)}
                  className="scale-75"
                />
              </label>
              <label className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-foreground">Clientes</span>
                </div>
                <Switch
                  checked={emptyStates.customers}
                  onCheckedChange={(checked) => setEmptyState("customers", checked)}
                  className="scale-75"
                />
              </label>
              <label className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Gift className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-foreground">Indicações</span>
                </div>
                <Switch
                  checked={emptyStates.referrals}
                  onCheckedChange={(checked) => setEmptyState("referrals", checked)}
                  className="scale-75"
                />
              </label>
              <label className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer">
                <div className="flex items-center gap-2">
                  <LifeBuoy className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-foreground">Tickets</span>
                </div>
                <Switch
                  checked={emptyStates.tickets}
                  onCheckedChange={(checked) => setEmptyState("tickets", checked)}
                  className="scale-75"
                />
              </label>
            </div>
          </div>

          {/* Referral Debug */}
          <div className="space-y-2">
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Indicações Debug
            </div>
            <label className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer">
              <div className="flex items-center gap-2">
                <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-foreground">Permitir novo link</span>
              </div>
              <Switch
                checked={emptyStates.allowNewReferralLink}
                onCheckedChange={(checked) => setEmptyState("allowNewReferralLink", checked)}
                className="scale-75"
              />
            </label>
          </div>
        </div>
      )}

      {/* Header / Toggle bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground">Debug</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Status indicators */}
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded font-medium",
                plan === "pro"
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {plan === "pro" ? "Pro" : "Free"}
            </span>
            {publicDarkMode && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-200 font-medium">
                Dark
              </span>
            )}
            {someEmpty && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 font-medium">
                Empty
              </span>
            )}
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>
    </div>
  );
};
