import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublicWatermarkProps {
  variant?: "banner" | "floating" | "inline" | "footer";
}

export const PublicWatermark = ({ variant = "banner" }: PublicWatermarkProps) => {
  const handleClick = () => {
    window.open("https://belezeiro.com.br/cadastro", "_blank");
  };

  if (variant === "banner") {
    return (
      <div className="bg-gradient-to-r from-primary/90 to-primary py-3 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-primary-foreground">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">
              Criado com <strong>Belezeiro</strong> — Crie sua página profissional gratuita!
            </span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleClick}
            className="gap-1.5 whitespace-nowrap"
          >
            Criar minha página
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    );
  }

  if (variant === "floating") {
    return (
      <div className="fixed bottom-20 left-4 z-40 max-w-[280px]">
        <div className="bg-card border border-border rounded-xl p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Quer uma página assim?
              </p>
              <p className="text-xs text-muted-foreground">
                Crie sua página profissional grátis com o Belezeiro!
              </p>
              <Button size="sm" onClick={handleClick} className="gap-1.5 w-full">
                Começar grátis
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6 my-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-semibold text-foreground">
              Gostou desta página?
            </h4>
            <p className="text-sm text-muted-foreground">
              Você também pode criar a sua página profissional gratuitamente com o Belezeiro!
            </p>
          </div>
          <Button onClick={handleClick} className="gap-2 whitespace-nowrap">
            Criar minha página grátis
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className="bg-muted/50 border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Esta página foi criada com o <strong className="text-primary">Belezeiro</strong>
          </p>
          <Button variant="outline" size="sm" onClick={handleClick} className="gap-1.5">
            Crie sua página profissional gratuita
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
