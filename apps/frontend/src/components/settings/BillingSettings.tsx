import { useState } from "react";
import { Check, CreditCard, Download, Sparkles, X, Crown, AlertTriangle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ManageSubscriptionModal } from "./ManageSubscriptionModal";
import { useApp } from "@/contexts/AppContext";

export const BillingSettings = () => {
  const { isPro, emptyStates } = useApp();
  const [showManageModal, setShowManageModal] = useState(false);
  
  const invoices = emptyStates.invoices
    ? []
    : [
        { id: "1", date: "01/12/2024", amount: "R$ 49,90", status: "Pago" },
        { id: "2", date: "01/11/2024", amount: "R$ 49,90", status: "Pago" },
        { id: "3", date: "01/10/2024", amount: "R$ 49,90", status: "Pago" },
      ];

  const blockedFeatures = [
    "Agendamentos limitados a 20/mês",
    "Secretário online desativado",
    "Apenas 1 unidade permitida",
    "Sem suporte prioritário",
    "Marca d'água nas confirmações",
  ];

  const proFeatures = [
    "Agendamentos ilimitados",
    "Secretário online ativo",
    "Múltiplas unidades",
    "Suporte prioritário",
    "Sem marca d'água",
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Cobrança e assinatura</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie seu plano e visualize suas faturas
        </p>
      </div>

      {!isPro ? (
        // FREE VERSION
        <div className="space-y-6">
          {/* Warning Card */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Você está no plano gratuito</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Você está perdendo recursos importantes que poderiam ajudar seu negócio a crescer.
                </p>
                <ul className="mt-4 space-y-2">
                  {blockedFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <X className="h-4 w-4 text-destructive flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Upgrade CTA Card */}
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-violet-500/10 border border-primary/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Desbloqueie todo o potencial do Belezeiro
                </h3>
                <p className="text-sm text-muted-foreground">
                  Assine o Pro e transforme seu negócio
                </p>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border/50">
              <div className="text-sm text-muted-foreground">
                A partir de <span className="text-lg font-bold text-foreground">R$ 49,90</span>/mês
              </div>
              <Button size="lg" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Assinar Pro agora
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // PRO VERSION
        <div className="space-y-6">
          {/* Plan Status Card */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">Plano Pro</h3>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Aproveite todos os recursos ilimitados
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {proFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/50">
              <div className="text-sm space-y-1">
                <div>
                  <span className="text-muted-foreground">Próxima cobrança:</span>
                  <span className="font-medium text-foreground ml-1">01/01/2025</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Método:</span>
                  <span className="font-medium text-foreground ml-1">Cartão •••• 4242</span>
                </div>
              </div>
              <Button variant="outline" onClick={() => setShowManageModal(true)}>
                <CreditCard className="h-4 w-4 mr-2" />
                Gerenciar assinatura
              </Button>
            </div>
          </div>

          {/* Invoices Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Faturas</h3>
            
            {invoices.length === 0 ? (
              <div className="bg-muted/30 rounded-lg border border-border p-8 text-center">
                <FileText className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                <h4 className="font-medium text-foreground mb-1">Nenhuma fatura ainda</h4>
                <p className="text-sm text-muted-foreground">
                  Suas faturas aparecerão aqui após o primeiro ciclo de cobrança.
                </p>
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg border border-border overflow-hidden">
                <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <span>Data</span>
                  <span>Valor</span>
                  <span>Status</span>
                  <span className="text-right">Ação</span>
                </div>
                
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="grid grid-cols-4 gap-4 p-4 border-t border-border items-center"
                  >
                    <span className="text-sm text-foreground">{invoice.date}</span>
                    <span className="text-sm font-medium text-foreground">{invoice.amount}</span>
                    <Badge variant="secondary" className="w-fit text-xs">
                      {invoice.status}
                    </Badge>
                    <div className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                        <Download className="h-3 w-3" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manage Subscription Modal */}
      <ManageSubscriptionModal 
        open={showManageModal} 
        onOpenChange={setShowManageModal} 
      />
    </div>
  );
};
