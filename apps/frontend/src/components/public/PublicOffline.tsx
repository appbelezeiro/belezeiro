import { Lock } from "lucide-react";

interface PublicOfflineProps {
  businessName: string;
}

export const PublicOffline = ({ businessName }: PublicOfflineProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <Lock className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Site Indisponível
        </h1>
        <p className="text-muted-foreground mb-6">
          O site de <strong>{businessName}</strong> está temporariamente fora do ar. 
          Por favor, tente novamente mais tarde.
        </p>
        <a 
          href="/"
          className="text-sm text-primary hover:underline"
        >
          Voltar para o início
        </a>
      </div>
    </div>
  );
};
