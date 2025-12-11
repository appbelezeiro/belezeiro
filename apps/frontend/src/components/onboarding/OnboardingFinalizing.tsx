import { useEffect, useState } from "react";
import { CheckCircle, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingFinalizingProps {
  currentStep: number;
  isComplete: boolean;
}

const steps = [
  { id: 1, message: "Criando seu negócio..." },
  { id: 2, message: "Criando sua unidade..." },
  { id: 3, message: "Configurando sua unidade..." },
  { id: 4, message: "Lançando as imagens para o infinito e além" },
];

export const OnboardingFinalizing = ({ currentStep, isComplete }: OnboardingFinalizingProps) => {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isComplete) {
      // Small delay before showing success message
      const timer = setTimeout(() => setShowSuccess(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {!showSuccess ? (
          <>
            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Quase lá...
              </h1>
              <p className="text-muted-foreground">
                Finalizando algumas coisas
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {steps.map((step) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border transition-all duration-300",
                      isActive && "border-primary bg-primary/5",
                      isCompleted && "border-primary/30 bg-primary/5",
                      !isActive && !isCompleted && "border-border opacity-50"
                    )}
                  >
                    {/* Icon */}
                    <div className="shrink-0">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : isActive ? (
                        <Loader2 className="h-5 w-5 text-primary animate-spin" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted" />
                      )}
                    </div>

                    {/* Message */}
                    <p
                      className={cn(
                        "text-sm font-medium transition-colors",
                        isActive && "text-foreground",
                        isCompleted && "text-muted-foreground line-through",
                        !isActive && !isCompleted && "text-muted-foreground"
                      )}
                    >
                      {step.message}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Success Message with Fade */
          <div
            className="space-y-6 animate-in fade-in duration-700"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mx-auto">
              <Sparkles className="h-12 w-12 text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">
                Tudo pronto! 🎉
              </h1>
              <p className="text-lg text-muted-foreground">
                Seu negócio está configurado e pronto para uso
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
