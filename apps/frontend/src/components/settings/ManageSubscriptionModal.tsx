import { CreditCard, AlertTriangle, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface ManageSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManageSubscriptionModal = ({ open, onOpenChange }: ManageSubscriptionModalProps) => {
  const { toast } = useToast();

  const handleAddPaymentMethod = () => {
    toast({
      title: "Em breve",
      description: "A funcionalidade de adicionar método de pagamento estará disponível em breve.",
    });
  };

  const handleCancelSubscription = () => {
    toast({
      title: "Cancelamento solicitado",
      description: "Você receberá um email de confirmação em breve.",
      variant: "destructive",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Gerenciar Assinatura</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Subscription Summary */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              📋 Resumo da Assinatura
            </h4>
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plano</span>
                <span className="font-medium text-foreground">Pro</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor</span>
                <span className="font-medium text-foreground">R$ 49,90/mês</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Próxima cobrança</span>
                <span className="font-medium text-foreground">01/01/2025</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Método</span>
                <span className="font-medium text-foreground">Cartão •••• 4242</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Method */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              💳 Método de Pagamento
            </h4>
            
            <div className="border border-primary/30 bg-primary/5 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Cartão de Crédito •••• 4242</p>
                    <p className="text-xs text-muted-foreground">Visa · Expira 12/26</p>
                  </div>
                </div>
                <Check className="h-5 w-5 text-primary" />
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleAddPaymentMethod}
            >
              + Adicionar novo método de pagamento
            </Button>
          </div>

          <Separator />

          {/* Cancel Subscription */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Cancelar Assinatura
            </h4>
            
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                Ao cancelar, você manterá acesso aos recursos Pro até{" "}
                <span className="font-medium text-foreground">01/01/2025</span>. 
                Após essa data, sua conta voltará ao plano gratuito.
              </p>
            </div>

            <Button 
              variant="destructive" 
              size="sm"
              className="w-full"
              onClick={handleCancelSubscription}
            >
              Cancelar minha assinatura
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
