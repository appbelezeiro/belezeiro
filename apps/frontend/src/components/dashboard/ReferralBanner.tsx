import { Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export const ReferralBanner = () => {
  const navigate = useNavigate();

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Gift className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Indique e Ganhe</h3>
            <p className="text-sm text-muted-foreground">
              Compartilhe seu link e ganhe 1 mês Pro por cada profissional inscrito
            </p>
          </div>
        </div>
        <Button 
          onClick={() => navigate("/indicacao")}
          className="shrink-0 gap-2"
        >
          Gerar meu link de indicação
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
