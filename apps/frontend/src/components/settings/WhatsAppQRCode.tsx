import { QrCode, Smartphone, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WhatsAppQRCodeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: () => void;
}

export const WhatsAppQRCode = ({ open, onOpenChange, onConnect }: WhatsAppQRCodeProps) => {
  const handleSimulateConnection = () => {
    onConnect();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            Conectar WhatsApp
          </DialogTitle>
          <DialogDescription>
            Escaneie o QR Code com seu WhatsApp para vincular
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* QR Code Placeholder */}
          <div className="flex justify-center">
            <div className="w-56 h-56 bg-muted/50 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3">
              <QrCode className="h-24 w-24 text-muted-foreground/50" />
              <span className="text-xs text-muted-foreground">QR Code Placeholder</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-medium text-foreground">Como conectar:</h4>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Abra o WhatsApp no seu celular</li>
              <li>Toque em Menu (⋮) ou Configurações</li>
              <li>Selecione "Aparelhos conectados"</li>
              <li>Toque em "Conectar um aparelho"</li>
              <li>Aponte a câmera para o QR Code</li>
            </ol>
          </div>

          {/* Loading State */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Aguardando conexão...</span>
          </div>

          {/* Debug Button */}
          <div className="pt-2 border-t border-border">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleSimulateConnection}
            >
              🔧 Simular conexão (debug)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
